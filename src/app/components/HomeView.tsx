// @ts-nocheck
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserStats, VocabularyItem, ReaderSettings, AppView, DocumentFile } from '../types';
import { getLocalDateString, calculateStreak } from '../utils/stats';
import { getTranslation, SupportedLanguage } from '../utils/i18n';
import { getEffectiveAvatar } from '../utils/defaultAvatars';
import { Search, Bell, BookOpen, GraduationCap, ClipboardCheck, RefreshCw, ChevronDown, ShieldCheck, Plus, ChevronRight } from 'lucide-react';
import { storage } from '../utils/storage';
import { LANGUAGE_OPTIONS } from './DualFlagLanguageSelector';
import { tracker, useTrackSectionVisibility } from '../utils/tracker';

const DEFAULT_CONTINUE_BOOKS: Array<DocumentFile & { coverGradient?: string }> = [
  {
    id: 'sample-book-1',
    name: 'Brilliant Ideas & Notes',
    title: 'Brilliant Ideas & Notes',
    author: 'Lingoflow Studio',
    language: 'English',
    fileType: 'sample',
    size: 1024,
    uploadedAt: 1700000000300,
    lastReadAt: 1700000000300,
    currentPage: 18,
    totalPages: 120,
    coverColor: '#728591',
    coverGradient: 'from-[#728591] via-[#5D6F7A] to-[#4B5963]',
    isSample: true,
  },
  {
    id: 'sample-book-2',
    name: 'Read People Like a Book',
    title: 'Read People Like a Book',
    author: 'Patrick King',
    language: 'English',
    fileType: 'sample',
    size: 1024,
    uploadedAt: 1700000000200,
    lastReadAt: 1700000000200,
    currentPage: 34,
    totalPages: 240,
    coverColor: '#1F3A4B',
    coverGradient: 'from-[#1F3A4B] via-[#172D3A] to-[#101E28]',
    isSample: true,
  },
  {
    id: 'sample-book-3',
    name: 'The Body Keeps the Score',
    title: 'The Body Keeps the Score',
    author: 'Bessel van der Kolk, M.D.',
    language: 'English',
    fileType: 'sample',
    size: 1024,
    uploadedAt: 1700000000100,
    lastReadAt: 1700000000100,
    currentPage: 88,
    totalPages: 464,
    coverColor: '#D98236',
    coverGradient: 'from-[#D98236] via-[#BE6A22] to-[#984E13]',
    isSample: true,
  },
];

interface HomeViewProps {
  userStats: UserStats;
  vocabulary: VocabularyItem[];
  documents?: DocumentFile[];
  onSelectDocument?: (doc: DocumentFile) => void;
  settings?: ReaderSettings;
  onNavigate?: (view: AppView) => void;
  onTriggerOnboarding?: () => void;
  currentUserRole?: string;
  userName?: string;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
}

type ProgressTimeframe = 'week' | 'month' | 'year';

// Locale tags map for standard BCP 47 locale parameters
const localeMap: Record<SupportedLanguage, string> = {
  English: 'en-US',
  French: 'fr-FR',
  Arabic: 'ar-SA',
  Spanish: 'es-ES',
  German: 'de-DE'
};

// Localized titles for progress charts
const chartTitles: Record<SupportedLanguage, { week: string; year: string; month: string }> = {
  English: {
    week: 'Daily Actions',
    year: 'Yearly Vocabulary',
    month: 'Words Over Time'
  },
  French: {
    week: 'Actions quotidiennes',
    year: 'Vocabulaire annuel',
    month: 'Évolution des mots'
  },
  Arabic: {
    week: 'الأنشطة اليومية',
    year: 'المفردات السنوية',
    month: 'الكلمات بمرور الوقت'
  },
  Spanish: {
    week: 'Acciones diarias',
    year: 'Vocabulario anual',
    month: 'Palabras a lo largo del tiempo'
  },
  German: {
    week: 'Tägliche Aktionen',
    year: 'Jährlicher Wortschatz',
    month: 'Wortschatzentwicklung'
  }
};

