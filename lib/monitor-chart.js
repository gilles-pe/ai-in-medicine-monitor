import { monitorData } from './monitor-data.js';
import { buildTrackSeries, dateInfo } from './monitor-series.js';
import { escapeHtml as e } from './selectors.js';

const TITLES = {
  medqa_main: 'MedQA · medical exam questions',
  healthbench_core_2025: 'HealthBench Core · clinical conversations',
  healthbench_pro_2026: 'HealthBench Professional · clinical tasks',
  medagentbench_stanford: 'MedAgentBench · simulated health-record tasks',
  healthagentbench_msft_2026: 'HealthAgentBench · simulated clinical workflows',
};
const DEFAULT_COLORS = { knowledge: '#209b8e', assistance: '#d49b32', autonomy: '#4d7dbe' };
const n = value => Number(Number(value).toFixed(2)).toString();

function scoreLabel(value, unit) { return `${n(value)}${unit === '%' ? '%' : ' points'}`; }
function statusLabel(point) {
  const status = point.validation?.status;
  return status === 'confirmed' ? (point.eligible ? 'Confirmed' : 'Confirmed score; comparison under review')
    : status === 'reported' ? 'Reported; comparison under review' : 'Under review';
}

/** Group touch targets at the minimum plot width, without moving score marks. */
function touchClusters(points, x, y, width) {
  const minimumScale = Math.min(1, 284 / width);
  const groups = [];
  for (const point of points) {
    const px = x(point.releaseDate.monthIndex), py = y(point.value);
    const group = groups.find(candidate =>
      Math.abs(candidate.anchorX - px) * minimumScale < 44 &&
      Math.abs(candidate.anchorY - py) < 44);
    if (group) group.points.push(point);
    else groups.push({ anchorX: px, anchorY: py, points: [point] });
  }
  return groups.map(group => ({ ...group,
    x: group.points.reduce((sum, point) => sum + x(point.releaseDate.monthIndex), 0) / group.points.length,
    y: group.points.reduce((sum, point) => sum + y(point.value), 0) / group.points.length,
  }));
}

