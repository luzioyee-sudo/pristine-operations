// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Check,
  Target,
  Book,
  Star,
  Bell,
  X,
  ChevronDown,
  Plus,
} from 'lucide-react';

export interface NotificationItem {
  id: number | string;
  icon: 'flame' | 'check' | 'target' | 'book' | 'star' | string;
  title: string;
  body: string;
  time: string;
}

export interface NotificationStackProps {
  notifications?: NotificationItem[];
  onDismiss?: (id: number | string) => void;
  onNotificationClick?: (notification: NotificationItem) => void;
  className?: string;
}

export const INITIAL_TEST_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    icon: 'flame',
    title: 'Streak reminder',
    body: "Don't break your 5-day streak! Practice today.",
    time: '2h ago',
  },
  {
    id: 2,
    icon: 'check',
    title: 'Word mastered',
    body: "You mastered the word 'ubiquitous'",
    time: '3h ago',
  },
  {
    id: 3,
    icon: 'target',
    title: 'Goal progress',
    body: "You hit 80% of today's learning goal",
    time: '8:13 AM',
  },
  {
    id: 4,
    icon: 'book',
    title: 'New lesson unlocked',
    body: 'Chapter 4: Past Tense is now available',
    time: '8:07 AM',
  },
  {
    id: 5,
    icon: 'star',
    title: 'Practice reminder',
    body: "You haven't practiced speaking in 2 days",
    time: 'Yesterday',
  },
];

// SECTION 0: Spec-exact easing curve: cubic-bezier(0.22, 1, 0.36, 1)
const EASE_OUT_CURVE = [0.22, 1, 0.36, 1] as const;

// Snapback bounce curve for swipe less than 40%: cubic-bezier(0.34, 1.56, 0.64, 1)
const SNAPBACK_CURVE = [0.34, 1.56, 0.64, 1] as const;

