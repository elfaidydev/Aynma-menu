"use client";

import { motion } from "framer-motion";
import type { MenuSection as MenuSectionType } from "@/data/menu";
import { HorizontalRail, HorizontalRailItem } from "./HorizontalRail";
import { PremiumCard } from "./PremiumCard";
import { cardReveal, gridContainer, sectionSubtitle, sectionTitle } from "@/lib/motion";

const SECTION_COPY: Record<string, { subtitle: string; hint: string; label: string }> = {
  desserts: {
    label: "حلا",
    subtitle: "حلا يكمل اللحظة بنكهة لا تنسى",
    hint: "اسحب لاستكشاف الحلا",
  },
  hot: {
    label: "ساخن",
    subtitle: "دفء القهوة في انقى صورها",
    hint: "",
  },
  cold: {
    label: "بارد",
    subtitle: "انتعاش يوازن يومك بلمسة فاخرة",
    hint: "اسحب لاستكشاف المشروبات الباردة",
  },
};

type MenuSectionProps = {
  section: MenuSectionType;
  index: number;
};

export function MenuSection({ section, index }: MenuSectionProps) {
  const isSlider = section.layout === "slider";
  const copy = SECTION_COPY[section.id];
  const sectionNumber = String(index + 1).padStart(2, "0");

  return (
    <section id={section.id} className={`menu-section menu-section--${section.theme} menu-section--${section.layout}`}>
      {index > 0 && (
        <div className="section-separator" aria-hidden>
          <span className="section-separator__line" />
          <span className="section-separator__gem" />
          <span className="section-separator__line" />
        </div>
      )}

      <div className="section-panel">
        <header className="section-head">
          <motion.div
            className="section-header-meta"
            variants={sectionSubtitle}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <span className="section-eyebrow">{copy?.label}</span>
            <span className="section-index">{sectionNumber}</span>
          </motion.div>

          <motion.h2
            className="section-title"
            variants={sectionTitle}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            {section.title}
          </motion.h2>

          {copy?.subtitle && (
            <motion.p
              className="section-subtitle"
              variants={sectionSubtitle}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              {copy.subtitle}
            </motion.p>
          )}

          <div className="section-rule" aria-hidden>
            <span className="section-rule__line" />
            <span className="section-rule__gem" />
            <span className="section-rule__line" />
          </div>
        </header>

        <div className="section-body">
          {isSlider ? (
            <HorizontalRail hint={copy?.hint}>
              {section.items.map((item, itemIndex) => (
                <HorizontalRailItem key={item.id}>
                  <PremiumCard item={item} theme={section.theme} variant="slider" index={itemIndex} />
                </HorizontalRailItem>
              ))}
            </HorizontalRail>
          ) : (
            <motion.div
              className="items-grid"
              variants={gridContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {section.items.map((item, itemIndex) => (
                <motion.div key={item.id} variants={cardReveal}>
                  <PremiumCard item={item} theme={section.theme} variant="grid" index={itemIndex} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
