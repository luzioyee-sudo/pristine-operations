// @ts-nocheck
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, NotebookPen } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { LanguageProvider } from "@/lib/language";
import { useLanguage } from "@/lib/language";
import { ensureTranslations, extractTerms } from "@/lib/word-translations";
import { fetchTranscript, type TranscriptSegment } from "@/lib/transcript.functions";
import { addToHistory } from "@/lib/history";
import { isImportant } from "@/lib/highlight";
import { WordText, DefinitionBody, requestPlayerPause, requestPlayerResume } from "@/components/word-popover";
import { lookupWord, type WordDefinition } from "@/lib/dictionary";
import { yourLessons, exploreVideos, recommendedVideos, type VideoItem } from "@/lib/default-videos";
import { LanguagePicker } from "@/components/language-picker";
import { NotesPanel } from "@/components/notes-panel";
import { NotesRail } from "@/components/learning-panels";

type YTPlayer = {
  destroy: () => void;
  seekTo: (s: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  getCurrentTime: () => number;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: { onReady?: () => void };
        },
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return ytApiPromise;
}


const KNOWN_VIDEOS: VideoItem[] = [...yourLessons, ...exploreVideos, ...recommendedVideos];

export function WatchPage({ videoId, onBack }: { videoId?: string; onBack: () => void }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [segments, setSegments] = useState<TranscriptSegment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const rafRef = useRef<number | null>(null);
  const [currentMs, setCurrentMs] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);

  const loadTranscript = useServerFn(fetchTranscript);

  // Save to history when a video is opened
  useEffect(() => {
    if (!videoId) return;
    const meta = KNOWN_VIDEOS.find((v) => v.id === videoId);
    addToHistory(meta ?? { id: videoId, title: "YouTube video", channel: "" });
  }, [videoId]);

  useEffect(() => {
    if (!videoId) {
      setSegments(null);
      setTranscriptError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setTranscriptError(null);
    setSegments(null);
    loadTranscript({ data: { videoId } })
      .then((res) => {
        if (cancelled) return;
        setSegments(res.segments);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : i18n.t("errors.transcript");
        setTranscriptError(msg);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [videoId, loadTranscript]);

  useEffect(() => {
    if (!videoId || !containerRef.current) return;
    let destroyed = false;
    let player: YTPlayer | null = null;

    loadYouTubeApi().then(() => {
      if (destroyed || !containerRef.current || !window.YT) return;
      const host = document.createElement("div");
      host.className = "h-full w-full";
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(host);
      player = new window.YT.Player(host, {
        videoId,
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: () => {
            playerRef.current = player;
            // Poll on a timer instead of every animation frame: 60fps state
            // updates re-rendered the whole transcript and froze the page.
            if (rafRef.current) window.clearInterval(rafRef.current);
            rafRef.current = window.setInterval(() => {
              if (!playerRef.current) return;
              try {
                setCurrentMs(playerRef.current.getCurrentTime() * 1000);
              } catch {
                // ignore
              }
            }, 200);
          },
        },
      });
    });

    return () => {
      destroyed = true;
      if (rafRef.current) window.clearInterval(rafRef.current);
      rafRef.current = null;
      try {
        player?.destroy();
      } catch {
        // ignore
      }
      playerRef.current = null;
      setCurrentMs(0);
    };
  }, [videoId]);

  const seekTo = useCallback((offsetMs: number) => {
    const seconds = Math.max(0, offsetMs / 1000);
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(seconds, true);
    p.playVideo();
  }, []);

  // Pause the player whenever any word/phrase popover opens.
  useEffect(() => {
    const onPause = () => {
      try {
        playerRef.current?.pauseVideo();
      } catch {
        // ignore
      }
    };
    const onResume = () => {
      try {
        playerRef.current?.playVideo();
      } catch {
        // ignore
      }
    };
    window.addEventListener("lesson:pause", onPause);
    window.addEventListener("lesson:resume", onResume);
    return () => {
      window.removeEventListener("lesson:pause", onPause);
      window.removeEventListener("lesson:resume", onResume);
    };
  }, []);

  // Auto-generated captions overlap heavily; clamp each line's duration to the
  // next line's start so word-level timing lines up with the audio.
  const lines = useMemo(() => {
    if (!segments) return null;
    return segments.map((s, i) => {
      const next = segments[i + 1];
      const dur = next ? Math.max(300, next.offset - s.offset) : Math.max(300, s.duration);
      return { ...s, duration: Math.min(s.duration || dur, dur) };
    });
  }, [segments]);

  const activeIndex = useMemo(() => {
    if (!lines || lines.length === 0) return -1;
    let lo = 0;
    let hi = lines.length - 1;
    let found = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (lines[mid].offset <= currentMs) {
        found = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    if (found < 0) return -1;
    const active = lines[found];
    return currentMs < active.offset + active.duration ? found : -1;
  }, [lines, currentMs]);

  const activeLineRef = useRef<HTMLLIElement | null>(null);

  const videoMeta = useMemo(() => {
    const known = KNOWN_VIDEOS.find((v) => v.id === videoId);
    return known ?? { id: videoId ?? "", title: t("watch.untitled"), channel: "" };
  }, [videoId, t]);

  const totalMs = useMemo(() => {
    if (!lines || lines.length === 0) return 0;
    const last = lines[lines.length - 1];
    return last ? last.offset + last.duration : 0;
  }, [lines]);

  useEffect(() => {
    if (activeIndex < 0) return;
    activeLineRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeIndex]);

  // "Auto guessing": pre-translate the words around the playhead so tapping a
  // word shows its meaning instantly instead of waiting on a network call.
  const prefetchChunk = Math.max(0, Math.floor(Math.max(activeIndex, 0) / 8));
  useEffect(() => {
    if (!lines || lines.length === 0 || language === "en") return;
    const start = prefetchChunk * 8;
    const slice = lines.slice(start, start + 40).map((l) => l.text);
    if (slice.length === 0) return;
    void ensureTranslations(extractTerms(slice), language);
  }, [lines, prefetchChunk, language]);

  if (!videoId) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">{t("watch.noVideo")}</p>
          <button type="button" onClick={onBack} className="mt-4 inline-block text-sm text-primary-ink underline-offset-4 hover:underline">
            {t("watch.findVideo")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="flex w-full flex-col px-4 py-3 lg:h-[calc(100vh-6rem)] lg:px-5 lg:py-4">
        <button
          type="button"
          onClick={onBack}
          className="eyebrow group animate-fade-up mb-3 inline-flex w-fit shrink-0 items-center gap-2 text-muted-foreground transition-colors duration-300 hover:text-primary-ink"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1"
            strokeWidth={1.5}
          />{" "}
          {t("common.back")}
        </button>

        {/* Full-viewport three-column workspace: transcript / video + learning / notes.
            Columns keep their own width and scroll independently, so opening the
            notes panel never resizes the transcript or the player. */}
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(320px,0.9fr)_minmax(560px,1.7fr)_minmax(320px,0.9fr)] xl:gap-5">
          {/* Transcript — left column on desktop */}
          <section
            className="animate-rise-in order-2 flex min-h-0 flex-col lg:order-1"
            style={{ animationDelay: "120ms" }}
          >
            <div className="mb-3 grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="flex min-w-0 items-baseline gap-3">
                <h2 className="font-display text-2xl leading-none">{t("watch.transcript")}</h2>
                {segments && (
                  <span className="eyebrow truncate text-muted-foreground">
                    {t("watch.lineCount", { count: segments.length })}
                  </span>
                )}
              </div>
              <LanguagePicker />
            </div>
            <div className="shadow-soft transition-smooth relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/75 p-3 backdrop-blur-sm hover:border-primary/25 supports-[backdrop-filter]:bg-card/60">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-linear-to-b from-card to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-linear-to-t from-card to-transparent" />
              {loading && (
                <div className="space-y-3 p-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-fade-up flex gap-3"
                      style={{ animationDelay: `${i * 70}ms` }}
                    >
                      <div className="skeleton-shimmer h-3 w-8 shrink-0 rounded bg-muted" />
                      <div className="skeleton-shimmer h-3 flex-1 rounded bg-muted" />
                    </div>
                  ))}
                </div>
              )}
              {!loading && transcriptError && (
                <p className="p-2 text-sm text-destructive">
                  {transcriptError.includes("disabled") || transcriptError.includes("Transcript")
                    ? t("errors.transcript")
                    : transcriptError}
                </p>
              )}
              {!loading && lines && lines.length > 0 && (
                <ol
                  dir="ltr"
                  className="max-h-[52vh] min-h-0 flex-1 select-text space-y-1 overflow-y-auto pr-1 text-left text-sm leading-relaxed lg:max-h-none"
                >
                  {lines.map((seg, i) => (
                    <Line
                      key={i}
                      seg={seg}
                      lineRef={i === activeIndex ? activeLineRef : undefined}
                      isActive={i === activeIndex}
                      isPast={i < activeIndex}
                      currentMs={i === activeIndex ? currentMs : 0}
                      onSeek={seekTo}
                    />
                  ))}
                </ol>
              )}
              {!loading && lines && lines.length === 0 && (
                <p className="p-2 text-sm text-muted-foreground">{t("watch.noLines")}</p>
              )}
            </div>
          </section>

          {/* Player + learning workspace — center column, independently scrollable */}
          <section className="order-1 flex min-h-0 flex-col gap-4 overflow-y-auto pr-1 lg:order-2">
            <div className="animate-rise-in shadow-lift shrink-0 overflow-hidden rounded-3xl border border-border/70 bg-secondary">
              <div className="aspect-video w-full">
                <div ref={containerRef} className="h-full w-full" />
              </div>
            </div>
            {!notesOpen && (
              <button
                type="button"
                onClick={() => setNotesOpen(true)}
                className="press transition-smooth inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-card/75 px-3.5 py-2 text-sm text-foreground hover:border-primary/30 hover:text-primary-ink lg:hidden"
              >
                <NotebookPen className="h-4 w-4" strokeWidth={1.5} />
                {t("watch.showNotes")}
              </button>
            )}
          </section>

          {/* Notes — right column. The column always exists so opening notes
              never reflows the transcript or the player. */}
          <section className="order-3 hidden min-h-0 lg:flex lg:flex-col">
            {notesOpen ? (
              <NotesPanel videoId={videoId} onClose={() => setNotesOpen(false)} />
            ) : (
              <NotesRail videoId={videoId} onOpen={() => setNotesOpen(true)} />
            )}
          </section>
          {notesOpen && (
            <section className="order-4 lg:hidden">
              <NotesPanel videoId={videoId} onClose={() => setNotesOpen(false)} />
            </section>
          )}
        </div>

        <SelectionLookup />
      </div>
    </div>
  );
}

