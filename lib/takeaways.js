import { buildTrackSeries, isPrimarySource } from './monitor-series.js';
import { escapeHtml as e } from './selectors.js';

const TRACKS = {
  knowledge: 'medical_knowledge',
  assistance: 'clinical_assistance',
  autonomy: 'autonomous_workflows',
};

/** Exact titles stored in monitor-data.json, used for abbreviations and the glossary. */
export const GLOSSARY = Object.freeze([
  ['METR', 'METR: Software task horizon'],
  ['MedQA', 'MedQA (USMLE 4-Option)'],
  ['MedXpertQA', 'MedXpertQA: Benchmarking Expert-Level Medical Reasoning and Understanding'],
  ['AMIE', 'AMIE: Diagnostic dialogue'],
  ['HealthBench', 'HealthBench: Evaluating Large Language Models Towards Improved Human Health'],
  ['MIRA', 'MIRA: Diagnosis and actions in a virtual EHR'],
  ['ResidencyRL', 'ResidencyRL: Reinforcement Learning in Simulated Clinical Environments'],
  ['MedAgentBench', 'MedAgentBench: A Realistic Virtual EHR Environment to Benchmark Medical LLM Agents'],
]);

const KEY_ORDER = {
  knowledge: ['medqa_nyu_search_500_2026', 'medqa_main'],
  assistance: ['healthbench_pro_2026', 'healthbench_core_2025'],
  autonomy: ['healthagentbench_msft_2026', 'medagentbench_stanford'],
};

const fmt = value => Number(Number(value).toFixed(2)).toString();
const byScore = (a, b) => b.value - a.value || String(a.id).localeCompare(String(b.id));

function seriesById(trackId, cutoff) {
  const built = buildTrackSeries(trackId, cutoff);
  return { track: built.track, series: Object.fromEntries(built.series.map(item => [item.seriesId, item])) };
}

function labelOf(series) {
  return series.readingGuide?.label || series.benchmarkName;
}

function bestEligible(series) {
  return [...(series?.points || []).filter(point => point.eligible)].sort(byScore)[0] || null;
}

function topConfirmed(series, count = 3) {
  return [...(series?.points || []).filter(point => point.validation?.status === 'confirmed')].sort(byScore).slice(0, count);
}

function sentence(parts) {
  return parts.filter(Boolean).join(' ');
}

export function knowledgeTakeaway(cutoff) {
  const { series, track } = seriesById(TRACKS.knowledge, cutoff);
  const exam = series.medqa_nyu_search_500_2026;
  const ranked = topConfirmed(exam, 3);
  if (ranked.length >= 3) {
    const [best, second, third] = ranked;
    return sentence([
      'Exam-style questions such as MedQA are close to saturation.',
      'On ' + exam.benchmarkName + ', the best confirmed result is ' + best.model + ' at ' + fmt(best.value) + '% (model release ' + best.modelReleaseDate + '), with '
        + second.model + ' at ' + fmt(second.value) + '% and ' + third.model + ' at ' + fmt(third.value) + '%.',
      'These scores no longer separate the models widely.',
      'The open questions are in Clinical assistance and Autonomous workflows.',
    ]);
  }
  if (ranked.length) {
    const best = ranked[0];
    return sentence([
      'On ' + exam.benchmarkName + ', the best confirmed result in view is ' + best.model + ' at ' + fmt(best.value) + '% (model release ' + best.modelReleaseDate + ').',
      track.caveat,
    ]);
  }
  return sentence([
    'The 500-question, search-enabled MedQA results are not published by this date.',
    track.caveat,
  ]);
}

export function assistanceTakeaway(cutoff) {
  const { series, track } = seriesById(TRACKS.assistance, cutoff);
  const professional = series.healthbench_pro_2026;
  const core = series.healthbench_core_2025;
  const best = bestEligible(professional);
  const coreBest = bestEligible(core);
  return sentence([
    best ? 'On ' + labelOf(professional) + ', the best confirmed same-protocol result is ' + best.model + ' at ' + fmt(best.value) + ' points (model release ' + best.modelReleaseDate + ').' : '',
    coreBest ? 'On ' + labelOf(core) + ', ' + coreBest.model + ' reaches ' + fmt(coreBest.value) + ' points.' : '',
    best || coreBest ? '' : track.caveat,
  ]);
}

export function autonomyTakeaway(cutoff) {
  const { series, track } = seriesById(TRACKS.autonomy, cutoff);
  const recent = series.healthagentbench_msft_2026;
  const earlier = series.medagentbench_stanford;
  const best = bestEligible(recent);
  const earlierBest = bestEligible(earlier);
  return sentence([
    best ? 'On ' + labelOf(recent) + ', the best confirmed result is ' + best.model + ' at ' + fmt(best.value) + '% task success (model release ' + best.modelReleaseDate + ').' : '',
    earlierBest ? 'On ' + labelOf(earlier) + ', ' + earlierBest.model + ' reaches ' + fmt(earlierBest.value) + '%.' : '',
    best || earlierBest ? '' : track.caveat,
  ]);
}

function shortTrack(trackId) {
  if (TRACKS[trackId]) return trackId;
  return Object.entries(TRACKS).find(([, value]) => value === trackId)?.[0] || trackId;
}

/** Best eligible result on the newest series that has one. */
export function keyResult(trackId, cutoff) {
  const short = shortTrack(trackId);
  const { series } = seriesById(TRACKS[short] || trackId, cutoff);
  for (const seriesId of KEY_ORDER[short] || []) {
    const item = series[seriesId];
    const best = bestEligible(item);
    if (!best) continue;
    const source = (best.sources || []).find(isPrimarySource) || (best.sources || []).find(entry => entry?.url);
    return {
      model: best.model,
      value: fmt(best.value),
      unit: short === 'assistance' ? ' points' : '%',
      date: best.modelReleaseDate,
      url: source?.url || '',
      benchmark: labelOf(item),
    };
  }
  return null;
}

export function keyResultHtml(trackId, cutoff) {
  const result = keyResult(trackId, cutoff);
  if (!result) return '';
  const inner = '<strong>' + e(result.value + result.unit) + '</strong><span>' + e(result.model + ' · ' + result.date) + '</span>';
  const body = result.url
    ? '<a href="' + e(result.url) + '" target="_blank" rel="noopener noreferrer">' + inner + '</a>'
    : inner;
  return '<p class="key-result" data-i18n-ignore>' + body + '</p>';
}

export function trackTakeaway(trackId, cutoff) {
  if (trackId === 'knowledge' || trackId === 'medical_knowledge') return knowledgeTakeaway(cutoff);
  if (trackId === 'assistance' || trackId === 'clinical_assistance') return assistanceTakeaway(cutoff);
  if (trackId === 'autonomy' || trackId === 'autonomous_workflows') return autonomyTakeaway(cutoff);
  throw new Error('Unknown track for takeaway: ' + trackId);
}

export function withAbbreviations(text, scope = {}) {
  if (!scope.seen) scope.seen = new Set();
  let html = e(text);
  for (const [term, title] of GLOSSARY) {
    if (scope.seen.has(term)) continue;
    const pattern = new RegExp('\\b' + term + '\\b');
    if (!pattern.test(html)) continue;
    html = html.replace(pattern, '<abbr title="' + e(title) + '">' + term + '</abbr>');
    scope.seen.add(term);
  }
  return html;
}

export function takeawayHtml(text, scope) {
  return '<!-- REVIEW -->' + withAbbreviations(text, scope);
}
