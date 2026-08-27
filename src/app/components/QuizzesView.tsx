// @ts-nocheck
import { getTranslation } from '../utils/i18n';
import React, { useState } from 'react';
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
  BookText
} from 'lucide-react';
import { Quiz, AppView, QuizHistory } from '../types';
import { QuizRunner } from './QuizRunner';

interface QuizzesViewProps {
  settings?: any;
  onNavigate?: (view: AppView) => void;
  onSaveQuizHistory?: (result: Omit<QuizHistory, 'id'>) => void;
}

// Complete interactive quizzes with real educational questions
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
        correctAnswer: 'Punctual',
        explanation: 'Punctual means happening or doing something at the agreed or proper time; on time.'
      },
      { 
        id: 'ee-2', 
        type: 'multiple_choice', 
        prompt: 'Choose the word that means "to make something more clear or easier to understand":', 
        options: ['Clarify', 'Complicate', 'Classify', 'Conceal'], 
        correctAnswer: 'Clarify',
        explanation: 'Clarify means to make an action, statement, or situation less confused and more clearly comprehensible.'
      },
      { 
        id: 'ee-3', 
        type: 'multiple_choice', 
        prompt: 'Which word describes a person who has a strong desire to succeed or achieve?', 
        options: ['Ambitious', 'Anxious', 'Apathetic', 'Arrogant'], 
        correctAnswer: 'Ambitious',
        explanation: 'Ambitious means having or showing a strong desire and determination to succeed.'
      },
      { 
        id: 'ee-4', 
        type: 'multiple_choice', 
        prompt: 'If something is extremely small, it is ________.', 
        options: ['Microscopic', 'Substantial', 'Infinite', 'Obvious'], 
        correctAnswer: 'Microscopic',
        explanation: 'Microscopic refers to things that are so small as to be visible only with a microscope.'
      },
      { 
        id: 'ee-5', 
        type: 'multiple_choice', 
        prompt: 'What is the synonym for "generous"?', 
        options: ['Benevolent', 'Hostile', 'Greedy', 'Ignorant'], 
        correctAnswer: 'Benevolent',
        explanation: 'Benevolent means well-meaning and kindly, which is a strong synonym for generous.'
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
        correctAnswer: 'Baggage claim',
        explanation: 'The baggage claim area is where travelers retrieve checked luggage after arriving on a flight.'
      },
      { 
        id: 'tr-2', 
        type: 'multiple_choice', 
        prompt: 'An "itinerary" is best described as:', 
        options: ['A planned route or journey schedule', 'A passport cover', 'An airline meal', 'A travel insurance policy'], 
        correctAnswer: 'A planned route or journey schedule',
        explanation: 'An itinerary is a detailed plan, route, or schedule for a journey.'
      },
      { 
        id: 'tr-3', 
        type: 'multiple_choice', 
        prompt: 'What do hotels call the process when you return your room key and pay the final bill?', 
        options: ['Check-out', 'Check-in', 'Reservation', 'Valet service'], 
        correctAnswer: 'Check-out',
        explanation: 'Checking out is the formal procedure of leaving a hotel after settling the bill.'
      },
      { 
        id: 'tr-4', 
        type: 'multiple_choice', 
        prompt: 'If a flight is "delayed", it means it is:', 
        options: ['Late', 'Cancelled', 'On time', 'Overbooked'], 
        correctAnswer: 'Late',
        explanation: 'Delayed means the departure or arrival is postponed to a later time.'
      },
      { 
        id: 'tr-5', 
        type: 'multiple_choice', 
        prompt: 'What is the term for a ticket that allows you to travel to a destination and back?', 
        options: ['Round-trip ticket', 'One-way ticket', 'Boarding pass', 'Voucher'], 
        correctAnswer: 'Round-trip ticket',
        explanation: 'A round-trip ticket is a travel document enabling journey to a destination and returning.'
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

export const QuizzesView: React.FC<QuizzesViewProps> = ({ settings,  onNavigate, onSaveQuizHistory }) => {
  const t = getTranslation(settings?.interfaceLanguage || 'English');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Quizzes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  // Filter logic
  const filteredQuizzes = ALL_QUIZZES.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'All Quizzes') {
      return matchesSearch;
    }
    if (selectedCategory === 'Recently Added') {
      return matchesSearch && q.id === 'everyday_english_vocab'; // mock a recently added criteria
    }
    return matchesSearch && q.category === selectedCategory;
  });

  const handleStartQuiz = (quizId: string) => {
    const selected = ALL_QUIZZES.find(q => q.id === quizId);
    if (selected) {
      setActiveQuiz(selected);
    }
  };

  // If a quiz is currently running, embed the QuizRunner cleanly with a header
  if (activeQuiz) {
    return (
      <div id="active-quiz-container" className="w-full max-w-5xl mx-auto px-4 py-8 md:px-6 md:py-10 min-h-screen bg-[#EFF1EE]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-[#D0D2CF]/60 pb-5">
          <div className="flex items-center gap-3">
            <button 
              id="quiz-back-btn"
              onClick={() => setActiveQuiz(null)}
              className="flex items-center justify-center w-10 h-10 bg-white border border-[#D0D2CF] rounded-xl hover:bg-stone-50 transition-all cursor-pointer shadow-xs active:scale-95"
              title={t.backToList || 'Return to list'}
            >
              <ArrowLeft className="w-5 h-5 text-[#222222]" />
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#222222]/50">{t.activeSession || 'ACTIVE QUIZ'}</span>
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
              if (view === 'quizzes') {
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
    <div id="quizzes-view-container" className="w-full max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-10 min-h-screen bg-[#EFF1EE]">
      
      {/* 1. Header with Title & Live Search bar */}
      <header id="quizzes-view-header" className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#222222]">{t.quizzesTitle || 'Quizzes'}</h1>
          <p className="text-sm md:text-base text-[#666666] font-medium">
            {t.quizzesSubtitle || "Test what you know. Build what you don't."}
          </p>
        </div>

        {/* Search Bar & Actions Container */}
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
          <button 
            id="header-notification-btn"
            className="w-11 h-11 bg-white border border-[#D0D2CF] text-[#222222] flex items-center justify-center rounded-full hover:bg-[#D0D2CF]/20 transition-all cursor-pointer shadow-xs relative"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1 end-1 w-2.5 h-2.5 bg-[#A4F5A6] rounded-full ring-2 ring-white" />
          </button>
          <div 
            id="header-avatar-circle"
            className="w-11 h-11 bg-[#222222] text-[#EFF1EE] border border-[#222222] flex items-center justify-center rounded-full font-black text-sm select-none shadow-xs"
            title={t.userProfile || "User Profile"}
          >
            ME
          </div>
        </div>
      </header>

      {/* 2. Scrollable Category Pills */}
      <nav id="quizzes-category-tabs" className="mb-8 overflow-x-auto custom-scrollbar flex gap-2 pb-2">
        {[
          { key: 'All Quizzes', label: t.allQuizzes || 'All Quizzes' }, 
          { key: 'Vocabulary', label: t.vocabularyCat || 'Vocabulary' }, 
          { key: 'Grammar', label: t.grammarCat || 'Grammar' }, 
          { key: 'Listening', label: t.listeningCat || 'Listening' }, 
          { key: 'Reading', label: t.readingCat || 'Reading' }, 
          { key: 'Translation', label: t.translationCat || 'Translation' }, 
          { key: 'Mixed', label: t.mixedCat || 'Mixed' }, 
          { key: 'Recently Added', label: t.recentlyAddedCat || 'Recently Added' }
        ].map(({ key: category, label }) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              id={`cat-pill-${category.replace(/\s+/g, '-').toLowerCase()}`}
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-[#A4F5A6] text-[#222222] shadow-xs scale-[1.02]' 
                  : 'bg-white border border-[#D0D2CF]/60 text-[#222222]/70 hover:bg-[#D0D2CF]/15'
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>

      {/* 3. Recommended For You Section with Isometric 3D Blocks SVG */}
      <section id="recommended-quiz-section" className="mb-12">
        <div className="bg-[#A4F5A6]/10 border border-[#A4F5A6]/30 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-xs hover:border-[#A4F5A6]/60 transition-all">
          <div className="space-y-4 max-w-xl z-10">
            <span className="text-[10px] font-black tracking-widest text-[#3b9d4e] uppercase">
              {t.recommendedForYou || 'RECOMMENDED FOR YOU'}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#222222] leading-tight">
              {t.everydayEnglishVocab || 'Everyday English Vocabulary'}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-[#222222]/70">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#D0D2CF]/40">
                <BookText className="w-4 h-4 text-[#222222]/50" /> 
                20 {t.questionsCountText || 'questions'}
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#D0D2CF]/40">
                <Brain className="w-4 h-4 text-[#222222]/50" /> 
                B1 {t.levelLabel || 'Level'}
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#D0D2CF]/40">
                <Clock className="w-4 h-4 text-[#222222]/50" /> 
                ~8 min
              </span>
              <span className="bg-[#A4F5A6] text-[#222222] px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase">
                {t.vocabularyCat || 'Vocabulary'}
              </span>
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
            onClick={() => handleStartQuiz('everyday_english_vocab')}
            className="px-6 py-4 bg-[#A4F5A6] text-[#222222] border border-[#222222]/15 hover:border-[#222222] font-black text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shrink-0 hover:shadow-xs self-start md:self-auto z-10"
          >
            <span>{t.startQuiz || 'Start Quiz'}</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </section>

      {/* 4. Browse By Category Section */}
      <section id="browse-by-category-section" className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-[#222222]">{t.browseByCategory || 'Browse by category'}</h2>
          <button 
            onClick={() => setSelectedCategory('All Quizzes')}
            className="inline-flex items-center gap-1 text-xs font-black text-[#222222] hover:underline"
          >
            <span>{t.viewAll || 'View all'}</span>
            <ChevronRight className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { id: 'Vocabulary', label: t.vocabularyCat || 'Vocabulary', count: `24 ${t.quizzesTitle?.toLowerCase() || 'quizzes'}`, level: 'A1 - C2', gradient: 'from-[#A4F5A6]/10', border: 'border-[#A4F5A6]/30', hover: 'hover:border-[#A4F5A6]/80', icon: BookOpen, iconCol: 'text-emerald-700 bg-[#A4F5A6]/40' },
            { id: 'Grammar', label: t.grammarCat || 'Grammar', count: `18 ${t.quizzesTitle?.toLowerCase() || 'quizzes'}`, level: 'A1 - C2', gradient: 'from-[#B2A1FF]/10', border: 'border-[#B2A1FF]/30', hover: 'hover:border-[#B2A1FF]/80', icon: Pencil, iconCol: 'text-purple-700 bg-[#B2A1FF]/40' },
            { id: 'Listening', label: t.listeningCat || 'Listening', count: `16 ${t.quizzesTitle?.toLowerCase() || 'quizzes'}`, level: 'A2 - C1', gradient: 'from-[#A4F5A6]/10', border: 'border-[#A4F5A6]/30', hover: 'hover:border-[#A4F5A6]/80', icon: Headphones, iconCol: 'text-emerald-700 bg-[#A4F5A6]/40' },
            { id: 'Reading', label: t.readingCat || 'Reading', count: `12 ${t.quizzesTitle?.toLowerCase() || 'quizzes'}`, level: 'A2 - C1', gradient: 'from-[#B2A1FF]/10', border: 'border-[#B2A1FF]/30', hover: 'hover:border-[#B2A1FF]/80', icon: BookText, iconCol: 'text-purple-700 bg-[#B2A1FF]/40' },
            { id: 'Translation', label: t.translationCat || 'Translation', count: `14 ${t.quizzesTitle?.toLowerCase() || 'quizzes'}`, level: 'A1 - C2', gradient: 'from-[#A4F5A6]/10', border: 'border-[#A4F5A6]/30', hover: 'hover:border-[#A4F5A6]/80', icon: Languages, iconCol: 'text-emerald-700 bg-[#A4F5A6]/40' },
            { id: 'Mixed', label: t.mixedCat || 'Mixed', count: `20 ${t.quizzesTitle?.toLowerCase() || 'quizzes'}`, level: 'A1 - C2', gradient: 'from-[#B2A1FF]/10', border: 'border-[#B2A1FF]/30', hover: 'hover:border-[#B2A1FF]/80', icon: Sparkles, iconCol: 'text-purple-700 bg-[#B2A1FF]/40' },
          ].map((cat) => {
            const IconComp = cat.icon;
            const isFilterActive = selectedCategory === cat.id;
            return (
              <button
                id={`browse-cat-${cat.id.toLowerCase()}`}
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col text-start p-5 rounded-3xl bg-white bg-gradient-to-br ${cat.gradient} to-transparent border ${isFilterActive ? 'border-neutral-800 ring-1 ring-neutral-800' : `${cat.border} ${cat.hover}`} hover:shadow-xs transition-all relative group cursor-pointer overflow-hidden`}
              >
                {/* Visual Circle Blob */}
                <div className="absolute -top-3 -end-3 w-14 h-14 bg-stone-100/40 rounded-full blur-sm group-hover:scale-125 transition-transform" />

                {/* Styled Category Circle Icon */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-5 ${cat.iconCol} shrink-0`}>
                  <IconComp className="w-4.5 h-4.5" />
                </div>

                <div className="space-y-1 mt-auto">
                  <h3 className="font-black text-[#222222] text-sm md:text-base tracking-tight leading-none mb-1 group-hover:translate-x-0.5 transition-transform">
                    {cat.label}
                  </h3>
                  <p className="text-xs font-semibold text-[#666666] leading-none mb-0.5">{cat.count}</p>
                  <p className="text-[10px] font-black text-[#222222]/40 leading-none">{cat.level}</p>
                </div>

                {/* Tiny bottom-right circular button */}
                <div className="absolute bottom-4 end-4 w-7 h-7 bg-stone-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-[#D0D2CF]/40">
                  <ChevronRight className="w-3.5 h-3.5 text-[#222222]" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Two Columns: Continue Session & Recently Completed */}
      <div id="bottom-quizzes-cols" className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Column Left: Continue session (Grid Col 7) */}
        <div id="continue-section-col" className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-black text-[#222222]">Continue where you left off</h2>
          
          <div className="bg-white border border-[#D0D2CF]/60 p-5 rounded-3xl flex flex-col sm:flex-row gap-5 items-stretch relative group hover:border-[#222222]/40 hover:shadow-xs transition-all">
            
            {/* Image panel */}
            <div className="relative w-full sm:w-36 h-36 shrink-0 rounded-2xl overflow-hidden shadow-xs border border-stone-200">
              <img 
                src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80" 
                alt="Travel Vocabulary Background"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/5" />
            </div>

            {/* Details panel */}
            <div className="flex-1 flex flex-col justify-between py-1 relative">
              <div className="absolute end-0 top-0 text-[#222222]/40 cursor-pointer hover:text-[#222222]">
                <MoreVertical className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-lg font-black text-[#222222] mb-3">Travel Vocabulary</h3>
                
                {/* Custom Progress Bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-[11px] font-bold text-[#666666]">
                    <span>Progress</span>
                    <span className="font-extrabold text-[#3b9d4e]">12 / 20 questions</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#EFF1EE] rounded-full overflow-hidden">
                    <div className="h-full bg-[#A4F5A6] rounded-full w-[60%]" />
                  </div>
                </div>

                {/* Badge tags Row */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold bg-[#EFF1EE] text-[#222222]/70 px-2.5 py-1 rounded-full border border-[#D0D2CF]/30">
                    Vocabulary
                  </span>
                  <span className="text-[10px] font-bold bg-[#EFF1EE] text-[#222222]/70 px-2.5 py-1 rounded-full border border-[#D0D2CF]/30">
                    B1
                  </span>
                  <span className="text-[10px] font-bold bg-[#EFF1EE] text-[#222222]/70 px-2.5 py-1 rounded-full border border-[#D0D2CF]/30">
                    ~10 min
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button 
                id="continue-travel-quiz-btn"
                onClick={() => handleStartQuiz('travel_vocab_quiz')}
                className="px-5 py-2.5 bg-[#A4F5A6] text-[#222222] border border-[#222222]/10 hover:border-[#222222] font-black text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 self-end mt-4 sm:mt-0"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Column Right: Recently Completed (Grid Col 5) */}
        <div id="recent-completed-col" className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#222222]">Recently completed</h2>
            <button 
              onClick={() => setSelectedCategory('All Quizzes')}
              className="inline-flex items-center gap-1 text-xs font-black text-[#222222] hover:underline"
            >
              <span>View all</span>
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>

          <div className="bg-white border border-[#D0D2CF]/60 rounded-3xl p-5 divide-y divide-[#D0D2CF]/30 shadow-xs space-y-3">
            
            {/* Row 1: Airport & Travel */}
            <div 
              id="recent-item-airport"
              onClick={() => handleStartQuiz('airport_travel_quiz')}
              className="flex items-center justify-between pb-3 pt-1 group cursor-pointer hover:bg-stone-50/40 rounded-xl px-2 transition-all"
            >
              <div className="flex items-center gap-3.5">
                {/* Circle Plane Icon */}
                <div className="w-10 h-10 rounded-full bg-[#A4F5A6]/25 border border-[#A4F5A6]/45 text-emerald-800 flex items-center justify-center shrink-0">
                  <Plane className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-black text-[#222222] text-sm group-hover:text-[#3b9d4e] transition-colors">
                    Airport & Travel
                  </h4>
                  <p className="text-[11px] font-bold text-[#666666]">20 questions • Vocabulary</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-end">
                <div>
                  <div className="font-black text-[#222222] text-sm">18 / 20</div>
                  <div className="text-[10px] font-black text-[#3b9d4e]">90%</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#222222]/30 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Row 2: Past Simple Tense */}
            <div 
              id="recent-item-pastsimple"
              onClick={() => handleStartQuiz('past_simple_tense')}
              className="flex items-center justify-between pt-3 pb-1 group cursor-pointer hover:bg-stone-50/40 rounded-xl px-2 transition-all"
            >
              <div className="flex items-center gap-3.5">
                {/* Circle Message Icon */}
                <div className="w-10 h-10 rounded-full bg-[#B2A1FF]/25 border border-[#B2A1FF]/45 text-purple-800 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-black text-[#222222] text-sm group-hover:text-purple-700 transition-colors">
                    Past Simple Tense
                  </h4>
                  <p className="text-[11px] font-bold text-[#666666]">15 questions • Grammar</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-end">
                <div>
                  <div className="font-black text-[#222222] text-sm">12 / 15</div>
                  <div className="text-[10px] font-black text-[#3b9d4e]">80%</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#222222]/30 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 6. Dynamic filtered list of individual Quizzes under active category */}
      {selectedCategory !== 'All Quizzes' && (
        <section id="filtered-available-quizzes" className="mt-12 pt-8 border-t border-[#D0D2CF]/45">
          <div className="mb-6">
            <h3 className="text-xl font-black text-[#222222]">
              Quizzes in {selectedCategory}
            </h3>
            <p className="text-xs font-bold text-[#666666] mt-1">
              Found {filteredQuizzes.length} available {filteredQuizzes.length === 1 ? 'quiz' : 'quizzes'}.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {filteredQuizzes.map((quiz) => (
              <div 
                id={`quiz-card-${quiz.id}`}
                key={quiz.id} 
                className="bg-white border border-[#D0D2CF]/60 p-6 rounded-3xl flex flex-col justify-between hover:border-[#222222]/50 transition-all group shadow-2xs"
              >
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="text-lg font-black text-[#222222] group-hover:text-[#3b9d4e] transition-colors leading-tight">
                      {quiz.title}
                    </h4>
                    <span className="text-[10px] font-black bg-[#EFF1EE] text-[#222222] px-2.5 py-1 rounded-full border border-[#D0D2CF]/30 uppercase tracking-wider shrink-0">
                      {quiz.level}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-[#666666] leading-relaxed line-clamp-2">
                    {quiz.description}
                  </p>
                  <div className="inline-block text-[9px] font-black uppercase bg-[#EFF1EE] text-[#222222] px-2.5 py-1 rounded-full border border-[#D0D2CF]/30">
                    {quiz.category}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-[#D0D2CF]/25">
                  <span className="text-xs font-bold text-[#666666]">
                    {quiz.questionCount} questions • {quiz.estimatedTimeMinutes} min
                  </span>
                  <button 
                    id={`start-quiz-btn-${quiz.id}`}
                    onClick={() => handleStartQuiz(quiz.id)}
                    className="px-4.5 py-2.5 bg-[#222222] text-[#EFF1EE] border border-[#222222] hover:bg-stone-800 rounded-xl font-black text-xs transition-all cursor-pointer active:scale-95"
                  >
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
