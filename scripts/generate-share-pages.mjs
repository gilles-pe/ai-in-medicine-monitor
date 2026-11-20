import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync, deflateSync } from 'node:zlib';
import { orderedNews } from '../lib/news.js';
import { shareItems, shareMetaForItem, renderCardTopSvg, SITE_BASE } from '../lib/share.js';
import { escapeHtml as e } from '../lib/selectors.js';

const WIDTH = 1200;
const HEIGHT = 630;
const BG = [0xfa, 0xf8, 0xf1];
const SURFACE = [0xff, 0xfd, 0xf9];
const BORDER = [0xcf, 0xd6, 0xcc];
const PILL_BG = [0xef, 0xef, 0xe6];
const PILL_INK = [0x3d, 0x52, 0x58];
const INK = [0x10, 0x36, 0x41];
const TAG_INK = [0x64, 0x72, 0x6b];
const MICRO_INK = [0x6b, 0x73, 0x69];
const BODY_INK = [0x36, 0x4c, 0x52];
const BOX_BG = [0xee, 0xed, 0xe4];
const GOLD = [0xd4, 0x9b, 0x32];

let cachedAtlas = null;

async function loadAtlas(root) {
  if (cachedAtlas) return cachedAtlas;
  const gz = await readFile(path.join(root, 'scripts/glyph-atlas.json.gz'));
  const raw = JSON.parse(gunzipSync(gz).toString('utf8'));
  for (const style of Object.values(raw)) {
    for (const g of Object.values(style.glyphs)) {
      g.bytes = g.b ? Uint8Array.from(Buffer.from(g.b, 'base64')) : null;
    }
  }
  cachedAtlas = raw;
  return raw;
}

const CHAR_FALLBACK = {
  '\u2010': '-', '\u2011': '-', '\u2012': '-', '\u2015': '—', '\u2212': '−',
  '\u00a0': ' ', '\u202f': ' ', '\u2009': ' '
};

function getGlyph(style, ch) {
  const mapped = CHAR_FALLBACK[ch] || ch;
  return style.glyphs[mapped] || style.glyphs[mapped.normalize?.('NFKD')?.[0]] || style.glyphs[' '] || { a: 8, w: 0, h: 0, ox: 0, oy: 0, bytes: null };
}

function measureAtlasText(style, text) {
  let w = 0;
  for (const ch of String(text || '')) w += getGlyph(style, ch).a;
  return w;
}

