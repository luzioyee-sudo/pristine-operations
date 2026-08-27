// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Megaphone,
  Sparkles,
  Send,
  Bell,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  Radio,
  ExternalLink,
  Users,
  User,
  Zap,
  MousePointerClick,
  TrendingUp,
  Layout,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  X,
  Layers,
  BookOpen,
  Info,
  Calendar,
  Clock,
  PauseCircle,
  PlayCircle,
  Edit3,
  Copy,
  RotateCcw,
  Search,
  Filter,
  Sliders,
  Check,
  Type,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Heart,
  Activity,
  Bed,
  Star,
  Crown,
  Flame,
  Gift,
  Shield,
  Coffee,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { AppAd, AppNotification, UserAccount } from '../types';
import { notificationManager } from '../utils/notificationManager';
import { ImageDropzoneUpload } from './ImageDropzoneUpload';
import { AdCardView, CARD_PALETTES, ICON_OPTIONS } from './AdCardView';

interface AdminAdsManagerProps {
  userAccounts: UserAccount[];
  onLogAdminAction?: (desc: string) => void;
  initialRecipientId?: string | null;
}

type AdsFilterTab = 'all' | 'active' | 'paused' | 'scheduled' | 'expired';

export const AdminAdsManager: React.FC<AdminAdsManagerProps> = ({
  userAccounts,
  onLogAdminAction,
  initialRecipientId,
}) => {
  const [subTab, setSubTab] = useState<'ads' | 'messages'>('ads');

  // Ads State
  const [ads, setAds] = useState<AppAd[]>(() => notificationManager.getAds());
  const [filterTab, setFilterTab] = useState<AdsFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Ad Form State (For Creating or Editing)
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [inspectAd, setInspectAd] = useState<AppAd | null>(null);

  const [adTitle, setAdTitle] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adTargetPage, setAdTargetPage] = useState<AppAd['targetPage']>('all');
  const [adTargetPages, setAdTargetPages] = useState<string[]>([]);
  const [adPlacement, setAdPlacement] = useState<AppAd['placement']>('top-banner');
  const [adBadgeText, setAdBadgeText] = useState('Special Offer');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adCtaText, setAdCtaText] = useState('Explore Now');
  const [adCtaUrl, setAdCtaUrl] = useState('#practice');
  const [adStartDate, setAdStartDate] = useState('');
  const [adExpiresAt, setAdExpiresAt] = useState('');
  const [adDelaySeconds, setAdDelaySeconds] = useState<number>(0);
  const [adFrequency, setAdFrequency] = useState<AppAd['frequency']>('always');
  const [adSendNotification, setAdSendNotification] = useState(true);
  const [adSuccessMsg, setAdSuccessMsg] = useState<string | null>(null);

  // Visual Customization States (Card Colors, Fonts, Sizes, Alignment, Layout, Bullets, Icon)
  const [adCardTheme, setAdCardTheme] = useState<AppAd['cardTheme']>('pastel-blue');
  const [adBgColor, setAdBgColor] = useState('#E4EFFB');
  const [adTextColor, setAdTextColor] = useState('#19335A');
  const [adAccentColor, setAdAccentColor] = useState('#19335A');
  const [adCardFont, setAdCardFont] = useState<AppAd['cardFont']>('sans');
  const [adTitleSize, setAdTitleSize] = useState<AppAd['titleSize']>('lg');
  const [adBodySize, setAdBodySize] = useState<AppAd['bodySize']>('sm');
  const [adTextAlign, setAdTextAlign] = useState<AppAd['textAlign']>('left');
  const [adCardLayout, setAdCardLayout] = useState<AppAd['cardLayout']>('horizontal-split');
  const [adIconBadge, setAdIconBadge] = useState<string>('app-logo');
  const [adSubtitlePrice, setAdSubtitlePrice] = useState('$89 / Month');
  const [adBulletPoints, setAdBulletPoints] = useState<string[]>([
    'Satellite coverage',
    'Additional lines included',
  ]);
  const [adCardRadius, setAdCardRadius] = useState<AppAd['cardRadius']>('squircle');

  // Pause Duration Modal State
  const [pauseModalAd, setPauseModalAd] = useState<AppAd | null>(null);
  const [pauseDurationHours, setPauseDurationHours] = useState<number>(24);
  const [customResumeDate, setCustomResumeDate] = useState('');
  const [pauseReason, setPauseReason] = useState('Scheduled maintenance / revision');

  // Message / Broadcast State
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    notificationManager.getNotifications()
  );
  const [msgRecipient, setMsgRecipient] = useState<string>(initialRecipientId || 'all');
  const [msgType, setMsgType] = useState<AppNotification['type']>('message');
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgPriority, setMsgPriority] = useState<AppNotification['priority']>('normal');
  const [msgActionText, setMsgActionText] = useState('');
  const [msgActionUrl, setMsgActionUrl] = useState('');
  const [msgBannerUrl, setMsgBannerUrl] = useState('');
  const [msgSuccessMsg, setMsgSuccessMsg] = useState<string | null>(null);

  const refreshData = React.useCallback(() => {
    setAds(notificationManager.getAds());
    setNotifications(notificationManager.getNotifications());
  }, []);

  useEffect(() => {
    if (initialRecipientId) {
      setMsgRecipient(initialRecipientId);
      setSubTab('messages');
    }
  }, [initialRecipientId]);

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener('lingoflow_ads_changed', handleUpdate);
    window.addEventListener('lingoflow_notifications_changed', handleUpdate);
    return () => {
      window.removeEventListener('lingoflow_ads_changed', handleUpdate);
      window.removeEventListener('lingoflow_notifications_changed', handleUpdate);
    };
  }, [refreshData]);

  // Open editor for a new ad
  const handleOpenCreateAd = () => {
    setEditingAdId(null);
    setAdTitle('Upgrade to Pro Plan');
    setAdDescription('Get satellite offline coverage, unlimited AI practice, and 500+ premium vocabulary decks.');
    setAdTargetPage('all');
    setAdTargetPages([]);
    setAdPlacement('floating-card');
    setAdBadgeText('Popcorn Pro');
    setAdImageUrl('');
    setAdCtaText('Pay with Apple Pay');
    setAdCtaUrl('#practice');
    setAdStartDate('');
    setAdExpiresAt('');
    setAdDelaySeconds(0);
    setAdFrequency('always');
    setAdSendNotification(true);

    // Visual defaults
    setAdCardTheme('pastel-blue');
    setAdBgColor('#E4EFFB');
    setAdTextColor('#19335A');
    setAdAccentColor('#19335A');
    setAdCardFont('sans');
    setAdTitleSize('lg');
    setAdBodySize('sm');
    setAdTextAlign('left');
    setAdCardLayout('horizontal-split');
    setAdIconBadge('app-logo');
    setAdSubtitlePrice('$89 / Month');
    setAdBulletPoints(['Satellite coverage', 'Additional lines included']);
    setAdCardRadius('squircle');

    setIsEditorOpen(true);
  };

  // Open editor for existing ad
  const handleOpenEditAd = (ad: AppAd) => {
    setEditingAdId(ad.id);
    setAdTitle(ad.title);
    setAdDescription(ad.description);
    setAdTargetPage(ad.targetPage || 'all');
    setAdTargetPages(ad.targetPages || (ad.targetPage !== 'all' ? [ad.targetPage] : []));
    setAdPlacement(ad.placement);
    setAdBadgeText(ad.badgeText || 'Special Offer');
    setAdImageUrl(ad.imageUrl || '');
    setAdCtaText(ad.ctaText || 'Learn More');
    setAdCtaUrl(ad.ctaUrl || '#reader');
    setAdStartDate(ad.startDate ? ad.startDate.slice(0, 16) : '');
    setAdExpiresAt(ad.expiresAt ? ad.expiresAt.slice(0, 16) : '');
    setAdDelaySeconds(ad.delaySeconds || 0);
    setAdFrequency(ad.frequency || 'always');
    setAdSendNotification(false);

    // Load styling
    setAdCardTheme(ad.cardTheme || 'pastel-blue');
    setAdBgColor(ad.bgColor || '#E4EFFB');
    setAdTextColor(ad.textColor || '#19335A');
    setAdAccentColor(ad.accentColor || '#19335A');
    setAdCardFont(ad.cardFont || 'sans');
    setAdTitleSize(ad.titleSize || 'md');
    setAdBodySize(ad.bodySize || 'sm');
    setAdTextAlign(ad.textAlign || 'left');
    setAdCardLayout(ad.cardLayout || 'standard');
    setAdIconBadge(ad.iconBadge || 'sparkles');
    setAdSubtitlePrice(ad.subtitlePrice || '');
    setAdBulletPoints(ad.bulletPoints ? [...ad.bulletPoints] : []);
    setAdCardRadius(ad.cardRadius || 'squircle');

    setIsEditorOpen(true);
  };

  // Save (Create or Update) Ad
  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim() || !adDescription.trim()) return;

    const filteredBullets = adBulletPoints.map((b) => b.trim()).filter(Boolean);

    if (editingAdId) {
      // UPDATE EXISTING AD
      notificationManager.updateAd(editingAdId, {
        title: adTitle.trim(),
        description: adDescription.trim(),
        targetPage: adTargetPage,
        targetPages: adTargetPages.length > 0 ? adTargetPages : undefined,
        placement: adPlacement,
        badgeText: adBadgeText.trim() || 'Sponsored',
        imageUrl: adImageUrl.trim() || undefined,
        ctaText: adCtaText.trim() || undefined,
        ctaUrl: adCtaUrl.trim() || undefined,
        startDate: adStartDate ? new Date(adStartDate).toISOString() : undefined,
        expiresAt: adExpiresAt ? new Date(adExpiresAt).toISOString() : undefined,
        delaySeconds: adDelaySeconds,
        frequency: adFrequency,
        
        // Visual Styling
        cardTheme: adCardTheme,
        bgColor: adCardTheme === 'custom' ? adBgColor : undefined,
        textColor: adCardTheme === 'custom' ? adTextColor : undefined,
        accentColor: adCardTheme === 'custom' ? adAccentColor : undefined,
        cardFont: adCardFont,
        titleSize: adTitleSize,
        bodySize: adBodySize,
        textAlign: adTextAlign,
        cardLayout: adCardLayout,
        iconBadge: adIconBadge,
        subtitlePrice: adSubtitlePrice.trim() || undefined,
        bulletPoints: filteredBullets.length > 0 ? filteredBullets : undefined,
        cardRadius: adCardRadius,
      });

      if (onLogAdminAction) {
        onLogAdminAction(`Updated ad campaign "${adTitle}" (#${editingAdId})`);
      }
      setAdSuccessMsg(`Ad "${adTitle}" updated successfully!`);
    } else {
      // CREATE NEW AD
      await notificationManager.createAd(
        {
          title: adTitle.trim(),
          description: adDescription.trim(),
          targetPage: adTargetPage,
          targetPages: adTargetPages.length > 0 ? adTargetPages : undefined,
          placement: adPlacement,
          badgeText: adBadgeText.trim() || 'Sponsored',
          imageUrl: adImageUrl.trim() || undefined,
          ctaText: adCtaText.trim() || undefined,
          ctaUrl: adCtaUrl.trim() || undefined,
          active: true,
          startDate: adStartDate ? new Date(adStartDate).toISOString() : undefined,
          expiresAt: adExpiresAt ? new Date(adExpiresAt).toISOString() : undefined,
          delaySeconds: adDelaySeconds,
          frequency: adFrequency,

          // Visual Styling
          cardTheme: adCardTheme,
          bgColor: adCardTheme === 'custom' ? adBgColor : undefined,
          textColor: adCardTheme === 'custom' ? adTextColor : undefined,
          accentColor: adCardTheme === 'custom' ? adAccentColor : undefined,
          cardFont: adCardFont,
          titleSize: adTitleSize,
          bodySize: adBodySize,
          textAlign: adTextAlign,
          cardLayout: adCardLayout,
          iconBadge: adIconBadge,
          subtitlePrice: adSubtitlePrice.trim() || undefined,
          bulletPoints: filteredBullets.length > 0 ? filteredBullets : undefined,
          cardRadius: adCardRadius,
        },
        adSendNotification
      );

      if (onLogAdminAction) {
        onLogAdminAction(`Created new ad "${adTitle}" targeting ${adTargetPage} as ${adPlacement}`);
      }
      setAdSuccessMsg(`Ad "${adTitle}" published successfully!`);
    }

    setTimeout(() => setAdSuccessMsg(null), 4000);
    setIsEditorOpen(false);
    refreshData();
  };

  const handleToggleAd = (adId: string) => {
    const newStatus = notificationManager.toggleAdActive(adId);
    if (onLogAdminAction) {
      onLogAdminAction(`Toggled ad #${adId} status to ${newStatus ? 'Active' : 'Paused'}`);
    }
    refreshData();
  };

  const handleDuplicateAd = async (adId: string) => {
    const copy = await notificationManager.duplicateAd(adId);
    if (copy && onLogAdminAction) {
      onLogAdminAction(`Cloned ad campaign #${adId} as draft "${copy.title}"`);
    }
    refreshData();
  };

  const handleResetStats = (adId: string) => {
    notificationManager.resetAdStats(adId);
    if (onLogAdminAction) {
      onLogAdminAction(`Reset impression & click analytics for ad #${adId}`);
    }
    refreshData();
  };

  const handleDeleteAd = async (adId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this ad campaign?')) {
      await notificationManager.deleteAd(adId);
      if (onLogAdminAction) {
        onLogAdminAction(`Deleted ad campaign #${adId}`);
      }
      refreshData();
    }
  };

  // Temporary Pause Modal Submission
  const handleApplyPause = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pauseModalAd) return;

    if (customResumeDate) {
      const untilISO = new Date(customResumeDate).toISOString();
      notificationManager.pauseAdForDuration(pauseModalAd.id, {
        untilISO,
        reason: pauseReason,
      });
      if (onLogAdminAction) {
        onLogAdminAction(`Temporarily paused ad "${pauseModalAd.title}" until ${new Date(customResumeDate).toLocaleString()}`);
      }
    } else {
      notificationManager.pauseAdForDuration(pauseModalAd.id, {
        durationHours: pauseDurationHours,
        reason: pauseReason,
      });
      if (onLogAdminAction) {
        onLogAdminAction(`Temporarily paused ad "${pauseModalAd.title}" for ${pauseDurationHours} hours`);
      }
    }

    setPauseModalAd(null);
    setCustomResumeDate('');
    refreshData();
  };

  const handleResumeNow = (adId: string) => {
    notificationManager.resumeAd(adId);
    if (onLogAdminAction) {
      onLogAdminAction(`Resumed paused ad campaign #${adId} immediately`);
    }
    refreshData();
  };

  // Handle Send Direct Message or Broadcast
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgTitle.trim() || !msgBody.trim()) return;

    let targetUserName: string | undefined;
    let targetUserEmail: string | undefined;

    if (msgRecipient !== 'all') {
      const found = userAccounts.find((u) => u.id === msgRecipient);
      if (found) {
        targetUserName = found.name;
        targetUserEmail = found.email;
      }
    }

    await notificationManager.sendNotification({
      title: msgTitle.trim(),
      message: msgBody.trim(),
      type: msgType,
      targetUserId: msgRecipient,
      targetUserName,
      targetUserEmail,
      senderName: 'Admin Team',
      actionText: msgActionText.trim() || undefined,
      actionUrl: msgActionUrl.trim() || undefined,
      bannerUrl: msgBannerUrl.trim() || undefined,
      priority: msgPriority,
      badgeText:
        msgType === 'ad'
          ? 'SPONSORED'
          : msgRecipient === 'all'
          ? 'GLOBAL BROADCAST'
          : 'DIRECT MESSAGE',
    });

    const recipientLabel = msgRecipient === 'all' ? 'All Users' : targetUserName || msgRecipient;
    if (onLogAdminAction) {
      onLogAdminAction(`Sent ${msgType} notification to ${recipientLabel}: "${msgTitle}"`);
    }

    setMsgSuccessMsg(`Notification sent to ${recipientLabel}!`);
    setTimeout(() => setMsgSuccessMsg(null), 4000);

    // Reset form
    setMsgTitle('');
    setMsgBody('');
    setMsgActionText('');
    setMsgActionUrl('');
    setMsgBannerUrl('');
    refreshData();
  };

  const handleDeleteNotification = async (notifId: string) => {
    await notificationManager.deleteNotification(notifId);
    if (onLogAdminAction) {
      onLogAdminAction(`Revoked notification #${notifId}`);
    }
    refreshData();
  };

  // Analytics & Summary Metrics
  const totalImpressions = ads.reduce((acc, a) => acc + (a.impressionsCount || 0), 0);
  const totalClicks = ads.reduce((acc, a) => acc + (a.clicksCount || 0), 0);
  const clickThroughRate = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0.0';

  const nowTime = Date.now();
  const activeAdsCount = ads.filter((a) => {
    if (!a.active) return false;
    if (a.pausedUntil && new Date(a.pausedUntil).getTime() > nowTime) return false;
    if (a.startDate && new Date(a.startDate).getTime() > nowTime) return false;
    if (a.expiresAt && new Date(a.expiresAt).getTime() <= nowTime) return false;
    return true;
  }).length;

  const pausedAdsCount = ads.filter((a) => {
    if (!a.active) return true;
    if (a.pausedUntil && new Date(a.pausedUntil).getTime() > nowTime) return true;
    return false;
  }).length;

  const scheduledCount = ads.filter((a) => {
    return a.startDate && new Date(a.startDate).getTime() > nowTime;
  }).length;

  const expiredCount = ads.filter((a) => {
    return a.expiresAt && new Date(a.expiresAt).getTime() <= nowTime;
  }).length;

  // Filter and Search Ads
  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      const isPaused = !ad.active || (ad.pausedUntil && new Date(ad.pausedUntil).getTime() > nowTime);
      const isScheduled = ad.startDate && new Date(ad.startDate).getTime() > nowTime;
      const isExpired = ad.expiresAt && new Date(ad.expiresAt).getTime() <= nowTime;
      const isActiveNow = ad.active && !isPaused && !isScheduled && !isExpired;

      if (filterTab === 'active' && !isActiveNow) return false;
      if (filterTab === 'paused' && !isPaused) return false;
      if (filterTab === 'scheduled' && !isScheduled) return false;
      if (filterTab === 'expired' && !isExpired) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ad.title?.toLowerCase().includes(q);
        const matchDesc = ad.description?.toLowerCase().includes(q);
        const matchBadge = ad.badgeText?.toLowerCase().includes(q);
        const matchPage = ad.targetPage?.toLowerCase().includes(q);
        const matchPlacement = ad.placement?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchBadge && !matchPage && !matchPlacement) {
          return false;
        }
      }

      return true;
    });
  }, [ads, filterTab, searchQuery, nowTime]);

  const targetPageOptions = [
    { value: 'all', label: 'All Pages (Global App-Wide)' },
    { value: 'home', label: 'Dashboard / Home' },
    { value: 'reader', label: 'Bilingual PDF Reader' },
    { value: 'flashcards', label: 'Flashcards & Decks' },
    { value: 'dictionary', label: 'Dictionary & Vocab' },
    { value: 'practice', label: 'AI Practice & Chat' },
    { value: 'writing', label: 'Ribble Writing Studio' },
    { value: 'settings', label: 'Settings & Preferences' },
  ];

  const placementOptions = [
    { value: 'top-banner', label: 'Top Sticky Banner (Aero Bar)', desc: 'Horizontal ribbon across the top' },
    { value: 'bottom-banner', label: 'Bottom Sticky Ribbon', desc: 'Docked bar at screen bottom' },
    { value: 'floating-card', label: 'Floating Card (Bottom-Right)', desc: 'Interactive floating widget' },
    { value: 'floating-left', label: 'Floating Card (Bottom-Left)', desc: 'Compact floating card' },
    { value: 'modal-popup', label: 'Interactive Pop-up Modal', desc: 'Centered dialog with dark backdrop' },
    { value: 'interstitial', label: 'Fullscreen Interstitial Takeover', desc: 'Immersive screen display' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Grid */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#334DAF]" />
            Ads Campaign, Scheduling & User Messaging Hub
          </h2>
          <p className="text-xs text-stone-400">
            Create multi-format ads, schedule start/expiration times, upload pictures from device or clipboard, pause campaigns, or broadcast messages.
          </p>
        </div>

        {/* Sub-tab Pill Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-850 rounded-2xl border border-[#D0E4FE]/80 dark:border-stone-800">
          <button
            onClick={() => setSubTab('ads')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'ads'
                ? 'bg-[#334DAF] text-white shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ad Campaigns ({ads.length})</span>
          </button>

          <button
            onClick={() => setSubTab('messages')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'messages'
                ? 'bg-[#334DAF] text-white shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Notification ({notifications.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1D201A] border border-[#D0E4FE]/80 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Live</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-stone-900 dark:text-stone-100">
            {activeAdsCount} <span className="text-xs text-stone-400 font-normal">/ {ads.length} campaigns</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1D201A] border border-[#D0E4FE]/80 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Paused / Scheduled</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-stone-900 dark:text-stone-100">
            {pausedAdsCount} <span className="text-xs text-stone-400 font-normal">paused · {scheduledCount} future</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1D201A] border border-[#D0E4FE]/80 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Impressions & CTR</span>
            <MousePointerClick className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-black text-stone-900 dark:text-stone-100">
            {totalImpressions.toLocaleString()} <span className="text-xs font-bold text-blue-600">({clickThroughRate}%)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1D201A] border border-[#D0E4FE]/80 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Clicks</span>
            <TrendingUp className="w-4 h-4 text-[#334DAF]" />
          </div>
          <div className="text-xl font-black text-stone-900 dark:text-stone-100">
            {totalClicks} <span className="text-xs text-stone-400 font-normal">clicks</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: POST & MANAGE IN-APP ADS */}
      {/* ======================================================== */}
      {subTab === 'ads' && (
        <div className="space-y-6">
          {/* Main Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1D201A] border border-[#D0E4FE]/80 dark:border-stone-800 rounded-2xl p-3.5 shadow-xs">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {(
                [
                  { id: 'all', label: `All (${ads.length})` },
                  { id: 'active', label: `Active (${activeAdsCount})` },
                  { id: 'paused', label: `Paused (${pausedAdsCount})` },
                  { id: 'scheduled', label: `Scheduled (${scheduledCount})` },
                  { id: 'expired', label: `Expired (${expiredCount})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    filterTab === tab.id
                      ? 'bg-[#E8F2FE] dark:bg-[#E8F2FE] text-[#334DAF] border border-[#334DAF]/30'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search & Create New Button */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search ads by title, page, type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full ps-8 pe-3 py-1.5 text-xs rounded-xl border border-[#D0E4FE] dark:border-stone-800 bg-[#E8F2FE] dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#334DAF]"
                />
              </div>

              <button
                onClick={handleOpenCreateAd}
                className="px-4 py-2 rounded-xl bg-[#334DAF] hover:bg-[#091F5C] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Ad</span>
              </button>
            </div>
          </div>

          {/* Success Message Banner */}
          {adSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{adSuccessMsg}</span>
            </div>
          )}

          {/* ADS TABLE & HISTORY LIST */}
          <div className="bg-white dark:bg-[#1D201A] border border-[#D0E4FE]/80 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  Ad Campaigns Registry ({filteredAds.length})
                </h3>
                <p className="text-xs text-stone-400">
                  Inspect old campaigns, edit parameters, stop for custom duration, clone, or delete.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Ad Campaign</th>
                    <th className="py-3 px-3">Format & Page</th>
                    <th className="py-3 px-3">Timing & Delay</th>
                    <th className="py-3 px-3">Schedule / Status</th>
                    <th className="py-3 px-3">Impressions / Clicks</th>
                    <th className="py-3 px-3 text-end">Actions & Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredAds.map((ad) => {
                    const ctr =
                      ad.impressionsCount && ad.impressionsCount > 0
                        ? (((ad.clicksCount || 0) / ad.impressionsCount) * 100).toFixed(1)
                        : '0.0';

                    const isPaused = !ad.active || (ad.pausedUntil && new Date(ad.pausedUntil).getTime() > nowTime);
                    const isScheduled = ad.startDate && new Date(ad.startDate).getTime() > nowTime;
                    const isExpired = ad.expiresAt && new Date(ad.expiresAt).getTime() <= nowTime;
                    const isTemporaryPause = ad.pausedUntil && new Date(ad.pausedUntil).getTime() > nowTime;

                    return (
                      <tr key={ad.id} className="hover:bg-[#E8F2FE]/50 dark:hover:bg-stone-900/50">
                        {/* 1. Campaign Details with Thumbnail */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-start gap-3 max-w-xs">
                            {ad.imageUrl ? (
                              <img
                                src={ad.imageUrl}
                                alt=""
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#D0E4FE] dark:border-stone-700"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 shrink-0 border border-dashed border-stone-300 dark:border-stone-700">
                                <Sparkles className="w-4 h-4 text-[#334DAF]" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="px-1.5 py-0.5 rounded-md bg-[#E8F2FE] dark:bg-[#E8F2FE] text-[#334DAF] text-[9px] font-black uppercase">
                                  {ad.badgeText || 'Promo'}
                                </span>
                              </div>
                              <span className="font-bold text-stone-900 dark:text-stone-100 truncate block">
                                {ad.title}
                              </span>
                              <span className="text-[11px] text-stone-400 line-clamp-1">
                                {ad.description}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Format & Page Target */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-[#7096D1] font-bold text-[10px]">
                              {ad.placement}
                            </span>
                            <div className="text-[11px] text-stone-500 font-medium">
                              Page: <strong className="text-[#091F5C] dark:text-stone-200">{ad.targetPage}</strong>
                            </div>
                          </div>
                        </td>

                        {/* 3. Timing & Delay */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-1 text-[11px] text-stone-600 dark:text-[#7096D1]">
                            <div>Delay: <strong>{ad.delaySeconds ? `${ad.delaySeconds}s` : 'Instant'}</strong></div>
                            <div className="text-stone-400 text-[10px]">Freq: {ad.frequency || 'Always'}</div>
                          </div>
                        </td>

                        {/* 4. Schedule & Live Status */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-1">
                            {isTemporaryPause ? (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 text-[10px] font-bold">
                                <PauseCircle className="w-3 h-3" />
                                <span>Paused until {new Date(ad.pausedUntil!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            ) : isScheduled ? (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 text-[10px] font-bold">
                                <Calendar className="w-3 h-3" />
                                <span>Starts {new Date(ad.startDate!).toLocaleDateString()}</span>
                              </div>
                            ) : isExpired ? (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 text-[10px] font-bold">
                                <span>Expired</span>
                              </div>
                            ) : ad.active ? (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Active Live</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-[10px] font-bold">
                                <span>Inactive / Paused</span>
                              </div>
                            )}

                            {ad.expiresAt && (
                              <div className="text-[10px] text-stone-400">
                                Exp: {new Date(ad.expiresAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 5. Metrics */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-0.5">
                            <div className="font-bold text-[#091F5C] dark:text-stone-200">
                              {ad.impressionsCount || 0} <span className="text-[10px] font-normal text-stone-400">views</span>
                            </div>
                            <div className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                              {ad.clicksCount || 0} clicks ({ctr}%)
                            </div>
                          </div>
                        </td>

                        {/* 6. Actions */}
                        <td className="py-3.5 px-3 text-end">
                          <div className="inline-flex items-center gap-1">
                            {/* Stop for some time / Resume */}
                            {isTemporaryPause ? (
                              <button
                                onClick={() => handleResumeNow(ad.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                                title="Resume campaign right now"
                              >
                                <PlayCircle className="w-3.5 h-3.5" />
                                <span>Resume</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setPauseModalAd(ad)}
                                className="px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                                title="Stop or pause this ad for some time"
                              >
                                <PauseCircle className="w-3.5 h-3.5" />
                                <span>Stop / Pause</span>
                              </button>
                            )}

                            {/* Inspect Styled Card */}
                            <button
                              onClick={() => setInspectAd(ad)}
                              className="p-1.5 rounded-lg border border-[#334DAF]/30 bg-[#E8F2FE]/60 dark:bg-[#E8F2FE]/40 text-[#334DAF] hover:bg-[#E8F2FE] transition-colors cursor-pointer"
                              title="Inspect Live Styled Card"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Ad */}
                            <button
                              onClick={() => handleOpenEditAd(ad)}
                              className="p-1.5 rounded-lg border border-[#D0E4FE] dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-[#7096D1] transition-colors cursor-pointer"
                              title="Edit Ad Parameters"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Duplicate / Clone */}
                            <button
                              onClick={() => handleDuplicateAd(ad.id)}
                              className="p-1.5 rounded-lg border border-[#D0E4FE] dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-[#7096D1] transition-colors cursor-pointer"
                              title="Clone / Duplicate Ad"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* Reset Stats */}
                            <button
                              onClick={() => handleResetStats(ad.id)}
                              className="p-1.5 rounded-lg border border-[#D0E4FE] dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                              title="Reset Impressions & Clicks"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Ad */}
                            <button
                              onClick={() => handleDeleteAd(ad.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                              title="Delete Ad Permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredAds.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-400 italic">
                        No ad campaigns found matching filter &ldquo;{filterTab}&rdquo;.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: DIRECT NOTIFICATIONS & USER MESSAGING */}
      {/* ======================================================== */}
      {subTab === 'messages' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Compose Notification Form */}
            <div className="lg:col-span-7 bg-white dark:bg-[#1D201A] border border-[#D0E4FE]/80 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#334DAF]" />
                  Compose Notification or Direct Message
                </h3>
                <span className="text-[10px] text-stone-400 font-bold uppercase">Direct Dispatch</span>
              </div>

              {msgSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{msgSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="space-y-4 text-xs font-medium">
                {/* Recipient Selection */}
                <div>
                  <label className="block text-stone-700 dark:text-[#7096D1] font-bold mb-1">
                    Send Target (All Users or Specific User) *
                  </label>
                  <select
                    value={msgRecipient}
                    onChange={(e) => setMsgRecipient(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D0E4FE] dark:border-stone-800 bg-[#E8F2FE] dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold focus:outline-none focus:ring-2 focus:ring-[#334DAF]"
                  >
                    <option value="all">📢 Broadcast to All Users (All Registered Accounts)</option>
                    <optgroup label="Direct Message to Specific User">
                      {userAccounts.map((usr) => (
                        <option key={usr.id} value={usr.id}>
                          👤 {usr.name} ({usr.email || 'No email'}) — {usr.role}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 dark:text-[#7096D1] font-bold mb-1">
                      Notification Subject / Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Welcome Gift: Free 200 Flashcards unlocked!"
                      value={msgTitle}
                      onChange={(e) => setMsgTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D0E4FE] dark:border-stone-800 bg-[#E8F2FE] dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#334DAF]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-[#7096D1] font-bold mb-1">
                      Priority Level
                    </label>
                    <select
                      value={msgPriority}
                      onChange={(e) => setMsgPriority(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D0E4FE] dark:border-stone-800 bg-[#E8F2FE] dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold focus:outline-none"
                    >
                      <option value="normal">Normal (Standard)</option>
                      <option value="high">High (Highlighted in drawer)</option>
                      <option value="urgent">Urgent (Red Alert Badge)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-[#7096D1] font-bold mb-1">
                    Message Body Text *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Write detailed instructions, notes, or personalized message..."
                    value={msgBody}
                    onChange={(e) => setMsgBody(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D0E4FE] dark:border-stone-800 bg-[#E8F2FE] dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#334DAF] resize-none"
                  />
                </div>

                {/* Upload or paste banner image for notification */}
                <ImageDropzoneUpload
                  value={msgBannerUrl}
                  onChange={setMsgBannerUrl}
                  label="Notification Picture / Banner (Optional)"
                  helperText="Upload an image from device or paste from clipboard (Ctrl+V)"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 dark:text-[#7096D1] font-bold mb-1">
                      Action Button Label (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Open Reader, Study Decks"
                      value={msgActionText}
                      onChange={(e) => setMsgActionText(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D0E4FE] dark:border-stone-800 bg-[#E8F2FE] dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-[#7096D1] font-bold mb-1">
                      Action Destination Route / Link
                    </label>
                    <input
                      type="text"
                      placeholder="#reader, #flashcards, #practice, or https://"
                      value={msgActionUrl}
                      onChange={(e) => setMsgActionUrl(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D0E4FE] dark:border-stone-800 bg-[#E8F2FE] dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#334DAF] hover:bg-[#091F5C] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Notification Immediately</span>
                </button>
              </form>
            </div>

            {/* Notification History Log */}
            <div className="lg:col-span-5 bg-white dark:bg-[#1D201A] border border-[#D0E4FE]/80 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5">
                <h4 className="font-bold text-[#091F5C] dark:text-stone-200 text-xs flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-[#334DAF]" />
                  Dispatched Notifications History
                </h4>
                <span className="text-[10px] text-stone-400 font-semibold">
                  {notifications.length} Total
                </span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pe-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3.5 rounded-2xl bg-[#E8F2FE] dark:bg-stone-900/60 border border-[#D0E4FE]/80 dark:border-stone-800 space-y-2 relative"
                  >
                    <button
                      onClick={() => handleDeleteNotification(notif.id)}
                      className="absolute top-3 end-3 text-stone-400 hover:text-rose-500 cursor-pointer p-1"
                      title="Revoke / Delete Notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#E8F2FE] dark:bg-[#E8F2FE] text-[#334DAF] font-black text-[9px] uppercase">
                        {notif.targetUserId === 'all' ? 'BROADCAST' : 'DIRECT'}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h5 className="font-bold text-xs text-stone-900 dark:text-stone-100 pe-6">
                      {notif.title}
                    </h5>
                    <p className="text-[11px] text-stone-600 dark:text-[#7096D1]">
                      {notif.message}
                    </p>

                    {notif.targetUserId !== 'all' && (
                      <div className="text-[10px] text-stone-400 font-medium">
                        To: {notif.targetUserName || notif.targetUserId}
                      </div>
                    )}
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="py-8 text-center text-stone-400 text-xs italic">
                    No notifications sent yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: FULL AD CREATOR & EDITOR MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1E221B] border border-[#D0E4FE] dark:border-stone-800 rounded-3xl p-6 w-full max-w-4xl shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#334DAF]" />
                  <h3 className="font-black text-stone-900 dark:text-stone-100 text-base">
                    {editingAdId ? 'Edit Ad Campaign' : 'Create & Schedule New Ad'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-stone-700 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveAd} className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs font-medium">
                {/* Left Column: Form Controls */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Title & Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 dark:text-[#7096D1] font-bold mb-1">
                        Ad Headline / Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 50% Off Fluent English Mastery Deck"
                        value={adTitle}
                        onChange={(e) => setAdTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D0E4FE] dark:border-stone-800 bg-[#E8F2FE] dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#334DAF]"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 dark:text-[#7096D1] font-bold mb-1">
                        Badge Tag
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Special Offer, Sponsored, Limited Deal"
                        value={adBadgeText}
                        onChange={(e) => setAdBadgeText(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D0E4FE] dark:border-stone-800 bg-[#E8F2FE] dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#334DAF]"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-stone-700 dark:text-[#7096D1] font-bold mb-1">
                      Ad Description / Pitch *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Short pitch highlighting the key benefit, discount, or feature announcement..."
                      value={adDescription}
                      onChange={(e) => setAdDescription(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D0E4FE] dark:border-stone-800 bg-[#E8F2FE] dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#334DAF] resize-none"
                    />
                  </div>

                  {/* Where to Display (Target Page) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 dark:text-[#7096D1] font-bold mb-1">
                        Target Page (Where to Display)
                      </label>
                      <select
                        value={adTargetPage}
                        onChange={(e) => setAdTargetPage(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D0E4FE] dark:border-stone-800 bg-[#E8F2FE] dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold focus:outline-none"
                      >
                        {targetPageOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-700 dark:text-[#7096D1] font-bold mb-1">
                        Ad Format / Placement
                      </label>
                      <select
                        value={adPlacement}
                        onChange={(e) => setAdPlacement(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D0E4FE] dark:border-stone-800 bg-[#E8F2FE] dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold focus:outline-none"
                      >
                        {placementOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* When to Display (Scheduling & Timing) */}
                  <div className="p-3.5 rounded-2xl bg-[#E8F2FE] dark:bg-stone-900 border border-[#D0E4FE]/80 dark:border-stone-800 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-[#091F5C] dark:text-stone-200 text-xs">
                      <Clock className="w-4 h-4 text-[#334DAF]" />
                      <span>When to Appear (Scheduling & Display Timing)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-600 dark:text-stone-400 text-[11px] mb-1 font-semibold">
                          Start Date (Optional)
                        </label>
                        <input
                          type="datetime-local"
                          value={adStartDate}
                          onChange={(e) => setAdStartDate(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#D0E4FE] dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-600 dark:text-stone-400 text-[11px] mb-1 font-semibold">
                          Expiration Date (Optional)
                        </label>
                        <input
                          type="datetime-local"
                          value={adExpiresAt}
                          onChange={(e) => setAdExpiresAt(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#D0E4FE] dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-stone-600 dark:text-stone-400 text-[11px] mb-1 font-semibold">
                          Appearance Delay (Seconds after page open)
                        </label>
                        <select
                          value={adDelaySeconds}
                          onChange={(e) => setAdDelaySeconds(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#D0E4FE] dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                        >
                          <option value={0}>0s (Instant on Page Load)</option>
                          <option value={3}>3 seconds delay</option>
                          <option value={5}>5 seconds delay</option>
                          <option value={10}>10 seconds delay</option>
                          <option value={20}>20 seconds delay</option>
                          <option value={30}>30 seconds delay</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-600 dark:text-stone-400 text-[11px] mb-1 font-semibold">
                          Display Frequency
                        </label>
                        <select
                          value={adFrequency}
                          onChange={(e) => setAdFrequency(e.target.value as any)}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#D0E4FE] dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                        >
                          <option value="always">Always (Every time page opens)</option>
                          <option value="once-per-session">Once per user session</option>
                          <option value="once-ever">Once ever (until dismissed)</option>
                          <option value="daily">Once every 24 hours</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Picture Upload / Paste / Presets */}
                  <ImageDropzoneUpload
                    value={adImageUrl}
                    onChange={setAdImageUrl}
                    label="Promotional Picture / Banner (Upload from Device or Paste Ctrl+V)"
                    helperText="Upload any image directly without needing an external link, or select a preset."
                  />

                  {/* ======================================================== */}
                  {/* CARD STYLING, COLORS, FONTS & LAYOUT CONTROLS */}
                  {/* ======================================================== */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-stone-50 via-white to-stone-50 dark:from-stone-900 dark:via-[#1D201A] dark:to-stone-900 border border-[#334DAF]/30 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-[#D0E4FE]/80 dark:border-stone-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-[#334DAF]" />
                        <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                          Card Styling, Colors, Typography & Layout
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold text-[#334DAF] bg-[#E8F2FE] dark:bg-[#E8F2FE] px-2 py-0.5 rounded-md">
                        Visual Builder
                      </span>
                    </div>

                    {/* 1. PALETTE & COLORS */}
                    <div>
                      <label className="block text-stone-700 dark:text-[#7096D1] font-bold text-[11px] mb-1.5">
                        Card Color Theme
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {Object.entries(CARD_PALETTES).map(([key, palette]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setAdCardTheme(key as any)}
                            className={`p-2 rounded-xl border text-start flex items-center gap-2 transition-all cursor-pointer ${
                              adCardTheme === key
                                ? 'border-[#334DAF] ring-2 ring-[#334DAF]/30 shadow-xs'
                                : 'border-[#D0E4FE] dark:border-stone-700 hover:border-stone-300'
                            }`}
                            style={{ background: palette.gradient }}
                          >
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 shadow-xs shrink-0"
                              style={{ backgroundColor: palette.accentBg }}
                            />
                            <span
                              className="text-[10px] font-bold truncate leading-tight"
                              style={{ color: palette.textColor }}
                            >
                              {palette.name}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Custom Color Overrides */}
                      <div className="mt-2.5 pt-2 border-t border-[#D0E4FE]/60 dark:border-stone-800 flex items-center gap-3 flex-wrap">
                        <label className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-400 font-semibold cursor-pointer">
                          <input
                            type="radio"
                            name="themeChoice"
                            checked={adCardTheme === 'custom'}
                            onChange={() => setAdCardTheme('custom')}
                            className="text-[#334DAF] focus:ring-[#334DAF]"
                          />
                          <span>Custom Colors:</span>
                        </label>

                        {adCardTheme === 'custom' && (
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1 text-[10px] text-stone-500">
                              <span>Background:</span>
                              <input
                                type="color"
                                value={adBgColor.startsWith('#') ? adBgColor : '#E4EFFB'}
                                onChange={(e) => setAdBgColor(e.target.value)}
                                className="w-6 h-6 rounded cursor-pointer border border-stone-300"
                              />
                            </label>

                            <label className="flex items-center gap-1 text-[10px] text-stone-500">
                              <span>Text:</span>
                              <input
                                type="color"
                                value={adTextColor}
                                onChange={(e) => setAdTextColor(e.target.value)}
                                className="w-6 h-6 rounded cursor-pointer border border-stone-300"
                              />
                            </label>

                            <label className="flex items-center gap-1 text-[10px] text-stone-500">
                              <span>Button/Accent:</span>
                              <input
                                type="color"
                                value={adAccentColor}
                                onChange={(e) => setAdAccentColor(e.target.value)}
                                className="w-6 h-6 rounded cursor-pointer border border-stone-300"
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 2. LAYOUT & TEXT ALIGNMENT ("WHERE TO WRITE") */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-stone-700 dark:text-[#7096D1] font-bold text-[11px] mb-1">
                          Card Layout Structure
                        </label>
                        <select
                          value={adCardLayout}
                          onChange={(e) => setAdCardLayout(e.target.value as any)}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#D0E4FE] dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-semibold"
                        >
                          <option value="horizontal-split">Horizontal Split (Pro Plan Style - Image 1)</option>
                          <option value="icon-card">Status Icon Squircle (Pastel Card - Image 2)</option>
                          <option value="vertical-centered">Centered Focus Display</option>
                          <option value="standard">Standard Stack Layout</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-700 dark:text-[#7096D1] font-bold text-[11px] mb-1">
                          Where to Write (Text Alignment)
                        </label>
                        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg border border-[#D0E4FE] dark:border-stone-700">
                          <button
                            type="button"
                            onClick={() => setAdTextAlign('left')}
                            className={`flex-1 py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer ${
                              adTextAlign === 'left'
                                ? 'bg-white dark:bg-stone-900 text-[#334DAF] shadow-xs'
                                : 'text-stone-500 hover:text-[#091F5C]'
                            }`}
                          >
                            <AlignLeft className="w-3.5 h-3.5" />
                            <span>Left</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setAdTextAlign('center')}
                            className={`flex-1 py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer ${
                              adTextAlign === 'center'
                                ? 'bg-white dark:bg-stone-900 text-[#334DAF] shadow-xs'
                                : 'text-stone-500 hover:text-[#091F5C]'
                            }`}
                          >
                            <AlignCenter className="w-3.5 h-3.5" />
                            <span>Center</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setAdTextAlign('right')}
                            className={`flex-1 py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer ${
                              adTextAlign === 'right'
                                ? 'bg-white dark:bg-stone-900 text-[#334DAF] shadow-xs'
                                : 'text-stone-500 hover:text-[#091F5C]'
                            }`}
                          >
                            <AlignRight className="w-3.5 h-3.5" />
                            <span>Right</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 3. TYPOGRAPHY FONT & SIZES */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <label className="block text-stone-700 dark:text-[#7096D1] font-bold text-[11px] mb-1">
                          Font Family
                        </label>
                        <select
                          value={adCardFont}
                          onChange={(e) => setAdCardFont(e.target.value as any)}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#D0E4FE] dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                        >
                          <option value="serif">High-Contrast Serif (Plan Style)</option>
                          <option value="sans">Clean Geometric Sans (SF Pro)</option>
                          <option value="rounded">Friendly Rounded Bold</option>
                          <option value="mono">Tech Monospace</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-700 dark:text-[#7096D1] font-bold text-[11px] mb-1">
                          Title Font Size
                        </label>
                        <select
                          value={adTitleSize}
                          onChange={(e) => setAdTitleSize(e.target.value as any)}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#D0E4FE] dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                        >
                          <option value="sm">Small (14px)</option>
                          <option value="md">Medium (18px)</option>
                          <option value="lg">Large (24px)</option>
                          <option value="xl">Extra Large Display (30px)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-700 dark:text-[#7096D1] font-bold text-[11px] mb-1">
                          Corner Squircle
                        </label>
                        <select
                          value={adCardRadius}
                          onChange={(e) => setAdCardRadius(e.target.value as any)}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#D0E4FE] dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                        >
                          <option value="normal">Subtle (14px)</option>
                          <option value="rounded">Smooth (20px)</option>
                          <option value="squircle">Squircle (28px - Ref Style)</option>
                          <option value="pill">Pill Extra-Round (36px)</option>
                        </select>
                      </div>
                    </div>

                    {/* 4. TOP ICON CHIP & SUBTITLE / PRICE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-stone-700 dark:text-[#7096D1] font-bold text-[11px] mb-1">
                          Top Circular Icon Badge (Image 2 Style)
                        </label>
                        <select
                          value={adIconBadge}
                          onChange={(e) => setAdIconBadge(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#D0E4FE] dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                        >
                          {ICON_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-700 dark:text-[#7096D1] font-bold text-[11px] mb-1">
                          Price / Sub-metric Tag (e.g. $89/Month, +3 points)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. $89 / Month or +3 points"
                          value={adSubtitlePrice}
                          onChange={(e) => setAdSubtitlePrice(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#D0E4FE] dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                        />
                      </div>
                    </div>

                    {/* 5. PERK BULLET POINTS WITH CHECKMARKS */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-stone-700 dark:text-[#7096D1] font-bold text-[11px]">
                          Feature Bullet Points (With Checkmarks - Image 1 Style)
                        </label>
                        <button
                          type="button"
                          onClick={() => setAdBulletPoints([...adBulletPoints, ''])}
                          className="text-[10px] text-[#334DAF] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Add Perk Bullet</span>
                        </button>
                      </div>

                      {adBulletPoints.map((bullet, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <input
                            type="text"
                            placeholder={`e.g. Satellite coverage, Unlimited voice & data...`}
                            value={bullet}
                            onChange={(e) => {
                              const copy = [...adBulletPoints];
                              copy[idx] = e.target.value;
                              setAdBulletPoints(copy);
                            }}
                            className="flex-1 px-3 py-1 rounded-lg border border-[#D0E4FE] dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const copy = adBulletPoints.filter((_, i) => i !== idx);
                              setAdBulletPoints(copy);
                            }}
                            className="text-stone-400 hover:text-rose-500 p-1 cursor-pointer"
                          >
                            <MinusCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Label & Destination URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 dark:text-[#7096D1] font-bold mb-1">
                        CTA Button Label
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Claim 50% Off, Try Now, Open Deck"
                        value={adCtaText}
                        onChange={(e) => setAdCtaText(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D0E4FE] dark:border-stone-800 bg-[#E8F2FE] dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 dark:text-[#7096D1] font-bold mb-1">
                        CTA Destination Route / Link
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. #practice, #reader, #flashcards, or https://"
                        value={adCtaUrl}
                        onChange={(e) => setAdCtaUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D0E4FE] dark:border-stone-800 bg-[#E8F2FE] dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Quick Shortcut Route Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-stone-400 font-bold">Quick Routes:</span>
                    {[
                      { label: 'AI Practice', route: '#practice' },
                      { label: 'Bilingual Reader', route: '#reader' },
                      { label: 'Flashcards', route: '#flashcards' },
                      { label: 'Dictionary', route: '#dictionary' },
                      { label: 'Writing Studio', route: '#writing' },
                      { label: 'Settings', route: '#settings' },
                    ].map((chip) => (
                      <button
                        key={chip.route}
                        type="button"
                        onClick={() => setAdCtaUrl(chip.route)}
                        className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-[#7096D1] text-[10px] font-semibold hover:bg-stone-200 cursor-pointer"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  {!editingAdId && (
                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#E8F2FE] dark:bg-stone-900 border border-[#D0E4FE]/80 dark:border-stone-800">
                      <input
                        type="checkbox"
                        id="sendNotificationCheckModal"
                        checked={adSendNotification}
                        onChange={(e) => setAdSendNotification(e.target.checked)}
                        className="w-4 h-4 rounded text-[#334DAF] focus:ring-[#334DAF] cursor-pointer"
                      />
                      <label
                        htmlFor="sendNotificationCheckModal"
                        className="text-xs text-stone-700 dark:text-[#7096D1] font-medium cursor-pointer"
                      >
                        Also broadcast this ad to all users&apos; notification bell 🔔
                      </label>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-[#334DAF] hover:bg-[#091F5C] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-98"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{editingAdId ? 'Save & Update Ad' : 'Publish Ad Campaign'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditorOpen(false)}
                      className="px-5 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-bold text-xs cursor-pointer hover:bg-stone-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Right Column: Live Visual Preview */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-[#E8F2FE] dark:bg-stone-900 border border-[#D0E4FE]/80 dark:border-stone-800 rounded-2xl p-4 space-y-3 sticky top-4">
                    <div className="flex items-center justify-between border-b border-[#D0E4FE] dark:border-stone-800 pb-2">
                      <h4 className="font-bold text-[#091F5C] dark:text-stone-200 text-xs flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5 text-[#334DAF]" />
                        Live Styled Card Preview
                      </h4>
                      <span className="text-[10px] text-stone-400 font-semibold uppercase">
                        {adPlacement} • {adCardLayout}
                      </span>
                    </div>

                    {/* Real-time styled card preview with direct touch editing enabled */}
                    <div className="py-2">
                      <AdCardView
                        ad={{
                          id: 'preview-ad',
                          title: adTitle || 'Upgrade to Pro Plan',
                          description: adDescription || 'Your ad description text will be presented to learners.',
                          badgeText: adBadgeText || 'Sponsored',
                          imageUrl: adImageUrl,
                          ctaText: adCtaText || 'Explore Now',
                          ctaUrl: adCtaUrl || '#practice',
                          placement: adPlacement,
                          active: true,
                          targetPage: adTargetPage,
                          createdAt: new Date().toISOString(),
                          viewsCount: 1420,
                          clicksCount: 384,
                          // Styling
                          cardTheme: adCardTheme,
                          bgColor: adCardTheme === 'custom' ? adBgColor : undefined,
                          textColor: adCardTheme === 'custom' ? adTextColor : undefined,
                          accentColor: adCardTheme === 'custom' ? adAccentColor : undefined,
                          cardFont: adCardFont,
                          titleSize: adTitleSize,
                          bodySize: adBodySize,
                          textAlign: adTextAlign,
                          cardLayout: adCardLayout,
                          iconBadge: adIconBadge,
                          subtitlePrice: adSubtitlePrice,
                          bulletPoints: adBulletPoints,
                          cardRadius: adCardRadius,
                        }}
                        isPreview={true}
                        isInteractiveEditable={true}
                        onUpdateField={(field, value) => {
                          if (field === 'title') setAdTitle(value);
                          else if (field === 'description') setAdDescription(value);
                          else if (field === 'badgeText') setAdBadgeText(value);
                          else if (field === 'subtitlePrice') setAdSubtitlePrice(value);
                          else if (field === 'ctaText') setAdCtaText(value);
                          else if (field === 'ctaUrl') setAdCtaUrl(value);
                          else if (field === 'imageUrl') setAdImageUrl(value);
                          else if (field === 'bulletPoints') setAdBulletPoints(value);
                          else if (field === 'iconBadge') setAdIconBadge(value);
                          else if (field === 'cardTheme') setAdCardTheme(value);
                          else if (field === 'titleSize') setAdTitleSize(value);
                          else if (field === 'bodySize') setAdBodySize(value);
                          else if (field === 'textAlign') setAdTextAlign(value);
                          else if (field === 'cardLayout') setAdCardLayout(value);
                          else if (field === 'cardRadius') setAdCardRadius(value);
                          else if (field === 'targetPage') setAdTargetPage(value);
                        }}
                      />
                    </div>

                    <div className="bg-white dark:bg-stone-800/80 rounded-xl p-3 border border-[#D0E4FE]/80 dark:border-stone-700 text-[10px] space-y-1 text-stone-500">
                      <div className="flex justify-between">
                        <span className="font-bold">Theme:</span>
                        <span className="capitalize">{adCardTheme}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">Typography:</span>
                        <span className="capitalize">{adCardFont} ({adTitleSize} title / {adBodySize} body)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">Orientation / Alignment:</span>
                        <span className="capitalize">{adCardLayout} • {adTextAlign} aligned</span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 2: PAUSE / STOP AD FOR SPECIFIC DURATION MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {pauseModalAd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1E221B] border border-[#D0E4FE] dark:border-stone-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <PauseCircle className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    Stop / Pause Ad Campaign
                  </h3>
                </div>
                <button
                  onClick={() => setPauseModalAd(null)}
                  className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-stone-700 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase">Campaign</span>
                <p className="font-bold text-xs text-stone-900 dark:text-stone-100">
                  {pauseModalAd.title}
                </p>
              </div>

              <form onSubmit={handleApplyPause} className="space-y-4 text-xs">
                {/* 1-Click Duration Presets */}
                <div>
                  <label className="block text-stone-700 dark:text-[#7096D1] font-bold mb-1.5">
                    Select Pause Duration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { hours: 1, label: '1 Hour' },
                      { hours: 6, label: '6 Hours' },
                      { hours: 24, label: '24 Hours (1 Day)' },
                      { hours: 72, label: '3 Days' },
                      { hours: 168, label: '7 Days' },
                      { hours: 720, label: '30 Days' },
                    ].map((preset) => (
                      <button
                        key={preset.hours}
                        type="button"
                        onClick={() => {
                          setPauseDurationHours(preset.hours);
                          setCustomResumeDate('');
                        }}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                          pauseDurationHours === preset.hours && !customResumeDate
                            ? 'border-[#222222] bg-[#A4F5A6] text-[#222222] font-bold'
                            : 'border-[#D0D2CF] dark:border-stone-800 hover:bg-[#EFF1EE] dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Resume Timestamp */}
                <div>
                  <label className="block text-stone-700 dark:text-[#7096D1] font-bold mb-1">
                    Or Resume at Specific Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={customResumeDate}
                    onChange={(e) => setCustomResumeDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D0E4FE] dark:border-stone-800 bg-[#E8F2FE] dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-[#7096D1] font-bold mb-1">
                    Reason / Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Updating discount links, seasonal break"
                    value={pauseReason}
                    onChange={(e) => setPauseReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D0E4FE] dark:border-stone-800 bg-[#E8F2FE] dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <PauseCircle className="w-4 h-4" />
                    <span>Apply Pause Timer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      notificationManager.toggleAdActive(pauseModalAd.id);
                      setPauseModalAd(null);
                      refreshData();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-bold text-xs hover:bg-stone-200 cursor-pointer"
                  >
                    Pause Indefinitely
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 3: INSTANT AD CARD INSPECTION MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {inspectAd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1E221B] border border-[#D0E4FE] dark:border-stone-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#334DAF]" />
                  <h4 className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                    Campaign Card Preview & Styling
                  </h4>
                </div>
                <button
                  onClick={() => setInspectAd(null)}
                  className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-stone-700 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-2">
                <AdCardView
                  ad={inspectAd}
                  isPreview={true}
                  isInteractiveEditable={true}
                  onUpdateField={(field, value) => {
                    if (inspectAd && inspectAd.id) {
                      const updated = { ...inspectAd, [field]: value };
                      setInspectAd(updated);
                      notificationManager.updateAd(inspectAd.id, { [field]: value });
                      setAds(notificationManager.getAds());
                    }
                  }}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const adToEdit = inspectAd;
                    setInspectAd(null);
                    handleOpenEditAd(adToEdit);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#222222] hover:bg-[#A4F5A6] text-[#EFF1EE] hover:text-[#222222] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Styling & Content</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectAd(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-bold text-xs hover:bg-stone-200 cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
