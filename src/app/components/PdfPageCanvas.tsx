// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Highlight, FreehandAnnotation, StickyNoteAnnotation, ReaderSettings } from '../types';
import { StickyNoteCard } from './StickyNoteCard';
import { Trash2 } from 'lucide-react';

interface PdfPageCanvasProps {
  pdfDoc: any;
  pageNumber: number;
  scale?: number;
  settings: ReaderSettings;
  highlights: Highlight[];
  notes: StickyNoteAnnotation[];
  annotations: FreehandAnnotation[];
  documentId: string;
  activeWord: string | null;
  activeTool: 'select' | 'highlight' | 'pen' | 'eraser' | 'note';
  selectedColor: string;
  onWordClick: (word: string, contextSentence: string, rect: { x: number; y: number; width: number; height: number }) => void;
  onAddHighlight: (highlight: Omit<Highlight, 'id' | 'createdAt'>) => void;
  onRemoveHighlight: (id: string) => void;
  onUpdateNotes: React.Dispatch<React.SetStateAction<StickyNoteAnnotation[]>>;
  onClearPageAnnotations?: (pageNum: number) => void;
  onTextSelection?: () => void;
}

interface TextSpanItem {
  id: string;
  str: string;
  left: number;
  top: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  words: Array<{
    word: string;
    cleanWord: string;
    isHighlighted: boolean;
    isActive: boolean;
    highlightId?: string;
  }>;
}

const PUNCTUATION_CLEAN_REGEX = /^[.,!?;:()""''「」『』。、¿¡«»“”‘’—–\-]+|[.,!?;:()""''「」『』。、¿¡«»“”‘’—–\-]+$/g;

