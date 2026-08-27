"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { railContainer, railCardReveal } from "@/lib/motion";

type HorizontalRailProps = {
  children: ReactNode;
  hint?: string;
};

export function HorizontalRail({ children, hint = "اسحب لاستكشاف المزيد" }: HorizontalRailProps) {
  return (
    <div className="horizontal-rail-wrap">
      <motion.div
        className="horizontal-rail"
        variants={railContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {children}
      </motion.div>
      <div className="horizontal-rail__fade horizontal-rail__fade--start" aria-hidden />
      <div className="horizontal-rail__fade horizontal-rail__fade--end" aria-hidden />
      <motion.p
        className="horizontal-rail__hint"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <span className="horizontal-rail__hint-icon" aria-hidden>←</span>
        {hint}
      </motion.p>
    </div>
  );
}

export function HorizontalRailItem({ children }: { children: ReactNode }) {
  return (
    <motion.div className="horizontal-rail__item" variants={railCardReveal}>
      {children}
    </motion.div>
  );
}
