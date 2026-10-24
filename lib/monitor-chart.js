import { monitorData } from './monitor-data.js';
import { buildTrackSeries, dateInfo } from './monitor-series.js';
import { escapeHtml as e } from './selectors.js';

const TITLES={medqa_nyu_search_500_2026:'MedQA · 500 questions · Search enabled',medqa_main:'MedQA · medical exam questions',healthbench_core_2025:'HealthBench Core · clinical conversations',healthbench_pro_2026:'HealthBench Professional · clinical tasks',medagentbench_stanford:'MedAgentBench · simulated health-record tasks',healthagentbench_msft_2026:'HealthAgentBench · simulated clinical workflows'};
const SHORT={medqa_nyu_search_500_2026:'MedQA · 2026 study',medqa_main:'MedQA',healthbench_core_2025:'HealthBench',healthbench_pro_2026:'Professional',medagentbench_stanford:'MedAgentBench',healthagentbench_msft_2026:'HealthAgentBench'};
const COLORS={knowledge:['#209b8e','#5872b5'],assistance:['#d49b32','#5789a5'],autonomy:['#4d7dbe','#209b8e']};
const n=value=>Number(Number(value).toFixed(2)).toString();
const scoreLabel=(value,unit)=>`${n(value)}${unit==='%'?'%':' points'}`;
function statusLabel(point){return point.validation?.status==='confirmed'?(point.eligible?'Confirmed':'Confirmed score; comparison under review'):point.validation?.status==='reported'?'Reported; comparison under review':'Under review';}
function context(track,cutoff,view='all'){const result=buildTrackSeries(track.id||track.trackId,cutoff);result.series=result.series.map((s,index)=>({...s,styleIndex:index,points:s.points.filter(p=>p.validation.status==='confirmed')})).filter(s=>view==='all'||s.seriesId===view);const id=track.id||({medical_knowledge:'knowledge',clinical_assistance:'assistance',autonomous_workflows:'autonomy'}[track.trackId]);return {...result,id,colors:COLORS[id]||[track.color||'#4d7dbe','#244e78']};}
function touchClusters(points,x,y,width){
  const scale=1,groups=[];
  for(const point of points){const px=x(point.releaseDate.monthIndex),py=y(point.value);const group=groups.find(g=>Math.abs(g.ax-px)*scale<44&&Math.abs(g.ay-py)<44);if(group)group.points.push(point);else groups.push({ax:px,ay:py,points:[point]});}
  return groups.map(g=>({...g,x:g.points.reduce((v,p)=>v+x(p.releaseDate.monthIndex),0)/g.points.length,y:g.points.reduce((v,p)=>v+y(p.value),0)/g.points.length}));
}

