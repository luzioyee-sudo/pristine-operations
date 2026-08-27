// @ts-nocheck
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import i18n, {
  DEFAULT_LANGUAGE,
  getDir,
  resolveInitialLanguage,
  storeLanguage,
  storeLanguageCookie,
  type LanguageCode,
} from "./i18n";

type LanguageContextValue = {
  language: LanguageCode;
  dir: "ltr" | "rtl";
  setLanguage: (code: LanguageCode) => void;
};

const LanguageContext = createContext<LanguageContextValue>({
  language: DEFAULT_LANGUAGE,
  dir: "ltr",
  setLanguage: () => {},
});

export function LanguageProvider({
  children,
  initialLanguage = DEFAULT_LANGUAGE,
}: {
  children: ReactNode;
  /** Language resolved on the server from the cookie — keeps hydration stable. */
  initialLanguage?: LanguageCode;
}) {
  const [language, setLanguageState] = useState<LanguageCode>(initialLanguage);

  // First launch (no cookie yet): auto-detect the device language once mounted.
  useEffect(() => {
    const initial = resolveInitialLanguage();
    if (initial === language) return;
    setLanguageState(initial);
    storeLanguageCookie(initial);
    void i18n.changeLanguage(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep <html lang> and <html dir> in sync — Arabic mirrors the whole layout.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = language;
    document.documentElement.dir = getDir(language);
  }, [language]);

  const setLanguage = useCallback((code: LanguageCode) => {
    setLanguageState(code);
    storeLanguage(code);
    storeLanguageCookie(code);
    void i18n.changeLanguage(code);
  }, []);

  const value = useMemo(
    () => ({ language, dir: getDir(language), setLanguage }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/** Convenience: t() plus the active language / direction. */
export function useI18n() {
  const { t } = useTranslation();
  const lang = useLanguage();
  return { t, ...lang };
}
