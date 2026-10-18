import test from 'node:test';
import assert from 'node:assert/strict';
import { pointEvidence } from '../data/point-evidence.js';
import { presentationSeries } from '../data/presentation-chart.js';
import { historyEvents } from '../data/history.js';
import { sourceCatalog } from '../data/evidence.js';
import { renderOverview, clipIllustration, visibleHistory, visibleAnchors, illustrationPosition, fractionalYear } from '../lib/overview.js';

test('PPT illustration preserves source years and remains separate from benchmark measurements', () => {
  assert.equal(presentationSeries.length, 4);
  assert.equal(presentationSeries[0].points[0].year, 1950);
  assert.equal(presentationSeries[0].points.at(-1).year, 2030);
  for (const series of presentationSeries) {
    assert.equal(new Set(series.points.map(x=>x.year)).size, series.points.length);
    assert.ok(series.points.every(x=>Number.isFinite(x.index)));
    assert.equal(series.points.some(x=>Object.hasOwn(x,'score')), false);
  }
  for (const event of historyEvents) assert.ok(sourceCatalog.some(source=>source.id===event.sourceId));
  const points = [{year:1950,index:48},{year:1956,index:50}];
  assert.deepEqual(clipIllustration(points,1953), [{year:1950,index:48},{year:1953,index:49}]);
  assert.equal(points.length,2);
});

test('historical visibility distinguishes CASP 2020 from the 2021 paper and later scenarios', () => {
  assert.ok(visibleHistory('2020-12-31').some(x=>x.id==='alphafold2-2020'));
  assert.equal(visibleHistory('2024-05-07').some(x=>x.id==='alphafold3-2024'),false);
  assert.ok(visibleHistory('2024-05-08').some(x=>x.id==='alphafold3-2024'));
  const old = renderOverview('2020-12-31','2026-10-17');
  assert.match(old,/AlphaFold 2/);
  assert.doesNotMatch(old,/class="overview-line scenario-line"/);
  const current = renderOverview('2026-10-17','2026-10-17');
  assert.match(current,/scenario-line/);
  assert.match(current,/Illustrative scale/);
  assert.match(current,/not real IQ scores/);
  assert.doesNotMatch(current,/Dotted: medical context|Long dashes: scenarios/);
});


test('all visible overview dots have primary evidence, finite illustration positions and no future results', () => {
  const points = visibleAnchors('2026-10-17');
  assert.equal(points.length,24);
  assert.equal(new Set(points.map(point=>point.id)).size,points.length);
  for (const point of pointEvidence) {
    assert.ok(sourceCatalog.some(source=>source.id===point.sourceId),point.id);
    assert.ok(point.finding && point.limitations && point.locator && point.positionBasis);
    assert.ok(Number.isFinite(illustrationPosition(point.seriesId,point.year)),point.id);
    assert.ok(point.year<=2026);
  }
  assert.equal(visibleAnchors('2026-06-16').some(point=>point.id==='mira-2026'),false);
  assert.ok(visibleAnchors('2026-06-17').some(point=>point.id==='mira-2026'));
  const html = renderOverview('2030-12-31','2026-10-17');
  assert.match(html,/IQ for illustration/);
  assert.doesNotMatch(html,/kein IQ-Test|2035|2033|NaN|undefined/);
  assert.equal((html.match(/class="anchor-dot"/g)||[]).length,22);
  assert.equal((html.match(/class="overview-point"/g)||[]).length,22);
  const old = renderOverview('1953-12-31','2026-10-17');
  assert.equal((old.match(/class="anchor-dot"/g)||[]).length,1,'interpolation must not create a source-backed point');
});


test('same-year papers have distinct dated x positions instead of hidden overlapping markers', () => {
  assert.ok(fractionalYear('2026-06-17') < fractionalYear('2026-08-07'));
  assert.ok(fractionalYear('2025-02-12') < fractionalYear('2025-04-09'));
  assert.equal(fractionalYear('2024-01-01'),2024);
  const html = renderOverview('2026-10-17','2026-10-17');
  assert.match(html,/data-overview-cluster="mira-2026,residency-2026"/);
  assert.match(html,/data-overview-cluster="amie-2025,medagent-2025"/);
});
