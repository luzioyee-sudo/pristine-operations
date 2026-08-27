// @ts-nocheck
import { useEffect } from "react";

import App from "./App";
import { registerServiceWorker } from "./registerServiceWorker";

export default function AppRoot() {
  useEffect(() => {
    // Offline support: skip in dev so HMR is never served from the SW cache.
    if (!import.meta.env.DEV) {
      registerServiceWorker();
    }
  }, []);

  return (
    <div id="root">
      <App />
    </div>
  );
}
