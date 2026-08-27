import { createFileRoute } from "@tanstack/react-router";

async function handle({ request }: { request: Request }) {
  const { app } = await import("@/app/api/server-app");
  return app.handle(request);
}

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
      PUT: handle,
      PATCH: handle,
      DELETE: handle,
    },
  },
});
