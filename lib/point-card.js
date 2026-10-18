import { escapeHtml as e } from './selectors.js';
import { monitorData } from './monitor-data.js';

export const statusLabel=status=>({confirmed:'Confirmed',reported:'Reported',needs_review:'Under review'}[status]||'Not yet checked');
export function monitorPoint(id){
  for(const track of monitorData.tracks)for(const series of track.series){const point=series.data.find(point=>point.id===id);if(point)return {point,series,track};}
}
function https(url){try{return new URL(url).protocol==='https:';}catch{return false;}}
export function monitorCardData(id){
  const item=monitorPoint(id);if(!item)return null;
  const {point:p,series:s,track:t}=item;
  const unit=t.yAxis?.unit==='%'?'%':' points';
  const retrospective=p.isRetrospective||Boolean(p.publicationDate&&p.modelReleaseDate&&p.publicationDate.slice(0,7)>p.modelReleaseDate.slice(0,7));
  const condition=typeof p.setup==='string'?p.setup:p.setup?Object.entries(p.setup).map(([k,v])=>k+': '+v).join('; '):'Not yet checked';
  return {retrospective,title:p.model,subtitle:s.benchmarkName.split(' (')[0],value:String(p.value)+unit,status:p.validation?.status,
    release:p.modelReleaseDate||'Not yet checked',publication:p.publicationDate||'Not yet checked',evaluation:p.evaluationDate||'Not reported',
    what:p.explain?.whatWasTested||'Not yet checked',meaning:p.explain?.whatValueMeans||'Not yet checked',
    how:condition+(retrospective?' Older model evaluated later.':''),
    confidence:(p.validation?.status==='confirmed'?'Score confirmed · dates provisional':statusLabel(p.validation?.status))+' · '+({same_protocol:'Same benchmark protocol',qualified:'Comparison needs qualification',different_protocol:'Different protocol',unknown:'Comparability not yet checked'}[p.validation?.comparability]||'Comparability not yet checked'),
    reviewNote:p.validation?.note||'',limit:p.explain?.limitations||t.caveat||'',sources:p.sources||[],why:p.explain?.whyItMatters||'',
    reviewed:p.validation?.reviewedAt||'Not yet checked',reviewer:p.validation?.reviewedBy||'Not yet checked'};
}
export function pointCardHtml(card,{compact=false}={}){
  const sourceLinks=(card.sources||[]).filter(source=>https(source.url)).map(source=>'<a href="'+e(source.url)+'" target="_blank" rel="noopener noreferrer">'+e(source.label||'Original source')+' ↗</a>'+(source.locator?'<small>'+e(source.locator)+'</small>':'')).join('');
  return '<div class="source-card-heading"><span class="validation-badge validation-'+e(card.status||'needs_review')+'">'+e(statusLabel(card.status))+'</span><h2'+(compact?'':' id="detail-title"')+'>'+e(card.title)+'</h2>'+(card.release?'<p class="point-card-date">Available ≈ '+e(card.release)+(card.retrospective?' · tested later':'')+'</p>':'')+'<p>'+e(card.value||'')+' · '+e(card.subtitle||'')+'</p></div>'+
    '<dl class="point-card-sections"><div><dt>What was tested?</dt><dd>'+e(card.what||'Not yet checked')+'</dd></div><div><dt>What does this value mean?</dt><dd>'+e(card.meaning||'Not yet checked')+'</dd></div><div><dt>How was it tested?</dt><dd>'+e(card.how||'Not yet checked')+'</dd></div><div><dt>How sure are we?</dt><dd>'+e(card.confidence||'Not yet checked')+'</dd></div><div><dt>Source</dt><dd class="point-sources">'+(sourceLinks||'<span>Original source link not yet checked.</span>')+'</dd></div></dl>'+
    (!compact?'<details class="technical-details"><summary>Dates & limitations</summary><dl class="detail-list"><div><dt>Model available</dt><dd>'+e(card.release||'Not yet checked')+' · availability proxy</dd></div><div><dt>Evaluated</dt><dd>'+e(card.evaluation||'Not reported')+'</dd></div><div><dt>Published (imported)</dt><dd>'+e(card.publication||'Not yet checked')+'</dd></div><div><dt>Reviewed</dt><dd>'+e(card.reviewed||'Not yet checked')+'</dd></div></dl><p>'+e(card.limit||'')+'</p><p>'+e(card.reviewNote||'')+'</p></details>':'');
}

/** Hover cards stay reachable; clicking a point pins the full accessible dialog. */
export function installPointHover(root,getCard){
  const panel=document.createElement('aside');panel.className='point-hover';panel.hidden=true;panel.setAttribute('aria-label','Point evidence');document.body.append(panel);
  let timer,origin;
  const hide=()=>{clearTimeout(timer);panel.hidden=true;origin=null;};
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(()=>{if(!panel.matches(':hover')&&!panel.contains(document.activeElement))hide();},220);};
  function show(target){const card=getCard(target);if(!card)return;clearTimeout(timer);origin=target;panel.innerHTML='<button class="hover-close" type="button" aria-label="Close preview">×</button>'+pointCardHtml(card,{compact:true});panel.hidden=false;
    const r=target.getBoundingClientRect(),width=Math.min(350,innerWidth-24),below=innerHeight-r.bottom-24,above=r.top-24;panel.style.width=width+'px';panel.style.maxHeight=Math.max(140,Math.max(below,above))+'px';panel.style.left=Math.max(12,Math.min(innerWidth-width-12,r.left+r.width/2-width/2))+'px';panel.style.top=Math.max(12,below>=above?r.bottom+9:r.top-panel.offsetHeight-9)+'px';}
  root.addEventListener('pointerover',event=>{if(event.pointerType!=='mouse'||!matchMedia('(hover:hover)').matches)return;const target=event.target.closest('[data-monitor-point],[data-monitor-cluster],[data-point-id],[data-overview-point],[data-track-milestone]');if(target&&target!==origin)show(target);});
  root.addEventListener('pointerout',event=>{if(origin&&!origin.contains(event.relatedTarget)&&!panel.contains(event.relatedTarget))schedule();});
  root.addEventListener('focusin',event=>{const target=event.target.closest('[data-monitor-point],[data-monitor-cluster],[data-point-id],[data-overview-point],[data-track-milestone]');if(target)show(target);});
  panel.addEventListener('pointerenter',()=>clearTimeout(timer));panel.addEventListener('pointerleave',schedule);panel.addEventListener('focusout',schedule);panel.addEventListener('click',event=>{if(event.target.closest('.hover-close'))hide();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')hide();});window.addEventListener('scroll',hide,{passive:true});root.addEventListener('click',hide);return {hide};
}
