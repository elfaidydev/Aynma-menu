"use client";

import { motion } from "framer-motion";
import type { MenuSection as MenuSectionType } from "@/data/menu";
import { ShineText } from "@/components/ShineText";
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
  const shimmerDelay = `${index * 0.85}s`;

  return (
    <section id={section.id} className={`menu-section menu-section--${section.theme} menu-section--${section.layout}`}>
      <motion.header
        id={`${section.id}-headline`}
        className="section-headline"
        style={{ "--shimmer-delay": shimmerDelay } as React.CSSProperties}
        variants={sectionTitle}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2, margin: "0px 0px -80px 0px" }}
      >
        <ShineText as="h2" className="section-headline__title" variant={section.theme}>
          {section.title}
        </ShineText>
        <span className="section-headline__rule" aria-hidden />
      </motion.header>

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
    </section>
  );
}
