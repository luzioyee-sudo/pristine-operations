// @ts-nocheck
import { getTranslation } from '../utils/i18n';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  Brain, 
  Clock, 
  Layers, 
  Sparkles, 
  Headphones, 
  Pencil, 
  Languages, 
  Plane, 
  MessageSquare, 
  ChevronRight, 
  MoreVertical, 
  Bell, 
  ArrowLeft,
  BookText,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Compass,
  History,
  SquarePen,
  Trophy,
  GraduationCap,
  BookMarked,
  LayoutGrid
} from 'lucide-react';
import { Quiz, AppView, VocabularyItem, ReaderSettings, Deck, QuizHistory } from '../types';
import { QuizRunner } from './QuizRunner';
import { QuizHistoryView } from './QuizHistoryView';

interface PracticeViewProps {
  vocabulary: VocabularyItem[];
  settings: ReaderSettings;
  decks?: Deck[];
  quizHistory?: QuizHistory[];
  onUpdateVocabulary?: (updated: VocabularyItem) => void;
  onAddVocabularyBatch?: (newItems: VocabularyItem[]) => void;
  onNavigate?: (view: AppView) => void;
  onSaveQuizHistory?: (result: Omit<QuizHistory, 'id'>) => void;
}

// Interactive quizzes with real educational questions
const ALL_QUIZZES: Quiz[] = [
  {
    id: 'everyday_english_vocab',
    title: 'Everyday English Vocabulary',
    description: 'Master essential everyday words for daily conversations.',
    category: 'Vocabulary',
    level: 'B1',
    questionCount: 5,
    estimatedTimeMinutes: 8,
    status: 'Not started',
    questions: [
      { 
        id: 'ee-1', 
        type: 'multiple_choice', 
        prompt: 'What is the most appropriate word to describe someone who is "always on time"?', 
        options: ['Punctual', 'Patient', 'Precise', 'Polite'], 
        correctAnswer: 'Punctual'
      },
      { 
        id: 'ee-2', 
        type: 'multiple_choice', 
        prompt: 'Choose the word that means "to make something more clear or easier to understand":', 
        options: ['Clarify', 'Complicate', 'Classify', 'Conceal'], 
        correctAnswer: 'Clarify'
      },
      { 
        id: 'ee-3', 
        type: 'multiple_choice', 
        prompt: 'Which word describes a person who has a strong desire to succeed or achieve?', 
        options: ['Ambitious', 'Anxious', 'Apathetic', 'Arrogant'], 
        correctAnswer: 'Ambitious'
      },
      { 
        id: 'ee-4', 
        type: 'multiple_choice', 
        prompt: 'If something is extremely small, it is ________.', 
        options: ['Microscopic', 'Substantial', 'Infinite', 'Obvious'], 
        correctAnswer: 'Microscopic'
      },
      { 
        id: 'ee-5', 
        type: 'multiple_choice', 
        prompt: 'What is the synonym for "generous"?', 
        options: ['Benevolent', 'Hostile', 'Greedy', 'Ignorant'], 
        correctAnswer: 'Benevolent'
      }
    ]
  },
  {
    id: 'travel_vocab_quiz',
    title: 'Travel Vocabulary',
    description: 'Essential phrases and terminology for navigating airports, hotels, and tourist spots.',
    category: 'Vocabulary',
    level: 'B1',
    questionCount: 5,
    estimatedTimeMinutes: 10,
    status: 'Continue',
    progress: 60,
    questions: [
      { 
        id: 'tr-1', 
        type: 'multiple_choice', 
        prompt: 'Which of the following places is where you go to collect your luggage after landing?', 
        options: ['Baggage claim', 'Check-in counter', 'Boarding gate', 'Security checkpoint'], 
        correctAnswer: 'Baggage claim'
      },
      { 
        id: 'tr-2', 
        type: 'multiple_choice', 
        prompt: 'An "itinerary" is best described as:', 
        options: ['A planned route or journey schedule', 'A passport cover', 'An airline meal', 'A travel insurance policy'], 
        correctAnswer: 'A planned route or journey schedule'
      },
      { 
        id: 'tr-3', 
        type: 'multiple_choice', 
        prompt: 'What do hotels call the process when you return your room key and pay the final bill?', 
        options: ['Check-out', 'Check-in', 'Reservation', 'Valet service'], 
        correctAnswer: 'Check-out'
      },
      { 
        id: 'tr-4', 
        type: 'multiple_choice', 
        prompt: 'If a flight is "delayed", it means it is:', 
        options: ['Late', 'Cancelled', 'On time', 'Overbooked'], 
        correctAnswer: 'Late'
      },
      { 
        id: 'tr-5', 
        type: 'multiple_choice', 
        prompt: 'What is the term for a ticket that allows you to travel to a destination and back?', 
        options: ['Round-trip ticket', 'One-way ticket', 'Boarding pass', 'Voucher'], 
        correctAnswer: 'Round-trip ticket'
      }
    ]
  },
  {
    id: 'airport_travel_quiz',
    title: 'Airport & Travel',
    description: 'Specific situational phrasing for airport announcements and security.',
    category: 'Vocabulary',
    level: 'A2',
    questionCount: 5,
    estimatedTimeMinutes: 6,
    status: 'Completed',
    bestScore: 90,
    questions: [
      { 
        id: 'ap-1', 
        type: 'multiple_choice', 
        prompt: 'What must you show before passing through to the airport gates?', 
        options: ['Boarding pass and ID', 'Receipt and credit card', 'Luggage tag', 'Duty-free bag'], 
        correctAnswer: 'Boarding pass and ID'
      },
      { 
        id: 'ap-2', 
        type: 'multiple_choice', 
        prompt: 'If your suitcase is heavier than the allowance, you may have to pay for:', 
        options: ['Excess baggage', 'First-class boarding', 'Express transit', 'Carry-on items'], 
        correctAnswer: 'Excess baggage'
      },
      { 
        id: 'ap-3', 
        type: 'multiple_choice', 
        prompt: 'The person who flies the plane is the:', 
        options: ['Pilot', 'Flight attendant', 'Marshall', 'Dispatcher'], 
        correctAnswer: 'Pilot'
      },
      { 
        id: 'ap-4', 
        type: 'multiple_choice', 
        prompt: 'What should you do with your seat belt during takeoff and landing?', 
        options: ['Fasten it', 'Remove it', 'Adjust it loosely', 'Stow it away'], 
        correctAnswer: 'Fasten it'
      },
      { 
        id: 'ap-5', 
        type: 'multiple_choice', 
        prompt: 'Where can you buy items tax-free at international airports?', 
        options: ['Duty-free shops', 'Lounge', 'Terminal kiosk', 'Concourse café'], 
        correctAnswer: 'Duty-free shops'
      }
    ]
  },
  {
    id: 'past_simple_tense',
    title: 'Past Simple Tense',
    description: 'Regular and irregular verbs in historical contextual dialogues.',
    category: 'Grammar',
    level: 'A2',
    questionCount: 5,
    estimatedTimeMinutes: 7,
    status: 'Completed',
    bestScore: 80,
    questions: [
      { 
        id: 'ps-1', 
        type: 'multiple_choice', 
        prompt: 'What is the past simple form of the verb "go"?', 
        options: ['Went', 'Gone', 'Goes', 'Going'], 
        correctAnswer: 'Went'
      },
      { 
        id: 'ps-2', 
        type: 'multiple_choice', 
        prompt: 'Choose the correct sentence:', 
        options: [
          'She watched a movie yesterday.', 
          'She watches a movie yesterday.', 
          'She has watch a movie yesterday.', 
          'She did watched a movie yesterday.'
        ], 
        correctAnswer: 'She watched a movie yesterday.'
      },
      { 
        id: 'ps-3', 
        type: 'multiple_choice', 
        prompt: 'Complete: "They ________ (buy) a new car last weekend."', 
        options: ['bought', 'buyed', 'buys', 'buying'], 
        correctAnswer: 'bought'
      },
      { 
        id: 'ps-4', 
        type: 'multiple_choice', 
        prompt: 'Complete the question: "________ you see the solar eclipse last Tuesday?"', 
        options: ['Did', 'Do', 'Have', 'Were'], 
        correctAnswer: 'Did'
      },
      { 
        id: 'ps-5', 
        type: 'multiple_choice', 
        prompt: 'What is the past simple form of "read" (pronounced differently)?', 
        options: ['read', 'red', 'road', 'readed'], 
        correctAnswer: 'read'
      }
    ]
  }
];

