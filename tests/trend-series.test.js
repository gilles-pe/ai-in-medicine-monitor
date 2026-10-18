import test from 'node:test';
import assert from 'node:assert/strict';
import { trendSeries, trendPoints } from '../data/trend-series.js';
import { sourceCatalog, tracks } from '../data/evidence.js';
import { renderTrackChart, visibleTrendSeries } from '../lib/track-chart.js';

test('scientific comparisons preserve source protocols and non-calendar axes',()=>{
  assert.equal(new Set(trendPoints.map(point=>point.id)).size,trendPoints.length);
  for(const series of trendSeries){
    assert.ok(sourceCatalog.some(source=>source.id===series.sourceId));
    assert.ok(['quantitative','ordinal'].includes(series.xType));
    assert.ok(series.comparisonGroup&&series.setting&&series.limitations&&series.sourceDetail);
    assert.ok(series.points.every(point=>Number.isFinite(point.score)&&point.score>=0&&point.score<=100));
    assert.equal(visibleTrendSeries(series.trackId,'2020-01-01').length,0);
    assert.ok(visibleTrendSeries(series.trackId,series.date).includes(series));
  }
  const difficulty=trendSeries.find(series=>series.trackId==='autonomy');
  assert.ok(difficulty.points[0].score>difficulty.points.at(-1).score,'difficulty must not be recast as improving over time');
  assert.equal(difficulty.points.at(-1).xLabel,'≥3 steps');
});

test('previews contain no interactive points or duplicated SVG ids; full charts retain sources',()=>{
  for(const track of tracks){
    const preview=renderTrackChart(track,[],'2026-10-18',{preview:true});
    assert.doesNotMatch(preview,/tabindex=|data-trend-point=|\sid=/);
    const full=renderTrackChart(track,[],'2026-10-18');
    assert.match(full,/Not a time trend/);
    assert.match(full,/data-trend-point=/);
    assert.match(full,/data-source-id=/);
    assert.doesNotMatch(full,/\s[CSQ]\d/,'do not smooth unmeasured intermediate values');
    assert.doesNotMatch(renderTrackChart(track,[],'2020-01-01'),/data-trend-point=/);
  }
});
