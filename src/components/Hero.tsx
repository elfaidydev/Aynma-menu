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
          كوفي ايمنا
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
        aria-label="اسحب للأعلى للاستكشاف"
      >
        <span className="scroll-text">اكتشف القائمة</span>
        <div className="scroll-visual">
          <div className="scroll-line">
            <div className="scroll-drop" />
          </div>
          <div className="scroll-arrow" />
        </div>
      </button>
    </header>
  );
}
