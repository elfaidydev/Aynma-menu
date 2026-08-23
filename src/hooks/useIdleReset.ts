import { useCallback, useEffect, useRef } from 'react'

export const IDLE_RESET_MS = 5 * 60 * 1000

const ACTIVITY_EVENTS = [
  'pointerdown',
  'touchstart',
  'touchmove',
  'wheel',
  'keydown',
  'click',
] as const

interface UseIdleResetOptions {
  onIdle: () => void
  timeoutMs?: number
  enabled?: boolean
}

export function useIdleReset({
  onIdle,
  timeoutMs = IDLE_RESET_MS,
  enabled = true,
}: UseIdleResetOptions) {
  const onIdleRef = useRef(onIdle)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  onIdleRef.current = onIdle

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const schedule = useCallback(() => {
    clearTimer()
    if (!enabled) return

    timerRef.current = setTimeout(() => {
      timerRef.current = null
      onIdleRef.current()
    }, timeoutMs)
  }, [clearTimer, enabled, timeoutMs])

  const onActivity = useCallback(() => {
    schedule()
  }, [schedule])

  useEffect(() => {
    if (!enabled) {
      clearTimer()
      return
    }

    schedule()

    const listenerOpts: AddEventListenerOptions = { passive: true, capture: true }
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, onActivity, listenerOpts)
    })

    const onVisibilityChange = () => {
      if (document.hidden) {
        clearTimer()
        return
      }
      if (enabled) schedule()
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      clearTimer()
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, onActivity, listenerOpts)
      })
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [clearTimer, enabled, onActivity, schedule])
}
