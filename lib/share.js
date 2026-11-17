import { orderedNews } from './news.js';
import { SITE_ORIGIN } from './site-meta.js';
import { escapeHtml as e } from './selectors.js';

export const SITE_BASE = `${SITE_ORIGIN}/`;

const PLATFORMS = { substack: 'Substack', linkedin: 'LinkedIn', bluesky: 'Bluesky', ted: 'TED' };
const BADGE_LABELS = {
  peer_reviewed: 'Peer-reviewed',
  preprint: 'Preprint',
  historical_event: 'Historical event',
  benchmark_suite: 'Benchmark suite',
  official_report: 'Official report',
  vendor_report: 'Supplier report',
  unverified: 'Unverified record'
};

export function cardBadgeLabel(badge) {
  if (!badge) return 'Evidence record';
  const label = BADGE_LABELS[badge.kind] || 'Evidence record';
  return [label, badge.year].filter(Boolean).join(' · ');
}

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'item';
}

export function normalizeShareText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Build shareable card-top preview descriptors for every point, milestone, study, news item, and link. */
export function shareItems(monitorData, newsItems) {
  const items = [];
  const seen = new Set();
  const add = item => {
    if (!item?.id || seen.has(item.id)) return;
    seen.add(item.id);
    items.push(item);
  };

  const editorialCards = monitorData?.editorialCards || {};
  const makeCardShare = (id, card, targetHash = `?card=${encodeURIComponent(id)}`) => ({
    id,
    kind: 'card',
    badge: cardBadgeLabel(card.badge),
    title: normalizeShareText(card.title),
    tags: (card.tags || []).filter(Boolean).map(normalizeShareText).join(' · '),
    findingLabel: 'KEY FINDING',
    headline: normalizeShareText(card.finding?.headline || 'Result recorded'),
    explanation: normalizeShareText(card.finding?.explanation || ''),
    sourceUrl: card.sources?.[0]?.url || '',
    targetHash
  });
  for (const [id, card] of Object.entries(editorialCards)) {
    add(makeCardShare(id, card));
  }

  const legacy = monitorData?.extensions?.legacyDashboard || {};
  for (const tm of legacy.trackMilestones || []) {
    const card = editorialCards[tm.cardId || tm.id];
    if (card) {
      add(makeCardShare(tm.id, card, `#track-milestone-${encodeURIComponent(tm.id)}`));
      add(makeCardShare(`track-milestone-${tm.id}`, card, `?lang=en#track-milestone-${encodeURIComponent(tm.id)}`));
    }
  }
  const extraRecords = [
    ...(monitorData?.tracks || []).flatMap(t => (t.series || []).flatMap(s => s.data || [])),
    ...(legacy.studies || []),
    ...(legacy.measurements || []),
    ...(legacy.pointEvidence || []),
    ...(legacy.historyEvents || []),
    legacy.trustContext
  ].filter(Boolean);
  for (const record of extraRecords) {
    if (!record?.id || !record?.cardId) continue;
    const card = editorialCards[record.cardId];
    if (card) add(makeCardShare(record.id, card));
  }

  for (const news of orderedNews(newsItems)) {
    const primary = news.sources?.[0]?.platform;
    const platformLabel = PLATFORMS[primary] || 'Article';
    const tags = news.sources.map(s => (PLATFORMS[s.platform] || s.platform).toUpperCase()).join(' · ');
    add({
      id: `news-${news.id}`,
      kind: 'news',
      badge: `${platformLabel} · ${news.date}`,
      title: normalizeShareText(news.title.en),
      tags: `NEWS · ${tags}`,
      findingLabel: 'SUMMARY',
      headline: normalizeShareText(news.summary.en),
      explanation: '',
      sourceUrl: news.sources?.[0]?.url || '',
      targetHash: `news/?lang=en#${encodeURIComponent(news.id)}`
    });
  }

  for (const link of monitorData?.extensions?.navigation?.relatedLinks || []) {
    const slug = slugify(link.title);
    add({
      id: `link-${slug}`,
      kind: 'link',
      badge: `External resource${link.publisher ? ' · ' + normalizeShareText(link.publisher) : ''}`,
      title: normalizeShareText(link.title),
      tags: `RELATED RESOURCE${link.publisher ? ' · ' + normalizeShareText(link.publisher).toUpperCase() : ''}`,
      findingLabel: 'EXTERNAL LINK',
      headline: normalizeShareText(link.title),
      explanation: link.publisher ? `Referenced external resource published by ${normalizeShareText(link.publisher)}.` : 'Referenced external resource.',
      sourceUrl: link.url || '',
      targetHash: '#charts'
    });
  }

  for (const source of monitorData?.extensions?.legacyDashboard?.sourceCatalog || []) {
    const matchEntry = Object.entries(editorialCards).find(([, card]) =>
      (card.sources || []).some(s => s.url === source.url)
    );
    const cardId = matchEntry?.[0];
    const card = matchEntry?.[1];
    add({
      id: `source-${slugify(source.id)}`,
      kind: 'link',
      badge: `Primary source${source.publisher ? ' · ' + normalizeShareText(source.publisher) : ''}`,
      title: normalizeShareText(source.title),
      tags: `SOURCE REFERENCE${source.publisher ? ' · ' + normalizeShareText(source.publisher).toUpperCase() : ''}`,
      findingLabel: card?.finding?.headline ? 'KEY FINDING' : 'PRIMARY SOURCE',
      headline: normalizeShareText(card?.finding?.headline || source.title),
      explanation: normalizeShareText(card?.finding?.explanation || (source.publisher ? `Published by ${source.publisher}.` : '')),
      sourceUrl: source.url || '',
      targetHash: cardId ? `?card=${encodeURIComponent(cardId)}` : '#content'
    });
  }

  return items;
}

