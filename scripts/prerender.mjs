import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { homeFragments } from '../lib/published-page.js';
import { renderNewsArchive, renderNewsRss } from '../lib/news.js';
import { jsonLd, REVIEWED_AT, SITE_ORIGIN, SITE_DESCRIPTION, SITE_NAME } from '../lib/site-meta.js';

function fill(html, key, value) {
  const pattern = new RegExp('<!--static:' + key + '-->[\\s\\S]*?<!--/static:' + key + '-->');
  if (!pattern.test(html)) throw new Error('Missing prerender marker: ' + key);
  return html.replace(pattern, '<!--static:' + key + '-->' + value + '<!--/static:' + key + '-->');
}

function jsonScript(pathName, name, description) {
  return '<script type="application/ld+json">' + jsonLd({ path: pathName, name, description, dateModified: REVIEWED_AT }) + '</script>';
}

export async function prerenderTree(root) {
  const fragments = homeFragments();
  let home = await readFile(path.join(root, 'index.html'), 'utf8');
  home = fill(home, 'jsonld', jsonScript('/', SITE_NAME, SITE_DESCRIPTION));
  home = fill(home, 'reviewed', fragments.reviewed);
  home = fill(home, 'overview', fragments.overview);
  home = fill(home, 'news', fragments.news);
  home = fill(home, 'milestones', fragments.milestones);
  home = fill(home, 'previews', fragments.previews);
  home = fill(home, 'tracks', fragments.tracks);
  home = fill(home, 'studies', fragments.studies);
  home = fill(home, 'glossary', fragments.glossary);
  home = fill(home, 'sources', fragments.sources);
  if (!home.includes('id="editorial-check"') || !home.includes('datetime="' + REVIEWED_AT + '"')) {
    throw new Error('Last reviewed markup is missing from index.html');
  }
  if (home.includes('fonts.googleapis.com')) throw new Error('External font stylesheet is still referenced.');
  await writeFile(path.join(root, 'index.html'), home);

  let news = await readFile(path.join(root, 'news/index.html'), 'utf8');
  news = fill(news, 'jsonld', jsonScript('/news/', 'Latest | Gilles Penning', "Gilles Penning's posts and perspectives on AI, medicine and the future of healthcare."));
  news = fill(news, 'archive', renderNewsArchive('en'));
  if (news.includes('fonts.googleapis.com')) throw new Error('External font stylesheet is still referenced.');
  await writeFile(path.join(root, 'news/index.html'), news);

  const pages = ['', 'news/', 'about/', 'impressum/'];
  await writeFile(path.join(root, 'rss.xml'), renderNewsRss());
  const body = pages.map(page => '  <url><loc>' + SITE_ORIGIN + '/' + page + '</loc><lastmod>' + REVIEWED_AT + '</lastmod></url>').join('\n');
  await writeFile(path.join(root, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + '\n</urlset>\n');
  await writeFile(path.join(root, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: ' + SITE_ORIGIN + '/sitemap.xml\n');
  return { reviewedAt: REVIEWED_AT, pages };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
  const result = await prerenderTree(root);
  console.log('Prerendered public HTML. Last reviewed ' + result.reviewedAt + '.');
}
