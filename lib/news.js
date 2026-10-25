import newsData from '../data/news.json' with { type: 'json' };
import { escapeHtml as e } from './selectors.js';

const platforms = { substack: 'Substack', linkedin: 'LinkedIn', x: 'X', bluesky: 'Bluesky', ted: 'TED' };
const paths = {
  substack: 'M5 3h14M5 7h14M5 11h14v10l-7-4-7 4z',
  linkedin: 'M5 10v9M5 5v.1M10 19v-9M10 14c0-5 8-5 8 0v5',
  bluesky: 'M12 11C7 2 2 3 3 9c0 3 4 4 7 4-6 0-6 7-1 6l3-4 3 4c5 1 5-6-1-6 3 0 7-1 7-4 1-6-4-7-9 2z',
  x: 'M4 4l16 16M20 4L4 20',
  ted: 'M9 5l10 7-10 7z',
};
const hosts = { substack: ['medtechsignal.substack.com', 'substack.com'], linkedin: ['de.linkedin.com', 'www.linkedin.com','linkedin.com'], bluesky: ['bsky.app'], x: ['x.com','www.x.com','twitter.com','www.twitter.com'], ted: ['www.ted.com', 'ted.com'] };

export function newsCopy(locale = 'en') {
  return locale === 'de'
    ? { title: 'Chronologische News', all: 'Alle', back: 'Zurück zum Medical-AI-Dashboard', intro: 'Beiträge und Gedanken zu KI, Medizin und der Zukunft der Gesundheitsversorgung.', star: 'Substack-Artikel', key: 'Stern: Substack-Artikel', empty: 'Neue Beiträge folgen.', original: 'Original auf', order: 'Neueste zuerst · ursprüngliche Veröffentlichungsdaten', follow: 'Weitere Beiträge auf Substack', sources: 'Originalbeiträge', category: 'Kategorie', language: 'Sprache', source: 'Quelle', article: 'Artikel', post: 'Beitrag', allFilters: 'Alle' }
    : { title: 'Chronological news', all: 'All', back: 'Back to medical AI dashboard', intro: 'Posts and perspectives on AI, medicine and the future of healthcare.', star: 'Substack article', key: 'Star: Substack article', empty: 'More posts to come.', original: 'Original on', order: 'Newest first · original publication dates', follow: 'More on Substack', sources: 'Original posts', category: 'Category', language: 'Language', source: 'Source', article: 'Article', post: 'Post', allFilters: 'All' };
}

/** Prefer explicit metadata; keep compatibility with older approved entries. */
export function newsCategory(item) {
  if(['article','post'].includes(item.category))return item.category;
  return item.sources?.some(source => source.platform === 'substack') ? 'article' : 'post';
}

