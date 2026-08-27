"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ShineText } from "@/components/ShineText";
import { BRAND_TAGLINE } from "@/data/brand";

type CurtainLoaderProps = {
  onComplete: () => void;
};

export function CurtainLoader({ onComplete }: CurtainLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [slideUp, setSlideUp] = useState(false);

  useEffect(() => {
    const progressTimer = window.setTimeout(() => setProgress(100), 280);
    const fadeTimer = window.setTimeout(() => setFadeOut(true), 2700);
    const slideTimer = window.setTimeout(() => {
      setSlideUp(true);
      window.setTimeout(onComplete, 800);
    }, 3600);

    return () => {
      window.clearTimeout(progressTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(slideTimer);
    };
  }, [onComplete]);

  return (
    <div className={`curtain-loader ${slideUp ? "slide-up" : ""}`}>
      <div className={`loader-content ${fadeOut ? "fade-out-content" : ""}`}>
        <motion.p
          className="loader-ar"
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          كوفي ايمنا
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <ShineText as="h1" className="loader-logo">
            AYNMA
          </ShineText>
        </motion.div>

        <motion.p
          className="loader-slogan"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {BRAND_TAGLINE}
        </motion.p>

        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
