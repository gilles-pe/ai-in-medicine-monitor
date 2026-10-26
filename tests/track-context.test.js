import test from 'node:test';
import assert from 'node:assert/strict';
import {trackContext,renderTrackContext} from '../lib/track-context.js';

test('selected findings and references stay inside their own eligible benchmark series',()=>{
  const k=trackContext('knowledge','2026-10-18');assert.equal(k.selection.series.seriesId,'medqa_nyu_search_500_2026');assert.equal(k.selection.point.value,97.4);assert.equal(k.selection.reference.value,94.2);
  const c=trackContext('assistance','2026-10-18');assert.equal(c.selection.point.value,48.1);assert.equal(c.selection.point.id,'2.10');assert.equal(c.unit,'pts');assert.ok(c.selection.reference.eligible);assert.equal(c.selection.series.seriesId,'healthbench_pro_2026');
  const a=trackContext('autonomy','2026-10-18');assert.equal(a.selection.point.value,55);assert.equal(a.selection.reference.value,19);assert.equal(a.selection.series.seriesId,'healthagentbench_msft_2026');
});
test('qualified scores do not acquire a comparator or misleading trend',()=>{
  const result=trackContext('knowledge','2026-10-18',{seriesView:'medqa_main'});assert.equal(result.selection.point.value,91.1);assert.equal(result.selection.reference,null);assert.equal(result.selection.point.eligible,false);
  const html=renderTrackContext('knowledge','2026-10-18',{seriesView:'medqa_main'});assert.match(html,/No comparable trend established/);assert.doesNotMatch(html,/vs\./);
});
test('summaries respect benchmark selection, publication cutoff and model choice',()=>{
  assert.equal(trackContext('knowledge','2026-06-11',{seriesView:'medqa_nyu_search_500_2026'}).selection,null);
  assert.equal(trackContext('assistance','2025-01-01').selection,null);
  const filtered=trackContext('knowledge','2026-10-18',{model:'GPT-5.2'});assert.equal(filtered.selection.point.value,94.2);assert.equal(filtered.selection.point.model,'GPT-5.2');assert.equal(filtered.selection.reference,undefined);
  const a=trackContext('autonomy','2026-10-18',{seriesView:'medagentbench_stanford'});assert.equal(a.selection.point.value,69.67);assert.equal(a.selection.series.seriesId,'medagentbench_stanford');
});
test('visible context labels true units and retains direct source-card triggers',()=>{
  const html=renderTrackContext('assistance','2026-10-18');assert.match(html,/48.1 points/);assert.doesNotMatch(html,/48.1%/);assert.match(html,/data-monitor-point="2.10"/);assert.match(html,/Different grader, not directly comparable/);assert.match(html,/Core and Professional are separate tests/);
  assert.match(renderTrackContext('autonomy','2022-01-01'),/No published result for this selection/);
});
