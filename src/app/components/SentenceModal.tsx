// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getTranslation } from '../utils/i18n';
import { playTTS } from '../utils/tts';
import {
  Sparkles,
  X,
  Volume2,
  Copy,
  Check,
  Globe,
  BookOpen,
  Info,
  Award
} from 'lucide-react';

interface GrammarBreakdownItem {
  segment: string;
  meaning: string;
  explanation: string;
}

interface SentenceExplanation {
  fullTranslation: string;
  literalTranslation?: string;
  grammarBreakdown?: GrammarBreakdownItem[];
  difficulty?: string;
  culturalNote?: string;
}

interface SentenceModalProps {
  sentence: string;
  explanation: SentenceExplanation | null;
  isLoading: boolean;
  onClose: () => void;
  targetLanguage: string;
  interfaceLanguage?: string;
}

export const SentenceModal: React.FC<SentenceModalProps> = ({
  sentence,
  explanation,
  isLoading,
  onClose,
  targetLanguage,
  interfaceLanguage,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const t = getTranslation(interfaceLanguage || targetLanguage);

  if (!sentence) return null;

  const handlePlayTTS = (text: string) => {
    setIsPlayingAudio(true);
    // Best effort source language detection or fallback
    const isArabic = /[\u0600-\u06FF]/.test(text);
    const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
    const isChinese = /[\u4E00-\u9FFF]/.test(text) && !isJapanese;
    
    let lang = targetLanguage;
    if (isArabic) lang = 'ar';
    else if (isJapanese) lang = 'ja';
    else if (isChinese) lang = 'zh';

    playTTS(text, lang, 
      () => setIsPlayingAudio(true), 
      () => setIsPlayingAudio(false)
    );
  };

  const handleCopy = () => {
    if (explanation) {
      const textToCopy = `Sentence: "${sentence}"\nTranslation: ${explanation.fullTranslation}${explanation.literalTranslation ? `\nLiteral: ${explanation.literalTranslation}` : ''}`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sentenceIsAr = /[\u0600-\u06FF]/.test(sentence);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs select-text"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-2xl bg-white dark:bg-[#1D201A] rounded-3xl shadow-2xl border-2 border-[#334DAF]/30 dark:border-stone-800 p-6 sm:p-7 overflow-y-auto max-h-[85vh] custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 start-0 end-0 h-2 bg-[#334DAF]" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#334DAF]" />
            <h2 className="text-lg font-bold text-stone-900 dark:text-white font-serif-classic">
              Sentence Translation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#334DAF]/10 flex items-center justify-center text-[#334DAF] animate-spin">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                AI Smart Breakdown...
              </p>
              <p className="text-xs text-stone-500">
                Analyzing grammar structure and literal context.
              </p>
            </div>
          </div>
        ) : explanation ? (
          <div className="space-y-6">
            
            {/* Original Sentence Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#A68A64] tracking-wider uppercase">
                  Original
                </span>
                <button
                  onClick={() => handlePlayTTS(sentence)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isPlayingAudio ? 'bg-[#334DAF] text-white' : 'bg-[#E8F2FE] dark:bg-stone-800 text-[#334DAF] hover:bg-[#D0E4FE]'
                  }`}
                  title="Listen to pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className={`text-xl font-bold p-4 rounded-2xl bg-[#E8F2FE] dark:bg-stone-800/60 border border-[#E9E5DE] dark:border-stone-800 leading-relaxed ${
                sentenceIsAr ? 'font-arabic-serif text-end rtl' : 'font-serif-classic'
              }`} dir={sentenceIsAr ? 'rtl' : 'ltr'}>
                "{sentence}"
              </p>
            </div>

            {/* Translation Card */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-[#334DAF] tracking-wider uppercase flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Natural Translation
              </span>
              <p className="text-lg font-bold text-[#091F5C] dark:text-stone-100 p-4 rounded-2xl bg-[#334DAF]/5 border border-[#334DAF]/20 leading-relaxed">
                {explanation.fullTranslation}
              </p>
            </div>

            {/* Literal gloss if present */}
            {explanation.literalTranslation && (
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-[#767168] tracking-wider uppercase flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Word-by-Word Gloss
                </span>
                <p className="text-sm italic text-stone-700 dark:text-stone-300 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/30 border border-stone-200/50 dark:border-stone-800">
                  {explanation.literalTranslation}
                </p>
              </div>
            )}

            {/* Difficulty Badge */}
            {explanation.difficulty && (
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#A68A64]" />
                <span className="text-xs font-semibold text-stone-500">Complexity:</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#A68A64]/10 text-[#A68A64] border border-[#A68A64]/20">
                  {explanation.difficulty}
                </span>
              </div>
            )}

            {/* Grammar Breakdown */}
            {explanation.grammarBreakdown && explanation.grammarBreakdown.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-extrabold text-stone-500 tracking-wider uppercase block">
                  Grammar & Vocabulary Breakdown
                </span>
                <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200/60 dark:border-stone-800 rounded-2xl overflow-hidden bg-white dark:bg-[#1D201A]">
                  {explanation.grammarBreakdown.map((item, idx) => (
                    <div key={idx} className="p-3 sm:p-4 hover:bg-stone-50/50 dark:hover:bg-stone-800/20 transition-colors flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 justify-between">
                      <div className="flex items-center gap-2 shrink-0 min-w-[100px]">
                        <span className="font-bold text-[#334DAF] text-sm shrink-0">
                          {item.segment}
                        </span>
                        <button
                          onClick={() => handlePlayTTS(item.segment)}
                          className="p-1 rounded-md bg-[#E8F2FE] dark:bg-stone-800 text-[#334DAF] hover:bg-[#D0E4FE] transition-colors cursor-pointer"
                          title="Listen to segment pronunciation"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="space-y-1 flex-1">
                        <span className="text-sm font-semibold text-stone-900 dark:text-stone-200 block">
                          {item.meaning}
                        </span>
                        <span className="text-xs text-stone-500 block leading-relaxed">
                          {item.explanation}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cultural or Idiom Note */}
            {explanation.culturalNote && (
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs leading-relaxed text-amber-900 dark:text-amber-200 flex gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Note & Idiomatic Context:</span>
                  {explanation.culturalNote}
                </div>
              </div>
            )}

            {/* Footer buttons */}
            <div className="pt-4 flex items-center justify-between border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-[#334DAF]" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Details' : 'Copy Breakdown'}
              </button>
              
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl text-sm font-bold bg-[#334DAF] hover:bg-[#091F5C] text-white shadow-md transition-all"
              >
                Got It
              </button>
            </div>

          </div>
        ) : (
          <div className="py-8 text-center text-stone-500">
            Could not retrieve translation breakdown.
          </div>
        )}
      </motion.div>
    </div>
  );
};
