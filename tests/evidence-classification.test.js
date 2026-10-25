import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateMonitor } from '../scripts/validate-monitor.mjs';
import { evidenceCard, evidenceSummary, evidenceGlossaryHtml, filterOptions } from '../lib/evidence-classification.js';
import { renderTrackDataTable } from '../lib/monitor-chart.js';
import { tracks } from '../data/evidence.js';

const data=JSON.parse(readFileSync(new URL('../data/monitor-data.json',import.meta.url),'utf8'));
test('Every evidence card has a valid controlled classification',()=>{
  const result=validateMonitor(data);
  assert.deepEqual(result.errors,[]);
  assert.ok(Object.keys(data.editorialCards).length>=115);
  assert.ok(Object.values(data.editorialCards).every(x=>x.classification));
});
test('Microsoft is explicitly a case-based milestone, not a clinical patient trial',()=>{
  const item=evidenceCard('lower-mai-dxo-2026').classification;
  assert.equal(item.topic,'capability');
  assert.equal(item.testSetting,'exam_or_vignette');
  assert.equal(item.realPatientTested,false);
  assert.equal(item.milestone,true);
});
test('AMIE tested real patients prospectively, but clinical outcomes were not proven',()=>{
  const item=evidenceCard('amie-previsit-2026').classification;
  assert.equal(item.testSetting,'prospective_patients');
  assert.equal(item.studyDesign,'prospective_single_arm');
  assert.equal(item.realPatientTested,true);
  assert.equal(item.patientOutcomeEvidence,false);
});
test('Reject upgrading vignette or actor evaluations to real-patient trials',()=>{
  for(const setting of ['exam_or_vignette','standardized_patient','simulated_workflow']){
    const edited=structuredClone(data);
    edited.editorialCards['lower-mai-dxo-2026'].classification.testSetting=setting;
    edited.editorialCards['lower-mai-dxo-2026'].classification.realPatientTested=true;
    assert.match(validateMonitor(edited).errors.join('; '),/simulations, actors, lab and exams are not real-patient care/);
  }
});
test('Data table, Glossary and filters use controlled test-setting values',()=>{
  assert.match(evidenceSummary(evidenceCard('lower-mai-dxo-2026')),/Exam \/ cases/);
  assert.match(evidenceGlossaryHtml(),/Retrospective records/);
  assert.match(filterOptions(),/Major milestones only/);
  assert.match(renderTrackDataTable(tracks.find(x=>x.id==='knowledge'),'2026-10-25'),/Test setting/);
});
