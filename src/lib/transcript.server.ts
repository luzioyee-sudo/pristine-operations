// @ts-nocheck
import type { TranscriptSegment } from "./transcript.functions";

// Simple in-memory cache so repeat views of the same video are instant.
const store = new Map<string, TranscriptSegment[]>();
const MAX = 100;

export const transcriptCache = {
  get(id: string) {
    return store.get(id);
  },
  set(id: string, segments: TranscriptSegment[]) {
    if (store.size >= MAX) {
      const first = store.keys().next().value;
      if (first) store.delete(first);
    }
    store.set(id, segments);
  },
};

/* ------------------------------------------------------------------ */
/* Transcript extraction                                               */
/* ------------------------------------------------------------------ */

const INNERTUBE_URL = "https://www.youtube.com/youtubei/v1/player?prettyPrint=false";

// Several client identities are tried in order. Datacenter IPs (Vercel,
// Cloudflare, etc.) get refused by some of them, so we keep going until one
// returns caption tracks instead of failing on the first refusal.
const CLIENTS: Array<{ name: string; context: any; ua: string }> = [
  {
    name: "ANDROID",
    context: {
      client: {
        clientName: "ANDROID",
        clientVersion: "20.10.38",
        androidSdkVersion: 34,
        hl: "en",
        gl: "US",
      },
    },
    ua: "com.google.android.youtube/20.10.38 (Linux; U; Android 14) gzip",
  },
  {
    name: "IOS",
    context: {
      client: {
        clientName: "IOS",
        clientVersion: "20.10.4",
        deviceModel: "iPhone16,2",
        hl: "en",
        gl: "US",
      },
    },
    ua: "com.google.ios.youtube/20.10.4 (iPhone16,2; U; CPU iOS 18_0 like Mac OS X)",
  },
  {
    name: "TVHTML5",
    context: {
      client: {
        clientName: "TVHTML5_SIMPLY_EMBEDDED_PLAYER",
        clientVersion: "2.0",
        hl: "en",
        gl: "US",
      },
      thirdParty: { embedUrl: "https://www.youtube.com" },
    },
    ua: "Mozilla/5.0 (PlayStation; PlayStation 4/12.00) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15",
  },
  {
    name: "WEB",
    context: {
      client: {
        clientName: "WEB",
        clientVersion: "2.20250101.00.00",
        hl: "en",
        gl: "US",
      },
    },
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
  },
];

const WEB_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

type CaptionTrack = { baseUrl: string; languageCode: string; kind?: string };

function decodeEntities(t: string): string {
  return t
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)));
}

