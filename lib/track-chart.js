import { trendSeries } from '../data/trend-series.js';
import { escapeHtml as e } from './selectors.js';

export function visibleTrendSeries(trackId, cutoff) {
  return trendSeries.filter(series => series.trackId === trackId && series.date <= cutoff);
}

// Straight segments only. The source defines the x variable; it is never a date.
// Rows are retained in this API for compatibility with the existing score view.
// These independently curated comparisons do not inherit that view's model filter.
export function renderTrackChart(track, rows, cutoff, { preview = false } = {}) {
  const series = visibleTrendSeries(track.id, cutoff)[0];
  if (!series) return preview
    ? '<svg class="scientific-chart-preview" viewBox="0 0 320 100" role="img" aria-label="No published curve at this date"><text x="160" y="54" text-anchor="middle" fill="currentColor" font-size="14">No curve at this date</text></svg>'
    : '<p class="curve-empty">No source-native curve published by this date.</p>';

  const width = preview ? 320 : 700;
  const height = preview ? 130 : 250;
  const left = preview ? 18 : 48;
  const right = preview ? 14 : 28;
  const top = preview ? 12 : 30;
  const bottom = preview ? 28 : 70;
  const floor = height - bottom;
  const xMin = Math.min(...series.points.map(point=>point.x));
  const xMax = Math.max(...series.points.map(point=>point.x));
  const x = value => left + (value-xMin)/(xMax-xMin || 1)*(width-left-right);
  // Full 0–100 scale avoids exaggerating small model differences.
  const y = value => floor - value/100*(floor-top);
  const color = track.color || '#209b8e';
  const format = value => Number(value.toFixed(2)).toString();
  const linePath = series.points.map((point,index)=>(index?'L':'M')+x(point.x).toFixed(2)+','+y(point.score).toFixed(2)).join(' ');
  let svg = '';
  for (const value of preview ? [0,50,100] : [0,25,50,75,100]) {
    svg += `<line x1="${left}" x2="${width-right}" y1="${y(value)}" y2="${y(value)}" stroke="#d7ddd7" stroke-width="1"/>`;
    if (!preview) svg += `<text x="${left-12}" y="${y(value)+4}" text-anchor="end" fill="#65777a" font-size="12">${value}</text>`;
  }
  svg += `<path class="curve-line scientific-curve" data-comparison-group="${e(series.comparisonGroup)}" data-source-id="${e(series.sourceId)}" d="${linePath}" fill="none" stroke="${e(color)}" stroke-width="${preview?2.5:3}" stroke-linejoin="round"/>`;
  for (const point of series.points) {
    const px=x(point.x),py=y(point.score);
    const label = `${point.model}, ${point.xLabel}: ${format(point.score)} ${series.unit}. Open original study.`;
    const glyph = `<circle cx="${px}" cy="${py}" r="${preview?3.5:5}" fill="${e(color)}" stroke="#fffdf8" stroke-width="1.5"/>`;
    if (preview) svg += glyph;
    else svg += `<g class="scientific-point" role="button" tabindex="0" data-trend-point="${e(point.id)}" aria-label="${e(label)}"><title>${e(label)}</title><circle cx="${px}" cy="${py}" r="15" style="fill:transparent;stroke:none"/>${glyph}</g>`;
    svg += `<text x="${px}" y="${floor+(preview?19:24)}" text-anchor="middle" fill="#52676b" font-size="${preview?11:13}">${e(point.xLabel)}</text>`;
    if (!preview) svg += `<text x="${px}" y="${py-13}" text-anchor="middle" fill="#173f46" font-size="13">${format(point.score)}${series.unit==='%'?'%':''}</text>`;
  }
  if (!preview) {
    svg += `<text x="${left}" y="16" fill="#52676b" font-size="13">${e(series.yLabel)}</text>`;
    svg += `<text x="${(left+width-right)/2}" y="${height-12}" text-anchor="middle" fill="#52676b" font-size="13">${e(series.xLabel)}</text>`;
  }
  const aria = `${series.title}. ${series.subtitle}. ${series.yLabel} against ${series.xLabel}. Published ${series.date}. Not a time trend.`;
  const chart = `<svg class="${preview?'track-curve scientific-chart-preview':'track-curve scientific-chart-svg'}" viewBox="0 0 ${width} ${height}" role="${preview?'img':'group'}" aria-label="${e(aria)}" data-curve-id="${e(series.id)}" data-axis-type="${e(series.xType)}" style="display:block;width:100%;height:auto;overflow:visible">${svg}</svg>`;
  if (preview) return chart;
  return `<div class="scientific-chart" data-track-curve="${e(track.id)}"><h4 class="curve-heading curve-title">${e(series.title)}</h4><p class="curve-caption curve-subtitle">${e(series.subtitle)}</p>${chart}<p class="curve-note">${e(series.note)}</p></div>`;
}