function formatTime(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(h > 0 ? 2 : 1, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

const Line = memo(function Line({
  seg,
  lineRef,
  isActive,
  isPast,
  currentMs,
  onSeek,
}: {
  seg: TranscriptSegment;
  lineRef?: React.RefObject<HTMLLIElement | null>;
  isActive: boolean;
  isPast: boolean;
  currentMs: number;
  onSeek: (ms: number) => void;
}) {
  const { t } = useTranslation();
  return (
    <li
      ref={lineRef}
      className={`group relative flex gap-3 rounded-xl px-2.5 py-1.5 transition-[background-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isActive
          ? "scale-[1.01] bg-primary/10 ring-1 ring-primary/20"
          : "scale-100 hover:bg-muted/60"
      }`}
    >
      <span
        className={`absolute start-0 top-1/2 w-[3px] -translate-y-1/2 rounded-full bg-primary transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isActive ? "h-5 opacity-100" : "h-0 opacity-0"
        }`}
      />
      <button
        type="button"
        onClick={() => onSeek(seg.offset)}
        className="press shrink-0 pt-px font-mono text-[11px] tabular-nums text-muted-foreground transition-colors duration-200 hover:text-primary-ink"
        aria-label={t("watch.jumpTo", { time: formatTime(seg.offset) })}
      >
        {formatTime(seg.offset)}
      </button>
      {isActive ? (
        <ActiveLine seg={seg} currentMs={currentMs} />
      ) : (
        <span className={isPast ? "text-muted-foreground/70" : "text-foreground/90"}>
          <WordText text={seg.text} importantSet={isImportant} />
        </span>
      )}
    </li>
  );
});

function ActiveLine({ seg, currentMs }: { seg: TranscriptSegment; currentMs: number }) {
  const words = useMemo(() => seg.text.split(/(\s+)/), [seg.text]);
  const wordTokens = words.filter((w) => w.trim().length > 0);
  const elapsed = Math.max(0, currentMs - seg.offset);
  const duration = Math.max(1, seg.duration);
  const progress = Math.min(1, elapsed / duration);
  const activeWordIdx = Math.min(wordTokens.length - 1, Math.floor(progress * wordTokens.length));

  let wordCounter = -1;
  return (
    <span className="text-foreground">
      {words.map((w, i) => {
        if (w.trim().length === 0) return <span key={i}>{w}</span>;
        wordCounter += 1;
        const idx = wordCounter;
        const isActive = idx === activeWordIdx;
        const isPast = idx < activeWordIdx;
        const cleaned = w.replace(/[^A-Za-z'-]/g, "");
        const important = isImportant(cleaned) && !isActive;
        return (
          <span
            key={i}
            data-word={cleaned || undefined}
            className={`inline-block cursor-pointer rounded px-0.5 transition-[background-color,color,transform] duration-200 ease-out ${
              isActive
                ? "-translate-y-px scale-[1.06] bg-primary text-primary-foreground shadow-sm"
                : isPast
                  ? "text-foreground"
                  : "text-muted-foreground"
            } ${important ? "bg-primary/15 text-foreground decoration-primary/40 underline decoration-1 underline-offset-4" : ""}`}
          >
            {w}
          </span>
        );
      })}
    </span>
  );
}

function SelectionLookup() {
  const [state, setState] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [def, setDef] = useState<WordDefinition | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Single word click → look it up and pause the player.
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const wordEl = target?.closest?.("[data-word]") as HTMLElement | null;
      if (!wordEl) return;
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) return;
      const word = wordEl.dataset.word;
      if (!word) return;
      const rect = wordEl.getBoundingClientRect();
      setState({ text: word, x: rect.left + rect.width / 2, y: rect.bottom });
      requestPlayerPause();
    };
    const onUp = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        return;
      }
      const text = sel.toString().trim();
      if (!text || text.length > 120) {
        setState(null);
        return;
      }
      // Only react to selections inside the transcript list
      const anchor = sel.anchorNode as Node | null;
      const el = anchor instanceof Element ? anchor : anchor?.parentElement;
      if (!el || !el.closest("ol")) {
        setState(null);
        return;
      }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      setState({
        text,
        x: rect.left + rect.width / 2,
        y: rect.bottom,
      });
      requestPlayerPause();
    };
    document.addEventListener("click", onClick);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchend", onUp);
    };
  }, []);

  useEffect(() => {
    if (!state) {
      setDef(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setDef(null);
    lookupWord(state.text).then((d) => {
      if (cancelled) return;
      setDef(d);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [state]);

  useEffect(() => {
    if (!state) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-selection-lookup]") && !t.closest("[data-word]")) {
        setState(null);
        window.getSelection()?.removeAllRanges();
        requestPlayerResume();
      }
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [state]);

  if (!state) return null;
  const width = 240;
  const left = Math.max(8, Math.min(window.innerWidth - width - 8, state.x - width / 2));
  return (
    <div
      data-selection-lookup
      className="animate-pop-in shadow-lift fixed z-50 rounded-2xl border border-border/70 bg-popover p-3 text-popover-foreground backdrop-blur-sm"
      style={{ top: state.y + 8, left, width }}
    >
      <DefinitionBody query={state.text} loading={loading} def={def} />
    </div>
  );
}