// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { ReaderSettings } from '../types';
import { tracker } from '../utils/tracker';

interface DualFlagLanguageSelectorProps {
  targetLanguage?: string;
  interfaceLanguage?: string;
  onUpdateSettings?: (newSettings: Partial<ReaderSettings>) => void;
  isCollapsed?: boolean;
  className?: string;
  dropDirection?: 'up' | 'down' | 'right';
}

export const LANGUAGE_OPTIONS = [
  { code: 'FR', name: 'French', flag: '🇫🇷' },
  { code: 'ES', name: 'Spanish', flag: '🇪🇸' },
  { code: 'DE', name: 'German', flag: '🇩🇪' },
  { code: 'EG', name: 'Arabic', flag: '🇪🇬' },
  { code: 'GB', name: 'English', flag: '🇬🇧' },
  { code: 'IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'PT', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'RU', name: 'Russian', flag: '🇷🇺' },
  { code: 'TR', name: 'Turkish', flag: '🇹🇷' },
];

export const INTERFACE_LANGUAGE_OPTIONS = [
  { code: 'GB', name: 'English', flag: '🇬🇧' },
  { code: 'FR', name: 'French', flag: '🇫🇷' },
  { code: 'ES', name: 'Spanish', flag: '🇪🇸' },
  { code: 'DE', name: 'German', flag: '🇩🇪' },
  { code: 'EG', name: 'Arabic', flag: '🇪🇬' },
];

// High quality Vector Flag Renderer Component
export const FlagIcon: React.FC<{ code: string; className?: string }> = ({ code, className = "w-6 h-4" }) => {
  const c = code.toUpperCase();
  
  if (c === 'FR') {
    return (
      <svg className={`${className} rounded-xs overflow-hidden shadow-2xs border border-black/10 shrink-0`} viewBox="0 0 30 20" fill="none">
        <rect width="10" height="20" fill="#002654" />
        <rect x="10" width="10" height="20" fill="#FFFFFF" />
        <rect x="20" width="10" height="20" fill="#CE1126" />
      </svg>
    );
  }

  if (c === 'GB' || c === 'UK' || c === 'EN') {
    return (
      <svg className={`${className} rounded-xs overflow-hidden shadow-2xs border border-black/10 shrink-0`} viewBox="0 0 30 20" fill="none">
        <rect width="30" height="20" fill="#00247D" />
        <path d="M0 0L30 20M30 0L0 20" stroke="#FFFFFF" strokeWidth="3" />
        <path d="M0 0L30 20M30 0L0 20" stroke="#CF142B" strokeWidth="1.5" />
        <path d="M15 0V20M0 10H30" stroke="#FFFFFF" strokeWidth="5" />
        <path d="M15 0V20M0 10H30" stroke="#CF142B" strokeWidth="3" />
      </svg>
    );
  }

  if (c === 'ES') {
    return (
      <svg className={`${className} rounded-xs overflow-hidden shadow-2xs border border-black/10 shrink-0`} viewBox="0 0 30 20" fill="none">
        <rect width="30" height="5" fill="#AA1523" />
        <rect y="5" width="30" height="10" fill="#F1BF00" />
        <rect y="15" width="30" height="5" fill="#AA1523" />
        <circle cx="8" cy="10" r="1.5" fill="#AA1523" />
      </svg>
    );
  }

  if (c === 'DE') {
    return (
      <svg className={`${className} rounded-xs overflow-hidden shadow-2xs border border-black/10 shrink-0`} viewBox="0 0 30 20" fill="none">
        <rect width="30" height="6.6" fill="#000000" />
        <rect y="6.6" width="30" height="6.6" fill="#DD0000" />
        <rect y="13.2" width="30" height="6.8" fill="#FFCC00" />
      </svg>
    );
  }

  if (c === 'EG' || c === 'SA' || c === 'AR') {
    return (
      <svg className={`${className} rounded-xs overflow-hidden shadow-2xs border border-black/10 shrink-0`} viewBox="0 0 30 20" fill="none">
        {/* Egyptian Flag: Red, White, Black horizontal tricolour */}
        <rect width="30" height="6.67" fill="#C8102E" />
        <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
        <rect y="13.34" width="30" height="6.66" fill="#000000" />
        {/* Golden Eagle of Saladin Emblem */}
        <g transform="translate(15, 10)">
          {/* Eagle Tail & Feet */}
          <path d="M-1.8 2.8 L-0.8 4 L0.8 4 L1.8 2.8 Z" fill="#C59B27" />
          {/* Eagle Wings Spread */}
          <path d="M-0.8 -2.5 C-3.5 -3.8 -4.5 -1.2 -3.8 2 L-1.8 2.5 Z" fill="#C59B27" stroke="#9A7718" strokeWidth="0.2" />
          <path d="M0.8 -2.5 C3.5 -3.8 4.5 -1.2 3.8 2 L1.8 2.5 Z" fill="#C59B27" stroke="#9A7718" strokeWidth="0.2" />
          {/* Head looking right (heraldic dexter) */}
          <ellipse cx="0" cy="-3" rx="0.9" ry="1.1" fill="#C59B27" />
          <path d="M0.4 -3.4 L1.6 -3.1 L0.4 -2.7 Z" fill="#C59B27" />
          {/* Center Shield */}
          <path d="M-1.2 -1.8 L1.2 -1.8 L1.2 1.4 C1.2 2.2 0 2.8 0 2.8 C0 2.8 -1.2 2.2 -1.2 1.4 Z" fill="#FFFFFF" stroke="#9A7718" strokeWidth="0.25" />
          {/* Shield vertical stripes (Red, White, Black) */}
          <path d="M-1.2 -1.8 L-0.4 -1.8 L-0.4 1.7 C-0.7 1.5 -1.2 1.2 -1.2 0.8 Z" fill="#C8102E" />
          <path d="M0.4 -1.8 L1.2 -1.8 L1.2 0.8 C1.2 1.2 0.7 1.5 0.4 1.7 Z" fill="#000000" />
          {/* Scroll under feet */}
          <rect x="-2.2" y="3.6" width="4.4" height="0.6" rx="0.2" fill="#C59B27" stroke="#9A7718" strokeWidth="0.15" />
        </g>
      </svg>
    );
  }

  if (c === 'IT') {
    return (
      <svg className={`${className} rounded-xs overflow-hidden shadow-2xs border border-black/10 shrink-0`} viewBox="0 0 30 20" fill="none">
        <rect width="10" height="20" fill="#009246" />
        <rect x="10" width="10" height="20" fill="#FFFFFF" />
        <rect x="20" width="10" height="20" fill="#CE2B37" />
      </svg>
    );
  }

  if (c === 'JP') {
    return (
      <svg className={`${className} rounded-xs overflow-hidden shadow-2xs border border-black/10 shrink-0`} viewBox="0 0 30 20" fill="none">
        <rect width="30" height="20" fill="#FFFFFF" />
        <circle cx="15" cy="10" r="5" fill="#BC002D" />
      </svg>
    );
  }

  if (c === 'PT') {
    return (
      <svg className={`${className} rounded-xs overflow-hidden shadow-2xs border border-black/10 shrink-0`} viewBox="0 0 30 20" fill="none">
        <rect width="12" height="20" fill="#006600" />
        <rect x="12" width="18" height="20" fill="#FF0000" />
        <circle cx="12" cy="10" r="3" fill="#FFCC00" />
      </svg>
    );
  }

  if (c === 'RU') {
    return (
      <svg className={`${className} rounded-xs overflow-hidden shadow-2xs border border-black/10 shrink-0`} viewBox="0 0 30 20" fill="none">
        <rect width="30" height="6.6" fill="#FFFFFF" />
        <rect y="6.6" width="30" height="6.6" fill="#0039A6" />
        <rect y="13.2" width="30" height="6.8" fill="#D52B1E" />
      </svg>
    );
  }

  if (c === 'TR') {
    return (
      <svg className={`${className} rounded-xs overflow-hidden shadow-2xs border border-black/10 shrink-0`} viewBox="0 0 30 20" fill="none">
        <rect width="30" height="20" fill="#E30A17" />
        <circle cx="12" cy="10" r="4" fill="#FFFFFF" />
        <circle cx="13.5" cy="10" r="3.2" fill="#E30A17" />
        <polygon points="18,10 20,8.8 19.3,11 21,9.8 18.8,9.8" fill="#FFFFFF" />
      </svg>
    );
  }

  // Fallback
  return (
    <div className={`${className} bg-[#EFF1EE] border border-[#D0D2CF] rounded-xs flex items-center justify-center text-[10px] font-black text-[#222222]`}>
      {code.substring(0, 2).toUpperCase()}
    </div>
  );
};

// Overlapping Dual Flag Visual Icon Component
export const DualFlagIcon: React.FC<{
  targetCode: string;
  interfaceCode: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ targetCode, interfaceCode, size = 'md' }) => {
  const mainSizeClass = size === 'sm' ? 'w-5 h-3.5' : size === 'lg' ? 'w-8 h-5.5' : 'w-7 h-4.5';
  const subSizeClass = size === 'sm' ? 'w-3.5 h-2.5' : size === 'lg' ? 'w-5 h-3.5' : 'w-4 h-3';

  return (
    <div className="relative inline-flex items-center shrink-0 me-1">
      {/* Primary Flag (Target Learning Language) */}
      <FlagIcon code={targetCode} className={`${mainSizeClass} relative z-10 shadow-xs`} />
      
      {/* Secondary Overlapping Flag (Interface / Source Language) */}
      <div className="absolute -bottom-1 -end-2.5 z-20 ring-1.5 ring-white dark:ring-[#1E1E1E] rounded-2xs overflow-hidden shadow-sm">
        <FlagIcon code={interfaceCode} className={subSizeClass} />
      </div>
    </div>
  );
};

