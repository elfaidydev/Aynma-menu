import { useEffect, useState } from 'react'
import './MenuScrollHint.css'

interface MenuScrollHintProps {
  activeIndex: number
}

export default function MenuScrollHint({ activeIndex }: MenuScrollHintProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const hide = () => setVisible(false)

    window.addEventListener('wheel', hide, { once: true, passive: true })
    window.addEventListener('touchend', hide, { once: true, passive: true })
    window.addEventListener('keydown', hide, { once: true })

    return () => {
      window.removeEventListener('wheel', hide)
      window.removeEventListener('touchend', hide)
      window.removeEventListener('keydown', hide)
    }
  }, [])

  if (!visible) return null

  const label = activeIndex === 0 ? 'اسحب للأعلى للرجوع' : 'اسحب للأعلى'

  return (
    <div className="menu-hint" aria-hidden>
      <span className="menu-hint__text">{label}</span>
      <div className="menu-hint__line" />
    </div>
  )
}
