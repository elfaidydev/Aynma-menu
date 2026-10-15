// The Pages build injects a content-versioned, integrity-checked app shell.
// Without an export manifest (next start), do not cache server-rendered HTML.
const BUILD = null; // Injected by scripts/generate-service-worker.mjs
const APP_ROOT = new URL("./", self.location.href);
const CACHE_PREFIX = `aynma-menu:${APP_ROOT.pathname}:`;
const RELEASE_PREFIX = `${CACHE_PREFIX}release-`;
const CACHE_NAME = BUILD ? `${RELEASE_PREFIX}${BUILD.version}` : null;
const IMAGE_CACHE = `${CACHE_PREFIX}images`;
const assetURL = path => new URL(path, APP_ROOT).href;
const shellURLs = new Set(BUILD ? BUILD.assets.map(asset => assetURL(asset.path)) : []);

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    if (BUILD) {
      const cache = await caches.open(CACHE_NAME);
      try {
        // A failed/stale CDN response must never replace a working app shell.
        await cache.addAll(BUILD.assets.map(asset => new Request(assetURL(asset.path), {
          cache: "reload", integrity: asset.integrity,
        })));
      } catch (error) {
        await caches.delete(CACHE_NAME);
        throw error;
      }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const legacy = keys.filter(key => key.startsWith(CACHE_PREFIX)
      && !key.startsWith(RELEASE_PREFIX) && key !== IMAGE_CACHE);
    // Keep one previous shell for tabs already open during an update.
    const previous = keys.filter(key => key.startsWith(RELEASE_PREFIX) && key !== CACHE_NAME).pop();
    const keep = new Set(BUILD ? [CACHE_NAME, IMAGE_CACHE, previous] : []);
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && !keep.has(key))
      .map(key => caches.delete(key)));
    await self.clients.claim();
    // One-time repair of the old HTML-only cache, even if missing JS prevented
    // hydration. Future updates do not interrupt visitors.
    if (legacy.length) {
      const clients = await self.clients.matchAll({ type: "window" });
      clients.filter(client => {
        const url = new URL(client.url);
        return url.origin === APP_ROOT.origin && url.pathname.startsWith(APP_ROOT.pathname);
      }).forEach(client => {
        // Navigation fetches wait for activation; awaiting them here deadlocks it.
        void client.navigate(client.url).catch(() => undefined);
      });
    }
  })());
});

async function shellResponse(url) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(url);
  if (cached) return cached;
  // If storage was evicted, never return an unrelated release's HTML/assets.
  const asset = BUILD.assets.find(asset => assetURL(asset.path) === url);
  return fetch(new Request(url, { cache: "reload", integrity: asset.integrity }));
}

self.addEventListener("fetch", event => {
  if (!BUILD || event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== APP_ROOT.origin || !url.pathname.startsWith(APP_ROOT.pathname)
    || url.searchParams.has("_rsc")) return;
  const path = url.pathname.slice(APP_ROOT.pathname.length);
  if (event.request.mode === "navigate") {
    if (path === "" || path === "index.html") {
      // HTML and assets always come from one fully installed release.
      event.respondWith(shellResponse(APP_ROOT.href));
    }
    return;
  }
  if (shellURLs.has(url.href)) {
    event.respondWith(shellResponse(url.href));
    return;
  }
  if (path.startsWith("_next/static/")) {
    event.respondWith((async () => {
      const keys = await caches.keys();
      for (const key of keys.filter(key => key.startsWith(RELEASE_PREFIX))) {
        const cached = await (await caches.open(key)).match(event.request);
        if (cached) return cached;
      }
      return fetch(event.request);
    })());
    return;
  }
  if (path.startsWith("assets/") && event.request.destination === "image") {
    // Cache large product photos as viewed, without blocking app installation.
    const cached = caches.open(IMAGE_CACHE).then(cache => cache.match(event.request)).catch(() => undefined);
    const network = fetch(event.request).then(async response => {
      if (response.ok && response.headers.get("content-type")?.startsWith("image/")) {
        try {
          const cache = await caches.open(IMAGE_CACHE);
          await cache.put(event.request, response.clone());
        } catch {
          // Full/disabled storage must not prevent an online photo from loading.
        }
      }
      return response;
    });
    event.waitUntil(network.then(() => undefined, () => undefined));
    event.respondWith(cached.then(response => response || network).catch(() => Response.error()));
  }
});