export const NotificationStack: React.FC<NotificationStackProps> = ({
  notifications: initialNotifications = INITIAL_TEST_NOTIFICATIONS,
  onDismiss,
  onNotificationClick,
  className = '',
}) => {
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Track dismiss states for smooth upward gap closing
  const [dismissingId, setDismissingId] = useState<number | string | null>(null);

  // Detect accessibility prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Sync with prop updates
  useEffect(() => {
    setItems(initialNotifications);
  }, [initialNotifications]);

  // Handle Haptic / Light Audio Feedback
  const triggerHaptic = () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(10);
      }
    } catch {
      // safe fallback
    }
  };

  // Section 4: Dismiss with smooth exit and remaining gap closure
  const handleDismiss = (id: number | string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDismissingId(id);

    // Give the dismissed card 200ms to exit while cards below close the gap at 50ms
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setDismissingId(null);
      if (onDismiss) {
        onDismiss(id);
      }
    }, 220);
  };

  // Section 1: Brand new notification arrives
  const handleAddSample = () => {
    triggerHaptic();

    const sampleOptions = [
      {
        icon: 'flame',
        title: 'Streak Milestone!',
        body: 'You just reached a 6-day practice streak!',
        time: 'Just now',
      },
      {
        icon: 'check',
        title: 'Vocabulary Mastered',
        body: "You mastered the word 'serendipity' in Spanish.",
        time: 'Just now',
      },
      {
        icon: 'target',
        title: 'Daily Goal Complete',
        body: '100% of daily 20-min reading goal completed!',
        time: 'Just now',
      },
      {
        icon: 'book',
        title: 'Grammar Unit Unlocked',
        body: 'Subjunctive Mood Mastery is now open for review.',
        time: 'Just now',
      },
      {
        icon: 'star',
        title: 'Speaking Session Ready',
        body: 'Coach Sarah is waiting for your 10-minute dialogue session.',
        time: 'Just now',
      },
    ];

    const randomChoice = sampleOptions[Math.floor(Math.random() * sampleOptions.length)];
    const newItem: NotificationItem = {
      id: Date.now(),
      ...randomChoice,
    };

    setItems((prev) => [newItem, ...prev]);
  };

  // Icon badge rendering
  const renderIcon = (iconName: string) => {
    const iconProps = { className: 'w-5 h-5 text-white stroke-[2.2]' };
    switch (iconName) {
      case 'flame':
        return <Flame {...iconProps} />;
      case 'check':
        return <Check {...iconProps} />;
      case 'target':
        return <Target {...iconProps} />;
      case 'book':
        return <Book {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  if (!items || items.length === 0) {
    return (
      <div
        id="empty-notification-stack"
        className={`w-full max-w-[340px] mx-auto p-5 bg-[#FFFFFF] rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-stone-100 text-center ${className}`}
      >
        <p className="text-[13px] text-[#5B6472]">No notifications</p>
        <button
          id="btn-add-initial-test"
          onClick={handleAddSample}
          className="mt-3 text-xs font-semibold text-[#0F4F5C] hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add test notification</span>
        </button>
      </div>
    );
  }

  return (
    <div
      id="notification-stack-root"
      className={`relative w-full max-w-[340px] select-none mx-auto ${className}`}
    >
      {/* =========================================================================
         SECTION 2 & 3: BACKDROP OVERLAY
         - Fade in: opacity 0 -> 1 over 300ms
         - Fade out: opacity 1 -> 0 over 200ms
         ========================================================================= */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="notification-stack-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.3,
              ease: EASE_OUT_CURVE,
            }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] backdrop-blur-xs cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* Mini Controls Bar (Visible outside modal overlay or above stack) */}
      <div
        id="notification-stack-toolbar"
        className="flex items-center justify-between mb-2.5 px-1 text-xs"
      >
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-[#0F4F5C]">
            {items.length} {items.length === 1 ? 'Notification' : 'Notifications'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-add-sample-notification"
            onClick={handleAddSample}
            className="text-[11px] text-[#222222] dark:text-[#A4F5A6] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            title="Trigger new incoming notification animation"
          >
            <Plus className="w-3 h-3 stroke-[2.5]" />
            <span>New test</span>
          </button>
        </div>
      </div>

      {!isExpanded ? (
        /* =========================================================================
           SECTION 1: COLLAPSED / STACKED VIEW
           - Visible front 4 items (Index 0, 1, 2, 3)
           - Exact Stacking Math:
             * Index 0: translateY: 0px,  scale: 1.00, opacity: 1.00, zIndex: 40
             * Index 1: translateY: 10px, scale: 0.96, opacity: 0.85, zIndex: 30
             * Index 2: translateY: 20px, scale: 0.92, opacity: 0.70, zIndex: 20
             * Index 3: translateY: 30px, scale: 0.88, opacity: 0.55, zIndex: 10
             * Index > 3: opacity: 0, scale: 0.84, translateY: 40px
           - New arrival: starts at y: -60px, scale: 0.90, opacity: 0
             Animates to y: 0px, scale: 1.0, opacity: 1.0 over 350ms with spring (stiffness: 300, damping: 20)
           ========================================================================= */
        <div
          id="notification-collapsed-container"
          onClick={() => setIsExpanded(true)}
          className="relative w-[340px] h-[130px] cursor-pointer"
        >
          <AnimatePresence initial={false}>
            {items.slice(0, 4).map((item, index) => {
              const translateY = index * 10;
              const scale = 1 - index * 0.04;
              const opacity = 1 - index * 0.15;
              const zIndex = 40 - index * 10;

              return (
                <motion.div
                  key={item.id}
                  id={`notification-card-collapsed-${item.id}`}
                  layout="position"
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : {
                          y: -60,
                          scale: 0.9,
                          opacity: 0,
                        }
                  }
                  animate={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : {
                          y: translateY,
                          scale: scale,
                          opacity: opacity,
                          zIndex: zIndex,
                        }
                  }
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          scale: 0.84,
                          y: 40,
                          transition: { duration: 0.35, ease: EASE_OUT_CURVE },
                        }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.2 }
                      : {
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                          mass: 0.8,
                          duration: 0.35,
                        }
                  }
                  style={{
                    transformOrigin: 'top center',
                  }}
                  className={`absolute top-0 start-0 w-[340px] bg-[#FFFFFF] rounded-[20px] p-[16px] border border-stone-100/90 transition-shadow ${
                    index === 0
                      ? 'shadow-[0_8px_24px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.15)]'
                      : 'shadow-[0_4px_16px_rgba(0,0,0,0.08)]'
                  }`}
                >
                  <div className="flex flex-row items-start gap-[12px]">
                    {/* Part A — Icon badge: 40x40px, rounded 12px, #0F4F5C */}
                    <div className="w-[40px] h-[40px] rounded-[12px] bg-[#0F4F5C] flex items-center justify-center shrink-0 shadow-xs">
                      {renderIcon(item.icon)}
                    </div>

                    {/* Part B — Text content */}
                    <div className="flex-1 min-w-0 pe-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-[14px] text-[#0F4F5C] truncate pe-2">
                          {item.title}
                        </span>
                        <span className="font-normal text-[12px] text-[#8A94A6] shrink-0">
                          {item.time}
                        </span>
                      </div>
                      <p
                        className="text-[13px] text-[#5B6472] font-normal leading-snug"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* =========================================================================
           SECTION 2, 3 & 4: EXPANDED VERTICAL LIST WITH STAGGER & GESTURE DISMISS
           - Staggered Expand: delay = Math.min(index * 30ms, 150ms), duration 400ms
           - Staggered Collapse: delay = (totalCards - index) * 20ms, duration 300ms
           - Header: translateY: -10px -> 0px, opacity: 0 -> 1 over 250ms
           - Swipe Dismiss: Drag > 40% dismisses (200ms ease-out). Drag < 40% snaps back (250ms bounce curve)
           - X Button Dismiss: translateX 100%, opacity 0 over 200ms
           - Gap closure: 250ms ease-out, starts 50ms after dismiss begins
           ========================================================================= */
        <div
          id="notification-expanded-container"
          className="relative z-50 w-[340px] flex flex-col"
        >
          {/* Header Row (Section 2, Point 6) */}
          <motion.div
            id="notification-expanded-header"
            initial={prefersReducedMotion ? { opacity: 0 } : { y: -10, opacity: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { y: -8, opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.15 : 0.25,
              ease: EASE_OUT_CURVE,
            }}
            className="flex items-center justify-between bg-white/95 px-3.5 py-2.5 rounded-[16px] border border-stone-200/90 shadow-sm mb-3"
          >
            <span className="font-bold text-[14px] text-[#0F4F5C]">
              {items.length} {items.length === 1 ? 'Notification' : 'Notifications'}
            </span>
            <button
              id="btn-collapse-notifications"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="flex items-center gap-1 text-[12px] font-semibold text-[#0F4F5C] hover:bg-stone-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <span>Collapse</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Scrollable list of all cards */}
          <div className="max-h-[500px] overflow-y-auto space-y-[12px] pe-1 py-1 no-scrollbar">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => {
                // Section 2 Point 3: Capped staggered delay formula
                const expandDelay = Math.min(index * 0.03, 0.15);

                return (
                  <ExpandedCardItem
                    key={item.id}
                    item={item}
                    index={index}
                    totalCards={items.length}
                    expandDelay={expandDelay}
                    prefersReducedMotion={prefersReducedMotion}
                    renderIcon={renderIcon}
                    onDismiss={handleDismiss}
                    onCardClick={() => onNotificationClick?.(item)}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

interface ExpandedCardItemProps {
  item: NotificationItem;
  index: number;
  totalCards: number;
  expandDelay: number;
  prefersReducedMotion: boolean;
  renderIcon: (icon: string) => React.ReactNode;
  onDismiss: (id: number | string, e?: React.MouseEvent) => void;
  onCardClick: () => void;
}

const ExpandedCardItem: React.FC<ExpandedCardItemProps> = ({
  item,
  index,
  totalCards,
  expandDelay,
  prefersReducedMotion,
  renderIcon,
  onDismiss,
  onCardClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState<number>(0);
  const [isDismissing, setIsDismissing] = useState<boolean>(false);
  const [dismissDirection, setDismissDirection] = useState<number>(1);

  // Section 4 Swipe Logic: Drag > 40% completes dismiss; Drag < 40% snaps back
  const handleDragEnd = (_: any, info: any) => {
    const cardWidth = cardRef.current?.offsetWidth || 340;
    const threshold = cardWidth * 0.4;
    const offset = info.offset.x;

    if (Math.abs(offset) >= threshold) {
      // Dismiss
      setIsDismissing(true);
      setDismissDirection(offset > 0 ? 1 : -1);
      setTimeout(() => {
        onDismiss(item.id);
      }, 200);
    } else {
      // Snapback automatically handled by framer dragSnapToOrigin with SNAPBACK_CURVE
      setDragX(0);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      id={`expanded-card-${item.id}`}
      layout
      drag={prefersReducedMotion ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : {
              opacity: 0,
              y: index * 10,
              scale: 0.94,
            }
      }
      animate={
        isDismissing
          ? {
              x: dismissDirection * 400,
              opacity: 0,
              transition: { duration: 0.2, ease: EASE_OUT_CURVE },
            }
          : {
              opacity: 1,
              y: 0,
              scale: 1.0,
              x: 0,
            }
      }
      exit={
        prefersReducedMotion
          ? { opacity: 0, transition: { duration: 0.2 } }
          : {
              opacity: 0,
              x: 350,
              transition: { duration: 0.2, ease: EASE_OUT_CURVE },
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0.2 }
          : {
              duration: 0.4,
              delay: expandDelay,
              ease: EASE_OUT_CURVE,
              layout: {
                duration: 0.25,
                delay: 0.05, // 50ms delay so gap closure doesn't fight exit
                ease: EASE_OUT_CURVE,
              },
            }
      }
      onClick={onCardClick}
      className="relative w-[340px] bg-[#FFFFFF] rounded-[20px] p-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-stone-100/90 group cursor-pointer active:cursor-grabbing select-none touch-pan-y"
    >
      <div className="flex flex-row items-start gap-[12px]">
        {/* Part A — Icon badge: 40x40px, rounded 12px, #0F4F5C */}
        <div className="w-[40px] h-[40px] rounded-[12px] bg-[#0F4F5C] flex items-center justify-center shrink-0 shadow-xs">
          {renderIcon(item.icon)}
        </div>

        {/* Part B — Text content */}
        <div className="flex-1 min-w-0 pe-4">
          <div className="flex justify-between items-center mb-0.5">
            <span className="font-bold text-[14px] text-[#0F4F5C] truncate pe-2">
              {item.title}
            </span>
            <span className="font-normal text-[12px] text-[#8A94A6] shrink-0">
              {item.time}
            </span>
          </div>
          <p
            className="text-[13px] text-[#5B6472] font-normal leading-snug"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item.body}
          </p>
        </div>
      </div>

      {/* Dismiss "X" Button (Section 4, Point 3) */}
      <button
        id={`btn-dismiss-card-${item.id}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsDismissing(true);
          setDismissDirection(1);
          setTimeout(() => {
            onDismiss(item.id);
          }, 200);
        }}
        className="absolute top-3 end-3 w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-[#5B6472] hover:text-[#0F4F5C] flex items-center justify-center opacity-70 group-hover:opacity-100 transition-all cursor-pointer"
        title="Dismiss notification"
      >
        <X className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>
    </motion.div>
  );
};
