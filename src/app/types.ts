// @ts-nocheck
export type AppView = 'home' | 'reader' | 'flashcards' | 'dictionary' | 'practice' | 'quizzes' | 'settings' | 'flashcards-view' | 'admin-dashboard' | 'all-tools' | 'writing' | 'video' | 'landing' | 'onboarding';

export type QuizType = 'multiple_choice' | 'choose_the_word' | 'fill_in_the_blank' | 'translation' | 'match_pairs' | 'sentence_ordering' | 'context_choice' | 'synonym' | 'antonym' | 'find_the_mistake' | 'matching' | 'listening' | 'sentence_completion' | 'word_order' | 'grammar' | 'mixed';

export interface QuizQuestion {
  id: string;
  type: QuizType;
  prompt: string;
  options?: string[]; 
  correctAnswer: string;
  explanation?: string;
  audioUrl?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: 'Vocabulary' | 'Grammar' | 'Listening' | 'Reading' | 'Translation' | 'Mixed';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  questionCount: number;
  estimatedTimeMinutes: number;
  questions: QuizQuestion[];
  status: 'Not started' | 'Continue' | 'Completed';
  progress?: number; 
  bestScore?: number;
  lastAttemptedAt?: number;
}

export interface QuizHistory {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string; // ISO String
}

export interface Folder {
  language?: string;
  id: string;
  name: string;
  deckIds: string[];
  color?: string;
}

export interface Deck {
  id: string;
  name: string;
  folderId?: string;
  language: string;
}

export type ReaderTheme = 'paper' | 'sunset' | 'azure' | 'sepia' | 'dark';

export interface DocumentFile {
  id: string;
  userId?: string; // Isolated owner ID for the document
  isSample?: boolean; // True for standard curated sample books available to all
  name: string;
  size: number;
  uploadedAt: number;
  lastReadAt: number;
  currentPage: number;
  totalPages: number;
  language: string;
  fileType: 'pdf' | 'text' | 'sample';
  contentData?: string; // Base64 or plain text content
  pdfDataUri?: string; // Base64 Data URI of the original PDF to preserve 100% exact layout, fonts, pictures, tables, colors
  hasOriginalPdf?: boolean;
  coverColor?: string;
  author?: string;
  title?: string;
  coverImageUrl?: string;
  category?: string; // e.g. 'Best choice', 'Romance', 'For Children', 'Classics'
  favorite?: boolean;
  planToRead?: boolean;
  completed?: boolean;
  rating?: number;
}

export interface Highlight {
  id: string;
  documentId: string;
  pageNumber: number;
  text: string;
  color: string; // e.g. '#FFB74D', '#81D4FA', '#A5D6A7', '#CE93D8'
  note?: string;
  createdAt: number;
}

export interface FreehandAnnotation {
  id: string;
  documentId: string;
  pageNumber: number;
  color: string;
  strokeWidth: number;
  strokeOpacity?: number;
  penType?: 'pen' | 'highlighter' | 'marker' | 'pencil';
  paths: Array<Array<{ x: number; y: number }>>;
  createdAt: number;
}

export interface StickyNoteAnnotation {
  id: string;
  documentId: string;
  pageNumber: number;
  x: number; // percentage (0-100) relative to page
  y: number; // percentage (0-100) relative to page
  text: string;
  color: string;
  isExpanded?: boolean;
  createdAt: number;
}

export interface WordDefinition {
  word: string;
  phonetic?: string;
  translation: string;
  definition?: string;
  partOfSpeech?: string;
  grammarNote?: string;
  examples?: Array<{
    source: string;
    target: string;
  }>;
  synonyms?: string[];
  contextSentence?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  phonetic: string;
  translation: string;
  definition: string;
  partOfSpeech: string;
  grammarNote?: string;
  contextSentence: string;
  sourceDocumentId?: string;
  sourceDocumentName?: string;
  deckId?: string;
  language: string;
  dateAdded: number;
  tags: string[];
  
