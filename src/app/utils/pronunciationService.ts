// @ts-nocheck
import { playPcmAudio, playTTS, stopActiveSpeech } from './tts';

export interface PronunciationOptions {
  text: string;
  language?: string;
  accent?: string;
  voice?: 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir';
  version?: string;
  promptStyle?: 'normal' | 'slow' | 'cheerful' | 'native';
  preferEngine?: 'gemini' | 'native';
}

export interface PronunciationResponse {
  id: string;
  text: string;
  normalizedText: string;
  language: string;
  accent: string;
  voice: string;
  version: string;
  audioUrl: string;
  audio?: string;
  mimeType: string;
  cached: boolean;
  hitCount?: number;
}

export interface PronunciationAdminStats {
  stats: {
    total_assets: number;
    cache_hits: number;
    cache_misses: number;
    gemini_generations: number;
    failed_generations: number;
    estimated_tokens_saved: number;
    hit_rate_pct: number;
    last_updated: string;
  };
  records: Array<{
    id: string;
    original_text: string;
    normalized_text: string;
    language: string;
    accent: string;
    voice: string;
    version: string;
    hit_count: number;
    created_at: string;
    audio_url: string;
    status: string;
  }>;
}

// Client-side session memory cache to avoid repeated network calls within same page view
const clientCache = new Map<string, PronunciationResponse>();

/**
 * Client-side text normalization helper
 */
export function normalizeClientText(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

/**
 * Gets or fetches shared pronunciation from Ribble Pronunciation Service
 */
export const getPronunciation = async (
  options: PronunciationOptions
): Promise<PronunciationResponse | null> => {
  const text = (options.text || '').trim();
  if (!text) return null;

  const normalized = normalizeClientText(text);
  const lang = options.language || 'English';
  const accent = options.accent || 'US';
  const voice = options.voice || 'Zephyr';
  const version = options.version || 'v1';

  const clientKey = `${lang.toLowerCase()}:${accent.toLowerCase()}:${voice.toLowerCase()}:${version}:${normalized}`;

  // STEP 1: Client session cache hit
  if (clientCache.has(clientKey)) {
    return {
      ...clientCache.get(clientKey)!,
      cached: true,
    };
  }

  // STEP 2: Call centralized server pronunciation API
  try {
    const res = await fetch('/api/pronunciation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        language: lang,
        accent,
        voice,
        version,
        promptStyle: options.promptStyle,
      }),
    });

    if (res.ok) {
      const data: PronunciationResponse = await res.json();
      if (data && (data.audio || data.audioUrl)) {
        clientCache.set(clientKey, data);
        return data;
      }
    }
  } catch (err) {
    console.warn('[Pronunciation Service] Client fetch failed, falling back:', err);
  }

  return null;
};

/**
 * Plays shared pronunciation audio with automatic cache-first resolution
 */
export const playPronunciation = async (
  text: string,
  options?: Omit<PronunciationOptions, 'text'>,
  onStart?: () => void,
  onEnd?: () => void
): Promise<boolean> => {
  if (!text || !text.trim()) {
    if (onEnd) onEnd();
    return false;
  }

  stopActiveSpeech();

  const data = await getPronunciation({
    text,
    ...options,
  });

  if (data && data.audio) {
    return playPcmAudio(data.audio, 24000, onStart, onEnd);
  }

  // Graceful fallback to native Web Speech Synthesis if Gemini TTS is offline or quota-exceeded
  playTTS(text, options?.language || 'English', onStart, onEnd, {
    preferEngine: 'native',
    promptStyle: options?.promptStyle,
  });
  return true;
};

/**
 * Admin: Fetches pronunciation cache observability stats
 */
export const fetchPronunciationAdminStats = async (): Promise<PronunciationAdminStats | null> => {
  try {
    const res = await fetch('/api/pronunciation/stats');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch pronunciation stats:', err);
  }
  return null;
};

/**
 * Admin: Deletes a cached pronunciation record
 */
export const deletePronunciationAsset = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/pronunciation/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      // Clear client cache as well
      clientCache.clear();
      return true;
    }
  } catch (err) {
    console.error('Failed to delete pronunciation asset:', err);
  }
  return false;
};
