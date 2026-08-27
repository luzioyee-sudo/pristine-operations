// @ts-nocheck
import { getTranslation } from '../utils/i18n';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, BookOpen, Layers, Library, Brain, Settings, Sparkles, ChevronRight, SquarePen, Youtube } from 'lucide-react';
import { AppView } from '../types';

interface AllToolsViewProps {
  settings?: any;
  onNavigate: (view: AppView) => void;
  onBack: () => void;
  userName?: string;
}

export const AllToolsView: React.FC<AllToolsViewProps> = ({ settings,  onNavigate, onBack, userName = 'Pald' }) => {
  const t = getTranslation(settings?.interfaceLanguage || 'English');
  const [searchQuery, setSearchQuery] = useState('');

  const tools = [
    {
      id: 'reader',
      title: t.navLibrary || 'Library',
      description: t.librarySubtitle || 'All your saved words and lists',
      icon: BookOpen,
      view: 'reader' as AppView,
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
    },
    {
      id: 'writing',
      title: t.writingTitle || 'Writing Practice',
      description: t.writingSubtitle || 'Draft essays, journal, and get instant grammar critiques',
      icon: SquarePen,
      view: 'writing' as AppView,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
    },
    {
      id: 'flashcards',
      title: t.navFlashcards || 'Flashcards',
      description: t.flashcardsSubtitle || 'Review words with flashcards',
      icon: Layers,
      view: 'flashcards' as AppView,
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
    },
    {
      id: 'practice',
      title: t.navPractice || 'Practicing',
      description: t.practiceSubtitle || 'Active retrieval drills, listening, sentence completion & spaced repetition',
      icon: Brain,
      view: 'practice' as AppView,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 'quizzes',
      title: t.quizzesTitle || 'Quizzes',
      description: t.quizzesSubtitle || 'Test your knowledge with language-learning quizzes',
      icon: Sparkles,
      view: 'quizzes' as AppView,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
    },
    {
      id: 'dictionary',
      title: t.navDictionary || 'Dictionary',
      description: t.dictionarySubtitle || 'Look up words and meanings',
      icon: Library,
      view: 'dictionary' as AppView,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 'youtube',
      title: 'YouTube Studio',
      description: 'Learn with interactive YouTube video transcripts',
      icon: Youtube,
      view: 'video' as AppView,
      color: 'bg-red-500/10 text-red-600 dark:text-red-400'
    },
    {
      id: 'settings',
      title: t.navSettings || 'Settings',
      description: t.settingsSubtitle || 'Preferences and account configuration',
      icon: Settings,
      view: 'settings' as AppView,
      color: 'bg-[#EFF1EE] text-[#222222] dark:text-stone-300'
    }
  ];

  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="max-w-xl mx-auto pb-24 md:pb-8 space-y-6"
    >
      {/* Top Header with Back Button */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-[#222222] dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all cursor-pointer shadow-2xs"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-[#222222] dark:text-stone-100">
          {t.allToolsTitle || 'All tools'}
        </h1>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 stroke-[2]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder || 'Search tools...'}
          className="w-full bg-stone-100 dark:bg-stone-850 border border-[#D0D2CF] dark:border-stone-700/80 rounded-2xl ps-10 pe-4 py-3 text-sm text-[#222222] dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#222222] transition-all shadow-3xs"
        />
      </div>

      {/* Tools List */}
      <div className="space-y-3">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => tool.path ? window.location.assign(tool.path) : tool.view && onNavigate(tool.view)}
              className={`w-full items-center justify-between p-4 rounded-2xl bg-white dark:bg-stone-900 border border-[#D0D2CF]/80 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 transition-all cursor-pointer group shadow-2xs hover:shadow-xs ${
                tool.id === 'settings' ? 'hidden sm:flex' : 'flex'
              }`}
            >
              <div className="flex items-center gap-3.5 text-start">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tool.color}`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#222222] dark:text-stone-100 group-hover:text-[#222222] dark:group-hover:text-[#A4F5A6] transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {tool.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
