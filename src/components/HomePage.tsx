"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { flushSync } from "react-dom";
import { startMenuIdleReset } from "@/lib/menuIdle";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { MENU_SECTIONS, type MenuItem } from "@/data/menu";

const categories: Record<string, { label: string; en: string; line: string }> =
  {
    hot: {
      label: "المشروبات الحارة",
      en: "HOT COFFEE",
      line: "دفء في كل رشفة",
    },
    cold: {
      label: "المشروبات الباردة",
      en: "COLD DRINKS",
      line: "على ذوقك، وعلى البارد",
    },
    drip: {
      label: "القهوة المقطرة",
      en: "FILTER COFFEE",
      line: "قهوة تستحق التأني",
    },
    desserts: {
      label: "الحلا",
      en: "SOMETHING SWEET",
      line: "حلا يكمّل لحظتك",
    },
  };
const ease = [0.22, 1, 0.36, 1] as const;

function CategoryIcon({ name, size = 24 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "cold" ? (
        <path d="M6 8h12l-2 13H8L6 8ZM13 8l2-6h4M5 8h14M9 13h6" />
      ) : name === "drip" ? (
        <path d="m4 4 8 11 8-11H4ZM8 15v6h8v-6M3 21h18M8 4l4 11 4-11" />
      ) : name === "desserts" ? (
        <path d="M4 12h16v9H4zM4 12 16 5l4 7M4 16c3-3 5 3 8 0s5 2 8 0M16 5V3" />
      ) : (
        <path d="M4 9h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9ZM17 10h2a3 3 0 0 1 0 6h-2M7 3v3m4-4v4m4-3v3" />
      )}
    </svg>
  );
}

function MenuCard({
  item,
  index,
  category,
  onPreview,
}: {
  item: MenuItem;
  index: number;
  category: string;
  onPreview: (item: MenuItem) => void;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.article
      className={`menu-card ${item.image ? "" : "menu-card--illustrated"}`}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.045, ease }}
    >
      <div className="card-photo">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.nameAr}
            fill
            sizes="(max-width: 600px) 46vw, (max-width: 1000px) 30vw, 23vw"
            className="drink-photo"
          />
        ) : (
          <div className="card-illustration">
            <div className="illustration-ring">
              <CategoryIcon name={category} size={64} />
            </div>
            <span>AYNMA</span>
            <small>WITH YOU, WHEREVER</small>
          </div>
        )}
        <span className="card-number" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="card-caption">
        <h3>{item.nameAr}</h3>
        <span className="menu-price" aria-label={`${item.price} ريال سعودي`}>
          <b>{item.price}</b><span className="riyal-symbol" aria-hidden="true" />
        </span>
        <p lang="en" dir="ltr">{item.nameEn}</p>
      </div>
      {item.image && <button type="button" className="preview-trigger" aria-label={`تكبير صورة ${item.nameAr}`} onClick={() => onPreview(item)}><span aria-hidden="true">⤢</span></button>}
    </motion.article>
  );
}

