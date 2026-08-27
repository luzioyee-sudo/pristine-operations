// @ts-nocheck
import React, { useState } from 'react';
import { RibbleLogo } from './RibbleLogo';
import {
  Home,
  BookOpen,
  Settings,
  Layers,
  Users,
  ChevronDown,
  Check,
  Library,
  Target,
  PanelLeft,
  SquarePen,
  Search,
  MessageSquare,
  Sparkles,
  X,
  Brain,
  LogOut,
  SpellCheck,
  Bell,
  PenLine,
  BookOpenText,
  BookA,
  BookMarked,
  Youtube
} from 'lucide-react';
import { getTranslation } from '../utils/i18n';
import { getEffectiveAvatar } from '../utils/defaultAvatars';
import { AppView, UserAccount, ReaderSettings } from '../types';
import { DualFlagLanguageSelector } from './DualFlagLanguageSelector';

interface HeaderProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  syncStatus?: 'idle' | 'syncing' | 'registered';
  onRegisterSync?: () => void;
  interfaceLanguage?: string;
  targetLanguage?: string;
  onUpdateSettings?: (settings: Partial<ReaderSettings>) => void;
  user?: { name: string; email: string } | null;
  userEmail?: string;
  userAvatar?: string;
  userName?: string;
  currentUserRole?: 'Content Moderator' | 'Educator' | 'Student';
  allAccounts?: UserAccount[];
  activeUserId?: string;
  onSwitchUser?: (userId: string) => void;
  onSignOut?: () => void;
  isCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  onOpenGeminiVoice?: () => void;
  unreadNotificationsCount?: number;
  onTriggerOnboarding?: () => void;
}

