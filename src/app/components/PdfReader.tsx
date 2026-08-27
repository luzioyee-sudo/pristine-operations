// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DocumentFile, ReaderSettings, WordDefinition, Highlight, FreehandAnnotation, StickyNoteAnnotation } from '../types';
import { AnnotationToolbar } from './AnnotationToolbar';
import { NotesWorkspace } from './NotesWorkspace';
import { PdfPageCanvas } from './PdfPageCanvas';
import { StickyNoteCard } from './StickyNoteCard';
import { storage } from '../utils/storage';
import { getPdfBinary } from '../utils/pdfStorage';
import { getTranslation } from '../utils/i18n';
import { activityTracker } from '../utils/activityTracker';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
import {
  Upload,
  BookOpen,
  FileText,
  Sparkles,
  Highlighter,
  Pen,
  Trash2,
  Volume2,
  RotateCcw,
  Plus,
  StickyNote,
  X,
  GripHorizontal,
  Minimize2,
  Maximize2,
  Columns,
  Rows,
  PenTool,
  ChevronLeft,
  ChevronRight,
  ListTree,
  LayoutGrid,
  BookmarkCheck,
  Bookmark,
  Search,
  Check,
  ZoomIn,
  ZoomOut,
  MoreVertical
} from 'lucide-react';

const PUNCTUATION_CLEAN_REGEX = /^[\s.,!?;:()""''「」『』。、¿¡«»“”‘’—–\-]+|[\s.,!?;:()""''「」『』。、¿¡«»“”‘’—–\-]+$/g;

interface PdfReaderProps {
  document: DocumentFile | null;
  settings: ReaderSettings;
  onUpdateSettings: (settings: Partial<ReaderSettings>) => void;
  onWordClick: (word: string, contextSentence: string, rect?: { x: number, y: number, width: number, height: number }) => void;
  activeWord?: string;
  highlights: Highlight[];
  onAddHighlight: (highlight: Omit<Highlight, 'id' | 'createdAt'>) => void;
  onRemoveHighlight: (id: string) => void;
  annotations: FreehandAnnotation[];
  onSaveAnnotation: (annotation: Omit<FreehandAnnotation, 'id' | 'createdAt'>) => void;
  onRemoveAnnotation?: (id: string) => void;
  onClearPageAnnotations: (pageNumber: number) => void;
  onUploadClick: () => void;
  onAnalyzePageAI: () => void;
  isAnalyzing: boolean;
  onBackToLibrary?: () => void;
  onUpdateDocument?: (doc: DocumentFile) => void;
  translationCache?: Record<string, any>;
  onUpdateCache?: (newCache: Record<string, any>) => void;
}

