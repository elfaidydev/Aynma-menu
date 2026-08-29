"use client";

import { motion } from "framer-motion";
import { useScroll, useTransform } from "framer-motion";
import { ShineText } from "@/components/ShineText";
import { BRAND_TAGLINE } from "@/data/brand";
import { heroContainer, heroItem } from "@/lib/motion";
import { scrollToSection } from "@/hooks/useLenis";

type HeroProps = {
  isActive: boolean;
};

export function Hero({ isActive }: HeroProps) {
  const { scrollY } = useScroll();
  const ambienceBlur = useTransform(scrollY, [0, 500], [0, 18]);
  const ambienceScale = useTransform(scrollY, [0, 800], [1.06, 1]);
  const ambienceFilter = useTransform(ambienceBlur, (value) => `blur(${value}px)`);
  const contentY = useTransform(scrollY, [0, 600], [0, 180]);
  const contentOpacity = useTransform(scrollY, [0, 680], [1, 0]);

  return (
    <header className="hero-fixed">
      <motion.div
        className="hero-ambience"
        style={{
          scale: ambienceScale,
          filter: ambienceFilter,
        }}
        aria-hidden
      >
        <span className="orb orb--1" />
        <span className="orb orb--2" />
        <span className="orb orb--3" />
        <span className="hero-grain" />
        <span className="hero-ring" />
      </motion.div>

      <motion.div
        className={`hero-content ${isActive ? "active" : ""}`}
        style={{ y: contentY, opacity: contentOpacity }}
        variants={heroContainer}
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
      >
        <motion.p className="hero-eyebrow" variants={heroItem}>
          كوفي اينما
        </motion.p>

        <motion.div variants={heroItem}>
          <ShineText as="h1" className="main-logo">
            AYNMA
          </ShineText>
        </motion.div>

        <motion.div className="brand-line-shimmer" variants={heroItem} />

        <motion.h2 className="hero-slogan" variants={heroItem}>
          {BRAND_TAGLINE}
        </motion.h2>
      </motion.div>

      <button
        type="button"
        className={`scroll-trigger ${isActive ? "visible" : ""}`}
        onClick={() => scrollToSection("#hot")}
        aria-label="اكتشف القائمة"
      >
        <span className="scroll-trigger__label">
          <span className="scroll-trigger__label-text">اكتشف القائمة</span>
          <span className="scroll-trigger__label-shine" aria-hidden>
            اكتشف القائمة
          </span>
        </span>

        <div className="scroll-indicator" aria-hidden>
          <div className="scroll-indicator__capsule">
            <span className="scroll-indicator__dot" />
          </div>
          <svg className="scroll-indicator__chevron" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>
    </header>
  );
}
