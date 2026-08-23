import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import type { MenuCategory } from '../data/menu'
import './CategoryAmbience.css'

interface CategoryAmbienceProps {
  category: MenuCategory
  visible: boolean
}

type IconName =
  | 'cupcake' | 'donut' | 'macaron' | 'cherry' | 'sparkle' | 'cake' | 'cookie' | 'croissant' | 'candy'
  | 'mug' | 'steam' | 'bean' | 'kettle' | 'thermo' | 'press' | 'flame' | 'cup'
  | 'glass' | 'ice' | 'lemon' | 'snow' | 'drop' | 'bubble' | 'straw' | 'mint' | 'cube'

type Placement = {
  icon: IconName
  top?: string
  left?: string
  right?: string
  bottom?: string
  size: 'sm' | 'md' | 'lg'
  rot: number
  delay: number
  float: 'a' | 'b' | 'c'
}

const DESSERTS: Placement[] = [
  { icon: 'cupcake', top: '12%', left: '4%', size: 'lg', rot: -14, delay: 0, float: 'a' },
  { icon: 'donut', top: '6%', right: '5%', size: 'md', rot: 18, delay: -2, float: 'b' },
  { icon: 'macaron', bottom: '16%', left: '6%', size: 'lg', rot: 8, delay: -4, float: 'c' },
  { icon: 'cherry', bottom: '10%', right: '4%', size: 'md', rot: -10, delay: -1.5, float: 'a' },
  { icon: 'sparkle', top: '40%', left: '2%', size: 'sm', rot: 0, delay: -3, float: 'b' },
  { icon: 'cake', top: '36%', right: '3%', size: 'lg', rot: 12, delay: -5, float: 'c' },
  { icon: 'cookie', top: '22%', left: '14%', size: 'sm', rot: 22, delay: -1, float: 'a' },
  { icon: 'croissant', top: '18%', right: '14%', size: 'md', rot: -18, delay: -3.5, float: 'b' },
  { icon: 'candy', bottom: '28%', left: '2%', size: 'sm', rot: 15, delay: -2.5, float: 'c' },
  { icon: 'donut', bottom: '22%', right: '12%', size: 'sm', rot: -8, delay: -6, float: 'a' },
  { icon: 'macaron', top: '52%', left: '10%', size: 'sm', rot: -6, delay: -4.5, float: 'b' },
  { icon: 'sparkle', top: '8%', left: '38%', size: 'sm', rot: 12, delay: -7, float: 'c' },
  { icon: 'cupcake', bottom: '6%', left: '28%', size: 'sm', rot: 10, delay: -2.2, float: 'a' },
  { icon: 'cherry', top: '48%', right: '8%', size: 'sm', rot: -14, delay: -5.5, float: 'b' },
]

const HOT: Placement[] = [
  { icon: 'mug', top: '14%', left: '5%', size: 'lg', rot: -8, delay: 0, float: 'a' },
  { icon: 'steam', top: '8%', right: '6%', size: 'md', rot: 0, delay: -2.2, float: 'b' },
  { icon: 'bean', bottom: '18%', left: '5%', size: 'md', rot: 22, delay: -3.5, float: 'c' },
  { icon: 'kettle', bottom: '12%', right: '4%', size: 'lg', rot: -6, delay: -1, float: 'a' },
  { icon: 'thermo', top: '42%', right: '2%', size: 'sm', rot: 8, delay: -4.5, float: 'b' },
  { icon: 'steam', top: '38%', left: '3%', size: 'md', rot: 0, delay: -0.8, float: 'c' },
  { icon: 'press', top: '20%', left: '12%', size: 'md', rot: -12, delay: -2, float: 'a' },
  { icon: 'flame', top: '16%', right: '13%', size: 'sm', rot: 0, delay: -4, float: 'b' },
  { icon: 'cup', bottom: '26%', left: '2%', size: 'sm', rot: 14, delay: -3, float: 'c' },
  { icon: 'bean', bottom: '8%', right: '14%', size: 'sm', rot: -20, delay: -5, float: 'a' },
  { icon: 'mug', top: '50%', left: '9%', size: 'sm', rot: 6, delay: -6.5, float: 'b' },
  { icon: 'steam', top: '6%', left: '36%', size: 'sm', rot: 0, delay: -1.8, float: 'c' },
  { icon: 'kettle', bottom: '5%', left: '26%', size: 'sm', rot: -10, delay: -7, float: 'a' },
  { icon: 'flame', top: '46%', right: '10%', size: 'sm', rot: 0, delay: -3.8, float: 'b' },
]

