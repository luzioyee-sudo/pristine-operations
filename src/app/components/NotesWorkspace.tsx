// @ts-nocheck
import { getTranslation } from '../utils/i18n';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  Copy,
  Check,
  Download,
  Trash2,
  BookOpen,
  Maximize2,
  Minimize2,
  FileText,
  Palette,
  CheckCircle2,
  PenTool,
  X,
  Settings,
  Columns,
  Rows,
  Type,
  FileCode,
  Layout,
  Sliders,
  Sparkle,
  PanelTop,
  PanelBottom,
  PanelRight,
  PanelRightOpen,
  EyeOff,
  Undo,
  Redo,
  Highlighter,
  Eraser
} from 'lucide-react';

export interface NoteSettings {
  fontFamily: 'sans' | 'serif' | 'mono' | 'handwriting' | 'dyslexic';
  fontSize: number; // in px
  lineHeight: number; // e.g. 1.6
  paperTheme: 'cream' | 'sepia' | 'white' | 'dark' | 'obsidian' | 'sage' | 'lavender';
  paddingSize: 'compact' | 'normal' | 'spacious';
  spellCheck: boolean;
  showWordCount: boolean;
  autoSaveMode: 'realtime' | 'manual';
}

interface NotesWorkspaceProps {
  settings?: any;
  globalSettings?: any;
  documentId?: string;
  documentTitle?: string;
  currentPage?: number;
  currentPageText?: string;
  targetLanguage?: string;
  onClose?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  layoutMode?: 'split' | 'split-wide' | 'top' | 'stacked' | 'notes-fullscreen' | 'hidden';
  onChangeLayoutMode?: (mode: 'split' | 'split-wide' | 'top' | 'stacked' | 'notes-fullscreen' | 'hidden') => void;
}

