"use client";

import type { MenuTheme } from "@/data/menu";

type ShineTextProps = {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "span";
  variant?: "brand" | MenuTheme;
};

export function ShineText({ children, className = "", as: Tag = "span", variant = "brand" }: ShineTextProps) {
  return (
    <Tag className={`shine-text shine-text--${variant} ${className}`.trim()} data-text={children}>
      <span className="shine-text__base">{children}</span>
      <span className="shine-text__beam" aria-hidden="true" />
      <span className="shine-text__highlight">{children}</span>
    </Tag>
  );
}
