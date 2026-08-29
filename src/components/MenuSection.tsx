"use client";

import { motion } from "framer-motion";
import type { MenuSection as MenuSectionType } from "@/data/menu";
import { HorizontalRail, HorizontalRailItem } from "./HorizontalRail";
import { PremiumCard } from "./PremiumCard";
import { cardReveal, gridContainer, sectionTitle } from "@/lib/motion";

const SECTION_COPY: Record<string, { subtitle: string; hint: string; label: string }> = {
  hot: {
    label: "حار",
    subtitle: "دفء القهوة في أنقى صورها",
    hint: "",
  },
  cold: {
    label: "بارد",
    subtitle: "انتعاش يوازن يومك بلمسة فاخرة",
    hint: "اسحب لاستكشاف المشروبات البارده",
  },
  drip: {
    label: "مقطرة",
    subtitle: "قهوة مختارة بعناية — حار وبارد",
    hint: "",
  },
  desserts: {
    label: "حلا",
    subtitle: "حلا يكمل اللحظة بنكهة لا تنسى",
    hint: "اسحب لاستكشاف الحلا",
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
      <motion.header
        className="section-banner"
        variants={sectionTitle}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <span className="section-banner__line" aria-hidden />
        <div className="section-banner__content">
          <span className="section-banner__index">{sectionNumber}</span>
          <h2 className="section-banner__title">{section.title}</h2>
          {copy?.subtitle && <p className="section-banner__subtitle">{copy.subtitle}</p>}
        </div>
        <span className="section-banner__line" aria-hidden />
      </motion.header>

      <div className="section-panel">
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
