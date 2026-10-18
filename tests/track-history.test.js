import test from 'node:test';
import assert from 'node:assert/strict';
import { trackMilestones,trustContext } from '../data/track-milestones.js';
import { sourceCatalog,measurements } from '../data/evidence.js';
import { visibleTrackMilestones,historyX,renderTrackHistory } from '../lib/track-history.js';

test('each lower group has three dated original-source milestones and valid evidence boundaries',()=>{
  assert.equal(trackMilestones.length,9);
  assert.equal(new Set([...trackMilestones,trustContext].map(item=>item.id)).size,10);
  for(const trackId of ['knowledge','assistance','autonomy']) {
    const group=visibleTrackMilestones(trackId,'2026-10-18');
    assert.equal(group.length,3);
    assert.ok(group[0].date<'2024-01-01');
    assert.ok(group.every(item=>item.trackId===trackId));
  }
  for(const item of [...trackMilestones,trustContext]) {
    assert.ok(sourceCatalog.some(source=>source.id===item.sourceId));
    assert.ok(item.design && item.finding && item.limitations && item.locator);
    assert.ok(Number.isFinite(Date.parse(item.date)));
    assert.ok(!measurements.some(row=>row.id===item.id));
  }
  assert.match(trackMilestones.find(x=>x.id==='lower-star-2022').limitations,/präklinische|Aufsicht/);
  assert.match(trackMilestones.find(x=>x.id==='lower-mira-2026').limitations,/Diagnostik, nicht/);
  assert.match(trustContext.finding,/3,4\/5/);
  assert.match(trustContext.limitations,/schwach positives/);
});

test('history filters never reveal later papers or relabel events as comparable scores',()=>{
  const before=JSON.stringify(trackMilestones);
  assert.equal(visibleTrackMilestones('knowledge','2022-12-25').length,0);
  assert.equal(visibleTrackMilestones('knowledge','2022-12-26')[0].id,'lower-medpalm-2022');
  assert.equal(visibleTrackMilestones('assistance','2023-04-27').length,0);
  assert.equal(visibleTrackMilestones('assistance','2023-04-28').length,1);
  assert.equal(renderTrackHistory('autonomy','2022-01-25','2026-10-18'),'');
  const html=renderTrackHistory('autonomy','2026-10-18','2026-10-18');
  assert.match(html,/Markerhöhe ohne Leistungsbedeutung/);
  assert.match(html,/Tiermodell/);
  assert.equal((html.match(/class="milestone-anchor"/g)||[]).length,3);
  assert.doesNotMatch(html,/NaN|undefined|frontier-path/);
  assert.equal(JSON.stringify(trackMilestones),before);
});

test('history x coordinates share the real 2022 publication axis with bounded positions',()=>{
  assert.equal(historyX('2022-01-01','2026-10-18'),40);
  assert.equal(historyX('2026-10-18','2026-10-18'),970);
  assert.ok(historyX('2023-01-01','2026-10-18')<historyX('2025-01-01','2026-10-18'));
  assert.equal(historyX('2020-01-01','2026-10-18'),40);
  assert.equal(historyX('2030-01-01','2026-10-18'),970);
});
