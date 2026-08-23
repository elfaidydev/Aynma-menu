import { useEffect, useState } from 'react'
import { getAllMenuImageUrls } from '../data/menu'

const BOOT_TIMEOUT_MS = 15000
const IMAGE_TIMEOUT_MS = 10000
const READY_HOLD_MS = 180
const BOOT_IMAGES = getAllMenuImageUrls()
const IMAGE_COUNT = Math.max(BOOT_IMAGES.length, 1)

let bootPromise: Promise<void> | null = null

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
      img.onload = () => {
        if ('decode' in img) {
          img.decode().then(() => resolve()).catch(() => resolve())
          return
        }
        resolve()
      }
      img.onerror = () => resolve()
      img.src = url
    }),
    IMAGE_TIMEOUT_MS,
  ).then(() => undefined)
}

function runBoot(onProgress: (value: number) => void): Promise<void> {
  if (bootPromise) return bootPromise

  bootPromise = new Promise<void>((resolve) => {
    let loadedCount = 0
    let settled = false

    const bumpProgress = () => {
      loadedCount += 1
      const pct = Math.min(100, Math.round((loadedCount / IMAGE_COUNT) * 100))
      onProgress(pct)
    }

    const finish = () => {
      if (settled) return
      settled = true
      window.clearTimeout(bootTimeout)
      onProgress(100)
      resolve()
    }

    const bootTimeout = window.setTimeout(finish, BOOT_TIMEOUT_MS)

    const loadAssets = async () => {
      await Promise.all(
        BOOT_IMAGES.map((url) => preloadImage(url).finally(bumpProgress)),
      )
      await withTimeout(document.fonts.ready, 2000).catch(() => undefined)
      finish()
    }

    loadAssets().catch(finish)
  })

  return bootPromise
}

export function useAppBoot() {
  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let cancelled = false

    runBoot((value) => {
      if (!cancelled) {
        setProgress((prev) => Math.max(prev, value))
      }
    }).then(() => {
      if (cancelled) return
      window.setTimeout(() => {
        if (!cancelled) setReady(true)
      }, READY_HOLD_MS)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return { ready, progress }
}
