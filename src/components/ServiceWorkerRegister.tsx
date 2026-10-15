"use client";

import { publicAsset } from "@/lib/publicAsset";
import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    let registration: ServiceWorkerRegistration | undefined;
    let stopped = false;
    let lastCheck = 0;
    const checkForUpdate = () => {
      if (!registration || !navigator.onLine || document.visibilityState !== "visible"
        || Date.now() - lastCheck < 60_000) return;
      lastCheck = Date.now();
      void registration.update().catch(() => {});
    };
    // Slow/lazy photos must not delay offline setup.
    void navigator.serviceWorker.register(publicAsset("/sw.js"), {
      scope: publicAsset("/"), updateViaCache: "none",
    }).then(value => {
      if (stopped) return;
      registration = value;
      checkForUpdate();
    }).catch(() => {});
    window.addEventListener("online", checkForUpdate);
    document.addEventListener("visibilitychange", checkForUpdate);
    return () => {
      stopped = true;
      window.removeEventListener("online", checkForUpdate);
      document.removeEventListener("visibilitychange", checkForUpdate);
    };
  }, []);

  return null;
}
