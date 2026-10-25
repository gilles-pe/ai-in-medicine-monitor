import { tracks, studies, sourceCatalog } from '../data/evidence.js';
import { trackMilestones } from '../data/track-milestones.js';
import { monitorData } from './monitor-data.js';
import { renderOverview, renderMilestoneLinks } from './overview.js';
import { renderMonitorChart, renderTrackDataTable } from './monitor-chart.js';
import { renderTrackContext } from './track-context.js';
import { renderNewsSidebar } from './news.js';
import { buildTrackSeries } from './monitor-series.js';
import { escapeHtml as e } from './selectors.js';
import { takeawayHtml, trackTakeaway, keyResult, GLOSSARY } from './takeaways.js';
import { REVIEWED_AT, reviewedMarkup } from './site-meta.js';

const abbreviationScope = { seen: new Set() };

export function resetAbbreviations() {
  abbreviationScope.seen = new Set();
}

export function publishedCutoff() {
  return REVIEWED_AT;
}

function zoomButton(target, label, active = false) {
  const icon = active
    ? '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>'
    : '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>';
  const name = active ? 'Exit full view' : 'Expand ' + label + ' chart';
  return '<button type="button" class="chart-zoom-button" data-chart-zoom="' + e(target) + '" aria-label="' + e(name) + '" aria-pressed="' + active + '" title="' + (active ? 'Close full view' : 'Expand chart') + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + icon + '</svg></button>';
}

export function renderTrackSection(track, cutoff, { model = '', zoomed = false } = {}) {
  const trackData = buildTrackSeries(track.id, cutoff);
  const series = trackData.series;
  const selected = 'all';
  const result=keyResult(track.id,cutoff);
  const headlineResult=result?'<a class="track-headline-result" href="'+e(result.url)+'" target="_blank" rel="noopener noreferrer" title="'+e(result.benchmark+' · '+result.model)+'" data-i18n-ignore>'+e(result.value+result.unit)+'</a>':'';
  const marks = trackMilestones.filter(item => item.trackId === track.id && item.date <= cutoff);
  const stories = '<div class="chart-stories" aria-label="Milestones">' + marks.map(item => '<button type="button" id="track-milestone-' + e(item.id) + '" data-track-milestone="' + e(item.id) + '"><time datetime="' + e(item.date) + '">' + item.date.slice(0, 4) + '</time><span>' + e(item.shortTitle) + '</span></button>').join('') + '</div>';
  const figure = '<figure class="chart-figure"><figcaption class="chart-takeaway">' + takeawayHtml(trackTakeaway(track.id, cutoff), abbreviationScope) + '</figcaption>' + renderMonitorChart(track, cutoff, { model, seriesView: selected }) + renderTrackDataTable(track, cutoff, { model, seriesView: selected }) + '</figure>';
  return '<section class="track" id="chart-' + track.id + '" data-track="' + track.id + '" tabindex="-1" aria-labelledby="track-' + track.id + '" style="--track:' + track.color + '"><div class="track-top"><h2 id="track-' + track.id + '">' + e(track.label) + '</h2>' + headlineResult + '<div class="track-actions">' + zoomButton(track.id, track.label, zoomed) + '</div></div><p class="track-description">' + e(trackData.track.readingGuide.description) + '</p><div class="track-visual">' + stories + figure + '</div>' + renderTrackContext(track.id, cutoff, { model, seriesView: selected }) + '</section>' + renderSectionSources(track, cutoff);
}

function httpsUrl(sourceId) {
  const source = sourceCatalog.find(item => item.id === sourceId);
  return typeof source?.url === 'string' && source.url.startsWith('https://') ? source.url : '';
}

function renderSectionSources(track, cutoff) {
  const marks = trackMilestones.filter(item => item.trackId === track.id && item.date <= cutoff);
  if (!marks.length) return '';
  const items = marks.map(item => {
    const url = httpsUrl(item.sourceId);
    const href = url || '#track-milestone-' + item.id;
    const external = url ? ' target="_blank" rel="noopener noreferrer"' : '';
    return '<li><a href="' + e(href) + '"' + external + '>' + e(item.title) + '</a></li>';
  }).join('');
  return '<details class="section-sources" id="track-sources-' + track.id + '"><summary><h3 id="sources-' + track.id + '">Sources</h3></summary><ul>' + items + '</ul></details>';
}

export function renderSourceIndex(cutoff) {
  const items = studies.filter(item => item.date <= cutoff).map(item => {
    const url = httpsUrl(item.sourceId);
    const href = url || '#study-' + item.id;
    const external = url ? ' target="_blank" rel="noopener noreferrer"' : '';
    return '<li><time datetime="' + e(item.date) + '">' + item.date.slice(0, 4) + '</time> <a href="' + e(href) + '"' + external + '>' + e(item.title) + '</a></li>';
  }).join('');
  return '<summary><h2 id="sources-title">Sources</h2></summary><ul class="source-index-list">' + items + '</ul>';
}

export function renderGlossary() {
  const rows = GLOSSARY.map(([term, title]) => '<div><dt><abbr title="' + e(title) + '">' + e(term) + '</abbr></dt><dd>' + e(title) + '</dd></div>').join('');
  return '<summary><h2 id="glossary-title">Glossary</h2></summary><dl>' + rows + '</dl>';
}

export function renderPreviewSection(cutoff, model = '') {
  const links = (monitorData.extensions.navigation.relatedLinks || []).map(link => '<a href="' + e(link.url) + '" target="_blank" rel="noopener noreferrer">' + e(link.title) + ' <span data-i18n-ignore>· ' + e(link.publisher) + '</span> <span aria-hidden="true">↗</span></a>').join('');
  const related = links ? '<nav class="related-resources" aria-label="Related"><span>Related</span><span aria-hidden="true">·</span>' + links + '</nav>' : '';
  return '<section id="charts" class="benchmark-previews" aria-label="Charts"><div class="thumbnail-grid">' + tracks.map(track => '<a class="chart-thumbnail" href="#chart-' + track.id + '" style="--track:' + track.color + '"><span class="thumbnail-title">' + e(track.label) + ' <span aria-hidden="true">↘</span></span>' + renderMonitorChart(track, cutoff, { preview: true, model }) + '</a>').join('') + '</div>' + related + '</section>';
}

export function renderStudyButtons(cutoff) {
  return studies.filter(item => item.date <= cutoff).map(item => '<button type="button" id="study-' + e(item.id) + '" data-study-id="' + e(item.id) + '"><time datetime="' + e(item.date) + '">' + item.date.slice(0, 4) + '</time><span>' + e(item.title) + '</span><span aria-hidden="true">↗</span></button>').join('');
}

export function homeFragments(cutoff = publishedCutoff(), today = cutoff) {
  resetAbbreviations();
  return {
    reviewed: reviewedMarkup(REVIEWED_AT),
    overview: renderOverview(cutoff, today, { includeIndex: false }),
    news: renderNewsSidebar('en'),
    milestones: renderMilestoneLinks(cutoff),
    previews: renderPreviewSection(cutoff),
    tracks: tracks.map(track => renderTrackSection(track, cutoff)).join(''),
    studies: renderStudyButtons(cutoff),
    glossary: renderGlossary(),
    sources: renderSourceIndex(cutoff),
  };
}