export function findShareItem(id, monitorData, newsItems) {
  if (!id) return null;
  return shareItems(monitorData, newsItems).find(item => item.id === id) || null;
}

export function shareUrlFor(id, baseHref = '') {
  const rel = `./share/${encodeURIComponent(id)}/`;
  if (!baseHref) return rel;
  try {
    return new URL(rel, baseHref).href;
  } catch {
    return rel;
  }
}

export function shareMetaForItem(item, baseUrl = SITE_BASE) {
  const safeBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const idPart = encodeURIComponent(item.id);
  const url = `${safeBase}share/${idPart}/`;
  const imageUrl = `${url}og.png`;
  const description = [item.headline, item.explanation].filter(Boolean).join(' — ').slice(0, 220);
  const imageAlt = `${item.title}: ${item.headline}`.slice(0, 200);
  return {
    title: item.title,
    description,
    url,
    imageUrl,
    imageAlt
  };
}

/** Word-wrap helper using approximate proportional character widths for clean SVG/card fitting. */
export function wrapTextLines(text, maxWidthPx, avgCharPx, maxLines) {
  const words = normalizeShareText(text).split(' ').filter(Boolean);
  if (!words.length) return [];
  const narrow = /[ijlI.,;:'|!1]/;
  const wide = /[MWQGmw@#%&—–]/;
  const measure = str => {
    let w = 0;
    for (const ch of str) {
      w += narrow.test(ch) ? avgCharPx * 0.56 : wide.test(ch) ? avgCharPx * 1.28 : avgCharPx;
    }
    return w;
  };
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (!current || measure(candidate) <= maxWidthPx) {
      current = candidate;
    } else {
      lines.push(current);
      if (lines.length >= maxLines) {
        lines[lines.length - 1] = truncateLine(lines[lines.length - 1], maxWidthPx, avgCharPx);
        return lines;
      }
      current = word;
    }
  }
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    const trimmed = lines.slice(0, maxLines);
    trimmed[maxLines - 1] = truncateLine(trimmed[maxLines - 1], maxWidthPx, avgCharPx);
    return trimmed;
  }
  return lines;
}

