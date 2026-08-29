"use client";

import { useEffect, useState, type ReactNode } from "react";

const ICONS: Record<string, ReactNode> = {
  sweets: (
    <svg className="nav-icon" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.8" fill="none">
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
      <path d="M2 21h20" />
    </svg>
  ),
  hot: (
    <svg className="nav-icon" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.8" fill="none">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    </svg>
  ),
  cold: (
    <svg className="nav-icon" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.8" fill="none">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  drip: (
    <svg className="nav-icon" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.8" fill="none">
      <path d="M8 2h8v4l-2 14H10L8 6V2z" />
      <path d="M6 6h12" />
      <path d="M10 14c0 2 1.5 3 2 3s2-1 2-3" />
    </svg>
  ),
};

type NavigationProps = {
  items: ReadonlyArray<{ id: string; label: string; icon: string }>;
  activeSection: string;
  defaultSection: string;
  onNavigate: (sectionId: string) => void;
};

export function Navigation({ items, activeSection, defaultSection, onNavigate }: NavigationProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const resolvedActiveSection = isMounted ? activeSection : defaultSection;

  return (
    <nav id="main-nav">
      <div className="nav-capsule">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`nav-item ${resolvedActiveSection === item.id ? "active" : ""}`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(item.id);
            }}
          >
            {ICONS[item.icon]}
            <span className="text">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
