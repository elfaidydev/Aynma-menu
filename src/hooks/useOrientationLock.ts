"use client";

import { useEffect, useState } from "react";

export function useOrientationLock() {
  const [showPortraitOverlay, setShowPortraitOverlay] = useState(false);

  useEffect(() => {
    const updateOrientation = () => {
      const isLandscape = window.matchMedia("(orientation: landscape)").matches;
      const isMobileTablet = window.matchMedia("(max-width: 1024px)").matches;
      setShowPortraitOverlay(isLandscape && isMobileTablet);
    };

    updateOrientation();
    window.addEventListener("resize", updateOrientation);
    window.addEventListener("orientationchange", updateOrientation);

    return () => {
      window.removeEventListener("resize", updateOrientation);
      window.removeEventListener("orientationchange", updateOrientation);
    };
  }, []);

  useEffect(() => {
    let triedLock = false;

    const tryLockPortrait = async () => {
      if (triedLock) return;
      triedLock = true;

      try {
        const orientation = screen.orientation as ScreenOrientation & {
          lock?: (orientation: string) => Promise<void>;
        };
        await orientation.lock?.("portrait-primary");
      } catch {
        // Orientation lock is not supported in all browsers.
      }
    };

    window.addEventListener("click", tryLockPortrait, { passive: true, once: true });
    window.addEventListener("touchstart", tryLockPortrait, { passive: true, once: true });

    return () => {
      window.removeEventListener("click", tryLockPortrait);
      window.removeEventListener("touchstart", tryLockPortrait);
    };
  }, []);

  return showPortraitOverlay;
}
