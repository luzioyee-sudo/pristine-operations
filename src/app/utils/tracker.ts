// @ts-nocheck
export interface TrackingEvent {
  event_id: string;
  event_name: string;
  event_category: string;
  timestamp: string;
  user_id: string | null;
  session_id: string;
  anonymous_id: string;
  page: string;
  route: string;
  element_id: string | null;
  element_type: string | null;
  language_id: string | null;
  language_profile_id: string | null;
  device_type: string;
  viewport: string;
  metadata: Record<string, any> | null;
}

class ActionTracker {
  private queue: TrackingEvent[] = [];
  private sessionId: string = '';
  private anonymousId: string = '';
  private currentUserId: string | null = null;
  private currentLanguageId: string | null = null;
  private currentLanguageProfileId: string | null = null;
  private trackingEnabled: boolean = true;
  private flushInterval: number = 5000; // 5 seconds
  private batchSize: number = 10;
  private maxQueueSize: number = 500;
  private retryAttempts: number = 5;
  private isFlushing: boolean = false;
  private timerId: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initIdentifiers();
      this.initListeners();
      this.startFlushTimer();
    }
  }

  private initIdentifiers() {
    try {
      // Session ID initialization (persists per tab session)
      let sessId = sessionStorage.getItem('ribble_session_id');
      if (!sessId) {
        sessId = `sess_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
        sessionStorage.setItem('ribble_session_id', sessId);
      }
      this.sessionId = sessId;

      // Anonymous ID initialization (persists across visits)
      let anonId = localStorage.getItem('ribble_anonymous_id');
      if (!anonId) {
        anonId = `anon_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
        localStorage.setItem('ribble_anonymous_id', anonId);
      }
      this.anonymousId = anonId;

      // Read initial tracking preference
      const consent = localStorage.getItem('ribble_tracking_enabled');
      if (consent !== null) {
        this.trackingEnabled = consent === 'true';
      }
    } catch (e) {
      console.warn('[Tracker] Failed to initialize local identifiers:', e);
      this.sessionId = `sess_fallback_${Date.now()}`;
      this.anonymousId = `anon_fallback_${Date.now()}`;
    }
  }

  private initListeners() {
    // Flush queue on page unload/hide to preserve events
    window.addEventListener('beforeunload', () => this.flush(true));
    window.addEventListener('pagehide', () => this.flush(true));

    // Handle online recovery
    window.addEventListener('online', () => {
      console.log('[Tracker] Network online: flushing buffered events');
      this.flush();
    });

    // Global document event delegator for outbound links and custom declarative tracking
    document.addEventListener('click', (e) => {
      try {
        const target = e.target as HTMLElement;
        if (!target) return;

        // 1. Capture Outbound Links
        const anchor = target.closest('a');
        if (anchor && anchor.href) {
          const url = anchor.href;
          const isExternal = url.startsWith('http') && !url.includes(window.location.hostname);
          if (isExternal) {
            this.trackEvent('outbound_link_clicked', 'engagement', {
              destination_url: url,
              link_text: anchor.textContent?.trim() || anchor.title || '',
              element_id: anchor.id || null,
            });
          }
        }

        // 2. Schema-Driven Declarative Tracking
        const trackable = target.closest('[data-track]');
        if (trackable) {
          const eventName = trackable.getAttribute('data-track') || 'element_clicked';
          const category = trackable.getAttribute('data-track-category') || 'engagement';
          const metadataRaw = trackable.getAttribute('data-track-metadata');
          let metadata: Record<string, any> = {};
          
          if (metadataRaw) {
            try {
              metadata = JSON.parse(metadataRaw);
            } catch {
              metadata = { value: metadataRaw };
            }
          }
          
          metadata.element_id = trackable.id || null;
          metadata.element_type = trackable.tagName.toLowerCase();
          
          this.trackEvent(eventName, category, metadata);
        }
      } catch (err) {
        console.error('[Tracker] Error in global click handler:', err);
      }
    });
  }

  private startFlushTimer() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  public setTrackingEnabled(enabled: boolean) {
    this.trackingEnabled = enabled;
    try {
      localStorage.setItem('ribble_tracking_enabled', String(enabled));
    } catch (e) {
      console.warn('[Tracker] Failed to save tracking consent:', e);
    }
    if (!enabled) {
      this.queue = []; // clear queue if disabled
    }
  }

  public getTrackingEnabled(): boolean {
    return this.trackingEnabled;
  }

  public setUserId(userId: string | null) {
    this.currentUserId = userId;
  }

  public setLanguageContext(languageId: string | null, profileId: string | null = null) {
    this.currentLanguageId = languageId;
    this.currentLanguageProfileId = profileId;
  }

  private generateEventId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let rand = '';
    for (let i = 0; i < 12; i++) {
      rand += chars[Math.floor(Math.random() * chars.length)];
    }
    return `evt_${rand}_${Date.now()}`;
  }

  private getDeviceType(): string {
    const ua = navigator.userAgent;
    let browser = 'Browser';
    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edg')) browser = 'Edge';

    let os = 'Desktop';
    if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'macOS';
    else if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return `${browser} / ${os}`;
  }

  private getViewport(): string {
    return `${window.innerWidth}x${window.innerHeight}`;
  }

  /**
   * Tracks a new user action/event.
   */
  public trackEvent(
    eventName: string,
    category: string,
    metadata: Record<string, any> | null = null,
    immediate: boolean = false
  ) {
    if (!this.trackingEnabled) {
      // Skip non-essential tracking if user opted out
      return;
    }

    // Capture fallback current user if unset
    const userId = this.currentUserId || (typeof window !== 'undefined' ? localStorage.getItem('lingoflow_current_user_id') : null) || null;

    // Build consistent structured tracking event
    const event: TrackingEvent = {
      event_id: this.generateEventId(),
      event_name: eventName,
      event_category: category,
      timestamp: new Date().toISOString(),
      user_id: userId,
      session_id: this.sessionId,
      anonymous_id: this.anonymousId,
      page: document.title || 'Ribble',
      route: window.location.hash || window.location.pathname || '/',
      element_id: metadata?.element_id || null,
      element_type: metadata?.element_type || null,
      language_id: this.currentLanguageId,
      language_profile_id: this.currentLanguageProfileId,
      device_type: this.getDeviceType(),
      viewport: this.getViewport(),
      metadata: metadata ? { ...metadata } : null,
    };

    // Clean metadata to avoid technical fields from leaking
    if (event.metadata) {
      delete event.metadata.element_id;
      delete event.metadata.element_type;
    }

    // Enforce max queue capacity limit
    if (this.queue.length >= this.maxQueueSize) {
      this.queue.shift(); // Drop oldest event to protect memory
    }

    this.queue.push(event);

    if (immediate || this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  /**
   * Flushes the queued events and transmits them to the server-side API.
   */
  public async flush(isUnloading = false): Promise<boolean> {
    if (this.queue.length === 0 || this.isFlushing) {
      return false;
    }

    // If offline, preserve the queue
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return false;
    }

    this.isFlushing = true;
    const batch = [...this.queue];
    this.queue = [];

    const sendPayload = async (attemptsLeft: number, delay: number): Promise<boolean> => {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        const response = await fetch('/api/analytics/track', {
          method: 'POST',
          headers,
          body: JSON.stringify(batch),
          // Keepalive ensures the browser completes the request even on page unload
          keepalive: isUnloading,
        });

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }

        return true;
      } catch (err) {
        console.warn(`[Tracker] Transmission failed. Attempts left: ${attemptsLeft}`, err);
        if (attemptsLeft > 0 && !isUnloading) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          return sendPayload(attemptsLeft - 1, delay * 2); // Exponential backoff retry
        }
        return false;
      }
    };

    const success = await sendPayload(this.retryAttempts, 1000);
    this.isFlushing = false;

    if (!success && !isUnloading) {
      // Re-queue failed events at the front to retry in the next cycle, up to buffer limits
      this.queue = [...batch, ...this.queue].slice(0, this.maxQueueSize);
    }

    return success;
  }
}

