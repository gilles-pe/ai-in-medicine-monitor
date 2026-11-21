/** Address-bar helpers: an opened data point shows its crawler-readable share URL (share/<id>/) instead of a #anchor. */
const SHARE_PATH = /\/share\/[^/]+\/?$/;

export function isSharePath(pathname) {
  return SHARE_PATH.test(pathname);
}

/** App root for relative resolution; keeps search and hash only when asked. */
export function appRootUrl(href, { keepSearch = false, keepHash = false } = {}) {
  const url = new URL(href);
  url.pathname = url.pathname.replace(SHARE_PATH, '/');
  if (!keepSearch) url.search = '';
  if (!keepHash) url.hash = '';
  return url.href;
}

/** Same-origin path of the share endpoint for an item id, relative to the app root. */
export function shareAddressPath(id, href) {
  return new URL('./share/' + encodeURIComponent(id) + '/', appRootUrl(href)).pathname;
}
