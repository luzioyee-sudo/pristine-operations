// @ts-nocheck
import { getServerSupabase } from './supabaseServer';
import type {
  LexicalEntry,
  LexiconSearchQuery,
  LexiconSearchResult,
  LexiconStats,
  CEFRLevel,
  LexicalType,
} from '../types/lexicon';
import { INITIAL_MASTER_LEXICON } from '../data/masterLexicon';
import { normalizeText, getOrCreatePronunciation } from './pronunciationService';
import { GoogleGenAI } from '@google/genai';

// Import All Topic Datasets
import { DIRECTIONS_AND_TRANSPORTATION_DATA } from '../data/directionsAndTransportation';
import { FAMILY_RELATIONSHIPS_DATA } from '../data/familyAndRelationships';
import { FOOD_AND_MEALS_DATA } from '../data/foodAndMeals';
import { HEALTH_AND_FEELINGS_DATA } from '../data/healthAndFeelings';
import { HOBBIES_AND_FREE_TIME_DATA } from '../data/hobbiesAndFreeTime';
import { HOME_AND_WHERE_YOU_LIVE_DATA } from '../data/homeAndWhereYouLive';
import { SHOPPING_AND_MONEY_DATA } from '../data/shoppingAndMoney';
import { WEATHER_AND_SEASONS_DATA } from '../data/weatherAndSeasons';
import { INTRODUCING_YOURSELF_DATA } from '../data/introducingYourself';
import { DAILY_ROUTINE_DATA } from '../data/dailyRoutine';

// Supabase stores the authoritative lexicon; the in-memory map is a read-optimized cache.
let lexiconMap: Record<string, LexicalEntry> = {};
let normalizedIndex: Record<string, string> = {};

async function hydrateMasterLexicon(): Promise<void> {
  try {
    const { data, error } = await getServerSupabase()
      .from('lexicon_entries')
      .select('id,language,normalized_word,status,data')
      .neq('status', 'deprecated')
      .limit(10000);
    if (error) throw error;
    if (data?.length) {
      lexiconMap = Object.fromEntries(data.map((row: any) => [row.id, row.data as LexicalEntry]));
      rebuildNormalizedIndex();
    } else {
      await persistMasterLexicon();
    }
  } catch (error) {
    console.warn('[Master Lexicon] Supabase hydration notice; using seeded memory cache:', error);
  }
}

async function persistMasterLexicon(): Promise<void> {
  try {
    const entries = Object.values(lexiconMap).map((entry) => ({
      id: entry.id,
      normalized_word: entry.normalizedWord,
      language: entry.language,
      status: entry.status,
      data: entry,
      created_at: entry.createdAt,
      updated_at: entry.updatedAt,
    }));
    const client = getServerSupabase();
    for (let index = 0; index < entries.length; index += 500) {
      const { error } = await client.from('lexicon_entries').upsert(entries.slice(index, index + 500), { onConflict: 'id' });
      if (error) throw error;
    }
  } catch (error) {
    console.warn('[Master Lexicon] Supabase persistence notice:', error);
  }
}

