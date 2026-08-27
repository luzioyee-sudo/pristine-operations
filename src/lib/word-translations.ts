// @ts-nocheck
import { useEffect, useSyncExternalStore } from "react";
import { translateWords } from "./translate.functions";

// Client-side translation memory. Words are pre-translated ahead of playback
// ("auto guessing") so tapping a word in the transcript feels instant.
const cache = new Map<string, string>();
const misses = new Set<string>();
const inflight = new Set<string>();
const listeners = new Set<() => void>();
let version = 0;

function key(lang: string, word: string) {
  return `${lang}|${word}`;
}

function emit() {
  version += 1;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function normalizeTerm(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z'\- ]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[-'\s]+|[-'\s]+$/g, "")
    .trim();
}

export function getTranslation(word: string, lang: string): string | undefined {
  return cache.get(key(lang, normalizeTerm(word)));
}

export function isTranslationPending(word: string, lang: string): boolean {
  return inflight.has(key(lang, normalizeTerm(word)));
}

export function isTranslationMissing(word: string, lang: string): boolean {
  return misses.has(key(lang, normalizeTerm(word)));
}

const MAX_BATCH = 80;

/** Fetch translations for any of these terms we don't already know. */
export async function ensureTranslations(terms: string[], lang: string): Promise<void> {
  if (lang === "en") return;
  const wanted: string[] = [];
  const seen = new Set<string>();
  for (const raw of terms) {
    const term = normalizeTerm(raw);
    if (!term || seen.has(term)) continue;
    seen.add(term);
    const k = key(lang, term);
    if (cache.has(k) || misses.has(k) || inflight.has(k)) continue;
    wanted.push(term);
  }
  if (wanted.length === 0) return;

  wanted.forEach((t) => inflight.add(key(lang, t)));
  emit();

  for (let i = 0; i < wanted.length; i += MAX_BATCH) {
    const chunk = wanted.slice(i, i + MAX_BATCH);
    try {
      const res = await translateWords({ data: { words: chunk, target: lang } });
      for (const term of chunk) {
        const value = res.translations[term];
        const k = key(lang, term);
        if (value) cache.set(k, value);
        else misses.add(k);
        inflight.delete(k);
      }
    } catch {
      chunk.forEach((t) => {
        const k = key(lang, t);
        inflight.delete(k);
        misses.add(k);
      });
    }
    emit();
  }
}

/** Pull every distinct word out of transcript lines, for pre-translation. */
export function extractTerms(texts: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const text of texts) {
    for (const tok of text.split(/\s+/)) {
      const term = normalizeTerm(tok);
      if (!term || term.length < 2 || seen.has(term)) continue;
      seen.add(term);
      out.push(term);
    }
  }
  return out;
}

function getSnapshot() {
  return version;
}

/** Translation of a single word/phrase, requesting it on demand if unknown. */
export function useWordTranslation(term: string, lang: string) {
  useSyncExternalStore(subscribe, getSnapshot, () => 0);

  useEffect(() => {
    if (!term || lang === "en") return;
    void ensureTranslations([term], lang);
  }, [term, lang]);

  if (lang === "en") return { text: undefined, loading: false, missing: false };
  return {
    text: getTranslation(term, lang),
    loading: isTranslationPending(term, lang),
    missing: isTranslationMissing(term, lang),
  };
}
