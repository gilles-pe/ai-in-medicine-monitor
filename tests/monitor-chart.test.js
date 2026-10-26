import test from 'node:test';
import assert from 'node:assert/strict';
import {renderMonitorChart,renderMonitorDetails} from '../lib/monitor-chart.js';
import {buildTrackSeries,isVisibleObservation} from '../lib/monitor-series.js';

test('one canvas per track retains confirmed observations and independent benchmark paths',()=>{
  for(const id of ['knowledge','assistance','autonomy']){
    const html=renderMonitorChart({id},'2026-10-18'),series=buildTrackSeries(id,'2026-10-18').series;
    assert.equal((html.match(/<svg /g)||[]).length,1);
    assert.equal((html.match(/data-observation-id=/g)||[]).length,series.reduce((n,s)=>n+s.points.filter(p=>isVisibleObservation(p)).length,0));
    for(const item of series){assert.ok(html.includes('data-legend-series="'+item.seriesId+'"'));for(const p of item.frontier)assert.ok(html.includes('data-observation-id="'+p.id+'"'));}
    assert.doesNotMatch(html,/monitor-calendar-note|monitor-question|monitor-series-note/);
    assert.match(renderMonitorDetails({id},'2026-10-18'),/Different benchmarks use different tasks/);
  }
});
