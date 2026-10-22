import test from 'node:test';
import assert from 'node:assert/strict';
import { orderedNews, renderNewsSidebar, renderNewsArchive } from '../lib/news.js';

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

test('dashboard has three recent stories and All opens the full translated archive', () => {
  const en = renderNewsSidebar('en');
  const de = renderNewsSidebar('de');
  assert.equal((en.match(/<li>/g) || []).length, 3);
  assert.match(en, /href="\.\/news\/\?lang=en"/);
  assert.match(de, /href="\.\/news\/\?lang=de"/);
  assert.match(de, /Interessante Neuigkeiten/);
  assert.match(renderNewsArchive('en'), /id="heart-blue-screen"/);
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
