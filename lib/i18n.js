import { monitorData } from './monitor-data.js';

let language='en',hasTranslatedDom=false;
const baseText=new WeakMap(),baseAttributes=new WeakMap();
const takeawayRecords=new WeakMap();
const attributes=['aria-label','title','placeholder','aria-valuetext'];
const monthNames={Jan:'Jan.',Feb:'Feb.',Mar:'März',Apr:'Apr.',May:'Mai',Jun:'Juni',Jul:'Juli',Aug:'Aug.',Sep:'Sept.',Oct:'Okt.',Nov:'Nov.',Dec:'Dez.'};
const extraDe={
  'Last reviewed':'Zuletzt geprüft',
  'Data table':'Datentabelle',
  'The development of AI and its impact on medicine is hard to follow. Here I bring together studies, benchmarks, milestones and related news on that topic. Special focus on the development of medical knowledge, clinical assistance and autonomous workflows. This should help to understand where we are heading or at least where we are, how capabilities are changing, and which questions to ask when considering AI for healthcare delivery or new medical products.':'Die Entwicklung von KI und ihr Einfluss auf die Medizin sind schwer zu überblicken. Hier führe ich Studien, Benchmarks, Meilensteine und relevante Neuigkeiten zu diesem Thema zusammen – mit besonderem Fokus auf medizinisches Wissen, klinische Assistenz und autonome Abläufe. Das soll helfen zu verstehen, wohin wir uns bewegen oder zumindest wo wir heute stehen, wie sich Fähigkeiten verändern und welche Fragen man stellen sollte, wenn es um KI in der Versorgung oder in neuen Medizinprodukten geht.',
  'Have a study, a question or a different perspective to share? Please do so, I love to hear from you.':'Haben Sie eine Studie, eine Frage oder eine andere Perspektive, die Sie teilen möchten? Melden Sie sich gerne – ich freue mich immer, von Ihnen zu hören.',
  'I always love feedback. Please reach out, no matter if you have a study to suggest, a question, or feedback on this site or its content.':'Ich freue mich immer über Feedback. Melden Sie sich gerne – ganz egal, ob Sie eine Studie vorschlagen möchten, eine Frage haben oder Feedback zu dieser Seite und ihren Inhalten teilen wollen.',
  'You can reach me anytime via direct message on LinkedIn or Bluesky:':'Sie können mich jederzeit direkt per Direct Message auf LinkedIn oder Bluesky kontaktieren:',
  'Direct message on LinkedIn ↗':'Direct Message auf LinkedIn ↗',
  'Direct message on Bluesky ↗':'Direct Message auf Bluesky ↗'
};
let phrases,phrasePattern;
export function getLanguage(){return language;}
export function setLanguage(value){language=value==='de'?'de':'en';return language;}
function dictionary(){return {...(monitorData.extensions?.locales?.de||{}),...extraDe};}
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