function wrapAtlasLines(style, text, maxWidth, maxLines) {
  const words = String(text || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  if (!words.length) return [];
  const spaceW = getGlyph(style, ' ').a;
  const ellipW = getGlyph(style, '…').a;
  const lines = [];
  let line = '';
  let lineW = 0;

  for (const word of words) {
    const wordW = measureAtlasText(style, word);
    const candidateW = line ? lineW + spaceW + wordW : wordW;
    if (!line || candidateW <= maxWidth) {
      line = line ? `${line} ${word}` : word;
      lineW = candidateW;
    } else {
      lines.push(line);
      if (lines.length >= maxLines) {
        let trimmed = lines[maxLines - 1];
        while (trimmed.length > 6 && measureAtlasText(style, trimmed) + ellipW > maxWidth) {
          trimmed = trimmed.replace(/\s+\S*$/, '') || trimmed.slice(0, -1);
        }
        lines[maxLines - 1] = `${trimmed}…`;
        return lines;
      }
      line = word;
      lineW = wordW;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function blendPixel(buf, x, y, rgb, alpha01) {
  if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT || alpha01 <= 0) return;
  const idx = (y * WIDTH + x) * 3;
  if (alpha01 >= 0.999) {
    buf[idx] = rgb[0];
    buf[idx + 1] = rgb[1];
    buf[idx + 2] = rgb[2];
    return;
  }
  const inv = 1 - alpha01;
  buf[idx] = Math.round(buf[idx] * inv + rgb[0] * alpha01);
  buf[idx + 1] = Math.round(buf[idx + 1] * inv + rgb[1] * alpha01);
  buf[idx + 2] = Math.round(buf[idx + 2] * inv + rgb[2] * alpha01);
}

function fillRect(buf, rx, ry, rw, rh, rgb) {
  const x0 = Math.max(0, Math.floor(rx));
  const y0 = Math.max(0, Math.floor(ry));
  const x1 = Math.min(WIDTH, Math.ceil(rx + rw));
  const y1 = Math.min(HEIGHT, Math.ceil(ry + rh));
  for (let y = y0; y < y1; y++) {
    let off = (y * WIDTH + x0) * 3;
    for (let x = x0; x < x1; x++) {
      buf[off] = rgb[0];
      buf[off + 1] = rgb[1];
      buf[off + 2] = rgb[2];
      off += 3;
    }
  }
}

function drawRoundedBox(buf, rx, ry, rw, rh, rad, fillRgb, borderRgb = null, borderWidth = 0) {
  const x0 = Math.max(0, Math.floor(rx - 2));
  const y0 = Math.max(0, Math.floor(ry - 2));
  const x1 = Math.min(WIDTH, Math.ceil(rx + rw + 2));
  const y1 = Math.min(HEIGHT, Math.ceil(ry + rh + 2));
  const hw = rw / 2;
  const hh = rh / 2;
  const cx = rx + hw;
  const cy = ry + hh;
  const ix = hw - rad;
  const iy = hh - rad;

  for (let y = y0; y < y1; y++) {
    const dy = Math.abs(y + 0.5 - cy) - iy;
    for (let x = x0; x < x1; x++) {
      const dx = Math.abs(x + 0.5 - cx) - ix;
      const dist = (dx > 0 || dy > 0)
        ? Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) - rad
        : Math.max(dx, dy) - rad;
      if (dist > 0.75) continue;
      if (borderRgb && borderWidth > 0 && dist > -borderWidth - 0.75) {
        const outerCov = Math.max(0, Math.min(1, 0.75 - dist));
        const innerDist = dist + borderWidth;
        if (innerDist < -0.75) {
          blendPixel(buf, x, y, fillRgb, outerCov);
        } else {
          const innerCov = Math.max(0, Math.min(1, 0.75 - innerDist));
          if (innerCov > 0) blendPixel(buf, x, y, fillRgb, outerCov * innerCov);
          const borderCov = outerCov * (1 - innerCov * 0.85);
          if (borderCov > 0) blendPixel(buf, x, y, borderRgb, borderCov);
        }
      } else {
        const cov = dist < -0.75 ? 1 : Math.max(0, Math.min(1, 0.75 - dist));
        blendPixel(buf, x, y, fillRgb, cov);
      }
    }
  }
}

function drawAtlasText(buf, style, text, startX, baselineY, rgb) {
  let cursor = startX;
  for (const ch of String(text || '')) {
    const g = getGlyph(style, ch);
    if (g.bytes) {
      const gx = Math.round(cursor + g.ox);
      const gy = Math.round(baselineY + g.oy);
      for (let row = 0; row < g.h; row++) {
        const py = gy + row;
        if (py < 0 || py >= HEIGHT) continue;
        const rowOff = row * g.w;
        for (let col = 0; col < g.w; col++) {
          const a = g.bytes[rowOff + col];
          if (a === 0) continue;
          const px = gx + col;
          if (px < 0 || px >= WIDTH) continue;
          blendPixel(buf, px, py, rgb, a / 255);
        }
      }
    }
    cursor += g.a;
  }
}

const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  CRC_TABLE[i] = c >>> 0;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = data.length;
  const out = Buffer.allocUnsafe(len + 12);
  out.writeUInt32BE(len, 0);
  out.write(type, 4, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, len + 8)), len + 8);
  return out;
}

function encodeRgbPng(buf) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(WIDTH, 0);
  ihdr.writeUInt32BE(HEIGHT, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB color
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = WIDTH * 3;
  const raw = Buffer.allocUnsafe((stride + 1) * HEIGHT);
  for (let y = 0; y < HEIGHT; y++) {
    const srcOff = y * stride;
    const dstOff = y * (stride + 1);
    raw[dstOff] = 1; // Sub filter for fast flat-span compression
    raw[dstOff + 1] = buf[srcOff];
    raw[dstOff + 2] = buf[srcOff + 1];
    raw[dstOff + 3] = buf[srcOff + 2];
    for (let x = 3; x < stride; x++) {
      raw[dstOff + 1 + x] = (buf[srcOff + x] - buf[srcOff + x - 3]) & 0xff;
    }
  }
  const compressed = deflateSync(raw, { level: 3 });
  return Buffer.concat([signature, pngChunk('IHDR', ihdr), pngChunk('IDAT', compressed), pngChunk('IEND', Buffer.alloc(0))]);
}