export const NotesWorkspace: React.FC<NotesWorkspaceProps> = ({ globalSettings, 
  documentId = 'general',
  documentTitle = 'My Reading Notes',
  currentPage = 1,
  currentPageText = '',
  targetLanguage = 'English',
  onClose,
  isExpanded = false,
  onToggleExpand,
  layoutMode = 'split',
  onChangeLayoutMode,
}) => {
  const t = getTranslation(globalSettings?.interfaceLanguage || 'English');
  const [activeTab, setActiveTab] = useState<'page' | 'document' | 'general'>('page');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);

  // Note Settings state with persistence
  const [settings, setSettings] = useState<NoteSettings>(() => {
    try {
      const saved = localStorage.getItem('linguist_notes_settings');
      return saved ? JSON.parse(saved) : {
        fontFamily: 'sans',
        fontSize: 15,
        lineHeight: 1.6,
        paperTheme: 'cream',
        paddingSize: 'normal',
        spellCheck: true,
        showWordCount: true,
        autoSaveMode: 'realtime',
      };
    } catch {
      return {
        fontFamily: 'sans',
        fontSize: 15,
        lineHeight: 1.6,
        paperTheme: 'cream',
        paddingSize: 'normal',
        spellCheck: true,
        showWordCount: true,
        autoSaveMode: 'realtime',
      };
    }
  });

  const updateSettings = (partial: Partial<NoteSettings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    try {
      localStorage.setItem('linguist_notes_settings', JSON.stringify(next));
    } catch (e) {
      console.error('Failed to save notes settings:', e);
    }
  };

  // Word & Character count stats
  const [stats, setStats] = useState({ words: 0, chars: 0, readingTime: 0 });
  
  // Storage keys based on doc & page
  const pageNoteKey = `note_page_${documentId}_p${currentPage}`;
  const docNoteKey = `note_doc_${documentId}`;
  const generalNoteKey = `note_general_scratchpad`;

  const [notesContent, setNotesContent] = useState<{ [key: string]: string }>(() => {
    try {
      const saved = localStorage.getItem('linguist_user_understanding_notes');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [copied, setCopied] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Formatting buttons active states
  const [activeState, setActiveState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    h1: false,
    h2: false,
    p: false,
    ul: false,
    ol: false,
    quote: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
  });

  // Active inline font family and font size state
  const [activeFontFamily, setActiveFontFamily] = useState<string>('sans');
  const [activeFontSize, setActiveFontSize] = useState<number | 'mixed'>(16);

  // Selection Range Retention Ref
  const savedRangeRef = useRef<Range | null>(null);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current) {
      const range = sel.getRangeAt(0);
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }
  };

  const restoreSelection = () => {
    if (savedRangeRef.current && editorRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
    }
  };

  const checkActiveFormats = () => {
    if (!editorRef.current) return;

    const sel = window.getSelection();
    if (!sel || !sel.anchorNode || !editorRef.current.contains(sel.anchorNode)) {
      return;
    }

    saveSelection();

    try {
      const isBold = document.queryCommandState('bold');
      const isItalic = document.queryCommandState('italic');
      const isUnderline = document.queryCommandState('underline');
      const isStrike = document.queryCommandState('strikeThrough');
      const isUl = document.queryCommandState('insertUnorderedList');
      const isOl = document.queryCommandState('insertOrderedList');
      const isLeft = document.queryCommandState('justifyLeft');
      const isCenter = document.queryCommandState('justifyCenter');
      const isRight = document.queryCommandState('justifyRight');

      // Traverse DOM tree for precise block format detection
      let currentNode: Node | null = sel.anchorNode;
      let isH1 = false;
      let isH2 = false;
      let isQuote = false;
      let isP = false;

      while (currentNode && currentNode !== editorRef.current) {
        if (currentNode.nodeType === Node.ELEMENT_NODE) {
          const tagName = (currentNode as HTMLElement).tagName.toLowerCase();
          if (tagName === 'h1') isH1 = true;
          if (tagName === 'h2') isH2 = true;
          if (tagName === 'blockquote') isQuote = true;
          if (tagName === 'p') isP = true;
        }
        currentNode = currentNode.parentNode;
      }

      if (!isH1 && !isH2 && !isQuote) {
        isP = true;
      }

      setActiveState({
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        strikethrough: isStrike,
        h1: isH1,
        h2: isH2,
        p: isP,
        ul: isUl,
        ol: isOl,
        quote: isQuote,
        alignLeft: isLeft,
        alignCenter: isCenter,
        alignRight: isRight,
      });

      // Detect Font Family and Font Size at current selection / caret
      let currentFontKey: string = settings.fontFamily || 'sans';
      let currentSizeVal: number | 'mixed' = settings.fontSize || 16;

      let elementNode: HTMLElement | null =
        sel.anchorNode.nodeType === Node.ELEMENT_NODE
          ? (sel.anchorNode as HTMLElement)
          : sel.anchorNode.parentElement;

      if (elementNode && editorRef.current.contains(elementNode)) {
        let foundFont = false;
        let foundSize = false;
        let curr: HTMLElement | null = elementNode;

        while (curr && curr !== editorRef.current) {
          if (!foundFont && curr.style.fontFamily) {
            const ff = curr.style.fontFamily.toLowerCase();
            if (ff.includes('cursive')) currentFontKey = 'handwriting';
            else if (ff.includes('mono')) currentFontKey = 'mono';
            else if (ff.includes('serif') && !ff.includes('sans')) currentFontKey = 'serif';
            else if (ff.includes('opendyslexic') || ff.includes('lexend')) currentFontKey = 'dyslexic';
            else if (ff.includes('sans')) currentFontKey = 'sans';
            foundFont = true;
          }
          if (!foundSize && curr.style.fontSize) {
            const parsed = parseInt(curr.style.fontSize, 10);
            if (!isNaN(parsed)) {
              currentSizeVal = parsed;
              foundSize = true;
            }
          }
          curr = curr.parentElement;
        }

        if (!foundFont || !foundSize) {
          const comp = window.getComputedStyle(elementNode);
          if (!foundFont) {
            const ff = comp.fontFamily.toLowerCase();
            if (ff.includes('cursive')) currentFontKey = 'handwriting';
            else if (ff.includes('mono')) currentFontKey = 'mono';
            else if (ff.includes('serif') && !ff.includes('sans')) currentFontKey = 'serif';
            else if (ff.includes('opendyslexic') || ff.includes('lexend')) currentFontKey = 'dyslexic';
            else currentFontKey = 'sans';
          }
          if (!foundSize) {
            const parsed = parseInt(comp.fontSize, 10);
            if (!isNaN(parsed)) currentSizeVal = parsed;
          }
        }
      }

      if (!sel.isCollapsed && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        const container = range.commonAncestorContainer;
        if (container.nodeType === Node.ELEMENT_NODE) {
          const spans = (container as HTMLElement).querySelectorAll('span[style]');
          let fontDiff = false;
          let sizeDiff = false;
          let prevFont: string | null = null;
          let prevSize: string | null = null;

          spans.forEach((span) => {
            if (range.intersectsNode(span)) {
              const el = span as HTMLElement;
              if (el.style.fontFamily) {
                if (prevFont === null) prevFont = el.style.fontFamily;
                else if (prevFont !== el.style.fontFamily) fontDiff = true;
              }
              if (el.style.fontSize) {
                if (prevSize === null) prevSize = el.style.fontSize;
                else if (prevSize !== el.style.fontSize) sizeDiff = true;
              }
            }
          });

          if (fontDiff) currentFontKey = 'mixed';
          if (sizeDiff) currentSizeVal = 'mixed';
        }
      }

      setActiveFontFamily(currentFontKey);
      setActiveFontSize(currentSizeVal);
    } catch (e) {
      // ignore queryCommandState errors
    }
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      if (!editorRef.current) return;
      const sel = window.getSelection();
      if (sel && sel.anchorNode && editorRef.current.contains(sel.anchorNode)) {
        checkActiveFormats();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  // Active note storage key
  const currentKey =
    activeTab === 'page'
      ? pageNoteKey
      : activeTab === 'document'
      ? docNoteKey
      : generalNoteKey;

  // Initialize or load content when tab or page changes
  useEffect(() => {
    const currentHTML = notesContent[currentKey] || getDefaultTemplate(activeTab);
    if (editorRef.current) {
      editorRef.current.innerHTML = currentHTML;
      updateTextStats();
    }
  }, [currentKey, activeTab]);

  // Update stats on content change
  const updateTextStats = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const cleanText = text.trim();
    const words = cleanText ? cleanText.split(/\s+/).length : 0;
    const chars = cleanText.length;
    const readingTime = Math.ceil(words / 200); // 200 wpm
    setStats({ words, chars, readingTime });
  };

  // Default templates for quick starting
  function getDefaultTemplate(tab: 'page' | 'document' | 'general'): string {
    if (tab === 'page') {
      return `<h3><strong>Page ${currentPage} Understanding & Notes</strong></h3><p>Write what you understood from page ${currentPage} here...</p><ul><li><strong>Main Idea:</strong> </li><li><strong>Key Takeaway:</strong> </li></ul>`;
    }
    if (tab === 'document') {
      return `2<h2><strong>${documentTitle} - Overall Summary</strong></h2><p>Synthesize your key insights and chapter notes across the entire reading...</p>`;
    }
    return `<h3><strong>Personal Reflection Scratchpad</strong></h3><p>Type your thoughts, translations, and questions freely...</p>`;
  }

  // Save content to localStorage
  const handleContentChange = () => {
    if (!editorRef.current) return;
    updateTextStats();
    if (settings.autoSaveMode === 'manual') return;

    const html = editorRef.current.innerHTML;
    const updated = { ...notesContent, [currentKey]: html };
    setNotesContent(updated);
    try {
      localStorage.setItem('linguist_user_understanding_notes', JSON.stringify(updated));
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 2000);
    } catch (e) {
      console.error('Failed to save notes:', e);
    }
  };

  const forceManualSave = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const updated = { ...notesContent, [currentKey]: html };
    setNotesContent(updated);
    try {
      localStorage.setItem('linguist_user_understanding_notes', JSON.stringify(updated));
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 2000);
    } catch (e) {
      console.error('Failed to save notes:', e);
    }
  };

  // Font Family and Font Size application helpers
  const fontCSSMap: Record<string, string> = {
    sans: 'sans-serif',
    serif: 'serif',
    mono: 'monospace',
    handwriting: 'cursive',
    dyslexic: 'OpenDyslexic, Lexend, sans-serif'
  };

  const applyStyleToSelectionOrCaret = (styleProperty: 'fontFamily' | 'fontSize', styleValue: string) => {
    if (!editorRef.current) return;

    if (document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    restoreSelection();

    let sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editorRef.current.contains(sel.getRangeAt(0).commonAncestorContainer)) {
      // If caret is not inside the editor, place caret at the end of editor
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }

    sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);

    if (!sel.isCollapsed) {
      // Text IS selected: apply style to selected range
      try {
        const span = document.createElement('span');
        if (styleProperty === 'fontFamily') {
          span.style.fontFamily = styleValue;
        } else if (styleProperty === 'fontSize') {
          span.style.fontSize = styleValue;
        }

        const fragment = range.extractContents();
        // Clear conflicting inner style overrides on children so new wrapper style applies cleanly
        const children = fragment.querySelectorAll('*');
        children.forEach((child) => {
          if (child instanceof HTMLElement) {
            if (styleProperty === 'fontFamily') child.style.fontFamily = '';
            if (styleProperty === 'fontSize') child.style.fontSize = '';
          }
        });

        span.appendChild(fragment);
        range.insertNode(span);

        // Reselect wrapped contents so user can see it selected
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        sel.removeAllRanges();
        sel.addRange(newRange);
      } catch (e) {
        console.error('Failed applying style to selection range:', e);
      }
    } else {
      // Text IS NOT selected (caret position before typing):
      try {
        const parentEl = range.startContainer.parentElement;
        if (
          parentEl &&
          parentEl.tagName.toLowerCase() === 'span' &&
          editorRef.current.contains(parentEl) &&
          (parentEl.textContent === '\u200B' || parentEl.textContent === '')
        ) {
          if (styleProperty === 'fontFamily') parentEl.style.fontFamily = styleValue;
          if (styleProperty === 'fontSize') parentEl.style.fontSize = styleValue;
        } else {
          const span = document.createElement('span');
          if (styleProperty === 'fontFamily') {
            span.style.fontFamily = styleValue;
          } else if (styleProperty === 'fontSize') {
            span.style.fontSize = styleValue;
          }
          const zeroWidthSpace = document.createTextNode('\u200B');
          span.appendChild(zeroWidthSpace);
          range.insertNode(span);

          // Place caret inside the span directly after zero-width space
          const newRange = document.createRange();
          newRange.setStart(zeroWidthSpace, 1);
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);
        }
      } catch (e) {
        console.error('Failed applying style at caret position:', e);
      }
    }

    saveSelection();
    handleContentChange();
    setTimeout(checkActiveFormats, 20);
  };

  const applyFontFamily = (fontKey: NoteSettings['fontFamily']) => {
    setActiveFontFamily(fontKey);
    const cssFont = fontCSSMap[fontKey] || 'sans-serif';
    applyStyleToSelectionOrCaret('fontFamily', cssFont);
  };

  const applyFontSize = (sizePx: number) => {
    setActiveFontSize(sizePx);
    applyStyleToSelectionOrCaret('fontSize', `${sizePx}px`);
  };

  // Rich Text Format Execution with selection restoration & fallback handling
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (!editorRef.current) return;

    if (document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    restoreSelection();

    try {
      if (command === 'formatBlock') {
        const sel = window.getSelection();
        let currentNode: Node | null = sel?.anchorNode || null;
        let currentTag = '';
        while (currentNode && currentNode !== editorRef.current) {
          if (currentNode.nodeType === Node.ELEMENT_NODE) {
            const tag = (currentNode as HTMLElement).tagName.toLowerCase();
            if (['h1', 'h2', 'blockquote', 'p'].includes(tag)) {
              currentTag = tag;
              break;
            }
          }
          currentNode = currentNode.parentNode;
        }

        const targetTag = (value || '').replace(/[<>]/g, '').toLowerCase();

        if (currentTag === targetTag && targetTag !== 'p') {
          document.execCommand('formatBlock', false, '<p>');
        } else {
          let ok = document.execCommand('formatBlock', false, value);
          if (!ok && value) {
            document.execCommand('formatBlock', false, targetTag);
          }
        }
      } else if (command === 'hiliteColor') {
        let ok = document.execCommand('hiliteColor', false, value);
        if (!ok) {
          document.execCommand('backColor', false, value);
        }
      } else {
        document.execCommand(command, false, value);
      }
    } catch (err) {
      console.error('Failed to execute command', command, err);
    }

    saveSelection();
    handleContentChange();
    setTimeout(checkActiveFormats, 20);
  };

  // Copy Notes to Clipboard
  const handleCopy = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export Notes as Text File or HTML
  const handleExport = (format: 'txt' | 'html' = 'txt') => {
    if (!editorRef.current) return;
    let content = editorRef.current.innerText;
    let mime = 'text/plain;charset=utf-8';
    let ext = 'txt';

    if (format === 'html') {
      content = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${documentTitle} Notes</title><style>body{font-family:sans-serif;padding:40px;max-width:800px;margin:auto;line-height:1.6;}</style></head><body>${editorRef.current.innerHTML}</body></html>`;
      mime = 'text/html;charset=utf-8';
      ext = 'html';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentTitle}_Notes_Page_${currentPage}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Clear current note area
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your notes for this view?')) {
      if (editorRef.current) {
        editorRef.current.innerHTML = '<p><br></p>';
        handleContentChange();
      }
    }
  };

  // AI Assistant: Generate Summary from Page
  const handleAiSummarizePage = async () => {
    if (!currentPageText.trim()) return;
    setIsAiProcessing(true);
    try {
      const response = await fetch('/api/explain-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentence: `Summarize the following reading text into 3 bullet points in ${targetLanguage}:\n\n"${currentPageText.slice(0, 1000)}"`,
          targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const text = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Invalid JSON from explain-sentence API. Output snippet:", text.substring(0, 100));
        throw new Error("Received non-JSON response from server");
      }
      if (data && data.explanation) {
        const summaryHtml = `<div style="background-color: rgba(174, 91, 52, 0.08); padding: 12px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid #334DAF;"><h4><strong>✨ AI Page ${currentPage} Insight:</strong></h4><p>${data.explanation}</p></div><br/>`;
        if (editorRef.current) {
          editorRef.current.innerHTML = summaryHtml + editorRef.current.innerHTML;
          handleContentChange();
        }
      }
    } catch (e) {
      console.error('AI summary failed:', e);
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Quick Template insertion
  const insertTemplate = (templateType: string) => {
    if (!editorRef.current) return;
    let html = '';
    if (templateType === 'takeaways') {
      html = `<h4><strong>Key Understandings:</strong></h4><ul><li>Point 1: </li><li>Point 2: </li><li>Point 3: </li></ul>`;
    } else if (templateType === 'vocab') {
      html = `<h4><strong>New Vocabulary & Expressions:</strong></h4><p>1. <strong>Word:</strong> Meaning & context</p><p>2. <strong>Word:</strong> Meaning & context</p>`;
    } else if (templateType === 'cornell') {
      html = `
        <div style="border: 1px solid #E5E2D9; padding: 12px; border-radius: 12px; margin: 10px 0;">
          <h4><strong>Cornell Notes Layout</strong></h4>
          <p><strong>Cue / Questions:</strong> </p>
          <hr/>
          <p><strong>Detailed Notes:</strong> </p>
          <hr/>
          <p><strong>Summary:</strong> </p>
        </div>
      `;
    } else if (templateType === 'question') {
      html = `<h4><strong>Questions & Reflections:</strong></h4><p>❓ <strong>What I wondered:</strong> </p><p>💡 <strong>My interpretation:</strong> </p>`;
    }
    editorRef.current.innerHTML += html;
    handleContentChange();
  };

  // Paper Theme styling map
  const paperThemeStyles = {
    cream: 'bg-[#F9F7F2] text-[#2D3027] border-[#E5E2D9]',
    sepia: 'bg-[#F4ECD8] text-[#4A3B2C] border-[#E2D4B7]',
    white: 'bg-white text-[#1E2019] border-[#E5E2D9]',
    dark: 'bg-[#1A1D16] text-[#E5E2D9] border-stone-800',
    obsidian: 'bg-[#0F110D] text-[#D8D5CC] border-stone-900',
    sage: 'bg-[#EAF2EC] text-[#243828] border-[#C8E0CD]',
    lavender: 'bg-[#F3E8FF] text-[#3B2163] border-[#E0C6FF]',
  };

  // Font family map
  const fontFamilyStyles = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    handwriting: 'font-[Caveat,cursive,sans-serif]',
    dyslexic: 'font-[OpenDyslexic,Lexend,sans-serif]',
  };

  // Padding map
  const paddingStyles = {
    compact: 'p-3 sm:p-4',
    normal: 'p-4 sm:p-6',
    spacious: 'p-6 sm:p-10',
  };

  return (
    <div
      id="understanding-notes-workspace"
      className={`hidden md:flex rounded-3xl border shadow-xl transition-all flex-col relative overflow-hidden ${
        paperThemeStyles[settings.paperTheme]
      } ${isExpanded ? 'fixed inset-4 z-50 shadow-2xl' : 'w-full h-full my-0 min-h-[420px]'}`}
    >
      {/* Workspace Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-t-3xl gap-2 text-xs">
        
        {/* Workspace Title Indicator */}
        <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wider uppercase opacity-60 select-none">
          <PenTool className="w-3 h-3" />
          <span>Workspace</span>
        </div>

        {/* Layout Switcher & Settings Button directly inside Notes Workspace */}
        <div className="flex items-center gap-1">
          
          {/* Quick Layout Mode Buttons */}
          {onChangeLayoutMode && (
            <div className="flex items-center gap-0.5 bg-black/5 dark:bg-white/10 p-0.5 rounded-lg me-1">
              <button
                onClick={() => onChangeLayoutMode('top')}
                className={`p-1 rounded-md text-[10px] font-medium transition-all cursor-pointer ${
                  layoutMode === 'top'
                    ? 'bg-[#334DAF] text-white shadow-2xs'
                    : 'opacity-60 hover:opacity-100'
                }`}
                title="Appear At Top (Above Reader)"
              >
                <PanelTop className="w-3 h-3" />
              </button>

              <button
                onClick={() => onChangeLayoutMode('split')}
                className={`p-1 rounded-md text-[10px] font-medium transition-all cursor-pointer ${
                  layoutMode === 'split'
                    ? 'bg-[#334DAF] text-white shadow-2xs'
                    : 'opacity-60 hover:opacity-100'
                }`}
                title="Side-by-Side Right Panel"
              >
                <PanelRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => onChangeLayoutMode('split-wide')}
                className={`p-1 rounded-md text-[10px] font-medium transition-all cursor-pointer ${
                  layoutMode === 'split-wide'
                    ? 'bg-[#334DAF] text-white shadow-2xs'
                    : 'opacity-60 hover:opacity-100'
                }`}
                title="Wider Than Reader (Wide Panel)"
              >
                <PanelRightOpen className="w-3 h-3" />
              </button>

              <button
                onClick={() => onChangeLayoutMode('stacked')}
                className={`p-1 rounded-md text-[10px] font-medium transition-all cursor-pointer ${
                  layoutMode === 'stacked'
                    ? 'bg-[#334DAF] text-white shadow-2xs'
                    : 'opacity-60 hover:opacity-100'
                }`}
                title="Appear At Bottom (Below Reader)"
              >
                <PanelBottom className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* ⚙️ Notes Custom Settings Trigger */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
            title="Notes Customization Settings (Fonts, Themes, Auto-save)"
          >
            <Settings className="w-3 h-3 text-[#334DAF] dark:text-emerald-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Expand / Fullscreen Mode */}
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/20 transition-colors opacity-70 hover:opacity-100"
              title={isExpanded ? "Restore Normal Size" : "Fullscreen Focus Editor"}
            >
              {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
          )}

          {/* Close Panel */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-rose-500 hover:text-white transition-colors text-rose-500 opacity-80 hover:opacity-100"
              title="Hide Notes Panel"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Typing & Formatting Tools Bar */}
      <div id="typing-toolbar" className="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-x-auto no-scrollbar text-xs">
        
        {/* Formatting Actions */}
        <div className="flex items-center gap-0.5 shrink-0">
          
          {/* Undo / Redo */}
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('undo')}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 opacity-75 hover:opacity-100 transition-all active:scale-95"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>

          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('redo')}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 opacity-75 hover:opacity-100 transition-all active:scale-95"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 mx-1" />

          {/* Basic Text Formatting */}
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('bold')}
            className={`p-1.5 rounded-lg transition-all active:scale-95 ${
              activeState.bold
                ? 'bg-[#C78F77] text-white font-bold shadow-2xs'
                : 'hover:bg-black/10 dark:hover:bg-white/10 opacity-75 hover:opacity-100'
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('italic')}
            className={`p-1.5 rounded-lg transition-all active:scale-95 ${
              activeState.italic
                ? 'bg-[#C78F77] text-white font-bold shadow-2xs'
                : 'hover:bg-black/10 dark:hover:bg-white/10 opacity-75 hover:opacity-100'
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('underline')}
            className={`p-1.5 rounded-lg transition-all active:scale-95 ${
              activeState.underline
                ? 'bg-[#C78F77] text-white font-bold shadow-2xs'
                : 'hover:bg-black/10 dark:hover:bg-white/10 opacity-75 hover:opacity-100'
            }`}
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('strikeThrough')}
            className={`p-1.5 rounded-lg transition-all active:scale-95 ${
              activeState.strikethrough
                ? 'bg-[#C78F77] text-white font-bold shadow-2xs'
                : 'hover:bg-black/10 dark:hover:bg-white/10 opacity-75 hover:opacity-100'
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 mx-1" />

          {/* Font Type (Font Family) Dropdown */}
          <select
            value={activeFontFamily}
            onChange={(e) => {
              if (e.target.value !== 'mixed') {
                applyFontFamily(e.target.value as NoteSettings['fontFamily']);
              }
            }}
            className="bg-black/5 dark:bg-white/10 text-black dark:text-white text-[11px] font-medium rounded-lg px-2 py-1 outline-none border border-black/10 dark:border-white/10 cursor-pointer hover:bg-black/10 dark:hover:bg-white/20 transition-all shrink-0"
            title="Font Type / Family"
          >
            {activeFontFamily === 'mixed' && (
              <option value="mixed" disabled className="bg-white dark:bg-zinc-800 text-black dark:text-white italic">
                — Mixed —
              </option>
            )}
            <option value="sans" className="bg-white dark:bg-zinc-800 text-black dark:text-white">Sans-Serif</option>
            <option value="serif" className="bg-white dark:bg-zinc-800 text-black dark:text-white">Serif</option>
            <option value="mono" className="bg-white dark:bg-zinc-800 text-black dark:text-white">Monospace</option>
            <option value="handwriting" className="bg-white dark:bg-zinc-800 text-black dark:text-white">Handwriting</option>
            <option value="dyslexic" className="bg-white dark:bg-zinc-800 text-black dark:text-white">Dyslexic</option>
          </select>

          {/* Font Size Selector */}
          <div className="flex items-center gap-0.5 bg-black/5 dark:bg-white/10 rounded-lg p-0.5 border border-black/10 dark:border-white/10 shrink-0">
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                const cur = typeof activeFontSize === 'number' ? activeFontSize : 16;
                applyFontSize(Math.max(10, cur - 1));
              }}
              className="px-1.5 py-0.5 text-[11px] font-bold hover:bg-black/10 dark:hover:bg-white/20 rounded transition-colors"
              title="Decrease Font Size"
            >
              -
            </button>
            <select
              value={activeFontSize === 'mixed' ? 'mixed' : activeFontSize}
              onChange={(e) => {
                if (e.target.value !== 'mixed') {
                  applyFontSize(Number(e.target.value));
                }
              }}
              className="bg-transparent text-black dark:text-white text-[11px] font-bold px-1 py-0.5 outline-none cursor-pointer text-center"
              title="Font Size (px)"
            >
              {activeFontSize === 'mixed' && (
                <option value="mixed" disabled className="bg-white dark:bg-zinc-800 text-black dark:text-white italic">
                  Mixed
                </option>
              )}
              {[11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48].map((sz) => (
                <option key={sz} value={sz} className="bg-white dark:bg-zinc-800 text-black dark:text-white">
                  {sz}px
                </option>
              ))}
            </select>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                const cur = typeof activeFontSize === 'number' ? activeFontSize : 16;
                applyFontSize(Math.min(48, cur + 1));
              }}
              className="px-1.5 py-0.5 text-[11px] font-bold hover:bg-black/10 dark:hover:bg-white/20 rounded transition-colors"
              title="Increase Font Size"
            >
              +
            </button>
          </div>

          <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 mx-1" />

          {/* Lists */}
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('insertUnorderedList')}
            className={`p-1.5 rounded-lg transition-all active:scale-95 ${
              activeState.ul
                ? 'bg-[#C78F77] text-white font-bold shadow-2xs'
                : 'hover:bg-black/10 dark:hover:bg-white/10 opacity-75 hover:opacity-100'
            }`}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('insertOrderedList')}
            className={`p-1.5 rounded-lg transition-all active:scale-95 ${
              activeState.ol
                ? 'bg-[#C78F77] text-white font-bold shadow-2xs'
                : 'hover:bg-black/10 dark:hover:bg-white/10 opacity-75 hover:opacity-100'
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('formatBlock', '<blockquote>')}
            className={`p-1.5 rounded-lg transition-all active:scale-95 ${
              activeState.quote
                ? 'bg-[#C78F77] text-white font-bold shadow-2xs'
                : 'hover:bg-black/10 dark:hover:bg-white/10 opacity-75 hover:opacity-100'
            }`}
            title="Quote Block"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 mx-1" />

          {/* Text Alignment */}
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('justifyLeft')}
            className={`p-1.5 rounded-lg transition-all active:scale-95 ${
              activeState.alignLeft
                ? 'bg-[#C78F77] text-white font-bold shadow-2xs'
                : 'hover:bg-black/10 dark:hover:bg-white/10 opacity-75 hover:opacity-100'
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('justifyCenter')}
            className={`p-1.5 rounded-lg transition-all active:scale-95 ${
              activeState.alignCenter
                ? 'bg-[#C78F77] text-white font-bold shadow-2xs'
                : 'hover:bg-black/10 dark:hover:bg-white/10 opacity-75 hover:opacity-100'
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>

          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('justifyRight')}
            className={`p-1.5 rounded-lg transition-all active:scale-95 ${
              activeState.alignRight
                ? 'bg-[#C78F77] text-white font-bold shadow-2xs'
                : 'hover:bg-black/10 dark:hover:bg-white/10 opacity-75 hover:opacity-100'
            }`}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 mx-1" />

          {/* Preset Text Colors */}
          <div className="flex items-center gap-1" title="Text Color">
            <span className="text-[10px] font-bold opacity-60 me-0.5">Text:</span>
            {['#334DAF', '#A68A64', '#D67D6D', '#2B6CB0', '#2F855A', '#805AD5', '#1E2019'].map((color) => (
              <button
                key={color}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => executeCommand('foreColor', color)}
                style={{ backgroundColor: color }}
                className="w-3.5 h-3.5 rounded-full hover:scale-125 transition-transform border border-black/20"
                title={`Text Color ${color}`}
              />
            ))}
          </div>

          <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 mx-1" />

          {/* Highlight Background Colors */}
          <div className="flex items-center gap-1" title="Highlight Color">
            <Highlighter className="w-3 h-3 opacity-60" />
            {[
              { label: 'Yellow', color: '#FEF08A' },
              { label: 'Green', color: '#BBF7D0' },
              { label: 'Blue', color: '#BFDBFE' },
              { label: 'Pink', color: '#FBCFE8' },
              { label: 'Orange', color: '#FED7AA' },
            ].map((item) => (
              <button
                key={item.color}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => executeCommand('hiliteColor', item.color)}
                style={{ backgroundColor: item.color }}
                className="w-3.5 h-3.5 rounded-xs hover:scale-125 transition-transform border border-black/20"
                title={`${item.label} Highlight`}
              />
            ))}
          </div>

          <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 mx-1" />

          {/* Clear Formatting */}
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('removeFormat')}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 opacity-75 hover:opacity-100 transition-all active:scale-95"
            title="Clear Selection Formatting"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Templates, AI & Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Quick Templates Dropdown Menu */}
          <div className="flex items-center gap-1">
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertTemplate('takeaways')}
              className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/10 text-[11px] font-semibold hover:bg-black/10 transition-colors"
              title="Insert key points template"
            >
              + Key Points
            </button>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertTemplate('vocab')}
              className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/10 text-[11px] font-semibold hover:bg-black/10 transition-colors"
              title="Insert vocabulary list"
            >
              + Vocab
            </button>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertTemplate('cornell')}
              className="hidden xl:block px-2 py-1 rounded-lg bg-black/5 dark:bg-white/10 text-[11px] font-semibold hover:bg-black/10 transition-colors"
              title="Insert Cornell Notes format"
            >
              + Cornell
            </button>
          </div>

          {/* AI Page Summarizer */}
          {currentPageText && (
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleAiSummarizePage}
              disabled={isAiProcessing}
              className="px-2.5 py-1 rounded-xl bg-[#334DAF] hover:bg-[#091F5C] text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
              title="AI auto-summarize page into notes"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAiProcessing ? 'animate-spin' : ''}`} />
              <span>{isAiProcessing ? 'Summarizing...' : 'AI Summary'}</span>
            </button>
          )}

          {/* Copy Note */}
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Copy Note Text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Download Note */}
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleExport('txt')}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Export .txt file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Clear Note */}
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            className="p-1.5 rounded-lg hover:bg-rose-500 hover:text-white text-rose-500 transition-colors"
            title="Clear Workspace"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>

      {/* Editable Rich Canvas Space */}
      <div className={`flex-1 min-h-[260px] overflow-y-auto transition-all ${paddingStyles[settings.paddingSize]}`}>
        <div
          ref={editorRef}
          contentEditable
          spellCheck={settings.spellCheck}
          onInput={handleContentChange}
          onKeyUp={checkActiveFormats}
          onMouseUp={checkActiveFormats}
          onFocus={checkActiveFormats}
          className={`w-full h-full min-h-[220px] outline-none ${fontFamilyStyles[settings.fontFamily]} focus:ring-0`}
          style={{
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight,
            minHeight: '220px',
          }}
          suppressContentEditableWarning={true}
        />
      </div>

      {/* Footer Stats & Status Bar */}
      <div className="px-4 py-2 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-between text-[11px] font-medium opacity-80 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span>{stats.words} Words</span>
          <span>•</span>
          <span>{stats.chars} Characters</span>
          <span>•</span>
          <span>~{stats.readingTime} min read</span>
        </div>

        <div className="flex items-center gap-3">
          {settings.autoSaveMode === 'manual' ? (
            <button
              onClick={forceManualSave}
              className="px-2 py-0.5 rounded bg-amber-500 text-white font-bold text-[10px]"
            >
              Save Now
            </button>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Auto-saving on type</span>
          )}

          <button
            onClick={() => setShowSettingsModal(true)}
            className="underline hover:opacity-100 transition-opacity"
          >
            Customize Font & Theme
          </button>
        </div>
      </div>

      {/* ⚙️ DETAILED NOTES SETTINGS MODAL / DRAWER */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-[#1A1D16] border border-[#D0E4FE] dark:border-stone-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-6 text-[#091F5C] dark:text-stone-100 max-h-[90vh] overflow-y-auto"
            >
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#D0E4FE] dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#334DAF]" />
                  <h3 className="text-lg font-bold">Notes Workspace Settings</h3>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. Paper Color Theme */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7E776E] dark:text-stone-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" /> Paper Theme & Background
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'cream', name: 'Cream Paper', bg: 'bg-[#FCFBF9]', text: 'text-[#091F5C]' },
                  { id: 'sepia', name: 'Sepia Warm', bg: 'bg-[#F4ECD8]', text: 'text-[#4A3B2C]' },
                  { id: 'white', name: 'Clean White', bg: 'bg-white', text: 'text-black' },
                  { id: 'sage', name: 'Sage Green', bg: 'bg-[#EAF2EC]', text: 'text-[#243828]' },
                  { id: 'lavender', name: 'Soft Lavender', bg: 'bg-[#F3E8FF]', text: 'text-[#3B2163]' },
                  { id: 'dark', name: 'Midnight', bg: 'bg-[#1A1D16]', text: 'text-white' },
                  { id: 'obsidian', name: 'Deep Obsidian', bg: 'bg-[#0F110D]', text: 'text-stone-300' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => updateSettings({ paperTheme: t.id as any })}
                    className={`p-2.5 rounded-2xl border text-xs font-bold text-center transition-all flex items-center justify-between cursor-pointer ${t.bg} ${t.text} ${
                      settings.paperTheme === t.id ? 'ring-2 ring-[#334DAF] border-transparent scale-105' : 'border-[#D0E4FE]'
                    }`}
                  >
                    <span>{t.name}</span>
                    {settings.paperTheme === t.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Font Style */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7E776E] dark:text-stone-400 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" /> Font Family
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'sans', name: 'Sans-Serif', sample: 'Clean modern' },
                  { id: 'serif', name: 'Serif Classic', sample: 'Book editorial' },
                  { id: 'mono', name: 'Monospace', sample: 'Code style' },
                  { id: 'handwriting', name: 'Handwritten', sample: 'Journal style' },
                  { id: 'dyslexic', name: 'OpenDyslexic', sample: 'High legibility' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => updateSettings({ fontFamily: f.id as any })}
                    className={`p-2.5 rounded-2xl border text-start transition-all cursor-pointer ${
                      settings.fontFamily === f.id
                        ? 'bg-[#334DAF] text-white border-transparent'
                        : 'bg-[#E8F2FE] dark:bg-stone-800/50 border-[#D0E4FE] dark:border-stone-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{f.name}</div>
                    <div className="text-[10px] opacity-70">{f.sample}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Font Size & Line Height */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="uppercase tracking-wider text-[#7E776E] dark:text-stone-400">Font Size</label>
                  <span>{settings.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="28"
                  value={settings.fontSize}
                  onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                  className="w-full accent-[#334DAF] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="uppercase tracking-wider text-[#7E776E] dark:text-stone-400">Line Spacing</label>
                  <span>{settings.lineHeight}x</span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="2.2"
                  step="0.1"
                  value={settings.lineHeight}
                  onChange={(e) => updateSettings({ lineHeight: parseFloat(e.target.value) })}
                  className="w-full accent-[#334DAF] cursor-pointer"
                />
              </div>
            </div>

            {/* 4. Padding & Layout Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7E776E] dark:text-stone-400">Margin Padding</label>
                <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl">
                  {['compact', 'normal', 'spacious'].map((p) => (
                    <button
                      key={p}
                      onClick={() => updateSettings({ paddingSize: p as any })}
                      className={`flex-1 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        settings.paddingSize === p ? 'bg-[#334DAF] text-white' : 'text-[#5D7BBE] dark:text-stone-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Mode Selection */}
              {onChangeLayoutMode && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7E776E] dark:text-stone-400">Panel Layout</label>
                  <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl">
                    <button
                      onClick={() => onChangeLayoutMode('split')}
                      className={`flex-1 py-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        layoutMode === 'split' ? 'bg-[#334DAF] text-white' : 'text-[#5D7BBE] dark:text-stone-300'
                      }`}
                    >
                      <Columns className="w-3 h-3" /> Right Panel
                    </button>
                    <button
                      onClick={() => onChangeLayoutMode('stacked')}
                      className={`flex-1 py-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        layoutMode === 'stacked' ? 'bg-[#334DAF] text-white' : 'text-[#5D7BBE] dark:text-stone-300'
                      }`}
                    >
                      <Rows className="w-3 h-3" /> Stacked
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Auto-save & Preferences */}
            <div className="pt-2 border-t border-[#D0E4FE] dark:border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold">Auto-Save on Typing</div>
                  <div className="text-[11px] text-[#7E776E]">Automatically persist notes to local browser storage</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoSaveMode === 'realtime'}
                  onChange={(e) => updateSettings({ autoSaveMode: e.target.checked ? 'realtime' : 'manual' })}
                  className="w-4 h-4 accent-[#334DAF] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold">Spell Check</div>
                  <div className="text-[11px] text-[#7E776E]">Enable native browser spellchecker red underline</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.spellCheck}
                  onChange={(e) => updateSettings({ spellCheck: e.target.checked })}
                  className="w-4 h-4 accent-[#334DAF] rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Save & Done button */}
            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-3 rounded-2xl bg-[#334DAF] hover:bg-[#091F5C] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Apply Notes Settings
            </button>

          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
