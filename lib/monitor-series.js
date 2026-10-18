import { monitorData } from './monitor-data.js';

export const monitorTrackIds = Object.freeze({
  knowledge: 'medical_knowledge',
  assistance: 'clinical_assistance',
  autonomy: 'autonomous_workflows',
});

const primarySourceTypes = new Set([
  'official_primary', 'peer_reviewed_primary', 'preprint_primary',
  'primary_preprint', 'official_report', 'official_leaderboard',
]);

/** Parse supported precision without inventing a day for month-only evidence. */
export function dateInfo(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}(?:-\d{2})?$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1900 || year > 2100 || month < 1 || month > 12) return null;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day !== undefined && (day < 1 || day > days)) return null;
  const monthLabel = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month - 1, 1)));
  return {
    value, precision: day === undefined ? 'month' : 'day',
    monthIndex: year * 12 + month - 1,
    label: day === undefined ? monthLabel : `${day} ${monthLabel}`,
    earliest: `${value.slice(0, 7)}-${String(day ?? 1).padStart(2, '0')}`,
    latest: `${value.slice(0, 7)}-${String(day ?? days).padStart(2, '0')}`,
  };
}

export function isPrimarySource(source) {
  if (!source || !primarySourceTypes.has(source.type)) return false;
  try {
    const url = new URL(source.url);
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password
      && typeof source.locator === 'string' && source.locator.trim().length > 0;
  } catch { return false; }
}

/** Imported eligible/isFrontier flags never determine publication eligibility. */
export function eligibilityReasons(point) {
  const reasons = [];
  const validation = point.validation ?? {};
  if (validation.status !== 'confirmed') reasons.push('Result not confirmed');
  if (validation.comparability !== 'same_protocol') reasons.push('Comparable protocol not confirmed');
  if (!dateInfo(validation.reviewedAt) || !validation.reviewedBy?.trim()) reasons.push('Review not documented');
  if (!(point.sources ?? []).some(isPrimarySource)) reasons.push('Primary source and locator not checked');
  if (!dateInfo(point.modelReleaseDate)) reasons.push('Release date not checked');
  if (!dateInfo(point.publicationDate)) reasons.push('Publication date not checked');
  if (!Number.isFinite(point.value)) reasons.push('Numeric result missing');
  return reasons;
}

function decorate(point) {
  const releaseDate = dateInfo(point.modelReleaseDate);
  const publicationDateInfo = dateInfo(point.publicationDate);
  const evaluationDateInfo = dateInfo(point.evaluationDate);
  const exclusionReasons = eligibilityReasons(point);
  // Publication after release does not establish when a test was run.
  // Retain the explicit record or use only an actually recorded test date.
  const retrospective = Boolean(point.isRetrospective)
    || Boolean(releaseDate && evaluationDateInfo && evaluationDateInfo.earliest > releaseDate.latest);
  return { ...point, releaseDate, publicationDateInfo, evaluationDateInfo,
    eligible: exclusionReasons.length === 0, exclusionReasons, retrospective,
    evidencePublishedLater: Boolean(releaseDate && publicationDateInfo && publicationDateInfo.earliest > releaseDate.latest),
    frontier: false };
}

/** No mutation of the portable evidence record or its legacy payload. */
export function deriveSeries(series, cutoff) {
  const cutoffDate = dateInfo(cutoff);
  if (!cutoffDate) throw new TypeError('A YYYY-MM or YYYY-MM-DD publication cutoff is required');
  const cutoffDay = cutoffDate.latest;
  const undated = [];
  const points = [];
  let hiddenCount = 0;
  for (const raw of series.data ?? []) {
    const point = decorate(raw);
    if (!point.releaseDate || !point.publicationDateInfo) {
      undated.push(point);
      continue;
    }
    // Month-only publication dates become available only at the end of that
    // month in a day-specific historical view. No invented early publication.
    if (point.releaseDate.earliest > cutoffDay || point.publicationDateInfo.latest > cutoffDay) {
      hiddenCount += 1;
      continue;
    }
    points.push(point);
  }
  points.sort((a, b) => a.releaseDate.monthIndex - b.releaseDate.monthIndex || String(a.id).localeCompare(String(b.id)));
  const clusters = [];
  for (const point of points) {
    let cluster = clusters.at(-1);
    if (!cluster || cluster.monthIndex !== point.releaseDate.monthIndex) {
      cluster = { monthIndex: point.releaseDate.monthIndex, points: [] };
      clusters.push(cluster);
    }
    cluster.points.push(point);
  }
  const frontier = [];
  let maximum = -Infinity;
  for (const cluster of clusters) {
    const eligible = cluster.points.filter(point => point.eligible)
      .sort((a, b) => b.value - a.value || String(a.id).localeCompare(String(b.id)));
    const best = eligible[0];
    if (best && best.value >= maximum) {
      best.frontier = true;
      frontier.push(best);
      maximum = best.value;
    }
  }
  const pending = points.filter(point => !point.eligible);
  const segments = [];
  for (const point of frontier) {
    const prior = segments.at(-1)?.at(-1);
    const gap = prior && (point.releaseDate.monthIndex - prior.releaseDate.monthIndex > 12
      || pending.some(candidate => candidate.releaseDate.monthIndex > prior.releaseDate.monthIndex
        && candidate.releaseDate.monthIndex < point.releaseDate.monthIndex));
    if (!prior || gap) segments.push([point]);
    else segments.at(-1).push(point);
  }
  return { ...series, points, frontier, segments, pending, undated, clusters, hiddenCount,
    provisional: pending.length > 0 || undated.length > 0,
    eligibleCount: points.filter(point => point.eligible).length };
}

export function buildTrackSeries(trackId, cutoff, dataset = monitorData) {
  const canonicalId = monitorTrackIds[trackId] ?? trackId;
  const track = dataset.tracks.find(candidate => candidate.trackId === canonicalId);
  if (!track) throw new RangeError(`Unknown monitor track: ${trackId}`);
  const series = track.series.map(item => deriveSeries(item, cutoff));
  return {
    track, series,
    pointCount: series.reduce((sum, item) => sum + item.points.length, 0),
    eligibleCount: series.reduce((sum, item) => sum + item.eligibleCount, 0),
    pendingCount: series.reduce((sum, item) => sum + item.pending.length + item.undated.length, 0),
  };
}
