// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  X,
  CheckCheck,
  Flame,
  Brain,
  Target,
  MessageSquare,
  PenLine,
  BookOpen,
  Sparkles,
  ArrowRight,
  Plus
} from 'lucide-react';
import { AppNotification, AppView } from '../types';
import { notificationManager } from '../utils/notificationManager';
import { getTranslation } from '../utils/i18n';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  activeUserId: string;
  onNavigate?: (view: AppView) => void;
  settings?: any;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  activeUserId,
  onNavigate,
  settings,
}) => {
  const t = getTranslation(settings?.interfaceLanguage);
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    notificationManager.getUserNotifications(activeUserId)
  );
  
  const [showSimulateBar, setShowSimulateBar] = useState<boolean>(false);

  const refreshNotifs = useCallback(() => {
    setNotifications(notificationManager.getUserNotifications(activeUserId));
  }, [activeUserId]);

  useEffect(() => {
    refreshNotifs();

    const handleUpdate = () => {
      refreshNotifs();
    };

    window.addEventListener('lingoflow_notifications_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('lingoflow_notifications_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refreshNotifs]);

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    notificationManager.markAsRead(id, activeUserId);
    refreshNotifs();
  };

  const handleMarkAllRead = () => {
    notificationManager.markAllAsRead(activeUserId);
    refreshNotifs();
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    notificationManager.dismissNotification(id, activeUserId);
    refreshNotifs();
  };

  const handleActionClick = (notif: AppNotification) => {
    handleMarkAsRead(notif.id);
    if (notif.actionUrl) {
      if (notif.actionUrl.startsWith('#')) {
        const view = notif.actionUrl.replace('#', '') as AppView;
        if (onNavigate) {
          onNavigate(view);
          onClose();
        } else {
          window.location.hash = notif.actionUrl;
          onClose();
        }
      } else if (notif.actionUrl.startsWith('http')) {
        window.open(notif.actionUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '12:49 AM';
    }
  };

  // Reusable Blue-Palette App Icon Badges matching iOS aesthetic
  const renderSourceLogo = (notif: AppNotification) => {
    const sender = (notif.senderName || '').toLowerCase();
    const title = (notif.title || '').toLowerCase();
    const badge = (notif.badgeText || '').toLowerCase();

    // Streak Reminder
    if (sender.includes('streak') || title.includes('streak') || badge.includes('streak')) {
      return (
        <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#0062FF] to-[#0048C4] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0062FF]/20 border border-white/40">
          <Flame className="w-5 h-5 fill-white/20 stroke-[2.3]" />
        </div>
      );
    }

    // Vocabulary Mastered
    if (sender.includes('vocab') || title.includes('mastered') || title.includes('flashcard') || badge.includes('mastered')) {
      return (
        <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#222222] to-[#1D201A] text-[#A4F5A6] flex items-center justify-center shrink-0 shadow-md shadow-[#222222]/20 border border-white/20">
          <Brain className="w-5 h-5 stroke-[2.2]" />
        </div>
      );
    }

    // Daily Goal
    if (sender.includes('goal') || title.includes('goal') || badge.includes('goal')) {
      return (
        <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#10B981] to-[#047857] text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20 border border-white/20">
          <Target className="w-5 h-5 stroke-[2.2]" />
        </div>
      );
    }

    // Practice Session
    if (sender.includes('speaking') || sender.includes('tutor') || title.includes('practice') || badge.includes('practice')) {
      return (
        <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#222222] to-[#444444] text-white flex items-center justify-center shrink-0 shadow-md shadow-black/20 border border-white/20">
          <MessageSquare className="w-5 h-5 stroke-[2.2]" />
        </div>
      );
    }

    // Writing
    if (sender.includes('writing') || title.includes('writing') || title.includes('essay')) {
      return (
        <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#222222] to-[#3A3A3A] text-[#A4F5A6] flex items-center justify-center shrink-0 shadow-md shadow-black/20 border border-white/20">
          <PenLine className="w-5 h-5 stroke-[2.2]" />
        </div>
      );
    }

    // Announcements
    if (sender.includes('curriculum') || title.includes('boost') || notif.type === 'announcement') {
      return (
        <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#222222] to-[#111111] text-[#A4F5A6] flex items-center justify-center shrink-0 shadow-md shadow-black/20 border border-white/20">
          <Sparkles className="w-5 h-5 stroke-[2.2]" />
        </div>
      );
    }

    // Default Brand Logo
    return (
      <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#222222] to-[#111111] text-[#A4F5A6] flex items-center justify-center shrink-0 shadow-md shadow-[#222222]/20 border border-white/20">
        <BookOpen className="w-5 h-5 stroke-[2.2]" />
      </div>
    );
  };

  // Test triggers
  const handleTriggerTest = (type: 'streak' | 'vocab' | 'goal' | 'practice') => {
    if (type === 'streak') {
      notificationManager.triggerStreakReminder(6, activeUserId);
    } else if (type === 'vocab') {
      notificationManager.triggerWordMastered(15, 'Advanced Spanish Verbs', activeUserId);
    } else if (type === 'goal') {
      notificationManager.triggerDailyGoalProgress(20, 20, activeUserId);
    } else if (type === 'practice') {
      notificationManager.triggerPracticeInvite('Coach Sarah', 'Ordering Coffee & Pastries', activeUserId);
    }
  };

  // Spring physics transition configuration
  const springTransition = {
    type: 'spring' as const,
    stiffness: 280,
    damping: 28,
    mass: 0.85,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end p-3 sm:p-6 md:p-8 pointer-events-auto overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/25 backdrop-blur-xs cursor-pointer z-40"
          />

          {/* Floating Notification Container */}
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={springTransition}
            className="relative z-50 w-full max-w-[420px] sm:max-w-[440px] mt-10 sm:mt-6 flex flex-col items-center select-none"
          >
            {/* Top Control Bar */}
            <div className="w-full flex items-center justify-between px-3.5 py-2 mb-2.5 bg-white/95 dark:bg-[#1D201A]/95 backdrop-blur-xl rounded-2xl border border-[#D0D2CF] dark:border-stone-800 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#222222] dark:bg-[#A4F5A6] animate-pulse" />
                <span className="text-xs font-bold text-[#222222] dark:text-stone-100 tracking-tight">
                  {t.notificationsCenter || 'Notification Center'}
                </span>
                {notifications.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#EFF1EE] dark:bg-stone-800 text-[#222222] dark:text-[#A4F5A6] text-[10px] font-bold">
                    {notifications.length}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {/* Simulate / Test Alert */}
                <button
                  onClick={() => setShowSimulateBar(!showSimulateBar)}
                  className={`p-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    showSimulateBar
                      ? 'bg-[#222222] dark:bg-[#A4F5A6] text-white dark:text-[#222222]'
                      : 'bg-white dark:bg-stone-900 text-stone-500 hover:bg-[#EFF1EE]'
                  }`}
                  title="Simulate incoming notifications"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>

                {notifications.length > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-[#222222] dark:hover:text-stone-100 hover:bg-[#EFF1EE] dark:hover:bg-stone-800 transition-all cursor-pointer"
                    title={t.markAllAsRead || "Mark all as read"}
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="w-6 h-6 rounded-full bg-[#EFF1EE] dark:bg-stone-800 hover:bg-[#D0D2CF] dark:hover:bg-stone-700 text-[#222222] dark:text-stone-200 flex items-center justify-center transition-all cursor-pointer"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Quick Test Alert Drawer */}
            <AnimatePresence>
              {showSimulateBar && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 8 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="w-full overflow-hidden bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl rounded-2xl p-2.5 border border-[#D0D2CF] dark:border-white/10 shadow-md"
                >
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 px-1">
                    Push Mock Notification (Language Learning Context)
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handleTriggerTest('streak')}
                      className="px-2.5 py-1.5 rounded-xl bg-[#EFF1EE] dark:bg-stone-800 hover:bg-[#D0D2CF]/50 dark:hover:bg-stone-700 text-[#222222] dark:text-[#EFF1EE] text-xs font-semibold flex items-center gap-1.5 transition-all text-start cursor-pointer border border-[#D0D2CF] dark:border-white/10"
                    >
                      <Flame className="w-3.5 h-3.5 text-[#222222] dark:text-[#A4F5A6]" />
                      <span className="truncate">Streak Reminder</span>
                    </button>
                    <button
                      onClick={() => handleTriggerTest('vocab')}
                      className="px-2.5 py-1.5 rounded-xl bg-[#EFF1EE] dark:bg-stone-800 hover:bg-[#D0D2CF]/50 dark:hover:bg-stone-700 text-[#222222] dark:text-[#EFF1EE] text-xs font-semibold flex items-center gap-1.5 transition-all text-start cursor-pointer border border-[#D0D2CF] dark:border-white/10"
                    >
                      <Brain className="w-3.5 h-3.5 text-[#222222] dark:text-[#A4F5A6]" />
                      <span className="truncate">Word Mastered</span>
                    </button>
                    <button
                      onClick={() => handleTriggerTest('goal')}
                      className="px-2.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-xs font-semibold flex items-center gap-1.5 transition-all text-start cursor-pointer border border-sky-200/50"
                    >
                      <Target className="w-3.5 h-3.5 text-sky-600" />
                      <span className="truncate">Daily Goal</span>
                    </button>
                    <button
                      onClick={() => handleTriggerTest('practice')}
                      className="px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-all text-start cursor-pointer border border-indigo-200/50"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="truncate">Practice Session</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* EMPTY STATE */}
            {notifications.length === 0 ? (
              <div className="w-full bg-white/95 dark:bg-[#1D201A]/95 backdrop-blur-2xl rounded-[24px] p-7 shadow-xl border border-[#D0D2CF] dark:border-stone-800 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#EFF1EE] dark:bg-stone-800 text-[#222222] dark:text-[#A4F5A6] flex items-center justify-center mb-2 font-bold">
                  <Bell className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#222222] dark:text-stone-100 mb-1">
                  {t.noNotifications || 'No Notifications'}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-[240px] leading-relaxed">
                  {t.noFlashcardsDueDesc || 'You are completely caught up! Streak alerts, mastered vocabulary, and coach invites will appear here.'}
                </p>
              </div>
            ) : (
              /* =========================================================
                 FULL VERTICAL LIST MODE
                 ========================================================= */
              <div 
                className="w-full max-h-[68vh] overflow-y-auto space-y-2.5 p-1 pe-1.5 no-scrollbar scroll-smooth"
                style={{ scrollBehavior: 'smooth' }}
              >
                <AnimatePresence initial={false}>
                  {notifications.map((notif) => {
                    const isUnread = !notif.readBy || !notif.readBy.includes(activeUserId);
                    return (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, y: -16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85, x: 50 }}
                        transition={springTransition}
                        onClick={() => notif.actionText ? handleActionClick(notif) : handleMarkAsRead(notif.id)}
                        className={`w-full bg-white/95 backdrop-blur-2xl text-[#222222] dark:text-stone-100 rounded-[22px] p-3.5 sm:p-4 shadow-2xs border transition-all relative group cursor-pointer ${
                          isUnread
                            ? 'border-[#222222]/20 dark:border-[#A4F5A6]/30 ring-1 ring-[#222222]/20'
                            : 'border-[#D0D2CF]/60 hover:border-[#D0D2CF]'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          {renderSourceLogo(notif)}

                          <div className="flex-1 min-w-0 pe-4">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <h3 className="font-bold text-[14.5px] text-[#222222] dark:text-stone-100 tracking-tight truncate">
                                {notif.title || notif.senderName || 'Notification'}
                              </h3>
                              <span className="text-[11.5px] text-stone-400 font-normal shrink-0">
                                {formatTime(notif.createdAt)}
                              </span>
                            </div>

                            <p className="text-[13px] text-stone-600 dark:text-stone-300 leading-snug font-normal">
                              {notif.message}
                            </p>

                            {notif.actionText && (
                              <div className="mt-2 pt-1.5 flex items-center justify-between">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleActionClick(notif);
                                  }}
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#222222] dark:text-[#A4F5A6] hover:underline cursor-pointer"
                                >
                                  <span>{notif.actionText}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                                {isUnread && (
                                  <button
                                    onClick={(e) => handleMarkAsRead(notif.id, e)}
                                    className="text-[11px] text-stone-400 hover:text-stone-700 font-medium cursor-pointer"
                                  >
                                    Mark read
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleDelete(notif.id, e)}
                          className="absolute top-3 end-3 w-5.5 h-5.5 rounded-full bg-[#EFF1EE] hover:bg-[#D0D2CF] text-stone-400 hover:text-stone-700 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer"
                          title="Dismiss"
                        >
                          <X className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
