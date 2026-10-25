import {setLanguage,getLanguage,applyLanguage,preferredLanguage} from './i18n.js';

let storage;try{storage=window.localStorage;}catch{}
const menu=document.querySelector('#site-menu'),toggle=document.querySelector('#menu-button');
function closeMenu(focus=false){if(!menu||!toggle)return;menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');if(focus)toggle.focus();}
export function applySiteLanguage(locale,persist=true){
  setLanguage(locale);document.documentElement.lang=getLanguage();
  document.querySelectorAll('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===getLanguage())));
  if(persist){try{storage?.setItem('digital-health-language',getLanguage());}catch{}const url=new URL(location.href);url.searchParams.set('lang',getLanguage());history.replaceState(null,'',url);}
  document.dispatchEvent(new CustomEvent('site-language-change',{detail:{locale:getLanguage()}}));
  applyLanguage(document);
}
toggle?.addEventListener('click',()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden));toggle.setAttribute('aria-label',menu.hidden?'Open menu':'Close menu');applyLanguage(document);});
document.addEventListener('click',event=>{if(!menu?.hidden&&!event.target.closest('#site-menu,#menu-button'))closeMenu();});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!menu?.hidden){event.preventDefault();closeMenu(true);}
  else if(event.key==='Escape'&&!document.querySelector('dialog[open]')){document.body.classList.remove('presentation-mode');document.querySelector('#present-button')?.setAttribute('aria-pressed','false');}
  if(event.key!=='Tab'||menu?.hidden)return;
  const controls=[toggle,...menu.querySelectorAll('a[href],button:not([disabled])')].filter(el=>el.getClientRects().length&&el.checkVisibility()),first=controls[0],last=controls.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
});
menu?.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>applySiteLanguage(button.dataset.language)));
document.querySelector('#present-button')?.addEventListener('click',event=>{const active=document.body.classList.toggle('presentation-mode');event.currentTarget.setAttribute('aria-pressed',String(active));closeMenu();});
document.querySelector('#feedback-button')?.addEventListener('click',()=>{
  closeMenu();let dialog=document.querySelector('#shell-feedback');
  if(!dialog){dialog=document.createElement('dialog');dialog.id='shell-feedback';dialog.setAttribute('aria-labelledby','shell-feedback-title');dialog.innerHTML='<div class="dialog-top"><h2 id="shell-feedback-title">Feedback</h2><button class="icon-button" type="button" aria-label="Close feedback">×</button></div><p>You can reach me anytime via direct message on LinkedIn or Bluesky:</p><p><a href="https://de.linkedin.com/in/gillespenning" target="_blank" rel="noopener noreferrer">Direct message on LinkedIn ↗</a></p><p><a href="https://bsky.app/profile/gillespe.bsky.social" target="_blank" rel="noopener noreferrer">Direct message on Bluesky ↗</a></p>';document.body.append(dialog);dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>toggle?.focus());}
  applyLanguage(dialog);dialog.showModal();
});
applySiteLanguage(preferredLanguage(location.search,storage),false);
document.documentElement.dataset.siteShell='ready';
