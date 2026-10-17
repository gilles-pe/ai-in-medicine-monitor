import { presentationSeries } from '../data/presentation-chart.js';
import { historyEvents, presentationScenarios } from '../data/history.js';
import { escapeHtml as e } from './selectors.js';

const x = year => 68 + (year - 1950) / 85 * 1030;
const y = index => 417 - (index - 45) / 135 * 350;
const path = points => points.map((point,index) => (index ? 'L' : 'M') + x(point.year).toFixed(2) + ',' + y(point.index).toFixed(2)).join(' ');

export function visibleHistory(cutoff) {
  return historyEvents.filter(event => event.date ? event.date <= cutoff : event.year <= Number(cutoff.slice(0,4)));
}

export function clipIllustration(points, year) {
  const selected = points.filter(point => point.year <= year);
  const next = points.find(point => point.year > year);
  const last = selected.at(-1);
  if (next && last && last.year < year) selected.push({year,index:last.index + (next.index - last.index) * (year-last.year)/(next.year-last.year)});
  return selected;
}

export function renderOverview(cutoff, today) {
  const selectedYear = Number(cutoff.slice(0,4));
  const currentYear = Number(today.slice(0,4));
  const events = visibleHistory(cutoff);
  let svg = '<defs><clipPath id="overview-clip"><rect x="68" y="50" width="1030" height="370"/></clipPath></defs>';
  svg += '<rect x="' + x(2026) + '" y="50" width="' + (x(2035)-x(2026)) + '" height="370" fill="#e9e8e180"/>';
  for (const value of [50,70,85,100,115,130,145,160,175]) svg += '<line x1="68" x2="1098" y1="'+y(value)+'" y2="'+y(value)+'" class="overview-grid"/><text x="53" y="'+(y(value)+4)+'" text-anchor="end" class="overview-tick">'+value+'</text>';
  for (const year of [1950,1960,1970,1980,1990,2000,2010,2020,2026,2030,2035]) svg += '<line x1="'+x(year)+'" x2="'+x(year)+'" y1="50" y2="420" class="overview-grid"/><text x="'+x(year)+'" y="443" text-anchor="middle" class="overview-tick">'+year+'</text>';
  svg += '<text x="68" y="25" class="overview-axis-title">Illustrativer Fähigkeitsindex · kein IQ-Test</text><text x="1105" y="25" text-anchor="end" class="overview-axis-title">Autonomie: Software-Aufgaben</text>';
  svg += '<text x="90" y="72" class="overview-zone">SCHEMATISCHE EINORDNUNG</text><text x="'+(x(2026)+10)+'" y="72" class="overview-zone">SZENARIEN</text>';
  // Right-hand scale is copied as context from the presentation, not medical hours.
  for (const [label,seconds] of [['1 Sek.',1],['1 Min.',60],['1 Std.',3600],['1 Tag',86400],['1 Jahr',31536000]]) {
    const index = 48 + Math.log10(seconds)/Math.log10(31536000)*132;
    svg += '<text x="1110" y="'+(y(index)+4)+'" class="overview-tick overview-right-tick">'+label+'</text>';
  }
  for (const series of presentationSeries) {
    const observed = clipIllustration(series.points.filter(point => point.year <= 2026), Math.min(2026,selectedYear));
    const future = series.points.filter(point => point.year >= 2026);
    svg += '<g clip-path="url(#overview-clip)" style="color:'+series.color+'">';
    if (observed.length) svg += '<path d="'+path(observed)+'" class="overview-line'+(series.id === 'autonomy' ? ' autonomy-line' : '')+'"/>';
    if (selectedYear >= 2026 && future.length > 1) svg += '<path d="'+path(future)+'" class="overview-line scenario-line"/>';
    for (const point of observed) svg += '<circle cx="'+x(point.year)+'" cy="'+y(point.index)+'" r="3.5" fill="currentColor"/>';
    svg += '</g>';
  }
  const cursor = x(Math.min(2035,Math.max(1950,selectedYear)));
  svg += '<line x1="'+cursor+'" x2="'+cursor+'" y1="42" y2="422" class="overview-cursor"/><rect x="'+(cursor-31)+'" y="83" width="62" height="36" rx="7" fill="#123a43"/><text x="'+cursor+'" y="98" text-anchor="middle" class="cursor-label">'+selectedYear+'</text><text x="'+cursor+'" y="111" text-anchor="middle" class="cursor-small">'+(selectedYear===currentYear?'HEUTE':'AUSWAHL')+'</text>';
  svg += '<text x="68" y="480" class="overview-axis-title">MEILENSTEINE DER MEDIZIN UND KI</text>';
  events.forEach((event,index) => {
    const row = event.year < 2010 ? 0 : index-2;
    const yy = 506 + Math.max(0,row)*23;
    const xx = Math.min(990,x(event.year));
    svg += '<line x1="'+x(event.year)+'" x2="'+xx+'" y1="451" y2="'+(yy-12)+'" stroke="#cad2cd"/><circle cx="'+x(event.year)+'" cy="453" r="3" fill="#209b8e"/><text x="'+xx+'" y="'+yy+'" text-anchor="middle" class="overview-event-label">'+event.year+' '+e(event.label)+'</text>';
  });
  const legend = presentationSeries.map(series => '<span><i style="background:'+series.color+'"></i>'+e(series.label)+(series.id==='autonomy'?' (PPT)':'')+'</span>').join('');
  const highlights = events.filter(event => event.id.startsWith('alphafold')).map(event => '<button type="button" data-history-id="'+event.id+'"><span>'+event.year+'</span> '+e(event.label)+' <span aria-hidden="true">↗</span></button>').join('');
  const scenarios = selectedYear >= 2026 ? '<div class="scenario-strip"><span>Szenarien aus der PPT</span>'+presentationScenarios.map(item=>'<span><b>'+item.year+'</b> '+e(item.label)+'</span>').join('')+'</div>' : '';
  return '<section class="overview" aria-labelledby="overview-title"><div class="section-title"><h2 id="overview-title">KI & Medizin <span>1950–2035</span></h2><p>Fähigkeiten, Autonomie und Meilensteine</p></div><div class="landmark-highlights" aria-label="AlphaFold-Meilensteine">'+highlights+'</div><div class="overview-legend">'+legend+'</div><div class="overview-scroll" tabindex="0" role="region" aria-label="Zeitverlauf von 1950 bis 2035, horizontal verschiebbar"><svg viewBox="0 0 1200 640" role="img" aria-label="Zeitverlauf 1950 bis 2035 aus der PowerPoint. Schematische Kurven, AlphaFold-Meilensteine und gestrichelte Zukunftsszenarien. Keine gemessene IQ- oder medizinische Autonomieskala.">'+svg+'</svg></div><p class="overview-caption">Kurven aus der PPT: schematische Einordnung, keine Messreihe. Gestrichelt: Szenarien, keine Prognosen. METR betrifft Software-Aufgaben. Auf schmalen Bildschirmen lässt sich die Grafik seitlich verschieben.</p>'+scenarios+'</section>';
}
