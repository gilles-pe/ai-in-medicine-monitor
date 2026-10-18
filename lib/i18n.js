import { monitorData } from './monitor-data.js';

let language='en';
const baseText=new WeakMap(),baseAttributes=new WeakMap();
const attributes=['aria-label','title','placeholder','aria-valuetext'];
const monthNames={Jan:'Jan.',Feb:'Feb.',Mar:'März',Apr:'Apr.',May:'Mai',Jun:'Juni',Jul:'Juli',Aug:'Aug.',Sep:'Sept.',Oct:'Okt.',Nov:'Nov.',Dec:'Dez.'};
let phrases,phrasePattern;
export function getLanguage(){return language;}
export function setLanguage(value){language=value==='de'?'de':'en';return language;}
function dictionary(){return monitorData.extensions?.locales?.de||{};}
function compiled(){
  if(phrasePattern)return;
  phrases=dictionary();
  const keys=Object.keys(phrases).filter(key=>key.length>2).sort((a,b)=>b.length-a.length);
  const escaped=keys.map(key=>key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  phrasePattern=new RegExp('(?<![A-Za-z])(?:'+escaped.join('|')+')(?![A-Za-z])','g');
}
/** UI translations never alter model identifiers, source URLs or stored evidence. */
export function translateText(value,locale=language){
  if(typeof value!=='string'||locale!=='de')return value;
  const dict=dictionary(),trim=value.trim();
  if(Object.hasOwn(dict,trim))return value.replace(trim,dict[trim].replace(/(\d)\.(\d+)(?=\s?%| Punkte| points| pts)/g,'$1,$2'));
  compiled();
  let out=value.replace(phrasePattern,match=>phrases[match]);
  out=out.replace(/\b(\d+) points? (is|are) excluded from the trend pending review\./g,'$1 Punkte sind bis zur Prüfung von der Linie ausgeschlossen.')
    .replace(/\b(\d+) (nearby results)\b/g,'$1 benachbarte Ergebnisse')
    .replace(/\b(\d+) eligible results\./g,'$1 zulässige Ergebnisse.')
    .replace(/\b(\d+) points not eligible for a trend\./g,'$1 Punkte sind nicht für die Linie freigegeben.')
    .replace(/\b(\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(?: (\d{4}))?\b/g,(_,day,month,year)=>day+'. '+monthNames[month]+(year?' '+year:''))
    .replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4})\b/g,(_,month,year)=>monthNames[month]+' '+year)
    .replace(/(\d)\.(\d+)(?=\s?%| Punkte| points| pts)/g,'$1,$2');
  return out;
}
export function applyLanguage(root=document){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){return node.parentElement?.closest('script,style,noscript,[data-i18n-ignore]')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT;}});
  for(let node=walker.nextNode();node;node=walker.nextNode()){
    const current=node.nodeValue;let record=baseText.get(node);
    if(!record||record.rendered!==current)record={source:current};
    const rendered=translateText(record.source);if(rendered!==current)node.nodeValue=rendered;
    baseText.set(node,{source:record.source,rendered});
  }
  const elements=[...(root.nodeType===1?[root]:[]),...root.querySelectorAll('*')];
  for(const el of elements){if(el.closest('script,style,[data-i18n-ignore]'))continue;
    const records=baseAttributes.get(el)||{};
    for(const name of attributes){if(!el.hasAttribute(name))continue;const current=el.getAttribute(name);const record=records[name]?.rendered===current?records[name]:{source:current};const rendered=translateText(record.source);if(rendered!==current)el.setAttribute(name,rendered);records[name]={source:record.source,rendered};}
    baseAttributes.set(el,records);
  }
}
export function preferredLanguage(search='',storage){
  const explicit=new URLSearchParams(search).get('lang');if(['en','de'].includes(explicit))return explicit;
  try{const saved=storage?.getItem('digital-health-language');if(['en','de'].includes(saved))return saved;}catch{}
  return 'en';
}
