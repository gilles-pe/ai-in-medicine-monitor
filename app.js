import {exportChart} from './lib/chart-export.js';
import { feedbackUrl } from './lib/navigation.js';
import { nearbyEvidenceIds } from './lib/chart-interactions.js';
import { renderNewsSidebar } from './lib/news.js';
import { applyLanguage, getLanguage, setLanguage, preferredLanguage, translateText } from './lib/i18n.js';
import { monitorData } from './lib/monitor-data.js';
import { buildTrackSeries } from './lib/monitor-series.js';
import { monitorCardData, monitorPoint, editorialCard, pointCardHtml, installPointHover } from './lib/point-card.js';
import { downloadMonitorPackage } from './lib/monitor-export.js';
import { tracks, measurements, sourceCatalog, editorialStatus, studies } from './data/evidence.js';
import { trackMilestones, trustContext } from './data/track-milestones.js';
import { renderOverview, renderMilestoneLinks, renderOverviewMilestoneStrip, visibleHistory, visibleAnchors } from './lib/overview.js';
import { renderPreviewSection, renderStudyButtons, renderTrackSection, renderSourceIndex, resetAbbreviations } from './lib/published-page.js';
import { reviewedMarkup } from './lib/site-meta.js';
import { filterOptions } from './lib/evidence-classification.js';
import { filterMeasurements, latestByModel, escapeHtml as e } from './lib/selectors.js';

const $=selector=>document.querySelector(selector);
const shell=$('#top'),content=$('#content'),dialog=$('#detail-dialog');
let preferenceStorage;try{preferenceStorage=window.localStorage;}catch{}
setLanguage(preferredLanguage(location.search,preferenceStorage));
document.documentElement.lang=getLanguage();
const today=new Date().toISOString().slice(0,10);
const sharedCutoff=new URLSearchParams(location.search).get('cutoff');
const initialCutoff=/^\d{4}-\d{2}-\d{2}$/.test(sharedCutoff||'')&&Number.isFinite(Date.parse(sharedCutoff+'T00:00:00Z'))&&new Date(sharedCutoff+'T00:00:00Z').toISOString().slice(0,10)===sharedCutoff&&sharedCutoff>='1950-01-01'&&sharedCutoff<='2030-12-31'?sharedCutoff:today;
const state={cutoff:initialCutoff,model:'',zoomedChart:null,ranges:{}};
const dates=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
const numbers=new Intl.NumberFormat('en-GB',{maximumFractionDigits:2});
const date=value=>dates.format(new Date(value+'T00:00:00Z'));
const score=row=>numbers.format(row.score)+(tracks.find(track=>track.id===row.trackId).unit==='%'?'%':' pts');
const system=row=>row.trackId==='assistance'?row.system:row.model;

