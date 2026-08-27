// @ts-nocheck
import { useEffect, useState } from "react";
import { Volume2, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { lookupWord, speak, type WordDefinition } from "@/lib/dictionary";
import { useLanguage } from "@/lib/language";
import { useWordTranslation } from "@/lib/word-translations";
import { cn } from "@/lib/utils";

export function requestPlayerPause() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("lesson:pause"));
}

export function requestPlayerResume() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("lesson:resume"));
}

function DefinitionBody({
  query,
  loading,
  def,
}: {
  query: string;
  loading: boolean;
  def: WordDefinition | null;
}) {
  const { t } = useTranslation();
  const { language, dir } = useLanguage();
  const translation = useWordTranslation(query, language);
  const isPhrase = query.trim().includes(" ");
  return (
    <div className="text-left">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="truncate text-sm font-semibold">{def?.word ?? query}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            speak(def?.word ?? query, def?.audio);
          }}
          className="shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={t("dictionary.playPronunciation")}
        >
          <Volume2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {def?.phonetic && (
        <div className="text-[11px] text-muted-foreground">{def.phonetic}</div>
      )}
      {language !== "en" && (
        <div className="mt-2 rounded-lg bg-primary/10 px-2 py-1.5" dir={dir}>
          <div className="eyebrow text-[9px] text-primary-ink">{t("dictionary.translation")}</div>
          <div className="text-[13px] leading-snug text-foreground">
            {translation.text ??
              (translation.loading
                ? t("dictionary.translating")
                : t("dictionary.noTranslation"))}
          </div>
        </div>
      )}
      <div className="mt-1.5 space-y-1 text-[11px] leading-snug">
        {loading && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" /> {t("dictionary.lookingUp")}
          </div>
        )}
        {!loading && !def && (
          <div className="text-muted-foreground">
            {isPhrase ? t("dictionary.phraseHint") : t("dictionary.noDefinition")}
          </div>
        )}
        {!loading && def?.meanings.slice(0, 2).map((m, i) => (
          <div key={i}>
            <span className="italic text-muted-foreground">{m.partOfSpeech}</span> {m.definition}
          </div>
        ))}
      </div>
    </div>
  );
}

type Props = {
  word: string;
  important?: boolean;
  className?: string;
};

export function ClickableWord({ word, important, className }: Props) {
  const [open, setOpen] = useState(false);
  const [def, setDef] = useState<WordDefinition | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setDef(null);
    lookupWord(word).then((d) => {
      if (cancelled) return;
      setDef(d);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [open, word]);

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) requestPlayerPause();
        else requestPlayerResume();
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseDown={(e) => {
            // Don't hijack text selections that span multiple words
            const sel = typeof window !== "undefined" ? window.getSelection() : null;
            if (sel && !sel.isCollapsed) e.preventDefault();
          }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "cursor-pointer rounded px-0.5 transition-colors hover:bg-primary/15",
            important && "bg-primary/15 text-foreground decoration-primary/40 underline decoration-1 underline-offset-4",
            open && "bg-primary/20",
            className,
          )}
        >
          {word}
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="center"
        sideOffset={6}
        collisionPadding={12}
        className="w-56 p-2.5"
      >
        <DefinitionBody query={word} loading={loading} def={def} />
      </PopoverContent>
    </Popover>
  );
}

export { DefinitionBody };

// Lightweight, render-cheap transcript text. Words are plain spans tagged with
// data-word; a single shared popover (mounted once per page) handles lookups.
// This avoids mounting one Radix Popover per word, which made long transcripts
// unusable.
export function WordText({
  text,
  importantSet,
}: {
  text: string;
  importantSet?: (w: string) => boolean;
}) {
  const tokens = text.split(/(\s+)/);
  return (
    <>
      {tokens.map((tok, i) => {
        if (!tok.trim()) return <span key={i}>{tok}</span>;
        const cleaned = tok.replace(/[^A-Za-z'-]/g, "");
        if (!cleaned) return <span key={i}>{tok}</span>;
        const important = importantSet ? importantSet(cleaned) : false;
        return (
          <span
            key={i}
            data-word={cleaned}
            className={cn(
              "cursor-pointer rounded px-0.5 transition-colors hover:bg-primary/15",
              important && "bg-primary/15 text-foreground decoration-primary/40 underline decoration-1 underline-offset-4",
            )}
          >
            {tok}
          </span>
        );
      })}
    </>
  );
}

// Renders text with each word as a ClickableWord. Whitespace preserved.
export function ClickableText({
  text,
  importantSet,
  wordClassName,
}: {
  text: string;
  importantSet?: (w: string) => boolean;
  wordClassName?: (i: number) => string | undefined;
}) {
  const tokens = text.split(/(\s+)/);
  let wordIdx = -1;
  return (
    <>
      {tokens.map((tok, i) => {
        if (!tok.trim()) return <span key={i}>{tok}</span>;
        wordIdx += 1;
        const cleaned = tok.replace(/[^A-Za-z'-]/g, "");
        if (!cleaned) return <span key={i}>{tok}</span>;
        const important = importantSet ? importantSet(cleaned) : false;
        return (
          <ClickableWord
            key={i}
            word={tok}
            important={important}
            className={wordClassName?.(wordIdx)}
          />
        );
      })}
    </>
  );
}