import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function generateServiceWorker(directory) {
  const files = [];
  const walk = (relative = '') => {
    for (const entry of readdirSync(join(directory, relative), { withFileTypes: true })) {
      const path = relative ? `${relative}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(path);
      else if (path === 'index.html' || path === 'manifest.webmanifest'
        || /^_next\/static\/.*\.(?:js|css|woff2?|ttf|otf|svg)$/.test(path)
        || /^(?:icon-\d+|apple-touch-icon|favicon-\d+)\.png$/.test(path)
        || path === 'riyal.svg') files.push(path);
    }
  };
  walk();
  if (!files.includes('index.html') || !files.some(file => file.endsWith('.css'))
    || !files.some(file => file.endsWith('.js'))) {
    throw new Error('Cannot publish an incomplete menu app shell');
  }
  const assets = files.sort().map(path => ({
    path: path === 'index.html' ? '' : path,
    integrity: `sha256-${createHash('sha256').update(readFileSync(join(directory, path))).digest('base64')}`,
  }));
  const template = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');
  const version = createHash('sha256').update(template).update(JSON.stringify(assets)).digest('hex').slice(0, 20);
  writeFileSync(join(directory, 'sw.js'), template.replace('const BUILD = null;', `const BUILD = ${JSON.stringify({ version, assets })};`));
  console.log(`Offline app shell ready: ${assets.length} files, release ${version}`);
  return { version, assets };
}
