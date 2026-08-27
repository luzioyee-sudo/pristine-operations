// @ts-nocheck
import { ActivityRecord, UserAccount, VocabularyItem } from '../types';
import { recordUserActivity } from '../lib/supabase';

const STORAGE_KEY = 'lingoflow_user_accounts';

// Device detector
const getDeviceInfo = (): string => {
  if (typeof window === 'undefined') return 'Web Browser';
  const ua = navigator.userAgent;
  let browser = 'Browser';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';

  let os = 'Desktop';
  if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return `${browser} / ${os}`;
};

// Calculate Day N label relative to join date
const getDayLabel = (joinedAtStr?: string): string => {
  try {
    const joinDate = new Date(joinedAtStr || new Date());
    const today = new Date();
    joinDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.max(1, Math.floor((today.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const todayFormatted = new Date().toISOString().split('T')[0];
    return `Day ${diffDays} (${todayFormatted})`;
  } catch {
    const todayFormatted = new Date().toISOString().split('T')[0];
    return `Day 1 (${todayFormatted})`;
  }
};

// Formatted Timestamp "YYYY-MM-DD HH:MM:SS"
const getFormattedTimestamp = (): string => {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

// Helper to format seconds into readable duration e.g. "12m 45s" or "1h 20m"
export const formatDurationSeconds = (totalSeconds: number): string => {
  if (totalSeconds < 60) {
    return `${Math.max(1, Math.round(totalSeconds))}s`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  if (minutes < 60) {
    return `${minutes}m ${seconds}s`;
  }
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return `${hours}h ${remMinutes}m`;
};

// Helper to parse duration string back into seconds
export const parseDurationSeconds = (durationStr?: string): number => {
  if (!durationStr) return 0;
  const matchHours = durationStr.match(/(\d+)h/);
  const matchMins = durationStr.match(/(\d+)m/);
  const matchSecs = durationStr.match(/(\d+)s/);
  let secs = 0;
  if (matchHours) secs += parseInt(matchHours[1], 10) * 3600;
  if (matchMins) secs += parseInt(matchMins[1], 10) * 60;
  if (matchSecs) secs += parseInt(matchSecs[1], 10);
  return secs;
};

// Helper to get real current vocabulary count for a user and language
const getLocalVocabCount = (userId: string, targetLang?: string): number => {
  try {
    let cleanLang = 'english';
    if (targetLang) {
      cleanLang = targetLang.toLowerCase().trim().replace(/\s+/g, '_');
    } else {
      // Try to find in settings
      const settingsKey = userId === 'usr-1' ? 'lingoflow_settings' : `lingoflow_settings_${userId}`;
      const settingsRaw = localStorage.getItem(settingsKey);
      if (settingsRaw) {
        const parsed = JSON.parse(settingsRaw);
        if (parsed.targetLanguage) {
          cleanLang = parsed.targetLanguage.toLowerCase().trim().replace(/\s+/g, '_');
        }
      }
    }

    const baseKey = 'lingoflow_vocabulary';
    const primaryKey = `${baseKey}_${userId}_lang_${cleanLang}`;
    
    const raw = localStorage.getItem(primaryKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.length;
    }
  } catch {
    // fallback
  }
  return 0;
};

export const activityTracker = {
  // Get all registered user accounts
  getUserAccounts: (): UserAccount[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading user accounts:', e);
    }
    return [];
  },

  // Save all user accounts
  saveUserAccounts: (accounts: UserAccount[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('lingoflow_activity_updated'));
      }
    } catch (e) {
      console.error('Error saving user accounts:', e);
    }
  },

  // Get active current user ID
  getCurrentUserId: (): string => {
    try {
      return localStorage.getItem('lingoflow_current_user_id') || 'usr-1';
    } catch {
      return 'usr-1';
    }
  },

  // Set active current user ID
  setCurrentUserId: (userId: string) => {
    try {
      localStorage.setItem('lingoflow_current_user_id', userId);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('lingoflow_activity_updated'));
      }
    } catch (e) {
      console.error('Error setting current user ID:', e);
    }
  },

  // Broadcast realtime update event to all active views
  triggerRealtimeSync: () => {
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('lingoflow_activity_updated'));
      }
    } catch (e) {
      console.error('Failed to trigger sync:', e);
    }
  },

  // Ensure user account exists in registry and return its index
  ensureUserAccount: (userId: string): { accounts: UserAccount[]; userIndex: number } => {
    const accounts = activityTracker.getUserAccounts();
    let userIndex = accounts.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      // Create a local account index from the Supabase-authenticated profile settings.
      let userName = '';
      let userEmail = '';
      let targetLang = 'English';
      let avatar = '';

      try {
        const rawSettings = localStorage.getItem(`lingoflow_settings_${userId}`) || localStorage.getItem('lingoflow_settings');
        if (rawSettings) {
          const parsedSettings = JSON.parse(rawSettings);
          if (parsedSettings.userName) userName = parsedSettings.userName;
          if (parsedSettings.userEmail) userEmail = parsedSettings.userEmail;
          if (parsedSettings.targetLanguage) targetLang = parsedSettings.targetLanguage;
          if (parsedSettings.userAvatar) avatar = parsedSettings.userAvatar;
        }
      } catch {
        // ignore
      }

      const displayName = userName || (userEmail ? userEmail.split('@')[0] : 'Active Learner');
      const vocabCount = getLocalVocabCount(userId, targetLang);

      const newAccount: UserAccount = {
        id: userId,
        name: displayName,
        email: userEmail,
        role: userEmail === 'mopl8065@gmail.com' ? 'Admin' : 'Student',
        status: 'Active',
        joinedAt: new Date().toISOString().split('T')[0],
        wordsLearned: vocabCount,
        lastLogin: 'Just now',
        targetLanguage: targetLang,
        notes: 'Active verified account',
        totalTimeSpent: '0s',
        sessionCount: 1,
        avatar,
        activityLogs: []
      };

      accounts.unshift(newAccount);
      userIndex = 0;
      activityTracker.saveUserAccounts(accounts);
    }

    return { accounts, userIndex };
  },

  // Log a real granular activity event for a user
  logActivity: (
    section: ActivityRecord['section'],
    action: string,
    durationSeconds: number = 5,
    type: ActivityRecord['type'] = 'navigation',
    userId?: string
  ) => {
    try {
      const activeId = userId || activityTracker.getCurrentUserId();
      const { accounts, userIndex } = activityTracker.ensureUserAccount(activeId);
      
      const user = accounts[userIndex];
      const durationStr = formatDurationSeconds(durationSeconds);
      
      const newLog: ActivityRecord = {
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        timestamp: getFormattedTimestamp(),
        dateLabel: getDayLabel(user.joinedAt),
        section,
        action,
        duration: durationStr,
        device: getDeviceInfo(),
        location: 'Active App Session',
        type
      };

      const existingLogs = user.activityLogs || [];
      const updatedLogs = [newLog, ...existingLogs].slice(0, 500); // keep up to 500 recent logs

      // Calculate new total time spent
      const prevTotalSeconds = parseDurationSeconds(user.totalTimeSpent);
      const newTotalSeconds = prevTotalSeconds + durationSeconds;
      const totalTimeSpentFormatted = formatDurationSeconds(newTotalSeconds);

      // Real vocab count check
      const currentVocabCount = getLocalVocabCount(activeId, user.targetLanguage);
      const wordsLearned = Math.max(user.wordsLearned || 0, currentVocabCount);

      // Update userStats activity history for today as well
      try {
        const todayFormatted = new Date().toISOString().split('T')[0];
        let cleanLang = (user.targetLanguage || 'english').toLowerCase().trim().replace(/\s+/g, '_');
        const statsKey = `lingoflow_user_stats_${activeId}_lang_${cleanLang}`;
        
        const rawStats = localStorage.getItem(statsKey);
        let statsObj: any = rawStats ? JSON.parse(rawStats) : {};
        const currentHist = statsObj.activityHistory || {};
        currentHist[todayFormatted] = (currentHist[todayFormatted] || 0) + 1;
        statsObj.activityHistory = currentHist;
        statsObj.lastActiveDate = Date.now();
        localStorage.setItem(statsKey, JSON.stringify(statsObj));
      } catch (err) {
        console.error('Error updating activity history in storage:', err);
      }

      accounts[userIndex] = {
        ...user,
        lastLogin: 'Just now',
        totalTimeSpent: totalTimeSpentFormatted,
        wordsLearned,
        activityLogs: updatedLogs
      };

      activityTracker.saveUserAccounts(accounts);

      // Persist the activity record in Supabase when this is a real authenticated user.
      recordUserActivity(activeId, {
        ...newLog,
        name: user.name,
        email: user.email,
        totalTimeSpent: totalTimeSpentFormatted,
        wordsLearned,
        targetLanguage: user.targetLanguage,
        role: user.role,
        status: user.status,
        joinedAt: user.joinedAt,
      }).then((success) => {
        if (!success) return;
        const freshAccounts = activityTracker.getUserAccounts();
        const fIdx = freshAccounts.findIndex(a => a.id === activeId);
        if (fIdx !== -1) {
          freshAccounts[fIdx].activityLogs = (freshAccounts[fIdx].activityLogs || []).map(l =>
            l.id === newLog.id ? { ...l, syncedToCloud: true } : l
          );
          activityTracker.saveUserAccounts(freshAccounts);
        }
      }).catch((err) => {
        console.error('Failed to sync activity to Supabase:', err);
      });
    } catch (e) {
      console.error('Failed to log real user activity:', e);
    }
  },

  // Helper trackers across modules
  logSectionEnter: (section: ActivityRecord['section']) => {
    activityTracker.logActivity(section, `Navigated into ${section} module`, 3, 'navigation');
  },

  logWordLookedUp: (word: string, translation: string, context?: string) => {
    const ctx = context ? ` in context: "${context.slice(0, 35)}..."` : '';
    activityTracker.logActivity('Bilingual Reader', `Looked up translation: "${word}" -> "${translation}"${ctx}`, 8, 'vocabulary');
  },

  logTranslationLookup: (word: string, translation: string) => {
    activityTracker.logActivity('Bilingual Reader', `Translated word: "${word}" -> "${translation}"`, 8, 'vocabulary');
  },

  logSentenceTranslated: (snippet: string, translation: string) => {
    const cleanSnippet = snippet.length > 40 ? `${snippet.substring(0, 40)}...` : snippet;
    const cleanTrans = translation.length > 40 ? `${translation.substring(0, 40)}...` : translation;
    activityTracker.logActivity('Bilingual Reader', `Translated sentence: "${cleanSnippet}" -> "${cleanTrans}"`, 12, 'reading');
  },

  logVocabSaved: (word: string, translation: string, deckName?: string) => {
    const deckStr = deckName ? ` to deck "${deckName}"` : '';
    activityTracker.logActivity('Bilingual Reader', `Saved vocabulary: "${word}" (${translation})${deckStr}`, 10, 'vocabulary');
  },

  logVocabDeleted: (word: string) => {
    activityTracker.logActivity('Flashcards SRS', `Deleted vocabulary item: "${word}"`, 5, 'vocabulary');
  },

  logHighlightCreated: (color: string, textSnippet?: string) => {
    const snippet = textSnippet ? `: "${textSnippet.slice(0, 30)}..."` : '';
    activityTracker.logActivity('Bilingual Reader', `Created ${color} highlight${snippet}`, 6, 'reading');
  },

  logHighlightRemoved: () => {
    activityTracker.logActivity('Bilingual Reader', `Removed reading highlight`, 4, 'reading');
  },

  logAnnotationCreated: (pageNumber: number, tool?: string) => {
    activityTracker.logActivity('Bilingual Reader', `Added ${tool || 'freehand'} drawing annotation on Page ${pageNumber}`, 10, 'reading');
  },

  logAnnotationCleared: (pageNumber: number) => {
    activityTracker.logActivity('Bilingual Reader', `Cleared drawing annotations on Page ${pageNumber}`, 5, 'reading');
  },

  logStickyNoteCreated: (pageNumber: number, textSnippet?: string) => {
    const snippet = textSnippet ? `: "${textSnippet.slice(0, 25)}..."` : '';
    activityTracker.logActivity('Bilingual Reader', `Created sticky note on Page ${pageNumber}${snippet}`, 8, 'reading');
  },

  logStickyNoteDeleted: () => {
    activityTracker.logActivity('Bilingual Reader', `Deleted sticky note`, 4, 'reading');
  },

  logDocOpened: (docTitle: string, pageNum?: number) => {
    const details = pageNum ? ` (Page ${pageNum})` : '';
    activityTracker.logActivity('Bilingual Reader', `Opened document: "${docTitle}"${details}`, 15, 'reading');
  },

  logDocUploaded: (docTitle: string, fileSize?: string) => {
    const sizeStr = fileSize ? ` (${fileSize})` : '';
    activityTracker.logActivity('Library Shelf', `Uploaded document: "${docTitle}"${sizeStr}`, 10, 'reading');
  },

  logDocDeleted: (docTitle: string) => {
    activityTracker.logActivity('Library Shelf', `Deleted document: "${docTitle}"`, 5, 'reading');
  },

  logDeckCreated: (deckTitle: string, cardCount: number = 0) => {
    activityTracker.logActivity('Flashcards SRS', `Created new deck: "${deckTitle}" (${cardCount} cards)`, 15, 'deck');
  },

  logDeckDeleted: (deckTitle: string) => {
    activityTracker.logActivity('Flashcards SRS', `Deleted deck: "${deckTitle}" and its flashcards`, 8, 'deck');
  },

  logFlashcardCreated: (word: string, translation: string, deckTitle?: string) => {
    const deckStr = deckTitle ? ` in "${deckTitle}"` : '';
    activityTracker.logActivity('Flashcards SRS', `Created flashcard: "${word}" (${translation})${deckStr}`, 10, 'deck');
  },

  logFlashcardReviewed: (word: string, translation: string, grade: number) => {
    const gradeLabels: Record<number, string> = { 1: 'Again', 2: 'Hard', 3: 'Good', 4: 'Easy' };
    const label = gradeLabels[grade] || `Grade ${grade}`;
    activityTracker.logActivity('Flashcards SRS', `Reviewed card: "${word}" (${translation}) - Rated "${label}"`, 12, 'deck');
  },

  logFlashcardFlipped: (word: string) => {
    activityTracker.logActivity('Flashcards SRS', `Flipped flashcard: "${word}" to reveal answer`, 4, 'deck');
  },

  logSRSReviewSession: (reviewedCount: number, correctCount: number) => {
    const accuracy = reviewedCount > 0 ? Math.round((correctCount / reviewedCount) * 100) : 100;
    activityTracker.logActivity('Flashcards SRS', `Completed SRS review session: ${reviewedCount} cards reviewed (${accuracy}% accuracy)`, 60 * Math.max(1, reviewedCount), 'deck');
  },

  logWritingAnalyzed: (charCount: number, score: number, issuesCount: number) => {
    activityTracker.logActivity('Writing Coach', `Analyzed writing draft (${charCount} chars) - Score: ${score}% (${issuesCount} suggestions)`, 15, 'reading');
  },

  logWritingFixApplied: (issueType: string) => {
    activityTracker.logActivity('Writing Coach', `Applied grammar correction (${issueType})`, 5, 'vocabulary');
  },

  logWritingSaved: (docTitle: string, wordCount: number) => {
    activityTracker.logActivity('Writing Coach', `Saved writing draft: "${docTitle}" (${wordCount} words)`, 10, 'reading');
  },

  logTTSAudioPlayed: (text: string, lang?: string) => {
    const snippet = text.length > 25 ? `${text.substring(0, 25)}...` : text;
    activityTracker.logActivity('Bilingual Reader', `Played native TTS pronunciation for "${snippet}" (${lang || 'Native'})`, 6, 'vocabulary');
  },

  logDictionarySearch: (query: string, resultCount?: number) => {
    const res = typeof resultCount === 'number' ? ` (${resultCount} results)` : '';
    activityTracker.logActivity('Bilingual Reader', `Searched dictionary for "${query}"${res}`, 6, 'vocabulary');
  },

  logSettingsChanged: (settingName: string, value: any) => {
    activityTracker.logActivity('Settings', `Updated setting "${settingName}" -> ${JSON.stringify(value)}`, 5, 'settings');
  },

  logAdminAction: (actionDesc: string) => {
    activityTracker.logActivity('Admin Console', actionDesc, 10, 'navigation');
  }
};