/** Rasterize ONLY the top section of a shareable card as a crisp 1200x630 PNG buffer. */
export async function renderCardTopPng(item, root) {
  const atlas = await loadAtlas(root);
  const buf = new Uint8Array(WIDTH * HEIGHT * 3);
  fillRect(buf, 0, 0, WIDTH, HEIGHT, BG);

  const left = 128;
  const maxContentW = 944;

  // Measure vertically first so the card container sits snugly centered in 1200x630
  const badgeW = Math.max(150, Math.min(maxContentW, Math.round(measureAtlasText(atlas.badge, item.badge) + 34)));
  const titleLines = wrapAtlasLines(atlas.title, item.title, maxContentW, 2);
  const tagLines = item.tags ? wrapAtlasLines(atlas.tags, item.tags.toUpperCase(), maxContentW, 2) : [];

  const titleRelY = 102;
  const titleStep = 55;
  const titleRelBottom = titleRelY + Math.max(0, titleLines.length - 1) * titleStep;

  const tagsRelY = titleRelBottom + 34;
  const tagsStep = 24;
  const tagsRelBottom = tagLines.length ? tagsRelY + (tagLines.length - 1) * tagsStep : titleRelBottom;

  const boxRelTop = tagsRelBottom + 26;
  const innerLeft = left + 28;
  const innerMaxW = maxContentW - 52;
  const microRelY = boxRelTop + 36;
  const headRelY = microRelY + 38;
  const headStep = 36;
  const headlineLines = wrapAtlasLines(atlas.headline, item.headline, innerMaxW, 2);
  const headRelBottom = headRelY + Math.max(0, headlineLines.length - 1) * headStep;
  const expRelY = headRelBottom + 34;
  const expStep = 30;
  const expLines = item.explanation ? wrapAtlasLines(atlas.body, item.explanation, innerMaxW, 3) : [];
  const contentRelBottom = expLines.length ? expRelY + (expLines.length - 1) * expStep + 28 : headRelBottom + 28;
  const boxH = Math.max(120, Math.min(280, contentRelBottom - boxRelTop));

  const cardH = Math.min(540, 44 + boxRelTop + boxH + 44);
  const cardTop = Math.round((HEIGHT - cardH) / 2);
  const badgeTop = cardTop + 44;

  drawRoundedBox(buf, 76, cardTop, 1048, cardH, 14, SURFACE, BORDER, 2);

  // 1. Semantic badge pill & corner monitor mark
  drawRoundedBox(buf, left, badgeTop, badgeW, 38, 6, PILL_BG, BORDER, 1.5);
  drawAtlasText(buf, atlas.badge, item.badge, left + 17, badgeTop + 26, PILL_INK);
  drawRoundedBox(buf, 1038, badgeTop + 2, 34, 34, 8, [30, 58, 138], [30, 58, 138], 1);
  fillRect(buf, 1047, badgeTop + 11, 2, 6, [247, 246, 242]);
  fillRect(buf, 1054, badgeTop + 11, 2, 6, [247, 246, 242]);
  fillRect(buf, 1047, badgeTop + 17, 9, 2, [247, 246, 242]);
  fillRect(buf, 1051, badgeTop + 19, 2, 8, [247, 246, 242]);
  fillRect(buf, 1051, badgeTop + 25, 11, 2, [247, 246, 242]);
  fillRect(buf, 1060, badgeTop + 18, 2, 7, [247, 246, 242]);
  fillRect(buf, 1059, badgeTop + 15, 4, 4, [247, 246, 242]);
  fillRect(buf, 1063, badgeTop + 8, 2, 6, [245, 158, 11]);
  fillRect(buf, 1061, badgeTop + 10, 6, 2, [245, 158, 11]);

  // 2. Serif title
  titleLines.forEach((line, i) => drawAtlasText(buf, atlas.title, line, left, badgeTop + titleRelY + i * titleStep, INK));

  // 3. Uppercase tags
  tagLines.forEach((line, i) => drawAtlasText(buf, atlas.tags, line, left, badgeTop + tagsRelY + i * tagsStep, TAG_INK));

  // 4. KEY FINDING box with gold left bar
  const boxTop = badgeTop + boxRelTop;
  fillRect(buf, left, boxTop, maxContentW, boxH, BOX_BG);
  fillRect(buf, left, boxTop, 5, boxH, GOLD);
  drawAtlasText(buf, atlas.micro, item.findingLabel || 'KEY FINDING', innerLeft, badgeTop + microRelY, MICRO_INK);
  headlineLines.forEach((line, i) => {
    const y = badgeTop + headRelY + i * headStep;
    if (y < boxTop + boxH - 12) drawAtlasText(buf, atlas.headline, line, innerLeft, y, INK);
  });
  expLines.forEach((line, i) => {
    const y = badgeTop + expRelY + i * expStep;
    if (y < boxTop + boxH - 10) drawAtlasText(buf, atlas.body, line, innerLeft, y, BODY_INK);
  });

  return encodeRgbPng(buf);
}

