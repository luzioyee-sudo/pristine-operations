// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  Layers, 
  FileText, 
  ChevronRight, 
  LayoutGrid, 
  Terminal, 
  HelpCircle, 
  Sparkles, 
  LogOut, 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Palette, 
  Folder as FolderIcon, 
  Plus, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { DocumentFile, VocabularyItem, AppView, Folder, Deck } from '../types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentFile[];
  vocabulary: VocabularyItem[];
  folders: Folder[];
  decks: Deck[];
  isAdmin?: boolean;
  userRole?: string;
  onSelectDocument: (doc: DocumentFile) => void;
  onNavigateView: (view: AppView) => void;
  onOpenUpload: () => void;
  onOpenCreateFlashcard: () => void;
  onSelectWord: (word: string) => void;
  onSelectSettingsTab: (tab: string) => void;
  onResetData: () => void;
  onLogout?: () => void;
}

type SearchCategory = 'all' | 'pages' | 'documents' | 'words' | 'actions';

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  documents,
  vocabulary,
  folders,
  decks,
  isAdmin = false,
  userRole = 'Student',
  onSelectDocument,
  onNavigateView,
  onOpenUpload,
  onOpenCreateFlashcard,
  onSelectWord,
  onSelectSettingsTab,
  onResetData,
  onLogout,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');

  const cleanQuery = query.trim().toLowerCase();

  const isUserAdmin = isAdmin || userRole === 'Admin' || userRole === 'Educator';

  // Static items (Pages, Settings tabs, and Actions)
  const staticItems = useMemo(() => [
    // --- PAGES ---
    {
      id: 'page-home',
      name: 'Home Dashboard',
      description: 'Your main dashboard with stats, streaks, and recommendations',
      category: 'pages',
      type: 'Page',
      icon: LayoutGrid,
      action: () => onNavigateView('home')
    },
    {
      id: 'page-library',
      name: 'Library & Reader Shelf',
      description: 'Browse all your books, uploaded PDFs, and sample files',
      category: 'pages',
      type: 'Page',
      icon: BookOpen,
      action: () => onNavigateView('reader')
    },
    {
      id: 'page-dictionary',
      name: 'My Dictionary & Vocabulary',
      description: 'Search, learn, and manage your saved translation cards',
      category: 'pages',
      type: 'Page',
      icon: HelpCircle,
      action: () => onNavigateView('dictionary')
    },
    {
      id: 'page-flashcards',
      name: 'SRS Flashcards Review',
      description: 'Review cards and learn vocabulary using spaced repetition',
      category: 'pages',
      type: 'Page',
      icon: Layers,
      action: () => onNavigateView('flashcards-view')
    },
    {
      id: 'page-all-tools',
      name: 'All Tools & Utilities',
      description: 'Directory of all study, translation, and custom utilities',
      category: 'pages',
      type: 'Page',
      icon: Sparkles,
      action: () => onNavigateView('all-tools')
    },
    ...(isUserAdmin ? [{
      id: 'page-admin',
      name: 'Admin & Educator Dashboard',
      description: 'User management, database diagnostics, and stats',
      category: 'pages',
      type: 'Page',
      icon: Terminal,
      action: () => onNavigateView('admin-dashboard')
    }] : []),

    // --- SETTINGS TABS ---
    {
      id: 'set-profile',
      name: 'Profile & Account Settings',
      description: 'Manage username, email, personalized roles, and avatars',
      category: 'pages',
      type: 'Settings',
      icon: User,
      action: () => onSelectSettingsTab('profile')
    },
    {
      id: 'set-security',
      name: 'Password & Screen Security',
      description: 'Enable custom passcode lock protection on the application',
      category: 'pages',
      type: 'Settings',
      icon: Lock,
      action: () => onSelectSettingsTab('security')
    },
    {
      id: 'set-notifications',
      name: 'Notification Settings',
      description: 'Configure reminders, daily streak alert schedules',
      category: 'pages',
      type: 'Settings',
      icon: Bell,
      action: () => onSelectSettingsTab('notifications')
    },
    {
      id: 'set-[#A4F5A6]',
      name: 'Interface & Content Language',
      description: 'Choose your native and foreign target study language',
      category: 'pages',
      type: 'Settings',
      icon: Globe,
      action: () => onSelectSettingsTab('languages')
    },
    {
      id: 'set-[#222222]',
      name: 'Appearance Theme Options',
      description: 'Toggle Light, Dark, or System visual themes easily',
      category: 'pages',
      type: 'Settings',
      icon: Palette,
      action: () => onSelectSettingsTab('appearance')
    },
    {
      id: 'set-help',
      name: 'Help Center & Support FAQs',
      description: 'Browse helpful tips, user manual details, and contact help',
      category: 'pages',
      type: 'Settings',
      icon: HelpCircle,
      action: () => onSelectSettingsTab('help')
    },

    // --- QUICK SHORTCUT ACTIONS ---
    {
      id: 'act-upload',
      name: 'Upload PDF or TEXT File',
      description: 'Directly import books, stories, or language files to read',
      category: 'actions',
      type: 'Action',
      icon: Plus,
      action: () => onOpenUpload()
    },
    {
      id: 'act-card',
      name: 'Create New Flashcard',
      description: 'Manually add a word, definition, and example context',
      category: 'actions',
      type: 'Action',
      icon: Plus,
      action: () => onOpenCreateFlashcard()
    },
    {
      id: 'act-reset',
      name: 'Reset App Data to Defaults',
      description: 'Clear local database caches and restore initial state',
      category: 'actions',
      type: 'Danger Action',
      icon: RotateCcw,
      action: () => {
        if (confirm('Reset all saved local reader data back to defaults?')) {
          onResetData();
        }
      }
    },
    {
      id: 'act-logout',
      name: 'Log Out of Account',
      description: 'Sign out and return to the login or welcome screen',
      category: 'actions',
      type: 'Auth Action',
      icon: LogOut,
      action: () => {
        if (onLogout) onLogout();
      }
    }
  ], [onNavigateView, onSelectSettingsTab, onOpenUpload, onOpenCreateFlashcard, onResetData, onLogout]);

  // Dynamic filter arrays
  const filteredDocs = useMemo(() => {
    if (!cleanQuery) return documents.slice(0, 5);
    return documents.filter(
      (d) =>
        d.name.toLowerCase().includes(cleanQuery) ||
        (d.title && d.title.toLowerCase().includes(cleanQuery)) ||
        (d.author && d.author.toLowerCase().includes(cleanQuery)) ||
        (d.language && d.language.toLowerCase().includes(cleanQuery))
    );
  }, [documents, cleanQuery]);

  const filteredVocab = useMemo(() => {
    if (!cleanQuery) return vocabulary.slice(0, 5);
    return vocabulary.filter(
      (v) =>
        v.word.toLowerCase().includes(cleanQuery) ||
        v.translation.toLowerCase().includes(cleanQuery) ||
        (v.definition && v.definition.toLowerCase().includes(cleanQuery))
    );
  }, [vocabulary, cleanQuery]);

  const filteredFolders = useMemo(() => {
    if (!cleanQuery) return folders.slice(0, 3);
    return folders.filter((f) => f.name.toLowerCase().includes(cleanQuery));
  }, [folders, cleanQuery]);

  const filteredDecks = useMemo(() => {
    if (!cleanQuery) return decks.slice(0, 3);
    return decks.filter((d) => d.name.toLowerCase().includes(cleanQuery));
  }, [decks, cleanQuery]);

  const filteredStatic = useMemo(() => {
    if (!cleanQuery) return staticItems;
    return staticItems.filter(
      (item) =>
        item.name.toLowerCase().includes(cleanQuery) ||
        item.description.toLowerCase().includes(cleanQuery)
    );
  }, [staticItems, cleanQuery]);

  // Check categories
  const showPages = activeCategory === 'all' || activeCategory === 'pages';
  const showDocs = activeCategory === 'all' || activeCategory === 'documents';
  const showWords = activeCategory === 'all' || activeCategory === 'words';
  const showActions = activeCategory === 'all' || activeCategory === 'actions';

  const totalResults = 
    filteredStatic.length + 
    filteredDocs.length + 
    filteredVocab.length + 
    filteredFolders.length + 
    filteredDecks.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 md:pt-16 px-4 bg-stone-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10 cursor-default" onClick={onClose} />

      <div
        className="w-full max-w-xl bg-white dark:bg-[#1E1E1E] border border-stone-200/90 dark:border-stone-800/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] md:max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input bar */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center gap-3 bg-stone-50/50 dark:bg-stone-900/50">
          <Search className="w-5 h-5 text-[#222222] dark:text-[#A4F5A6] shrink-0 stroke-[2.2]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files, views, dictionary, actions..."
            autoFocus
            className="w-full bg-transparent text-sm font-semibold text-stone-900 dark:text-stone-100 placeholder:text-stone-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-xl bg-[#EFF1EE] hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-[11px] font-bold text-[#222222] dark:text-stone-300 transition-all cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Categories filters tab bar */}
        <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-stone-50/20 dark:bg-stone-900/20">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'pages', label: 'Pages & Settings' },
            { id: 'documents', label: 'Books & Files' },
            { id: 'words', label: 'Words' },
            { id: 'actions', label: 'Shortcuts' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as SearchCategory)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#222222] text-[#A4F5A6] dark:bg-[#A4F5A6] dark:text-[#222222] shadow-2xs font-extrabold'
                  : 'bg-[#EFF1EE] dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Scrollable results section */}
        <div className="p-4 overflow-y-auto space-y-5 custom-scrollbar bg-white dark:bg-[#1E1E1E]">
          
          {totalResults === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-stone-400">No matching items or shortcuts found.</p>
              <p className="text-xs text-stone-400/80 mt-1">Try another search term or click clear.</p>
            </div>
          )}

          {/* 1. PAGES & SETTINGS SECTION */}
          {showPages && filteredStatic.filter(s => s.category === 'pages').length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <LayoutGrid className="w-3.5 h-3.5 text-[#222222] dark:text-[#A4F5A6]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Pages & Navigation ({filteredStatic.filter(s => s.category === 'pages').length})
                </span>
              </div>
              <div className="space-y-1">
                {filteredStatic.filter(s => s.category === 'pages').map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.action();
                        onClose();
                      }}
                      className="w-full p-2.5 rounded-2xl bg-stone-50/60 dark:bg-stone-800/40 hover:bg-[#A4F5A6]/20 dark:hover:bg-[#A4F5A6]/10 border border-stone-200/50 dark:border-stone-800/50 hover:border-[#A4F5A6]/60 flex items-center justify-between transition-all cursor-pointer text-start group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[#EFF1EE] dark:bg-stone-800 text-[#222222] dark:text-stone-300 flex items-center justify-center group-hover:bg-[#A4F5A6] group-hover:text-[#222222] transition-all">
                          <IconComp className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-stone-800 dark:text-stone-100 group-hover:text-[#222222] dark:group-hover:text-[#A4F5A6] flex items-center gap-1.5">
                            {item.name}
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#EFF1EE] dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                              {item.type}
                            </span>
                          </p>
                          <p className="text-[10px] text-stone-400 truncate mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#222222] dark:group-hover:text-[#A4F5A6] group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. DOCUMENTS & BOOKS SECTION */}
          {showDocs && filteredDocs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <BookOpen className="w-3.5 h-3.5 text-[#222222] dark:text-[#A4F5A6]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Documents & Books ({filteredDocs.length})
                </span>
              </div>
              <div className="space-y-1">
                {filteredDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      onSelectDocument(doc);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-2xl bg-stone-50/60 dark:bg-stone-800/40 hover:bg-[#A4F5A6]/20 dark:hover:bg-[#A4F5A6]/10 border border-stone-200/50 dark:border-stone-800/50 hover:border-[#A4F5A6]/60 flex items-center justify-between transition-all cursor-pointer text-start group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#EFF1EE] dark:bg-stone-800 text-[#222222] dark:text-stone-300 flex items-center justify-center group-hover:bg-[#A4F5A6] group-hover:text-[#222222] transition-all">
                        <FileText className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-stone-800 dark:text-stone-100 truncate group-hover:text-[#222222] dark:group-hover:text-[#A4F5A6]">
                          {doc.name}
                        </p>
                        <p className="text-[10px] text-stone-400 truncate mt-0.5">
                          {doc.totalPages || 1} pages • {doc.language || 'Auto'} • {doc.fileType.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#222222] dark:group-hover:text-[#A4F5A6] group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. FOLDERS & SRS DECK SECTIONS */}
          {showDocs && (filteredFolders.length > 0 || filteredDecks.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredFolders.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <FolderIcon className="w-3.5 h-3.5 text-[#222222] dark:text-[#A4F5A6]" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Folders ({filteredFolders.length})
                    </span>
                  </div>
                  <div className="space-y-1">
                    {filteredFolders.map((fold) => (
                      <button
                        key={fold.id}
                        onClick={() => {
                          onNavigateView('reader');
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-2xl bg-stone-50/60 dark:bg-stone-800/40 hover:bg-[#A4F5A6]/20 dark:hover:bg-[#A4F5A6]/10 border border-stone-200/50 dark:border-stone-800/50 hover:border-[#A4F5A6]/60 flex items-center justify-between transition-all cursor-pointer text-start group"
                      >
                        <div className="min-w-0 flex items-center gap-2">
                          <FolderIcon className="w-4 h-4 text-[#222222] dark:text-[#A4F5A6] shrink-0" />
                          <p className="text-xs font-extrabold text-stone-800 dark:text-stone-100 truncate group-hover:text-[#222222] dark:group-hover:text-[#A4F5A6]">
                            {fold.name}
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredDecks.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <Layers className="w-3.5 h-3.5 text-[#222222] dark:text-[#A4F5A6]" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Decks ({filteredDecks.length})
                    </span>
                  </div>
                  <div className="space-y-1">
                    {filteredDecks.map((deck) => (
                      <button
                        key={deck.id}
                        onClick={() => {
                          onNavigateView('flashcards-view');
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-2xl bg-stone-50/60 dark:bg-stone-800/40 hover:bg-[#A4F5A6]/20 dark:hover:bg-[#A4F5A6]/10 border border-stone-200/50 dark:border-stone-800/50 hover:border-[#A4F5A6]/60 flex items-center justify-between transition-all cursor-pointer text-start group"
                      >
                        <div className="min-w-0 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#222222] dark:text-[#A4F5A6] shrink-0" />
                          <p className="text-xs font-extrabold text-stone-800 dark:text-stone-100 truncate group-hover:text-[#222222] dark:group-hover:text-[#A4F5A6]">
                            {deck.name}
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. LEARNED WORDS SECTION */}
          {showWords && filteredVocab.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <HelpCircle className="w-3.5 h-3.5 text-[#222222] dark:text-[#A4F5A6]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Vocabulary & Definitions ({filteredVocab.length})
                </span>
              </div>
              <div className="space-y-1">
                {filteredVocab.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      onSelectWord(v.word);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-2xl bg-stone-50/60 dark:bg-stone-800/40 hover:bg-[#A4F5A6]/20 dark:hover:bg-[#A4F5A6]/10 border border-stone-200/50 dark:border-stone-800/50 hover:border-[#A4F5A6]/60 flex items-center justify-between transition-all cursor-pointer text-start group"
                  >
                    <div className="min-w-0 flex-1 pe-3">
                      <p className="text-xs font-black text-stone-800 dark:text-stone-100 group-hover:text-[#222222] dark:group-hover:text-[#A4F5A6]">
                        {v.word} <span className="text-[10px] font-bold text-stone-400">({v.partOfSpeech || 'Word'})</span>
                      </p>
                      <p className="text-[11px] text-[#222222] dark:text-[#A4F5A6] font-bold truncate mt-0.5">
                        {v.translation || v.definition}
                      </p>
                      {v.contextSentence && (
                        <p className="text-[10px] text-stone-400 truncate italic mt-0.5">
                          "{v.contextSentence}"
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] font-extrabold text-[#222222] dark:text-[#A4F5A6] px-2.5 py-1 rounded-xl bg-[#EFF1EE] dark:bg-stone-800 group-hover:bg-[#222222] group-hover:text-[#A4F5A6] transition-all shrink-0">
                      Explain
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. SHORTCUT ACTIONS SECTION */}
          {showActions && filteredStatic.filter(s => s.category === 'actions').length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <Terminal className="w-3.5 h-3.5 text-[#222222] dark:text-[#A4F5A6]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  App Actions & Shortcuts ({filteredStatic.filter(s => s.category === 'actions').length})
                </span>
              </div>
              <div className="space-y-1">
                {filteredStatic.filter(s => s.category === 'actions').map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.action();
                        onClose();
                      }}
                      className="w-full p-2.5 rounded-2xl bg-stone-50/60 dark:bg-stone-800/40 hover:bg-[#A4F5A6]/20 dark:hover:bg-[#A4F5A6]/10 border border-stone-200/50 dark:border-stone-800/50 hover:border-[#A4F5A6]/60 flex items-center justify-between transition-all cursor-pointer text-start group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[#EFF1EE] dark:bg-stone-800 text-[#222222] dark:text-stone-300 flex items-center justify-center group-hover:bg-[#A4F5A6] group-hover:text-[#222222] transition-all">
                          <IconComp className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-stone-800 dark:text-stone-100 group-hover:text-[#222222] dark:group-hover:text-[#A4F5A6] flex items-center gap-1.5">
                            {item.name}
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                              item.type.includes('Danger')
                                ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                : 'bg-[#A4F5A6] text-[#222222]'
                            }`}>
                              {item.type}
                            </span>
                          </p>
                          <p className="text-[10px] text-stone-400 truncate mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#222222] dark:group-hover:text-[#A4F5A6] group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
