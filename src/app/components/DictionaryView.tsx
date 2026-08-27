// @ts-nocheck
import { getTranslation } from '../utils/i18n';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VocabularyItem, Deck, ReaderSettings } from '../types';
import { 
  Search, Mic, Volume2, Bookmark, Copy, Sparkles, X, PenLine, Mail, 
  RotateCcw, SlidersHorizontal, Wand2, CheckCircle2, ArrowLeftRight, 
  Check, Loader2, Languages, BookOpen, MessageSquare, Globe, ChevronDown, Zap, Quote,
  ChevronLeft, ChevronRight, SpellCheck
} from 'lucide-react';
import { playTTS } from '../utils/tts';
import { getLocalLexicalEntry } from '../utils/localLexicon';
import { startPronunciationPractice } from '../utils/speechRecognition';
import { activityTracker } from '../utils/activityTracker';
import { FlagIcon } from './DualFlagLanguageSelector';

interface DictionaryViewProps {
  vocabulary: VocabularyItem[];
  decks: Deck[];
  onAddWordClick: () => void;
  onEditCardClick: (card: VocabularyItem) => void;
  onDeleteCard: (id: string) => void;
  settings?: ReaderSettings;
  onSaveVocabulary?: (item: VocabularyItem) => void;
}

interface TranslationResult {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  sourceLanguage: string;
  grammarNote?: string;
  contextExamples?: string[];
  synonyms?: string[];
  antonyms?: string[];
  translations: Record<string, {
    text: string;
    definition: string;
    example?: string;
    flag: string;
  }>;
}