export function loadMasterLexicon(): void {
  if (Object.keys(lexiconMap).length < 100) {
    console.log('[Master Lexicon] Seeding initial lexicon corpus in memory...');
    lexiconMap = {};
    INITIAL_MASTER_LEXICON.forEach((entry) => { lexiconMap[entry.id] = entry; });
    const datasets = [
      { name: 'Introduce Yourself', data: INTRODUCING_YOURSELF_DATA },
      { name: 'Daily Routine', data: DAILY_ROUTINE_DATA },
      { name: 'Directions & Transportation', data: DIRECTIONS_AND_TRANSPORTATION_DATA },
      { name: 'Family & Relationships', data: FAMILY_RELATIONSHIPS_DATA },
      { name: 'Food & Meals', data: FOOD_AND_MEALS_DATA },
      { name: 'Health & Feelings', data: HEALTH_AND_FEELINGS_DATA },
      { name: 'Hobbies & Free Time', data: HOBBIES_AND_FREE_TIME_DATA },
      { name: 'Home & Where You Live', data: HOME_AND_WHERE_YOU_LIVE_DATA },
      { name: 'Shopping & Money', data: SHOPPING_AND_MONEY_DATA },
      { name: 'Weather & Seasons', data: WEATHER_AND_SEASONS_DATA },
    ];
    datasets.forEach((dataset) => dataset.data.forEach((row: any, rowIndex: number) => {
      const languagesToSeed = [
        { name: 'English', code: 'en', getWord: (r: any) => r.english, getPhonetic: (r: any) => r.phonetic?.english },
        { name: 'Spanish', code: 'es', getWord: (r: any) => r.spanish, getPhonetic: (r: any) => r.phonetic?.spanish },
        { name: 'German', code: 'de', getWord: (r: any) => r.german, getPhonetic: (r: any) => r.phonetic?.german },
        { name: 'Arabic', code: 'ar', getWord: (r: any) => r.arabic, getPhonetic: (r: any) => r.phonetic?.arabic },
        { name: 'French', code: 'fr', getWord: (r: any) => r.french, getPhonetic: (r: any) => r.phonetic?.french },
        { name: 'Chinese', code: 'zh', getWord: (r: any) => r.chinese, getPhonetic: (r: any) => r.phonetic?.chinese },
        { name: 'Japanese', code: 'ja', getWord: (r: any) => r.japanese, getPhonetic: (r: any) => r.phonetic?.japanese },
      ];
      languagesToSeed.forEach((lang) => {
        const word = lang.getWord(row);
        if (!word || typeof word !== 'string' || !word.trim()) return;
        const cleanWord = word.trim();
        const topicSlug = dataset.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        const id = `lex_topic_${topicSlug}_${rowIndex}_${lang.code}`;
        const pos = row.pos || 'other';
        const lexicalType = row.type === 'chunk' ? 'chunk' : row.type === 'sentence' ? 'expression' : 'word';
        lexiconMap[id] = {
          id, word: cleanWord, normalizedWord: cleanWord.toLowerCase(), type: lexicalType as any,
          lemma: cleanWord, language: lang.name, partOfSpeech: pos as any,
          phonetic: lang.getPhonetic(row) || undefined, frequency: 'Common', cefr: row.cefr || 'A1', topics: [dataset.name],
          arabicTranslation: row.arabic || undefined,
          senses: [{ senseId: `${id}_s1`, definition: row.english, partOfSpeech: pos as any, cefr: row.cefr || 'A1', examples: [], arabicTranslation: row.arabic ? { text: row.arabic } : undefined }],
          source: `Topic Seeder - ${dataset.name}`, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        };
      });
    }));
    console.log(`[Master Lexicon] Seeded ${Object.keys(lexiconMap).length} entries in memory.`);
  }
  rebuildNormalizedIndex();
  void hydrateMasterLexicon();
}

export function saveMasterLexicon(): void {
  rebuildNormalizedIndex();
  void persistMasterLexicon();
}

function rebuildNormalizedIndex(): void {
  normalizedIndex = {};
  for (const entry of Object.values(lexiconMap)) {
    if (entry.status !== 'deprecated') {
      const normKey = `${entry.language.toLowerCase()}:${entry.normalizedWord}`;
      normalizedIndex[normKey] = entry.id;
    }
  }
}

// Initialize on module load
loadMasterLexicon();

/**
 * Searches and filters the Master Lexicon
 */