function truncateLine(line, maxWidthPx, avgCharPx) {
  let text = line;
  while (text.length > 8 && text.length * avgCharPx > maxWidthPx - avgCharPx * 2) {
    text = text.replace(/\s+\S*$/, '') || text.slice(0, -1);
  }
  return `${text}…`;
}

/** Render a calm 1200x630 SVG depicting ONLY the top section of the shared card (no site/author banner). */
export function renderCardTopSvg(item) {
  const titleLines = wrapTextLines(item.title, 920, 23.5, 2);
  const tagLines = item.tags ? wrapTextLines(item.tags.toUpperCase(), 920, 11.2, 2) : [];
  const headlineLines = wrapTextLines(item.headline, 860, 15.8, 2);
  const expLines = item.explanation ? wrapTextLines(item.explanation, 860, 11.8, 3) : [];

  const titleRelY = 102;
  const titleStep = 55;
  const titleRelBottom = titleRelY + Math.max(0, titleLines.length - 1) * titleStep;

  const tagsRelY = titleRelBottom + 34;
  const tagsStep = 24;
  const tagsRelBottom = tagLines.length ? tagsRelY + (tagLines.length - 1) * tagsStep : titleRelBottom;

  const boxRelTop = tagsRelBottom + 26;
  const microRelY = boxRelTop + 36;
  const headRelY = microRelY + 38;
  const headStep = 36;
  const headRelBottom = headRelY + Math.max(0, headlineLines.length - 1) * headStep;
  const expRelY = headRelBottom + 34;
  const expStep = 30;
  const contentRelBottom = expLines.length ? expRelY + (expLines.length - 1) * expStep + 28 : headRelBottom + 28;
  const boxH = Math.max(120, Math.min(280, contentRelBottom - boxRelTop));

  const cardH = Math.min(540, 44 + boxRelTop + boxH + 44);
  const cardTop = Math.round((630 - cardH) / 2);
  const badgeTop = cardTop + 44;

  const badgeWidth = Math.max(160, Math.min(920, Math.round(item.badge.length * 11.2 + 34)));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${e(item.title)}">
  <rect width="1200" height="630" fill="#faf8f1"/>
  <rect x="76" y="${cardTop}" width="1048" height="${cardH}" rx="14" fill="#fffdf9" stroke="#cfd6cc" stroke-width="2"/>
  <rect x="128" y="${badgeTop}" width="${badgeWidth}" height="38" rx="6" fill="#efefe6" stroke="#cfd6cc" stroke-width="1.5"/>
  <text x="145" y="${badgeTop + 25}" fill="#3d5258" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="18" font-weight="600">${e(item.badge)}</text>
  ${titleLines.map((line, i) => `<text x="128" y="${badgeTop + titleRelY + i * titleStep}" fill="#103641" font-family="Newsreader, Georgia, serif" font-size="48" font-weight="400" letter-spacing="-0.8">${e(line)}</text>`).join('')}
  ${tagLines.map((line, i) => `<text x="128" y="${badgeTop + tagsRelY + i * tagsStep}" fill="#64726b" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="17" font-weight="500" letter-spacing="1.2">${e(line)}</text>`).join('')}
  <rect x="128" y="${badgeTop + boxRelTop}" width="944" height="${boxH}" rx="6" fill="#eeede4"/>
  <rect x="128" y="${badgeTop + boxRelTop}" width="5" height="${boxH}" fill="#d49b32"/>
  <text x="158" y="${badgeTop + microRelY}" fill="#6b7369" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="16" font-weight="600" letter-spacing="1.4">${e(item.findingLabel || 'KEY FINDING')}</text>
  ${headlineLines.map((line, i) => `<text x="158" y="${badgeTop + headRelY + i * headStep}" fill="#103641" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="28" font-weight="700">${e(line)}</text>`).join('')}
  ${expLines.map((line, i) => `<text x="158" y="${badgeTop + expRelY + i * expStep}" fill="#364c52" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="21" font-weight="400">${e(line)}</text>`).join('')}
</svg>`;
}