// HomeView Component
// Acts as the primary dashboard for the user upon logging in.
// Features:
// 1. Heatmap display showing daily activity streaks and study history
// 2. High-level metric summary (Total learned, Daily goal progress)
// 3. Quick-start action buttons linking to Reader and Flashcard sections
export const HomeView: React.FC<HomeViewProps> = ({ 
  userStats, 
  vocabulary, 
  documents,
  onSelectDocument,
  settings, 
  onNavigate, 
  onTriggerOnboarding,
  currentUserRole, 
  userName, 
  onOpenSearch,
  onOpenNotifications,
  unreadNotificationsCount = 0
}) => {
  const currentLang = (settings?.interfaceLanguage || settings?.targetLanguage || 'English') as SupportedLanguage;
  const t = getTranslation(currentLang);
  const displayName = userName || settings?.userName || 'Learner';
  const activeLocale = localeMap[currentLang] || 'en-US';
  const dailyGoal = userStats.dailyGoal || 10;

  // Active user ID for storage queries
  const activeId = localStorage.getItem('lingoflow_current_user_id') || 'usr-1';

  // Sort and retrieve the 3 most recently read or uploaded books
  const continueReadingBooks = useMemo(() => {
    const userDocs = (documents && documents.length > 0 
      ? documents 
      : storage.getDocuments(activeId)) || [];

    const sorted = [...userDocs].sort((a, b) => {
      const timeA = a.lastReadAt || a.uploadedAt || 0;
      const timeB = b.lastReadAt || b.uploadedAt || 0;
      return timeB - timeA;
    });

    const result: Array<DocumentFile & { coverGradient?: string }> = [];
    
    // Add user documents
    sorted.forEach((doc) => {
      if (result.length < 3) {
        result.push(doc);
      }
    });

    // Fill remaining slots up to 3 with DEFAULT_CONTINUE_BOOKS if needed
    DEFAULT_CONTINUE_BOOKS.forEach((defDoc) => {
      if (result.length < 3 && !result.some((r) => r.id === defDoc.id || r.title === defDoc.title)) {
        result.push(defDoc);
      }
    });

    return result.slice(0, 3);
  }, [documents, activeId]);
  const [timeframe, setTimeframe] = useState<30 | 100 | 150>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 30;
    }
    return 150;
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setTimeframe(30);
    }
  }, []);
  const [progressTimeframe, setProgressTimeframe] = useState<ProgressTimeframe>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Analytics Visibility Tracking Refs
  const statsOverviewRef = useRef<HTMLDivElement>(null);
  const vocabChartRef = useRef<HTMLDivElement>(null);
  const languageProfilesRef = useRef<HTMLDivElement>(null);

  useTrackSectionVisibility('stats_overview', statsOverviewRef);
  useTrackSectionVisibility('vocabulary_chart', vocabChartRef);
  useTrackSectionVisibility('language_profiles_status', languageProfilesRef);

  // Global stable aggregation across all language profiles
  const globalStats = useMemo(() => {
    let totalVocabAll = 0;
    let totalLearnedAll = 0;
    let totalMasteredAll = 0;
    let totalReviewsAll = 0;
    let totalLapsesAll = 0;
    let maxStreakAll = 0;
    const combinedHistory: Record<string, number> = {};
    const langStatuses: Array<{ name: string; flag: string; vocab: number; books: number; streak: number; status: string }> = [];

    LANGUAGE_OPTIONS.forEach(lang => {
      const cleanLang = lang.name.toLowerCase().trim().replace(/\s+/g, '_');
      const vocab = storage.getVocabulary(activeId, cleanLang);
      const docs = storage.getDocuments(activeId, cleanLang);
      const stats = storage.getUserStats(activeId, cleanLang);

      const streak = stats?.currentStreak || 0;
      if (streak > maxStreakAll) maxStreakAll = streak;

      totalVocabAll += vocab.length;
      const learned = vocab.filter(v => v.srs && (v.srs.state !== 'new' || v.srs.repetitions > 0)).length;
      totalLearnedAll += learned;
      const mastered = vocab.filter(v => v.srs && v.srs.state === 'review' && v.srs.intervalDays >= 21).length;
      totalMasteredAll += mastered;
      totalReviewsAll += vocab.reduce((acc, v) => acc + (v.srs?.repetitions || 0), 0);
      totalLapsesAll += vocab.reduce((acc, v) => acc + (v.srs?.lapses || 0), 0);

      if (stats && stats.activityHistory) {
        Object.entries(stats.activityHistory).forEach(([dateStr, count]) => {
          combinedHistory[dateStr] = Math.max(combinedHistory[dateStr] || 0, count as number);
        });
      }

      const isActive = vocab.length > 0 || docs.length > 0 || streak > 0;
      if (isActive) {
        langStatuses.push({
          name: lang.name,
          flag: lang.flag,
          vocab: vocab.length,
          books: docs.length,
          streak,
          status: 'Active'
        });
      }
    });

    const globalStreak = calculateStreak(combinedHistory, dailyGoal);
    const effectiveStreak = Math.max(globalStreak, maxStreakAll);

    return {
      totalVocabAll,
      totalLearnedAll,
      totalMasteredAll,
      totalReviewsAll,
      totalLapsesAll,
      effectiveStreak,
      combinedHistory,
      langStatuses
    };
  }, [activeId, dailyGoal, vocabulary, userStats]);

  const currentStreak = globalStats.effectiveStreak;
  const activityHistory = globalStats.combinedHistory;

  // 2. Calculate Today's Goal Progress
  const todayStr = getLocalDateString(new Date());
  const todayActivity = activityHistory[todayStr] || 0;
  const todayRatio = dailyGoal > 0 ? todayActivity / dailyGoal : 0;
  const goalProgress = Math.min(100, Math.round(todayRatio * 100));

  // 3. Calculate Words Mastered & Learned
  const wordsLearned = globalStats.totalLearnedAll;
  const wordsMastered = globalStats.totalMasteredAll;
  const totalWords = globalStats.totalVocabAll;
  const totalReviews = globalStats.totalReviewsAll;
  const totalLapses = globalStats.totalLapsesAll;
  const retentionRate = totalReviews > 0 ? Math.max(0, Math.min(100, Math.round(((totalReviews - totalLapses) / totalReviews) * 100))) : 0;

  // 4. Generate the last N days of activity for Intensity Heatmap in chronological order (oldest to today)
  const now = new Date();
  const daysData = [];
  for (let i = timeframe - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dStr = getLocalDateString(d);
    const activity = activityHistory[dStr] || 0;
    const ratio = dailyGoal > 0 ? activity / dailyGoal : 0;

    let colorClass = "bg-[#EFF1EE] border border-[#D0D2CF]"; // 0% activity
    let label = t.noActivity || "No activity";

    if (activity > 0) {
      if (ratio < 0.35) {
        colorClass = "bg-[#D4FBD5]"; // Light green level (< 35%)
        label = `${activity} ${t.actionsCount || 'actions'}`;
      } else if (ratio < 0.75) {
        colorClass = "bg-[#A4F5A6]"; // Medium green level (35% - 75%)
        label = `${activity} ${t.actionsCount || 'actions'}`;
      } else if (ratio < 1.15) {
        colorClass = "bg-[#92E894]"; // Bright green level (75% - 115%)
        label = `${activity} ${t.actionsCount || 'actions'}`;
      } else {
        colorClass = "bg-[#222222] text-[#EFF1EE] shadow-xs"; // Solid dark level (115%+)
        label = `${activity} ${t.actionsCount || 'actions'} (${t.dailyGoalMet || 'daily goal met!'})`;
      }
    }

    daysData.push({
      dateStr: dStr,
      dayNumber: timeframe - i,
      isToday: i === 0,
      activity,
      ratio,
      colorClass,
      label,
      formattedDate: d.toLocaleDateString(activeLocale, { month: 'short', day: 'numeric' })
    });
  }

  // Grid class layout based on chosen timeframe
  const gridClass = timeframe === 30 
    ? "grid-cols-10 sm:grid-cols-15 gap-1.5 md:gap-2" 
    : timeframe === 100 
    ? "grid-cols-10 sm:grid-cols-20 gap-1 sm:gap-1.5 md:gap-2" 
    : "grid-cols-10 sm:grid-cols-30 gap-1 sm:gap-1.5 md:gap-2";

  // Dynamic search results for vocabulary words
  const filteredVocabulary = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return vocabulary
      .filter(v => v.word.toLowerCase().includes(query) || v.translation.toLowerCase().includes(query))
      .slice(0, 5);
  }, [searchQuery, vocabulary]);

  // Due flashcards count
  const dueFlashcardsCount = vocabulary.filter((v) => v.srs && v.srs.dueAt <= Date.now()).length;

  // Chart data sets dynamically calculated from actual user activity & vocabulary
  const chartData = useMemo(() => {
    const now = new Date();
    switch (progressTimeframe) {
      case 'week': {
        // Daily Activity over the past 7 days
        const labels: string[] = [];
        const values: number[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          const dStr = getLocalDateString(d);
          const dayName = d.toLocaleDateString(activeLocale, { weekday: 'short' });
          labels.push(dayName);
          values.push(activityHistory[dStr] || 0);
        }
        return {
          labels,
          values,
          title: chartTitles[currentLang]?.week || 'Daily Actions'
        };
      }
      case 'year': {
        // Vocabulary growth over the past 6 bi-monthly intervals
        const labels: string[] = [];
        const values: number[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i * 2 + 1, 0, 23, 59, 59);
          const monthName = d.toLocaleDateString(activeLocale, { month: 'short' });
          labels.push(monthName);
          const count = vocabulary.filter(v => (v.dateAdded || 0) <= d.getTime()).length;
          values.push(count);
        }
        return {
          labels,
          values,
          title: chartTitles[currentLang]?.year || 'Yearly Vocabulary'
        };
      }
      case 'month':
      default: {
        // Vocabulary growth over 5 intervals in the last 30 days
        const labels: string[] = [];
        const values: number[] = [];
        for (let i = 4; i >= 0; i--) {
          const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
          const dateLabel = d.toLocaleDateString(activeLocale, { month: 'short', day: 'numeric' });
          labels.push(dateLabel);
          const count = vocabulary.filter(v => (v.dateAdded || 0) <= d.getTime()).length;
          values.push(count);
        }
        return {
          labels,
          values,
          title: chartTitles[currentLang]?.month || 'Words Over Time'
        };
      }
    }
  }, [progressTimeframe, activityHistory, vocabulary, activeLocale, currentLang]);

  // SVG Chart Math Config
  const chartWidth = 500;
  const chartHeight = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 25;

  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  const maxChartValue = useMemo(() => {
    const mv = Math.max(...chartData.values);
    return mv > 0 ? mv * 1.15 : 100; // Give some head room
  }, [chartData]);

  const getX = (index: number) => {
    if (chartData.values.length <= 1) return paddingLeft;
    return paddingLeft + (index / (chartData.values.length - 1)) * plotWidth;
  };

  const getY = (val: number) => {
    return chartHeight - paddingBottom - (val / maxChartValue) * plotHeight;
  };

  // Build the SVG path string
  const pathD = useMemo(() => {
    return chartData.values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(v)}`).join(' ');
  }, [chartData, maxChartValue]);

  // Build the closed shading area path
  const areaD = useMemo(() => {
    if (chartData.values.length === 0) return '';
    const firstX = getX(0);
    const lastX = getX(chartData.values.length - 1);
    const bottomY = chartHeight - paddingBottom;
    return `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [pathD, chartData]);

  // Horizontal Grid Lines data
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex flex-col gap-6 sm:gap-8 pt-0 sm:pt-2 pb-16 font-sans text-zinc-900"
    >
      
      {/* Top Header removed */}
      <div className="hidden"></div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-6 items-stretch w-full">
        
        {/* Card 1: Current Streak */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          whileHover={{ y: -2 }}
          onClick={() => onNavigate?.('flashcards')}
          className="pearl-card p-2.5 sm:p-7 flex flex-col justify-between min-h-[109px] sm:min-h-[9rem] cursor-pointer"
        >
          <span className="text-[9px] sm:text-[11px] font-bold text-[#666666] tracking-wider sm:tracking-widest uppercase truncate">{t.currentStreak}</span>
          <div className="flex items-baseline gap-1 sm:gap-2 mt-1 sm:mt-4 mb-0.5">
            <span className="text-2xl sm:text-5xl font-['EB_Garamond','Playfair_Display',serif] font-bold text-[#222222]">
              {currentStreak}
            </span>
            <span className="text-sm sm:text-2xl font-['EB_Garamond','Playfair_Display',serif] text-[#666666]">{t.days}</span>
          </div>
        </motion.div>

        {/* Card 2: Today's Goal */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          whileHover={{ y: -2 }}
          className="pearl-card p-2.5 sm:p-7 flex flex-col justify-between min-h-[109px] sm:min-h-[9rem]"
        >
          <span className="text-[9px] sm:text-[11px] font-bold text-[#666666] tracking-wider sm:tracking-widest uppercase truncate">{t.todaysGoal}</span>
          <div className="flex flex-col mt-0.5 sm:mt-2">
            <span className="text-xl sm:text-4xl font-['Cabinet_Grotesk','Plus_Jakarta_Sans',sans-serif] font-[800] text-[#222222]">
              {goalProgress}%
            </span>
            <span className="text-[9px] sm:text-xs text-[#666666] font-semibold mt-0.5 sm:mt-1 truncate">
              {todayActivity}/{dailyGoal}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                tracker.trackEvent('button_clicked', 'engagement', {
                  button_name: 'start_reading',
                  destination: 'reader',
                });
                onNavigate?.('reader');
              }}
              className="mt-1 sm:mt-2.5 inline-flex items-center gap-1 text-[9px] sm:text-xs font-bold text-[#222222] hover:text-[#92E894] transition-colors cursor-pointer group text-start truncate z-10 relative"
            >
              <span className="group-hover:underline truncate">{t.startReading || "Start lesson"}</span>
              <span className="group-hover:translate-x-0.5 transition-transform shrink-0">→</span>
            </button>
          </div>
        </motion.div>

        {/* Card 3: Words Mastered */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          whileHover={{ y: -2 }}
          className="pearl-card p-2.5 sm:p-7 flex flex-col justify-between min-h-[109px] sm:min-h-[9rem] cursor-pointer"
        >
          <span className="text-[9px] sm:text-[11px] font-bold text-[#666666] tracking-wider sm:tracking-widest uppercase truncate">{t.wordsMastered}</span>
          <div className="flex flex-col mt-0.5 sm:mt-2">
            <span className="text-xl sm:text-4xl font-['Cabinet_Grotesk','Plus_Jakarta_Sans',sans-serif] font-[800] text-[#222222]">
              {wordsMastered}
            </span>
            <span className="text-[9px] sm:text-xs text-[#666666] font-semibold mt-0.5 sm:mt-1 truncate">
              {wordsMastered === 0 ? (t.keepGoing || 'Keep going!') : `${wordsMastered} ${t.totalSaved}`}
            </span>
          </div>
        </motion.div>

      </div>

      {/* CONTINUE READING SECTION - Hidden on mobile phone view */}
      <div className="hidden sm:flex flex-col gap-3.5 w-full">
        <h2 className="text-xs font-bold text-[#666666] tracking-wider uppercase px-0.5">
          {t.continueReading || 'CONTINUE READING'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 items-stretch">
          {continueReadingBooks.map((book, index) => {
            const totalP = Math.max(1, book.totalPages || 120);
            const currP = Math.max(1, book.currentPage || 18);
            const pageProgress = Math.min(100, Math.max(0, Math.round((currP / totalP) * 100)));

            const coverGradients = [
              'from-[#728591] via-[#5D6F7A] to-[#4B5963]',
              'from-[#1F3A4B] via-[#172D3A] to-[#101E28]',
              'from-[#D98236] via-[#BE6A22] to-[#984E13]'
            ];
            const coverGradient = book.coverGradient || coverGradients[index % 3];

            return (
              <motion.div
                key={book.id || `continue-book-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                onClick={() => {
                  if (onSelectDocument) {
                    onSelectDocument(book);
                  } else {
                    onNavigate?.('reader');
                  }
                }}
                className="bg-white rounded-2xl sm:rounded-3xl border-2 border-[#A4F5A6] p-3.5 sm:p-4 flex items-center gap-3.5 sm:gap-4 relative overflow-hidden shadow-2xs cursor-pointer group hover:shadow-md transition-all min-h-[120px]"
              >
                {/* Soft Mint Decorative Glow */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#A4F5A6]/20 rounded-full blur-xl pointer-events-none" />

                {/* 3D Realistic Book Cover Graphic */}
                <div className={`w-20 h-28 sm:w-22 sm:h-30 rounded-lg shadow-md shrink-0 relative overflow-hidden flex flex-col justify-between p-2 text-white bg-gradient-to-br ${coverGradient} border-l-2 border-white/25`}>
                  {/* Subtle Spine & Paper Overlay */}
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-black/20" />
                  <div className="absolute top-0 bottom-0 left-1 w-[1px] bg-white/20" />

                  {/* Language Badge on Book Cover */}
                  <div className="bg-white/20 backdrop-blur-xs text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider text-white text-center self-start border border-white/20">
                    {(book.language || 'ENGLISH').toUpperCase()}
                  </div>

                  {/* Title on Book Cover */}
                  <div className="my-auto z-10 px-0.5">
                    <h4 className="text-[10px] sm:text-[11px] font-black line-clamp-2 leading-tight tracking-tight drop-shadow-xs font-serif text-white">
                      {book.title || book.name}
                    </h4>
                  </div>

                  {/* Author on Book Cover */}
                  <div className="text-[7px] text-white/80 font-mono uppercase tracking-wider truncate z-10">
                    {book.author || book.category || 'Lingoflow'}
                  </div>
                </div>

                {/* Right Content Column */}
                <div className="flex flex-col justify-between h-full min-w-0 flex-1 py-0.5 z-10">
                  {/* Top Row: Progress Pill */}
                  <div className="flex items-center justify-start">
                    <span className="bg-[#A4F5A6] text-[#222222] font-extrabold text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
                      <BookOpen className="w-3 h-3 text-[#222222]" />
                      {pageProgress}%
                    </span>
                  </div>

                  {/* Middle: Title & Author */}
                  <div className="my-1.5 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold font-['Cabinet_Grotesk','Plus_Jakarta_Sans',sans-serif] text-[#222222] group-hover:text-[#222222] line-clamp-1 leading-snug">
                      {book.title || book.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-[#666666] font-medium truncate mt-0.5">
                      {book.author || book.category || 'Author'}
                    </p>
                  </div>

                  {/* Bottom Row: Page Number & Continue Button */}
                  <div className="flex items-center justify-between gap-2 mt-auto pt-1">
                    {/* SVG Circular Progress Ring + Pages Text */}
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#222222] shrink-0">
                      <svg className="w-3.5 h-3.5 text-[#222222] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <circle cx="12" cy="12" r="9" stroke="#E5E7E4" />
                        <circle 
                          cx="12" 
                          cy="12" 
                          r="9" 
                          stroke="#A4F5A6" 
                          strokeDasharray="56.5" 
                          strokeDashoffset={56.5 - (56.5 * pageProgress) / 100} 
                          strokeLinecap="round" 
                        />
                      </svg>
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#222222]">
                        p. {currP}/{totalP}
                      </span>
                    </div>

                    {/* Continue Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectDocument) {
                          onSelectDocument(book);
                        } else {
                          onNavigate?.('reader');
                        }
                      }}
                      className="bg-[#1F2620] hover:bg-[#111111] text-white px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold inline-flex items-center gap-1 transition-all group-hover:scale-105 shadow-xs shrink-0 cursor-pointer"
                    >
                      <span>Continue</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#A4F5A6]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="pearl-card p-6 sm:p-7 flex flex-col gap-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D0D2CF]">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold text-[#222222] tracking-widest uppercase">{t.intensityGrid}</span>
            <div className="flex bg-[#EFF1EE] p-1 rounded-full border border-[#D0D2CF]">
              {[30, 100, 150].map(val => (
                <button
                  key={val}
                  onClick={() => setTimeframe(val as 30 | 100 | 150)}
                  className={`px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider transition-colors duration-200 cursor-pointer ${
                    timeframe === val ? 'bg-[#222222] text-[#EFF1EE] shadow-xs' : 'text-[#222222] hover:text-[#555555]'
                  }`}
                >
                  {val}D
                </button>
              ))}
            </div>
          </div>
          
          {/* Custom Heatmap Legend with 5 Distinct Ribble Steps */}
          <div className="flex items-center gap-1.5 text-[10px] text-[#666666] uppercase font-bold tracking-wider">
            <span>{t.less}</span>
            <div className="w-3.5 h-3.5 rounded-[4px] bg-[#EFF1EE] border border-[#D0D2CF]" title="0 actions" />
            <div className="w-3.5 h-3.5 rounded-[4px] bg-[#D4FBD5]" title="1 - 35% goal" />
            <div className="w-3.5 h-3.5 rounded-[4px] bg-[#A4F5A6]" title="35% - 75% goal" />
            <div className="w-3.5 h-3.5 rounded-[4px] bg-[#92E894]" title="75% - 115% goal" />
            <div className="w-3.5 h-3.5 rounded-[4px] bg-[#222222] shadow-xs" title="115%+ goal" />
            <span>{t.more}</span>
          </div>
        </div>

        {/* Heatmap Cell Grid Layout */}
        <div className={`grid ${gridClass} w-full gap-1.5`}>
          {daysData.map((day) => {
            return (
              <motion.div
                key={day.dateStr}
                whileHover={{ scale: 1.25, zIndex: 10 }}
                className={`w-full aspect-square rounded-[6px] ${day.colorClass} cursor-pointer transition-transform`}
                title={`${day.dateStr}: ${day.label}`}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Progress Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#222222] tracking-widest uppercase">
            {t.yourProgress}
          </span>

          <div className="relative">
            <button
              onClick={() => setShowTimeframeDropdown(!showTimeframeDropdown)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFFFF] border border-[#D0D2CF] text-xs font-semibold text-[#222222] hover:bg-[#EFF1EE] transition-colors cursor-pointer shadow-xs"
            >
              <span>
                {progressTimeframe === 'month' ? t.thisMonth : progressTimeframe === 'week' ? t.thisWeek : t.thisYear}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#666666]" />
            </button>

            <AnimatePresence>
              {showTimeframeDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute end-0 mt-2 w-36 bg-[#FFFFFF] border border-[#D0D2CF] rounded-2xl shadow-lg z-50 overflow-hidden p-1.5 space-y-1"
                >
                  {(['week', 'month', 'year'] as ProgressTimeframe[]).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => {
                        setProgressTimeframe(tf);
                        setShowTimeframeDropdown(false);
                      }}
                      className={`w-full text-start px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        progressTimeframe === tf
                          ? 'bg-[#A4F5A6] text-[#222222]'
                          : 'text-[#222222] hover:bg-[#EFF1EE]'
                      }`}
                    >
                      {tf === 'month' ? t.thisMonth : tf === 'week' ? t.thisWeek : t.thisYear}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Split Grid: Metrics & Line Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div ref={statsOverviewRef} className="lg:col-span-1 grid grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-4">
            <div className="pearl-card p-3 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-start">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#A4F5A6] text-[#222222] flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-xl font-['Cabinet_Grotesk','Plus_Jakarta_Sans',sans-serif] font-[800] text-[#222222] truncate">
                  {wordsLearned} <span className="text-[10px] sm:text-xs font-sans text-[#666666] font-semibold">/ {totalWords}</span>
                </div>
                <div className="text-[10px] sm:text-xs text-[#666666] font-medium truncate">{t.wordsLearned}</div>
              </div>
            </div>

            <div className="pearl-card p-3 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-start">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#B2A1FF] text-[#222222] flex items-center justify-center shrink-0">
                <ClipboardCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-xl font-['Cabinet_Grotesk','Plus_Jakarta_Sans',sans-serif] font-[800] text-[#222222] truncate">
                  {retentionRate}%
                </div>
                <div className="text-[10px] sm:text-xs text-[#666666] font-medium truncate">{t.retentionRate}</div>
              </div>
            </div>

            <div className="pearl-card p-3 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-start">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#D0D2CF] text-[#222222] flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-xl font-['Cabinet_Grotesk','Plus_Jakarta_Sans',sans-serif] font-[800] text-[#222222] truncate">
                  {totalReviews}
                </div>
                <div className="text-[10px] sm:text-xs text-[#666666] font-medium truncate">{t.wordsReviewed}</div>
              </div>
            </div>
          </div>

          <div ref={vocabChartRef} className="lg:col-span-2 pearl-card p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-[#222222]">
                {chartData.title}
              </span>
              {hoveredPointIndex !== null && (
                <span className="text-xs font-bold text-[#222222] bg-[#A4F5A6] px-2 py-0.5 rounded-full">
                  {chartData.labels[hoveredPointIndex]}: {chartData.values[hoveredPointIndex]} {t.words}
                </span>
              )}
            </div>

            <div className="w-full relative">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-auto overflow-visible"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A4F5A6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#EFF1EE" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {gridLines.map((ratio, idx) => {
                  const y = paddingTop + (1 - ratio) * plotHeight;
                  return (
                    <line
                      key={idx}
                      x1={paddingLeft}
                      y1={y}
                      x2={chartWidth - paddingRight}
                      y2={y}
                      stroke="rgba(34, 34, 34, 0.08)"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                  );
                })}

                {areaD && (
                  <path d={areaD} fill="url(#chartGradient)" />
                )}

                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#222222"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {chartData.values.map((val, idx) => {
                  const cx = getX(idx);
                  const cy = getY(val);
                  const isHovered = hoveredPointIndex === idx;

                  return (
                    <g 
                      key={idx} 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPointIndex(idx)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                    >
                      {/* Transparent hit target for easy mouse/touch interaction */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r="18"
                        fill="transparent"
                      />
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? "6.5" : "4"}
                        fill="#A4F5A6"
                        stroke="#222222"
                        strokeWidth="2"
                        className="transition-all duration-200"
                      />
                      <text
                        x={cx}
                        y={chartHeight - 5}
                        textAnchor="middle"
                        className="text-[10px] fill-[#666666] font-semibold"
                      >
                        {chartData.labels[idx]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Status of Each Language Section */}
        <div ref={languageProfilesRef} className="mt-8 bg-white dark:bg-[#2C2C2E] p-5 sm:p-6 rounded-2xl border border-[#E6DFD3] dark:border-[#3A3A3C] shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-[#E6DFD3] dark:border-[#3A3A3C] pb-2.5">
            <h3 className="text-base font-bold text-[#222222] dark:text-[#EFF1EE] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Languages Status
            </h3>
            <span className="text-[11px] font-bold text-[#666666] dark:text-stone-400 bg-[#F4F4F5] dark:bg-white/5 px-2.5 py-0.5 rounded-full">
              {globalStats.langStatuses.length} Active
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {globalStats.langStatuses.map((lang) => {
              const percent = Math.min(100, Math.max(1, Math.round((lang.vocab / 1000) * 100) + (lang.books * 5)));
              return (
                <div key={lang.name} className="group relative overflow-hidden p-4 rounded-xl bg-[#F9F8F6] dark:bg-[#1E1E1E] border border-[#E6DFD3] dark:border-white/10 flex flex-col gap-3 hover:border-[#1856B7] dark:hover:border-[#A4F5A6] transition-all shadow-2xs">
                  <div className="flex items-center justify-between min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl shrink-0">{lang.flag}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs text-[#222222] dark:text-[#EFF1EE] truncate">{lang.name}</h4>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                            Active
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 mt-0.5 flex items-center gap-1">
                          🔥 {lang.streak}d streak
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end text-right">
                      <span className="text-xs font-black text-[#222222] dark:text-[#A4F5A6]">
                        {percent}%
                      </span>
                      <span className="text-[9px] font-bold text-[#666666] dark:text-stone-400 uppercase tracking-wider">
                        Learned
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="w-full">
                    <div className="w-full bg-[#E1DDD5] dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-emerald-500 dark:bg-[#A4F5A6] h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1.5 text-[10px] font-bold text-[#666666] dark:text-stone-400">
                      <span>{lang.vocab} words</span>
                      <span>{lang.books} books</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {globalStats.langStatuses.length === 0 && (
              <div className="col-span-full py-6 text-center text-[#666666] dark:text-stone-400 text-xs font-medium">
                No active languages yet. Start learning words or reading books to see them here!
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
