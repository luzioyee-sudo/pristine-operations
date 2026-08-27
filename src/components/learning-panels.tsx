// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BookMarked, Clock, ListTree, NotebookPen, Sparkles } from "lucide-react";
import type { TranscriptSegment } from "@/lib/transcript.functions";
import { isImportant } from "@/lib/highlight";
import { useLanguage } from "@/lib/language";
import { getTranslation } from "@/lib/word-translations";
import { readNote } from "@/components/notes-panel";

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(h > 0 ? 2 : 1, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function Panel({
  icon,
  title,
  meta,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="shadow-soft transition-smooth rounded-3xl border border-border/70 bg-card/75 p-4 backdrop-blur-sm hover:border-primary/25 supports-[backdrop-filter]:bg-card/60">
      <header className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-primary-ink">{icon}</span>
          <h3 className="font-display truncate text-lg leading-none">{title}</h3>
        </div>
        {meta ? <span className="eyebrow shrink-0 text-muted-foreground">{meta}</span> : null}
      </header>
      {children}
    </section>
  );
}

/** Title, channel and playback / reading progress for the current video. */
export function VideoInfoPanel({
  title,
  channel,
  currentMs,
  totalMs,
  lineIndex,
  lineCount,
}: {
  title: string;
  channel: string;
  currentMs: number;
  totalMs: number;
  lineIndex: number;
  lineCount: number;
}) {
  const { t } = useTranslation();
  const pct = totalMs > 0 ? Math.min(100, Math.round((currentMs / totalMs) * 100)) : 0;

  return (
    <Panel
      icon={<Sparkles className="h-4 w-4" strokeWidth={1.5} />}
      title={t("watch.nowLearning")}
      meta={channel || undefined}
    >
      <p className="font-display text-xl leading-snug text-foreground">{title}</p>
      <div className="mt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span className="eyebrow text-muted-foreground">
            {formatClock(currentMs)} {totalMs > 0 ? `/ ${formatClock(totalMs)}` : ""}
          </span>
          <span className="eyebrow text-primary-ink">{t("watch.progressPct", { pct })}</span>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label={t("watch.statLines")} value={String(lineCount)} />
        <Stat
          label={t("watch.statLineRead")}
          value={`${Math.max(0, lineIndex + 1)}/${Math.max(lineCount, 1)}`}
        />
        <Stat label={t("watch.statRemaining")} value={formatClock(Math.max(0, totalMs - currentMs))} />
      </dl>
    </Panel>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 px-3 py-2">
      <dt className="eyebrow text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono text-sm tabular-nums text-foreground">{value}</dd>
    </div>
  );
}

/** Evenly spaced chapters derived from the transcript, clickable to seek. */
export function ChaptersPanel({
  lines,
  currentMs,
  onSeek,
}: {
  lines: TranscriptSegment[];
  currentMs: number;
  onSeek: (ms: number) => void;
}) {
  const { t } = useTranslation();
  const chapters = useMemo(() => {
    if (lines.length === 0) return [];
    const count = Math.min(8, Math.max(3, Math.round(lines.length / 12)));
    const size = Math.ceil(lines.length / count);
    const out: { offset: number; endMs: number; label: string }[] = [];
    for (let i = 0; i < lines.length; i += size) {
      const chunk = lines.slice(i, i + size);
      const first = chunk[0];
      const last = chunk[chunk.length - 1];
      if (!first || !last) continue;
      const label = chunk
        .map((c) => c.text)
        .join(" ")
        .replace(/\[[^\]]*\]/g, "")
        .trim()
        .split(/\s+/)
        .slice(0, 9)
        .join(" ");
      out.push({ offset: first.offset, endMs: last.offset + last.duration, label: label || "…" });
    }
    return out;
  }, [lines]);

  if (chapters.length === 0) return null;

  return (
    <Panel
      icon={<ListTree className="h-4 w-4" strokeWidth={1.5} />}
      title={t("watch.chapters")}
      meta={t("watch.chapterCount", { count: chapters.length })}
    >
      <ul className="space-y-1.5">
        {chapters.map((c, i) => {
          const active = currentMs >= c.offset && currentMs < c.endMs;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => onSeek(c.offset)}
                className={`press transition-smooth flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left ${
                  active ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-muted/60"
                }`}
              >
                <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                  {formatClock(c.offset)}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-foreground/90">{c.label}</span>
                <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

/** Key expressions found in the transcript, with translation when available. */
export function VocabularyPanel({
  lines,
  onSeek,
}: {
  lines: TranscriptSegment[];
  onSeek: (ms: number) => void;
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const terms = useMemo(() => {
    const seen = new Map<string, number>();
    for (const line of lines) {
      for (const raw of line.text.split(/[^A-Za-z'-]+/)) {
        const word = raw.trim();
        if (word.length < 4) continue;
        const lower = word.toLowerCase();
        if (seen.has(lower)) continue;
        if (!isImportant(lower)) continue;
        seen.set(lower, line.offset);
        if (seen.size >= 28) break;
      }
      if (seen.size >= 28) break;
    }
    return [...seen.entries()];
  }, [lines]);

  return (
    <Panel
      icon={<BookMarked className="h-4 w-4 text-accent-ink" strokeWidth={1.5} />}
      title={t("watch.vocabulary")}
      meta={t("watch.wordCount", { count: terms.length })}
    >
      {terms.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("watch.noVocabulary")}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {terms.map(([word, offset]) => {
            const translated = language === "en" ? undefined : getTranslation(word, language);
            return (
              <li key={word}>
                <button
                  type="button"
                  onClick={() => onSeek(offset)}
                  className="press transition-smooth inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-3 py-1.5 text-sm text-foreground hover:border-accent hover:bg-accent/30"
                >
                  <span>{word}</span>
                  {translated ? (
                    <span className="text-xs text-muted-foreground">{translated}</span>
                  ) : null}
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                    {formatClock(offset)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

/** Right column placeholder shown when the notes panel is closed. */
export function NotesRail({ videoId, onOpen }: { videoId: string; onOpen: () => void }) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState("");
  // Client-only read: localStorage is not available during SSR.
  useEffect(() => setPreview(readNote(videoId)), [videoId]);

  return (
    <div className="shadow-soft flex h-full flex-col rounded-3xl border border-dashed border-border/70 bg-card/50 p-4">
      <div className="flex min-w-0 items-center gap-2">
        <NotebookPen className="h-4 w-4 shrink-0 text-primary-ink" strokeWidth={1.5} />
        <h3 className="font-display truncate text-lg leading-none">{t("watch.notes")}</h3>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{t("watch.notesIdle")}</p>
      {preview ? (
        <p className="mt-3 line-clamp-[12] whitespace-pre-wrap rounded-2xl border border-border/60 bg-background/60 p-3 text-sm text-foreground/80">
          {preview}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onOpen}
        className="press transition-smooth mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-card/75 px-3.5 py-2 text-sm text-foreground hover:border-primary/30 hover:text-primary-ink"
      >
        <NotebookPen className="h-4 w-4" strokeWidth={1.5} />
        {t("watch.showNotes")}
      </button>
    </div>
  );
}
