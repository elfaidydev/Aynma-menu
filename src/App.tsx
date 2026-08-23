import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useScrollNavigation } from './hooks/useScrollNavigation'
import { useIdleReset } from './hooks/useIdleReset'
import { getItemsByCategory } from './data/menu'
import Hero from './components/Hero'
import CategoryNav from './components/CategoryNav'
import MenuCarousel from './components/MenuCarousel'
import GridLines from './components/GridLines'
import CategoryAmbience from './components/CategoryAmbience'
import './App.css'

function App() {
  const {
    section,
    activeCategory,
    activeIndex,
    direction,
    setCategory,
    resetToHome,
  } = useScrollNavigation()

  useIdleReset({
    onIdle: resetToHome,
    enabled: section === 'menu',
  })

  const heroLayerRef = useRef<HTMLDivElement>(null)
  const menuLayerRef = useRef<HTMLDivElement>(null)
  const prevSection = useRef(section)

  const menuItems = getItemsByCategory(activeCategory)

  useEffect(() => {
    if (prevSection.current === section) return

    const enteringMenu = section === 'menu'
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } })

    if (enteringMenu) {
      tl.to(heroLayerRef.current, {
        y: -60,
        opacity: 0,
        duration: 0.85,
      })
      tl.fromTo(
        menuLayerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9 },
        0.12,
      )
    } else {
      tl.to(menuLayerRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.75,
      })
      tl.fromTo(
        heroLayerRef.current,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85 },
        0.12,
      )
    }

    prevSection.current = section
  }, [section])

  const showMenu = section === 'menu'

  return (
    <div className="app">
      <GridLines visible={showMenu} />

      <div
        className={`hero-layer${showMenu ? ' hero-layer--hidden' : ''}`}
        ref={heroLayerRef}
      >
        <Hero />
      </div>

      <div
        className={`menu-layer${showMenu ? ' menu-layer--active' : ''}`}
        ref={menuLayerRef}
        style={{ opacity: 0, pointerEvents: showMenu ? 'auto' : 'none' }}
      >
        <CategoryAmbience category={activeCategory} visible={showMenu} />
        <CategoryNav active={activeCategory} onChange={setCategory} />
        <MenuCarousel
          items={menuItems}
          activeIndex={activeIndex}
          direction={direction}
          category={activeCategory}
        />
      </div>
    </div>
  )
}

export default App
