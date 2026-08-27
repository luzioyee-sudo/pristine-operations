// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ReaderSettings, 
  ReaderTheme, 
  VocabularyItem, 
  DocumentFile, 
  UserStats, 
  Folder, 
  Deck, 
  Highlight, 
  StickyNoteAnnotation 
} from '../types';
import { getTranslation } from '../utils/i18n';
import { DEFAULT_AVATARS, getDefaultAvatar, getEffectiveAvatar } from '../utils/defaultAvatars';
import { getSupabase } from '../lib/supabase';
import {
  User,
  Bell,
  Clock,
  Crown,
  Palette,
  Globe,
  HelpCircle,
  LogOut,
  Upload,
  ChevronDown,
  RefreshCw,
  Check,
  Type,
  Terminal,
  Key,
  Copy,
  Sparkles,
  ExternalLink,
  BookOpen,
  FolderOpen,
  Calendar,
  AlertTriangle,
  Camera,
  Trash2,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  Smartphone,
  Cloud,
  Database
} from 'lucide-react';

interface SettingsModalProps {
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
  onClose?: () => void;
  onResetData: () => void;
  onLogout?: () => void;
  vocabulary: VocabularyItem[];
  documents: DocumentFile[];
  userStats: UserStats;
  folders: Folder[];
  decks: Deck[];
  highlights: Highlight[];
  stickyNotes: StickyNoteAnnotation[];
  initialTab?: string;
  onTriggerOnboarding?: () => void;
}

