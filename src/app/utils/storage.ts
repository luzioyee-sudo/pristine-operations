// @ts-nocheck
import { DocumentFile, VocabularyItem, Highlight, FreehandAnnotation, StickyNoteAnnotation, ReaderSettings, UserStats, Folder, Deck } from '../types';
import { calculateStreak, getLocalDateString, generateSampleActivityHistory } from './stats';
import { getRandomDefaultAvatar } from './defaultAvatars';
import { SAMPLE_DOCUMENTS } from './sampleDocs';

const STORAGE_KEYS = {
  DOCUMENTS: 'lingoflow_documents',
  VOCABULARY: 'lingoflow_vocabulary',
  HIGHLIGHTS: 'lingoflow_highlights',
  ANNOTATIONS: 'lingoflow_annotations',
  STICKY_NOTES: 'lingoflow_sticky_notes',
  HANDWRITING: 'lingoflow_handwriting',
  SETTINGS: 'lingoflow_settings',
  ACTIVE_DOC_ID: 'lingoflow_active_doc_id',
  USER_STATS: 'lingoflow_user_stats',
  FOLDERS: 'lingoflow_folders',
  DECKS: 'lingoflow_decks',
  QUIZ_HISTORY: 'lingoflow_quiz_history',
};

export const defaultSettings: ReaderSettings = {
  appTheme: 'light',
  hasCompletedOnboarding: false,
  userName: '',
  userEmail: '',
  userAvatar: getRandomDefaultAvatar(),
  isPasswordProtected: false,
  appPassword: '',
  fontSize: 18,
  fontFamily: 'serif',
  lineHeight: 1.7,
  readerTheme: 'sunset',
  autoTranslateOnClick: true,
  targetLanguage: 'English',
  translationLanguage: 'French',
  interfaceLanguage: 'English',
  ttsVoiceRate: 1.0,
  geminiVoice: 'Zephyr',
  geminiTtsSpeed: 1.0,
  geminiVoiceEngine: 'gemini',
  showHighlights: true,
  showNotes: true,
  strokeColor: '#FF6D00', // Vibrant Sunset Orange
  strokeWidth: 3,
  strokeOpacity: 1.0,
  penType: 'pen',
};

const getTodayDateStr = () => getLocalDateString(new Date());

export const defaultUserStats: UserStats = {
  currentStreak: 0,
  lastActiveDate: Date.now(),
  wordsMastered: 0,
  dailyGoal: 10,
  activityHistory: {}
};

// Safe helper to read LocalStorage with fallback keys so pre-login data is never lost when signing in
function getWithFallback<T>(primaryKey: string, fallbackKeys: string[], defaultValue: T): T {
  try {
    const primaryData = localStorage.getItem(primaryKey);
    if (primaryData) {
      const parsed = JSON.parse(primaryData);
      if (Array.isArray(parsed) ? parsed.length > 0 : (parsed && Object.keys(parsed).length > 0)) {
        return parsed;
      }
    }
    for (const fbKey of fallbackKeys) {
      if (fbKey === primaryKey) continue;
      const fbData = localStorage.getItem(fbKey);
      if (fbData) {
        const parsed = JSON.parse(fbData);
        if (Array.isArray(parsed) ? parsed.length > 0 : (parsed && Object.keys(parsed).length > 0)) {
          try {
            localStorage.setItem(primaryKey, JSON.stringify(parsed));
          } catch (_) {}
          return parsed;
        }
      }
    }
  } catch (e) {
    console.error('Error reading fallback storage:', e);
  }
  return defaultValue;
}

