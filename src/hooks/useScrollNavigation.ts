import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getCategoryIndex,
  getItemsByCategory,
  type MenuCategory,
} from '../data/menu'

export type Section = 'hero' | 'menu'

interface ScrollNavigation {
  section: Section
  activeCategory: MenuCategory
  activeIndex: number
  direction: 1 | -1
  isAnimating: boolean
  setCategory: (category: MenuCategory) => void
  goToItem: (index: number) => void
  enterMenu: () => void
  backToHero: () => void
  resetToHome: () => void
}

const SCROLL_THRESHOLD = 50
const ANIMATION_LOCK_MS = 1400

export function useScrollNavigation(): ScrollNavigation {
  const [section, setSection] = useState<Section>('hero')
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('desserts')
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [isAnimating, setIsAnimating] = useState(false)

  const scrollAccumulator = useRef(0)
  const lockedUntil = useRef(0)
  const touchStartY = useRef(0)

  const lock = useCallback(() => {
    setIsAnimating(true)
    lockedUntil.current = Date.now() + ANIMATION_LOCK_MS
    setTimeout(() => setIsAnimating(false), ANIMATION_LOCK_MS)
  }, [])

  const setCategory = useCallback(
    (category: MenuCategory) => {
      if (category === activeCategory && section === 'menu') return

      const fromIdx = getCategoryIndex(activeCategory)
      const toIdx = getCategoryIndex(category)
      setDirection(toIdx >= fromIdx ? 1 : -1)
      setActiveCategory(category)
      setActiveIndex(0)
      setSection('menu')
      lock()
    },
    [activeCategory, section, lock],
  )

  const goToItem = useCallback(
    (index: number) => {
      if (Date.now() < lockedUntil.current) return
      const items = getItemsByCategory(activeCategory)
      if (index < 0 || index >= items.length) return
      if (index === activeIndex && section === 'menu') return

      setDirection(index > activeIndex ? 1 : -1)
      setActiveIndex(index)
      setSection('menu')
      lock()
    },
    [activeCategory, activeIndex, section, lock],
  )

  const enterMenu = useCallback(() => {
    if (Date.now() < lockedUntil.current) return
    setDirection(1)
    setActiveCategory('desserts')
    setActiveIndex(0)
    setSection('menu')
    lock()
  }, [lock])

  const backToHero = useCallback(() => {
    if (Date.now() < lockedUntil.current) return
    setDirection(-1)
    setSection('hero')
    lock()
  }, [lock])

  const resetToHome = useCallback(() => {
    scrollAccumulator.current = 0
    lockedUntil.current = 0
    setIsAnimating(false)
    setDirection(-1)
    setActiveCategory('desserts')
    setActiveIndex(0)
    setSection('hero')
  }, [])

  const handleScrollIntent = useCallback(
    (delta: number) => {
      if (Date.now() < lockedUntil.current) return

      scrollAccumulator.current += delta

      if (Math.abs(scrollAccumulator.current) < SCROLL_THRESHOLD) return

      const scrollingDown = scrollAccumulator.current > 0
      scrollAccumulator.current = 0

      if (section === 'hero') {
        if (scrollingDown) enterMenu()
        return
      }

      const items = getItemsByCategory(activeCategory)

      if (scrollingDown) {
        if (activeIndex < items.length - 1) {
          goToItem(activeIndex + 1)
        }
      } else if (activeIndex > 0) {
        goToItem(activeIndex - 1)
      } else {
        backToHero()
      }
    },
    [section, activeCategory, activeIndex, enterMenu, backToHero, goToItem],
  )

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      handleScrollIntent(e.deltaY)
    }

    const isInteractive = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false
      return Boolean(target.closest('.port-nav, button, a, [role="button"]'))
    }

    const onTouchStart = (e: TouchEvent) => {
      if (isInteractive(e.target)) return
      touchStartY.current = e.touches[0].clientY
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (isInteractive(e.target)) return
      const delta = touchStartY.current - e.changedTouches[0].clientY
      if (Math.abs(delta) > 40) handleScrollIntent(delta * 2)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        handleScrollIntent(SCROLL_THRESHOLD + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        handleScrollIntent(-(SCROLL_THRESHOLD + 1))
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [handleScrollIntent])

  return {
    section,
    activeCategory,
    activeIndex,
    direction,
    isAnimating,
    setCategory,
    goToItem,
    enterMenu,
    backToHero,
    resetToHome,
  }
}
