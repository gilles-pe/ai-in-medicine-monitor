import test from 'node:test';
import assert from 'node:assert/strict';
import { translateText,preferredLanguage,setLanguage } from '../lib/i18n.js';
import { monitorData } from '../lib/monitor-data.js';
import { feedbackUrl } from '../lib/navigation.js';
import { buildExportSvg } from '../lib/chart-export.js';

test('locale choice uses explicit language, then saved preference, with safe default',()=>{
  const storage={getItem:()=> 'de'};
  assert.equal(preferredLanguage('?lang=en',storage),'en');
  assert.equal(preferredLanguage('',storage),'de');
  assert.equal(preferredLanguage('',{getItem(){throw Error('disabled');}}),'en');
});
test('German UI covers source explanations without changing model IDs or primary records',()=>{
  assert.equal(translateText('What was tested?','de'),'Was wurde getestet?');
  assert.equal(translateText('Score confirmed · dates provisional · Same benchmark protocol','de'),'Score bestätigt · Zeitangaben vorläufig · Gleiches Testverfahren');
  assert.equal(translateText('Last reviewed 18 Oct 2026','de'),'Zuletzt geprüft 18. Okt. 2026');
  assert.equal(translateText('9 points are excluded from the trend pending review.','de'),'9 Punkte sind bis zur Prüfung von der Linie ausgeschlossen.');
  assert.equal(translateText('GPT-5.4','de'),'GPT-5.4');
  assert.equal(translateText('What was tested?','en'),'What was tested?');
  for(const track of monitorData.tracks)for(const series of track.series)for(const point of series.data){for(const key of ['whatWasTested','whatValueMeans','limitations']){const text=point.explain[key];if(text)assert.ok(Object.hasOwn(monitorData.extensions.locales.de,text),point.id+': '+key);}}
});
test('renamed SVG branding is XML escaped and German export retains the selected language',()=>{
  setLanguage('de');const svg=buildExportSvg('',{title:'Medical knowledge',cutoff:'2026-10-18'});
  assert.match(svg,/Digital Health &amp; AI in Medicine/);assert.doesNotMatch(svg,/Digital Health & AI/);
  assert.match(svg,/Medizinisches Wissen/);assert.match(svg,/Stand 2026-10-18/);setLanguage('en');
});
test('feedback composes an encoded draft without sending a message',()=>{
  const url=feedbackUrl('Study & feedback\nSecond line','Digital Health & AI in Medicine','owner@example.com');
  assert.equal(new URL(url).protocol,'mailto:');const query=new URLSearchParams(url.split('?')[1]);
  assert.equal(query.get('body'),'Study & feedback\nSecond line');assert.equal(query.get('subject'),'Digital Health & AI in Medicine - Feedback');
  assert.throws(()=>feedbackUrl('   ','Title','owner@example.com'),/empty/);
  assert.throws(()=>feedbackUrl('Text','Title','bad\r\n@example.com'),/invalid/);
});