// Safe LocalStorage Wrapper
export const storage = {
  getLangKey: (baseKey: string, userId?: string, targetLang?: string): { primaryKey: string; fallbacks: string[] } => {
    const activeId = userId || localStorage.getItem('lingoflow_current_user_id') || 'usr-1';
    let cleanLang = 'english';
    if (targetLang) {
      cleanLang = targetLang.toLowerCase().trim().replace(/\s+/g, '_');
    } else {
      try {
        const settingsRaw = localStorage.getItem(activeId === 'usr-1' ? STORAGE_KEYS.SETTINGS : `${STORAGE_KEYS.SETTINGS}_${activeId}`);
        if (settingsRaw) {
          const parsed = JSON.parse(settingsRaw);
          if (parsed.targetLanguage) {
            cleanLang = parsed.targetLanguage.toLowerCase().trim().replace(/\s+/g, '_');
          }
        }
      } catch (_) {}
    }

    const primaryKey = `${baseKey}_${activeId}_lang_${cleanLang}`;
    // If we're loading a specific language, we MUST NOT fallback to root/legacy keys
    // because that merges French data into Spanish if Spanish is empty!
    const fallbacks = [
      primaryKey
    ];

    return { primaryKey, fallbacks };
  },
  getDocuments: (userId?: string, targetLang?: string): DocumentFile[] => {
    const activeId = userId || localStorage.getItem('lingoflow_current_user_id') || 'usr-1';
    const { primaryKey, fallbacks } = storage.getLangKey(STORAGE_KEYS.DOCUMENTS, activeId, targetLang);
    const rawDocs = getWithFallback<DocumentFile[]>(primaryKey, fallbacks, []);
    
    let cleanLang = 'english';
    if (targetLang) {
      cleanLang = targetLang.toLowerCase().trim();
    } else {
      try {
        const settingsRaw = localStorage.getItem(activeId === 'usr-1' ? STORAGE_KEYS.SETTINGS : `${STORAGE_KEYS.SETTINGS}_${activeId}`);
        if (settingsRaw) {
          const parsed = JSON.parse(settingsRaw);
          if (parsed.targetLanguage) {
            cleanLang = parsed.targetLanguage.toLowerCase().trim();
          }
        }
      } catch (_) {}
    }

    const filteredSamples = SAMPLE_DOCUMENTS.filter(doc => doc.language.toLowerCase().trim() === cleanLang);

    if (rawDocs.length === 0) {
      return filteredSamples;
    }

    // Strict User Isolation:
    // Only return documents that are standard samples (fileType === 'sample' or isSample === true)
    // OR were uploaded/created by this specific user (doc.userId === activeId or unassigned local doc for activeId).
    // Discard any document belonging to a different userId!
    const userDocs = rawDocs.filter(doc => {
      if (doc.fileType === 'sample' || doc.isSample) return true;
      if (!doc.userId) return true; // Stored in this user's isolated local key
      return doc.userId === activeId;
    });

    if (userDocs.length === 0) {
      return filteredSamples;
    }

    return userDocs;
  },

  saveDocuments: (docs: DocumentFile[], userId?: string, targetLang?: string) => {
    try {
      const activeId = userId || localStorage.getItem('lingoflow_current_user_id') || 'usr-1';
      const { primaryKey } = storage.getLangKey(STORAGE_KEYS.DOCUMENTS, activeId, targetLang);
      
      // Filter out any document that explicitly belongs to another user
      const userDocsToSave = docs
        .filter(doc => {
          if (doc.fileType === 'sample' || doc.isSample) return true;
          if (!doc.userId) return true;
          return doc.userId === activeId;
        })
        .map(doc => {
          // Tag user ID on newly created/uploaded documents
          if (doc.fileType !== 'sample' && !doc.isSample && !doc.userId) {
            return { ...doc, userId: activeId };
          }
          return doc;
        });

      // Strip out huge inline base64 dataURI payloads from localStorage to prevent quota overflow
      // IndexedDB (pdfStorage.ts) stores the full binary safely.
      const lightweightDocs = userDocsToSave.map(doc => {
        if (doc.pdfDataUri && doc.pdfDataUri.length > 50000) {
          const { pdfDataUri, ...rest } = doc;
          return { ...rest, hasOriginalPdf: true };
        }
        return doc;
      });

      try {
        localStorage.setItem(primaryKey, JSON.stringify(lightweightDocs));
      } catch (innerQuotaErr) {
        // Aggressive reduction if localStorage is near 5MB capacity
        console.warn('LocalStorage quota warning, trimming heavy metadata fields:', innerQuotaErr);
        const minimalDocs = lightweightDocs.map(d => {
          const { pdfDataUri, ...rest } = d;
          return {
            ...rest,
            hasOriginalPdf: d.fileType === 'pdf' || d.hasOriginalPdf,
          };
        });
        localStorage.setItem(primaryKey, JSON.stringify(minimalDocs));
      }
    } catch (e) {
      console.error('Error saving documents:', e);
    }
  },

  getVocabulary: (userId?: string, targetLang?: string): VocabularyItem[] => {
    const { primaryKey, fallbacks } = storage.getLangKey(STORAGE_KEYS.VOCABULARY, userId, targetLang);
    const list = getWithFallback<VocabularyItem[]>(primaryKey, fallbacks, []);
    const userOnly = list.filter(item => item && item.id && !item.id.startsWith('v-'));
    if (userOnly.length !== list.length) {
      try {
        localStorage.setItem(primaryKey, JSON.stringify(userOnly));
      } catch (e) {}
    }
    return userOnly;
  },

  saveVocabulary: (vocab: VocabularyItem[], userId?: string, targetLang?: string) => {
    try {
      const { primaryKey } = storage.getLangKey(STORAGE_KEYS.VOCABULARY, userId, targetLang);
      localStorage.setItem(primaryKey, JSON.stringify(vocab));
      
      const activeId = userId || localStorage.getItem('lingoflow_current_user_id') || 'usr-1';
      try {
        const accountsData = localStorage.getItem('lingoflow_user_accounts');
        if (accountsData) {
          const accounts = JSON.parse(accountsData);
          if (Array.isArray(accounts)) {
            const idx = accounts.findIndex(a => a.id === activeId);
            if (idx !== -1) {
              accounts[idx].wordsLearned = vocab.length;
              localStorage.setItem('lingoflow_user_accounts', JSON.stringify(accounts));
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('lingoflow_activity_updated'));
              }
            }
          }
        }
      } catch (err) {
        console.error('Error updating registry wordsLearned count:', err);
      }
    } catch (e) {
      console.error('Error saving vocabulary:', e);
    }
  },

  getHighlights: (userId?: string, targetLang?: string): Highlight[] => {
    const { primaryKey, fallbacks } = storage.getLangKey(STORAGE_KEYS.HIGHLIGHTS, userId, targetLang);
    return getWithFallback<Highlight[]>(primaryKey, fallbacks, []);
  },

  saveHighlights: (highlights: Highlight[], userId?: string, targetLang?: string) => {
    try {
      const { primaryKey } = storage.getLangKey(STORAGE_KEYS.HIGHLIGHTS, userId, targetLang);
      localStorage.setItem(primaryKey, JSON.stringify(highlights));
    } catch (e) {
      console.error('Error saving highlights:', e);
    }
  },

  getAnnotations: (userId?: string, targetLang?: string): FreehandAnnotation[] => {
    const { primaryKey, fallbacks } = storage.getLangKey(STORAGE_KEYS.ANNOTATIONS, userId, targetLang);
    return getWithFallback<FreehandAnnotation[]>(primaryKey, fallbacks, []);
  },

  saveAnnotations: (annotations: FreehandAnnotation[], userId?: string, targetLang?: string) => {
    try {
      const { primaryKey } = storage.getLangKey(STORAGE_KEYS.ANNOTATIONS, userId, targetLang);
      localStorage.setItem(primaryKey, JSON.stringify(annotations));
    } catch (e) {
      console.error('Error saving annotations:', e);
    }
  },

  getStickyNotes: (userId?: string, targetLang?: string): StickyNoteAnnotation[] => {
    const { primaryKey, fallbacks } = storage.getLangKey(STORAGE_KEYS.STICKY_NOTES, userId, targetLang);
    return getWithFallback<StickyNoteAnnotation[]>(primaryKey, fallbacks, []);
  },

  saveStickyNotes: (notes: StickyNoteAnnotation[], userId?: string, targetLang?: string) => {
    try {
      const { primaryKey } = storage.getLangKey(STORAGE_KEYS.STICKY_NOTES, userId, targetLang);
      localStorage.setItem(primaryKey, JSON.stringify(notes));
    } catch (e) {
      console.error('Error saving sticky notes:', e);
    }
  },

  getFolders: (userId?: string, targetLang?: string): Folder[] => {
    const { primaryKey, fallbacks } = storage.getLangKey(STORAGE_KEYS.FOLDERS, userId, targetLang);
    return getWithFallback<Folder[]>(primaryKey, fallbacks, []);
  },

  saveFolders: (folders: Folder[], userId?: string, targetLang?: string) => {
    try {
      const { primaryKey } = storage.getLangKey(STORAGE_KEYS.FOLDERS, userId, targetLang);
      localStorage.setItem(primaryKey, JSON.stringify(folders));
    } catch (e) {
      console.error('Error saving folders:', e);
    }
  },

  getDecks: (userId?: string, targetLang?: string): Deck[] => {
    const { primaryKey, fallbacks } = storage.getLangKey(STORAGE_KEYS.DECKS, userId, targetLang);
    return getWithFallback<Deck[]>(primaryKey, fallbacks, []);
  },

  saveDecks: (decks: Deck[], userId?: string, targetLang?: string) => {
    try {
      const { primaryKey } = storage.getLangKey(STORAGE_KEYS.DECKS, userId, targetLang);
      localStorage.setItem(primaryKey, JSON.stringify(decks));
    } catch (e) {
      console.error('Error saving decks:', e);
    }
  },

  getSettings: (userId?: string): ReaderSettings => {
    try {
      const activeId = userId || localStorage.getItem('lingoflow_current_user_id') || 'usr-1';
      const primaryKey = activeId === 'usr-1' ? STORAGE_KEYS.SETTINGS : `${STORAGE_KEYS.SETTINGS}_${activeId}`;
      const fallbacks = [`${STORAGE_KEYS.SETTINGS}_usr-1`, STORAGE_KEYS.SETTINGS];
      const data = getWithFallback<ReaderSettings | null>(primaryKey, fallbacks, null);
      const resolved = data ? { ...defaultSettings, ...data } : { ...defaultSettings };
      if (!resolved.userAvatar) {
        resolved.userAvatar = getRandomDefaultAvatar();
      }
      return resolved;
    } catch (e) {
      return { ...defaultSettings, userAvatar: getRandomDefaultAvatar() };
    }
  },

  saveSettings: (settings: ReaderSettings, userId?: string) => {
    try {
      const activeId = userId || localStorage.getItem('lingoflow_current_user_id') || 'usr-1';
      const key = activeId === 'usr-1' ? STORAGE_KEYS.SETTINGS : `${STORAGE_KEYS.SETTINGS}_${activeId}`;
      localStorage.setItem(key, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  },

  getActiveDocumentId: (userId?: string): string | null => {
    const activeId = userId || localStorage.getItem('lingoflow_current_user_id') || 'usr-1';
    const key = activeId === 'usr-1' ? STORAGE_KEYS.ACTIVE_DOC_ID : `${STORAGE_KEYS.ACTIVE_DOC_ID}_${activeId}`;
    return localStorage.getItem(key);
  },

  setActiveDocumentId: (id: string, userId?: string) => {
    const activeId = userId || localStorage.getItem('lingoflow_current_user_id') || 'usr-1';
    const key = activeId === 'usr-1' ? STORAGE_KEYS.ACTIVE_DOC_ID : `${STORAGE_KEYS.ACTIVE_DOC_ID}_${activeId}`;
    localStorage.setItem(key, id);
  },

  getUserStats: (userId?: string, targetLang?: string): UserStats => {
    try {
      const { primaryKey, fallbacks } = storage.getLangKey(STORAGE_KEYS.USER_STATS, userId, targetLang);
      const data = getWithFallback<UserStats | null>(primaryKey, fallbacks, null);
      let history: Record<string, number> = {};
      let parsed: Partial<UserStats> = {};

      if (data) {
        parsed = data;
        history = parsed.activityHistory || {};
        // Clear any leftover fake 40-day streak or sample history from previous runs
        if (parsed.currentStreak === 40 || Object.keys(history).length === 40) {
          history = {};
          parsed.currentStreak = 0;
          parsed.wordsMastered = 0;
        }
      }

      const realStreak = calculateStreak(history, parsed.dailyGoal || 10);
      const stats: UserStats = {
        ...defaultUserStats,
        ...parsed,
        currentStreak: realStreak,
        activityHistory: history,
        lastActiveDate: Date.now()
      };
      return stats;
    } catch (e) {
      return {
        ...defaultUserStats,
        currentStreak: 0,
        activityHistory: {}
      };
    }
  },

  saveUserStats: (stats: UserStats, userId?: string, targetLang?: string) => {
    try {
      const { primaryKey } = storage.getLangKey(STORAGE_KEYS.USER_STATS, userId, targetLang);
      localStorage.setItem(primaryKey, JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving user stats:', e);
    }
  },

  getQuizHistory: (userId?: string, targetLang?: string): any[] => {
    const { primaryKey, fallbacks } = storage.getLangKey(STORAGE_KEYS.QUIZ_HISTORY, userId, targetLang);
    return getWithFallback<any[]>(primaryKey, fallbacks, []);
  },

  saveQuizHistory: (history: any[], userId?: string, targetLang?: string) => {
    try {
      const { primaryKey } = storage.getLangKey(STORAGE_KEYS.QUIZ_HISTORY, userId, targetLang);
      localStorage.setItem(primaryKey, JSON.stringify(history));
    } catch (e) {
      console.error('Error saving quiz history:', e);
    }
  }
};