// Dynamic Quiz generators with premium fallback vocabulary if user has zero added items
const FALLBACK_VOCABULARY = [
  { word: "Pernicious", translation: "Harmful", definition: "having a harmful effect, especially in a gradual or subtle way.", partOfSpeech: "adjective", contextSentence: "The rumors had a pernicious effect on their friendship." },
  { word: "Serendipity", translation: "Happy coincidence", definition: "the occurrence of events by chance in a happy or beneficial way.", partOfSpeech: "noun", contextSentence: "By pure serendipity, we met our favorite author in a small cafe." },
  { word: "Resilient", translation: "Adaptable / Tough", definition: "able to withstand or recover quickly from difficult conditions.", partOfSpeech: "adjective", contextSentence: "The resilient local businesses recovered quickly after the storm." },
  { word: "Ephemeral", translation: "Short-lived", definition: "lasting for a very short time.", partOfSpeech: "adjective", contextSentence: "Fame can be ephemeral, but genuine masterpieces last forever." },
  { word: "Pragmatic", translation: "Realistic", definition: "dealing with things sensibly and realistically in a way that is based on practical considerations.", partOfSpeech: "adjective", contextSentence: "We need a pragmatic approach to solve this complex budget crisis." },
  { word: "Ubiquitous", translation: "Omnipresent", definition: "present, appearing, or found everywhere.", partOfSpeech: "adjective", contextSentence: "Smartphones have become ubiquitous in modern daily life." },
  { word: "Capricious", translation: "Unpredictable", definition: "given to sudden and unaccountable changes of mood or behavior.", partOfSpeech: "adjective", contextSentence: "The capricious administration kept changing the policy every month." },
  { word: "Eloquence", translation: "Expressiveness", definition: "fluent or persuasive speaking or writing.", partOfSpeech: "noun", contextSentence: "The president spoke with great eloquence, inspiring the entire nation." },
  { word: "Anomalous", translation: "Abnormal", definition: "deviating from what is standard, normal, or expected.", partOfSpeech: "adjective", contextSentence: "A warm day in the middle of winter is anomalous for this region." },
  { word: "Meticulous", translation: "Careful / Precise", definition: "showing great attention to detail; very careful and precise.", partOfSpeech: "adjective", contextSentence: "She was meticulous about her research, checking every single fact." }
];