const introViewport=window.matchMedia('(min-width: 861px)');
const introduction=$('.about-monitor');
introduction.open=introViewport.matches;
introViewport.addEventListener('change',event=>{introduction.open=event.matches;});
function rows(){return filterMeasurements(measurements,{cutoff:state.cutoff}).filter(row=>!state.model||row.model===state.model);}
function announce(text){$('#live-status').textContent=text;}
function highlightCard(id){
  shell.querySelectorAll('.is-selected').forEach(el=>{el.classList.remove('is-selected');el.removeAttribute('aria-current');});
  if(!id)return;
  const attrs=['data-monitor-point','data-monitor-cluster','data-point-id','data-overview-point','data-overview-cluster','data-track-milestone','data-study-id','data-history-id','data-observation-id'];
  shell.querySelectorAll(attrs.map(a=>'['+a+']').join(',')).forEach(el=>{
    if(attrs.some(a=>(el.getAttribute(a)||'').split(',').includes(id))){el.classList.add('is-selected');if(el.matches('button,[role="button"]'))el.setAttribute('aria-current','true');if(el.closest('.milestone-reading'))el.closest('.milestone-reading').classList.add('is-selected');}
  });
}
function showEditorialCard(id){
  const card=editorialCard(id);if(!card)return;
  hover?.hide();$('#detail-body').innerHTML=pointCardHtml(card);if(!dialog.open)dialog.showModal();highlightCard(id);
}
function showMeasurement(id){if(rows().some(item=>item.id===id))showEditorialCard(id);}
function showTrackMilestone(id){if([...trackMilestones,trustContext].some(item=>item.id===id&&item.date<=state.cutoff))showEditorialCard(id);}
function showStudy(id){if(studies.some(item=>item.id===id&&item.date<=state.cutoff))showEditorialCard(id);}
function showHistory(id){if(visibleHistory(state.cutoff).some(item=>item.id===id))showEditorialCard(id);}
function showOverviewPoint(id){if(visibleAnchors(state.cutoff).some(item=>item.id===id))showEditorialCard(id);}
function clusterHeading(title){return '<div class="card-topbar"><h2 id="detail-title" class="dialog-title">'+e(title)+'</h2><button id="close-dialog" class="card-close" data-card-close type="button" aria-label="Close card">×</button></div>';}
function showCardSelection(ids,index=0){
  const cards=ids.map(editorialCard).filter(Boolean);if(!cards.length)return;
  const selected=Math.max(0,Math.min(index,cards.length-1));
  hover?.hide();
  const controls=cards.length>1?'<div class="card-selection" role="group" aria-label="Results">'+cards.map((card,i)=>'<button type="button" data-card-choice="'+i+'" aria-pressed="'+(i===selected)+'">'+e(card.title)+'</button>').join('')+'</div>':'';
  dialog.dataset.cardIds=cards.map(c=>c.id).join(',');
  $('#detail-body').innerHTML=controls+pointCardHtml(cards[selected]);if(!dialog.open)dialog.showModal();highlightCard(cards[selected].id);
}
function showOverviewCluster(ids){const visible=new Set(visibleAnchors(state.cutoff).map(p=>p.id));showCardSelection(ids.split(',').filter(id=>visible.has(id)));}
function renderPreviews(){
  return renderPreviewSection(state.cutoff, state.model);
}
function showMonitorPoint(id){
  const item=monitorPoint(id);if(!item||item.point.validation.status!=='confirmed')return;
  const visible=buildTrackSeries(item.track.trackId,state.cutoff).series.some(series=>[...series.points,...series.undated].some(point=>point.id===id));if(visible)showEditorialCard(id);
}
function showMonitorCluster(ids){showCardSelection(ids.split(',').filter(id=>monitorPoint(id)?.point.validation.status==='confirmed'));}
function syncZoomState(){
  shell.querySelectorAll('.chart-download').forEach(el=>el.remove());
  if(state.zoomedChart){const target=state.zoomedChart==='overview'?$('#overview'):$('#chart-'+state.zoomedChart);const button=document.createElement('button');button.type='button';button.className='chart-download';button.textContent='Download PNG';button.dataset.chartDownload=state.zoomedChart;target?.querySelector('.track-actions,.section-title')?.append(button);}
  document.querySelectorAll('.is-zoomed').forEach(el=>el.classList.remove('is-zoomed'));
  document.body.classList.toggle('has-zoomed-chart',Boolean(state.zoomedChart));
  let backdrop=$('#chart-zoom-backdrop');
  if(state.zoomedChart){
    if(!backdrop){backdrop=document.createElement('div');backdrop.id='chart-zoom-backdrop';backdrop.className='chart-zoom-backdrop';backdrop.addEventListener('click',()=>toggleChartZoom(null));document.body.append(backdrop);}
    const targetEl=state.zoomedChart==='overview'?$('#overview'):$('#chart-'+state.zoomedChart);
    targetEl?.classList.add('is-zoomed');
  }else if(backdrop){
    backdrop.remove();
  }
  shell.querySelectorAll('[data-chart-zoom]').forEach(btn=>{
    const active=btn.dataset.chartZoom===state.zoomedChart;
    btn.setAttribute('aria-pressed',String(active));
    btn.setAttribute('aria-label',active?'Exit full view':'Expand '+(btn.dataset.chartZoom==='overview'?'AI in Medicine 1950–2030':tracks.find(track=>track.id===btn.dataset.chartZoom)?.label||'')+' chart');
    btn.setAttribute('title',active?'Close full view':'Expand chart');
    btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+(active?'<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>':'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>')+'</svg>';
  });
}
function toggleChartZoom(target){
  hover?.hide();
  const previous=state.zoomedChart;
  state.zoomedChart=state.zoomedChart===target?null:target;
  syncZoomState();
  shell.querySelector('[data-chart-zoom="'+(state.zoomedChart||previous)+'"]')?.focus({preventScroll:true});
}
function renderTrack(track){
  return renderTrackSection(track, state.cutoff, {model:state.model, zoomed:state.zoomedChart===track.id,range:state.ranges[track.id]||'all'});
}
function applyEvidenceFilters(){
  const topic=$('#evidence-topic-filter')?.value||'all',setting=$('#evidence-setting-filter')?.value||'all',only=$('#evidence-milestone-only')?.checked||false;
  shell.querySelectorAll('.chart-stories [data-evidence-topic]').forEach(button=>{
    button.hidden=(topic!=='all'&&button.dataset.evidenceTopic!==topic)||(setting!=='all'&&button.dataset.evidenceSetting!==setting)||(only&&button.dataset.evidenceMilestone!=='true');
  });
}
document.addEventListener('change',event=>{if(event.target.closest('#evidence-filter-bar'))applyEvidenceFilters();});
function render(){
  resetAbbreviations();
  if(!$('#evidence-filter-bar'))$('#tracks-slot').insertAdjacentHTML('beforebegin',filterOptions());
  const openSources=[...shell.querySelectorAll('.section-sources[open]')].map(el=>el.id);
  $('#overview-slot').innerHTML=renderOverview(state.cutoff,today,{includeIndex:false,range:state.ranges.overview||'all'});
  if($('#milestone-list'))$('#milestone-list').innerHTML=renderMilestoneLinks(state.cutoff);
  $('#previews-slot').innerHTML=renderPreviews();
  $('#tracks-slot').innerHTML=tracks.map(renderTrack).join('');
  openSources.forEach(id=>{const panel=document.getElementById(id);if(panel)panel.open=true;});
  applyEvidenceFilters();
  if($('#study-list'))$('#study-list').innerHTML=renderStudyButtons(state.cutoff);
  const sourceIndex=$('#source-index');
  if(sourceIndex) sourceIndex.innerHTML=renderSourceIndex(state.cutoff);
  syncZoomState();
  markSection();
}
function exportData(){
  const results=rows(),overviewPoints=visibleAnchors(state.cutoff),historicalTrackMilestones=[...trackMilestones,trustContext].filter(item=>item.date<=state.cutoff);
  const selectedStudies=studies.filter(item=>item.date<=state.cutoff).map(({presentationSlides,...item})=>item);
  const historicalEvents=visibleHistory(state.cutoff);
  const ids=new Set([...results,...overviewPoints,...historicalTrackMilestones,...selectedStudies,...historicalEvents].map(item=>item.sourceId));
  const payload={title:monitorData.meta.title,cutoff:state.cutoff,model:state.model,exportedAt:new Date().toISOString(),measurements:results,monitorData,selection:{cutoff:state.cutoff,model:state.model,language:getLanguage()},overviewPoints,historicalTrackMilestones,studies:selectedStudies,historicalEvents,scaleNote:'Illustrative overview. Lower charts show benchmark-specific frontiers by provisional model availability; publication cutoffs apply.',sourceCatalog:sourceCatalog.filter(item=>ids.has(item.id)),editorialStatus};
  const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='ai-in-medicine-'+state.cutoff+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('Data exported.');
}
async function action(event){
  const rangeButton=event.target.closest('[data-chart-range]');if(rangeButton){hover?.hide();state.ranges[rangeButton.dataset.rangeChart]=rangeButton.dataset.chartRange;render();shell.querySelector('[data-range-chart="'+rangeButton.dataset.rangeChart+'"][data-chart-range="'+rangeButton.dataset.chartRange+'"]')?.focus({preventScroll:true});return;}
  const download=event.target.closest('[data-chart-download]');if(download){const chart=download.closest('.overview,.track'),svg=chart.querySelector('.overview-scroll svg,.monitor-chart-svg');download.disabled=true;try{announce(await exportChart(svg,{title:chart.querySelector('h2').textContent,cutoff:state.cutoff,filename:'ai-medicine-'+download.dataset.chartDownload+'.png',note:chart.querySelector('.chart-takeaway').textContent}));}catch(error){announce('Image export failed: '+error.message);}finally{download.disabled=false;}return;}
  if(event.type==='click'&&Date.now()<suppressOverviewClickUntil&&event.target.closest('#overview .overview-scroll svg'))return;
  const zoom=event.target.closest('[data-chart-zoom]');
  if(zoom){toggleChartZoom(zoom.dataset.chartZoom);return;}
  const hit=event.target.closest('.monitor-point-hit');
  if(hit&&event.type==='click'&&event.pointerType==='mouse'){const card=hoverCard(hit,event);if(card){if(hit.dataset.monitorCluster){const ids=hit.dataset.monitorCluster.split(',');showCardSelection(ids,Math.max(0,ids.indexOf(card.id)));}else showMonitorPoint(card.id);return;}}
  const choice=event.target.closest('[data-card-choice]');
  if(choice){showCardSelection((dialog.dataset.cardIds||'').split(','),Number(choice.dataset.cardChoice));return;}
  for(const [attribute,handler] of [['data-monitor-cluster',showMonitorCluster],['data-monitor-point',showMonitorPoint],['data-observation-id',showMonitorPoint],['data-overview-cluster',showOverviewCluster],['data-overview-point',showOverviewPoint],['data-history-id',showHistory],['data-track-milestone',showTrackMilestone],['data-point-id',showMeasurement],['data-study-id',showStudy]]){
    const target=event.target.closest('['+attribute+']');if(target){handler(target.getAttribute(attribute));return;}
  }
}
shell.addEventListener('click',action);
shell.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)&&event.target.closest('svg [role="button"]')){event.preventDefault();action(event);}});
let lastScrubYear=null,touchScrub=null,suppressOverviewClickUntil=0;
function updateOverviewCursor(svgX,yearText,statusText){
  const line=$('#overview-cursor-line'),box=$('#overview-cursor-box'),yr=$('#overview-cursor-year'),st=$('#overview-cursor-status');
  if(!line||!box||!yr||!st)return;
  line.setAttribute('x1',svgX);line.setAttribute('x2',svgX);
  box.setAttribute('x',svgX-31);
  yr.setAttribute('x',svgX);yr.textContent=yearText;
  st.setAttribute('x',svgX);st.textContent=statusText;
}
function scrubOverviewAtClientX(svg,clientX){
  const rect=svg.getBoundingClientRect();
  if(!rect.width)return;
  const rawX=(clientX-rect.left)/rect.width*1200;
  const clampedX=Math.max(68,Math.min(1098,rawX));
  const a=Number(svg.dataset.rangeStart||1950),b=Number(svg.dataset.rangeEnd||2030);const hoverYear=Math.round(a+(clampedX-68)/1030*(b-a));
  const currentYear=Number(today.slice(0,4));
  updateOverviewCursor(clampedX,String(hoverYear),hoverYear===currentYear?'TODAY':hoverYear>currentYear?'SCENARIO':'YEAR');
  if(hoverYear!==lastScrubYear){
    lastScrubYear=hoverYear;
    const strip=$('#overview-milestone-strip');
    if(strip){
      const tmp=document.createElement('div');
      tmp.innerHTML=renderOverviewMilestoneStrip(state.cutoff,hoverYear);
      if(tmp.firstElementChild)strip.replaceWith(tmp.firstElementChild);
    }
  }
}
function resetOverviewScrub(){
  lastScrubYear=null;
  const grp=$('#overview-cursor-group');
  if(grp)updateOverviewCursor(Number(grp.dataset.defaultX),grp.dataset.defaultYear,grp.dataset.defaultStatus);
  const strip=$('#overview-milestone-strip');
  if(strip){
    const tmp=document.createElement('div');
    tmp.innerHTML=renderOverviewMilestoneStrip(state.cutoff,Number(state.cutoff.slice(0,4)));
    if(tmp.firstElementChild)strip.replaceWith(tmp.firstElementChild);
  }
}
shell.addEventListener('pointerdown',event=>{
  if(event.pointerType==='mouse')return;
  const svg=event.target.closest('#overview .overview-scroll svg');
  if(!svg)return;
  touchScrub={pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,moved:false,svg};
  scrubOverviewAtClientX(svg,event.clientX);
});
shell.addEventListener('pointermove',event=>{
  if(event.pointerType==='mouse'){
    const svg=event.target.closest('#overview .overview-scroll svg');
    if(svg)scrubOverviewAtClientX(svg,event.clientX);
    return;
  }
  if(!touchScrub||event.pointerId!==touchScrub.pointerId)return;
  const dx=Math.abs(event.clientX-touchScrub.startX),dy=Math.abs(event.clientY-touchScrub.startY);
  if(dx>6&&dx>=dy){
    touchScrub.moved=true;
    scrubOverviewAtClientX(touchScrub.svg,event.clientX);
  }else if(!touchScrub.moved&&dy>10){
    touchScrub=null;
  }
});
shell.addEventListener('pointerup',event=>{
  if(touchScrub&&event.pointerId===touchScrub.pointerId){
    if(touchScrub.moved)suppressOverviewClickUntil=Date.now()+400;
    else{
      const points=[...touchScrub.svg.querySelectorAll('.overview-point')].map(point=>{
        const rect=point.querySelector('.anchor-dot').getBoundingClientRect();
        return {x:rect.left+rect.width/2,y:rect.top+rect.height/2,ids:(point.dataset.overviewCluster||point.dataset.overviewPoint||'').split(',').filter(Boolean)};
      });
      const ids=nearbyEvidenceIds(points,event.clientX,event.clientY);
      if(ids.length){suppressOverviewClickUntil=Date.now()+400;showOverviewCluster(ids.join(','));}
    }
    touchScrub=null;
  }
});
shell.addEventListener('pointercancel',()=>{touchScrub=null;});
shell.addEventListener('pointerleave',event=>{
  if(event.pointerType==='mouse'&&event.target.matches?.('#overview')){
    resetOverviewScrub();
  }
},true);
$('#detail-body').addEventListener('click',action);
dialog.addEventListener('click',event=>{if(event.target.closest('[data-card-close]'))dialog.close();});
dialog.addEventListener('close',()=>{hover.hide();highlightCard(null);});
$('#export-button')?.addEventListener('click',exportData);
$('#editorial-check').innerHTML=reviewedMarkup();
$('#package-export-button')?.addEventListener('click',async event=>{const button=event.currentTarget;button.disabled=true;try{announce(await downloadMonitorPackage());}catch(error){announce('Package export failed: '+error.message);}finally{button.disabled=false;}});
// Old view hashes now lead to the single-page overview.
if(['#verlauf','#anwendungen','#studien','#quellen'].includes(location.hash))history.replaceState(null,'','#top');
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!dialog.open){if(state.zoomedChart){toggleChartZoom(null);return;}}});
document.addEventListener('keydown',event=>{
  if(event.key!=='Tab'||dialog.open)return;
  const scope=!siteMenu.hidden?siteMenu:state.zoomedChart?(state.zoomedChart==='overview'?$('#overview'):$('#chart-'+state.zoomedChart)):null;
  if(!scope)return;
  const elements=[...scope.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),summary,[tabindex="0"]')].filter(el=>el.getClientRects().length&&el.checkVisibility());
  if(scope===siteMenu)elements.unshift(menuButton);
  const first=elements[0],last=elements.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
});

