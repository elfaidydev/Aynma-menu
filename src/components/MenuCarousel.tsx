import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
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

type ImageLayer = {
  wrap: RefObject<HTMLDivElement | null>
  img: RefObject<HTMLImageElement | null>
}

function setInfoContent(el: HTMLDivElement | null, item: MenuItem) {
  if (!el) return
  const title = el.querySelector('.dish-title')
  const amount = el.querySelector('.dish-price__amount')
  if (title) title.textContent = item.name
  if (amount) amount.textContent = String(item.price)
}

function setImageSrc(img: HTMLImageElement | null, src: string) {
  if (!img) return
  if (img.getAttribute('src') === src) return
  img.setAttribute('src', src)
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

function setLayerStack(settled: ImageLayer, incoming: ImageLayer) {
  gsap.set(settled.wrap.current, { zIndex: 2, clipPath: 'inset(0% 0 0 0)' })
  gsap.set(incoming.wrap.current, { zIndex: 1, clipPath: 'inset(100% 0 0 0)' })
}

export default function MenuCarousel({
  items,
  activeIndex,
  direction,
  category,
}: MenuCarouselProps) {
  const initialItem = items[activeIndex] ?? items[0]
  const [displayedItem, setDisplayedItem] = useState<MenuItem | null>(initialItem ?? null)

  const prevRef = useRef(activeIndex)
  const prevCategoryRef = useRef(category)
  const displayedItemRef = useRef<MenuItem | null>(initialItem ?? null)
  const settledIsA = useRef(true)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const first = useRef(true)

  const stageRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const layerA: ImageLayer = {
    wrap: useRef<HTMLDivElement>(null),
    img: useRef<HTMLImageElement>(null),
  }
  const layerB: ImageLayer = {
    wrap: useRef<HTMLDivElement>(null),
    img: useRef<HTMLImageElement>(null),
  }
  const infoRef = useRef<HTMLDivElement>(null)

  const getLayers = () => {
    if (settledIsA.current) {
      return { settled: layerA, incoming: layerB }
    }
    return { settled: layerB, incoming: layerA }
  }

  useLayoutEffect(() => {
    const item = displayedItemRef.current
    if (!item) return
    setImageSrc(layerA.img.current, item.image)
    setImageSrc(layerB.img.current, item.image)
    setLayerStack(layerA, layerB)
  }, [])

  useEffect(() => {
    if (first.current) {
      first.current = false
      const item = items[activeIndex] ?? items[0]
      if (item) {
        setImageSrc(layerA.img.current, item.image)
        setImageSrc(layerB.img.current, item.image)
        displayedItemRef.current = item
        setDisplayedItem(item)
        setInfoContent(infoRef.current, item)
      }
      prevRef.current = activeIndex
      prevCategoryRef.current = category
      settledIsA.current = true
      setLayerStack(layerA, layerB)
      gsap.set(lineRef.current, { top: '100%', opacity: 0 })
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

    const commitDisplayedItem = () => {
      if (cancelled) return
      prevRef.current = activeIndex
      prevCategoryRef.current = category
      displayedItemRef.current = toItem
      setDisplayedItem(toItem)
      setInfoContent(infoRef.current, toItem)
      gsap.set(infoRef.current, { y: 0, opacity: 1 })
      gsap.set(stageRef.current, { x: 0, scale: 1, opacity: 1, filter: 'blur(0px)' })
    }

    const settleItemTransition = () => {
      if (cancelled) return
      settledIsA.current = !settledIsA.current
      const { settled, incoming } = getLayers()
      setLayerStack(settled, incoming)
      gsap.set(lineRef.current, { top: '100%', opacity: 0 })
      commitDisplayedItem()
    }

    const finishCategoryTransition = () => {
      if (cancelled) return
      const { settled, incoming } = getLayers()
      setImageSrc(settled.img.current, toItem.image)
      setImageSrc(incoming.img.current, toItem.image)
      setLayerStack(settled, incoming)
      gsap.set(lineRef.current, { top: '100%', opacity: 0 })
      commitDisplayedItem()
    }

    const run = async () => {
      const { settled, incoming } = getLayers()

      setImageSrc(settled.img.current, fromItem.image)
      await preloadMenuImage(toItem.image)
      if (cancelled) return

      setImageSrc(incoming.img.current, toItem.image)

      if (categoryChanged) {
        const exitX = forward ? -48 : 48
        const enterX = forward ? 56 : -56

        const tl = gsap.timeline({
          defaults: { ease: 'power3.inOut' },
          onComplete: finishCategoryTransition,
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
          setImageSrc(settled.img.current, toItem.image)
          setInfoContent(infoRef.current, toItem)
          gsap.set(infoRef.current, { y: 0, opacity: 1 })
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
      const incomingWrap = incoming.wrap.current

      gsap.set(incoming.wrap.current, {
        zIndex: 2,
        clipPath: forward ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)',
      })
      gsap.set(settled.wrap.current, { zIndex: 1 })
      gsap.set(lineRef.current, {
        top: forward ? '100%' : '0%',
        opacity: 0,
      })

      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: settleItemTransition,
      })
      timelineRef.current = tl

      tl.to(lineRef.current, { opacity: 1, duration: 0.08 }, 0)

      tl.to(progress, {
        value: forward ? 0 : 100,
        duration: DURATION,
        ease: 'power3.inOut',
        onUpdate: () => {
          const p = progress.value
          if (!incomingWrap) return
          if (forward) {
            gsap.set(incomingWrap, { clipPath: `inset(${p}% 0 0 0)` })
            gsap.set(lineRef.current, { top: `${p}%` })
          } else {
            gsap.set(incomingWrap, { clipPath: `inset(0 0 ${100 - p}% 0)` })
            gsap.set(lineRef.current, { top: `${p}%` })
          }
        },
      }, 0)

      tl.to(lineRef.current, { opacity: 0, duration: 0.14 }, DURATION - 0.1)
    }

    void run()

    return () => {
      cancelled = true
      timelineRef.current?.kill()
    }
  }, [activeIndex, direction, category, items])

  if (!displayedItem) return null

  return (
    <div className="menu-stage" ref={stageRef}>
      <div className="menu-stage__spacer menu-stage__spacer--top" aria-hidden />

      <div className="menu-stage__body">
        <div className="menu-visual">
          <ScrollRails activeIndex={activeIndex} itemCount={items.length} />
          <div className="arch">
            <div className="arch__wood" aria-hidden />

            <div className="arch__layer" ref={layerA.wrap}>
              <img
                ref={layerA.img}
                alt=""
                className="arch__img"
                draggable={false}
                decoding="sync"
              />
            </div>

            <div className="arch__layer arch__layer--incoming" ref={layerB.wrap}>
              <img
                ref={layerB.img}
                alt=""
                className="arch__img"
                draggable={false}
                decoding="sync"
              />
            </div>

            <div className="curtain-line" ref={lineRef} />
          </div>
        </div>

        <div className="info-block">
          <div className="info-panel info-panel--current" ref={infoRef}>
            <h2 className="dish-title">{displayedItem.name}</h2>
            <p className="dish-price">
              <span className="dish-price__amount">{displayedItem.price}</span>
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