const COLD: Placement[] = [
  { icon: 'glass', top: '13%', left: '4%', size: 'lg', rot: -12, delay: 0, float: 'a' },
  { icon: 'ice', top: '7%', right: '5%', size: 'md', rot: 0, delay: -1.8, float: 'b' },
  { icon: 'lemon', bottom: '16%', left: '5%', size: 'lg', rot: 10, delay: -3.2, float: 'c' },
  { icon: 'snow', bottom: '10%', right: '5%', size: 'md', rot: 0, delay: -2.5, float: 'a' },
  { icon: 'drop', top: '41%', left: '2%', size: 'sm', rot: 0, delay: -4, float: 'b' },
  { icon: 'bubble', top: '37%', right: '3%', size: 'md', rot: 0, delay: -0.6, float: 'c' },
  { icon: 'straw', top: '19%', left: '13%', size: 'sm', rot: 18, delay: -2, float: 'a' },
  { icon: 'mint', top: '15%', right: '12%', size: 'sm', rot: -8, delay: -4.5, float: 'b' },
  { icon: 'cube', bottom: '24%', left: '2%', size: 'sm', rot: 12, delay: -3, float: 'c' },
  { icon: 'snow', bottom: '7%', right: '13%', size: 'sm', rot: 0, delay: -5.5, float: 'a' },
  { icon: 'glass', top: '49%', left: '8%', size: 'sm', rot: 8, delay: -6, float: 'b' },
  { icon: 'bubble', top: '5%', left: '35%', size: 'sm', rot: 0, delay: -1.2, float: 'c' },
  { icon: 'lemon', bottom: '5%', left: '24%', size: 'sm', rot: -6, delay: -7, float: 'a' },
  { icon: 'drop', top: '47%', right: '9%', size: 'sm', rot: 0, delay: -3.5, float: 'b' },
]

const PLACEMENTS: Record<MenuCategory, Placement[]> = {
  desserts: DESSERTS,
  hot: HOT,
  cold: COLD,
}

