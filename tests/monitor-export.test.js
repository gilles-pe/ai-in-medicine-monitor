import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createStoredZip, validatePackageFiles, MONITOR_PACKAGE_FILES } from '../lib/monitor-export.js';

const decode = bytes => new TextDecoder().decode(bytes);
const read = bytes => new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

test('stored ZIP has correct UTF-8 local entries, standard CRC-32 and central directory offsets', () => {
  const entries = [{ path: 'docs/prüfung.md', content: '123456789' }, { path: 'data/raw.bin', content: new Uint8Array([0, 255, 1]) }];
  const zip = createStoredZip(entries), view = read(zip);
  let cursor = 0;
  const offsets = [];
  for (const entry of entries) {
    offsets.push(cursor);
    assert.equal(view.getUint32(cursor, true), 0x04034b50);
    assert.equal(view.getUint16(cursor + 6, true), 0x0800);
    assert.equal(view.getUint16(cursor + 8, true), 0, 'stored, not falsely marked compressed');
    const length = view.getUint16(cursor + 26, true), size = view.getUint32(cursor + 22, true);
    assert.equal(decode(zip.slice(cursor + 30, cursor + 30 + length)), entry.path);
    if (cursor === 0) assert.equal(view.getUint32(cursor + 14, true), 0xcbf43926, 'known CRC-32 check value');
    const expected = typeof entry.content === 'string' ? new TextEncoder().encode(entry.content) : entry.content;
    assert.deepEqual(zip.slice(cursor + 30 + length, cursor + 30 + length + size), expected);
    cursor += 30 + length + size;
  }
  const centralStart = cursor;
  for (const offset of offsets) {
    assert.equal(view.getUint32(cursor, true), 0x02014b50);
    assert.equal(view.getUint32(cursor + 42, true), offset);
    cursor += 46 + view.getUint16(cursor + 28, true);
  }
  assert.equal(view.getUint32(cursor, true), 0x06054b50);
  assert.equal(view.getUint16(cursor + 10, true), entries.length);
  assert.equal(view.getUint32(cursor + 16, true), centralStart);
  assert.equal(view.getUint32(cursor + 12, true), cursor - centralStart);
  assert.equal(cursor + 22, zip.length);
});

test('ZIP rejects traversal, duplicate filenames and invalid byte content; empty ZIP is valid', () => {
  for (const path of ['../secret', '/absolute', 'data/../x', 'a\\b', 'a//b', 'C:/file']) {
    assert.throws(() => createStoredZip([{ path, content: '' }]), /relative/);
  }
  assert.throws(() => createStoredZip([{ path: 'one', content: '' }, { path: 'one', content: '' }]), /Duplicate/);
  assert.throws(() => createStoredZip([{ path: 'bad', content: {} }]), /Uint8Array/);
  const empty = createStoredZip([]);
  assert.equal(empty.length, 22);
  assert.equal(read(empty).getUint32(0, true), 0x06054b50);
});

function packageFixture() {
  const data = { meta: { title: 'AI in Medicine Monitor', schemaVersion: '1.0' }, tracks: [{ trackId: 'test', series: [] }] };
  const hash = createHash('sha256').update(JSON.stringify(data)).digest('hex');
  const contract = '<!-- monitor-data-contract:start -->\n- SHA-256 (parsed JSON): `' + hash + '`\n<!-- monitor-data-contract:end -->';
  const files = Object.fromEntries(MONITOR_PACKAGE_FILES.map(path => [path, '# Document\n\n' + contract]));
  files['data/monitor-data.json'] = JSON.stringify(data, null, 2);
  return { files, hash };
}

test('portable package checks parsed JSON hash against each managed document', async () => {
  const { files, hash } = packageFixture();
  assert.equal((await validatePackageFiles(files)).dataHash, hash);
  files['AGENTS.md'] = files['AGENTS.md'].replace(hash, '0'.repeat(64));
  await assert.rejects(() => validatePackageFiles(files), /out of sync: AGENTS.md/);
  const fresh = packageFixture().files;
  fresh['VALIDATION_REPORT.md'] = fresh['VALIDATION_REPORT.md'].replace(hash, '1'.repeat(64));
  await assert.rejects(() => validatePackageFiles(fresh), /out of sync: VALIDATION_REPORT.md/);
});

test('missing files, login pages, malformed data and missing hash markers stop export', async () => {
  for (const mutate of [
    files => delete files['DESIGN.md'],
    files => { files['VALIDATION_REPORT.md'] = '<!doctype html><html>Sign in</html>'; },
    files => { files['data/monitor-data.json'] = '{broken'; },
    files => { files['MONITOR_STANDARD.md'] = '# Unsynchronized policy'; }
  ]) {
    const { files } = packageFixture(); mutate(files);
    await assert.rejects(() => validatePackageFiles(files));
  }
});
