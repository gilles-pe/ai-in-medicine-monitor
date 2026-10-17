import test from 'node:test';
import assert from 'node:assert/strict';
import { tracks, measurements, sourceCatalog, milestones, editorialStatus } from '../data/evidence.js';
import { filterMeasurements, groupComparable, frontierPoints } from '../lib/selectors.js';

test('every curated measurement has a unique ID, source, metric and explicit test context', () => {
  const ids = new Set();
  for (const row of measurements) {
    assert.ok(!ids.has(row.id), 'duplicate measurement ID');
    ids.add(row.id);
    assert.ok(tracks.some(track => track.id === row.trackId));
    assert.ok(sourceCatalog.some(source => source.id === row.sourceId));
    assert.ok(Number.isFinite(row.score) && row.score >= 0 && row.score <= 100);
    assert.ok(row.comparisonGroup && row.benchmarkVersion && row.setting && row.limitations);
    assert.ok(['benchmark', 'simulation'].includes(row.environment));
    assert.equal(row.dateBasis, 'publication');
    assert.equal(filterMeasurements([row]).length, 1, 'invalid date or score');
  }
});

test('starter snapshots show no data before publication and do not invent time trends', () => {
  const firstDate = measurements.map(row => row.date).sort()[0];
  const previousDay = new Date(Date.parse(firstDate + 'T00:00:00Z') - 86400000).toISOString().slice(0, 10);
  assert.equal(filterMeasurements(measurements, { cutoff: previousDay }).length, 0);
  for (const group of groupComparable(measurements)) {
    const dates = new Set(group.measurements.map(row => row.date));
    if (dates.size === 1) assert.equal(frontierPoints(group.measurements).length, 1);
  }
});

test('source register uses versioned HTTPS originals and milestones reference known sources', () => {
  for (const source of sourceCatalog) {
    assert.equal(new URL(source.url).protocol, 'https:');
    assert.ok(source.version && source.checkedAt && source.summary);
    assert.ok(source.checkedAt <= editorialStatus.checkedAt);
  }
  for (const milestone of milestones) {
    assert.ok(sourceCatalog.some(source => source.id === milestone.sourceId));
    assert.ok(milestone.limitations);
  }
});
