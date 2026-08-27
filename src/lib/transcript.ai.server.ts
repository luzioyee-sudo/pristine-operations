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
  'Return ONLY a JSON array of objects {"start": number, "dur": number, "text": string}',
  "where start and dur are seconds from the beginning of the video.",
  "Split the speech into caption-sized lines of 3-10 seconds that cover the whole",
  "video in order, with no overlaps. Do not translate. No markdown, no commentary.",
].join(" ");

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
      const start = Number(item?.start ?? item?.offset ?? 0);
      const dur = Number(item?.dur ?? item?.duration ?? 0);
      const text = String(item?.text ?? "").replace(/\s+/g, " ").trim();
      if (!text || !Number.isFinite(start) || start < 0) return null;
      return { text, start, dur: Number.isFinite(dur) && dur > 0 ? dur : 0 };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => a.start - b.start);

  if (!rows.length) return [];

  // The model is asked for seconds but sometimes answers in milliseconds.
  // No YouTube lesson runs longer than ~5 hours, so a last timestamp beyond
  // that can only mean the values are already in milliseconds.
  const lastStart = rows[rows.length - 1].start;
  const scale = lastStart > 18000 ? 1 : 1000;

  return rows.map((row: any) => ({
    text: row.text,
    offset: Math.round(row.start * scale),
    duration: Math.max(300, Math.round((row.dur || 3) * scale)),
  }));
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
