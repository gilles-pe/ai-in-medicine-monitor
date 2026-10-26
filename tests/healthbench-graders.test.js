
import test from 'node:test';
import assert from 'node:assert/strict';
import {monitorData} from '../lib/monitor-data.js';
import {deriveSeries,graderSideLines} from '../lib/monitor-series.js';
import {renderMonitorChart,renderTrackDataTable} from '../lib/monitor-chart.js';
import {trackContext} from '../lib/track-context.js';
const raw=monitorData.tracks.flatMap(t=>t.series).find(s=>s.seriesId==='healthbench_pro_2026');

test('other graders and qualified OpenAI results never affect the Professional main frontier',()=>{
 const s=deriveSeries(raw,'2026-10-26');
 const original=deriveSeries({...raw,data:raw.data.filter(p=>!p.metricVariant)},'2026-10-26');
 assert.deepEqual(s.frontier.map(p=>p.id),original.frontier.map(p=>p.id));
 for(const p of s.points.filter(p=>p.metricVariant))assert.equal(p.eligible,false);
 const lines=graderSideLines(s.points);
 const opus=lines.find(l=>l.grader==='Claude Opus 4.8');
 assert.deepEqual(opus.frontier.map(p=>p.value),[56.9,66,70.3]);
 assert.equal(lines.find(l=>l.grader==='Claude Sonnet 4.6').frontier.length,1);
 assert.equal(raw.data.find(p=>p.id==='2.11').value,47);
 assert.equal(raw.data.find(p=>p.id==='hbpro-astra-openai').rawValue,68.2);
 assert.equal(raw.data.find(p=>p.id==='hbpro-sol61-openai').rawValue,67.2);
 assert.equal(trackContext('assistance','2026-10-26').selection.point.validation.comparability,'same_protocol');
});

test('source-checked vendor points are visible, distinguish grader groups and keep raw values out of chart scores',()=>{
 const chart=renderMonitorChart({id:'assistance'},'2026-10-26');
 for(const p of raw.data.filter(p=>p.metricVariant))assert.ok(chart.includes('data-observation-id="'+p.id+'"'));
 assert.match(chart,/monitor-grader-side-line/);
 assert.match(chart,/Different grader, not directly comparable/);
 assert.doesNotMatch(chart,/data-side-grader="Claude Sonnet 4.6"/);
 const table=renderTrackDataTable({id:'assistance'},'2026-10-26');
 assert.match(table,/Claude Sonnet 4.6/);
 assert.match(table,/pp. 228-229/);
 assert.match(table,/Table 7/);
 assert.match(table,/68.2/);
 assert.match(table,/different_protocol/);
 const prior=renderMonitorChart({id:'assistance'},'2026-09-22');
 assert.ok(!prior.includes('data-observation-id="hbpro-sol61-openai"'));
 assert.ok(!prior.includes('data-observation-id="hbpro-astra-anthropic"'));
});

test('grader side grouping cannot join another protocol even when grader names match',()=>{
 const p=deriveSeries(raw,'2026-10-26').points.find(p=>p.id==='2.14');
 const other={...p,id:'incompatible',comparisonGroup:'different-harness',value:99};
 assert.equal(graderSideLines([p,other]).length,2);
 assert.ok(graderSideLines([p,other]).every(g=>g.frontier.length===1));
});
