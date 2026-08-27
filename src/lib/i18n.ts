// @ts-nocheck
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en.json";
import ar from "@/locales/ar.json";
import es from "@/locales/es.json";
import fr from "@/locales/fr.json";
import de from "@/locales/de.json";

// ---------------------------------------------------------------------------
// Adding a 6th language later:
//   1. Create src/locales/<code>.json (copy en.json and translate the values).
//   2. Import it above and add one entry to SUPPORTED_LANGUAGES below.
// No component changes are needed — every string already goes through t().
// ---------------------------------------------------------------------------

export type LanguageCode = "en" | "ar" | "es" | "fr" | "de";

export type LanguageMeta = {
  code: LanguageCode;
  label: string;
  nativeName: string;
  dir: "ltr" | "rtl";
};

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: "en", label: "English", nativeName: "English", dir: "ltr" },
  { code: "ar", label: "Arabic", nativeName: "العربية", dir: "rtl" },
  { code: "es", label: "Spanish", nativeName: "Español", dir: "ltr" },
  { code: "fr", label: "French", nativeName: "Français", dir: "ltr" },
  { code: "de", label: "German", nativeName: "Deutsch", dir: "ltr" },
];

export const DEFAULT_LANGUAGE: LanguageCode = "en";
export const LANGUAGE_STORAGE_KEY = "preferred_language";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
} as const;

export function isSupported(code: string | null | undefined): code is LanguageCode {
  return !!code && SUPPORTED_LANGUAGES.some((l) => l.code === code);
}

export function getDir(code: string): "ltr" | "rtl" {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.dir ?? "ltr";
}

export function getLanguageMeta(code: string): LanguageMeta {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) ?? SUPPORTED_LANGUAGES[0];
}

/** Language stored by the user, if any. */
export function getStoredLanguage(): LanguageCode | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isSupported(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function storeLanguage(code: LanguageCode | null): void {
  if (typeof window === "undefined") return;
  try {
    if (code) window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    else window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Browser/device language, falling back to English when unsupported. */
export function detectDeviceLanguage(): LanguageCode {
  if (typeof navigator === "undefined") return DEFAULT_LANGUAGE;
  const candidates = [...(navigator.languages ?? []), navigator.language];
  for (const c of candidates) {
    if (!c) continue;
    const base = c.toLowerCase().split("-")[0];
    if (isSupported(base)) return base;
  }
  return DEFAULT_LANGUAGE;
}

/** Stored preference wins, otherwise device detection, otherwise English. */
export function resolveInitialLanguage(): LanguageCode {
  return getStoredLanguage() ?? detectDeviceLanguage();
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    // SSR renders English; the client switches to the detected/stored language
    // on mount so markup stays hydration-stable.
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    // i18next handles locale fallback itself. Do not translate a missing key
    // from inside a missing-key handler: that recursively invokes the same
    // handler when the key is absent from English too.
    returnEmptyString: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export default i18n;

/** Cookie name used so SSR renders the same language the client will show. */
export const LANGUAGE_COOKIE = "preferred_language";

/** Mirror the preference into a cookie the server can read during SSR. */
export function storeLanguageCookie(code: LanguageCode): void {
  if (typeof document === "undefined") return;
  document.cookie = `${LANGUAGE_COOKIE}=${code};path=/;max-age=31536000;samesite=lax`;
}