  // SRS (Spaced Repetition System) parameters
  srs?: {
    state: "new" | "learning" | "review" | "relearning";
    learningStepIndex: number;
    intervalDays: number;
    easeFactor: number;
    repetitions: number;
    lapses: number;
    dueAt: number;
    lastReviewedAt?: number;
  };
}

export interface UserStats {
  currentStreak: number;
  lastActiveDate: number;
  wordsMastered: number;
  dailyGoal: number; // number of flashcards to review daily
  activityHistory: Record<string, number>; // date string YYYY-MM-DD to intensity (e.g., number of actions)
}

export interface ActivityRecord {
  id: string;
  timestamp: string; // "2026-08-07 09:42:15"
  dateLabel: string; // "Day 1 (2026-01-15)"
  section: 'Bilingual Reader' | 'Flashcards SRS' | 'Library Shelf' | 'Admin Console' | 'Settings' | 'Onboarding' | 'Play-with-Script' | 'Writing Coach' | 'Writing';
  action: string; // e.g., "Opened document 'French Short Stories.pdf'"
  duration: string; // "14m 20s"
  device?: string;
  location?: string;
  type: 'navigation' | 'reading' | 'vocabulary' | 'deck' | 'settings' | 'auth';
  syncedToCloud?: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Content Moderator' | 'Educator' | 'Student';
  status: 'Active' | 'Blocked';
  joinedAt: string;
  wordsLearned: number;
  lastLogin: string;
  avatar?: string;
  targetLanguage?: string;
  notes?: string;
  totalTimeSpent?: string;
  sessionCount?: number;
  activityLogs?: ActivityRecord[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'ad' | 'message' | 'announcement' | 'system' | 'warning';
  targetUserId?: string | 'all'; // 'all' for all users, or specific userId
  targetUserName?: string;
  targetUserEmail?: string;
  senderName?: string;
  createdAt: string; // ISO string
  readBy: string[]; // array of userIds who marked as read
  dismissedBy?: string[]; // array of userIds who dismissed
  bannerUrl?: string; // image or promotional banner
  actionText?: string; // e.g. "View Offer", "Open Deck", "Try Now"
  actionUrl?: string; // internal hashtag e.g. '#flashcards' or web link
  badgeText?: string; // "SPONSORED", "DIRECT MESSAGE", "SYSTEM", "ALERT"
  priority?: 'normal' | 'high' | 'urgent';
  adId?: string; // associated ad id if generated from ad
}

export interface AppAd {
  id: string;
  title: string;
  description: string;
  targetPage: 'all' | 'home' | 'reader' | 'flashcards' | 'dictionary' | 'practice' | 'writing' | 'settings';
  targetPages?: string[]; // multi-page support if specified
  placement: 'top-banner' | 'bottom-banner' | 'modal-popup' | 'floating-card' | 'floating-left' | 'in-feed' | 'interstitial';
  badgeText?: string; // "Sponsored", "Featured", "Limited Deal", "Promo", "Announcement"
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string; // internal page route (e.g. '#practice') or external link
  active: boolean;
  createdAt: string;
  updatedAt?: string;
  startDate?: string; // ISO date string - when to begin showing
  expiresAt?: string; // ISO date string - when to automatically expire
  pausedUntil?: string; // ISO date string - temporary pause until timestamp
  pauseReason?: string;
  delaySeconds?: number; // Delay in seconds before appearing on page (e.g. 0, 3, 5, 10, 30)
  frequency?: 'always' | 'once-per-session' | 'once-ever' | 'hourly' | 'daily';
  