// Main Interactive Dual Flag Dropdown Component
export const DualFlagLanguageSelector: React.FC<DualFlagLanguageSelectorProps> = ({
  targetLanguage = 'French',
  interfaceLanguage = 'English',
  onUpdateSettings,
  isCollapsed = false,
  className = '',
  dropDirection = 'up'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'target' | 'interface'>('target');

  const currentTargetObj = LANGUAGE_OPTIONS.find(l => l.name.toLowerCase() === targetLanguage.toLowerCase()) || LANGUAGE_OPTIONS[0];
  const currentInterfaceObj = INTERFACE_LANGUAGE_OPTIONS.find(l => l.name.toLowerCase() === interfaceLanguage.toLowerCase()) || INTERFACE_LANGUAGE_OPTIONS[0];

  const handleSelectTarget = (langName: string) => {
    tracker.trackEvent('language_selected', 'engagement', {
      target_language: langName,
      interface_language: interfaceLanguage,
      section: 'header',
      type: 'target'
    });
    if (onUpdateSettings) {
      onUpdateSettings({ targetLanguage: langName });
    }
    setIsOpen(false);
  };

  const handleSelectInterface = (langName: string) => {
    tracker.trackEvent('language_selected', 'engagement', {
      target_language: targetLanguage,
      interface_language: langName,
      section: 'header',
      type: 'interface'
    });
    if (onUpdateSettings) {
      onUpdateSettings({ interfaceLanguage: langName });
    }
  };

  const dropPositionClass = dropDirection === 'up' 
    ? 'bottom-full mb-2 start-0' 
    : dropDirection === 'right'
    ? 'start-full top-0 ms-2'
    : 'top-full mt-2 end-0';

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Selector Button with Dual Flag + Name + Chevron */}
      {isCollapsed ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          title={`Learning: ${currentTargetObj.name} | Interface: ${currentInterfaceObj.name}`}
          className="p-1.5 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10 hover:bg-[#EFF1EE] dark:hover:bg-white/10 transition-all cursor-pointer shadow-2xs flex items-center justify-center"
        >
          <DualFlagIcon targetCode={currentTargetObj.code} interfaceCode={currentInterfaceObj.code} size="sm" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10 text-[#222222] dark:text-white hover:bg-[#EFF1EE] dark:hover:bg-white/10 transition-all cursor-pointer shadow-2xs active:scale-98"
        >
          {/* Dual Flag Icon Stack */}
          <DualFlagIcon targetCode={currentTargetObj.code} interfaceCode={currentInterfaceObj.code} size="md" />

          {/* Target Language Name */}
          <span className="text-sm font-bold tracking-tight text-[#222222] dark:text-white ms-1">
            {currentTargetObj.name}
          </span>

          {/* Dropdown Chevron Arrow */}
          <ChevronDown className={`w-3.5 h-3.5 text-[#666666] dark:text-stone-400 transition-transform duration-200 ms-0.5 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* Popover Language Selector Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click dismiss */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />

            <motion.div
              initial={{ opacity: 0, y: dropDirection === 'up' ? 8 : -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className={`absolute ${dropPositionClass} w-64 bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/15 rounded-2xl shadow-xl z-50 p-2 overflow-hidden`}
            >
              {/* Header Tabs: Learning Language vs Interface Language */}
              <div className="flex items-center gap-1 p-1 bg-[#EFF1EE] dark:bg-white/5 rounded-xl mb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('target')}
                  className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all ${
                    activeTab === 'target'
                      ? 'bg-white dark:bg-[#222222] text-[#222222] dark:text-white shadow-xs'
                      : 'text-[#666666] dark:text-stone-400 hover:text-[#222222]'
                  }`}
                >
                  Learning
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('interface')}
                  className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all ${
                    activeTab === 'interface'
                      ? 'bg-white dark:bg-[#222222] text-[#222222] dark:text-white shadow-xs'
                      : 'text-[#666666] dark:text-stone-400 hover:text-[#222222]'
                  }`}
                >
                  Interface
                </button>
              </div>

              {/* Language List */}
              <div className="max-h-60 overflow-y-auto space-y-0.5 custom-scrollbar pe-0.5">
                {activeTab === 'target' ? (
                  <>
                    <div className="text-[9px] font-extrabold uppercase text-[#666666] dark:text-stone-400 px-2 py-1 tracking-wider">
                      Target Learning Language
                    </div>
                    {LANGUAGE_OPTIONS.map((lang) => {
                      const isSelected = lang.name.toLowerCase() === targetLanguage.toLowerCase();
                      return (
                        <button
                          key={`target-lang-${lang.code}`}
                          type="button"
                          onClick={() => handleSelectTarget(lang.name)}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#A4F5A6] text-[#222222] font-bold shadow-xs'
                              : 'text-[#222222] dark:text-stone-200 hover:bg-[#EFF1EE] dark:hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <FlagIcon code={lang.code} className="w-5 h-3.5" />
                            <span>{lang.name}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#222222] shrink-0 stroke-[2.5]" />}
                        </button>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <div className="text-[9px] font-extrabold uppercase text-[#666666] dark:text-stone-400 px-2 py-1 tracking-wider">
                      Native Interface Language
                    </div>
                    {INTERFACE_LANGUAGE_OPTIONS.map((lang) => {
                      const isSelected = lang.name.toLowerCase() === interfaceLanguage.toLowerCase();
                      return (
                        <button
                          key={`interface-lang-${lang.code}`}
                          type="button"
                          onClick={() => handleSelectInterface(lang.name)}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#A4F5A6] text-[#222222] font-bold shadow-xs'
                              : 'text-[#222222] dark:text-stone-200 hover:bg-[#EFF1EE] dark:hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <FlagIcon code={lang.code} className="w-5 h-3.5" />
                            <span>{lang.name}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#222222] shrink-0 stroke-[2.5]" />}
                        </button>
                      );
                    })}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
