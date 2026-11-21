import { buildTrackSeries } from './monitor-series.js';
import { tracks, studies } from '../data/evidence.js';
import { trackMilestones } from '../data/track-milestones.js';
import { pointEvidence } from '../data/point-evidence.js';
import { monitorData } from './monitor-data.js';
import { escapeHtml as e } from './selectors.js';

const TRACK_COLORS = {
  knowledge: '#1d9185',
  assistance: '#be8621',
  autonomy: '#4372b2',
  reasoning: '#be8621',
  general: '#5c6b73'
};

function shortDate(value) {
  if (!value) return '';
  if (/^\d{4}-\d{2}$/.test(value)) {
    return new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' })
      .format(new Date(`${value}-01T12:00:00Z`));
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
      .format(new Date(`${value}T12:00:00Z`));
  }
  return String(value);
}

function normalizedDate(value) {
  if (typeof value !== 'string') return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (/^\d{4}-\d{2}$/.test(value)) return `${value}-28`;
  return '';
}

function sourceKey(cardId, fallback) {
  const url = monitorData.editorialCards?.[cardId]?.sources?.[0]?.url;
  return url ? `url:${url}` : `title:${fallback.toLowerCase()}`;
}

/** Collect confirmed data points, milestones and studies up to cutoff, sorted newest first. */
export function latestDataPoints(cutoff, limit = 3) {
  const byKey = new Map();
  const upsert = item => {
    if (!item?.cardId || !item.sortDate) return;
    const key = sourceKey(item.cardId, item.title);
    const prev = byKey.get(key);
    const isNewer = !prev
      || item.sortDate > prev.sortDate
      || (item.sortDate === prev.sortDate && (item.value ?? -1) > (prev.value ?? -1));
    if (isNewer) byKey.set(key, item);
  };

  for (const track of tracks) {
    const result = buildTrackSeries(track.id, cutoff);
    const unit = result.track.yAxis.unit === '%' ? '%' : ' pts';
    for (const s of result.series) {
      const benchShort = s.shortLabel || s.benchmarkName.split(' (')[0].split(' · ')[0].split(':')[0];
      for (const p of s.points) {
        if (p.validation?.status !== 'confirmed') continue;
        const rawDate = p.publicationDate || p.modelReleaseDate;
        const sortDate = normalizedDate(rawDate);
        if (!sortDate) continue;
        const valText = Number(Number(p.value).toFixed(2)).toString() + unit;
        upsert({
          cardId: p.cardId || p.id,
          rawDate,
          sortDate,
          shortDate: shortDate(rawDate),
          title: p.id === 'hab-v2-opus55' ? 'AI agent tackles clinical workflows' : p.model,
          metricLabel: `${valText} · ${benchShort}`,
          value: p.value,
          color: TRACK_COLORS[track.id] || '#4372b2'
        });
      }
    }
  }

  for (const m of pointEvidence) {
    if (!m.date || m.date > cutoff) continue;
    upsert({
      cardId: m.cardId || m.id,
      rawDate: m.date,
      sortDate: m.date,
      shortDate: shortDate(m.date),
      title: m.label,
      metricLabel: 'Milestone',
      value: null,
      color: TRACK_COLORS[m.seriesId] || '#5c6b73'
    });
  }

  for (const tm of trackMilestones) {
    if (!tm.date || tm.date > cutoff) continue;
    const cardId = tm.cardId || tm.id;
    upsert({
      cardId,
      rawDate: tm.date,
      sortDate: tm.date,
      shortDate: shortDate(tm.date),
      title: tm.shortTitle || tm.title,
      metricLabel: monitorData.editorialCards[cardId]?.classification?.milestone === false ? 'Study' : 'Study milestone',
      value: null,
      color: TRACK_COLORS[tm.trackId] || '#4372b2'
    });
  }

  for (const st of studies) {
    if (!st.date || st.date > cutoff) continue;
    upsert({
      cardId: st.cardId || st.id,
      rawDate: st.date,
      sortDate: st.date,
      shortDate: shortDate(st.date),
      title: st.title.split(':')[0],
      metricLabel: 'Study',
      value: null,
      color: '#1d9185'
    });
  }

  return [...byKey.values()]
    .sort((a, b) =>
      b.sortDate.localeCompare(a.sortDate)
      || (b.value ?? -1) - (a.value ?? -1)
      || String(a.cardId).localeCompare(String(b.cardId))
    )
    .slice(0, limit);
}

/** Render a compact bar of the newest data points and milestones above Latest News. */
export function renderLatestDataPoints(cutoff, limit = 3) {
  const items = latestDataPoints(cutoff, limit);
  if (!items.length) return '';
  const buttons = items.map(item =>
    `<button type="button" class="latest-point-pill" style="--pill-color:${e(item.color)}" data-latest-card="${e(item.cardId)}">`
    + `<time datetime="${e(item.rawDate)}">${e(item.shortDate)}</time>`
    + `<strong${item.cardId === 'hab-v2-opus55' ? '' : ' data-i18n-ignore'}>${e(item.title)}</strong>`
    + `<span>${e(item.metricLabel)}</span>`
    + `</button>`
  ).join('');
  return `<div class="latest-points-inner"><span class="latest-points-label" id="latest-points-title">Latest Research</span><div class="latest-points-list">${buttons}</div></div>`;
}
