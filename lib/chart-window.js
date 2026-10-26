export const WINDOWS=[['all','All time'],['5y','5Y'],['2y','2Y'],['1y','1Y'],['6m','6M']];
export function monthWindow(cutoff,range='all',initial=2022*12){const d=new Date(cutoff+'T00:00:00Z'),end=d.getUTCFullYear()*12+d.getUTCMonth()+1,span={'5y':60,'2y':24,'1y':12,'6m':6}[range];return {start:span?end-span:initial,end};}
export function valueDomain(values,{min=0,max=100}={}){if(!values.length)return {min,max};const lo=Math.min(...values),hi=Math.max(...values),pad=Math.max(5,(hi-lo)*.12);return {min:Math.max(min,Math.floor((lo-pad)/5)*5),max:Math.min(max,Math.ceil((hi+pad)/5)*5)};}
export function rangeControls(id,active='all'){return '<div class="chart-ranges" role="group" aria-label="Chart time range">'+WINDOWS.map(([range,label])=>'<button type="button" data-chart-range="'+range+'" data-range-chart="'+id+'" aria-pressed="'+(active===range)+'">'+label+'</button>').join('')+'</div>';}

// Clip existing step segments, retaining the entering level. No extension past
// the segment's final observation and no synthetic observation markers.
export function clipFrontier(segment,start,end){
 if(!segment.length||segment.at(-1).releaseDate.monthIndex<start||segment[0].releaseDate.monthIndex>end)return [];
 const visible=segment.filter(p=>p.releaseDate.monthIndex>=start&&p.releaseDate.monthIndex<=end);
 const previous=segment.filter(p=>p.releaseDate.monthIndex<start).at(-1);
 if(previous)visible.unshift({...previous,releaseDate:{...previous.releaseDate,monthIndex:start}});
 const next=segment.find(p=>p.releaseDate.monthIndex>end);
 if(next&&visible.length){const last=visible.at(-1);visible.push({...last,releaseDate:{...last.releaseDate,monthIndex:end}});}
 return visible;
}
