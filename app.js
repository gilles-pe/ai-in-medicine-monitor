import { feedbackUrl } from './lib/navigation.js';
import { applyLanguage, getLanguage, setLanguage, preferredLanguage, translateText } from './lib/i18n.js';
import { monitorData } from './lib/monitor-data.js';
import { buildTrackSeries } from './lib/monitor-series.js';
import { renderMonitorChart, renderMonitorDetails } from './lib/monitor-chart.js';
import { monitorCardData, monitorPoint, editorialCard, pointCardHtml, installPointHover } from './lib/point-card.js';
import { downloadMonitorPackage } from './lib/monitor-export.js';
import { exportChart, copyChartLink } from './lib/chart-export.js';
import { tracks, measurements, sourceCatalog, editorialStatus, studies } from './data/evidence.js';
import { trackMilestones, trustContext } from './data/track-milestones.js';
import { renderTrackHistory, visibleTrackMilestones } from './lib/track-history.js';
import { renderOverview, visibleHistory, visibleAnchors } from './lib/overview.js';
import { filterMeasurements, latestByModel, escapeHtml as e } from './lib/selectors.js';

const $=selector=>document.querySelector(selector);
const content=$('#content'),dialog=$('#detail-dialog'),timeControls=$('#time-controls');
let preferenceStorage;try{preferenceStorage=window.localStorage;}catch{}
setLanguage(preferredLanguage(location.search,preferenceStorage));
document.documentElement.lang=getLanguage();
const today=new Date().toISOString().slice(0,10);
const sharedCutoff=new URLSearchParams(location.search).get('cutoff');
const initialCutoff=/^\d{4}-\d{2}-\d{2}$/.test(sharedCutoff||'')&&Number.isFinite(Date.parse(sharedCutoff+'T00:00:00Z'))&&new Date(sharedCutoff+'T00:00:00Z').toISOString().slice(0,10)===sharedCutoff&&sharedCutoff>='1950-01-01'&&sharedCutoff<='2030-12-31'?sharedCutoff:today;
const state={cutoff:initialCutoff,model:'',playing:false,presentation:false};
const dates=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
const numbers=new Intl.NumberFormat('en-GB',{maximumFractionDigits:2});
const date=value=>dates.format(new Date(value+'T00:00:00Z'));
const score=row=>numbers.format(row.score)+(tracks.find(track=>track.id===row.trackId).unit==='%'?'%':' pts');
const system=row=>row.trackId==='assistance'?row.system:row.model;
let timer;
function rows(){return filterMeasurements(measurements,{cutoff:state.cutoff}).filter(row=>!state.model||row.model===state.model);}
function announce(text){$('#live-status').textContent=text;}
function highlightCard(id){
  content.querySelectorAll('.is-selected').forEach(el=>{el.classList.remove('is-selected');el.removeAttribute('aria-current');});
  if(!id)return;
  const attrs=['data-monitor-point','data-monitor-cluster','data-point-id','data-overview-point','data-overview-cluster','data-track-milestone','data-study-id','data-history-id','data-observation-id'];
  content.querySelectorAll(attrs.map(a=>'['+a+']').join(',')).forEach(el=>{
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
function showOverviewCluster(ids){
  const points=visibleAnchors(state.cutoff).filter(item=>ids.split(',').includes(item.id));if(!points.length)return;
  stop();$('#detail-body').innerHTML=clusterHeading(points[0].year+' · Studies')+'<div class="point-index-list">'+points.map(item=>'<button type="button" data-overview-point="'+e(item.id)+'">'+e(item.label)+'</button>').join('')+'</div>';dialog.showModal();
}
function renderPreviews(allRows){
  return '<section id="charts" class="benchmark-previews" aria-label="Charts"><div class="thumbnail-grid">'+tracks.map(track=>'<a class="chart-thumbnail" href="#chart-'+track.id+'" style="--track:'+track.color+'"><span class="thumbnail-title">'+e(track.label)+' <span aria-hidden="true">↘</span></span>'+renderMonitorChart(track,state.cutoff,{preview:true,model:state.model})+'<span class="thumbnail-meta">Provisional timeline</span></a>').join('')+'</div></section>';
}
function showMonitorPoint(id){
  const item=monitorPoint(id);if(!item)return;
  const visible=buildTrackSeries(item.track.trackId,state.cutoff).series.some(series=>[...series.points,...series.undated].some(point=>point.id===id));if(visible)showEditorialCard(id);
}
function showMonitorCluster(ids){
  const cards=ids.split(',').map(id=>({id,card:monitorCardData(id)})).filter(item=>item.card);if(!cards.length)return;
  stop();hover?.hide();$('#detail-body').innerHTML=clusterHeading('Choose a result')+'<div class="point-cluster-list">'+cards.map(({id,card})=>'<button type="button" data-monitor-point="'+e(id)+'"><span>'+e(card.title)+'</span><span>'+e(card.finding.headline)+' · '+e(card.status==='confirmed'?'Score confirmed · dates provisional':card.status==='reported'?'Reported':'Under review')+'</span></button>').join('')+'</div>';if(!dialog.open)dialog.showModal();highlightCard(cards[0].id);
}
function renderResults(track,selected){
  if(!selected.length)return '<p class="empty-state">No results for this selection.</p>';
  return '<details class="benchmark-details"><summary>Benchmark results · '+selected.length+'</summary><div class="benchmark-table">'+latestByModel(selected).map(row=>'<button class="result-row" type="button" data-point-id="'+e(row.id)+'" aria-label="'+e(system(row)+', '+score(row)+', source')+'"><span class="result-name">'+e(system(row))+'</span><span class="result-score">'+e(score(row))+' ↗</span></button>').join('')+'</div></details>';
}
function chartTools(id){return '<div class="chart-tools"><button type="button" data-chart-copy="'+id+'">Copy link</button><button type="button" data-chart-export="'+id+'">Save image ↓</button></div>';}
function renderTrack(track,index,allRows){
  const selected=allRows.filter(row=>row.trackId===track.id);
  const imported=buildTrackSeries(track.id,state.cutoff);
  const subtitle=imported.track.question;
  const next=tracks[index+1];
  return '<section class="track" id="chart-'+track.id+'" data-track="'+track.id+'" tabindex="-1" aria-labelledby="track-'+track.id+'" style="--track:'+track.color+'"><div class="track-top"><h2 id="track-'+track.id+'">'+e(track.label)+'</h2><a href="#charts" class="back-link">↑ Charts</a></div>'+renderMonitorChart(track,state.cutoff,{model:state.model})+renderTrackHistory(track.id,state.cutoff,today,{timelineOnly:true})+'<details class="track-details"><summary>Details <span>Provisional timeline</span></summary>'+renderMonitorDetails(track,state.cutoff)+chartTools('chart-'+track.id)+renderResults(track,selected)+renderTrackHistory(track.id,state.cutoff,today,{readingsOnly:true})+(track.id==='assistance'&&trustContext.date<=state.cutoff?'<button class="trust-link text-button" data-track-milestone="nov-trust-2023" type="button">Trust study · 2023 ↗</button>':'')+'</details><div class="track-navigation">'+(next?'<a href="#chart-'+next.id+'">'+e(next.label)+' ↓</a>':'<a href="#charts">↑ Charts</a>')+'</div></section>';
}
function render(){
  const allRows=rows();
  const available=studies.filter(item=>item.date<=state.cutoff);
  timeControls.remove();
  content.innerHTML=renderOverview(state.cutoff,today)+'<div id="timeline-slot"></div>'+renderPreviews(allRows)+'<div class="detail-charts">'+tracks.map((track,index)=>renderTrack(track,index,allRows)).join('')+'</div><details class="study-library"><summary>Studies</summary><div class="study-rows">'+available.map(item=>'<button type="button" data-study-id="'+item.id+'"><time>'+item.date.slice(0,4)+'</time><span>'+e(item.title)+'</span><span aria-hidden="true">↗</span></button>').join('')+'</div></details>';
  $('#timeline-slot').append(timeControls);
  content.querySelector('.overview .section-title').insertAdjacentHTML('beforeend',chartTools('overview'));
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
  const copy=event.target.closest('[data-chart-copy]');
  if(copy){try{announce(await copyChartLink(copy.dataset.chartCopy,state.cutoff));copy.textContent='Copied';setTimeout(()=>{if(copy.isConnected)copy.textContent='Copy link';},1800);}catch{announce('Could not copy link. Use the address bar.');}return;}
  const download=event.target.closest('[data-chart-export]');
  if(download){const section=document.getElementById(download.dataset.chartExport),svg=section?.querySelector('svg.monitor-chart-svg')||section?.querySelector('svg');if(!svg)return;download.disabled=true;try{announce(await exportChart(svg,{title:section.querySelector('h2')?.textContent||'AI in Medicine',cutoff:state.cutoff,filename:download.dataset.chartExport+'.png',note:download.dataset.chartExport==='overview'?'Illustrative scale. Sources support milestones, not IQ scores. https://ai-in-medicine-monitor.gillesp.chatgpt.site':'Best eligible score within each benchmark. Model release months are approximate availability proxies; older models were tested later. Unvalidated records do not form a confirmed line.'}));}catch{announce('Image export failed. Please try again.');}finally{download.disabled=false;}return;}

  for(const [attribute,handler] of [['data-monitor-cluster',showMonitorCluster],['data-monitor-point',showMonitorPoint],['data-overview-cluster',showOverviewCluster],['data-overview-point',showOverviewPoint],['data-history-id',showHistory],['data-track-milestone',showTrackMilestone],['data-point-id',showMeasurement],['data-study-id',showStudy]]){
    const target=event.target.closest('['+attribute+']');if(target){handler(target.getAttribute(attribute));return;}
  }
}
content.addEventListener('click',action);
content.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)&&event.target.closest('svg [role="button"]')){event.preventDefault();action(event);}});
$('#detail-body').addEventListener('click',action);
dialog.addEventListener('click',event=>{if(event.target.closest('[data-card-close]'))dialog.close();});
dialog.addEventListener('close',()=>highlightCard(null));
$('#model-filter').innerHTML='<option value="">All models</option>'+[...new Set([...measurements.map(row=>row.model),...monitorData.tracks.flatMap(track=>track.series.flatMap(series=>series.data.map(point=>point.model)))])].sort().map(model=>'<option>'+e(model)+'</option>').join('');
$('#model-filter').addEventListener('change',event=>{stop();state.model=event.target.value;render();});
$('#cutoff-date').addEventListener('change',event=>cutoff(event.target.value));
$('#time-slider').addEventListener('input',event=>cutoff((1950+Number(event.target.value))+'-12-31'));
$('#today-button').addEventListener('click',()=>cutoff(today));
$('#play-button').addEventListener('click',play);
$('#present-button').addEventListener('click',present);
$('#export-button').addEventListener('click',exportData);
$('#editorial-check').textContent='Last reviewed '+date(monitorData.meta.lastReviewedAt);
$('#package-export-button').addEventListener('click',async event=>{const button=event.currentTarget;button.disabled=true;try{announce(await downloadMonitorPackage());}catch(error){announce('Package export failed: '+error.message);}finally{button.disabled=false;}});
// Old view hashes now lead to the single-page overview.
if(['#verlauf','#anwendungen','#studien','#quellen'].includes(location.hash))history.replaceState(null,'','#top');
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!dialog.open){stop();if(state.presentation)present();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
sync();render();
if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({block:'start'}));

function hoverCard(target){
  const id=target.dataset.monitorPoint||target.dataset.pointId||target.dataset.overviewPoint||target.dataset.trackMilestone||target.dataset.studyId||target.dataset.historyId;
  return editorialCard(id);
}
const hover=installPointHover(content,hoverCard,{onOpen:(id)=>{if(!dialog.open)highlightCard(id);},onClose:()=>{if(!dialog.open)highlightCard(null);}});
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{hover.hide();render();},150);});

// UI language changes preserve the active chart, cutoff, model and open details.
function chooseLanguage(value,persist=true){
  setLanguage(value);document.documentElement.lang=getLanguage();
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