function chartBand(series, track, range, cutoff, { preview, model, width }) {
  const height = preview ? 105 : 205;
  const left = preview ? 12 : 36;
  const right = preview ? 10 : 14;
  const top = preview ? 9 : width < 420 ? 44 : 29;
  const bottom = preview ? 22 : 32;
  const floor = height - bottom;
  const min = Number.isFinite(track.yAxis?.min) ? track.yAxis.min : 0;
  const max = Number.isFinite(track.yAxis?.max) ? track.yAxis.max : 100;
  const unit = track.yAxis?.unit === '%' ? '%' : 'pts';
  const metric = unit === '%' ? (track.trackId === 'medical_knowledge' ? 'Accuracy (%)' : 'Task success (%)') : 'Rubric score (points)';
  const title = TITLES[series.seriesId] || series.benchmarkName;
  const x = month => left + (month - range.start) / (range.end - range.start || 1) * (width - left - right);
  const y = value => floor - (value - min) / (max - min || 1) * (floor - top);
  const color = track.color;
  const points = series.points.filter(point => point.releaseDate.monthIndex >= range.start && point.releaseDate.monthIndex <= range.end);
  const allEligible = series.points.filter(point => point.eligible);
  const pending = points.filter(point => !point.eligible);
  const latest = series.frontier.at(-1);
  let body = '';
  for (const value of preview ? [min, max] : [min, (min + max) / 2, max]) {
    body += `<line x1="${left}" x2="${width - right}" y1="${y(value)}" y2="${y(value)}" stroke="#dce2db" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
    if (!preview) body += `<text x="${left - 9}" y="${y(value) + 4}" text-anchor="end" fill="#627477" font-size="11">${n(value)}</text>`;
  }
  const startYear = Math.floor(range.start / 12);
  const endYear = Math.floor(range.end / 12);
  for (let year = startYear; year <= endYear; year++) {
    const month = year * 12;
    if (month < range.start || month > range.end) continue;
    body += `<line x1="${x(month)}" x2="${x(month)}" y1="${top}" y2="${floor}" stroke="#e3e7e0" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
    body += `<text x="${x(month)}" y="${height - 10}" text-anchor="${year === startYear ? 'start' : 'middle'}" fill="#627477" font-size="${preview ? 12 : 11}">${year}</text>`;
  }
  // Step segments denote a documented running maximum. No smoothing, no future
  // extension and no bridge over the gaps determined by the evidence module.
  for (const segment of series.segments) {
    const visible = segment.filter(point => point.releaseDate.monthIndex >= range.start && point.releaseDate.monthIndex <= range.end);
    for (let index = 1; index < visible.length; index++) {
      const prior = visible[index - 1], point = visible[index];
      const retrospective = prior.retrospective || point.retrospective;
      body += `<path class="monitor-frontier${retrospective ? ' monitor-retrospective-line' : ''}" data-series-id="${e(series.seriesId)}" d="M${x(prior.releaseDate.monthIndex)},${y(prior.value)} H${x(point.releaseDate.monthIndex)} V${y(point.value)}" fill="none" stroke="${e(color)}" stroke-width="${preview ? 2 : 2.6}"${retrospective ? ' stroke-dasharray="3 5"' : ''} vector-effect="non-scaling-stroke"/>`;
    }
  }
  for (const point of points) {
    const px = x(point.releaseDate.monthIndex), py = y(point.value);
    const selected = !model || point.model === model;
    const ink = selected ? color : '#8c9b97';
    const opacity = point.frontier && selected ? 1 : selected ? .62 : .27;
    const radius = preview ? 3 : point.frontier ? 4.7 : 3.6;
    const label = `${point.model}, ${scoreLabel(point.value, unit)}, ${point.releaseDate.label}. ${statusLabel(point)}${point.retrospective ? '. Older model evaluated later' : ''}.`;
    // Noneligible observations use diamonds, never a connected preview line.
    const mark = !point.eligible
      ? `<path d="M${px},${py - radius - 1} l${radius + 1},${radius + 1} l-${radius + 1},${radius + 1} l-${radius + 1},-${radius + 1} Z" fill="#fffdf8" stroke="${e(ink)}" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`
      : `<circle cx="${px}" cy="${py}" r="${radius}" fill="${point.retrospective ? '#fffdf8' : e(ink)}" stroke="${e(ink)}" stroke-width="${point.frontier ? 2 : 1.3}" vector-effect="non-scaling-stroke"/>`;
    body += `<g class="monitor-observation${point.eligible ? '' : ' monitor-unreviewed'}" data-observation-id="${e(point.id)}" opacity="${opacity}"><title>${e(label)}</title>${mark}</g>`;
  }
  if (!preview) {
    body += `<text class="monitor-metric-label" x="${left}" y="15" fill="#526c70" font-size="11">${e(metric)}</text>`;
    if (latest) body += `<text class="monitor-best-label" x="${width - right}" y="${width < 420 ? 31 : 15}" text-anchor="end" fill="${e(color)}" font-size="11">Best confirmed: ${e(scoreLabel(latest.value, unit))}</text>`;
    if (!points.length) body += `<text x="${(left + width - right) / 2}" y="${(top + floor) / 2}" text-anchor="middle" fill="#627477" font-size="11">No published results at this date</text>`;
  }
  const chart = `<svg xmlns="http://www.w3.org/2000/svg" class="monitor-chart-svg${preview ? ' monitor-chart-preview' : ''}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${e(title)}. ${e(metric)} by model release month, an approximate availability proxy. ${allEligible.length} eligible results. ${pending.length} points not eligible for a trend." data-monitor-series="${e(series.seriesId)}" data-axis-type="calendar">${body}</svg>`;
  if (preview) return chart;
  const hits = touchClusters(points, x, y, width).map(group => {
    const names = group.points.map(point => `${point.model}, ${scoreLabel(point.value, unit)}, ${point.releaseDate.label}, ${statusLabel(point)}`);
    const attr = group.points.length === 1 ? `data-monitor-point="${e(group.points[0].id)}"` : `data-monitor-cluster="${e(group.points.map(point => point.id).join(','))}"`;
    return `<button type="button" class="monitor-point-hit${group.points.length > 1 ? ' monitor-cluster-hit' : ''}" ${attr} style="left:clamp(22px,${group.x / width * 100}%,calc(100% - 22px));top:clamp(22px,${group.y / height * 100}%,calc(100% - 22px))" aria-label="${e(group.points.length > 1 ? `${group.points.length} nearby results. ${names.join('; ')}. Open results.` : `${names[0]}. Open result.`)}">${group.points.length > 1 ? `<span class="monitor-cluster-count" aria-hidden="true">${group.points.length}</span>` : ''}</button>`;
  }).join('');
  const benchmarkExplanation = series.points[0]?.explain?.whatWasTested || series.data?.[0]?.explain?.whatWasTested || 'Test description not yet checked.';
  const note = pending.length
    ? `<span class="monitor-preview-badge">Provisional data</span> ${pending.length} ${pending.length === 1 ? 'point is' : 'points are'} excluded from the trend pending review.`
    : 'Score evidence checked. Timeline dates remain provisional.';
  const isolated = !series.frontier.length ? 'A confirmed comparable trend is not yet available.'
    : series.frontier.length === 1 ? 'One eligible result; no trend line yet.' : '';
  return `<section class="monitor-series-band" data-benchmark-series="${e(series.seriesId)}"><h4>${e(title)}</h4><div class="monitor-plot">${chart}<div class="monitor-hit-layer">${hits}</div></div><p class="monitor-series-note">${note}${isolated ? ` ${e(isolated)}` : ''}</p><details class="monitor-benchmark-about"><summary>About this benchmark</summary><p>${e(benchmarkExplanation)}</p><p>${e(track.caveat || 'Benchmark results do not establish clinical safety.')}</p><p>Series are kept separate. Lines show only the best eligible results within this benchmark. Other models remain individual points.</p></details></section>`;
}

