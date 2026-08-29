"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import type { MenuItem, MenuTheme } from "@/data/menu";

const THEME_LABELS: Record<MenuTheme, string> = {
  default: "AYNMA",
  hot: "حار",
  cold: "بارد",
  sweets: "حلا",
  drip: "مقطرة",
};

function PriceTag({ price, theme }: { price: number; theme: MenuTheme }) {
  return (
    <div className={`price-tag price-tag--${theme}`}>
      <span className="price-amount">{price}</span>
      <Image src="/riyal.svg" className="price-currency" alt="" width={26} height={26} />
    </div>
  );
}

type PremiumCardProps = {
  item: MenuItem;
  theme: MenuTheme;
  variant?: "grid" | "slider";
  index?: number;
};

export function PremiumCard({ item, theme, variant = "grid", index = 0 }: PremiumCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [2.5, -2.5]), { stiffness: 120, damping: 32 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-2.5, 2.5]), { stiffness: 120, damping: 32 });

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const resetTilt = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      className={`premium-card premium-card--${theme} ${variant === "slider" ? "premium-card--slider" : ""}`}
      style={{ rotateX, rotateY, transformPerspective: 1600 }}
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      whileHover={{ y: -6, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div className="premium-card__glow" aria-hidden />
      <div className="premium-card__frame">
        <span className="premium-card__badge">{THEME_LABELS[theme]}</span>

        <div className="premium-card__media">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.nameAr}
              fill
              sizes={variant === "slider" ? "360px" : "(max-width: 600px) 48vw, 340px"}
              className="premium-card__image"
              priority={index < 2}
            />
          ) : (
            <div className="premium-card__placeholder" aria-hidden>
              <span className="premium-card__placeholder-mark">AYNMA</span>
              <span className="premium-card__placeholder-ring" />
            </div>
          )}
          <div className="premium-card__vignette" />
          <div className="premium-card__shine" aria-hidden />
        </div>

        <div className="premium-card__info">
          <div className="premium-card__text">
            <span className="premium-card__index">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="premium-card__name">{item.nameAr}</h3>
            <span className="premium-card__en">{item.nameEn}</span>
          </div>
          <PriceTag price={item.price} theme={theme} />
        </div>
      </div>
    </motion.article>
  );
}
