const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');
const template = fs.readFileSync(path.join(__dirname, '../public/sw.js'), 'utf8');
const root = 'https://example.test/Aynma-menu/';
const prefix = 'aynma-menu:/Aynma-menu/:';
const current = prefix + 'release-new';
const previous = prefix + 'release-old';
const build = { version: 'new', assets: [{ path: '', integrity: 'sha256-html' }, { path: '_next/static/app.css', integrity: 'sha256-css' }] };

function worker({ config = build, failInstall = false, clients = [], pendingNavigation = false } = {}) {
  const handlers = {};
  const stores = new Map();
  const downloads = [];
  const navigations = [];
  let skips = 0;
  let claims = 0;
  const cache = name => {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name);
    return {
      async match(request) { return store.get(typeof request === 'string' ? request : request.url)?.clone(); },
      async put(request, response) { store.set(typeof request === 'string' ? request : request.url, response); },
      async addAll(requests) {
        downloads.push(...requests);
        if (failInstall) throw new Error('CSS unavailable');
        for (const request of requests) store.set(request.url, new Response(request.url));
      },
    };
  };
  vm.runInNewContext(template.replace('const BUILD = null;', `const BUILD = ${JSON.stringify(config)};`), {
    URL, Request, Response, Set,
    self: {
      location: { href: root + 'sw.js' },
      addEventListener: (name, handler) => { handlers[name] = handler; },
      skipWaiting: async () => { skips++; },
      clients: {
        claim: async () => { claims++; },
        matchAll: async () => clients.map(url => ({ url, navigate: async target => {
          navigations.push(target);
          if (pendingNavigation) await new Promise(() => {});
        } })),
      },
    },
    caches: { open: async name => cache(name), keys: async () => [...stores.keys()], delete: async name => stores.delete(name) },
    fetch: async request => new Response('network:' + (request.url || request)),
  });
  return {
    stores, downloads, navigations, cache,
    get skips() { return skips; }, get claims() { return claims; },
    async run(name) {
      const waits = [];
      handlers[name]({ waitUntil: promise => waits.push(promise) });
      await Promise.all(waits);
    },
    async request(url, options = {}) {
      let response;
      const waits = [];
      handlers.fetch({ request: { url, method: 'GET', mode: 'cors', ...options },
        respondWith: value => { response = value; }, waitUntil: promise => waits.push(promise) });
      const result = await response;
      await Promise.all(waits);
      return result;
    },
  };
}

test('installs CSS and HTML together with integrity and HTTP cache bypass', async () => {
  const w = worker(); await w.run('install');
  assert.equal(w.downloads.length, 2);
  assert.ok(w.downloads.every(request => request.integrity && request.cache === 'reload'));
  assert.equal(w.skips, 1);
});

test('failed asset installation leaves the last working release untouched', async () => {
  const w = worker({ failInstall: true });
  await w.cache(previous).put(root, new Response('old working shell'));
  await assert.rejects(w.run('install'), /CSS unavailable/);
  assert.equal(w.skips, 0);
  assert.equal(w.stores.has(current), false);
  assert.equal(await (await w.cache(previous).match(root)).text(), 'old working shell');
});

test('navigation uses its installed HTML, even if the server has a newer release', async () => {
  const w = worker(); await w.run('install');
  await w.cache(current).put(root, new Response('consistent shell'));
  assert.equal(await (await w.request(root + '?from=installed', { mode: 'navigate' })).text(), 'consistent shell');
  assert.equal(await (await w.request(root + 'index.html', { mode: 'navigate' })).text(), 'consistent shell');
});

test('serves current styles and previous release chunks without the network', async () => {
  const w = worker(); await w.run('install');
  await w.cache(previous).put(root + '_next/static/old.js', new Response('old chunk'));
  assert.equal(await (await w.request(root + '_next/static/app.css')).text(), root + '_next/static/app.css');
  assert.equal(await (await w.request(root + '_next/static/old.js')).text(), 'old chunk');
});

test('migration repairs legacy clients and only removes this menu caches', async () => {
  const w = worker({ clients: [root, 'https://example.test/another-menu/'] });
  w.cache('another-site'); w.cache(prefix + 'v4'); w.cache(prefix + 'release-ancient'); w.cache(previous);
  await w.run('install'); await w.run('activate');
  assert.deepEqual([...w.stores.keys()], ['another-site', previous, current]);
  assert.deepEqual(w.navigations, [root]);
  assert.equal(w.claims, 1);
});

test('regular release activation does not reload active visitors', async () => {
  const w = worker({ clients: [root] }); w.cache(previous);
  await w.run('install'); await w.run('activate');
  assert.deepEqual(w.navigations, []);
});

test('legacy repair never blocks activation waiting for a client navigation', async () => {
  const w = worker({ clients: [root], pendingNavigation: true }); w.cache(prefix + 'v4');
  await w.run('install');
  await Promise.race([
    w.run('activate'),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Activation deadlock')), 100)),
  ]);
  assert.deepEqual(w.navigations, [root]);
});

test('does not intercept other origins, other apps, RSC requests or unknown pages', async () => {
  const w = worker(); await w.run('install');
  for (const url of ['https://other.test/Aynma-menu/', 'https://example.test/another/', root + '?_rsc=123']) {
    assert.equal(await w.request(url, { mode: 'navigate' }), undefined);
  }
  assert.equal(await w.request(root + 'missing', { mode: 'navigate' }), undefined);
});

test('non-export production build does not cache server HTML', async () => {
  const w = worker({ config: null });
  await w.run('install'); await w.run('activate');
  assert.equal(await w.request(root, { mode: 'navigate' }), undefined);
  assert.equal(w.downloads.length, 0);
});

test('build generator versions content, includes fonts/styles, excludes large photos', async () => {
  const { generateServiceWorker } = await import(pathToFileURL(path.join(__dirname, '../scripts/generate-service-worker.mjs')));
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'aynma-shell-test-'));
  try {
    for (const file of ['index.html', '_next/static/app.js', '_next/static/app.css', '_next/static/font.woff2', 'assets/coffee.jpg']) {
      fs.mkdirSync(path.dirname(path.join(directory, file)), { recursive: true });
      fs.writeFileSync(path.join(directory, file), file);
    }
    const first = generateServiceWorker(directory);
    assert.deepEqual(first.assets.map(asset => asset.path), ['_next/static/app.css', '_next/static/app.js', '_next/static/font.woff2', '']);
    assert.equal(generateServiceWorker(directory).version, first.version);
    fs.writeFileSync(path.join(directory, '_next/static/app.css'), 'updated CSS');
    assert.notEqual(generateServiceWorker(directory).version, first.version);
    fs.unlinkSync(path.join(directory, '_next/static/app.css'));
    assert.throws(() => generateServiceWorker(directory), /incomplete/);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});
