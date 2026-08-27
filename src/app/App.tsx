// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, 
  Deck, 
  VocabularyItem, 
  DocumentFile, 
  Highlight, 
  FreehandAnnotation, 
  StickyNoteAnnotation, 
  ReaderSettings, 
  UserStats,
  UserAccount,
  QuizHistory
} from './types';
import { INITIAL_FOLDERS, INITIAL_DECKS, INITIAL_VOCABULARY } from './utils/sampleDocs';
import { storage, defaultSettings, defaultUserStats } from './utils/storage';
import { getLocalDateString, calculateStreak } from './utils/stats';
import { activityTracker, trackSectionTime } from './utils/activityTracker';
import { tracker, useTrackScrollMilestones } from './utils/tracker';

// Components
import { Header } from './components/Header';
import { DualFlagLanguageSelector, FlagIcon, LANGUAGE_OPTIONS } from './components/DualFlagLanguageSelector';
import { HomeView } from './components/HomeView';
import { MyLearningView } from './components/MyLearningView';
import { LibraryShelf } from './components/LibraryShelf';
import { PdfReader } from './components/PdfReader';
import { OnboardingView } from './components/OnboardingView';
import { StudyView } from './components/StudyView';
import { DecksView } from './components/DecksView';
import { SingleDeckView } from './components/SingleDeckView';
import { DictionaryView } from './components/DictionaryView';
import { PracticeView } from './components/PracticeView';
import { QuizzesView } from './components/QuizzesView';
import { SavedWordsView } from './components/SavedWordsView';
import { CreateFlashcardModal } from './components/CreateFlashcardModal';
import { SettingsModal } from './components/SettingsModal';
import { UploadModal } from './components/UploadModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginGate } from './components/AdminLoginGate';
import { WordModal } from './components/WordModal';
import { FlashcardsView } from './components/FlashcardsView';
import { BrowseCardsView } from './components/BrowseCardsView';
import { QuickSearchModal } from './components/QuickSearchModal';
import { LockScreen } from './components/LockScreen';
import { BlockedScreen } from './components/BlockedScreen';
import { AllToolsView } from './components/AllToolsView';
import { WritingView } from './components/WritingView';
import { LandingPageView } from './components/LandingPageView';
import { NotificationCenter } from './components/NotificationCenter';
import { OfflineSyncBanner } from './components/OfflineSyncBanner';
import { offlineSyncManager } from './utils/offlineSyncQueue';
import { AdRenderer } from './components/AdRenderer';
import { notificationManager } from './utils/notificationManager';
import { Home, LayoutGrid, User, Search, ArrowLeft, BookMarked, Globe, ChevronDown, Check, BookOpen, Bell, SlidersHorizontal, X, MessageSquare, Settings, Layers, GraduationCap } from 'lucide-react';
import { VideoPlayerView } from './components/VideoPlayerView';
import { AppView } from './types';
import { getTranslation } from './utils/i18n';
import { getEffectiveAvatar } from './utils/defaultAvatars';
import { sanitizeForBackend } from './utils/sanitize';
import {
  getSupabase,
  syncToSupabase,
  fetchFromSupabase,
  onSupabaseAuthStateChange,
  subscribeToSupabaseProgress,
  signOutFromSupabase,
} from './lib/supabase';
import { UserActivityLogger } from './utils/userActivityLogger';


// Main Application Wrapper Component
// Handles:
// 1. Supabase Authentication state and multi-account switching
// 2. Global state management (documents, vocabulary, folders, settings)
// 3. Cloud synchronization logic with Supabase Postgres
// 4. View routing between different modules (Reader, Study, Admin, etc.)
// Helper function to merge array records by ID so no user items are ever lost across sessions
function mergeArraysById<T extends { id?: string }>(primary: T[], secondary: T[]): T[] {
  const map = new Map<string, T>();
  if (Array.isArray(primary)) {
    primary.forEach((item, index) => {
      if (item) {
        const itemId = item.id || `p-${index}`;
        map.set(itemId, item);
      }
    });
  }
  if (Array.isArray(secondary)) {
    secondary.forEach((item, index) => {
      if (item) {
        const itemId = item.id || `s-${index}`;
        if (!map.has(itemId)) {
          map.set(itemId, item);
        }
      }
    });
  }
  return Array.from(map.values());
}

