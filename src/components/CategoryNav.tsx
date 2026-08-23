import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { categories, type MenuCategory } from '../data/menu'
import './CategoryNav.css'

interface CategoryNavProps {
  active: MenuCategory
  onChange: (category: MenuCategory) => void
}

const META: Record<MenuCategory, { num: string; labelEn: string }> = {
  desserts: { num: '٠١', labelEn: 'Desserts' },
  hot: { num: '٠٢', labelEn: 'Hot' },
  cold: { num: '٠٣', labelEn: 'Cold' },
}

function CategoryIcon({ category, active }: { category: MenuCategory; active: boolean }) {
  const cls = `port-nav__icon${active ? ' is-lit' : ''}`

  if (category === 'desserts') {
    return (
      <svg className={cls} viewBox="0 0 32 32" fill="none" aria-hidden>
        <path d="M7 20 H25 L23 14 C22 11 18 9 16 9 C14 9 10 11 9 14 Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 20 V22 C10 24 13 25 16 25 C19 25 22 24 22 22 V20" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="13" cy="12" r="1" fill="currentColor" />
        <circle cx="16" cy="11" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
      </svg>
    )
  }

  if (category === 'hot') {
    return (
      <svg className={cls} viewBox="0 0 32 32" fill="none" aria-hidden>
        <path d="M9 12 H23 V24 C23 26 20 27 16 27 C12 27 9 26 9 24 Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M23 15 H25 C28 15 29 17 29 19 C29 21 28 22 25 22" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 9 C12 7 14 5 16 5 C18 5 20 7 20 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg className={cls} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M11 7 L9 25 H23 L21 7 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 11 H20 M13 15 H19" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M22 9 L27 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export default function CategoryNav({ active, onChange }: CategoryNavProps) {
  const rootRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const moveIndicator = (animate = true) => {
    const idx = categories.findIndex((c) => c.id === active)
    const btn = itemRefs.current[idx]
    const track = trackRef.current
    const indicator = indicatorRef.current
    const glow = glowRef.current
    if (!btn || !track || !indicator) return

    const trackRect = track.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()
    const width = Math.max(btnRect.width * 0.52, 36)
    const x = btnRect.left - trackRect.left + (btnRect.width - width) / 2

    const props = { x, width, opacity: 1 }

    if (animate) {
      gsap.to(indicator, { ...props, duration: 0.7, ease: 'power3.inOut' })
      if (glow) {
        gsap.to(glow, { ...props, width: width * 2.2, x: x - width * 0.6, duration: 0.85, ease: 'power3.inOut' })
      }
    } else {
      gsap.set(indicator, props)
      if (glow) gsap.set(glow, { ...props, width: width * 2.2, x: x - width * 0.6 })
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.port-nav__crest', { scaleX: 0, duration: 0.9, ease: 'power3.inOut', delay: 0.05 })
      gsap.from('.port-nav__item', {
        y: 18,
        opacity: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: 'power3.out',
        delay: 0.15,
      })
      gsap.from('.port-nav__baseline', { scaleX: 0, duration: 0.8, ease: 'power3.inOut', delay: 0.2 })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    moveIndicator()
    const btn = itemRefs.current[categories.findIndex((c) => c.id === active)]
    if (btn) {
      gsap.fromTo(btn.querySelector('.port-nav__icon'), { scale: 0.85 }, { scale: 1, duration: 0.45, ease: 'back.out(2)' })
    }
  }, [active])

  useEffect(() => {
    const onResize = () => moveIndicator(false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [active])

  return (
    <nav className="port-nav" ref={rootRef} aria-label="أقسام المنيو">
      <div className="port-nav__crest" aria-hidden>
        <span className="port-nav__crest-line" />
        <span className="port-nav__crest-gem" />
        <span className="port-nav__crest-line" />
      </div>

      <div className="port-nav__track" ref={trackRef}>
        <div className="port-nav__glow" ref={glowRef} aria-hidden />
        <div className="port-nav__indicator" ref={indicatorRef} aria-hidden />
        <div className="port-nav__baseline" aria-hidden />

        {categories.map((cat, i) => (
          <div key={cat.id} className="port-nav__cell">
            {i > 0 && <span className="port-nav__ornament" aria-hidden />}
            <button
              type="button"
              ref={(el) => { itemRefs.current[i] = el }}
              className={`port-nav__item${active === cat.id ? ' is-active' : ''}`}
              onClick={() => active !== cat.id && onChange(cat.id)}
              onPointerDown={(e) => e.stopPropagation()}
              aria-current={active === cat.id ? 'true' : undefined}
            >
              <CategoryIcon category={cat.id} active={active === cat.id} />
              <span className="port-nav__label">{cat.label}</span>
              <span className="port-nav__meta">
                <span className="port-nav__num">{META[cat.id].num}</span>
                <span className="port-nav__en">{META[cat.id].labelEn}</span>
              </span>
            </button>
          </div>
        ))}
      </div>
    </nav>
  )
}
