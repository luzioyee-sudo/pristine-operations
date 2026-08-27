// @ts-nocheck
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, isSupported, type LanguageCode } from "./i18n";

/**
 * Language for the very first render. Read from the cookie on the server so the
 * SSR markup matches what the client hydrates with (no hydration mismatch).
 */
export const getInitialLanguage = createServerFn({ method: "GET" }).handler(
  async (): Promise<LanguageCode> => {
    const headers = getRequest().headers;
    const cookie = headers.get("cookie") ?? "";
    const match = cookie.match(new RegExp(`(?:^|;\\s*)${LANGUAGE_COOKIE}=([^;]+)`));
    const saved = match?.[1];
    if (isSupported(saved)) return saved;

    // No saved preference yet: fall back to the browser's Accept-Language so the
    // very first SSR render already matches what the client would detect.
    for (const part of (headers.get("accept-language") ?? "").split(",")) {
      const base = part.trim().split(";")[0]?.toLowerCase().split("-")[0];
      if (isSupported(base)) return base;
    }
    return DEFAULT_LANGUAGE;
  },
);