export function HomePage() {
  const [category, setCategory] = useState("hot");
  const [preview, setPreview] = useState<MenuItem | null>(null);
  const previewDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!preview) return;
    const dialog = previewDialog.current;
    const originalOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = originalOverflow; };
  }, [preview]);
  const cover = useRef<HTMLElement>(null);
  const coverVisible = useInView(cover);
  const menu = useRef<HTMLElement>(null);
  const returnToStart = useRef(false);
  useEffect(() => startMenuIdleReset(() => {
    // Finish dialog cleanup before scrolling, so restored focus cannot jump back.
    returnToStart.current = false;
    flushSync(() => {
      setPreview(null);
      setCategory("hot");
    });
    cover.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (window.location.hash) {
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    }
  }), []);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: cover,
    offset: ["start start", "end start"],
  });
  const coverY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const coverScale = useTransform(scrollYProgress, [0, .85], [1, .8]);
  const beanSpread = useTransform(scrollYProgress, [0, 1], [1, 1.45]);
  const coverOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const section = MENU_SECTIONS.find((s) => s.id === category)!;
  const number = MENU_SECTIONS.indexOf(section) + 1;

  function selectCategory(id: string) {
    returnToStart.current = id !== category;
    setCategory(id);
    if (menu.current && menu.current.getBoundingClientRect().top < -20) {
      menu.current.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowLeft") next = (index + 1) % MENU_SECTIONS.length;
    else if (event.key === "ArrowRight")
      next = (index + MENU_SECTIONS.length - 1) % MENU_SECTIONS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = MENU_SECTIONS.length - 1;
    else return;
    event.preventDefault();
    selectCategory(MENU_SECTIONS[next].id);
    document
      .getElementById(`tab-${MENU_SECTIONS[next].id}`)
      ?.focus({ preventScroll: true });
  }

  return (
    <MotionConfig reducedMotion="user">
      <main>
        <section
          className={`menu-cover ${coverVisible ? "cover-awake" : "cover-paused"}`}
          ref={cover}
          tabIndex={-1}
          aria-label="أينما — غلاف المينيو"
        >
          <div className="cover-corner" lang="en">
            COFFEE & MORE
          </div>
          <div className="cover-corner cover-corner--left">قهوة، وأكثر</div>
          <motion.div className="coffee-beans" aria-hidden="true" style={reduced ? undefined : { scale: beanSpread, opacity: coverOpacity }}>
            {Array.from({ length: 8 }, (_, i) => <span key={i} className={`bean-path bean-path-${i + 1}`}><svg className="floating-bean" viewBox="0 0 60 88" fill="none"><ellipse cx="30" cy="44" rx="27" ry="41" fill="currentColor"/><path d="M35 6C7 27 49 56 24 82" stroke="#e9cdae" strokeWidth="4" strokeLinecap="round"/><path d="M18 15C7 29 8 44 12 51" stroke="#fff1d0" strokeOpacity=".2" strokeWidth="3" strokeLinecap="round"/></svg></span>)}
          </motion.div>
          <motion.div
            className="cover-brand"
            style={reduced ? undefined : { y: coverY, opacity: coverOpacity, scale: coverScale }}
          >
            <motion.span
              className="brand-flower"
              aria-hidden="true"
              initial={reduced ? false : { rotate: -60, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 1.3, ease }}
            >
              ✳
            </motion.span>
            <motion.h1
              initial={reduced ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease }}
              lang="en"
            >
              AYNMA
            </motion.h1>
            <p className="cover-arabic">أيـنـمـا</p>
            <span className="cover-rule" />
            <p className="cover-tagline">معك، أينما كنت.</p>
            <span className="cover-english" lang="en">
              WITH YOU, WHEREVER.
            </span>
          </motion.div>
          <a
            className="swipe-cue"
            href="#menu"
            aria-label="اسحب للأعلى لتصفح المينيو"
          >
            <span className="swipe-track" aria-hidden="true"><i /><i /></span>
            <span>اسحب للأعلى لتصفّح المينيو</span>
            <small lang="en">SCROLL TO EXPLORE</small>
          </a>
          <span className="cover-edition" lang="en">
            THE MENU
          </span>
        </section>
        <section
          id="menu"
          className={`menu-shell theme-${category}`}
          ref={menu}
          aria-label="مينيو أينما"
        >
          <div className="menu-dock">
            <div className="menu-brand">
              <span lang="en">AYNMA</span>
              <span>
                المينيو <i> / </i>
                <small lang="en">THE MENU</small>
              </span>
              <span className="dock-flower" aria-hidden="true">
                ✳
              </span>
            </div>
            <div
              className="category-tabs"
              role="tablist"
              aria-label="أقسام المينيو"
            >
              {MENU_SECTIONS.map((s, i) => (
                <button
                  type="button"
                  role="tab"
                  id={`tab-${s.id}`}
                  key={s.id}
                  aria-selected={category === s.id}
                  aria-controls="menu-panel"
                  tabIndex={category === s.id ? 0 : -1}
                  className={`category-tab ${category === s.id ? "active" : ""}`}
                  onClick={() => selectCategory(s.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                >
                  <span className="tab-icon"><CategoryIcon name={s.id} size={32} /></span>
                  <span>
                    {categories[s.id].label}
                    <small lang="en">{categories[s.id].en}</small>
                  </span>
                  <span className="tab-count">
                    {String(s.items.length).padStart(2, "0")}
                  </span>
                  {category === s.id && (
                    <motion.span
                      className="tab-background"
                      layoutId="category-background"
                      transition={{ duration: reduced ? 0 : 0.42, ease }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div
            className="menu-body"
            role="tabpanel"
            id="menu-panel"
            aria-labelledby={`tab-${category}`}
            tabIndex={0}
          >
            <div className="section-title">
              <div className="section-title-main">
                <span className="section-number" aria-hidden="true">
                  0{number}
                </span>
                <div>
                  <p lang="en">{categories[category].en}</p>
                  <h2>{categories[category].label}</h2>
                </div>
              </div>
              <div className="section-note">
                <span>{categories[category].line}</span>
                <small>{section.items.length} أصناف</small>
              </div>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="menu-grid"
                onAnimationComplete={(definition) => {
                  if (
                    typeof definition === "object" &&
                    "opacity" in definition &&
                    definition.opacity === 1 &&
                    returnToStart.current
                  ) {
                    menu.current?.scrollIntoView({
                      behavior: "instant",
                      block: "start",
                    });
                    returnToStart.current = false;
                  }
                }}
                key={category}
                initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -8 }}
                transition={{ duration: reduced ? 0 : 0.16 }}
              >
                {section.items.map((item, index) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    index={index}
                    category={category}
                    onPreview={setPreview}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
            <div className="menu-signoff" aria-hidden="true">
              <span />
              <b>✳</b>
              <span />
            </div>
          </div>
        </section>
      </main>
      <dialog className="image-lightbox" ref={previewDialog} aria-labelledby="preview-title" onClose={() => setPreview(null)} onClick={event => { if (event.target === event.currentTarget) setPreview(null); }}>
        {preview?.image && <div className="glass-preview">
          <button type="button" className="preview-close" autoFocus aria-label="إغلاق الصورة" onClick={() => setPreview(null)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg></button>
          <div className="preview-photo"><Image src={preview.image} alt={preview.nameAr} fill priority sizes="(max-width: 700px) 92vw, 900px" quality={90} /></div>
          <div className="preview-caption"><div><h2 id="preview-title">{preview.nameAr}</h2><p lang="en">{preview.nameEn}</p></div><span className="menu-price" aria-label={`${preview.price} ريال سعودي`}><b>{preview.price}</b><span className="riyal-symbol" aria-hidden="true" /></span></div>
        </div>}
      </dialog>
    </MotionConfig>
  );
}
