import { trackMilestones } from '../data/track-milestones.js';
import { escapeHtml as e } from './selectors.js';
export function visibleTrackMilestones(trackId,cutoff) {
  return trackMilestones.filter(item=>item.trackId===trackId && item.date<=cutoff).sort((a,b)=>a.date.localeCompare(b.date));
}
export function historyX(date,endDate) {
  const first = Date.parse('2022-01-01T00:00:00Z');
  const last = Math.max(first+86400000,Date.parse(endDate+'T00:00:00Z'));
  return 40+930*Math.max(0,Math.min(1,(Date.parse(date+'T00:00:00Z')-first)/(last-first)));
}
export function renderTrackHistory(trackId,cutoff,today) {
  const entries=visibleTrackMilestones(trackId,cutoff);
  if(!entries.length) return '';
  const dots=entries.map(item=>'<g role="button" tabindex="0" class="milestone-anchor" data-track-milestone="'+e(item.id)+'" aria-label="'+e(item.date.slice(0,4)+' · '+item.shortTitle+' · Studie öffnen')+'"><title>'+e(item.shortTitle)+'</title><circle cx="'+historyX(item.date,today)+'" cy="16" r="6"/><text x="'+historyX(item.date,today)+'" y="42" text-anchor="middle">'+item.date.slice(0,4)+'</text></g>').join('');
  return '<section class="track-milestones" aria-label="Historische Meilensteine"><h4 class="milestone-heading">MEILENSTEINE · PUBLIKATIONEN AB 2022</h4><svg class="milestone-timeline" viewBox="0 0 1000 50" role="group" aria-label="Veröffentlichungen auf der Zeitachse. Markerhöhe ohne Leistungsbedeutung."><line x1="40" x2="970" y1="16" y2="16"/>'+dots+'</svg><div class="milestone-readings">'+entries.map(item=>'<article class="milestone-reading"><time datetime="'+e(item.date)+'">'+item.date.slice(0,4)+'</time><button type="button" data-track-milestone="'+e(item.id)+'">'+e(item.shortTitle)+' ↗</button><p class="milestone-result">'+e(item.result)+'</p><p>'+e(item.note)+'</p></article>').join('')+'</div></section>';
}
