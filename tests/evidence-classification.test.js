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

test('HealthBench Professional uses clinician-chat benchmark across linked cards, never patient trial',()=>{
  const professionalIds=['2.6','2.7','2.8','2.9','2.10','2.11','2.12','2.13','2.14','2.15','hbp-gpt54-base','hbp-gpt54-browsing','hbp-chatgpt-clinicians','trend-hbp-gpt5','trend-hbp-gpt52','trend-hbp-gpt54','trend-hbp-physicians','healthbench-2026'];
  for(const id of professionalIds){
    const c=evidenceCard(id).classification;
    assert.equal(c.testSetting,'clinician_chat_benchmark',id);
    assert.equal(c.studyDesign,'benchmark',id);
    assert.equal(c.realPatientTested,false,id);
    assert.equal(c.patientOutcomeEvidence,false,id);
    assert.equal(c.milestone,false,id);
  }
  for(const id of ['2.1','2.2','2.3','2.4','2.5']) {
    assert.notEqual(evidenceCard(id).classification.testSetting,'clinician_chat_benchmark','HealthBench Core must not inherit Professional cohort');
  }
  assert.equal(data.meta.evidenceTaxonomy.testSettings.clinician_chat_benchmark.label.de,'Benchmark mit Arzt-KI-Dialogen');
});

test('Bilingual glossary, data table and filter show new clinician-chat classification',()=>{
  assert.match(evidenceGlossaryHtml(),/Clinician-chat benchmark/);
  assert.match(evidenceGlossaryHtml(),/not patients in a prospective clinical trial/);
  assert.match(filterOptions(),/option value="clinician_chat_benchmark"/);
  assert.match(evidenceSummary(evidenceCard('healthbench-2026'),'de'),/Arzt-KI-Dialogen/);
  const table=renderTrackDataTable(tracks.find(track=>track.id==='assistance'),'2026-10-25');
  assert.match(table,/Clinician-chat benchmark/);
});

test('Validator prevents clinician chat benchmark from falsely claiming real patient trial',()=>{
  for(const change of [
    cls=>{cls.studyDesign='randomized_clinical_trial';},
    cls=>{cls.realPatientTested=true;},
    cls=>{cls.patientOutcomeEvidence=true;}
  ]){
    const altered=structuredClone(data);
    change(altered.editorialCards['healthbench-2026'].classification);
    assert.match(validateMonitor(altered).errors.join('; '),/offline clinician chat tests require benchmark design/);
  }
});
