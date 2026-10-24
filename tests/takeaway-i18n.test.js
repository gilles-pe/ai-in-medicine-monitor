import test from 'node:test';
import assert from 'node:assert/strict';
import {trackTakeaway,takeawayHtml} from '../lib/takeaways.js';
import {translateTakeawayText,translatedTakeawayParts} from '../lib/i18n.js';

test('dynamic German takeaways preserve all named results and release-date precision',()=>{
  const knowledge=translateTakeawayText(trackTakeaway('knowledge','2026-10-25'),'de');
  assert.match(knowledge,/Gemini 3\.1 Pro Preview mit 97,4 %/);
  assert.match(knowledge,/GPT-5\.2 erreicht 94,2 % und Claude Opus 4\.6 90,2 %/);
  assert.match(knowledge,/Modellveröffentlichung 2026-02-19/);
  assert.match(knowledge,/500 Fragen · Mit Websuche/);
  const assistance=translateTakeawayText(trackTakeaway('assistance','2026-10-25'),'de');
  assert.match(assistance,/GPT-5\.4 \(Base\) mit 48,1 Punkten/);
  assert.match(assistance,/OpenAI o3 59,9 Punkte/);
  assert.match(assistance,/Modellveröffentlichung 2026-03\)/);
  assert.doesNotMatch(assistance,/2026-03-01|48,1 %/);
  const autonomy=translateTakeawayText(trackTakeaway('autonomy','2026-10-25'),'de');
  assert.match(autonomy,/Claude Code \/ Opus 5 mit 55 %/);
  assert.match(autonomy,/Claude 3\.5 Sonnet v2 69,67 %/);
  for(const text of [knowledge,assistance,autonomy])assert.doesNotMatch(text,/\bOn |best confirmed|model release|reaches|task success|These scores|open questions/);
});

test('all historical fallback states and a single-result state translate completely',()=>{
  const knowledge=translateTakeawayText(trackTakeaway('knowledge','2026-05-01'),'de');
  assert.match(knowledge,/waren zu diesem Zeitpunkt noch nicht veröffentlicht/);
  assert.match(knowledge,/Prüfungsantworten belegen keine sichere klinische Leistung/);
  assert.equal(translateTakeawayText(trackTakeaway('assistance','2020-01-01'),'de'),'Bewertungspunkte entsprechen nicht dem Anteil korrekter Diagnosen.');
  assert.equal(translateTakeawayText(trackTakeaway('autonomy','2020-01-01'),'de'),'Erfolg bei simulierten Aufgaben belegt weder eine klinische Zulassung noch Behandlungsergebnisse.');
  const single='On MedQA · 500 questions · Search enabled, the best confirmed result in view is GPT-5.2 at 94.2% (model release 2025-12-11).';
  assert.match(translateTakeawayText(single,'de'),/Im gewählten Zeitraum erzielt GPT-5\.2/);
  assert.match(translateTakeawayText(single,'de'),/94,2 %.*2025-12-11/);
  const earlier=translateTakeawayText(trackTakeaway('autonomy','2026-05-01'),'de');
  assert.match(earlier,/Auf MedAgentBench erreicht Claude 3\.5 Sonnet v2 69,67 %/);
  assert.doesNotMatch(earlier,/HealthAgentBench|task success|\bOn /);
});

test('English source and original abbreviation titles survive language round-trips',()=>{
  const source='Exam-style questions such as MedQA are close to saturation. MedQA remains a benchmark.';
  const abbreviations=[{term:'MedQA',title:'MedQA (USMLE 4-Option)'}];
  const german=translatedTakeawayParts(source,abbreviations,'de');
  assert.equal(german.filter(part=>part.title).length,1);
  assert.equal(german.find(part=>part.title).title,'MedQA (USMLE 4-Option)');
  assert.match(german.map(part=>part.text).join(''),/^Prüfungsfragen wie MedQA nähern sich einer Sättigung\./);
  assert.equal(translatedTakeawayParts(source,abbreviations,'en').map(part=>part.text).join(''),source);
  assert.equal(translateTakeawayText(source,'en'),source);
  const html=takeawayHtml('Exam-style questions such as MedQA are close to saturation.');
  assert.match(html,/data-takeaway-source="Exam-style questions such as MedQA are close to saturation\."/);
  assert.match(html,/<abbr title="MedQA \(USMLE 4-Option\)">MedQA<\/abbr>/);
  assert.match(html,/data-i18n-ignore/);
});

test('common words inside model identifiers are never translated as UI labels',()=>{
  const source='On HealthBench Professional, the best confirmed same-protocol result is Clinical assistance at 48.1 points (model release 2026-03).';
  assert.match(translateTakeawayText(source,'de'),/erzielt Clinical assistance mit 48,1 Punkten/);
});
