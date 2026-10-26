import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { knowledgeTakeaway, assistanceTakeaway, autonomyTakeaway, keyResult } from '../lib/takeaways.js';
import { SITE_DESCRIPTION, jsonLd, REVIEWED_AT, reviewedMarkup } from '../lib/site-meta.js';

const cutoff = REVIEWED_AT;

test('public description stays within the search snippet limit', () => {
  assert.ok(SITE_DESCRIPTION.length <= 155);
  assert.equal(REVIEWED_AT, '2026-10-26');
});

test('takeaways use confirmed scores from the monitor data', () => {
  const knowledge = knowledgeTakeaway(cutoff);
  assert.match(knowledge, /Gemini 3\.1 Pro Preview at 97\.4% \(model release 2026-02-19\)/);
  assert.doesNotMatch(knowledge, /above 97%/);
  assert.match(knowledge, /GPT-5\.2 at 94\.2%/);
  assert.match(knowledge, /Claude Opus 4\.6 at 90\.2%/);
  assert.match(knowledge, /MedQA · 500 questions · Search enabled/);
  const assistance = assistanceTakeaway(cutoff);
  assert.match(assistance, /GPT-5\.4 \(Base\) at 48\.1 points/);
  assert.match(assistance, /OpenAI o3 reaches 59\.9 points/);
  const autonomy = autonomyTakeaway(cutoff);
  assert.match(autonomy, /Claude Code \/ Opus 5 at 55%/);
  assert.match(autonomy, /Claude 3\.5 Sonnet v2 reaches 69\.67%/);
});

test('key numbers use the newest eligible series', () => {
  const knowledge = keyResult('knowledge', cutoff);
  assert.equal(knowledge.model, 'Gemini 3.1 Pro Preview');
  assert.equal(knowledge.value, '97.4');
  assert.equal(knowledge.date, '2026-02-19');
  assert.equal(knowledge.url, 'https://www.nature.com/articles/s41591-026-04431-5');
  const assistance = keyResult('assistance', cutoff);
  assert.equal(assistance.model, 'GPT-5.4 (Base)');
  assert.equal(assistance.value, '48.1');
  const autonomy = keyResult('autonomy', cutoff);
  assert.equal(autonomy.model, 'Claude Code / Opus 5');
  assert.equal(autonomy.value, '55');
});

test('structured data names the person without an employer', () => {
  const graph = JSON.parse(jsonLd());
  const person = graph['@graph'].find(item => item['@type'] === 'Person');
  const page = graph['@graph'].find(item => item['@type'] === 'WebPage');
  assert.equal(person.name, 'Gilles Penning');
  assert.equal(person.jobTitle, 'Medtech executive');
  assert.equal(person.worksFor, undefined);
  assert.equal(person.affiliation, undefined);
  assert.deepEqual(person.sameAs, [
    'https://de.linkedin.com/in/gillespenning',
    'https://bsky.app/profile/gillespe.bsky.social',
    'https://medtechsignal.substack.com/',
  ]);
  assert.equal(page.dateModified, '2026-10-26');
  assert.equal(reviewedMarkup(), 'Last reviewed <time datetime="2026-10-26">26 Oct 2026</time>');
});

test('the prerendered home page is crawlable without a font host', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.equal((html.match(/<figure\b/g) || []).length, 4);
  assert.match(html, /id="editorial-check"/);
  assert.match(html, /datetime="2026-10-26"/);
  assert.doesNotMatch(html, /fonts\.googleapis\.com/);
  assert.match(html, /rel="canonical" href="https:\/\/gillespenning\.com\/"/);
  assert.doesNotMatch(html, /worksFor/);
});
