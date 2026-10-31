import test from 'node:test';
import assert from 'node:assert/strict';
import { orderedNews, renderNewsSidebar, renderNewsArchive, newsCategory, newsLanguage } from '../lib/news.js';

test('news retains original publication dates and orders approved stories newest first', () => {
  const items = orderedNews();
  assert.ok(items.length >= 4);
  assert.deepEqual(items.map(item => item.date), items.map(item => item.date).toSorted().reverse());
  const story = items.find(item => item.id === 'langweilige-ai-revolution');
  assert.equal(story.date, '2026-10-13');
  assert.deepEqual(story.sources.map(source => source.platform), ['substack', 'linkedin', 'bluesky']);
  assert.equal(items.filter(item => item.id === story.id).length, 1, 'cross-posts remain one story with several original links');
});

test('unapproved posts, invalid calendar dates and unsafe source links stay unpublished', () => {
  const approved = orderedNews()[0];
  const input = [approved, { ...approved, id: 'pending', approved: false }, { ...approved, id: 'invalid-date', date: '2026-02-30' }, { ...approved, id: 'unsafe-source', sources: [{ platform: 'bluesky', url: 'javascript:alert(1)' }] }, { ...approved, id: 'wrong-host', sources: [{ platform: 'linkedin', url: 'https://example.com' }] }];
  assert.deepEqual(orderedNews(input).map(item => item.id), [approved.id]);
});

test('dashboard has four recent stories and All opens the full translated archive', () => {
  const en = renderNewsSidebar('en');
  const de = renderNewsSidebar('de');
  assert.equal((en.match(/<li>/g) || []).length, 4);
  assert.match(en, /href="\.\/news\/\?lang=en"/);
  assert.match(de, /href="\.\/news\/\?lang=de"/);
  assert.match(en, />Latest News</);
  assert.match(de, />Aktuelles</);
  assert.match(en, /class="news-teaser"/);
  assert.match(en, />EN</);
  assert.match(en, />Post</);
  const archive = renderNewsArchive('en');
  assert.match(archive, />DE</);
  assert.match(archive, />Article</);
  assert.match(archive, /id="heart-blue-screen"/);
  assert.doesNotMatch(archive, /<details|<summary|fold-preview/);
  assert.match(archive, /id="news-year-2026"/);
});

test('every Substack story has a star and original links carry named platform icons', () => {
  const items = orderedNews();
  const html = renderNewsArchive('en');
  assert.equal((html.match(/class="news-star"/g) || []).length, items.filter(item => item.sources.some(source => source.platform === 'substack')).length);
  for (const item of items) for (const source of item.sources) {
    assert.ok(html.includes('href="' + source.url + '"'));
  }
  assert.match(html, /aria-label="Original on LinkedIn"/);
  assert.match(html, /aria-hidden="true"><path/);
  assert.match(html, /target="_blank" rel="noopener noreferrer"/);
});

test('verified original metadata overrides translated-headline heuristics',()=>{
  const amie=orderedNews().find(item=>item.id==='amie-before-the-appointment');
  assert.equal(newsLanguage(amie),'en');assert.equal(newsCategory(amie),'post');
  assert.equal(newsLanguage({...amie,originalLanguage:'de',title:{en:'English translation',de:'Deutsches Original'}}),'de');
});

test('linked diagnosis news opens its exact chart milestone in both languages',()=>{
  const home=renderNewsSidebar('en');
  const archive=renderNewsArchive('de');
  assert.match(home, /id="news-ai-diagnosis-doctor-choice"[\s\S]*?href="\.\/\?lang=en#track-milestone-lower-mai-dxo-2026"/);
  assert.match(archive, /id="ai-diagnosis-doctor-choice"[\s\S]*?href="\.\.\/\?lang=de#track-milestone-lower-mai-dxo-2026"/);
  assert.match(home, /View point in chart/);
  assert.match(archive, /Punkt im Diagramm ansehen/);
});
