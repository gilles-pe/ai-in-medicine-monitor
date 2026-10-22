import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isMonitorDate, validateMonitor } from '../scripts/validate-monitor.mjs';
import { monitorContract, syncMonitorDocs } from '../scripts/sync-monitor-docs.mjs';

const sourceUrl = new URL('../data/monitor-data.json', import.meta.url);
const readData = async () => JSON.parse(await readFile(sourceUrl, 'utf8'));

test('portable monitor data meets the evidence/card contract without inventing dates', async () => {
  const data = await readData();
  const result = validateMonitor(data);
  assert.deepEqual(result.errors, []);
  assert.ok(result.summary.points >= 41, 'preserve imported observations when adding new evidence');
  assert.equal(result.summary.confirmed + result.summary.reported + result.summary.needsReview, result.summary.points);
  assert.ok(result.summary.eligible <= result.summary.confirmed);
  assert.equal(isMonitorDate('2026-02-29'), false);
  assert.equal(isMonitorDate('2024-02-29'), true);
  assert.equal(isMonitorDate('2026-13'), false);
});

test('false eligibility, duplicate ids, missing cards and insecure sources fail the contract', async () => {
  const data = await readData();
  const points = data.tracks[0].series[0].data;
  points[0].eligibleForMainline = true;
  points[1].id = points[0].id;
  points[0].explain.whatWasTested = '';
  points[0].sources[0].url = 'javascript:alert(1)';
  const { errors } = validateMonitor(data);
  assert.ok(errors.some(error => error.includes('eligible line point')));
  assert.ok(errors.some(error => error.includes('globally unique')));
  assert.ok(errors.some(error => error.includes('plain-language')));
  assert.ok(errors.some(error => error.includes('HTTPS')));
});

test('all policy documents and audit snapshot carry the current central-data contract', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  await syncMonitorDocs(root, { check: true });
});

test('documentation synchronization detects changed data and preserves policy text', async () => {
  const data = await readData();
  const root = await mkdtemp(join(tmpdir(), 'monitor-contract-'));
  try {
    await mkdir(join(root, 'data'));
    await writeFile(join(root, 'data/monitor-data.json'), JSON.stringify(data));
    for (const path of ['AGENTS.md', 'MONITOR_STANDARD.md', 'DESIGN.md', 'VALIDATION_REPORT.md']) await writeFile(join(root, path), '# Original policy\n');
    await assert.rejects(() => syncMonitorDocs(root, { check: true }), /stale/);
    await syncMonitorDocs(root);
    await syncMonitorDocs(root, { check: true });
    assert.ok((await readFile(join(root, 'AGENTS.md'), 'utf8')).startsWith('# Original policy\n'));
    const original = monitorContract(data);
    data.tracks[0].series[0].data[0].explain.whatWasTested += ' Updated explanation.';
    assert.notEqual(monitorContract(data), original);
    await writeFile(join(root, 'data/monitor-data.json'), JSON.stringify(data));
    await assert.rejects(() => syncMonitorDocs(root, { check: true }), /stale/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
