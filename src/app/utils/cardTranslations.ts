// @ts-nocheck
import { LexicalEntry } from '../types/lexicon';
import { VocabularyItem } from '../types';

export interface CardTranslationMap {
  english?: string;
  french?: string;
  spanish?: string;
  german?: string;
  arabic?: string;
}

// Dictionary map for master lexicon and common words across supported languages
export const MASTER_TRANSLATION_MAP: Record<string, CardTranslationMap> = {
  // Master Lexicon English Words
  'house': { english: 'house', french: 'maison', spanish: 'casa', german: 'Haus', arabic: 'منزل' },
  'resilient': { english: 'resilient', french: 'résilient(e)', spanish: 'resiliente', german: 'widerstandsfähig', arabic: 'مرن / صامد' },
  'ubiquitous': { english: 'ubiquitous', french: 'omniprésent(e)', spanish: 'omnipresente', german: 'allgegenwärtig', arabic: 'واسع الانتشار' },
  'ephemeral': { english: 'ephemeral', french: 'éphémère', spanish: 'efímero/a', german: 'flüchtig', arabic: 'سريع الزوال' },
  'quintessential': { english: 'quintessential', french: 'quintessentiel(le)', spanish: 'quintaesencial', german: 'wesentlich / typisch', arabic: 'النموذجي' },

  // Master Lexicon Spanish Words
  'perro': { english: 'dog', french: 'chien', spanish: 'perro', german: 'Hund', arabic: 'كلب' },
  'desarrollo': { english: 'development', french: 'développement', spanish: 'desarrollo', german: 'Entwicklung', arabic: 'تطوير / تنمية' },
  'enriquecer': { english: 'enrich', french: 'enrichir', spanish: 'enriquecer', german: 'bereichern', arabic: 'إثراء / يثري' },

  // Master Lexicon German Words
  'hund': { english: 'dog', french: 'chien', spanish: 'perro', german: 'Hund', arabic: 'كلب' },
  'entwicklung': { english: 'development', french: 'développement', spanish: 'desarrollo', german: 'Entwicklung', arabic: 'تطوير' },

  // Master Lexicon French Words
  'maison': { english: 'house', french: 'maison', spanish: 'casa', german: 'Haus', arabic: 'منزل' },
  'développement': { english: 'development', french: 'développement', spanish: 'desarrollo', german: 'Entwicklung', arabic: 'تطوير' },

  // Master Lexicon Arabic Words
  'منزل': { english: 'house', french: 'maison', spanish: 'casa', german: 'Haus', arabic: 'منزل' },
  'تطوير': { english: 'development', french: 'développement', spanish: 'desarrollo', german: 'Entwicklung', arabic: 'تطوير' },
};

/**
 * Gets the card translation specifically in the user's interface language.
 * Handles LexicalEntry, VocabularyItem, and multi-language translation lookups.
 */
export function getCardTranslation(
  card: LexicalEntry | VocabularyItem | any,
  interfaceLanguage?: string
): string {
  if (!card) return '';

  const uiLangRaw = (interfaceLanguage || 'English').toLowerCase().trim();
  let uiLangKey: 'english' | 'french' | 'spanish' | 'german' | 'arabic' = 'english';

  if (uiLangRaw.startsWith('fr') || uiLangRaw === 'french') uiLangKey = 'french';
  else if (uiLangRaw.startsWith('es') || uiLangRaw.startsWith('spa') || uiLangRaw === 'spanish') uiLangKey = 'spanish';
  else if (uiLangRaw.startsWith('de') || uiLangRaw.startsWith('ger') || uiLangRaw === 'german') uiLangKey = 'german';
  else if (uiLangRaw.startsWith('ar') || uiLangRaw === 'arabic') uiLangKey = 'arabic';
  else uiLangKey = 'english';

  // 1. Explicit translations object on card
  const translations: CardTranslationMap | undefined = card.translations;
  if (translations && translations[uiLangKey]) {
    const val = translations[uiLangKey]?.trim();
    if (val) {
      // If translation matches card word and deck/card language is the same as UI language, try fallback
      const cardLang = (card.language || '').toLowerCase();
      const isSameLang = (uiLangKey === 'french' && (cardLang === 'french' || cardLang === 'fr')) ||
                         (uiLangKey === 'spanish' && (cardLang === 'spanish' || cardLang === 'es')) ||
                         (uiLangKey === 'german' && (cardLang === 'german' || cardLang === 'de')) ||
                         (uiLangKey === 'arabic' && (cardLang === 'arabic' || cardLang === 'ar')) ||
                         (uiLangKey === 'english' && (cardLang === 'english' || cardLang === 'en'));
      
      if (val.toLowerCase() === card.word.toLowerCase() && isSameLang) {
        // Fallback to English translation if UI lang is the target lang
        if (uiLangKey !== 'english' && translations.english) {
          return translations.english;
        }
        if (uiLangKey === 'english' && translations.french) {
          return translations.french;
        }
      }
      return val;
    }
  }

  // 2. Known dictionary lookup map for master lexicon / common entries
  const wordLower = (card.word || '').toLowerCase().trim();
  const knownMap = MASTER_TRANSLATION_MAP[wordLower];
  if (knownMap && knownMap[uiLangKey]) {
    return knownMap[uiLangKey]!;
  }

  // 3. User vocabulary translation property (if present)
  if (card.translation && typeof card.translation === 'string' && card.translation.trim()) {
    // If translation is populated, check if it's usable
    return card.translation.trim();
  }

  // 4. Arabic translation property
  if (uiLangKey === 'arabic') {
    if (card.arabicTranslation && typeof card.arabicTranslation === 'string') {
      return card.arabicTranslation;
    }
    const sense = card.senses?.[0];
    if (sense?.arabicTranslation?.text) {
      return sense.arabicTranslation.text;
    }
  }

  // 5. English definition fallback for English interface
  if (uiLangKey === 'english') {
    const sense = card.senses?.[0];
    if (sense?.definition && sense.definition !== card.word) {
      return sense.definition;
    }
    if (card.definition && card.definition !== card.word) {
      return card.definition;
    }
  }

  // 6. Sense definition fallback
  const senseDef = card.senses?.[0]?.definition || card.definition;
  if (senseDef && senseDef !== card.word) {
    return senseDef;
  }

  // 7. Last resort fallback to arabicTranslation if available or card word
  if (card.arabicTranslation && typeof card.arabicTranslation === 'string') {
    return card.arabicTranslation;
  }

  return card.word || '';
}
