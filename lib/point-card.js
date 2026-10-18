import { escapeHtml as e } from './selectors.js';
import { monitorData } from './monitor-data.js';

export const statusLabel=status=>({confirmed:'Confirmed',reported:'Reported',needs_review:'Under review'}[status]||'Not yet checked');
export function monitorPoint(id){
  for(const track of monitorData.tracks)for(const series of track.series){const point=series.data.find(point=>point.id===id);if(point)return {point,series,track};}
}
/** @returns {(import('../types/editorial-card.js').EditorialCard & {status:string,value:string}) | null} */
export function editorialCard(id){
  const registry=/** @type {Record<string,import('../types/editorial-card.js').EditorialCard>} */ (/** @type {unknown} */ (monitorData.editorialCards));
  const card=registry[id];if(!card)return null;
  return {...card,id,status:card.validation?.status,value:card.finding?.value==null?'':String(card.finding.value)+(card.finding.unit==='%'?'%':' '+(card.finding.unit||''))};
}
function https(url){try{return new URL(url).protocol==='https:';}catch{return false;}}
export function monitorCardData(id){return editorialCard(id);}
/** @param {import('../types/editorial-card.js').EditorialCard['badge']} badge */
function badgeLabel(badge){
  const label={peer_reviewed:'Peer-reviewed',preprint:'Preprint',historical_event:'Historical event',benchmark_suite:'Benchmark suite',official_report:'Official report',vendor_report:'Supplier report',unverified:'Unverified record'}[badge.kind]||'Evidence record';
  return [label,badge.year].filter(Boolean).join(' · ');
}
/** @param {import('../types/editorial-card.js').EditorialCard} card */
export function pointCardHtml(card,{compact=false}={}){
  const seen=new Set();
  const sourceLinks=(card.sources||[]).filter(source=>https(source.url)&&!seen.has(source.url)&&seen.add(source.url)).map(source=>'<div class="card-reference"><a data-i18n-ignore href="'+e(source.url)+'" target="_blank" rel="noopener noreferrer"'+(source.locator?' title="'+e(source.locator)+'"':'')+'>'+e(source.title||source.label||'Original source')+' ↗</a>'+(source.journal_citation?'<small data-i18n-ignore>'+e(source.journal_citation)+'</small>':'')+'</div>').join('');
  const comparability={qualified:'Comparison qualified',different_protocol:'Different protocol; not connected',unknown:'Comparability not established'}[card.validation?.comparability];
  const status=[statusLabel(card.validation?.status),card.validation?.scoreStatus==='confirmed'?'Score verified; setup pending':comparability].filter(Boolean).join(' · ');
  const tags=(card.tags||[]).filter(Boolean).join(' · ');
  return '<article class="editorial-evidence-card" data-card-id="'+e(card.id||'')+'"><div class="card-topbar"><span class="semantic-badge">'+e(badgeLabel(card.badge))+'</span><button '+(compact?'class="card-close hover-close"':'id="close-dialog" class="card-close" data-card-close')+' type="button" aria-label="Close card">×</button></div>'+
    '<h2'+(compact?'':' id="detail-title"')+'>'+e(card.title)+'</h2>'+(tags?'<p class="card-tags">'+e(tags)+'</p>':'')+
    '<div class="card-key-finding"><span class="card-micro-label">KEY FINDING</span><p><strong>'+e(card.finding?.headline||'Result not established')+'</strong></p><p>'+e(card.finding?.explanation||'')+'</p></div>'+
    '<dl class="point-card-sections"><div><dt>SETUP &amp; COHORT</dt><dd>'+e(card.setup||'Not yet checked')+'</dd></div><div class="card-limitations"><dt>LIMITATIONS &amp; VALIDITY</dt><dd>'+e(card.limitations||'Not yet checked')+'</dd><dd class="card-validation validation-'+e(card.validation?.status||'needs_review')+'">'+e(status)+'</dd></div></dl>'+
    (card.timeline_note?'<p class="card-timeline-note">'+e(card.timeline_note)+'</p>':'')+
    '<footer class="point-sources">'+(sourceLinks||'<span>Original source not yet verified.</span>')+'</footer></article>';
}

/** Hover previews share the same evidence content as pinned tap/keyboard cards.
 * @param {HTMLElement} root
 * @param {(target: Element, event?: Event) => import('../types/editorial-card.js').EditorialCard | null} getCard
 * @param {{onOpen?: (id: string, target: Element) => void, onClose?: () => void}} options
 */
export function installPointHover(root,getCard,{onOpen=()=>{},onClose=()=>{}}={}){
  const panel=document.createElement('aside');panel.className='point-hover';panel.hidden=true;panel.setAttribute('aria-label','Point evidence');document.body.append(panel);
  let timer,origin,cardId;
  const hide=()=>{clearTimeout(timer);panel.hidden=true;origin=null;cardId=null;onClose();};
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(()=>{if(!panel.matches(':hover')&&!panel.contains(document.activeElement))hide();},220);};
  function show(target,event){const card=getCard(target,event);if(!card)return;clearTimeout(timer);if(origin===target&&cardId===card.id&&!panel.hidden)return;origin=target;cardId=card.id;panel.innerHTML=pointCardHtml(card,{compact:true});panel.hidden=false;onOpen(card.id,target);
    const r=target.getBoundingClientRect(),width=Math.min(370,innerWidth-24),below=innerHeight-r.bottom-24,above=r.top-24;panel.style.width=width+'px';panel.style.maxHeight=Math.max(140,Math.max(below,above))+'px';panel.style.left=Math.max(12,Math.min(innerWidth-width-12,r.left+r.width/2-width/2))+'px';panel.style.top=Math.max(12,below>=above?r.bottom+9:r.top-panel.offsetHeight-9)+'px';}
  const selector='[data-observation-id],[data-monitor-cluster],[data-monitor-point],[data-point-id],[data-overview-point],[data-track-milestone],[data-study-id],[data-history-id]';
  root.addEventListener('pointerover',event=>{if(event.pointerType!=='mouse'||!matchMedia('(hover:hover)').matches)return;const target=(/** @type {Element} */ (event.target)).closest(selector);if(target&&target!==origin)show(target,event);});
  root.addEventListener('pointermove',event=>{if(event.pointerType==='mouse'&&origin?.matches('.monitor-point-hit')&&origin.contains(event.target))show(origin,event);});
  root.addEventListener('pointerout',event=>{if(origin&&!origin.contains(/** @type {Node} */ (event.relatedTarget))&&!panel.contains(/** @type {Node} */ (event.relatedTarget)))schedule();});
  root.addEventListener('focusin',event=>{if(!matchMedia('(hover:hover)').matches)return;const target=(/** @type {Element} */ (event.target)).closest(selector);if(target)show(target,event);});
  panel.addEventListener('pointerenter',()=>clearTimeout(timer));panel.addEventListener('pointerleave',schedule);panel.addEventListener('focusout',schedule);panel.addEventListener('click',event=>{if((/** @type {Element} */ (event.target)).closest('.hover-close'))hide();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')hide();});window.addEventListener('scroll',()=>{if(origin&&(origin.matches(':hover')||panel.matches(':hover')))return;hide();},{passive:true});root.addEventListener('click',hide);return {hide};
}
