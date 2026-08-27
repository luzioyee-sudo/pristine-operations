// @ts-nocheck
import { GoogleGenAI } from '@google/genai';
import { resolveVoiceSpec, VOICE_CONFIG } from '../config/voiceConfig';

export interface PronunciationRecord {
  id: string;
  composite_key: string;
  normalized_text: string;
  original_text: string;
  language: string;
  accent: string;
  voice: 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir';
  version: string;
  provider: string;
  provider_model: string;
  storage_path: string;
  audio_url: string;
  audio_format: string;
  audio_base64?: string;
  duration?: number;
  status: 'pending' | 'generating' | 'ready' | 'failed';
  error_message?: string;
  hit_count: number;
  created_at: string;
  updated_at: string;
}

export interface PronunciationStats {
  total_assets: number;
  cache_hits: number;
  cache_misses: number;
  gemini_generations: number;
  failed_generations: number;
  estimated_tokens_saved: number;
  last_updated: string;
}

// Audio is kept in an in-memory store (plus the base64 payload on the record) so
// the service runs on any platform, including serverless/edge runtimes with no disk.
const audioStore = new Map<string, string>();

import { getServerSupabase } from './supabaseServer';

function ensureStorageDirs() {
  /* no-op: audio is cached in memory, not on disk */
}

let dbIndex: Record<string, PronunciationRecord> = {};
let statsData: PronunciationStats = {
  total_assets: 0,
  cache_hits: 0,
  cache_misses: 0,
  gemini_generations: 0,
  failed_generations: 0,
  estimated_tokens_saved: 0,
  last_updated: new Date().toISOString(),
};
const inFlightGenerations = new Map<string, Promise<PronunciationRecord>>();

async function hydratePronunciationDb(): Promise<void> {
  try {
    const { data, error } = await getServerSupabase().from('pronunciation_records').select('id,composite_key,status,hit_count,data').limit(10000);
    if (error) throw error;
    dbIndex = Object.fromEntries((data || []).map((row: any) => [row.composite_key, row.data as PronunciationRecord]));
    statsData.total_assets = Object.keys(dbIndex).length;
  } catch (error) {
    console.warn('[Pronunciation DB] Supabase hydration notice:', error);
  }
}

async function persistPronunciationDb(): Promise<void> {
  try {
    const rows = Object.values(dbIndex).map((record) => ({
      id: record.id,
      composite_key: record.composite_key,
      status: record.status,
      hit_count: record.hit_count || 0,
      data: record,
      created_at: record.created_at,
      updated_at: record.updated_at,
    }));
    const client = getServerSupabase();
    for (let index = 0; index < rows.length; index += 500) {
      const { error } = await client.from('pronunciation_records').upsert(rows.slice(index, index + 500), { onConflict: 'id' });
      if (error) throw error;
    }
  } catch (error) {
    console.warn('[Pronunciation DB] Supabase persistence notice:', error);
  }
}

export function loadPronunciationDb(): void {
  ensureStorageDirs();
  void hydratePronunciationDb();
}

export function savePronunciationDb(): void {
  statsData.total_assets = Object.keys(dbIndex).length;
  statsData.last_updated = new Date().toISOString();
  void persistPronunciationDb();
}

loadPronunciationDb();

/**
 * Normalizes text for canonical pronunciation lookup
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

/**
 * Constructs deterministic composite cache key
 */
export function getCompositeKey(
  normalizedText: string,
  language: string,
  accent: string,
  voice: string,
  version: string = VOICE_CONFIG.version
): string {
  return `${language.toLowerCase().trim()}:${accent.toLowerCase().trim()}:${voice.toLowerCase().trim()}:${version}:${normalizedText}`;
}

/**
 * Main Service Method: Gets cached pronunciation or generates via Gemini
 */