// Pre-packaged dictionary lookups for instant responsiveness
const DICTIONARY_FALLBACKS: Record<string, TranslationResult> = {
  serendipity: {
    word: 'serendipity',
    phonetic: '/ˌserənˈdɪpəti/',
    partOfSpeech: 'noun',
    definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
    sourceLanguage: 'English',
    grammarNote: 'Uncountable noun. First coined by Horace Walpole in 1754.',
    contextExamples: [
      'Meeting her in Paris was pure serendipity.',
      'Scientific discoveries often involve serendipity.'
    ],
    synonyms: ['chance', 'fluke', 'good fortune', 'providence'],
    antonyms: ['misfortune', 'design', 'plan'],
    translations: {
      Arabic: {
        text: 'صُدْفَة سَعِيدَة',
        definition: 'العُثُورُ عَلَى أَشْيَاءَ جَمِيلَةٍ عَنْ طَرِيقِ الصُّدْفَةِ.',
        example: 'كان لقاؤهما صدفة سعيدة غيرت حياتهما.',
        flag: 'EG'
      },
      German: {
        text: 'Glücklicher Zufall',
        definition: 'Zufällige Entdeckung von etwas Erfreulichem.',
        example: 'Es war reine Serendipität, dass wir uns trafen.',
        flag: 'DE'
      },
      French: {
        text: 'sérendipité',
        definition: 'Capacité de faire par hasard des découvertes heureuses.',
        example: 'Une découverte faite par sérendipité.',
        flag: 'FR'
      },
      Spanish: {
        text: 'serendipia',
        definition: 'Hallazgo afortunado e inesperado que se produce cuando se está buscando otra cosa.',
        example: 'Encontrar este libro fue pura serendipia.',
        flag: 'ES'
      },
      Italian: {
        text: 'serendipità',
        definition: 'La fortuna di fare felici e insperate scoperte per puro caso.',
        example: 'La scoperta della penicillina è un classico esempio di serendipità.',
        flag: 'IT'
      },
      Japanese: {
        text: 'セレンディピティ',
        definition: '思いがけないものを発見する幸運な能力。',
        example: '偶然のセレンディピティで素晴らしいアイデアを得た。',
        flag: 'JP'
      }
    }
  },
  resilience: {
    word: 'resilience',
    phonetic: '/rɪˈzɪliəns/',
    partOfSpeech: 'noun',
    definition: 'The capacity to withstand or recover quickly from difficult conditions.',
    sourceLanguage: 'English',
    grammarNote: 'Uncountable abstract noun.',
    contextExamples: [
      'The team showed remarkable resilience after their initial defeat.',
      'Building psychological resilience helps individuals adapt to life changes.'
    ],
    synonyms: ['toughness', 'adaptability', 'fortitude', 'flexibility'],
    antonyms: ['fragility', 'vulnerability', 'weakness'],
    translations: {
      Arabic: {
        text: 'المرونة والقدرة على التكيف',
        definition: 'القدرة على التعافي بسرعة من الصعوبات.',
        example: 'تظهر الشدة مرونة الإنسان الحقيقية.',
        flag: 'EG'
      },
      German: {
        text: 'Resilienz / Widerstandskraft',
        definition: 'Die Fähigkeit, schwierige Lebenssituationen ohne anhaltende Beeinträchtigung zu überstehen.',
        example: 'Ihre Resilienz half ihr durch die Krise.',
        flag: 'DE'
      },
      French: {
        text: 'résilience',
        definition: 'Capacité à surmonter les épreuves et les traumatismes.',
        example: 'La résilience est une qualité essentielle.',
        flag: 'FR'
      },
      Spanish: {
        text: 'resiliencia',
        definition: 'Capacidad de adaptación frente a un agente perturbador o un estado adverso.',
        example: 'Demostró gran resiliencia tras el obstáculo.',
        flag: 'ES'
      },
      Italian: {
        text: 'resilienza',
        definition: 'Capacità di reagire positivamente alle difficoltà.',
        example: 'La resilienza delle persone in tempi difficili.',
        flag: 'IT'
      },
      Japanese: {
        text: '回復力 / レジリエンス',
        definition: '困難な状況から迅速に立ち直る能力。',
        example: '彼女の精神的な回復力は素晴らしい。',
        flag: 'JP'
      }
    }
  },
  epiphany: {
    word: 'epiphany',
    phonetic: '/ɪˈpɪfəni/',
    partOfSpeech: 'noun',
    definition: 'A moment of sudden and great revelation or realization.',
    sourceLanguage: 'English',
    grammarNote: 'Plural: epiphanies.',
    contextExamples: [
      'She had a sudden epiphany while walking by the sea.',
      'His epiphany transformed the entire business strategy.'
    ],
    synonyms: ['revelation', 'insight', 'discovery', 'realization'],
    antonyms: ['confusion', 'misconception'],
    translations: {
      Arabic: {
        text: 'إشراق / تجلٍّ فكري',
        definition: 'لحظة إدراك مفاجئة وعميقة للحقيقة.',
        example: 'شعر بإشراق فكري غير مجرى أفكاره.',
        flag: 'EG'
      },
      German: {
        text: 'Aha-Erlebnis / Erleuchtung',
        definition: 'Eine plötzliche tiefe Erkenntnis.',
        example: 'Er hatte eine plötzliche Erleuchtung.',
        flag: 'DE'
      },
      French: {
        text: 'épiphanie',
        definition: 'Prise de conscience soudaine et lumineuse.',
        example: 'J\'ai eu une épiphanie soudaine.',
        flag: 'FR'
      },
      Spanish: {
        text: 'epifanía',
        definition: 'Momento de revelación o comprensión repentina.',
        example: 'Tuvo una epifanía al resolver el problema.',
        flag: 'ES'
      },
      Italian: {
        text: 'epifania',
        definition: 'Intuizione improvvisa e illuminante.',
        example: 'Un\'epifania che ha cambiato la sua vita.',
        flag: 'IT'
      },
      Japanese: {
        text: 'ひらめき / 突然の開眼',
        definition: '物事の本質を突然理解する瞬間。',
        example: '散歩中に突然のひらめきがあった。',
        flag: 'JP'
      }
    }
  }
};

const LANGUAGES = [
  { code: 'GB', name: 'English', tag: 'en' },
  { code: 'EG', name: 'Arabic', tag: 'ar' },
  { code: 'DE', name: 'German', tag: 'de' },
  { code: 'FR', name: 'French', tag: 'fr' },
  { code: 'ES', name: 'Spanish', tag: 'es' },
  { code: 'IT', name: 'Italian', tag: 'it' },
  { code: 'JP', name: 'Japanese', tag: 'ja' },
  { code: 'PT', name: 'Portuguese', tag: 'pt' },
  { code: 'RU', name: 'Russian', tag: 'ru' },
  { code: 'TR', name: 'Turkish', tag: 'tr' }
];

