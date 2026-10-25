import test from 'node:test';
import assert from 'node:assert/strict';
import {monthWindow,valueDomain} from '../lib/chart-window.js';
import {renderMonitorChart} from '../lib/monitor-chart.js';
import {buildExportSvg} from '../lib/chart-export.js';
test('time windows and padded scales preserve observations without forcing zero',()=>{
 for(const [range,months] of [['5y',60],['2y',24],['1y',12],['6m',6]]){const w=monthWindow('2026-10-25',range);assert.equal(w.end-w.start,months);}
 assert.deepEqual(valueDomain([50,80]),{min:45,max:85});assert.deepEqual(valueDomain([97.4]),{min:90,max:100});
 const html=renderMonitorChart({id:'knowledge'},'2026-10-25',{range:'6m'});assert.match(html,/data-range="6m"/);assert.doesNotMatch(html,/data-observation-id="knowledge-nyu-gemini31"/);
 assert.match(buildExportSvg('<path/>'),/ai.gillespenning.com/);
});