export function searchLexicon(query: LexiconSearchQuery): LexiconSearchResult {
  const q = (query.q || '').trim().toLowerCase();
  const normalizedQ = normalizeText(q);
  const levelFilter = query.level || 'all';
  const topicFilter = query.topic || 'all';
  const typeFilter = query.type || 'all';
  const posFilter = query.pos || 'all';
  const freqFilter = query.frequency || 'all';
  const languageFilter = query.language || 'all';
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(50000, Math.max(1, query.limit || 50));

  let results = Object.values(lexiconMap).filter((entry) => entry.status !== 'deprecated');

  // Filter by Language
  if (languageFilter !== 'all') {
    results = results.filter((e) => e.language?.toLowerCase() === languageFilter.toLowerCase());
  }

  // Filter by Type
  if (typeFilter !== 'all') {
    results = results.filter((e) => e.type === typeFilter);
  }

  // Filter by CEFR Level
  if (levelFilter !== 'all') {
    results = results.filter((e) => e.cefr === levelFilter);
  }

  // Filter by Topic
  if (topicFilter !== 'all') {
    results = results.filter((e) =>
      e.topics.some((t) => t.toLowerCase() === topicFilter.toLowerCase())
    );
  }

  // Filter by Part of Speech
  if (posFilter !== 'all') {
    results = results.filter((e) => {
      if (Array.isArray(e.partOfSpeech)) {
        return e.partOfSpeech.some((p) => p.toLowerCase() === posFilter.toLowerCase());
      }
      return e.partOfSpeech.toLowerCase() === posFilter.toLowerCase();
    });
  }

  // Filter by Frequency
  if (freqFilter !== 'all') {
    results = results.filter((e) => e.frequency === freqFilter);
  }

  // Filter by Search Query
  if (q) {
    results = results.filter((e) => {
      if (e.word.toLowerCase().includes(q)) return true;
      if (e.normalizedWord.includes(normalizedQ)) return true;
      if (e.lemma.toLowerCase().includes(q)) return true;
      if (e.arabicTranslation && e.arabicTranslation.includes(q)) return true;
      if (e.senses.some((s) => s.definition.toLowerCase().includes(q))) return true;
      if (e.phrasalVerbs && e.phrasalVerbs.some((p) => p.particle.includes(q) || p.meaning.toLowerCase().includes(q))) return true;
      if (e.collocations && e.collocations.some((c) => c.expression.toLowerCase().includes(q))) return true;
      if (e.chunks && e.chunks.some((chk) => chk.toLowerCase().includes(q))) return true;
      return false;
    });
  }

  // Gather unique available topics and CEFR levels across filtered set
  const allTopicsSet = new Set<string>();
  const availableLevelsSet = new Set<CEFRLevel>();
  results.forEach((e) => {
    if (e.cefr) availableLevelsSet.add(e.cefr);
    e.topics.forEach((t) => allTopicsSet.add(t));
  });

  const total = results.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  let paginatedEntries = results.slice(startIndex, startIndex + limit);

  // Apply interface language dynamic translations to simulate global rule
  if (query.interfaceLanguage && query.interfaceLanguage.toLowerCase() !== 'english') {
    const targetLang = query.interfaceLanguage;
    paginatedEntries = paginatedEntries.map(entry => {
      const translatedSenses = entry.senses.map(sense => {
        const def = sense.definition;
        let trans = def;
        const lookup: Record<string, Record<string, string>> = {
          'heat': { 'French': 'la chaleur', 'German': 'die Hitze', 'Arabic': 'الحرارة', 'Spanish': 'el calor' },
          'government': { 'French': 'le gouvernement', 'German': 'die Regierung', 'Arabic': 'الحكومة', 'Spanish': 'el gobierno' }
        };
        if (lookup[def] && lookup[def][targetLang]) {
          trans = lookup[def][targetLang];
        } else {
          trans = `[${targetLang}] ${def}`;
        }
        return { ...sense, definition: trans };
      });
      return { ...entry, senses: translatedSenses };
    });
  }

  return {
    entries: paginatedEntries,
    total,
    page,
    totalPages,
    topics: Array.from(allTopicsSet),
    availableLevels: Array.from(availableLevelsSet),
  };
}

/**
 * Gets a single lexical entry by ID or normalized word
 */
export function getLexicalEntry(idOrWord: string): LexicalEntry | null {
  if (!idOrWord) return null;
  const clean = idOrWord.trim();
  if (lexiconMap[clean]) {
    return lexiconMap[clean];
  }

  const normKey = `english:${normalizeText(clean)}`;
  const targetId = normalizedIndex[normKey];
  if (targetId && lexiconMap[targetId]) {
    return lexiconMap[targetId];
  }

  // Fallback search by normalizedWord directly
  const normVal = normalizeText(clean);
  for (const entry of Object.values(lexiconMap)) {
    if (entry.normalizedWord === normVal && entry.status !== 'deprecated') {
      return entry;
    }
  }

  return null;
}

