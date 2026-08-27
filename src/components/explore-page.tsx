// @ts-nocheck
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { LanguageProvider } from "@/lib/language";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VideoCard } from "@/components/video-card";
import { exploreVideos } from "@/lib/default-videos";


function extractVideoId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1).split("/")[0] || null;
    }
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v) return v;
      const parts = url.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) => ["embed", "shorts", "live"].includes(p));
      if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
    }
  } catch {
    // not a URL
  }
  const match = trimmed.match(/[a-zA-Z0-9_-]{11}/);
  return match ? match[0] : null;
}

export function ExplorePage({ onOpenVideo }: { onOpenVideo: (id: string) => void }) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return exploreVideos;
    return exploreVideos.filter(
      (v) => v.title.toLowerCase().includes(q) || v.channel.toLowerCase().includes(q),
    );
  }, [query]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    const id = extractVideoId(trimmed);
    if (id) {
      setError(null);
      onOpenVideo(id);
      return;
    }
    if (trimmed.startsWith("http") || trimmed.length === 11) {
      setError(t("explore.invalidLink"));
      return;
    }
    // treat as keyword search across our list
    setError(null);
    setQuery(trimmed);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <header className="mb-8">
          <p className="eyebrow animate-fade-up text-primary-ink">{t("explore.eyebrow")}</p>
          <h1
            className="font-display animate-blur-in mt-2 text-4xl leading-[1.05] sm:text-5xl"
            style={{ animationDelay: "60ms" }}
          >
            {t("explore.title")}
          </h1>
          <p
            className="animate-fade-up mt-3 max-w-md text-sm leading-relaxed text-muted-foreground"
            style={{ animationDelay: "140ms" }}
          >
            {t("explore.subtitle")}
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="animate-fade-up flex flex-col gap-2 sm:flex-row"
          style={{ animationDelay: "200ms" }}
        >
          <div className="group relative flex-1">
            <Search
              className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-all duration-300 ease-out group-focus-within:scale-110 group-focus-within:text-primary-ink"
              strokeWidth={1.5}
            />
            <Input
              type="text"
              inputMode="search"
              placeholder={t("explore.placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="shadow-soft transition-smooth h-12 rounded-full border-border/70 bg-card ps-11 text-sm focus-visible:border-primary/50 focus-visible:shadow-lift"
              aria-label={t("explore.inputAria")}
            />
          </div>
          <Button
            type="submit"
            className="press shadow-soft transition-smooth h-12 rounded-full px-7 hover:-translate-y-0.5 hover:shadow-lift"
          >
            {t("common.open")}
          </Button>
        </form>
        {error && (
          <p className="animate-pop-in mt-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {query && (
          <p className="animate-fade-up mt-2 text-xs text-muted-foreground">
            {t("explore.resultsFor", { query })}{" "}
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setInput("");
              }}
              className="underline-offset-4 transition-colors duration-200 hover:text-primary-ink hover:underline"
            >
              {t("common.clear")}
            </button>
          </p>
        )}

        <section className="mt-10">
          {filtered.length === 0 ? (
            <p className="animate-pop-in text-sm text-muted-foreground">
              {t("explore.noResults")}
            </p>
          ) : (
            <ul
              key={query}
              className="stagger-children grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((v, i) => (
                <li key={v.id} style={{ "--i": Math.min(i, 14) } as React.CSSProperties}>
                  <VideoCard video={v} onOpen={onOpenVideo} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}