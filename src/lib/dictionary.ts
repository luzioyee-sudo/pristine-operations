// @ts-nocheck
export type Pronunciation = {
  text?: string;
  audio?: string;
};

export type WordDefinition = {
  word: string;
  phonetic?: string;
  audio?: string;
  meanings: { partOfSpeech: string; definition: string; example?: string }[];
};

const cache = new Map<string, Promise<WordDefinition | null>>();

export function lookupWord(raw: string): Promise<WordDefinition | null> {
  const word = raw
    .toLowerCase()
    .replace(/[^a-z'\- ]/g, "")
    .replace(/^[-']+|[-']+$/g, "")
    .trim();
  if (!word) return Promise.resolve(null);
  const cached = cache.get(word);
  if (cached) return cached;
  const p = (async () => {
    try {
      const resp = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      );
      if (!resp.ok) return null;
      const json = (await resp.json()) as Array<{
        word: string;
        phonetic?: string;
        phonetics?: { text?: string; audio?: string }[];
        meanings?: {
          partOfSpeech: string;
          definitions: { definition: string; example?: string }[];
        }[];
      }>;
      if (!Array.isArray(json) || json.length === 0) return null;
      const entry = json[0];
      const phoneticObj = entry.phonetics?.find((p) => p.text || p.audio);
      const meanings: WordDefinition["meanings"] = [];
      for (const m of entry.meanings ?? []) {
        for (const d of m.definitions.slice(0, 2)) {
          meanings.push({ partOfSpeech: m.partOfSpeech, definition: d.definition, example: d.example });
        }
        if (meanings.length >= 3) break;
      }
      return {
        word: entry.word,
        phonetic: entry.phonetic ?? phoneticObj?.text,
        audio: entry.phonetics?.find((p) => p.audio)?.audio,
        meanings: meanings.slice(0, 3),
      };
    } catch {
      return null;
    }
  })();
  cache.set(word, p);
  return p;
}

export function speak(word: string, audioUrl?: string) {
  if (audioUrl) {
    try {
      const a = new Audio(audioUrl);
      a.play().catch(() => speakViaSynth(word));
      return;
    } catch {
      // fall through
    }
  }
  speakViaSynth(word);
}

function speakViaSynth(word: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(word);
  u.lang = "en-US";
  u.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}