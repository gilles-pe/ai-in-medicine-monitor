import {buildTrackSeries,dateInfo} from './monitor-series.js';
import {monitorData} from './monitor-data.js';
import {escapeHtml as e} from './selectors.js';
const number=value=>Number(Number(value).toFixed(2)).toString();

/** One selected finding, never an across-benchmark maximum or invented comparison. */
export function trackContext(trackId,cutoff,{seriesView='all',model=''}={}){
  const result=buildTrackSeries(trackId,cutoff);
  const start=dateInfo(monitorData.meta.xAxisRange.start).monthIndex,end=dateInfo(monitorData.meta.xAxisRange.end).monthIndex;
  const series=result.series.filter(s=>seriesView==='all'||s.seriesId===seriesView);
  const choices=series.map(s=>{
    const points=s.points.filter(p=>p.validation.status==='confirmed'&&p.releaseDate.monthIndex>=start&&p.releaseDate.monthIndex<=end&&(!model||p.model===model));
    const eligible=points.filter(p=>p.eligible),pool=eligible.length?eligible:points;
    const point=[...pool].sort((a,b)=>b.value-a.value||b.releaseDate.monthIndex-a.releaseDate.monthIndex||String(a.id).localeCompare(String(b.id)))[0];
    const reference=point?.eligible?[...eligible].sort((a,b)=>a.releaseDate.monthIndex-b.releaseDate.monthIndex||String(a.id).localeCompare(String(b.id))).find(p=>p.id!==point.id&&p.value<point.value):null;
    return {series:s,point,reference};
  });
  return {guide:result.track.readingGuide,series,unit:result.track.yAxis.unit,selection:choices.filter(c=>c.point).at(-1)||null};
}
export function renderTrackContext(trackId,cutoff,options={}){
  const {guide,series,unit,selection}=trackContext(trackId,cutoff,options);
  const score=p=>number(p.value)+(unit==='%'?'%':' points');
  const tests=series.map(s=>'<span>'+e(s.readingGuide.label)+': '+e(s.readingGuide.test)+'</span>').join(' · ');
  const finding=selection?'<button class="track-result-link" type="button" data-monitor-point="'+e(selection.point.id)+'" aria-label="'+e('Selected result: '+selection.series.readingGuide.label+', '+selection.point.model+', '+score(selection.point))+ '"><strong>'+e(selection.series.readingGuide.label)+': '+e(score(selection.point))+'</strong><span>'+e(selection.point.model)+(selection.reference?' · vs. '+e(score(selection.reference))+' ('+e(selection.reference.model)+')':'')+'</span></button>':'<p class="track-no-result">No published result for this selection.</p>';
  return '<div class="track-context"><p class="track-test-summary">'+tests+' · <span class="track-metric">'+e(guide.metric)+'</span></p>'+finding+'<p class="track-reading-key"><span><i class="reading-line" aria-hidden="true"></i>Lines: best comparable result to date</span><span><i class="reading-dot" aria-hidden="true"></i>Dots: other models</span></p><p class="track-reality">'+e(guide.limitation)+(series.length>1?' Different tests; scores are not directly comparable.':'')+(selection&&!selection.point.eligible?' No comparable trend established for this series.':'')+'</p></div>';
}
