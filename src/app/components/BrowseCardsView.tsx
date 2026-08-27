// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import { VocabularyItem, Deck, ReaderSettings } from '../types';
import { LexicalEntry, CEFRLevel } from '../types/lexicon';
import { Search, Volume2, Check, ChevronRight, Globe, Filter, BookOpen, Inbox, FolderOpen, ArrowLeft, MoreVertical, X, RotateCcw, LayoutGrid, Layers, Sparkles } from 'lucide-react';
import { playTTS } from '../utils/tts';
import { convertLexicalEntryToUserCard } from '../utils/lexiconClient';
import { searchLocalLexicon } from '../utils/localLexicon';
import { getTopicVisual } from '../utils/topicImages';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { getTranslation } from '../utils/i18n';
import { getCardTranslation } from '../utils/cardTranslations';

interface BrowseCardsViewProps {
  decks: Deck[];
  settings?: ReaderSettings;
  onAddCardToDeck: (card: VocabularyItem, targetDeckId: string) => void;
  userVocabulary?: VocabularyItem[];
  onSubViewChange?: (subView: 'study' | 'decks' | 'saved-words' | 'browse') => void;
}

type BrowseViewStep = 'libraryHome' | 'levelView' | 'deckView';
type LanguageOption = 'English' | 'Spanish' | 'German' | 'Arabic' | 'French';

