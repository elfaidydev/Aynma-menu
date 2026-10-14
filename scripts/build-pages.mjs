import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const repository = (process.env.GITHUB_REPOSITORY || 'elfaidydev/Aynma-menu').split('/').pop();
const configured = process.env.NEXT_PUBLIC_BASE_PATH;
const basePath = (configured ?? (/\.github\.io$/i.test(repository) ? '' : `/${repository}`)).replace(/\/+$/, '');
if (basePath && (!basePath.startsWith('/') || basePath.includes('..') || /[?#\s]/.test(basePath))) {
  throw new Error('NEXT_PUBLIC_BASE_PATH must be empty or an absolute URL path such as /Aynma-menu');
}
const result = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, GITHUB_PAGES: 'true', NEXT_PUBLIC_BASE_PATH: basePath },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
writeFileSync('out/.nojekyll', '');
console.log(`GitHub Pages export ready: out/ (base path: ${basePath || '/'})`);