export function parseTranscriptPayload(body: string): TranscriptSegment[] {
  const trimmed = body.trim();
  if (!trimmed) return [];

  // json3 format
  if (trimmed.startsWith("{")) {
    try {
      const json = JSON.parse(trimmed);
      const events = Array.isArray(json?.events) ? json.events : [];
      const out: TranscriptSegment[] = [];
      for (const ev of events) {
        if (!Array.isArray(ev?.segs)) continue;
        const text = decodeEntities(
          ev.segs.map((s: any) => String(s?.utf8 ?? "")).join(""),
        )
          .replace(/\s+/g, " ")
          .trim();
        if (!text) continue;
        out.push({
          text,
          offset: Number(ev.tStartMs ?? 0),
          duration: Number(ev.dDurationMs ?? 0) || 3000,
        });
      }
      return out;
    } catch {
      return [];
    }
  }

  // srv3 / timed XML formats
  const out: TranscriptSegment[] = [];
  const pRegex = /<p\s+t="(-?\d+)"(?:\s+d="(\d+)")?[^>]*>([\s\S]*?)<\/p>/g;
  let m: RegExpExecArray | null;
  while ((m = pRegex.exec(trimmed)) !== null) {
    const inner = m[3] ?? "";
    let text = "";
    const sRegex = /<s[^>]*>([^<]*)<\/s>/g;
    let s: RegExpExecArray | null;
    while ((s = sRegex.exec(inner)) !== null) text += s[1] ?? "";
    if (!text) text = inner.replace(/<[^>]+>/g, "");
    text = decodeEntities(text).replace(/\s+/g, " ").trim();
    if (text) {
      out.push({
        text,
        offset: Math.max(0, parseInt(m[1] ?? "0", 10)),
        duration: parseInt(m[2] ?? "0", 10) || 3000,
      });
    }
  }
  if (out.length > 0) return out;

  const classic = /<text[^>]*start="([^"]*)"[^>]*dur="([^"]*)"[^>]*>([\s\S]*?)<\/text>/g;
  let c: RegExpExecArray | null;
  while ((c = classic.exec(trimmed)) !== null) {
    const text = decodeEntities((c[3] ?? "").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
    if (!text) continue;
    out.push({
      text,
      offset: Math.round(parseFloat(c[1] ?? "0") * 1000),
      duration: Math.round(parseFloat(c[2] ?? "0") * 1000) || 3000,
    });
  }
  return out;
}

function pickSpokenTrack(tracks: CaptionTrack[], audioLang?: string): CaptionTrack | undefined {
  const norm = (s?: string) => (s || "").toLowerCase().split("-")[0];
  const audio = norm(audioLang);
  if (audio) {
    const asrMatch = tracks.find((t) => t.kind === "asr" && norm(t.languageCode) === audio);
    if (asrMatch) return asrMatch;
    const manualMatch = tracks.find((t) => norm(t.languageCode) === audio);
    if (manualMatch) return manualMatch;
  }
  return tracks.find((t) => t.kind === "asr") ?? tracks[0];
}

async function fetchCaptionBody(baseUrl: string): Promise<TranscriptSegment[]> {
  // Try json3 first (most reliable), then the raw/srv3 XML variants.
  const variants = [
    withParams(baseUrl, { fmt: "json3" }),
    withParams(baseUrl, { fmt: "srv3" }),
    baseUrl,
  ];
  for (const url of variants) {
    try {
      const resp = await fetch(url, {
        headers: {
          "User-Agent": WEB_UA,
          "Accept-Language": "en-US,en;q=0.9",
          Origin: "https://www.youtube.com",
          Referer: "https://www.youtube.com/",
        },
      });
      if (!resp.ok) continue;
      const segments = parseTranscriptPayload(await resp.text());
      if (segments.length > 0) return segments;
    } catch {
      // try next variant
    }
  }
  return [];
}

function withParams(url: string, params: Record<string, string>): string {
  try {
    const u = new URL(url);
    for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Scrapes the watch page as a last resort. Some hosting providers get their
 * innertube requests refused, but the plain HTML page still serves the caption
 * track list inside the embedded player response.
 */
async function tracksFromWatchPage(
  videoId: string,
): Promise<{ tracks: CaptionTrack[]; audioLang?: string; title?: string; channel?: string }> {
  const resp = await fetch(`https://www.youtube.com/watch?v=${videoId}&hl=en`, {
    headers: {
      "User-Agent": WEB_UA,
      "Accept-Language": "en-US,en;q=0.9",
      Cookie: "CONSENT=YES+cb; SOCS=CAI",
    },
  });
  if (!resp.ok) return { tracks: [] };
  const html = await resp.text();
  const match = html.match(/ytInitialPlayerResponse\s*=\s*(\{[\s\S]*?\})\s*;\s*(?:var|const|let|<\/script>)/);
  if (!match) return { tracks: [] };
  try {
    const json = JSON.parse(match[1]);
    return {
      tracks: json?.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? [],
      audioLang: json?.videoDetails?.defaultAudioLanguage,
      title: json?.videoDetails?.title,
      channel: json?.videoDetails?.author,
    };
  } catch {
    return { tracks: [] };
  }
}

export type TranscriptResult = {
  segments: TranscriptSegment[];
  title?: string;
  channel?: string;
};

/**
 * Resolves a transcript for a YouTube video, trying multiple client identities
 * and caption formats. Works from serverless/datacenter hosts (Vercel,
 * Cloudflare) where a single innertube attempt is often refused.
 */
export async function getTranscript(videoId: string): Promise<TranscriptResult> {
  const cached = transcriptCache.get(videoId);
  if (cached) return { segments: cached };

  let title: string | undefined;
  let channel: string | undefined;
  let sawTracks = false;
  let lastError: string | undefined;

  for (const client of CLIENTS) {
    try {
      const resp = await fetch(INNERTUBE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": client.ua,
          "Accept-Language": "en-US,en;q=0.9",
          Origin: "https://www.youtube.com",
          Referer: "https://www.youtube.com/",
        },
        body: JSON.stringify({
          context: client.context,
          videoId,
          contentCheckOk: true,
          racyCheckOk: true,
        }),
      });
      if (!resp.ok) {
        lastError = `YouTube refused the request (${resp.status})`;
        continue;
      }
      const json = await resp.json();
      title = title ?? json?.videoDetails?.title;
      channel = channel ?? json?.videoDetails?.author;
      const tracks: CaptionTrack[] =
        json?.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? [];
      if (!tracks.length) continue;
      sawTracks = true;
      const track = pickSpokenTrack(tracks, json?.videoDetails?.defaultAudioLanguage);
      if (!track?.baseUrl) continue;
      const segments = await fetchCaptionBody(track.baseUrl);
      if (segments.length) {
        transcriptCache.set(videoId, segments);
        return { segments, title, channel };
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }

  // Last resort: the public watch page.
  try {
    const page = await tracksFromWatchPage(videoId);
    title = title ?? page.title;
    channel = channel ?? page.channel;
    if (page.tracks.length) {
      sawTracks = true;
      const track = pickSpokenTrack(page.tracks, page.audioLang);
      if (track?.baseUrl) {
        const segments = await fetchCaptionBody(track.baseUrl);
        if (segments.length) {
          transcriptCache.set(videoId, segments);
          return { segments, title, channel };
        }
      }
    }
  } catch (err) {
    lastError = err instanceof Error ? err.message : lastError;
  }

  // YouTube blocks caption requests from datacenter IPs (Vercel, Cloudflare),
  // so in production the steps above usually come back empty. Fall back to
  // AI transcription, which reads the video directly and always works.
  try {
    const { transcribeWithAi } = await import("./transcript.ai.server");
    const aiSegments = await transcribeWithAi(videoId);
    if (aiSegments.length) {
      transcriptCache.set(videoId, aiSegments);
      return { segments: aiSegments, title, channel };
    }
  } catch (err) {
    lastError = err instanceof Error ? err.message : lastError;
  }

  if (sawTracks) {
    throw new Error("Transcript could not be loaded for this video");
  }

  throw new Error(
    lastError
      ? `Transcript is unavailable for this video (${lastError})`
      : "Transcript is disabled on this video",
  );
}
