// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, useDragControls } from 'motion/react';
import { WordDefinition } from '../types';
import { getTranslation } from '../utils/i18n';
import { playTTS } from '../utils/tts';
import {
  Volume2,
  BookmarkPlus,
  X,
  Sparkles,
  Check,
  Copy,
  BookOpen
} from 'lucide-react';

interface WordModalProps {
  wordData: WordDefinition | null;
  isLoading: boolean;
  onClose: () => void;
  onSaveToVocabulary: (wordData: WordDefinition) => void;
  isSaved?: boolean;
  position?: { x: number, y: number, width: number, height: number } | null;
  interfaceLanguage?: string;
}

export const WordModal: React.FC<WordModalProps> = ({
  wordData,
  isLoading,
  onClose,
  onSaveToVocabulary,
  isSaved = false,
  position,
  interfaceLanguage,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const dragControls = useDragControls();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const t = getTranslation(interfaceLanguage || wordData?.targetLanguage);

  // Close when clicking outside of popover
  useEffect(() => {
    if (!position) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Do not close if click target is inside the modal itself, or is a word element
      if (target.closest('[data-highlight-text]') || target.closest('.cursor-pointer')) {
        return;
      }
      onClose();
    };
    
    // Register the listener with a short delay to bypass the current mouseup/click event loop
    const timer = setTimeout(() => {
      window.addEventListener('click', handleClickOutside);
    }, 120);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [position, onClose]);

  if (!wordData && !isLoading) return null;

  const handlePlayTTS = (text: string, lang?: string) => {
    setIsPlayingAudio(true);
    playTTS(text, lang, 
      () => setIsPlayingAudio(true), 
      () => setIsPlayingAudio(false)
    );
  };

  const handleCopy = () => {
    if (wordData) {
      navigator.clipboard.writeText(`${wordData.word} - ${wordData.translation}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // If position is provided, render a compact floating popover (desktop) or a bottom sheet (mobile)
  if (position) {
    if (isMobile) {
      return (
        <>
          {/* Semi-transparent Backdrop with Blur */}
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-[4px] z-40"
            onClick={onClose}
          />

          {/* Elegant Bottom Sheet Drawer */}
          <motion.div
            key="mobile-bottom-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.8 }}
            onDragEnd={(e, info) => {
              if (info.offset.y > 100 || info.velocity.y > 350) {
                onClose();
              }
            }}
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxHeight: '80vh',
              zIndex: 50
            }}
            className="bg-white dark:bg-[#1E1E1E] rounded-t-[2.25rem] shadow-[0_-16px_48px_rgba(0,0,0,0.15)] dark:shadow-[0_-16px_48px_rgba(0,0,0,0.4)] border-t border-[#D0D2CF] dark:border-white/10 overflow-hidden flex flex-col pb-8"
            onClick={(e) => e.stopPropagation()} // Prevent close on self click
          >
            {/* Top Decorative Branding Accent Strip */}
            <div className="absolute top-0 start-0 end-0 h-1 bg-[#222222] z-10 shrink-0" />
            
            {/* Generous Slide Gesture Indicator Handle */}
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="w-full flex justify-center py-4 cursor-grab active:cursor-grabbing select-none shrink-0"
              style={{ touchAction: 'none' }}
            >
              <div className="w-16 h-1.5 bg-[#D0D2CF] dark:bg-stone-700/80 rounded-full hover:bg-stone-400 dark:hover:bg-stone-600 transition-colors" />
            </div>

            {isLoading ? (
              <div className="px-6 pb-6 flex flex-col gap-5 animate-pulse">
                {/* Header skeleton */}
                <div className="flex justify-between items-start">
                  <div className="space-y-2.5 flex-1">
                    <div className="h-6 bg-[#EFF1EE] dark:bg-stone-800 rounded-lg w-1/2" />
                    <div className="h-5 bg-[#EFF1EE] dark:bg-stone-800 rounded-lg w-1/3" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-11 h-11 bg-[#EFF1EE] dark:bg-stone-800 rounded-2xl" />
                    <div className="w-11 h-11 bg-[#EFF1EE] dark:bg-stone-800 rounded-2xl" />
                  </div>
                </div>
                {/* Body skeleton */}
                <div className="h-24 bg-[#EFF1EE]/60 dark:bg-stone-800/40 rounded-2xl border border-[#D0D2CF]/40 dark:border-white/10 flex flex-col justify-center items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#222222] dark:text-[#A4F5A6] animate-spin" />
                  <span className="text-xs font-semibold text-[#666666] dark:text-[#D0D2CF]">{t.translating}</span>
                </div>
                {/* Footer skeleton */}
                <div className="flex gap-3 pt-4 border-t border-[#D0D2CF]/60 dark:border-white/10">
                  <div className="flex-1 h-12 bg-[#EFF1EE] dark:bg-stone-800 rounded-2xl" />
                  <div className="flex-1 h-12 bg-[#A4F5A6]/30 rounded-2xl" />
                </div>
              </div>
            ) : wordData ? (() => {
                const wordIsAr = /[\u0600-\u06FF]/.test(wordData.word);
                const translationIsAr = /[\u0600-\u06FF]/.test(wordData.translation);
                const definitionIsAr = wordData.definition ? /[\u0600-\u06FF]/.test(wordData.definition) : false;
                
                return (
                  <div className="px-6 pb-4 flex flex-col gap-5 overflow-y-auto max-h-full">
                    {/* Header: Words & Pronounce Controls */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0" dir={wordIsAr || translationIsAr ? 'rtl' : 'ltr'}>
                        <h3 className={`text-2xl font-bold text-[#222222] dark:text-white break-words whitespace-pre-wrap leading-tight tracking-tight ${
                          wordIsAr ? 'font-arabic-serif text-3xl' : 'font-serif-classic'
                        }`}>
                          {wordData.word}
                        </h3>
                        <p className={`text-lg font-bold text-[#222222] dark:text-[#D0D2CF] mt-1 break-words whitespace-pre-wrap leading-snug ${
                          translationIsAr ? 'font-arabic-sans text-xl' : ''
                        }`}>
                          {wordData.translation}
                        </p>
                        {wordData.phonetic && (
                          <p className="text-xs font-mono text-[#666666] dark:text-[#D0D2CF] mt-1" dir="ltr">
                            {wordData.phonetic}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handlePlayTTS(wordData.word, wordData.sourceLanguage)}
                          className={`p-3.5 rounded-2xl transition-all active:scale-95 ${
                            isPlayingAudio
                              ? 'bg-[#222222] text-[#EFF1EE] animate-pulse shadow-lg'
                              : 'bg-[#EFF1EE] dark:bg-stone-800 border border-[#D0D2CF] dark:border-white/10 text-[#222222] dark:text-white hover:bg-[#D0D2CF]/50'
                          }`}
                          aria-label="Listen"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={onClose}
                          className="p-3.5 rounded-2xl bg-[#EFF1EE] dark:bg-stone-800 border border-[#D0D2CF] dark:border-white/10 text-[#666666] hover:text-[#222222] dark:hover:text-white transition-all active:scale-95"
                          aria-label="Close"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Definition */}
                    {wordData.definition && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-[#666666] dark:text-[#D0D2CF] uppercase tracking-widest flex items-center gap-1.5" dir={definitionIsAr ? 'rtl' : 'ltr'}>
                          <Sparkles className="w-3 h-3 text-[#222222] dark:text-[#A4F5A6]" />
                          {definitionIsAr ? 'التعريف والترجمة' : 'Meaning / Definition'}
                        </span>
                        <div className="p-4 rounded-2xl bg-[#EFF1EE] dark:bg-stone-800/40 border border-[#D0D2CF] dark:border-white/10" dir={definitionIsAr ? 'rtl' : 'ltr'}>
                          <p className={`text-sm text-[#222222] dark:text-stone-300 leading-relaxed ${
                            definitionIsAr ? 'font-arabic-sans text-end rtl' : ''
                          }`}>
                            {wordData.definition}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Context / Example Sentence */}
                    {wordData.contextSentence && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#666666] dark:text-[#D0D2CF] uppercase tracking-widest flex items-center gap-1.5" dir={/[\u0600-\u06FF]/.test(wordData.contextSentence) ? 'rtl' : 'ltr'}>
                            <BookOpen className="w-3 h-3 text-[#222222] dark:text-[#A4F5A6]" />
                            {/[\u0600-\u06FF]/.test(wordData.contextSentence) ? 'سياق الكلمة في النص' : 'Example Context'}
                          </span>
                          <button
                            onClick={() => handlePlayTTS(wordData.contextSentence, wordData.sourceLanguage)}
                            className="p-1 rounded-lg bg-[#EFF1EE] dark:bg-stone-800 text-[#222222] dark:text-white hover:bg-[#D0D2CF] transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                            title="Listen to context sentence"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen</span>
                          </button>
                        </div>
                        <div className={`p-4 rounded-2xl bg-[#EFF1EE] dark:bg-stone-800/60 border border-[#D0D2CF] dark:border-white/10 shadow-xs ${
                          /[\u0600-\u06FF]/.test(wordData.contextSentence) ? 'font-arabic-serif text-end rtl' : ''
                        }`} dir={/[\u0600-\u06FF]/.test(wordData.contextSentence) ? 'rtl' : 'ltr'}>
                          <p className="italic text-[#222222] dark:text-stone-200 text-sm leading-relaxed">
                            "{wordData.contextSentence}"
                          </p>
                        </div>
                      </div>
                    )}
        
                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-[#D0D2CF]/50 dark:border-white/10 mt-2 shrink-0">
                      <button
                        onClick={handleCopy}
                        className="flex-1 py-3.5 rounded-2xl text-sm font-semibold text-[#222222] dark:text-[#EFF1EE] bg-[#EFF1EE] hover:bg-[#D0D2CF]/50 dark:bg-white/10 dark:hover:bg-white/15 border border-[#D0D2CF] dark:border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        {copied ? <Check className="w-4 h-4 text-[#A4F5A6]" /> : <Copy className="w-4 h-4 text-[#666666]" />}
                        {copied ? t.copied : t.copy}
                      </button>
                      
                      <button
                        onClick={() => onSaveToVocabulary(wordData)}
                        className={`flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${
                          isSaved
                            ? 'bg-[#A4F5A6]/20 text-[#222222] dark:text-[#EFF1EE] border border-[#A4F5A6]'
                            : 'bg-[#222222] hover:bg-[#A4F5A6] text-[#EFF1EE] hover:text-[#222222] shadow-xs'
                        }`}
                      >
                        {isSaved ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                        {isSaved ? t.savedToVocab : t.saveToVocab}
                      </button>
                    </div>
                  </div>
                );
              })() : null}
          </motion.div>
        </>
      );
    }

    const wordLength = wordData?.word ? wordData.word.length : 0;
    const translationLength = wordData?.translation ? wordData.translation.length : 0;
    const maxTextLength = Math.max(wordLength, translationLength);

    // Calculate popoverWidth dynamically: starting from 280px up to 480px based on length
    let popoverWidth = 280;
    if (maxTextLength > 15) {
      popoverWidth = Math.min(480, 280 + (maxTextLength - 15) * 5);
    }
    
    // Safety check for small screen widths
    const maxAllowedWidth = Math.min(window.innerWidth - 32, 480);
    if (popoverWidth > maxAllowedWidth) {
      popoverWidth = maxAllowedWidth;
    }
    
    // Calculate positioning
    let left = position.x + (position.width / 2) - (popoverWidth / 2);
    // Boundary checks for horizontal
    if (left < 16) left = 16;
    if (left + popoverWidth > window.innerWidth - 16) left = window.innerWidth - popoverWidth - 16;
    
    // Place above if there is space, otherwise below
    const spaceAbove = position.y;
    const spaceBelow = window.innerHeight - (position.y + position.height);
    const preferAbove = spaceAbove > 200 || spaceAbove > spaceBelow;
    
    const top = preferAbove ? position.y - 12 : position.y + position.height + 12;

    // Calculate maximum available height to prevent overflowing offscreen
    const safetyMargin = 16;
    const maxHeight = preferAbove 
      ? Math.max(150, top - safetyMargin) 
      : Math.max(150, window.innerHeight - top - safetyMargin);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: preferAbove ? 10 : -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: preferAbove ? 10 : -10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        style={{
          position: 'absolute',
          left,
          top: preferAbove ? 'auto' : top,
          bottom: preferAbove ? window.innerHeight - top : 'auto',
          width: popoverWidth,
          maxHeight: maxHeight,
          zIndex: 50
        }}
        className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl border border-[#D0D2CF] dark:border-white/10 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="absolute top-0 start-0 end-0 h-1 bg-[#222222] z-10 shrink-0" />
        
        {isLoading ? (
          <div className="p-6 flex flex-col items-center justify-center gap-3">
            <Sparkles className="w-5 h-5 text-[#222222] dark:text-[#A4F5A6] animate-spin" />
            <span className="text-xs font-semibold text-[#666666] dark:text-[#D0D2CF]">{t.translating}</span>
          </div>
        ) : wordData ? (() => {
            const wordIsAr = /[\u0600-\u06FF]/.test(wordData.word);
            const translationIsAr = /[\u0600-\u06FF]/.test(wordData.translation);
            const definitionIsAr = wordData.definition ? /[\u0600-\u06FF]/.test(wordData.definition) : false;
            
            return (
              <div className="p-4 flex flex-col gap-3 overflow-y-auto max-h-full">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0" dir={wordIsAr || translationIsAr ? 'rtl' : 'ltr'}>
                    <h3 className={`text-base md:text-lg font-bold text-[#222222] dark:text-white break-words whitespace-pre-wrap ${
                      wordIsAr ? 'font-arabic-serif' : 'font-serif'
                    }`}>
                      {wordData.word}
                    </h3>
                    <p className={`text-sm font-semibold text-[#222222] dark:text-[#D0D2CF] mt-1 break-words whitespace-pre-wrap ${
                      translationIsAr ? 'font-arabic-sans' : ''
                    }`}>
                      {wordData.translation}
                    </p>
                    {wordData.phonetic && (
                      <p className="text-[10px] font-mono text-[#666666] dark:text-[#D0D2CF] mt-0.5" dir="ltr">
                        {wordData.phonetic}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handlePlayTTS(wordData.word, wordData.sourceLanguage)}
                    className={`shrink-0 p-2 rounded-xl transition-colors ${
                      isPlayingAudio
                        ? 'bg-[#222222] text-[#EFF1EE] animate-pulse'
                        : 'bg-[#EFF1EE] dark:bg-white/10 text-[#222222] dark:text-[#EFF1EE] hover:bg-[#D0D2CF]'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                
                {wordData.definition && (
                  <p className={`text-xs text-[#666666] dark:text-[#D0D2CF] leading-relaxed ${
                    definitionIsAr ? 'font-arabic-sans text-end rtl' : ''
                  }`} dir={definitionIsAr ? 'rtl' : 'ltr'}>
                    {wordData.definition}
                  </p>
                )}
    
                <div className="flex items-center justify-between pt-3 border-t border-[#D0D2CF]/50 dark:border-white/10 mt-1 shrink-0">
                  <button
                    onClick={handleCopy}
                    className="text-xs font-semibold text-[#666666] hover:text-[#222222] dark:hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#222222]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? t.copied : t.copy}
                  </button>
                  
                  <button
                    onClick={() => onSaveToVocabulary(wordData)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSaved
                        ? 'bg-[#A4F5A6]/20 text-[#222222] dark:text-[#EFF1EE] border border-[#A4F5A6]'
                        : 'bg-[#222222] hover:bg-[#A4F5A6] text-[#EFF1EE] hover:text-[#222222] shadow-xs'
                    }`}
                  >
                    {isSaved ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                    {isSaved ? t.savedToVocab : t.saveToVocab}
                  </button>
                </div>
              </div>
            );
          })() : null}
      </motion.div>
    );
  }

  // Fallback to large modal if no position (e.g. from vocabulary list)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-white dark:bg-[#1E1E1E] rounded-3xl shadow-2xl border border-[#D0D2CF] dark:border-white/10 p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 start-0 end-0 h-2 bg-[#222222]" />
        
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-2 rounded-full text-[#666666] hover:bg-[#EFF1EE] dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isLoading ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#222222] flex items-center justify-center text-[#EFF1EE] animate-spin">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#222222] dark:text-[#EFF1EE]">
              {t.translating}
            </p>
          </div>
        ) : wordData ? (() => {
            const wordIsAr = /[\u0600-\u06FF]/.test(wordData.word);
            const translationIsAr = /[\u0600-\u06FF]/.test(wordData.translation);
            const definitionIsAr = wordData.definition ? /[\u0600-\u06FF]/.test(wordData.definition) : false;
            const contextIsAr = wordData.contextSentence ? /[\u0600-\u06FF]/.test(wordData.contextSentence) : false;

            return (
              <div className="space-y-5">
                <div className={`flex items-start justify-between pe-8 gap-4 ${
                  wordIsAr || translationIsAr ? 'flex-row-reverse' : ''
                }`}>
                  <div className="flex-1 min-w-0" dir={wordIsAr || translationIsAr ? 'rtl' : 'ltr'}>
                    <h2 className={`text-3xl font-bold text-[#222222] dark:text-white leading-snug ${
                      wordIsAr ? 'font-arabic-serif' : 'font-serif'
                    }`}>
                      {wordData.word}
                    </h2>
                    <p className={`text-xl font-bold mt-1 text-[#222222] dark:text-[#D0D2CF] ${
                      translationIsAr ? 'font-arabic-sans' : ''
                    }`}>
                      {wordData.translation}
                    </p>
                    {wordData.phonetic && (
                      <p className="text-sm font-mono text-[#666666] dark:text-[#D0D2CF] mt-2" dir="ltr">
                        {wordData.phonetic}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handlePlayTTS(wordData.word, wordData.sourceLanguage)}
                    className={`p-3 rounded-2xl transition-colors shrink-0 ${
                      isPlayingAudio ? 'bg-[#222222] text-[#EFF1EE] animate-pulse' : 'bg-[#EFF1EE] dark:bg-white/10 text-[#222222] dark:text-[#EFF1EE]'
                    }`}
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                </div>
                
                {wordData.definition && (
                  <div className="p-4 rounded-2xl bg-[#EFF1EE] dark:bg-white/5 border border-[#D0D2CF] dark:border-white/10" dir={definitionIsAr ? 'rtl' : 'ltr'}>
                    <p className={`text-sm text-[#222222] dark:text-[#D0D2CF] leading-relaxed ${
                      definitionIsAr ? 'font-arabic-sans text-end rtl' : ''
                    }`}>
                      {wordData.definition}
                    </p>
                  </div>
                )}
                
                {wordData.contextSentence && (
                  <div className="text-sm space-y-2" dir={contextIsAr ? 'rtl' : 'ltr'}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#666666] block text-start rtl:text-end">{t.contextSentence}:</span>
                      <button
                        onClick={() => handlePlayTTS(wordData.contextSentence, wordData.sourceLanguage)}
                        className="px-2 py-1 rounded-lg bg-[#EFF1EE] dark:bg-white/10 text-[#222222] dark:text-[#EFF1EE] hover:bg-[#D0D2CF] transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                        title="Listen to context sentence"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen</span>
                      </button>
                    </div>
                    <p className={`italic text-[#222222] dark:text-[#D0D2CF] bg-[#EFF1EE] dark:bg-white/5 p-3 rounded-xl ${
                      contextIsAr ? 'font-arabic-serif text-end rtl' : ''
                    }`}>
                      "{wordData.contextSentence}"
                    </p>
                  </div>
                )}
                <div className="pt-4 flex items-center justify-between border-t border-[#D0D2CF] dark:border-white/10">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-[#666666] hover:bg-[#EFF1EE] dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#222222]" /> : <Copy className="w-4 h-4" />}
                    {copied ? t.copied : t.copy}
                  </button>
                  <button
                    onClick={() => onSaveToVocabulary(wordData)}
                    className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
                      isSaved ? 'bg-[#A4F5A6]/20 text-[#222222] dark:text-[#EFF1EE] border border-[#A4F5A6]' : 'bg-[#222222] text-[#EFF1EE] shadow-xs hover:bg-[#A4F5A6] hover:text-[#222222]'
                    }`}
                  >
                    {isSaved ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                    {isSaved ? t.savedToVocab : t.saveToVocab}
                  </button>
                </div>
              </div>
            );
        })() : null}
      </motion.div>
    </motion.div>
  );
};