/** One canvas per track; benchmark frontiers stay independent, never bridged. */
export function renderMonitorChart(track,cutoff,{preview=false,model='',seriesView='all'}={}){
  const result=context(track,cutoff,seriesView),series=result.series;
  const viewport=globalThis.window?.innerWidth??1152;
  const width=preview?320:Math.max(250,Math.min(1116,viewport-36));
  const height=preview?105:(viewport<=700?128:186),left=preview?12:36,right=preview?10:12,top=preview?9:(viewport<=700?36:48),floor=height-(preview?22:27);
  const start=dateInfo(monitorData.meta.xAxisRange.start).monthIndex,end=dateInfo(monitorData.meta.xAxisRange.end).monthIndex;
  const min=result.track.yAxis.min,max=result.track.yAxis.max,unit=result.track.yAxis.unit==='%'?'%':'pts';
  const x=month=>left+(month-start)/(end-start||1)*(width-left-right),y=value=>floor-(value-min)/(max-min)*(floor-top);
  const metric=unit==='%'?(result.id==='knowledge'?'Accuracy (%)':'Task success (%)'):'Rubric score (points)';
  let body=`<defs>${series.map(item=>{const color=result.colors[item.styleIndex%result.colors.length];return `<linearGradient id="grad-${e(result.id)}-${e(item.seriesId)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity="${preview?.13:.1}"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient>`;}).join('')}</defs>`;
  if(!preview)body+=`<rect x="${left}" y="${top}" width="${width-left-right}" height="${floor-top}" rx="2" fill="#fffdf9" fill-opacity=".6"/>`;
  for(const value of preview?[min,max]:[min,(min+max)/2,max]){body+=`<line x1="${left}" x2="${width-right}" y1="${y(value)}" y2="${y(value)}" stroke="#dce2db"${value!==min&&value!==max?' stroke-dasharray="2 4"':''} vector-effect="non-scaling-stroke"/>`;if(!preview)body+=`<text x="${left-8}" y="${y(value)+4}" text-anchor="end" fill="#627477" font-size="10">${n(value)}</text>`;}
  for(let year=Math.floor(start/12);year<=Math.floor(end/12);year++){const month=year*12;if(month<start||month>end)continue;body+=`<line x1="${x(month)}" x2="${x(month)}" y1="${top}" y2="${floor}" stroke="#e3e7e0" stroke-dasharray="2 3" vector-effect="non-scaling-stroke"/><text x="${x(month)}" y="${height-8}" text-anchor="${month===start?'start':'middle'}" fill="#627477" font-size="11">${year}</text>`;}
  const observations=[];
  series.forEach((item,index)=>{
    const color=result.colors[item.styleIndex%result.colors.length];
    const points=item.points.filter(p=>p.releaseDate.monthIndex>=start&&p.releaseDate.monthIndex<=end);observations.push(...points);
    const retro=points.some(p=>p.retrospective),dash=item.styleIndex?'7 3':retro?'2 4':'';
    if(!preview){const lx=left+index*(width-left-right)/series.length;body+=`<g class="monitor-series-label" data-legend-series="${e(item.seriesId)}"><title>${e(TITLES[item.seriesId]||item.benchmarkName)}</title><line x1="${lx}" x2="${lx+13}" y1="33" y2="33" stroke="${color}" stroke-width="2"${dash?` stroke-dasharray="${dash}"`:''}/><text x="${lx+18}" y="37" fill="${color}" font-size="10">${e(SHORT[item.seriesId]||item.benchmarkName)}</text></g>`;}
    for(const segment of item.segments){const visible=segment.filter(p=>p.releaseDate.monthIndex>=start&&p.releaseDate.monthIndex<=end);if(visible.length>1){let area=`M${x(visible[0].releaseDate.monthIndex)},${floor} V${y(visible[0].value)}`;for(let i=1;i<visible.length;i++){const b=visible[i];area+=` H${x(b.releaseDate.monthIndex)} V${y(b.value)}`;}area+=` V${floor} Z`;body+=`<path class="monitor-frontier-area" d="${area}" fill="url(#grad-${e(result.id)}-${e(item.seriesId)})" pointer-events="none"/>`;}for(let i=1;i<visible.length;i++){const a=visible[i-1],b=visible[i];body+=`<path class="monitor-frontier${a.retrospective||b.retrospective?' monitor-retrospective-line':''}" data-series-id="${e(item.seriesId)}" d="M${x(a.releaseDate.monthIndex)},${y(a.value)} H${x(b.releaseDate.monthIndex)} V${y(b.value)}" fill="none" stroke="${color}" stroke-width="${preview?2:2.5}"${dash?` stroke-dasharray="${dash}"`:''} vector-effect="non-scaling-stroke"/>`;}}
    for(const p of points){const px=x(p.releaseDate.monthIndex),py=y(p.value),r=preview?3:p.frontier?4.5:3.3,selected=!model||p.model===model,ink=selected?color:'#8c9b97';const fill=p.retrospective?'#fffdf8':ink;
      const mark=!p.eligible?`<path d="M${px},${py-r-1} l${r+1},${r+1} l-${r+1},${r+1} l-${r+1},-${r+1} Z" fill="#fffdf8" stroke="${ink}" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`:item.styleIndex?`<rect x="${px-r}" y="${py-r}" width="${r*2}" height="${r*2}" rx=".6" fill="${fill}" stroke="${ink}" stroke-width="1.6" vector-effect="non-scaling-stroke"/>`:`<circle cx="${px}" cy="${py}" r="${r}" fill="${fill}" stroke="${ink}" stroke-width="1.6" vector-effect="non-scaling-stroke"/>`;
      const pointTitle=`${p.model}, ${scoreLabel(p.value,unit)}, ${SHORT[item.seriesId]}. Source checked.`;
      body+=`<g class="monitor-observation${p.eligible?'':' monitor-unreviewed'}" data-observation-id="${e(p.id)}" data-observation-series="${e(item.seriesId)}"${preview?'':' role="button" tabindex="0" aria-label="'+e(pointTitle+' Open result.')+'"'} opacity="${selected?(p.frontier?1:.58):.25}"><title>${e(pointTitle)}</title>${mark}</g>`;}
  });
  if(!preview){body+=`<text class="monitor-metric-label" x="${left}" y="13" fill="#526c70" font-size="10">${e(metric)}</text><text x="${width-right}" y="13" text-anchor="end" fill="#78847b" font-size="10">Model release ≈</text>`;if(!observations.length)body+=`<text x="${(left+width-right)/2}" y="${(top+floor)/2}" text-anchor="middle" fill="#627477" font-size="10">No published results at this date</text>`;}
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" class="monitor-chart-svg${preview?' monitor-chart-preview':''}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${e(result.track.title)}. ${e(metric)}. Separate benchmark series by provisional model release month." data-monitor-series="${e(series.map(s=>s.seriesId).join(','))}" data-axis-type="calendar">${body}</svg>`;
  if(preview)return svg;
  const hits=touchClusters(observations,x,y,width).map(g=>{const ids=g.points.map(p=>p.id),names=g.points.map(p=>`${p.model}, ${scoreLabel(p.value,unit)}, Source checked`),attr=ids.length===1?`data-monitor-point="${e(ids[0])}"`:`data-monitor-cluster="${e(ids.join(','))}"`;return `<button type="button" class="monitor-point-hit${ids.length>1?' monitor-cluster-hit':''}" ${attr} style="left:clamp(22px,${g.x/width*100}%,calc(100% - 22px));top:clamp(22px,${g.y/height*100}%,calc(100% - 22px))" aria-label="${e((ids.length>1?ids.length+' nearby results. ':'')+names.join('; ')+'. Open result.')}"></button>`;}).join('');
  return `<div class="monitor-chart" data-track-curve="${e(result.id)}"><div class="monitor-plot">${svg}<div class="monitor-hit-layer">${hits}</div></div></div>`;
}

