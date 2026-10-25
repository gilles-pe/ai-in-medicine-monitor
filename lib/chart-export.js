import { monitorData } from './monitor-data.js';
import { translateText } from './i18n.js';
import { escapeHtml as escape } from './selectors.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const BRAND = monitorData.meta.title;
const PAINT = ['display', 'color', 'fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-opacity',
  'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'opacity',
  'font-family', 'font-size', 'font-weight', 'font-style', 'letter-spacing', 'text-anchor',
  'dominant-baseline', 'paint-order', 'vector-effect', 'visibility'];
const FALLBACK_STYLES = `
text{font-family:Arial,sans-serif;fill:#66787b;font-size:11px}
.overview-line,.solid-series,.series-line{fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.dotted-series,.autonomy-line,.medical-line{stroke-dasharray:2 7}.scenario-line{stroke-dasharray:9 6}
.overview-grid,.gridline,.axis line,.axis path{fill:none;stroke:#dce3dc;stroke-width:1}
.overview-axis-title,.axis-title{fill:#25454b;font-weight:600}.cursor-label{fill:white}
.cursor-small{fill:#d3e6e0}.overview-cursor{stroke:#123a43;stroke-dasharray:4 4}
`;

function validDay(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value + 'T00:00:00Z')) &&
    new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value;
}

export function wrapExportText(value, limit = 125) {
  const words = String(value ?? '').trim().split(/\s+/).filter(Boolean);
  const lines = [];
  for (const word of words) {
    for (let start = 0; start < word.length; start += limit) {
      const part = word.slice(start, start + limit);
      if (lines.length && lines.at(-1).length + part.length + 1 <= limit) lines[lines.length - 1] += ' ' + part;
      else lines.push(part);
    }
  }
  return lines;
}

/** Pure wrapper: the chart markup is the trusted, serialized SVG from this app. */
export function buildExportSvg(markup, { title = BRAND, cutoff = '', note = '', viewBox = [0, 0, 1200, 470], rootStyle = '' } = {}) {
  if (!Array.isArray(viewBox) || viewBox.length !== 4 || !viewBox.every(Number.isFinite) || viewBox[2] <= 0 || viewBox[3] <= 0) {
    throw new Error('The chart needs a valid SVG viewBox.');
  }
  title=translateText(title);note=translateText(note);
  const width = 1200, chartWidth = 1136;
  const chartHeight = chartWidth * viewBox[3] / viewBox[2];
  const heading = wrapExportText(title, 88);
  const headerHeight = 70 + Math.max(1, heading.length) * 24;
  const notes = wrapExportText(note || 'Sources and limitations: open the linked evidence in '+BRAND+'.');
  const footerTop = headerHeight + chartHeight + 24;
  const height = Math.ceil(footerTop + notes.length * 18 + 49);
  const texts = (lines, y, size, color) => lines.map((line, index) => '<text x="32" y="' + (y + index * (size + 5)) + '" style="font: ' + size + 'px Arial,sans-serif;fill:' + color + '">' + escape(line) + '</text>').join('');
  return '<svg xmlns="' + SVG_NS + '" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' + escape(title) + '">' +
    '<title>' + escape(title) + '</title><desc>' + escape(note) + '</desc><style>' + FALLBACK_STYLES + '</style>' +
    '<rect width="100%" height="100%" fill="#fffdf8"/>' +
    '<text x="32" y="35" style="font:600 13px Arial,sans-serif;letter-spacing:1.5px;fill:#17454a">' + escape(BRAND) + '</text>' +
    texts(heading, 66, 19, '#123a43') +
    '<text x="1168" y="35" text-anchor="end" style="font:12px Arial,sans-serif;fill:#66787b">' + escape(validDay(cutoff) ? translateText('As of ') + cutoff : '') + '</text>' +
    '<svg x="32" y="' + headerHeight + '" width="' + chartWidth + '" height="' + chartHeight + '" viewBox="' + viewBox.join(' ') + '" style="' + escape(rootStyle) + '">' + markup + '<text x="'+(viewBox[0]+viewBox[2]*.22)+'" y="'+(viewBox[1]+viewBox[3]*.55)+'" style="font:12px Arial,sans-serif;fill:#66787b;opacity:.18">ai.gillespenning.com</text><text x="'+(viewBox[0]+viewBox[2]*.68)+'" y="'+(viewBox[1]+viewBox[3]*.8)+'" style="font:12px Arial,sans-serif;fill:#66787b;opacity:.18">ai.gillespenning.com</text></svg>' +
    '<line x1="32" x2="1168" y1="' + (footerTop - 12) + '" y2="' + (footerTop - 12) + '" stroke="#dce3dc"/>' +
    texts(notes, footerTop + 5, 12, '#526b71') +
    '<text x="32" y="' + (height - 18) + '" style="font:11px Arial,sans-serif;fill:#66787b">' + escape(BRAND) + '</text></svg>';
}

