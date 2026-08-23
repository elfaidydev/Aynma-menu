import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './AppLoader.css'

interface AppLoaderProps {
  visible: boolean
  progress: number
}

export default function AppLoader({ visible, progress }: AppLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [displayed, setDisplayed] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    setDisplayed(Math.min(100, Math.max(0, Math.round(progress))))
  }, [progress])

  useEffect(() => {
    if (!visible || !rootRef.current || gone) return

    const ctx = gsap.context(() => {
      gsap.from('.boot__counter', {
        opacity: 0,
        y: 8,
        duration: 0.45,
        ease: 'power3.out',
      })
    }, rootRef)

    return () => ctx.revert()
  }, [visible, gone])

  useEffect(() => {
    if (visible || gone || !rootRef.current) return

    const node = rootRef.current
    const fallback = window.setTimeout(() => setGone(true), 650)

    gsap.to(node, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        window.clearTimeout(fallback)
        setGone(true)
      },
    })

    return () => {
      window.clearTimeout(fallback)
      gsap.killTweensOf(node)
    }
  }, [visible, gone])

  if (gone) return null

  return (
    <div
      className={`boot${visible ? ' boot--active' : ' boot--leaving'}`}
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label={`جاري التحميل ${displayed}%`}
    >
      <div className="boot__counter" dir="ltr">
        <span className="boot__value">{displayed}</span>
        <span className="boot__sign">%</span>
      </div>
    </div>
  )
}
