import { presentationSeries } from '../data/presentation-chart.js';
import { historyEvents, presentationScenarios } from '../data/history.js';
import { pointEvidence } from '../data/point-evidence.js';
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
export function renderMilestoneLinks(cutoff) {
  const anchors=visibleAnchors(cutoff);
  const historical=visibleHistory(cutoff).filter(event=>event.id.startsWith('alphafold')&&!anchors.some(point=>point.sourceId===event.sourceId));
  return [...anchors.map(point=>({...point,attribute:'data-overview-point'})),...historical.map(event=>({...event,attribute:'data-history-id'}))]
    .sort((a,b)=>a.year-b.year||(a.date||'').localeCompare(b.date||''))
    .map(point=>'<button type="button" '+point.attribute+'="'+e(point.id)+'">'+point.year+' · '+e(point.label)+'</button>').join('');
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
  let svg = '<defs><clipPath id="overview-clip"><rect x="60" y="45" width="1046" height="286"/></clipPath></defs>';
  svg += '<rect x="' + x(asOfYear) + '" y="50" width="' + (x(2030)-x(asOfYear)) + '" height="280" fill="#e9e8e180"/>';
  for (const value of [50,70,85,100,115,130,145,160,175]) svg += '<line x1="68" x2="1098" y1="'+y(value)+'" y2="'+y(value)+'" class="overview-grid"/><text x="53" y="'+(y(value)+4)+'" text-anchor="end" class="overview-tick'+([50,100,150,175].includes(value)?'':' overview-tick-secondary')+'">'+value+'</text>';
  for (const year of [1950,1960,1970,1980,1990,2000,2010,2020,2026,2030]) svg += '<line x1="'+x(year)+'" x2="'+x(year)+'" y1="50" y2="330" class="overview-grid"/><text x="'+x(year)+'" y="353" text-anchor="middle" class="overview-tick'+([1950,1980,2000,2020,2030].includes(year)?'':' overview-tick-secondary')+'">'+year+'</text>';
  svg += '<text x="68" y="25" class="overview-axis-title">IQ for illustration</text><text x="1105" y="25" text-anchor="end" class="overview-axis-title">Autonomy: software tasks</text>';
  svg += '<text x="90" y="72" class="overview-zone">ILLUSTRATIVE SCALE</text><text x="'+(x(asOfYear)+10)+'" y="72" class="overview-zone">2030?</text>';
  // Illustrative context only. No source validates these heights.
  for (const [label,seconds] of [['1 sec',1],['1 min',60],['1 hour',3600],['1 day',86400],['1 year',31536000]]) {
    const index = 48 + Math.log10(seconds)/Math.log10(31536000)*132;
    svg += '<text x="1110" y="'+(y(index)+4)+'" class="overview-tick overview-right-tick">'+label+'</text>';
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
  svg += '<line x1="'+cursor+'" x2="'+cursor+'" y1="42" y2="332" class="overview-cursor" pointer-events="none"/><g pointer-events="none"><rect x="'+(cursor-31)+'" y="83" width="62" height="36" rx="7" fill="#123a43"/><text x="'+cursor+'" y="98" text-anchor="middle" class="cursor-label">'+selectedYear+'</text><text x="'+cursor+'" y="111" text-anchor="middle" class="cursor-small">'+(selectedYear===currentYear?'TODAY':'SELECTED')+'</text></g>';
  const legend = presentationSeries.map(series => '<span data-series="'+series.id+'"><i style="--series-color:'+series.color+'"></i>'+e(series.label)+'</span>').join('');
  const scenarios = selectedYear >= 2026 ? '<div class="scenario-strip"><span>Scenarios to 2030</span>'+presentationScenarios.filter(item=>item.year<=2030).map(item=>'<span><b>'+item.year+'</b> '+e(item.label)+'</span>').join('')+'</div>' : '';
  const index = '<details class="point-index"><summary>Milestones</summary><div class="point-index-list">'+renderMilestoneLinks(cutoff)+'</div></details>';
  return '<section id="overview" class="overview" aria-labelledby="overview-title"><div class="section-title"><h2 id="overview-title">AI in Medicine <span>1950–2030</span></h2></div><div class="overview-legend">'+legend+'</div><div class="overview-scroll" tabindex="0" role="region" aria-label="Timeline from 1950 to 2030."><svg viewBox="0 0 1200 380" role="group" aria-label="Timeline from 1950 to 2030. Select milestones for sources. IQ scores and autonomy durations are illustrative.">'+svg+'</svg></div><p class="overview-caption">Illustrative scale. Sources support milestones, not IQ scores. Dotted: medical context. Long dashes: scenarios.</p>'+(includeIndex?index:'')+scenarios+'</section>';
}