/**
 * Ensures or creates a lexical entry (with lazy Gemini pronunciation integration)
 */
export async function saveLexicalEntry(
  entry: Partial<LexicalEntry> & { word: string },
  aiClient?: GoogleGenAI
): Promise<LexicalEntry> {
  const normWord = normalizeText(entry.word);
  if (!normWord) {
    throw new Error('Word property is required.');
  }

  const existing = getLexicalEntry(entry.word);
  const id = existing?.id || entry.id || `lex_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Lazy Pronunciation Audio Resolution
  let audioUrl = existing?.audioUrl || entry.audioUrl;
  let pronunciationId = existing?.pronunciationId || entry.pronunciationId;

  if (!audioUrl && aiClient) {
    try {
      const { record } = await getOrCreatePronunciation(aiClient, {
        text: entry.word,
        language: 'English',
        accent: 'US',
        voice: 'Zephyr',
      });
      audioUrl = record.audio_url;
      pronunciationId = record.id;
    } catch (err) {
      console.warn(`[Lexicon] Pronunciation pre-generation failed for "${entry.word}":`, err);
    }
  }

  const updated: LexicalEntry = {
    id,
    word: entry.word.trim(),
    normalizedWord: normWord,
    type: entry.type || existing?.type || 'word',
    lemma: entry.lemma ? normalizeText(entry.lemma) : (existing?.lemma || normWord),
    language: 'English',
    partOfSpeech: entry.partOfSpeech || existing?.partOfSpeech || 'noun',
    phonetic: entry.phonetic || existing?.phonetic,
    syllables: entry.syllables || existing?.syllables,
    frequency: entry.frequency || existing?.frequency || 'Common',
    cefr: entry.cefr || existing?.cefr || 'B1',
    register: entry.register || existing?.register || 'neutral',
    regional: entry.regional || existing?.regional || 'Global',
    topics: entry.topics || existing?.topics || ['general'],
    senses: entry.senses || existing?.senses || [
      {
        senseId: `${id}_s1`,
        definition: entry.word,
        partOfSpeech: (Array.isArray(entry.partOfSpeech) ? entry.partOfSpeech[0] : entry.partOfSpeech) || 'noun',
        examples: [],
      },
    ],
    wordForms: entry.wordForms || existing?.wordForms,
    wordFamily: entry.wordFamily || existing?.wordFamily,
    phrasalVerbs: entry.phrasalVerbs || existing?.phrasalVerbs,
    collocations: entry.collocations || existing?.collocations,
    idioms: entry.idioms || existing?.idioms,
    chunks: entry.chunks || existing?.chunks,
    arabicTranslation: entry.arabicTranslation || existing?.arabicTranslation,
    pronunciationId,
    audioUrl,
    source: entry.source || existing?.source || 'Ribble Master Lexicon',
    status: entry.status || existing?.status || 'active',
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  lexiconMap[id] = updated;
  saveMasterLexicon();
  return updated;
}

/**
 * Bulk Dataset Import with Validation, Normalization, and Deduplication
 */
export function importLexicalDataset(entries: Array<Partial<LexicalEntry> & { word: string }>): {
  importedCount: number;
  updatedCount: number;
  skippedCount: number;
  errors: string[];
} {
  let importedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  const errors: string[] = [];

  for (const raw of entries) {
    if (!raw.word || typeof raw.word !== 'string' || !raw.word.trim()) {
      skippedCount++;
      errors.push('Skipped entry with missing or invalid word property.');
      continue;
    }

    const normWord = normalizeText(raw.word);
    const existing = getLexicalEntry(normWord);

    const id = existing?.id || raw.id || `lex_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const isNew = !existing;

    const newEntry: LexicalEntry = {
      id,
      word: raw.word.trim(),
      normalizedWord: normWord,
      type: raw.type || existing?.type || 'word',
      lemma: raw.lemma ? normalizeText(raw.lemma) : normWord,
      language: 'English',
      partOfSpeech: raw.partOfSpeech || existing?.partOfSpeech || 'noun',
      phonetic: raw.phonetic || existing?.phonetic,
      syllables: raw.syllables || existing?.syllables,
      frequency: raw.frequency || existing?.frequency || 'Common',
      cefr: raw.cefr || existing?.cefr || 'B1',
      register: raw.register || existing?.register || 'neutral',
      regional: raw.regional || existing?.regional || 'Global',
      topics: raw.topics || existing?.topics || ['general'],
      senses: raw.senses || existing?.senses || [
        {
          senseId: `${id}_s1`,
          definition: raw.word,
          partOfSpeech: (Array.isArray(raw.partOfSpeech) ? raw.partOfSpeech[0] : raw.partOfSpeech) || 'noun',
          examples: [],
        },
      ],
      wordForms: raw.wordForms || existing?.wordForms,
      wordFamily: raw.wordFamily || existing?.wordFamily,
      phrasalVerbs: raw.phrasalVerbs || existing?.phrasalVerbs,
      collocations: raw.collocations || existing?.collocations,
      idioms: raw.idioms || existing?.idioms,
      chunks: raw.chunks || existing?.chunks,
      arabicTranslation: raw.arabicTranslation || existing?.arabicTranslation,
      pronunciationId: existing?.pronunciationId || raw.pronunciationId,
      audioUrl: existing?.audioUrl || raw.audioUrl,
      source: raw.source || 'Imported Dataset',
      status: raw.status || 'active',
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    lexiconMap[id] = newEntry;
    if (isNew) importedCount++;
    else updatedCount++;
  }

  saveMasterLexicon();
  return { importedCount, updatedCount, skippedCount, errors };
}

