const APP_ROOT = new URL("./", self.location.href);
const CACHE_PREFIX = `aynma-menu:${APP_ROOT.pathname}:`;
const CACHE_NAME = `${CACHE_PREFIX}v4`;
const CORE_ASSETS = ["", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "favicon-32.png", "favicon-16.png", "riyal.svg"].map(path => new URL(path, APP_ROOT).href);

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== APP_ROOT.origin || !url.pathname.startsWith(APP_ROOT.pathname)) return;
  const path = url.pathname.slice(APP_ROOT.pathname.length);
  if (path.startsWith("_next/") || path.startsWith("__nextjs") || url.searchParams.has("_rsc")) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(APP_ROOT.href, copy)));
      }
      return response;
    }).catch(async () => (await caches.match(APP_ROOT.href)) || Response.error()));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => {
    const network = fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)));
      }
      return response;
    }).catch(() => cached || Response.error());
    event.waitUntil(network.then(() => undefined));
    return cached || network;
  }));
});
