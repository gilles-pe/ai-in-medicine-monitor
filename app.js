import { trendPoints, trendSeries } from './data/trend-series.js';
import { renderTrackChart } from './lib/track-chart.js';
import { exportChart, copyChartLink } from './lib/chart-export.js';
import { tracks, measurements, sourceCatalog, editorialStatus, studies } from './data/evidence.js';
import { trackMilestones, trustContext } from './data/track-milestones.js';
import { renderTrackHistory, visibleTrackMilestones } from './lib/track-history.js';
import { renderOverview, visibleHistory, visibleAnchors } from './lib/overview.js';
import { filterMeasurements, latestByModel, escapeHtml as e } from './lib/selectors.js';

const $=selector=>document.querySelector(selector);
const content=$('#content'),dialog=$('#detail-dialog'),timeControls=$('#time-controls');
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
function sourceLink(id){
  const source=sourceCatalog.find(item=>item.id===id);
  if(!source)return '';
  let url;try{url=new URL(source.url);}catch{return '';}
  return url.protocol==='https:'?'<a class="detail-link" href="'+e(url.href)+'" target="_blank" rel="noopener noreferrer">Source ↗</a>':'';
}
function detailRows(pairs){return '<dl class="detail-list">'+pairs.filter(([,value])=>value).map(([name,value])=>'<div><dt>'+e(name)+'</dt><dd>'+e(value)+'</dd></div>').join('')+'</dl>';}
function showDetail(title,kind,finding,limit,sourceId,pairs=[]){
  stop();
  $('#detail-body').innerHTML='<h2 id="detail-title" class="dialog-title">'+e(title)+'</h2>'+(kind?'<p class="detail-kind">'+e(kind)+'</p>':'')+(finding?'<p>'+e(finding)+'</p>':'')+(limit?'<p class="detail-limit">'+e(limit)+'</p>':'')+(pairs.length?'<details class="technical-details"><summary>Details</summary>'+detailRows(pairs)+'</details>':'')+sourceLink(sourceId);
  dialog.showModal();
}
function showMeasurement(id){
  const row=rows().find(item=>item.id===id);if(!row)return;
  showDetail(system(row),row.benchmark,score(row),row.limitations,row.sourceId,[['Published',date(row.date)],['System',row.system],['Protocol',row.setting],['Sample',row.subset],['Location',row.sourceDetail],['Comparison group',row.comparisonGroup]]);
}
function showTrackMilestone(id){
  const item=[...trackMilestones,trustContext].find(item=>item.id===id&&item.date<=state.cutoff);if(!item)return;
  showDetail(item.title,item.kind,item.finding,item.limitations,item.sourceId,[['Published',date(item.date)],['Design',item.design],['Location',item.locator]]);
}
function showStudy(id){
  const item=studies.find(item=>item.id===id&&item.date<=state.cutoff);if(!item)return;
  showDetail(item.title,item.type,item.summary,item.limitations,item.sourceId,[['Published',date(item.date)],['Design',item.design],...item.findings,['Location',item.sourceDetail]]);
}
function showHistory(id){
  const item=visibleHistory(state.cutoff).find(item=>item.id===id);if(!item)return;
  if(item.studyId){showStudy(item.studyId);return;}
  showDetail(item.label,'Milestone · '+item.year,item.summary,item.limit,item.sourceId);
}
function showOverviewPoint(id){
  const item=visibleAnchors(state.cutoff).find(item=>item.id===id);if(!item)return;
  showDetail(item.label,item.kind,item.finding,item.limitations,item.sourceId,[['Published',item.date?date(item.date):String(item.year)],['Location',item.locator],['Scale','Illustrative IQ position; the source supports the milestone, not its height.']]);
}
function showOverviewCluster(ids){
  const points=visibleAnchors(state.cutoff).filter(item=>ids.split(',').includes(item.id));if(!points.length)return;
  stop();$('#detail-body').innerHTML='<h2 id="detail-title" class="dialog-title">'+points[0].year+' · Studies</h2><div class="point-index-list">'+points.map(item=>'<button type="button" data-overview-point="'+e(item.id)+'">'+e(item.label)+'</button>').join('')+'</div>';dialog.showModal();
}
function renderPreviews(allRows){
  return '<section id="charts" class="benchmark-previews" aria-label="Charts"><div class="thumbnail-grid">'+tracks.map(track=>'<a class="chart-thumbnail" href="#chart-'+track.id+'" style="--track:'+track.color+'"><span class="thumbnail-title">'+e(track.label)+' <span aria-hidden="true">↘</span></span>'+renderTrackChart(track,allRows,state.cutoff,{preview:true})+'<span class="thumbnail-meta">Evidence & milestones</span></a>').join('')+'</div></section>';
}
function showTrendPoint(id){
  const item=trendPoints.find(item=>item.id===id&&item.date<=state.cutoff);if(!item)return;
  showDetail(item.title,item.environment==='simulation'?'Simulation':'Benchmark',item.finding,item.limitations,item.sourceId,[['Published',date(item.date)],['Comparison',item.design],['Protocol',item.setting],['Sample',item.subset],['Location',item.locator]]);
}
function renderResults(track,selected){
  if(!selected.length)return '<p class="empty-state">No results for this selection.</p>';
  return '<details class="benchmark-details"><summary>Benchmark results · '+selected.length+'</summary><div class="benchmark-table">'+latestByModel(selected).map(row=>'<button class="result-row" type="button" data-point-id="'+e(row.id)+'" aria-label="'+e(system(row)+', '+score(row)+', source')+'"><span class="result-name">'+e(system(row))+'</span><span class="result-score">'+e(score(row))+' ↗</span></button>').join('')+'</div></details>';
}
function chartTools(id){return '<div class="chart-tools"><button type="button" data-chart-copy="'+id+'">Copy link</button><button type="button" data-chart-export="'+id+'">Save image ↓</button></div>';}
function renderTrack(track,index,allRows){
  const selected=allRows.filter(row=>row.trackId===track.id);
  const subtitle='Published comparisons · '+(track.id==='autonomy'?'simulation':'benchmark')+' · not a time trend';
  const next=tracks[index+1];
  return '<section class="track" id="chart-'+track.id+'" data-track="'+track.id+'" tabindex="-1" aria-labelledby="track-'+track.id+'" style="--track:'+track.color+'"><div class="track-top"><h2 id="track-'+track.id+'">'+e(track.label)+'</h2><a href="#charts" class="back-link">↑ Charts</a></div><p class="track-subtitle">'+subtitle+'</p>'+chartTools('chart-'+track.id)+renderTrackChart(track,allRows,state.cutoff)+renderResults(track,selected)+renderTrackHistory(track.id,state.cutoff,today)+(track.id==='assistance'&&trustContext.date<=state.cutoff?'<button class="trust-link text-button" data-track-milestone="nov-trust-2023" type="button">Trust study · 2023 ↗</button>':'')+'<div class="track-navigation">'+(next?'<a href="#chart-'+next.id+'">'+e(next.label)+' ↓</a>':'<a href="#charts">↑ Charts</a>')+'</div></section>';
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
if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({block:'start'}));
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
  const selectedTrends=trendSeries.filter(item=>item.date<=state.cutoff);
  const ids=new Set([...selectedTrends,...results,...overviewPoints,...historicalTrackMilestones,...selectedStudies,...historicalEvents].map(item=>item.sourceId));
  const payload={title:'AI in Medicine Monitor',cutoff:state.cutoff,model:state.model,exportedAt:new Date().toISOString(),measurements:results,scientificComparisons:selectedTrends,overviewPoints,historicalTrackMilestones,studies:selectedStudies,historicalEvents,scaleNote:'Illustrative overview. Benchmark comparisons are publication snapshots, not a measured time trend.',sourceCatalog:sourceCatalog.filter(item=>ids.has(item.id)),editorialStatus};
  const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='ai-in-medicine-monitor-'+state.cutoff+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('Data exported.');
}
async function action(event){
  const copy=event.target.closest('[data-chart-copy]');
  if(copy){try{announce(await copyChartLink(copy.dataset.chartCopy,state.cutoff));copy.textContent='Copied';setTimeout(()=>{if(copy.isConnected)copy.textContent='Copy link';},1800);}catch{announce('Could not copy link. Use the address bar.');}return;}
  const download=event.target.closest('[data-chart-export]');
  if(download){const section=document.getElementById(download.dataset.chartExport),svg=section?.querySelector('svg');if(!svg)return;download.disabled=true;try{announce(await exportChart(svg,{title:section.querySelector('h2')?.textContent||'AI in Medicine',cutoff:state.cutoff,filename:download.dataset.chartExport+'.png',note:download.dataset.chartExport==='overview'?'Illustrative scale. Sources support milestones, not IQ scores. https://ai-in-medicine-monitor.gillesp.chatgpt.site':(()=>{const series=trendSeries.find(item=>'chart-'+item.trackId===download.dataset.chartExport);return series?series.note+' Source: '+series.sourceUrl:'Publication timeline. Marker height does not indicate performance.';})()}));}catch{announce('Image export failed. Please try again.');}finally{download.disabled=false;}return;}

  for(const [attribute,handler] of [['data-trend-point',showTrendPoint],['data-overview-cluster',showOverviewCluster],['data-overview-point',showOverviewPoint],['data-history-id',showHistory],['data-track-milestone',showTrackMilestone],['data-point-id',showMeasurement],['data-study-id',showStudy]]){
    const target=event.target.closest('['+attribute+']');if(target){handler(target.getAttribute(attribute));return;}
  }
}
content.addEventListener('click',action);
content.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)&&event.target.closest('svg [role="button"]')){event.preventDefault();action(event);}});
$('#detail-body').addEventListener('click',action);
$('#close-dialog').addEventListener('click',()=>dialog.close());
$('#model-filter').innerHTML='<option value="">All models</option>'+[...new Set(measurements.map(row=>row.model))].sort().map(model=>'<option>'+e(model)+'</option>').join('');
$('#model-filter').addEventListener('change',event=>{stop();state.model=event.target.value;render();});
$('#cutoff-date').addEventListener('change',event=>cutoff(event.target.value));
$('#time-slider').addEventListener('input',event=>cutoff((1950+Number(event.target.value))+'-12-31'));
$('#today-button').addEventListener('click',()=>cutoff(today));
$('#play-button').addEventListener('click',play);
$('#present-button').addEventListener('click',present);
$('#export-button').addEventListener('click',exportData);
$('#editorial-check').textContent='Updated '+date(editorialStatus.updatedAt);
// Old view hashes now lead to the single-page overview.
if(['#verlauf','#anwendungen','#studien','#quellen'].includes(location.hash))history.replaceState(null,'','#top');
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!dialog.open){stop();if(state.presentation)present();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
sync();render();
if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({block:'start'}));
