// @ts-nocheck
import type { Transcript, TranscriptSegment, TranscriptWord } from '../types/transcript';

const EPSILON = 0.05;

function wordWeight(text: string): number {
  return Math.max(1, (text.match(/[\p{L}\p{N}]/gu) ?? []).length);
}

/**
 * Creates deterministic word windows when a caption source only provides a
 * line-level timestamp. The windows fill the segment exactly and use the
 * visible word length as a proxy for speaking time.
 */
export function createWordTimings(
  text: string,
  startTime: number,
  endTime: number,
  idPrefix: string,
): TranscriptWord[] {
  const words: string[] = text.match(/\S+/g) ?? [];
  const safeStart = Number(startTime);
  const safeEnd = Number(endTime);
  if (!words.length || !Number.isFinite(safeStart) || !Number.isFinite(safeEnd) || safeEnd <= safeStart) {
    return [];
  }

  const totalWeight = words.reduce((sum, word) => sum + wordWeight(word), 0);
  let cursor = safeStart;

  return words.map((word, index) => {
    const isLast = index === words.length - 1;
    const duration = safeEnd - safeStart;
    const nextCursor = isLast
      ? safeEnd
      : cursor + (duration * wordWeight(word)) / totalWeight;
    const result: TranscriptWord = {
      id: `${idPrefix}-word-${index}`,
      text: word,
      startTime: cursor,
      endTime: Math.max(cursor, nextCursor),
    };
    cursor = nextCursor;
    return result;
  });
}

function normalizeWords(
  rawWords: any[],
  segmentStart: number,
  segmentEnd: number,
  segmentId: string,
): TranscriptWord[] {
  const parsed = rawWords
    .map((word: any, wordIndex: number) => {
      const explicitStart = word.startTime ?? word.start;
      const relativeStartMs = word.tOffsetMs ?? word.offsetMs;
      const relativeStart = word.offset;
      const startTime = explicitStart !== undefined
        ? Number(explicitStart)
        : relativeStartMs !== undefined
          ? segmentStart + Number(relativeStartMs) / 1000
          : relativeStart !== undefined
            ? segmentStart + Number(relativeStart) / 1000
            : segmentStart;

      const explicitEnd = word.endTime ?? word.end;
      const durationMs = word.dDurationMs;
      const duration = word.duration;
      const endTime = explicitEnd !== undefined
        ? Number(explicitEnd)
        : durationMs !== undefined
          ? startTime + Number(durationMs) / 1000
          : duration !== undefined
            ? startTime + (Number(duration) > 100 ? Number(duration) / 1000 : Number(duration))
            : Number.NaN;

      return {
        id: String(word.id ?? `${segmentId}-word-${wordIndex}`),
        text: String(word.text ?? word.word ?? word.utf8 ?? '').trim(),
        startTime,
        endTime,
        wordIndex,
      };
    })
    .filter((word) => word.text.length > 0 && Number.isFinite(word.startTime) && word.startTime >= segmentStart)
    .sort((a, b) => a.startTime - b.startTime);

  if (!parsed.length) return [];

  return parsed
    .map((word, index) => {
      const nextStart = parsed[index + 1]?.startTime;
      const endTime = Number.isFinite(word.endTime)
        ? word.endTime
        : (nextStart ?? segmentEnd);
      return {
        id: word.id,
        text: word.text,
        startTime: Math.max(segmentStart, Math.min(word.startTime, segmentEnd)),
        endTime: Math.min(segmentEnd, Math.max(word.startTime, endTime)),
      };
    })
    .filter((word) => word.endTime > word.startTime);
}