export default function App() {
  // Global View Navigation: 'home' | 'reader' | 'flashcards' | 'features' | 'settings' | 'flashcards-view'
  const [activeView, setActiveView] = useState<AppView>(() => {
    const pathname = window.location.pathname;
    if (
      pathname === '/admin' || 
      pathname === '/admin-dashboard' || 
      pathname === '/dashboard' ||
      window.location.hash === '#admin' || 
      window.location.hash === '#admin-dashboard'
    ) {
      return 'admin-dashboard';
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'admin' || params.get('view') === 'admin-dashboard') {
      return 'admin-dashboard';
    }
    
    // Default to landing page if root path with no specific hash
    if (!window.location.hash && (pathname === '/' || pathname === '/index.html')) {
      return 'landing';
    }
    
    return 'home';
  });

  // Sidebar appearance & upper control bar states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState<boolean>(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
  const [initialSettingsTab, setInitialSettingsTab] = useState<string | undefined>(undefined);
  const [isTopLangDropdownOpen, setIsTopLangDropdownOpen] = useState<boolean>(false);
  const [viewHistory, setViewHistory] = useState<AppView[]>(['home']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const handleNavigateWithHistory = (newView: AppView) => {
    if (newView !== activeView) {
      const nextHistory = viewHistory.slice(0, historyIndex + 1);
      nextHistory.push(newView);
      setViewHistory(nextHistory);
      setHistoryIndex(nextHistory.length - 1);
      setActiveView(newView);
    }
  };

  const handleNavigateBack = () => {
    if (activeView === 'reader' && activeDocument) {
      setActiveDocument(null);
      return;
    }
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setActiveView(viewHistory[prevIndex]);
    } else {
      setActiveView('home');
    }
  };

  const getViewTitle = (view: AppView) => {
    switch (view) {
      case 'all-tools': return 'All Tools';
      case 'reader': return activeDocument ? activeDocument.title || 'Reader Document' : 'Bilingual Reader';
      case 'flashcards':
      case 'flashcards-view': return 'Flashcards SRS';
      case 'dictionary': return 'Dictionary';
      case 'practice': return 'Practice Hub';
      case 'video': return 'Video Player';
      case 'settings': return 'Settings & Account';
      case 'admin-dashboard': return 'Admin Dashboard';
      default: return '';
    }
  };

  const handleNavigateForward = () => {
    if (activeView === 'reader' && activeDocument) {
      const totalPages = activeDocument.totalPages || 1;
      const current = activeDocument.currentPage || 1;
      if (current < totalPages) {
        const updatedDoc = { ...activeDocument, currentPage: current + 1 };
        setActiveDocument(updatedDoc);
        setDocuments(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
        return;
      }
    }
    if (historyIndex < viewHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setActiveView(viewHistory[historyIndex + 1]);
    }
  };

  // Keep state synchronized with location hash/path changes for seamless link routing
  useEffect(() => {
    const handleLocationChange = () => {
      const h = window.location.hash;
      const p = window.location.pathname;
      if (
        p === '/admin' || 
        p === '/admin-dashboard' || 
        p === '/dashboard' ||
        h === '#admin' || 
        h === '#admin-dashboard'
      ) {
        setActiveView('admin-dashboard');
      } else if (h === '#landing' || p === '/landing') {
        setActiveView('landing');
      } else if (h === '#home' || p === '/home') {
        setActiveView('home');
      } else if (h === '#reader' || p === '/reader') {
        setActiveView('reader');
      } else if (h === '#settings' || p === '/settings') {
        setActiveView('settings');
      } else if (h === '#flashcards-view' || p === '/flashcards-view') {
        setActiveView('flashcards-view');
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Update URL history when activeView changes so the URL is always copyable and bookmarkable
  useEffect(() => {
    const p = window.location.pathname;
    if (activeView === 'admin-dashboard') {
      if (p !== '/admin') {
        window.history.pushState(null, '', '/admin');
      }
    } else if (activeView === 'landing') {
      if (window.location.hash !== '') {
        window.history.pushState(null, '', '/');
      }
    } else {
      if (p === '/admin' || p === '/admin-dashboard' || p === '/dashboard') {
        window.history.pushState(null, '', '/home');
      } else {
        const targetHash = `#${activeView}`;
        if (window.location.hash !== targetHash) {
          window.history.pushState(null, '', targetHash);
        }
      }
    }
  }, [activeView]);
  
  // Auth State
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  
  // Secondary toggle inside flashcards page: 'study' | 'decks' | 'saved-words' | 'browse'
  const [flashcardsSubView, setFlashcardsSubView] = useState<'study' | 'decks' | 'saved-words' | 'browse'>('study');
  const [isFlashcardsSidebarOpen, setIsFlashcardsSidebarOpen] = useState<boolean>(false);

  // Onboarding & Global Config States
  const [settings, setSettings] = useState<ReaderSettings>(() => storage.getSettings());
  const [userStats, setUserStats] = useState<UserStats>(() => storage.getUserStats());

  // User Accounts & Switcher state
  const [activeUserId, setActiveUserId] = useState<string>(() => activityTracker.getCurrentUserId());
  const [allAccounts, setAllAccounts] = useState<UserAccount[]>(() => activityTracker.getUserAccounts());
  const loadedUserIdRef = React.useRef<string>(activeUserId);
  const loadedTargetLangRef = React.useRef<string>(settings.targetLanguage);

  const activeAccount = useMemo(() => {
    return allAccounts.find((a) => a.id === activeUserId) || allAccounts[0];
  }, [allAccounts, activeUserId]);

  // Password Lock Session State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    const initSettings = storage.getSettings();
    return !initSettings.isPasswordProtected;
  });

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Account Blocked State
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  // Sync blocked status with current active user account
  useEffect(() => {
    if (activeAccount?.status === 'Blocked') {
      setIsBlocked(true);
    } else {
      setIsBlocked(false);
    }
  }, [activeAccount]);

  // Enable passive scroll depth milestone analytics
  useTrackScrollMilestones();

  // Synchronize unread notifications and direct admin messages for current user
  useEffect(() => {
    const updateUnread = () => {
      const unread = notificationManager.getUnreadCount(activeUserId);
      setUnreadNotificationsCount(unread);
    };
    updateUnread();

    window.addEventListener('lingoflow_notifications_changed', updateUnread);
    window.addEventListener('storage', updateUnread);
    return () => {
      window.removeEventListener('lingoflow_notifications_changed', updateUnread);
      window.removeEventListener('storage', updateUnread);
    };
  }, [activeUserId]);

  // Persistent Bilingual Library & Annotations States
  const [documents, setDocuments] = useState<DocumentFile[]>(() => storage.getDocuments());
  const [activeDocument, setActiveDocument] = useState<DocumentFile | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>(() => storage.getHighlights());
  const [annotations, setAnnotations] = useState<FreehandAnnotation[]>(() => storage.getAnnotations());
  const [stickyNotes, setStickyNotes] = useState<StickyNoteAnnotation[]>(() => storage.getStickyNotes());

  // Persistent SRS Deck Organization States
  const [folders, setFolders] = useState<Folder[]>(() => {
    try {
      const saved = localStorage.getItem('lingoflow_folders');
      const list: Folder[] = saved ? JSON.parse(saved) : INITIAL_FOLDERS;
      return list.filter(f => f.id !== 'folder-spanish');
    } catch {
      return INITIAL_FOLDERS;
    }
  });

  const [decks, setDecks] = useState<Deck[]>(() => {
    try {
      const saved = localStorage.getItem('lingoflow_decks');
      const list: Deck[] = saved ? JSON.parse(saved) : INITIAL_DECKS;
      return list.filter(d => d.id !== 'deck-hello' && d.id !== 'deck-new');
    } catch {
      return INITIAL_DECKS;
    }
  });

  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(() => {
    const saved = storage.getVocabulary();
    return saved.filter(v => v.id !== 'card-hello-1' && v.id !== 'card-hello-2');
  });

  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>(() => storage.getQuizHistory());

  // Open tabs list and currently selected active deck tab ID
  const [openDecks, setOpenDecks] = useState<string[]>([]);
  const [activeDeckTabId, setActiveDeckTabId] = useState<string | null>(null);

  // Filters for study and deck views
  const [selectedStudyDeckId, setSelectedStudyDeckId] = useState<string | null>('all');
  const [selectedDecksFilterId, setSelectedDecksFilterId] = useState<string | null>('all');

  // Modals Toggles
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isCreateFlashcardOpen, setIsCreateFlashcardOpen] = useState<boolean>(false);
  const [editCard, setEditCard] = useState<VocabularyItem | null>(null);

  // Dynamic Word/Definition Popup States
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [wordData, setWordData] = useState<any>(null);
  const [isWordLoading, setIsWordLoading] = useState<boolean>(false);
  const [wordModalPosition, setWordModalPosition] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const [translationCache, setTranslationCache] = useState<Record<string, any>>({});

  // Sync Animation / Simulation
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'registered'>('idle');
  const snapshotUnsubRef = useRef<(() => void) | null>(null);

  // Synchronize registered accounts list and current active user ID from activityTracker/events
  useEffect(() => {
    const handleAccountsUpdated = () => {
      const updated = activityTracker.getUserAccounts();
      setAllAccounts(updated);
      const activeId = activityTracker.getCurrentUserId();
      setActiveUserId(activeId);
    };

    window.addEventListener('lingoflow_activity_updated', handleAccountsUpdated);
    window.addEventListener('storage', handleAccountsUpdated);

    return () => {
      window.removeEventListener('lingoflow_activity_updated', handleAccountsUpdated);
      window.removeEventListener('storage', handleAccountsUpdated);
    };
  }, []);

  // Synchronize active account details with the user state and onboarding settings
  useEffect(() => {
    const currentAccounts = activityTracker.getUserAccounts();
    let updated = false;

    // Find if the active account exists
    const accountIndex = currentAccounts.findIndex(a => a.id === activeUserId);
    
    const targetName = settings.userName || user?.name || '';
    const targetEmail = user?.email || settings.userEmail || '';
    const targetLang = settings.targetLanguage || 'English';

    // Only create or sync account if there is a real identity
    if (!targetName && !targetEmail && activeUserId === 'usr-1') {
      return;
    }

    const displayName = targetName || (targetEmail ? targetEmail.split('@')[0] : 'User');

    if (accountIndex !== -1) {
      const acc = currentAccounts[accountIndex];
      // Sync fields if they differ
      if (
        acc.name !== displayName ||
        acc.email !== targetEmail ||
        acc.targetLanguage !== targetLang ||
        !acc.role
      ) {
        currentAccounts[accountIndex] = {
          ...acc,
          name: displayName,
          email: targetEmail,
          targetLanguage: targetLang,
          role: acc.role || 'Student'
        };
        updated = true;
      }
    } else if (targetEmail || (targetName && targetName !== 'Primary Learner' && targetName !== 'Learner')) {
      // Create new real account entry
      const newAcc: UserAccount = {
        id: activeUserId,
        name: displayName,
        email: targetEmail,
        role: 'Student', // New users default to Student
        status: 'Active',
        joinedAt: new Date().toISOString().split('T')[0],
        wordsLearned: vocabulary.length,
        lastLogin: 'Just now',
        targetLanguage: targetLang,
        notes: 'Active user profile',
        totalTimeSpent: '0s',
        sessionCount: 1,
        activityLogs: []
      };
      currentAccounts.push(newAcc);
      updated = true;
    }

    if (updated) {
      activityTracker.saveUserAccounts(currentAccounts);
      setAllAccounts(currentAccounts);
    }
  }, [activeUserId, settings.userName, settings.targetLanguage, user, vocabulary.length]);

  // Reactively reload all user-specific states when the switched activeUserId or targetLanguage changes
  useEffect(() => {
    // Reload documents, vocabulary, highlights, annotations, stickyNotes, settings, and userStats
    const currentSettings = storage.getSettings(activeUserId);
    setSettings(currentSettings);
    
    const targetLang = currentSettings.targetLanguage || 'English';
    const cleanLang = targetLang.toLowerCase().trim();
    
    setUserStats(storage.getUserStats(activeUserId, targetLang));
    
    // Auto-cleanup leaks from race conditions
    // Process Documents
    const rawDocs = storage.getDocuments(activeUserId, targetLang);
    const validDocs = rawDocs.filter(d => !d.language || d.language.toLowerCase().trim() === cleanLang || d.language.toLowerCase().trim() === 'target').map(d => ({...d, language: d.language || targetLang}));
    setDocuments(validDocs);
    
    setHighlights(storage.getHighlights(activeUserId, targetLang));
    setAnnotations(storage.getAnnotations(activeUserId, targetLang));
    setStickyNotes(storage.getStickyNotes(activeUserId, targetLang));

    // Process Folders
    const rawFolders = storage.getFolders(activeUserId, targetLang);
    const validFolders = rawFolders.filter(f => !f.language || f.language.toLowerCase().trim() === cleanLang || f.language.toLowerCase().trim() === 'target').map(f => ({...f, language: f.language || targetLang}));
    setFolders(validFolders.length > 0 ? validFolders : INITIAL_FOLDERS.map(f => ({...f, language: f.language || targetLang})));

    // Process Decks
    const rawDecks = storage.getDecks(activeUserId, targetLang);
    const validDecks = rawDecks.filter(d => !d.language || d.language.toLowerCase().trim() === cleanLang || d.language.toLowerCase().trim() === 'target').map(d => ({...d, language: d.language || targetLang}));
    setDecks(validDecks.length > 0 ? validDecks : INITIAL_DECKS.map(d => ({...d, language: d.language || targetLang})));

    // Process Vocabulary
    const rawVocab = storage.getVocabulary(activeUserId, targetLang);
    const validVocab = rawVocab.filter(v => !v.language || v.language.toLowerCase().trim() === cleanLang || v.language.toLowerCase().trim() === 'target').map(v => ({...v, language: v.language || targetLang}));
    setVocabulary(validVocab);

    setQuizHistory(storage.getQuizHistory(activeUserId, targetLang));

    setActiveDocument(null);

    // Update loaded refs to match new state so subsequent updates save correctly
    loadedUserIdRef.current = activeUserId;
    loadedTargetLangRef.current = targetLang;

    // Synchronize current identity and language context with the centralized analytics tracker
    tracker.setUserId(activeUserId);
    tracker.setLanguageContext(targetLang, null);
  }, [activeUserId, settings.targetLanguage]);

  // Sync Progress Trigger
  useEffect(() => {
    let cancelled = false;
    let removeProgressSubscription: (() => void) | null = null;

    const resetToGuest = () => {
      if (removeProgressSubscription) {
        removeProgressSubscription();
        removeProgressSubscription = null;
      }
      setUser(null);
      activityTracker.setCurrentUserId('usr-1');
      setActiveUserId('usr-1');
      setIsBlocked(false);
      setSettings(storage.getSettings('usr-1'));
      setUserStats(storage.getUserStats('usr-1'));
      setDocuments(storage.getDocuments('usr-1'));
      setHighlights(storage.getHighlights('usr-1'));
      setAnnotations(storage.getAnnotations('usr-1'));
      setStickyNotes(storage.getStickyNotes('usr-1'));
      setVocabulary(storage.getVocabulary('usr-1'));
      setQuizHistory(storage.getQuizHistory('usr-1'));
      setFolders(INITIAL_FOLDERS);
      setDecks(INITIAL_DECKS);
    };

    const applySession = async (session: any) => {
      if (cancelled) return;
      const supabaseUser = session?.user || null;
      if (!supabaseUser) {
        resetToGuest();
        return;
      }

      const uid = supabaseUser.id;
      const email = supabaseUser.email || '';
      const displayName = supabaseUser.user_metadata?.full_name || email.split('@')[0] || 'User';
      setUser({ name: displayName, email });
      activityTracker.setCurrentUserId(uid);
      setActiveUserId(uid);

      const currentAccounts = activityTracker.getUserAccounts();
      const accountIndex = currentAccounts.findIndex((account) => account.id === uid);
      if (accountIndex === -1) {
        currentAccounts.push({
          id: uid,
          name: displayName,
          email,
          role: 'Student',
          status: 'Active',
          joinedAt: new Date().toISOString().split('T')[0],
          wordsLearned: vocabulary.length,
          lastLogin: 'Just now',
          targetLanguage: settings.targetLanguage || 'English',
          notes: 'Supabase account',
          totalTimeSpent: '0s',
          sessionCount: 1,
          activityLogs: [],
        });
      } else {
        currentAccounts[accountIndex] = {
          ...currentAccounts[accountIndex],
          lastLogin: 'Just now',
          email: email || currentAccounts[accountIndex].email,
        };
      }
      activityTracker.saveUserAccounts(currentAccounts);
      setAllAccounts(currentAccounts);

      setIsSyncing(true);
      try {
        const localDocs = storage.getDocuments(uid);
        const localVocab = storage.getVocabulary(uid);
        const localHighlights = storage.getHighlights(uid);
        const localAnnotations = storage.getAnnotations(uid);
        const localStickyNotes = storage.getStickyNotes(uid);
        const localFolders = storage.getFolders(uid);
        const localDecks = storage.getDecks(uid);
        const localSettings = storage.getSettings(uid);
        const localStats = storage.getUserStats(uid);
        const localQuizHistory = storage.getQuizHistory(uid);
        const cloudData = await fetchFromSupabase(uid);

        const mergedSettings = {
          ...defaultSettings,
          ...localSettings,
          ...(cloudData?.settings || {}),
          userEmail: email || localSettings.userEmail || '',
          userName: cloudData?.settings?.userName || localSettings.userName || displayName,
        };
        const mergedDocs = mergeArraysById(cloudData?.documents || [], localDocs);
        const mergedVocab = mergeArraysById(cloudData?.vocabulary || [], localVocab);
        const mergedHighlights = mergeArraysById(cloudData?.highlights || [], localHighlights);
        const mergedAnnotations = mergeArraysById(cloudData?.annotations || [], localAnnotations);
        const mergedStickyNotes = mergeArraysById(cloudData?.stickyNotes || [], localStickyNotes);
        const mergedFolders = (cloudData?.folders?.length ? cloudData.folders : localFolders.length ? localFolders : INITIAL_FOLDERS);
        const mergedDecks = (cloudData?.decks?.length ? cloudData.decks : localDecks.length ? localDecks : INITIAL_DECKS);
        const mergedStats = { ...defaultUserStats, ...localStats, ...(cloudData?.userStats || {}) };
        const mergedQuizHistory = mergeArraysById(cloudData?.quizHistory || [], localQuizHistory);

        setSettings(mergedSettings);
        setUserStats(mergedStats);
        setDocuments(mergedDocs);
        setHighlights(mergedHighlights);
        setAnnotations(mergedAnnotations);
        setStickyNotes(mergedStickyNotes);
        setFolders(mergedFolders);
        setDecks(mergedDecks);
        setVocabulary(mergedVocab);
        setQuizHistory(mergedQuizHistory);
        setIsBlocked(cloudData?.status === 'Blocked');

        storage.saveSettings(mergedSettings, uid);
        storage.saveUserStats(mergedStats, uid);
        storage.saveDocuments(mergedDocs, uid);
        storage.saveVocabulary(mergedVocab, uid);
        storage.saveHighlights(mergedHighlights, uid);
        storage.saveAnnotations(mergedAnnotations, uid);
        storage.saveStickyNotes(mergedStickyNotes, uid);
        storage.saveFolders(mergedFolders, uid);
        storage.saveDecks(mergedDecks, uid);
        storage.saveQuizHistory(mergedQuizHistory, uid);

        await syncToSupabase(uid, {
          id: uid,
          email,
          settings: mergedSettings,
          userStats: mergedStats,
          documents: mergedDocs,
          vocabulary: mergedVocab,
          highlights: mergedHighlights,
          annotations: mergedAnnotations,
          stickyNotes: mergedStickyNotes,
          folders: mergedFolders,
          decks: mergedDecks,
          quizHistory: mergedQuizHistory,
          lastSynced: Date.now(),
        });

        if (removeProgressSubscription) removeProgressSubscription();
        removeProgressSubscription = subscribeToSupabaseProgress(uid, (payload) => {
          if (cancelled) return;
          if (payload.settings) setSettings((previous) => ({ ...previous, ...payload.settings }));
          if (payload.userStats) setUserStats((previous) => ({ ...previous, ...payload.userStats }));
          if (Array.isArray(payload.documents)) setDocuments(payload.documents);
          if (Array.isArray(payload.vocabulary)) setVocabulary(payload.vocabulary);
          if (Array.isArray(payload.highlights)) setHighlights(payload.highlights);
          if (Array.isArray(payload.annotations)) setAnnotations(payload.annotations);
          if (Array.isArray(payload.stickyNotes)) setStickyNotes(payload.stickyNotes);
          if (Array.isArray(payload.folders)) setFolders(payload.folders);
          if (Array.isArray(payload.decks)) setDecks(payload.decks);
          if (Array.isArray(payload.quizHistory)) setQuizHistory(payload.quizHistory);
        });
      } catch (error) {
        console.warn('Supabase account sync notice:', error);
      } finally {
        if (!cancelled) setIsSyncing(false);
      }
    };

    const client = getSupabase();
    if (!client) {
      console.warn('Supabase is not configured; the app will remain in local guest mode.');
      resetToGuest();
      return () => undefined;
    }

    void client.auth.getSession().then(({ data }) => applySession(data.session));
    const authSubscription = onSupabaseAuthStateChange((_event, session) => {
      // Defer work outside Supabase's auth callback to avoid blocking token refresh.
      window.setTimeout(() => void applySession(session), 0);
    });

    return () => {
      cancelled = true;
      authSubscription.data.subscription.unsubscribe();
      if (removeProgressSubscription) removeProgressSubscription();
    };
  }, []);

  const syncToCloud = async () => {
    const client = getSupabase();
    if (!client || activeUserId === 'usr-1') return;
    const { data } = await client.auth.getUser();
    const currentUser = data.user;
    if (!currentUser) return;

    try {
      setSyncStatus('syncing');
      await syncToSupabase(currentUser.id, {
        id: currentUser.id,
        email: currentUser.email || settings.userEmail || '',
        settings,
        userStats,
        documents,
        highlights,
        annotations,
        stickyNotes,
        folders,
        decks,
        vocabulary,
        quizHistory,
        lastSynced: Date.now(),
      });
      setSyncStatus('registered');
    } catch (error) {
      console.error('Error syncing to Supabase:', error);
      setSyncStatus('idle');
    }
  };

  const handleRegisterSync = syncToCloud;

  // Persist edits to LocalStorage with user-specific keys and race-condition prevention
  useEffect(() => {
    if (activeUserId !== loadedUserIdRef.current || settings.targetLanguage !== loadedTargetLangRef.current) return;
    storage.saveFolders(folders, activeUserId, settings.targetLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folders]);

  useEffect(() => {
    if (activeUserId !== loadedUserIdRef.current || settings.targetLanguage !== loadedTargetLangRef.current) return;
    storage.saveDecks(decks, activeUserId, settings.targetLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decks]);

  useEffect(() => {
    if (activeUserId !== loadedUserIdRef.current || settings.targetLanguage !== loadedTargetLangRef.current) return;
    storage.saveVocabulary(vocabulary, activeUserId, settings.targetLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vocabulary]);

  useEffect(() => {
    if (activeUserId !== loadedUserIdRef.current || settings.targetLanguage !== loadedTargetLangRef.current) return;
    storage.saveQuizHistory(quizHistory, activeUserId, settings.targetLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizHistory]);

  useEffect(() => {
    if (activeUserId !== loadedUserIdRef.current || settings.targetLanguage !== loadedTargetLangRef.current) return;
    storage.saveDocuments(documents, activeUserId, settings.targetLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents]);

  useEffect(() => {
    if (activeUserId !== loadedUserIdRef.current || settings.targetLanguage !== loadedTargetLangRef.current) return;
    storage.saveHighlights(highlights, activeUserId, settings.targetLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlights]);

  useEffect(() => {
    if (activeUserId !== loadedUserIdRef.current || settings.targetLanguage !== loadedTargetLangRef.current) return;
    storage.saveAnnotations(annotations, activeUserId, settings.targetLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annotations]);

  useEffect(() => {
    if (activeUserId !== loadedUserIdRef.current || settings.targetLanguage !== loadedTargetLangRef.current) return;
    storage.saveStickyNotes(stickyNotes, activeUserId, settings.targetLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stickyNotes]);

  // Synchronize authenticated application state to Supabase Postgres with a debounce.
  useEffect(() => {
    if (isSyncing || activeUserId === 'usr-1' || activeUserId !== loadedUserIdRef.current) return;
    const syncTimeout = setTimeout(async () => {
      const client = getSupabase();
      if (!client) return;
      const { data } = await client.auth.getUser();
      if (!data.user) return;

      const sanitizedDocsForSync = documents.map((document) => {
        if (document.contentData && document.contentData.length > 100000) {
          const { contentData: _contentData, ...rest } = document;
          return rest;
        }
        return document;
      });

      await syncToSupabase(data.user.id, {
        id: data.user.id,
        email: data.user.email || settings.userEmail || '',
        settings,
        userStats,
        documents: sanitizedDocsForSync,
        vocabulary,
        highlights,
        annotations,
        stickyNotes,
        folders,
        decks,
        quizHistory,
        lastSynced: Date.now(),
      });
    }, 1500);
    return () => clearTimeout(syncTimeout);
  }, [vocabulary, documents, highlights, stickyNotes, userStats, settings, folders, decks, quizHistory, activeUserId, isSyncing]);

  // Synchronize dynamic dark/light CSS mode based on app settings
  useEffect(() => {
    const isDark = settings.appTheme === 'dark' || (settings.appTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.appTheme]);

  // Track active section and log real section transitions
  useEffect(() => {
    let sectionName: 'Bilingual Reader' | 'Flashcards SRS' | 'Library Shelf' | 'Admin Console' | 'Settings' | 'Onboarding' = 'Library Shelf';
    if (activeView === 'reader') sectionName = 'Bilingual Reader';
    else if (activeView === 'flashcards' || activeView === 'flashcards-view') sectionName = 'Flashcards SRS';
    else if (activeView === 'admin' as any) sectionName = 'Admin Console';
    else if (activeView === 'settings') sectionName = 'Settings';

    trackSectionTime(sectionName);

    // Track page views in the centralized event-tracking architecture
    tracker.trackEvent('page_viewed', 'navigation', {
      route: `#${activeView}`,
      page_name: sectionName,
    });
  }, [activeView]);

  // Track user actions for heatmap and streak calculation + real activity tracker
  const handleTrackUserActivity = (actionDesc?: string, section?: 'Bilingual Reader' | 'Flashcards SRS' | 'Library Shelf' | 'Admin Console' | 'Settings' | 'Onboarding') => {
    if (actionDesc) {
      activityTracker.logActivity(section || 'Library Shelf', actionDesc, 10, 'navigation');
    }

    setUserStats((prev) => {
      const todayStr = getLocalDateString(new Date());
      const currentActivity = (prev.activityHistory || {})[todayStr] || 0;
      const updatedHistory = {
        ...(prev.activityHistory || {}),
        [todayStr]: currentActivity + 1,
      };
      const streak = calculateStreak(updatedHistory, prev.dailyGoal || 10);
      const newStats = {
        ...prev,
        currentStreak: streak,
        lastActiveDate: Date.now(),
        activityHistory: updatedHistory,
      };
      storage.saveUserStats(newStats);
      return newStats;
    });
  };

  // Onboarding completion callback
  const handleOnboardingComplete = (
    name: string,
    language: string,
    authenticatedUserId?: string,
    authenticatedEmail?: string,
  ) => {
    const resolvedUserId = authenticatedUserId || activeUserId || activityTracker.getCurrentUserId();
    const resolvedEmail = authenticatedEmail || settings.userEmail || '';

    // Set the identity before saving so completion never lands in the guest profile.
    if (resolvedUserId && resolvedUserId !== 'usr-1') {
      activityTracker.setCurrentUserId(resolvedUserId);
      setActiveUserId(resolvedUserId);
    }

    const updated = {
      ...settings,
      hasCompletedOnboarding: true,
      userName: name,
      userEmail: resolvedEmail,
      targetLanguage: language,
      interfaceLanguage: language,
    };
    setSettings(updated);
    storage.saveSettings(updated, resolvedUserId);

    activityTracker.logActivity('Onboarding', `Completed initial onboarding. User: "${name}", Language: "${language}"`, 15, 'auth');

    setUserStats((prev) => {
      const streak = calculateStreak(prev.activityHistory || {}, prev.dailyGoal || 10);
      const newStats = {
        ...prev,
        currentStreak: streak,
        lastActiveDate: Date.now(),
      };
      storage.saveUserStats(newStats, resolvedUserId);
      return newStats;
    });
  };

  const handleUpdateSettings = (newSettings: Partial<ReaderSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      storage.saveSettings(updated);
      activityTracker.logSettingsChanged('Reader Settings', newSettings);
      return updated;
    });
  };

  const handleLogout = async () => {
    try {
      if (getSupabase()) {
        await signOutFromSupabase();
      }
    } catch (err) {
      console.error("Error signing out of Supabase:", err);
    }
    
    // Clear user and reset to default anonymous profile
    setUser(null);
    setActiveUserId('usr-1');
    activityTracker.setCurrentUserId('usr-1');
    localStorage.removeItem('lingoflow_current_user_id');
    
    // Take user out of the app to the onboarding / sign-in welcome screen
    const updatedSettings: ReaderSettings = {
      ...settings,
      hasCompletedOnboarding: false,
      userEmail: '',
    };
    setSettings(updatedSettings);
    storage.saveSettings(updatedSettings, 'usr-1');
    
    // Reset security lock status and admin auth
    setIsUnlocked(false);
    setIsAdminAuthenticated(false);
    
    // Clear session data
    setActiveDocument(null);
    setActiveView('home');
    
    // Reset collections to trigger reload for default user
    setDocuments([]);
    setVocabulary([]);
    setHighlights([]);
    setAnnotations([]);
    setStickyNotes([]);
  };

  const handleResetData = () => {
    localStorage.clear();
    setFolders(INITIAL_FOLDERS);
    setDecks(INITIAL_DECKS);
    setVocabulary(INITIAL_VOCABULARY);
    setDocuments([]);
    setHighlights([]);
    setAnnotations([]);
    setStickyNotes([]);
    setSettings({
      ...defaultSettings,
      hasCompletedOnboarding: false,
    });
    setUserStats(defaultUserStats);
    setActiveDocument(null);
    setActiveView('home');
  };

  // --- Folder & Deck Handlers ---
  const handleNewFolder = () => {
    const name = prompt('Enter a new folder name:');
    if (!name || !name.trim()) return;

    const colors = ['#D67D6D', '#E2B25B', '#5BAEB6', '#222222', '#A4F5A6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newF: Folder = {
      id: `folder-${Date.now()}`,
      name: name.trim().toLowerCase(),
      deckIds: [],
      color: randomColor,
    };

    setFolders((prev) => [...prev, newF]);
    activityTracker.logActivity('Flashcards SRS', `Created folder category: "${newF.name}"`, 10, 'deck');
    handleTrackUserActivity(`Created folder category: "${newF.name}"`, 'Flashcards SRS');
  };

  const handleNewDeck = () => {
    const name = prompt('Enter a new deck name:');
    if (!name || !name.trim()) return;

    const lang = prompt('Enter the language of this deck:', settings.targetLanguage || 'French');
    if (!lang || !lang.trim()) return;

    const newD: Deck = {
      id: `deck-${Date.now()}`,
      name: name.trim().toLowerCase(),
      language: lang.trim(),
    };

    setDecks((prev) => [...prev, newD]);
    setSelectedDecksFilterId(newD.id);
    activityTracker.logDeckCreated(newD.name, 0);
    handleTrackUserActivity(`Created new deck "${newD.name}"`, 'Flashcards SRS');
  };

  const handleDeleteDeck = (deckId: string) => {
    if (confirm('Are you sure you want to delete this deck and all of its card items?')) {
      const deck = decks.find((d) => d.id === deckId);
      setDecks((prev) => prev.filter((d) => d.id !== deckId));
      setVocabulary((prev) => prev.filter((v) => v.deckId !== deckId));
      setOpenDecks((prev) => prev.filter((id) => id !== deckId));
      if (activeDeckTabId === deckId) {
        setActiveDeckTabId(null);
      }
      if (deck) {
        activityTracker.logDeckDeleted(deck.name);
        handleTrackUserActivity(`Deleted deck: "${deck.name}"`, 'Flashcards SRS');
      } else {
        handleTrackUserActivity();
      }
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    if (confirm('Are you sure you want to delete this folder category? Decks inside will remain uncategorized.')) {
      const folder = folders.find((f) => f.id === folderId);
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
      if (folder) {
        activityTracker.logActivity('Flashcards SRS', `Deleted folder category: "${folder.name}"`, 8, 'deck');
        handleTrackUserActivity(`Deleted folder category: "${folder.name}"`, 'Flashcards SRS');
      } else {
        handleTrackUserActivity();
      }
    }
  };

  const handleOpenDeckTab = (deckId: string) => {
    if (!openDecks.includes(deckId)) {
      setOpenDecks((prev) => [...prev, deckId]);
    }
    setActiveDeckTabId(deckId);
    setFlashcardsSubView('decks');
    setActiveView('flashcards');
  };

  const handleCloseDeckTab = (deckId: string) => {
    const updated = openDecks.filter((id) => id !== deckId);
    setOpenDecks(updated);
    if (activeDeckTabId === deckId) {
      setActiveDeckTabId(updated.length > 0 ? updated[updated.length - 1] : null);
    }
  };

  const handleStudyDeckStart = (deckId: string | null) => {
    setSelectedStudyDeckId(deckId || 'all');
    setFlashcardsSubView('study');
    setActiveView('flashcards');
    const deckName = deckId ? (decks.find(d => d.id === deckId)?.name || 'Custom') : 'All Flashcards';
    activityTracker.logActivity('Flashcards SRS', `Started studying deck: "${deckName}"`, 10, 'deck');
  };

  // --- Flashcard Item Handlers ---
  const handleSaveFlashcard = (cardData: Partial<VocabularyItem>) => {
    if (cardData.id) {
      // Editing Existing Card
      setVocabulary((prev) =>
        prev.map((v) =>
          v.id === cardData.id
            ? {
                ...v,
                word: cardData.word || v.word,
                translation: cardData.translation || v.translation,
                phonetic: cardData.phonetic || v.phonetic,
                partOfSpeech: cardData.partOfSpeech || v.partOfSpeech,
                grammarNote: cardData.grammarNote,
                contextSentence: cardData.contextSentence || v.contextSentence,
                definition: cardData.definition || v.definition,
                deckId: cardData.deckId || v.deckId,
                language: cardData.language || v.language,
              }
            : v
        )
      );
      activityTracker.logActivity('Flashcards SRS', `Updated flashcard: "${cardData.word}"`, 8, 'deck');
    } else {
      // Creating New Card
      const newCard: VocabularyItem = {
        id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        word: cardData.word || '',
        translation: cardData.translation || '',
        phonetic: cardData.phonetic || '',
        partOfSpeech: cardData.partOfSpeech || 'Noun',
        grammarNote: cardData.grammarNote,
        contextSentence: cardData.contextSentence || '',
        definition: cardData.definition || '',
        deckId: cardData.deckId,
        language: cardData.language || 'French',
        dateAdded: Date.now(),
        tags: [],
        srs: {
          state: "new",
          learningStepIndex: 0,
          intervalDays: 0,
          easeFactor: 2.5,
          repetitions: 0,
          lapses: 0,
          dueAt: Date.now(),
        },
      };

      setVocabulary((prev) => [newCard, ...prev]);
      const deckName = decks.find(d => d.id === cardData.deckId)?.name;
      activityTracker.logFlashcardCreated(newCard.word, newCard.translation, deckName);
    }
    setEditCard(null);
    handleTrackUserActivity();
  };

  const handleEditCardTrigger = (card: VocabularyItem) => {
    setEditCard(card);
    setIsCreateFlashcardOpen(true);
  };

  const handleDeleteCard = (id: string) => {
    const item = vocabulary.find((v) => v.id === id);
    setVocabulary((prev) => prev.filter((v) => v.id !== id));
    if (item) {
      activityTracker.logVocabDeleted(item.word);
      handleTrackUserActivity(`Deleted flashcard: "${item.word}"`, 'Flashcards SRS');
    }
  };

  const handleSaveQuizHistory = (newRecord: Omit<QuizHistory, 'id'>) => {
    const fullRecord: QuizHistory = {
      ...newRecord,
      id: `history-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };
    setQuizHistory(prev => [fullRecord, ...prev]);
  };

  // --- Dictionary Word Selection Modal ---
  const handleWordClick = async (word: string, contextSentence: string, rect?: { x: number, y: number, width: number, height: number }) => {
    const translateToLang = settings.translationLanguage || (settings.interfaceLanguage && settings.interfaceLanguage !== settings.targetLanguage ? settings.interfaceLanguage : 'French');
    const cleanWord = word.trim().toLowerCase().replace(/^[\s.,!?;:()""''「」『』。、¿¡«»“”‘’—–\-]+|[\s.,!?;:()""''「」『』。、¿¡«»“”‘’—–\-]+$/g, '');
    const cacheKey = `${activeDocument?.id || 'global'}_${translateToLang.toLowerCase()}_${cleanWord}`;

    setActiveWord(word);
    activityTracker.logTranslationLookup(word, 'Looking up...');
    handleTrackUserActivity(`Looked up word: "${word}"`, 'Bilingual Reader');
    if (rect) {
      setWordModalPosition(rect);
    } else {
      setWordModalPosition(null);
    }

    if (translationCache[cacheKey]) {
      const cached = translationCache[cacheKey];
      setWordData(cached);
      activityTracker.logTranslationLookup(word, cached.translation || word);
      setIsWordLoading(false);
      return;
    }

    setIsWordLoading(true);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word,
          contextSentence,
          targetLanguage: translateToLang,
          sourceLanguage: activeDocument?.language || 'Auto',
        }),
      });
      
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
      
      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Invalid JSON from translate API. Output snippet:", text.substring(0, 100));
        throw new Error("Received non-JSON response from server");
      }
      setWordData(data);
      if (data && data.translation) {
        activityTracker.logTranslationLookup(word, data.translation);
        try {
          const currentUserId = activityTracker.getCurrentUserId();
          const currentUserName = settings.userName || 'Learner';
          const existingLogs = JSON.parse(localStorage.getItem('lingoflow_user_action_logs') || '[]');
          existingLogs.unshift({
            id: `log-${Date.now()}-${Math.random()}`,
            userId: currentUserId,
            userName: currentUserName,
            documentId: activeDocument?.id || '',
            documentTitle: activeDocument?.title || activeDocument?.name || 'Untitled Document',
            word,
            translation: data.translation,
            contextSentence,
            actionType: 'word_translation',
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('lingoflow_user_action_logs', JSON.stringify(existingLogs));
        } catch (e) {}
      }

      // Save to cache state and localStorage
      setTranslationCache((prev) => {
        const next = { ...prev, [cacheKey]: data };
        if (activeDocument) {
          try {
            const savedCache = localStorage.getItem(`lingoflow_cache_${activeDocument.id}_${translateToLang.toLowerCase()}`);
            const cacheObj = savedCache ? JSON.parse(savedCache) : {};
            cacheObj[cleanWord] = data;
            localStorage.setItem(`lingoflow_cache_${activeDocument.id}_${translateToLang.toLowerCase()}`, JSON.stringify(cacheObj));
          } catch (e) {
            console.error('Failed to save individual translation to local storage cache:', e);
          }
        }
        return next;
      });
    } catch (e) {
      console.error('Failed to analyze word selection:', e);
      
      // Fallback response for offline or transient network error
      const targetLang = translateToLang || 'French';
      const isArabic = targetLang.toLowerCase().includes('ar');
      const isFrench = targetLang.toLowerCase().includes('fr');
      const isSpanish = targetLang.toLowerCase().includes('es') || targetLang.toLowerCase().includes('spa');
      const isGerman = targetLang.toLowerCase().includes('de') || targetLang.toLowerCase().includes('ger');

      let fallbackDef = 'Temporary offline fallback. Could not connect to translation server.';
      let fallbackPos = 'word';
      let fallbackNote = 'Local client-side fallback.';

      if (isArabic) {
        fallbackDef = 'ترجمة مؤقتة لعدم الاتصال بالإنترنت. تعذر الاتصال بخادم الترجمة.';
        fallbackPos = 'كلمة';
        fallbackNote = 'تراجع محلي للعميل.';
      } else if (isFrench) {
        fallbackDef = 'Traduction temporaire hors ligne. Impossible de contacter le serveur de traduction.';
        fallbackPos = 'mot';
        fallbackNote = 'Alternative locale.';
      } else if (isSpanish) {
        fallbackDef = 'Traducción temporal fuera de línea. No se pudo conectar con el servidor de traducción.';
        fallbackPos = 'palabra';
        fallbackNote = 'Respaldo local.';
      } else if (isGerman) {
        fallbackDef = 'Temporäre Offline-Übersetzung. Der Übersetzungsdienst konnte nicht erreicht werden.';
        fallbackPos = 'Wort';
        fallbackNote = 'Lokales Backup.';
      }

      const fallbackData = {
        word,
        phonetic: `/ ${word.toLowerCase()} /`,
        translation: word,
        definition: fallbackDef,
        partOfSpeech: fallbackPos,
        grammarNote: fallbackNote,
        contextSentence: contextSentence || '',
        examples: contextSentence ? [{ source: contextSentence, target: 'Context sentence' }] : [],
        synonyms: [],
        antonyms: []
      };

      setWordData(fallbackData);
    } finally {
      setIsWordLoading(false);
    }
  };

  const handleSaveWordToVocab = (wordDef: any) => {
    // Prevent duplicate entries
    if (vocabulary.some((v) => v.word.toLowerCase() === wordDef.word.toLowerCase())) {
      alert("Word is already saved in your vocabulary list.");
      return;
    }

    // Try to auto-resolve matching deckId based on sourceLanguage or first available
    let deckId = selectedStudyDeckId && selectedStudyDeckId !== 'all' ? selectedStudyDeckId : undefined;
    if (!deckId && decks.length > 0) {
      const match = decks.find((d) => d.language.toLowerCase() === (wordDef.sourceLanguage || settings.targetLanguage || 'French').toLowerCase());
      deckId = match ? match.id : decks[0].id;
    }

    const newItem: VocabularyItem = {
      id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      word: wordDef.word,
      translation: wordDef.translation,
      phonetic: wordDef.phonetic || '',
      partOfSpeech: wordDef.partOfSpeech || 'Noun',
      definition: wordDef.definition || '',
      contextSentence: wordDef.contextSentence || '',
      grammarNote: wordDef.grammarNote || '',
      deckId,
      language: wordDef.sourceLanguage || settings.targetLanguage || 'French',
      dateAdded: Date.now(),
      tags: [],
      srs: {
          state: "new",
          learningStepIndex: 0,
          intervalDays: 0,
          easeFactor: 2.5,
          repetitions: 0,
          lapses: 0,
          dueAt: Date.now(),
        },
    };

    setVocabulary((prev) => [newItem, ...prev]);
    const deckName = decks.find(d => d.id === deckId)?.name;
    activityTracker.logVocabSaved(wordDef.word, wordDef.translation, deckName);
    handleTrackUserActivity(`Saved vocabulary: "${wordDef.word}" (${wordDef.translation})`, 'Bilingual Reader');
  };

  // --- Annotations & Highlights Handlers ---
  const handleAddHighlight = (highlight: Omit<Highlight, 'id' | 'createdAt'>) => {
    const newH: Highlight = {
      ...highlight,
      id: `highlight-${Date.now()}`,
      createdAt: Date.now(),
    };
    setHighlights((prev) => [...prev, newH]);
    activityTracker.logHighlightCreated(highlight.color, highlight.text);
    handleTrackUserActivity(`Created ${highlight.color} highlight on Page ${highlight.pageNumber}`, 'Bilingual Reader');
  };

  const handleRemoveHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
    activityTracker.logHighlightRemoved();
    handleTrackUserActivity(`Removed highlight`, 'Bilingual Reader');
  };

  const handleSaveAnnotation = (ann: Omit<FreehandAnnotation, 'id' | 'createdAt'>) => {
    const newA: FreehandAnnotation = {
      ...ann,
      id: `annotation-${Date.now()}`,
      createdAt: Date.now(),
    };
    setAnnotations((prev) => [...prev, newA]);
    activityTracker.logAnnotationCreated(ann.pageNumber, ann.penType);
    handleTrackUserActivity(`Added ${ann.penType || 'drawing'} on Page ${ann.pageNumber}`, 'Bilingual Reader');
  };

  const handleClearPageAnnotations = (pageNumber: number) => {
    if (!activeDocument) return;
    setAnnotations((prev) =>
      prev.filter((ann) => ann.documentId !== activeDocument.id || ann.pageNumber !== pageNumber)
    );
    activityTracker.logAnnotationCleared(pageNumber);
    handleTrackUserActivity(`Cleared annotations on Page ${pageNumber}`, 'Bilingual Reader');
  };

  // --- Library PDF/TXT Document Shelf Handlers ---
  const handleSelectDocument = (doc: DocumentFile) => {
    const now = Date.now();
    // Ensure document has userId set if it's a custom/uploaded book
    const docWithUser: DocumentFile = (doc.fileType === 'sample' || doc.isSample)
      ? { ...doc, isSample: true, lastReadAt: now }
      : { ...doc, userId: doc.userId || activeUserId, isSample: false, lastReadAt: now };

    setDocuments((prev) => {
      const exists = prev.some((d) => d.id === docWithUser.id);
      if (exists) {
        return prev.map((d) => d.id === docWithUser.id ? { ...d, lastReadAt: now } : d);
      }
      return [docWithUser, ...prev];
    });
    
    // Set as active reader document
    setActiveDocument(docWithUser);
    setActiveView('reader');
    activityTracker.logDocOpened(docWithUser.name);
    handleTrackUserActivity(`Opened reading document: "${docWithUser.name}"`, 'Bilingual Reader');
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this document from your library? All associated annotations and drawing strokes on it will be lost.')) {
      const doc = documents.find((d) => d.id === id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      setHighlights((prev) => prev.filter((h) => h.documentId !== id));
      setAnnotations((prev) => prev.filter((a) => a.documentId !== id));
      if (activeDocument?.id === id) {
        setActiveDocument(null);
      }
      if (doc) {
        activityTracker.logDocDeleted(doc.name);
        handleTrackUserActivity(`Deleted document: "${doc.name}"`, 'Library Shelf');
      } else {
        handleTrackUserActivity();
      }
    }
  };

  const handleUpdateDocument = (updatedDoc: DocumentFile) => {
    setDocuments(prev => {
      const next = prev.map(d => d.id === updatedDoc.id ? updatedDoc : d);
      storage.saveDocuments(next, activeUserId, settings.targetLanguage);
      return next;
    });
    if (activeDocument?.id === updatedDoc.id) {
      setActiveDocument(updatedDoc);
    }
  };

  // --- Admin Panel Isolation Guard ---
  if (activeView === 'admin-dashboard') {
    if (!isAdminAuthenticated) {
      return (
        <AdminLoginGate
          onSuccess={() => setIsAdminAuthenticated(true)}
          onCancel={() => {
            setActiveView('home');
            window.location.hash = '#home';
          }}
        />
      );
    }
    return (
      <div className="min-h-screen bg-[#F6F5F2] dark:bg-[#0D0F0B] text-stone-900 dark:text-stone-100 p-4 md:p-8 md:pl-20 overflow-y-auto">
        <AdminDashboard
          userStats={userStats}
          vocabulary={vocabulary}
          setVocabulary={setVocabulary}
          folders={folders}
          setFolders={setFolders}
          decks={decks}
          setDecks={setDecks}
          documents={documents}
          setDocuments={setDocuments}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          user={user}
          onLockApp={() => {
            setIsAdminAuthenticated(false);
          }}
        />
      </div>
    );
  }

  // Landing Page standalone View (First screen before onboarding/app)
  if (activeView === 'landing') {
    return (
      <LandingPageView
        onNavigate={(view: AppView) => handleNavigateWithHistory(view)}
        onStartLearning={() => {
          const updatedSettings = { ...settings, hasCompletedOnboarding: false };
          setSettings(updatedSettings);
          storage.saveSettings(updatedSettings);
          handleNavigateWithHistory('onboarding');
        }}
      />
    );
  }

  // Explicit Onboarding View or not yet completed
  if (activeView === 'onboarding' || !settings.hasCompletedOnboarding) {
    return (
      <OnboardingView
        onComplete={(name, lang) => {
          handleOnboardingComplete(name, lang);
          handleNavigateWithHistory('home');
        }}
        settings={settings}
      />
    );
  }

  // Account Blocked Guard check
  if (isBlocked && user && activeView !== 'admin-dashboard') {
    return <BlockedScreen userEmail={settings.userEmail || user?.email || 'this user'} />;
  }

  // Passcode Lock Guard check
  if (settings.isPasswordProtected && !isUnlocked) {
    return (
      <LockScreen
        correctPassword={settings.appPassword || ''}
        onUnlock={() => setIsUnlocked(true)}
        userName={settings.userName || user?.name || 'User'}
        userAvatar={settings.userAvatar}
      />
    );
  }

  // Retrieve selected tab deck for sheet rendering
  const activeDeckForTab = activeDeckTabId ? decks.find((d) => d.id === activeDeckTabId) || null : null;
  const isArabic = settings.interfaceLanguage === 'Arabic';

  return (
    <div 
      className={`min-h-screen md:h-screen md:overflow-hidden bg-[#EFF1EE] dark:bg-[#121312] text-[#222222] dark:text-[#EFF1EE] transition-colors duration-300 flex flex-col md:flex-row overflow-x-hidden ${
        isArabic ? 'font-arabic-sans' : 'font-sans'
      }`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      
      {/* Left Sidebar Navigation */}
      {activeView !== 'landing' && (
        <Header
          activeView={activeView}
          user={user}
          userEmail={user?.email || settings.userEmail || activeAccount?.email || 'mopl8065@gmail.com'}
          userAvatar={settings.userAvatar}
          userName={activeAccount?.name || settings.userName || user?.name}
          currentUserRole={activeAccount?.role || 'Student'}
          allAccounts={allAccounts}
          activeUserId={activeUserId}
          onSwitchUser={(userId) => {
            activityTracker.setCurrentUserId(userId);
            setActiveUserId(userId);
          }}
          onSignOut={handleLogout}
          setActiveView={(view) => {
            handleNavigateWithHistory(view);
          }}
          syncStatus={syncStatus}
          onRegisterSync={handleRegisterSync}
          interfaceLanguage={settings.interfaceLanguage}
          targetLanguage={settings.targetLanguage}
          onUpdateSettings={handleUpdateSettings}
          isCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => {
            setIsSidebarCollapsed(!isSidebarCollapsed);
          }}
          onOpenSearch={() => setIsQuickSearchOpen(true)}
          onOpenNotifications={() => setIsNotificationCenterOpen(true)}
          unreadNotificationsCount={unreadNotificationsCount}
          onTriggerOnboarding={() => {
            const updated = { ...settings, hasCompletedOnboarding: false };
            setSettings(updated);
            storage.saveSettings(updated);
            setActiveView('home');
          }}
        />
      )}

      {/* Main Column Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        
        {/* Dynamic In-App Top Ads and Sponsored Sticky Promos */}
        <AdRenderer
          currentPage={activeView}
          activeUserId={activeUserId}
          onNavigate={handleNavigateWithHistory}
        />

        {/* Upper Header (Aligned with Ribble Brand System) - Shown on Home Page for Mobile & Laptop */}
        {activeView === 'home' && (
          <div className="grid grid-cols-3 items-center px-4 sm:px-6 pt-4 pb-3 bg-[#EFF1EE] border-b border-[#D0D2CF] shrink-0">
            <div className="justify-self-start flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#222222] text-[#EFF1EE] flex items-center justify-center font-bold text-sm shadow-xs overflow-hidden shrink-0 ring-2 ring-white">
                <img 
                  src={getEffectiveAvatar(settings.userAvatar, activeAccount?.id || settings.userEmail || settings.userName)} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <DualFlagLanguageSelector
                targetLanguage={settings.targetLanguage}
                interfaceLanguage={settings.interfaceLanguage}
                onUpdateSettings={handleUpdateSettings}
                dropDirection="right"
              />
            </div>
            <div className="justify-self-center text-center">
              <h2 className="text-sm font-['Cabinet_Grotesk','Plus_Jakarta_Sans',sans-serif] font-bold text-[#222222] leading-tight truncate max-w-[160px]">
                Hello {activeAccount?.name || settings.userName || 'User'}
              </h2>
              <p className="text-[11px] text-[#666666] font-medium">
                Today {new Date().getDate()} {new Date().toLocaleDateString('en-US', { month: 'short' })}.
              </p>
            </div>
            <div className="justify-self-end flex items-center gap-2">
              <button
                onClick={() => setIsQuickSearchOpen(true)}
                className="w-10 h-10 rounded-full bg-white border border-[#D0D2CF] text-[#222222] flex items-center justify-center hover:bg-[#D0D2CF] transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                title="Search"
              >
                <Search className="w-4.5 h-4.5 stroke-[2.2]" />
              </button>
              <button
                onClick={() => setIsNotificationCenterOpen(true)}
                className="w-10 h-10 rounded-full bg-white border border-[#D0D2CF] text-[#222222] flex items-center justify-center hover:bg-[#D0D2CF] transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 relative"
                title="Notifications & Messages"
              >
                <Bell className="w-4.5 h-4.5 stroke-[2.2]" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -end-1 w-4 h-4 bg-[#A4F5A6] text-[#222222] font-bold text-[9px] rounded-full ring-2 ring-white flex items-center justify-center">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Main Pages Content Frame */}
        <main className={`flex-1 w-full overflow-y-auto ${
          activeView === 'reader' && activeDocument
            ? 'p-0 pb-6 md:px-6 md:py-8 md:pb-8'
            : activeView === 'home'
            ? 'px-4 sm:px-6 pt-2 md:py-8 pb-36 md:pb-8'
            : 'px-4 sm:px-6 py-6 md:py-8 pb-36 md:pb-8'
        }`}>
          {/* Top Page Navigation Bar with Back Icon Button - Only shown on Library, Flashcards, and Dictionary pages */}
          {['reader', 'flashcards', 'flashcards-view', 'dictionary', 'practice', 'quizzes', 'writing'].includes(activeView) && !(activeView === 'reader' && activeDocument) && (
            <div className="md:hidden flex items-center justify-between mb-5 pb-3 border-b border-[#D0D2CF] shrink-0">
              <button
                id="top-nav-back-button"
                onClick={handleNavigateBack}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-[#222222] border border-[#D0D2CF] hover:bg-[#EFF1EE] transition-all shadow-xs text-xs font-bold cursor-pointer group"
                title="Go back to previous page"
              >
                <ArrowLeft className="w-4 h-4 text-[#222222] group-hover:-translate-x-1 transition-transform stroke-[2.2]" />
                <span>Back</span>
              </button>

              {activeView === 'dictionary' ? (
                <>
                  {/* On Desktop: Standard View Title 'Dictionary' */}
                  <span className="hidden sm:inline text-xs font-bold text-[#222222]">
                    Dictionary
                  </span>

                  {/* On Phone / Mobile: Move the Target Language Selector button here INSTEAD of the word 'Dictionary' */}
                  <div className="sm:hidden relative">
                    <button
                      onClick={() => setIsTopLangDropdownOpen(!isTopLangDropdownOpen)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#D0D2CF] text-[#222222] font-bold text-xs shadow-xs cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#222222]" />
                      <span>{settings.targetLanguage || 'Arabic'}</span>
                      <ChevronDown className={`w-3 h-3 text-[#666666] transition-transform duration-200 ${isTopLangDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isTopLangDropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsTopLangDropdownOpen(false)} 
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute end-0 top-full mt-2 w-48 bg-white border border-[#D0D2CF] rounded-2xl shadow-lg z-50 p-1.5 overflow-hidden"
                          >
                            <div className="text-[9px] font-bold tracking-widest uppercase text-[#666666] px-2.5 py-1 border-b border-[#D0D2CF] mb-1">
                              Translate To
                            </div>
                            <div className="max-h-56 overflow-y-auto flex flex-col gap-0.5 custom-scrollbar">
                              {LANGUAGE_OPTIONS.map((lang) => {
                                const currentLang = settings.targetLanguage || 'Arabic';
                                const isSelected = currentLang.toLowerCase() === lang.name.toLowerCase();
                                return (
                                  <button
                                    key={`top-nav-lang-${lang.code}`}
                                    onClick={() => {
                                      setIsTopLangDropdownOpen(false);
                                      handleUpdateSettings({ targetLanguage: lang.name });
                                    }}
                                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                      isSelected
                                        ? 'bg-[#A4F5A6] text-[#222222] font-bold shadow-xs'
                                        : 'text-[#222222] hover:bg-[#EFF1EE]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <FlagIcon code={lang.code} className="w-5 h-3.5" />
                                      <span>{lang.name}</span>
                                    </div>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-[#222222]" />}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  {activeView === 'flashcards' && (
                    <button
                      onClick={() => setIsFlashcardsSidebarOpen(true)}
                      className="w-11 h-11 bg-white text-[#222222] border border-[#D0D2CF] rounded-full flex items-center justify-center hover:bg-[#EFF1EE] hover:scale-105 active:scale-95 shadow-xs transition-all cursor-pointer shrink-0"
                      title="Open Card Options"
                    >
                      <div className="flex flex-col gap-[3px] w-4.5">
                        <div className="h-[1.5px] w-full bg-[#222222] rounded-full" />
                        <div className="h-[1.5px] w-full bg-[#222222] rounded-full" />
                        <div className="h-[1.5px] w-full bg-[#222222] rounded-full" />
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          <AnimatePresence mode="wait">
          
          {/* VIEW 0: ALL TOOLS (Mobile Redesign) */}
          {activeView === 'all-tools' && (
            <motion.div
              key="all-tools-view-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AllToolsView settings={settings}
                onNavigate={(view) => handleNavigateWithHistory(view)}
                onBack={handleNavigateBack}
                userName={activeAccount?.name || settings.userName}
              />
            </motion.div>
          )}

          {/* VIEW 0.5: MY LEARNING */}
          {activeView === 'mylearning' && (
            <motion.div
              key="mylearning-view-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <MyLearningView
                 settings={settings}
                 userStats={userStats}
              />
            </motion.div>
          )}

          {/* VIEW 1: HOME/DASHBOARD */}
          {activeView === 'home' && (
            <motion.div
              key="home-view-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HomeView
                userStats={userStats}
                vocabulary={vocabulary}
                documents={documents}
                onSelectDocument={handleSelectDocument}
                settings={settings}
                onNavigate={(view) => handleNavigateWithHistory(view)}
                onTriggerOnboarding={() => {
                  console.log("Triggering onboarding from HomeView...");
                  const updated = { ...settings, hasCompletedOnboarding: false };
                  setSettings(updated);
                  storage.saveSettings(updated);
                  setActiveView('home');
                }}
                currentUserRole={activeAccount?.role || 'Student'}
                userName={activeAccount?.name || settings.userName}
                onOpenSearch={() => setIsQuickSearchOpen(true)}
                onOpenNotifications={() => setIsNotificationCenterOpen(true)}
                unreadNotificationsCount={unreadNotificationsCount}
              />
            </motion.div>
          )}

          {/* VIEW 2: BILINGUAL READER */}
          {activeView === 'reader' && (
            <motion.div
              key="reader-view-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeDocument ? (
                /* PDF/Text Reader viewport */
                <PdfReader
                  document={activeDocument}
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  onWordClick={handleWordClick}
                  activeWord={activeWord || undefined}
                  highlights={highlights.filter(h => h.documentId === activeDocument.id)}
                  onAddHighlight={handleAddHighlight}
                  onRemoveHighlight={handleRemoveHighlight}
                  annotations={annotations.filter(a => a.documentId === activeDocument.id)}
                  onSaveAnnotation={handleSaveAnnotation}
                  onClearPageAnnotations={handleClearPageAnnotations}
                  onUploadClick={() => setIsUploadOpen(true)}
                  onAnalyzePageAI={() => {}}
                  isAnalyzing={false}
                  onBackToLibrary={() => setActiveDocument(null)}
                  onUpdateDocument={handleUpdateDocument}
                  translationCache={translationCache}
                  onUpdateCache={(newCache) => setTranslationCache(prev => ({ ...prev, ...newCache }))}
                />
              ) : (
                /* Book library shelf catalog */
                <LibraryShelf
                  documents={documents}
                  vocabulary={vocabulary}
                  onSelectDocument={handleSelectDocument}
                  onDeleteDocument={handleDeleteDocument}
                  onUploadClick={() => setIsUploadOpen(true)}
                  settings={settings}
                  onUpdateDocument={handleUpdateDocument}
                />
              )}
            </motion.div>
          )}

          {/* VIEW 3: FLASHCARDS (STUDY REVIEW & DECK SHEETS) */}
          {activeView === 'flashcards' && (() => {
            const t = getTranslation(settings.interfaceLanguage);
            const isAr = settings.interfaceLanguage === 'Arabic';
            const isFr = settings.interfaceLanguage === 'French';
            const isEs = settings.interfaceLanguage === 'Spanish';
            const isDe = settings.interfaceLanguage === 'German';

            const dailyReviewLabel = t.dailyReviewSession || (isAr ? 'جلسة المراجعة اليومية' : isFr ? 'Session de Révision Quotidienne' : isEs ? 'Sesión de Repaso Diario' : isDe ? 'Tägliche Wiederholungssitzung' : 'Daily Review Session');
            const manageDecksLabel = t.manageDecksFolders || (isAr ? 'إدارة المجموعات والمجلدات' : isFr ? 'Gérer les Paquets & Dossiers' : isEs ? 'Gestionar Mazos y Carpetas' : isDe ? 'Decks & Ordner verwalten' : 'Manage Decks & Folders');
            const allSavedWordsLabel = t.allSavedWords || (isAr ? 'جميع الكلمات المحفوظة' : isFr ? 'Tous les mots enregistrés' : isEs ? 'Todas las palabras guardadas' : isDe ? 'Alle gespeicherten Wörter' : 'All Saved Words');
            const browseCardsLabel = t.browseCards || (isAr ? 'تصفح البطاقات' : isFr ? 'Explorer les cartes' : isEs ? 'Explorar tarjetas' : isDe ? 'Karten durchsuchen' : 'Browse Cards');

            return (
              <motion.div
                key="flashcards-view-portal"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Secondary Navigation Controller */}
                <div id="flashcards-nav-controller" className="hidden md:flex gap-2 border-b border-[#D0D2CF] pb-3 select-none flex-wrap items-center">
                  <button
                    id="flashcards-tab-study"
                    onClick={() => setFlashcardsSubView('study')}
                    className={`px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-2 ${
                      flashcardsSubView === 'study' && !activeDeckForTab
                        ? 'bg-[#A4F5A6] text-[#222222] shadow-xs scale-102'
                        : 'text-[#222222] bg-white border border-[#D0D2CF] hover:bg-[#EFF1EE]'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 shrink-0" />
                    <span>{dailyReviewLabel}</span>
                  </button>

                  <button
                    id="flashcards-tab-decks"
                    onClick={() => {
                      setFlashcardsSubView('decks');
                      // Reset single deck tab sheet view
                      setOpenDecks([]);
                      setActiveDeckTabId(null);
                    }}
                    className={`px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-2 ${
                      flashcardsSubView === 'decks' && !activeDeckForTab
                        ? 'bg-[#A4F5A6] text-[#222222] shadow-xs scale-102'
                        : 'text-[#222222] bg-white border border-[#D0D2CF] hover:bg-[#EFF1EE]'
                    }`}
                  >
                    <Layers className="w-4 h-4 shrink-0" />
                    <span>{manageDecksLabel}</span>
                  </button>

                  <button
                    id="flashcards-tab-saved-words"
                    onClick={() => {
                      setFlashcardsSubView('saved-words');
                      setOpenDecks([]);
                      setActiveDeckTabId(null);
                    }}
                    className={`px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-2 ${
                      flashcardsSubView === 'saved-words' && !activeDeckForTab
                        ? 'bg-[#A4F5A6] text-[#222222] shadow-xs scale-102'
                        : 'text-[#222222] bg-white border border-[#D0D2CF] hover:bg-[#EFF1EE]'
                    }`}
                  >
                    <BookMarked className="w-4 h-4 shrink-0" />
                    <span>{allSavedWordsLabel}</span>
                  </button>

                  <button
                    id="flashcards-tab-browse"
                    onClick={() => {
                      setFlashcardsSubView('browse');
                      setOpenDecks([]);
                      setActiveDeckTabId(null);
                    }}
                    className={`px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-2 ${
                      flashcardsSubView === 'browse' && !activeDeckForTab
                        ? 'bg-[#A4F5A6] text-[#222222] shadow-xs scale-102'
                        : 'text-[#222222] bg-white border border-[#D0D2CF] hover:bg-[#EFF1EE]'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4 shrink-0" />
                    <span>{browseCardsLabel}</span>
                  </button>

                {/* Dynamically active spreadsheet tab lists */}
                {openDecks.map((openId) => {
                  const oDeck = decks.find((d) => d.id === openId);
                  if (!oDeck) return null;
                  const isActive = activeDeckTabId === openId;
                  return (
                    <div key={openId} className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setActiveDeckTabId(openId);
                          setFlashcardsSubView('decks');
                        }}
                        className={`px-4 py-1.5 text-xs font-bold rounded-s-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-[#A4F5A6] text-[#222222] border-[#A4F5A6] shadow-xs'
                            : 'text-[#222222] bg-white border-[#D0D2CF] hover:bg-[#EFF1EE]'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5 shrink-0" />
                        <span>{oDeck.name}</span>
                      </button>
                      <button
                        onClick={() => handleCloseDeckTab(openId)}
                        className={`px-2.5 py-1.5 rounded-e-full border transition-all hover:bg-red-50 hover:text-red-600 cursor-pointer ${
                          isActive ? 'bg-[#A4F5A6] text-[#222222] border-[#A4F5A6]' : 'text-[#666666] bg-white border-[#D0D2CF]'
                        }`}
                        title="Close deck sheet tab"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
                </div>

              {/* Subview Renders */}
              {activeDeckForTab ? (
                /* Tab sheet active */
                <SingleDeckView
                  deck={activeDeckForTab}
                  vocabulary={vocabulary}
                  onAddWordClick={() => {
                    setEditCard(null);
                    setIsCreateFlashcardOpen(true);
                  }}
                  onNewDeckClick={handleNewDeck}
                  onEditCardClick={handleEditCardTrigger}
                  onDeleteCard={handleDeleteCard}
                  onCloseDeck={() => handleCloseDeckTab(activeDeckTabId!)}
                />
              ) : flashcardsSubView === 'study' ? (
                /* Study session */
                <StudyView
                  vocabulary={vocabulary}
                  decks={decks}
                  settings={settings}
                  onUpdateVocabulary={(updated) => {
                    setVocabulary((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
                    handleTrackUserActivity();
                  }}
                  onDeleteVocabulary={handleDeleteCard}
                  onAddWordClick={() => {
                    setEditCard(null);
                    setIsCreateFlashcardOpen(true);
                  }}
                  onNewDeckClick={handleNewDeck}
                  onEditCardClick={handleEditCardTrigger}
                  selectedDeckId={selectedStudyDeckId}
                  setSelectedDeckId={setSelectedStudyDeckId}
                  onSubViewChange={(subView) => {
                    setFlashcardsSubView(subView);
                    setOpenDecks([]);
                    setActiveDeckTabId(null);
                  }}
                />
              ) : flashcardsSubView === 'saved-words' ? (
                /* Saved Words view */
                <SavedWordsView
                  vocabulary={vocabulary}
                  decks={decks}
                  settings={settings}
                  onAddWordClick={() => {
                    setEditCard(null);
                    setIsCreateFlashcardOpen(true);
                  }}
                  onEditCardClick={handleEditCardTrigger}
                  onDeleteCard={handleDeleteCard}
                  onSubViewChange={(subView) => {
                    setFlashcardsSubView(subView);
                    setOpenDecks([]);
                    setActiveDeckTabId(null);
                  }}
                />
              ) : flashcardsSubView === 'browse' ? (
                /* Ready Cards Repository view */
                <BrowseCardsView
                  decks={decks}
                  settings={settings}
                  onAddCardToDeck={(card, targetDeckId) => {
                    const newCard: VocabularyItem = {
                      ...card,
                      id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                      deckId: targetDeckId,
                      createdAt: Date.now(),
                    };
                    setVocabulary((prev) => [newCard, ...prev]);
                    const targetDeck = decks.find((d) => d.id === targetDeckId);
                    handleTrackUserActivity(
                      `Added ready card "${card.word}" to deck "${targetDeck?.name || 'Selected Deck'}"`,
                      'Flashcards SRS'
                    );
                  }}
                  userVocabulary={vocabulary}
                  onSubViewChange={(subView) => {
                    setFlashcardsSubView(subView);
                    setOpenDecks([]);
                    setActiveDeckTabId(null);
                  }}
                />
              ) : (
                /* Decks view directory */
                <DecksView
                  folders={folders}
                  decks={decks}
                  settings={settings}
                  vocabulary={vocabulary}
                  onNewFolderClick={handleNewFolder}
                  onNewDeckClick={handleNewDeck}
                  onDeleteDeck={handleDeleteDeck}
                  onDeleteFolder={handleDeleteFolder}
                  onOpenDeck={handleOpenDeckTab}
                  onStudyDeck={handleStudyDeckStart}
                  selectedFilterId={selectedDecksFilterId}
                  setSelectedFilterId={setSelectedDecksFilterId}
                  onSubViewChange={(subView) => {
                    setFlashcardsSubView(subView);
                    setOpenDecks([]);
                    setActiveDeckTabId(null);
                  }}
                />
              )}

              {/* Mobile-only Flashcards Subpages Navigation Drawer */}
              <AnimatePresence>
                {isFlashcardsSidebarOpen && (
                  <>
                    {/* Backdrop overlay */}
                    <motion.div
                      key="flashcards-sidebar-backdrop"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsFlashcardsSidebarOpen(false)}
                      className="fixed inset-0 bg-stone-900/10 dark:bg-black/20 backdrop-blur-[1px] z-50 md:hidden"
                    />

                    {/* Sidebar floating capsule dock */}
                    <motion.div
                      key="flashcards-sidebar-panel"
                      initial={{ x: 60, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 60, opacity: 0 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 220 }}
                      className="fixed top-24 end-4 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-2xl rounded-2xl p-3.5 z-55 flex flex-col items-stretch gap-3 w-[200px] md:hidden"
                    >
                      {/* Close button inside a round shape */}
                      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-850 pb-2">
                        <span className="text-[10px] font-extrabold text-stone-400 dark:text-stone-500 uppercase tracking-wider">Navigation</span>
                        <button
                          onClick={() => setIsFlashcardsSidebarOpen(false)}
                          className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center text-stone-500 dark:text-stone-400 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs border border-stone-100 dark:border-stone-700"
                          title="Close Menu"
                        >
                          <X className="w-4 h-4 stroke-[2]" />
                        </button>
                      </div>

                      {/* Spaced Repetition Pages Navigation */}
                      {[
                        { id: 'study', label: dailyReviewLabel, icon: GraduationCap },
                        { id: 'decks', label: manageDecksLabel, icon: Layers },
                        { id: 'saved-words', label: allSavedWordsLabel, icon: BookMarked },
                        { id: 'browse', label: browseCardsLabel, icon: Search }
                      ].map((p) => {
                        const isCurrent = flashcardsSubView === p.id && !activeDeckTabId;
                        const IconComponent = p.icon;
                        return (
                          <button
                            key={`mob-sidebar-nav-${p.id}`}
                            onClick={() => {
                              setFlashcardsSubView(p.id as any);
                              setOpenDecks([]);
                              setActiveDeckTabId(null);
                              setIsFlashcardsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-start border transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-[#A4F5A6] border-[#A4F5A6] text-[#222222] shadow-xs'
                                : 'bg-white dark:bg-stone-900 border-[#D0D2CF] dark:border-white/10 hover:bg-[#EFF1EE] dark:hover:bg-stone-800 text-[#222222] dark:text-stone-300'
                            }`}
                          >
                            <IconComponent className={`w-4 h-4 shrink-0 stroke-[2] ${isCurrent ? 'text-[#222222]' : 'text-[#222222] dark:text-[#A4F5A6]'}`} />
                            <span className="text-xs font-black truncate">{p.label}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          )})()}

          {/* VIEW X: DICTIONARY */}
          {activeView === 'dictionary' && (
            <motion.div
              key="dictionary-view-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DictionaryView
                vocabulary={vocabulary}
                decks={decks}
                settings={settings}
                onAddWordClick={() => {
                  setEditCard(null);
                  setIsCreateFlashcardOpen(true);
                }}
                onEditCardClick={handleEditCardTrigger}
                onDeleteCard={handleDeleteCard}
                onSaveVocabulary={(newItem) => {
                  setVocabulary((prev) => [newItem, ...prev.filter((v) => v.id !== newItem.id)]);
                }}
              />
            </motion.div>
          )}

          {/* VIEW 5: SETTINGS & PRESETS */}

          {activeView === 'settings' && (
            <motion.div
              key="settings-view-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SettingsModal
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onResetData={handleResetData}
                onLogout={handleLogout}
                vocabulary={vocabulary}
                documents={documents}
                userStats={userStats}
                folders={folders}
                decks={decks}
                highlights={highlights}
                stickyNotes={stickyNotes}
                initialTab={initialSettingsTab}
                onTriggerOnboarding={() => {
                  const updated = { ...settings, hasCompletedOnboarding: false };
                  setSettings(updated);
                  storage.saveSettings(updated);
                  setActiveView('home');
                }}
              />
            </motion.div>
          )}

          {activeView === 'writing' && (
            <motion.div
              key="writing-view-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <WritingView
                settings={settings}
                onNavigate={(view) => handleNavigateWithHistory(view)}
              />
            </motion.div>
          )}

          {activeView === 'video' && (
            <motion.div
              key="video-view-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <VideoPlayerView />
            </motion.div>
          )}


          {/* VIEW 6: NEW SRS FLASHCARDS PAGE */}
          {activeView === 'flashcards-view' && (
            <motion.div
              key="flashcards-view-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FlashcardsView
                vocabulary={vocabulary}
                onUpdateVocabulary={(updated) => {
                  setVocabulary((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
                  handleTrackUserActivity();
                }}
                settings={settings}
              />
            </motion.div>
          )}

          {/* VIEW: PRACTICE HUB / PRACTICING */}
          {activeView === 'practice' && (
            <motion.div
              key="practice-view-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PracticeView
                vocabulary={vocabulary}
                settings={settings}
                decks={decks}
                onUpdateVocabulary={(updated) => {
                  setVocabulary((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
                  handleTrackUserActivity();
                }}
                onAddVocabularyBatch={(newItems) => {
                  setVocabulary((prev) => [...newItems, ...prev]);
                  handleTrackUserActivity();
                }}
                onNavigate={(view) => handleNavigateWithHistory(view)}
                quizHistory={quizHistory}
                onSaveQuizHistory={handleSaveQuizHistory}
              />
            </motion.div>
          )}

          {/* VIEW: QUIZZES PAGE */}
          {activeView === 'quizzes' && (
            <motion.div
              key="quizzes-view-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <QuizzesView 
                settings={settings} 
                onNavigate={(view) => handleNavigateWithHistory(view)} 
                onSaveQuizHistory={handleSaveQuizHistory}
              />
            </motion.div>
          )}

          {/* VIEW 7: ADMIN CONTROL DASHBOARD */}
          {activeView === 'admin-dashboard' && (
            <motion.div
              key="admin-dashboard-view-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AdminDashboard
                userStats={userStats}
                vocabulary={vocabulary}
                setVocabulary={setVocabulary}
                folders={folders}
                setFolders={setFolders}
                decks={decks}
                setDecks={setDecks}
                documents={documents}
                setDocuments={setDocuments}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                user={user}
                onLockApp={() => setIsUnlocked(false)}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation Bar (Aligned with Ribble Brand System) */}
      {(['home', 'dictionary', 'all-tools', 'settings', 'practice', 'quizzes', 'writing'].includes(activeView) || (activeView === 'reader' && !activeDocument)) && (
        <nav 
          aria-label="Mobile Navigation" 
          className="fixed bottom-4 start-1/2 -translate-x-1/2 z-50 w-[310px] max-w-[92vw] mx-auto bg-white/95 text-[#222222] flex items-center justify-between py-2 px-3.5 shadow-lg rounded-full border border-[#D0D2CF] md:hidden transition-all duration-200"
        >
          {/* 1. Home */}
          <button
            onClick={() => handleNavigateWithHistory('home')}
            className={`transition-all cursor-pointer flex items-center justify-center ${
              activeView === 'home' 
                ? 'bg-[#A4F5A6] text-[#222222] px-5 py-2.5 rounded-full font-bold shadow-xs' 
                : 'text-[#222222]/70 hover:text-[#222222] p-3 rounded-full'
            }`}
            title="Home"
          >
            <Home className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* 2. Dictionary */}
          <button
            onClick={() => handleNavigateWithHistory('dictionary')}
            className={`transition-all cursor-pointer flex items-center justify-center ${
              activeView === 'dictionary' 
                ? 'bg-[#A4F5A6] text-[#222222] px-5 py-2.5 rounded-full font-bold shadow-xs' 
                : 'text-[#222222]/70 hover:text-[#222222] p-3 rounded-full'
            }`}
            title="Dictionary"
          >
            <BookMarked className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* 3. All Tools */}
          <button
            onClick={() => handleNavigateWithHistory('all-tools')}
            className={`transition-all cursor-pointer flex items-center justify-center ${
              activeView === 'all-tools' 
                ? 'bg-[#A4F5A6] text-[#222222] px-5 py-2.5 rounded-full font-bold shadow-xs' 
                : 'text-[#222222]/70 hover:text-[#222222] p-3 rounded-full'
            }`}
            title="All Tools"
          >
            <LayoutGrid className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* 4. Profile / Settings */}
          <button
            onClick={() => handleNavigateWithHistory('settings')}
            className={`transition-all cursor-pointer flex items-center justify-center ${
              activeView === 'settings' 
                ? 'bg-[#A4F5A6] text-[#222222] px-5 py-2.5 rounded-full font-bold shadow-xs' 
                : 'text-[#222222]/70 hover:text-[#222222] p-3 rounded-full'
            }`}
            title="Profile & Settings"
          >
            <User className="w-4 h-4 stroke-[2.2]" />
          </button>
        </nav>
      )}
      </div>

      {/* --- Popups and Modals Overlays Section --- */}

      {/* Quick Search Modal */}
      <QuickSearchModal
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
        documents={documents}
        vocabulary={vocabulary}
        folders={folders}
        decks={decks}
        isAdmin={isAdminAuthenticated || activeAccount?.role === 'Admin' || activeAccount?.role === 'Educator'}
        userRole={activeAccount?.role}
        onSelectDocument={handleSelectDocument}
        onNavigateView={(view) => {
          setInitialSettingsTab(undefined);
          handleNavigateWithHistory(view);
        }}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenCreateFlashcard={() => setIsCreateFlashcardOpen(true)}
        onSelectWord={(word) => handleWordClick(word, '')}
        onSelectSettingsTab={(tab) => {
          setInitialSettingsTab(tab);
          handleNavigateWithHistory('settings');
        }}
        onResetData={handleResetData}
        onLogout={handleLogout}
      />

      {/* PDF / TXT File Upload Modal */}
      {isUploadOpen && (
        <UploadModal
          onClose={() => setIsUploadOpen(false)}
          onSelectDocument={handleSelectDocument}
          interfaceLanguage={settings.interfaceLanguage}
          userId={activeUserId}
        />
      )}

      {/* Create / Edit card dialog modal */}
      <CreateFlashcardModal
        isOpen={isCreateFlashcardOpen}
        onClose={() => {
          setIsCreateFlashcardOpen(false);
          setEditCard(null);
        }}
        decks={decks}
        onSave={handleSaveFlashcard}
        editCard={editCard}
        settings={settings}
      />

      {/* Dictionary word explanation popup popover */}
      {activeWord && (
        <WordModal
          wordData={wordData}
          isLoading={isWordLoading}
          onClose={() => {
            setActiveWord(null);
            setWordData(null);
            setWordModalPosition(null);
            try {
              window.getSelection()?.removeAllRanges();
            } catch (selErr) {
              console.warn("Could not clear selection range:", selErr);
            }
          }}
          onSaveToVocabulary={handleSaveWordToVocab}
          isSaved={vocabulary.some(v => v.word.toLowerCase() === activeWord.toLowerCase())}
          position={wordModalPosition}
          interfaceLanguage={settings.translationLanguage || settings.interfaceLanguage || settings.targetLanguage}
        />
      )}

      {/* Global Real-Time Notification & Direct Message Center Drawer */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        activeUserId={activeUserId}
        onNavigate={handleNavigateWithHistory}
        settings={settings}
      />

      {/* Service Worker Offline Sync Status & Queue Banner */}
      <OfflineSyncBanner />

    </div>
  );
}
