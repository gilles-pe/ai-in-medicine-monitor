import { newsCopy, renderNewsArchive } from '../lib/news.js';
import { preferredLanguage } from '../lib/i18n.js';

let storage;
try { storage = window.localStorage; } catch {}
function render(locale, persist = false) {
  const copy = newsCopy(locale);
  document.documentElement.lang = locale;
  document.title = copy.title + ' · Gilles Penning';
  document.querySelector('#news-title').textContent = copy.title;
  document.querySelector('#news-intro').textContent = copy.intro;
  document.querySelector('#news-order').textContent = copy.order;
  document.querySelector('#news-star-key').textContent = copy.key;
  document.querySelector('#news-back').textContent = '← ' + copy.back;
  document.querySelector('#news-back').href = '../?lang=' + locale;
  document.querySelector('#news-home').href = '../?lang=' + locale;
  document.querySelector('#news-follow').textContent = copy.follow + ' ↗';
  document.querySelector('.skip-link').textContent = locale === 'de' ? 'Zum Inhalt' : 'Skip to content';
  document.querySelector('.language-switch').setAttribute('aria-label', locale === 'de' ? 'Sprache' : 'Language');
  document.querySelector('#news-items').innerHTML = renderNewsArchive(locale);
  for (const [id, key] of [['#news-filter-category-label', 'category'], ['#news-filter-language-label', 'language'], ['#news-filter-source-label', 'source']]) {
    const label = document.querySelector(id);
    if (label) label.firstChild.textContent = copy[key] + ' ';
  }
  document.querySelectorAll('#news-filters option[value=""]').forEach(option => { option.textContent = copy.allFilters; });
  const article = document.querySelector('#news-filters option[value="article"]');
  const post = document.querySelector('#news-filters option[value="post"]');
  if (article) article.textContent = copy.article;
  if (post) post.textContent = copy.post;
  applyNewsFilters();
  document.querySelectorAll('[data-news-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.newsLanguage === locale)));
  if (persist) {
    try { storage?.setItem('digital-health-language', locale); } catch {}
    const url = new URL(location.href); url.searchParams.set('lang', locale); history.replaceState(null, '', url);
  }
}
function applyNewsFilters() {
  const category = document.querySelector('#news-filter-category')?.value || '';
  const language = document.querySelector('#news-filter-language')?.value || '';
  const source = document.querySelector('#news-filter-source')?.value || '';
  document.querySelectorAll('#news-items article').forEach(article => {
    const sources = (article.dataset.sources || '').split(' ');
    const show = (!category || article.dataset.category === category) && (!language || article.dataset.lang === language) && (!source || sources.includes(source));
    const item = article.closest('li');
    if (item) item.hidden = !show;
  });
  document.querySelectorAll('#news-items .news-year').forEach(year => {
    year.hidden = ![...year.querySelectorAll('li')].some(item => !item.hidden);
  });
}
document.querySelector('#news-filters')?.addEventListener('change', applyNewsFilters);
document.querySelectorAll('[data-news-language]').forEach(button => button.addEventListener('click', () => render(button.dataset.newsLanguage, true)));
render(preferredLanguage(location.search, storage));
if (location.hash) requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' }));
