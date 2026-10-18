// Pure selectors shared by the browser and Node tests. Dates are ISO calendar days.
// "date" is the evaluation/display date; "publishedAt" is the public availability day.
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function validDate(value) {
  if (typeof value !== 'string' || !datePattern.test(value)) return false;
  const timestamp = Date.parse(value + 'T00:00:00Z');
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
}

function knownDate(row) {
  return row.publishedAt && row.publishedAt > row.date ? row.publishedAt : row.date;
}

function validRows(measurements) {
  return (Array.isArray(measurements) ? measurements : []).filter(row =>
    row && typeof row === 'object' && validDate(row.date) &&
    typeof row.score === 'number' && Number.isFinite(row.score) &&
    (row.publishedAt == null || validDate(row.publishedAt))
  );
}

function chronological(a, b) {
  return a.date.localeCompare(b.date) || knownDate(a).localeCompare(knownDate(b));
}

/** Inclusive cutoff, exact optional filters; malformed input fails closed.
 * @param {Array<any>} measurements
 * @param {{cutoff?: string, trackId?: string, subset?: string}} options
 */
export function filterMeasurements(measurements, { cutoff, trackId, subset } = {}) {
  if (cutoff != null && !validDate(cutoff)) return [];
  return validRows(measurements).filter(row =>
    (cutoff == null || (row.date <= cutoff && knownDate(row) <= cutoff)) &&
    (trackId == null || row.trackId === trackId) &&
    (subset == null || row.subset === subset)
  ).sort(chronological);
}

/** Preserve separate protocols, systems and human references for the same model. */
export function latestByModel(measurements) {
  const latest = new Map();
  for (const row of filterMeasurements(measurements)) {
    const key = JSON.stringify([
      row.trackId ?? '', row.comparisonGroup ?? '', row.model ?? '',
      row.system ?? '', row.isHuman === true
    ]);
    latest.set(key, row);
  }
  return [...latest.values()].sort(chronological);
}

/** Unknown comparison groups are not eligible for a connected series. */
export function groupComparable(measurements) {
  const groups = new Map();
  for (const row of filterMeasurements(measurements)) {
    if (typeof row.comparisonGroup !== 'string' || !row.comparisonGroup.trim()) continue;
    if (!groups.has(row.comparisonGroup)) groups.set(row.comparisonGroup, []);
    groups.get(row.comparisonGroup).push(row);
  }
  return [...groups].map(([id, rows]) => ({ id, measurements: rows }));
}

/**
 * Best publicly known AI result, for ONE comparison group where higher is better.
 * Only actual improvements are emitted: no interpolation, future values or
 * retroactive attribution to an evaluation that had not yet been published.
 */
export function frontierPoints(measurements) {
  const groups = groupComparable(measurements);
  if (groups.length > 1) throw new Error('Frontier requires one comparison group.');
  if (!groups.length) return [];
  const byDate = new Map();
  for (const row of groups[0].measurements) {
    if (row.isHuman === true) continue;
    const day = knownDate(row);
    const previous = byDate.get(day);
    if (!previous || row.score > previous.score) byDate.set(day, row);
  }
  const points = [];
  let best = -Infinity;
  for (const [date, row] of [...byDate].sort(([a], [b]) => a.localeCompare(b))) {
    if (row.score > best) {
      best = row.score;
      points.push({ date, score: row.score, measurement: row });
    }
  }
  return points;
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'
});

export function formatDate(iso) {
  return validDate(iso) ? dateFormatter.format(new Date(iso + 'T00:00:00Z')) : '–';
}

export function escapeHtml(value) {
  const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value ?? '').replace(/[&<>"']/g, character => entities[character]);
}

export function snapshotAt(measurements, cutoff) {
  return filterMeasurements(measurements, { cutoff });
}
