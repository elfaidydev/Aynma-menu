"use client";

import { useCallback, useEffect, useState } from "react";
import { CurtainLoader } from "@/components/CurtainLoader";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MenuSection } from "@/components/MenuSection";
import { Navigation } from "@/components/Navigation";
import { PortraitOverlay } from "@/components/PortraitOverlay";
import { DEFAULT_ACTIVE_SECTION, MENU_SECTIONS, NAV_ITEMS } from "@/data/menu";
import { useLenis } from "@/hooks/useLenis";
import { useActiveSection, useIdleReset } from "@/hooks/useNavigation";
import { useOrientationLock } from "@/hooks/useOrientationLock";

export function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [heroActive, setHeroActive] = useState(false);
  const showPortraitOverlay = useOrientationLock();
  const sectionIds = NAV_ITEMS.map((item) => item.id);
  const { activeSection, navigateTo } = useActiveSection(sectionIds, DEFAULT_ACTIVE_SECTION);

  useLenis();
  useIdleReset(isLoading);

  useEffect(() => {
    if (isLoading) {
      document.body.classList.add("loading-state");
      return () => document.body.classList.remove("loading-state");
    }
    document.body.classList.remove("loading-state");
  }, [isLoading]);

  const finishBoot = useCallback(() => {
    setIsLoading(false);
    document.body.classList.remove("loading-state");
    window.setTimeout(() => setHeroActive(true), 120);
  }, []);

  useEffect(() => {
    const failsafe = window.setTimeout(finishBoot, 5000);
    return () => window.clearTimeout(failsafe);
  }, [finishBoot]);

  const handleLoaderComplete = finishBoot;

  return (
    <>
      {showPortraitOverlay && <PortraitOverlay />}
      {isLoading && <CurtainLoader onComplete={handleLoaderComplete} />}

      <Hero isActive={heroActive} />

      <div className="scrolling-wrapper">
        <Navigation
          items={NAV_ITEMS}
          activeSection={activeSection}
          defaultSection={DEFAULT_ACTIVE_SECTION}
          onNavigate={navigateTo}
        />

        <main className="menu-container">
          {MENU_SECTIONS.map((section, index) => (
            <MenuSection key={section.id} section={section} index={index} />
          ))}
          <Footer />
        </main>
      </div>
    </>
  );
}
