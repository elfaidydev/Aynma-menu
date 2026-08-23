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

const SWIPE_MIN_PX = 64
const WHEEL_THRESHOLD = 55
const NAV_COOLDOWN_MS = 900
const WHEEL_IDLE_RESET_MS = 160
const TOUCH_WHEEL_GUARD_MS = 450

export function useScrollNavigation(): ScrollNavigation {
  const [section, setSection] = useState<Section>('hero')
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('desserts')
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [isAnimating, setIsAnimating] = useState(false)

  const lockedUntil = useRef(0)
  const wheelAccumulator = useRef(0)
  const wheelIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchWheelGuardUntil = useRef(0)
  const touchStartY = useRef(0)
  const touchActive = useRef(false)
  const touchHandled = useRef(false)

  const sectionRef = useRef(section)
  const activeCategoryRef = useRef(activeCategory)
  const activeIndexRef = useRef(activeIndex)

  sectionRef.current = section
  activeCategoryRef.current = activeCategory
  activeIndexRef.current = activeIndex

  const isLocked = useCallback(() => Date.now() < lockedUntil.current, [])

  const armCooldown = useCallback(() => {
    lockedUntil.current = Date.now() + NAV_COOLDOWN_MS
    setIsAnimating(true)
    window.setTimeout(() => setIsAnimating(false), NAV_COOLDOWN_MS)
  }, [])

  const resetWheelAccumulator = useCallback(() => {
    wheelAccumulator.current = 0
    if (wheelIdleTimer.current !== null) {
      clearTimeout(wheelIdleTimer.current)
      wheelIdleTimer.current = null
    }
  }, [])

  const setCategory = useCallback(
    (category: MenuCategory) => {
      if (category === activeCategory && section === 'menu') return
      if (isLocked()) return

      const fromIdx = getCategoryIndex(activeCategory)
      const toIdx = getCategoryIndex(category)
      setDirection(toIdx >= fromIdx ? 1 : -1)
      setActiveCategory(category)
      setActiveIndex(0)
      setSection('menu')
      resetWheelAccumulator()
      armCooldown()
    },
    [activeCategory, section, armCooldown, isLocked, resetWheelAccumulator],
  )

  const goToItem = useCallback(
    (index: number) => {
      if (isLocked()) return
      const items = getItemsByCategory(activeCategory)
      if (index < 0 || index >= items.length) return
      if (index === activeIndex && section === 'menu') return

      setDirection(index > activeIndex ? 1 : -1)
      setActiveIndex(index)
      setSection('menu')
      resetWheelAccumulator()
      armCooldown()
    },
    [activeCategory, activeIndex, section, armCooldown, isLocked, resetWheelAccumulator],
  )

  const enterMenu = useCallback(() => {
    if (isLocked()) return
    setDirection(1)
    setActiveCategory('desserts')
    setActiveIndex(0)
    setSection('menu')
    resetWheelAccumulator()
    armCooldown()
  }, [armCooldown, isLocked, resetWheelAccumulator])

  const backToHero = useCallback(() => {
    if (isLocked()) return
    setDirection(-1)
    setSection('hero')
    resetWheelAccumulator()
    armCooldown()
  }, [armCooldown, isLocked, resetWheelAccumulator])

  const resetToHome = useCallback(() => {
    lockedUntil.current = 0
    touchWheelGuardUntil.current = 0
    touchActive.current = false
    touchHandled.current = false
    resetWheelAccumulator()
    setIsAnimating(false)
    setDirection(-1)
    setActiveCategory('desserts')
    setActiveIndex(0)
    setSection('hero')
  }, [resetWheelAccumulator])

  const navigateOneStep = useCallback(
    (scrollingDown: boolean) => {
      if (isLocked()) return

      const currentSection = sectionRef.current
      const currentCategory = activeCategoryRef.current
      const currentIndex = activeIndexRef.current

      if (currentSection === 'hero') {
        if (scrollingDown) enterMenu()
        return
      }

      const items = getItemsByCategory(currentCategory)

      if (scrollingDown) {
        if (currentIndex < items.length - 1) {
          goToItem(currentIndex + 1)
        }
        return
      }

      if (currentIndex > 0) {
        goToItem(currentIndex - 1)
      } else {
        backToHero()
      }
    },
    [backToHero, enterMenu, goToItem, isLocked],
  )

  const handleWheel = useCallback(
    (deltaY: number) => {
      if (Date.now() < touchWheelGuardUntil.current) return
      if (isLocked()) {
        resetWheelAccumulator()
        return
      }

      wheelAccumulator.current += deltaY

      if (wheelIdleTimer.current !== null) {
        clearTimeout(wheelIdleTimer.current)
      }

      wheelIdleTimer.current = setTimeout(() => {
        wheelAccumulator.current = 0
        wheelIdleTimer.current = null
      }, WHEEL_IDLE_RESET_MS)

      if (Math.abs(wheelAccumulator.current) < WHEEL_THRESHOLD) return

      const scrollingDown = wheelAccumulator.current > 0
      resetWheelAccumulator()
      navigateOneStep(scrollingDown)
    },
    [isLocked, navigateOneStep, resetWheelAccumulator],
  )

  const handleTouchEnd = useCallback(
    (deltaY: number) => {
      touchActive.current = false
      if (touchHandled.current) return
      if (isLocked()) return
      if (Math.abs(deltaY) < SWIPE_MIN_PX) return

      touchHandled.current = true
      touchWheelGuardUntil.current = Date.now() + TOUCH_WHEEL_GUARD_MS
      resetWheelAccumulator()
      navigateOneStep(deltaY > 0)
    },
    [isLocked, navigateOneStep, resetWheelAccumulator],
  )

  useEffect(() => {
    const isInteractive = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false
      return Boolean(target.closest('.port-nav, button, a, [role="button"]'))
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      handleWheel(e.deltaY)
    }

    const onTouchStart = (e: TouchEvent) => {
      if (isInteractive(e.target)) return
      touchActive.current = true
      touchHandled.current = false
      touchStartY.current = e.touches[0].clientY
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (isInteractive(e.target)) return
      if (!touchActive.current) return
      const delta = touchStartY.current - e.changedTouches[0].clientY
      handleTouchEnd(delta)
    }

    const onTouchCancel = () => {
      touchActive.current = false
      touchHandled.current = false
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        if (!isLocked()) navigateOneStep(true)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        if (!isLocked()) navigateOneStep(false)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchCancel, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchCancel)
      window.removeEventListener('keydown', onKeyDown)
      resetWheelAccumulator()
    }
  }, [handleTouchEnd, handleWheel, isLocked, navigateOneStep, resetWheelAccumulator])

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
