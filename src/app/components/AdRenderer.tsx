// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ArrowRight, ExternalLink, Zap, Clock, Maximize2 } from 'lucide-react';
import { AppAd, AppView } from '../types';
import { notificationManager } from '../utils/notificationManager';
import { AdCardView } from './AdCardView';

interface AdRendererProps {
  currentPage: string;
  activeUserId: string;
  onNavigate?: (view: AppView) => void;
}

export const AdRenderer: React.FC<AdRendererProps> = ({
  currentPage,
  activeUserId,
  onNavigate,
}) => {
  const [ads, setAds] = useState<AppAd[]>(() =>
    notificationManager.getActiveAdsForPage(currentPage, activeUserId)
  );
  // Track delayed visibility
  const [visibleAdIds, setVisibleAdIds] = useState<Set<string>>(new Set());
  const recordedImpressionsRef = useRef<Set<string>>(new Set());
  const timersRef = useRef<Map<string, number>>(new Map());

  const refreshAds = React.useCallback(() => {
    const activeAds = notificationManager.getActiveAdsForPage(currentPage, activeUserId);
    setAds(activeAds);

    // Calculate immediate vs delayed visibility
    const nowVisible = new Set<string>();

    activeAds.forEach((ad) => {
      const delay = (ad.delaySeconds || 0) * 1000;
      if (delay <= 0) {
        nowVisible.add(ad.id);
        if (!recordedImpressionsRef.current.has(ad.id)) {
          recordedImpressionsRef.current.add(ad.id);
          notificationManager.recordAdImpression(ad.id);
        }
      } else {
        // Clear previous timer if any
        if (timersRef.current.has(ad.id)) {
          window.clearTimeout(timersRef.current.get(ad.id));
        }
        const timerId = window.setTimeout(() => {
          setVisibleAdIds((prev) => {
            const next = new Set(prev);
            next.add(ad.id);
            return next;
          });
          if (!recordedImpressionsRef.current.has(ad.id)) {
            recordedImpressionsRef.current.add(ad.id);
            notificationManager.recordAdImpression(ad.id);
          }
        }, delay);
        timersRef.current.set(ad.id, timerId);
      }
    });

    setVisibleAdIds(nowVisible);
  }, [currentPage, activeUserId]);

  useEffect(() => {
    refreshAds();

    const handleUpdate = () => {
      refreshAds();
    };

    window.addEventListener('lingoflow_ads_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('lingoflow_ads_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current.clear();
    };
  }, [refreshAds]);

  const handleAdClick = (ad: AppAd) => {
    notificationManager.recordAdClick(ad.id);
    if (ad.ctaUrl) {
      if (ad.ctaUrl.startsWith('#')) {
        const view = ad.ctaUrl.replace('#', '') as AppView;
        if (onNavigate) {
          onNavigate(view);
        } else {
          window.location.hash = ad.ctaUrl;
        }
      } else if (ad.ctaUrl.startsWith('http')) {
        window.open(ad.ctaUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleDismiss = (adId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    notificationManager.dismissAd(adId, activeUserId);
    setVisibleAdIds((prev) => {
      const next = new Set(prev);
      next.delete(adId);
      return next;
    });
    refreshAds();
  };

  // Filter visible ads by placement
  const visibleAds = ads.filter((ad) => visibleAdIds.has(ad.id));
  const topBanners = visibleAds.filter((a) => a.placement === 'top-banner');
  const bottomBanners = visibleAds.filter((a) => a.placement === 'bottom-banner');
  const floatingRightCards = visibleAds.filter((a) => a.placement === 'floating-card');
  const floatingLeftCards = visibleAds.filter((a) => a.placement === 'floating-left');
  const modalPopups = visibleAds.filter((a) => a.placement === 'modal-popup');
  const interstitials = visibleAds.filter((a) => a.placement === 'interstitial');

  return (
    <>
      {/* 1. TOP STICKY BANNERS */}
      <AnimatePresence>
        {topBanners.map((ad) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full bg-gradient-to-r from-[#091F5C] via-[#142C6E] to-[#091F5C] text-white border-b border-[#334DAF]/40 px-3.5 py-2 text-xs relative z-30 shadow-sm shrink-0"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {ad.imageUrl && (
                  <img
                    src={ad.imageUrl}
                    alt=""
                    className="w-8 h-8 rounded-lg object-cover shrink-0 border border-[#7096D1]/40"
                  />
                )}
                <span className="px-2 py-0.5 rounded-full bg-[#334DAF]/40 text-[#D0E4FE] border border-[#7096D1]/30 font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3 h-3 text-[#D0E4FE]" />
                  {ad.badgeText || 'Sponsored'}
                </span>
                <span className="font-bold text-white truncate text-xs">
                  {ad.title}
                </span>
                <span className="hidden md:inline text-[#D0E4FE]/80 truncate text-[11px]">
                  — {ad.description}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {ad.ctaText && (
                  <button
                    onClick={() => handleAdClick(ad)}
                    className="px-3 py-1 rounded-xl bg-[#334DAF] hover:bg-[#283e91] text-white font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>{ad.ctaText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={(e) => handleDismiss(ad.id, e)}
                  className="p-1 rounded-lg text-[#D0E4FE]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Dismiss ad"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 2. BOTTOM STICKY BANNERS */}
      <AnimatePresence>
        {bottomBanners.map((ad) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 start-0 end-0 z-40 bg-[#091F5C]/95 backdrop-blur-md text-white border-t border-[#334DAF]/40 px-4 py-2.5 text-xs shadow-2xl"
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {ad.imageUrl && (
                  <img
                    src={ad.imageUrl}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-[#7096D1]/40"
                  />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#E8F2FE] text-[#091F5C] font-bold text-[9px] uppercase tracking-wider">
                      {ad.badgeText || 'Special Offer'}
                    </span>
                    <span className="font-bold text-white text-xs truncate">
                      {ad.title}
                    </span>
                  </div>
                  <p className="text-[#D0E4FE]/80 text-[11px] truncate">{ad.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {ad.ctaText && (
                  <button
                    onClick={() => handleAdClick(ad)}
                    className="px-4 py-1.5 rounded-xl bg-[#334DAF] hover:bg-[#283e91] text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    <span>{ad.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={(e) => handleDismiss(ad.id, e)}
                  className="p-1.5 rounded-lg text-[#D0E4FE]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>      {/* 3. FLOATING BOTTOM-RIGHT CARDS */}
      <div className="fixed bottom-4 end-4 z-40 space-y-3 pointer-events-none max-w-sm w-full px-2 sm:px-0">
        <AnimatePresence>
          {floatingRightCards.map((ad) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="pointer-events-auto"
            >
              <AdCardView
                ad={ad}
                onCtaClick={() => handleAdClick(ad)}
                onDismiss={(e) => handleDismiss(ad.id, e)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 4. FLOATING BOTTOM-LEFT CARDS */}
      <div className="fixed bottom-4 start-4 z-40 space-y-3 pointer-events-none max-w-sm w-full px-2 sm:px-0">
        <AnimatePresence>
          {floatingLeftCards.map((ad) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              className="pointer-events-auto"
            >
              <AdCardView
                ad={ad}
                onCtaClick={() => handleAdClick(ad)}
                onDismiss={(e) => handleDismiss(ad.id, e)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 5. MODAL POPUPS */}
      <AnimatePresence>
        {modalPopups.map((ad) => (
          <div
            key={ad.id}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md"
            >
              <AdCardView
                ad={ad}
                onCtaClick={() => {
                  handleAdClick(ad);
                  notificationManager.dismissAd(ad.id, activeUserId);
                  refreshAds();
                }}
                onDismiss={(e) => handleDismiss(ad.id, e)}
              />
            </motion.div>
          </div>
        ))}
      </AnimatePresence>

      {/* 6. FULLSCREEN INTERSTITIAL TAKEOVER */}
      <AnimatePresence>
        {interstitials.map((ad) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#1E221B] border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl relative flex flex-col"
            >
              <button
                onClick={(e) => handleDismiss(ad.id, e)}
                className="absolute top-4 end-4 z-10 w-9 h-9 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 flex items-center justify-center cursor-pointer transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {ad.imageUrl && (
                <div className="w-full h-48 sm:h-56 bg-[#E8F2FE] relative">
                  <img src={ad.imageUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 start-4 px-3 py-1 rounded-full bg-[#334DAF] text-white font-bold text-[10px] uppercase tracking-wider shadow-md">
                    {ad.badgeText || 'Exclusive Presentation'}
                  </span>
                </div>
              )}

              <div className="p-6 space-y-4">
                {!ad.imageUrl && (
                  <span className="inline-block px-3 py-1 rounded-full bg-[#E8F2FE] text-[#091F5C] font-bold text-[10px] uppercase tracking-wider border border-[#D0E4FE]">
                    {ad.badgeText || 'Exclusive Presentation'}
                  </span>
                )}

                <div>
                  <h2 className="text-xl font-['Cabinet_Grotesk','Plus_Jakarta_Sans',sans-serif] font-bold text-[#091F5C] dark:text-white mb-2">
                    {ad.title}
                  </h2>
                  <p className="text-[#7096D1] dark:text-[#D0E4FE] text-xs leading-relaxed">
                    {ad.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  {ad.ctaText && (
                    <button
                      onClick={() => {
                        handleAdClick(ad);
                        notificationManager.dismissAd(ad.id, activeUserId);
                        refreshAds();
                      }}
                      className="flex-1 py-3 rounded-2xl bg-[#334DAF] hover:bg-[#283e91] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-transform active:scale-98"
                    >
                      <span>{ad.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDismiss(ad.id, e)}
                    className="px-5 py-3 rounded-2xl bg-[#E8F2FE] dark:bg-stone-800 text-[#091F5C] dark:text-stone-400 hover:bg-[#D0E4FE] font-bold text-xs cursor-pointer"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
};