/** Original language of the story, not the interface language. Differing titles use the English headline. */
export function newsLanguage(item) {
  if(['en','de'].includes(item.originalLanguage))return item.originalLanguage;
  const en = item.title?.en || '';
  const de = item.title?.de || '';
  if (en !== de) return 'en';
  return /[äöüÄÖÜß]|\b(Die|der|und|für)\b/.test(en) ? 'de' : 'en';
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
  return newsCategory(item)==='article' && item.sources.some(source => source.platform === 'substack')
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

function tags(item, copy) {
  const category = newsCategory(item) === 'article' ? copy.article : copy.post;
  const language = newsLanguage(item) === 'de' ? 'DE' : 'EN';
  return '<p class="news-tags"><span class="news-tag">' + e(category) + '</span><span aria-hidden="true"> · </span><span class="news-tag" lang="' + (language === 'DE' ? 'de' : 'en') + '">' + language + '</span></p>';
}

function cardAttrs(item) {
  return ' data-category="' + newsCategory(item) + '" data-lang="' + newsLanguage(item) + '" data-sources="' + e(item.sources.map(source => source.platform).join(' ')) + '"';
}

function thumbnail(item,locale) {
  const src=item.thumbnail?.url;
  try { if(!src||new URL(src).protocol!=='https:')return ''; }catch{return '';}
  return '<img class="news-thumbnail" src="'+e(src)+'" alt="'+e((typeof item.thumbnail?.alt==='object'?item.thumbnail.alt[locale]||item.thumbnail.alt.en:item.thumbnail?.alt)||'')+'" width="88" height="88" loading="lazy" decoding="async" referrerpolicy="no-referrer">';
}
function story(item,locale,compact){
  const copy=newsCopy(locale),title=item.title[locale]||item.title.en,text=item.summary[locale]||item.summary.en;
  return '<article id="'+(compact?'news-':'')+e(item.id)+'" class="news-card-item"'+cardAttrs(item)+'><time datetime="'+item.date+'">'+dateLabel(item.date,locale,compact)+'</time><h'+(compact?'3':'2')+'>'+star(item,locale)+'<a href="'+e(item.sources[0].url)+'" target="_blank" rel="noopener noreferrer">'+e(title)+'</a></h'+(compact?'3':'2')+'>'+thumbnail(item,locale)+'<details class="news-fold"><summary aria-label="'+e(locale==='de'?'Zusammenfassung öffnen':'Expand summary')+'"><span class="fold-preview">'+e(text)+'</span></summary><div class="fold-content"><p class="news-teaser">'+e(text)+'</p><div class="news-meta-row">'+tags(item,copy)+sourceLinks(item,locale)+'</div></div></details></article>';
}
export function renderNewsSidebar(locale = 'en', items = orderedNews()) {
  const copy=newsCopy(locale);
  return '<div class="news-panel-heading"><h2 id="interesting-news-title"><a href="./news/?lang='+locale+'">'+(locale==='de'?'Aktuelles':'Latest news')+'</a></h2><a class="news-all" href="./news/?lang='+locale+'">'+copy.all+' ↗</a></div><ol class="news-preview-list">'+items.slice(0,4).map(item=>'<li>'+story(item,locale,true)+'</li>').join('')+'</ol>';
}
export function renderNewsArchive(locale = 'en', items = orderedNews()) {
  if(!items.length)return '<p>'+newsCopy(locale).empty+'</p>';
  const years=[...new Set(items.map(item=>item.date.slice(0,4)))];
  return years.map(year=>'<section class="news-year" id="news-year-'+year+'"><h2>'+year+'</h2><ol class="news-archive-list">'+items.filter(item=>item.date.startsWith(year)).map(item=>'<li>'+story(item,locale,false)+'</li>').join('')+'</ol></section>').join('');
}
export function newsStructuredData(items=orderedNews()){
  return JSON.stringify({'@context':'https://schema.org','@type':'ItemList',name:'Chronological news',itemListElement:items.map((item,i)=>({'@type':'ListItem',position:i+1,item:{'@type':newsCategory(item)==='article'?'BlogPosting':'SocialMediaPosting',headline:item.title.en,datePublished:item.date,author:{'@type':'Person',name:'Gilles Penning'},url:item.sources[0].url,...(item.thumbnail?.url?{image:item.thumbnail.url}:{})}}))}).replaceAll('<','\\u003c');
}

export function renderNewsRss(items = orderedNews()) {
  const xml = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
  const channel = 'https://gillespenning.com/news/';
  const entries = items.map(item => {
    const link = channel + '#' + item.id;
    const pubDate = new Date(item.date + 'T12:00:00Z').toUTCString();
    return '<item><title>' + xml(item.title.en) + '</title><link>' + xml(link) + '</link><guid isPermaLink="true">' + xml(link) + '</guid><pubDate>' + pubDate + '</pubDate><description>' + xml(item.summary.en) + '</description></item>';
  }).join('\n');
  return '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n<title>Digital Health &amp; AI in Medicine</title>\n<link>' + channel + '</link>\n<description>Posts and perspectives on AI, medicine and the future of healthcare.</description>\n' + entries + '\n</channel>\n</rss>\n';
}
