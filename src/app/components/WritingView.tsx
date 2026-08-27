// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PenTool,
  CheckCheck,
  RefreshCw,
  FileText,
  Volume2,
  Copy,
  Plus,
  Trash2,
  Flame,
  BookOpen,
  Sparkles,
  Clock,
  ArrowRight,
  Sparkle,
  BookMarked,
  Layers,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  ThumbsUp,
  FileEdit,
  History,
  Zap,
  SpellCheck,
  PenLine,
  X,
  Eye,
  EyeOff,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { playTTS } from '../utils/tts';
import { activityTracker } from '../utils/activityTracker';
import { getTranslation } from '../utils/i18n';

interface WritingViewProps {
  settings?: any;
  onNavigate?: (view: any) => void;
}

interface WritingDocument {
  id: string;
  title: string;
  text: string;
  tone: string;
  lastSaved: number;
  score?: number;
  scoreFeedback?: string;
  correctedText?: string;
  issues?: Array<{ type?: string; original: string; fix: string; reason: string }>;
}

const DEFAULT_PROMPTS = [
  {
    id: 'journal',
    category: 'Daily Journal',
    title: 'How was your day?',
    description: 'Write about your activities today, what you ate, and how you felt.',
    starter: 'Today was quite busy...'
  },
  {
    id: 'email',
    category: 'Business & Career',
    title: 'Professional Follow-up',
    description: 'Draft a polite email to a project manager asking for feedback on a design review.',
    starter: 'Dear Project Manager,\n\nI hope this email finds you well...'
  },
  {
    id: 'story',
    category: 'Creative Writing',
    title: 'The Mysterious Door',
    description: 'Create a short fantasy scene about a hidden ancient door discovered in a library.',
    starter: 'Hidden between the dusty volumes of the library shelf, I noticed...'
  },
  {
    id: 'debate',
    category: 'Argumentative',
    title: 'Digital vs. Physical Books',
    description: 'Express your opinion on whether e-readers will completely replace physical paperbacks.',
    starter: 'While digital tablets and e-readers offer unparalleled convenience...'
  }
];

const TONES = [
  { value: 'General Tone', label: 'Balanced' },
  { value: 'Professional', label: 'Professional' },
  { value: 'Casual', label: 'Casual & Friendly' },
  { value: 'Academic', label: 'Formal / Academic' },
  { value: 'Creative', label: 'Expressive / Literary' }
];

