import { useEffect, useState } from 'react'
import { getAllMenuImageUrls } from '../data/menu'

const BOOT_TIMEOUT_MS = 15000
const IMAGE_TIMEOUT_MS = 10000
const READY_HOLD_MS = 260
const BOOT_IMAGES = getAllMenuImageUrls()
const IMAGE_COUNT = Math.max(BOOT_IMAGES.length, 1)

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | undefined> {
  return Promise.race([
    promise,
    new Promise<undefined>((resolve) => setTimeout(resolve, ms)),
  ])
}

function preloadImage(url: string): Promise<void> {
  return withTimeout(
    new Promise<void>((resolve) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => resolve()
      img.onerror = () => resolve()
      img.src = url
    }),
    IMAGE_TIMEOUT_MS,
  ).then(() => undefined)
}

export function useAppBoot() {
  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let cancelled = false
    let finished = false
    let loadedCount = 0

    const bumpProgress = () => {
      if (cancelled) return
      loadedCount += 1
      const pct = Math.min(100, Math.round((loadedCount / IMAGE_COUNT) * 100))
      setProgress((prev) => Math.max(prev, pct))
    }

    const finish = () => {
      if (cancelled || finished) return
      finished = true
      window.clearTimeout(bootTimeout)
      setProgress(100)

      window.setTimeout(() => {
        if (!cancelled) setReady(true)
      }, READY_HOLD_MS)
    }

    const bootTimeout = window.setTimeout(finish, BOOT_TIMEOUT_MS)

    const loadAssets = async () => {
      await Promise.all(
        BOOT_IMAGES.map((url) => preloadImage(url).finally(bumpProgress)),
      )
      await withTimeout(document.fonts.ready, 3000).catch(() => undefined)
      finish()
    }

    loadAssets().catch(() => finish())

    return () => {
      cancelled = true
      window.clearTimeout(bootTimeout)
    }
  }, [])

  return { ready, progress }
}
