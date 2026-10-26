import test from 'node:test';
import assert from 'node:assert/strict';
import {monthWindow,valueDomain,clipFrontier} from '../lib/chart-window.js';
import {renderMonitorChart} from '../lib/monitor-chart.js';
import {buildExportSvg} from '../lib/chart-export.js';
test('time windows and padded scales preserve observations without forcing zero',()=>{
 for(const [range,months] of [['5y',60],['2y',24],['1y',12],['6m',6]]){const w=monthWindow('2026-10-25',range);assert.equal(w.end-w.start,months);}
 assert.deepEqual(valueDomain([50,80]),{min:45,max:85});assert.deepEqual(valueDomain([97.4]),{min:90,max:100});
 const html=renderMonitorChart({id:'knowledge'},'2026-10-25',{range:'6m'});assert.match(html,/data-range="6m"/);assert.doesNotMatch(html,/data-observation-id="knowledge-nyu-gemini31"/);
 assert.match(buildExportSvg('<path/>'),/ai.gillespenning.com/);
});

test('window clipping keeps the entering best value without adding observations or extending gaps',()=>{
 const seg=[{value:42,releaseDate:{monthIndex:3}},{value:55,releaseDate:{monthIndex:6}}];
 assert.deepEqual(clipFrontier(seg,4,8).map(p=>[p.releaseDate.monthIndex,p.value]),[[4,42],[6,55]]);
 assert.deepEqual(clipFrontier(seg,4,5).map(p=>[p.releaseDate.monthIndex,p.value]),[[4,42],[5,42]]);
 assert.deepEqual(clipFrontier(seg,7,9),[]);assert.equal(seg[0].releaseDate.monthIndex,3);
 const html=renderMonitorChart({id:'autonomy'},'2026-10-26',{range:'6m'});
 assert.match(html,/class="monitor-frontier[^"]*" data-series-id="healthagentbench_msft_2026"/);
 assert.doesNotMatch(html,/data-observation-id="3.15"/);
});