export const PdfPageCanvas: React.FC<PdfPageCanvasProps> = ({
  pdfDoc,
  pageNumber,
  scale = 1.0,
  settings,
  highlights,
  notes,
  annotations,
  documentId,
  activeWord,
  activeTool,
  selectedColor,
  onWordClick,
  onAddHighlight,
  onRemoveHighlight,
  onUpdateNotes,
  onClearPageAnnotations,
  onTextSelection,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pageSize, setPageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [textItems, setTextItems] = useState<TextSpanItem[]>([]);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Compute responsive zoom scale based on container width & fontSize setting
  const effectiveZoomFactor = Math.max(0.7, settings.fontSize / 18);

  useEffect(() => {
    let isCancelled = false;
    let renderTask: any = null;

    async function renderPage() {
      if (!pdfDoc || !canvasRef.current || !containerRef.current) return;
      setIsLoading(true);

      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (isCancelled) return;

        // Determine base scale to fit container width
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const containerWidth = containerRef.current.clientWidth || 800;
        const baseFitScale = Math.min(2.5, Math.max(0.4, (containerWidth - 20) / unscaledViewport.width));
        const finalScale = baseFitScale * scale * effectiveZoomFactor;

        const viewport = page.getViewport({ scale: finalScale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { alpha: false });

        if (!context) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        setPageSize({ width: Math.floor(viewport.width), height: Math.floor(viewport.height) });

        context.scale(dpr, dpr);

        renderTask = page.render({
          canvasContext: context,
          viewport: viewport,
        });

        await renderTask.promise;
        if (isCancelled) return;

        // Render interactive text layer
        const textContent = await page.getTextContent();
        if (isCancelled) return;

        const items: TextSpanItem[] = [];
        for (let i = 0; i < textContent.items.length; i++) {
          const item: any = textContent.items[i];
          if (!item.str || !item.str.trim()) continue;

          // Transform PDF matrix coordinates to viewport pixels
          const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
          const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
          const left = tx[4];
          const top = tx[5] - fontHeight;
          const width = item.width * (viewport.scale / (viewport.scale / finalScale));
          const height = fontHeight;

          // Split line into words
          const rawWords = item.str.split(/(\s+)/);
          const wordObjects = rawWords.map((chunk: string) => {
            const clean = chunk.replace(PUNCTUATION_CLEAN_REGEX, '').toLowerCase();
            const matchingH = highlights.find(
              (h) =>
                h.documentId === documentId &&
                h.pageNumber === pageNumber &&
                h.text.replace(PUNCTUATION_CLEAN_REGEX, '').toLowerCase() === clean
            );

            return {
              word: chunk,
              cleanWord: clean,
              isHighlighted: !!matchingH,
              highlightId: matchingH?.id,
              isActive: !!(activeWord && clean && activeWord.toLowerCase() === clean),
            };
          });

          items.push({
            id: `text-${i}`,
            str: item.str,
            left: Math.max(0, left),
            top: Math.max(0, top),
            width: Math.max(10, item.width * finalScale),
            height: Math.max(12, height),
            fontSize: fontHeight,
            fontFamily: item.fontName || 'sans-serif',
            words: wordObjects,
          });
        }

        setTextItems(items);
        setIsLoading(false);
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Error rendering PDF page:', err);
          setRenderError(err?.message || 'Failed to render page');
        }
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        try {
          renderTask.cancel();
        } catch (_) {}
      }
    };
  }, [pdfDoc, pageNumber, scale, effectiveZoomFactor, highlights, activeWord, documentId]);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center select-text my-1"
      style={{ minHeight: pageSize.height || 400 }}
    >
      {/* PDF Canvas with authentic images, tables, exact original typography & vector designs */}
      <div
        className="relative shadow-md rounded-md overflow-hidden bg-white mx-auto transition-all"
        style={{
          width: pageSize.width ? `${pageSize.width}px` : '100%',
          height: pageSize.height ? `${pageSize.height}px` : 'auto',
        }}
      >
        <canvas ref={canvasRef} className="block mx-auto" />

        {/* Loading overlay for smooth rendering */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
            <div className="w-6 h-6 border-2 border-[#222222] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Interactive Text & Word Layer */}
        <div
          className="absolute inset-0 z-20 pointer-events-auto"
          onMouseUp={onTextSelection}
          onTouchEnd={onTextSelection}
        >
          {textItems.map((item) => (
            <div
              key={item.id}
              className="absolute flex items-center flex-wrap leading-none select-text"
              style={{
                left: `${item.left}px`,
                top: `${item.top}px`,
                minHeight: `${item.height}px`,
                fontSize: `${item.fontSize}px`,
              }}
            >
              {item.words.map((w, wIdx) => {
                const isSpace = /^\s+$/.test(w.word);
                if (isSpace) {
                  return <span key={wIdx} className="inline-block whitespace-pre select-text opacity-0">{w.word}</span>;
                }

                return (
                  <span
                    key={wIdx}
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = (e.target as HTMLElement).getBoundingClientRect();

                      if (activeTool === 'eraser') {
                        if (w.highlightId) {
                          onRemoveHighlight(w.highlightId);
                        }
                        return;
                      }

                      if (activeTool === 'highlight') {
                        if (w.isHighlighted && w.highlightId) {
                          onRemoveHighlight(w.highlightId);
                        } else {
                          onAddHighlight({
                            documentId,
                            pageNumber,
                            text: w.word,
                            color: selectedColor,
                          });
                        }
                        onWordClick(w.word, item.str, { x: rect.x, y: rect.y, width: rect.width, height: rect.height });
                      } else if (activeTool !== 'pen') {
                        onWordClick(w.word, item.str, { x: rect.x, y: rect.y, width: rect.width, height: rect.height });
                      }
                    }}
                    className={`inline-block cursor-pointer rounded-xs px-0.5 transition-colors text-transparent select-text ${
                      w.isActive
                        ? 'bg-[#AE5B34]/25 border-b-2 border-[#AE5B34]'
                        : w.isHighlighted
                        ? 'bg-[#B7E4C7]/80 dark:bg-emerald-900/80'
                        : 'hover:bg-[#FFEB83]/60 dark:hover:bg-amber-400/30'
                    }`}
                    title={
                      activeTool === 'eraser' && w.isHighlighted
                        ? 'Click to delete highlight'
                        : undefined
                    }
                  >
                    {w.word}
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sticky Notes anchored to page */}
        {notes
          .filter((n) => n.documentId === documentId && n.pageNumber === pageNumber)
          .map((note) => (
            <StickyNoteCard
              key={note.id}
              note={note}
              isEraserActive={activeTool === 'eraser'}
              onUpdate={(updated) =>
                onUpdateNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
              }
              onDelete={(id) => onUpdateNotes((prev) => prev.filter((n) => n.id !== id))}
            />
          ))}
      </div>

      {/* Freehand drawings eraser bar if annotations exist on this page */}
      {annotations.some((a) => a.documentId === documentId && a.pageNumber === pageNumber) && onClearPageAnnotations && (
        <div className="mt-2 flex justify-end w-full max-w-[800px]">
          <button
            onClick={() => onClearPageAnnotations(pageNumber)}
            className="p-1.5 px-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Page Drawings</span>
          </button>
        </div>
      )}
    </div>
  );
};
