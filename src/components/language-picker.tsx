// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n";
import { useLanguage } from "@/lib/language";

/**
 * Compact pill for picking the translation language. Used in the watch page
 * toolbar next to the "Transcript" heading; writes through to the same
 * language store as Settings, so the choice is remembered app-wide.
 */
export function LanguagePicker({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = SUPPORTED_LANGUAGES.find((l) => l.code === language) ?? SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="press transition-smooth flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-2 text-sm font-medium text-primary-ink hover:border-primary/40 hover:bg-primary/15"
      >
        <Globe className="h-4 w-4 shrink-0" strokeWidth={1.5} />
        <span className="truncate">{active?.label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="animate-fade-up shadow-lift absolute end-0 z-30 mt-2 w-52 overflow-hidden rounded-2xl border border-border/70 bg-card p-1.5 backdrop-blur-sm"
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const selected = lang.code === language;
            return (
              <li key={lang.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    setLanguage(lang.code);
                    setOpen(false);
                  }}
                  className={`transition-smooth flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-start ${
                    selected ? "bg-primary/10 text-primary-ink" : "text-foreground hover:bg-muted/70"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm">{lang.nativeName}</span>
                    <span className="eyebrow block truncate text-muted-foreground">
                      {lang.label}
                    </span>
                  </span>
                  {selected && <Check className="h-4 w-4 shrink-0" strokeWidth={2} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
