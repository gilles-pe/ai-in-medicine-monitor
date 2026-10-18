import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateMonitor } from './validate-monitor.mjs';

export const CONTRACT_START = '<!-- monitor-data-contract:start -->';
export const CONTRACT_END = '<!-- monitor-data-contract:end -->';
export const POLICY_FILES = ['AGENTS.md', 'MONITOR_STANDARD.md', 'DESIGN.md', 'VALIDATION_REPORT.md'];

export function monitorContract(data) {
  const { errors, summary } = validateMonitor(data);
  if (errors.length) throw new Error(errors.join('\n'));
  const hash = createHash('sha256').update(JSON.stringify(data)).digest('hex');
  return `${CONTRACT_START}\n## Generated data contract\n\nThis section is generated from \`data/monitor-data.json\`; do not edit it by hand. The original audit narrative is a dated snapshot; current counts are below.\n\n- Schema: ${data.meta.schemaVersion}\n- SHA-256 (parsed JSON): \`${hash}\`\n- Tracks / benchmark series / measurements: ${summary.tracks} / ${summary.series} / ${summary.points}\n- Score validation: ${summary.confirmed} confirmed, ${summary.reported} reported, ${summary.needsReview} under review\n- Main-line eligible scores: ${summary.eligible}; original-link gaps: ${summary.missingSourceLinks}\n- Chronology: ${summary.unknownEvaluationDates} unknown evaluation dates; ${summary.monthPrecisionReleaseDates} month-precision release proxies\n- Last evidence review: ${data.meta.lastReviewedAt}; last data change: ${data.meta.lastDataChangeAt}\n- Calendar positioning uses model availability proxies, not evaluation dates. Confirmed scores do not validate release-month chronology or source-publication dates and versions.\n- Frontier must be recalculated separately within each benchmark series. Pending and qualified-only records do not form a confirmed main line.\n- Source policy: MONITOR_STANDARD.md; interface: DESIGN.md; collaboration: AGENTS.md.\n\nRun \`node scripts/sync-monitor-docs.mjs\` after a JSON change, and \`node scripts/sync-monitor-docs.mjs --check\` before release. Structural checks do not constitute independent scientific validation or live URL verification.\n${CONTRACT_END}`;
}

export function applyContract(body, contract) {
  const first = body.indexOf(CONTRACT_START);
  const last = body.indexOf(CONTRACT_END);
  if (first < 0 && last < 0) return `${body.trimEnd()}\n\n${contract}\n`;
  if (first < 0 || last < first || body.indexOf(CONTRACT_START, first + CONTRACT_START.length) >= 0) throw new Error('Malformed generated data contract markers');
  return `${body.slice(0, first)}${contract}${body.slice(last + CONTRACT_END.length)}`;
}

export async function syncMonitorDocs(root, { check = false } = {}) {
  const data = JSON.parse(await readFile(resolve(root, 'data/monitor-data.json'), 'utf8'));
  const contract = monitorContract(data);
  const stale = [];
  for (const filename of POLICY_FILES) {
    const path = resolve(root, filename);
    const body = await readFile(path, 'utf8');
    const next = applyContract(body, contract);
    if (body !== next) { stale.push(filename); if (!check) await writeFile(path, next); }
  }
  const filename = 'docs/MONITOR_DATA_STATUS.md';
  const status = `# Portable monitor data status\n\n${contract}\n`;
  const path = resolve(root, filename);
  const current = await readFile(path, 'utf8').catch(error => error.code === 'ENOENT' ? '' : Promise.reject(error));
  if (current !== status) {
    stale.push(filename);
    if (!check) { await mkdir(dirname(path), { recursive: true }); await writeFile(path, status); }
  }
  if (check && stale.length) throw new Error(`Monitor documentation is stale: ${stale.join(', ')}. Run node scripts/sync-monitor-docs.mjs.`);
  return { changed: stale, check };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(await syncMonitorDocs(process.cwd(), { check: process.argv.includes('--check') }))); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
