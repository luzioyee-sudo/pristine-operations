import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

// The Ribble app is a browser-only SPA (localStorage, IndexedDB, service worker,
// speech APIs), so it is loaded after hydration rather than rendered on the server.
const RibbleAppRoot = lazy(() => importWithRetry(() => import("@/app/AppRoot")));

// Vite dev restarts / transient network blips can reject a dynamic import once,
// which React.lazy caches forever and leaves a blank screen. Retry, then reload.
async function importWithRetry<T>(load: () => Promise<T>, retries = 3): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await load();
    } catch (error) {
      if (attempt >= retries) {
        if (typeof window !== "undefined" && !sessionStorage.getItem("ribble-chunk-reload")) {
          sessionStorage.setItem("ribble-chunk-reload", "1");
          window.location.reload();
        }
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
    }
  }
}


function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
    </div>
  );
}

export function RibbleApp() {
  return (
    <ClientOnly fallback={<Loading />}>
      <Suspense fallback={<Loading />}>
        <RibbleAppRoot />
      </Suspense>
    </ClientOnly>
  );
}
