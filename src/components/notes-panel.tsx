// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, NotebookPen, Trash2, X } from "lucide-react";

const STORAGE_PREFIX = "lesson_notes:";

function storageKey(videoId: string) {
  return `${STORAGE_PREFIX}${videoId}`;
}

export function readNote(videoId: string): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(storageKey(videoId)) ?? "";
  } catch {
    return "";
  }
}

/**
 * Side panel for taking notes while watching. Notes are kept per video in
 * localStorage and saved automatically (debounced) as the user types.
 */
export function NotesPanel({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Load on mount / when the video changes (client-only, avoids hydration mismatch).
  useEffect(() => {
    setValue(readNote(videoId));
    setSaved(false);
  }, [videoId]);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const persist = (next: string) => {
    setValue(next);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      try {
        if (next.trim()) window.localStorage.setItem(storageKey(videoId), next);
        else window.localStorage.removeItem(storageKey(videoId));
        setSaved(true);
        window.setTimeout(() => setSaved(false), 1600);
      } catch {
        // ignore
      }
    }, 400);
  };

  return (
    <aside className="animate-rise-in shadow-soft flex h-full min-h-[18rem] min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/75 p-4 backdrop-blur-sm supports-[backdrop-filter]:bg-card/60">
      <div className="mb-3 grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <NotebookPen className="h-4 w-4 shrink-0 text-primary-ink" strokeWidth={1.5} />
          <h2 className="font-display truncate text-xl leading-none">{t("watch.notes")}</h2>
        </div>
        <div className="flex items-center gap-1">
          <span
            className={`eyebrow flex items-center gap-1 text-primary-ink transition-opacity duration-300 ${
              saved ? "opacity-100" : "opacity-0"
            }`}
          >
            <Check className="h-3 w-3" strokeWidth={2} />
            {t("watch.notesSaved")}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("watch.hideNotes")}
            className="press transition-smooth rounded-full p-1.5 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => persist(e.target.value)}
        placeholder={t("watch.notesPlaceholder")}
        className="min-h-[16rem] min-h-0 flex-1 resize-none overflow-y-auto rounded-2xl border border-border/70 bg-background/70 p-3 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 lg:min-h-0"
      />

      <div className="mt-3 grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <span className="eyebrow truncate text-muted-foreground">
          {t("watch.notesCount", { count: value.trim() ? value.trim().split(/\s+/).length : 0 })}
        </span>
        <button
          type="button"
          onClick={() => persist("")}
          disabled={!value}
          className="press transition-smooth inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted/70 hover:text-destructive disabled:pointer-events-none disabled:opacity-40"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          {t("watch.notesClear")}
        </button>
      </div>
    </aside>
  );
}
