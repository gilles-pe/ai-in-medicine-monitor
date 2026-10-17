import { presentationSeries } from '../data/presentation-chart.js';
import { historyEvents, presentationScenarios } from '../data/history.js';
import { pointEvidence } from '../data/point-evidence.js';
import { escapeHtml as e } from './selectors.js';

const x = year => 68 + (year - 1950) / 80 * 1030;
const y = index => 417 - (index - 45) / 135 * 350;
const path = points => points.map((point,index) => (index ? 'L' : 'M') + x(point.year).toFixed(2) + ',' + y(point.index).toFixed(2)).join(' ');
export function visibleHistory(cutoff) {
  return historyEvents.filter(event => event.date ? event.date <= cutoff : event.year <= Number(cutoff.slice(0,4)));
}
export function visibleAnchors(cutoff) {
  return pointEvidence.filter(point => point.date ? point.date <= cutoff : point.year <= Number(cutoff.slice(0,4)));
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
export function renderOverview(cutoff, today) {
  const selectedYear = Math.min(2030,Number(cutoff.slice(0,4)));
  const currentYear = Number(today.slice(0,4));
  const asOfYear = Math.min(2026.999,fractionalYear(today));
  const selectedTime = Math.min(2030,fractionalYear(cutoff));
  const events = visibleHistory(cutoff);
  const anchors = visibleAnchors(cutoff);
  let svg = '<defs><clipPath id="overview-clip"><rect x="60" y="50" width="1046" height="376"/></clipPath></defs>';
  svg += '<rect x="' + x(asOfYear) + '" y="50" width="' + (x(2030)-x(asOfYear)) + '" height="370" fill="#e9e8e180"/>';
  for (const value of [50,70,85,100,115,130,145,160,175]) svg += '<line x1="68" x2="1098" y1="'+y(value)+'" y2="'+y(value)+'" class="overview-grid"/><text x="53" y="'+(y(value)+4)+'" text-anchor="end" class="overview-tick">'+value+'</text>';
  for (const year of [1950,1960,1970,1980,1990,2000,2010,2020,2026,2030]) svg += '<line x1="'+x(year)+'" x2="'+x(year)+'" y1="50" y2="420" class="overview-grid"/><text x="'+x(year)+'" y="443" text-anchor="middle" class="overview-tick">'+year+'</text>';
  svg += '<text x="68" y="25" class="overview-axis-title">IQ zur Verdeutlichung</text><text x="1105" y="25" text-anchor="end" class="overview-axis-title">Autonomie: Software-Aufgaben</text>';
  svg += '<text x="90" y="72" class="overview-zone">SCHEMATISCHE EINORDNUNG</text><text x="'+(x(asOfYear)+10)+'" y="72" class="overview-zone">SZENARIEN</text>';
  // Presentation context only. No source validates these illustrative heights.
  for (const [label,seconds] of [['1 Sek.',1],['1 Min.',60],['1 Std.',3600],['1 Tag',86400],['1 Jahr',31536000]]) {
    const index = 48 + Math.log10(seconds)/Math.log10(31536000)*132;
    svg += '<text x="1110" y="'+(y(index)+4)+'" class="overview-tick overview-right-tick">'+label+'</text>';
  }
  for (const series of presentationSeries) {
    const adjusted = displayPoints(series,asOfYear);
    const observed = clipIllustration(adjusted.filter(point => point.year <= asOfYear), Math.min(asOfYear,selectedTime));
    const future = adjusted.filter(point => point.year >= asOfYear && point.year <= 2030);
    svg += '<g clip-path="url(#overview-clip)" style="color:'+series.color+'">';
    if (observed.length) svg += '<path d="'+path(observed)+'" class="overview-line'+(series.id === 'autonomy' ? ' autonomy-line' : '')+'"/>';
    if (selectedYear >= 2026 && future.length > 1) svg += '<path d="'+path(future)+'" class="overview-line scenario-line"/>';
    // Only evidence anchors are dots. Interpolation and future scenarios get no dots.
    for (const point of anchors.filter(point=>point.seriesId===series.id)) {
      const label = point.year + ' · ' + point.label + ' · Quelle öffnen';
      const year = point.date ? fractionalYear(point.date) : point.year;
      svg += '<g class="overview-point" role="button" tabindex="0" data-overview-point="'+e(point.id)+'" aria-label="'+e(label)+'"><title>'+e(label)+'</title><circle class="anchor-hit" cx="'+x(year)+'" cy="'+y(illustrationPosition(series.id,year,asOfYear))+'" r="10" fill="transparent"/><circle class="anchor-dot" cx="'+x(year)+'" cy="'+y(illustrationPosition(series.id,year,asOfYear))+'" r="4" fill="currentColor" stroke="#fffdf8" stroke-width="1.4"/></g>';
    }
    svg += '</g>';
  }
  const cursor = x(Math.max(1950,selectedTime));
  svg += '<line x1="'+cursor+'" x2="'+cursor+'" y1="42" y2="422" class="overview-cursor" pointer-events="none"/><g pointer-events="none"><rect x="'+(cursor-31)+'" y="83" width="62" height="36" rx="7" fill="#123a43"/><text x="'+cursor+'" y="98" text-anchor="middle" class="cursor-label">'+selectedYear+'</text><text x="'+cursor+'" y="111" text-anchor="middle" class="cursor-small">'+(selectedYear===currentYear?'HEUTE':'AUSWAHL')+'</text></g>';
  const legend = presentationSeries.map(series => '<span><i style="background:'+series.color+'"></i>'+e(series.label)+'</span>').join('');
  const highlights = events.filter(event => event.id.startsWith('alphafold')).map(event => '<button type="button" data-history-id="'+event.id+'"><span>'+event.year+'</span> '+e(event.label)+' <span aria-hidden="true">↗</span></button>').join('');
  const scenarios = selectedYear >= 2026 ? '<div class="scenario-strip"><span>Szenarien bis 2030</span>'+presentationScenarios.filter(item=>item.year<=2030).map(item=>'<span><b>'+item.year+'</b> '+e(item.label)+'</span>').join('')+'</div>' : '';
  const index = '<details class="point-index"><summary>Alle '+anchors.length+' belegten Punkte öffnen</summary><div class="point-index-list">'+anchors.map(point=>'<button type="button" data-overview-point="'+e(point.id)+'">'+point.year+' · '+e(point.label)+'</button>').join('')+'</div></details>';
  return '<section class="overview" aria-labelledby="overview-title"><div class="section-title"><h2 id="overview-title">KI & Medizin <span>1950–2030</span></h2><p>Fähigkeiten, Autonomie und Meilensteine</p></div><div class="landmark-highlights" aria-label="AlphaFold-Meilensteine">'+highlights+'</div><div class="overview-legend">'+legend+'</div><div class="overview-scroll" tabindex="0" role="region" aria-label="Zeitverlauf von 1950 bis 2030, horizontal verschiebbar"><svg viewBox="0 0 1200 470" role="group" aria-label="Zeitverlauf 1950 bis 2030. Schematische Kurven mit belegten Meilensteinen. Punkte öffnen Quellen. IQ-Höhen und Autonomiezeiten sind illustrativ.">'+svg+'</svg></div><p class="overview-caption">Kurven aus der PPT: schematische Einordnung, keine Messreihe. Jeder Punkt öffnet einen belegten Meilenstein; die Quelle belegt keinen IQ-Wert. Gestrichelt: Szenarien, keine Prognosen. METR betrifft Software-Aufgaben; die rechte Skala ist illustrativ. Auf schmalen Bildschirmen lässt sich die Grafik seitlich verschieben.</p>'+index+scenarios+'</section>';
}
