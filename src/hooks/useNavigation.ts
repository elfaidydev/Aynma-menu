"use client";

import { useEffect, useState } from "react";
import { getScrollPosition, scrollToSection, scrollToTop } from "./useLenis";

const IDLE_LIMIT = 5 * 60 * 1000;

export function useIdleReset(isLoading: boolean) {
  useEffect(() => {
    if (isLoading) return;

    let idleTimeout: ReturnType<typeof setTimeout>;

    const resetIdleTimer = () => {
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        if (getScrollPosition() > 80) {
          scrollToTop();
        }
      }, IDLE_LIMIT);
    };

    const events = ["touchstart", "touchmove", "click", "mousemove", "keydown", "scroll"] as const;
    events.forEach((event) => window.addEventListener(event, resetIdleTimer, { passive: true }));
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimeout);
      events.forEach((event) => window.removeEventListener(event, resetIdleTimer));
    };
  }, [isLoading]);
}

export function useActiveSection(sectionIds: string[], defaultSection: string) {
  const [activeSection, setActiveSection] = useState(defaultSection);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrollingByClick, setIsScrollingByClick] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isScrollingByClick) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [sectionIds, isScrollingByClick, isMounted]);

  const navigateTo = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsScrollingByClick(true);
    scrollToSection(`#${sectionId}`);
    window.setTimeout(() => setIsScrollingByClick(false), 1000);
  };

  const resolvedActiveSection = isMounted ? activeSection : defaultSection;

  return { activeSection: resolvedActiveSection, navigateTo };
}