const getLocalizedLangName = (langName: string, t: any) => {
  const norm = langName.toLowerCase();
  if (norm.includes('english') || norm === 'gb' || norm === 'en') return t.langEnglish || 'English';
  if (norm.includes('arabic') || norm === 'eg' || norm === 'sa' || norm === 'ar') return t.langArabic || 'Arabic';
  if (norm.includes('german') || norm === 'de') return t.langGerman || 'German';
  if (norm.includes('french') || norm === 'fr') return t.langFrench || 'French';
  if (norm.includes('spanish') || norm === 'es') return t.langSpanish || 'Spanish';
  if (norm.includes('italian') || norm === 'it') return t.langItalian || 'Italian';
  if (norm.includes('japanese') || norm === 'jp' || norm === 'ja') return t.langJapanese || 'Japanese';
  if (norm.includes('portuguese') || norm === 'pt') return t.langPortuguese || 'Portuguese';
  if (norm.includes('russian') || norm === 'ru') return t.langRussian || 'Russian';
  if (norm.includes('turkish') || norm === 'tr') return t.langTurkish || 'Turkish';
  return langName;
};

export const DictionaryView: React.FC<DictionaryViewProps> = ({
  vocabulary = [],
  decks = [],
  onSaveVocabulary,
  settings
}) => {
  const t = getTranslation(settings?.interfaceLanguage || 'English');
  // Primary States
  const [sourceLang] = useState<string>('Auto-Detect');
  const [targetLang, setTargetLang] = useState<string>(settings?.targetLanguage || 'Arabic');
  const [isTargetOpen, setIsTargetOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('serendipity');

  const [selectedVoice, setSelectedVoice] = useState<'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir'>('Zephyr');
  const [speechSpeed, setSpeechSpeed] = useState<'normal' | 'slow'>('normal');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Keep target language synchronized with global settings
  useEffect(() => {
    if (settings?.targetLanguage && settings.targetLanguage !== targetLang) {
      setTargetLang(settings.targetLanguage);
    }
  }, [settings?.targetLanguage]);

  const handleSpeakText = (textToSpeak: string, langHint?: string) => {
    setIsPlayingAudio(true);
    playTTS(
      textToSpeak,
      langHint || currentResult.sourceLanguage,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      {
        voice: selectedVoice,
        promptStyle: speechSpeed === 'slow' ? 'slow' : 'normal',
      }
    );
  };
  const [currentResult, setCurrentResult] = useState<TranslationResult>(DICTIONARY_FALLBACKS.serendipity);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  
  // UI Actions feedback
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [savedWordIds, setSavedWordIds] = useState<Set<string>>(new Set());
  const [selectedDeckId, setSelectedDeckId] = useState<string>(decks[0]?.id || '');

  // Check if current word is already saved in user's vocabulary
  const isWordSaved = vocabulary.some(v => v.word.toLowerCase() === currentResult.word.toLowerCase()) || savedWordIds.has(currentResult.word.toLowerCase());

  // Handle Search Execution
  const handleSearch = async (termToSearch?: string, newTargetLang?: string, newSourceLang?: string) => {
    const word = (termToSearch || searchTerm).trim();
    if (!word) return;

    const tLang = newTargetLang || targetLang;
    const sLang = newSourceLang || sourceLang;

    setIsLoading(true);

    const lowercase = word.toLowerCase();

    // 1. First check Local Client-Side Lexicon
    const localEntry = getLocalLexicalEntry(lowercase);
    if (localEntry) {
      const primarySense = localEntry.senses && localEntry.senses[0];
      const primaryExample = primarySense?.examples && primarySense.examples[0];
      const pos = Array.isArray(localEntry.partOfSpeech) ? localEntry.partOfSpeech.join(', ') : localEntry.partOfSpeech;

      const lexResult: TranslationResult = {
        word: localEntry.word,
        phonetic: localEntry.phonetic || `/${localEntry.word}/`,
        partOfSpeech: pos || 'noun',
        definition: primarySense?.definition || localEntry.word,
        sourceLanguage: sLang,
        grammarNote: `Lemma: ${localEntry.lemma} • CEFR: ${localEntry.cefr} • Frequency: ${localEntry.frequency}`,
        contextExamples: primarySense?.examples?.map((ex: any) => ex.source) || [`"Example sentence for ${localEntry.word}."`],
        synonyms: primarySense?.synonyms || ['related expression'],
        antonyms: primarySense?.antonyms || [],
        translations: {
          Arabic: {
            text: localEntry.arabicTranslation || primarySense?.arabicTranslation?.text || 'ترجمة عربية',
            definition: primarySense?.definition || '',
            example: primaryExample?.source || '',
            flag: 'EG',
          },
          German: {
            text: `Übersetzung (${localEntry.word})`,
            definition: primarySense?.definition || '',
            flag: 'DE',
          },
          French: {
            text: `Traduction (${localEntry.word})`,
            definition: primarySense?.definition || '',
            flag: 'FR',
          },
          Spanish: {
            text: `Traducción (${localEntry.word})`,
            definition: primarySense?.definition || '',
            flag: 'ES',
          },
        },
      };

      setCurrentResult(lexResult);
      activityTracker.logDictionarySearch(word, 1);
      setIsLoading(false);
      return;
    }

    // 2. Fallback check Master English Lexicon API
    try {
      const lexRes = await fetch(`/api/lexicon/entry/${encodeURIComponent(lowercase)}`);
      if (lexRes.ok) {
        const lexData = await lexRes.json();
        if (lexData && lexData.word) {
          const primarySense = lexData.senses && lexData.senses[0];
          const primaryExample = primarySense?.examples && primarySense.examples[0];
          const pos = Array.isArray(lexData.partOfSpeech) ? lexData.partOfSpeech.join(', ') : lexData.partOfSpeech;

          const lexResult: TranslationResult = {
            word: lexData.word,
            phonetic: lexData.phonetic || `/${lexData.word}/`,
            partOfSpeech: pos || 'noun',
            definition: primarySense?.definition || lexData.word,
            sourceLanguage: sLang,
            grammarNote: `Lemma: ${lexData.lemma} • CEFR: ${lexData.cefr} • Frequency: ${lexData.frequency}`,
            contextExamples: primarySense?.examples?.map((ex: any) => ex.source) || [`"Example sentence for ${lexData.word}."`],
            synonyms: primarySense?.synonyms || ['related expression'],
            antonyms: primarySense?.antonyms || [],
            translations: {
              Arabic: {
                text: lexData.arabicTranslation || primarySense?.arabicTranslation?.text || 'ترجمة عربية',
                definition: primarySense?.definition || '',
                example: primaryExample?.source || '',
                flag: 'EG',
              },
              German: {
                text: `Übersetzung (${lexData.word})`,
                definition: primarySense?.definition || '',
                flag: 'DE',
              },
              French: {
                text: `Traduction (${lexData.word})`,
                definition: primarySense?.definition || '',
                flag: 'FR',
              },
              Spanish: {
                text: `Traducción (${lexData.word})`,
                definition: primarySense?.definition || '',
                flag: 'ES',
              },
            },
          };

          setCurrentResult(lexResult);
          activityTracker.logDictionarySearch(word, 1);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.log('Lexicon lookup bypassed, proceeding to API translation:', err);
    }
    
    // Check local dictionary fallback for instant response
    if (DICTIONARY_FALLBACKS[lowercase]) {
      const fb = DICTIONARY_FALLBACKS[lowercase];
      setCurrentResult(fb);
      activityTracker.logDictionarySearch(word, 1);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word,
          targetLanguage: tLang,
          sourceLanguage: sLang
        })
      });

      if (res.ok) {
        const text = await res.text();
        let data: any = {};
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("Invalid JSON from dictionary API. Output snippet:", text.substring(0, 100));
          throw new Error("Received non-JSON response from server");
        }
        
        // Build dynamic result
        const mainTrans = data.translation || word;
        const mainDef = data.definition || 'Definition generated via dictionary lookup.';
        
        const dynamicContextExamples = Array.isArray(data.contextExamples) && data.contextExamples.length > 0
          ? data.contextExamples
          : (Array.isArray(data.examples) && data.examples.length > 0
              ? data.examples.map((ex: any) => typeof ex === 'string' ? ex : ex.source || ex.target)
              : [`"Meeting her in Paris was pure ${word}."`, `"Scientific discoveries often involve ${word}."`]);

        const dynamicSynonyms = Array.isArray(data.synonyms) && data.synonyms.length > 0
          ? data.synonyms
          : ['chance', 'fluke', 'good fortune', 'providence'];

        const dynamicAntonyms = Array.isArray(data.antonyms) && data.antonyms.length > 0
          ? data.antonyms
          : ['misfortune', 'design', 'plan'];

        const newResult: TranslationResult = {
          word: data.word || word,
          phonetic: data.phonetic || `/${word}/`,
          partOfSpeech: data.partOfSpeech || 'noun',
          definition: mainDef,
          sourceLanguage: sLang,
          grammarNote: data.grammarNote,
          contextExamples: dynamicContextExamples,
          synonyms: dynamicSynonyms,
          antonyms: dynamicAntonyms,
          translations: {
            [tLang]: {
              text: mainTrans,
              definition: mainDef,
              example: data.examples?.[0]?.target || `${word} in context.`,
              flag: LANGUAGES.find(l => l.name === tLang)?.code || 'GB'
            },
            // Fallback generated translations for other popular languages
            Arabic: {
              text: tLang === 'Arabic' ? mainTrans : `ترجمة ${word}`,
              definition: tLang === 'Arabic' ? mainDef : `معنى كلمة ${word} باللغة العربية.`,
              flag: 'EG'
            },
            German: {
              text: tLang === 'German' ? mainTrans : `Übersetzung von ${word}`,
              definition: tLang === 'German' ? mainDef : `Bedeutung von ${word} auf Deutsch.`,
              flag: 'DE'
            },
            French: {
              text: tLang === 'French' ? mainTrans : `Traduction de ${word}`,
              definition: tLang === 'French' ? mainDef : `Signification de ${word} en français.`,
              flag: 'FR'
            },
            Spanish: {
              text: tLang === 'Spanish' ? mainTrans : `Traducción de ${word}`,
              definition: tLang === 'Spanish' ? mainDef : `Significado de ${word} en español.`,
              flag: 'ES'
            }
          }
        };

        setCurrentResult(newResult);
        activityTracker.logDictionarySearch(word, 1);
      } else {
        throw new Error('API request failed');
      }
    } catch (e) {
      console.error('Dictionary API search error:', e);
      // Fallback result on error
      setCurrentResult({
        word,
        phonetic: `/${word}/`,
        partOfSpeech: 'word',
        definition: `Translation and explanation for "${word}".`,
        sourceLanguage: sLang,
        translations: {
          [tLang]: {
            text: `${word} (${tLang})`,
            definition: `Meaning of ${word} in ${tLang}.`,
            flag: LANGUAGES.find(l => l.name === tLang)?.code || 'GB'
          }
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Switch target language on pill click
  const handleSelectLanguage = (langName: string) => {
    setTargetLang(langName);
    handleSearch(searchTerm, langName, sourceLang);
  };

  // Voice Speech Recognition
  const handleStartVoice = () => {
    if (isRecording) return;
    setIsRecording(true);
    startPronunciationPractice(
      '',
      sourceLang,
      (_match, transcript) => {
        if (transcript) {
          setSearchTerm(transcript);
          handleSearch(transcript, targetLang, sourceLang);
        }
      },
      (err) => {
        console.error('Speech recognition error:', err);
        setIsRecording(false);
      },
      () => setIsRecording(false)
    );
  };

  // Copy to Clipboard with Feedback
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Save Word to Vocabulary
  const handleSaveWord = (targetLangName: string, textToSave?: string, defToSave?: string) => {
    const wordToSave = currentResult.word;
    const activeTranslation = textToSave || currentResult.translations[targetLangName]?.text || currentResult.translations[targetLang]?.text || 'Translation';
    const activeDef = defToSave || currentResult.translations[targetLangName]?.definition || currentResult.definition;

    const newItem: VocabularyItem = {
      id: `vocab-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      word: wordToSave,
      phonetic: currentResult.phonetic,
      translation: activeTranslation,
      definition: activeDef,
      partOfSpeech: currentResult.partOfSpeech,
      grammarNote: currentResult.grammarNote || '',
      contextSentence: currentResult.translations[targetLangName]?.example || `Studied ${wordToSave} in Dictionary.`,
      deckId: selectedDeckId || (decks[0]?.id || ''),
      language: targetLangName || targetLang,
      dateAdded: Date.now(),
      tags: ['Dictionary', targetLangName]
    };

    if (onSaveVocabulary) {
      onSaveVocabulary(newItem);
    }
    const deckName = decks.find(d => d.id === newItem.deckId)?.name;
    activityTracker.logVocabSaved(wordToSave, activeTranslation, deckName);
    setSavedWordIds(prev => new Set(prev).add(wordToSave.toLowerCase()));
  };

  return (
    <div className="w-full max-w-5xl mx-auto text-zinc-900 pb-12 pt-2">
      {/* Main Interactive Dictionary */}
      <div className="w-full flex flex-col gap-4">
        {/* Interactive Search Box */}
        <div className="relative flex items-center pearl-card rounded-2xl px-4 py-2.5 focus-within:border-slate-300 transition-colors max-w-full mx-auto w-full md:max-w-2xl gap-2">
          <Search className="md:hidden w-4 h-4 text-slate-400 shrink-0" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            placeholder={t.typeWordPlaceholder ? t.typeWordPlaceholder.replace('{lang}', sourceLang) : `Type word in ${sourceLang}...`}
            className="flex-1 bg-transparent px-2 py-0.5 text-sm font-medium outline-none text-zinc-900 placeholder:text-slate-400 min-w-0"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="p-1 text-slate-400 hover:text-slate-600 me-0.5 cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Right-aligned Action Cluster */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Voice Search Mic Button */}
            <button 
              onClick={handleStartVoice}
              title={isRecording ? (t.listening || 'Listening...') : (t.searchWithVoice || 'Search with voice')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                isRecording 
                  ? 'bg-rose-500 text-white animate-pulse' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>

            {/* Lookup Action Button */}
            <button 
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="bg-[#A4F5A6] hover:bg-[#8ee590] text-[#222222] px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 shrink-0"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#222222]" /> : (t.lookup || 'Lookup')}
            </button>

            {/* Target Language Dropdown Selector (Laptop / Desktop) - Absolute Right */}
            <div className="relative hidden md:block shrink-0">
              <button
                onClick={() => setIsTargetOpen(!isTargetOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                title={t.chooseTargetLanguage || 'Choose Target Language'}
              >
                <Globe className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="truncate max-w-[90px]">{getLocalizedLangName(targetLang, t)}</span>
                <ChevronDown className={`w-3 h-3 text-slate-500 shrink-0 transition-transform duration-200 ${isTargetOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Target Language Dropdown Menu */}
              <AnimatePresence>
                {isTargetOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsTargetOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute end-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-1.5 overflow-hidden"
                    >
                      <div className="text-[9px] font-bold tracking-widest uppercase text-slate-500 px-2.5 py-1 border-b border-slate-100 mb-1">
                        {t.translateTo || 'Translate To'}
                      </div>
                      <div className="max-h-60 overflow-y-auto flex flex-col gap-0.5 scrollbar-thin">
                        {LANGUAGES.map((lang) => {
                          const isSelected = targetLang === lang.name;
                          return (
                            <button
                              key={`tgt-opt-${lang.code}`}
                              onClick={() => {
                                setIsTargetOpen(false);
                                handleSelectLanguage(lang.name);
                              }}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-[#091F5C] text-white font-bold shadow-xs'
                                  : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                                  {lang.code}
                                </span>
                                <span>{getLocalizedLangName(lang.name, t)}</span>
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Word Display Area */}
        <div className="pearl-card bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10 shadow-xs rounded-3xl p-5 sm:p-6 relative order-1 md:order-2 space-y-4">
          {isLoading && (
            <div className="absolute inset-0 bg-[#222222]/80 backdrop-blur-xs rounded-3xl z-10 flex items-center justify-center gap-2 text-white font-semibold text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#A4F5A6]" />
              <span>{t.translating || 'Translating...'}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-black text-[#222222] dark:text-white tracking-tight leading-none">
                {currentResult.word}
              </h1>
              <button 
                onClick={() => handleSpeakText(currentResult.word, currentResult.sourceLanguage)}
                title={t.listenToPronunciation || 'Listen to pronunciation'}
                className={`p-2.5 border rounded-full transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 font-bold text-xs ${
                  isPlayingAudio 
                    ? 'bg-[#A4F5A6] text-[#222222] border-[#A4F5A6] animate-pulse shadow-md' 
                    : 'border-[#D0D2CF] bg-[#EFF1EE] hover:bg-[#A4F5A6] text-[#222222] dark:text-white dark:bg-stone-800'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t.pronounce || 'Pronounce'}</span>
              </button>

              {/* Deck selector dropdown if decks available */}
              {decks.length > 0 && (
                <div className="relative">
                  <select
                    value={selectedDeckId}
                    onChange={(e) => setSelectedDeckId(e.target.value)}
                    className="px-2.5 py-1.5 text-[11px] font-semibold border border-[#D0D2CF] dark:border-white/10 rounded-lg bg-[#EFF1EE] dark:bg-stone-800 text-[#222222] dark:text-white outline-none cursor-pointer"
                  >
                    {decks.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button 
                onClick={() => handleSaveWord(targetLang)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all shadow-xs cursor-pointer ${
                  isWordSaved
                    ? 'bg-[#A4F5A6] text-[#222222]'
                    : 'border border-[#D0D2CF] dark:border-white/10 text-[#222222] dark:text-white hover:bg-[#EFF1EE] dark:hover:bg-stone-800'
                }`}
              >
                {isWordSaved ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Bookmark className="w-3.5 h-3.5 text-[#222222] dark:text-white" />
                )}
              </button>

              <button 
                onClick={() => handleCopy(`${currentResult.word} - ${currentResult.definition}`)}
                title={t.copyToClipboard || 'Copy to Clipboard'}
                className="p-1.5 border border-[#D0D2CF] dark:border-white/10 rounded-full hover:bg-[#EFF1EE] dark:hover:bg-stone-800 text-[#666666] dark:text-slate-300 cursor-pointer"
              >
                {copiedText === `${currentResult.word} - ${currentResult.definition}` ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
          </div>
          
          <div className="flex items-center gap-2 mt-2.5 text-xs flex-wrap">
            <span className="px-2 py-0.5 border border-[#D0D2CF] dark:border-white/10 rounded-md text-[10px] text-[#666666] dark:text-stone-300 uppercase tracking-wider font-semibold bg-[#EFF1EE] dark:bg-stone-800">
              {currentResult.partOfSpeech}
            </span>
            <span className="text-[#222222] dark:text-white font-bold text-[11px]">
              {currentResult.phonetic}
            </span>
            <span className="text-[#666666] dark:text-stone-400 italic text-[11px]">
              ({getLocalizedLangName(currentResult.sourceLanguage, t)})
            </span>
          </div>

          <p className="mt-2.5 text-[#222222] dark:text-stone-200 text-xs sm:text-sm leading-relaxed font-medium">
            {currentResult.definition}
          </p>

          {currentResult.grammarNote && (
            <div className="mt-2 text-[11px] bg-[#EFF1EE] dark:bg-stone-800 border border-[#D0D2CF] dark:border-white/10 text-[#222222] dark:text-stone-200 p-2.5 rounded-lg">
              <span className="font-bold uppercase tracking-wider text-[9px] me-1.5 text-[#222222] dark:text-white">{t.grammarNote || 'Grammar Note'}:</span>
              {currentResult.grammarNote}
            </div>
          )}

          <hr className="my-4 border-[#D0D2CF]/60 dark:border-white/10" />

          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-bold tracking-[0.15em] text-[#222222] dark:text-white uppercase flex items-center gap-1.5">
              <span>{t.translation || 'Translation'} ({getLocalizedLangName(targetLang, t)})</span>
            </h3>
            <span className="text-[10px] text-[#666666] dark:text-stone-400">{t.selectedTargetLanguage || 'Selected Target Language'}</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Translation Card - Only display the user-chosen target language */}
            {(Object.entries(currentResult.translations).filter(([langName]) => langName === targetLang).length > 0
              ? Object.entries(currentResult.translations).filter(([langName]) => langName === targetLang)
              : Object.entries(currentResult.translations).slice(0, 1)
            ).map(([langName, rawData]) => {
                const transData = rawData as { text: string; definition: string; example?: string; flag: string };
                const isActive = true;
                return (
                  <div 
                    key={langName}
                    className="border rounded-2xl p-4 relative shadow-xs transition-all border-[#D0D2CF] dark:border-white/10 bg-[#EFF1EE]/60 dark:bg-stone-900/60"
                  >
                  <div className="flex justify-between items-center mb-2.5 text-[#666666]">
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                      <FlagIcon code={transData.flag || (langName === 'Arabic' ? 'EG' : langName === 'French' ? 'FR' : 'GB')} className="w-5 h-3.5" />
                      <span className={isActive ? 'text-[#222222] dark:text-white font-bold' : ''}>{getLocalizedLangName(langName, t)}</span>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => handleSpeakText(transData.text, langName)}
                        title={t.pronounce || 'Pronounce'}
                        className="p-1 hover:bg-white rounded-full text-[#222222] dark:text-stone-300 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleSaveWord(langName, transData.text, transData.definition)}
                        title={t.saveToVocab || 'Save Translation'}
                        className="p-1 hover:bg-white rounded-full text-[#222222] dark:text-stone-300 cursor-pointer"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-[#222222] dark:text-white" />
                      </button>
                      <button 
                        onClick={() => handleCopy(transData.text)}
                        title={t.copy || 'Copy'}
                        className="p-1 hover:bg-white rounded-full text-[#222222] dark:text-stone-300 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className={`flex flex-col gap-1 ${langName === 'Arabic' ? 'text-end' : ''}`}>
                    <div 
                      className={`text-lg font-serif font-bold text-[#222222] dark:text-white ${isActive ? 'text-[#222222] dark:text-white' : ''}`}
                      dir={langName === 'Arabic' ? 'rtl' : 'ltr'}
                    >
                      {transData.text}
                    </div>
                    <div 
                      className="text-[11px] text-[#666666] dark:text-stone-300 leading-normal font-sans"
                      dir={langName === 'Arabic' ? 'rtl' : 'ltr'}
                    >
                      {transData.definition}
                    </div>
                    {transData.example && (
                      <div className="text-[10px] text-[#666666] dark:text-stone-400 italic mt-0.5 pt-1.5 border-t border-[#D0D2CF]/60 dark:border-white/10">
                        "{transData.example}"
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CONTEXT & EXAMPLES, SYNONYMS, ANTONYMS SECTION */}
          <div className="mt-6 pt-5 border-t border-[#D0D2CF]/60 dark:border-white/10 flex flex-col gap-5">
            {/* Context & Examples Header Pill */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF1EE] dark:bg-stone-800 border border-[#D0D2CF] dark:border-white/10 text-[#222222] dark:text-white font-bold text-[11px] tracking-wider uppercase shadow-2xs">
                <Quote className="w-3.5 h-3.5 text-[#222222] dark:text-[#A4F5A6]" />
                <span>{t.contextSentence || 'Context & Examples'}</span>
              </div>
            </div>

            {/* Contextual Sentence Examples */}
            <div>
              <div className="text-[10px] font-bold tracking-[0.15em] text-[#666666] dark:text-stone-400 uppercase mb-3">
                {t.contextualExamples || 'Contextual Sentence Examples'}
              </div>
              <div className="flex flex-col gap-2.5">
                {(currentResult.contextExamples || [
                  `Meeting her in Paris was pure ${currentResult.word}.`,
                  `Scientific discoveries often involve ${currentResult.word}.`
                ]).map((sentence, idx) => {
                  const cleanSentence = sentence.replace(/^["'“]|["'”]$/g, '').trim();
                  return (
                    <div 
                      key={idx}
                      className="bg-[#EFF1EE]/50 dark:bg-stone-800/40 border border-[#D0D2CF] dark:border-white/10 rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-2xs hover:border-[#222222] dark:hover:border-white/20 transition-colors"
                    >
                      <p className="text-[#222222] dark:text-stone-200 italic font-serif text-xs sm:text-sm leading-relaxed">
                        "{cleanSentence}"
                      </p>
                      <button
                        onClick={() => handleSpeakText(cleanSentence, currentResult.sourceLanguage)}
                        title={t.listenToPronunciation || 'Listen to sentence'}
                        className="p-1.5 text-[#666666] hover:text-[#222222] dark:hover:text-[#A4F5A6] hover:bg-white rounded-full transition-colors cursor-pointer shrink-0"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Synonyms & Antonyms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Synonyms */}
              <div>
                <div className="text-[10px] font-bold tracking-[0.15em] text-[#666666] dark:text-stone-400 uppercase mb-2.5">
                  {t.synonymsClickToLookup || 'Synonyms (Click to lookup)'}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {(currentResult.synonyms && currentResult.synonyms.length > 0
                    ? currentResult.synonyms
                    : ['chance', 'fluke', 'good fortune', 'providence']
                  ).map((syn) => (
                    <button
                      key={syn}
                      onClick={() => {
                        setSearchTerm(syn);
                        handleSearch(syn);
                      }}
                      className="px-3.5 py-1 rounded-full border border-[#D0D2CF] dark:border-white/10 bg-white dark:bg-stone-800 text-[#222222] dark:text-stone-200 text-xs font-medium hover:border-[#222222] hover:bg-[#A4F5A6] hover:text-[#222222] transition-colors cursor-pointer shadow-2xs"
                    >
                      {syn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Antonyms */}
              <div>
                <div className="text-[10px] font-bold tracking-[0.15em] text-[#666666] dark:text-stone-400 uppercase mb-2.5">
                  {t.antonyms || 'Antonyms'}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {(currentResult.antonyms && currentResult.antonyms.length > 0
                    ? currentResult.antonyms
                    : ['misfortune', 'design', 'plan']
                  ).map((ant) => (
                    <button
                      key={ant}
                      onClick={() => {
                        setSearchTerm(ant);
                        handleSearch(ant);
                      }}
                      className="px-3.5 py-1 rounded-full border border-[#D0D2CF] dark:border-white/10 bg-white dark:bg-stone-800 text-[#222222] dark:text-stone-200 text-xs font-medium hover:border-[#222222] hover:bg-[#A4F5A6] hover:text-[#222222] transition-colors cursor-pointer shadow-2xs"
                    >
                      {ant}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