export function renderMonitorChart(track, cutoff, { preview = false, model = '' } = {}) {
  const result = buildTrackSeries(track.id || track.trackId, cutoff);
  const color = track.color || DEFAULT_COLORS[track.id] || '#4d7dbe';
  const contentTrack = { ...result.track, color };
  const start = dateInfo(monitorData.meta.xAxisRange.start).monthIndex;
  const end = dateInfo(monitorData.meta.xAxisRange.end).monthIndex;
  const range = { start, end };
  // The viewBox matches the available screen width, keeping labels readable at
  // 320px. A resize rerender updates it; pure/Node consumers use 700px.
  const width = preview ? 320 : Math.max(250, Math.min(1116, (globalThis.window?.innerWidth ?? 736) - 36));
  const series = preview ? [result.series.find(item => item.points.length) || result.series[0]] : result.series;
  const charts = series.map(item => chartBand(item, contentTrack, range, cutoff, { preview, model, width })).join('');
  if (preview) return charts;
  const retrospective = result.series.some(item => item.points.some(point => point.retrospective));
  const unreviewed = result.series.some(item => item.points.some(point => !point.eligible));
  return `<div class="monitor-chart" data-track-curve="${e(track.id || track.trackId)}"><p class="monitor-question">${e(contentTrack.question)}</p>${charts}<p class="monitor-calendar-note">Provisional timeline · release months approximate. Model availability is not the test date. Imported publication dates also remain under review.</p><div class="monitor-legend" aria-label="Chart legend"><span><i class="monitor-key-line" style="--track:${e(color)}"></i>Best eligible result</span><span><i class="monitor-key-dot" style="--track:${e(color)}"></i>Other models</span>${retrospective ? '<span><i class="monitor-key-retro"></i>Older models tested later</span>' : ''}${unreviewed ? '<span><i class="monitor-key-pending"></i>Not eligible for trend</span>' : ''}</div></div>`;
}
