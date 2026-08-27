// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";

// Public, CORS-enabled transcript endpoint.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

export const Route = createFileRoute("/api/public/transcript")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ request }) => {
        const videoId = new URL(request.url).searchParams.get("v") ?? "";
        if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
          return Response.json({ error: "Invalid video ID" }, { status: 400, headers: CORS });
        }
        try {
          const { getTranscript } = await import("@/lib/transcript.server");
          const { segments, title, channel } = await getTranscript(videoId);
          return Response.json(
            { segments, title: title ?? "", channel: channel ?? "" },
            { headers: CORS },
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to load transcript";
          return Response.json({ error: message }, { status: 502, headers: CORS });
        }
      },
    },
  },
});
