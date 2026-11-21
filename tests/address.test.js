import test from 'node:test';
import assert from 'node:assert/strict';
import { appRootUrl, isSharePath, shareAddressPath } from '../lib/address.js';
import { findShareItem } from '../lib/share.js';
import { readFile } from 'node:fs/promises';

test('an opened data point shows its share endpoint, resolved against the app root', () => {
  assert.equal(shareAddressPath('lower-mai-dxo-2026', 'https://ai.gillespenning.com/?lang=en#x'), '/share/lower-mai-dxo-2026/');
  assert.equal(shareAddressPath('lower-mai-dxo-2026', 'https://ai.gillespenning.com/share/other/'), '/share/lower-mai-dxo-2026/');
  assert.equal(shareAddressPath('a', 'https://gilles-pe.github.io/ai-in-medicine-monitor/?cutoff=2026-01-01'), '/ai-in-medicine-monitor/share/a/');
});

test('appRootUrl strips the share path and keeps search/hash only on request', () => {
  const href = 'https://ai.gillespenning.com/share/x/?cutoff=2026-01-01#charts';
  assert.equal(appRootUrl(href), 'https://ai.gillespenning.com/');
  assert.equal(appRootUrl(href, { keepSearch: true }), 'https://ai.gillespenning.com/?cutoff=2026-01-01');
  assert.equal(isSharePath('/share/x/'), true);
  assert.equal(isSharePath('/news/'), false);
});

test('every linked milestone id resolves to a generated share item', async () => {
  const monitorData = JSON.parse(await readFile(new URL('../data/monitor-data.json', import.meta.url), 'utf8'));
  const newsData = JSON.parse(await readFile(new URL('../data/news.json', import.meta.url), 'utf8'));
  const { trackMilestones, trustContext } = await import('../data/track-milestones.js');
  for (const item of [...trackMilestones, trustContext]) {
    assert.ok(findShareItem(item.id, monitorData, newsData.items), `no share item for milestone ${item.id}`);
  }
});
