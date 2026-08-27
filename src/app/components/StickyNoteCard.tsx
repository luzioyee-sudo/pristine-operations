// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { StickyNoteAnnotation } from '../types';
import { StickyNote, X, GripHorizontal, Minimize2 } from 'lucide-react';

const NOTE_COLORS = ['#FEF08A', '#FED7AA', '#BBF7D0', '#BAE6FD', '#DDD6FE'];

interface StickyNoteCardProps {
  note: StickyNoteAnnotation;
  onUpdate: (note: StickyNoteAnnotation) => void;
  onDelete: (id: string) => void;
  isEraserActive?: boolean;
}

export const StickyNoteCard: React.FC<StickyNoteCardProps> = ({
  note,
  onUpdate,
  onDelete,
  isEraserActive = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const noteRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    const rect = noteRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const parent = noteRef.current?.offsetParent as HTMLElement;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();
      const newX = ((e.clientX - parentRect.left - dragOffset.x) / parentRect.width) * 100;
      const newY = ((e.clientY - parentRect.top - dragOffset.y) / parentRect.height) * 100;

      onUpdate({
        ...note,
        x: Math.max(0, Math.min(85, newX)),
        y: Math.max(0, Math.min(85, newY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, note, onUpdate]);

  if (!note.isExpanded) {
    return (
      <div
        ref={noteRef}
        style={{ left: `${note.x}%`, top: `${note.y}%`, backgroundColor: note.color }}
        onMouseEnter={() => {
          if (isEraserActive) onDelete(note.id);
        }}
        onPointerEnter={() => {
          if (isEraserActive) onDelete(note.id);
        }}
        onPointerOver={() => {
          if (isEraserActive) onDelete(note.id);
        }}
        onMouseMove={() => {
          if (isEraserActive) onDelete(note.id);
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (isEraserActive) {
            onDelete(note.id);
          } else {
            onUpdate({ ...note, isExpanded: true });
          }
        }}
        className={`absolute z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-lg border border-black/15 cursor-pointer hover:scale-105 transition-all text-xs font-bold text-stone-900 dark:text-stone-100 ${
          isEraserActive ? 'ring-2 ring-rose-500 animate-pulse' : ''
        }`}
        title={isEraserActive ? "Hover or click to erase note" : "Click to expand sticky note"}
      >
        <StickyNote className="w-3.5 h-3.5 text-stone-900 dark:text-stone-100" />
        <span className="max-w-[100px] truncate text-[11px] font-semibold">
          {note.text || 'Sticky Note'}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="p-0.5 rounded-md hover:bg-black/20 dark:hover:bg-white/20 text-stone-900 dark:text-stone-100 transition-colors cursor-pointer"
          title="Delete sticky note"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={noteRef}
      style={{ left: `${note.x}%`, top: `${note.y}%`, backgroundColor: note.color }}
      onMouseEnter={() => {
        if (isEraserActive) onDelete(note.id);
      }}
      onPointerEnter={() => {
        if (isEraserActive) onDelete(note.id);
      }}
      onPointerOver={() => {
        if (isEraserActive) onDelete(note.id);
      }}
      onMouseMove={() => {
        if (isEraserActive) onDelete(note.id);
      }}
      onClick={(e) => {
        if (isEraserActive) {
          e.stopPropagation();
          onDelete(note.id);
        }
      }}
      className={`absolute z-30 w-56 sm:w-64 rounded-2xl shadow-2xl border border-black/15 transition-all ${
        isDragging ? 'opacity-90 scale-102 shadow-2xl' : ''
      } ${isEraserActive ? 'ring-2 ring-rose-500 cursor-pointer' : ''}`}
    >
      {/* Header bar with grip drag handle and tools */}
      <div
        onMouseDown={handleDragStart}
        className="flex items-center justify-between px-3 py-2 border-b border-black/10 cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-1.5">
          <GripHorizontal className="w-4 h-4 text-stone-800/70 dark:text-stone-300/70" />
          <div className="flex items-center gap-1 ms-0.5">
            {NOTE_COLORS.map((c) => (
              <button
                key={c}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate({ ...note, color: c });
                }}
                style={{ backgroundColor: c }}
                className={`w-3.5 h-3.5 rounded-full border border-black/20 transition-transform ${
                  note.color === c ? 'ring-1 ring-black scale-110' : 'hover:scale-105'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdate({ ...note, isExpanded: false });
            }}
            className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-stone-800 dark:text-stone-300 transition-colors"
            title="Minimize note"
          >
            <Minimize2 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-800 transition-colors"
            title="Delete note"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Note Textarea */}
      <div className="p-3">
        <textarea
          value={note.text}
          onChange={(e) => onUpdate({ ...note, text: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          placeholder="Write note or translation..."
          className="w-full h-24 bg-transparent border-none outline-none resize-none text-xs font-semibold text-stone-900 dark:text-stone-100 placeholder:text-stone-600/70 leading-relaxed"
          autoFocus
        />
      </div>
    </div>
  );
};
