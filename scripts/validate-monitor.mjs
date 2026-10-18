import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const STATUSES = new Set(['confirmed', 'reported', 'needs_review']);
const COMPARABILITY = new Set(['same_protocol', 'qualified', 'different_protocol', 'unknown']);
const PRIMARY_TYPES = new Set(['official_primary', 'peer_reviewed_primary', 'preprint_primary', 'original_primary']);
const text = value => typeof value === 'string' && value.trim().length > 0;

export function isMonitorDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}(?:-\d{2})?$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1900 || month < 1 || month > 12) return false;
  return day === undefined || day >= 1 && day <= new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function isSourceUrl(value) {
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
}

// This checks the portable contract, not the truth of a publication or a live URL.
// A reviewer must still open the original source before changing evidence status.
export function validateMonitor(data) {
  const errors = [];
  const warnings = [];
  const summary = { tracks: 0, series: 0, points: 0, confirmed: 0, reported: 0, needsReview: 0, eligible: 0, missingSourceLinks: 0, unknownEvaluationDates: 0, monthPrecisionReleaseDates: 0 };
  const fail = (path, message) => errors.push(`${path}: ${message}`);
  const warn = (path, message) => warnings.push(`${path}: ${message}`);
  const ids = new Set();
  const seriesIds = new Set();
  const trackIds = new Set();
  if (!data || typeof data !== 'object') return { errors: ['root: expected an object'], warnings, summary };
  if (!text(data.meta?.schemaVersion)) fail('meta.schemaVersion', 'required');
  for (const [key, expected] of Object.entries({ editorialStandard: 'MONITOR_STANDARD.md', designSpec: 'DESIGN.md', agentInstructions: 'AGENTS.md' })) {
    if (data.meta?.[key] !== expected) fail(`meta.${key}`, `must reference ${expected}`);
  }
  if (data.meta?.rules?.xAxisMapping !== 'modelReleaseDate' || data.meta?.rules?.releaseDateIsProxy !== true) fail('meta.rules', 'release-month positioning must be explicitly identified as a proxy');
  if (data.meta?.rules?.neverConnectDifferentSeriesIds !== true || data.meta?.rules?.interpolateMissingYears !== false) fail('meta.rules', 'incompatible series cannot be bridged or missing years interpolated');
  for (const key of ['lastReviewedAt', 'lastDataChangeAt']) if (!isMonitorDate(data.meta?.[key])) fail(`meta.${key}`, 'expected a supported ISO date');
  for (const key of ['start', 'end']) if (!isMonitorDate(data.meta?.xAxisRange?.[key])) fail(`meta.xAxisRange.${key}`, 'expected a supported ISO date');
  if (data.meta?.xAxisRange?.start > data.meta?.xAxisRange?.end) fail('meta.xAxisRange', 'start must precede end');
  if (!Array.isArray(data.tracks) || !data.tracks.length) fail('tracks', 'non-empty array required');
  for (const track of data.tracks || []) {
    summary.tracks++;
    const path = `track[${track.trackId}]`;
    if (!text(track.trackId) || trackIds.has(track.trackId)) fail(path, 'trackId must be present and unique');
    trackIds.add(track.trackId);
    for (const key of ['title', 'question', 'caveat']) if (!text(track[key])) fail(`${path}.${key}`, 'required');
    if (!track.yAxis || !Number.isFinite(track.yAxis.min) || !Number.isFinite(track.yAxis.max) || track.yAxis.min >= track.yAxis.max || !text(track.yAxis.unit)) fail(`${path}.yAxis`, 'valid scale and unit required');
    if (!Array.isArray(track.series) || !track.series.length) fail(`${path}.series`, 'non-empty array required');
    for (const series of track.series || []) {
      summary.series++;
      const seriesPath = `${path}.series[${series.seriesId}]`;
      if (!text(series.seriesId) || seriesIds.has(series.seriesId)) fail(seriesPath, 'seriesId must be present and globally unique');
      seriesIds.add(series.seriesId);
      if (!text(series.benchmarkName)) fail(`${seriesPath}.benchmarkName`, 'required');
      if (!Array.isArray(series.data)) { fail(`${seriesPath}.data`, 'array required'); continue; }
      for (const point of series.data) {
        summary.points++;
        const p = `${seriesPath}.point[${point.id}]`;
        if (!text(point.id) || ids.has(point.id)) fail(p, 'point id must be present and globally unique');
        ids.add(point.id);
        if (!text(point.model)) fail(`${p}.model`, 'required');
        if (!Number.isFinite(point.value) || point.value < track.yAxis.min || point.value > track.yAxis.max) fail(`${p}.value`, 'finite value within the stated scale required');
        for (const key of ['modelReleaseDate', 'evaluationDate', 'publicationDate']) {
          if (!(key in point)) fail(`${p}.${key}`, 'must be present; unknown dates must be null');
          else if (point[key] !== null && !isMonitorDate(point[key])) fail(`${p}.${key}`, 'use ISO YYYY-MM[-DD] or null; never manufacture date precision');
        }
        if (point.evaluationDate === null) summary.unknownEvaluationDates++;
        if (/^\d{4}-\d{2}$/.test(point.modelReleaseDate || '')) summary.monthPrecisionReleaseDates++;
        if (!(text(point.setup) || point.setup && typeof point.setup === 'object' && Object.keys(point.setup).length)) fail(`${p}.setup`, 'test conditions or explicit not-checked text required');
        for (const key of ['whatWasTested', 'whatValueMeans']) if (!text(point.explain?.[key])) fail(`${p}.explain.${key}`, 'plain-language card copy required');
        if (!STATUSES.has(point.validation?.status)) fail(`${p}.validation.status`, 'unsupported evidence status');
        else summary[point.validation.status === 'needs_review' ? 'needsReview' : point.validation.status]++;
        if (!COMPARABILITY.has(point.validation?.comparability)) fail(`${p}.validation.comparability`, 'unsupported comparison assessment');
        if (typeof point.eligibleForMainline !== 'boolean') fail(`${p}.eligibleForMainline`, 'explicit eligibility flag required; renderer must still derive frontier');
        if (!Array.isArray(point.sources) || !point.sources.length) fail(`${p}.sources`, 'source records required; unknown URLs may be null');
        const sources = point.sources || [];
        for (const source of sources) if (source.url !== null && !isSourceUrl(source.url)) fail(`${p}.sources`, 'only HTTPS URLs or null accepted');
        const linked = sources.filter(source => isSourceUrl(source.url));
        if (!linked.length) summary.missingSourceLinks++;
        if (point.validation?.status === 'confirmed') {
          if (!isMonitorDate(point.validation.reviewedAt) || !text(point.validation.reviewedBy) || !text(point.validation.note)) fail(`${p}.validation`, 'confirmed score requires date, reviewer and rationale');
          if (!linked.some(source => PRIMARY_TYPES.has(source.type) && text(source.locator))) fail(`${p}.sources`, 'confirmed score needs original source and precise locator');
        }
        if (point.eligibleForMainline) {
          summary.eligible++;
          if (point.validation?.status !== 'confirmed' || point.validation?.comparability !== 'same_protocol' || !linked.length) fail(p, 'eligible line point must be confirmed, same_protocol and sourced');
          if (!isMonitorDate(point.modelReleaseDate)) fail(`${p}.modelReleaseDate`, 'line point requires a documented proxy date');
          if (!point.evaluationDate) warn(p, 'score may be confirmed but evaluation date is unknown; show release-month proxy and provisional chronology');
        }
        if (point.legacy === undefined) fail(`${p}.legacy`, 'import history must remain available');
      }
    }
  }
  // The shared editorial card registry is the only active detail-card content.
  if(data.meta?.cardSchemaVersion){
    const cards=data.editorialCards||{};
    const cardRefs=[...(data.tracks||[]).flatMap(t=>(t.series||[]).flatMap(s=>s.data||[])),...['measurements','trendPoints','pointEvidence','historyEvents','trackMilestones','studies'].flatMap(key=>data.extensions?.legacyDashboard?.[key]||[]),data.extensions?.legacyDashboard?.trustContext].filter(Boolean);
    for(const record of cardRefs){if(!cards[record.cardId])fail('card['+record.id+']','missing canonical editorial card');}
    for(const [id,card] of Object.entries(cards)){
      for(const key of ['title','setup','limitations','teaser','date_basis','timeline_note'])if(!text(card[key]))fail('editorialCards.'+id+'.'+key,'required');
      if(!text(card.finding?.headline)||!text(card.finding?.explanation))fail('editorialCards.'+id+'.finding','explicit outcome and meaning required');
      if(!Array.isArray(card.tags)||!card.tags.every(tag=>typeof tag==='string'))fail('editorialCards.'+id+'.tags','array of strings required');
      if(!STATUSES.has(card.validation?.status))fail('editorialCards.'+id+'.validation','explicit status required');
      if(card.evidence_date!==null && !isMonitorDate(card.evidence_date))fail('editorialCards.'+id+'.evidence_date','supported evidence date or null required');
      if(card.evidence_date && card.timeline_year!==Number(card.evidence_date.slice(0,4)))fail('editorialCards.'+id+'.timeline_year','must match cited evidence version');
      if(/Historical source-backed record; see its limitations|What was tested\?|How was it tested\?/.test(JSON.stringify(card)))fail('editorialCards.'+id,'deprecated boilerplate or Q&A labels');
      for(const source of card.sources||[])if(source.url!==null && !isSourceUrl(source.url))fail('editorialCards.'+id+'.sources','HTTPS or null required');
    }
    for(const track of data.tracks||[])for(const series of track.series||[])for(const point of series.data||[]){
      const card=cards[point.cardId];if(!card)continue;
      if(card.finding.value!==point.value)fail('editorialCards.'+point.cardId+'.finding','card and chart numeric value differ');
      if(card.validation.status!==point.validation.status)fail('editorialCards.'+point.cardId+'.validation','card and chart status differ');
    }
  }
  if (summary.confirmed && /41 imported data points are unverified/.test(data.meta?.reviewNote || '')) warn('meta.reviewNote', 'historical import note predates the partial audit; display current validation counts instead');
  if (summary.monthPrecisionReleaseDates) warn('chronology', 'release-month proxies are provisional imported metadata; score confirmation does not validate release, evaluation or publication dates. Source publication dates and versions require separate audit.');
  return { errors, warnings, summary };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const file = resolve(process.argv[2] || 'data/monitor-data.json');
  try {
    const result = validateMonitor(JSON.parse(await readFile(file, 'utf8')));
    console.log(JSON.stringify(result, null, 2));
    if (result.errors.length) process.exitCode = 1;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
