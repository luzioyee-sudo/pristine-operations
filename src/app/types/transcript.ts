// @ts-nocheck
export type TranscriptTimebase =
  | 'absolute-video-seconds'
  | 'relative-to-extracted-audio'
  | 'unknown';

export type AlignmentMethod =
  | 'caption-segment'
  | 'asr-segment'
  | 'forced-alignment'
  | 'manual'
  | 'unknown';

export type AlignmentQuality = 'high' | 'medium' | 'low' | 'unknown';

export interface TranscriptWord {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
}

export interface TranscriptSegment {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  speaker?: string;
  words?: TranscriptWord[];
}

export interface Transcript {
  videoId: string;
  version: number;
  language: string;
  timebase: TranscriptTimebase;
  alignmentMethod: AlignmentMethod;
  alignmentQuality: AlignmentQuality;
  segments: TranscriptSegment[];
  duration?: number;
  generatedAt?: string;
}
