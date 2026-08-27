// @ts-nocheck
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Globe, Sparkles } from "lucide-react";
import { SUPPORTED_LANGUAGES, detectDeviceLanguage } from "@/lib/i18n";
import { useLanguage } from "@/lib/language";

export function PlayerSettingsPage() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [detected, setDetected] = useState("en");

  useEffect(() => {
    setDetected(detectDeviceLanguage());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <header className="mb-10">
          <p className="eyebrow animate-fade-up text-primary-ink">{t("settings.eyebrow")}</p>
          <h1
            className="font-display animate-blur-in mt-2 text-4xl leading-[1.05] sm:text-5xl"
            style={{ animationDelay: "60ms" }}
          >
            {t("settings.title")}
          </h1>
          <p
            className="animate-fade-up mt-3 max-w-md text-sm leading-relaxed text-muted-foreground"
            style={{ animationDelay: "140ms" }}
          >
            {t("settings.subtitle")}
          </p>
        </header>

        <section className="animate-rise-in shadow-soft rounded-3xl border border-border/70 bg-card/75 p-5 backdrop-blur-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <Globe className="h-4 w-4 text-primary-ink" strokeWidth={1.5} />
            <h2 className="font-display text-xl leading-none">{t("settings.language")}</h2>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            {t("settings.languageHelp")}
          </p>

          <ul className="stagger-children grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {SUPPORTED_LANGUAGES.map((lang, i) => {
              const active = lang.code === language;
              return (
                <li key={lang.code} style={{ "--i": i } as React.CSSProperties}>
                  <button
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    aria-pressed={active}
                    className={`press transition-smooth flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-start ${
                      active
                        ? "border-primary/40 bg-primary/10"
                        : "border-border/70 bg-background hover:border-primary/25 hover:bg-muted/60"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-foreground">
                        {lang.nativeName}
                      </span>
                      <span className="eyebrow block truncate text-muted-foreground">
                        {lang.label}
                        {lang.code === detected ? ` · ${t("settings.autoDetected")}` : ""}
                      </span>
                    </span>
                    <Check
                      className={`h-4 w-4 shrink-0 text-primary-ink transition-all duration-300 ${
                        active ? "scale-100 opacity-100" : "scale-75 opacity-0"
                      }`}
                      strokeWidth={2}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section
          className="animate-rise-in shadow-soft mt-5 rounded-3xl border border-border/70 bg-card/75 p-5 backdrop-blur-sm sm:p-6"
          style={{ animationDelay: "120ms" }}
        >
          <div className="mb-3 flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-primary-ink" strokeWidth={1.5} />
            <h2 className="font-display text-xl leading-none">{t("settings.prefetch")}</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("settings.prefetchHelp")}
          </p>
        </section>
      </div>
    </div>
  );
}
