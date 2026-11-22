import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { knowledgeTakeaway, assistanceTakeaway, autonomyTakeaway, keyResult } from '../lib/takeaways.js';
import { SITE_DESCRIPTION, jsonLd, REVIEWED_AT, reviewedMarkup } from '../lib/site-meta.js';

const cutoff = REVIEWED_AT;

test('public description stays within the search snippet limit', () => {
  assert.ok(SITE_DESCRIPTION.length <= 155);
  assert.match(REVIEWED_AT, /^\d{4}-\d{2}-\d{2}$/);
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
  assert.match(autonomy, /Claude Code \/ Opus 5\.5 completed 43\/75 tasks \(57\.3%\)/);
  assert.match(autonomy, /Different tasks and scoring from v1/);
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
  assert.equal(autonomy.model, 'Claude Code / Opus 5.5');
  assert.equal(autonomy.value, '57.3');
});

test('structured data names the person without an employer and links companion Wimmelbild', () => {
  const graph = JSON.parse(jsonLd());
  const website = graph['@graph'].find(item => item['@type'] === 'WebSite');
  const person = graph['@graph'].find(item => item['@type'] === 'Person');
  const page = graph['@graph'].find(item => item['@type'] === 'WebPage');
  assert.equal(person.name, 'Gilles Penning');
  assert.equal(person.url, 'https://gillespenning.com/');
  assert.equal(person.jobTitle, 'Medtech executive');
  assert.equal(person.worksFor, undefined);
  assert.equal(person.affiliation, undefined);
  assert.deepEqual(person.sameAs, [
    'https://de.linkedin.com/in/gillespenning',
    'https://bsky.app/profile/gillespe.bsky.social',
    'https://medtechsignal.substack.com/',
    'https://gillespenning.com/',
  ]);
  assert.equal(website.author['@id'], 'https://ai.gillespenning.com/#person');
  assert.deepEqual(website.inLanguage, ['en', 'de']);
  assert.equal(website.isRelatedTo.url, 'https://wimmelbild.gillespenning.com/');
  assert.ok(page.relatedLink.includes('https://wimmelbild.gillespenning.com/'));
  assert.equal(page.dateModified, REVIEWED_AT);
  assert.equal(reviewedMarkup('2026-11-02'), 'Last reviewed <time datetime="2026-11-02">2 Nov 2026</time>');
});

test('the prerendered home page is crawlable without a font host and includes SEO basics', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.equal((html.match(/<figure\b/g) || []).length, 4);
  assert.match(html, /id="editorial-check"/);
  assert.match(html, /datetime="2026-11-22"/);
  assert.doesNotMatch(html, /fonts\.googleapis\.com/);
  assert.match(html, /rel="canonical" href="https:\/\/ai\.gillespenning\.com\/"/);
  assert.match(html, /rel="alternate" hreflang="en" href="https:\/\/ai\.gillespenning\.com\/"/);
  assert.match(html, /rel="alternate" hreflang="x-default" href="https:\/\/ai\.gillespenning\.com\/"/);
  assert.match(html, /property="og:locale:alternate" content="de_DE"/);
  assert.match(html, /name="twitter:image:alt"/);
  assert.match(html, /data-href-en="https:\/\/wimmelbild\.gillespenning\.com\/en\/"/);
  assert.match(html, /data-href-de="https:\/\/wimmelbild\.gillespenning\.com\/"/);
  assert.match(html, /src="https:\/\/cloud\.umami\.is\/script\.js" data-website-id="5af25f91-45a9-45ba-b36c-5668b4ccfb00" data-domains="gillespenning\.com,ai\.gillespenning\.com,wimmelbild\.gillespenning\.com"/);
  assert.doesNotMatch(html, /worksFor/);

  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  assert.match(llms, /https:\/\/ai\.gillespenning\.com\//);
  assert.match(llms, /https:\/\/wimmelbild\.gillespenning\.com\//);
});

test('matching study cards render bilingual Wimmelbild scene deep-links outside primary sources', async () => {
  const { editorialCard, pointCardHtml } = await import('../lib/point-card.js');
  const { setLanguage } = await import('../lib/i18n.js');
  setLanguage('en');
  const mai = editorialCard('lower-mai-dxo-2026');
  const html = pointCardHtml(mai);
  assert.match(html, /class="card-wimmelbild"[\s\S]*?href="https:\/\/wimmelbild\.gillespenning\.com\/en\/#patient\/P01-S03"/);
  assert.match(html, /data-href-de="https:\/\/wimmelbild\.gillespenning\.com\/#patient\/P01-S03"/);
  assert.doesNotMatch(pointCardHtml(mai, { compact: true }), /card-wimmelbild/);

  const amie = editorialCard('amie-2025');
  assert.match(pointCardHtml(amie), /#patient\/P01-S02/);
  const mira = editorialCard('lower-mira-2026');
  assert.match(pointCardHtml(mira), /#all\/ALL-KLINIK/);
  const af = editorialCard('af2-paper-2021');
  assert.match(pointCardHtml(af), /#all\/MED/);
  const star = editorialCard('lower-star-2022');
  assert.match(pointCardHtml(star), /#all\/OP/);
  const ayers = editorialCard('lower-ayers-2023');
  assert.match(pointCardHtml(ayers), /#all\/ALL-KIND/);
});
