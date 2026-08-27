// @ts-nocheck
// Server-side memo of word translations so repeat lookups (and repeat viewers
// of the same video) never hit the AI gateway twice.
const store = new Map<string, string>();
const MAX = 20000;

export function getCached(lang: string, word: string): string | undefined {
  return store.get(`${lang}|${word}`);
}

export function setCached(lang: string, word: string, value: string): void {
  if (store.size >= MAX) {
    const first = store.keys().next().value;
    if (first) store.delete(first);
  }
  store.set(`${lang}|${word}`, value);
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  ar: "Arabic",
  es: "Spanish",
  fr: "French",
  de: "German",
};

export function languageName(code: string): string {
  return LANGUAGE_NAMES[code] ?? "English";
}

// Portable translation call: uses the project's own Gemini key (GEMINI_API_KEY /
// GOOGLE_API_KEY) so the app runs on any host without a Lovable-specific key.
export async function translateViaGateway(
  words: string[],
  target: string,
): Promise<Record<string, string>> {
  const apiKey =
    process.env["GEMINI_API_KEY"] ||
    process.env["GOOGLE_API_KEY"] ||
    process.env["GOOGLE_GENAI_API_KEY"];
  if (!apiKey) return {};
  const model = process.env["TRANSLATION_MODEL"] || "gemini-flash-latest";
  const prompt =
    `You translate single English words and short phrases into ${languageName(target)} for a language learner. ` +
    "Reply with ONLY a compact JSON object mapping every input term (exactly as given, lowercase) to its most common translation. " +
    "Keep each translation short (1-4 words). No explanations, no markdown fences.\n\n" +
    JSON.stringify(words);

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0, responseMimeType: "application/json" },
      }),
    },
  );
  if (!resp.ok) return {};
  const json = (await resp.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const content = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  const cleaned = content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) return {};
  try {
    const parsed = JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "string" && v.trim()) out[k.toLowerCase()] = v.trim();
    }
    return out;
  } catch {
    return {};
  }
}
