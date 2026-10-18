// Portable ZIP export. ZIP entries use the uncompressed (stored) method so no
// third-party archive library or network service is needed.
export const MONITOR_PACKAGE_FILES = Object.freeze([
  'AGENTS.md', 'MONITOR_STANDARD.md', 'DESIGN.md', 'VALIDATION_REPORT.md',
  'data/monitor-data.json', 'docs/MONITOR_DATA_STATUS.md'
]);
const CONTRACT_FILES = ['AGENTS.md', 'MONITOR_STANDARD.md', 'DESIGN.md', 'VALIDATION_REPORT.md', 'docs/MONITOR_DATA_STATUS.md'];
const encoder = new TextEncoder();
const crcTable = Uint32Array.from({ length: 256 }, (_, value) => {
  for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function zipHeader(length, signature) {
  const bytes = new Uint8Array(length), view = new DataView(bytes.buffer);
  view.setUint32(0, signature, true);
  return { bytes, view };
}

/** Produce a deterministic, UTF-8, ZIP32 archive from strings or byte arrays. */
export function createStoredZip(entries) {
  if (!Array.isArray(entries) || entries.length > 65535) throw new Error('ZIP32 supports at most 65535 files.');
  const local = [], central = [], names = new Set();
  let offset = 0, centralSize = 0;
  for (const entry of entries) {
    const path = entry?.path;
    if (typeof path !== 'string' || !path || /[\\:\x00-\x1f]/.test(path) || path.split('/').some(part => !part || part === '.' || part === '..')) {
      throw new Error('ZIP entry needs a safe relative file path.');
    }
    if (names.has(path)) throw new Error('Duplicate ZIP path: ' + path);
    names.add(path);
    const name = encoder.encode(path);
    const content = typeof entry.content === 'string' ? encoder.encode(entry.content) : entry.content;
    if (!(content instanceof Uint8Array)) throw new TypeError('ZIP content must be a string or Uint8Array.');
    if (name.length > 65535 || content.byteLength > 0xffffffff || offset + 30 + name.length + content.byteLength > 0xffffffff) throw new Error('ZIP32 size limit exceeded.');
    const crc = crc32(content);
    const header = zipHeader(30, 0x04034b50);
    header.view.setUint16(4, 20, true); // Extractor version 2.0.
    header.view.setUint16(6, 0x0800, true); // UTF-8 filenames.
    header.view.setUint16(12, 0x0021, true); // Deterministic date: 1980-01-01.
    header.view.setUint32(14, crc, true);
    header.view.setUint32(18, content.byteLength, true);
    header.view.setUint32(22, content.byteLength, true);
    header.view.setUint16(26, name.length, true);
    local.push(header.bytes, name, content);
    const directory = zipHeader(46, 0x02014b50);
    directory.view.setUint16(4, 20, true);
    directory.view.setUint16(6, 20, true);
    directory.view.setUint16(8, 0x0800, true);
    directory.view.setUint16(14, 0x0021, true);
    directory.view.setUint32(16, crc, true);
    directory.view.setUint32(20, content.byteLength, true);
    directory.view.setUint32(24, content.byteLength, true);
    directory.view.setUint16(28, name.length, true);
    directory.view.setUint32(42, offset, true);
    central.push(directory.bytes, name);
    centralSize += 46 + name.length;
    offset += 30 + name.length + content.byteLength;
  }
  if (offset + centralSize + 22 > 0xffffffff) throw new Error('ZIP32 size limit exceeded.');
  const end = zipHeader(22, 0x06054b50);
  end.view.setUint16(8, entries.length, true);
  end.view.setUint16(10, entries.length, true);
  end.view.setUint32(12, centralSize, true);
  end.view.setUint32(16, offset, true);
  const archive = new Uint8Array(offset + centralSize + 22);
  let cursor = 0;
  for (const chunk of [...local, ...central, end.bytes]) { archive.set(chunk, cursor); cursor += chunk.byteLength; }
  return archive;
}

async function sha256(text) {
  if (!globalThis.crypto?.subtle) throw new Error('Package verification needs a secure browser connection.');
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(text));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

/** Validate the generated documentation against the exact parsed JSON revision. */
export async function validatePackageFiles(files) {
  for (const path of MONITOR_PACKAGE_FILES) {
    if (typeof files[path] !== 'string' || !files[path].trim()) throw new Error('Package file is missing: ' + path);
    if (/^\s*<(?:!doctype|html)\b/i.test(files[path])) throw new Error('A sign-in page was returned instead of ' + path);
  }
  let data;
  try { data = JSON.parse(files['data/monitor-data.json']); } catch { throw new Error('The monitor data is not valid JSON.'); }
  if (!data?.meta || !Array.isArray(data.tracks) || !data.tracks.length) throw new Error('The portable monitor data contract is missing.');
  const dataHash = await sha256(JSON.stringify(data));
  for (const path of CONTRACT_FILES) {
    const body = files[path];
    const blocks = body.match(/<!-- monitor-data-contract:start -->[\s\S]*?<!-- monitor-data-contract:end -->/g);
    const hash = blocks?.length === 1 && blocks[0].match(/SHA-256 \(parsed JSON\): `([a-f0-9]{64})`/i)?.[1];
    if (!hash || hash.toLowerCase() !== dataHash) throw new Error('Package documentation is out of sync: ' + path);
  }
  return { data, dataHash };
}

async function fetchPackageFile(path) {
  const url = new URL('../' + path, import.meta.url);
  if (url.origin !== location.origin) throw new Error('Package files must come from this website.');
  const response = await fetch(url, { cache: 'no-store', credentials: 'same-origin', redirect: 'error' });
  if (!response.ok) throw new Error('Could not load package file ' + path + ' (' + response.status + ').');
  return response.text();
}

/** Download the data, policy documents, audit and checksums as a real ZIP. */
export async function downloadMonitorPackage() {
  const contents = await Promise.all(MONITOR_PACKAGE_FILES.map(fetchPackageFile));
  const files = Object.fromEntries(MONITOR_PACKAGE_FILES.map((path, index) => [path, contents[index]]));
  const { data, dataHash } = await validatePackageFiles(files);
  const repeat = await fetchPackageFile('data/monitor-data.json');
  if (await sha256(JSON.stringify(JSON.parse(repeat))) !== dataHash) throw new Error('The monitor changed during export. Please try again.');
  const checksums = await Promise.all(MONITOR_PACKAGE_FILES.map(async path => ({
    path, bytes: encoder.encode(files[path]).byteLength, sha256: await sha256(files[path])
  })));
  const manifest = { title: data.meta.title, formatVersion: 1, exportedAt: new Date().toISOString(), dataSha256: dataHash, files: checksums };
  const entries = MONITOR_PACKAGE_FILES.map(path => ({ path, content: files[path] }));
  entries.push({ path: 'PACKAGE_MANIFEST.json', content: JSON.stringify(manifest, null, 2) + '\n' });
  const blob = new Blob([createStoredZip(entries)], { type: 'application/zip' });
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  const version = String(data.meta.packageVersion || data.meta.schemaVersion || '1').replace(/[^a-z0-9.-]/gi, '');
  const date = String(data.meta.lastDataChangeAt || data.meta.lastUpdated || '').replace(/[^0-9-]/g, '');
  link.href = url; link.download = 'ai-in-medicine-v' + version + (date ? '-' + date : '') + '.zip';
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'Monitor package exported.';
}
