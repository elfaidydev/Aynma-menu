import './HeroAmbience.css'

type IconName = 'bean' | 'mug' | 'steam' | 'cup' | 'croissant' | 'donut' | 'leaf' | 'sparkle' | 'drop' | 'cake'

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

const PLACEMENTS: Placement[] = [
  { icon: 'bean', top: '8%', left: '6%', size: 'lg', rot: -18, delay: 0, float: 'a' },
  { icon: 'mug', top: '14%', right: '7%', size: 'md', rot: 12, delay: -2, float: 'b' },
  { icon: 'steam', top: '22%', left: '14%', size: 'sm', rot: 0, delay: -4, float: 'c' },
  { icon: 'croissant', bottom: '18%', left: '5%', size: 'md', rot: 20, delay: -1.5, float: 'a' },
  { icon: 'donut', bottom: '12%', right: '6%', size: 'lg', rot: -10, float: 'b', delay: -3 },
  { icon: 'leaf', top: '38%', left: '3%', size: 'sm', rot: -8, delay: -5, float: 'c' },
  { icon: 'sparkle', top: '32%', right: '4%', size: 'sm', rot: 0, delay: -2.5, float: 'a' },
  { icon: 'cup', bottom: '28%', right: '14%', size: 'sm', rot: 14, delay: -6, float: 'b' },
  { icon: 'cake', top: '48%', left: '10%', size: 'sm', rot: 8, delay: -3.5, float: 'c' },
  { icon: 'bean', bottom: '8%', left: '22%', size: 'sm', rot: 32, delay: -7, float: 'a' },
  { icon: 'drop', top: '6%', left: '38%', size: 'sm', rot: 0, delay: -1, float: 'b' },
  { icon: 'steam', bottom: '6%', right: '28%', size: 'sm', rot: 0, delay: -4.5, float: 'c' },
  { icon: 'mug', top: '52%', right: '9%', size: 'sm', rot: -6, delay: -5.5, float: 'a' },
  { icon: 'donut', top: '10%', left: '72%', size: 'sm', rot: 16, delay: -2.8, float: 'b' },
]

function Icon({ name }: { name: IconName }) {
  switch (name) {
    case 'bean':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M20 32 C20 20 28 12 38 12 C48 12 52 22 48 34 C44 46 34 52 26 48 C18 44 20 32 20 32 Z" stroke="currentColor" strokeWidth="2" />
          <path d="M26 20 C34 24 40 32 42 42" stroke="currentColor" strokeWidth="1.5" />
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
    case 'cup':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M20 22 H44 V42 C44 46 38 48 32 48 C26 48 20 46 20 42 Z" stroke="currentColor" strokeWidth="2" />
          <path d="M20 28 H44" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'croissant':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M12 40 C18 22 30 14 44 18 C54 21 58 32 52 42 C46 52 30 56 18 48 C10 42 8 46 12 40 Z" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'donut':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2" />
          <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'leaf':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M32 52 C14 40 10 24 20 12 C28 20 30 18 32 26 C34 18 38 20 46 12 C54 24 50 40 32 52 Z" stroke="currentColor" strokeWidth="2" />
          <path d="M32 26 V52" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'sparkle':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M32 8 L34 28 L54 32 L34 36 L32 56 L30 36 L10 32 L30 28 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      )
    case 'drop':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M32 12 C24 28 18 36 18 42 C18 50 24 54 32 54 C40 54 46 50 46 42 C46 36 40 28 32 12 Z" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'cake':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden>
          <path d="M12 44 H52 V48 H12 Z" stroke="currentColor" strokeWidth="2" />
          <path d="M14 44 V32 C14 26 22 22 32 22 C42 22 50 26 50 32 V44" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    default:
      return null
  }
}

export default function HeroAmbience() {
  return (
    <div className="hero-ambience" aria-hidden>
      <div className="hero-ambience__orb hero-ambience__orb--1" />
      <div className="hero-ambience__orb hero-ambience__orb--2" />
      <div className="hero-ambience__ring" />

      {PLACEMENTS.map((p, i) => (
        <div
          key={`${p.icon}-${i}`}
          className={`hero-ambience__icon hero-ambience__icon--${p.size} hero-ambience__float--${p.float} hero-ambience__shape`}
          style={{
            top: p.top,
            left: p.left,
            right: p.right,
            bottom: p.bottom,
            ['--amb-rot' as string]: `${p.rot}deg`,
            animationDelay: `${p.delay}s`,
          }}
        >
          <Icon name={p.icon} />
        </div>
      ))}
    </div>
  )
}