export async function getOrCreatePronunciation(
  ai: GoogleGenAI,
  params: {
    text: string;
    language?: string;
    accent?: string;
    voice?: string;
    version?: string;
    promptStyle?: string;
  }
): Promise<{ record: PronunciationRecord; cached: boolean }> {
  const originalText = params.text.trim();
  if (!originalText) {
    throw new Error('Text parameter is required.');
  }

  const normalized = normalizeText(originalText);
  const voiceSpec = resolveVoiceSpec(params.language, params.accent, params.voice);
  const version = params.version || VOICE_CONFIG.version;
  const compositeKey = getCompositeKey(normalized, voiceSpec.language, voiceSpec.accent, voiceSpec.voice, version);

  // STEP 1: Check existing record in Database Index
  const existingRecord = dbIndex[compositeKey];
  if (existingRecord && existingRecord.status === 'ready') {
    // STEP 2: Verify audio file actually exists on storage disk
    if (existingRecord.audio_base64 || audioStore.has(existingRecord.storage_path)) {
      // Valid cache hit!
      existingRecord.hit_count = (existingRecord.hit_count || 0) + 1;
      existingRecord.updated_at = new Date().toISOString();
      statsData.cache_hits++;
      statsData.estimated_tokens_saved += 25;
      savePronunciationDb();

      // Read audio binary from storage
      let audioBase64 = existingRecord.audio_base64;
      if (!audioBase64) {
        audioBase64 = audioStore.get(existingRecord.storage_path);
      }

      console.log(`[Pronunciation Cache HIT] Key="${compositeKey}" HitCount=${existingRecord.hit_count}`);
      return {
        record: {
          ...existingRecord,
          audio_base64: audioBase64,
        },
        cached: true,
      };
    } else {
      console.warn(`[Pronunciation Cache Missing File] Storage file missing at "${existingRecord.storage_path}", regenerating...`);
      delete dbIndex[compositeKey];
      savePronunciationDb();
    }
  }

  // STEP 3: Concurrency Protection — Check if generation for this exact key is already in progress
  if (inFlightGenerations.has(compositeKey)) {
    console.log(`[Pronunciation Concurrency Lock] Waiting for in-flight generation for key="${compositeKey}"`);
    const record = await inFlightGenerations.get(compositeKey)!;
    return { record, cached: true };
  }

  // STEP 4: Start Gemini Generation with Promise lock
  const generationPromise = (async (): Promise<PronunciationRecord> => {
    statsData.cache_misses++;
    console.log(`[Pronunciation Cache MISS] Generating with Gemini for key="${compositeKey}"`);

    // Mark pending in dbIndex
    const id = `pron_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const langFolder = voiceSpec.language.toLowerCase().replace(/[^a-z0-9]/g, '_');

    const filename = `${normalized.replace(/[^a-z0-9_]/gi, '_')}_${voiceSpec.voice}_${version}.pcm`;
    const storagePath = `${langFolder}/${filename}`;

    let styleInstruction = voiceSpec.language.toLowerCase() === 'auto'
      ? `First, automatically detect the language of the following text. Then, say the text clearly and naturally with perfect native pronunciation in that detected language: `
      : `Say clearly and naturally in ${voiceSpec.language}: `;

    if (params.promptStyle === 'slow') {
      styleInstruction = voiceSpec.language.toLowerCase() === 'auto'
        ? `First, automatically detect the language of the following text. Then, say the text slowly, clearly, and with educational articulation for a language student in that detected language: `
        : `Say slowly, clearly, and with educational articulation for a language student in ${voiceSpec.language}: `;
    } else if (params.promptStyle === 'cheerful') {
      styleInstruction = voiceSpec.language.toLowerCase() === 'auto'
        ? `First, automatically detect the language of the following text. Then, say the text cheerfully, warmly, and encouragingly in that detected language: `
        : `Say cheerfully, warmly, and encouragingly in ${voiceSpec.language}: `;
    } else if (params.promptStyle === 'native') {
      styleInstruction = voiceSpec.language.toLowerCase() === 'auto'
        ? `First, automatically detect the language of the following text. Then, say the text with authentic native accent and perfect pronunciation in that detected language: `
        : `Say with authentic native accent and perfect pronunciation in ${voiceSpec.language}: `;
    }

    let base64Audio: string | undefined;
    let mimeType = 'audio/pcm;rate=24000';
    let lastError: any = null;
    let usedModel = VOICE_CONFIG.provider_model;
    const candidateTtsModels = ['gemini-3.1-flash-tts-preview'];

    for (const model of candidateTtsModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ parts: [{ text: `${styleInstruction}${originalText}` }] }],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voiceSpec.voice },
              },
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            base64Audio = part.inlineData.data;
            mimeType = part.inlineData.mimeType || mimeType;
            usedModel = model;
            break;
          }
        }

        if (base64Audio) {
          console.log(`[Pronunciation Service] Successfully generated Gemini TTS audio with model "${model}" for "${originalText}"`);
          break;
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!base64Audio) {
      statsData.failed_generations++;
      savePronunciationDb();

      // Return a non-throwing fallback record to allow client-side native Web Speech Synthesis
      const fallbackRecord: PronunciationRecord = {
        id,
        composite_key: compositeKey,
        normalized_text: normalized,
        original_text: originalText,
        language: voiceSpec.language,
        accent: voiceSpec.accent,
        voice: voiceSpec.voice,
        version,
        provider: 'webspeech_fallback',
        provider_model: 'browser-native',
        storage_path: '',
        audio_url: '',
        audio_format: 'webspeech',
        audio_base64: undefined,
        status: 'failed',
        error_message: lastError?.message || 'Gemini TTS unavailable or quota reached. Web Speech fallback activated.',
        hit_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return fallbackRecord;
    }

    try {
      // Keep the audio in the in-memory cache (portable across runtimes)
      audioStore.set(storagePath, base64Audio);

      const audioUrl = `/api/pronunciation/audio/${id}`;
      const record: PronunciationRecord = {
        id,
        composite_key: compositeKey,
        normalized_text: normalized,
        original_text: originalText,
        language: voiceSpec.language,
        accent: voiceSpec.accent,
        voice: voiceSpec.voice,
        version,
        provider: VOICE_CONFIG.provider,
        provider_model: usedModel,
        storage_path: storagePath,
        audio_url: audioUrl,
        audio_format: mimeType,
        audio_base64: base64Audio,
        status: 'ready',
        hit_count: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Store in DB index
      dbIndex[compositeKey] = record;
      statsData.gemini_generations++;
      savePronunciationDb();

      return record;
    } catch (err: any) {
      statsData.failed_generations++;
      savePronunciationDb();
      console.error(`[Pronunciation Storage Error] Failed saving audio file for key="${compositeKey}":`, err?.message || err);
      throw new Error(`Failed to save pronunciation audio file: ${err?.message || String(err)}`);
    } finally {
      inFlightGenerations.delete(compositeKey);
    }
  })();

  inFlightGenerations.set(compositeKey, generationPromise);

  try {
    const record = await generationPromise;
    const isFallback = record.status === 'failed' || !record.audio_base64;
    return { record, cached: !isFallback && record.hit_count > 1 };
  } catch (err) {
    console.error(`[Pronunciation Service Catch] Handled error for key="${compositeKey}":`, err);
    return {
      record: {
        id: `pron_fail_${Date.now()}`,
        composite_key: compositeKey,
        normalized_text: normalized,
        original_text: originalText,
        language: voiceSpec.language,
        accent: voiceSpec.accent,
        voice: voiceSpec.voice,
        version,
        provider: 'webspeech_fallback',
        provider_model: 'browser-native',
        storage_path: '',
        audio_url: '',
        audio_format: 'webspeech',
        status: 'failed',
        hit_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      cached: false,
    };
  }
}

/**
 * Retrieves a record by ID for direct audio streaming
 */
export function getPronunciationById(id: string): PronunciationRecord | null {
  for (const record of Object.values(dbIndex)) {
    if (record.id === id) {
      return record;
    }
  }
  return null;
}

/**
 * Returns administrative stats and records
 */
export function getPronunciationStats() {
  const records = Object.values(dbIndex);
  const totalGenerations = statsData.cache_hits + statsData.cache_misses;
  const hitRatePct = totalGenerations > 0 ? Math.round((statsData.cache_hits / totalGenerations) * 100) : 100;

  return {
    stats: {
      ...statsData,
      hit_rate_pct: hitRatePct,
    },
    records: records.map(r => ({
      id: r.id,
      original_text: r.original_text,
      normalized_text: r.normalized_text,
      language: r.language,
      accent: r.accent,
      voice: r.voice,
      version: r.version,
      hit_count: r.hit_count,
      created_at: r.created_at,
      audio_url: r.audio_url,
      status: r.status,
    })),
  };
}

/**
 * Deletes a pronunciation record and its associated audio file from storage
 */
export function deletePronunciationRecord(id: string): boolean {
  let targetKey: string | null = null;
  for (const [key, record] of Object.entries(dbIndex)) {
    if (record.id === id) {
      targetKey = key;
      audioStore.delete(record.storage_path);
      break;
    }
  }

  if (targetKey) {
    delete dbIndex[targetKey];
    savePronunciationDb();
    return true;
  }
  return false;
}
