import test from 'node:test';
import assert from 'node:assert/strict';
import { studies, sourceCatalog, milestones, measurements } from '../data/evidence.js';
import { filterStudies } from '../lib/studies.js';

test('study filters respect publication availability and topic without changing inputs', () => {
  const before = JSON.stringify(studies);
  assert.deepEqual(filterStudies(studies, { cutoff:'2021-07-14' }), []);
  assert.deepEqual(filterStudies(studies, { cutoff:'2021-07-15' }).map(x => x.id), ['alphafold2']);
  assert.deepEqual(filterStudies(studies, { topic:'learning', cutoff:'2026-10-03' }), []);
  assert.equal(filterStudies(studies, { topic:'learning', cutoff:'2026-10-04' })[0].id, 'learning-impact');
  assert.ok(filterStudies(studies, { topic:'pharma' }).every(x => x.topic === 'pharma'));
  assert.equal(JSON.stringify(studies), before);
});

test('evidence types remain separate from benchmark scales and patient studies', () => {
  assert.equal(studies.length, new Set(studies.map(x => x.id)).size);
  for (const study of studies) {
    assert.ok(sourceCatalog.some(source => source.id === study.sourceId));
    assert.ok(study.findings.length && study.design && study.limitations && study.presentationSlides.length);
    assert.ok(!measurements.some(row => row.id === study.id));
    assert.notEqual(study.environment, 'clinical_study');
  }
  const learning = studies.find(x => x.id === 'learning-impact');
  assert.equal(learning.environment, 'education_experiment');
  assert.match(learning.findings[1][1], /0,068/);
  assert.match(learning.limitations, /Keine medizinische Population/);
  for (const event of milestones.filter(x => x.studyId)) {
    assert.ok(studies.some(x => x.id === event.studyId && x.date === event.date));
  }
});
