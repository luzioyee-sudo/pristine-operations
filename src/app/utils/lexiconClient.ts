// @ts-nocheck
import {
  LexicalEntry,
  LexiconSearchQuery,
  LexiconSearchResult,
  LexiconStats,
} from '../types/lexicon';
import { VocabularyItem } from '../types';
import { getCardTranslation } from './cardTranslations';

export async function fetchLexiconSearch(
  query: LexiconSearchQuery = {}
): Promise<LexiconSearchResult> {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.language) params.set('language', query.language);
  if (query.interfaceLanguage) params.set('interfaceLanguage', query.interfaceLanguage);
  if (query.level) params.set('level', query.level);
  if (query.topic) params.set('topic', query.topic);
  if (query.type) params.set('type', query.type);
  if (query.pos) params.set('pos', query.pos);
  if (query.frequency) params.set('frequency', query.frequency);
  if (query.limit) params.set('limit', String(query.limit));
  if (query.page) params.set('page', String(query.page));

  const res = await fetch(`/api/lexicon/search?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to search master lexicon');
  }
  return res.json();
}

export async function fetchLexicalEntry(idOrWord: string): Promise<LexicalEntry> {
  const res = await fetch(`/api/lexicon/entry/${encodeURIComponent(idOrWord)}`);
  if (!res.ok) {
    throw new Error(`Lexical entry not found for "${idOrWord}"`);
  }
  return res.json();
}

export async function saveLexicalEntryApi(entry: Partial<LexicalEntry> & { word: string }): Promise<LexicalEntry> {
  const res = await fetch('/api/lexicon/entry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to save lexical entry');
  }
  return res.json();
}

export async function importLexiconDatasetApi(entries: Array<Partial<LexicalEntry> & { word: string }>): Promise<{
  importedCount: number;
  updatedCount: number;
  skippedCount: number;
  errors: string[];
}> {
  const res = await fetch('/api/lexicon/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entries }),
  });
  if (!res.ok) {
    throw new Error('Failed to import lexicon dataset');
  }
  return res.json();
}

export async function fetchLexiconStatsApi(): Promise<LexiconStats> {
  const res = await fetch('/api/lexicon/stats');
  if (!res.ok) {
    throw new Error('Failed to fetch lexicon stats');
  }
  return res.json();
}

/**
 * Converts a canonical Master LexicalEntry into a user-specific VocabularyItem for flashcards / SRS
 */
export function convertLexicalEntryToUserCard(
  entry: LexicalEntry,
  targetDeckId?: string,
  contextSentenceOverride?: string,
  interfaceLanguage?: string
): VocabularyItem {
  const primarySense = entry.senses && entry.senses.length > 0 ? entry.senses[0] : null;
  const primaryExample = primarySense && primarySense.examples && primarySense.examples.length > 0 ? primarySense.examples[0] : null;

  const translation = getCardTranslation(entry, interfaceLanguage);

  const posStr = Array.isArray(entry.partOfSpeech) ? entry.partOfSpeech.join(', ') : entry.partOfSpeech;

  return {
    id: `user_vocab_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    word: entry.word,
    phonetic: entry.phonetic || '',
    translation,
    definition: primarySense?.definition || entry.word,
    partOfSpeech: posStr || 'noun',
    grammarNote: `Lemma: ${entry.lemma} • CEFR: ${entry.cefr} • Frequency: ${entry.frequency}`,
    contextSentence: contextSentenceOverride || primaryExample?.source || `Example for "${entry.word}"`,
    deckId: targetDeckId,
    language: 'en',
    dateAdded: Date.now(),
    tags: [entry.type, entry.cefr, ...entry.topics],
    srs: {
      state: 'new',
      learningStepIndex: 0,
      intervalDays: 0,
      easeFactor: 2.5,
      repetitions: 0,
      lapses: 0,
      dueAt: Date.now(),
    },
  };
}