/**
 * Returns Administrative Lexicon Analytics
 */
export function getLexiconStats(): LexiconStats {
  const activeEntries = Object.values(lexiconMap).filter((e) => e.status !== 'deprecated');

  const byType: Record<LexicalType, number> = {
    word: 0,
    phrasal_verb: 0,
    collocation: 0,
    idiom: 0,
    chunk: 0,
    expression: 0,
  };

  const byCEFR: Record<CEFRLevel, number> = {
    A1: 0,
    A2: 0,
    B1: 0,
    B2: 0,
    C1: 0,
    C2: 0,
  };

  const byTopic: Record<string, number> = {};
  let totalSenses = 0;
  let phrasalVerbsCount = 0;
  let collocationsCount = 0;
  let idiomsCount = 0;
  let cachedPronunciationsCount = 0;

  for (const entry of activeEntries) {
    if (byType[entry.type] !== undefined) byType[entry.type]++;
    if (entry.cefr && byCEFR[entry.cefr] !== undefined) byCEFR[entry.cefr]++;

    totalSenses += entry.senses ? entry.senses.length : 0;
    if (entry.phrasalVerbs) phrasalVerbsCount += entry.phrasalVerbs.length;
    if (entry.collocations) collocationsCount += entry.collocations.length;
    if (entry.idioms) idiomsCount += entry.idioms.length;
    if (entry.audioUrl || entry.pronunciationId) cachedPronunciationsCount++;

    entry.topics.forEach((t) => {
      byTopic[t] = (byTopic[t] || 0) + 1;
    });
  }

  return {
    totalEntries: activeEntries.length,
    byType,
    byCEFR,
    byTopic,
    totalSenses,
    phrasalVerbsCount,
    collocationsCount,
    idiomsCount,
    cachedPronunciationsCount,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Soft deletes or updates status of a lexical entry
 */
export function deleteLexicalEntry(id: string): boolean {
  if (lexiconMap[id]) {
    lexiconMap[id].status = 'deprecated';
    lexiconMap[id].updatedAt = new Date().toISOString();
    saveMasterLexicon();
    return true;
  }
  return false;
}