/** Render static HTML for an individual share endpoint showing only top-of-card OG tags. */
export function renderShareHtml(item, baseUrl = SITE_BASE) {
  const meta = shareMetaForItem(item, baseUrl);
  const target = `../../${item.targetHash}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${e(meta.title)}</title>
  <meta name="description" content="${e(meta.description)}">
  <link rel="canonical" href="${e(meta.url)}">
  <link rel="icon" href="../../favicon.ico?v=20261120" sizes="any">
  <link rel="icon" href="../../favicon.svg?v=20261120" type="image/svg+xml">
  <link rel="icon" href="../../favicon-32.png?v=20261120" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="../../apple-touch-icon.png?v=20261120" sizes="180x180">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${e(meta.title)}">
  <meta property="og:description" content="${e(meta.description)}">
  <meta property="og:url" content="${e(meta.url)}">
  <meta property="og:image" content="${e(meta.imageUrl)}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${e(meta.imageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${e(meta.title)}">
  <meta name="twitter:description" content="${e(meta.description)}">
  <meta name="twitter:image" content="${e(meta.imageUrl)}">
  <meta name="twitter:image:alt" content="${e(meta.imageAlt)}">
  <link rel="stylesheet" href="../../styles.css">
  <link rel="stylesheet" href="../../monitor.css">
  <script>location.replace(${JSON.stringify(target)});</script>
</head>
<body class="share-preview-page">
  <main class="shell share-shell">
    <article class="editorial-evidence-card share-card-preview">
      <div class="card-topbar"><span class="semantic-badge">${e(item.badge)}</span></div>
      <h1>${e(item.title)}</h1>
      ${item.tags ? `<p class="card-tags">${e(item.tags)}</p>` : ''}
      <div class="card-key-finding">
        <span class="card-micro-label">${e(item.findingLabel || 'KEY FINDING')}</span>
        <p><strong>${e(item.headline)}</strong></p>
        ${item.explanation ? `<p>${e(item.explanation)}</p>` : ''}
      </div>
      <footer class="point-sources">
        <a class="button" href="${e(target)}">Open in monitor ↗</a>
        ${item.sourceUrl ? `<a href="${e(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">Primary source ↗</a>` : ''}
      </footer>
    </article>
  </main>
</body>
</html>
`;
}

export async function generateDefaultOg(root, outputDir, lastReviewedAt = '') {
  const defaultItem = {
    id: 'default',
    badge: lastReviewedAt ? `Evidence tracker · ${lastReviewedAt}` : 'Evidence tracker',
    title: 'What can AI do in medicine today?',
    tags: 'MEDICAL KNOWLEDGE · CLINICAL ASSISTANCE · AUTONOMOUS WORKFLOWS',
    findingLabel: 'OVERVIEW',
    headline: 'Benchmarks, milestones and source-backed studies',
    explanation: 'Tracking how capabilities are changing and where clear limits remain across clinical evaluation.'
  };
  const pngBuf = await renderCardTopPng(defaultItem, root);
  await Promise.all([
    writeFile(path.join(outputDir, 'og-default.png'), pngBuf),
    writeFile(path.join(outputDir, 'og-default.svg'), renderCardTopSvg(defaultItem))
  ]);
}

export async function generateSharePages(root, outputDir) {
  const monitorData = JSON.parse(await readFile(path.join(root, 'data/monitor-data.json'), 'utf8'));
  const newsData = JSON.parse(await readFile(path.join(root, 'data/news.json'), 'utf8'));
  const items = shareItems(monitorData, newsData.items);
  const shareRoot = path.join(outputDir, 'share');
  await mkdir(shareRoot, { recursive: true });

  for (const item of items) {
    const dir = path.join(shareRoot, item.id);
    await mkdir(dir, { recursive: true });
    const [pngBuf] = await Promise.all([
      renderCardTopPng(item, root),
      writeFile(path.join(dir, 'og.svg'), renderCardTopSvg(item)),
      writeFile(path.join(dir, 'index.html'), renderShareHtml(item, SITE_BASE))
    ]);
    await writeFile(path.join(dir, 'og.png'), pngBuf);
  }
  return items.length;
}
