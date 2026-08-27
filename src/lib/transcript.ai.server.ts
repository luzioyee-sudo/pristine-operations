// @ts-nocheck
import type { TranscriptSegment } from "./transcript.functions";

/**
 * AI transcript fallback.
 *
 * YouTube refuses caption requests coming from datacenter IPs (Vercel,
 * Cloudflare, etc.) with a "Sign in to confirm you're not a bot" page, so the
 * scraping path in transcript.server.ts returns nothing in production. When
 * that happens we transcribe the video with a multimodal model through the
 * Lovable AI Gateway, which reads the YouTube URL directly and returns
 * timestamped caption lines.
 */

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const PROMPT = [
  "Transcribe the ENTIRE video verbatim, in the language actually spoken.",
  "You are producing subtitles that must follow the audible speech exactly.",
  "Inspect the video timecode for every phrase; do not estimate, evenly distribute,",
  "or shift timestamps to remove silence. Intro music and silence must remain gaps.",
  'Return ONLY a JSON array of objects {"start_ms": integer, "end_ms": integer, "text": string}.',
  "start_ms is the exact first audible phoneme and end_ms is the exact last audible",
  "phoneme, both measured from 00:00.000 of the supplied video. Use short natural",
  "phrases, preserve pauses between phrases, never overlap entries, and do not translate.",
  "No markdown and no commentary.",
].join(" ");

function secondsValue(value: unknown): number {
  if (typeof value === "string" && value.includes(":")) {
    const parts = value.split(":").map(Number);
    if (parts.some((part) => !Number.isFinite(part))) return Number.NaN;
    return parts.reduce((total, part) => total * 60 + part, 0);
  }
  return Number(value);
}

function parseSegments(content: string): TranscriptSegment[] {
  const match = content.match(/\[[\s\S]*\]/);
  if (!match) return [];
  let parsed: any;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  const rows = parsed
    .map((item: any) => {
      const hasMilliseconds = item?.start_ms !== undefined || item?.startMs !== undefined;
      const startValue = item?.start_ms ?? item?.startMs ?? item?.start ?? item?.offset;
      const endValue = item?.end_ms ?? item?.endMs ?? item?.end;
      const durationValue = item?.duration_ms ?? item?.durationMs ?? item?.dur ?? item?.duration;
      const unit = hasMilliseconds ? 1 : 1000;
      const start = secondsValue(startValue) * unit;
      const explicitEnd = secondsValue(endValue) * unit;
      const duration = secondsValue(durationValue) * unit;
      const text = String(item?.text ?? "").replace(/\s+/g, " ").trim();
      if (!text || !Number.isFinite(start) || start < 0) return null;
      const end = Number.isFinite(explicitEnd) && explicitEnd > start
        ? explicitEnd
        : start + (Number.isFinite(duration) && duration > 0 ? duration : 0);
      return { text, start, end };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => a.start - b.start);

  if (!rows.length) return [];

  return rows
    .map((row: any, index: number) => {
      const nextStart = rows[index + 1]?.start;
      const measuredEnd = row.end > row.start ? row.end : (nextStart ?? row.start + 3000);
      const end = nextStart === undefined ? measuredEnd : Math.min(measuredEnd, nextStart);
      return {
        text: row.text,
        offset: Math.round(row.start),
        duration: Math.max(100, Math.round(end - row.start)),
      };
    })
    .filter((row: TranscriptSegment) => row.duration > 0);
}


export async function transcribeWithAi(videoId: string): Promise<TranscriptSegment[]> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return [];

  const resp = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
    },
    body: JSON.stringify({
      model: "google/gemini-3.7-flash",
      max_tokens: 32000,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT },
            {
              type: "video_url",
              video_url: { url: `https://www.youtube.com/watch?v=${videoId}` },
            },
          ],
        },
      ],
    }),
  });

  if (!resp.ok) {
    const detail = await resp.text().catch(() => "");
    if (resp.status === 429) throw new Error("Transcription is rate limited, please try again shortly");
    if (resp.status === 402) throw new Error("AI credits are exhausted, transcription is paused");
    throw new Error(`Transcription service error (${resp.status}) ${detail.slice(0, 120)}`);
  }

  const json = await resp.json();
  const content = String(json?.choices?.[0]?.message?.content ?? "");
  return parseSegments(content);
}