export const PracticeView: React.FC<PracticeViewProps> = ({ 
  vocabulary, 
  settings, 
  decks = [],
  quizHistory = [],
  onUpdateVocabulary, 
  onNavigate,
  onSaveQuizHistory
}) => {
  const t = getTranslation(settings?.interfaceLanguage || 'English');
  const [activeTab, setActiveTab] = useState<'quizzes' | 'custom' | 'history'>('quizzes');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Quizzes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  // Custom Quiz states
  const [customMode, setCustomMode] = useState<'deck' | 'manual'>('deck');
  const [selectedDeckId, setSelectedDeckId] = useState<string>('');
  const [manualWordsInput, setManualWordsInput] = useState<string>('');
  const [customCount, setCustomCount] = useState<number>(5);
  const [mixedCount, setMixedCount] = useState<number>(10);
  const [customError, setCustomError] = useState<string | null>(null);

  // Auto-initialize selectedDeckId when decks load
  React.useEffect(() => {
    if (decks.length > 0 && !selectedDeckId) {
      setSelectedDeckId(decks[0].id);
    }
  }, [decks, selectedDeckId]);

  const challengingWordsCount = React.useMemo(() => {
    if (!vocabulary) return 0;
    return vocabulary.filter(v => v.srs && ((v.srs.lapses || 0) > 0 || v.srs.state === 'relearning' || (v.srs.easeFactor || 2.5) < 2.4)).length;
  }, [vocabulary]);

  const handleStartDynamicQuiz = (type: 'new' | 'old' | 'custom' | 'mixed') => {
    setCustomError(null);
    let pool: Array<{ word: string; translation: string; definition: string; partOfSpeech?: string; contextSentence?: string }> = [];

    if (type === 'custom') {
      if (customMode === 'deck') {
        if (!selectedDeckId) {
          setCustomError('Please create or select a flashcard deck first.');
          return;
        }
        const deckWords = vocabulary.filter(v => v.deckId === selectedDeckId);
        if (deckWords.length === 0) {
          setCustomError('The selected deck has no words yet! Try adding words to this deck first or choose the manual input mode.');
          return;
        }
        pool = deckWords.map(v => ({
          word: v.word,
          translation: v.translation || v.definition || '',
          definition: v.definition || v.translation || '',
          partOfSpeech: v.partOfSpeech,
          contextSentence: v.contextSentence
        }));
      } else {
        // Manual input mode
        const rawWords = manualWordsInput
          .split(/[,\n;]+/)
          .map(w => w.trim())
          .filter(Boolean);

        if (rawWords.length === 0) {
          setCustomError('Please enter at least one word to build your quiz!');
          return;
        }

        // Search definitions in existing vocab / fallback / mini-dictionary
        const MINI_DICT: Record<string, { definition: string; translation: string; options: string[] }> = {
          apple: { definition: "A round fruit with red or green skin and a whitish interior.", translation: "Apple / Pomme", options: ["A banana", "An orange", "A grape"] },
          banana: { definition: "A long curved fruit which grows in clusters with yellow skin.", translation: "Banana / Banane", options: ["A strawberry", "A peach", "A melon"] },
          beautiful: { definition: "Pleasing the senses or mind aesthetically.", translation: "Beautiful / Beau", options: ["Ugly", "Heavy", "Drab"] },
          happy: { definition: "Feeling or showing pleasure or contentment.", translation: "Happy / Heureux", options: ["Sad", "Anxious", "Weary"] },
          sad: { definition: "Feeling or showing sorrow; unhappy.", translation: "Sad / Triste", options: ["Cheerful", "Ecstatic", "Bold"] },
          smart: { definition: "Having or showing a quick-witted intelligence.", translation: "Smart / Intelligent", options: ["Dull", "Lazy", "Timid"] },
          resilient: { definition: "Able to withstand or recover quickly from difficult conditions.", translation: "Resilient / Résistant", options: ["Brittle", "Weak", "Vulnerable"] },
          ubiquitous: { definition: "Present, appearing, or found everywhere.", translation: "Ubiquitous / Omniprésent", options: ["Rare", "Concealed", "Isolated"] }
        };

        pool = rawWords.map(word => {
          const lower = word.toLowerCase();
          // 1. check user vocabulary
          const vocabMatch = vocabulary.find(v => v.word.toLowerCase() === lower);
          if (vocabMatch) {
            return {
              word: vocabMatch.word,
              translation: vocabMatch.translation || vocabMatch.definition || '',
              definition: vocabMatch.definition || vocabMatch.translation || '',
              contextSentence: vocabMatch.contextSentence
            };
          }
          // 2. check fallback vocabulary
          const fallMatch = FALLBACK_VOCABULARY.find(v => v.word.toLowerCase() === lower);
          if (fallMatch) {
            return {
              word: fallMatch.word,
              translation: fallMatch.translation,
              definition: fallMatch.definition,
              contextSentence: fallMatch.contextSentence
            };
          }
          // 3. check mini dict
          if (MINI_DICT[lower]) {
            return {
              word,
              translation: MINI_DICT[lower].translation,
              definition: MINI_DICT[lower].definition
            };
          }
          // 4. generic fallback
          return {
            word,
            translation: `The meaning/translation of "${word}"`,
            definition: `Meaning definition for "${word}"`
          };
        });
      }
    } else if (type === 'mixed') {
      // Build a highly mixed pool of:
      // - Words needing practice (challenging)
      // - New words
      // - Old words (already studied/retention)
      // Ensure we merge them cleanly without duplicates
      const challenging = vocabulary.filter(v => v.srs && ((v.srs.lapses || 0) > 0 || v.srs.state === 'relearning' || (v.srs.easeFactor || 2.5) < 2.4));
      const newWords = [...vocabulary].reverse().slice(0, 8);
      const oldWords = vocabulary.filter(v => v.srs && (v.srs.repetitions || 0) > 0);

      const mixedSet = new Set<string>();
      const finalItems: typeof vocabulary = [];

      const addIfUnique = (items: typeof vocabulary) => {
        for (const item of items) {
          if (!mixedSet.has(item.word.toLowerCase())) {
            mixedSet.add(item.word.toLowerCase());
            finalItems.push(item);
          }
        }
      };

      addIfUnique(challenging);
      addIfUnique(newWords);
      addIfUnique(oldWords);
      addIfUnique(vocabulary); // fallback all

      let rawPool = finalItems.map(v => ({
        word: v.word,
        translation: v.translation || v.definition || '',
        definition: v.definition || v.translation || '',
        partOfSpeech: v.partOfSpeech,
        contextSentence: v.contextSentence
      }));

      // If pool is too small, mix in some fallbacks
      if (rawPool.length < 10) {
        const fallbackMapped = FALLBACK_VOCABULARY.map(v => ({
          word: v.word,
          translation: v.translation,
          definition: v.definition,
          partOfSpeech: undefined,
          contextSentence: v.contextSentence
        }));
        for (const fb of fallbackMapped) {
          if (!mixedSet.has(fb.word.toLowerCase())) {
            mixedSet.add(fb.word.toLowerCase());
            rawPool.push(fb);
          }
        }
      }

      // Shuffle the pool randomly
      pool = [...rawPool].sort(() => 0.5 - Math.random());
    } else {
      // 'new' or 'old' word modes
      if (type === 'old' && vocabulary && vocabulary.length > 0) {
        // Calculate dynamic weakness score based on lapses, relearning states, and ease factors
        const vocabWithScore = vocabulary.map(v => {
          let weaknessScore = 0;
          if (v.srs) {
            weaknessScore += (v.srs.lapses || 0) * 15;
            if (v.srs.state === 'relearning') weaknessScore += 20;
            if (v.srs.state === 'learning') weaknessScore += 10;
            weaknessScore += (2.5 - (v.srs.easeFactor || 2.5)) * 10;
          } else {
            // Unstudied items have a slight baseline priority
            weaknessScore += 5;
          }
          return { v, weaknessScore };
        });

        // Sort descending by weaknessScore (highest weakness score = needs practice most)
        const sortedVocab = vocabWithScore.sort((a, b) => b.weaknessScore - a.weaknessScore).map(item => item.v);

        pool = sortedVocab.map(v => ({
          word: v.word,
          translation: v.translation || v.definition || '',
          definition: v.definition || v.translation || '',
          partOfSpeech: v.partOfSpeech,
          contextSentence: v.contextSentence
        }));
      } else {
        pool = vocabulary && vocabulary.length > 0 
          ? vocabulary.map(v => ({ 
              word: v.word, 
              translation: v.translation || v.definition || '', 
              definition: v.definition || v.translation || '', 
              partOfSpeech: v.partOfSpeech,
              contextSentence: v.contextSentence
            }))
          : FALLBACK_VOCABULARY;

        if (type === 'new') {
          pool = [...pool].reverse();
        } else if (type === 'old') {
          pool = [...pool].sort(() => 0.5 - Math.random());
        }
      }
    }

    const count = type === 'custom' ? (customMode === 'manual' ? pool.length : customCount) : (type === 'mixed' ? mixedCount : 5);
    const selectedWords = pool.slice(0, count);

    const questions = selectedWords.map((item, idx) => {
      // Rotate through 10 distinct, highly educational vocabulary question types
      const qTypeIndex = idx % 10;

      // Dictionary of synonyms, antonyms, spelling mistakes, and bad contexts for fallback words
      const SPECIAL_DATA: Record<string, {
        synonym: string;
        synDistractors: string[];
        antonym: string;
        antDistractors: string[];
        spellingMistakeSentence: string;
        spellingMistakeWord: string;
        badContexts: string[];
      }> = {
        pernicious: {
          synonym: "Harmful",
          synDistractors: ["Beneficial", "Pleasant", "Insignificant"],
          antonym: "Beneficial",
          antDistractors: ["Harmful", "Damaging", "Malicious"],
          spellingMistakeSentence: "The rumors had a penicious effect on their long friendship.",
          spellingMistakeWord: "penicious",
          badContexts: [
            "We enjoyed a delicious pernicious pie after Sunday dinner.",
            "I decided to buy a pernicious coat because the weather was freezing.",
            "The playful puppy was very pernicious and licked my hand."
          ]
        },
        serendipity: {
          synonym: "Happy Coincidence",
          synDistractors: ["Intentionality", "Catastrophe", "Arrangement"],
          antonym: "Misfortune / Fate",
          antDistractors: ["Luck", "Fluke", "Karma"],
          spellingMistakeSentence: "By pure serendepity, we bumped into our old school tutor in Venice.",
          spellingMistakeWord: "serendepity",
          badContexts: [
            "He opened the padlock using a rusty serendipity key.",
            "Can you put two scoops of serendipity in my coffee, please?",
            "I drove my serendipity down the highway as fast as possible."
          ]
        },
        resilient: {
          synonym: "Tough / Adaptable",
          synDistractors: ["Fragile", "Indifferent", "Sluggish"],
          antonym: "Fragile / Vulnerable",
          antDistractors: ["Strong", "Elastic", "Durable"],
          spellingMistakeSentence: "The local farmers are extremely resiliant and recovered from the drought.",
          spellingMistakeWord: "resiliant",
          badContexts: [
            "I read a highly resilient book with over five hundred pages.",
            "The kitchen wall was resiliently painted bright yellow.",
            "She wore a pair of resilient sunglasses that kept falling off."
          ]
        },
        ephemeral: {
          synonym: "Short-lived / Fleeting",
          synDistractors: ["Eternal", "Robust", "Sizable"],
          antonym: "Permanent / Eternal",
          antDistractors: ["Brief", "Temporary", "Passing"],
          spellingMistakeSentence: "The beautiful cherry blossom season is ephemral but absolutely gorgeous.",
          spellingMistakeWord: "ephemral",
          badContexts: [
            "Please pass me that blue ephemeral from the desk drawer.",
            "The ephemeral mountain stood high and snowy above the valley.",
            "We cooked a tasty ephemeral soup with garlic and onions."
          ]
        },
        pragmatic: {
          synonym: "Practical / Realistic",
          synDistractors: ["Idealistic", "Irrational", "Unwise"],
          antonym: "Idealistic / Visionary",
          antDistractors: ["Logical", "Sensible", "Realistic"],
          spellingMistakeSentence: "We must adopt a pragmatick strategy to survive this economic downturn.",
          spellingMistakeWord: "pragmatick",
          badContexts: [
            "I ate a sweet, juicy pragmatic for dessert after lunch.",
            "She sang a beautiful pragmatic song that made everyone emotional.",
            "I boarded a pragmatic flight from Chicago to London last night."
          ]
        },
        ubiquitous: {
          synonym: "Omnipresent / Global",
          synDistractors: ["Rare", "Hidden", "Confined"],
          antonym: "Scarce / Rare",
          antDistractors: ["Common", "Frequent", "Pervasive"],
          spellingMistakeSentence: "Wireless routers are now ubitquitous in almost every public building.",
          spellingMistakeWord: "ubitquitous",
          badContexts: [
            "I'd like to order a ubiquitous slice of pepperoni pizza.",
            "She ubiquitous her textbook and started studying for chemistry.",
            "We decided to walk ubiquitous the river until we found the bridge."
          ]
        }
      };

      const wordLower = item.word.toLowerCase();
      const spec = SPECIAL_DATA[wordLower];

      if (qTypeIndex === 0) {
        // 1. Multiple Choice (Definition Matching)
        const correctAnswer = item.definition || item.translation || "Meaning of the word";
        const otherOptions = pool
          .filter(w => w.word.toLowerCase() !== wordLower)
          .map(w => w.definition || w.translation)
          .filter(Boolean);

        const distractors = [...new Set(otherOptions)]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        const options = [correctAnswer, ...distractors];
        while (options.length < 4) {
          options.push(`Alternative context definition ${options.length + 1}`);
        }
        const shuffledOptions = options.sort(() => 0.5 - Math.random());

        return {
          id: `dyn-q-${idx}-${Date.now()}`,
          type: 'multiple_choice' as const,
          prompt: `What is the correct meaning or definition of the word "${item.word}"?`,
          options: shuffledOptions,
          correctAnswer,
          explanation: `"${item.word}" is defined as: ${correctAnswer}.`
        };

      } else if (qTypeIndex === 1) {
        // 2. Choose the Word (Definition -> Word lookup)
        const correctAnswer = item.word;
        const otherOptions = pool
          .filter(w => w.word.toLowerCase() !== wordLower)
          .map(w => w.word)
          .filter(Boolean);

        const distractors = [...new Set(otherOptions)]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        const options = [correctAnswer, ...distractors];
        while (options.length < 4) {
          options.push(`Vocabulary word variant ${options.length + 1}`);
        }
        const shuffledOptions = options.sort(() => 0.5 - Math.random());

        return {
          id: `dyn-q-${idx}-${Date.now()}`,
          type: 'choose_the_word' as const,
          prompt: `Which vocabulary word matches this definition?\n"${item.definition || item.translation}"`,
          options: shuffledOptions,
          correctAnswer,
          explanation: `"${item.word}" fits this exact definition.`
        };

      } else if (qTypeIndex === 2) {
        // 3. Fill in the Blank
        const correctAnswer = item.word;
        const otherOptions = pool
          .filter(w => w.word.toLowerCase() !== wordLower)
          .map(w => w.word)
          .filter(Boolean);

        const distractors = [...new Set(otherOptions)]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        const options = [correctAnswer, ...distractors];
        while (options.length < 4) {
          options.push(`Distractor word ${options.length + 1}`);
        }
        const shuffledOptions = options.sort(() => 0.5 - Math.random());

        let blankSentence = `The teacher noticed that the student was extremely _________ with their assignment.`;
        if (item.contextSentence && item.contextSentence.toLowerCase().includes(wordLower)) {
          const regex = new RegExp(item.word, 'gi');
          blankSentence = item.contextSentence.replace(regex, '_________');
        } else if (wordLower === 'pernicious') {
          blankSentence = "The negative rumors had a _________ influence on their working friendship.";
        } else if (wordLower === 'serendipity') {
          blankSentence = "We found the treasure by pure _________ without even using a treasure map.";
        } else if (wordLower === 'resilient') {
          blankSentence = "The flexible plastic container is incredibly _________ and never cracks when dropped.";
        } else if (wordLower === 'ephemeral') {
          blankSentence = "A sunset is beautiful but _________, fading into complete dark within minutes.";
        } else if (wordLower === 'pragmatic') {
          blankSentence = "She suggested a _________ compromise that solved both of our budget issues.";
        } else if (wordLower === 'ubiquitous') {
          blankSentence = "In Sweden, coffee breaks called Fika are _________ and enjoyed every day.";
        }

        return {
          id: `dyn-q-${idx}-${Date.now()}`,
          type: 'fill_in_the_blank' as const,
          prompt: `Fill in the blank with the correct word:\n"${blankSentence}"`,
          options: shuffledOptions,
          correctAnswer,
          explanation: `The sentence requires the word "${item.word}".`
        };

      } else if (qTypeIndex === 3) {
        // 4. Translation Matcher
        const correctAnswer = item.translation || item.definition || "definition";
        const otherOptions = pool
          .filter(w => w.word.toLowerCase() !== wordLower)
          .map(w => w.translation || w.definition)
          .filter(Boolean);

        const distractors = [...new Set(otherOptions)]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        const options = [correctAnswer, ...distractors];
        while (options.length < 4) {
          options.push(`Alternative translation option ${options.length + 1}`);
        }
        const shuffledOptions = options.sort(() => 0.5 - Math.random());

        return {
          id: `dyn-q-${idx}-${Date.now()}`,
          type: 'translation' as const,
          prompt: `Choose the correct translation or close equivalent for "${item.word}":`,
          options: shuffledOptions,
          correctAnswer,
          explanation: `"${item.word}" translates directly to or means: ${correctAnswer}.`
        };

      } else if (qTypeIndex === 4) {
        // 5. Match Pairs (Dynamic sub-matching of 3 items)
        const matchItems = pool.slice(0, 3);
        if (matchItems.length < 3) {
          // fallback to guarantee 3 items
          matchItems.push(...FALLBACK_VOCABULARY.slice(0, 3 - matchItems.length));
        }

        const pairsString = matchItems.map(m => `${m.word}:${m.translation || m.definition}`).join('|');
        const leftWords = matchItems.map(m => m.word).sort(() => 0.5 - Math.random());
        const rightMatches = matchItems.map(m => m.translation || m.definition).sort(() => 0.5 - Math.random());

        return {
          id: `dyn-q-${idx}-${Date.now()}`,
          type: 'match_pairs' as const,
          prompt: `Match the 3 vocabulary words on the left with their correct meanings on the right:`,
          options: [...leftWords, ...rightMatches],
          correctAnswer: pairsString,
          explanation: `Correct pairings: ${matchItems.map(m => `"${m.word}" = "${m.translation || m.definition}"`).join(', ')}.`
        };

      } else if (qTypeIndex === 5) {
        // 6. Sentence Ordering
        let fullSentence = `We must establish a highly practical and realistic mindset.`;
        if (item.contextSentence) {
          fullSentence = item.contextSentence;
        } else if (wordLower === 'pernicious') {
          fullSentence = "The rumors had a pernicious effect on friendship.";
        } else if (wordLower === 'serendipity') {
          fullSentence = "We met our favorite author in a cafe by serendipity.";
        } else if (wordLower === 'resilient') {
          fullSentence = "The resilient local businesses recovered quickly after storm.";
        } else if (wordLower === 'ephemeral') {
          fullSentence = "Fame can be ephemeral but genuine masterpieces last forever.";
        } else if (wordLower === 'pragmatic') {
          fullSentence = "We need a pragmatic approach to solve budget crisis.";
        } else if (wordLower === 'ubiquitous') {
          fullSentence = "Smartphones have become ubiquitous in modern daily life.";
        }

        const sanitized = fullSentence.trim().replace(/\s+/g, ' ');
        const tokens = sanitized.split(' ').filter(Boolean);
        const scrambled = [...tokens].sort(() => 0.5 - Math.random());

        return {
          id: `dyn-q-${idx}-${Date.now()}`,
          type: 'sentence_ordering' as const,
          prompt: `Rearrange the words to reconstruct the correct sentence containing "${item.word}":`,
          options: scrambled,
          correctAnswer: sanitized,
          explanation: `The ordered sentence is: "${sanitized}"`
        };

      } else if (qTypeIndex === 6) {
        // 7. Context Choice
        let correctContext = `She was extremely meticulous about her research, checking every single fact twice.`;
        if (item.contextSentence) {
          correctContext = item.contextSentence;
        } else if (wordLower === 'pernicious') {
          correctContext = "The rumors had a pernicious effect, slowly destroying their mutual trust.";
        } else if (wordLower === 'serendipity') {
          correctContext = "By pure serendipity, we found the missing ring inside a pocket we hadn't searched.";
        } else if (wordLower === 'resilient') {
          correctContext = "The resilient plants survived the harsh winter and bloomed beautifully in spring.";
        } else if (wordLower === 'ephemeral') {
          correctContext = "Spring snow is ephemeral, melting away completely the moment the morning sun shines.";
        } else if (wordLower === 'pragmatic') {
          correctContext = "Rather than dreaming of impossible solutions, they chose a pragmatic way forward.";
        } else if (wordLower === 'ubiquitous') {
          correctContext = "Cell towers are now ubiquitous, located on almost every tall hill in the country.";
        }

        const wrongContexts = spec ? [...spec.badContexts] : [
          `I ordered a hot ${item.word} with mustard for lunch today.`,
          `They decided to ${item.word} the house red before moving in.`,
          `My computer became very ${item.word} and crashed three times.`
        ];

        const options = [correctContext, ...wrongContexts].sort(() => 0.5 - Math.random());

        return {
          id: `dyn-q-${idx}-${Date.now()}`,
          type: 'context_choice' as const,
          prompt: `Which of the following scenarios uses the word "${item.word}" in its correct context?`,
          options,
          correctAnswer: correctContext,
          explanation: `"${item.word}" is correctly used in: "${correctContext}".`
        };

      } else if (qTypeIndex === 7) {
        // 8. Synonym Finder
        const correctSynonym = spec ? spec.synonym : (item.translation || "Accurate representation");
        const defaultDistractors = spec ? spec.synDistractors : ["Unrelated concept", "Opposite structure", "Irrelevant word"];

        const options = [correctSynonym, ...defaultDistractors].sort(() => 0.5 - Math.random());

        return {
          id: `dyn-q-${idx}-${Date.now()}`,
          type: 'synonym' as const,
          prompt: `What is the best synonym (similar meaning) for the word "${item.word}"?`,
          options,
          correctAnswer: correctSynonym,
          explanation: `A close synonym of "${item.word}" is "${correctSynonym}".`
        };

      } else if (qTypeIndex === 8) {
        // 9. Antonym Finder
        const correctAntonym = spec ? spec.antonym : "Opposite meaning";
        const defaultDistractors = spec ? spec.antDistractors : ["Similar meaning", "Direct equivalent", "Contextual link"];

        const options = [correctAntonym, ...defaultDistractors].sort(() => 0.5 - Math.random());

        return {
          id: `dyn-q-${idx}-${Date.now()}`,
          type: 'antonym' as const,
          prompt: `What is the best antonym (opposite meaning) for the word "${item.word}"?`,
          options,
          correctAnswer: correctAntonym,
          explanation: `The opposite meaning of "${item.word}" is "${correctAntonym}".`
        };

      } else {
        // 10. Find the Mistake
        let brokenSentence = `She was extremely meticulouse about cleaning her camera lens.`;
        let mistakeWord = `meticulouse`;

        if (spec) {
          brokenSentence = spec.spellingMistakeSentence;
          mistakeWord = spec.spellingMistakeWord;
        } else {
          // generate spelling mistake for custom words
          mistakeWord = item.word.toLowerCase() + "e";
          brokenSentence = `The student submitted an essay containing a highly ${mistakeWord} paragraph.`;
        }

        const tokens = brokenSentence.trim().split(' ').filter(Boolean);

        return {
          id: `dyn-q-${idx}-${Date.now()}`,
          type: 'find_the_mistake' as const,
          prompt: `Tap on the word that contains a spelling or contextual mistake in this sentence:`,
          options: tokens,
          correctAnswer: mistakeWord,
          explanation: `The word "${mistakeWord}" is incorrect. It should be spelled "${item.word}".`
        };
      }
    });

    const deckName = customMode === 'deck' 
      ? (decks.find(d => d.id === selectedDeckId)?.name || 'Custom Deck') 
      : 'Manual Words';

    const generatedQuiz: Quiz = {
      id: `dyn-quiz-${Date.now()}`,
      title: type === 'new' 
        ? 'New Words Quiz' 
        : type === 'old' 
        ? 'Retention & Review Quiz' 
        : type === 'mixed'
        ? 'Ultimate Practice Mix'
        : `Custom Deck Practice (${deckName})`,
      description: type === 'new' 
        ? 'Test yourself on the newest vocabulary items in your dictionary.' 
        : type === 'old' 
        ? 'Power up your retrieval strength by reviewing previous items.' 
        : type === 'mixed'
        ? 'A fully randomized diagnostic test combining newly added words, retention review words, and targeted words needing practice.'
        : `Custom quiz generated on demand for ${customMode === 'deck' ? 'selected flashcard deck' : 'manually typed words'}.`,
      category: 'Vocabulary',
      level: 'B1',
      questionCount: questions.length,
      estimatedTimeMinutes: Math.round(questions.length * 1.5),
      questions,
      status: 'Not started'
    };

    setActiveQuiz(generatedQuiz);
  };

  // Filter logic
  const filteredQuizzes = ALL_QUIZZES.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'All Quizzes') {
      return matchesSearch;
    }
    if (selectedCategory === 'Recently Added') {
      return matchesSearch && q.id === 'everyday_english_vocab';
    }
    return matchesSearch && q.category === selectedCategory;
  });

  const handleStartQuiz = (quizId: string) => {
    const selected = ALL_QUIZZES.find(q => q.id === quizId);
    if (selected) {
      setActiveQuiz(selected);
    }
  };

  // Active quiz render utilizing the imported QuizRunner subcomponent
  if (activeQuiz) {
    return (
      <div id="active-quiz-portal-container" className="w-full max-w-5xl mx-auto px-4 py-8 md:px-6 md:py-10 min-h-screen bg-[#EFF1EE]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-[#D0D2CF]/60 pb-5">
          <div className="flex items-center gap-3">
            <button 
              id="active-quiz-back-btn"
              onClick={() => setActiveQuiz(null)}
              className="flex items-center justify-center w-10 h-10 bg-white border border-[#D0D2CF] rounded-xl hover:bg-stone-50 transition-all cursor-pointer shadow-xs active:scale-95"
              title={t.backToList || 'Return to Practice list'}
            >
              <ArrowLeft className="w-5 h-5 text-[#222222]" />
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#222222]/50">{t.activeSession || 'ACTIVE SESSION'}</span>
              <h1 className="text-xl md:text-2xl font-black text-[#222222] line-clamp-1">{activeQuiz.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black bg-[#A4F5A6] text-[#222222] px-3 py-1 rounded-full uppercase tracking-wider">
              {activeQuiz.category}
            </span>
            <span className="text-xs font-black bg-[#222222] text-[#EFF1EE] px-3 py-1 rounded-full">
              {activeQuiz.level} {t.levelLabel || 'Level'}
            </span>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <QuizRunner 
            settings={settings}
            quiz={activeQuiz} 
            onSaveResult={onSaveQuizHistory}
            onNavigate={(view) => {
              if (view === 'quizzes' || view === 'practice') {
                setActiveQuiz(null);
              } else if (onNavigate) {
                onNavigate(view);
              }
            }} 
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div id="practice-view-container" className="w-full max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-10 min-h-screen bg-[#EFF1EE]">
      
      {/* 1. Header with Title & Live Search bar */}
      <header id="quizzes-view-header" className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#222222]">{t.quizzesTitle || 'Quizzes'}</h1>
          <p className="text-sm md:text-base text-[#666666] font-medium">
            {t.quizzesSubtitle || "Test what you know. Build what you don't."}
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#222222]/40" />
            <input 
              id="quiz-search-bar"
              type="text"
              placeholder={t.searchQuizzesPlaceholder || "Search quizzes..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-11 pe-4 py-3 rounded-2xl border border-[#D0D2CF] bg-white text-[#222222] text-sm font-semibold placeholder:text-[#222222]/30 focus:outline-none focus:border-[#222222] focus:ring-1 focus:ring-[#222222] transition-all"
            />
          </div>
        </div>
      </header>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 mb-8 bg-white/50 p-1.5 rounded-2xl border border-[#D0D2CF] w-fit">
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${
            activeTab === 'quizzes' 
              ? 'bg-[#222222] text-[#EFF1EE] shadow-sm' 
              : 'text-[#222222]/60 hover:text-[#222222] hover:bg-white'
          }`}
        >
          {t.quizzesTab || 'Quizzes'}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
            activeTab === 'history' 
              ? 'bg-[#222222] text-[#EFF1EE] shadow-sm' 
              : 'text-[#222222]/60 hover:text-[#222222] hover:bg-white'
          }`}
        >
          <History className="w-4 h-4" />
          {t.historyTab || 'History'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'quizzes' ? (
          <motion.div
            key="quizzes-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* 3. Recommended For You Section with Isometric 3D Blocks SVG */}
            <section id="recommended-quiz-section" className="mb-12">
              <div className="bg-[#A4F5A6]/10 border border-[#A4F5A6]/30 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-xs hover:border-[#A4F5A6]/60 transition-all">
                <div className="space-y-4 max-w-xl z-10">
                  <span className="text-[10px] font-black tracking-widest text-[#3b9d4e] uppercase">
                    {t.recommendedForYou || 'RECOMMENDED FOR YOU'}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-[#222222] leading-tight">
                    {t.dailyUltimatePracticeMix || 'Daily Ultimate Practice Mix'}
                  </h2>

                  {/* Simple, brand-aligned green pill controller - way much smaller */}
                  <div className="inline-flex items-center justify-between bg-[#A4F5A6]/20 border border-[#A4F5A6]/40 p-1 rounded-full w-44 shadow-xs">
                    <button 
                      type="button"
                      onClick={() => setMixedCount(prev => Math.max(3, prev - 5))}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-stone-50 border border-[#D0D2CF]/60 text-[#222222] rounded-full transition-all cursor-pointer shadow-xs active:scale-95 text-xs font-black"
                      title="Decrease"
                    >
                      —
                    </button>
                    
                    <div className="flex flex-col items-center select-none px-1">
                      <span className="text-[8px] font-black tracking-wider text-[#3b9d4e] uppercase leading-none mb-0.5">{t.sizeLabel || 'SIZE'}</span>
                      <span className="text-xs font-black text-[#222222] leading-none">{mixedCount} {t.qsLabel || 'Qs'}</span>
                    </div>

                    <button 
                      type="button"
                      onClick={() => setMixedCount(prev => Math.min(100, prev + 5))}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-stone-50 border border-[#D0D2CF]/60 text-[#222222] rounded-full transition-all cursor-pointer shadow-xs active:scale-95 text-xs font-black"
                      title="Increase"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Isometric cubes illustration block pile */}
                <div id="isometric-blocks-art" className="hidden lg:block absolute end-52 top-1/2 -translate-y-1/2 pointer-events-none opacity-90 select-none">
                  <svg viewBox="0 0 200 160" className="w-44 h-36 drop-shadow-sm">
                    <g transform="translate(40, 90)">
                      <polygon points="0,-15 25,-30 50,-15 25,0" fill="#EAEAEA" />
                      <polygon points="0,-15 25,0 25,30 0,15" fill="#CCCCCC" />
                      <polygon points="25,0 50,-15 50,15 25,30" fill="#B3B3B3" />
                    </g>
                    <g transform="translate(90, 100)">
                      <polygon points="0,-15 25,-30 50,-15 25,0" fill="#444444" />
                      <polygon points="0,-15 25,0 25,30 0,15" fill="#222222" />
                      <polygon points="25,0 50,-15 50,15 25,30" fill="#111111" />
                    </g>
                    <g transform="translate(70, 70)">
                      <polygon points="0,-15 25,-30 50,-15 25,0" fill="#FFFFFF" />
                      <polygon points="0,-15 25,0 25,30 0,15" fill="#E2E2E2" />
                      <polygon points="25,0 50,-15 50,15 25,30" fill="#D0D0D0" />
                    </g>
                    <g transform="translate(80, 55)">
                      <polygon points="0,-15 25,-30 50,-15 25,0" fill="#C1F9C2" />
                      <polygon points="0,-15 25,0 25,30 0,15" fill="#A4F5A6" />
                      <polygon points="25,0 50,-15 50,15 25,30" fill="#7EE781" />
                    </g>
                    <g transform="translate(145, 45) scale(0.5)">
                      <polygon points="0,-15 25,-30 50,-15 25,0" fill="#C1F9C2" />
                      <polygon points="0,-15 25,0 25,30 0,15" fill="#A4F5A6" />
                      <polygon points="25,0 50,-15 50,15 25,30" fill="#7EE781" />
                    </g>
                    <g transform="translate(15, 50) scale(0.4)">
                      <polygon points="0,-15 25,-30 50,-15 25,0" fill="#FFFFFF" />
                      <polygon points="0,-15 25,0 25,30 0,15" fill="#E2E2E2" />
                      <polygon points="25,0 50,-15 50,15 25,30" fill="#D0D0D0" />
                    </g>
                  </svg>
                </div>

                <button 
                  id="start-rec-quiz-btn"
                  onClick={() => handleStartDynamicQuiz('mixed')}
                  className="px-6 py-4 bg-[#A4F5A6] text-[#222222] border border-[#222222]/15 hover:border-[#222222]/80 font-black text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shrink-0 hover:shadow-xs self-start md:self-auto z-10"
                >
                  <span>{t.startPracticeMix || 'Start Practice Mix'}</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </section>
            
            {/* Quiz Modes Hub */}
            <section id="quiz-modes-hub" className="mb-12 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#222222] tracking-tight">{t.selectQuizMode || 'Select your Quiz Mode'}</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Test New Words */}
          <div id="mode-card-new" className="bg-white border border-[#D0D2CF]/65 p-6 rounded-3xl flex flex-col justify-between hover:border-[#3b9d4e]/70 transition-all shadow-2xs group relative overflow-hidden">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#A4F5A6]/20 border border-[#A4F5A6]/40 rounded-2xl flex items-center justify-center text-emerald-800">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-[#222222] text-lg leading-tight">{t.testNewWords || 'Test New Words'}</h3>
                  <span className="text-[10px] font-black bg-[#A4F5A6] text-[#222222] px-2 py-0.5 rounded-full uppercase">{t.newLabel || 'NEW'}</span>
                </div>
                <p className="text-xs md:text-sm font-semibold text-[#666666] leading-relaxed">
                  {t.testNewWordsDesc || 'Focus specifically on the words you have recently added or collected from document sources.'}
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-[#D0D2CF]/30 flex items-center justify-between">
              <span className="text-xs font-bold text-[#666666]">
                {vocabulary?.length || 0} {t.vocabularyItems || 'vocabulary items'}
              </span>
              <button 
                onClick={() => handleStartDynamicQuiz('new')}
                className="px-4 py-2.5 bg-[#A4F5A6] hover:bg-[#8ee091] text-[#222222] border border-[#222222]/10 font-black text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer active:scale-95"
              >
                <span>{t.generateBtn || 'Generate'}</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Card 2: Words Needing Practice */}
          <div id="mode-card-old" className="bg-white border border-[#D0D2CF]/65 p-6 rounded-3xl flex flex-col justify-between hover:border-[#B2A1FF]/70 transition-all shadow-2xs group relative overflow-hidden">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#B2A1FF]/20 border border-[#B2A1FF]/40 rounded-2xl flex items-center justify-center text-purple-800">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-[#222222] text-lg leading-tight">{t.wordsNeedingPractice || 'Words Needing Practice'}</h3>
                  <span className="text-[10px] font-black bg-[#B2A1FF]/30 text-purple-800 px-2 py-0.5 rounded-full uppercase">{t.priorityLabel || 'Priority'}</span>
                </div>
                <p className="text-xs md:text-sm font-semibold text-[#666666] leading-relaxed">
                  {t.wordsNeedingPracticeDesc || 'Focus on challenging words. The app tracks your answers, lapses, and retention difficulty to generate your customized practice list.'}
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-[#D0D2CF]/30 flex items-center justify-between">
              <span className="text-xs font-bold text-[#666666]">
                {challengingWordsCount > 0 ? `${challengingWordsCount} ${t.challengingWords || 'challenging words'}` : (t.smartPriorityList || 'Smart priority list')}
              </span>
              <button 
                onClick={() => handleStartDynamicQuiz('old')}
                className="px-4 py-2.5 bg-[#B2A1FF]/30 hover:bg-[#B2A1FF]/50 text-purple-950 font-black text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer active:scale-95"
              >
                <span>{t.reviewBtn || 'Review'}</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Card 3: Custom Quiz Engine */}
          <div id="mode-card-custom" className="bg-[#222222] text-[#EFF1EE] p-6 rounded-3xl flex flex-col justify-between shadow-2xs relative overflow-hidden border border-[#222222]">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#A4F5A6]">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg leading-tight text-white mb-1">{t.customQuizBuilder || 'Custom Quiz Builder'}</h3>
                <p className="text-[11px] text-stone-400 font-bold leading-tight">{t.customQuizBuilderDesc || 'Generate a personalized practice session instantly.'}</p>
              </div>

              {/* Mode Toggle Tabs */}
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => { setCustomMode('deck'); setCustomError(null); }}
                  className={`flex-1 py-1.5 text-center text-xs font-black rounded-lg transition-all cursor-pointer ${
                    customMode === 'deck'
                      ? 'bg-[#A4F5A6] text-[#222222]'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {t.chooseDeck || 'Choose Deck'}
                </button>
                <button
                  type="button"
                  onClick={() => { setCustomMode('manual'); setCustomError(null); }}
                  className={`flex-1 py-1.5 text-center text-xs font-black rounded-lg transition-all cursor-pointer ${
                    customMode === 'manual'
                      ? 'bg-[#A4F5A6] text-[#222222]'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {t.typeWords || 'Type Words'}
                </button>
              </div>
              
              {/* Form Controls */}
              <div className="space-y-3 text-xs text-[#222222]">
                {customMode === 'deck' ? (
                  <>
                    {/* Deck Selection */}
                    <div className="flex flex-col gap-1.5 bg-white/5 p-3 rounded-xl border border-white/10 text-[#EFF1EE]">
                      <span className="font-black text-stone-400">{t.flashcardDeckLabel || 'Flashcard Deck:'}</span>
                      {decks.length > 0 ? (
                        <select 
                          value={selectedDeckId} 
                          onChange={(e) => setSelectedDeckId(e.target.value)}
                          className="bg-transparent text-[#EFF1EE] border-none font-bold focus:outline-none cursor-pointer w-full text-xs"
                        >
                          {decks.map(d => (
                            <option key={d.id} value={d.id} className="bg-[#222222] text-white">
                              {d.name} ({vocabulary.filter(v => v.deckId === d.id).length} {t.words || 'words'})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="text-stone-400 font-bold italic py-1">{t.noDecksAvailable || 'No decks available. Create one in Flashcards first!'}</div>
                      )}
                    </div>

                    {/* Questions Count Selection */}
                    <div className="flex items-center justify-between gap-2 bg-white/5 p-3 rounded-xl border border-white/10 text-[#EFF1EE]">
                      <span className="font-black text-stone-400">{t.questionsLabel || 'Questions:'}</span>
                      <select 
                        value={customCount} 
                        onChange={(e) => setCustomCount(Number(e.target.value))}
                        className="bg-transparent text-[#EFF1EE] border-none font-bold focus:outline-none cursor-pointer text-xs"
                      >
                        <option value={5} className="bg-[#222222]">5 {t.questionsCountText || 'Questions'}</option>
                        <option value={10} className="bg-[#222222]">10 {t.questionsCountText || 'Questions'}</option>
                        <option value={15} className="bg-[#222222]">15 {t.questionsCountText || 'Questions'}</option>
                        <option value={20} className="bg-[#222222]">20 {t.questionsCountText || 'Questions'}</option>
                      </select>
                    </div>
                  </>
                ) : (
                  /* Manual input mode */
                  <div className="flex flex-col gap-2 bg-white/5 p-3 rounded-xl border border-white/10 text-[#EFF1EE]">
                    <span className="font-black text-stone-400">{t.typeOrPasteWords || 'Type or paste words:'}</span>
                    <textarea
                      value={manualWordsInput}
                      onChange={(e) => setManualWordsInput(e.target.value)}
                      placeholder="e.g. Pernicious, Serendipity, Resilient"
                      rows={3}
                      className="w-full bg-[#111111]/60 text-white rounded-lg p-2 font-semibold text-xs border border-white/10 focus:outline-none focus:border-[#A4F5A6] placeholder:text-stone-500 resize-none"
                    />
                    <p className="text-[10px] text-stone-400 leading-normal">
                      {t.separateWordsDesc || "Separate words with commas, semicolons, or newlines. We'll automatically generate definitions for them!"}
                    </p>
                  </div>
                )}
              </div>

              {/* Graceful Dynamic Error Banner */}
              {customError && (
                <div className="text-[11px] font-bold text-red-300 bg-red-950/40 border border-red-900/60 p-2.5 rounded-xl">
                  {customError}
                </div>
              )}
            </div>

            <button 
              onClick={() => handleStartDynamicQuiz('custom')}
              className="mt-6 w-full py-3 bg-[#A4F5A6] hover:bg-[#8ee091] text-[#222222] font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md"
            >
              <span>{t.buildAndStart || 'Build & Start'}</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </section>

    </motion.div>
        ) : (
          <motion.div
            key="history-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <QuizHistoryView 
              history={quizHistory} 
              settings={settings} 
              onSelectQuiz={handleStartQuiz}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