export function normalizeTranscript(raw: any, videoId: string): Transcript {
  if (!raw) {
    throw new Error(`No transcript data received for ${videoId}.`);
  }

  // Handle case where raw is an array of segments or an object containing segments/transcript.
  const source = Array.isArray(raw)
    ? { segments: raw }
    : (raw.segments ? raw : (raw.transcript ? { ...raw, segments: raw.transcript } : raw));

  const rawSegments = source.segments ?? source.events ?? [];

  const segments: TranscriptSegment[] = rawSegments
    .map((item: any, index: number) => {
      let startTime = 0;
      let endTime = 0;

      if (item.startTime !== undefined) {
        startTime = Number(item.startTime);
      } else if (item.start !== undefined) {
        startTime = Number(item.start);
      } else if (item.offset !== undefined) {
        startTime = Number(item.offset) / 1000;
      } else if (item.tStartMs !== undefined) {
        startTime = Number(item.tStartMs) / 1000;
      }

      if (item.endTime !== undefined) {
        endTime = Number(item.endTime);
      } else if (item.end !== undefined) {
        endTime = Number(item.end);
      } else if (item.duration !== undefined) {
        endTime = startTime + (Number(item.duration) > 100 ? Number(item.duration) / 1000 : Number(item.duration));
      } else if (item.dDurationMs !== undefined) {
        endTime = startTime + Number(item.dDurationMs) / 1000;
      } else {
        endTime = startTime + 3.0;
      }

      let text = String(item.text ?? '').trim();
      if (!text && Array.isArray(item.segs)) {
        text = item.segs
          .map((s: any) => String(s.utf8 ?? ''))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      }

      const explicitWords = Array.isArray(item.words)
        ? normalizeWords(item.words, startTime, endTime, String(item.id ?? `segment-${index}`))
        : [];
      const words = explicitWords.length
        ? explicitWords
        : createWordTimings(text, startTime, endTime, String(item.id ?? `segment-${index}`));

      return {
        id: String(item.id ?? item.line_id ?? `segment-${index}`),
        text,
        startTime,
        endTime,
        speaker: item.speaker ? String(item.speaker) : undefined,
        words: words.length ? words : undefined,
      };
    })
    .filter((segment: TranscriptSegment) =>
      segment.text.length > 0 &&
      Number.isFinite(segment.startTime) &&
      Number.isFinite(segment.endTime) &&
      segment.startTime >= 0 &&
      segment.endTime > segment.startTime
    )
    .sort((a: TranscriptSegment, b: TranscriptSegment) => a.startTime - b.startTime);

  if (!segments.length) {
    throw new Error(`Transcript for this video contains no valid timestamped segments.`);
  }

  return {
    videoId,
    version: Number(source.version ?? 1),
    language: String(source.language ?? 'en'),
    timebase: 'absolute-video-seconds',
    alignmentMethod: source.alignmentMethod ?? 'caption-segment',
    alignmentQuality: source.alignmentQuality ?? 'medium',
    duration: Number.isFinite(Number(source.duration)) ? Number(source.duration) : undefined,
    generatedAt: source.generatedAt ?? new Date().toISOString(),
    segments,
  };
}

/** Returns -1 during intro, silence, music, outro, or any other transcript gap. */
export function findActiveSegmentIndex(
  segments: TranscriptSegment[],
  currentTime: number,
): number {
  if (!Number.isFinite(currentTime) || !segments.length) return -1;

  let low = 0;
  let high = segments.length - 1;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const segment = segments[middle];

    if (currentTime < segment.startTime) {
      high = middle - 1;
    } else if (currentTime >= segment.endTime) {
      low = middle + 1;
    } else {
      return middle;
    }
  }

  return -1;
}

export function findActiveWordIndex(
  words: TranscriptWord[] | undefined,
  currentTime: number,
): number {
  if (!words?.length || !Number.isFinite(currentTime)) return -1;
  let low = 0;
  let high = words.length - 1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const word = words[middle];
    if (currentTime < word.startTime) high = middle - 1;
    else if (currentTime >= word.endTime) low = middle + 1;
    else return middle;
  }
  return -1;
}

export function isWithinDuration(segment: TranscriptSegment, duration?: number): boolean {
  return duration === undefined || (
    segment.startTime <= duration + EPSILON &&
    segment.endTime <= duration + EPSILON
  );
}

export function toAbsoluteVideoSeconds(localSeconds: number, originalStartTime: number): number {
  if (!Number.isFinite(localSeconds) || !Number.isFinite(originalStartTime) || originalStartTime < 0) {
    throw new Error('Invalid local timestamp or original media origin.');
  }
  return originalStartTime + localSeconds;
}