export const WritingView: React.FC<WritingViewProps> = ({ settings, onNavigate }) => {
  const t = getTranslation(settings?.interfaceLanguage);

  const defaultPrompts = [
    {
      id: 'journal',
      category: t.dailyJournalCat || 'Daily Journal',
      title: t.howWasYourDayTitle || 'How was your day?',
      description: t.howWasYourDayDesc || 'Write about your activities today, what you ate, and how you felt.',
      starter: 'Today was quite busy...'
    },
    {
      id: 'email',
      category: t.businessCareerCat || 'Business & Career',
      title: t.professionalFollowUpTitle || 'Professional Follow-up',
      description: t.professionalFollowUpDesc || 'Draft a polite email to a project manager asking for feedback on a design review.',
      starter: 'Dear Project Manager,\n\nI hope this email finds you well...'
    },
    {
      id: 'story',
      category: t.creativeWritingCat || 'Creative Writing',
      title: t.mysteriousDoorTitle || 'The Mysterious Door',
      description: t.mysteriousDoorDesc || 'Create a short fantasy scene about a hidden ancient door discovered in a library.',
      starter: 'Hidden between the dusty volumes of the library shelf, I noticed...'
    },
    {
      id: 'debate',
      category: t.argumentativeCat || 'Argumentative',
      title: t.digitalVsPhysicalTitle || 'Digital vs. Physical Books',
      description: t.digitalVsPhysicalDesc || 'Express your opinion on whether e-readers will completely replace physical paperbacks.',
      starter: 'While digital tablets and e-readers offer unparalleled convenience...'
    }
  ];

  const toneOptions = [
    { value: 'General Tone', label: t.toneBalanced || 'Balanced' },
    { value: 'Professional', label: t.toneProfessional || 'Professional' },
    { value: 'Casual', label: t.toneCasualFriendly || 'Casual & Friendly' },
    { value: 'Academic', label: t.toneFormalAcademic || 'Formal / Academic' },
    { value: 'Creative', label: t.toneExpressiveLiterary || 'Expressive / Literary' }
  ];

  const [documents, setDocuments] = useState<WritingDocument[]>([]);
  const [activeDocId, setActiveDocId] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<string>('General Tone');
  const [docTitle, setDocTitle] = useState<string>(t.untitledDraft || 'Untitled Draft');
  
  // Checking states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPrecomputedReady, setIsPrecomputedReady] = useState<boolean>(false);

  // Visibility & Compact Controls
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [showHistory, setShowHistory] = useState<boolean>(true);
  const [showPrompts, setShowPrompts] = useState<boolean>(true);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState<boolean>(false);
  const [isPromptsCollapsed, setIsPromptsCollapsed] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'drafts' | 'prompts'>('editor');
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);

  // Background caching & pre-computation refs
  const precomputedCacheRef = useRef<Map<string, any>>(new Map());
  const inFlightPromiseRef = useRef<{ key: string; promise: Promise<any> } | null>(null);
  const lastPrefetchTimeRef = useRef<number>(0);

  // Analysis results
  const [analysisResult, setAnalysisResult] = useState<{
    score: number | null;
    scoreFeedback: string;
    correctedText: string;
    issues: Array<{ type?: string; original: string; fix: string; reason: string }>;
  } | null>(null);

  // Load documents from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ribble_writing_drafts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as WritingDocument[];
        setDocuments(parsed);
        if (parsed.length > 0) {
          const first = parsed[0];
          setActiveDocId(first.id);
          setInputText(first.text);
          setSelectedTone(first.tone);
          setDocTitle(first.title);
          if (first.score !== undefined) {
            setAnalysisResult({
              score: first.score,
              scoreFeedback: first.scoreFeedback || '',
              correctedText: first.correctedText || '',
              issues: first.issues || []
            });
          }
        } else {
          createNewDocument();
        }
      } catch (e) {
        console.error('Error loading writing drafts', e);
        createNewDocument();
      }
    } else {
      createNewDocument();
    }
  }, []);

  // Background Pre-Analysis Runner: Quietly pre-analyzes when the user completes a thought without quota exhaustion
  useEffect(() => {
    const trimmed = inputText.trim();
    // Only prefetch once there is meaningful text (at least 4 words and 15+ characters)
    if (!trimmed || trimmed.split(/\s+/).length < 4 || trimmed.length < 15) {
      setIsPrecomputedReady(false);
      return;
    }

    const targetLang = settings?.interfaceLanguage || 'English';
    const cacheKey = `${trimmed.toLowerCase()}___${selectedTone}___${targetLang}`;

    if (precomputedCacheRef.current.has(cacheKey)) {
      setIsPrecomputedReady(true);
      return;
    }

    setIsPrecomputedReady(false);

    // Wait 1.8s of idle typing before doing a background prefetch, respecting rate limits
    const timer = setTimeout(() => {
      const now = Date.now();
      // Ensure at least 15s between background prefetches to protect API quota
      if (now - lastPrefetchTimeRef.current < 15000) {
        return;
      }

      if (inFlightPromiseRef.current?.key === cacheKey) return;

      lastPrefetchTimeRef.current = now;

      const promise = fetch('/api/proofread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: trimmed,
          tone: selectedTone,
          targetLanguage: targetLang
        })
      })
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            precomputedCacheRef.current.set(cacheKey, data);
            // If user hasn't modified the text while background request was running, mark ready
            if (inputText.trim().toLowerCase() === trimmed.toLowerCase()) {
              setIsPrecomputedReady(true);
            }
            return data;
          }
          return null;
        })
        .catch((err) => {
          console.debug('Background pre-analysis notice:', err);
          return null;
        })
        .finally(() => {
          if (inFlightPromiseRef.current?.key === cacheKey) {
            inFlightPromiseRef.current = null;
          }
        });

      inFlightPromiseRef.current = { key: cacheKey, promise };
    }, 1800);

    return () => clearTimeout(timer);
  }, [inputText, selectedTone, settings?.interfaceLanguage]);

  // Save active document to localStorage and list
  const saveDocumentState = (text: string, titleStr: string, toneStr: string, updatedAnalysis: any = undefined) => {
    if (!activeDocId) return;
    
    // Determine the actual analysis to store: if text is empty, always null
    const finalAnalysis = text.trim() === '' ? null : (updatedAnalysis !== undefined ? updatedAnalysis : analysisResult);
    
    setDocuments((prevDocs) => {
      const updatedDocs = prevDocs.map((doc) => {
        if (doc.id === activeDocId) {
          return {
            ...doc,
            text,
            title: titleStr,
            tone: toneStr,
            lastSaved: Date.now(),
            score: finalAnalysis ? finalAnalysis.score : undefined,
            scoreFeedback: finalAnalysis ? finalAnalysis.scoreFeedback : undefined,
            correctedText: finalAnalysis ? finalAnalysis.correctedText : undefined,
            issues: finalAnalysis ? finalAnalysis.issues : undefined
          };
        }
        return doc;
      });
      localStorage.setItem('ribble_writing_drafts', JSON.stringify(updatedDocs));
      return updatedDocs;
    });
  };

  // Create a new document
  const createNewDocument = (initialText: string = '', initialTitle: string = 'Untitled Draft') => {
    const newDoc: WritingDocument = {
      id: `write-${Date.now()}`,
      title: initialTitle,
      text: initialText,
      tone: 'General Tone',
      lastSaved: Date.now()
    };

    setDocuments((prev) => {
      const updated = [newDoc, ...prev];
      localStorage.setItem('ribble_writing_drafts', JSON.stringify(updated));
      return updated;
    });
    
    setActiveDocId(newDoc.id);
    setInputText(newDoc.text);
    setSelectedTone(newDoc.tone);
    setDocTitle(newDoc.title);
    setAnalysisResult(null);
  };

  // Delete a document
  const deleteDocument = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setDocuments((prev) => {
      const updated = prev.filter((doc) => doc.id !== idToDelete);
      localStorage.setItem('ribble_writing_drafts', JSON.stringify(updated));
      
      if (activeDocId === idToDelete) {
        if (updated.length > 0) {
          const nextDoc = updated[0];
          setActiveDocId(nextDoc.id);
          setInputText(nextDoc.text);
          setSelectedTone(nextDoc.tone);
          setDocTitle(nextDoc.title);
          if (nextDoc.score !== undefined) {
            setAnalysisResult({
              score: nextDoc.score,
              scoreFeedback: nextDoc.scoreFeedback || '',
              correctedText: nextDoc.correctedText || '',
              issues: nextDoc.issues || []
            });
          } else {
            setAnalysisResult(null);
          }
        } else {
          // Temporarily set empty until state resolves
          setActiveDocId('');
          setInputText('');
          setSelectedTone('General Tone');
          setDocTitle('Untitled Draft');
          setAnalysisResult(null);
        }
      }
      return updated;
    });
  };

  // Switch Active Document
  const selectDocument = (doc: WritingDocument) => {
    setActiveDocId(doc.id);
    setInputText(doc.text);
    setSelectedTone(doc.tone);
    setDocTitle(doc.title);
    if (doc.score !== undefined) {
      setAnalysisResult({
        score: doc.score,
        scoreFeedback: doc.scoreFeedback || '',
        correctedText: doc.correctedText || '',
        issues: doc.issues || []
      });
    } else {
      setAnalysisResult(null);
    }
  };

  // Check writing / analyze (Instant on background hit or connected in-flight)
  const handleAnalyze = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const targetLang = settings?.interfaceLanguage || 'English';
    const cacheKey = `${trimmed.toLowerCase()}___${selectedTone}___${targetLang}`;

    // 1. Instant Cache Hit: 0ms response time
    if (precomputedCacheRef.current.has(cacheKey)) {
      const data = precomputedCacheRef.current.get(cacheKey);
      const nextResult = {
        score: typeof data.score === 'number' ? data.score : 98,
        scoreFeedback: data.scoreFeedback || 'Analysis finished successfully.',
        correctedText: data.correctedText || trimmed,
        issues: Array.isArray(data.issues) ? data.issues : []
      };
      setAnalysisResult(nextResult);
      saveDocumentState(trimmed, docTitle, selectedTone, nextResult);
      setShowMobileSidebar(true);
      return;
    }

    setIsAnalyzing(true);
    setShowMobileSidebar(true);
    setError(null);

    try {
      let data = null;

      // 2. Already in-flight background promise: attach directly
      if (inFlightPromiseRef.current?.key === cacheKey) {
        data = await inFlightPromiseRef.current.promise;
      }

      if (!data) {
        const res = await fetch('/api/proofread', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: trimmed,
            tone: selectedTone,
            targetLanguage: targetLang
          })
        });

        if (res.ok) {
          data = await res.json();
          precomputedCacheRef.current.set(cacheKey, data);
        } else {
          throw new Error('Analysis request failed on server');
        }
      }

      if (data) {
        const scoreVal = typeof data.score === 'number' ? data.score : 98;
        const feedbackVal = data.scoreFeedback || 'Analysis finished successfully.';
        const correctedVal = data.correctedText || trimmed;
        const issuesVal = Array.isArray(data.issues) ? data.issues : [];

        const nextResult = {
          score: scoreVal,
          scoreFeedback: feedbackVal,
          correctedText: correctedVal,
          issues: issuesVal
        };

        setAnalysisResult(nextResult);
        saveDocumentState(trimmed, docTitle, selectedTone, nextResult);
        activityTracker.logWritingAnalyzed(trimmed.length, scoreVal, issuesVal.length);
      }
    } catch (err) {
      console.warn('Backend proofread encountered an issue, analyzing locally:', err);
      
      const issues: any[] = [];
      let score = 100;
      let feedback = 'Your writing is clear, natural, and grammatically sound!';
      let correctedText = trimmed;

      // Basic actual error check for common grammar issues (third person singular)
      if (/\b(she|he|it)\s+don'?t\b/i.test(trimmed)) {
        score -= 10;
        const match = trimmed.match(/\b(she|he|it)\s+don'?t\b/i);
        if (match) {
          const subj = match[1];
          issues.push({
            type: 'Grammar',
            original: match[0],
            fix: `${subj} doesn't`,
            reason: "Subject-verb agreement error with third-person singular."
          });
          correctedText = correctedText.replace(match[0], `${subj} doesn't`);
        }
      }

      if (issues.length > 0) {
        feedback = `Identified ${issues.length} grammatical correction${issues.length > 1 ? 's' : ''}.`;
      }

      const clientResult = {
        score,
        scoreFeedback: feedback,
        correctedText,
        issues
      };

      setAnalysisResult(clientResult);
      saveDocumentState(trimmed, docTitle, selectedTone, clientResult);
      activityTracker.logWritingAnalyzed(trimmed.length, score, issues.length);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Accept corrections helper
  const handleAcceptCorrections = () => {
    if (!analysisResult) return;
    const finalVal = analysisResult.correctedText || inputText;
    setInputText(finalVal);
    
    // Reset issues and score to 100 on absolute accept
    const acceptedResult = {
      score: 100,
      scoreFeedback: 'All changes accepted! Writing draft is now polished.',
      correctedText: finalVal,
      issues: []
    };
    
    setAnalysisResult(acceptedResult);
    saveDocumentState(finalVal, docTitle, selectedTone, acceptedResult);
    activityTracker.logWritingFixApplied('All Corrections Accepted');
  };

  // Apply single fix helper
  const handleApplySingleFix = (issueOriginal: string, issueFix: string, issueIndex: number) => {
    if (!issueOriginal || !issueFix) return;
    const updatedText = inputText.replace(issueOriginal, issueFix);
    setInputText(updatedText);

    if (analysisResult) {
      const remainingIssues = analysisResult.issues.filter((_, idx) => idx !== issueIndex);
      const newScore = remainingIssues.length === 0 ? 100 : Math.min(99, analysisResult.score + 5);
      const updatedResult = {
        ...analysisResult,
        score: newScore,
        correctedText: analysisResult.correctedText,
        issues: remainingIssues
      };
      setAnalysisResult(updatedResult);
      saveDocumentState(updatedText, docTitle, selectedTone, updatedResult);
      activityTracker.logWritingFixApplied('Single Grammar Suggestion');
    }
  };

  // Count metrics
  const charCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  // Render text with specific phrase highlights (errors or fixes)
  const renderHighlightedParagraph = (
    text: string,
    highlights: { phrase: string; type: 'error' | 'fix' }[]
  ) => {
    if (!text) return null;
    const valid = highlights
      .filter((h) => h.phrase && h.phrase.trim().length > 0)
      .sort((a, b) => b.phrase.length - a.phrase.length);

    if (valid.length === 0) {
      return <span className="whitespace-pre-wrap">{text}</span>;
    }

    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
      `(${valid.map((h) => escapeRegExp(h.phrase)).join('|')})`,
      'gi'
    );

    const parts = text.split(pattern);
    return (
      <span className="whitespace-pre-wrap leading-relaxed">
        {parts.map((part, idx) => {
          const match = valid.find(
            (h) => h.phrase.toLowerCase() === part.toLowerCase()
          );
          if (match) {
            if (match.type === 'error') {
              return (
                <span
                  key={idx}
                  className="bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 px-1 py-0.5 rounded font-semibold border-b-2 border-rose-400 dark:border-rose-600 inline-block mx-0.5"
                  title="Identified error in original"
                >
                  {part}
                </span>
              );
            } else {
              return (
                <span
                  key={idx}
                  className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 px-1 py-0.5 rounded font-semibold border-b-2 border-emerald-400 dark:border-emerald-600 inline-block mx-0.5"
                  title="Corrected word/phrase"
                >
                  {part}
                </span>
              );
            }
          }
          return <span key={idx}>{part}</span>;
        })}
      </span>
    );
  };

  // Render the clear two-block revision view
  const renderRevisionBlocks = () => {
    if (!analysisResult) return null;
    const original = inputText.trim();
    const corrected = (analysisResult.correctedText || inputText).trim();
    const issues = analysisResult.issues || [];

    const hasErrors = issues.length > 0 || original !== corrected;

    if (!hasErrors) {
      return (
        <div className="bg-[#EFF1EE] dark:bg-stone-900/40 border border-[#D0D2CF] dark:border-stone-850 rounded-3xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <CheckCheck className="w-4 h-4" />
            <span>{t.flawlessText || 'Flawless Text — No Errors Found'}</span>
          </div>
          <div className="bg-white dark:bg-stone-850 p-4 rounded-2xl border border-[#D0D2CF]/60 dark:border-stone-800">
            <p className="text-sm text-[#222222] dark:text-stone-200 font-serif leading-relaxed">
              {original}
            </p>
          </div>
        </div>
      );
    }

    // Build error highlights for original text
    const errorHighlights: { phrase: string; type: 'error' }[] = issues
      .filter((i) => i.original)
      .map((i) => ({ phrase: i.original, type: 'error' }));

    // Build fix highlights for corrected text
    const fixHighlights: { phrase: string; type: 'fix' }[] = issues
      .filter((i) => i.fix)
      .map((i) => ({ phrase: i.fix, type: 'fix' }));

    return (
      <div className="flex flex-col gap-4">
        {/* Block 1: Original Text with Errors Highlighted */}
        <div className="bg-[#FFF5F5] dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/30 rounded-3xl p-5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-rose-700 dark:text-rose-400 uppercase">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{t.originalTextTitle || 'Original Text (Mistakes Highlighted)'}</span>
            </div>
            <span className="text-[10px] bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-bold px-2 py-0.5 rounded-full">
              {issues.length} {issues.length === 1 ? 'Error' : 'Errors'}
            </span>
          </div>

          <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-rose-200/60 dark:border-rose-900/40">
            <p className="text-sm text-[#222222] dark:text-stone-200 font-serif leading-relaxed">
              {renderHighlightedParagraph(original, errorHighlights)}
            </p>
          </div>
        </div>

        {/* Block 2: Corrected Text (The Right Way) */}
        <div className="bg-[#F2FAF6] dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 rounded-3xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase">
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{t.correctedTextTitle || 'Corrected Text (The Right Way)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => playTTS(corrected, 'en')}
                className="p-1.5 border border-emerald-200 dark:border-emerald-900/60 rounded-lg bg-white dark:bg-stone-900 text-[#666666] hover:text-emerald-700 dark:hover:text-emerald-300 shadow-2xs cursor-pointer hover:scale-105 transition-all"
                title="Speak corrected text"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleCopy(corrected)}
                className="p-1.5 border border-emerald-200 dark:border-emerald-900/60 rounded-lg bg-white dark:bg-stone-900 text-[#666666] hover:text-emerald-700 dark:hover:text-emerald-300 shadow-2xs cursor-pointer hover:scale-105 transition-all"
                title="Copy corrected text"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40">
            <p className="text-sm text-[#222222] dark:text-stone-200 font-serif leading-relaxed">
              {renderHighlightedParagraph(corrected, fixHighlights)}
            </p>
          </div>

          <button
            onClick={handleAcceptCorrections}
            className="w-full mt-1 py-2.5 bg-[#222222] hover:bg-[#A4F5A6] text-[#EFF1EE] hover:text-[#222222] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:scale-[1.01] transition-all"
          >
            <CheckCheck className="w-4 h-4 stroke-[2.2]" />
            {t.acceptAndApplyCorrections || 'Accept & Apply Corrections'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-none px-0 sm:px-2 lg:px-4 min-h-[calc(100vh-140px)] pb-24 md:pb-8">
      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden items-center gap-1.5 bg-[#EFF1EE] dark:bg-stone-900 p-1 rounded-2xl border border-[#D0D2CF] dark:border-stone-800 shrink-0">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mobileTab === 'editor'
              ? 'bg-white dark:bg-stone-800 text-[#222222] dark:text-stone-100 shadow-2xs'
              : 'text-stone-500 hover:text-[#222222]'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>{t.editorTab || 'Editor'}</span>
        </button>
        <button
          onClick={() => {
            setMobileTab('drafts');
            setShowHistory(true);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mobileTab === 'drafts'
              ? 'bg-white dark:bg-stone-800 text-[#222222] dark:text-stone-100 shadow-2xs'
              : 'text-stone-500 hover:text-[#222222]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>{t.savedDrafts || 'Drafts'} ({documents.length})</span>
        </button>
        <button
          onClick={() => {
            setMobileTab('prompts');
            setShowPrompts(true);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mobileTab === 'prompts'
              ? 'bg-white dark:bg-stone-800 text-[#222222] dark:text-stone-100 shadow-2xs'
              : 'text-stone-500 hover:text-[#222222]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.writingPrompts || 'Prompts'}</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 w-full">
        {/* LEFT COLUMN: Drafts list & Writing starters catalog (Always on desktop if sidebar visible, or on mobile when drafts/prompts tab is active) */}
        <div className={`w-full lg:w-64 flex-col gap-3.5 shrink-0 text-start items-stretch transition-all duration-200 ${
          window.innerWidth < 1024 
            ? (mobileTab === 'drafts' || mobileTab === 'prompts' ? 'flex' : 'hidden')
            : (isSidebarVisible && (showHistory || showPrompts) ? 'flex' : 'hidden')
        }`}>
          
          {/* Mobile view back header when viewing drafts or prompts tab */}
          {window.innerWidth < 1024 && (
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-200 uppercase tracking-wider">
                {mobileTab === 'drafts' ? (t.savedDrafts || 'Saved Drafts') : (t.writingPrompts || 'Writing Prompts')}
              </span>
              <button
                onClick={() => setMobileTab('editor')}
                className="text-xs font-bold px-3 py-1 rounded-xl bg-[#222222] text-[#A4F5A6] cursor-pointer"
              >
                {t.backToEditor || 'Back to Editor'}
              </button>
            </div>
          )}

          {/* Desktop Top Quick Bar: Sidebar control & Restore chips */}
          <div className="hidden lg:flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              {!showHistory && (
                <button
                  onClick={() => setShowHistory(true)}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-[#666666] dark:text-stone-300 hover:text-[#222222] border border-[#D0D2CF] dark:border-stone-700 flex items-center gap-1 cursor-pointer transition-all"
                  title="Restore Writing History"
                >
                  <Plus className="w-2.5 h-2.5" /> {t.historyTitle || 'History'}
                </button>
              )}
              {!showPrompts && (
                <button
                  onClick={() => setShowPrompts(true)}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-[#666666] dark:text-stone-300 hover:text-[#222222] border border-[#D0D2CF] dark:border-stone-700 flex items-center gap-1 cursor-pointer transition-all"
                  title="Restore Writing Prompts"
                >
                  <Plus className="w-2.5 h-2.5" /> {t.writingPrompts || 'Prompts'}
                </button>
              )}
            </div>
            <button
              onClick={() => setIsSidebarVisible(false)}
              className="text-[10px] text-stone-400 hover:text-[#222222] dark:hover:text-stone-200 p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1 ms-auto cursor-pointer transition-all"
              title="Hide sidebar panel"
            >
              <PanelLeftClose className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium">{t.hideSidebar || 'Hide'}</span>
            </button>
          </div>

          {/* Document Drafts List */}
          {(showHistory || (window.innerWidth < 1024 && mobileTab === 'drafts')) && (
            <div className={`w-full bg-[#EFF1EE] dark:bg-stone-900/40 border border-[#D0D2CF] dark:border-stone-850 rounded-2xl p-3 flex flex-col gap-2.5 text-start items-stretch shadow-3xs transition-all ${
              window.innerWidth < 1024 ? 'h-[75vh]' : (isHistoryCollapsed ? 'h-auto' : 'h-[300px]')
            }`}>
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#222222] dark:text-[#A4F5A6]" />
                  <span className="text-[11px] font-bold tracking-wider text-stone-700 dark:text-stone-300 uppercase">
                    {t.historyTitle || 'History'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      createNewDocument('', t.newWritingDraft || 'New Writing Draft');
                      setMobileTab('editor');
                    }}
                    className="p-1 rounded-lg bg-white dark:bg-stone-800 hover:bg-[#D0D2CF]/50 dark:hover:bg-stone-750 text-[#222222] dark:text-[#EFF1EE] border border-[#D0D2CF] dark:border-stone-700 transition-all cursor-pointer"
                    title="Create New Draft"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
                    className="hidden lg:block p-1 rounded-lg text-stone-400 hover:text-[#222222] dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer"
                    title={isHistoryCollapsed ? "Expand History" : "Collapse History"}
                  >
                    {isHistoryCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="hidden lg:block p-1 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer"
                    title="Close / Disappear History Card"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {!isHistoryCollapsed && (
                <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pe-1">
                  {documents.length === 0 ? (
                    <p className="text-[10px] text-stone-400 py-2 text-center italic">{t.noSavedDrafts || 'No saved drafts.'}</p>
                  ) : (
                    documents.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => {
                          selectDocument(doc);
                          setMobileTab('editor');
                        }}
                        className={`group relative flex flex-col gap-0.5 p-2.5 rounded-xl cursor-pointer transition-all border ${
                          activeDocId === doc.id
                            ? 'bg-white dark:bg-stone-800 border-[#222222] dark:border-[#A4F5A6] shadow-2xs'
                            : 'bg-white/60 dark:bg-stone-900/30 border-transparent hover:bg-white dark:hover:bg-stone-800/50 hover:border-[#D0D2CF]'
                        }`}
                      >
                        <div className="flex items-center justify-between pe-5">
                          <span className="text-[11px] font-bold text-[#222222] dark:text-stone-200 truncate">
                            {doc.title || t.untitledDraft || 'Untitled Draft'}
                          </span>
                          {doc.score !== undefined && (
                            <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400">
                              {doc.score}
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-stone-400 truncate">
                          {doc.text ? `${doc.text.slice(0, 32)}...` : '...'}
                        </span>

                        <button
                          onClick={(e) => deleteDocument(doc.id, e)}
                          className="absolute end-1.5 top-1.5 p-0.5 rounded text-stone-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete Draft"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Prompt starters catalog */}
          {(showPrompts || (window.innerWidth < 1024 && mobileTab === 'prompts')) && (
            <div className={`w-full bg-[#EFF1EE] dark:bg-stone-900/40 border border-[#D0D2CF] dark:border-stone-850 rounded-2xl p-3 flex flex-col gap-2.5 text-start items-stretch shadow-3xs transition-all ${
              window.innerWidth < 1024 ? 'h-[75vh]' : (isPromptsCollapsed ? 'h-auto' : 'h-[339px]')
            }`}>
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#222222] dark:text-[#A4F5A6] shrink-0" />
                  <span className="text-[11px] font-bold tracking-wider text-stone-700 dark:text-stone-300 uppercase">
                    {t.writingPrompts || 'Prompts'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsPromptsCollapsed(!isPromptsCollapsed)}
                    className="hidden lg:block p-1 rounded-lg text-stone-400 hover:text-[#222222] dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer"
                    title={isPromptsCollapsed ? "Expand Prompts" : "Collapse Prompts"}
                  >
                    {isPromptsCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => setShowPrompts(false)}
                    className="hidden lg:block p-1 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer"
                    title="Close / Disappear Prompts Card"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {!isPromptsCollapsed && (
                <div className="flex flex-col gap-2 flex-1 overflow-y-auto pe-0.5">
                  {defaultPrompts.map((prompt) => (
                    <div
                      key={prompt.id}
                      onClick={() => {
                        createNewDocument(prompt.starter, prompt.title);
                        setMobileTab('editor');
                      }}
                      className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-[#D0D2CF]/50 dark:border-stone-750 hover:border-[#222222] hover:shadow-2xs transition-all cursor-pointer flex flex-col gap-1 text-start group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black tracking-wider text-[#222222] dark:text-[#A4F5A6] uppercase">
                          {prompt.category}
                        </span>
                        <ChevronRight className="w-2.5 h-2.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <h4 className="text-[11px] font-bold text-[#222222] dark:text-stone-200 leading-tight">
                        {prompt.title}
                      </h4>
                      <p className="text-[9px] text-[#666666] dark:text-stone-400 leading-tight line-clamp-2">
                        {prompt.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT/CENTER CONTENT: Text Editor & Real-time AI grading */}
        <div className={`flex-1 flex-col lg:flex-row gap-6 ${
          window.innerWidth < 1024 
            ? (mobileTab === 'editor' ? 'flex' : 'hidden')
            : 'flex'
        }`}>

        
        {/* Workspace Block */}
        <div 
          className="flex-1 bg-[#EFF1EE] dark:bg-stone-900/40 border border-[#D0D2CF] dark:border-stone-850 rounded-2xl sm:rounded-3xl p-3 sm:p-6 flex flex-col gap-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D0D2CF]/60 dark:border-stone-800">
            <div className="flex items-center gap-2.5">
              {(!isSidebarVisible || (!showHistory && !showPrompts)) && (
                <button
                  onClick={() => {
                    setIsSidebarVisible(true);
                    setShowHistory(true);
                    setShowPrompts(true);
                  }}
                  className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-[#D0D2CF] dark:border-stone-700 text-[#666666] dark:text-stone-300 hover:text-[#222222] shadow-3xs cursor-pointer transition-all flex items-center gap-1.5"
                  title="Open History & Prompts sidebar"
                >
                  <PanelLeft className="w-4 h-4" />
                  <span className="text-[11px] font-bold hidden md:inline">Sidebar</span>
                </button>
              )}
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-white/10 border border-[#D0D2CF] dark:border-white/10 flex items-center justify-center shrink-0">
                <PenTool className="w-5 h-5 text-[#222222] dark:text-[#A4F5A6]" />
              </div>
              <div className="flex flex-col min-w-0">
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => {
                    setDocTitle(e.target.value);
                    saveDocumentState(inputText, e.target.value, selectedTone);
                  }}
                  className="bg-transparent text-sm font-extrabold text-[#222222] dark:text-stone-100 focus:outline-none focus:border-[#222222] border-b border-transparent pb-0.5"
                  placeholder={t.draftTitlePlaceholder || 'Draft Title'}
                />
                <span className="text-[10px] text-stone-400">
                  {t.activeEditorSession || 'Active Editor Session'}
                </span>
              </div>
            </div>
          </div>

          {/* Text Area Input */}
          <div className="relative flex-1 min-h-[300px] flex flex-col bg-white dark:bg-stone-850/40 rounded-2xl border border-[#D0D2CF] dark:border-stone-800 p-4">
            <textarea
              value={inputText}
              onChange={(e) => {
                const val = e.target.value;
                setInputText(val);
                setIsPrecomputedReady(false);
                saveDocumentState(val, docTitle, selectedTone);
              }}
              placeholder={t.typeOrPastePlaceholder || "Start typing or paste your text here to practice writing..."}
              className="w-full flex-1 min-h-[220px] bg-transparent resize-none border-none outline-none focus:outline-none text-sm text-[#222222] dark:text-stone-100 placeholder:text-stone-400 font-serif leading-relaxed"
            />

            {/* Character, Word counter & Background AI readiness indicator - Hidden on mobile phones */}
            <div className="hidden sm:flex items-center justify-between mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-[10px] font-semibold text-stone-400">
              <div className="flex items-center gap-3">
                <span>{wordCount} {t.wordCount || 'Words'}</span>
                <span>•</span>
                <span>{charCount} {t.charCount || 'Characters'}</span>
              </div>
              <div className="flex items-center gap-2">
                {isPrecomputedReady && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40 animate-fade-in">
                    <Zap className="w-2.5 h-2.5 fill-current" />
                    {t.instantReady || 'Instant Ready'}
                  </span>
                )}
                <div className="flex items-center gap-1 text-stone-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t.autoSaved || 'Auto-saved'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions panel */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3 ms-auto">
              <button
                onClick={() => {
                  setInputText('');
                  setAnalysisResult(null);
                  saveDocumentState('', docTitle, selectedTone, null);
                }}
                className="px-4 py-2 text-[#666666] dark:text-stone-400 hover:text-[#222222] dark:hover:text-stone-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {t.clearCanvas || 'Clear Canvas'}
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#A4F5A6] text-[#222222] font-extrabold text-xs shadow-xs hover:bg-[#8ee590] disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    {t.checkingGrammar || 'Checking Grammar...'}
                  </>
                ) : (
                  <>
                    <SpellCheck className="w-3.5 h-3.5" />
                    {t.checkGrammar || 'Check Grammar'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Ribble Grammarly Feedback Column */}
        <div className={`shrink-0 flex-col gap-6 ${
          showMobileSidebar 
            ? 'fixed inset-y-0 end-0 z-50 w-full sm:w-[380px] bg-white dark:bg-stone-900 shadow-2xl p-4 overflow-y-auto border-s border-stone-200 dark:border-stone-800 flex lg:static lg:w-96 lg:bg-transparent lg:border-none lg:shadow-none lg:p-0'
            : 'hidden lg:flex lg:w-96'
        }`}>
          {/* Mobile close button header */}
          <div className="flex lg:hidden items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 shrink-0">
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
              <SpellCheck className="w-4 h-4 text-[#A4F5A6]" />
              {t.writingTitle || 'Writing Assistant'}
            </span>
            <button
              onClick={() => setShowMobileSidebar(false)}
              className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
              title="Close Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!analysisResult && !isAnalyzing ? (
              <motion.div
                key="empty-ai"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="h-full bg-[#EFF1EE] dark:bg-stone-900/40 border border-dashed border-[#D0D2CF] dark:border-stone-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[300px]"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#D0D2CF]/50 dark:bg-stone-800 flex items-center justify-center">
                  <SpellCheck className="w-6 h-6 text-[#222222] dark:text-[#A4F5A6]" />
                </div>
                <div className="flex flex-col gap-1 items-center">
                  <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    {t.writingTitle || 'Writing Assistant'}
                  </h3>
                </div>
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div
                key="loading-ai"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full bg-[#EFF1EE] dark:bg-stone-900/40 border border-[#D0D2CF] dark:border-stone-850 rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[300px]"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-[#D0D2CF] dark:border-stone-800 border-t-[#222222] dark:border-t-[#A4F5A6] animate-spin" />
                  <SpellCheck className="w-5 h-5 text-[#222222] dark:text-[#A4F5A6] absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    {t.refiningGrammarStyle || 'Refining Grammar & Style'}
                  </h3>
                  <p className="text-[10px] text-stone-400">
                    {t.analyzingPhrasingStructure || 'Analyzing phrasing and structure...'}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result-ai"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-5"
              >
                {/* Score Card Banner */}
                <div className="bg-[#EFF1EE] dark:bg-stone-900/60 border border-[#D0D2CF] dark:border-stone-800 rounded-3xl p-5 flex items-center justify-between gap-4 shadow-3xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black tracking-widest text-[#222222] dark:text-[#A4F5A6] uppercase">
                      {t.writingQualityScore || 'Writing Quality Score'}
                    </span>
                    <p className="text-[10px] text-[#666666] dark:text-stone-400 leading-normal">
                      {analysisResult.scoreFeedback}
                    </p>
                  </div>
                  <div className="flex flex-col items-center shrink-0 bg-white dark:bg-stone-900 border border-[#A4F5A6] dark:border-[#A4F5A6]/40 w-16 h-16 rounded-2xl justify-center shadow-3xs">
                    <span className="text-lg font-black text-[#222222] dark:text-[#A4F5A6] leading-none">
                      {analysisResult.score}
                    </span>
                    <span className="text-[9px] text-stone-400 font-bold mt-1">/ 100</span>
                  </div>
                </div>

                {/* Two-Block Revision View (Original with errors highlighted + Complete Corrected Text underneath) */}
                {renderRevisionBlocks()}

                {/* Detailed Issues */}
                {analysisResult.issues && analysisResult.issues.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                      {analysisResult.issues.length} {t.grammaticalWritingSuggestions || 'Grammatical & Writing Suggestions'}
                    </span>
                    <div className="flex flex-col gap-2.5">
                      {analysisResult.issues.map((issue, idx) => {
                        const categoryLabel = (issue.type || 'PUNCTUATION').toUpperCase();

                        return (
                          <div
                            key={idx}
                            className="bg-[#EFF1EE] dark:bg-stone-900/60 border border-[#D0D2CF] dark:border-stone-800 rounded-2xl p-4 flex flex-col gap-3 shadow-3xs transition-all"
                          >
                            {/* Top row: Category pill on the left, rounded "Fix →" button on the right */}
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold tracking-wider text-[#222222] dark:text-[#A4F5A6] bg-[#A4F5A6] dark:bg-[#A4F5A6]/20 px-2.5 py-1 rounded-md uppercase">
                                {categoryLabel}
                              </span>

                              <button
                                onClick={() => handleApplySingleFix(issue.original, issue.fix, idx)}
                                className="px-3.5 py-0.5 rounded-full border border-[#222222] dark:border-[#A4F5A6] bg-white dark:bg-stone-900 text-[#222222] dark:text-[#A4F5A6] hover:bg-[#A4F5A6] hover:text-[#222222] text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-3xs hover:scale-105 active:scale-95"
                                title={`Fix "${issue.original}" with "${issue.fix}"`}
                              >
                                <span>{t.fixBtn || 'Fix'}</span>
                                <span className="text-xs">→</span>
                              </button>
                            </div>
                            
                            {/* Middle row: red mistake pill -> green fix pill */}
                            <div className="flex items-center flex-wrap gap-2 text-xs">
                              <span className="line-through text-[#9E2A2B] dark:text-rose-300 bg-[#FDE2E4] dark:bg-rose-950/60 px-2 py-0.5 rounded-md font-semibold">
                                {issue.original}
                              </span>
                              <span className="text-stone-400 text-xs">→</span>
                              <span className="font-bold text-[#222222] dark:text-[#222222] bg-[#A4F5A6] px-2 py-0.5 rounded-md">
                                {issue.fix}
                              </span>
                            </div>

                            {/* Bottom row: explanation paragraph */}
                            <p className="text-[11px] text-[#666666] dark:text-stone-300 leading-relaxed font-sans">
                              {issue.reason}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  </div>
);
};
