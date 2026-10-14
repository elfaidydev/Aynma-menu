export const MENU_IDLE_MS = 3 * 60 * 1000;

/** One inactivity deadline for touch, pointer, keyboard and nested scrolling. */
export function startMenuIdleReset(onIdle: () => void): () => void {
  let deadline = Date.now() + MENU_IDLE_MS;
  let timer: ReturnType<typeof setTimeout>;
  let stopped = false;
  let expired = false;
  const events = ["pointerdown", "pointermove", "touchstart", "touchmove", "wheel", "scroll", "keydown", "click"] as const;

  const check = () => {
    clearTimeout(timer);
    if (stopped || expired) return;
    const remaining = deadline - Date.now();
    if (remaining > 0) {
      timer = setTimeout(check, remaining);
      return;
    }
    // Resume checks use wall-clock time if the browser suspended the timer.
    expired = true;
    onIdle();
  };
  const activity = () => {
    if (stopped) return;
    expired = false;
    deadline = Date.now() + MENU_IDLE_MS;
    clearTimeout(timer);
    timer = setTimeout(check, MENU_IDLE_MS);
  };
  const resume = () => {
    if (document.visibilityState === "visible") check();
  };

  events.forEach(event => window.addEventListener(event, activity, { passive: true, capture: true }));
  document.addEventListener("visibilitychange", resume);
  window.addEventListener("pageshow", resume);
  timer = setTimeout(check, MENU_IDLE_MS);

  return () => {
    stopped = true;
    clearTimeout(timer);
    events.forEach(event => window.removeEventListener(event, activity, true));
    document.removeEventListener("visibilitychange", resume);
    window.removeEventListener("pageshow", resume);
  };
}
