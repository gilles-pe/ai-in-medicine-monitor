import test from 'node:test';
import assert from 'node:assert/strict';
import { monitorData } from '../lib/monitor-data.js';
import { pointCardHtml, editorialCard } from '../lib/point-card.js';
import { eligibilityReasons, buildTrackSeries } from '../lib/monitor-series.js';

const points=monitorData.tracks.flatMap(t=>t.series.flatMap(s=>s.data));
const point=id=>points.find(p=>p.id===id);
test('research corrections preserve observed scores while fixing setup, dates and attribution',()=>{
  assert.equal(point('1.0a').value,50.3);assert.match(point('1.0a').setup,/fine-tuning/);assert.doesNotMatch(point('1.0a').setup,/0-shot/);
  assert.equal(point('1.1b').publicationDate,'2023-04-12');assert.equal(point('1.1b').modelReleaseDate,null);
  assert.match(point('1.2').setup,/only on MedQA/);
  for(const id of ['1.4','1.5','1.6']){assert.equal(point(id).publicationDate,'2025-05-02');assert.match(point(id).sources[0].url,/01653-8/);assert.ok(eligibilityReasons(point(id)).length);}
  assert.equal(point('2.12').validation.comparability,'different_protocol');
  for(const id of ['2.14','2.15']){assert.equal(point(id).validation.status,'needs_review');assert.equal(point(id).publicationDate,null);assert.ok(eligibilityReasons(point(id)).length);}
});
test('every canonical card has one scannable layout, no Q&A or orphaned metadata delimiter',()=>{
  assert.equal(Object.keys(monitorData.editorialCards).length,110);
  for(const id of Object.keys(monitorData.editorialCards)){
    const html=pointCardHtml(editorialCard(id));
    assert.match(html,/card-key-finding/);assert.match(html,/SETUP &amp; COHORT/);assert.match(html,/LIMITATIONS &amp; VALIDITY/);
    assert.doesNotMatch(html,/What was tested\?|How was it tested\?|How sure are we\?|Historical source-backed record/);
    assert.doesNotMatch(html,/class="card-tags">\s*·/);
  }
  const synthetic=pointCardHtml({...editorialCard('lower-amie-2025'),tags:['',null,'Blinded comparison']});
  assert.match(synthetic,/class="card-tags">Blinded comparison/);
  const amie=editorialCard('lower-amie-2025');assert.equal(amie.timeline_year,2025);assert.match(amie.finding.headline,/30\/32/);assert.match(amie.finding.explanation,/25\/26/);
});
test('confirmed clinical frontiers exclude product harness, supplier and unresolved claims',()=>{
  const track=buildTrackSeries('assistance','2026-10-18');
  assert.equal(track.eligibleCount,11);
  const frontier=track.series.flatMap(s=>s.frontier.map(p=>p.id));
  for(const id of ['2.12','2.13','2.14','2.15'])assert.ok(!frontier.includes(id));
  assert.ok(frontier.includes('2.5'));assert.ok(frontier.includes('2.10'));
  assert.equal(buildTrackSeries('assistance','2025-05-12').series[0].points.length,0);
  assert.equal(buildTrackSeries('assistance','2025-05-13').series[0].points.length,5);
  assert.equal(buildTrackSeries('assistance','2026-04-29').series[1].points.length,0);
  assert.equal(buildTrackSeries('assistance','2026-04-30').series[1].points.length,7);
  assert.equal(buildTrackSeries('assistance','2025-12-31').series.flatMap(s=>s.undated).length,0);
});
