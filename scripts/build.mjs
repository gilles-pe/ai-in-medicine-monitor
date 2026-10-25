import { syncMonitorDocs } from './sync-monitor-docs.mjs';
import { prerenderTree } from './prerender.mjs';
import { mkdir, rm, cp, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
await syncMonitorDocs(root,{check:true});
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await writeFile(path.join(output, '.nojekyll'), '');
for (const name of ['index.html', 'styles.css', 'editorial.css', 'monitor.css', 'AGENTS.md', 'MONITOR_STANDARD.md', 'DESIGN.md', 'FUNCTIONALITY.md', 'TODO.md', 'VALIDATION_REPORT.md', 'app.js', 'favicon.svg', 'data', 'lib', 'news', 'fonts', 'og-image.png', 'about', 'impressum', 'datenschutz', 'assets']) {
  await cp(path.join(root, name), path.join(output, name), { recursive: true });
}
await mkdir(path.join(output,'docs'),{recursive:true});
await cp(path.join(root,'docs/MONITOR_DATA_STATUS.md'),path.join(output,'docs/MONITOR_DATA_STATUS.md'));
for (const name of ['data-entry-guide.md', 'EVIDENCE_TAGGING.md', 'decisions.md', 'implementation-status.md', 'news-editorial.md', 'NEWS_COVERAGE.md']) {
  await cp(path.join(root, 'docs', name), path.join(output, 'docs', name));
}
await prerenderTree(output);
const css = (await Promise.all(['styles.css', 'editorial.css', 'monitor.css'].map(name => readFile(path.join(output, name), 'utf8')))).join('\n');
await writeFile(path.join(output, 'site.css'), css);
// Returning visitors must not reuse a previous release's cached layout.
const stylesheet = 'site.' + createHash('sha256').update(css).digest('hex').slice(0,12) + '.css';
await writeFile(path.join(output, stylesheet), css);
// Above-the-fold rules so the introduction can paint without waiting for site.css.
// The full sheet then applies without blocking first paint. Keep the native
// module entry point: interactive behavior must also run in the published build.
const criticalCss = ':root{--paper:#faf8f1;--ink:#103641;--muted:#586c73;--line:#d7dcd4;--teal:#1d9185;--serif:Georgia,"Times New Roman",serif;--sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);font-size:15px;line-height:1.6}.shell{width:min(1180px,calc(100% - 36px));margin:auto}.masthead{display:flex;justify-content:space-between;align-items:center;padding:14px 0 9px;border-bottom:1px solid var(--line)}.masthead-author{margin:0;font:600 13px/1.3 var(--sans);color:var(--ink)}.masthead-author em{font-style:normal;color:var(--teal)}.menu-button{width:44px;height:44px;border:0;background:transparent}.intro{display:block;padding:14px 0 10px}.intro-copy h1{font:400 35px/1.06 var(--serif);letter-spacing:-1.2px;margin:0 0 10px;color:var(--ink)}.intro-copy h1 em{color:var(--teal);font-style:italic;display:block}.about-monitor{position:relative;padding-left:28px;font-size:14px;line-height:1.55;color:var(--muted)}.about-monitor>summary{position:absolute;left:-16px;top:-11px;width:44px;height:44px}.about-monitor>p{margin:0 0 9px}.evidence-reviewed{margin:11px 0 0;font-size:11.5px;color:var(--muted)}[hidden]{display:none!important}@media(min-width:861px){.shell{width:min(1180px,calc(100% - 96px))}.intro{display:grid;grid-template-columns:minmax(280px,42%) minmax(0,58%);gap:18px 28px;align-items:start;padding:18px 0 14px}.intro-copy h1{font-size:49px;line-height:1.05;letter-spacing:-1.4px;margin:0 0 14px}.about-monitor{font-size:12px;line-height:1.65}}';
for (const file of ['index.html', 'news/index.html']) {
  const filename = path.join(output, file);
  const prefix = file.startsWith('news/') ? '../' : './';
  const block = ['styles.css', 'editorial.css', 'monitor.css'].map(name => '<link rel="stylesheet" href="' + prefix + name + '">').join('\n  ');
  let html = await readFile(filename, 'utf8');
  if (!html.includes(block)) throw new Error('Stylesheet block missing in ' + file);
  const asyncCss = '<style>' + criticalCss + '</style>\n  <link rel="stylesheet" href="' + prefix + stylesheet + '" media="print" onload="this.media=\'all\'">\n  <noscript><link rel="stylesheet" href="' + prefix + stylesheet + '"></noscript>';
  html = html.replace(block, asyncCss);
  if (file === 'index.html') {
    if (!html.includes('<script type="module" src="./app.js"></script>')) throw new Error('Home module missing');
  }
  await writeFile(filename, html);
}
const html = await readFile(path.join(output, 'index.html'), 'utf8');
if (!html.includes('AI in Medicine')) throw new Error('Missing application title');
if (html.includes('fonts.googleapis.com')) throw new Error('External fonts must stay out of the build');
await stat(path.join(output, 'og-image.png'));
await stat(path.join(output, 'fonts/inter-latin.woff2'));
console.log('Static site packaged in dist/. No network services or secrets required.');
