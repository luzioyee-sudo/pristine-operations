// @ts-nocheck
import { AppNotification, AppAd } from '../types';
import { getSupabase } from '../lib/supabase';

const NOTIFICATIONS_STORAGE_KEY = 'lingoflow_app_notifications_v6';
const ADS_STORAGE_KEY = 'lingoflow_app_ads_v6';

// Initial notifications and ads default to empty
const INITIAL_NOTIFICATIONS: AppNotification[] = [];
const INITIAL_ADS: AppAd[] = [];


class NotificationManager {
  private notifyListeners() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lingoflow_notifications_changed'));
    }
  }

  private notifyAdsListeners() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lingoflow_ads_changed'));
    }
  }

  // --- NOTIFICATIONS ---
  public getNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  public saveNotifications(notifications: AppNotification[]) {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save notifications:', e);
    }
  }

  public getUserNotifications(userId: string): AppNotification[] {
    const all = this.getNotifications();
    return all.filter((n) => {
      // Broadcast to all OR specific to this user
      const isForUser = n.targetUserId === 'all' || !n.targetUserId || n.targetUserId === userId;
      const isDismissed = n.dismissedBy && n.dismissedBy.includes(userId);
      return isForUser && !isDismissed;
    });
  }

  public getUnreadCount(userId: string): number {
    const userNotifs = this.getUserNotifications(userId);
    return userNotifs.filter((n) => !n.readBy || !n.readBy.includes(userId)).length;
  }

  public async sendNotification(data: {
    title: string;
    message: string;
    type?: 'ad' | 'message' | 'announcement' | 'system' | 'warning';
    targetUserId?: string | 'all';
    targetUserName?: string;
    targetUserEmail?: string;
    senderName?: string;
    actionText?: string;
    actionUrl?: string;
    bannerUrl?: string;
    badgeText?: string;
    priority?: 'normal' | 'high' | 'urgent';
    adId?: string;
  }): Promise<AppNotification> {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: data.title,
      message: data.message,
      type: data.type || 'message',
      targetUserId: data.targetUserId || 'all',
      targetUserName: data.targetUserName,
      targetUserEmail: data.targetUserEmail,
      senderName: data.senderName || 'Admin Team',
      createdAt: new Date().toISOString(),
      readBy: [],
      dismissedBy: [],
      actionText: data.actionText,
      actionUrl: data.actionUrl,
      bannerUrl: data.bannerUrl,
      badgeText: data.badgeText || (data.type === 'ad' ? 'SPONSORED' : data.targetUserId === 'all' ? 'BROADCAST' : 'DIRECT MESSAGE'),
      priority: data.priority || 'normal',
      adId: data.adId,
    };

    const current = this.getNotifications();
    const updated = [newNotif, ...current];
    this.saveNotifications(updated);

    try {
      const client = getSupabase();
      if (client) {
        await client.from('notifications').upsert({
          id: newNotif.id,
          target_user_id: newNotif.targetUserId && newNotif.targetUserId !== 'all' ? newNotif.targetUserId : null,
          is_broadcast: !newNotif.targetUserId || newNotif.targetUserId === 'all',
          data: newNotif,
          read_by: [],
          dismissed_by: [],
        });
      }
    } catch (err) {
      console.warn('Notification Supabase sync notice:', err);
    }

    return newNotif;
  }

  public markAsRead(notificationId: string, userId: string) {
    const current = this.getNotifications();
    const updated = current.map((n) => {
      if (n.id === notificationId) {
        const readBy = n.readBy || [];
        if (!readBy.includes(userId)) {
          return { ...n, readBy: [...readBy, userId] };
        }
      }
      return n;
    });
    this.saveNotifications(updated);
  }

  public markAllAsRead(userId: string) {
    const current = this.getNotifications();
    const updated = current.map((n) => {
      const readBy = n.readBy || [];
      if (!readBy.includes(userId)) {
        return { ...n, readBy: [...readBy, userId] };
      }
      return n;
    });
    this.saveNotifications(updated);
  }

  public dismissNotification(notificationId: string, userId: string) {
    const current = this.getNotifications();
    const updated = current.map((n) => {
      if (n.id === notificationId) {
        const dismissedBy = n.dismissedBy || [];
        if (!dismissedBy.includes(userId)) {
          return { ...n, dismissedBy: [...dismissedBy, userId] };
        }
      }
      return n;
    });
    this.saveNotifications(updated);
  }

  public async deleteNotification(notificationId: string) {
    const current = this.getNotifications();
    const updated = current.filter((n) => n.id !== notificationId);
    this.saveNotifications(updated);

    try {
      const client = getSupabase();
      if (client) await client.from('notifications').delete().eq('id', notificationId);
    } catch (err) {
      console.warn('Notification Supabase delete notice:', err);
    }
  }

  // --- CONVENIENCE LANGUAGE-LEARNING NOTIFICATION TRIGGERS ---
  public triggerStreakReminder(days: number = 5, userId: string = 'all') {
    return this.sendNotification({
      title: 'Streak Reminder',
      message: `Don't break your ${days}-day streak! Complete your daily 5-minute review before midnight.`,
      type: 'system',
      targetUserId: userId,
      senderName: 'Streak Guardian',
      badgeText: 'STREAK',
      priority: 'high',
      actionText: 'Keep Streak',
      actionUrl: '#flashcards',
    });
  }

  public triggerWordMastered(wordCount: number = 10, deckName: string = 'Spanish Vocabulary', userId: string = 'all') {
    return this.sendNotification({
      title: 'New Words Mastered',
      message: `Awesome! You mastered ${wordCount} new words in "${deckName}" today with a 95% retention score.`,
      type: 'system',
      targetUserId: userId,
      senderName: 'Vocabulary Coach',
      badgeText: 'MASTERED',
      priority: 'normal',
      actionText: 'Review Deck',
      actionUrl: '#flashcards',
    });
  }

  public triggerDailyGoalProgress(minutesDone: number = 15, goalMinutes: number = 15, userId: string = 'all') {
    return this.sendNotification({
      title: 'Daily Goal Achieved',
      message: `Goal reached! You completed ${minutesDone}/${goalMinutes} minutes of active dual-language reading.`,
      type: 'system',
      targetUserId: userId,
      senderName: 'Daily Goal Tracker',
      badgeText: 'GOAL',
      priority: 'normal',
      actionText: 'Open Reader',
      actionUrl: '#reader',
    });
  }

  public triggerPracticeInvite(coachName: string = 'Sarah', topic: string = 'Ordering Tapas in Madrid', userId: string = 'all') {
    return this.sendNotification({
      title: 'Practice Session Invite',
      message: `AI Coach ${coachName} is ready for your 10-minute conversational roleplay "${topic}".`,
      type: 'message',
      targetUserId: userId,
      senderName: 'AI Speaking Tutor',
      badgeText: 'PRACTICE',
      priority: 'high',
      actionText: 'Start Speaking',
      actionUrl: '#practice',
    });
  }

  // --- ADS SYSTEM ---
  public getAds(): AppAd[] {
    try {
      const data = localStorage.getItem(ADS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(INITIAL_ADS));
      return INITIAL_ADS;
    } catch {
      return INITIAL_ADS;
    }
  }

  public saveAds(ads: AppAd[], notify = true) {
    try {
      localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(ads));
      if (notify) {
        this.notifyAdsListeners();
      }
    } catch (e) {
      console.error('Failed to save ads:', e);
    }
  }

  public getActiveAdsForPage(page: string, userId?: string): AppAd[] {
    const all = this.getAds();
    const now = Date.now();

    return all.filter((ad) => {
      // 1. Must be active
      if (!ad.active) return false;

      // 2. Check temporary pause
      if (ad.pausedUntil) {
        const pauseTime = new Date(ad.pausedUntil).getTime();
        if (!isNaN(pauseTime) && pauseTime > now) {
          return false; // Currently paused until future timestamp
        }
      }

      // 3. Check scheduled start date (if scheduled for the future)
      if (ad.startDate) {
        const startTime = new Date(ad.startDate).getTime();
        if (!isNaN(startTime) && startTime > now) {
          return false; // Not started yet
        }
      }

      // 4. Check expiration date
      if (ad.expiresAt) {
        const expTime = new Date(ad.expiresAt).getTime();
        if (!isNaN(expTime) && expTime <= now) {
          return false; // Already expired
        }
      }

      // 5. Check page targeting
      const isTargetMatch =
        ad.targetPage === 'all' ||
        ad.targetPage === page ||
        (Array.isArray(ad.targetPages) && ad.targetPages.includes(page));

      if (!isTargetMatch) return false;

      // 6. Check user dismissal
      if (userId && ad.dismissedBy && ad.dismissedBy.includes(userId)) {
        return false;
      }

      return true;
    });
  }

  public async createAd(
    data: Omit<AppAd, 'id' | 'createdAt' | 'clicksCount' | 'impressionsCount'>,
    sendAsNotification = true
  ): Promise<AppAd> {
    const newAd: AppAd = {
      id: `ad-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: data.title,
      description: data.description,
      targetPage: data.targetPage || 'all',
      targetPages: data.targetPages || (data.targetPage !== 'all' ? [data.targetPage] : undefined),
      placement: data.placement || 'top-banner',
      badgeText: data.badgeText || 'Sponsored',
      imageUrl: data.imageUrl,
      ctaText: data.ctaText || 'Learn More',
      ctaUrl: data.ctaUrl || '#reader',
      active: data.active !== undefined ? data.active : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startDate: data.startDate,
      expiresAt: data.expiresAt,
      pausedUntil: data.pausedUntil,
      pauseReason: data.pauseReason,
      delaySeconds: data.delaySeconds || 0,
      frequency: data.frequency || 'always',
      
      // Visual Custom Styling
      cardTheme: data.cardTheme || 'pastel-blue',
      bgColor: data.bgColor,
      textColor: data.textColor,
      accentColor: data.accentColor,
      cardFont: data.cardFont || 'sans',
      titleSize: data.titleSize || 'md',
      bodySize: data.bodySize || 'sm',
      textAlign: data.textAlign || 'left',
      cardLayout: data.cardLayout || 'standard',
      iconBadge: data.iconBadge,
      subtitlePrice: data.subtitlePrice,
      bulletPoints: data.bulletPoints,
      cardRadius: data.cardRadius || 'squircle',
      cardWidth: data.cardWidth || 'standard',
      
      themeColor: data.themeColor,
      clicksCount: 0,
      impressionsCount: 0,
      dismissedBy: [],
    };

    const current = this.getAds();
    const updated = [newAd, ...current];
    this.saveAds(updated);

    // Also send an accompanying notification to all users' notification bell if requested!
    if (sendAsNotification) {
      await this.sendNotification({
        title: `📢 ${newAd.title}`,
        message: newAd.description,
        type: 'ad',
        targetUserId: 'all',
        senderName: 'Ribble Sponsor & Ads',
        actionText: newAd.ctaText,
        actionUrl: newAd.ctaUrl,
        bannerUrl: newAd.imageUrl,
        badgeText: newAd.badgeText || 'SPONSORED',
        priority: 'high',
        adId: newAd.id,
      });
    }

    try {
      const client = getSupabase();
      if (client) await client.from('ads').upsert({ id: newAd.id, data: newAd, active: newAd.active });
    } catch (err) {
      console.warn('Ad Supabase sync notice:', err);
    }

    return newAd;
  }

  public updateAd(adId: string, updates: Partial<AppAd>) {
    const current = this.getAds();
    const withTimestamp = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const updated = current.map((ad) => (ad.id === adId ? { ...ad, ...withTimestamp } : ad));
    this.saveAds(updated);

    try {
      const client = getSupabase();
      if (client) {
        void client.from('ads').update({ data: { ...updated.find((ad) => ad.id === adId), ...withTimestamp }, active: Boolean((updated.find((ad) => ad.id === adId) as AppAd | undefined)?.active) }).eq('id', adId);
      }
    } catch (err) {
      console.warn('Ad Supabase update notice:', err);
    }
  }

  public async deleteAd(adId: string) {
    const current = this.getAds();
    const updated = current.filter((a) => a.id !== adId);
    this.saveAds(updated);

    try {
      const client = getSupabase();
      if (client) await client.from('ads').delete().eq('id', adId);
    } catch (err) {
      console.warn('Ad Supabase delete notice:', err);
    }
  }

  public toggleAdActive(adId: string): boolean {
    const current = this.getAds();
    let newStatus = false;
    const updated = current.map((ad) => {
      if (ad.id === adId) {
        newStatus = !ad.active;
        // If enabling, clear past pause timestamps
        return {
          ...ad,
          active: newStatus,
          pausedUntil: newStatus ? undefined : ad.pausedUntil,
          updatedAt: new Date().toISOString(),
        };
      }
      return ad;
    });
    this.saveAds(updated);

    try {
      const client = getSupabase();
      if (client) {
        const ad = updated.find((item) => item.id === adId);
        void client.from('ads').update({ data: ad, active: newStatus }).eq('id', adId);
      }
    } catch (err) {
      console.warn('Ad Supabase toggle notice:', err);
    }

    return newStatus;
  }

  /**
   * Temporary pause an ad for a specific duration or until a date
   */
  public pauseAdForDuration(
    adId: string,
    options: {
      durationHours?: number;
      untilISO?: string;
      reason?: string;
    }
  ) {
    let pausedUntil: string | undefined;

    if (options.untilISO) {
      pausedUntil = options.untilISO;
    } else if (options.durationHours) {
      const targetTime = Date.now() + options.durationHours * 60 * 60 * 1000;
      pausedUntil = new Date(targetTime).toISOString();
    }

    this.updateAd(adId, {
      active: true, // Keep active flag, but pausedUntil suppresses it
      pausedUntil,
      pauseReason: options.reason || 'Paused by administrator',
    });
  }

  /**
   * Resume a paused ad immediately
   */
  public resumeAd(adId: string) {
    this.updateAd(adId, {
      active: true,
      pausedUntil: undefined,
      pauseReason: undefined,
    });
  }

  /**
   * Duplicate an existing ad to easily create variations
   */
  public async duplicateAd(adId: string): Promise<AppAd | null> {
    const current = this.getAds();
    const source = current.find((a) => a.id === adId);
    if (!source) return null;

    const copyData: Omit<AppAd, 'id' | 'createdAt' | 'clicksCount' | 'impressionsCount'> = {
      title: `${source.title} (Copy)`,
      description: source.description,
      targetPage: source.targetPage,
      targetPages: source.targetPages,
      placement: source.placement,
      badgeText: source.badgeText,
      imageUrl: source.imageUrl,
      ctaText: source.ctaText,
      ctaUrl: source.ctaUrl,
      active: false, // Start copies in paused / draft mode
      startDate: source.startDate,
      expiresAt: source.expiresAt,
      delaySeconds: source.delaySeconds,
      frequency: source.frequency,
      cardTheme: source.cardTheme,
      bgColor: source.bgColor,
      textColor: source.textColor,
      accentColor: source.accentColor,
      cardFont: source.cardFont,
      titleSize: source.titleSize,
      bodySize: source.bodySize,
      textAlign: source.textAlign,
      cardLayout: source.cardLayout,
      iconBadge: source.iconBadge,
      subtitlePrice: source.subtitlePrice,
      bulletPoints: source.bulletPoints ? [...source.bulletPoints] : undefined,
      cardRadius: source.cardRadius,
      cardWidth: source.cardWidth,
      themeColor: source.themeColor,
    };

    return await this.createAd(copyData, false);
  }

  /**
   * Reset stats for an ad campaign
   */
  public resetAdStats(adId: string) {
    this.updateAd(adId, {
      impressionsCount: 0,
      clicksCount: 0,
    });
  }

  public recordAdImpression(adId: string) {
    const current = this.getAds();
    const updated = current.map((ad) => {
      if (ad.id === adId) {
        return { ...ad, impressionsCount: (ad.impressionsCount || 0) + 1 };
      }
      return ad;
    });
    this.saveAds(updated, false);
  }

  public recordAdClick(adId: string) {
    const current = this.getAds();
    const updated = current.map((ad) => {
      if (ad.id === adId) {
        return { ...ad, clicksCount: (ad.clicksCount || 0) + 1 };
      }
      return ad;
    });
    this.saveAds(updated, false);
  }

  public dismissAd(adId: string, userId: string) {
    const current = this.getAds();
    const updated = current.map((ad) => {
      if (ad.id === adId) {
        const dismissedBy = ad.dismissedBy || [];
        if (!dismissedBy.includes(userId)) {
          return { ...ad, dismissedBy: [...dismissedBy, userId] };
        }
      }
      return ad;
    });
    this.saveAds(updated);
  }

  // Pull notifications and ads from Supabase into the local UI cache.
  public async fetchCloudSync() {
    try {
      const client = getSupabase();
      if (!client) return;

      const { data: notificationRows, error: notificationError } = await client
        .from('notifications')
        .select('id,data,read_by,dismissed_by')
        .order('created_at', { ascending: false });
      if (notificationError) throw notificationError;
      if (notificationRows?.length) {
        const cloudNotifs = notificationRows.map((row) => ({
          ...(row.data as AppNotification),
          id: row.id,
          readBy: row.read_by || [],
          dismissedBy: row.dismissed_by || [],
        }));
        const local = this.getNotifications();
        const map = new Map<string, AppNotification>();
        [...local, ...cloudNotifs].forEach((notification) => map.set(notification.id, notification));
        this.saveNotifications(Array.from(map.values()));
      }

      const { data: adRows, error: adError } = await client
        .from('ads')
        .select('id,data,active')
        .eq('active', true)
        .order('created_at', { ascending: false });
      if (adError) throw adError;
      if (adRows?.length) {
        const cloudAds = adRows.map((row) => ({ ...(row.data as AppAd), id: row.id, active: row.active }));
        const local = this.getAds();
        const map = new Map<string, AppAd>();
        [...local, ...cloudAds].forEach((ad) => map.set(ad.id, ad));
        this.saveAds(Array.from(map.values()));
      }
    } catch (error) {
      console.warn('Supabase notification sync error (using local cache):', error);
    }
  }
}

export const notificationManager = new NotificationManager();