// --- INTERACTIVE SWIPE DECK COMPONENT ---
const InteractiveDeck: React.FC<{
  deckName: string;
  language: string;
  level: string;
  activeDeckCards: LexicalEntry[];
  userKnownCardIds: Set<string>;
  onAddCardToDeck: (card: VocabularyItem, deckId: string) => void;
  onClose: () => void;
  settings?: ReaderSettings;
}> = ({ deckName, language, level, activeDeckCards, userKnownCardIds, onAddCardToDeck, onClose, settings }) => {
  const t = getTranslation(settings?.interfaceLanguage);
  const [dismissedCardIds, setDismissedCardIds] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('ribble_dismissed_cards') || '[]'));
    } catch { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem('ribble_dismissed_cards', JSON.stringify(Array.from(dismissedCardIds)));
  }, [dismissedCardIds]);

  const [localQueue, setLocalQueue] = useState<LexicalEntry[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setLocalQueue(activeDeckCards.filter(c => !userKnownCardIds.has(c.word.toLowerCase()) && !dismissedCardIds.has(c.id)));
    setIsReady(true);
  }, []);

  const totalCount = activeDeckCards.length;
  const processedCount = totalCount - localQueue.length;

  const [exitDir, setExitDir] = useState<'up' | 'down' | null>(null);
  const dragY = useMotionValue(0);

  const topZoneOpacity = useTransform(dragY, [0, -150], [0, 1]);
  const bottomZoneOpacity = useTransform(dragY, [0, 150], [0, 1]);
  const cardRotate = useTransform(dragY, [-300, 300], [-8, 8]);

  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [showOptions, setShowOptions] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [translationOnFront, setTranslationOnFront] = useState(false);
  const [viewMode, setViewMode] = useState<'swipe' | 'grid'>('swipe');

  const toggleFlip = (id: string) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAction = (card: LexicalEntry, direction: 'up' | 'down') => {
    setExitDir(direction);
    setLocalQueue(prev => prev.filter(c => c.id !== card.id));
    
    if (direction === 'up') {
      onAddCardToDeck(convertLexicalEntryToUserCard(card, 'learning-words', undefined, settings?.interfaceLanguage), 'learning-words');
    } else {
      setDismissedCardIds(prev => new Set(prev).add(card.id));
    }
  };

  const handleSpeech = (text: string, langToSpeak: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playTTS(text, langToSpeak);
  };

  const stack = localQueue.slice(0, 3).reverse();
  const topCardId = stack[stack.length - 1]?.id;
  
  useEffect(() => {
    if (autoPlay && topCardId) {
      const topCard = stack[stack.length - 1];
      if (topCard && !flippedCards[topCardId]) {
        // Simple delay to let animation finish
        const t = setTimeout(() => {
          const textToSpeak = translationOnFront ? getCardTranslation(topCard, settings?.interfaceLanguage) : topCard.word;
          const langToSpeak = translationOnFront ? (settings?.interfaceLanguage || 'English') : language;
          playTTS(textToSpeak, langToSpeak);
        }, 300);
        return () => clearTimeout(t);
      }
    }
  }, [topCardId, autoPlay, stack, translationOnFront, flippedCards, language, settings?.interfaceLanguage]);

  const restartDeck = () => {
    setDismissedCardIds(prev => {
      const next = new Set(prev);
      activeDeckCards.forEach(c => next.delete(c.id));
      return next;
    });
    setLocalQueue(activeDeckCards.filter(c => !userKnownCardIds.has(c.word.toLowerCase())));
  };

  if (!isReady) {
    return (
      <div className="fixed inset-0 z-[60] bg-[#EFF1EE] dark:bg-[#1E1E1E] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#A4F5A6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const cardVariants = {
    initial: { scale: 0.9, opacity: 0, y: 30, rotate: 0 },
    enter: ({ stackIndex }: { stackIndex: number }) => ({
      scale: 1 - (stackIndex * 0.05),
      opacity: 1 - (stackIndex * 0.15),
      y: stackIndex * 16,
      rotate: 0,
      zIndex: 10 - stackIndex,
      transition: { type: 'spring', stiffness: 500, damping: 35, mass: 0.8 }
    }),
    exit: ({ exitDir }: { exitDir: 'up' | 'down' }) => ({
      y: exitDir === 'up' ? -1000 : 1000,
      rotate: exitDir === 'up' ? 5 : -5,
      opacity: 0,
      scale: 0.85,
      transition: { type: 'spring', stiffness: 450, damping: 40, mass: 0.6 }
    })
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#EFF1EE] dark:bg-[#121212] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="pt-4 sm:pt-8 px-4 py-4 flex items-center justify-between z-30">
        <button onClick={onClose} className="p-2 text-[#666666] hover:text-[#222222] dark:hover:text-white transition-colors bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10 rounded-full shadow-xs cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#666666] dark:text-[#D0D2CF]">{language}</span>
            <span className="w-1 h-1 bg-[#D0D2CF] rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#666666] dark:text-[#D0D2CF]">{level}</span>
          </div>
          <h2 className="text-base font-bold text-[#222222] dark:text-white capitalize leading-none">{deckName}</h2>
        </div>
        
        <div className="flex items-center gap-2 z-50">
          {/* View Mode Toggle Pill */}
          <div className="flex items-center bg-white dark:bg-[#1E1E1E] p-1 rounded-2xl border border-[#D0D2CF] dark:border-white/10 shadow-xs">
            <button
              onClick={() => setViewMode('swipe')}
              title="Flashcards Stack Mode"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'swipe'
                  ? 'bg-[#222222] text-[#EFF1EE] shadow-xs'
                  : 'text-[#666666] hover:text-[#222222] dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Stack</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Scrollable Grid Mode"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#222222] text-[#EFF1EE] shadow-xs'
                  : 'text-[#666666] hover:text-[#222222] dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          <div className="relative">
            <button onClick={() => setShowOptions(!showOptions)} className="p-2 text-[#666666] hover:text-[#222222] dark:hover:text-white transition-colors bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10 rounded-full shadow-xs cursor-pointer">
              <MoreVertical className="w-5 h-5" />
            </button>
            
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10, rotateX: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10, rotateX: -10 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  style={{ transformOrigin: 'top right' }}
                  className="absolute end-0 top-full mt-2 w-64 bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10 rounded-2xl shadow-xl overflow-hidden py-2"
                >
                  <div className="px-4 py-2 border-b border-[#D0D2CF] dark:border-white/10">
                    <h4 className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">{t.displayOptions || 'Display Options'}</h4>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    <button onClick={() => setViewMode(viewMode === 'swipe' ? 'grid' : 'swipe')} className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-[#222222] dark:text-[#EFF1EE] hover:bg-[#EFF1EE] dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                      <span>{t.viewMode || 'View Mode'}</span>
                      <span className="text-xs bg-[#EFF1EE] dark:bg-black/40 text-[#222222] dark:text-[#EFF1EE] px-2 py-1 rounded-md font-bold uppercase tracking-wider">{viewMode}</span>
                    </button>

                    <button onClick={() => setTranslationOnFront(!translationOnFront)} className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-[#222222] dark:text-[#EFF1EE] hover:bg-[#EFF1EE] dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                      <span>{t.translationOnFront || 'Translation on Front'}</span>
                      <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${translationOnFront ? 'bg-[#A4F5A6]' : 'bg-[#D0D2CF] dark:bg-stone-700'}`}>
                        <div className={`w-4 h-4 bg-[#222222] rounded-full transition-transform ${translationOnFront ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </button>
                    
                    <button onClick={() => setAutoPlay(!autoPlay)} className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-[#222222] dark:text-[#EFF1EE] hover:bg-[#EFF1EE] dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                      <span>{t.autoPlayAudio || 'Auto-play Audio'}</span>
                      <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${autoPlay ? 'bg-[#A4F5A6]' : 'bg-[#D0D2CF] dark:bg-stone-700'}`}>
                        <div className={`w-4 h-4 bg-[#222222] rounded-full transition-transform ${autoPlay ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </button>
                  </div>

                  <div className="p-2 border-t border-[#D0D2CF] dark:border-white/10 mt-1">
                    <button onClick={() => { restartDeck(); setShowOptions(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer">
                      <RotateCcw className="w-4 h-4" />
                      <span>{t.restartDeck || 'Restart Deck'}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="px-8 pb-4 z-30 max-w-md mx-auto w-full">
        <div className="w-full bg-[#D0D2CF] dark:bg-white/10 h-1.5 rounded-full overflow-hidden flex">
          <div className="bg-[#A4F5A6] h-full transition-all duration-300" style={{ width: `${(processedCount / Math.max(totalCount, 1)) * 100}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#666666] dark:text-[#D0D2CF]">{processedCount} {t.processed || 'Processed'}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#666666] dark:text-[#D0D2CF]">{localQueue.length} {t.remaining || 'Remaining'}</span>
        </div>
      </div>

      {/* Interactive Area */}
      <div className="flex-1 min-h-0 relative flex flex-col overflow-hidden">
        {viewMode === 'grid' ? (
          <div className="flex-1 h-full min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-8 scroll-smooth">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto pb-32">
              {localQueue.map(card => {
                const translation = getCardTranslation(card, settings?.interfaceLanguage);
                const example = card.senses?.[0]?.examples?.[0]?.text || card.senses?.[0]?.definition || '';
                const isFlipped = !!flippedCards[card.id];
                const primaryText = isFlipped 
                  ? (translationOnFront ? card.word : translation) 
                  : (translationOnFront ? translation : card.word);
                const secondaryText = isFlipped 
                  ? (translationOnFront ? translation : card.word) 
                  : (translationOnFront ? card.word : translation);

                const visual = getTopicVisual(deckName, card.word);

                return (
                  <div 
                    key={card.id} 
                    className="bg-white dark:bg-[#1E1E1E] rounded-3xl overflow-hidden shadow-xs hover:shadow-md border border-[#D0D2CF] dark:border-white/10 flex flex-col h-full transition-all relative group"
                  >
                    {/* Topic Picture Header */}
                    <div className="relative h-36 w-full overflow-hidden bg-[#EFF1EE] dark:bg-stone-800 shrink-0">
                      <img 
                        src={visual.imageUrl} 
                        alt={card.word}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
                      
                      {/* Top Overlay Controls */}
                      <div className="absolute top-3 start-3 end-3 flex items-center justify-between z-10">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20 px-2.5 py-1 rounded-lg">
                          {card.language}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeech(
                              primaryText, 
                              translationOnFront ? (settings?.interfaceLanguage || 'English') : language, 
                              e
                            );
                          }}
                          title={t.listenAudio || "Listen pronunciation"}
                          className="p-2 bg-white/95 text-[#222222] rounded-full hover:scale-110 active:scale-95 transition-transform cursor-pointer shadow-md backdrop-blur-md"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Bottom Image Tags */}
                      <div className="absolute bottom-2.5 start-3 flex items-center gap-1.5 z-10">
                        <span className="text-[9px] font-black uppercase tracking-wider bg-[#A4F5A6] text-[#222222] px-2 py-0.5 rounded-md">
                          {card.cefr || level}
                        </span>
                        {card.partOfSpeech && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-xs text-white px-2 py-0.5 rounded-md">
                            {card.partOfSpeech}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Card Content - Click to Flip */}
                    <div 
                      onClick={() => toggleFlip(card.id)}
                      className="p-5 flex-1 flex flex-col cursor-pointer select-none group/body"
                      title={t.tapToFlip || "Click to flip translation"}
                    >
                      <h3 className="text-2xl font-black text-[#222222] dark:text-white tracking-tight leading-snug mb-1 group-hover/body:text-[#B2A1FF] transition-colors">
                        {primaryText}
                      </h3>
                      {!translationOnFront && !isFlipped && card.phonetic && (
                        <p className="text-xs text-[#666666] font-mono mb-3">{card.phonetic}</p>
                      )}
                      
                      {example && example !== card.word && (
                        <p className="text-xs text-[#666666] dark:text-[#D0D2CF] italic mb-4 line-clamp-2 mt-1">
                          "{example}"
                        </p>
                      )}

                      <div className="mt-auto pt-4 border-t border-[#D0D2CF] dark:border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-[#666666] tracking-widest block mb-0.5">
                            {isFlipped ? (translationOnFront ? card.language : (t.originalText || 'Original')) : (translationOnFront ? card.language : (t.translation || 'Translation'))}
                          </span>
                          <h4 className="text-base font-bold text-[#222222] dark:text-white truncate max-w-[180px]">
                            {secondaryText}
                          </h4>
                        </div>
                        <span className="text-[10px] font-medium text-[#666666] dark:text-[#D0D2CF] bg-[#EFF1EE] dark:bg-white/5 px-2 py-0.5 rounded-full">
                          {t.tapToFlip || 'Tap to flip'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 pt-0 flex items-center gap-2">
                      <button 
                        onClick={() => handleAction(card, 'down')}
                        title={t.dismissAlreadyKnow || "Dismiss / Already Know"}
                        className="flex-1 py-2.5 bg-[#EFF1EE] hover:bg-[#D0D2CF] dark:bg-white/5 dark:hover:bg-white/10 text-[#222222] dark:text-[#EFF1EE] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>{t.dismiss || 'Dismiss'}</span>
                      </button>
                      <button 
                        onClick={() => handleAction(card, 'up')}
                        title={t.addToLearnDeck || "Add to Learn Deck"}
                        className="flex-1 py-2.5 bg-[#A4F5A6] hover:bg-[#8ee590] active:scale-95 text-[#222222] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>{t.learn || 'Learn'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
              {localQueue.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-[#A4F5A6] rounded-full flex items-center justify-center mb-4 text-[#222222]">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h2 className="text-2xl font-black text-[#222222] dark:text-white mb-2">{t.deckComplete || 'Deck Complete'}</h2>
                  <p className="text-sm text-[#666666] mb-6">{t.processedAllCardsDesc || 'You have processed all cards in this topic.'}</p>
                  <button onClick={restartDeck} className="px-6 py-2.5 bg-[#222222] hover:bg-black text-[#EFF1EE] rounded-xl font-bold hover:scale-105 transition-transform cursor-pointer">
                    {t.restartDeck || 'Restart Deck'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>

        {/* Top Destination - To Learn */}
        <motion.div style={{ opacity: topZoneOpacity }} className="absolute top-0 start-0 w-full h-[40%] bg-gradient-to-b from-[#A4F5A6]/20 to-transparent flex flex-col items-center justify-start pt-12 z-10 pointer-events-none">
          <div className="bg-[#A4F5A6] text-[#222222] p-4 rounded-full shadow-lg mb-3">
            <BookOpen className="w-8 h-8" />
          </div>
          <span className="text-[#222222] dark:text-[#A4F5A6] font-black uppercase tracking-widest text-sm drop-shadow-sm">{t.toLearn || 'To Learn'}</span>
        </motion.div>

        {/* Bottom Destination - Already Know */}
        <motion.div style={{ opacity: bottomZoneOpacity }} className="absolute bottom-0 start-0 w-full h-[40%] bg-gradient-to-t from-[#D0D2CF]/30 to-transparent flex flex-col items-center justify-end pb-12 z-10 pointer-events-none">
          <span className="text-[#666666] dark:text-[#D0D2CF] font-black uppercase tracking-widest text-sm mb-3 drop-shadow-sm">{t.alreadyKnow || 'Already Know'}</span>
          <div className="bg-[#D0D2CF] dark:bg-stone-700 text-[#222222] dark:text-white p-4 rounded-full shadow-lg">
            <Check className="w-8 h-8" />
          </div>
        </motion.div>

        {/* Deck Cards Stack */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none pb-[70px]">
          <AnimatePresence>
            {localQueue.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-[#1E1E1E] rounded-3xl shadow-xl border border-[#D0D2CF] dark:border-white/10 pointer-events-auto"
              >
                <div className="w-20 h-20 bg-[#A4F5A6] text-[#222222] rounded-full flex items-center justify-center mb-6">
                  <Check className="w-10 h-10 stroke-[3]" />
                </div>
                <h2 className="text-2xl font-black text-[#222222] dark:text-white mb-2">{t.deckComplete || 'Deck Complete'}</h2>
                <p className="text-sm text-[#666666] dark:text-[#D0D2CF] mb-8 max-w-xs">{t.processedAllCardsDesc || 'You have processed all cards in this topic.'}</p>
                
                <div className="w-full space-y-3">
                  <button onClick={onClose} className="w-full py-3.5 bg-[#222222] hover:bg-black text-[#EFF1EE] rounded-2xl font-bold shadow-md hover:scale-105 transition-transform cursor-pointer">
                    {t.returnToLibrary || 'Return to Library'}
                  </button>
                  <button onClick={restartDeck} className="w-full py-3.5 bg-[#EFF1EE] hover:bg-[#D0D2CF] text-[#222222] rounded-2xl font-bold transition-colors cursor-pointer">
                    {t.restartDeck || 'Restart Deck'}
                  </button>
                </div>
              </motion.div>
            ) : (
              stack.map((card, idx, arr) => {
                const isTop = idx === arr.length - 1;
                const stackIndex = arr.length - 1 - idx;
                
                const translation = getCardTranslation(card, settings?.interfaceLanguage);
                const example = card.senses?.[0]?.examples?.[0]?.text || card.senses?.[0]?.definition || '';

                const visual = getTopicVisual(deckName, card.word);

                return (
                  <motion.div
                    key={card.id}
                    custom={{ stackIndex, exitDir: isTop ? exitDir : null }}
                    variants={cardVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    drag={isTop ? "y" : false}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.9}
                    onDragEnd={(e, info) => {
                      if (!isTop) return;
                      if (info.offset.y < -120) handleAction(card, 'up');
                      else if (info.offset.y > 120) handleAction(card, 'down');
                    }}
                    style={isTop ? { 
                      y: dragY, 
                      rotate: cardRotate,
                      cursor: 'grab'
                    } : {}}
                    className="absolute w-[85vw] max-w-sm h-[60vh] max-h-[480px] pointer-events-auto active:cursor-grabbing origin-bottom perspective-[1000px]"
                    onClick={() => {
                      if (isTop) toggleFlip(card.id);
                    }}
                  >
                    <motion.div
                      className="w-full h-full relative"
                      style={{ transformStyle: 'preserve-3d' }}
                      animate={{ rotateY: flippedCards[card.id] ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 35, mass: 0.8 }}
                    >
                      {/* --- FRONT FACE --- */}
                      <div 
                        className="absolute inset-0 bg-white dark:bg-[#1E1E1E] rounded-3xl shadow-2xl overflow-hidden p-5 flex flex-col justify-between border border-[#D0D2CF] dark:border-white/10"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        {/* Photo Banner with Controls */}
                        <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-[#EFF1EE] dark:bg-stone-700/50 shrink-0">
                          <img 
                            src={visual.imageUrl} 
                            alt={card.word}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                          {/* Top Language Badge */}
                          <div className="absolute top-2.5 start-2.5 end-2.5 flex items-center justify-between z-10">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20 px-2.5 py-1 rounded-lg">
                              {card.language}
                            </span>
                            {card.type && (
                              <span className="text-[10px] font-bold text-white/90 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md uppercase tracking-wider">
                                {card.type.replace('_', ' ')}
                              </span>
                            )}
                          </div>

                          {/* Pronunciation Float Button */}
                          <div className="absolute bottom-2.5 end-2.5 z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSpeech(
                                  translationOnFront ? translation : card.word, 
                                  translationOnFront ? (settings?.interfaceLanguage || 'English') : language, 
                                  e
                                );
                              }}
                              className="p-2.5 bg-white/95 dark:bg-[#1E1E1E]/95 text-[#222222] dark:text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-2 space-y-2">
                          <div className="space-y-1">
                            <h3 className="text-2xl sm:text-3xl font-black text-[#222222] dark:text-white tracking-tight leading-tight px-2">
                              {translationOnFront ? translation : card.word}
                            </h3>
                            {(!translationOnFront && card.phonetic) && (
                              <p className="text-xs text-[#666666] font-mono">{card.phonetic}</p>
                            )}
                          </div>

                          {(!translationOnFront && example && example !== card.word) && (
                            <p className="text-xs sm:text-sm text-[#666666] dark:text-[#D0D2CF] italic max-w-[95%] mx-auto line-clamp-2 leading-snug">
                              "{example}"
                            </p>
                          )}
                        </div>
                        
                        {/* Hint to flip */}
                        <div className="flex justify-center pt-2.5 border-t border-[#D0D2CF] dark:border-white/10">
                          <span className="text-[10px] font-bold text-[#666666] dark:text-[#D0D2CF] uppercase tracking-widest">
                            {t.tapToReveal || 'Tap to reveal'} {translationOnFront ? card.language : (t.translation || 'translation')}
                          </span>
                        </div>
                      </div>

                      {/* --- BACK FACE --- */}
                      <div 
                        className="absolute inset-0 bg-[#EFF1EE] dark:bg-[#1E1E1E] rounded-3xl shadow-2xl p-6 flex flex-col items-center justify-center border border-[#D0D2CF] dark:border-white/10"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <span className="text-[10px] uppercase font-bold text-[#666666] tracking-widest mb-3">
                          {translationOnFront ? card.language : (t.translation || 'Translation')}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black text-[#222222] dark:text-white text-center leading-tight">
                          {translationOnFront ? card.word : translation}
                        </h3>
                        {translationOnFront && card.phonetic && (
                          <p className="text-sm text-[#666666] font-mono mt-2">{card.phonetic}</p>
                        )}
                        <p className="text-xs text-[#666666] font-medium mt-6 border px-3 py-1.5 rounded-full border-[#D0D2CF] dark:border-white/10">
                          {t.tapToFlipBack || 'Tap to flip back'}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Fallback Buttons (Bottom) */}
        {localQueue.length > 0 && (
          <div className="absolute bottom-8 start-0 w-full flex justify-center gap-6 z-30 pointer-events-auto">
            <button 
              onClick={() => handleAction(stack[stack.length - 1], 'down')} 
              className="w-16 h-16 bg-white dark:bg-[#1E1E1E] rounded-full shadow-xl flex items-center justify-center text-[#666666] hover:text-[#222222] dark:hover:text-white hover:scale-105 transition-all border border-[#D0D2CF] dark:border-white/10 cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>
            <button 
              onClick={() => handleAction(stack[stack.length - 1], 'up')} 
              className="w-16 h-16 bg-[#A4F5A6] rounded-full shadow-xl flex items-center justify-center text-[#222222] hover:bg-[#8ee590] hover:scale-105 transition-all cursor-pointer"
            >
              <BookOpen className="w-7 h-7" />
            </button>
          </div>
        )}

          </>
        )}
      </div>
    </div>
  );
};


// --- MAIN BROWSE CARDS VIEW ---
export const BrowseCardsView: React.FC<BrowseCardsViewProps> = ({
  settings,
  onAddCardToDeck,
  userVocabulary = [],
}) => {
  const t = getTranslation(settings?.interfaceLanguage);
  const [viewStep, setViewStep] = useState<BrowseViewStep>('libraryHome');
  const [activeLanguage, setActiveLanguage] = useState<LanguageOption>(() => {
    const target = settings?.targetLanguage;
    if (target === 'Spanish' || target === 'German' || target === 'Arabic' || target === 'French' || target === 'English') {
      return target;
    }
    return 'English';
  });
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [activeDeckName, setActiveDeckName] = useState<string | null>(null);

  useEffect(() => {
    const target = settings?.targetLanguage;
    if (target === 'Spanish' || target === 'German' || target === 'Arabic' || target === 'French' || target === 'English') {
      setActiveLanguage(target);
    }
  }, [settings?.targetLanguage]);

  const [lexiconEntries, setLexiconEntries] = useState<LexicalEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const LEVELS: string[] = ['A1/A2', 'B1', 'B2', 'C1', 'C2'];
  const LANGUAGES: LanguageOption[] = ['English', 'Spanish', 'German', 'Arabic', 'French'];

  const userKnownCardIds = useMemo(() => new Set(userVocabulary.map(v => v.word.toLowerCase())), [userVocabulary]);

  const loadData = (query: string = '', lang: LanguageOption) => {
    setIsLoading(true);
    try {
      const res = searchLocalLexicon({ 
        q: query, 
        language: lang, 
        limit: 10000 
      });
      setLexiconEntries(res.entries);
    } catch (err) {
      console.error('Failed to search local lexicon:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(searchQuery, activeLanguage);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeLanguage]);

  const filteredByLang = useMemo(() => {
    return lexiconEntries.filter(e => e.language === activeLanguage);
  }, [lexiconEntries, activeLanguage]);

  const cardsInActiveLevel = useMemo(() => {
    if (!activeLevel) return [];
    if (activeLevel === 'A1/A2') {
      return filteredByLang.filter(e => e.cefr === 'A1' || e.cefr === 'A2');
    }
    return filteredByLang.filter(e => e.cefr === activeLevel);
  }, [filteredByLang, activeLevel]);

  const topicsInActiveLevel = useMemo(() => {
    const topicMap = new Map<string, LexicalEntry[]>();
    cardsInActiveLevel.forEach(entry => {
      const mainTopic = entry.topics && entry.topics.length > 0 ? entry.topics[0] : 'General';
      if (!topicMap.has(mainTopic)) topicMap.set(mainTopic, []);
      topicMap.get(mainTopic)!.push(entry);
    });
    return Array.from(topicMap.entries()).map(([name, cards]) => ({ name, cards }));
  }, [cardsInActiveLevel]);

  const activeDeckCards = useMemo(() => {
    if (!activeTopic) return [];
    return topicsInActiveLevel.find(t => t.name === activeTopic)?.cards || [];
  }, [topicsInActiveLevel, activeTopic]);


  const getLangLabel = (lang: LanguageOption) => {
    if (lang === 'English') return t.langEnglish || 'English';
    if (lang === 'Spanish') return t.langSpanish || 'Spanish';
    if (lang === 'German') return t.langGerman || 'German';
    if (lang === 'Arabic') return t.langArabic || 'Arabic';
    if (lang === 'French') return t.langFrench || 'French';
    return lang;
  };

  const getTopicTitle = (topicName: string) => {
    const norm = topicName.toLowerCase().trim();
    if (norm.includes('introduce') || norm.includes('yourself')) return t.topicIntroducingYourself || topicName;
    if (norm.includes('family') || norm.includes('relationship')) return t.topicFamilyRelationships || topicName;
    if (norm.includes('routine')) return t.topicDailyRoutine || topicName;
    if (norm.includes('food') || norm.includes('meal')) return t.topicFoodMeals || topicName;
    if (norm.includes('direction') || norm.includes('travel') || norm.includes('transport')) return t.topicTravelTransport || topicName;
    if (norm.includes('shop') || norm.includes('money')) return t.topicShoppingMoney || topicName;
    if (norm.includes('work') || norm.includes('profession') || norm.includes('job')) return t.topicWorkProfessions || topicName;
    if (norm.includes('hobbi') || norm.includes('hobby') || norm.includes('leisure') || norm.includes('free time')) return t.topicHobbiesLeisure || topicName;
    if (norm.includes('weather') || norm.includes('season')) return t.topicWeatherSeasons || topicName;
    if (norm.includes('health') || norm.includes('feeling') || norm.includes('body')) return t.topicHealthBody || topicName;
    if (norm.includes('home') || norm.includes('live')) return t.topicHomeWhereYouLive || t.topicGeneral || topicName;
    if (norm.includes('emotion') || norm.includes('personality')) return t.topicEmotionsPersonality || topicName;
    if (norm.includes('nature') || norm.includes('environment')) return t.topicNatureEnvironment || topicName;
    if (norm.includes('technol') || norm.includes('media')) return t.topicTechnologyMedia || topicName;
    if (norm.includes('art') || norm.includes('entertainment')) return t.topicArtsEntertainment || topicName;
    if (norm.includes('social') || norm.includes('societ') || norm.includes('issue')) return t.topicSocialIssues || topicName;
    if (norm.includes('general')) return t.topicGeneral || topicName;
    return topicName;
  };

  const handleNavHome = () => {
    setViewStep('libraryHome');
    setActiveLevel(null);
    setActiveTopic(null);
    setSearchQuery('');
  };

  const handleNavLevel = (level: string) => {
    setActiveLevel(level);
    setViewStep('levelView');
    setActiveTopic(null);
  };

  const handleNavDeck = (topicName: string) => {
    setActiveTopic(topicName);
    setActiveDeckName(topicName);
    setViewStep('deckView');
  };

  if (viewStep === 'deckView') {
    return (
      <InteractiveDeck
        deckName={activeDeckName!}
        language={activeLanguage}
        level={activeLevel!}
        activeDeckCards={activeDeckCards}
        userKnownCardIds={userKnownCardIds}
        onAddCardToDeck={onAddCardToDeck}
        onClose={() => setViewStep('levelView')}
        settings={settings}
      />
    );
  }

  return (
    <div id="browse-cards-container" className="w-full max-w-7xl mx-auto space-y-6 pb-20">
      {/* TOP SEARCH AREA */}
      <div id="browse-search-bar-wrap" className="sticky top-0 z-20 bg-[#EFF1EE]/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-[#D0D2CF] dark:border-white/10 py-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:bg-transparent sm:backdrop-blur-none sm:border-none sm:py-0">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
            <input
              id="browse-cards-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value && viewStep !== 'libraryHome') setViewStep('libraryHome');
              }}
              placeholder={t.quickSearchPlaceholder || "Search words, phrases, or topics..."}
              className="w-full ps-11 pe-4 py-3 bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10 rounded-2xl text-sm text-[#222222] dark:text-[#EFF1EE] focus:outline-none focus:ring-2 focus:ring-[#A4F5A6] transition-shadow shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* BREADCRUMBS */}
      {viewStep !== 'libraryHome' && (
        <div id="browse-breadcrumbs" className="flex items-center gap-2 text-sm font-medium text-[#666666] mb-6">
          <button id="browse-breadcrumb-home-btn" onClick={handleNavHome} className="hover:text-[#222222] dark:hover:text-white transition-colors cursor-pointer">{t.navLibrary || 'Library'}</button>
          <ChevronRight className="w-4 h-4" />
          <span id="browse-breadcrumb-current-level" className="text-[#222222] dark:text-white font-semibold">{getLangLabel(activeLanguage)} {activeLevel}</span>
        </div>
      )}

      {/* VIEW: LIBRARY HOME */}
      {viewStep === 'libraryHome' && (
        <div id="browse-library-home-section" className="space-y-10 animate-in fade-in duration-300">
          
          <div id="browse-select-language-container" className="space-y-4">
            <h2 id="browse-select-language-heading" className="text-xl font-bold text-[#222222] dark:text-[#EFF1EE] tracking-tight">{t.selectLanguage || t.interfaceLanguage || 'Select Language'}</h2>
            <div id="browse-languages-selector-list" className="flex flex-wrap items-center gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  id={`browse-lang-btn-${lang.toLowerCase()}`}
                  onClick={() => setActiveLanguage(lang)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    activeLanguage === lang
                      ? 'bg-[#222222] text-[#EFF1EE] shadow-xs font-bold'
                      : 'bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10 text-[#666666] dark:text-[#D0D2CF] hover:border-[#222222]'
                  }`}
                >
                  {getLangLabel(lang)}
                </button>
              ))}
            </div>
          </div>

          <div id="browse-levels-container" className="space-y-4">
            <h2 id="browse-levels-heading" className="text-xl font-bold text-[#222222] dark:text-[#EFF1EE] tracking-tight">{t.languageLevels || 'Language Levels'}</h2>
            <div id="browse-levels-grid" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {LEVELS.map(level => {
                const count = filteredByLang.filter(e => level === 'A1/A2' ? (e.cefr === 'A1' || e.cefr === 'A2') : e.cefr === level).length;
                return (
                  <button
                    key={level}
                    id={`browse-level-btn-${level.replace('/', '-').toLowerCase()}`}
                    onClick={() => handleNavLevel(level)}
                    className="group flex flex-col items-start p-5 bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10 rounded-3xl hover:border-[#222222] dark:hover:border-white/30 transition-all text-start shadow-xs hover:shadow-md cursor-pointer"
                  >
                    <FolderOpen className="w-6 h-6 text-[#666666] group-hover:text-[#222222] dark:group-hover:text-white transition-colors mb-4" />
                    <h3 className="text-2xl font-bold text-[#222222] dark:text-[#EFF1EE] tracking-tight">{level}</h3>
                    <p className="text-xs text-[#666666] font-medium mt-1">{count} {t.cards || 'cards'}</p>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* VIEW: LEVEL VIEW (Topics/Decks) */}
      {viewStep === 'levelView' && (
        <div id="browse-level-view-section" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 id="browse-level-header-title" className="text-3xl font-bold text-[#222222] dark:text-[#EFF1EE] tracking-tight">{getLangLabel(activeLanguage)} {activeLevel}</h1>
              <p id="browse-level-card-count-sub" className="text-sm text-[#666666] mt-1">{cardsInActiveLevel.length} {t.totalCardsAvailable || 'total cards available'}</p>
            </div>
          </div>

          {topicsInActiveLevel.length === 0 ? (
            <div id="browse-no-decks-state" className="p-12 bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#D0D2CF] dark:border-white/10 text-center">
              <Inbox className="w-10 h-10 text-[#666666] mx-auto mb-3" />
              <p className="text-[#666666] font-medium">{t.noDecks || 'No topics available for this level yet.'}</p>
            </div>
          ) : (
            <div id="browse-topics-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topicsInActiveLevel.map(topic => {
                const visual = getTopicVisual(topic.name);
                const translatedTopicTitle = getTopicTitle(topic.name);
                return (
                  <div 
                    key={topic.name}
                    id={`browse-topic-card-${topic.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => handleNavDeck(topic.name)}
                    className="group bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10 rounded-3xl overflow-hidden hover:border-[#222222] dark:hover:border-white/30 transition-all cursor-pointer shadow-xs hover:shadow-xl flex flex-col"
                  >
                    {/* Visual Topic Header Image */}
                    <div className="relative h-44 w-full overflow-hidden bg-[#EFF1EE] dark:bg-stone-800">
                      <img 
                        src={visual.imageUrl} 
                        alt={topic.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
                      
                      {/* Floating Badges */}
                      <div className="absolute top-3.5 start-3.5 end-3.5 flex justify-between items-center z-10">
                        <span className="text-[10px] font-extrabold tracking-wider uppercase text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                          {activeLevel}
                        </span>
                        <span className="text-[10px] font-bold text-[#222222] bg-[#A4F5A6] backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                          <BookOpen className="w-3 h-3" />
                          {topic.cards.length} {t.cards || 'cards'}
                        </span>
                      </div>

                      {/* Topic Name on Image Banner */}
                      <div className="absolute bottom-3.5 start-4 end-4 z-10">
                        <h3 className="text-xl font-black text-white tracking-tight drop-shadow-md capitalize">
                          {translatedTopicTitle}
                        </h3>
                      </div>
                    </div>

                    {/* Bottom Metadata Bar */}
                    <div className="p-4 sm:p-5 flex items-center justify-end bg-white dark:bg-[#1E1E1E]">
                      <div className="p-2 rounded-xl bg-[#EFF1EE] dark:bg-white/10 text-[#222222] dark:text-white group-hover:bg-[#222222] group-hover:text-[#EFF1EE] transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
