import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import type { MenuCategory, MenuItem } from '../data/menu'
import RiyalSymbol from './RiyalSymbol'
import MenuScrollHint from './MenuScrollHint'
import ScrollRails from './ScrollRails'
import './MenuCarousel.css'

interface MenuCarouselProps {
  items: MenuItem[]
  activeIndex: number
  direction: 1 | -1
  category: MenuCategory
}

const DURATION = 0.68
const CATEGORY_DURATION = 0.56
const INFO_IN_AT = 0.58

function setInfoContent(
  el: HTMLDivElement | null,
  item: MenuItem,
) {
  if (!el) return
  const title = el.querySelector('.dish-title')
  const amount = el.querySelector('.dish-price__amount')
  if (title) title.textContent = item.name
  if (amount) amount.textContent = String(item.price)
}

function preloadMenuImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    const done = () => resolve()
    img.onload = () => {
      if ('decode' in img) {
        img.decode().then(done).catch(done)
        return
      }
      done()
    }
    img.onerror = done
    img.src = src
  })
}

export default function MenuCarousel({
  items,
  activeIndex,
  direction,
  category,
}: MenuCarouselProps) {
  const [index, setIndex] = useState(activeIndex)
  const prevRef = useRef(activeIndex)
  const prevCategoryRef = useRef(category)
  const displayedItemRef = useRef<MenuItem | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const first = useRef(true)

  const stageRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  const currentImgRef = useRef<HTMLImageElement>(null)
  const nextImgRef = useRef<HTMLImageElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const infoNextRef = useRef<HTMLDivElement>(null)

  const item = items[index] ?? items[0]

  useEffect(() => {
    if (first.current) {
      first.current = false
      prevRef.current = activeIndex
      prevCategoryRef.current = category
      setIndex(activeIndex)
      displayedItemRef.current = items[activeIndex] ?? items[0] ?? null
      gsap.set(lineRef.current, { top: '100%', opacity: 0 })
      gsap.set(revealRef.current, { clipPath: 'inset(100% 0 0 0)' })
      gsap.set(stageRef.current, { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' })
      return
    }

    const categoryChanged = category !== prevCategoryRef.current
    if (!categoryChanged && activeIndex === prevRef.current) return

    let cancelled = false

    const forward = direction === 1
    const fromItem = displayedItemRef.current ?? items[prevRef.current] ?? items[0]
    const toItem = items[activeIndex] ?? items[0]

    timelineRef.current?.kill()

    const finish = () => {
      if (cancelled) return
      setIndex(activeIndex)
      prevRef.current = activeIndex
      prevCategoryRef.current = category
      displayedItemRef.current = toItem
      if (currentImgRef.current) currentImgRef.current.src = toItem.image
      setInfoContent(infoRef.current, toItem)
      gsap.set(revealRef.current, { clipPath: 'inset(100% 0 0 0)' })
      gsap.set(lineRef.current, { top: '100%', opacity: 0 })
      gsap.set(infoRef.current, { y: 0, opacity: 1 })
      gsap.set(infoNextRef.current, { opacity: 0, y: 0 })
      gsap.set(stageRef.current, { x: 0, scale: 1, opacity: 1, filter: 'blur(0px)' })
    }

    const run = async () => {
      if (currentImgRef.current) currentImgRef.current.src = fromItem.image
      await preloadMenuImage(toItem.image)
      if (cancelled) return

      if (nextImgRef.current) nextImgRef.current.src = toItem.image
      setInfoContent(infoNextRef.current, toItem)

      if (categoryChanged) {
        const exitX = forward ? -48 : 48
        const enterX = forward ? 56 : -56

        const tl = gsap.timeline({
          defaults: { ease: 'power3.inOut' },
          onComplete: finish,
        })
        timelineRef.current = tl

        tl.to(stageRef.current, {
          x: exitX,
          opacity: 0,
          scale: 0.96,
          filter: 'blur(4px)',
          duration: CATEGORY_DURATION * 0.42,
        }, 0)

        tl.call(() => {
          if (cancelled) return
          if (currentImgRef.current) currentImgRef.current.src = toItem.image
          setInfoContent(infoRef.current, toItem)
          gsap.set(infoRef.current, { y: 0, opacity: 1 })
          gsap.set(infoNextRef.current, { opacity: 0, y: 0 })
        }, [], CATEGORY_DURATION * 0.4)

        tl.fromTo(
          stageRef.current,
          { x: enterX, opacity: 0, scale: 0.97, filter: 'blur(6px)' },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: CATEGORY_DURATION * 0.58,
            ease: 'power4.out',
          },
          CATEGORY_DURATION * 0.38,
        )

        return
      }

      const progress = { value: forward ? 100 : 0 }

      gsap.set(revealRef.current, {
        clipPath: forward ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)',
      })
      gsap.set(lineRef.current, {
        top: forward ? '100%' : '0%',
        opacity: 0,
      })
      gsap.set(infoNextRef.current, { y: forward ? 24 : -24, opacity: 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: finish,
      })
      timelineRef.current = tl

      tl.to(lineRef.current, { opacity: 1, duration: 0.08 }, 0)

      tl.to(progress, {
        value: forward ? 0 : 100,
        duration: DURATION,
        ease: 'power3.inOut',
        onUpdate: () => {
          const p = progress.value
          if (forward) {
            gsap.set(revealRef.current, { clipPath: `inset(${p}% 0 0 0)` })
            gsap.set(lineRef.current, { top: `${p}%` })
          } else {
            gsap.set(revealRef.current, { clipPath: `inset(0 0 ${100 - p}% 0)` })
            gsap.set(lineRef.current, { top: `${p}%` })
          }
        },
      }, 0)

      tl.to(infoRef.current, {
        y: forward ? -28 : 28,
        opacity: 0,
        duration: DURATION * 0.28,
      }, 0.04)

      tl.to(infoNextRef.current, {
        y: 0,
        opacity: 1,
        duration: DURATION * 0.34,
      }, DURATION * INFO_IN_AT)

      tl.to(lineRef.current, { opacity: 0, duration: 0.14 }, DURATION - 0.1)
    }

    void run()

    return () => {
      cancelled = true
      timelineRef.current?.kill()
    }
  }, [activeIndex, direction, category, items])

  if (!item) return null

  return (
    <div className="menu-stage" ref={stageRef}>
      <div className="menu-stage__spacer menu-stage__spacer--top" aria-hidden />

      <div className="menu-stage__body">
        <div className="menu-visual">
          <ScrollRails activeIndex={activeIndex} itemCount={items.length} />
          <div className="arch">
            <div className="arch__wood" aria-hidden />

            <div className="arch__current">
              <img
                ref={currentImgRef}
                src={item.image}
                alt=""
                className="arch__img"
                draggable={false}
                decoding="async"
                loading="eager"
              />
            </div>

            <div className="arch__reveal" ref={revealRef}>
              <img
                ref={nextImgRef}
                src={item.image}
                alt=""
                className="arch__img"
                draggable={false}
                decoding="async"
                loading="eager"
              />
            </div>

            <div className="curtain-line" ref={lineRef} />
          </div>
        </div>

        <div className="info-block">
          <div className="info-panel info-panel--current" ref={infoRef}>
            <h2 className="dish-title">{item.name}</h2>
            <p className="dish-price">
              <span className="dish-price__amount">{item.price}</span>
              <RiyalSymbol className="dish-price__currency" />
            </p>
          </div>
          <div className="info-panel info-panel--next" ref={infoNextRef} aria-hidden>
            <h2 className="dish-title">{item.name}</h2>
            <p className="dish-price">
              <span className="dish-price__amount">{item.price}</span>
              <RiyalSymbol className="dish-price__currency" />
            </p>
          </div>
        </div>
      </div>

      <div className="menu-stage__spacer menu-stage__spacer--bottom">
        <MenuScrollHint activeIndex={activeIndex} />
      </div>
    </div>
  )
}