// Section Active Time Tracker Hook/Manager
let currentSection: ActivityRecord['section'] | null = null;
let currentSectionStartTime: number = Date.now();
let lastHeartbeatTime: number = Date.now();

export const trackSectionTime = (newSection: ActivityRecord['section']) => {
  const now = Date.now();
  if (currentSection && currentSection !== newSection) {
    const durationSeconds = Math.max(1, Math.round((now - currentSectionStartTime) / 1000));
    if (durationSeconds >= 2) {
      activityTracker.logActivity(
        currentSection,
        `Spent ${formatDurationSeconds(durationSeconds)} studying in ${currentSection}`,
        durationSeconds,
        'navigation'
      );
    }
  }
  currentSection = newSection;
  currentSectionStartTime = now;
  lastHeartbeatTime = now;
};

// Active Session Heartbeat Timer (runs every 45s while user is active on tab)
if (typeof window !== 'undefined') {
  let isWindowActive = true;

  window.addEventListener('focus', () => {
    isWindowActive = true;
    lastHeartbeatTime = Date.now();
  });

  window.addEventListener('blur', () => {
    if (currentSection && isWindowActive) {
      const now = Date.now();
      const durationSeconds = Math.max(0, Math.round((now - lastHeartbeatTime) / 1000));
      if (durationSeconds >= 10) {
        activityTracker.logActivity(
          currentSection,
          `Active engagement: ${formatDurationSeconds(durationSeconds)} in ${currentSection}`,
          durationSeconds,
          'navigation'
        );
      }
    }
    isWindowActive = false;
  });

  window.addEventListener('beforeunload', () => {
    if (currentSection && isWindowActive) {
      const now = Date.now();
      const durationSeconds = Math.max(0, Math.round((now - lastHeartbeatTime) / 1000));
      if (durationSeconds >= 5) {
        activityTracker.logActivity(
          currentSection,
          `Finished session in ${currentSection} (${formatDurationSeconds(durationSeconds)})`,
          durationSeconds,
          'navigation'
        );
      }
    }
  });

  // Background active heartbeat every 45 seconds
  setInterval(() => {
    if (isWindowActive && currentSection) {
      const now = Date.now();
      const durationSeconds = Math.round((now - lastHeartbeatTime) / 1000);
      if (durationSeconds >= 45) {
        lastHeartbeatTime = now;
        activityTracker.logActivity(
          currentSection,
          `Active study session in ${currentSection}`,
          durationSeconds,
          'navigation'
        );
      }
    }
  }, 45000);
}

