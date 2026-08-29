"use client";

import { useEffect } from "react";
import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function getScrollPosition() {
  return lenisInstance?.scroll ?? window.scrollY;
}

export function scrollToTop(duration = 1.5) {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { duration });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function scrollToSection(targetId: string, offset = 96) {
  const sectionId = targetId.replace(/^#/, "");
  const headline = document.getElementById(`${sectionId}-headline`);
  const target = headline ?? document.querySelector(targetId);
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  if (lenisInstance) {
    lenisInstance.scrollTo(top, { duration: 1.25 });
    return;
  }

  window.scrollTo({ top, behavior: "smooth" });
}

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.55,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.15,
    });

    lenisInstance = lenis;
    document.documentElement.classList.add("lenis", "lenis-smooth");

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}
