// @ts-nocheck
import { createServerFn } from "@tanstack/react-start";

export type TranscriptSegment = {
  text: string;
  offset: number;
  duration: number;
};

export const fetchTranscript = createServerFn({ method: "POST" })
  .inputValidator((data: { videoId: string }) => {
    if (!data || typeof data.videoId !== "string" || !/^[a-zA-Z0-9_-]{11}$/.test(data.videoId)) {
      throw new Error("Invalid video ID");
    }
    return data;
  })
  .handler(async ({ data }): Promise<{ segments: TranscriptSegment[] }> => {
    const { getTranscript } = await import("./transcript.server");
    const result = await getTranscript(data.videoId);
    return { segments: result.segments };
  });
