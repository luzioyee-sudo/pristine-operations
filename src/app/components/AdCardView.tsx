// @ts-nocheck
import React, { useState } from 'react';
import { RibbleLogo } from './RibbleLogo';
import {
  Sparkles,
  Heart,
  Zap,
  Activity,
  Bed,
  Star,
  Gift,
  Shield,
  Check,
  ArrowRight,
  ExternalLink,
  Crown,
  Flame,
  Coffee,
  BookOpen,
  Edit3,
  X,
  Plus,
  Trash2,
  Copy,
  CheckCircle,
  MessageSquare,
  Utensils,
  ShoppingBag,
  Share2,
  Award,
  Link,
  ChevronRight,
  Minus,
  Navigation,
  Percent,
  TrendingUp,
  Smile,
  Truck
} from 'lucide-react';
import { AppAd } from '../types';

export interface CardStylePreset {
  id: string;
  name: string;
  gradient: string;
  bgSolid: string;
  textColor: string;
  subtextColor: string;
  accentBg: string;
  accentText: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export const CARD_PALETTES: Record<string, CardStylePreset> = {
  'pastel-blue': {
    id: 'pastel-blue',
    name: 'Soft Sky Blue (Pro Plan)',
    gradient: 'linear-gradient(135deg, #E4EFFB 0%, #D0E4FA 100%)',
    bgSolid: '#E4EFFB',
    textColor: '#19335A',
    subtextColor: '#4A6999',
    accentBg: '#19335A',
    accentText: '#FFFFFF',
    badgeBg: '#FFFFFF',
    badgeText: '#1D4ED8',
    borderColor: '#C2DCF7',
  },
  'pastel-purple': {
    id: 'pastel-purple',
    name: 'Lilac Lavender',
    gradient: 'linear-gradient(135deg, #EFE8FA 0%, #E2D5F7 100%)',
    bgSolid: '#EFE8FA',
    textColor: '#361D68',
    subtextColor: '#6B52A0',
    accentBg: '#5B21B6',
    accentText: '#FFFFFF',
    badgeBg: '#FFFFFF',
    badgeText: '#6D28D9',
    borderColor: '#D8C6F2',
  },
  'pastel-coral': {
    id: 'pastel-coral',
    name: 'Coral Blush Pink',
    gradient: 'linear-gradient(135deg, #FDEAE8 0%, #FCD3CE 100%)',
    bgSolid: '#FDEAE8',
    textColor: '#6F1B1A',
    subtextColor: '#9E4E4D',
    accentBg: '#991B1B',
    accentText: '#FFFFFF',
    badgeBg: '#FFFFFF',
    badgeText: '#DC2626',
    borderColor: '#F8BBB4',
  },
  'pastel-amber': {
    id: 'pastel-amber',
    name: 'Amber Sunrise Peach',
    gradient: 'linear-gradient(135deg, #FEF2D9 0%, #FCE1B3 100%)',
    bgSolid: '#FEF2D9',
    textColor: '#63380B',
    subtextColor: '#91632E',
    accentBg: '#78350F',
    accentText: '#FFFFFF',
    badgeBg: '#FFFFFF',
    badgeText: '#D97706',
    borderColor: '#F8D08F',
  },
  'sunburst-orange': {
    id: 'sunburst-orange',
    name: 'Radiant Sunburst Gold',
    gradient: 'linear-gradient(145deg, #FF9900 0%, #FF5500 100%)',
    bgSolid: '#FF7700',
    textColor: '#FFFFFF',
    subtextColor: '#FFE0B2',
    accentBg: '#FFFFFF',
    accentText: '#E65100',
    badgeBg: 'rgba(255,255,255,0.25)',
    badgeText: '#FFFFFF',
    borderColor: '#FFA726',
  },
  'clean-white': {
    id: 'clean-white',
    name: 'Clean Apple White',
    gradient: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
    bgSolid: '#FFFFFF',
    textColor: '#0F172A',
    subtextColor: '#64748B',
    accentBg: '#0F172A',
    accentText: '#FFFFFF',
    badgeBg: '#F1F5F9',
    badgeText: '#0F172A',
    borderColor: '#E2E8F0',
  },
  'pastel-yellow': {
    id: 'pastel-yellow',
    name: 'Buttercup Yellow',
    gradient: 'linear-gradient(135deg, #FFF7D8 0%, #FDECB6 100%)',
    bgSolid: '#FFF7D8',
    textColor: '#573F05',
    subtextColor: '#876D25',
    accentBg: '#713F12',
    accentText: '#FFFFFF',
    badgeBg: '#FFFFFF',
    badgeText: '#B45309',
    borderColor: '#FBE089',
  },
  'pastel-navy': {
    id: 'pastel-navy',
    name: 'Midnight Deep Slate',
    gradient: 'linear-gradient(135deg, #2A3556 0%, #1A243F 100%)',
    bgSolid: '#2A3556',
    textColor: '#FFFFFF',
    subtextColor: '#94A3B8',
    accentBg: '#FFFFFF',
    accentText: '#0F172A',
    badgeBg: '#FFFFFF',
    badgeText: '#1E293B',
    borderColor: '#3E4D77',
  },
  'pastel-mint': {
    id: 'pastel-mint',
    name: 'Mint Sage Green',
    gradient: 'linear-gradient(135deg, #E6F7ED 0%, #CFEEDB 100%)',
    bgSolid: '#E6F7ED',
    textColor: '#104427',
    subtextColor: '#36724F',
    accentBg: '#065F46',
    accentText: '#FFFFFF',
    badgeBg: '#FFFFFF',
    badgeText: '#059669',
    borderColor: '#BBE6CC',
  },
  'pastel-terracotta': {
    id: 'pastel-terracotta',
    name: 'Ribble Warm Terracotta',
    gradient: 'linear-gradient(135deg, #E8F2FE 0%, #F5DFD4 100%)',
    bgSolid: '#E8F2FE',
    textColor: '#422011',
    subtextColor: '#7C4E3A',
    accentBg: '#334DAF',
    accentText: '#FFFFFF',
    badgeBg: '#FFFFFF',
    badgeText: '#334DAF',
    borderColor: '#E8C5B3',
  },
};

export const AppLogoIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-6 h-6',
  style,
}) => (
  <div className={className} style={style}>
    <RibbleLogo showWordmark={false} size="sm" />
  </div>
);

