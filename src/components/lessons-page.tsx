// @ts-nocheck
import { useEffect, useState } from "react";
import { BookOpen, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { VideoCard } from "@/components/video-card";
import { getHistory, clearHistory, type HistoryItem } from "@/lib/history";

export function LessonsPage({
  onOpenVideo,
  onGoExplore,
}: {
  onOpenVideo: (id: string) => void;
  onGoExplore: () => void;
}) {
  const { t } = useTranslation();
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(getHistory());
    sync();
    window.addEventListener("history-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("history-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <header className="mb-10 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <p className="eyebrow animate-fade-up text-primary-ink">{t("lessons.eyebrow")}</p>
            <h1
              className="font-display animate-blur-in mt-2 text-4xl leading-[1.05] sm:text-5xl"
              style={{ animationDelay: "60ms" }}
            >
              {t("lessons.title")}
            </h1>
            <p
              className="animate-fade-up mt-3 max-w-md text-sm leading-relaxed text-muted-foreground"
              style={{ animationDelay: "140ms" }}
            >
              {t("lessons.subtitle")}
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="press animate-fade-up transition-snappy shrink-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
              onClick={() => clearHistory()}
              aria-label={t("lessons.clearAria")}
            >
              <Trash2 className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12" />
              {t("common.clear")}
            </Button>
          )}
        </header>

        {items.length === 0 ? (
          <div className="animate-rise-in rounded-3xl border border-dashed border-border bg-card/50 p-14 text-center">
            <BookOpen
              className="animate-breathe mx-auto h-7 w-7 text-primary-ink"
              strokeWidth={1.25}
            />
            <h2 className="font-display mt-4 text-2xl">{t("lessons.emptyTitle")}</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("lessons.emptyBody")}
            </p>
            <button
              type="button"
              onClick={onGoExplore}
              className="press shadow-soft transition-smooth mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm text-primary-foreground hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lift"
            >
              {t("lessons.goExplore")}
            </button>
          </div>
        ) : (
          <ul className="stagger-children grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((v, i) => (
              <li key={v.id} style={{ "--i": Math.min(i, 14) } as React.CSSProperties}>
                <VideoCard video={v} onOpen={onOpenVideo} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
