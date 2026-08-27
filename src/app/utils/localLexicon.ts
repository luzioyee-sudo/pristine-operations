// @ts-nocheck
import { LexicalEntry, LexiconSearchQuery, LexiconSearchResult } from '../types/lexicon';

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
import { INITIAL_MASTER_LEXICON } from '../data/masterLexicon';

let cachedEntries: LexicalEntry[] | null = null;

export function getLocalLexiconEntries(): LexicalEntry[] {
  if (cachedEntries) return cachedEntries;

  const entries: LexicalEntry[] = [];

  // 1. Add base INITIAL_MASTER_LEXICON
  INITIAL_MASTER_LEXICON.forEach((entry) => {
    entries.push(entry);
  });

  // 2. Map and parse all topic datasets
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
    { name: 'Weather & Seasons', data: WEATHER_AND_SEASONS_DATA }
  ];

  datasets.forEach((dataset) => {
    const topicName = dataset.name;
    const topicSlug = topicName.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    dataset.data.forEach((row, rowIndex) => {
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
        if (!word || typeof word !== 'string' || !word.trim()) {
          return; // Skip empty words
        }

        const cleanWord = word.trim();
        const id = `lex_topic_${topicSlug}_${rowIndex}_${lang.code}`;

        let pos: any = 'other';
        if (row.pos) {
          const rawPos = row.pos.toLowerCase();
          const validPos = [
            'noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition',
            'conjunction', 'determiner', 'interjection', 'auxiliary', 'modal',
            'numeral', 'particle', 'article', 'phrase', 'other'
          ];
          if (validPos.includes(rawPos)) {
            pos = rawPos;
          }
        }

        let lexicalType: any = 'word';
        if (row.type === 'chunk') {
          lexicalType = 'chunk';
        } else if (row.type === 'sentence') {
          lexicalType = 'expression';
        }

        const entry: LexicalEntry & { translations?: Record<string, string> } = {
          id,
          word: cleanWord,
          normalizedWord: cleanWord.toLowerCase(),
          type: lexicalType,
          lemma: cleanWord,
          language: lang.name,
          partOfSpeech: pos,
          phonetic: lang.getPhonetic(row) || undefined,
          frequency: 'Common',
          cefr: row.cefr || 'A1',
          topics: [topicName],
          arabicTranslation: row.arabic || undefined,
          translations: {
            english: row.english,
            spanish: row.spanish,
            german: row.german,
            arabic: row.arabic,
            french: row.french,
          },
          senses: [
            {
              senseId: `${id}_s1`,
              definition: row.english,
              partOfSpeech: pos,
              cefr: row.cefr || 'A1',
              examples: [],
              arabicTranslation: row.arabic ? {
                text: row.arabic
              } : undefined
            }
          ],
          source: `Topic Seeder - ${topicName}`,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        entries.push(entry);
      });
    });
  });

  cachedEntries = entries;
  return entries;
}

export function searchLocalLexicon(query: LexiconSearchQuery = {}): LexiconSearchResult {
  const allEntries = getLocalLexiconEntries();
  let filtered = allEntries;

  if (query.language) {
    const langLower = query.language.toLowerCase();
    filtered = filtered.filter(e => e.language.toLowerCase() === langLower);
  }

  if (query.q) {
    const qLower = query.q.toLowerCase().trim();
    filtered = filtered.filter(e => 
      e.word.toLowerCase().includes(qLower) || 
      e.normalizedWord.includes(qLower) ||
      e.lemma.toLowerCase().includes(qLower) ||
      (e.arabicTranslation && e.arabicTranslation.includes(qLower)) ||
      (e.senses && e.senses.some(s => s.definition.toLowerCase().includes(qLower)))
    );
  }

  if (query.level) {
    filtered = filtered.filter(e => e.cefr === query.level);
  }

  if (query.topic) {
    filtered = filtered.filter(e => e.topics.includes(query.topic!));
  }

  if (query.type) {
    filtered = filtered.filter(e => e.type === query.type);
  }

  const limit = query.limit || 100;
  const page = query.page || 1;
  const totalCount = filtered.length;
  const pagesCount = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const paginatedEntries = filtered.slice(startIndex, startIndex + limit);

  return {
    entries: paginatedEntries,
    total: totalCount,
    page,
    totalPages: pagesCount,
    topics: ['Daily Routine', 'Directions & Transportation', 'Family & Relationships', 'Food & Meals', 'Health & Feelings', 'Hobbies & Free Time', 'Home & Where You Live', 'Shopping & Money', 'Weather & Seasons'],
    availableLevels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
  };
}

export function getLocalLexicalEntry(wordOrId: string): LexicalEntry | null {
  const allEntries = getLocalLexiconEntries();
  const lower = wordOrId.toLowerCase().trim();
  
  // Find exact ID match or exact word match
  let entry = allEntries.find(e => e.id === wordOrId || e.word.toLowerCase() === lower);
  if (!entry) {
    // Fuzzy fallback
    entry = allEntries.find(e => e.word.toLowerCase().includes(lower));
  }
  return entry || null;
}
