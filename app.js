import { feedbackUrl } from './lib/navigation.js';
import { renderNewsSidebar } from './lib/news.js';
import { applyLanguage, getLanguage, setLanguage, preferredLanguage, translateText } from './lib/i18n.js';
import { monitorData } from './lib/monitor-data.js';
import { buildTrackSeries } from './lib/monitor-series.js';
import { renderTrackContext } from './lib/track-context.js';
import { renderMonitorChart } from './lib/monitor-chart.js';
import { monitorCardData, monitorPoint, editorialCard, pointCardHtml, installPointHover } from './lib/point-card.js';
import { downloadMonitorPackage } from './lib/monitor-export.js';
import { tracks, measurements, sourceCatalog, editorialStatus, studies } from './data/evidence.js';
import { trackMilestones, trustContext } from './data/track-milestones.js';
import { renderOverview, renderMilestoneLinks, visibleHistory, visibleAnchors } from './lib/overview.js';
import { filterMeasurements, latestByModel, escapeHtml as e } from './lib/selectors.js';

const $=selector=>document.querySelector(selector);
const shell=$('#top'),content=$('#content'),dialog=$('#detail-dialog');
let preferenceStorage;try{preferenceStorage=window.localStorage;}catch{}
setLanguage(preferredLanguage(location.search,preferenceStorage));
document.documentElement.lang=getLanguage();
const today=new Date().toISOString().slice(0,10);
const sharedCutoff=new URLSearchParams(location.search).get('cutoff');
const initialCutoff=/^\d{4}-\d{2}-\d{2}$/.test(sharedCutoff||'')&&Number.isFinite(Date.parse(sharedCutoff+'T00:00:00Z'))&&new Date(sharedCutoff+'T00:00:00Z').toISOString().slice(0,10)===sharedCutoff&&sharedCutoff>='1950-01-01'&&sharedCutoff<='2030-12-31'?sharedCutoff:today;
const state={cutoff:initialCutoff,model:'',playing:false,presentation:false,zoomedChart:null,seriesView:{}};
const dates=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
const numbers=new Intl.NumberFormat('en-GB',{maximumFractionDigits:2});
const date=value=>dates.format(new Date(value+'T00:00:00Z'));
const score=row=>numbers.format(row.score)+(tracks.find(track=>track.id===row.trackId).unit==='%'?'%':' pts');
const system=row=>row.trackId==='assistance'?row.system:row.model;
let timer;
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
  stop();hover?.hide();$('#detail-body').innerHTML=pointCardHtml(card);if(!dialog.open)dialog.showModal();highlightCard(id);
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
  stop();hover?.hide();
  const controls=cards.length>1?'<div class="card-selection" role="group" aria-label="Results">'+cards.map((card,i)=>'<button type="button" data-card-choice="'+i+'" aria-pressed="'+(i===selected)+'">'+e(card.title)+'</button>').join('')+'</div>':'';
  dialog.dataset.cardIds=cards.map(c=>c.id).join(',');
  $('#detail-body').innerHTML=controls+pointCardHtml(cards[selected]);if(!dialog.open)dialog.showModal();highlightCard(cards[selected].id);
}
function showOverviewCluster(ids){const visible=new Set(visibleAnchors(state.cutoff).map(p=>p.id));showCardSelection(ids.split(',').filter(id=>visible.has(id)));}
function renderPreviews(allRows){
  const links=(monitorData.extensions.navigation.relatedLinks||[]).map(link=>'<a href="'+e(link.url)+'" target="_blank" rel="noopener noreferrer">'+e(link.title)+' <span data-i18n-ignore>· '+e(link.publisher)+'</span> <span aria-hidden="true">↗</span></a>').join('');
  const related=links?'<nav class="related-resources" aria-label="Related"><span>Related</span><span aria-hidden="true">·</span>'+links+'</nav>':'';
  return '<section id="charts" class="benchmark-previews" aria-label="Charts"><div class="thumbnail-grid">'+tracks.map(track=>'<a class="chart-thumbnail" href="#chart-'+track.id+'" style="--track:'+track.color+'"><span class="thumbnail-title">'+e(track.label)+' <span aria-hidden="true">↘</span></span>'+renderMonitorChart(track,state.cutoff,{preview:true,model:state.model})+'</a>').join('')+'</div>'+related+'</section>';
}
function showMonitorPoint(id){
  const item=monitorPoint(id);if(!item||item.point.validation.status!=='confirmed')return;
  const visible=buildTrackSeries(item.track.trackId,state.cutoff).series.some(series=>[...series.points,...series.undated].some(point=>point.id===id));if(visible)showEditorialCard(id);
}
function showMonitorCluster(ids){showCardSelection(ids.split(',').filter(id=>monitorPoint(id)?.point.validation.status==='confirmed'));}
function zoomButtonHtml(target,label){
  const active=state.zoomedChart===target;
  const icon=active?'<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>':'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>';
  return '<button type="button" class="chart-zoom-button" data-chart-zoom="'+e(target)+'" aria-label="'+(active?'Exit full view':'Expand '+e(label+' chart'))+'" aria-pressed="'+active+'" title="'+(active?'Close full view':'Expand chart')+'"><svg viewBox="0 0 24 24" aria-hidden="true">'+icon+'</svg></button>';
}
function syncZoomState(){
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
    btn.setAttribute('title',active?'Close full view':'Expand chart');
    btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+(active?'<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>':'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>')+'</svg>';
  });
}
function toggleChartZoom(target){
  hover?.hide();
  state.zoomedChart=state.zoomedChart===target?null:target;
  syncZoomState();
}
function renderTrack(track,index){
  const trackData=buildTrackSeries(track.id,state.cutoff);
  const series=trackData.series;
  const selected=state.seriesView[track.id]||'all';
  const selector=series.length>1?'<select class="series-selector" data-series-view="'+track.id+'" aria-label="'+e(track.label+' benchmark view')+'"><option value="all"'+(selected==='all'?' selected':'')+'>Both</option>'+series.map(s=>'<option value="'+e(s.seriesId)+'"'+(selected===s.seriesId?' selected':'')+'>'+e(s.shortLabel||s.benchmarkName.split(' (')[0].split(' · ')[0])+'</option>').join('')+'</select>':'';
  const marks=trackMilestones.filter(p=>p.trackId===track.id&&p.date<=state.cutoff);
  const stories='<div class="chart-stories" aria-label="Milestones">'+marks.map(p=>'<button type="button" data-track-milestone="'+e(p.id)+'"><time>'+p.date.slice(0,4)+'</time><span>'+e(p.shortTitle)+'</span></button>').join('')+'</div>';
  return '<section class="track" id="chart-'+track.id+'" data-track="'+track.id+'" tabindex="-1" aria-labelledby="track-'+track.id+'" style="--track:'+track.color+'"><div class="track-top"><h2 id="track-'+track.id+'">'+e(track.label)+'</h2><div class="track-actions">'+selector+zoomButtonHtml(track.id,track.label)+'</div></div><p class="track-description">'+e(trackData.track.readingGuide.description)+'</p><div class="track-visual">'+stories+renderMonitorChart(track,state.cutoff,{model:state.model,seriesView:selected})+'</div>'+renderTrackContext(track.id,state.cutoff,{model:state.model,seriesView:selected})+'</section>';
}
function render(){
  $('#overview-slot').innerHTML=renderOverview(state.cutoff,today,{includeIndex:false});
  $('#milestone-list').innerHTML=renderMilestoneLinks(state.cutoff);
  $('#previews-slot').innerHTML=renderPreviews(rows());
  $('#tracks-slot').innerHTML=tracks.map(renderTrack).join('');
  $('#study-list').innerHTML=studies.filter(p=>p.date<=state.cutoff).map(p=>'<button type="button" data-study-id="'+p.id+'"><time>'+p.date.slice(0,4)+'</time><span>'+e(p.title)+'</span><span aria-hidden="true">↗</span></button>').join('');
  syncZoomState();
}
function sync(){
  $('#cutoff-date').value=state.cutoff;
  $('#time-slider').value=String(Math.max(0,Math.min(80,Number(state.cutoff.slice(0,4))-1950)));
  $('#time-slider').setAttribute('aria-valuetext',state.cutoff.slice(0,4));
}
function cutoff(value,user=true){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(value+'T00:00:00Z'))||new Date(value+'T00:00:00Z').toISOString().slice(0,10)!==value){sync();return;}
  if(user)stop();state.cutoff=value<'1950-01-01'?'1950-01-01':value>'2030-12-31'?'2030-12-31':value;sync();render();
}
function stop(){if(timer)clearInterval(timer);timer=null;state.playing=false;$('#play-button').textContent='▶';$('#play-button').setAttribute('aria-label','Play timeline');$('#play-button').setAttribute('aria-pressed','false');}
function play(){
  if(state.playing){stop();return;}
  if(Number($('#time-slider').value)>=80)cutoff('1950-01-01',false);
  state.playing=true;$('#play-button').textContent='Ⅱ';$('#play-button').setAttribute('aria-label','Pause timeline');$('#play-button').setAttribute('aria-pressed','true');
  timer=setInterval(()=>{const year=1950+Number($('#time-slider').value)+1;cutoff(year+'-12-31',false);if(year>=2030)stop();},1100);
}
function present(){state.presentation=!state.presentation;document.body.classList.toggle('presentation-mode',state.presentation);$('#present-button').textContent=state.presentation?'× Exit presentation':'▷ Present';$('#present-button').setAttribute('aria-pressed',String(state.presentation));}
function exportData(){
  const results=rows(),overviewPoints=visibleAnchors(state.cutoff),historicalTrackMilestones=[...trackMilestones,trustContext].filter(item=>item.date<=state.cutoff);
  const selectedStudies=studies.filter(item=>item.date<=state.cutoff).map(({presentationSlides,...item})=>item);
  const historicalEvents=visibleHistory(state.cutoff);
  const ids=new Set([...results,...overviewPoints,...historicalTrackMilestones,...selectedStudies,...historicalEvents].map(item=>item.sourceId));
  const payload={title:monitorData.meta.title,cutoff:state.cutoff,model:state.model,exportedAt:new Date().toISOString(),measurements:results,monitorData,selection:{cutoff:state.cutoff,model:state.model,language:getLanguage()},overviewPoints,historicalTrackMilestones,studies:selectedStudies,historicalEvents,scaleNote:'Illustrative overview. Lower charts show benchmark-specific frontiers by provisional model availability; publication cutoffs apply.',sourceCatalog:sourceCatalog.filter(item=>ids.has(item.id)),editorialStatus};
  const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='ai-in-medicine-'+state.cutoff+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('Data exported.');
}
async function action(event){
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
content.addEventListener('change',event=>{if(event.target.matches('[data-series-view]')){state.seriesView[event.target.dataset.seriesView]=event.target.value;render();}});
shell.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)&&event.target.closest('svg [role="button"]')){event.preventDefault();action(event);}});
$('#detail-body').addEventListener('click',action);
dialog.addEventListener('click',event=>{if(event.target.closest('[data-card-close]'))dialog.close();});
dialog.addEventListener('close',()=>{hover.hide();highlightCard(null);});
$('#model-filter').innerHTML='<option value="">All models</option>'+[...new Set([...monitorData.tracks.flatMap(track=>track.series.flatMap(series=>series.data.filter(p=>p.validation.status==='confirmed').map(point=>point.model)))])].sort().map(model=>'<option>'+e(model)+'</option>').join('');
$('#model-filter').addEventListener('change',event=>{stop();state.model=event.target.value;render();});
$('#cutoff-date').addEventListener('change',event=>cutoff(event.target.value));
$('#time-slider').addEventListener('input',event=>cutoff((1950+Number(event.target.value))+'-12-31'));
$('#today-button').addEventListener('click',()=>cutoff(today));
$('#play-button').addEventListener('click',play);
$('#present-button').addEventListener('click',()=>{present();closeMenu();});
$('#export-button')?.addEventListener('click',exportData);
$('#editorial-check').textContent='Last reviewed '+date(monitorData.meta.lastReviewedAt);
$('#package-export-button')?.addEventListener('click',async event=>{const button=event.currentTarget;button.disabled=true;try{announce(await downloadMonitorPackage());}catch(error){announce('Package export failed: '+error.message);}finally{button.disabled=false;}});
// Old view hashes now lead to the single-page overview.
if(['#verlauf','#anwendungen','#studien','#quellen'].includes(location.hash))history.replaceState(null,'','#top');
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!dialog.open){stop();if(state.zoomedChart){toggleChartZoom(null);return;}if(state.presentation)present();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
sync();render();
if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({block:'start'}));

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
const feedbackDialog=$('#feedback-dialog');
$('#feedback-button').addEventListener('click',()=>{stop();hover.hide();closeMenu();feedbackDialog.showModal();});
$('#feedback-close').addEventListener('click',()=>feedbackDialog.close());
feedbackDialog.addEventListener('close',()=>menuButton.focus());
$('#feedback-form').addEventListener('submit',event=>{event.preventDefault();const body=$('#feedback-text').value.trim();if(!body)return;window.location.href=feedbackUrl(body,monitorData.meta.title,monitorData.extensions.navigation.feedbackEmail);});
chooseLanguage(getLanguage(),false);
// All freshly rendered chart labels, cards, hover previews and announcements use
// the selected dictionary. Original research titles and model names stay intact.
const languageObserver=new MutationObserver(()=>applyLanguage(document));
languageObserver.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder','aria-valuetext']});
