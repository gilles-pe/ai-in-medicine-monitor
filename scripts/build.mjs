import { syncMonitorDocs } from './sync-monitor-docs.mjs';
import { mkdir, rm, cp, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
await syncMonitorDocs(root,{check:true});
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of ['index.html', 'styles.css', 'editorial.css', 'monitor.css', 'AGENTS.md', 'MONITOR_STANDARD.md', 'DESIGN.md', 'VALIDATION_REPORT.md', 'app.js', 'favicon.svg', 'data', 'lib']) {
  await cp(path.join(root, name), path.join(output, name), { recursive: true });
}
await mkdir(path.join(output,'docs'),{recursive:true});
await cp(path.join(root,'docs/MONITOR_DATA_STATUS.md'),path.join(output,'docs/MONITOR_DATA_STATUS.md'));
const html = await readFile(path.join(output, 'index.html'), 'utf8');
if (!html.includes('AI in Medicine Monitor')) throw new Error('Missing application title');
console.log('Static site packaged in dist/. No network services or secrets required.');