/** Static data table with plotted values and sources for each benchmark track. */
export function renderTrackDataTable(track,cutoff,{model='',seriesView='all'}={}){
  const result=context(track,cutoff,seriesView),unit=result.track.yAxis.unit==='%'?'%':'pts';
  const start=dateInfo(monitorData.meta.xAxisRange.start).monthIndex,end=dateInfo(monitorData.meta.xAxisRange.end).monthIndex;
  const rows=[];
  for(const item of result.series){
    const pts=item.points.filter(p=>p.releaseDate.monthIndex>=start&&p.releaseDate.monthIndex<=end&&(!model||p.model===model));
    for(const p of pts){
      const src=p.sources?.[0];
      const link=src?.url?`<a href="${e(src.url)}" target="_blank" rel="noopener noreferrer">${e(src.title||'Primary source')} ↗</a>`:'';
      rows.push(`<tr><td>${e(p.model)}</td><td>${e(SHORT[item.seriesId]||item.benchmarkName)}</td><td>${e(scoreLabel(p.value,unit))}</td><td><time datetime="${e(p.modelReleaseDate)}">${e(p.modelReleaseDate)}</time></td><td>${link}</td></tr>`);
    }
  }
  return `<details class="chart-data-table"><summary>Data table</summary><div class="data-table-scroll"><table><caption>Confirmed measurements for ${e(result.track.title)}</caption><thead><tr><th scope="col">Model</th><th scope="col">Benchmark</th><th scope="col">Score</th><th scope="col">Release</th><th scope="col">Source</th></tr></thead><tbody>${rows.join('')}</tbody></table></div></details>`;
}

/** Explanations are retained in the track's single closed disclosure. */
export function renderMonitorDetails(track,cutoff){
  const result=context(track,cutoff),unit=result.track.yAxis.unit==='%'?'%':'pts';
  const details=result.series.map(item=>{
    const pending=item.points.filter(p=>!p.eligible).length;
    const note=pending?`${pending} points are excluded from the trend pending review.`:'Score evidence checked. Timeline dates remain provisional.';
    const unplaced=item.undated.length?'<details class="monitor-undated"><summary>Results without a verified timeline date · '+item.undated.length+'</summary><div class="point-cluster-list">'+item.undated.map(p=>'<button type="button" data-monitor-point="'+e(p.id)+'"><span>'+e(p.model)+'</span><span>'+e(scoreLabel(p.value,unit))+' · '+e(statusLabel(p))+'</span></button>').join('')+'</div></details>':'';
    return '<section class="monitor-benchmark-about" data-benchmark-series="'+e(item.seriesId)+'"><h4>'+e(TITLES[item.seriesId]||item.benchmarkName)+'</h4><p>'+e(item.points[0]?.explain?.whatWasTested||item.data?.[0]?.explain?.whatWasTested||'Test description not yet checked.')+'</p><p class="monitor-series-note">'+e(note)+(!item.frontier.length?' A confirmed comparable trend is not yet available.':'')+'</p>'+unplaced+'</section>';
  }).join('');
  return '<p class="monitor-question">'+e(result.track.question)+'</p><p class="monitor-calendar-note">Provisional timeline · release months approximate. Model availability is not the test date.</p><p>'+e(result.track.caveat)+'</p><div class="monitor-legend"><span>Best eligible result</span><span>Other models</span><span>Older models tested later</span><span>Not eligible for trend</span></div><p>Different benchmarks use different tasks. Their lines stay separate; heights are not a direct comparison across tests. Hollow marks indicate older models tested later; diamonds are not eligible for a trend.</p>'+details;
}
