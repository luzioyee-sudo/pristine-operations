// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

export const Route = createFileRoute("/api/public/translate")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400, headers: CORS });
        }
        const input = body as { words?: unknown; target?: unknown };
        if (!Array.isArray(input.words) || typeof input.target !== "string") {
          return Response.json({ error: "Invalid request" }, { status: 400, headers: CORS });
        }
        const words = input.words
          .filter((w): w is string => typeof w === "string")
          .map((w) => w.trim().toLowerCase())
          .filter((w) => w.length > 0 && w.length <= 120)
          .slice(0, 120);
        const target = input.target.slice(0, 5);

        const translations: Record<string, string> = {};
        if (target === "en" || words.length === 0) {
          return Response.json({ translations }, { headers: CORS });
        }

        const { getCached, setCached, translateViaGateway } = await import(
          "@/lib/translate.server"
        );
        const missing: string[] = [];
        for (const w of words) {
          const hit = getCached(target, w);
          if (hit) translations[w] = hit;
          else missing.push(w);
        }
        if (missing.length > 0) {
          try {
            const fresh = await translateViaGateway(missing, target);
            for (const [k, v] of Object.entries(fresh)) {
              setCached(target, k, v);
              translations[k] = v;
            }
          } catch {
            // Return whatever we have rather than failing the lookup.
          }
        }
        return Response.json({ translations }, { headers: CORS });
      },
    },
  },
});