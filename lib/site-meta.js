import { monitorData } from './monitor-data.js';

export const SITE_ORIGIN = 'https://ai.gillespenning.com';
export const SITE_NAME = 'Digital Health & AI in Medicine';
export const SITE_TITLE = 'Digital Health & AI in Medicine | Gilles Penning';
export const SITE_DESCRIPTION = 'Digital health and AI in medicine: milestones, benchmarks and original studies.';
export const REVIEWED_AT = monitorData.meta.lastReviewedAt;
export const UPDATED_AT = '2026-11-21';
export const PROFILES = Object.freeze({
  linkedin: 'https://de.linkedin.com/in/gillespenning',
  bluesky: 'https://bsky.app/profile/gillespe.bsky.social',
  substack: 'https://medtechsignal.substack.com/',
});

export function absoluteUrl(pathname = '/') {
  const path = pathname.startsWith('/') ? pathname : '/' + pathname;
  return SITE_ORIGIN + (path === '/' ? '/' : path.replace(/\/?$/, '/'));
}

export function reviewedLabel(iso = REVIEWED_AT) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(iso + 'T00:00:00Z'));
}

export function reviewedMarkup(iso = REVIEWED_AT) {
  return 'Last reviewed <time datetime="' + iso + '">' + reviewedLabel(iso) + '</time>';
}

export function updatedLabel(iso = UPDATED_AT) {
  return reviewedLabel(iso);
}

export function updatedMarkup(iso = UPDATED_AT) {
  return 'Last updated <time datetime="' + iso + '">' + updatedLabel(iso) + '</time>';
}

/** Public structured data. No employer, affiliation or worksFor. */
export function jsonLd({ path = '/', name = SITE_NAME, description = SITE_DESCRIPTION, dateModified = REVIEWED_AT } = {}) {
  const url = path === '/' ? SITE_ORIGIN + '/' : absoluteUrl(path);
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': SITE_ORIGIN + '/#website',
        name: SITE_NAME,
        url: SITE_ORIGIN + '/',
        inLanguage: 'en',
      },
      {
        '@type': 'WebPage',
        '@id': url + '#webpage',
        url,
        name,
        description,
        dateModified,
        isPartOf: { '@id': SITE_ORIGIN + '/#website' },
        inLanguage: 'en',
      },
      {
        '@type': 'Person',
        '@id': SITE_ORIGIN + '/#person',
        name: 'Gilles Penning',
        jobTitle: 'Medtech executive',
        url: 'https://gillespenning.com/',
        sameAs: [PROFILES.linkedin, PROFILES.bluesky, PROFILES.substack, 'https://gillespenning.com/'],
      },
    ],
  });
}

export function socialMeta({ path = '/', title = SITE_TITLE, description = SITE_DESCRIPTION } = {}) {
  const url = path === '/' ? SITE_ORIGIN + '/' : absoluteUrl(path);
  const image = SITE_ORIGIN + '/og-image.png?v=20261120';
  return [
    '<meta name="description" content="' + description + '">',
    '<link rel="canonical" href="' + url + '">',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="' + SITE_NAME + '">',
    '<meta property="og:title" content="' + title + '">',
    '<meta property="og:description" content="' + description + '">',
    '<meta property="og:url" content="' + url + '">',
    '<meta property="og:image" content="' + image + '">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta property="og:locale" content="en_US">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + title + '">',
    '<meta name="twitter:description" content="' + description + '">',
    '<meta name="twitter:image" content="' + image + '">',
  ].join('\n  ');
}