render();
function followLocationHash(){
  const hash=location.hash.slice(1);
  if(!hash)return;
  const target=document.getElementById(hash);
  target?.scrollIntoView({block:'start'});
  if(hash.startsWith('track-milestone-')&&target){
    const id=hash.slice('track-milestone-'.length);
    if(trackMilestones.some(point=>point.id===id))showTrackMilestone(id);
  }
}
if(location.hash)requestAnimationFrame(followLocationHash);
window.addEventListener('hashchange',()=>requestAnimationFrame(followLocationHash));

function hoverCard(target,event){
  let id=target.dataset.observationId||target.dataset.monitorPoint||target.dataset.pointId||target.dataset.overviewPoint||target.dataset.trackMilestone||target.dataset.studyId||target.dataset.historyId;
  if(target.matches('.monitor-point-hit')){
    const ids=(target.dataset.monitorCluster||target.dataset.monitorPoint||'').split(',');
    const box=target.getBoundingClientRect();
    const px=Number.isFinite(event?.clientX)?event.clientX:box.left+box.width/2;
    const py=Number.isFinite(event?.clientY)?event.clientY:box.top+box.height/2;
    const points=[...target.closest('.monitor-chart').querySelectorAll('[data-observation-id]')].filter(p=>ids.includes(p.dataset.observationId));
    const nearest=points.map(p=>{const r=p.getBoundingClientRect();return {id:p.dataset.observationId,d:(r.left+r.width/2-px)**2+(r.top+r.height/2-py)**2};}).sort((a,b)=>a.d-b.d)[0];
    id=nearest?.id||ids[0];
  }
  return editorialCard(id);
}
const hover=installPointHover(shell,hoverCard,{onOpen:(id)=>{if(!dialog.open)highlightCard(id);},onClose:()=>{if(!dialog.open)highlightCard(null);}});
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{hover.hide();render();},150);});