/** Retains existing filters and replaces the selected date and chart target. */
export function chartLink(id, cutoff, baseUrl) {
  const url = new URL(baseUrl);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('A web URL is required.');
  if (validDay(cutoff)) url.searchParams.set('cutoff', cutoff);
  else url.searchParams.delete('cutoff');
  url.hash = String(id ?? '').replace(/^#/, '');
  return url.href;
}

export async function copyChartLink(id, cutoff) {
  const link = chartLink(id, cutoff, window.location.href);
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(link); return 'Chart link copied.'; } catch { /* Use the standard selection fallback below. */ }
  }
  const field = document.createElement('textarea');
  field.value = link;
  field.setAttribute('readonly', '');
  field.style.cssText = 'position:fixed;left:-9999px;top:0';
  const active = document.activeElement;
  document.body.append(field); field.select();
  let copied;
  try { copied = document.execCommand('copy'); } finally { field.remove(); active?.focus?.({ preventScroll: true }); }
  if (!copied) throw new Error('Could not copy the chart link.');
  return 'Chart link copied.';
}

function serializeChart(svgElement) {
  const clone = svgElement.cloneNode(true);
  const originals = [svgElement, ...svgElement.querySelectorAll('*')];
  const copies = [clone, ...clone.querySelectorAll('*')];
  const view = svgElement.ownerDocument.defaultView;
  originals.forEach((element, index) => {
    const computed = view.getComputedStyle(element), copy = copies[index];
    for (const property of PAINT) {
      let value = computed.getPropertyValue(property);
      if (value === 'currentcolor') value = computed.color;
      if (value) copy.style.setProperty(property, value);
    }
    for (const attr of [...copy.attributes]) {
      if (/^on/i.test(attr.name) || attr.name.startsWith('data-') || attr.name === 'tabindex') copy.removeAttribute(attr.name);
    }
  });
  // Exported images contain no executable or externally loaded document fragments.
  clone.querySelectorAll('script,foreignObject,image').forEach(node => node.remove());
  const serializer = new XMLSerializer();
  return { markup: [...clone.childNodes].map(node => serializer.serializeToString(node)).join(''), rootStyle: clone.getAttribute('style') || '' };
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Download PNG by default; a .svg filename selects a standalone vector image. */
export async function exportChart(svgElement, { title = BRAND, cutoff = '', filename = '', note = '' } = {}) {
  const charts=Array.isArray(svgElement)?svgElement:[svgElement];
  if(!charts.length||charts.some(svg=>!svg||svg.namespaceURI!==SVG_NS||svg.tagName.toLowerCase()!=='svg'))throw new Error('No chart is available to export.');
  if (document.fonts?.ready) await document.fonts.ready;
  let source;
  if(Array.isArray(svgElement)){
    let offset=0,markup='';
    for(const svg of charts){
      const box=svg.viewBox.baseVal, height=1136*box.height/box.width;
      const band=svg.closest('.monitor-series-band'),heading=band?.querySelector('h4')?.textContent||title;
      const status=band?.querySelector('.monitor-series-note')?.textContent||'';
      const copy=serializeChart(svg);
      markup+='<text x="0" y="'+(offset+20)+'" style="font:600 17px Arial;fill:#123a43">'+escape(heading)+'</text>';
      const statusLines=wrapExportText(status,130);
      markup+=statusLines.map((line,index)=>'<text x="0" y="'+(offset+43+index*16)+'" style="font:12px Arial;fill:#65777a">'+escape(line)+'</text>').join('');
      const top=offset+55+statusLines.length*16;
      markup+='<svg x="0" y="'+top+'" width="1136" height="'+height+'" viewBox="'+[box.x,box.y,box.width,box.height].join(' ')+'" style="'+escape(copy.rootStyle)+'">'+copy.markup+'</svg>';
      offset=top+height+22;
    }
    source=buildExportSvg(markup,{title,cutoff,note,viewBox:[0,0,1136,offset]});
  }else{
    const box=svgElement.viewBox.baseVal;
    const viewBox=box.width>0&&box.height>0?[box.x,box.y,box.width,box.height]:[0,0,svgElement.clientWidth,svgElement.clientHeight];
    const {markup,rootStyle}=serializeChart(svgElement);
    source=buildExportSvg(markup,{title,cutoff,note,viewBox,rootStyle});
  }
  const safeName = (filename || 'ai-in-medicine-' + (validDay(cutoff) ? cutoff : 'chart') + '.png').replace(/[\\/:*?"<>|]/g, '-');
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  if (/\.svg$/i.test(safeName)) { download(blob, safeName); return 'SVG exported.'; }
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = () => reject(new Error('Could not render the chart image.')); image.src = url; });
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth * 2; canvas.height = image.naturalHeight * 2;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('PNG export is not supported by this browser.');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const png = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!png) throw new Error('Could not create the PNG image.');
    download(png, /\.png$/i.test(safeName) ? safeName : safeName + '.png');
    return 'PNG exported.';
  } finally { URL.revokeObjectURL(url); }
}