// PdfReader Component
// The core reading and analysis interface for bilingual texts.
// Features:
// 1. Text parsing and interactive word-by-word selection
// 2. Integration with Gemini AI for sentence translation and page summarization
// 3. Highlight and Freehand Annotation drawing canvases
// 4. Split-screen layout (Reading pane + Notes/Analysis pane)
export const PdfReader: React.FC<PdfReaderProps> = ({
  activeWord,
  document,
  settings,
  onUpdateSettings,
  onWordClick,
  highlights,
  onAddHighlight,
  onRemoveHighlight,
  annotations,
  onSaveAnnotation,
  onRemoveAnnotation,
  onClearPageAnnotations,
  onUploadClick,
  onAnalyzePageAI,
  isAnalyzing,
  onBackToLibrary,
  onUpdateDocument,
  translationCache = {},
  onUpdateCache,
}) => {
  const t = getTranslation(settings.interfaceLanguage || settings.targetLanguage);
  const [currentPage, setCurrentPage] = useState<number>(document?.currentPage || 1);
  const [pageDirection, setPageDirection] = useState<number>(0);

  // Scroll to saved page on mount
  useEffect(() => {
    if (document?.currentPage && document.currentPage > 1) {
      setTimeout(() => {
        const mobilePageEl = window.document.getElementById(`mobile-page-${document.currentPage}`);
        if (mobilePageEl) {
          mobilePageEl.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }, 500);
    }
  }, [document?.id]);
  const [loadedPdfDoc, setLoadedPdfDoc] = useState<any>(null);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadPdfDocument() {
      if (!document) {
        setLoadedPdfDoc(null);
        return;
      }

      const isPdf = document.fileType === 'pdf' || document.hasOriginalPdf || !!document.pdfDataUri;
      if (!isPdf) {
        setLoadedPdfDoc(null);
        return;
      }

      setIsPdfLoading(true);
      try {
        let binaryData: any = document.pdfDataUri;
        if (!binaryData) {
          binaryData = await getPdfBinary(document.id);
        }

        if (binaryData) {
          let loadingSource: any = null;
          if (typeof binaryData === 'string' && binaryData.startsWith('data:application/pdf;base64,')) {
            const b64 = binaryData.replace('data:application/pdf;base64,', '');
            const binaryStr = atob(b64);
            const bytes = new Uint8Array(binaryStr.length);
            for (let i = 0; i < binaryStr.length; i++) {
              bytes[i] = binaryStr.charCodeAt(i);
            }
            loadingSource = { data: bytes };
          } else if (binaryData instanceof ArrayBuffer) {
            loadingSource = { data: new Uint8Array(binaryData.slice(0)) };
          } else if (binaryData instanceof Uint8Array) {
            loadingSource = { data: new Uint8Array(binaryData.slice()) };
          } else if (typeof binaryData === 'string' && binaryData.length > 50) {
            try {
              const binaryStr = atob(binaryData);
              const bytes = new Uint8Array(binaryStr.length);
              for (let i = 0; i < binaryStr.length; i++) {
                bytes[i] = binaryStr.charCodeAt(i);
              }
              loadingSource = { data: bytes };
            } catch (_) {
              loadingSource = { url: binaryData };
            }
          }

          if (loadingSource) {
            const loadingTask = pdfjsLib.getDocument(loadingSource);
            const pdf = await loadingTask.promise;
            if (isMounted) {
              setLoadedPdfDoc(pdf);
            }
          }
        }
      } catch (err) {
        console.warn('Could not load authentic PDF canvas:', err);
      } finally {
        if (isMounted) {
          setIsPdfLoading(false);
        }
      }
    }

    loadPdfDocument();
    return () => {
      isMounted = false;
    };
  }, [document?.id, document?.pdfDataUri]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (document?.totalPages || 1)) {
      setPageDirection(newPage > currentPage ? 1 : -1);
      setCurrentPage(newPage);
      
      if (document && onUpdateDocument) {
        onUpdateDocument({
          ...document,
          currentPage: newPage,
          lastReadAt: Date.now()
        });
      }

      if (document) {
        activityTracker.logDocOpened(document.name, newPage);
      }
      const mobilePageEl = window.document.getElementById(`mobile-page-${newPage}`);
      if (mobilePageEl) {
        mobilePageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Scroll Tracking on Mobile: Synchronize currentPage with the currently visible page in viewport
  useEffect(() => {
    if (!document) return;
    const totalPages = document.totalPages || 1;
    if (totalPages <= 1) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageStr = entry.target.getAttribute('data-page-number');
            if (pageStr) {
              const pageNum = parseInt(pageStr, 10);
              if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                setCurrentPage(pageNum);
                if (onUpdateDocument) {
                  onUpdateDocument({
                    ...document,
                    currentPage: pageNum,
                    lastReadAt: Date.now()
                  });
                }
              }
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-15% 0px -60% 0px',
        threshold: 0,
      }
    );

    for (let p = 1; p <= totalPages; p++) {
      const el = window.document.getElementById(`mobile-page-${p}`);
      if (el) observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [document?.id, document?.totalPages]);

  // Smart Pre-caching States
  const [preCacheStatus, setPreCacheStatus] = useState<'idle' | 'scanning' | 'caching' | 'ready' | 'error'>('idle');
  const [preCacheCount, setPreCacheCount] = useState<number>(0);

  // Sentence Selection Translation States
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionRect, setSelectionRect] = useState<{ x: number, y: number, width: number, height: number } | null>(null);

  // Listen to user text selection on pages
  const handleTextSelection = (e: React.MouseEvent | React.TouchEvent) => {
    const selection = window.getSelection();
    if (!selection) return;
    const text = selection.toString().trim();
    if (text.length >= 1) {
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Immediately trigger the translation popup in App.tsx using standard word modal format
        onWordClick(text, "", {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        });

        setSelectedText(text);
        setSelectionRect({
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        });
      } catch (err) {
        console.error('Error getting selection range rect:', err);
      }
    } else {
      setSelectedText('');
      setSelectionRect(null);
    }
  };

  // Background Smart Guessing/Pre-Caching Logic (Runs on page change & document load & language change)
  useEffect(() => {
    if (!document || !document.contentData || !onUpdateCache) return;

    let isCancelled = false;

    const timer = setTimeout(async () => {
      const docId = document.id;
      const translateToLang = settings.translationLanguage || (settings.interfaceLanguage && settings.interfaceLanguage !== settings.targetLanguage ? settings.interfaceLanguage : 'French');
      const targetLangLower = translateToLang.toLowerCase();
      
      // 1. First, load existing cache from localStorage if available, to prime our state instantly
      let mergedCache: Record<string, any> = {};
      try {
        const savedCache = localStorage.getItem(`lingoflow_cache_${docId}_${targetLangLower}`);
        if (savedCache) {
          const parsed = JSON.parse(savedCache);
          Object.keys(parsed).forEach(word => {
            const cacheKey = `${docId}_${targetLangLower}_${word.toLowerCase()}`;
            mergedCache[cacheKey] = parsed[word];
          });
          onUpdateCache(mergedCache);
        }
      } catch (err) {
        console.error('Error loading saved cache:', err);
      }

      if (isCancelled) return;

      // 2. Identify all words on the current active page
      setPreCacheStatus('scanning');
      const pageText = getPageContent();
      
      // Get word tokens on the current page
      const pageWords = pageText.split(/[\s.,!?;:()""''「」『』。、¿¡«»“”‘’—–\-]+/).filter(w => {
        const clean = w.trim();
        // Ignore single letter words, pure digits, and common punctuation
        return clean.length >= 2 && !/^\d+$/.test(clean);
      });

      // Get unique words for the current page
      const uniquePageWords = Array.from(new Set(pageWords.map(w => w.toLowerCase())));

      // Filter out words that are already in either our translationCache or the local mergedCache
      const uncachedWords = uniquePageWords.filter(word => {
        const cacheKey = `${docId}_${targetLangLower}_${word}`;
        const isAlreadyInGlobal = translationCache && translationCache[cacheKey];
        const isAlreadyInLocal = mergedCache[cacheKey];
        return !isAlreadyInGlobal && !isAlreadyInLocal;
      });

      if (uncachedWords.length === 0) {
        setPreCacheStatus('ready');
        setPreCacheCount(uniquePageWords.length);
        return;
      }

      // Limit to 25 unique uncached words per batch call to conserve API rate limits
      const wordsToTranslate = uncachedWords.slice(0, 25);
      setPreCacheStatus('caching');
      setPreCacheCount(wordsToTranslate.length);

      try {
        const res = await fetch('/api/pre-translate-words', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            words: wordsToTranslate,
            targetLanguage: translateToLang,
            sourceLanguage: document.language || 'Auto',
          }),
        });

        if (isCancelled) return;

        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }

        const text = await res.text();
        let newData: any = {};
        try {
          newData = JSON.parse(text);
        } catch {
          newData = {};
        }
        
        // Update localStorage
        try {
          const savedCache = localStorage.getItem(`lingoflow_cache_${docId}_${targetLangLower}`);
          const existingParsed = savedCache ? JSON.parse(savedCache) : {};
          const updatedParsed = { ...existingParsed, ...newData };
          localStorage.setItem(`lingoflow_cache_${docId}_${targetLangLower}`, JSON.stringify(updatedParsed));
        } catch (e) {
          console.warn('Failed to update localStorage with page translation:', e);
        }

        // Format and merge into global state cache
        const formattedNewCache: Record<string, any> = {};
        Object.keys(newData).forEach(word => {
          formattedNewCache[`${docId}_${targetLangLower}_${word.toLowerCase()}`] = newData[word];
        });

        onUpdateCache(formattedNewCache);
        setPreCacheStatus('ready');
        setPreCacheCount(uniquePageWords.length);
      } catch (err) {
        console.warn('Pre-cache page words notice:', err);
        if (!isCancelled) {
          setPreCacheStatus('ready');
        }
      }
    }, 600);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [document?.id, currentPage, settings.targetLanguage, settings.translationLanguage, settings.interfaceLanguage]);

  const [activeTool, setActiveTool] = useState<'select' | 'highlight' | 'pen' | 'note' | 'eraser'>('select');
  const [selectedColor, setSelectedColor] = useState<string>(settings.strokeColor || '#FFB74D');
  const [readerLayout, setReaderLayout] = useState<'split' | 'split-wide' | 'top' | 'stacked' | 'notes-fullscreen' | 'hidden'>('split');
  const [isNotesVisible, setIsNotesVisible] = useState<boolean>(false);

  // PDF Sidebars state: Outline, Thumbnails, Annotations/Quotes
  const [activePdfSidebar, setActivePdfSidebar] = useState<'outline' | 'thumbnails' | 'annotations' | null>(null);
  const [annotationSearchQuery, setAnnotationSearchQuery] = useState<string>('');
  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>(() => {
    if (!document) return [1];
    try {
      const saved = localStorage.getItem(`lingoflow_bookmarks_${document.id}`);
      return saved ? JSON.parse(saved) : [1];
    } catch {
      return [1];
    }
  });

  useEffect(() => {
    if (document) {
      try {
        const saved = localStorage.getItem(`lingoflow_bookmarks_${document.id}`);
        setBookmarkedPages(saved ? JSON.parse(saved) : [1]);
      } catch {
        setBookmarkedPages([1]);
      }
    }
  }, [document?.id]);

  const toggleBookmarkPage = (pageNumber: number) => {
    setBookmarkedPages((prev) => {
      const next = prev.includes(pageNumber)
        ? prev.filter((p) => p !== pageNumber)
        : [...prev, pageNumber].sort((a, b) => a - b);
      if (document) {
        localStorage.setItem(`lingoflow_bookmarks_${document.id}`, JSON.stringify(next));
      }
      return next;
    });
  };

  const handleTogglePdfSidebar = (sidebar: 'outline' | 'thumbnails' | 'annotations') => {
    setActivePdfSidebar((prev) => (prev === sidebar ? null : sidebar));
  };

  const handleLayoutChange = (mode: 'split' | 'split-wide' | 'top' | 'stacked' | 'notes-fullscreen' | 'hidden') => {
    if (mode === 'hidden') {
      setIsNotesVisible(false);
    } else {
      setIsNotesVisible(true);
      setReaderLayout(mode);
    }
  };
  
  // Freehand drawing & Erasing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [eraserPos, setEraserPos] = useState<{ x: number; y: number } | null>(null);
  const [currentPath, setCurrentPath] = useState<Array<{ x: number; y: number }>>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mobile / Touch Pinch-to-Zoom & Pan state for document reader
  const [touchZoomScale, setTouchZoomScale] = useState<number>(1);
  const [touchPan, setTouchPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const paperContainerRef = useRef<HTMLDivElement | null>(null);

  const zoomStateRef = useRef({
    scale: 1,
    pan: { x: 0, y: 0 },
    isPinching: false,
    startDistance: 0,
    startScale: 1,
    startPan: { x: 0, y: 0 },
    startMidpoint: { x: 0, y: 0 },
    startSingleTouch: { x: 0, y: 0 },
    lastTapTime: 0,
    lastTapPos: { x: 0, y: 0 },
  });

  useEffect(() => {
    zoomStateRef.current.scale = touchZoomScale;
    zoomStateRef.current.pan = touchPan;
    zoomStateRef.current.isPinching = isPinching;
  }, [touchZoomScale, touchPan, isPinching]);

  // Reset zoom on page change
  useEffect(() => {
    setTouchZoomScale(1);
    setTouchPan({ x: 0, y: 0 });
    zoomStateRef.current.scale = 1;
    zoomStateRef.current.pan = { x: 0, y: 0 };
  }, [currentPage, document?.id]);

  useEffect(() => {
    const el = paperContainerRef.current;
    if (!el) return;

    const getDistance = (t1: Touch, t2: Touch) => {
      return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
    };

    const getMidpoint = (t1: Touch, t2: Touch) => {
      return {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      };
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const d = getDistance(e.touches[0], e.touches[1]);
        const mid = getMidpoint(e.touches[0], e.touches[1]);
        zoomStateRef.current.startDistance = d;
        zoomStateRef.current.startScale = zoomStateRef.current.scale;
        zoomStateRef.current.startPan = { ...zoomStateRef.current.pan };
        zoomStateRef.current.startMidpoint = mid;
        zoomStateRef.current.isPinching = true;
        setIsPinching(true);
      } else if (e.touches.length === 1) {
        const touch = e.touches[0];
        const now = Date.now();
        const timeDiff = now - zoomStateRef.current.lastTapTime;
        const distFromLast = Math.hypot(
          touch.clientX - zoomStateRef.current.lastTapPos.x,
          touch.clientY - zoomStateRef.current.lastTapPos.y
        );

        // Double tap gesture detection to toggle zoom
        if (timeDiff < 320 && distFromLast < 30) {
          e.preventDefault();
          zoomStateRef.current.lastTapTime = 0;
          if (zoomStateRef.current.scale > 1.1) {
            setTouchZoomScale(1);
            setTouchPan({ x: 0, y: 0 });
            zoomStateRef.current.scale = 1;
            zoomStateRef.current.pan = { x: 0, y: 0 };
          } else {
            const rect = el.getBoundingClientRect();
            const tapX = touch.clientX - rect.left - rect.width / 2;
            const tapY = touch.clientY - rect.top - rect.height / 2;
            const targetScale = 2.0;
            const targetPan = {
              x: -tapX * 0.6,
              y: -tapY * 0.6,
            };
            setTouchZoomScale(targetScale);
            setTouchPan(targetPan);
            zoomStateRef.current.scale = targetScale;
            zoomStateRef.current.pan = targetPan;
          }
          return;
        }

        zoomStateRef.current.lastTapTime = now;
        zoomStateRef.current.lastTapPos = { x: touch.clientX, y: touch.clientY };
        zoomStateRef.current.startSingleTouch = { x: touch.clientX, y: touch.clientY };
        zoomStateRef.current.startPan = { ...zoomStateRef.current.pan };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const d = getDistance(e.touches[0], e.touches[1]);
        const mid = getMidpoint(e.touches[0], e.touches[1]);
        const factor = d / (zoomStateRef.current.startDistance || 1);
        const nextScale = Math.max(0.85, Math.min(3.8, zoomStateRef.current.startScale * factor));
        
        const deltaX = mid.x - zoomStateRef.current.startMidpoint.x;
        const deltaY = mid.y - zoomStateRef.current.startMidpoint.y;
        const nextPanX = zoomStateRef.current.startPan.x + deltaX;
        const nextPanY = zoomStateRef.current.startPan.y + deltaY;

        setTouchZoomScale(nextScale);
        setTouchPan({ x: nextPanX, y: nextPanY });
        zoomStateRef.current.scale = nextScale;
        zoomStateRef.current.pan = { x: nextPanX, y: nextPanY };
      } else if (e.touches.length === 1 && zoomStateRef.current.scale > 1.05 && activeTool !== 'pen') {
        e.preventDefault();
        const touch = e.touches[0];
        const deltaX = touch.clientX - zoomStateRef.current.startSingleTouch.x;
        const deltaY = touch.clientY - zoomStateRef.current.startSingleTouch.y;
        
        const nextPanX = zoomStateRef.current.startPan.x + deltaX;
        const nextPanY = zoomStateRef.current.startPan.y + deltaY;

        const rect = el.getBoundingClientRect();
        const maxPanX = (rect.width * (zoomStateRef.current.scale - 1)) / 1.5;
        const maxPanY = (rect.height * (zoomStateRef.current.scale - 1)) / 1.5;
        
        const clampedX = Math.max(-maxPanX, Math.min(maxPanX, nextPanX));
        const clampedY = Math.max(-maxPanY, Math.min(maxPanY, nextPanY));

        setTouchPan({ x: clampedX, y: clampedY });
        zoomStateRef.current.pan = { x: clampedX, y: clampedY };
      }
    };

    const onTouchEnd = () => {
      if (zoomStateRef.current.isPinching) {
        zoomStateRef.current.isPinching = false;
        setIsPinching(false);

        if (zoomStateRef.current.scale < 1.05) {
          setTouchZoomScale(1);
          setTouchPan({ x: 0, y: 0 });
          zoomStateRef.current.scale = 1;
          zoomStateRef.current.pan = { x: 0, y: 0 };
        } else {
          const rect = el.getBoundingClientRect();
          const scale = Math.min(3.5, zoomStateRef.current.scale);
          const maxPanX = (rect.width * (scale - 1)) / 1.5;
          const maxPanY = (rect.height * (scale - 1)) / 1.5;
          const clampedX = Math.max(-maxPanX, Math.min(maxPanX, zoomStateRef.current.pan.x));
          const clampedY = Math.max(-maxPanY, Math.min(maxPanY, zoomStateRef.current.pan.y));

          setTouchZoomScale(scale);
          setTouchPan({ x: clampedX, y: clampedY });
          zoomStateRef.current.scale = scale;
          zoomStateRef.current.pan = { x: clampedX, y: clampedY };
        }
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [activeTool]);

  // Sticky notes state persisted in localStorage
  const [notes, setNotes] = useState<StickyNoteAnnotation[]>(() => storage.getStickyNotes());

  useEffect(() => {
    storage.saveStickyNotes(notes);
  }, [notes]);

  useEffect(() => {
    if (document) {
      setCurrentPage(document.currentPage || 1);
    }
  }, [document?.id]);

  // Redraw canvas paths
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineJoin = 'round';

    if (!document) return;

    // Filter page annotations from stored state
    const pageAnn = annotations.filter(
      (a) => a.documentId === document.id && a.pageNumber === currentPage
    );

    // Draw saved annotations with their individual styles
    pageAnn.forEach((ann) => {
      ctx.save();
      ctx.strokeStyle = ann.color || '#5A634D';
      ctx.lineWidth = ann.strokeWidth || 3;
      ctx.globalAlpha = ann.strokeOpacity ?? (ann.penType === 'highlighter' ? 0.4 : 1.0);
      ctx.lineCap = ann.penType === 'highlighter' ? 'square' : 'round';

      ann.paths.forEach((path) => {
        if (path.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
      });
      ctx.restore();
    });

    // Draw active path being drawn right now
    if (currentPath.length > 1) {
      ctx.save();
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = settings.strokeWidth || 3;
      ctx.globalAlpha = settings.strokeOpacity ?? (settings.penType === 'highlighter' ? 0.4 : 1.0);
      ctx.lineCap = settings.penType === 'highlighter' ? 'square' : 'round';

      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }
  }, [annotations, document?.id, currentPage, currentPath, selectedColor, settings.strokeWidth, settings.strokeOpacity, settings.penType]);

  // Erase annotations, sticky notes, and text highlights at (x, y)
  const eraseAtPosition = (x: number, y: number, clientX?: number, clientY?: number) => {
    if (!document) return;
    const ERASER_RADIUS = 30; // Erase radius in pixels

    // 1. Remove freehand annotations hit by eraser
    const pageAnn = annotations.filter(
      (a) => a.documentId === document.id && a.pageNumber === currentPage
    );

    pageAnn.forEach((ann) => {
      const isHit = ann.paths.some((path) =>
        path.some((pt) => {
          const dx = pt.x - x;
          const dy = pt.y - y;
          return Math.sqrt(dx * dx + dy * dy) <= ERASER_RADIUS;
        })
      );

      if (isHit) {
        if (onRemoveAnnotation) {
          onRemoveAnnotation(ann.id);
        } else {
          onClearPageAnnotations(currentPage);
        }
      }
    });

    // 2. Erase Sticky Notes near pointer
    const canvas = canvasRef.current;
    if (canvas) {
      const xPercent = (x / canvas.width) * 100;
      const yPercent = (y / canvas.height) * 100;

      setNotes((prev) =>
        prev.filter((n) => {
          if (n.documentId !== document.id || n.pageNumber !== currentPage) return true;
          const dx = Math.abs(n.x - xPercent);
          const dy = Math.abs(n.y - yPercent);
          // Delete note if hover/pointer is inside its bounds (~14%)
          return !(dx < 14 && dy < 14);
        })
      );
    }

    // 3. Erase text highlights under pointer
    if (clientX !== undefined && clientY !== undefined && typeof document !== 'undefined' && document.elementsFromPoint) {
      const elements = document.elementsFromPoint(clientX, clientY);
      elements.forEach((el) => {
        const textAttr = el.getAttribute('data-highlight-text');
        if (textAttr) {
          const clean = textAttr.replace(PUNCTUATION_CLEAN_REGEX, '').toLowerCase();
          highlights.forEach((h) => {
            if (
              h.documentId === document.id &&
              h.pageNumber === currentPage &&
              (h.text.toLowerCase().includes(clean) || (clean && clean.includes(h.text.toLowerCase())))
            ) {
              onRemoveHighlight(h.id);
            }
          });
        }
      });
    }
  };

  // Create new Sticky Note at (x, y)
  const createStickyNoteAt = (xPx: number, yPx: number) => {
    if (!document || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const xPercent = Math.min(80, Math.max(5, (xPx / canvas.width) * 100));
    const yPercent = Math.min(80, Math.max(5, (yPx / canvas.height) * 100));

    const newNote: StickyNoteAnnotation = {
      id: `note-${Date.now()}`,
      documentId: document.id,
      pageNumber: currentPage,
      x: xPercent,
      y: yPercent,
      text: '',
      color: selectedColor || '#FFEB3B',
      isExpanded: true,
      createdAt: Date.now(),
    };

    setNotes((prev) => [...prev, newNote]);
  };

  // Canvas pointer down handler
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (activeTool === 'pen') {
      setIsDrawing(true);
      setCurrentPath([{ x, y }]);
    } else if (activeTool === 'eraser') {
      setIsErasing(true);
      setEraserPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      eraseAtPosition(x, y, e.clientX, e.clientY);
    } else if (activeTool === 'note') {
      createStickyNoteAt(x, y);
    }
  };

  // Canvas pointer move handler
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (activeTool === 'eraser') {
      setEraserPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      eraseAtPosition(x, y, e.clientX, e.clientY);
    } else if (isDrawing && activeTool === 'pen') {
      setCurrentPath((prev) => [...prev, { x, y }]);
    }
  };

  // Canvas pointer up / leave handler
  const handlePointerUp = () => {
    if (activeTool === 'eraser') {
      setIsErasing(false);
      setEraserPos(null);
    } else if (isDrawing && activeTool === 'pen') {
      setIsDrawing(false);
      if (currentPath.length > 1 && document) {
        onSaveAnnotation({
          documentId: document.id,
          pageNumber: currentPage,
          color: selectedColor,
          strokeWidth: settings.strokeWidth || 3,
          strokeOpacity: settings.strokeOpacity ?? (settings.penType === 'highlighter' ? 0.4 : 1.0),
          penType: settings.penType || 'pen',
          paths: [currentPath],
        });
      }
      setCurrentPath([]);
    }
  };

  // Reader Themes mapping
  const themeStyles = {
    paper: 'bg-[#FFFFFF] text-[#2D3027] border-[#E5E2D9] shadow-md',
    sunset: 'bg-[#F9F7F2] text-[#2D3027] border-[#E5E2D9] shadow-md',
    azure: 'bg-[#F4F8FA] text-[#1E2C38] border-[#D1E0E8] shadow-md',
    sepia: 'bg-[#F4EFE6] text-[#3D3225] border-[#E2D8C8] shadow-md',
    dark: 'bg-[#1D201A] text-[#E8E6DF] border-[#2A2E26] shadow-md',
  };

  // Font Family Mapping
  const fontStyles = {
    serif: 'font-serif-classic',
    sans: 'font-sans',
    mono: 'font-mono',
  };

  // Get specific page content
  const getPageContentFor = (pageNumber: number): string => {
    if (!document || !document.contentData) return '';
    const pages = document.contentData.split(/\[Page \d+\]/);
    if (pages.length > 1) {
      return pages[pageNumber] || pages[1] || '';
    }
    return document.contentData;
  };

  // Get current page text content
  const getPageContent = (): string => {
    if (!document || !document.contentData) return '';
    const pages = document.contentData.split(/\[Page \d+\]/);
    if (pages.length > 1) {
      return pages[currentPage] || pages[1] || document.contentData;
    }
    return document.contentData;
  };

  // Render Outline & Bookmarks Sidebar Content
  const renderOutlineContent = () => {
    if (!document) return null;
    const totalPages = document.totalPages || 1;
    const isCurrentBookmarked = bookmarkedPages.includes(currentPage);

    const outlineSections = [];
    for (let p = 1; p <= totalPages; p++) {
      const pText = getPageContentFor(p).trim();
      const firstLine = pText.split('\n')[0] || `Page ${p}`;
      const title = firstLine.length > 40 ? firstLine.substring(0, 40) + '...' : firstLine;
      outlineSections.push({ page: p, title });
    }

    return (
      <div className="space-y-4 text-xs">
        {/* Bookmark Current Page Banner */}
        <div className="p-3 rounded-2xl bg-[#F9F7F2] dark:bg-stone-800 border border-[#E5E2D9] dark:border-stone-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className={`w-4 h-4 ${isCurrentBookmarked ? 'fill-amber-500 text-amber-500' : 'text-stone-400'}`} />
            <div>
              <p className="font-bold text-[#2D3027] dark:text-stone-200">{t.page || 'Page'} {currentPage}</p>
              <p className="text-[10px] text-stone-500">{isCurrentBookmarked ? t.bookmarked : t.notBookmarked}</p>
            </div>
          </div>
          <button
            onClick={() => toggleBookmarkPage(currentPage)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
              isCurrentBookmarked
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-[#C78F77] text-white hover:bg-[#4B533E]'
            }`}
          >
            {isCurrentBookmarked ? t.bookmarked : t.addBookmark}
          </button>
        </div>

        {/* Bookmarked Pages Section */}
        {bookmarkedPages.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#666666] dark:text-[#D0D2CF] px-1">{t.bookmarkedPages}</p>
            <div className="space-y-1">
              {bookmarkedPages.map((p) => (
                <div
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl border text-start cursor-pointer transition-all ${
                    currentPage === p
                      ? 'bg-[#A4F5A6]/20 border-[#A4F5A6] text-[#222222] font-bold dark:text-[#EFF1EE]'
                      : 'bg-white dark:bg-[#1E1E1E] border-[#D0D2CF] dark:border-white/10 hover:bg-[#EFF1EE] text-[#222222] dark:text-[#EFF1EE]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-3.5 h-3.5 fill-[#B2A1FF] text-[#B2A1FF] shrink-0" />
                    <span className="font-semibold">{t.page || 'Page'} {p}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 rtl:rotate-180" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chapters & Document Outline Section */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#666666] dark:text-[#D0D2CF] px-1">{t.tableOfContents}</p>
          <div className="space-y-1">
            {outlineSections.map((sec) => (
              <button
                key={sec.page}
                onClick={() => handlePageChange(sec.page)}
                className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-start border transition-all ${
                  currentPage === sec.page
                    ? 'bg-[#222222] text-[#EFF1EE] font-bold border-[#222222] shadow-xs'
                    : 'bg-white dark:bg-[#1E1E1E] border-[#D0D2CF] dark:border-white/10 hover:bg-[#EFF1EE] text-[#222222] dark:text-[#EFF1EE]'
                }`}
              >
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 font-mono shrink-0">
                  P.{sec.page}
                </span>
                <span className="text-[11px] leading-tight line-clamp-2">{sec.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render Thumbnails Sidebar Content
  const renderThumbnailsContent = () => {
    if (!document) return null;
    const totalPages = document.totalPages || 1;
    const pagesList = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="space-y-3 text-xs">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#666666] dark:text-[#D0D2CF] px-1">
          Select Page ({totalPages} Total)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
          {pagesList.map((p) => {
            const isCurrent = currentPage === p;
            const pContent = getPageContentFor(p).trim();
            const snippet = pContent ? pContent.substring(0, 90) + '...' : 'Page content loading...';
            const hasAnn = annotations.some((a) => a.documentId === document.id && a.pageNumber === p);
            const hasNote = notes.some((n) => n.documentId === document.id && n.pageNumber === p);
            const hasHL = highlights.some((h) => h.documentId === document.id && h.pageNumber === p);

            return (
              <div
                key={p}
                onClick={() => handlePageChange(p)}
                className={`p-3 rounded-2xl border text-start cursor-pointer transition-all ${
                  isCurrent
                    ? 'ring-2 ring-[#222222] bg-[#A4F5A6]/10 border-[#222222] shadow-xs'
                    : 'bg-white dark:bg-[#1E1E1E] border-[#D0D2CF] dark:border-white/10 hover:border-[#222222] hover:shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-lg ${
                    isCurrent ? 'bg-[#222222] text-[#EFF1EE]' : 'bg-[#EFF1EE] dark:bg-white/10 text-[#222222] dark:text-white'
                  }`}>
                    Page {p}
                  </span>
                  <div className="flex items-center gap-1">
                    {hasHL && <span className="w-2 h-2 rounded-full bg-[#A4F5A6]" title="Has Highlights" />}
                    {hasNote && <span className="w-2 h-2 rounded-full bg-[#B2A1FF]" title="Has Sticky Notes" />}
                    {hasAnn && <span className="w-2 h-2 rounded-full bg-rose-400" title="Has Drawings" />}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-[#EFF1EE]/50 dark:bg-white/5 border border-[#D0D2CF] dark:border-white/10 text-[10px] text-[#666666] dark:text-[#D0D2CF] line-clamp-3 leading-relaxed font-serif">
                  {snippet}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Annotations & Quotes Sidebar Content
  const renderAnnotationsContent = () => {
    if (!document) return null;

    const docHighlights = highlights.filter((h) => h.documentId === document.id);
    const docNotes = notes.filter((n) => n.documentId === document.id);
    const docDrawings = annotations.filter((a) => a.documentId === document.id);

    const query = annotationSearchQuery.toLowerCase();
    const filteredHighlights = docHighlights.filter((h) => h.text.toLowerCase().includes(query));
    const filteredNotes = docNotes.filter((n) => n.text.toLowerCase().includes(query));

    const totalCount = docHighlights.length + docNotes.length + docDrawings.length;

    return (
      <div className="space-y-3 text-xs">
        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute start-3 top-2.5 text-[#666666]" />
          <input
            type="text"
            value={annotationSearchQuery}
            onChange={(e) => setAnnotationSearchQuery(e.target.value)}
            placeholder={t.searchHighlightsNotes}
            className="w-full ps-8 pe-3 py-1.5 rounded-xl bg-white dark:bg-[#1E1E1E] text-xs text-[#222222] dark:text-white border border-[#D0D2CF] dark:border-white/10 outline-none focus:ring-1 focus:ring-[#222222]"
          />
        </div>

        {totalCount === 0 ? (
          <div className="p-6 text-center text-[#666666] space-y-2">
            <BookmarkCheck className="w-8 h-8 mx-auto opacity-40" />
            <p className="text-xs">{t.noAnnotationsYet}</p>
            <p className="text-[10px]">{t.highlightWordsToView}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Highlights Group */}
            {filteredHighlights.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 px-1">
                  {t.highlightsCount} ({filteredHighlights.length})
                </p>
                <div className="space-y-1.5">
                  {filteredHighlights.map((hl) => (
                    <div
                      key={hl.id}
                      onClick={() => handlePageChange(hl.pageNumber)}
                      className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-all text-start space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                          {t.page || 'Page'} {hl.pageNumber}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveHighlight(hl.id);
                          }}
                          className="p-1 text-stone-400 hover:text-rose-500 transition-colors"
                          title="Remove Highlight"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p
                        className="text-[11px] font-medium leading-relaxed rounded-lg p-1.5 text-stone-800 dark:text-stone-200"
                        style={{ backgroundColor: `${hl.color}33`, borderLeft: `3px solid ${hl.color}` }}
                      >
                        "{hl.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sticky Notes Group */}
            {filteredNotes.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 px-1">
                  {t.stickyNotesCount} ({filteredNotes.length})
                </p>
                <div className="space-y-1.5">
                  {filteredNotes.map((nt) => (
                    <div
                      key={nt.id}
                      onClick={() => handlePageChange(nt.pageNumber)}
                      className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-all text-start space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200">
                          {t.page || 'Page'} {nt.pageNumber}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotes((prev) => prev.filter((n) => n.id !== nt.id));
                          }}
                          className="p-1 text-stone-400 hover:text-rose-500 transition-colors"
                          title="Remove Note"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#2D3027] dark:text-stone-200 leading-relaxed font-semibold">
                        {nt.text || t.emptyStickyNote}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Drawings Group */}
            {docDrawings.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 px-1">
                  {t.drawingsCount} ({docDrawings.length})
                </p>
                <div className="space-y-1">
                  {docDrawings.map((ann) => (
                    <div
                      key={ann.id}
                      onClick={() => handlePageChange(ann.pageNumber)}
                      className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <span className="text-[11px] font-bold text-[#2D3027] dark:text-stone-200">
                        {t.drawingOnPage} {ann.pageNumber}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-50 text-stone-400 rtl:rotate-180" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Sidebar Container
  const renderPdfSidebar = () => {
    if (!activePdfSidebar || !document) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full lg:w-72 xl:w-80 shrink-0 bg-white dark:bg-stone-900 border border-[#E5E2D9] dark:border-stone-800 rounded-3xl p-4 shadow-xl flex flex-col max-h-[82vh] overflow-hidden"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D0D2CF] dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            {activePdfSidebar === 'outline' && <ListTree className="w-4 h-4 text-[#222222] dark:text-[#A4F5A6]" />}
            {activePdfSidebar === 'thumbnails' && <LayoutGrid className="w-4 h-4 text-[#222222] dark:text-[#A4F5A6]" />}
            {activePdfSidebar === 'annotations' && <BookmarkCheck className="w-4 h-4 text-[#222222] dark:text-[#A4F5A6]" />}
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] dark:text-[#EFF1EE]">
              {activePdfSidebar === 'outline' && t.docOutline}
              {activePdfSidebar === 'thumbnails' && t.pageThumbnails}
              {activePdfSidebar === 'annotations' && t.annotationsQuotes}
            </h3>
          </div>
          <button
            onClick={() => setActivePdfSidebar(null)}
            className="p-1 rounded-lg hover:bg-[#EFF1EE] dark:hover:bg-white/10 text-[#666666] transition-colors"
            title="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Body */}
        <div className="flex-1 overflow-y-auto pe-1 space-y-3 custom-scrollbar">
          {activePdfSidebar === 'outline' && renderOutlineContent()}
          {activePdfSidebar === 'thumbnails' && renderThumbnailsContent()}
          {activePdfSidebar === 'annotations' && renderAnnotationsContent()}
        </div>
      </motion.div>
    );
  };

  const pageText = getPageContent();
  const rawParagraphs = pageText.split(/\n\s*\n/).filter((p) => p.trim());
  const paragraphs = rawParagraphs.length > 0 ? rawParagraphs : (pageText.trim() ? [pageText] : []);

  // Render inline chunks with clickable words and highlight support
  const renderInlineWords = (text: string, pIdx: number, pageNum: number = currentPage) => {
    const words = text.split(/(\s+|[.,!?;:()""''「」『』。、¿¡«»“”‘’—–\-])/);

    return words.map((chunk, wIdx) => {
      if (!chunk) return null;
      const isWord = /^[^\s.,!?;:()""''「」『』。、¿¡«»“”‘’—–\-]+$/.test(chunk);
      
      if (!isWord) {
        return <span key={wIdx}>{chunk}</span>;
      }

      const cleanChunk = chunk.replace(PUNCTUATION_CLEAN_REGEX, '');
      const cleanChunkLower = cleanChunk.toLowerCase();
      const isActive = activeWord && cleanChunk && activeWord.toLowerCase() === cleanChunkLower;

      const matchingHighlights = highlights.filter((h) => {
        if (h.documentId !== document?.id || h.pageNumber !== pageNum) return false;
        const hTextClean = h.text.replace(PUNCTUATION_CLEAN_REGEX, '').toLowerCase();
        if (!hTextClean || !cleanChunkLower) return false;
        if (hTextClean === cleanChunkLower) return true;
        const wordsInH = hTextClean.split(/\s+/);
        return wordsInH.length > 1 && wordsInH.includes(cleanChunkLower);
      });
      const isHighlighted = matchingHighlights.length > 0;

      return (
        <span
          key={wIdx}
          data-highlight-text={isHighlighted ? chunk : undefined}
          onMouseEnter={() => {
            if (activeTool === 'eraser' && matchingHighlights.length > 0) {
              matchingHighlights.forEach((h) => onRemoveHighlight(h.id));
            }
          }}
          onPointerEnter={() => {
            if (activeTool === 'eraser' && matchingHighlights.length > 0) {
              matchingHighlights.forEach((h) => onRemoveHighlight(h.id));
            }
          }}
          onPointerOver={() => {
            if (activeTool === 'eraser' && matchingHighlights.length > 0) {
              matchingHighlights.forEach((h) => onRemoveHighlight(h.id));
            }
          }}
          onMouseMove={() => {
            if (activeTool === 'eraser' && matchingHighlights.length > 0) {
              matchingHighlights.forEach((h) => onRemoveHighlight(h.id));
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            const rect = (e.target as HTMLElement).getBoundingClientRect();

            if (activeTool === 'eraser') {
              if (matchingHighlights.length > 0) {
                matchingHighlights.forEach((h) => onRemoveHighlight(h.id));
              }
              return;
            }

            if (activeTool === 'highlight' && document) {
              if (isHighlighted) {
                matchingHighlights.forEach((h) => onRemoveHighlight(h.id));
              } else {
                onAddHighlight({
                  documentId: document.id,
                  pageNumber: pageNum,
                  text: chunk,
                  color: selectedColor,
                });
              }
              onWordClick(chunk, text, { x: rect.x, y: rect.y, width: rect.width, height: rect.height });
            } else if (activeTool !== 'pen') {
              onWordClick(chunk, text, { x: rect.x, y: rect.y, width: rect.width, height: rect.height });
            }
          }}
          className={`inline-block rounded-xs px-0.5 border-b-2 border-transparent transition-all cursor-pointer ${
            isActive
              ? 'bg-[#A4F5A6]/30 border-b-2 border-[#222222] text-[#222222] dark:text-[#EFF1EE] font-medium'
              : isHighlighted
              ? activeTool === 'eraser'
                ? 'bg-[#A4F5A6]/80 text-[#222222] font-medium hover:bg-rose-200 hover:line-through hover:opacity-50 cursor-pointer'
                : 'bg-[#A4F5A6]/80 text-[#222222] font-medium'
              : 'hover:bg-[#B2A1FF]/30 hover:border-[#222222] hover:text-[#222222]'
          }`}
          title={
            activeTool === 'eraser' && isHighlighted
              ? 'Hover or click to delete this highlight'
              : isHighlighted
              ? 'Highlighted word (click to translate or manage)'
              : undefined
          }
        >
          {chunk}
        </span>
      );
    });
  };

  // Render paragraphs, headings, tables, pictures, and lists with rich formatting and clickable words
  const renderParagraphWithWords = (paragraph: string, pIdx: number, pageNum: number = currentPage) => {
    const trimmed = paragraph.trim();
    const hasArabic = /[\u0600-\u06FF]/.test(paragraph);

    // 1. Markdown Images ![alt](url)
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      return (
        <div key={pIdx} className="my-6 text-center">
          <img
            src={imgMatch[2]}
            alt={imgMatch[1] || 'Document Image'}
            className="max-w-full max-h-[500px] rounded-2xl shadow-md mx-auto object-contain"
            loading="lazy"
          />
          {imgMatch[1] && <p className="text-xs opacity-60 mt-2 italic">{imgMatch[1]}</p>}
        </div>
      );
    }

    // 2. Heading 1 (# ...)
    if (trimmed.startsWith('# ')) {
      const headingText = trimmed.replace(/^#\s+/, '');
      return (
        <h1
          key={pIdx}
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight pb-3 mb-6 border-b border-black/10 dark:border-white/10 ${
            hasArabic ? 'font-arabic-serif text-end rtl' : 'text-start'
          }`}
          style={{ fontSize: `${Math.round(settings.fontSize * 1.5)}px` }}
          dir={hasArabic ? 'rtl' : 'ltr'}
        >
          {renderInlineWords(headingText, pIdx, pageNum)}
        </h1>
      );
    }

    // 3. Heading 2 (## ...)
    if (trimmed.startsWith('## ')) {
      const headingText = trimmed.replace(/^##\s+/, '');
      return (
        <h2
          key={pIdx}
          className={`text-xl sm:text-2xl font-bold tracking-tight pb-2 mb-4 border-b border-black/5 dark:border-white/5 ${
            hasArabic ? 'font-arabic-serif text-end rtl' : 'text-start'
          }`}
          style={{ fontSize: `${Math.round(settings.fontSize * 1.3)}px` }}
          dir={hasArabic ? 'rtl' : 'ltr'}
        >
          {renderInlineWords(headingText, pIdx, pageNum)}
        </h2>
      );
    }

    // 4. Heading 3 (### ...)
    if (trimmed.startsWith('### ')) {
      const headingText = trimmed.replace(/^###\s+/, '');
      return (
        <h3
          key={pIdx}
          className={`text-lg sm:text-xl font-bold tracking-tight mb-3 ${
            hasArabic ? 'font-arabic-serif text-end rtl' : 'text-start'
          }`}
          style={{ fontSize: `${Math.round(settings.fontSize * 1.15)}px` }}
          dir={hasArabic ? 'rtl' : 'ltr'}
        >
          {renderInlineWords(headingText, pIdx, pageNum)}
        </h3>
      );
    }

    // 5. Markdown Tables (| ... | ... |)
    if (trimmed.includes('|') && trimmed.split('\n').filter(l => l.includes('|')).length >= 2) {
      const rows = trimmed.split('\n').filter(l => l.trim().startsWith('|'));
      const headerRow = rows[0]?.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
      const dataRows = rows.slice(2); // Skip separator row

      return (
        <div key={pIdx} className="my-6 overflow-x-auto rounded-xl border border-black/10 dark:border-white/10 shadow-sm">
          <table className="w-full text-start border-collapse">
            {headerRow && headerRow.length > 0 && (
              <thead className="bg-black/5 dark:bg-white/5 font-bold border-b border-black/10 dark:border-white/10">
                <tr>
                  {headerRow.map((cell, cIdx) => (
                    <th key={cIdx} className="p-3 text-xs sm:text-sm">
                      {renderInlineWords(cell.trim(), pIdx, pageNum)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {dataRows.map((row, rIdx) => {
                const cells = row.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
                return (
                  <tr key={rIdx} className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 transition-colors">
                    {cells.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 text-xs sm:text-sm">
                        {renderInlineWords(cell.trim(), pIdx, pageNum)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    // 6. Blockquotes (> ...)
    if (trimmed.startsWith('> ')) {
      const quoteText = trimmed.replace(/^>\s+/, '');
      return (
        <blockquote
          key={pIdx}
          className="ps-4 sm:ps-6 py-2 my-4 border-s-4 border-[#091F5C] dark:border-[#7096D1] italic opacity-90 rounded-e-xl bg-black/5 dark:bg-white/5"
          style={{ fontSize: `${settings.fontSize}px` }}
        >
          {renderInlineWords(quoteText, pIdx, pageNum)}
        </blockquote>
      );
    }

    // 7. Bullet / Numbered Lists
    if (/^(\*|-|\d+\.)\s/.test(trimmed)) {
      const listItems = trimmed.split('\n');
      return (
        <ul key={pIdx} className="list-disc ps-6 sm:ps-8 mb-4 sm:mb-6 space-y-2">
          {listItems.map((item, iIdx) => {
            const cleanItem = item.replace(/^(\*|-|\d+\.)\s+/, '');
            return (
              <li key={iIdx} style={{ fontSize: `${settings.fontSize}px` }}>
                {renderInlineWords(cleanItem, pIdx, pageNum)}
              </li>
            );
          })}
        </ul>
      );
    }

    // Standard Paragraph
    return (
      <p
        key={pIdx}
        className={`mb-4 sm:mb-6 leading-relaxed selection:bg-[#FFEB83] dark:selection:bg-stone-800 ${
          hasArabic 
            ? (settings.fontFamily === 'serif' ? 'font-arabic-serif text-end rtl' : 'font-arabic-sans text-end rtl') 
            : 'text-justify tracking-wide'
        }`}
        style={{
          fontSize: `${settings.fontSize}px`,
          lineHeight: hasArabic ? Math.max(1.85, settings.lineHeight * 1.25) : settings.lineHeight,
        }}
        dir={hasArabic ? 'rtl' : 'ltr'}
      >
        {renderInlineWords(paragraph, pIdx, pageNum)}
      </p>
    );
  };

  // Empty state if no document is loaded
  if (!document) {
    return (
      <div id="no-document-view" className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center space-y-6 animate-in fade-in duration-200">
        <div className="w-20 h-20 rounded-3xl bg-[#222222] flex items-center justify-center text-[#EFF1EE] shadow-md">
          <BookOpen className="w-10 h-10" />
        </div>
        
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold font-serif text-[#222222] dark:text-white">
            {t.readyToLearn}
          </h2>
          <p className="text-sm text-[#666666] dark:text-[#D0D2CF]">
            {t.uploadPdfDesc}
          </p>
        </div>

        <button
          onClick={onUploadClick}
          className="px-6 py-3.5 rounded-2xl bg-[#222222] hover:bg-[#A4F5A6] text-[#EFF1EE] hover:text-[#222222] font-bold text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <Upload className="w-5 h-5" />
          <span>{t.uploadPdf}</span>
        </button>
      </div>
    );
  }

  const isSplitLayout = isNotesVisible && (readerLayout === 'split' || readerLayout === 'split-wide');

  const renderNotesWorkspace = () => {
    if (!isNotesVisible) return null;

    const notesClass = readerLayout === 'split'
      ? 'hidden md:flex lg:col-span-4 xl:col-span-4 h-full flex-col'
      : readerLayout === 'split-wide'
      ? 'hidden md:flex lg:col-span-7 xl:col-span-7 h-full flex-col'
      : 'hidden md:block w-full';

    return (
      <div className={notesClass}>
        <NotesWorkspace
          documentId={document.id}
          documentTitle={document.title || document.name}
          currentPage={currentPage}
          currentPageText={pageText}
          targetLanguage={settings.targetLanguage}
          isExpanded={readerLayout === 'notes-fullscreen'}
          layoutMode={readerLayout}
          onChangeLayoutMode={handleLayoutChange}
          onClose={() => setIsNotesVisible(false)}
          onToggleExpand={() =>
            handleLayoutChange(readerLayout === 'notes-fullscreen' ? 'split' : 'notes-fullscreen')
          }
        />
      </div>
    );
  };

  return (
    <div id="pdf-reader-container" className={`w-full space-y-0 md:space-y-4 ${
      isSplitLayout ? 'max-w-none' : 'max-w-5xl mx-auto'
    }`}>

      {/* Mobile Native E-Reader Header Bar (Aligned with Phone Reader Mockups) */}
      <div className="md:hidden flex items-center justify-between px-3 py-2 bg-white/95 dark:bg-stone-900/95 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-1.5 min-w-0 flex-1 me-2">
          {onBackToLibrary && (
            <button
              onClick={onBackToLibrary}
              className="p-1 -ms-1 text-stone-800 dark:text-stone-100 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              title={t.backToLibrary}
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.2] rtl:rotate-180" />
            </button>
          )}
          <h1 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-stone-100 truncate tracking-tight font-serif-classic">
            {document.title || document.name}
          </h1>
        </div>
        
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => handleTogglePdfSidebar('outline')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              activePdfSidebar === 'outline'
                ? 'bg-[#222222] text-[#EFF1EE]'
                : 'text-[#666666] dark:text-[#D0D2CF] hover:bg-[#EFF1EE] dark:hover:bg-white/10'
            }`}
            title={t.docOutline}
          >
            <BookOpen className="w-4.5 h-4.5 stroke-[2]" />
          </button>
          <button
            onClick={() => setActiveTool(activeTool === 'note' ? 'select' : 'note')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTool === 'note'
                ? 'bg-[#A4F5A6] text-[#222222]'
                : 'text-[#666666] dark:text-[#D0D2CF] hover:bg-[#EFF1EE] dark:hover:bg-white/10'
            }`}
            title={t.toolNote}
          >
            <Plus className="w-4.5 h-4.5 stroke-[2.2]" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isMobileMenuOpen ? 'bg-[#222222] text-[#EFF1EE]' : 'text-[#666666] dark:text-[#D0D2CF] hover:bg-[#EFF1EE] dark:hover:bg-white/10'
              }`}
              title="Reader Options & Themes"
            >
              <MoreVertical className="w-4.5 h-4.5 stroke-[2]" />
            </button>

            {isMobileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMobileMenuOpen(false)} />
                <div className="absolute end-0 top-full mt-2 w-56 p-2 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <span className="block text-[9px] font-bold text-[#666666] dark:text-[#D0D2CF] uppercase tracking-wider px-2 py-1">
                    Theme
                  </span>
                  <div className="grid grid-cols-4 gap-1 p-1 mb-2">
                    {(['white', 'sepia', 'slate', 'dark'] as const).map((themeKey) => (
                      <button
                        key={themeKey}
                        onClick={() => {
                          onUpdateSettings({ readerTheme: themeKey });
                          setIsMobileMenuOpen(false);
                        }}
                        className={`h-7 rounded-lg border text-[10px] font-bold capitalize transition-all cursor-pointer ${
                          themeKey === 'white' ? 'bg-white text-[#222222] border-[#D0D2CF]' :
                          themeKey === 'sepia' ? 'bg-[#FBF0D9] text-[#5F4B32] border-[#E8D7B8]' :
                          themeKey === 'slate' ? 'bg-[#333842] text-[#ABB2BF] border-stone-600' :
                          'bg-[#222222] text-[#EFF1EE] border-stone-800'
                        } ${settings.readerTheme === themeKey ? 'ring-2 ring-[#222222]' : ''}`}
                      >
                        {themeKey}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-[#D0D2CF]/50 dark:border-white/10 pt-1.5">
                    <span className="block text-[9px] font-bold text-[#666666] dark:text-[#D0D2CF] uppercase tracking-wider px-2 py-1">
                      Font
                    </span>
                    {(['serif', 'sans', 'classic'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => {
                          onUpdateSettings({ fontFamily: f });
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-start px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize flex items-center justify-between transition-colors cursor-pointer ${
                          settings.fontFamily === f ? 'bg-[#A4F5A6]/30 text-[#222222] font-bold' : 'text-[#666666] dark:text-[#D0D2CF] hover:bg-[#EFF1EE] dark:hover:bg-white/5'
                        }`}
                      >
                        <span>{f}</span>
                        {settings.fontFamily === f && <Check className="w-3.5 h-3.5 text-[#222222]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Top Header Bar */}
      {onBackToLibrary && (
        <div className="hidden md:flex items-center justify-between gap-4 flex-wrap">
          <button
            onClick={onBackToLibrary}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-[#1E1E1E] hover:bg-[#EFF1EE] dark:hover:bg-white/5 border border-[#D0D2CF] dark:border-white/10 text-xs font-bold text-[#222222] dark:text-[#EFF1EE] transition-all shadow-xs cursor-pointer hover:translate-x-[-2px] rtl:hover:translate-x-[2px]"
          >
            <ChevronLeft className="w-4 h-4 shrink-0 rtl:rotate-180" />
            <span>{t.backToLibrary}</span>
          </button>
        </div>
      )}

      {/* Global Annotation Toolbar */}
      {readerLayout !== 'notes-fullscreen' && (
        <AnnotationToolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          currentPage={currentPage}
          totalPages={document.totalPages || 1}
          onPageChange={handlePageChange}
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          onAnalyzePageAI={onAnalyzePageAI}
          isAnalyzing={isAnalyzing}
          activePdfSidebar={activePdfSidebar}
          onTogglePdfSidebar={handleTogglePdfSidebar}
        />
      )}

      {/* Main Content Layout (Side-by-Side Right Panel vs Stacked View vs Top View) */}
      <div className={`transition-all duration-300 ${
        isSplitLayout
          ? 'grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch'
          : 'flex flex-col gap-2 md:gap-6'
      }`}>

        {/* Top Position: Render Notes Workspace above the Reader Document */}
        {isNotesVisible && readerLayout === 'top' && renderNotesWorkspace()}
        
        {/* Reader Document Container */}
        {readerLayout !== 'notes-fullscreen' && (
          <div className={
            isSplitLayout
              ? readerLayout === 'split'
                ? 'lg:col-span-8 xl:col-span-8 h-full flex flex-col gap-3'
                : 'lg:col-span-5 xl:col-span-5 h-full flex flex-col gap-3'
              : 'w-full space-y-3'
          }>
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-start w-full">
              {/* PDF Sidebar Drawer Panel when active */}
              <AnimatePresence>
                {renderPdfSidebar()}
              </AnimatePresence>

              {/* Mobile Continuous Vertical Scroll View: Pages under each other */}
              <div className="block md:hidden w-full pb-20 select-text">
                {Array.from({ length: document.totalPages || 1 }, (_, i) => i + 1).map((pageNum) => {
                  const pageContent = getPageContentFor(pageNum);
                  const pageRawParas = pageContent.split(/\n\s*\n/).filter((p) => p.trim());
                  const pageParas = pageRawParas.length > 0 ? pageRawParas : (pageContent.trim() ? [pageContent] : []);
                  const isLastPage = pageNum === (document.totalPages || 1);

                  return (
                    <React.Fragment key={`mobile-page-wrapper-${pageNum}`}>
                      <section
                        id={`mobile-page-${pageNum}`}
                        data-page-number={pageNum}
                        className={`w-full relative rounded-none ${
                          loadedPdfDoc ? 'p-1' : 'p-3.5 sm:p-6'
                        } transition-all ${
                          themeStyles[settings.readerTheme]
                        } ${fontStyles[settings.fontFamily]}`}
                      >
                        {loadedPdfDoc ? (
                          <div className="w-full flex flex-col items-center overflow-hidden">
                            <PdfPageCanvas
                              pdfDoc={loadedPdfDoc}
                              pageNumber={pageNum}
                              scale={1.0}
                              settings={settings}
                              highlights={highlights}
                              notes={notes}
                              annotations={annotations}
                              documentId={document.id}
                              activeWord={activeWord || null}
                              activeTool={activeTool}
                              selectedColor={selectedColor}
                              onWordClick={onWordClick}
                              onAddHighlight={onAddHighlight}
                              onRemoveHighlight={onRemoveHighlight}
                              onUpdateNotes={setNotes}
                              onClearPageAnnotations={onClearPageAnnotations}
                              onTextSelection={handleTextSelection}
                            />
                          </div>
                        ) : (
                          <>
                            {/* Sticky Notes on this specific page */}
                            {notes
                              .filter((n) => n.documentId === document.id && n.pageNumber === pageNum)
                              .map((note) => (
                                <StickyNoteCard
                                  key={note.id}
                                  note={note}
                                  isEraserActive={activeTool === 'eraser'}
                                  onUpdate={(updated) =>
                                    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
                                  }
                                  onDelete={(id) => setNotes((prev) => prev.filter((n) => n.id !== id))}
                                />
                              ))}

                            {/* Document Text on this page */}
                            <div 
                              onMouseUp={handleTextSelection}
                              onTouchEnd={handleTextSelection}
                              className="relative z-10 space-y-4 select-text w-full"
                            >
                              {pageParas.length > 0 ? (
                                pageParas.map((para, pIdx) => renderParagraphWithWords(para, pIdx, pageNum))
                              ) : (
                                <p className="text-center italic opacity-60 py-8">
                                  Page content empty...
                                </p>
                              )}
                            </div>

                            {/* Clear Drawings Button if any on this page */}
                            {annotations.some((a) => a.documentId === document.id && a.pageNumber === pageNum) && (
                              <div className="mt-3 flex justify-end">
                                <button
                                  onClick={() => onClearPageAnnotations(pageNum)}
                                  className="p-2 rounded-xl bg-rose-500 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>{t.clearDrawings}</span>
                                </button>
                              </div>
                            )}

                            {/* Page Footer / Subtle 1px Sheet Divider */}
                            <div className="mt-4 pt-2 border-t border-[1px] border-black/5 dark:border-white/5 flex items-center justify-end text-xs font-medium opacity-50 select-none">
                              <span className="font-bold text-[10px] tracking-wide">{t.page} {pageNum} / {document.totalPages || 1}</span>
                            </div>
                          </>
                        )}
                      </section>

                      {/* 50px Inter-Page Border / Separator matching the file theme color */}
                      {!isLastPage && (
                        <div 
                          className={`w-full h-[50px] flex items-center justify-center relative select-none border-y border-black/5 dark:border-white/5 ${
                            themeStyles[settings.readerTheme]
                          }`}
                        >
                          <div className="w-full flex items-center justify-center gap-3 px-8 opacity-40">
                            <div className="h-[1px] flex-1 bg-current opacity-20" />
                            <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                              {t.page} {pageNum + 1}
                            </span>
                            <div className="h-[1px] flex-1 bg-current opacity-20" />
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Desktop Paginated Paper Container with 3D Page Turn Animation */}
              <div 
                ref={paperContainerRef}
                style={{ perspective: '1500px' }} 
                className="hidden md:flex flex-1 w-full min-h-[80vh] h-full flex-col relative touch-pan-y select-none"
              >
                <AnimatePresence mode="popLayout" custom={pageDirection}>
                  <motion.div
                    key={currentPage}
                    custom={pageDirection}
                    onPointerMove={(e) => {
                      if (isPinching) return;
                      if (activeTool === 'eraser') {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const xPx = e.clientX - rect.left;
                        const yPx = e.clientY - rect.top;
                        setEraserPos({ x: xPx, y: yPx });
                        const canvas = canvasRef.current;
                        if (canvas) {
                          const scaleX = canvas.width / rect.width;
                          const scaleY = canvas.height / rect.height;
                          eraseAtPosition(xPx * scaleX, yPx * scaleY, e.clientX, e.clientY);
                        }
                      }
                    }}
                    onPointerDown={(e) => {
                      if (isPinching) return;
                      if (activeTool === 'eraser') {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const xPx = e.clientX - rect.left;
                        const yPx = e.clientY - rect.top;
                        setEraserPos({ x: xPx, y: yPx });
                        const canvas = canvasRef.current;
                        if (canvas) {
                          const scaleX = canvas.width / rect.width;
                          const scaleY = canvas.height / rect.height;
                          eraseAtPosition(xPx * scaleX, yPx * scaleY, e.clientX, e.clientY);
                        }
                      }
                    }}
                    onPointerLeave={() => {
                      if (activeTool === 'eraser') {
                        setEraserPos(null);
                      }
                    }}
                    className={`w-full relative h-full flex flex-col justify-between rounded-3xl p-8 md:p-12 shadow-xl border overflow-hidden ${
                      themeStyles[settings.readerTheme]
                    } ${fontStyles[settings.fontFamily]}`}
                    initial={(d: number) => ({
                      opacity: 1,
                      x: d >= 0 ? 0 : '-105%',
                      y: d >= 0 ? 0 : '3%',
                      rotateY: d >= 0 ? 0 : -18,
                      rotateZ: d >= 0 ? 0 : -6,
                      scale: d >= 0 ? 0.92 : 1,
                      zIndex: d >= 0 ? 0 : 20,
                      filter: d >= 0 ? 'brightness(0.85) blur(1px)' : 'brightness(1) blur(0px)',
                      boxShadow: d >= 0 ? 'none' : '25px 10px 50px -10px rgba(0,0,0,0.3)',
                      transformOrigin: 'left center',
                    })}
                    animate={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                      rotateY: 0,
                      rotateZ: 0,
                      scale: 1,
                      zIndex: 10,
                      filter: 'brightness(1) blur(0px)',
                      boxShadow: 'none',
                    }}
                    exit={(d: number) => ({
                      opacity: 1,
                      x: d >= 0 ? '-105%' : 0,
                      y: d >= 0 ? '3%' : 0,
                      rotateY: d >= 0 ? -18 : 0,
                      rotateZ: d >= 0 ? -6 : 0,
                      scale: d >= 0 ? 1 : 0.92,
                      zIndex: d >= 0 ? 20 : 0,
                      filter: d >= 0 ? 'brightness(1) blur(0px)' : 'brightness(0.85) blur(1px)',
                      boxShadow: d >= 0 ? '25px 10px 50px -10px rgba(0,0,0,0.3)' : 'none',
                      transformOrigin: 'left center',
                    })}
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {/* Zoomable Content Layer responding smoothly to 2-finger pinch & pan */}
                    <div
                      style={{
                        transform: `translate3d(${touchPan.x}px, ${touchPan.y}px, 0px) scale(${touchZoomScale})`,
                        transformOrigin: 'center 25%',
                        transition: isPinching ? 'transform 0.1s ease-out' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                        willChange: 'transform',
                      }}
                      className={`w-full h-full flex flex-col justify-between flex-1 relative select-text ${
                        isPinching ? 'transition-transform duration-100 ease-out' : ''
                      }`}
                    >
                      {loadedPdfDoc ? (
                        <div className="w-full flex-1 flex flex-col items-center justify-center p-2">
                          <PdfPageCanvas
                            pdfDoc={loadedPdfDoc}
                            pageNumber={currentPage}
                            scale={1.0}
                            settings={settings}
                            highlights={highlights}
                            notes={notes}
                            annotations={annotations}
                            documentId={document.id}
                            activeWord={activeWord || null}
                            activeTool={activeTool}
                            selectedColor={selectedColor}
                            onWordClick={onWordClick}
                            onAddHighlight={onAddHighlight}
                            onRemoveHighlight={onRemoveHighlight}
                            onUpdateNotes={setNotes}
                            onClearPageAnnotations={onClearPageAnnotations}
                            onTextSelection={handleTextSelection}
                          />
                        </div>
                      ) : (
                        <>
                          {/* Document Header Bar inside paper */}
                          <div className="flex items-center justify-between pb-6 mb-8 border-b border-black/10 dark:border-white/10 opacity-75">
                            <div className="flex items-center gap-2">
                              <FileText className="w-5 h-5 text-orange-500" />
                              <span className="text-xs sm:text-sm font-bold tracking-wide uppercase">
                                {document.title || document.name}
                              </span>
                            </div>
                          </div>

                          {/* Interactive Canvas Overlay for Freehand Drawing & Erasing Notes */}
                          <canvas
                            ref={canvasRef}
                            width={800}
                            height={1100}
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerLeave={handlePointerUp}
                            className={`absolute inset-0 w-full h-full ${
                              activeTool === 'pen'
                                ? 'z-20 cursor-crosshair pointer-events-auto'
                                : activeTool === 'eraser'
                                ? 'z-10 cursor-pointer pointer-events-none'
                                : activeTool === 'note'
                                ? 'z-20 cursor-copy pointer-events-auto'
                                : 'z-0 pointer-events-none opacity-80'
                            }`}
                          />

                          {/* Eraser Cursor Circle Visual Indicator */}
                          {activeTool === 'eraser' && eraserPos && (
                            <div
                              className="absolute pointer-events-none rounded-full border-2 border-rose-500 bg-rose-500/20 z-40 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
                              style={{
                                left: `${eraserPos.x}px`,
                                top: `${eraserPos.y}px`,
                                width: '40px',
                                height: '40px',
                              }}
                            />
                          )}

                          {/* Sticky Notes Layer */}
                          {notes
                            .filter((n) => n.documentId === document.id && n.pageNumber === currentPage)
                            .map((note) => (
                              <StickyNoteCard
                                key={note.id}
                                note={note}
                                isEraserActive={activeTool === 'eraser'}
                                onUpdate={(updated) =>
                                  setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
                                }
                                onDelete={(id) => setNotes((prev) => prev.filter((n) => n.id !== id))}
                              />
                            ))}

                          {/* Document Text Page Body */}
                          <div 
                            onMouseUp={handleTextSelection}
                            onTouchEnd={handleTextSelection}
                            className="relative z-10 max-w-3xl mx-auto space-y-4 select-text px-2 w-full"
                          >
                            {paragraphs.length > 0 ? (
                              paragraphs.map((para, idx) => renderParagraphWithWords(para, idx, currentPage))
                            ) : (
                              <p className="text-center italic opacity-60 py-12">
                                Page content empty or loading PDF canvas...
                              </p>
                            )}
                          </div>

                          {/* Clear Page Freehand Drawing Notes */}
                          {annotations.some((a) => a.documentId === document.id && a.pageNumber === currentPage) && (
                            <div className="absolute bottom-4 end-4 z-30">
                              <button
                                onClick={() => {
                                  onClearPageAnnotations(currentPage);
                                }}
                                className="p-2.5 rounded-2xl bg-rose-500 text-white shadow-lg hover:bg-rose-600 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                                title="Clear freehand drawings on page"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>{t.clearDrawings}</span>
                              </button>
                            </div>
                          )}
                        </>
                      )}

                      {/* Page Footer Navigation */}
                      <div className="mt-6 md:mt-12 pt-3 md:pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-end text-xs font-medium opacity-60">
                        <span>{t.page} {currentPage}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Floating Pinch-Zoom Indicator & Reset Pill for Mobile */}
                {touchZoomScale > 1.05 && (
                  <div className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={() => {
                        setTouchZoomScale(1);
                        setTouchPan({ x: 0, y: 0 });
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/90 dark:bg-stone-100/90 text-white dark:text-stone-900 text-xs font-bold shadow-2xl backdrop-blur-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20 dark:border-black/20"
                      title="Tap to reset zoom"
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
                      <span>{Math.round(touchZoomScale * 100)}%</span>
                      <span className="opacity-60 text-[10px] uppercase font-semibold">· Tap to Reset</span>
                    </button>
                  </div>
                )}
              </div>
          </div>
        </div>
      )}

        {/* Side-by-Side, Bottom Stacked, or Fullscreen Notes Workspace */}
        {isNotesVisible && readerLayout !== 'top' && renderNotesWorkspace()}

        {/* Docked Right-Edge Tab handle when notes panel is collapsed/hidden */}
        {!isNotesVisible && (
          <div className="hidden md:block fixed end-0 top-1/2 -translate-y-1/2 z-50 animate-in fade-in slide-in-from-end-4">
            <button
              id="btn-reopen-notes-docked"
              onClick={() => setIsNotesVisible(true)}
              className="flex items-center gap-2 px-3 py-5 rounded-s-2xl rounded-e-none bg-[#222222] hover:bg-[#A4F5A6] text-[#EFF1EE] hover:text-[#222222] shadow-xl font-bold text-xs border-s-2 border-t-2 border-b-2 border-white/20 transition-all hover:-translate-x-2 group cursor-pointer"
              title="Click to open Understanding Notes"
            >
              <div className="flex flex-col items-center gap-2">
                <ChevronLeft className="w-4 h-4 text-[#A4F5A6] group-hover:text-[#222222] group-hover:-translate-x-1 transition-transform" />
                <PenTool className="w-4 h-4 text-[#A4F5A6] group-hover:text-[#222222]" />
                <span className="[writing-mode:vertical-lr] rotate-180 tracking-wider text-[11px] uppercase font-bold py-1">
                  Understanding Notes
                </span>
              </div>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