// UI language changes preserve the active chart, cutoff, model and open details.
function chooseLanguage(value,persist=true){
  setLanguage(value);document.documentElement.lang=getLanguage();
  $('#interesting-news').innerHTML=renderNewsSidebar(getLanguage());
  document.querySelectorAll('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===getLanguage())));
  if(persist){try{preferenceStorage?.setItem('digital-health-language',getLanguage());}catch{}const url=new URL(location.href);url.searchParams.set('lang',getLanguage());history.replaceState(null,'',url);}
  applyLanguage(document);
}
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>chooseLanguage(button.dataset.language)));
const menuButton=$('#menu-button'),siteMenu=$('#site-menu');
function closeMenu(returnFocus=false){siteMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu');if(returnFocus)menuButton.focus();}
menuButton.addEventListener('click',()=>{siteMenu.hidden=!siteMenu.hidden;menuButton.setAttribute('aria-expanded',String(!siteMenu.hidden));menuButton.setAttribute('aria-label',siteMenu.hidden?'Open menu':'Close menu');});
document.addEventListener('click',event=>{if(!siteMenu.hidden&&!event.target.closest('#site-menu,#menu-button'))closeMenu();});
siteMenu.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!siteMenu.hidden){event.preventDefault();closeMenu(true);}});
function markSection(){
  const links=[...document.querySelectorAll('#section-nav a[href^="#"]')];
  if(!links.length) return;
  const line=window.scrollY+80;
  let active=links[0];
  for(const link of links){
    const el=document.getElementById(link.getAttribute('href').slice(1));
    if(el&&el.offsetTop<=line) active=link;
  }
  for(const link of links){
    if(link===active) link.setAttribute('aria-current','true');
    else link.removeAttribute('aria-current');
  }
}
document.addEventListener('scroll',()=>markSection(),{passive:true});
const feedbackDialog=$('#feedback-dialog');
$('#feedback-button').addEventListener('click',()=>{hover.hide();closeMenu();feedbackDialog.showModal();});
$('#feedback-close').addEventListener('click',()=>feedbackDialog.close());
feedbackDialog.addEventListener('click',event=>{if(event.target.closest('a'))feedbackDialog.close();});
feedbackDialog.addEventListener('close',()=>menuButton.focus());
chooseLanguage(getLanguage(),false);
// All freshly rendered chart labels, cards, hover previews and announcements use
// the selected dictionary. Original research titles and model names stay intact.
const languageObserver=new MutationObserver(()=>applyLanguage(document));
languageObserver.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder','aria-valuetext']});
document.documentElement.dataset.appState='ready';
