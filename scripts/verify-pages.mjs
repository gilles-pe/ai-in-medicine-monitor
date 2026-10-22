import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MONITOR_PACKAGE_FILES } from '../lib/monitor-export.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const base = new URL('https://gilles-pe.github.io/ai-in-medicine-monitor/');
let checked = 0;

async function localTarget(reference, source) {
  if (!reference || /^(?:#|mailto:|data:|https?:)/i.test(reference)) return;
  const url = new URL(reference.replaceAll('&amp;', '&'), new URL(source, base));
  assert.ok(url.origin === base.origin && url.pathname.startsWith(base.pathname), `${source}: path leaves the project site: ${reference}`);
  let filename = path.join(root, decodeURIComponent(url.pathname.slice(base.pathname.length)));
  if ((await stat(filename)).isDirectory()) filename = path.join(filename, 'index.html');
  assert.ok((await stat(filename)).isFile(), `${source}: missing ${reference}`);
  checked++;
}

async function walk(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const filename = path.join(folder, entry.name);
    if (entry.isDirectory()) { await walk(filename); continue; }
    const relative = path.relative(root, filename).split(path.sep).join('/');
    if (entry.name.endsWith('.html')) {
      const text = await readFile(filename, 'utf8');
      for (const match of text.matchAll(/(?:href|src)="([^"]+)"/g)) await localTarget(match[1], relative);
    } else if (entry.name.endsWith('.js')) {
      const text = await readFile(filename, 'utf8');
      for (const match of text.matchAll(/\b(?:from\s*|import\s*)['"](\.{1,2}\/[^'"]+)['"]/g)) await localTarget(match[1], relative);
    }
  }
}

await walk(root);
for (const filename of MONITOR_PACKAGE_FILES) await localTarget('./' + filename, 'index.html');
await localTarget('./news/?lang=en', 'index.html');
await localTarget('../?lang=de', 'news/index.html');
await stat(path.join(root, '.nojekyll'));
console.log(`GitHub Pages: ${checked} local paths checked; dashboard, news, module imports and portable exports stay within /ai-in-medicine-monitor/.`);
