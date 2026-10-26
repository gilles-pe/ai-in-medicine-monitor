import test from 'node:test';
import assert from 'node:assert/strict';
import { monitorData } from '../lib/monitor-data.js';
import { buildTrackSeries, dateInfo, deriveSeries, eligibilityReasons } from '../lib/monitor-series.js';

const point = (id, month, value, changes = {}) => ({
  id, model: `Model ${id}`, modelReleaseDate: month, publicationDate: '2026-01', evaluationDate: null,
  value, isFrontier: false,
  validation: { status: 'confirmed', comparability: 'same_protocol', reviewedAt: '2026-10-18', reviewedBy: 'Evidence reviewer' },
  sources: [{ url: 'https://example.org/original-paper', locator: 'Table 2', type: 'official_primary' }],
  ...changes,
});
const derive = data => deriveSeries({ seriesId: 'same-test', data }, monitorData.meta.lastReviewedAt);

test('date precision is preserved, invalid calendar dates rejected', () => {
  assert.equal(dateInfo('2024-05').label, 'May 2024');
  assert.equal(dateInfo('2024-05').precision, 'month');
  assert.equal(dateInfo('2024-05').latest, '2024-05-31');
  assert.equal(dateInfo('2024-05-07').label, '7 May 2024');
  for (const invalid of [null, '2024', '2024-13', '2025-02-29', '2024-05-99', '2024-1', '']) {
    assert.equal(dateInfo(invalid), null);
  }
});

test('main-line eligibility ignores imported flags and requires reviewed comparable primary evidence', () => {
  const valid = point('ok', '2024-01', 60);
  assert.deepEqual(eligibilityReasons(valid), []);
  const invalidVariants = [
    { validation: { ...valid.validation, status: 'needs_review' }, isFrontier: true, eligible: true },
    { validation: { ...valid.validation, comparability: 'qualified' } },
    { validation: { ...valid.validation, reviewedAt: null } },
    { validation: { ...valid.validation, reviewedBy: '' } },
    { sources: [{ ...valid.sources[0], url: 'http://example.org/paper' }] },
    { sources: [{ ...valid.sources[0], type: 'peer_reviewed_secondary_report' }] },
    { sources: [{ ...valid.sources[0], locator: null }] },
    { sources: [{ ...valid.sources[0], url: null }] },
    { modelReleaseDate: null }, { publicationDate: null }, { value: '60' },
  ];
  for (const changes of invalidVariants) {
    assert.ok(eligibilityReasons({ ...valid, ...changes }).length > 0);
  }
});

test('same-month cluster selects highest eligible result, and weaker later results do not lower frontier', () => {
  const result = derive([
    point('first', '2024-05', 60), point('higher', '2024-05', 80),
    point('tie', '2024-05', 80), point('later-weaker', '2024-07', 70),
    point('equal', '2024-08', 80), point('improved', '2024-10', 85),
  ]);
  assert.deepEqual(result.frontier.map(p => p.id), ['higher', 'equal', 'improved']);
  assert.equal(result.points.length, 6);
  assert.equal(result.clusters[0].points.length, 3);
  assert.equal(result.points.find(p => p.id === 'later-weaker').frontier, false);
});

test('unreviewed superior score cannot outrank eligible same-month result', () => {
  const unreviewed = point('unreviewed', '2024-05', 99, { validation: { status: 'needs_review' } });
  const result = derive([unreviewed, point('eligible', '2024-05', 61)]);
  assert.deepEqual(result.frontier.map(p => p.id), ['eligible']);
  assert.equal(result.pending[0].id, 'unreviewed');
  assert.equal(result.provisional, true);
});

test('publication cutoff prevents retrospective lookahead and treats month-only evidence conservatively', () => {
  const p = point('historical', '2023-03', 70, { publicationDate: '2025-05', isRetrospective: true });
  assert.equal(deriveSeries({ data: [p] }, '2024-12-31').points.length, 0);
  assert.equal(deriveSeries({ data: [p] }, '2025-05-01').points.length, 0);
  const visible = deriveSeries({ data: [p] }, '2025-05');
  assert.equal(visible.points[0].releaseDate.label, 'Mar 2023');
  assert.equal(visible.points[0].retrospective, true);
  assert.equal(visible.points[0].evidencePublishedLater, true);
});

test('publication later does not invent a retrospective evaluation date', () => {
  const result = derive([point('unknown-test-date', '2024-01', 60)]);
  assert.equal(result.points[0].retrospective, false);
  assert.equal(result.points[0].evidencePublishedLater, true);
  assert.equal(result.points[0].evaluationDateInfo, null);
  const tested = derive([point('later-test', '2024-01', 60, { evaluationDate: '2024-03' })]);
  assert.equal(tested.points[0].retrospective, true);
});

test('missing dates stay out of timed chart while retained as unresolved records', () => {
  const result = derive([point('no-release', null, 60), point('no-publication', '2024-01', 70, { publicationDate: null })]);
  assert.equal(result.points.length, 0);
  assert.equal(result.frontier.length, 0);
  assert.equal(result.undated.length, 2);
});

test('unverified intermediate measurements and unsupported missing years break segments', () => {
  const pending = point('pending', '2024-06', 80, { validation: { status: 'needs_review' } });
  const result = derive([
    point('start', '2024-01', 60), pending, point('next', '2024-09', 70),
    point('much-later', '2026-01', 90),
  ]);
  assert.deepEqual(result.segments.map(segment => segment.map(p => p.id)), [['start'], ['next'], ['much-later']]);
});

test('series stay separate and canonical aliases resolve without changing portable records', () => {
  const raw = { tracks: [{ trackId: 'autonomous_workflows', series: [
    { seriesId: 'a', data: [point('a', '2024-01', 60)] },
    { seriesId: 'b', data: [point('b', '2024-02', 10)] },
  ] }] };
  const snapshot = JSON.stringify(raw);
  const result = buildTrackSeries('autonomy', '2026-10', raw);
  assert.equal(result.series.length, 2);
  assert.equal(result.series[1].frontier[0].value, 10);
  assert.equal(result.eligibleCount, 2);
  assert.equal(JSON.stringify(raw), snapshot);
  assert.throws(() => buildTrackSeries('unknown', '2026-10', raw), RangeError);
});

test('portable v1.1 keeps 49 records and 31 same-protocol primary-source scores eligible', () => {
  const records = monitorData.tracks.flatMap(track => track.series.flatMap(series => series.data));
  assert.equal(records.length, 49);
  assert.equal(records.filter(record => eligibilityReasons(record).length === 0).length, 31);
  assert.equal(buildTrackSeries('knowledge', '2026-10-18').eligibleCount, 3);
  assert.equal(buildTrackSeries('assistance', '2026-10-18').eligibleCount, 11);
  const autonomy = buildTrackSeries('autonomy', '2026-10-18');
  assert.equal(autonomy.eligibleCount, 17);
  assert.equal(autonomy.series.length, 2);
});
