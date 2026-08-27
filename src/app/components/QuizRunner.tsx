// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw, Layers, Check, HelpCircle } from 'lucide-react';
import { Quiz, QuizQuestion, AppView, QuizHistory } from '../types';
import { getTranslation } from '../utils/i18n';

interface QuizRunnerProps {
  settings?: any;
  quiz: Quiz;
  onNavigate: (view: AppView) => void;
  onSaveResult?: (result: Omit<QuizHistory, 'id'>) => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ settings, quiz, onNavigate, onSaveResult }) => {
  const t = getTranslation(settings?.interfaceLanguage);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { selected: string, isCorrect: boolean }>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  // Auto-save results when finished
  useEffect(() => {
    if (isFinished && !hasSaved && onSaveResult) {
      const scoreValue = Object.values(answers).filter((a: any) => a.isCorrect).length;
      const percentageValue = Math.round((scoreValue / quiz.questionCount) * 100);
      
      onSaveResult({
        quizId: quiz.id,
        quizTitle: quiz.title,
        score: scoreValue,
        totalQuestions: quiz.questionCount,
        percentage: percentageValue,
        completedAt: new Date().toISOString()
      });
      setHasSaved(true);
    }
  }, [isFinished, hasSaved, onSaveResult, answers, quiz]);

  // States for interactive question types
  const [typedInput, setTypedInput] = useState('');
  
  // Match Pairs State
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Array<{ left: string, right: string }>>([]);
  const [pairingError, setPairingError] = useState(false);

  // Sentence Ordering State
  const [orderedTokens, setOrderedTokens] = useState<string[]>([]);
  const [scrambledTokens, setScrambledTokens] = useState<string[]>([]);

  const currentQ = quiz.questions[currentIndex];

  // Initialize interactive question types whenever currentIndex changes
  useEffect(() => {
    if (!currentQ) return;
    
    // Reset states
    setTypedInput('');
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs([]);
    setPairingError(false);

    if (currentQ.type === 'sentence_ordering') {
      setOrderedTokens([]);
      // Options has the scrambled tokens
      setScrambledTokens(currentQ.options || []);
    }
  }, [currentIndex, currentQ]);

  const handleAnswer = (option: string) => {
    const isCorrect = option.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
    setAnswers(prev => ({ ...prev, [currentQ.id]: { selected: option, isCorrect } }));
  };

  // Check manual Fill in the Blank answer
  const handleCheckBlank = () => {
    if (!typedInput.trim()) return;
    handleAnswer(typedInput.trim());
  };

  // Handle Match Pairs selection
  const handleSelectPair = (value: string, side: 'left' | 'right') => {
    if (answers[currentQ.id]) return; // Already answered

    if (side === 'left') {
      setSelectedLeft(value);
    } else {
      setSelectedRight(value);
    }
  };

  // Evaluate matching pair selection
  useEffect(() => {
    if (selectedLeft && selectedRight && currentQ && currentQ.type === 'match_pairs') {
      // Correct answer contains pairs in format: "word1:trans1|word2:trans2|word3:trans3"
      const pairs = currentQ.correctAnswer.split('|').map(pair => {
        const [left, right] = pair.split(':');
        return { left, right };
      });

      const isValidPair = pairs.some(p => p.left === selectedLeft && p.right === selectedRight);

      if (isValidPair) {
        const newMatch = { left: selectedLeft, right: selectedRight };
        setMatchedPairs(prev => {
          const updated = [...prev, newMatch];
          // If all pairs matched (usually 3)
          if (updated.length >= pairs.length) {
            setAnswers(prevAns => ({
              ...prevAns,
              [currentQ.id]: { selected: 'All pairs matched perfectly', isCorrect: true }
            }));
          }
          return updated;
        });
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        // Trigger shake/error
        setPairingError(true);
        const timer = setTimeout(() => {
          setPairingError(false);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedLeft, selectedRight, currentQ]);

  // Handle sentence ordering click
  const handleTokenClick = (token: string, source: 'scrambled' | 'ordered') => {
    if (answers[currentQ.id]) return;

    if (source === 'scrambled') {
      setOrderedTokens(prev => [...prev, token]);
      // Remove first occurrence of token
      setScrambledTokens(prev => {
        const idx = prev.indexOf(token);
        if (idx > -1) {
          const next = [...prev];
          next.splice(idx, 1);
          return next;
        }
        return prev;
      });
    } else {
      setScrambledTokens(prev => [...prev, token]);
      setOrderedTokens(prev => {
        const idx = prev.indexOf(token);
        if (idx > -1) {
          const next = [...prev];
          next.splice(idx, 1);
          return next;
        }
        return prev;
      });
    }
  };

  // Verify Sentence Order answer
  const handleCheckOrder = () => {
    const userSentence = orderedTokens.join(' ');
    // Lenient clean comparison (ignore punctuation, lowercased, single spaced)
    const cleanStr = (s: string) => s.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").replace(/\s+/g, ' ').trim();
    
    const isCorrect = cleanStr(userSentence) === cleanStr(currentQ.correctAnswer);
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: { selected: userSentence || 'Incomplete Sentence', isCorrect }
    }));
  };

  const score = Object.values(answers).filter((a: any) => a.isCorrect).length;
  const getGrade = (percentage: number) => {
    if (percentage >= 95) return { grade: 'A+', color: 'text-emerald-600' };
    if (percentage >= 90) return { grade: 'A', color: 'text-emerald-500' };
    if (percentage >= 80) return { grade: 'B', color: 'text-blue-500' };
    if (percentage >= 70) return { grade: 'C', color: 'text-yellow-500' };
    return { grade: t.needPracticeGrade || 'Need Practice', color: 'text-red-500' };
  };

  if (isFinished || !currentQ) {
    const percentage = Math.round((score / quiz.questionCount) * 100);
    const { grade, color } = getGrade(percentage);
    return (
      <div className="max-w-xl mx-auto p-12 text-center space-y-6 bg-white rounded-3xl border border-[#D0D2CF] shadow-sm">
        <h2 className="text-4xl font-black text-[#222222]">{t.quizCompleted || 'Quiz Complete'}</h2>
        <div className={`text-6xl font-black ${color}`}>{grade}</div>
        <p className="text-xl font-bold text-[#555555]">{t.yourScore || 'Your Score'}: {score} / {quiz.questionCount} ({percentage}%)</p>
        <div className="p-6 bg-[#EFF1EE] rounded-2xl text-start border border-[#D0D2CF] max-h-60 overflow-y-auto space-y-3">
          <h4 className="font-black text-[#222222] uppercase tracking-wider text-xs">{t.quickStats || 'Review Results'}:</h4>
          {quiz.questions.map((q, idx) => (
            <div key={q.id} className="flex gap-3 text-sm items-start border-b border-stone-200 pb-2 last:border-0 last:pb-0">
              {answers[q.id]?.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-[#222222]">{idx + 1}. {q.prompt}</p>
                <p className="text-stone-500">Correct: <span className="font-semibold text-stone-700">{q.correctAnswer}</span></p>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={() => onNavigate('practice')} 
          className="w-full py-4 bg-[#222222] text-[#EFF1EE] rounded-2xl font-black text-lg hover:bg-stone-800 transition-all"
        >
          {t.backToQuizzes || 'Return to Practice Hub'}
        </button>
      </div>
    );
  }

  // Progress blocks: ■■■□□□
  const progressBlocks = Array.from({ length: quiz.questionCount }).map((_, i) => {
    if (i < currentIndex) return 'bg-[#A4F5A6]'; // Completed
    if (i === currentIndex) return 'bg-[#B2A1FF]'; // Current
    return 'bg-[#D0D2CF]'; // Upcoming
  });

  // Render question interface based on type
  const renderQuestionUI = () => {
    const isAnswered = !!answers[currentQ.id];
    const userAns = answers[currentQ.id];

    // standard types: multiple_choice, choose_the_word, translation, context_choice, synonym, antonym
    const isStandardSelection = [
      'multiple_choice', 
      'choose_the_word', 
      'translation', 
      'context_choice', 
      'synonym', 
      'antonym'
    ].includes(currentQ.type);

    if (isStandardSelection) {
      return (
        <div className="grid gap-4">
          {currentQ.options?.map((opt, i) => {
            const isSelected = userAns?.selected === opt;
            const isCorrect = opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
            
            let btnStyle = 'bg-[#EFF1EE] border-[#D0D2CF] hover:border-[#222222] text-[#222222]';
            if (isAnswered) {
              if (isCorrect) btnStyle = 'bg-[#A4F5A6] border-[#A4F5A6] text-emerald-900';
              else if (isSelected) btnStyle = 'bg-red-100 border-red-300 text-red-900';
            } else if (isSelected) {
              btnStyle = 'bg-[#B2A1FF] border-[#B2A1FF] text-white';
            }

            return (
              <button 
                key={i}
                id={`q-opt-${i}`}
                disabled={isAnswered}
                onClick={() => handleAnswer(opt)}
                className={`p-5 rounded-2xl border ${btnStyle} text-start font-bold text-base md:text-lg transition-all shadow-sm active:scale-[0.98]`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      );
    }

    if (currentQ.type === 'fill_in_the_blank') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <input 
              type="text"
              id="blank-text-input"
              disabled={isAnswered}
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder={t.typeAnswerPlaceholder || "Type your answer here..."}
              className="w-full p-4 rounded-2xl border-2 border-[#D0D2CF] focus:border-[#B2A1FF] outline-none font-bold text-lg text-center"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCheckBlank();
              }}
            />
            {!isAnswered && (
              <button 
                onClick={handleCheckBlank}
                disabled={!typedInput.trim()}
                className="w-full py-4 bg-[#B2A1FF] text-white font-black text-base rounded-2xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {t.submitAnswer || "Submit Answer"}
              </button>
            )}
          </div>

          {/* Quick choices if they prefer to click */}
          {!isAnswered && currentQ.options && currentQ.options.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-black text-stone-500 uppercase tracking-wider text-center">{t.chooseFromOptions || "Or choose from these options:"}</p>
              <div className="grid grid-cols-2 gap-3">
                {currentQ.options.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => setTypedInput(opt)}
                    className="p-3 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold text-sm border border-stone-200 transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (currentQ.type === 'match_pairs') {
      // Split correctAnswer ("word1:trans1|word2:trans2") to find distinct lists
      const pairs = currentQ.correctAnswer.split('|').map(p => {
        const [l, r] = p.split(':');
        return { left: l, right: r };
      });

      const leftPool = Array.from(new Set(pairs.map(p => p.left))) as string[];
      const rightPool = Array.from(new Set(pairs.map(p => p.right))) as string[];

      return (
        <div className={`space-y-6 ${pairingError ? 'animate-shake' : ''}`}>
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column (Words) */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-stone-500 tracking-wider text-center">{t.wordsHeader || "Words"}</h4>
              {leftPool.map((word, i) => {
                const isMatched = matchedPairs.some(p => p.left === word);
                const isSelected = selectedLeft === word;

                let style = 'bg-[#EFF1EE] border-[#D0D2CF] text-[#222222]';
                if (isMatched) {
                  style = 'bg-[#A4F5A6] border-[#A4F5A6] text-emerald-900 opacity-60 pointer-events-none';
                } else if (isSelected) {
                  style = 'bg-[#B2A1FF] border-[#B2A1FF] text-white ring-2 ring-[#B2A1FF]/40';
                }

                return (
                  <button
                    key={i}
                    id={`pair-left-${i}`}
                    disabled={isAnswered || isMatched}
                    onClick={() => handleSelectPair(word, 'left')}
                    className={`w-full p-4 rounded-xl border text-center font-bold text-sm md:text-base transition-all ${style}`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>

            {/* Right Column (Meanings) */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-stone-500 tracking-wider text-center">{t.meaningsHeader || "Meanings"}</h4>
              {rightPool.map((meaning, i) => {
                const isMatched = matchedPairs.some(p => p.right === meaning);
                const isSelected = selectedRight === meaning;

                let style = 'bg-[#EFF1EE] border-[#D0D2CF] text-[#222222]';
                if (isMatched) {
                  style = 'bg-[#A4F5A6] border-[#A4F5A6] text-emerald-900 opacity-60 pointer-events-none';
                } else if (isSelected) {
                  style = 'bg-[#B2A1FF] border-[#B2A1FF] text-white ring-2 ring-[#B2A1FF]/40';
                }

                return (
                  <button
                    key={i}
                    id={`pair-right-${i}`}
                    disabled={isAnswered || isMatched}
                    onClick={() => handleSelectPair(meaning, 'right')}
                    className={`w-full p-4 rounded-xl border text-center font-semibold text-xs md:text-sm transition-all ${style}`}
                  >
                    {meaning}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <span className="inline-block px-3 py-1.5 bg-stone-100 border border-stone-200 text-xs text-stone-600 rounded-full font-bold">
              {t.pairingsLabel || "Pairings:"} {matchedPairs.length} / {pairs.length} {t.completedLabel || "completed"}
            </span>
          </div>
        </div>
      );
    }

    if (currentQ.type === 'sentence_ordering') {
      return (
        <div className="space-y-6">
          {/* Construction area */}
          <div className="min-h-24 p-5 bg-stone-50 rounded-2xl border-2 border-dashed border-[#D0D2CF] flex flex-wrap gap-2 items-center justify-center">
            {orderedTokens.length === 0 && (
              <span className="text-sm font-bold text-stone-400">{t.clickWordCardsToOrder || "Click word cards below to order sentence..."}</span>
            )}
            {orderedTokens.map((tok, i) => (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => handleTokenClick(tok, 'ordered')}
                className="px-3.5 py-2 bg-[#B2A1FF] text-white font-black rounded-xl text-sm md:text-base border border-[#B2A1FF] hover:bg-opacity-90 shadow-sm transition-all active:scale-95"
              >
                {tok}
              </button>
            ))}
          </div>

          {/* Scrambled Area */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 flex flex-wrap gap-2 justify-center">
            {scrambledTokens.map((tok, i) => (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => handleTokenClick(tok, 'scrambled')}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-[#222222] font-semibold text-sm md:text-base transition-all active:scale-95 shadow-sm"
              >
                {tok}
              </button>
            ))}
          </div>

          {!isAnswered && (
            <button 
              onClick={handleCheckOrder}
              disabled={orderedTokens.length === 0}
              className="w-full py-4 bg-[#B2A1FF] text-white font-black text-base rounded-2xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {t.verifySentenceOrder || "Verify Sentence Order"}
            </button>
          )}
        </div>
      );
    }

    if (currentQ.type === 'find_the_mistake') {
      return (
        <div className="space-y-6">
          <p className="text-sm text-stone-500 font-bold text-center">{t.clickIncorrectWord || "Click on the single word that is incorrect or misspelled:"}</p>
          <div className="flex flex-wrap gap-3 justify-center py-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
            {currentQ.options?.map((tok, i) => {
              const isCorrectTarget = tok.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "") === currentQ.correctAnswer.toLowerCase();
              const isSelected = userAns?.selected === tok;
              
              let style = 'bg-white hover:bg-stone-50 border-stone-300 text-[#222222]';
              if (isAnswered) {
                if (isCorrectTarget) style = 'bg-[#A4F5A6] border-[#A4F5A6] text-emerald-900';
                else if (isSelected) style = 'bg-red-100 border-red-300 text-red-900';
              }

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(tok.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ""))}
                  className={`px-4 py-2.5 rounded-xl border font-bold text-base transition-all shadow-sm ${style}`}
                >
                  {tok}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 space-y-8 mt-4">
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={() => onNavigate('practice')} 
          className="p-2.5 bg-white rounded-xl border border-[#D0D2CF] hover:bg-stone-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-stone-700"/>
        </button>
        <span className="text-xs font-black uppercase tracking-widest text-[#666666]">
          {t.question || "Question"} {currentIndex + 1} / {quiz.questionCount}
        </span>
      </div>
      
      {/* Block Progress */}
      <div className="flex gap-1.5 justify-center">
        {progressBlocks.map((color, i) => (
          <div key={i} className={`h-2.5 w-full max-w-[32px] rounded-full ${color} transition-colors duration-300`} />
        ))}
      </div>

      <div className="bg-white p-6 md:p-10 rounded-3xl border border-[#D0D2CF] shadow-sm space-y-8">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="px-3 py-1 bg-[#B2A1FF]/10 text-[#B2A1FF] rounded-full text-xs font-black uppercase tracking-wider">
              {currentQ.type.replace(/_/g, ' ')}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-[#222222] leading-snug whitespace-pre-line">
            {currentQ.prompt}
          </h3>
        </div>

        {/* Dynamic Question Render */}
        {renderQuestionUI()}
        
        {/* Explanation Block */}
        {answers[currentQ.id] && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl border ${
              answers[currentQ.id].isCorrect 
                ? 'bg-[#A4F5A6]/10 border-[#A4F5A6] text-emerald-900' 
                : 'bg-red-50 border-red-200 text-red-900'
            } space-y-2`}
          >
            <div className="flex items-center gap-2 font-black text-lg">
              {answers[currentQ.id].isCorrect ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span>{t.correctAnswerTitle || "Correct Answer!"}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-600" />
                  <span>{t.notQuiteTitle || "Not quite!"}</span>
                </>
              )}
            </div>
            
            <p className="text-sm font-bold text-stone-700">
              {t.correctSolutionLabel || "Correct Solution:"} <span className="font-black text-[#222222] underline">{currentQ.correctAnswer}</span>
            </p>

            {currentQ.explanation && (
              <div className="pt-2 border-t border-stone-200/40 text-xs text-stone-600 leading-relaxed font-semibold">
                {currentQ.explanation}
              </div>
            )}
          </motion.div>
        )}

        {answers[currentQ.id] && (
          <button 
            onClick={() => currentIndex + 1 < quiz.questionCount ? setCurrentIndex(prev => prev + 1) : setIsFinished(true)}
            className="w-full py-5 bg-[#222222] text-[#EFF1EE] rounded-2xl font-black text-lg hover:bg-stone-800 transition-all shadow-sm active:scale-[0.99]"
          >
            {currentIndex + 1 < quiz.questionCount ? (t.nextQuestionBtn || 'Next Question →') : (t.finishQuizBtn || 'Finish Quiz 🏁')}
          </button>
        )}
      </div>
    </div>
  );
};
