import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './AppLoader.css'

interface AppLoaderProps {
  visible: boolean
  progress: number
}

const ROLL_DURATION = 0.09

export default function AppLoader({ visible, progress }: AppLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const outRef = useRef<HTMLSpanElement>(null)
  const inRef = useRef<HTMLSpanElement>(null)
  const displayedRef = useRef(0)
  const targetRef = useRef(0)
  const rollingRef = useRef(false)
  const animRef = useRef<gsap.core.Animation | null>(null)
  const [displayed, setDisplayed] = useState(0)
  const [gone, setGone] = useState(false)

  const rollOnce = useCallback(() => {
    const outgoing = outRef.current
    const incoming = inRef.current
    if (!outgoing || !incoming) return

    const current = displayedRef.current
    const target = targetRef.current

    if (current >= target) {
      rollingRef.current = false
      return
    }

    const next = current + 1
    rollingRef.current = true

    outgoing.textContent = String(current)
    incoming.textContent = String(next)

    animRef.current?.kill()

    animRef.current = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        displayedRef.current = next
        setDisplayed(next)
        outgoing.textContent = String(next)
        gsap.set(incoming, { yPercent: 0, opacity: 1 })
        gsap.set(outgoing, { yPercent: 0, opacity: 0 })

        if (displayedRef.current < targetRef.current) {
          rollOnce()
        } else {
          rollingRef.current = false
        }
      },
    })
      .set(incoming, { yPercent: -100, opacity: 0 })
      .set(outgoing, { yPercent: 0, opacity: 1 })
      .to(outgoing, { yPercent: 100, opacity: 0, duration: ROLL_DURATION }, 0)
      .to(incoming, { yPercent: 0, opacity: 1, duration: ROLL_DURATION }, 0)
  }, [])

  useEffect(() => {
    if (!visible || !rootRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.boot__counter', {
        opacity: 0,
        y: 8,
        duration: 0.65,
        ease: 'power3.out',
      })
    }, rootRef)

    return () => ctx.revert()
  }, [visible])

  useEffect(() => {
    targetRef.current = Math.min(100, Math.max(0, Math.round(progress)))
    if (!rollingRef.current) rollOnce()
  }, [progress, rollOnce])

  useEffect(() => {
    if (visible || gone) return
    if (!rootRef.current) return

    animRef.current?.kill()
    rollingRef.current = false

    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.55,
      ease: 'power2.inOut',
      onComplete: () => setGone(true),
    })
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
        <div className="boot__slot">
          <span className="boot__num boot__num--out" ref={outRef}>0</span>
          <span className="boot__num boot__num--in" ref={inRef}>0</span>
        </div>
        <span className="boot__sign">%</span>
      </div>
    </div>
  )
}
