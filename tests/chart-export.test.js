import test from 'node:test';
import assert from 'node:assert/strict';
import { buildExportSvg, chartLink, wrapExportText } from '../lib/chart-export.js';

test('standalone export includes dated branding, source caveats and vector content', () => {
  const svg = buildExportSvg('<path d="M0 0L10 10" class="dotted-series"/>', {
    title: 'Clinical thinking', cutoff: '2026-10-18', note: 'A simulation, not clinical care.', viewBox: [0, 0, 1000, 400]
  });
  assert.match(svg, /^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
  assert.match(svg, /AI in Medicine/);
  assert.doesNotMatch(svg, /Gilles|Penning/);
  assert.match(svg, /As of 2026-10-18/);
  assert.match(svg, /A simulation, not clinical care\./);
  assert.match(svg, /stroke-dasharray:2 7/);
  assert.match(svg, /\.medical-line\{stroke-dasharray:2 7\}/);
  assert.match(svg, /<path d="M0 0L10 10"/);
  assert.match(svg, /viewBox="0 0 1000 400"/);
});

test('user-visible export metadata is XML escaped and invalid dimensions fail', () => {
  const svg = buildExportSvg('', { title: '<script> & "x"', note: '<unsafe> & text', cutoff: 'invalid' });
  assert.match(svg, /&lt;script&gt; &amp; &quot;x&quot;/);
  assert.doesNotMatch(svg, /<script>/);
  assert.match(svg, /&lt;unsafe&gt; &amp; text/);
  assert.doesNotMatch(svg, /As of invalid/);
  for (const viewBox of [[0, 0, 0, 10], [0, 0, NaN, 2], [0, 0, 3]]) {
    assert.throws(() => buildExportSvg('', { viewBox }), /viewBox/);
  }
});

test('long source notes wrap within the frame rather than being silently truncated', () => {
  const source = 'Source: ' + 'x'.repeat(280) + ' final detail';
  const lines = wrapExportText(source);
  assert.ok(lines.every(line => line.length <= 125));
  assert.match(lines.join(''), /final detail$/);
  assert.equal(lines.join('').replaceAll(' ', ''), source.replaceAll(' ', ''));
  assert.deepEqual(wrapExportText(null), []);
});

test('chart links retain query state, replace date and fragment, and reject non-web URLs', () => {
  const url = new URL(chartLink('chart-knowledge', '2024-02-29', 'https://example.com/monitor?model=one&cutoff=2023-01-01#old'));
  assert.equal(url.searchParams.get('model'), 'one');
  assert.equal(url.searchParams.get('cutoff'), '2024-02-29');
  assert.equal(url.hash, '#chart-knowledge');
  assert.equal(new URL(chartLink('#overview', '2025-02-29', url.href)).searchParams.has('cutoff'), false);
  assert.throws(() => chartLink('chart', '', 'javascript:alert(1)'), /web URL/);
});
