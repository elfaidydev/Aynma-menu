import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import HeroAmbience from './HeroAmbience'
import './Hero.css'

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.hero-ambience__shape', {
        scale: 0.4,
        opacity: 0,
        duration: 1.1,
        stagger: 0.06,
        ease: 'back.out(1.4)',
      }, 0.1)

      tl.from('.hero-ambience__ring', {
        scale: 0.85,
        opacity: 0,
        duration: 1.2,
      }, 0.15)

      tl.from('.intro__ar', { y: 22, opacity: 0, duration: 0.85 }, 0.35)
      tl.from('.intro__brand', { y: 36, opacity: 0, scale: 0.96, duration: 1.05 }, 0.48)
      tl.from('.intro__line', { scaleX: 0, duration: 0.7 }, 0.68)
      tl.from('.intro__tagline', { y: 12, opacity: 0, duration: 0.65 }, 0.82)
      tl.from('.intro__hint', { opacity: 0, y: 10, duration: 0.8 }, 1.05)
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="intro" ref={rootRef}>
      <HeroAmbience />

      <div className="intro__content">
        <p className="intro__ar">كوفي ايمنا</p>
        <h1 className="intro__brand intro__shine">AYNMA</h1>
        <div className="intro__line" />
        <p className="intro__tagline">قائمة اليوم</p>
      </div>

      <div className="intro__hint">
        <span className="intro__hint-text">اسحب للأعلى</span>
        <div className="intro__hint-line" />
      </div>
    </div>
  )
}
