import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { homeFragments } from '../lib/published-page.js';
import {renderSiteHeader,renderSectionNav} from '../lib/site-header.js';
import { renderNewsArchive, renderNewsRss, newsStructuredData } from '../lib/news.js';
import { jsonLd, REVIEWED_AT, SITE_ORIGIN, SITE_DESCRIPTION, SITE_NAME } from '../lib/site-meta.js';

function fill(html, key, value) {
  const pattern = new RegExp('<!--static:' + key + '-->[\\s\\S]*?<!--/static:' + key + '-->');
  if (!pattern.test(html)) throw new Error('Missing prerender marker: ' + key);
  return html.replace(pattern, '<!--static:' + key + '-->' + value + '<!--/static:' + key + '-->');
}

function sharedFrame(html,prefix='./',{secondary=false}={}) {
  const header='<!--shared:header-->'+renderSiteHeader(prefix)+'<!--/shared:header-->';
  const nav='<!--shared:nav-->'+renderSectionNav(prefix)+'<!--/shared:nav-->';
  const headerMarker=/<!--shared:header-->[\s\S]*?<!--\/shared:header-->/;
  if(headerMarker.test(html))html=html.replace(headerMarker,header);
  else html=html.replace(/<header\b[\s\S]*?<\/header>/,header);
  const navMarker=/<!--shared:nav-->[\s\S]*?<!--\/shared:nav-->/;
  if(navMarker.test(html))html=html.replace(navMarker,nav);
  else if(/<nav id="section-nav"[\s\S]*?<\/nav>/.test(html))html=html.replace(/<nav id="section-nav"[\s\S]*?<\/nav>/,nav);
  else html=html.replace('<!--/shared:header-->','<!--/shared:header-->\n'+nav);
  if(secondary&&!html.includes('src="'+prefix+'lib/site-shell.js"'))html=html.replace('</body>','<script type="module" src="'+prefix+'lib/site-shell.js"></script>\n</body>');
  return html;
}

function jsonScript(pathName, name, description) {
  return '<script type="application/ld+json">' + jsonLd({ path: pathName, name, description, dateModified: REVIEWED_AT }) + '</script>';
}

export async function prerenderTree(root) {
  const fragments = homeFragments();
  let home = sharedFrame(await readFile(path.join(root, 'index.html'), 'utf8'));
  home = fill(home, 'jsonld', jsonScript('/', SITE_NAME, SITE_DESCRIPTION));
  home = fill(home, 'reviewed', fragments.reviewed);
  home = fill(home, 'overview', fragments.overview);
  home = fill(home, 'news', fragments.news);
  if(home.includes('<!--static:milestones-->'))home = fill(home, 'milestones', fragments.milestones);
  home = fill(home, 'previews', fragments.previews);
  home = fill(home, 'tracks', fragments.tracks);
  if(home.includes('<!--static:studies-->'))home = fill(home, 'studies', fragments.studies);
  home = fill(home, 'glossary', fragments.glossary);
  if(home.includes('<!--static:sources-->'))home = fill(home, 'sources', fragments.sources);
  if (!home.includes('id="editorial-check"') || !home.includes('datetime="' + REVIEWED_AT + '"')) {
    throw new Error('Last reviewed markup is missing from index.html');
  }
  if (home.includes('fonts.googleapis.com')) throw new Error('External font stylesheet is still referenced.');
  await writeFile(path.join(root, 'index.html'), home);

  let news = sharedFrame(await readFile(path.join(root, 'news/index.html'), 'utf8'),'../',{secondary:true});
  news = fill(news, 'jsonld', jsonScript('/news/', 'Chronological news | Gilles Penning', "Gilles Penning's posts and perspectives on AI, medicine and the future of healthcare."));
  news = fill(news, 'archive', renderNewsArchive('en'));
  const newsItems='<script type="application/ld+json" id="news-structured-items">'+newsStructuredData()+'</script>';
  if(/<script[^>]*id="news-structured-items"[\s\S]*?<\/script>/.test(news))news=news.replace(/<script[^>]*id="news-structured-items"[\s\S]*?<\/script>/,newsItems);
  else news=news.replace('</head>',newsItems+'\n</head>');
  if (news.includes('fonts.googleapis.com')) throw new Error('External font stylesheet is still referenced.');
  await writeFile(path.join(root, 'news/index.html'), news);

  for(const page of ['about','impressum','datenschutz']){
    const filename=path.join(root,page,'index.html');
    await writeFile(filename,sharedFrame(await readFile(filename,'utf8'),'../',{secondary:true}));
  }

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
