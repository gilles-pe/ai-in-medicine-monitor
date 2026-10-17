import { mkdir, rm, cp, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of ['index.html', 'styles.css', 'app.js', 'favicon.svg', 'data', 'lib']) {
  await cp(path.join(root, name), path.join(output, name), { recursive: true });
}
const html = await readFile(path.join(output, 'index.html'), 'utf8');
if (!html.includes('AI in Medicine Monitor')) throw new Error('Missing application title');
console.log('Static site packaged in dist/. No network services or secrets required.');
