import test from 'node:test';
import assert from 'node:assert/strict';
import { presentationSeries } from '../data/presentation-chart.js';
import { historyEvents } from '../data/history.js';
import { sourceCatalog } from '../data/evidence.js';
import { renderOverview, clipIllustration, visibleHistory } from '../lib/overview.js';

test('PPT illustration preserves source years and remains separate from benchmark measurements', () => {
  assert.equal(presentationSeries.length, 4);
  assert.equal(presentationSeries[0].points[0].year, 1950);
  assert.equal(presentationSeries[0].points.at(-1).year, 2035);
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
  assert.match(old,/2020 AlphaFold 2/);
  assert.doesNotMatch(old,/class="overview-line scenario-line"/);
  const current = renderOverview('2026-10-17','2026-10-17');
  assert.match(current,/scenario-line/);
  assert.match(current,/keine Messreihe/);
  assert.match(current,/Szenarien, keine Prognosen/);
});