export const tracker = new ActionTracker();

// --- REACT HOOKS FOR INTEGRATION ---
import React, { useEffect } from 'react';

/**
 * React hook to track when a section enters the viewport.
 * Avoids duplicate reports per session.
 */
export const useTrackSectionVisibility = (sectionName: string, ref: React.RefObject<Element | null>) => {
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const sessionSeenKey = `seen_sec_${sectionName}`;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          try {
            const alreadySeen = sessionStorage.getItem(sessionSeenKey);
            if (!alreadySeen) {
              tracker.trackEvent('section_viewed', 'engagement', { section: sectionName });
              sessionStorage.setItem(sessionSeenKey, 'true');
            }
          } catch {}
        }
      });
    }, { threshold: 0.15 });

    observer.observe(element);
    return () => {
      try {
        observer.unobserve(element);
      } catch {}
    };
  }, [sectionName, ref]);
};

/**
 * React hook to track scroll depth milestones (25%, 50%, 75%, 90%, 100%).
 * Guarantees high-performance passive listeners and deduplicates per session.
 */
export const useTrackScrollMilestones = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const milestones = [25, 50, 75, 90, 100];
    const reachedMilestones = new Set<number>();

    try {
      const stored = sessionStorage.getItem('ribble_scroll_milestones');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          parsed.forEach((m) => reachedMilestones.add(m));
        }
      }
    } catch {}

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight <= 0) return;

      const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);

      for (const m of milestones) {
        if (scrollPercent >= m && !reachedMilestones.has(m)) {
          reachedMilestones.add(m);

          try {
            sessionStorage.setItem('ribble_scroll_milestones', JSON.stringify(Array.from(reachedMilestones)));
          } catch {}

          tracker.trackEvent('scroll_depth_reached', 'engagement', { depth_percent: m });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};

