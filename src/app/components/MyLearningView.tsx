// @ts-nocheck
import React, { useMemo } from 'react';
import { UserStats, ReaderSettings } from '../types';
import { storage } from '../utils/storage';
import { Brain, Trophy, Flame, Target, BookOpen, LayoutDashboard, CheckCircle2, Clock } from 'lucide-react';
import { getTranslation } from '../utils/i18n';
import { LANGUAGE_OPTIONS } from './DualFlagLanguageSelector';

interface MyLearningViewProps {
  settings: ReaderSettings;
  userStats: UserStats;
}

export const MyLearningView: React.FC<MyLearningViewProps> = ({ settings, userStats }) => {
  const t = getTranslation(settings.interfaceLanguage);
  const activeId = localStorage.getItem('lingoflow_current_user_id') || 'usr-1';
  
  const aggregatedStats = useMemo(() => {
    let totalVocab = 0;
    let totalDocs = 0;
    let maxStreak = 0;
    const langStats: Record<string, { vocab: number; docs: number; streak: number; flag: string; status: string }> = {};

    LANGUAGE_OPTIONS.forEach(lang => {
       const cleanLang = lang.name.toLowerCase().trim().replace(/\s+/g, '_');
       const vocab = storage.getVocabulary(activeId, cleanLang);
       const docs = storage.getDocuments(activeId, cleanLang);
       const stats = storage.getUserStats(activeId, cleanLang);
       
       const streak = stats?.currentStreak || 0;
       if (streak > maxStreak) {
          maxStreak = streak;
       }
       
       totalVocab += vocab.length;
       totalDocs += docs.length;

       const isActive = vocab.length > 0 || docs.length > 0 || streak > 0;

       langStats[lang.name] = {
          vocab: vocab.length,
          docs: docs.length,
          streak,
          flag: lang.flag,
          status: isActive ? 'Active' : 'Not Started'
       };
    });
    
    return {
       totalVocab,
       totalDocs,
       maxStreak,
       langStats
    };
  }, [activeId, settings.targetLanguage, userStats]);

  return (
    <div className="max-w-5xl mx-auto w-full pb-20 px-4 sm:px-6">
      <div className="mb-8 pt-4">
        <h1 className="text-3xl font-black text-[#222222] dark:text-[#EFF1EE] tracking-tight mb-2 flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-[#1856B7] dark:text-[#A4F5A6]" />
          My Learning Dashboard
        </h1>
        <p className="text-[#666666] dark:text-[#D0D2CF] text-base font-medium">
          Your stable global progress overview across all language profiles.
        </p>
      </div>

      {/* Global Stable Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-[#2C2C2E] rounded-3xl p-6 border border-[#E6DFD3] dark:border-[#3A3A3C] shadow-xs flex flex-col items-center text-center">
           <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
              <Flame className="w-7 h-7 text-orange-500" />
           </div>
           <span className="text-4xl font-black text-[#222222] dark:text-[#EFF1EE] mb-1">{aggregatedStats.maxStreak}</span>
           <span className="text-[#666666] dark:text-[#A1A1AA] text-sm font-bold uppercase tracking-wider">Global Streak</span>
        </div>
        
        <div className="bg-white dark:bg-[#2C2C2E] rounded-3xl p-6 border border-[#E6DFD3] dark:border-[#3A3A3C] shadow-xs flex flex-col items-center text-center">
           <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <Brain className="w-7 h-7 text-blue-500" />
           </div>
           <span className="text-4xl font-black text-[#222222] dark:text-[#EFF1EE] mb-1">{aggregatedStats.totalVocab}</span>
           <span className="text-[#666666] dark:text-[#A1A1AA] text-sm font-bold uppercase tracking-wider">Total Words Learned</span>
        </div>

        <div className="bg-white dark:bg-[#2C2C2E] rounded-3xl p-6 border border-[#E6DFD3] dark:border-[#3A3A3C] shadow-xs flex flex-col items-center text-center">
           <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
              <BookOpen className="w-7 h-7 text-emerald-500" />
           </div>
           <span className="text-4xl font-black text-[#222222] dark:text-[#EFF1EE] mb-1">{aggregatedStats.totalDocs}</span>
           <span className="text-[#666666] dark:text-[#A1A1AA] text-sm font-bold uppercase tracking-wider">Total Books Read</span>
        </div>
      </div>

      {/* Status of Each Language Section */}
      <div className="flex items-center justify-between mb-6 border-b border-[#E6DFD3] dark:border-[#3A3A3C] pb-2">
        <h2 className="text-xl font-bold text-[#222222] dark:text-[#EFF1EE]">
          Status of Each Language
        </h2>
        <span className="text-xs font-semibold text-[#666666] dark:text-stone-400">
          {LANGUAGE_OPTIONS.length} Languages Tracked
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(aggregatedStats.langStats).map(([langName, stats]: [string, any]) => (
          <div key={langName} className="bg-white dark:bg-[#2C2C2E] p-5 rounded-2xl border border-[#E6DFD3] dark:border-[#3A3A3C] shadow-xs flex items-center justify-between hover:border-[#1856B7] dark:hover:border-[#A4F5A6] transition-colors">
            <div className="flex items-center gap-4">
               <span className="text-4xl">{stats.flag}</span>
               <div>
                 <div className="flex items-center gap-2">
                   <h3 className="text-base font-bold text-[#222222] dark:text-[#EFF1EE]">{langName}</h3>
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                     stats.status === 'Active' 
                       ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                       : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                   }`}>
                     {stats.status}
                   </span>
                 </div>
                 <p className="text-xs text-[#666666] dark:text-[#A1A1AA] mt-0.5 flex items-center gap-1">
                   <Flame className="w-3.5 h-3.5 text-orange-500 inline" /> {stats.streak} day streak
                 </p>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-bold text-[#222222] dark:text-[#EFF1EE] bg-[#F4F4F5] dark:bg-[#3A3A3C] px-3 py-1 rounded-full">
                     {stats.vocab} words
                  </span>
                  <span className="text-xs font-bold text-[#222222] dark:text-[#EFF1EE] bg-[#F4F4F5] dark:bg-[#3A3A3C] px-3 py-1 rounded-full">
                     {stats.docs} books
                  </span>
               </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
