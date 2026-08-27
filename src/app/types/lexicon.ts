// @ts-nocheck
export type LexicalType = 'word' | 'phrasal_verb' | 'collocation' | 'idiom' | 'chunk' | 'expression';

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'determiner'
  | 'interjection'
  | 'auxiliary'
  | 'modal'
  | 'numeral'
  | 'particle'
  | 'article'
  | 'phrase'
  | 'other';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type RegisterType =
  | 'neutral'
  | 'formal'
  | 'informal'
  | 'colloquial'
  | 'academic'
  | 'technical'
  | 'literary'
  | 'slang'
  | 'archaic';

export type FrequencyType = 'Very common' | 'Common' | 'Less common' | 'Rare';

export type RegionalType = 'US' | 'UK' | 'Global' | 'CA' | 'AU';

export interface LexicalExample {
  id?: string;
  source: string; // English example sentence
  targetArabic?: string; // Optional Arabic translation
  context?: string; // Usage context note
}

export interface LexicalSense {
  senseId: string;
  definition: string; // Canonical English definition
  partOfSpeech: PartOfSpeech;
  cefr?: CEFRLevel;
  register?: RegisterType;
  examples: LexicalExample[];
  arabicTranslation?: {
    text: string;
    definition?: string;
    example?: string;
  };
  synonyms?: string[];
  antonyms?: string[];
  relatedPhrases?: string[];
}

export interface WordForms {
  lemma: string; // Canonical lemma root (e.g. 'run')
  inflections?: {
    plural?: string;
    pastSimple?: string;
    pastParticiple?: string;
    presentParticiple?: string;
    thirdPersonSingular?: string;
    comparative?: string;
    superlative?: string;
  };
  derivatives?: Array<{
    word: string;
    pos: PartOfSpeech;
    meaning?: string;
  }>;
}

export interface PhrasalVerbDetails {
  baseVerb: string; // e.g. 'look'
  particle: string; // e.g. 'forward to'
  separable?: boolean | 'optional' | 'always' | 'never';
  meaning: string;
  example: string;
  cefr?: CEFRLevel;
}

export interface CollocationDetails {
  pattern: string; // e.g. 'verb + noun', 'adjective + noun', 'adverb + adjective'
  expression: string; // e.g. 'make a decision'
  example: string;
}

export interface LexicalEntry {
  id: string;
  word: string; // Display text (e.g. 'remarkable')
  normalizedWord: string; // Lowercase, NFC canonical search key (e.g. 'remarkable')
  type: LexicalType;
  lemma: string; // Canonical root (e.g. 'remarkable' or 'run')
  language: 'English' | 'Spanish' | 'German' | 'Arabic' | 'French' | string;
  partOfSpeech: PartOfSpeech | PartOfSpeech[];
  phonetic?: string;
  syllables?: string[] | number;
  frequency: FrequencyType;
  cefr: CEFRLevel;
  register?: RegisterType;
  regional?: RegionalType;
  topics: string[];
  senses: LexicalSense[];
  wordForms?: WordForms;
  wordFamily?: string[]; // Array of related normalized words or entry IDs
  phrasalVerbs?: PhrasalVerbDetails[];
  collocations?: CollocationDetails[];
  idioms?: string[];
  chunks?: string[];
  arabicTranslation?: string; // Primary Arabic translation string
  pronunciationId?: string;
  audioUrl?: string;
  source: string; // Traceability: e.g. 'Ribble English Corpus 2026'
  status: 'active' | 'draft' | 'deprecated';
  createdAt: string;
  updatedAt: string;
}

export interface LexiconSearchQuery {
  q?: string;
  language?: string;
  interfaceLanguage?: string;
  level?: CEFRLevel | 'all';
  topic?: string | 'all';
  type?: LexicalType | 'all';
  pos?: PartOfSpeech | 'all';
  frequency?: FrequencyType | 'all';
  limit?: number;
  page?: number;
}

export interface LexiconSearchResult {
  entries: LexicalEntry[];
  total: number;
  page: number;
  totalPages: number;
  topics: string[];
  availableLevels: CEFRLevel[];
}

export interface LexiconStats {
  totalEntries: number;
  byType: Record<LexicalType, number>;
  byCEFR: Record<CEFRLevel, number>;
  byTopic: Record<string, number>;
  totalSenses: number;
  phrasalVerbsCount: number;
  collocationsCount: number;
  idiomsCount: number;
  cachedPronunciationsCount: number;
  lastUpdated: string;
}