function AmbienceIcon({ name }: { name: IconName }) {
  switch (name) {
    case 'cupcake':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M14 38 H50 L46 28 C44 22 38 18 32 18 C26 18 20 22 18 28 Z" stroke="currentColor" strokeWidth="2" />
          <path d="M20 38 V42 C20 46 25 48 32 48 C39 48 44 46 44 42 V38" stroke="currentColor" strokeWidth="2" />
          <circle cx="24" cy="24" r="2" fill="currentColor" />
          <circle cx="32" cy="22" r="2" fill="currentColor" />
          <circle cx="40" cy="24" r="2" fill="currentColor" />
        </svg>
      )
    case 'donut':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2" />
          <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'macaron':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <ellipse cx="32" cy="36" rx="22" ry="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 36 C14 26 22 20 32 20 C42 20 50 26 52 36" stroke="currentColor" strokeWidth="2" />
          <path d="M10 36 H54" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'cherry':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <circle cx="24" cy="40" r="10" stroke="currentColor" strokeWidth="2" />
          <circle cx="42" cy="42" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M24 30 C28 18 32 12 34 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M42 32 C38 20 34 14 34 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'sparkle':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M32 8 L34 28 L54 32 L34 36 L32 56 L30 36 L10 32 L30 28 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      )
    case 'cake':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M12 44 H52 V48 H12 Z" stroke="currentColor" strokeWidth="2" />
          <path d="M14 44 V32 C14 26 22 22 32 22 C42 22 50 26 50 32 V44" stroke="currentColor" strokeWidth="2" />
          <path d="M14 34 H50 M16 28 H48" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'cookie':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2" />
          <circle cx="24" cy="26" r="2.5" fill="currentColor" />
          <circle cx="38" cy="28" r="2.5" fill="currentColor" />
          <circle cx="30" cy="40" r="2.5" fill="currentColor" />
        </svg>
      )
    case 'croissant':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M12 40 C18 22 30 14 44 18 C54 21 58 32 52 42 C46 52 30 56 18 48 C10 42 8 46 12 40 Z" stroke="currentColor" strokeWidth="2" />
          <path d="M20 38 C28 28 38 24 48 26" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'candy':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <rect x="22" y="26" width="20" height="12" rx="4" stroke="currentColor" strokeWidth="2" />
          <path d="M22 32 H10 M42 32 H54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'mug':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M16 24 H44 V46 C44 50 40 52 30 52 C20 52 16 50 16 46 Z" stroke="currentColor" strokeWidth="2" />
          <path d="M44 30 H48 C54 30 56 34 56 38 C56 42 54 44 48 44" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'steam':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M20 40 C16 32 18 24 22 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M32 42 C28 32 30 22 34 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M44 40 C40 30 42 20 46 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'bean':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M20 32 C20 20 28 12 38 12 C48 12 52 22 48 34 C44 46 34 52 26 48 C18 44 20 32 20 32 Z" stroke="currentColor" strokeWidth="2" />
          <path d="M26 20 C34 24 40 32 42 42" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'kettle':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <ellipse cx="30" cy="38" rx="18" ry="14" stroke="currentColor" strokeWidth="2" />
          <path d="M12 38 H48 M30 24 V16 M42 20 L50 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'thermo':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <rect x="28" y="12" width="8" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
          <circle cx="32" cy="48" r="8" stroke="currentColor" strokeWidth="2" />
          <path d="M32 20 V40" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'press':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <rect x="20" y="28" width="24" height="22" rx="3" stroke="currentColor" strokeWidth="2" />
          <path d="M24 28 V18 H40 V28" stroke="currentColor" strokeWidth="2" />
          <path d="M32 12 V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'flame':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M32 10 C26 22 18 28 18 38 C18 48 24 54 32 54 C40 54 46 48 46 38 C46 28 38 22 32 10 Z" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'cup':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M20 22 H44 V42 C44 46 38 48 32 48 C26 48 20 46 20 42 Z" stroke="currentColor" strokeWidth="2" />
          <path d="M20 28 H44" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'glass':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M22 14 L18 50 H46 L42 14 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M24 22 H40 M26 30 H38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    case 'ice':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <rect x="18" y="18" width="16" height="16" rx="3" transform="rotate(12 26 26)" stroke="currentColor" strokeWidth="2" />
          <rect x="34" y="22" width="14" height="14" rx="3" transform="rotate(-8 41 29)" stroke="currentColor" strokeWidth="2" />
          <rect x="24" y="36" width="15" height="15" rx="3" transform="rotate(20 31.5 43.5)" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'lemon':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <circle cx="32" cy="34" r="18" stroke="currentColor" strokeWidth="2" />
          <path d="M32 16 V52 M16 34 H48" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'snow':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M32 10 V54 M10 32 H54 M16 16 L48 48 M48 16 L16 48" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'drop':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M32 12 C24 28 18 36 18 42 C18 50 24 54 32 54 C40 54 46 50 46 42 C46 36 40 28 32 12 Z" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'bubble':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <circle cx="20" cy="40" r="6" stroke="currentColor" strokeWidth="2" />
          <circle cx="34" cy="30" r="9" stroke="currentColor" strokeWidth="2" />
          <circle cx="48" cy="42" r="5" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'straw':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M38 12 L26 52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M38 12 C42 14 44 18 42 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'mint':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M32 48 C20 38 14 28 18 18 C24 24 30 22 32 28 C34 22 40 24 46 18 C50 28 44 38 32 48 Z" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'cube':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <rect x="22" y="22" width="20" height="20" rx="4" transform="rotate(15 32 32)" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    default:
      return null
  }
}

function PlacedIcon({ placement, index }: { placement: Placement; index: number }) {
  const { icon, size, rot, delay, float, top, left, right, bottom } = placement

  return (
    <div
      className={`ambience__icon ambience__icon--${size} ambience__float--${float}`}
      style={{
        top,
        left,
        right,
        bottom,
        ['--amb-rot' as string]: `${rot}deg`,
        animationDelay: `${delay}s`,
      }}
      key={`${icon}-${index}`}
    >
      <AmbienceIcon name={icon} />
    </div>
  )
}

export default function CategoryAmbience({ category, visible }: CategoryAmbienceProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const prevCategory = useRef(category)

  useEffect(() => {
    if (!visible || prevCategory.current === category) return

    const el = rootRef.current
    if (!el) return

    gsap.fromTo(
      el,
      { opacity: 0 },
      { opacity: 1, duration: 0.7, ease: 'power2.out' },
    )

    prevCategory.current = category
  }, [category, visible])

  if (!visible) return null

  return (
    <div
      className={`category-ambience category-ambience--${category}`}
      ref={rootRef}
      aria-hidden
    >
      {PLACEMENTS[category].map((placement, index) => (
        <PlacedIcon key={`${placement.icon}-${index}`} placement={placement} index={index} />
      ))}
    </div>
  )
}
