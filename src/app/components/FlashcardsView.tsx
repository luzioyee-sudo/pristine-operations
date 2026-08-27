// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VocabularyItem, ReaderSettings } from '../types';
import { reviewCard, getCardBucket, formatIntervalText, ButtonAction, getDueIntervalLabel } from '../utils/srs';
import { getTranslation } from '../utils/i18n';
import { getCardTranslation } from '../utils/cardTranslations';
import { playTTS } from '../utils/tts';
import {
  Layers,
  Volume2,
  RotateCcw,
  Sparkles,
  Trophy,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlashcardsViewProps {
  vocabulary: VocabularyItem[];
  onUpdateVocabulary: (updated: VocabularyItem) => void;
  settings?: ReaderSettings;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  vocabulary,
  onUpdateVocabulary,
  settings,
}) => {
  const t = getTranslation(settings?.interfaceLanguage || settings?.targetLanguage);
  const now = Date.now();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'new' | 'learning' | 'mastered'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [reviewedCount, setReviewedCount] = useState<number>(0);

  const [selectedVoice, setSelectedVoice] = useState<'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir'>('Zephyr');
  const [speechSpeed, setSpeechSpeed] = useState<'normal' | 'slow'>('normal');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Dynamic filter stats
  const newCount = useMemo(() => vocabulary.filter(v => getCardBucket(v) === 'New').length, [vocabulary]);
  const learningCount = useMemo(() => vocabulary.filter(v => getCardBucket(v) === 'Learning').length, [vocabulary]);
  const masteredCount = useMemo(() => vocabulary.filter(v => getCardBucket(v) === 'Mastered').length, [vocabulary]);

  // Determine items to review based on the selected filter
  const itemsToReview = useMemo(() => {
    let base = vocabulary;
    if (selectedFilter === 'new') {
      return base.filter(v => getCardBucket(v) === 'New');
    }
    if (selectedFilter === 'learning') {
      return base.filter(v => getCardBucket(v) === 'Learning');
    }
    if (selectedFilter === 'mastered') {
      return base.filter(v => getCardBucket(v) === 'Mastered');
    }
    // Default to 'all', but if there are due items, prioritize them
    const dueItems = vocabulary.filter(item => item.srs && item.srs.dueAt <= now);
    return dueItems.length > 0 ? dueItems : vocabulary;
  }, [selectedFilter, vocabulary, now]);

  const currentItem = itemsToReview[Math.min(currentIndex, Math.max(0, itemsToReview.length - 1))];

  const handleFilterChange = (filter: 'all' | 'new' | 'learning' | 'mastered') => {
    setSelectedFilter(filter);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
  };

  const handleGrade = (grade: 1 | 2 | 3 | 4) => {
    if (!currentItem) return;

    const buttonMap: Record<number, ButtonAction> = { 1: "again", 2: "hard", 3: "good", 4: "easy" };
    const updatedItem = reviewCard(currentItem, buttonMap[grade]);

    onUpdateVocabulary(updatedItem);
    setReviewedCount((prev) => prev + 1);
    setIsFlipped(false);

    if (currentIndex + 1 < itemsToReview.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#A4F5A6', '#B2A1FF', '#222222', '#D0D2CF'],
      });
    }
  };

  const handlePlayTTS = (text: string, langHint?: string) => {
    setIsPlayingAudio(true);
    playTTS(
      text,
      langHint || currentItem.language || settings?.targetLanguage,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      {
        voice: selectedVoice,
        promptStyle: speechSpeed === 'slow' ? 'slow' : 'normal',
      }
    );
  };

  const restartSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
    setReviewedCount(0);
  };

  if (vocabulary.length === 0) {
    return (
      <div id="no-flashcards-view" className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#EFF1EE] dark:bg-white/10 text-[#222222] dark:text-[#EFF1EE] flex items-center justify-center">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#222222] dark:text-[#EFF1EE]">
          {t.noFlashcardsDue}
        </h2>
        <p className="text-xs text-[#666666] dark:text-[#D0D2CF] max-w-sm">
          {t.noFlashcardsDueDesc}
        </p>
      </div>
    );
  }

  if (itemsToReview.length === 0) {
    return (
      <div id="empty-filter-view" className="max-w-md mx-auto py-12 px-6 text-center space-y-6">
        {/* Category Filter Tags */}
        <div className="flex items-center justify-center gap-2 pb-2 select-none flex-wrap">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all duration-200 border cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-[#222222] text-[#EFF1EE] border-[#222222] shadow-xs'
                : 'bg-white dark:bg-[#1E1E1E] text-[#666666] dark:text-[#D0D2CF] border-[#D0D2CF] dark:border-white/10 hover:border-[#222222]'
            }`}
          >
            {t.filterAll} {vocabulary.length}
          </button>
          <button
            onClick={() => handleFilterChange('new')}
            className={`px-3.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all duration-200 border cursor-pointer ${
              selectedFilter === 'new'
                ? 'bg-[#222222] text-[#EFF1EE] border-[#222222] shadow-xs'
                : 'bg-white dark:bg-[#1E1E1E] text-[#666666] dark:text-[#D0D2CF] border-[#D0D2CF] dark:border-white/10 hover:border-[#222222]'
            }`}
          >
            {t.filterNew} {newCount}
          </button>
          <button
            onClick={() => handleFilterChange('learning')}
            className={`px-3.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all duration-200 border cursor-pointer ${
              selectedFilter === 'learning'
                ? 'bg-[#222222] text-[#EFF1EE] border-[#222222] shadow-xs'
                : 'bg-white dark:bg-[#1E1E1E] text-[#666666] dark:text-[#D0D2CF] border-[#D0D2CF] dark:border-white/10 hover:border-[#222222]'
            }`}
          >
            {t.filterLearning} {learningCount}
          </button>
          <button
            onClick={() => handleFilterChange('mastered')}
            className={`px-3.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all duration-200 border cursor-pointer ${
              selectedFilter === 'mastered'
                ? 'bg-[#222222] text-[#EFF1EE] border-[#222222] shadow-xs'
                : 'bg-white dark:bg-[#1E1E1E] text-[#666666] dark:text-[#D0D2CF] border-[#D0D2CF] dark:border-white/10 hover:border-[#222222]'
            }`}
          >
            {t.filterMastered} {masteredCount}
          </button>
        </div>

        <div className="p-12 bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#EFF1EE] dark:bg-white/10 flex items-center justify-center mx-auto text-[#666666]">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-[#666666] dark:text-[#D0D2CF]">
            {t.noCardsInBucket} <span className="font-bold text-[#222222] dark:text-[#EFF1EE] uppercase">{selectedFilter === 'new' ? t.filterNew : selectedFilter === 'learning' ? t.filterLearning : selectedFilter === 'mastered' ? t.filterMastered : t.filterAll}</span>.
          </p>
          <button
            onClick={() => handleFilterChange('all')}
            className="px-4 py-2 bg-[#222222] text-[#EFF1EE] text-xs font-bold rounded-xl shadow-xs hover:bg-[#A4F5A6] hover:text-[#222222] transition-all cursor-pointer"
          >
            {t.viewAllCards}
          </button>
        </div>
      </div>
    );
  }

  if (sessionCompleted || !currentItem) {
    return (
      <div id="flashcards-summary-view" className="max-w-lg mx-auto py-12 px-6 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#A4F5A6] flex items-center justify-center text-[#222222] shadow-lg animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-[#222222] dark:text-[#EFF1EE] tracking-tight">
            {t.reviewComplete}
          </h2>
          <p className="text-xs text-[#666666] dark:text-[#D0D2CF]">
            {t.reviewCompleteDesc}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10">
            <span className="text-2xl font-black text-[#222222] dark:text-[#EFF1EE]">{reviewedCount}</span>
            <span className="block text-[11px] font-bold text-[#666666] dark:text-[#D0D2CF] uppercase mt-1">{t.cardsReviewed}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10">
            <span className="text-2xl font-black text-[#222222] dark:text-[#EFF1EE]">{Math.round((vocabulary.filter(v => getCardBucket(v) === 'Mastered').length / vocabulary.length) * 100)}%</span>
            <span className="block text-[11px] font-bold text-[#666666] dark:text-[#D0D2CF] uppercase mt-1">{t.masteryRate}</span>
          </div>
        </div>

        <button
          onClick={restartSession}
          className="w-full py-3.5 rounded-2xl bg-[#222222] text-[#EFF1EE] font-bold text-sm shadow-xs hover:bg-[#A4F5A6] hover:text-[#222222] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.reviewAgain}</span>
        </button>
      </div>
    );
  }

  return (
    <div id="flashcard-session-view" className="max-w-xl mx-auto space-y-6 py-6">
      
      {/* Category Filter Tags */}
      <div className="flex items-center justify-center gap-2 pb-2 select-none flex-wrap">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-3.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all duration-200 border cursor-pointer ${
            selectedFilter === 'all'
              ? 'bg-[#222222] text-[#EFF1EE] border-[#222222] shadow-xs'
              : 'bg-white dark:bg-[#1E1E1E] text-[#666666] dark:text-[#D0D2CF] border-[#D0D2CF] dark:border-white/10 hover:border-[#222222]'
          }`}
        >
          {t.filterAll} {vocabulary.length}
        </button>
        <button
          onClick={() => handleFilterChange('new')}
          className={`px-3.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all duration-200 border cursor-pointer ${
            selectedFilter === 'new'
              ? 'bg-[#222222] text-[#EFF1EE] border-[#222222] shadow-xs'
              : 'bg-white dark:bg-[#1E1E1E] text-[#666666] dark:text-[#D0D2CF] border-[#D0D2CF] dark:border-white/10 hover:border-[#222222]'
          }`}
        >
          {t.filterNew} {newCount}
        </button>
        <button
          onClick={() => handleFilterChange('learning')}
          className={`px-3.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all duration-200 border cursor-pointer ${
            selectedFilter === 'learning'
              ? 'bg-[#222222] text-[#EFF1EE] border-[#222222] shadow-xs'
              : 'bg-white dark:bg-[#1E1E1E] text-[#666666] dark:text-[#D0D2CF] border-[#D0D2CF] dark:border-white/10 hover:border-[#222222]'
          }`}
        >
          {t.filterLearning} {learningCount}
        </button>
        <button
          onClick={() => handleFilterChange('mastered')}
          className={`px-3.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all duration-200 border cursor-pointer ${
            selectedFilter === 'mastered'
              ? 'bg-[#222222] text-[#EFF1EE] border-[#222222] shadow-xs'
              : 'bg-white dark:bg-[#1E1E1E] text-[#666666] dark:text-[#D0D2CF] border-[#D0D2CF] dark:border-white/10 hover:border-[#222222]'
          }`}
        >
          {t.filterMastered} {masteredCount}
        </button>
      </div>

      {/* Session Progress Header */}
      <div className="flex items-center justify-between text-xs font-bold text-[#666666] dark:text-[#D0D2CF]">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-[#B2A1FF]" />
          <span className="uppercase tracking-wider text-[10px] font-extrabold text-[#222222] dark:text-[#EFF1EE]">
            {selectedFilter === 'all' ? t.scheduledDeck : `${selectedFilter === 'new' ? t.filterNew : selectedFilter === 'learning' ? t.filterLearning : t.filterMastered} ${t.session}`}
          </span>
        </div>
        <span className="font-mono text-[#666666] dark:text-[#D0D2CF]">
          {t.card} {currentIndex + 1} {t.of} {itemsToReview.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-[#D0D2CF] dark:bg-white/10 overflow-hidden">
        <div
          className="h-full bg-[#A4F5A6] transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / itemsToReview.length) * 100}%` }}
        />
      </div>

      {/* 3D Interactive Flashcard */}
      <div
        id="interactive-flashcard-3d"
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative min-h-[340px] w-full cursor-pointer select-none group focus:outline-none"
        style={{ perspective: "1500px" }}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-full h-full min-h-[340px] transition-shadow duration-300 rounded-3xl"
        >
          {/* FRONT OF CARD */}
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="absolute inset-0 w-full h-full p-8 bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10 rounded-[32px] shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            {/* Top Mint Accent Bar */}
            <div className="absolute top-0 start-0 end-0 h-1.5 bg-[#A4F5A6]" />

            <div className="my-auto text-center space-y-5 py-8">
              <span className="px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#EFF1EE] dark:bg-white/10 text-[#222222] dark:text-[#EFF1EE] border border-[#D0D2CF] dark:border-white/10 shadow-2xs">
                {currentItem.language}
              </span>

              <h2 className="text-4xl sm:text-5xl font-bold font-serif text-[#222222] dark:text-[#EFF1EE] tracking-tight">
                {currentItem.word}
              </h2>

              {currentItem.phonetic && (
                <p className="text-sm font-mono text-[#666666] dark:text-[#D0D2CF] font-semibold">
                  {currentItem.phonetic}
                </p>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayTTS(currentItem.word);
                }}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer shadow-2xs ${
                  isPlayingAudio
                    ? 'bg-[#A4F5A6] text-[#222222] border-[#A4F5A6] animate-pulse shadow-md'
                    : 'bg-[#EFF1EE] dark:bg-white/10 hover:bg-[#D0D2CF] text-[#222222] dark:text-[#EFF1EE] border-[#D0D2CF] dark:border-white/10'
                }`}
              >
                <Volume2 className="w-4 h-4 text-[#222222] dark:text-[#EFF1EE]" />
                <span>{isPlayingAudio ? 'Speaking...' : t.pronounce}</span>
              </button>
            </div>

            {/* Card Bottom Hint */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#666666] dark:text-[#D0D2CF] border-t border-[#D0D2CF]/60 dark:border-white/10 pt-3">
              <span>{t.clickToReveal}</span>
              <Sparkles className="w-4 h-4 text-[#B2A1FF]" />
            </div>
          </div>

          {/* BACK OF CARD */}
          <div
            style={{ 
              backfaceVisibility: "hidden", 
              transform: "rotateY(180deg)" 
            }}
            className="absolute inset-0 w-full h-full p-8 bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10 rounded-[32px] shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            {/* Top Lavender Accent Bar */}
            <div className="absolute top-0 start-0 end-0 h-1.5 bg-[#B2A1FF]" />

            <div className="my-auto space-y-4 py-4 w-full">
              <div className="p-4 rounded-2xl bg-[#EFF1EE] dark:bg-white/5 border border-[#D0D2CF] dark:border-white/10 text-center space-y-1 relative group/trans">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#666666] dark:text-[#D0D2CF] uppercase tracking-widest">
                    {t.translationLabel}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayTTS(currentItem.translation);
                    }}
                    title="Pronounce translation"
                    className="p-1.5 rounded-full bg-white dark:bg-[#1E1E1E] text-[#222222] dark:text-white hover:bg-[#A4F5A6] transition-colors cursor-pointer shadow-2xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-2xl font-bold font-serif text-[#222222] dark:text-[#EFF1EE]">
                  {getCardTranslation(currentItem, settings?.interfaceLanguage)}
                </p>
              </div>

              {currentItem.definition && (
                <p className="text-xs text-[#666666] dark:text-[#D0D2CF] text-center font-medium">
                  {currentItem.definition}
                </p>
              )}

              {currentItem.contextSentence && (
                <div className="p-3.5 rounded-2xl bg-[#EFF1EE] dark:bg-white/5 text-xs italic text-[#222222] dark:text-[#EFF1EE] border border-[#D0D2CF] dark:border-white/10 flex items-center justify-between gap-2">
                  <span>"{currentItem.contextSentence}"</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayTTS(currentItem.contextSentence);
                    }}
                    title="Pronounce context sentence"
                    className="p-1 rounded-full text-[#666666] dark:text-[#D0D2CF] hover:text-[#222222] dark:hover:text-white hover:bg-[#D0D2CF] transition-colors cursor-pointer shrink-0"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Card Bottom Hint */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#666666] dark:text-[#D0D2CF] border-t border-[#D0D2CF]/60 dark:border-white/10 pt-3">
              <span>{t.clickToHide}</span>
              <Sparkles className="w-4 h-4 text-[#B2A1FF]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Spaced Repetition Rating Buttons */}
      {isFlipped ? (
        <div className="grid grid-cols-4 gap-2.5 animate-in fade-in duration-150">
          
          <button
            onClick={() => handleGrade(1)}
            className="p-3 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-rose-200 dark:border-rose-900/40 text-rose-600 text-center hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all shadow-2xs group cursor-pointer"
          >
            <span className="block text-xs font-bold">{t.srsAgain}</span>
            <span className="block text-[9px] opacity-70 font-mono mt-0.5">{getDueIntervalLabel(currentItem, 'again')}</span>
          </button>

          <button
            onClick={() => handleGrade(2)}
            className="p-3 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10 text-[#666666] dark:text-[#D0D2CF] text-center hover:bg-[#EFF1EE] dark:hover:bg-white/5 transition-all shadow-2xs group cursor-pointer"
          >
            <span className="block text-xs font-bold">{t.srsHard}</span>
            <span className="block text-[9px] opacity-70 font-mono mt-0.5">{getDueIntervalLabel(currentItem, 'hard')}</span>
          </button>

          <button
            onClick={() => handleGrade(3)}
            className="p-3 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#B2A1FF]/50 text-[#222222] dark:text-white text-center hover:bg-[#B2A1FF]/10 transition-all shadow-2xs group cursor-pointer"
          >
            <span className="block text-xs font-bold">{t.srsGood}</span>
            <span className="block text-[9px] opacity-70 font-mono mt-0.5">
              {getDueIntervalLabel(currentItem, 'good')}
            </span>
          </button>

          <button
            onClick={() => handleGrade(4)}
            className="p-3 rounded-2xl bg-[#A4F5A6] border border-[#A4F5A6] text-[#222222] text-center hover:bg-[#8ee590] transition-all shadow-xs group cursor-pointer"
          >
            <span className="block text-xs font-bold">{t.srsEasy}</span>
            <span className="block text-[9px] opacity-70 font-mono mt-0.5">
              {getDueIntervalLabel(currentItem, 'easy')}
            </span>
          </button>

        </div>
      ) : (
        <button
          onClick={() => setIsFlipped(true)}
          className="w-full py-3.5 rounded-2xl bg-[#222222] hover:bg-[#A4F5A6] text-[#EFF1EE] hover:text-[#222222] font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{t.showAnswer}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

    </div>
  );
};