/** Dynamic findings retain their exact model names, values and date precision. */
export function translateTakeawayText(value,locale=language){
  if(typeof value!=='string'||locale!=='de')return value;
  const replacements=[];
  const protect=text=>'\uE000'+(replacements.push(text)-1)+'\uE001';
  const percent=value=>value.replace('.',',')+' %';
  const points=value=>value.replace('.',',')+' Punkte';
  const benchmark=value=>translateText(value,'de');
  let out=value
    .replace(/On (.+?), the best confirmed result is (.+?) at (\d+(?:\.\d+)?)% \(model release ([^)]+)\), with (.+?) at (\d+(?:\.\d+)?)% and (.+?) at (\d+(?:\.\d+)?)%\./g,(_,test,model,score,date,second,score2,third,score3)=>protect('Auf '+benchmark(test)+' erzielt '+model+' mit '+percent(score)+' das beste bestätigte Ergebnis (Modellveröffentlichung '+date+'); '+second+' erreicht '+percent(score2)+' und '+third+' '+percent(score3)+'.'))
    .replace(/On (.+?), the best confirmed result in view is (.+?) at (\d+(?:\.\d+)?)% \(model release ([^)]+)\)\./g,(_,test,model,score,date)=>protect('Im gewählten Zeitraum erzielt '+model+' auf '+benchmark(test)+' mit '+percent(score)+' das beste bestätigte Ergebnis (Modellveröffentlichung '+date+').'))
    .replace(/On (.+?), the best confirmed same-protocol result is (.+?) at (\d+(?:\.\d+)?) points \(model release ([^)]+)\)\./g,(_,test,model,score,date)=>protect('Auf '+benchmark(test)+' erzielt '+model+' mit '+points(score)+'n das beste bestätigte Ergebnis bei gleichem Testverfahren (Modellveröffentlichung '+date+').'))
    .replace(/On (.+?), the best confirmed result is (.+?) at (\d+(?:\.\d+)?)% task success \(model release ([^)]+)\)\./g,(_,test,model,score,date)=>protect('Auf '+benchmark(test)+' erzielt '+model+' mit '+percent(score)+' erfolgreich abgeschlossenen Aufgaben das beste bestätigte Ergebnis (Modellveröffentlichung '+date+').'))
    .replace(/On (.+?), (.+?) reaches (\d+(?:\.\d+)?) points\./g,(_,test,model,score)=>protect('Auf '+benchmark(test)+' erreicht '+model+' '+points(score)+'.'))
    .replace(/On (.+?), (.+?) reaches (\d+(?:\.\d+)?)%\./g,(_,test,model,score)=>protect('Auf '+benchmark(test)+' erreicht '+model+' '+percent(score)+'.'));
  const fixed={
    'Exam-style questions such as MedQA are close to saturation.':'Prüfungsfragen wie MedQA nähern sich einer Sättigung.',
    'These scores no longer separate the models widely.':'Diese Werte unterscheiden die Modelle nur noch wenig.',
    'The open questions are in Clinical assistance and Autonomous workflows.':'Offene Fragen betreffen klinische Assistenz und autonome Arbeitsabläufe.',
    'The 500-question, search-enabled MedQA results are not published by this date.':'Die Ergebnisse für MedQA mit 500 Fragen und Websuche waren zu diesem Zeitpunkt noch nicht veröffentlicht.',
    'Exam answers are not proof of safe clinical performance.':'Prüfungsantworten belegen keine sichere klinische Leistung.',
    'Rubric scores do not equal percent correct diagnoses.':'Bewertungspunkte entsprechen nicht dem Anteil korrekter Diagnosen.',
    'Success on simulated tasks is not clinical authorization or patient outcomes.':'Erfolg bei simulierten Aufgaben belegt weder eine klinische Zulassung noch Behandlungsergebnisse.'
  };
  for(const [source,target] of Object.entries(fixed))out=out.split(source).join(protect(target));
  return translateText(out,'de').replace(/\uE000(\d+)\uE001/g,(_,index)=>replacements[Number(index)]);
}

/** Split translated prose around the existing first-use abbreviations. */
export function translatedTakeawayParts(source,abbreviations,locale=language){
  const text=translateTakeawayText(source,locale);
  const matches=abbreviations.map(({term,title})=>{
    const escaped=term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const match=new RegExp('\\b'+escaped+'\\b').exec(text);
    return match?{term,title,index:match.index}:null;
  }).filter(Boolean).sort((a,b)=>a.index-b.index);
  const parts=[];let cursor=0;
  for(const match of matches){if(match.index<cursor)continue;if(match.index>cursor)parts.push({text:text.slice(cursor,match.index)});parts.push({text:match.term,title:match.title});cursor=match.index+match.term.length;}
  if(cursor<text.length)parts.push({text:text.slice(cursor)});
  return parts;
}

function applyTakeawayLanguage(root){
  const elements=[...(root.nodeType===1&&root.matches('[data-takeaway-source]')?[root]:[]),...root.querySelectorAll('[data-takeaway-source]')];
  for(const el of elements){
    let record=takeawayRecords.get(el);
    if(!record){record={source:el.getAttribute('data-takeaway-source'),abbreviations:[...el.querySelectorAll('abbr')].map(abbr=>({term:abbr.textContent,title:abbr.getAttribute('title')})),locale:null};takeawayRecords.set(el,record);}
    if(record.locale===language)continue;
    const fragment=document.createDocumentFragment();
    for(const part of translatedTakeawayParts(record.source,record.abbreviations,language)){
      if(part.title!==undefined){const abbr=document.createElement('abbr');abbr.title=part.title;abbr.textContent=part.text;fragment.append(abbr);}
      else fragment.append(document.createTextNode(part.text));
    }
    record.locale=language;el.replaceChildren(fragment);
  }
}
export function applyLanguage(root=document){
  if(language==='en'&&!hasTranslatedDom)return;
  if(language==='de')hasTranslatedDom=true;
  applyTakeawayLanguage(root);
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
