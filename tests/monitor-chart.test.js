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

test('time zoom tightens the score scale and emphasizes only existing benchmark steps',()=>{
  for(const [id,range] of [['knowledge','1y'],['assistance','1y'],['autonomy','6m']]){
    const html=renderMonitorChart({id},'2026-11-13',{range});
    const all=renderMonitorChart({id},'2026-11-13');
    const span=markup=>{const [,min,max]=markup.match(/data-y-min="([^"]+)" data-y-max="([^"]+)"/);return Number(max)-Number(min);};
    assert.ok(span(html)<span(all),id);
    assert.match(html,/class="monitor-scale-note">Zoomed Y-axis/);
    assert.match(html,/class="monitor-frontier[^"]*"[^>]+stroke-width="3\.5"/);
    assert.match(all,/class="monitor-frontier[^"]*"[^>]+stroke-width="2\.5"/);
    assert.doesNotMatch(all,/monitor-scale-note/);
  }

  const knowledge=renderMonitorChart({id:'knowledge'},'2026-11-13',{range:'6m'});
  assert.match(knowledge,/No measurements in this time window/);
  assert.doesNotMatch(knowledge,/class="monitor-frontier(?: |")|monitor-scale-note/);
  const assistance=renderMonitorChart({id:'assistance'},'2026-11-13',{range:'6m'});
  assert.match(assistance,/data-observation-id=/);
  assert.doesNotMatch(assistance,/class="monitor-frontier(?: |")/);
});
