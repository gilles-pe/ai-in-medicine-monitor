import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterMeasurements, latestByModel, groupComparable, frontierPoints,
  formatDate, escapeHtml, snapshotAt
} from '../lib/selectors.js';

const row = (overrides = {}) => ({
  id: 'a', date: '2025-01-01', score: 20, trackId: 'knowledge',
  subset: 'text', comparisonGroup: 'protocol-v1', model: 'Model A',
  system: 'base', isHuman: false, ...overrides
});

test('cutoff is inclusive, exact filters apply, and output is chronological', () => {
  const rows = [
    row({ id: 'future', date: '2025-01-03' }),
    row({ id: 'boundary', date: '2025-01-02' }),
    row({ id: 'mm', subset: 'mm' }),
    row({ id: 'other-track', trackId: 'autonomy' }),
    row({ id: 'first' })
  ];
  assert.deepEqual(filterMeasurements(rows, {
    cutoff: '2025-01-02', trackId: 'knowledge', subset: 'text'
  }).map(item => item.id), ['first', 'boundary']);
  assert.equal(rows[0].id, 'future', 'selectors must not mutate input');
});

test('malformed dates and missing, string or nonfinite scores are excluded', () => {
  const rows = [
    null, undefined, 'bad', {}, row({ date: '2025-02-30' }),
    row({ date: '2025-1-01' }), row({ score: null }), row({ score: '20' }),
    row({ score: NaN }), row({ score: Infinity }),
    row({ publishedAt: 'not-a-date' }), row({ id: 'zero', score: 0 })
  ];
  assert.deepEqual(filterMeasurements(rows).map(item => item.id), ['zero']);
  assert.deepEqual(filterMeasurements(null), []);
  assert.deepEqual(filterMeasurements(rows, { cutoff: 'invalid' }), []);
  assert.deepEqual(filterMeasurements(rows, { cutoff: '2025-02-29' }), []);
  assert.equal(filterMeasurements([row({ date: '2024-02-29' })]).length, 1);
});

test('latest result keeps distinct systems, protocols, tracks and human references', () => {
  const rows = [
    row({ id: 'old' }),
    row({ id: 'new', date: '2025-01-02', score: 25 }),
    row({ id: 'tools', system: 'web-tools' }),
    row({ id: 'protocol', comparisonGroup: 'protocol-v2' }),
    row({ id: 'track', trackId: 'assistance' }),
    row({ id: 'human', isHuman: true })
  ];
  assert.deepEqual(latestByModel(rows).map(item => item.id).sort(),
    ['human', 'new', 'protocol', 'tools', 'track'].sort());
  assert.deepEqual(latestByModel(undefined), []);
});

test('comparable groups stay separate, omit unknown groups, and sort their records', () => {
  const groups = groupComparable([
    row({ id: 'later', date: '2025-03-01' }),
    row({ id: 'other', comparisonGroup: 'protocol-v2' }),
    row({ id: 'early' }),
    row({ comparisonGroup: '' }), row({ comparisonGroup: null })
  ]);
  assert.equal(groups.length, 2);
  assert.deepEqual(groups.find(group => group.id === 'protocol-v1')
    .measurements.map(item => item.id), ['early', 'later']);
  assert.deepEqual(groupComparable([]), []);
});

test('frontier rejects mixed protocols even when one group only contains humans', () => {
  assert.throws(() => frontierPoints([
    row(), row({ comparisonGroup: 'protocol-v2', isHuman: true })
  ]), /one comparison group/);
});

test('frontier takes daily best AI score, preserves ties, and emits only improvements', () => {
  const rows = [
    row({ id: 'zero', score: 0 }),
    row({ id: 'day-one-best', score: 30 }),
    row({ id: 'human', score: 99, isHuman: true }),
    row({ id: 'lower', date: '2025-02-01', score: 25 }),
    row({ id: 'tie', date: '2025-03-01', score: 30 }),
    row({ id: 'best', date: '2025-04-01', score: 40 })
  ];
  const points = frontierPoints(rows);
  assert.deepEqual(points.map(point => [point.date, point.score]), [
    ['2025-01-01', 30], ['2025-04-01', 40]
  ]);
  assert.equal(points[0].measurement.id, 'day-one-best');
  assert.equal(frontierPoints([row({ score: 0 })])[0].score, 0);
  assert.deepEqual(frontierPoints([row({ isHuman: true })]), []);
  assert.deepEqual(frontierPoints([row({ comparisonGroup: undefined })]), []);
});

test('historical snapshots cannot see future records or unpublished evaluations', () => {
  const rows = [
    row({ id: 'known' }),
    row({ id: 'unpublished', date: '2024-12-01', publishedAt: '2025-03-01', score: 90 }),
    row({ id: 'future', date: '2025-04-01', score: 95 })
  ];
  assert.deepEqual(snapshotAt(rows, '2025-02-28').map(item => item.id), ['known']);
  const points = frontierPoints(snapshotAt(rows, '2025-03-01'));
  assert.deepEqual(points.map(point => [point.date, point.score]), [
    ['2025-01-01', 20], ['2025-03-01', 90]
  ]);
  assert.equal(points[1].measurement.date, '2024-12-01');
});

test('formatDate is UTC-stable and rejects invalid calendar dates', () => {
  assert.equal(formatDate('2025-01-01'), '01.01.2025');
  assert.equal(formatDate('2024-02-29'), '29.02.2024');
  assert.equal(formatDate('2025-02-29'), '–');
  assert.equal(formatDate(undefined), '–');
});

test('escapeHtml handles all HTML-sensitive characters and absent values', () => {
  assert.equal(escapeHtml('<a title="x" data-y=\'z\'>&</a>'),
    '&lt;a title=&quot;x&quot; data-y=&#39;z&#39;&gt;&amp;&lt;/a&gt;');
  assert.equal(escapeHtml(undefined), '');
  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml(0), '0');
});