export const ICON_OPTIONS = [
  { id: 'app-logo', label: 'App Logo (Ribble)', icon: AppLogoIcon },
  { id: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { id: 'heart', label: 'Heart', icon: Heart },
  { id: 'zap', label: 'Zap / Energy', icon: Zap },
  { id: 'activity', label: 'Activity / Pulse', icon: Activity },
  { id: 'bed', label: 'Bed / Sleep', icon: Bed },
  { id: 'star', label: 'Star / Featured', icon: Star },
  { id: 'crown', label: 'Crown / VIP', icon: Crown },
  { id: 'flame', label: 'Flame / Hot', icon: Flame },
  { id: 'gift', label: 'Gift / Bonus', icon: Gift },
  { id: 'shield', label: 'Shield / Pro', icon: Shield },
  { id: 'book', label: 'Book / Study', icon: BookOpen },
  { id: 'coffee', label: 'Coffee / Break', icon: Coffee },
];

export function getIconComponent(iconId?: string) {
  if (!iconId || iconId === 'app-logo') return AppLogoIcon;
  const match = ICON_OPTIONS.find((i) => i.id === iconId);
  return match ? match.icon : AppLogoIcon;
}

export function getStepIcon(iconName?: string) {
  switch (iconName) {
    case 'share':
    case 'apple':
      return Share2;
    case 'gift':
      return Gift;
    case 'gem':
    case 'diamond':
      return Crown;
    case 'link':
      return Link;
    case 'star':
      return Star;
    case 'truck':
      return Truck;
    default:
      return Sparkles;
  }
}

interface AdCardViewProps {
  ad: Partial<AppAd>;
  onCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
  className?: string;
  isPreview?: boolean;
  isInteractiveEditable?: boolean;
  onUpdateField?: (field: keyof AppAd, value: any) => void;
  onDismiss?: (e: React.MouseEvent) => void;
}

export const AdCardView: React.FC<AdCardViewProps> = ({
  ad,
  onCtaClick,
  onSecondaryCtaClick,
  className = '',
  isPreview = false,
  isInteractiveEditable = false,
  onUpdateField,
  onDismiss,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [itemCounter, setItemCounter] = useState<number>(ad.productCount || 1);
  const [isFavorited, setIsFavorited] = useState(false);

  const paletteKey = ad.cardTheme || 'pastel-blue';
  const preset = CARD_PALETTES[paletteKey] || CARD_PALETTES['pastel-blue'];

  // Resolve background style
  const backgroundStyle =
    ad.cardTheme === 'custom' && ad.bgColor
      ? ad.bgColor
      : preset.gradient;

  const textColor =
    ad.cardTheme === 'custom' && ad.textColor ? ad.textColor : preset.textColor;

  const subtextColor =
    ad.cardTheme === 'custom' && ad.textColor
      ? `${ad.textColor}CC`
      : preset.subtextColor;

  const accentBg =
    ad.cardTheme === 'custom' && ad.accentColor ? ad.accentColor : preset.accentBg;

  const accentText =
    ad.cardTheme === 'custom' && ad.accentColor ? '#FFFFFF' : preset.accentText;

  // Typography Family
  const fontClass =
    ad.cardFont === 'serif'
      ? 'font-serif'
      : ad.cardFont === 'rounded'
      ? 'font-sans font-bold tracking-tight'
      : ad.cardFont === 'mono'
      ? 'font-mono'
      : 'font-sans';

  // Title Size
  const titleSizeClass =
    ad.titleSize === 'xl'
      ? 'text-2xl sm:text-3xl font-black leading-tight'
      : ad.titleSize === 'lg'
      ? 'text-xl sm:text-2xl font-black leading-snug'
      : ad.titleSize === 'sm'
      ? 'text-sm sm:text-base font-extrabold leading-snug'
      : 'text-base sm:text-lg font-extrabold leading-snug';

  // Body Size
  const bodySizeClass =
    ad.bodySize === 'md'
      ? 'text-sm leading-relaxed'
      : ad.bodySize === 'xs'
      ? 'text-[11px] leading-relaxed'
      : 'text-xs leading-relaxed';

  // Text Alignment
  const textAlignClass =
    ad.textAlign === 'center'
      ? 'text-center items-center'
      : ad.textAlign === 'right'
      ? 'text-end items-end'
      : 'text-start items-start';

  // Radius
  const radiusClass =
    ad.cardRadius === 'pill'
      ? 'rounded-[36px]'
      : ad.cardRadius === 'normal'
      ? 'rounded-2xl'
      : ad.cardRadius === 'rounded'
      ? 'rounded-3xl'
      : 'rounded-[28px]'; // squircle default

  const IconComp = getIconComponent(ad.iconBadge);
  const layout = ad.cardLayout || 'standard';

  // Helper for inline updates
  const handleInlineChange = (field: keyof AppAd, value: any) => {
    if (onUpdateField) {
      onUpdateField(field, value);
    }
  };

  const handleCopy = (linkText: string) => {
    navigator.clipboard.writeText(linkText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      className={`relative overflow-hidden border shadow-md transition-all ${radiusClass} ${className}`}
      style={{
        background: backgroundStyle,
        borderColor: preset.borderColor,
        color: textColor,
      }}
    >
      {/* Subtle Inner Glow Shadow */}
      <div className="absolute inset-0 bg-white/15 pointer-events-none rounded-[inherit]" />

      {/* Dismiss Button if provided */}
      {onDismiss && layout !== 'chat-modal' && (
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-3 end-3 z-30 w-7 h-7 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur-xs text-stone-700 dark:text-stone-300 hover:scale-110 flex items-center justify-center cursor-pointer shadow-xs transition-transform"
          title="Dismiss card"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Interactive Quick-Touch Control Bar (When in interactive edit mode) */}
      {isInteractiveEditable && (
        <div className="relative z-30 bg-stone-900/90 backdrop-blur-md text-white text-[10px] px-3 py-1.5 flex items-center justify-between gap-1.5 border-b border-white/15 flex-wrap">
          <div className="flex items-center gap-1">
            <Edit3 className="w-3 h-3 text-[#EAB59A]" />
            <span className="font-bold text-[#E8F2FE]">Touch to Edit:</span>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            {/* Quick Sizing Toggle */}
            <div className="flex items-center gap-0.5 bg-white/10 rounded-md p-0.5">
              {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => handleInlineChange('titleSize', sz)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${ad.titleSize === sz ? 'bg-[#334DAF] text-white' : 'text-stone-300'}`}
                >
                  {sz.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Quick Layout Dropdown */}
            <select
              value={ad.cardLayout || 'horizontal-split'}
              onChange={(e) => handleInlineChange('cardLayout', e.target.value)}
              className="bg-white/15 text-white text-[9px] font-semibold rounded px-1.5 py-0.5 border border-white/20"
            >
              <option value="chat-modal" className="text-black">1. ChatGPT Sheet Modal</option>
              <option value="wave-capsule" className="text-black">2. Food Delivery Wave</option>
              <option value="product-counter" className="text-black">3. Product Counter Pill</option>
              <option value="sunburst-points" className="text-black">4. Sunburst Reward Card</option>
              <option value="invite-profit" className="text-black">5. Invite & Profit Referral</option>
              <option value="horizontal-split" className="text-black">6. Split Pro Plan</option>
              <option value="icon-card" className="text-black">7. Status Icon Squircle</option>
              <option value="vertical-centered" className="text-black">8. Centered Display</option>
              <option value="standard" className="text-black">9. Standard Stack</option>
            </select>

            {/* Quick Page Target */}
            <select
              value={ad.targetPage || 'all'}
              onChange={(e) => handleInlineChange('targetPage', e.target.value)}
              className="bg-white/15 text-white text-[9px] font-semibold rounded px-1.5 py-0.5 border border-white/20"
            >
              <option value="all" className="text-black">All Pages</option>
              <option value="reader" className="text-black">Reader</option>
              <option value="practice" className="text-black">AI Practice</option>
              <option value="flashcards" className="text-black">Flashcards</option>
              <option value="dictionary" className="text-black">Dictionary</option>
              <option value="writing" className="text-black">Writing</option>
              <option value="analytics" className="text-black">Analytics</option>
            </select>

            {/* Quick Palette */}
            <select
              value={ad.cardTheme || 'pastel-blue'}
              onChange={(e) => handleInlineChange('cardTheme', e.target.value)}
              className="bg-white/15 text-white text-[9px] font-semibold rounded px-1.5 py-0.5 border border-white/20"
            >
              {Object.entries(CARD_PALETTES).map(([k, p]) => (
                <option key={k} value={k} className="text-black">{p.name}</option>
              ))}
              <option value="custom" className="text-black">Custom Colors</option>
            </select>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. CHATGPT SHEET / MODAL CARD (Image 1 Reference) */}
      {/* ======================================================== */}
      {layout === 'chat-modal' && (
        <div className="relative z-10 flex flex-col bg-white dark:bg-[#1E221B] rounded-[inherit] overflow-hidden">
          {/* Top Soft Gradient / Aura Header with Chat Dialogue Bubbles */}
          <div
            className="relative p-6 pb-8 flex flex-col items-center justify-center min-h-[140px] overflow-hidden"
            style={{
              background: ad.imageUrl
                ? `url(${ad.imageUrl}) center/cover no-repeat`
                : 'linear-gradient(180deg, #DCEBFC 0%, #E8EBF8 50%, #F5F6FC 100%)',
            }}
          >
            {/* Top Sheet Pill Handle */}
            <div className="w-10 h-1 rounded-full bg-stone-400/40 mb-3" />

            {/* Top Right Close Button */}
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="absolute top-3.5 end-3.5 w-7 h-7 rounded-full bg-black/10 hover:bg-black/20 text-stone-600 dark:text-stone-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Chat Speech Bubbles */}
            <div className="flex flex-col items-end space-y-2 w-full max-w-[280px]">
              {(ad.chatBubbles && ad.chatBubbles.length > 0 ? ad.chatBubbles : ['Hey ChatGPT!', 'Describe me based on our chats']).map((bubble, idx) => (
                <div
                  key={idx}
                  className="bg-white/95 text-[#091F5C] text-xs font-semibold px-4 py-2 rounded-2xl shadow-sm border border-black/5 flex items-center gap-1.5"
                >
                  {isInteractiveEditable ? (
                    <div className="flex items-center gap-1 w-full">
                      <input
                        type="text"
                        value={bubble}
                        onChange={(e) => {
                          const copy = [...(ad.chatBubbles || ['Hey ChatGPT!', 'Describe me based on our chats'])];
                          copy[idx] = e.target.value;
                          handleInlineChange('chatBubbles', copy);
                        }}
                        className="bg-stone-100 rounded px-1.5 py-0.5 text-xs text-[#091F5C] w-full focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const copy = (ad.chatBubbles || []).filter((_, i) => i !== idx);
                          handleInlineChange('chatBubbles', copy);
                        }}
                        className="text-stone-400 hover:text-rose-500 p-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span>{bubble}</span>
                  )}
                </div>
              ))}

              {isInteractiveEditable && (
                <button
                  type="button"
                  onClick={() => {
                    const copy = [...(ad.chatBubbles || ['Hey ChatGPT!', 'Describe me based on our chats']), 'New chat message...'];
                    handleInlineChange('chatBubbles', copy);
                  }}
                  className="text-[10px] font-bold text-[#334DAF] bg-white/80 px-2 py-0.5 rounded-full self-center cursor-pointer shadow-2xs hover:bg-white"
                >
                  + Add Chat Bubble
                </button>
              )}
            </div>
          </div>

          {/* Bottom Card Body */}
          <div className="p-6 pt-5 flex flex-col items-center text-center space-y-4">
            <div className="w-full">
              {isInteractiveEditable ? (
                <input
                  type="text"
                  value={ad.title || ''}
                  onChange={(e) => handleInlineChange('title', e.target.value)}
                  placeholder="Introducing new, improved memory"
                  className={`w-full text-center bg-black/5 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#334DAF] ${fontClass} ${titleSizeClass}`}
                  style={{ color: '#0F172A' }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <h3 className={`${fontClass} ${titleSizeClass} text-[#091F5C] dark:text-stone-100`}>
                  {ad.title || 'Introducing new, improved memory'}
                </h3>
              )}

              {isInteractiveEditable ? (
                <textarea
                  value={ad.description || ''}
                  onChange={(e) => handleInlineChange('description', e.target.value)}
                  placeholder="ChatGPT now remembers more of your past chats, so you won't need to repeat yourself..."
                  rows={3}
                  className="w-full text-center bg-black/5 rounded-lg p-2 text-xs text-stone-600 dark:text-stone-300 focus:outline-none mt-2 resize-none"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                ad.description && (
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 leading-relaxed max-w-sm">
                    {ad.description}
                  </p>
                )
              )}
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-2.5 pt-2">
              {isInteractiveEditable ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ad.ctaText || 'Show me'}
                      onChange={(e) => handleInlineChange('ctaText', e.target.value)}
                      className="w-full py-3 rounded-full bg-black text-white text-center font-bold text-xs focus:outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <input
                    type="text"
                    value={ad.secondaryCtaText || 'Not now'}
                    onChange={(e) => handleInlineChange('secondaryCtaText', e.target.value)}
                    placeholder="Secondary button text"
                    className="w-full py-1 text-center text-xs text-stone-500 font-bold bg-transparent focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ) : (
                <>
                  {ad.ctaText && (
                    <button
                      type="button"
                      onClick={onCtaClick}
                      className="w-full py-3.5 rounded-full bg-black hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer"
                    >
                      {ad.ctaText}
                    </button>
                  )}
                  {ad.secondaryCtaText && (
                    <button
                      type="button"
                      onClick={onSecondaryCtaClick || onDismiss}
                      className="w-full py-2 text-stone-600 hover:text-[#091F5C] dark:text-stone-400 dark:hover:text-stone-200 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      {ad.secondaryCtaText}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. FOOD / RESTAURANT DELIVERY CAPSULE (Image 2 Reference) */}
      {/* ======================================================== */}
      {layout === 'wave-capsule' && (
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch bg-white dark:bg-[#1E221B] rounded-[inherit] overflow-hidden shadow-lg border border-[#D0E4FE] dark:border-stone-800">
          {/* Left Content Column */}
          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-3 z-10">
            <div>
              {/* Title */}
              {isInteractiveEditable ? (
                <input
                  type="text"
                  value={ad.title || ''}
                  onChange={(e) => handleInlineChange('title', e.target.value)}
                  placeholder="Copper Kitchen"
                  className="w-full font-black text-lg sm:text-xl text-[#091F5C] dark:text-stone-100 bg-black/5 rounded px-2 py-0.5 focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <h3 className="font-black text-lg sm:text-xl text-[#091F5C] dark:text-stone-100">
                  {ad.title || 'Copper Kitchen'}
                </h3>
              )}

              {/* Rating & Delivery Time Badge */}
              <div className="flex items-center gap-1.5 text-xs text-stone-700 dark:text-stone-300 font-semibold mt-1">
                <span className="inline-flex items-center gap-1 text-[#6D28D9] dark:text-[#A78BFA] font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {isInteractiveEditable ? (
                    <input
                      type="text"
                      value={ad.ratingText || '5.0(10k+) • 25-30 mins'}
                      onChange={(e) => handleInlineChange('ratingText', e.target.value)}
                      className="bg-black/5 rounded px-1 text-xs text-[#6D28D9] font-bold focus:outline-none w-36"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span>{ad.ratingText || '5.0(10k+) • 25-30 mins'}</span>
                  )}
                </span>
              </div>

              {/* Categories & Location */}
              {isInteractiveEditable ? (
                <input
                  type="text"
                  value={ad.description || ''}
                  onChange={(e) => handleInlineChange('description', e.target.value)}
                  placeholder="Biryani, Barbecue, Chettinad • 3.5 km"
                  className="w-full text-xs text-stone-500 dark:text-stone-400 bg-black/5 rounded px-2 py-0.5 mt-1 focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                ad.description && (
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                    {ad.description}
                  </p>
                )
              )}
            </div>

            {/* Bottom Tag Pills (Recommending & Free Delivery) */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              {(ad.tagPills && ad.tagPills.length > 0 ? ad.tagPills : ['RECOMENDING 🔥', 'FREE DELIVERY 🛵']).map((tag, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded-xl font-black text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-xs ${
                    idx % 2 === 0
                      ? 'bg-[#0088FF] text-white'
                      : 'bg-[#6D28D9] text-white'
                  }`}
                >
                  {isInteractiveEditable ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => {
                          const copy = [...(ad.tagPills || ['RECOMENDING 🔥', 'FREE DELIVERY 🛵'])];
                          copy[idx] = e.target.value;
                          handleInlineChange('tagPills', copy);
                        }}
                        className="bg-transparent text-white text-[10px] font-black uppercase focus:outline-none w-24"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const copy = (ad.tagPills || []).filter((_, i) => i !== idx);
                          handleInlineChange('tagPills', copy);
                        }}
                        className="text-white/70 hover:text-white p-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span>{tag}</span>
                  )}
                </div>
              ))}

              {isInteractiveEditable && (
                <button
                  type="button"
                  onClick={() => {
                    const copy = [...(ad.tagPills || ['RECOMENDING 🔥', 'FREE DELIVERY 🛵']), 'HOT DEAL ⭐'];
                    handleInlineChange('tagPills', copy);
                  }}
                  className="text-[10px] font-bold text-[#334DAF] hover:underline cursor-pointer"
                >
                  + Add Tag
                </button>
              )}
            </div>
          </div>

          {/* Right Organic Wave Food Picture */}
          <div className="relative sm:w-48 h-40 sm:h-auto min-h-[140px] overflow-hidden">
            {/* Smooth SVG Wave Mask Cutout on left of image */}
            <svg
              className="absolute start-0 top-0 bottom-0 h-full w-8 text-white dark:text-[#1E221B] z-10 hidden sm:block pointer-events-none"
              viewBox="0 0 40 200"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 0 C 20 50, 40 70, 40 100 C 40 130, 20 150, 0 200 L 0 200 L 0 0 Z"
                fill="currentColor"
              />
            </svg>

            <img
              src={ad.imageUrl || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80'}
              alt={ad.title}
              className="w-full h-full object-cover"
            />

            {/* Favorite Floating Heart */}
            <button
              type="button"
              onClick={() => setIsFavorited(!isFavorited)}
              className="absolute bottom-3 end-3 z-20 w-9 h-9 rounded-2xl bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-md"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. PRODUCT / GROCERY COUNTER PILL (Image 3 Reference) */}
      {/* ======================================================== */}
      {layout === 'product-counter' && (
        <div className="relative z-10 p-5 sm:p-6 bg-white dark:bg-[#1E221B] rounded-[inherit] flex items-center gap-5 shadow-lg border border-[#D0E4FE] dark:border-stone-800">
          {/* Left Floating Product Cutout Picture */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
            <img
              src={ad.imageUrl || 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80'}
              alt={ad.title}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>

          {/* Right Product Details & Interactive +/- Counter */}
          <div className="flex-1 space-y-2">
            <div>
              {isInteractiveEditable ? (
                <input
                  type="text"
                  value={ad.title || ''}
                  onChange={(e) => handleInlineChange('title', e.target.value)}
                  placeholder="Banana 5 pcs"
                  className="font-black text-base sm:text-lg text-[#091F5C] dark:text-stone-100 bg-black/5 rounded px-2 py-0.5 focus:outline-none w-full"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <h3 className="font-black text-base sm:text-lg text-[#091F5C] dark:text-stone-100">
                  {ad.title || 'Banana 5 pcs'}
                </h3>
              )}

              {isInteractiveEditable ? (
                <textarea
                  value={ad.description || ''}
                  onChange={(e) => handleInlineChange('description', e.target.value)}
                  placeholder="Fresh organic fruit delivered in minutes"
                  rows={2}
                  className="text-xs text-stone-500 dark:text-stone-400 bg-black/5 rounded p-1 focus:outline-none w-full resize-none mt-1"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                ad.description && (
                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                    {ad.description}
                  </p>
                )
              )}
            </div>

            {/* Price & +/- Counter Pill */}
            <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
              {isInteractiveEditable ? (
                <input
                  type="text"
                  value={ad.subtitlePrice || '$00.00'}
                  onChange={(e) => handleInlineChange('subtitlePrice', e.target.value)}
                  placeholder="$00.00"
                  className="font-black text-sm text-[#091F5C] dark:text-stone-100 bg-black/5 rounded px-2 py-0.5 w-24 focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="font-black text-sm sm:text-base text-[#091F5C] dark:text-stone-100">
                  {ad.subtitlePrice || '$00.00'}
                </span>
              )}

              {/* Black Counter Pill with [- 000 +] */}
              <div className="bg-[#18181B] text-white px-3 py-1.5 rounded-full flex items-center gap-3 shadow-md">
                <button
                  type="button"
                  onClick={() => setItemCounter(Math.max(0, itemCounter - 1))}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer p-0.5"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold text-xs min-w-[28px] text-center">
                  {String(itemCounter).padStart(3, '0')}
                </span>
                <button
                  type="button"
                  onClick={() => setItemCounter(itemCounter + 1)}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer p-0.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. SUNBURST REWARD / POINTS CARD (Image 4 Reference) */}
      {/* ======================================================== */}
      {layout === 'sunburst-points' && (
        <div
          className="relative z-10 p-6 sm:p-7 flex flex-col items-center text-center space-y-4 text-white rounded-[inherit] shadow-xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #FFA000 0%, #FF6D00 45%, #E65100 100%)',
          }}
        >
          {/* Subtle Sunburst Radial Glow Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.35)_0%,transparent_70%)] pointer-events-none" />

          {/* Top 3D Golden Star / Diamond Glyph */}
          <div className="relative">
            <div className="w-14 h-14 flex items-center justify-center drop-shadow-[0_4px_12px_rgba(255,255,255,0.4)] animate-pulse">
              <Star className="w-12 h-12 fill-[#FFF3E0] text-[#FFE082] stroke-[1.5]" />
            </div>
          </div>

          {/* Hero Points Metric */}
          <div className="w-full">
            {isInteractiveEditable ? (
              <input
                type="text"
                value={ad.title || '1,590 points'}
                onChange={(e) => handleInlineChange('title', e.target.value)}
                placeholder="1,590 points"
                className="w-full text-center font-black text-3xl sm:text-4xl text-white bg-black/10 rounded-xl px-2 py-1 focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h2 className="font-black text-3xl sm:text-4xl text-white drop-shadow-sm">
                {ad.title || '1,590 points'}
              </h2>
            )}
          </div>

          {/* Stats Rows (Epoch rank & Daily generation) */}
          <div className="w-full max-w-xs space-y-1.5 text-xs text-[#FFE0B2] font-semibold">
            {(ad.statRows && ad.statRows.length > 0
              ? ad.statRows
              : [
                  { label: 'Epoch rank:', value: '#3,329' },
                  { label: 'Daily generation:', value: '30 points' },
                ]
            ).map((stat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                {isInteractiveEditable ? (
                  <div className="flex items-center justify-between w-full gap-2">
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const copy = [...(ad.statRows || [{ label: 'Epoch rank:', value: '#3,329' }, { label: 'Daily generation:', value: '30 points' }])];
                        copy[idx] = { ...copy[idx], label: e.target.value };
                        handleInlineChange('statRows', copy);
                      }}
                      className="bg-black/10 rounded px-1.5 py-0.5 text-xs text-[#FFE0B2] flex-1 focus:outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const copy = [...(ad.statRows || [{ label: 'Epoch rank:', value: '#3,329' }, { label: 'Daily generation:', value: '30 points' }])];
                        copy[idx] = { ...copy[idx], value: e.target.value };
                        handleInlineChange('statRows', copy);
                      }}
                      className="bg-black/10 rounded px-1.5 py-0.5 text-xs text-white font-bold w-24 text-end focus:outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ) : (
                  <>
                    <span className="text-white/80">{stat.label}</span>
                    <span className="font-bold text-white">{stat.value}</span>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Frosted Pill Banner with Boost + Circle Arrow Button */}
          <div className="w-full max-w-xs pt-1">
            <div
              onClick={onCtaClick}
              className="bg-white/20 hover:bg-white/25 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 flex items-center justify-between shadow-lg cursor-pointer transition-all active:scale-98"
            >
              <div className="flex items-center gap-1.5 text-xs font-black text-white">
                <Zap className="w-4 h-4 fill-white" />
                {isInteractiveEditable ? (
                  <input
                    type="text"
                    value={ad.boostBadgeText || '+50% boost'}
                    onChange={(e) => handleInlineChange('boostBadgeText', e.target.value)}
                    className="bg-transparent text-white font-black text-xs focus:outline-none w-28"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span>{ad.boostBadgeText || '+50% boost'}</span>
                )}
              </div>

              {/* White Circular Action Button */}
              <div className="w-7 h-7 rounded-full bg-white text-[#E65100] flex items-center justify-center shadow-md">
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. INVITE & PROFIT / REFERRAL STEP CARD (Image 5 Reference) */}
      {/* ======================================================== */}
      {layout === 'invite-profit' && (
        <div className="relative z-10 bg-white dark:bg-[#1E221B] rounded-[inherit] overflow-hidden shadow-lg border border-[#D0E4FE] dark:border-stone-800 flex flex-col">
          {/* Top Banner Rounded Fluid Image */}
          <div className="p-4 pb-0">
            <div className="w-full h-32 sm:h-36 rounded-2xl overflow-hidden shadow-inner bg-gradient-to-r from-blue-100 via-pink-100 to-amber-100">
              <img
                src={ad.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-4">
            <div>
              {isInteractiveEditable ? (
                <input
                  type="text"
                  value={ad.title || 'Invite & Profit'}
                  onChange={(e) => handleInlineChange('title', e.target.value)}
                  placeholder="Invite & Profit"
                  className="font-black text-xl sm:text-2xl text-[#091F5C] dark:text-stone-100 bg-black/5 rounded px-2 py-0.5 focus:outline-none w-full"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <h3 className="font-black text-xl sm:text-2xl text-[#091F5C] dark:text-stone-100">
                  {ad.title || 'Invite & Profit'}
                </h3>
              )}

              {isInteractiveEditable ? (
                <input
                  type="text"
                  value={ad.description || 'How it works:'}
                  onChange={(e) => handleInlineChange('description', e.target.value)}
                  placeholder="How it works:"
                  className="text-xs text-stone-500 font-bold bg-black/5 rounded px-2 py-0.5 mt-1 focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold mt-1">
                  {ad.description || 'How it works:'}
                </p>
              )}
            </div>

            {/* Feature Step Rows with Icons */}
            <div className="space-y-3">
              {(ad.stepItems && ad.stepItems.length > 0
                ? ad.stepItems
                : [
                    { icon: 'share', text: 'Share a link' },
                    { icon: 'gift', text: 'Your friend gets 30 credits when they subscribe' },
                    { icon: 'gem', text: 'You receive 30 credits for each referral' },
                  ]
              ).map((step, idx) => {
                const StepIcon = getStepIcon(step.icon);
                return (
                  <div key={idx} className="flex items-center gap-3 text-xs text-[#091F5C] dark:text-stone-200">
                    <div className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 shadow-2xs">
                      <StepIcon className="w-3.5 h-3.5 text-[#091F5C] dark:text-stone-100" />
                    </div>
                    {isInteractiveEditable ? (
                      <div className="flex items-center gap-1 flex-1">
                        <input
                          type="text"
                          value={step.text}
                          onChange={(e) => {
                            const copy = [...(ad.stepItems || [{ icon: 'share', text: 'Share a link' }, { icon: 'gift', text: 'Your friend gets 30 credits...' }, { icon: 'gem', text: 'You receive 30 credits...' }])];
                            copy[idx] = { ...copy[idx], text: e.target.value };
                            handleInlineChange('stepItems', copy);
                          }}
                          className="flex-1 bg-black/5 rounded px-2 py-0.5 text-xs text-[#091F5C] dark:text-stone-200 focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ) : (
                      <span className="font-medium">{step.text}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Invite Link Container with Copy Button */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 block mb-1.5">
                Your invite link:
              </span>
              <div className="bg-stone-100 dark:bg-stone-800/80 rounded-2xl p-1.5 ps-3 flex items-center justify-between gap-2 border border-[#D0E4FE] dark:border-stone-700">
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  <Link className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  {isInteractiveEditable ? (
                    <input
                      type="text"
                      value={ad.copyableLink || 'https://lingoflow.app/invite/alex'}
                      onChange={(e) => handleInlineChange('copyableLink', e.target.value)}
                      className="bg-transparent text-xs text-stone-700 dark:text-stone-300 font-mono focus:outline-none w-full"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-xs text-stone-700 dark:text-stone-300 font-mono truncate">
                      {ad.copyableLink || 'https://lingoflow.app/invite/alex'}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(ad.copyableLink || 'https://lingoflow.app/invite/alex')}
                  className="px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                >
                  {copiedLink ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. HORIZONTAL SPLIT LAYOUT (Reference Image 1 Pro Plan) */}
      {/* ======================================================== */}
      {layout === 'horizontal-split' && (
        <div className="relative z-10 p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className={`sm:col-span-7 flex flex-col ${textAlignClass} space-y-2.5`}>
            {/* Top Pill Badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs"
              style={{ backgroundColor: preset.badgeBg, color: preset.badgeText }}
            >
              <IconComp className="w-3 h-3" />
              {isInteractiveEditable ? (
                <input
                  type="text"
                  value={ad.badgeText || ''}
                  onChange={(e) => handleInlineChange('badgeText', e.target.value)}
                  placeholder="Badge text"
                  className="bg-transparent border-b border-current focus:outline-none text-[10px] font-black uppercase w-24"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span>{ad.badgeText || 'Special Offer'}</span>
              )}
            </div>

            {/* Headline */}
            <div className="w-full">
              {isInteractiveEditable ? (
                <input
                  type="text"
                  value={ad.title || ''}
                  onChange={(e) => handleInlineChange('title', e.target.value)}
                  placeholder="Campaign Title"
                  className={`w-full bg-black/5 hover:bg-black/10 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-[#334DAF] border border-black/10 ${fontClass} ${titleSizeClass}`}
                  style={{ color: textColor }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <h3 className={`${fontClass} ${titleSizeClass}`} style={{ color: textColor }}>
                  {ad.title || 'Upgrade to Pro'}
                </h3>
              )}

              {isInteractiveEditable ? (
                <input
                  type="text"
                  value={ad.subtitlePrice || ''}
                  onChange={(e) => handleInlineChange('subtitlePrice', e.target.value)}
                  placeholder="Price or subtitle (e.g. $89 / Month)"
                  className="w-full bg-black/5 hover:bg-black/10 rounded-md px-2 py-0.5 mt-1 text-xs sm:text-sm font-bold border border-black/10 focus:outline-none"
                  style={{ color: subtextColor }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                ad.subtitlePrice && (
                  <div
                    className="font-bold text-xs sm:text-sm mt-0.5"
                    style={{ color: subtextColor }}
                  >
                    {ad.subtitlePrice}
                  </div>
                )
              )}
            </div>

            {/* Description */}
            <div className="w-full">
              {isInteractiveEditable ? (
                <textarea
                  value={ad.description || ''}
                  onChange={(e) => handleInlineChange('description', e.target.value)}
                  placeholder="Write description here..."
                  rows={2}
                  className={`w-full bg-black/5 hover:bg-black/10 rounded-lg p-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#334DAF] border border-black/10 resize-none ${fontClass} ${bodySizeClass}`}
                  style={{ color: subtextColor }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                ad.description && (
                  <p
                    className={`${fontClass} ${bodySizeClass} line-clamp-3`}
                    style={{ color: subtextColor }}
                  >
                    {ad.description}
                  </p>
                )
              )}
            </div>

            {/* Bullet Points Perks */}
            <div className="space-y-1.5 pt-1 w-full">
              {(ad.bulletPoints || []).map((pt, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 text-xs font-semibold ${
                    ad.textAlign === 'center'
                      ? 'justify-center'
                      : ad.textAlign === 'right'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                  style={{ color: textColor }}
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: preset.badgeBg, color: preset.badgeText }}
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  {isInteractiveEditable ? (
                    <div className="flex items-center gap-1 flex-1">
                      <input
                        type="text"
                        value={pt}
                        onChange={(e) => {
                          const copy = [...(ad.bulletPoints || [])];
                          copy[idx] = e.target.value;
                          handleInlineChange('bulletPoints', copy);
                        }}
                        className="flex-1 bg-black/5 hover:bg-black/10 rounded px-1.5 py-0.5 text-xs border border-black/10 focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const copy = (ad.bulletPoints || []).filter((_, i) => i !== idx);
                          handleInlineChange('bulletPoints', copy);
                        }}
                        className="text-stone-400 hover:text-rose-500 p-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span>{pt}</span>
                  )}
                </div>
              ))}

              {isInteractiveEditable && (
                <button
                  type="button"
                  onClick={() => {
                    const copy = [...(ad.bulletPoints || []), 'New perk point'];
                    handleInlineChange('bulletPoints', copy);
                  }}
                  className="text-[10px] font-bold text-[#334DAF] flex items-center gap-1 hover:underline pt-0.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Feature Point</span>
                </button>
              )}
            </div>

            {/* CTA Button */}
            <div className="pt-2 w-full">
              {isInteractiveEditable ? (
                <div className="flex items-center gap-2">
                  <div
                    className="px-4 py-2 rounded-full font-black text-xs flex items-center gap-1.5 shadow-md"
                    style={{ backgroundColor: accentBg, color: accentText }}
                  >
                    <input
                      type="text"
                      value={ad.ctaText || 'Get Started'}
                      onChange={(e) => handleInlineChange('ctaText', e.target.value)}
                      className="bg-transparent text-center font-bold text-xs focus:outline-none w-28 text-white"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <ArrowRight className="w-3 h-3 shrink-0" />
                  </div>
                  <input
                    type="text"
                    value={ad.ctaUrl || '#practice'}
                    onChange={(e) => handleInlineChange('ctaUrl', e.target.value)}
                    placeholder="Route e.g. #practice"
                    className="bg-black/5 rounded-full px-3 py-1.5 text-[10px] font-semibold border border-black/10 focus:outline-none flex-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ) : (
                ad.ctaText && (
                  <button
                    type="button"
                    onClick={onCtaClick}
                    className="px-5 py-2.5 rounded-full font-black text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-transform active:scale-95 cursor-pointer"
                    style={{ backgroundColor: accentBg, color: accentText }}
                  >
                    <span>{ad.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )
              )}
            </div>
          </div>

          {/* Right Image / Hero Graphic */}
          <div className="sm:col-span-5 flex items-center justify-center">
            {ad.imageUrl ? (
              <div className="w-full h-36 sm:h-44 rounded-2xl overflow-hidden shadow-inner border border-white/40 relative group">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                {isInteractiveEditable && (
                  <button
                    type="button"
                    onClick={() => handleInlineChange('imageUrl', '')}
                    className="absolute top-2 end-2 bg-black/60 text-white rounded-full p-1 hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer text-[10px]"
                    title="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : (
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shadow-lg border-4 border-white/60 cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: preset.badgeBg }}
                onClick={() => {
                  if (isInteractiveEditable) {
                    const currentIndex = ICON_OPTIONS.findIndex((i) => i.id === ad.iconBadge);
                    const nextIcon = ICON_OPTIONS[(currentIndex + 1) % ICON_OPTIONS.length];
                    handleInlineChange('iconBadge', nextIcon.id);
                  }
                }}
                title={isInteractiveEditable ? "Click to change icon" : undefined}
              >
                <IconComp className="w-12 h-12" style={{ color: preset.badgeText }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. ICON CARD / STATUS PILL */}
      {/* ======================================================== */}
      {layout === 'icon-card' && (
        <div className={`relative z-10 p-5 sm:p-6 flex flex-col ${textAlignClass} space-y-3`}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-md border-2 border-white/80 shrink-0 cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: preset.badgeBg }}
            onClick={() => {
              if (isInteractiveEditable) {
                const currentIndex = ICON_OPTIONS.findIndex((i) => i.id === ad.iconBadge);
                const nextIcon = ICON_OPTIONS[(currentIndex + 1) % ICON_OPTIONS.length];
                handleInlineChange('iconBadge', nextIcon.id);
              }
            }}
          >
            <IconComp className="w-6 h-6" style={{ color: preset.badgeText }} />
          </div>

          <div className="space-y-0.5 w-full">
            {isInteractiveEditable ? (
              <input
                type="text"
                value={ad.title || ''}
                onChange={(e) => handleInlineChange('title', e.target.value)}
                placeholder="Title"
                className={`w-full bg-black/5 hover:bg-black/10 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-[#334DAF] border border-black/10 ${fontClass} ${titleSizeClass}`}
                style={{ color: textColor }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h3 className={`${fontClass} ${titleSizeClass}`} style={{ color: textColor }}>
                {ad.title || 'Body Status'}
              </h3>
            )}

            {isInteractiveEditable ? (
              <input
                type="text"
                value={ad.subtitlePrice || ''}
                onChange={(e) => handleInlineChange('subtitlePrice', e.target.value)}
                placeholder="Metric or price (e.g. +3 points)"
                className="w-full bg-black/5 hover:bg-black/10 rounded-md px-2 py-0.5 text-xs font-bold border border-black/10 focus:outline-none"
                style={{ color: subtextColor }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              ad.subtitlePrice && (
                <div className="font-bold text-sm sm:text-base" style={{ color: subtextColor }}>
                  {ad.subtitlePrice}
                </div>
              )
            )}
          </div>

          <div className="w-full">
            {isInteractiveEditable ? (
              <textarea
                value={ad.description || ''}
                onChange={(e) => handleInlineChange('description', e.target.value)}
                placeholder="Description"
                rows={2}
                className={`w-full bg-black/5 hover:bg-black/10 rounded-lg p-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#334DAF] border border-black/10 resize-none ${fontClass} ${bodySizeClass}`}
                style={{ color: subtextColor }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              ad.description && (
                <p className={`${fontClass} ${bodySizeClass} line-clamp-3`} style={{ color: subtextColor }}>
                  {ad.description}
                </p>
              )
            )}
          </div>

          {/* CTA */}
          <div className="pt-2 w-full">
            {isInteractiveEditable ? (
              <div
                className="w-full py-2 rounded-full font-black text-xs flex items-center justify-center gap-2 shadow-sm"
                style={{ backgroundColor: accentBg, color: accentText }}
              >
                <input
                  type="text"
                  value={ad.ctaText || 'Learn More'}
                  onChange={(e) => handleInlineChange('ctaText', e.target.value)}
                  className="bg-transparent text-center font-bold text-xs focus:outline-none w-28 text-white"
                  onClick={(e) => e.stopPropagation()}
                />
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            ) : (
              ad.ctaText && (
                <button
                  type="button"
                  onClick={onCtaClick}
                  className="w-full py-2.5 rounded-full font-black text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-all cursor-pointer active:scale-95"
                  style={{ backgroundColor: accentBg, color: accentText }}
                >
                  <span>{ad.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. VERTICAL CENTERED DISPLAY LAYOUT */}
      {/* ======================================================== */}
      {layout === 'vertical-centered' && (
        <div className="relative z-10 p-5 sm:p-6 flex flex-col items-center text-center space-y-3">
          <div
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs"
            style={{ backgroundColor: preset.badgeBg, color: preset.badgeText }}
          >
            <IconComp className="w-3 h-3" />
            {isInteractiveEditable ? (
              <input
                type="text"
                value={ad.badgeText || ''}
                onChange={(e) => handleInlineChange('badgeText', e.target.value)}
                placeholder="Badge"
                className="bg-transparent border-b border-current focus:outline-none text-[10px] font-black uppercase w-20 text-center"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span>{ad.badgeText || 'Special Feature'}</span>
            )}
          </div>

          {ad.imageUrl && (
            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white/70">
              <img src={ad.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="w-full">
            {isInteractiveEditable ? (
              <input
                type="text"
                value={ad.title || ''}
                onChange={(e) => handleInlineChange('title', e.target.value)}
                placeholder="Campaign Headline"
                className={`w-full text-center bg-black/5 hover:bg-black/10 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-[#334DAF] border border-black/10 ${fontClass} ${titleSizeClass}`}
                style={{ color: textColor }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h3 className={`${fontClass} ${titleSizeClass}`} style={{ color: textColor }}>
                {ad.title || 'Special Feature'}
              </h3>
            )}

            {isInteractiveEditable ? (
              <input
                type="text"
                value={ad.subtitlePrice || ''}
                onChange={(e) => handleInlineChange('subtitlePrice', e.target.value)}
                placeholder="Subtitle price"
                className="w-full text-center bg-black/5 hover:bg-black/10 rounded-md px-2 py-0.5 text-xs font-bold border border-black/10 focus:outline-none mt-1"
                style={{ color: subtextColor }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              ad.subtitlePrice && (
                <div className="font-bold text-xs sm:text-sm mt-0.5" style={{ color: subtextColor }}>
                  {ad.subtitlePrice}
                </div>
              )
            )}
          </div>

          <div className="w-full">
            {isInteractiveEditable ? (
              <textarea
                value={ad.description || ''}
                onChange={(e) => handleInlineChange('description', e.target.value)}
                placeholder="Description"
                rows={2}
                className={`w-full text-center bg-black/5 hover:bg-black/10 rounded-lg p-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#334DAF] border border-black/10 resize-none ${fontClass} ${bodySizeClass}`}
                style={{ color: subtextColor }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              ad.description && (
                <p className={`${fontClass} ${bodySizeClass}`} style={{ color: subtextColor }}>
                  {ad.description}
                </p>
              )
            )}
          </div>

          <div className="pt-2 w-full max-w-xs">
            {isInteractiveEditable ? (
              <div
                className="w-full py-2.5 rounded-full font-black text-xs flex items-center justify-center gap-2 shadow-md"
                style={{ backgroundColor: accentBg, color: accentText }}
              >
                <input
                  type="text"
                  value={ad.ctaText || 'Claim Offer'}
                  onChange={(e) => handleInlineChange('ctaText', e.target.value)}
                  className="bg-transparent text-center font-bold text-xs focus:outline-none w-28 text-white"
                  onClick={(e) => e.stopPropagation()}
                />
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            ) : (
              ad.ctaText && (
                <button
                  type="button"
                  onClick={onCtaClick}
                  className="w-full py-2.5 rounded-full font-black text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all cursor-pointer active:scale-95"
                  style={{ backgroundColor: accentBg, color: accentText }}
                >
                  <span>{ad.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. STANDARD CARD LAYOUT */}
      {/* ======================================================== */}
      {layout === 'standard' && (
        <div className={`relative z-10 p-5 flex flex-col ${textAlignClass} space-y-3`}>
          <div className="flex items-center justify-between w-full">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs flex items-center gap-1"
              style={{ backgroundColor: preset.badgeBg, color: preset.badgeText }}
            >
              <IconComp className="w-3 h-3" />
              {isInteractiveEditable ? (
                <input
                  type="text"
                  value={ad.badgeText || ''}
                  onChange={(e) => handleInlineChange('badgeText', e.target.value)}
                  placeholder="Badge"
                  className="bg-transparent border-b border-current focus:outline-none text-[10px] font-black uppercase w-20"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span>{ad.badgeText || 'Sponsored'}</span>
              )}
            </span>

            {isInteractiveEditable ? (
              <input
                type="text"
                value={ad.subtitlePrice || ''}
                onChange={(e) => handleInlineChange('subtitlePrice', e.target.value)}
                placeholder="Price"
                className="bg-black/5 rounded px-1.5 py-0.5 text-xs font-extrabold w-20 text-end focus:outline-none"
                style={{ color: subtextColor }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              ad.subtitlePrice && (
                <span className="font-extrabold text-xs" style={{ color: subtextColor }}>
                  {ad.subtitlePrice}
                </span>
              )
            )}
          </div>

          {ad.imageUrl && (
            <div className="w-full h-32 rounded-2xl overflow-hidden shadow-inner border border-white/40">
              <img src={ad.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="w-full">
            {isInteractiveEditable ? (
              <input
                type="text"
                value={ad.title || ''}
                onChange={(e) => handleInlineChange('title', e.target.value)}
                placeholder="Campaign Headline"
                className={`w-full bg-black/5 hover:bg-black/10 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-[#334DAF] border border-black/10 ${fontClass} ${titleSizeClass}`}
                style={{ color: textColor }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h3 className={`${fontClass} ${titleSizeClass}`} style={{ color: textColor }}>
                {ad.title || 'Campaign Headline'}
              </h3>
            )}

            {isInteractiveEditable ? (
              <textarea
                value={ad.description || ''}
                onChange={(e) => handleInlineChange('description', e.target.value)}
                placeholder="Description text..."
                rows={2}
                className={`w-full bg-black/5 hover:bg-black/10 rounded-lg p-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#334DAF] border border-black/10 resize-none mt-1 ${fontClass} ${bodySizeClass}`}
                style={{ color: subtextColor }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              ad.description && (
                <p
                  className={`${fontClass} ${bodySizeClass} mt-1 line-clamp-3`}
                  style={{ color: subtextColor }}
                >
                  {ad.description}
                </p>
              )
            )}
          </div>

          {/* CTA */}
          <div className="pt-2 w-full">
            {isInteractiveEditable ? (
              <div
                className="w-full py-2.5 rounded-full font-black text-xs flex items-center justify-center gap-2 shadow-md"
                style={{ backgroundColor: accentBg, color: accentText }}
              >
                <input
                  type="text"
                  value={ad.ctaText || 'Learn More'}
                  onChange={(e) => handleInlineChange('ctaText', e.target.value)}
                  className="bg-transparent text-center font-bold text-xs focus:outline-none w-28 text-white"
                  onClick={(e) => e.stopPropagation()}
                />
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            ) : (
              ad.ctaText && (
                <button
                  type="button"
                  onClick={onCtaClick}
                  className="w-full py-2.5 rounded-full font-black text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all cursor-pointer active:scale-95"
                  style={{ backgroundColor: accentBg, color: accentText }}
                >
                  <span>{ad.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
