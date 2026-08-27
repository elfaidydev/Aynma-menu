"use client";

type ShineTextProps = {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "span";
};

export function ShineText({ children, className = "", as: Tag = "span" }: ShineTextProps) {
  return (
    <Tag className={`shine-text ${className}`.trim()} data-text={children}>
      <span className="shine-text__base">{children}</span>
      <span className="shine-text__beam" aria-hidden="true" />
      <span className="shine-text__highlight">{children}</span>
    </Tag>
  );
}
