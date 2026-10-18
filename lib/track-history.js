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
export function renderTrackHistory(trackId,cutoff,today,{timelineOnly=false,readingsOnly=false}={}) {
  const entries=visibleTrackMilestones(trackId,cutoff);
  if(!entries.length) return '';
  const width=Math.max(250,Math.min(1116,(globalThis.window?.innerWidth??736)-36));
  const positions=entries.map(item=>22+(historyX(item.date,today)-40)/930*(width-44));
  for(let i=1;i<positions.length;i++)positions[i]=Math.max(positions[i],positions[i-1]+48);
  if(positions.at(-1)>width-22){positions[positions.length-1]=width-22;for(let i=positions.length-2;i>=0;i--)positions[i]=Math.min(positions[i],positions[i+1]-48);}
  const dots=entries.map((item,i)=>'<g role="button" tabindex="0" class="milestone-anchor" data-track-milestone="'+e(item.id)+'" aria-label="'+e(item.date.slice(0,4)+' · '+item.shortTitle+' · Open study')+'"><title>'+e(item.shortTitle)+'</title><rect x="'+(positions[i]-22)+'" y="0" width="44" height="44" fill="transparent"/><circle cx="'+positions[i]+'" cy="14" r="5"/><text x="'+positions[i]+'" y="39" text-anchor="middle">'+item.date.slice(0,4)+'</text></g>').join('');
  return '<section class="track-milestones" aria-label="Milestones">'+(readingsOnly?'':'<h4 class="milestone-heading">Milestones</h4><svg class="milestone-timeline" viewBox="0 0 '+width+' 44" role="group" aria-label="Publication timeline. Marker height does not indicate performance. Milestone spacing is adjusted for touch targets."><line x1="22" x2="'+(width-22)+'" y1="14" y2="14"/>'+dots+'</svg>')+(timelineOnly?'':'<div class="milestone-readings">'+entries.map(item=>'<article class="milestone-reading"><time datetime="'+e(item.date)+'">'+item.date.slice(0,4)+'</time><button type="button" data-track-milestone="'+e(item.id)+'">'+e(item.shortTitle)+' ↗</button><p class="milestone-result">'+e(item.result)+'</p></article>').join('')+'</div>')+'</section>';
}
