import newsData from '../data/news.json' with { type: 'json' };
import { escapeHtml as e } from './selectors.js';

const platforms = { substack: 'Substack', linkedin: 'LinkedIn', bluesky: 'Bluesky', ted: 'TED' };
const paths = {
  substack: 'M5 3h14M5 7h14M5 11h14v10l-7-4-7 4z',
  linkedin: 'M5 10v9M5 5v.1M10 19v-9M10 14c0-5 8-5 8 0v5',
  bluesky: 'M12 11C7 2 2 3 3 9c0 3 4 4 7 4-6 0-6 7-1 6l3-4 3 4c5 1 5-6-1-6 3 0 7-1 7-4 1-6-4-7-9 2z',
  ted: 'M9 5l10 7-10 7z',
};
const hosts = { substack: ['medtechsignal.substack.com', 'substack.com'], linkedin: ['de.linkedin.com', 'www.linkedin.com'], bluesky: ['bsky.app'], ted: ['www.ted.com', 'ted.com'] };

export function newsCopy(locale = 'en') {
  return locale === 'de'
    ? { title: 'Interessante Neuigkeiten', all: 'Alle', back: 'Zurück zum Dashboard', intro: 'Beiträge und Gedanken zu KI, Medizin und der Zukunft der Gesundheitsversorgung.', star: 'Substack-Artikel', key: 'Stern: Substack-Artikel', empty: 'Neue Beiträge folgen.', original: 'Original auf', order: 'Neueste zuerst · ursprüngliche Veröffentlichungsdaten', follow: 'Weitere Beiträge auf Substack', sources: 'Originalbeiträge' }
    : { title: 'Interesting news', all: 'All', back: 'Back to dashboard', intro: 'Posts and perspectives on AI, medicine and the future of healthcare.', star: 'Substack article', key: 'Star: Substack article', empty: 'More posts to come.', original: 'Original on', order: 'Newest first · original publication dates', follow: 'More on Substack', sources: 'Original posts' };
}

function safeSource(source) {
  try {
    const url = new URL(source.url);
    return url.protocol === 'https:' && !url.username && !url.password && hosts[source.platform]?.includes(url.hostname);
  } catch { return false; }
}

/** Only individually approved posts with original publication dates appear. */
export function orderedNews(items = newsData.items) {
  return items.filter(item => item.approved === true
    && /^\d{4}-\d{2}-\d{2}$/.test(item.date)
    && Number.isFinite(Date.parse(item.date + 'T12:00:00Z'))
    && new Date(item.date + 'T12:00:00Z').toISOString().slice(0, 10) === item.date
    && /^[a-z0-9-]+$/.test(item.id)
    && item.title?.en && item.summary?.en
    && item.sources?.length && item.sources.every(safeSource))
    .toSorted((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}

function star(item, locale) {
  return item.sources.some(source => source.platform === 'substack')
    ? '<span class="news-star" role="img" aria-label="' + e(newsCopy(locale).star) + '">★</span> ' : '';
}

function sourceLinks(item, locale, compact = false) {
  const copy = newsCopy(locale);
  return '<nav class="news-sources" aria-label="' + e(copy.sources) + '">' + (compact ? item.sources.slice(0, 1) : item.sources).map(source =>
    '<a href="' + e(source.url) + '" target="_blank" rel="noopener noreferrer" aria-label="' + e(copy.original + ' ' + platforms[source.platform]) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + paths[source.platform] + '"/></svg><span>' + platforms[source.platform] + '</span><span aria-hidden="true">↗</span></a>').join('') + '</nav>';
}

function dateLabel(value, locale, compact = false) {
  return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'short', ...(compact ? {} : { year: 'numeric' }), timeZone: 'UTC' }).format(new Date(value + 'T12:00:00Z'));
}

export function renderNewsSidebar(locale = 'en', items = orderedNews()) {
  const copy = newsCopy(locale);
  return '<div class="news-panel-heading"><h2 id="interesting-news-title"><a href="./news/?lang=' + locale + '">' + copy.title + '</a></h2><a class="news-all" href="./news/?lang=' + locale + '">' + copy.all + ' <span aria-hidden="true">↗</span></a></div>'
    + '<ol class="news-preview-list">' + items.slice(0, 3).map(item => '<li><time datetime="' + item.date + '">' + dateLabel(item.date, locale, true) + '</time><h3>' + star(item, locale) + '<a href="./news/?lang=' + locale + '#' + item.id + '">' + e(item.title[locale] || item.title.en) + '</a></h3>' + sourceLinks(item, locale, true) + '</li>').join('') + '</ol>'
    + (items.length ? '' : '<p class="news-empty">' + copy.empty + '</p>');
}

export function renderNewsArchive(locale = 'en', items = orderedNews()) {
  return items.length ? '<ol class="news-archive-list">' + items.map(item => '<li><article id="' + item.id + '"><time datetime="' + item.date + '">' + dateLabel(item.date, locale) + '</time><div><h2>' + star(item, locale) + e(item.title[locale] || item.title.en) + '</h2><p>' + e(item.summary[locale] || item.summary.en) + '</p>' + sourceLinks(item, locale) + '</div></article></li>').join('') + '</ol>' : '<p class="news-empty">' + newsCopy(locale).empty + '</p>';
}
