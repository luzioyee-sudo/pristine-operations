// @ts-nocheck
import { createServerFn } from "@tanstack/react-start";

export type TranslateInput = { words: string[]; target: string };

export const translateWords = createServerFn({ method: "POST" })
  .inputValidator((data: TranslateInput) => {
    if (!data || !Array.isArray(data.words) || typeof data.target !== "string") {
      throw new Error("Invalid translation request");
    }
    const words = data.words
      .filter((w) => typeof w === "string")
      .map((w) => w.trim().toLowerCase())
      .filter((w) => w.length > 0 && w.length <= 120)
      .slice(0, 120);
    return { words, target: data.target.slice(0, 5) };
  })
  .handler(async ({ data }): Promise<{ translations: Record<string, string> }> => {
    const { getCached, setCached, translateViaGateway } = await import("./translate.server");
    const target = data.target;
    const translations: Record<string, string> = {};
    const missing: string[] = [];

    if (target === "en") return { translations };

    for (const w of data.words) {
      const hit = getCached(target, w);
      if (hit) translations[w] = hit;
      else missing.push(w);
    }
    if (missing.length === 0) return { translations };

    try {
      const fresh = await translateViaGateway(missing, target);
      for (const [k, v] of Object.entries(fresh)) {
        setCached(target, k, v);
        translations[k] = v;
      }
    } catch {
      // Leave the missing words untranslated rather than failing the lookup.
    }
    return { translations };
  });
