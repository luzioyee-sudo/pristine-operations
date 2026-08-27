// @ts-nocheck
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronDown,
  ChevronUp,
  Flame,
  Brain,
  Target,
  MessageSquare,
  PenLine,
  BookOpen,
  Sparkles,
  ArrowRight,
  MousePointer
} from 'lucide-react';
import { AppNotification } from '../types';

export interface StackedNotificationGroupProps {
  notifications: AppNotification[];
  activeUserId?: string;
  onSelectNotification?: (notification: AppNotification) => void;
  onDismissNotification?: (notificationId: string) => void;
  className?: string;
}

export const StackedNotificationGroup: React.FC<StackedNotificationGroupProps> = ({
  notifications,
  activeUserId = 'anonymous',
  onSelectNotification,
  onDismissNotification,
  className = '',
}) => {
  const [scrollIndex, setScrollIndex] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  
  const isDraggingRef = useRef<boolean>(false);
  const dragStartYRef = useRef<number>(0);
  const lastWheelTimeRef = useRef<number>(0);

  if (!notifications || notifications.length === 0) {
    return null;
  }

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

  const renderIcon = (notif: AppNotification) => {
    const sender = (notif.senderName || '').toLowerCase();
    const title = (notif.title || '').toLowerCase();

    if (sender.includes('streak') || title.includes('streak')) {
      return (
        <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#222222] to-[#333333] text-[#A4F5A6] flex items-center justify-center shrink-0 shadow-md shadow-[#222222]/20 border border-white/20">
          <Flame className="w-5 h-5 fill-current stroke-[2.3]" />
        </div>
      );
    }

    if (sender.includes('vocab') || title.includes('mastered') || title.includes('flashcard')) {
      return (
        <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#222222] to-[#1D201A] text-[#A4F5A6] flex items-center justify-center shrink-0 shadow-md shadow-[#222222]/20 border border-white/20">
          <Brain className="w-5 h-5 stroke-[2.2]" />
        </div>
      );
    }

    if (sender.includes('goal') || title.includes('goal')) {
      return (
        <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#10B981] to-[#047857] text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20 border border-white/20">
          <Target className="w-5 h-5 stroke-[2.2]" />
        </div>
      );
    }

    if (sender.includes('speaking') || sender.includes('tutor') || title.includes('practice')) {
      return (
        <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#222222] to-[#444444] text-white flex items-center justify-center shrink-0 shadow-md shadow-black/20 border border-white/20">
          <MessageSquare className="w-5 h-5 stroke-[2.2]" />
        </div>
      );
    }

    if (sender.includes('writing') || title.includes('writing')) {
      return (
        <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#222222] to-[#3A3A3A] text-[#A4F5A6] flex items-center justify-center shrink-0 shadow-md shadow-black/20 border border-white/20">
          <PenLine className="w-5 h-5 stroke-[2.2]" />
        </div>
      );
    }

    return (
      <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#222222] to-[#111111] text-[#A4F5A6] flex items-center justify-center shrink-0 shadow-md shadow-[#222222]/20 border border-white/20">
        <BookOpen className="w-5 h-5 stroke-[2.2]" />
      </div>
    );
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (notifications.length <= 1) return;
    const now = Date.now();
    if (now - lastWheelTimeRef.current < 260) return;

    if (Math.abs(e.deltaY) > 18) {
      lastWheelTimeRef.current = now;
      if (e.deltaY > 0) {
        setScrollIndex((prev) => Math.min(notifications.length - 1, prev + 1));
      } else {
        setScrollIndex((prev) => Math.max(0, prev - 1));
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (notifications.length <= 1) return;
    isDraggingRef.current = true;
    dragStartYRef.current = e.clientY;
    setDragOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const diff = e.clientY - dragStartYRef.current;
    setDragOffset(diff * 0.7);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    
    if (dragOffset < -40 && scrollIndex < notifications.length - 1) {
      setScrollIndex((prev) => prev + 1);
    } else if (dragOffset > 40 && scrollIndex > 0) {
      setScrollIndex((prev) => prev - 1);
    }
    setDragOffset(0);
  };

  const springTransition = {
    type: 'spring' as const,
    stiffness: 280,
    damping: 28,
    mass: 0.85,
  };

  return (
    <div className={`w-full max-w-[420px] select-none ${className}`}>
      <div
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full flex flex-col items-center cursor-grab active:cursor-grabbing touch-none select-none"
      >
        <div 
          className="w-full relative h-[215px] sm:h-[225px] pt-1"
          style={{ perspective: 1200 }}
        >
          <AnimatePresence initial={false}>
            {notifications.map((notif, index) => {
              const isUnread = !notif.readBy || !notif.readBy.includes(activeUserId);
              const relativeOffset = index - scrollIndex;

              // Card scrolled up and out
              if (relativeOffset < 0) {
                return (
                  <motion.div
                    key={notif.id}
                    initial={false}
                    animate={{
                      opacity: 0,
                      y: -95 + relativeOffset * 25,
                      scale: 0.92,
                      rotateX: 8,
                      filter: 'blur(3px)',
                      zIndex: 10 + relativeOffset,
                      pointerEvents: 'none',
                    }}
                    transition={springTransition}
                    className="absolute top-0 start-0 end-0"
                  />
                );
              }

              // Card far in the back
              if (relativeOffset > 3) {
                return (
                  <motion.div
                    key={notif.id}
                    initial={false}
                    animate={{
                      opacity: 0,
                      y: 125,
                      scale: 0.78,
                      rotateX: -4,
                      filter: 'blur(4px)',
                      zIndex: 5,
                      pointerEvents: 'none',
                    }}
                    transition={springTransition}
                    className="absolute top-0 start-0 end-0"
                  />
                );
              }

              let yTarget = 0;
              let scaleTarget = 1.0;
              let opacityTarget = 1.0;
              let blurTarget = 0;
              let brightnessTarget = 1.0;
              let rotateXTarget = 0;
              const zIndex = 50 - relativeOffset * 10;

              if (relativeOffset === 0) {
                yTarget = 0 + (isDraggingRef.current ? dragOffset : 0);
                scaleTarget = 1.0;
                opacityTarget = 1.0;
                blurTarget = 0;
                brightnessTarget = 1.0;
                rotateXTarget = isDraggingRef.current ? dragOffset * 0.04 : 0;
              } else if (relativeOffset === 1) {
                const dragFollow = isDraggingRef.current && dragOffset < 0 ? dragOffset * 0.4 : 0;
                yTarget = 42 + dragFollow;
                scaleTarget = 0.94 - (dragFollow * 0.001);
                opacityTarget = 0.94;
                blurTarget = 0.3;
                brightnessTarget = 0.97;
                rotateXTarget = 0;
              } else if (relativeOffset === 2) {
                const dragFollow = isDraggingRef.current && dragOffset < 0 ? dragOffset * 0.25 : 0;
                yTarget = 76 + dragFollow;
                scaleTarget = 0.88;
                opacityTarget = 0.82;
                blurTarget = 0.7;
                brightnessTarget = 0.93;
                rotateXTarget = 0;
              } else if (relativeOffset === 3) {
                yTarget = 102;
                scaleTarget = 0.82;
                opacityTarget = 0.60;
                blurTarget = 1.2;
                brightnessTarget = 0.88;
                rotateXTarget = 0;
              }

              return (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 50, scale: 0.85 }}
                  animate={{
                    opacity: opacityTarget,
                    y: yTarget,
                    scale: scaleTarget,
                    rotateX: rotateXTarget,
                    filter: `blur(${blurTarget}px) brightness(${brightnessTarget})`,
                    zIndex,
                  }}
                  exit={{ opacity: 0, y: -80, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={springTransition}
                  style={{ transformOrigin: 'top center' }}
                  onClick={() => {
                    if (relativeOffset === 0) {
                      onSelectNotification?.(notif);
                    } else {
                      setScrollIndex(index);
                    }
                  }}
                  className={`absolute top-0 start-0 end-0 bg-white/94 dark:bg-stone-900/94 backdrop-blur-2xl text-stone-900 dark:text-white rounded-[22px] p-3.5 sm:p-4 border transition-shadow cursor-pointer ${
                    relativeOffset === 0
                      ? 'shadow-[0_16px_36px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.06)]'
                      : relativeOffset === 1
                      ? 'shadow-[0_10px_24px_rgba(0,0,0,0.08)]'
                      : 'shadow-[0_6px_16px_rgba(0,0,0,0.05)]'
                  } ${
                    isUnread && relativeOffset === 0
                      ? 'border-white/95 dark:border-white/20 ring-1 ring-[#0062FF]/35'
                      : 'border-white/80 dark:border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {renderIcon(notif)}
                    <div className="flex-1 min-w-0 pe-4">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h3 className="font-bold text-[14.5px] text-stone-950 dark:text-white tracking-tight truncate">
                          {notif.title || notif.senderName}
                        </h3>
                        <span className="text-[11.5px] text-stone-400 font-normal shrink-0">
                          {formatTime(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-[13px] text-stone-600 dark:text-stone-300 leading-snug font-normal line-clamp-2">
                        {notif.message}
                      </p>
                      {relativeOffset === 0 && notif.actionText && (
                        <div className="mt-2 pt-1.5 flex items-center gap-1 text-xs font-semibold text-[#0062FF]">
                          <span>{notif.actionText}</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>

                  {relativeOffset === 0 && onDismissNotification && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDismissNotification(notif.id);
                      }}
                      className="absolute top-3 end-3 w-5.5 h-5.5 rounded-full bg-stone-200/70 hover:bg-stone-300 dark:bg-stone-800 text-stone-500 hover:text-stone-900 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer"
                      title="Dismiss"
                    >
                      <X className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom scroll controls */}
        {notifications.length > 1 && (
          <div className="w-full flex items-center justify-between px-2 pt-2.5 text-xs">
            <div className="flex items-center gap-1.5">
              {notifications.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setScrollIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === scrollIndex
                      ? 'w-5 bg-[#0062FF]'
                      : 'w-1.5 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400'
                  }`}
                  title={`Card ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-[11px] font-medium">
              <div className="flex items-center gap-1">
                <MousePointer className="w-3 h-3 text-stone-400" />
                <span>Scroll / Drag ({scrollIndex + 1}/{notifications.length})</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  disabled={scrollIndex === 0}
                  onClick={() => setScrollIndex((p) => Math.max(0, p - 1))}
                  className="w-5.5 h-5.5 rounded-md bg-stone-100 dark:bg-stone-800 disabled:opacity-30 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center cursor-pointer transition-all"
                  title="Previous notification"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={scrollIndex >= notifications.length - 1}
                  onClick={() => setScrollIndex((p) => Math.min(notifications.length - 1, p + 1))}
                  className="w-5.5 h-5.5 rounded-md bg-stone-100 dark:bg-stone-800 disabled:opacity-30 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center cursor-pointer transition-all"
                  title="Next notification"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
