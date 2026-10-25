import { monitorData } from './monitor-data.js';
import { getLanguage } from './i18n.js';
import { escapeHtml as e } from './selectors.js';

// Source of truth is monitor-data.json; no hard-coded duplicate vocabulary.
const taxonomy = monitorData.meta.evidenceTaxonomy || {};
const classification = card => card?.classification || null;
export function evidenceCard(id) {
  return monitorData.editorialCards?.[id] || null;
}
export function evidenceRecord(id) {
  return classification(evidenceCard(id));
}
export function taxonomyLabel(section,key,locale=getLanguage()) {
  const row=taxonomy?.[section]?.[key];
  return row?.label?.[locale] || row?.label?.en || 'Not classified';
}
export function evidenceSummary(card,locale=getLanguage()) {
  const data=classification(card);
  if(!data)return 'Not classified';
  return [taxonomyLabel('testSettings',data.testSetting,locale),taxonomyLabel('studyDesigns',data.studyDesign,locale)].join(' · ');
}
export function evidenceAttributes(card) {
  const data=classification(card);
  return 'data-evidence-topic="'+e(data?.topic||'unclassified')+'" data-evidence-setting="'+e(data?.testSetting||'unknown')+'" data-evidence-milestone="'+(data?.milestone===true?'true':'false')+'"';
}
export function evidenceTagsHtml(card,{detail=false}={}) {
  const data=classification(card);
  if(!data)return '';
  const topic=taxonomyLabel('topics',data.topic),setting=taxonomyLabel('testSettings',data.testSetting),design=taxonomyLabel('studyDesigns',data.studyDesign);
  const tags='<span class="evidence-tag">'+e(topic)+'</span><span class="evidence-tag evidence-setting">'+e(setting)+'</span>'+(data.milestone?'<span class="evidence-tag evidence-milestone">★ Milestone</span>':'');
  if(!detail)return '<span class="evidence-tags">'+tags+'</span>';
  const realPatients=data.realPatientTested===true?'Tested with real patients':data.realPatientTested===false?'Not tested prospectively with real patients':'Real-patient test not established';
  const outcomes=data.patientOutcomeEvidence===true?'Patient outcomes assessed':data.patientOutcomeEvidence===false?'No demonstrated patient-outcome benefit in this evaluation':'Patient-outcome evidence not established';
  return '<div class="card-classification" aria-label="Evidence classification"><div class="evidence-tags">'+tags+'</div><p class="evidence-method">'+e(design)+' · '+e(realPatients)+' · '+e(outcomes)+(data.classificationStatus==='provisional'?' · Classification provisional':'')+'</p></div>';
}
export function evidenceGlossaryHtml() {
  const groups=[
    ['topics','Topic / subject'],
    ['testSettings','Test setting - what was actually tested'],
    ['studyDesigns','Study design - how the test was conducted']
  ];
  return groups.map(([key,title])=>'<div class="evidence-glossary-group"><h3>'+e(title)+'</h3><dl>'+Object.values(taxonomy[key]||{}).map(value=>'<div><dt>'+e(value.label?.en||'')+'</dt><dd>'+e(value.description?.en||'')+'</dd></div>').join('')+'</dl></div>').join('')+
    '<p class="evidence-glossary-note">Milestone marks editorial significance, not stronger clinical evidence. Peer review, model scores, real-patient testing and patient benefit are independent.</p>';
}
export function filterOptions() {
  const make=(section,include)=>Object.entries(taxonomy[section]||{}).filter(([key])=>!['context','unclassified','unknown','non_clinical','other'].includes(key)).map(([key,value])=>'<option value="'+e(key)+'">'+e(value.label?.en||key)+'</option>').join('');
  return '<div class="evidence-filter-bar" id="evidence-filter-bar" aria-label="Filter milestones"><span class="filter-label">Filter milestones</span><label>Topic <select id="evidence-topic-filter" aria-label="Milestone topic"><option value="all">All topics</option>'+make('topics')+'</select></label><label>Test setting <select id="evidence-setting-filter" aria-label="Milestone test setting"><option value="all">All settings</option>'+make('testSettings')+'</select></label><label class="milestone-only"><input type="checkbox" id="evidence-milestone-only"> Major milestones only</label><span class="filter-note">Benchmark curves are not filtered.</span></div>';
}