type SettingsTab =
  | 'profile'
  | 'security'
  | 'notifications'
  | 'reminders'
  | 'subscription'
  | 'appearance'
  | 'language'
  | 'developer'
  | 'help';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onLogout,
  vocabulary,
  documents,
  userStats,
  folders,
  decks,
  highlights,
  stickyNotes,
  initialTab,
  onTriggerOnboarding,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(() => {
    if (initialTab) return initialTab as SettingsTab;
    return 'profile';
  });

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab as SettingsTab);
    }
  }, [initialTab]);
  const [profileName, setProfileName] = useState(settings.userName || 'User');
  const [profileEmail, setProfileEmail] = useState(settings.userEmail || '');
  const [profileAvatar, setProfileAvatar] = useState(settings.userAvatar || '');
  const [studyRemindersEnabled, setStudyRemindersEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Please select an image smaller than 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 300;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setProfileAvatar(dataUrl);
        }
      };
      img.src = evt.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // AI Coach state variables
  const [coachResult, setCoachResult] = useState<any>(null);
  const [isCoachLoading, setIsCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState<string | null>(null);
  
  // Interaction/Drill states
  const [userChallengeAnswer, setUserChallengeAnswer] = useState('');
  const [showChallengeSolution, setShowChallengeSolution] = useState(false);
  const [challengeResponseLogged, setChallengeResponseLogged] = useState(false);

  // Copy success animation state indicators
  const [copiedApiKey, setCopiedApiKey] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(false);

  // Detailed view tab selection state
  const [selectedDetailView, setSelectedDetailView] = useState<SettingsTab | null>(null);

  const t = getTranslation(settings.interfaceLanguage || settings.targetLanguage);

  const handleSaveProfile = () => {
    onUpdateSettings({ 
      userName: profileName, 
      userEmail: profileEmail,
      userAvatar: profileAvatar
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const accountItems = [
    { id: 'profile' as SettingsTab, label: t.manageProfile || 'Manage Profile', icon: User, value: '' },
    { id: 'security' as SettingsTab, label: t.passwordAndSecurity || 'Password & Security', icon: Lock, value: settings.isPasswordProtected ? (t.protectedStatus || 'Protected') : (t.offStatus || 'Off') },
    { id: 'notifications' as SettingsTab, label: t.tabNotifications, icon: Bell, value: notificationsEnabled ? (t.onStatus || 'On') : (t.offStatus || 'Off') },
    { id: 'language' as SettingsTab, label: t.tabLanguage, icon: Globe, value: settings.interfaceLanguage || 'English' },
  ];

  const preferenceItems = [
    { id: 'appearance' as SettingsTab, label: t.tabAppearance, icon: Palette, value: settings.appTheme === 'dark' ? (t.themeDark || 'Dark') : settings.appTheme === 'system' ? (t.themeSystem || 'System') : (t.themeLight || 'Light') },
  ];

  const supportItems = [
    { id: 'help' as SettingsTab, label: t.helpCenter || 'Help Center', icon: HelpCircle, value: '' },
  ];

  const readerThemes: Array<{ id: ReaderTheme; name: string; bg: string; text: string }> = [
    { id: 'sunset', name: 'Ribble Mint', bg: 'bg-[#EFF1EE]', text: 'text-[#222222]' },
    { id: 'paper', name: 'Pure Clean', bg: 'bg-white', text: 'text-[#222222]' },
    { id: 'azure', name: 'Lavender Soft', bg: 'bg-[#B2A1FF]/10', text: 'text-[#222222]' },
    { id: 'sepia', name: 'Warm Cream', bg: 'bg-[#F5F4EF]', text: 'text-[#222222]' },
    { id: 'dark', name: 'Charcoal Dark', bg: 'bg-[#1E1E1E]', text: 'text-[#EFF1EE]' },
  ];

  const renderDetailPanel = (tab: SettingsTab) => {
    switch (tab) {
      case 'profile':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#222222] dark:text-[#EFF1EE]">{t.manageProfile || 'Manage Profile'}</h2>
              <p className="text-xs text-[#666666] dark:text-[#D0D2CF] mt-1">
                {t.profileSubtitle || 'Update your personal info, display name, and avatar image'}
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleAvatarFileUpload}
              className="hidden"
            />

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-2">
              <div className="sm:col-span-4 flex flex-col items-center gap-3">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-[#222222] text-[#EFF1EE] flex items-center justify-center font-bold text-3xl shadow-md border-4 border-white dark:border-[#1E1E1E] overflow-hidden">
                    <img 
                      src={getEffectiveAvatar(profileAvatar, profileEmail || profileName)} 
                      alt={profileName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 end-0 p-2 rounded-full bg-[#222222] text-[#EFF1EE] shadow-md hover:bg-[#A4F5A6] hover:text-[#222222] transition-all cursor-pointer hover:scale-110"
                    title={t.uploadAvatar || 'Upload Avatar Image'}
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 rounded-xl border border-[#D0D2CF] dark:border-white/10 bg-white dark:bg-[#1E1E1E] text-xs font-bold text-[#222222] dark:text-[#EFF1EE] hover:bg-[#EFF1EE] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{t.uploadAvatar || 'Upload'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfileAvatar(getDefaultAvatar(profileEmail || profileName))}
                    className="px-2.5 py-1 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer flex items-center gap-1"
                    title={t.resetAvatar || 'Reset to Default Profile Picture'}
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{t.resetAvatar || 'Reset'}</span>
                  </button>
                </div>
              </div>

              <div className="sm:col-span-8 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#666666] dark:text-[#D0D2CF]">{t.profileName}</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D0D2CF] dark:border-white/10 bg-white dark:bg-[#1E1E1E] text-xs font-medium text-[#222222] dark:text-[#EFF1EE] focus:outline-none focus:ring-2 focus:ring-[#A4F5A6]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#666666] dark:text-[#D0D2CF]">{t.profileEmail}</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D0D2CF] dark:border-white/10 bg-white dark:bg-[#1E1E1E] text-xs font-medium text-[#222222] dark:text-[#EFF1EE] focus:outline-none focus:ring-2 focus:ring-[#A4F5A6]"
                  />
                </div>
              </div>
            </div>

            {/* Profile Picture Presets */}
            <div className="pt-3 border-t border-[#D0D2CF]/60 dark:border-white/10">
              <label className="text-xs font-bold text-[#666666] dark:text-[#D0D2CF] mb-2 block">{t.defaultAvatarsLabel || 'Default Profile Pictures'}</label>
              <div className="flex items-center gap-3">
                {DEFAULT_AVATARS.map((avatarUri, idx) => {
                  const currentEffective = getEffectiveAvatar(profileAvatar, profileEmail || profileName);
                  const isSelected = profileAvatar === avatarUri || (currentEffective === avatarUri);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProfileAvatar(avatarUri)}
                      className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer hover:scale-105 ${
                        isSelected ? 'border-[#222222] dark:border-white ring-2 ring-[#A4F5A6] scale-105' : 'border-[#D0D2CF] dark:border-white/20 opacity-80'
                      }`}
                      title={`Profile Picture Style ${idx + 1}`}
                    >
                      <img src={avatarUri} alt={`Style ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cross-Device Sync Info */}
            <div className="pt-3 border-t border-[#D0D2CF]/60 dark:border-white/10">
              <div className="p-3.5 rounded-2xl bg-[#A4F5A6]/20 border border-[#A4F5A6]/40 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#222222] text-[#A4F5A6] shrink-0 mt-0.5">
                  <Cloud className="w-4 h-4" />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#222222] dark:text-[#EFF1EE]">{t.crossDeviceSyncTitle || 'Cross-Device Account Sync'}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#A4F5A6] text-[#222222] font-bold text-[10px]">
                      {t.activeBadge || 'Active'}
                    </span>
                  </div>
                  <p className="text-[#666666] dark:text-[#D0D2CF] text-[11px] leading-relaxed">
                    {t.crossDeviceSyncDesc || 'Log in on any phone, iPad, tablet, or laptop. Your documents, vocabulary list, reader highlights, flashcards, and reading statistics automatically stay synchronized in real time.'}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[10px] text-[#666666] dark:text-[#D0D2CF]">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-[#666666]" /> {t.phoneTabletSupported || 'Phone & Tablet Supported'}
                    </span>
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 text-[#666666]" /> {t.cloudBackupSupport || 'Real-time Live Cloud Backup'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 bg-[#222222] hover:bg-[#A4F5A6] text-[#EFF1EE] hover:text-[#222222] px-5 py-2 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                {saveSuccess && <Check className="w-3.5 h-3.5" />}
                <span>{saveSuccess ? t.saved : t.saveChanges}</span>
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#222222] dark:text-[#EFF1EE]">{t.passwordAndSecurity || 'Password & Security'}</h2>
              <p className="text-xs text-[#666666] dark:text-[#D0D2CF] mt-1">
                {t.securitySubtitle || 'Protect app access with a passcode lock'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#EFF1EE]/60 dark:bg-[#1E1E1E]/60 border border-[#D0D2CF] dark:border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${settings.isPasswordProtected ? 'bg-[#A4F5A6] text-[#222222]' : 'bg-[#D0D2CF] dark:bg-white/10 text-[#666666]'}`}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#222222] dark:text-[#EFF1EE]">{t.passcodeProtection || 'Passcode Protection'}</h3>
                    <p className="text-[11px] text-[#666666] dark:text-[#D0D2CF]">{t.passcodeDesc || 'Require password entry on launch'}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const updated = !settings.isPasswordProtected;
                    if (updated && !settings.appPassword) {
                      alert(t.enterPasscodePlaceholder || 'Please set a passcode below first.');
                      return;
                    }
                    onUpdateSettings({ isPasswordProtected: updated });
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    settings.isPasswordProtected ? 'bg-[#222222]' : 'bg-[#D0D2CF] dark:bg-white/20'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      settings.isPasswordProtected ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-3 border-t border-[#D0D2CF] dark:border-white/10 space-y-2">
                <label className="text-xs font-bold text-[#222222] dark:text-[#EFF1EE] block">
                  {settings.appPassword ? (t.changePasscode || 'Change Current Passcode') : (t.setPasscode || 'Set New Passcode')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder={t.enterPasscodePlaceholder || 'Enter passcode'}
                    defaultValue={settings.appPassword || ''}
                    id="setting-app-password-input"
                    className="flex-1 px-3 py-2 rounded-xl border border-[#D0D2CF] dark:border-white/10 bg-white dark:bg-[#1E1E1E] text-xs font-medium text-[#222222] dark:text-[#EFF1EE]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const inputEl = document.getElementById('setting-app-password-input') as HTMLInputElement;
                      if (inputEl && inputEl.value.trim()) {
                        onUpdateSettings({
                          appPassword: inputEl.value.trim(),
                          isPasswordProtected: true
                        });
                        alert(t.saved || 'Passcode saved and protection enabled!');
                      } else {
                        alert(t.enterPasscodePlaceholder || 'Please enter a valid passcode.');
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#222222] hover:bg-[#A4F5A6] text-[#EFF1EE] hover:text-[#222222] text-xs font-bold transition-all cursor-pointer"
                  >
                    {t.saveBtn || 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#222222] dark:text-[#EFF1EE]">{t.tabNotifications}</h2>
              <p className="text-xs text-[#666666] dark:text-[#D0D2CF] mt-1">
                {t.notificationsSubtitle || 'Configure app activity alerts and progress updates'}
              </p>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-[#D0D2CF]/60 dark:border-white/10">
              <div>
                <h3 className="text-xs font-semibold text-[#222222] dark:text-[#EFF1EE]">
                  {t.pushNotifications || 'Push Notifications'}
                </h3>
                <p className="text-[11px] text-[#666666] dark:text-[#D0D2CF] mt-0.5">
                  {t.pushNotificationsDesc || 'Receive study reminders and SRS flashcard review alerts'}
                </p>
              </div>

              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  notificationsEnabled ? 'bg-[#222222]' : 'bg-[#D0D2CF] dark:bg-white/20'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                    notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#222222] dark:text-[#EFF1EE]">{t.tabLanguage}</h2>
              <p className="text-xs text-[#666666] dark:text-[#D0D2CF] mt-1">
                {t.languageSubtitle || 'Set interface language and target learning language'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-t border-[#D0D2CF]/60 dark:border-white/10">
                <div>
                  <h3 className="text-xs font-semibold text-[#222222] dark:text-[#EFF1EE]">{t.interfaceLanguage}</h3>
                  <p className="text-[11px] text-[#666666] dark:text-[#D0D2CF] mt-0.5">{t.interfaceLanguageDesc}</p>
                </div>

                <select
                  value={settings.interfaceLanguage || 'English'}
                  onChange={(e) => onUpdateSettings({ interfaceLanguage: e.target.value })}
                  className="px-3 py-1.5 rounded-xl border border-[#D0D2CF] dark:border-white/10 bg-white dark:bg-[#1E1E1E] text-xs font-bold text-[#222222] dark:text-[#EFF1EE] focus:outline-none focus:ring-2 focus:ring-[#A4F5A6]"
                >
                  <option value="English">English 🇬🇧</option>
                  <option value="French">French (Français) 🇫🇷</option>
                  <option value="Arabic">Arabic (العربية) 🇪🇬</option>
                  <option value="Spanish">Spanish (Español) 🇪🇸</option>
                  <option value="German">German (Deutsch) 🇩🇪</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-[#D0D2CF]/60 dark:border-white/10">
                <div>
                  <h3 className="text-xs font-semibold text-[#222222] dark:text-[#EFF1EE]">{t.learningLanguage}</h3>
                  <p className="text-[11px] text-[#666666] dark:text-[#D0D2CF] mt-0.5">{t.learningLanguageDesc}</p>
                </div>

                <select
                  value={settings.targetLanguage || 'English'}
                  onChange={(e) => onUpdateSettings({ targetLanguage: e.target.value })}
                  className="px-3 py-1.5 rounded-xl border border-[#D0D2CF] dark:border-white/10 bg-white dark:bg-[#1E1E1E] text-xs font-medium text-[#222222] dark:text-[#EFF1EE] focus:outline-none focus:ring-2 focus:ring-[#A4F5A6]"
                >
                  <option value="English">English</option>
                  <option value="French">French (Français)</option>
                  <option value="Arabic">Arabic (العربية)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="German">German (Deutsch)</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-[#D0D2CF]/60 dark:border-white/10">
                <div>
                  <h3 className="text-xs font-semibold text-[#222222] dark:text-[#EFF1EE]">Translate Words To (Reader)</h3>
                  <p className="text-[11px] text-[#666666] dark:text-[#D0D2CF] mt-0.5">Language used for pop-up explanations and instant book word translations</p>
                </div>

                <select
                  value={settings.translationLanguage || 'French'}
                  onChange={(e) => onUpdateSettings({ translationLanguage: e.target.value })}
                  className="px-3 py-1.5 rounded-xl border border-[#D0D2CF] dark:border-white/10 bg-white dark:bg-[#1E1E1E] text-xs font-medium text-[#222222] dark:text-[#EFF1EE] focus:outline-none focus:ring-2 focus:ring-[#A4F5A6]"
                >
                  <option value="French">French (Français) 🇫🇷</option>
                  <option value="Arabic">Arabic (العربية) 🇪🇬</option>
                  <option value="English">English 🇬🇧</option>
                  <option value="Spanish">Spanish (Español) 🇪🇸</option>
                  <option value="German">German (Deutsch) 🇩🇪</option>
                  <option value="Italian">Italian (Italiano) 🇮🇹</option>
                  <option value="Portuguese">Portuguese (Português) 🇵🇹</option>
                  <option value="Russian">Russian (Русский) 🇷🇺</option>
                  <option value="Chinese">Chinese (中文) 🇨🇳</option>
                  <option value="Japanese">Japanese (日本語) 🇯🇵</option>
                  <option value="Korean">Korean (한국어) 🇰🇷</option>
                  <option value="Turkish">Turkish (Türkçe) 🇹🇷</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#222222] dark:text-[#EFF1EE]">{t.tabAppearance}</h2>
              <p className="text-xs text-[#666666] dark:text-[#D0D2CF] mt-1">
                {t.appearanceSubtitle || 'Customize app light/dark theme and reader styling'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-t border-[#D0D2CF]/60 dark:border-white/10">
                <div>
                  <h3 className="text-xs font-semibold text-[#222222] dark:text-[#EFF1EE]">{t.themeMode}</h3>
                  <p className="text-[11px] text-[#666666] dark:text-[#D0D2CF] mt-0.5">{t.themeModeDesc}</p>
                </div>

                <div className="bg-[#EFF1EE] dark:bg-white/10 p-1 rounded-xl flex gap-1">
                  {(['light', 'dark', 'system'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => onUpdateSettings({ appTheme: m })}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                        (settings.appTheme || 'light') === m
                          ? 'bg-[#222222] text-[#EFF1EE] shadow-2xs font-bold'
                          : 'text-[#666666] hover:text-[#222222] dark:hover:text-white'
                      }`}
                    >
                      {m === 'light' ? t.themeLight : m === 'dark' ? t.themeDark : t.themeSystem}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#D0D2CF]/60 dark:border-white/10">
                <label className="text-xs font-bold text-[#222222] dark:text-[#EFF1EE] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#B2A1FF]" />
                  {t.readerTheme}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {readerThemes.map((rt) => (
                    <button
                      key={rt.id}
                      onClick={() => onUpdateSettings({ readerTheme: rt.id })}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${rt.bg} ${rt.text} ${
                        settings.readerTheme === rt.id
                          ? 'ring-2 ring-[#222222] dark:ring-white border-transparent shadow-2xs'
                          : 'border-[#D0D2CF] dark:border-white/10 opacity-80'
                      }`}
                    >
                      {rt.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'reminders':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#222222] dark:text-[#EFF1EE]">{t.remindersTitle || 'Appointments & Study Reminders'}</h2>
              <p className="text-xs text-[#666666] dark:text-[#D0D2CF] mt-1">
                {t.remindersSubtitle || 'Schedule study sessions and daily target goals'}
              </p>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-[#D0D2CF]/60 dark:border-white/10">
              <div>
                <h3 className="text-xs font-semibold text-[#222222] dark:text-[#EFF1EE]">
                  {t.dailyStudySchedule || 'Daily Study Schedule'}
                </h3>
                <p className="text-[11px] text-[#666666] dark:text-[#D0D2CF] mt-0.5">
                  {t.dailyStudyScheduleDesc || 'Maintain your learning streak with timed check-ins'}
                </p>
              </div>

              <button
                onClick={() => setStudyRemindersEnabled(!studyRemindersEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  studyRemindersEnabled ? 'bg-[#222222]' : 'bg-[#D0D2CF] dark:bg-white/20'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                    studyRemindersEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        );

      case 'developer':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#222222] dark:text-[#EFF1EE] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#B2A1FF]" />
                {t.developerTitle || 'AI Coach & Developer API'}
              </h2>
              <p className="text-xs text-[#666666] dark:text-[#D0D2CF] mt-1">
                {t.developerSubtitle || 'Evaluate stats and access developer integration keys'}
              </p>
            </div>

            {/* AI Language Coach */}
            <div className="p-4 rounded-2xl border border-[#D0D2CF] dark:border-white/10 bg-white dark:bg-[#1E1E1E] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-[#222222] dark:text-[#EFF1EE] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#B2A1FF]" />
                    {t.aiCoachReview || 'AI Language Coach Review'}
                  </h3>
                  <p className="text-[11px] text-[#666666] dark:text-[#D0D2CF] mt-0.5">
                    {t.aiCoachDesc || `Generate learning advice based on your ${userStats.currentStreak}-day streak and ${vocabulary.length} saved words.`}
                  </p>
                </div>

                <button
                  onClick={async () => {
                    setIsCoachLoading(true);
                    setCoachError(null);
                    try {
                      const response = await fetch('/api/ai/advices', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: settings.userEmail || '' }),
                      });
                      if (!response.ok) throw new Error('AI Coach service is temporarily busy.');
                      const data = await response.json();
                      setCoachResult(data);
                    } catch (err: any) {
                      setCoachError(err?.message || 'Failed to fetch coaching report.');
                    } finally {
                      setIsCoachLoading(false);
                    }
                  }}
                  disabled={isCoachLoading}
                  className="px-3.5 py-2 bg-[#222222] hover:bg-[#A4F5A6] text-[#EFF1EE] hover:text-[#222222] text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-60"
                >
                  {isCoachLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>{isCoachLoading ? (t.aiAnalyzing || 'Analyzing...') : (t.requestAiReview || 'Request AI Review')}</span>
                </button>
              </div>

              {coachError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                  {coachError}
                </div>
              )}

              {coachResult && (
                <div className="space-y-3 pt-3 border-t border-[#D0D2CF] dark:border-white/10 text-xs">
                  <p className="font-serif italic text-[#222222] dark:text-[#EFF1EE] border-s-2 border-[#A4F5A6] ps-3">
                    "{coachResult.overallEvaluation}"
                  </p>
                </div>
              )}
            </div>

            {/* API Key */}
            <div className="p-4 rounded-2xl border border-[#D0D2CF] dark:border-white/10 bg-white dark:bg-[#1E1E1E] space-y-3">
              <h3 className="text-xs font-bold text-[#222222] dark:text-[#EFF1EE] flex items-center gap-1.5">
                <Key className="w-4 h-4 text-[#B2A1FF]" />
                {t.developerApiKey || 'Developer API Key'}
              </h3>
              <div className="flex gap-2">
                <div className="flex-1 bg-[#EFF1EE] dark:bg-black/40 px-3 py-2 rounded-xl text-xs font-mono text-[#222222] dark:text-[#EFF1EE] overflow-hidden truncate border border-[#D0D2CF] dark:border-white/10">
                  lf_dev_key_{profileName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'guest'}_9a3f2d8
                </div>
                <button
                  onClick={() => {
                    const keyText = `lf_dev_key_${profileName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'guest'}_9a3f2d8`;
                    navigator.clipboard.writeText(keyText);
                    setCopiedApiKey(true);
                    setTimeout(() => setCopiedApiKey(false), 2000);
                  }}
                  className="px-3 py-2 bg-[#EFF1EE] dark:bg-white/10 text-[#222222] dark:text-white text-xs font-bold rounded-xl hover:bg-[#D0D2CF] cursor-pointer"
                >
                  {copiedApiKey ? <Check className="w-4 h-4 text-[#A4F5A6]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Supabase Database Integration */}
            <div className="p-4 rounded-2xl border border-[#D0D2CF] dark:border-white/10 bg-white dark:bg-[#1E1E1E] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#222222] dark:text-[#EFF1EE] flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[#B2A1FF]" />
                  {t.supabaseDatabase || 'Supabase Cloud Database'}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  !!getSupabase() 
                    ? 'bg-[#A4F5A6]/20 text-[#222222] dark:text-[#A4F5A6] border border-[#A4F5A6]' 
                    : 'bg-[#EFF1EE] text-[#666666] dark:bg-white/10 dark:text-[#D0D2CF] border border-[#D0D2CF]'
                }`}>
                  {!!getSupabase() ? (t.connectedStatus || 'Connected') : (t.notConfiguredStatus || 'Not Configured')}
                </span>
              </div>

              <p className="text-[11px] text-[#666666] dark:text-[#D0D2CF]">
                {!!getSupabase() 
                  ? 'Your student profile, reading metrics, vocabulary lists, and study decks are securely backing up to your Supabase PostgreSQL cluster.'
                  : 'To enable Supabase database persistence, please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY inside the Secrets panel.'
                }
              </p>
            </div>
          </div>
        );

      case 'help':
      default:
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#222222] dark:text-[#EFF1EE]">{t.helpCenterTitle || 'Help Center & Guide'}</h2>
              <p className="text-xs text-[#666666] dark:text-[#D0D2CF] mt-1">
                {t.helpCenterSubtitle || 'Frequently asked questions and platform help'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl border border-[#D0D2CF] dark:border-white/10 bg-white dark:bg-[#1E1E1E] space-y-1">
                <h4 className="text-xs font-bold text-[#222222] dark:text-[#EFF1EE]">{t.faqTranslationTitle || 'How does Instant Translation work?'}</h4>
                <p className="text-xs text-[#666666] dark:text-[#D0D2CF]">
                  {t.faqTranslationDesc || 'Click or tap any word inside your reader document to view grammatical breakdowns and saved notes.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#D0D2CF] dark:border-white/10 bg-white dark:bg-[#1E1E1E] space-y-1">
                <h4 className="text-xs font-bold text-[#222222] dark:text-[#EFF1EE]">{t.faqExportTitle || 'How do I export my study statistics?'}</h4>
                <p className="text-xs text-[#666666] dark:text-[#D0D2CF]">
                  {t.faqExportDesc || 'Navigate to the Developer API tab to copy raw JSON progress metrics or sync with external tools.'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (confirm('Reset all saved vocabulary, highlights, and documents?')) {
                      onResetData();
                    }
                  }}
                  className="py-2 px-3.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-2 cursor-pointer border border-rose-200 dark:border-rose-900/40"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.resetDataBtn}</span>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-2 px-3 sm:px-4 space-y-5">
      {/* Centered Profile Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#222222] dark:text-[#EFF1EE]">
          {t.profileTitle || 'Profile'}
        </h1>
      </div>

      {/* Detail Sub-Panel or Profile Overview */}
      {selectedDetailView ? (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedDetailView(null)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10 text-[#222222] dark:text-[#EFF1EE] hover:bg-[#EFF1EE] text-xs font-bold transition-all cursor-pointer group shadow-2xs"
          >
            <ChevronDown className="w-4 h-4 text-[#222222] dark:text-[#EFF1EE] rotate-90 group-hover:-translate-x-0.5 transition-transform" />
            <span>{t.backToProfile || '← Back to Profile'}</span>
          </button>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-5 border border-[#D0D2CF] dark:border-white/10 shadow-xs">
            {renderDetailPanel(selectedDetailView)}
          </div>
        </div>
      ) : (
        <div className="space-y-5 animate-fade-in">
          {/* Top Profile Summary Card */}
          <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-3xl border border-[#D0D2CF] dark:border-white/10 flex items-center gap-4 shadow-xs">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleAvatarFileUpload}
              className="hidden"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer shrink-0"
              title="Click to change avatar"
            >
              <div className="w-14 h-14 rounded-full bg-[#222222] text-[#EFF1EE] flex items-center justify-center font-bold text-2xl shadow-xs border-2 border-white dark:border-stone-800 overflow-hidden">
                <img src={getEffectiveAvatar(profileAvatar, profileEmail || profileName)} alt={profileName} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-[#222222] dark:text-[#EFF1EE] truncate">
                {profileName}
              </h2>
              <p className="text-xs text-[#666666] dark:text-[#D0D2CF] truncate mt-0.5">
                {profileEmail || 'user@example.com'}
              </p>
            </div>
          </div>

          {/* Group 1: Account */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-[#666666] dark:text-[#D0D2CF] px-1 tracking-wide">
              {t.accountSection || 'Account'}
            </h3>
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#D0D2CF] dark:border-white/10 divide-y divide-[#D0D2CF]/50 dark:divide-white/10 shadow-xs overflow-hidden">
              {accountItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedDetailView(item.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-[#222222] dark:text-[#EFF1EE] hover:bg-[#EFF1EE] dark:hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-xl bg-[#EFF1EE] dark:bg-white/10 text-[#222222] dark:text-white">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.value && (
                        <span className="text-[#666666] dark:text-[#D0D2CF] text-xs font-normal">
                          {item.value}
                        </span>
                      )}
                      <ChevronDown className="w-4 h-4 text-[#666666] -rotate-90 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 2: Preferences */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-[#666666] dark:text-[#D0D2CF] px-1 tracking-wide">
              {t.preferencesSection || 'Preferences'}
            </h3>
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#D0D2CF] dark:border-white/10 divide-y divide-[#D0D2CF]/50 dark:divide-white/10 shadow-xs overflow-hidden">
              {preferenceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedDetailView(item.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-[#222222] dark:text-[#EFF1EE] hover:bg-[#EFF1EE] dark:hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-xl bg-[#EFF1EE] dark:bg-white/10 text-[#222222] dark:text-white">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.value && (
                        <span className="text-[#666666] dark:text-[#D0D2CF] text-xs font-normal">
                          {item.value}
                        </span>
                      )}
                      <ChevronDown className="w-4 h-4 text-[#666666] -rotate-90 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 3: Support */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-[#666666] dark:text-[#D0D2CF] px-1 tracking-wide">
              {t.supportSection || 'Support'}
            </h3>
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#D0D2CF] dark:border-white/10 divide-y divide-[#D0D2CF]/50 dark:divide-white/10 shadow-xs overflow-hidden">
              {supportItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedDetailView(item.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-[#222222] dark:text-[#EFF1EE] hover:bg-[#EFF1EE] dark:hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-xl bg-[#EFF1EE] dark:bg-white/10 text-[#222222] dark:text-white">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.value && (
                        <span className="text-[#666666] dark:text-[#D0D2CF] text-xs font-normal">
                          {item.value}
                        </span>
                      )}
                      <ChevronDown className="w-4 h-4 text-[#666666] -rotate-90 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 4: Account Actions */}
          <div className="pt-2">
            <button
              id="settings-logout-btn"
              onClick={() => {
                if (onLogout) {
                  onLogout();
                } else if (onTriggerOnboarding) {
                  onTriggerOnboarding();
                } else {
                  onResetData();
                }
              }}
              className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/30 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer pointer-events-auto shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <LogOut className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-sm">{t.logOut || 'Log Out'}</span>
                  <span className="text-[10px] font-medium opacity-70">Sign out of your account</span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-rose-400 -rotate-90" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
