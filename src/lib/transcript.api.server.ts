// @ts-nocheck
import type { TranscriptSegment } from "./transcript.functions";

/**
 * Transcript providers that work from datacenter IPs (Vercel, Cloudflare).
 *
 * NOTE: the official YouTube Data API v3 cannot return caption *text* — the
 * `captions.download` endpoint requires an OAuth token from the video owner.
 * It is only used here for title/channel metadata. The actual transcript comes
 * from a dedicated transcript API (Supadata, or any RapidAPI-compatible one).
 */

type Meta = { title?: string; channel?: string };

/** Official YouTube Data API v3 — metadata only. */
export async function fetchYouTubeMeta(videoId: string): Promise<Meta> {
  const key = process.env["YOUTUBE_API_KEY"];
  if (!key) return {};
  try {
    const url =
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${key}`;
    const resp = await fetch(url);
    if (!resp.ok) return {};
    const json = await resp.json();
    const snippet = json?.items?.[0]?.snippet;
    if (!snippet) return {};
    return { title: snippet.title, channel: snippet.channelTitle };
  } catch {
    return {};
  }
}

function normalizeSegments(raw: any[]): TranscriptSegment[] {
  const out: TranscriptSegment[] = [];
  for (const item of raw) {
    const text = String(item?.text ?? item?.content ?? "").replace(/\s+/g, " ").trim();
    if (!text) continue;
    const rawOffset = Number(item?.offset ?? item?.start ?? item?.startMs ?? item?.start_ms ?? 0);
    const rawDur = Number(item?.duration ?? item?.dur ?? item?.durationMs ?? item?.duration_ms ?? 0);
    out.push({ text, offset: rawOffset, duration: rawDur });
  }
  if (!out.length) return out;

  // Providers return either seconds or milliseconds. If the largest offset is
  // implausibly small for a video (< 3 hours in ms), it is seconds -> scale up.
  const maxOffset = Math.max(...out.map((s) => s.offset));
  const looksLikeSeconds = maxOffset > 0 && maxOffset < 18000;
  return out.map((s) => ({
    text: s.text,
    offset: Math.max(0, Math.round(looksLikeSeconds ? s.offset * 1000 : s.offset)),
    duration: Math.max(
      500,
      Math.round((looksLikeSeconds ? s.duration * 1000 : s.duration) || 3000),
    ),
  }));
}

/** Supadata transcript API — https://supadata.ai (key: SUPADATA_API_KEY). */
export async function fetchSupadataTranscript(videoId: string): Promise<TranscriptSegment[]> {
  const key = process.env["SUPADATA_API_KEY"];
  if (!key) return [];
  const url =
    `https://api.supadata.ai/v1/youtube/transcript?videoId=${videoId}&text=false`;
  const resp = await fetch(url, { headers: { "x-api-key": key } });
  if (!resp.ok) {
    throw new Error(`Transcript API responded ${resp.status}`);
  }
  const json = await resp.json();
  const raw = Array.isArray(json?.content)
    ? json.content
    : Array.isArray(json?.transcript)
      ? json.transcript
      : [];
  return normalizeSegments(raw);
}

/**
 * Optional RapidAPI-hosted transcript endpoint. Set both
 * RAPIDAPI_KEY and RAPIDAPI_TRANSCRIPT_HOST to enable.
 */
export async function fetchRapidApiTranscript(videoId: string): Promise<TranscriptSegment[]> {
  const key = process.env["RAPIDAPI_KEY"];
  const host = process.env["RAPIDAPI_TRANSCRIPT_HOST"];
  if (!key || !host) return [];
  const resp = await fetch(`https://${host}/api/transcript?videoId=${videoId}`, {
    headers: { "x-rapidapi-key": key, "x-rapidapi-host": host },
  });
  if (!resp.ok) throw new Error(`Transcript API responded ${resp.status}`);
  const json = await resp.json();
  const raw = Array.isArray(json)
    ? json
    : Array.isArray(json?.transcript)
      ? json.transcript
      : Array.isArray(json?.content)
        ? json.content
        : [];
  return normalizeSegments(raw);
}

/** Tries every configured transcript API in order. Returns [] if none work. */
export async function fetchTranscriptFromApis(videoId: string): Promise<TranscriptSegment[]> {
  const providers = [fetchSupadataTranscript, fetchRapidApiTranscript];
  for (const provider of providers) {
    try {
      const segments = await provider(videoId);
      if (segments.length) return segments;
    } catch {
      // try the next provider
    }
  }
  return [];
}
