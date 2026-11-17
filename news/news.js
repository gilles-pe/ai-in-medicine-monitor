import { newsCopy, renderNewsArchive } from '../lib/news.js';
import { preferredLanguage } from '../lib/i18n.js';
import { shareUrlFor, shareMetaForItem, findShareItem } from '../lib/share.js';
import { monitorData } from '../lib/monitor-data.js';
import newsData from '../data/news.json' with { type: 'json' };

let storage;
try { storage = window.localStorage; } catch {}
function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.append(el); }
  el.setAttribute('content', value);
}
function updateNewsShareMeta() {
  const hashId = location.hash ? location.hash.slice(1) : '';
  const item = hashId ? findShareItem('news-' + hashId, monitorData, newsData.items) : null;
  if (!item) return;
  const meta = shareMetaForItem(item, new URL('../', location.href).href);
  setMeta('property', 'og:type', 'article');
  setMeta('property', 'og:title', meta.title);
  setMeta('property', 'og:description', meta.description);
  setMeta('property', 'og:url', meta.url);
  setMeta('property', 'og:image', meta.imageUrl);
  setMeta('name', 'twitter:title', meta.title);
  setMeta('name', 'twitter:description', meta.description);
  setMeta('name', 'twitter:image', meta.imageUrl);
}
function render(locale, persist = false) {
  const copy = newsCopy(locale);
  document.documentElement.lang = locale;
  document.title = copy.title + ' · Gilles Penning';
  document.querySelector('#news-title').textContent = copy.title;
  document.querySelector('#news-intro').textContent = copy.intro;
  
  
  document.querySelector('#news-back').textContent = '← ' + copy.back;
  document.querySelector('#news-back').href = '../?lang=' + locale;
  
  document.querySelector('#news-follow').textContent = copy.follow + ' ↗';
  document.querySelector('.skip-link').textContent = locale === 'de' ? 'Zum Inhalt' : 'Skip to content';
  document.querySelector('.language-switch').setAttribute('aria-label', locale === 'de' ? 'Sprache' : 'Language');
  document.querySelector('#news-items').innerHTML = renderNewsArchive(locale);
  document.querySelectorAll('[data-news-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.newsLanguage === locale)));
  updateNewsShareMeta();
  if (persist) {
    try { storage?.setItem('digital-health-language', locale); } catch {}
    const url = new URL(location.href); url.searchParams.set('lang', locale); history.replaceState(null, '', url);
  }
}
document.addEventListener('click', async event => {
  const shareBtn = event.target.closest('[data-card-share]');
  if (!shareBtn) return;
  const url = shareUrlFor(shareBtn.dataset.cardShare, new URL('../', location.href).href);
  try {
    await navigator.clipboard?.writeText(url);
    shareBtn.classList.add('is-copied');
    setTimeout(() => shareBtn.classList.remove('is-copied'), 1500);
  } catch {}
});
window.addEventListener('hashchange', updateNewsShareMeta);
document.addEventListener('site-language-change',event=>render(event.detail.locale));
render(preferredLanguage(location.search, storage));
if (location.hash) requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' }));
