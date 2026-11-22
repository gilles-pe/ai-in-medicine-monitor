import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { shareItems, findShareItem, shareMetaForItem, renderCardTopSvg } from '../lib/share.js';
import { renderShareHtml } from '../scripts/generate-share-pages.mjs';
import { latestDataPoints, renderLatestDataPoints } from '../lib/latest-points.js';
import { UPDATED_AT, reviewedMarkup, updatedMarkup } from '../lib/site-meta.js';

const monitorData = JSON.parse(await readFile(new URL('../data/monitor-data.json', import.meta.url), 'utf8'));
const newsData = JSON.parse(await readFile(new URL('../data/news.json', import.meta.url), 'utf8'));

test('shareItems includes every editorial card, news story, related link and source reference', () => {
  const items = shareItems(monitorData, newsData.items);
  assert.ok(items.length >= Object.keys(monitorData.editorialCards).length + newsData.items.length);
  const milestone = findShareItem('3.9', monitorData, newsData.items);
  assert.equal(milestone.title, 'Claude 3.5 Sonnet v2');
  assert.match(milestone.headline, /69\.67%/);
  const news = findShareItem('news-langweilige-ai-revolution', monitorData, newsData.items);
  assert.equal(news.title, 'Die langweilige AI-Revolution');
  assert.equal(news.targetHash, 'news/?lang=en#langweilige-ai-revolution');
  const link = findShareItem('link-ai-capabilities-vs-human-performance', monitorData, newsData.items);
  assert.equal(link.title, 'AI capabilities vs. human performance');
});

test('card-top SVG and OG meta omit site/author banner and focus on the top section of the item card', () => {
  for (const id of ['3.9', 'mira-2026', 'news-langweilige-ai-revolution', 'link-ai-capabilities-vs-human-performance']) {
    const item = findShareItem(id, monitorData, newsData.items);
    const meta = shareMetaForItem(item);
    assert.equal(meta.title, item.title);
    assert.doesNotMatch(meta.title, /Gilles Penning|Digital Health & AI in Medicine/i);
    assert.doesNotMatch(meta.description, /Gilles Penning|Digital Health & AI in Medicine/i);

    const svg = renderCardTopSvg(item);
    assert.match(svg, /<svg /);
    assert.doesNotMatch(svg, /Gilles Penning|Digital Health &amp; AI in Medicine|SETUP &amp; COHORT|LIMITATIONS/i);

    const html = renderShareHtml(item);
    const idSeg = encodeURIComponent(item.id).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(html, new RegExp(`rel="canonical" href="https://ai\\.gillespenning\\.com/share/${idSeg}/"`));
    assert.match(html, new RegExp(`property="og:url" content="https://ai\\.gillespenning\\.com/share/${idSeg}/"`));
    assert.match(html, /property="og:image:width" content="1200"/);
    assert.match(html, /property="og:image:height" content="630"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.doesNotMatch(html, /Gilles Penning/i);
  }
});

test('latestDataPoints stays newest-first, respects cutoffs and uses non-colliding attributes', () => {
  const top = latestDataPoints('2026-10-18', 4);
  assert.equal(top.length, 4);
  assert.equal(top[0].cardId, 'learning-impact');
  assert.ok(new Set(top.map(item => item.cardId)).size === 4);
  for (let i = 1; i < top.length; i++) {
    assert.ok(top[i - 1].sortDate >= top[i].sortDate);
  }
  const latest = latestDataPoints('2026-11-02', 4);
  assert.equal(latest.length, 4);
  assert.equal(latest[0].cardId, 'hab-v2-opus55');
  assert.equal(latest[0].metricLabel, '57.3% · HealthAgentBench v2');
  const historical = latestDataPoints('2020-12-31', 4);
  assert.ok(historical.every(item => item.sortDate <= '2020-12-31'));

  const html = renderLatestDataPoints('2026-10-18', 4);
  assert.match(html, />Latest Research</);
  assert.equal(latestDataPoints('2026-11-21').length, 3);
  assert.equal(latest[0].title, 'AI agent tackles clinical workflows');
  assert.equal((html.match(/data-latest-card=/g) || []).length, 4);
  assert.doesNotMatch(html, /data-study-id|data-overview-point|data-observation-id/);
});

test('academic editorial layout keeps Latest above News, collapsed milestones and single Last updated date', async () => {
  assert.equal(UPDATED_AT, '2026-11-22');
  assert.equal(reviewedMarkup('2026-11-02'), 'Last reviewed <time datetime="2026-11-02">2 Nov 2026</time>');
  assert.equal(updatedMarkup(), 'Last updated <time datetime="2026-11-22">22 Nov 2026</time>');

  const home = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(home, /source-sans-3-latin\.woff2/);
  assert.match(home, /source-serif-4-latin\.woff2/);
  assert.match(home, /<details class="chart-data-table"><summary>Overview<\/summary>/);
  assert.match(home, /<details class="overview-milestone-strip" id="overview-milestone-strip" aria-label="Milestones"><summary class="overview-milestone-head"><span class="overview-milestone-title">Milestones<\/span>/);
  assert.match(home, /id="editorial-check"[\s\S]*?Last updated <time datetime="2026-11-22">22 Nov 2026<\/time>/);
  assert.doesNotMatch(home, /id="site-updated"|Last reviewed/);
  assert.ok(home.indexOf('id="latest-data-points"') < home.indexOf('id="interesting-news"'));
});