  // Custom Visual Styling & Multi-Design Archetypes
  cardTheme?: 'pastel-blue' | 'pastel-purple' | 'pastel-coral' | 'pastel-amber' | 'pastel-navy' | 'pastel-mint' | 'pastel-terracotta' | 'sunburst-orange' | 'clean-white' | 'dark-slate' | 'custom';
  bgColor?: string; // Hex or gradient
  textColor?: string; // Hex code for headline/text
  accentColor?: string; // Hex code for button/badge
  cardFont?: 'serif' | 'sans' | 'rounded' | 'mono'; // Typographic family
  titleSize?: 'sm' | 'md' | 'lg' | 'xl'; // Sizing of the main headline
  bodySize?: 'xs' | 'sm' | 'md'; // Sizing of the body description
  textAlign?: 'left' | 'center' | 'right'; // Where text is positioned/written
  cardLayout?: 
    | 'standard' 
    | 'horizontal-split' 
    | 'vertical-centered' 
    | 'icon-card'
    | 'chat-modal'       // Template 1: ChatGPT style modal sheet with chat bubbles & top illustration
    | 'wave-capsule'     // Template 2: Food / Restaurant delivery card with wave cutout & tags
    | 'product-counter'  // Template 3: Grocery / Item card with floating image & +/- counter
    | 'sunburst-points'  // Template 4: Radiant reward card with glowing 3D star, points & stats
    | 'invite-profit';   // Template 5: Referral / step-by-step with copyable link box

  iconBadge?: string; // Icon shown in circular top badge ('app-logo', 'sparkles', 'heart', 'zap', 'activity', 'bed', 'star', 'gift', 'shield', 'check')
  subtitlePrice?: string; // Price tag or sub-label (e.g. "$89 / Month", "+3 points", "Limited Offer", "$00.00")
  bulletPoints?: string[]; // List of perk points with checkmarks (e.g. ["Satellite coverage", "Additional lines included"])
  cardRadius?: 'normal' | 'rounded' | 'squircle' | 'pill'; // Smooth corner squircle radius
  cardWidth?: 'compact' | 'standard' | 'wide' | 'fullscreen';
  
  // Specific Archetype Customization Fields:
  chatBubbles?: string[]; // For chat-modal (e.g. ["Hey ChatGPT!", "Describe me based on our chats"])
  secondaryCtaText?: string; // e.g. "Not now", "Dismiss", "Maybe later"
  ratingText?: string; // For wave-capsule (e.g. "5.0 (10k+) • 25-30 mins")
  tagPills?: string[]; // For wave-capsule tags (e.g. ["RECOMENDING 🔥", "FREE DELIVERY 🛵"])
  statRows?: { label: string; value: string }[]; // For sunburst-points (e.g. [{label: "Epoch rank:", value: "#3,329"}, {label: "Daily generation:", value: "30 points"}])
  boostBadgeText?: string; // For sunburst-points bottom pill (e.g. "+50% boost")
  stepItems?: { icon: string; text: string }[]; // For invite-profit (e.g. [{icon: "share", text: "Share a link"}, ...])
  copyableLink?: string; // For invite-profit link box (e.g. "https://lingoflow.app/invite/alex")
  productCount?: number; // For product-counter
  
  themeColor?: string; // Hex color for badge / button / accent fallback
  clicksCount?: number;
  impressionsCount?: number;
  dismissedBy?: string[];
}

export interface ReaderSettings {
  appTheme?: 'light' | 'dark' | 'system';
  hasCompletedOnboarding?: boolean;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  isPasswordProtected?: boolean;
  appPassword?: string;
  fontSize: number; // 14 to 28
  fontFamily: 'serif' | 'sans' | 'mono';
  lineHeight: number; // 1.4 to 2.2
  readerTheme: ReaderTheme;
  autoTranslateOnClick: boolean;
  targetLanguage: string; // e.g. "English", "Spanish", "French", "German", "Arabic"
  translationLanguage?: string; // Destination language for reader instant translations (e.g. "French", "Arabic", "English", "Spanish", "German")
  interfaceLanguage?: string; // e.g. "English", "French", "Arabic", "Spanish", "German"
  ttsVoiceRate: number; // 0.8 to 1.2
  geminiVoice?: 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir';
  geminiTtsSpeed?: number;
  geminiVoiceEngine?: 'gemini' | 'native';
  showHighlights: boolean;
  showNotes: boolean;
  strokeColor: string;
  strokeWidth: number;
  strokeOpacity?: number;
  penType?: 'pen' | 'highlighter' | 'marker' | 'pencil';
}
