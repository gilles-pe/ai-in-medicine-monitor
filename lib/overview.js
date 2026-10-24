import { presentationSeries } from '../data/presentation-chart.js';
import { historyEvents, presentationScenarios } from '../data/history.js';
import { pointEvidence } from '../data/point-evidence.js';
import { sourceCatalog } from '../data/evidence.js';
import { escapeHtml as e } from './selectors.js';

const x = year => 68 + (year - 1950) / 80 * 1030;
const y = index => 327 - (index - 45) / 135 * 260;
const path = points => points.map((point,index) => (index ? 'L' : 'M') + x(point.year).toFixed(2) + ',' + y(point.index).toFixed(2)).join(' ');
export function visibleHistory(cutoff) {
  return historyEvents.filter(event => event.date ? event.date <= cutoff : event.year <= Number(cutoff.slice(0,4)));
}
export function visibleAnchors(cutoff) {
  return pointEvidence.filter(point => point.date ? point.date <= cutoff : point.year <= Number(cutoff.slice(0,4)));
}
// Historical AlphaFold announcements belong in Milestones, alongside paper anchors.
export function overviewMilestoneItems(cutoff) {
  const anchors=visibleAnchors(cutoff);
  const historical=visibleHistory(cutoff).filter(event=>event.id.startsWith('alphafold')&&!anchors.some(point=>point.sourceId===event.sourceId));
  return [...anchors.map(point=>({...point,attribute:'data-overview-point'})),...historical.map(event=>({...event,seriesId:'knowledge',attribute:'data-history-id'}))]
    .sort((a,b)=>a.year-b.year||(a.date||'').localeCompare(b.date||''));
}
export function renderMilestoneLinks(cutoff) {
  return overviewMilestoneItems(cutoff)
    .map(point=>'<button type="button" id="milestone-'+e(point.id)+'" '+point.attribute+'="'+e(point.id)+'"><time datetime="'+e(point.date||String(point.year))+'">'+point.year+'</time> · '+e(point.label)+'</button>').join('');
}
export function renderOverviewDataTable(cutoff) {
  const anchors = visibleAnchors(cutoff);
  const seriesLabels = Object.fromEntries(presentationSeries.map(s => [s.id, s.label]));
  const rows = anchors.map(point => {
    const source = sourceCatalog.find(s => s.id === point.sourceId);
    const dateVal = point.date || String(point.year);
    const link = source?.url ? '<a href="'+e(source.url)+'" target="_blank" rel="noopener noreferrer">'+e(source.publisher || source.title)+' ↗</a>' : '';
    return '<tr><td><time datetime="'+e(dateVal)+'">'+point.year+'</time></td><td>'+e(point.label)+'</td><td>'+e(seriesLabels[point.seriesId] || point.seriesId)+'</td><td>'+e(point.finding)+'</td><td>'+link+'</td></tr>';
  }).join('');
  return '<details class="chart-data-table"><summary>Data table</summary><div class="data-table-scroll"><table><caption>Documented milestones and studies on the 1950–2030 timeline</caption><thead><tr><th scope="col">Year</th><th scope="col">Milestone</th><th scope="col">Track</th><th scope="col">Finding</th><th scope="col">Source</th></tr></thead><tbody>'+rows+'</tbody></table></div></details>';
}
export function renderOverviewMilestoneStrip(cutoff, activeYear = Number(cutoff.slice(0,4))) {
  const items = overviewMilestoneItems(cutoff);
  if (!items.length) return '';
  const colors = Object.fromEntries(presentationSeries.map(s=>[s.id,s.color]));
  const years = [...new Set(items.map(item=>item.year))];
  const nearestYear = years.reduce((best,year)=>Math.abs(year-activeYear)<Math.abs(best-activeYear)?year:best,years[0]);
  const highlighted = items.filter(item=>Math.abs(item.year-nearestYear)<=1);
  const display = (highlighted.length ? highlighted : items.slice(-4)).slice(-6);
  const pills = display.map((item)=>{
    const color = colors[item.seriesId]||'#60727c';
    const isExact = item.year===nearestYear;
    return '<button type="button" class="overview-milestone-pill'+(isExact?' is-active-year':'')+'" style="--pill-color:'+color+'" '+item.attribute+'="'+e(item.id)+'"><b>'+item.year+'</b> <span>'+e(item.label)+'</span></button>';
  }).join('');
  return '<div class="overview-milestone-strip" id="overview-milestone-strip" aria-label="Medicine milestones"><div class="overview-milestone-head"><span class="overview-milestone-title">MEDICINE MILESTONES</span><span class="overview-milestone-year" id="overview-scrub-year">'+nearestYear+'</span></div><div class="overview-milestone-pills" id="overview-milestone-pills">'+pills+'</div></div>';
}
export function clipIllustration(points, year) {
  const selected = points.filter(point => point.year <= year);
  const next = points.find(point => point.year > year);
  const last = selected.at(-1);
  if (next && last && last.year < year) selected.push({year,index:last.index + (next.index - last.index) * (year-last.year)/(next.year-last.year)});
  return selected;
}
export function fractionalYear(date) {
  const year = Number(date.slice(0,4));
  const start = Date.UTC(year,0,1), end = Date.UTC(year+1,0,1);
  return year + (Date.parse(date+'T00:00:00Z')-start)/(end-start);
}
function displayPoints(series, asOfYear) {
  return series.points.map(point=>point.year===2026 ? {...point,year:Math.max(2026,asOfYear)} : point);
}
export function illustrationPosition(seriesId, year, asOfYear = 2026) {
  const points = displayPoints(presentationSeries.find(series=>series.id===seriesId),asOfYear);
  return clipIllustration(points,year).at(-1)?.index;
}
export function renderOverview(cutoff, today,{includeIndex=true}={}) {
  const selectedYear = Math.min(2030,Number(cutoff.slice(0,4)));
  const currentYear = Number(today.slice(0,4));
  const asOfYear = Math.min(2026.999,fractionalYear(today));
  const selectedTime = Math.min(2030,fractionalYear(cutoff));
  const anchors = visibleAnchors(cutoff);
  let svg = '<defs><clipPath id="overview-clip"><rect x="60" y="45" width="1046" height="286"/></clipPath><pattern id="future-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#d5d8ce" stroke-width="1.5" stroke-opacity=".55"/></pattern></defs>';
  svg += '<rect x="68" y="50" width="1030" height="280" rx="3" fill="#fffdf9" fill-opacity=".65"/>';
  svg += '<rect x="' + x(asOfYear) + '" y="50" width="' + (x(2030)-x(asOfYear)) + '" height="280" fill="#ebe9e0" fill-opacity=".55"/><rect x="' + x(asOfYear) + '" y="50" width="' + (x(2030)-x(asOfYear)) + '" height="280" fill="url(#future-hatch)"/>';
  for (const value of [50,70,85,100,115,130,145,160,175]) svg += '<line x1="68" x2="1098" y1="'+y(value)+'" y2="'+y(value)+'" class="overview-grid"/><text x="53" y="'+(y(value)+4)+'" text-anchor="end" class="overview-tick'+([50,100,150,175].includes(value)?'':' overview-tick-secondary')+'">'+value+'</text>';
  for (const year of [1950,1960,1970,1980,1990,2000,2010,2020,2026,2030]) svg += '<line x1="'+x(year)+'" x2="'+x(year)+'" y1="50" y2="330" class="overview-grid"/><text x="'+x(year)+'" y="353" text-anchor="middle" class="overview-tick'+([1950,1980,2000,2020,2030].includes(year)?'':' overview-tick-secondary')+'">'+year+'</text>';
  svg += '<text x="68" y="25" class="overview-axis-title">IQ for illustration</text><text x="1105" y="25" text-anchor="end" class="overview-axis-title">Autonomy: software tasks</text>';
  svg += '<text x="90" y="72" class="overview-zone">ILLUSTRATIVE SCALE</text><text x="'+(x(asOfYear)+10)+'" y="72" class="overview-zone">2030?</text>';
  // Illustrative context only. No source validates these heights.
  for (const [label,seconds] of [['1 sec',1],['1 min',60],['1 hour',3600],['1 day',86400],['1 year',31536000]]) {
    const index = 48 + Math.log10(seconds)/Math.log10(31536000)*132;
    svg += '<text x="1110" y="'+(y(index)+4)+'" text-anchor="start" class="overview-tick overview-right-tick">'+label+'</text>';
  }
  for (const series of presentationSeries) {
    const adjusted = displayPoints(series,asOfYear);
    const observed = clipIllustration(adjusted.filter(point => point.year <= asOfYear), Math.min(asOfYear,selectedTime));
    const future = adjusted.filter(point => point.year >= asOfYear && point.year <= 2030);
    svg += '<g clip-path="url(#overview-clip)" style="color:'+series.color+'">';
    if (observed.length) svg += '<path d="'+path(observed)+'" class="overview-line'+(series.id !== 'general' ? ' medical-line' : '')+'"/>';
    if (selectedYear >= 2026 && future.length > 1) svg += '<path d="'+path(future)+'" class="overview-line scenario-line"/>';
    // Only evidence anchors are dots. Interpolation and future scenarios get no dots.
    const buckets = new Map();
    for (const point of anchors.filter(point=>point.seriesId===series.id)) {
      if (!buckets.has(point.year)) buckets.set(point.year,[]);
      buckets.get(point.year).push(point);
    }
    for (const points of buckets.values()) {
      const point = points[0];
      const clustered = points.length > 1;
      const year = points.reduce((sum,item)=>sum+(item.date ? fractionalYear(item.date) : item.year),0)/points.length;
      const label = point.year + ' · ' + (clustered ? points.length+' studies: '+points.map(item=>item.label).join(', ') : point.label) + ' · Open source';
      const attribute = clustered ? 'data-overview-cluster="'+points.map(item=>e(item.id)).join(',')+'"' : 'data-overview-point="'+e(point.id)+'"';
      const xx = x(year), yy = y(illustrationPosition(series.id,year,asOfYear));
      svg += '<g class="overview-point" role="button" tabindex="0" '+attribute+' aria-label="'+e(label)+'"><title>'+e(label)+'</title><circle class="anchor-hit" cx="'+xx+'" cy="'+yy+'" r="10" fill="transparent"/><circle class="anchor-dot" cx="'+xx+'" cy="'+yy+'" r="'+(clustered?4.5:3.5)+'" fill="currentColor" stroke="#fffdf8" stroke-width="1.4"/>'+'</g>';
    }
    svg += '</g>';
  }
  const cursor = x(Math.max(1950,selectedTime));
  const statusLabel = selectedYear===currentYear?'TODAY':'SELECTED';
  svg += '<g id="overview-cursor-group" data-default-x="'+cursor+'" data-default-year="'+selectedYear+'" data-default-status="'+statusLabel+'" pointer-events="none"><line id="overview-cursor-line" x1="'+cursor+'" x2="'+cursor+'" y1="42" y2="332" class="overview-cursor"/><rect id="overview-cursor-box" x="'+(cursor-31)+'" y="83" width="62" height="36" rx="7" fill="#123a43"/><text id="overview-cursor-year" x="'+cursor+'" y="98" text-anchor="middle" class="cursor-label">'+selectedYear+'</text><text id="overview-cursor-status" x="'+cursor+'" y="111" text-anchor="middle" class="cursor-small">'+statusLabel+'</text></g>';
  const legend = presentationSeries.map(series => '<span data-series="'+series.id+'"><i style="--series-color:'+series.color+'"></i>'+e(series.label)+'</span>').join('');
  const milestoneStrip = renderOverviewMilestoneStrip(cutoff, selectedYear);
  const index = '<details class="point-index"><summary>Milestones</summary><div class="point-index-list">'+renderMilestoneLinks(cutoff)+'</div></details>';
  const zoomButton = '<button type="button" class="chart-zoom-button" data-chart-zoom="overview" aria-label="Expand AI in Medicine 1950–2030 chart" aria-pressed="false" title="Expand chart"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>';
  const dataTable = renderOverviewDataTable(cutoff);
  const takeaway = '<!-- REVIEW -->The 1950–2030 timeline shows ' + anchors.length + ' documented milestones. Positions on this chart are illustrative; the sources support the milestones, not real IQ scores.';
  return '<section id="overview" class="overview" aria-labelledby="overview-title"><div class="section-title"><h2 id="overview-title">AI in Medicine <span>1950–2030</span></h2>'+zoomButton+'</div><figure class="chart-figure overview-figure"><figcaption class="chart-takeaway">'+takeaway+'</figcaption><div class="overview-legend">'+legend+'</div><div class="overview-scroll" tabindex="0" role="region" aria-label="Timeline from 1950 to 2030."><svg viewBox="0 0 1200 380" role="group" aria-label="Timeline from 1950 to 2030. Select milestones for sources. IQ scores and autonomy durations are illustrative.">'+svg+'</svg></div><p class="overview-caption">Illustrative scale. Sources support milestones, not real IQ scores.</p>'+dataTable+'</figure>'+(includeIndex?index:'')+milestoneStrip+'</section>';
}