// Header Component
// Toggles between minimal icon strip and full expanded sidebar menu
export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  syncStatus = 'idle',
  onRegisterSync,
  interfaceLanguage = 'English',
  targetLanguage = 'French',
  onUpdateSettings,
  user = null,
  userEmail,
  userAvatar,
  userName,
  currentUserRole = 'Student',
  allAccounts = [],
  activeUserId = 'usr-1',
  onSwitchUser,
  onSignOut,
  isCollapsed = false,
  onToggleSidebar,
  onOpenSearch,
  onOpenNotifications,
  onOpenGeminiVoice,
  unreadNotificationsCount = 0,
  onTriggerOnboarding,
}) => {
  const t = getTranslation(interfaceLanguage);
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);

  const activeAccount = allAccounts.find((a) => a.id === activeUserId) || allAccounts[0];
  const currentName = user?.name || userName || activeAccount?.name || 'User';
  const currentEmail = user?.email || userEmail || activeAccount?.email || 'mopl8065@gmail.com';

  // Derive initials (e.g. MO)
  const userInitials = currentName
    ? currentName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'MO';

  return (
    <header
      className={`hidden md:flex h-screen sticky top-0 bg-[#EFF1EE] border-e border-[#D0D2CF] py-5 flex-col justify-between items-center select-none z-40 shrink-0 transition-all duration-300 ${
        isCollapsed ? 'w-16 px-2' : 'w-64 px-4'
      }`}
    >
      {/* Expanded / Collapsed Header Content */}
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Top Controls Header Cluster */}
        <div className="flex flex-col gap-2.5 w-full">
          <div className={`flex w-full ${isCollapsed ? 'flex-col gap-2 items-center justify-center' : 'flex-row items-center justify-between px-1'}`}>
            <div 
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => setActiveView('home')}
            >
              <RibbleLogo showWordmark={!isCollapsed} size="sm" />
            </div>

            {/* Top action button: Collapse Sidebar */}
            <div className="flex items-center gap-1.5">
              {/* Toggle Sidebar Panel Button */}
              <button
                onClick={onToggleSidebar}
                className="w-8 h-8 rounded-xl bg-white border border-[#D0D2CF] text-[#222222] flex items-center justify-center hover:bg-[#D0D2CF] transition-all cursor-pointer active:scale-95 shrink-0"
                title={isCollapsed ? (t.expandSidebar || "Expand Sidebar") : (t.collapseSidebar || "Collapse Sidebar")}
              >
                <PanelLeft className="w-4 h-4 stroke-[1.8]" />
              </button>
            </div>
          </div>

          {/* Quick Search Tool (Grouped in Top Header Cluster) */}
          <div className="flex flex-col gap-1 w-full">
            <button
              onClick={onOpenSearch}
              className={`flex items-center gap-2 p-2 rounded-xl text-[#222222] hover:bg-white transition-all cursor-pointer text-start ${
                isCollapsed ? 'justify-center w-8 h-8 self-center' : 'w-full px-2.5 bg-white border border-[#D0D2CF]'
              }`}
              title={t.search || "Search Documents & Vocabulary"}
            >
              <Search className="w-4 h-4 stroke-[1.8] shrink-0 text-[#666666]" />
              {!isCollapsed && <span className="text-[11px] font-semibold text-[#666666] truncate">{t.search || "Search..."}</span>}
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex flex-col gap-1 w-full pt-1">
          {/* 1. Home / Dashboard */}
          <button
            onClick={() => setActiveView('home')}
            className={`flex items-center gap-2.5 p-2.5 rounded-2xl transition-all cursor-pointer text-start ${
              isCollapsed ? 'justify-center' : 'px-3.5'
            } ${
              activeView === 'home'
                ? 'text-[#222222] bg-[#A4F5A6] font-bold shadow-xs'
                : 'text-[#222222]/80 hover:text-[#222222] hover:bg-[#D0D2CF]/40'
            }`}
            title={t.navHome || 'Dashboard'}
          >
            <Home className="w-4 h-4 stroke-[2] shrink-0" />
            {!isCollapsed && <span className="text-xs truncate">{t.navHome || 'Dashboard'}</span>}
          </button>

          {/* 2. Library */}
          <button
            onClick={() => setActiveView('reader')}
            className={`flex items-center gap-2.5 p-2.5 rounded-2xl transition-all cursor-pointer text-start ${
              isCollapsed ? 'justify-center' : 'px-3.5'
            } ${
              activeView === 'reader'
                ? 'text-[#222222] bg-[#A4F5A6] font-bold shadow-xs'
                : 'text-[#222222]/80 hover:text-[#222222] hover:bg-[#D0D2CF]/40'
            }`}
            title={t.navLibrary || 'Library'}
          >
            <BookOpen className="w-4 h-4 stroke-[2] shrink-0" />
            {!isCollapsed && <span className="text-xs truncate">{t.navLibrary || 'Library'}</span>}
          </button>

          {/* Flashcards */}
          <button
            onClick={() => setActiveView('flashcards')}
            className={`flex items-center gap-2.5 p-2.5 rounded-2xl transition-all cursor-pointer text-start ${
              isCollapsed ? 'justify-center' : 'px-3.5'
            } ${
              activeView === 'flashcards'
                ? 'text-[#222222] bg-[#A4F5A6] font-bold shadow-xs'
                : 'text-[#222222]/80 hover:text-[#222222] hover:bg-[#D0D2CF]/40'
            }`}
            title={t.navFlashcards || 'Flashcards'}
          >
            <Layers className="w-4 h-4 stroke-[2] shrink-0" />
            {!isCollapsed && <span className="text-xs truncate">{t.navFlashcards || 'Flashcards'}</span>}
          </button>

          {/* Dictionary */}
          <button
            onClick={() => setActiveView('dictionary')}
            className={`flex items-center gap-2.5 p-2.5 rounded-2xl transition-all cursor-pointer text-start ${
              isCollapsed ? 'justify-center' : 'px-3.5'
            } ${
              activeView === 'dictionary'
                ? 'text-[#222222] bg-[#A4F5A6] font-bold shadow-xs'
                : 'text-[#222222]/80 hover:text-[#222222] hover:bg-[#D0D2CF]/40'
            }`}
            title={t.navDictionary || 'Dictionary'}
          >
            <BookA className="w-4 h-4 stroke-[2] shrink-0" />
            {!isCollapsed && <span className="text-xs truncate">{t.navDictionary || 'Dictionary'}</span>}
          </button>

          {/* Practicing / Practice Hub */}
          <button
            onClick={() => setActiveView('practice')}
            className={`flex items-center gap-2.5 p-2.5 rounded-2xl transition-all cursor-pointer text-start ${
              isCollapsed ? 'justify-center' : 'px-3.5'
            } ${
              activeView === 'practice'
                ? 'text-[#222222] bg-[#A4F5A6] font-bold shadow-xs'
                : 'text-[#222222]/80 hover:text-[#222222] hover:bg-[#D0D2CF]/40'
            }`}
            title={t.navPractice || 'Practicing & Active Retrieval'}
          >
            <Brain className="w-4 h-4 stroke-[2] shrink-0" />
            {!isCollapsed && <span className="text-xs truncate">{t.navPractice || 'Practicing'}</span>}
          </button>

          {/* 4. Writing Assistant */}
          <button
            onClick={() => setActiveView('writing')}
            className={`flex items-center gap-2.5 p-2.5 rounded-2xl transition-all cursor-pointer text-start ${
              isCollapsed ? 'justify-center' : 'px-3.5'
            } ${
              activeView === 'writing'
                ? 'text-[#222222] bg-[#A4F5A6] font-bold shadow-xs'
                : 'text-[#222222]/80 hover:text-[#222222] hover:bg-[#D0D2CF]/40'
            }`}
            title={t.navWriting || 'Writing Assistant'}
          >
            <PenLine className="w-4 h-4 stroke-[2] shrink-0" />
            {!isCollapsed && <span className="text-xs truncate">{t.navWriting || 'Writing'}</span>}
          </button>

          {/* Video Player */}
          <button
            onClick={() => setActiveView('video')}
            className={`flex items-center gap-2.5 p-2.5 rounded-2xl transition-all cursor-pointer text-start ${
              isCollapsed ? 'justify-center' : 'px-3.5'
            } ${
              activeView === 'video'
                ? 'text-[#222222] bg-[#A4F5A6] font-bold shadow-xs'
                : 'text-[#222222]/80 hover:text-[#222222] hover:bg-[#D0D2CF]/40'
            }`}
            title="Video player"
          >
            <Youtube className="w-4 h-4 stroke-[2] shrink-0 text-[#222222]" />
            {!isCollapsed && <span className="text-xs truncate font-medium">Video player</span>}
          </button>

          {/* Settings */}
          <button
            onClick={() => setActiveView('settings')}
            className={`flex items-center gap-2.5 p-2.5 rounded-2xl transition-all cursor-pointer text-start ${
              isCollapsed ? 'justify-center' : 'px-3.5'
            } ${
              activeView === 'settings'
                ? 'text-[#222222] bg-[#A4F5A6] font-bold shadow-xs'
                : 'text-[#222222]/80 hover:text-[#222222] hover:bg-[#D0D2CF]/40'
            }`}
            title={t.navSettings || 'Settings'}
          >
            <Settings className="w-4 h-4 stroke-[2] shrink-0" />
            {!isCollapsed && <span className="text-xs truncate">{t.navSettings || 'Settings'}</span>}
          </button>
        </div>
      </div>

      {/* Bottom User Avatar / Profile Section */}
      <div className="relative mt-auto pt-3 w-full flex flex-col gap-2">
        {isCollapsed ? (
          <div className="flex justify-center">
            <button
              onClick={() => setIsAccountSwitcherOpen(!isAccountSwitcherOpen)}
              title={`${currentName} (${currentEmail})`}
              className="w-9 h-9 rounded-full bg-[#222222] text-[#EFF1EE] flex items-center justify-center font-bold text-xs tracking-wide shadow-xs hover:scale-105 transition-transform cursor-pointer border border-[#D0D2CF] overflow-hidden"
            >
              <img 
                src={getEffectiveAvatar(activeAccount?.avatar || userAvatar, activeAccount?.id || activeAccount?.name || userName)} 
                alt={currentName} 
                className="w-full h-full object-cover" 
              />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAccountSwitcherOpen(!isAccountSwitcherOpen)}
            className="w-full flex items-center justify-between p-2 rounded-2xl bg-white border border-[#D0D2CF] hover:bg-[#EFF1EE] transition-all cursor-pointer text-start"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#222222] text-[#EFF1EE] flex items-center justify-center font-extrabold text-xs shrink-0 overflow-hidden ring-2 ring-white">
                <img 
                  src={getEffectiveAvatar(activeAccount?.avatar || userAvatar, activeAccount?.id || activeAccount?.name || userName)} 
                  alt={currentName} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-extrabold text-[#222222] truncate">
                  {currentName}
                </span>
                <span className="text-[10px] text-[#666666] truncate font-medium">
                  {currentEmail}
                </span>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#666666] shrink-0 transition-transform ${isAccountSwitcherOpen ? 'rotate-180' : ''}`} />
          </button>
        )}

        {/* User Info Popover */}
        {isAccountSwitcherOpen && (
          <div className={`absolute bottom-full mb-3 bg-white border border-[#D0D2CF] rounded-2xl shadow-xl p-3.5 z-50 flex flex-col gap-3 ${
            isCollapsed ? 'start-0 w-64' : 'inset-x-0'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#222222] text-[#EFF1EE] flex items-center justify-center font-extrabold text-xs shrink-0 overflow-hidden ring-2 ring-[#EFF1EE] shadow-xs">
                <img 
                  src={getEffectiveAvatar(activeAccount?.avatar || userAvatar, activeAccount?.id || activeAccount?.name || userName)} 
                  alt={currentName} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-bold text-[#222222] truncate">
                  {currentName}
                </span>
                <span className="text-xs text-[#666666] truncate font-medium">
                  {currentEmail}
                </span>
              </div>
            </div>

            {onSignOut && (
              <div className="pt-2 border-t border-[#D0D2CF]">
                <button
                  onClick={() => {
                    setIsAccountSwitcherOpen(false);
                    onSignOut();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-start"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>{t.logOut || 'Log Out'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};


