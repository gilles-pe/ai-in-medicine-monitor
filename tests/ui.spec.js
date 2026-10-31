import {test,expect} from '@playwright/test';
import {createHash} from 'node:crypto';
async function bytesOf(pending){const download=await pending,stream=await download.createReadStream(),chunks=[];for await(const chunk of stream)chunks.push(chunk);return {download,bytes:Buffer.concat(chunks)};}
function zipFiles(bytes){const files={};let o=0;while(bytes.readUInt32LE(o)===0x04034b50){expect(bytes.readUInt16LE(o+8)).toBe(0);const size=bytes.readUInt32LE(o+18),names=bytes.readUInt16LE(o+26),extra=bytes.readUInt16LE(o+28),start=o+30+names+extra;files[bytes.subarray(o+30,o+30+names).toString()]=bytes.subarray(start,start+size);o=start+size;}return files;}
async function date(page,value){await page.goto('./?cutoff='+value);await expect(page.locator('html')).toHaveAttribute('data-app-state','ready');}
async function openMonitor(page,id){const hit=page.locator('.detail-charts .monitor-point-hit[data-monitor-point="'+id+'"],.detail-charts .monitor-point-hit[data-monitor-cluster*="'+id+'"]');await hit.first().click();const card=page.locator('#detail-dialog'),ids=(await card.getAttribute('data-card-ids')||'').split(','),i=ids.indexOf(id);if(i>=0&&ids.length>1)await card.locator('[data-card-choice="'+i+'"]').click();}

test.beforeEach(async({page})=>{
  page.__runtimeErrors=[];page.on('pageerror',error=>page.__runtimeErrors.push(error.message));
  await page.clock.install({time:new Date('2026-10-18T06:30:00Z')});await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute('data-app-state','ready');
  await expect(page.getByRole('heading',{level:1})).toHaveText('Digital Health & AI in Medicine');
});
test.afterEach(async({page})=>{expect(page.__runtimeErrors).toEqual([]);});

test('clean header keeps preferences in the menu and three thumbnails',async({page})=>{
  await expect(page).toHaveTitle('Digital Health & AI in Medicine | Gilles Penning');
  await expect(page.locator('.brand,.chart-tools,.back-link,.track-navigation,.result-row,.monitor-undated,.track-details')).toHaveCount(0);
  await expect(page.getByRole('tab')).toHaveCount(0);await expect(page.locator('#present-button,#timeline-panel,#model-filter')).toHaveCount(0);await expect(page.locator('[data-language="de"]')).not.toBeVisible();
  await expect(page.locator('.chart-thumbnail')).toHaveCount(3);await expect(page.locator('#content')).not.toContainText(/Timeline data|Under review|Benchmark results|About this benchmark|PPT|PowerPoint/);
  await expect(page.locator('.masthead-author')).toHaveText('Gilles Penning');await expect(page.locator('.author-byline')).toHaveText('Tracking what AI can do in medicine.');await expect(page.locator('.site-footer')).not.toContainText('Gilles Penning');
  await expect(page.locator('#editorial-check')).toHaveText('Last reviewed 26 Oct 2026');
  await page.locator('#menu-button').click();await expect(page.locator('[data-language="de"]')).toBeVisible();
});


test('overview keeps illustration, separate scenarios, source cards and date cutoff',async({page})=>{
  await expect(page.locator('.overview-line:not(.scenario-line)')).toHaveCount(4);await expect(page.locator('.scenario-line')).toHaveCount(3);await expect(page.locator('.overview-point')).toHaveCount(22);
  const dash=await page.locator('.overview-line:not(.scenario-line)').evaluateAll(els=>els.map(e=>getComputedStyle(e).strokeDasharray));expect(dash[0]).toBe('none');expect(dash.slice(1).every(v=>v!=='none')).toBe(true);
  const radii=await page.locator('.overview-point .anchor-dot').evaluateAll(els=>els.map(e=>Number(e.getAttribute('r'))));expect(Math.max(...radii)).toBeLessThanOrEqual(4.5);
  await page.locator('[data-overview-point="af2-paper-2021"]').press('Enter');await expect(page.getByRole('dialog')).toContainText('0.96');await expect(page.getByRole('dialog').locator('.point-sources a').first()).toHaveAttribute('href',/nature.com/);await page.keyboard.press('Escape');
  await date(page,'2020-12-31');await expect(page.locator('[data-overview-point="af3-paper-2024"]')).toHaveCount(0);await expect(page.locator('.scenario-line')).toHaveCount(0);
});

test('nearby overview studies use one card with switchable results',async({page})=>{
  await page.locator('.overview-point[data-overview-cluster="mira-2026,residency-2026"]').press('Enter');
  const card=page.getByRole('dialog');await expect(card.locator('.editorial-evidence-card')).toHaveCount(1);await expect(card.locator('[data-card-choice]')).toHaveCount(2);
  await card.locator('[data-card-choice="0"]').click();await expect(card.locator('.point-sources a').first()).toHaveAttribute('href','https://www.nature.com/articles/s41586-026-10675-5');
  await card.locator('[data-card-choice="1"]').click();await expect(card.locator('.editorial-evidence-card')).toHaveCount(1);await expect(card.locator('[data-card-choice="1"]')).toHaveAttribute('aria-pressed','true');
});

test('thumbnails navigate to three compact single-chart tracks',async({page})=>{
  for(const id of ['knowledge','assistance','autonomy']){const preview=page.locator('.chart-thumbnail[href="#chart-'+id+'"]');await expect(preview.locator('svg')).toBeVisible();await preview.click();await expect(page).toHaveURL(new RegExp('#chart-'+id+'$'));const track=page.locator('#chart-'+id);await expect(track).toBeInViewport();await expect(track.locator('svg.monitor-chart-svg')).toHaveCount(1);await expect(track.locator('.chart-stories')).toBeVisible();await expect(track.locator('.track-description')).toBeVisible();await expect(track.locator('.track-test-summary')).toBeVisible();await expect(track.locator('.track-reading-key')).toBeVisible();await expect(track.locator('.track-reality')).toBeVisible();expect(await track.evaluate(e=>e.getBoundingClientRect().height)).toBeLessThan(672);}
});

test('both benchmark series stay visible without redundant filters',async({page})=>{
  await expect(page.locator('[data-series-view]')).toHaveCount(0);
  await expect(page.locator('#milestones-panel')).toHaveCount(0);
  for(const id of ['knowledge','assistance','autonomy']){
    const track=page.locator('#chart-'+id);await expect(track.locator('[data-legend-series]')).toHaveCount(2);
    const colors=await track.locator('[data-legend-series] line').evaluateAll(els=>els.map(e=>e.getAttribute('stroke')));expect(colors[0]).not.toBe(colors[1]);
    const heading=await track.locator('.track-top h2').boundingBox(),value=await track.locator('.track-headline-result').boundingBox();expect(Math.abs(heading.y+heading.height/2-value.y-value.height/2)).toBeLessThan(5);
  }
  await expect(page.locator('#chart-assistance .track-human-reference')).toContainText('no verified human baseline');
});

test('only checked observations appear and 2026 MedQA stays an independent series',async({page})=>{
  await expect(page.locator('.detail-charts .monitor-observation')).toHaveCount(44);await expect(page.locator('#chart-knowledge .monitor-observation')).toHaveCount(8);
  await expect(page.locator('#chart-assistance .monitor-observation')).toHaveCount(19);await expect(page.locator('#chart-autonomy .monitor-observation')).toHaveCount(17);
  await expect(page.locator('[data-observation-id="1.4"]')).toHaveCount(0);
  await expect(page.locator('#chart-knowledge .monitor-frontier[data-series-id="medqa_nyu_search_500_2026"]')).not.toHaveCount(0);await expect(page.locator('#chart-knowledge .monitor-frontier[data-series-id="medqa_main"]')).toHaveCount(0);
  await openMonitor(page,'knowledge-nyu-gemini31');const card=page.getByRole('dialog');await expect(card).toContainText('97.4%');await expect(card).toContainText('500');await expect(card.locator('.point-sources a').first()).toHaveAttribute('href','https://www.nature.com/articles/s41591-026-04431-5');await page.keyboard.press('Escape');
  await date(page,'2026-06-11');await expect(page.locator('[data-observation-id="knowledge-nyu-gemini31"]')).toHaveCount(0);
});

test('point cards retain quantitative findings, validity, source and active context',async({page})=>{
  await openMonitor(page,'3.9');const card=page.getByRole('dialog');await expect(card).toContainText('69.67%');await expect(card.locator('.point-card-sections dt')).toHaveText(['SETUP & COHORT','LIMITATIONS & VALIDITY']);await expect(card.locator('.point-sources a')).toHaveAttribute('href','https://stanfordmlgroup.github.io/projects/medagentbench/');await expect(page.locator('.detail-charts [data-observation-id="3.9"]')).toHaveClass(/is-selected/);await page.keyboard.press('Escape');
  await page.locator('[data-track-milestone="lower-amie-2025"]').click();await expect(card).toContainText('30/32');await expect(card).toContainText('25/26');await expect(card.locator('.semantic-badge')).toHaveText('Peer-reviewed · 2025');await expect(card.locator('.card-tags')).not.toHaveText(/^\s*·/);await expect(card).not.toContainText(/What was tested\?|How sure are we\?|Historical source-backed/);
});

test('desktop hover sources remain reachable and keyboard pins the same card',async({page},info)=>{
  test.skip(info.project.name.includes('mobile'),'Hover is desktop-only.');const hit=page.locator('.detail-charts .monitor-point-hit[data-monitor-point="2.1"]');await hit.hover();const preview=page.locator('.point-hover');await expect(preview).toBeVisible();const source=preview.locator('.point-sources a').first();await expect(source).toHaveAttribute('href',/^https:/);await source.hover();await page.clock.runFor(300);await expect(preview).toBeVisible();await page.keyboard.press('Escape');await expect(preview).not.toBeVisible();await hit.focus();await hit.press('Enter');await expect(page.getByRole('dialog').locator('.card-key-finding')).toContainText('15.54');
});

test('320px fits the header, charts, menu and touch controls',async({page})=>{
  await page.setViewportSize({width:320,height:844});await page.clock.runFor(200);expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  const chart=await page.locator('.overview-scroll').evaluate(e=>({w:e.clientWidth,s:e.scrollWidth}));expect(chart.s-chart.w).toBeLessThanOrEqual(1);
  const targets=await page.locator('.detail-charts .monitor-point-hit').evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return {w:r.width,h:r.height,l:r.left,r:r.right};}));expect(targets.length).toBeGreaterThan(0);for(const t of targets){expect(t.w).toBeGreaterThanOrEqual(44);expect(t.h).toBeGreaterThanOrEqual(44);expect(t.l).toBeGreaterThanOrEqual(0);expect(t.r).toBeLessThanOrEqual(320);}
  await page.locator('#menu-button').click();await page.locator('[data-language="de"]').click();await expect(page.locator('#site-menu')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);for(const b of await page.locator('[data-language]').all()){const box=await b.boundingBox();expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);}
});


test('menu retains social links, direct message feedback dialog',async({page})=>{
  await page.locator('#menu-button').click();await expect(page.locator('#site-menu a[aria-label="LinkedIn"]')).toHaveAttribute('href','https://de.linkedin.com/in/gillespenning');await expect(page.locator('#site-menu').getByRole('link',{name:'Substack',exact:true})).toHaveAttribute('href','https://medtechsignal.substack.com/');await page.locator('#feedback-button').click();await expect(page.locator('#feedback-dialog')).toBeVisible();await expect(page.locator('#site-menu')).not.toBeVisible();await expect(page.locator('#feedback-dialog')).toContainText('direct message on LinkedIn or Bluesky');await expect(page.locator('#feedback-dialog a[href*="linkedin.com"]')).toBeVisible();await expect(page.locator('#feedback-dialog a[href*="bsky.app"]')).toBeVisible();await page.locator('#feedback-close').click();await expect(page.locator('#menu-button')).toBeFocused();

});


test('chart zoom buttons expand and collapse overview and track charts',async({page})=>{
  await expect(page.locator('[data-chart-zoom]')).toHaveCount(4);
  await page.locator('[data-chart-zoom="overview"]').click();
  await expect(page.locator('#overview')).toHaveClass(/is-zoomed/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#overview')).not.toHaveClass(/is-zoomed/);
  await page.locator('[data-chart-zoom="knowledge"]').click();
  await expect(page.locator('#chart-knowledge')).toHaveClass(/is-zoomed/);
  await page.locator('[data-chart-zoom="knowledge"]').click();
  await expect(page.locator('#chart-knowledge')).not.toHaveClass(/is-zoomed/);
});


test('nearby lower-chart markers support source-backed hover and keyboard pinning',async({page},info)=>{
  test.skip(info.project.name.includes('mobile'),'Hover is desktop-only.');
  await page.locator('.chart-thumbnail[href="#chart-knowledge"]').click();
  const preview=page.locator('.point-hover');
  for(const id of ['knowledge-nyu-gemini31','2.10','3.17']){
    const dot=page.locator('.detail-charts [data-observation-id="'+id+'"]');
    await dot.scrollIntoViewIfNeeded();const box=await dot.boundingBox();
    await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
    await expect(preview).toBeVisible();
    await expect(preview.locator('.editorial-evidence-card')).toHaveAttribute('data-card-id',id);
    await expect(preview.locator('.point-sources a').first()).toHaveAttribute('href',/^https:/);
    await page.keyboard.press('Escape');
    await dot.press('Enter');await expect(page.getByRole('dialog').locator('.editorial-evidence-card')).toHaveAttribute('data-card-id',id);await page.keyboard.press('Escape');
  }
});


test('approved disclosure hierarchy preserves the practical question and profile placement',async({page})=>{
  await expect(page.locator('#intro-question')).toHaveText('What can AI do in medicine today?');
  const desktop=(await page.viewportSize()).width>860;
  expect(await page.locator('.about-monitor').evaluate(e=>e.open)).toBe(desktop);
  if(!desktop)await page.locator('.about-monitor > summary').click();
  await expect(page.locator('.about-monitor')).toHaveAttribute('open','');await expect(page.locator('#intro-question')).toBeVisible();
  for(const selector of ['#glossary','#track-sources-knowledge','#track-sources-assistance','#track-sources-autonomy']){
    const panel=page.locator(selector);await expect(panel).not.toHaveAttribute('open','');await panel.locator(':scope > summary').click();await expect(panel).toHaveAttribute('open','');
  }
  await page.setViewportSize({width:600,height:900});await page.clock.runFor(200);
  await expect(page.locator('#track-sources-knowledge')).toHaveAttribute('open','');
  await page.locator('#menu-button').click();await expect(page.locator('.author-card-role')).toHaveText('Medtech executive. Founder.');await expect(page.locator('.author-card img')).toHaveAttribute('alt','Portrait of Gilles Penning');
});

test('all four full views support correct labels, source cards and focus restoration',async({page})=>{
  for(const id of ['overview','knowledge','assistance','autonomy']){
    const target=page.locator(id==='overview'?'#overview':'#chart-'+id),button=page.locator('[data-chart-zoom="'+id+'"]');
    await button.click();await expect(target).toHaveClass(/is-zoomed/);await expect(button).toHaveAccessibleName('Exit full view');await expect(button).toHaveAttribute('aria-pressed','true');
    const size=await button.boundingBox();expect(size.width).toBeGreaterThanOrEqual(44);expect(size.height).toBeGreaterThanOrEqual(44);
    if(id==='overview'){await target.locator('[data-overview-cluster="mira-2026,residency-2026"]').press('Enter');const card=page.getByRole('dialog');await expect(card.locator('[data-card-choice]')).toHaveCount(2);await card.locator('[data-card-choice="1"]').click();await expect(card.locator('[data-card-choice="1"]')).toHaveAttribute('aria-pressed','true');await page.keyboard.press('Escape');await expect(target).toHaveClass(/is-zoomed/);}
    await page.keyboard.press('Escape');await expect(target).not.toHaveClass(/is-zoomed/);await expect(button).toBeFocused();
  }
  await page.locator('[data-chart-zoom="knowledge"]').click();await page.locator('#chart-zoom-backdrop').click({position:{x:1,y:1}});await expect(page.locator('#chart-knowledge')).not.toHaveClass(/is-zoomed/);
});

test('phone-sized overview taps resolve source cards and grouped sample selection',async({page},info)=>{
  test.skip(!info.project.name.includes('mobile'),'Real touchscreen case.');
  await page.setViewportSize({width:375,height:844});await page.clock.runFor(200);
  const dot=page.locator('.overview-point[data-overview-cluster="mira-2026,residency-2026"] .anchor-dot');await dot.scrollIntoViewIfNeeded();const r=await dot.boundingBox();
  await page.touchscreen.tap(r.x+r.width/2+8,r.y+r.height/2);
  const card=page.getByRole('dialog');await expect(card).toBeVisible();await expect(card.locator('.point-sources a').first()).toHaveAttribute('href',/^https:/);
  await expect(card.locator('[data-card-choice]')).not.toHaveCount(0);await card.locator('[data-card-choice]').last().click();await expect(card.locator('[data-card-choice]').last()).toHaveAttribute('aria-pressed','true');await page.locator('#close-dialog').click();await expect(card).not.toBeVisible();
  await openMonitor(page,'knowledge-nyu-gemini31');await expect(card).toContainText('97.4%');await page.locator('#close-dialog').click();
});

test('responsive production layout fits 375, 768 and 1280px',async({page})=>{
  for(const width of [375,768,1280]){await page.setViewportSize({width,height:900});await page.clock.runFor(200);expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);}
});

test('menu and chart keyboard focus stay inside their active controls',async({page})=>{
  await page.locator('#menu-button').click();
  const last=page.locator('#site-menu a[href],#site-menu button:not([disabled]),#site-menu summary').filter({visible:true}).last();
  await last.focus();await last.press('Tab');await expect(page.locator('#menu-button')).toBeFocused();
  await page.locator('#menu-button').press('Shift+Tab');await expect(last).toBeFocused();
  await page.keyboard.press('Escape');await expect(page.locator('#site-menu')).not.toBeVisible();await expect(page.locator('#menu-button')).toBeFocused();
  await page.locator('[data-chart-zoom="knowledge"]').click();
  const control=page.locator('#chart-knowledge [data-chart-zoom]');await control.focus();await control.press('Shift+Tab');
  expect(await page.evaluate(()=>document.activeElement.closest('#chart-knowledge')!==null)).toBe(true);
  await page.keyboard.press('Escape');await expect(page.locator('[data-chart-zoom="knowledge"]')).toBeFocused();
});

test('German dynamic summaries and AMIE clinical card retain exact evidence',async({page})=>{
  await page.locator('#menu-button').click();await page.locator('[data-language="de"]').click();await page.keyboard.press('Escape');
  await expect(page.locator('#chart-knowledge .chart-takeaway')).toContainText('97,4 %');
  await expect(page.locator('#chart-assistance .chart-takeaway')).toContainText('48,1 Punkten');
  await expect(page.locator('#chart-autonomy .chart-takeaway')).toContainText('erfolgreich abgeschlossenen Aufgaben');
  for(const text of await page.locator('.chart-takeaway').allTextContents())expect(text).not.toMatch(/best confirmed|model release|reaches|task success/);
  await page.locator('#menu-button').click();await page.locator('[data-language="en"]').click();await page.keyboard.press('Escape');
  await expect(page.locator('#chart-assistance .chart-takeaway')).toContainText('48.1 points');
  await page.locator('[data-track-milestone="lower-amie-previsit-2026"]').click();
  const card=page.getByRole('dialog');await expect(card).toContainText('33/44');await expect(card).toContainText('25/44');await expect(card).toContainText('98 completed');await expect(card).toContainText('No control group');
  await expect(card.locator('.point-sources a')).toHaveAttribute('href',/^https:\/\/research.google\/pubs\//);
  await page.keyboard.press('Escape');await expect(page.locator('#news-amie-before-the-appointment')).toContainText('24 Oct');
});

test('news previews expand and archive shares navigation and menu',async({page})=>{
 const first=page.locator('.news-fold').first();await expect(first).not.toHaveAttribute('open','');await first.locator('summary').click();await expect(first.locator('.news-meta-row')).toBeVisible();
 await page.locator('#section-nav').getByRole('link',{name:'News',exact:true}).click();await expect(page).toHaveURL(/news\/\?lang=en/);await expect(page.locator('#news-title')).toHaveText('Chronological News');await expect(page.locator('#news-back')).toHaveText('← Back to medical AI dashboard');await expect(page.locator('#news-reading-key,#news-order')).toHaveCount(0);
 await page.locator('#menu-button').click();await expect(page.locator('#site-menu')).toBeVisible();await page.locator('[data-language="de"]').click();await expect(page.locator('#news-title')).toHaveText('Chronologische News');await page.keyboard.press('Escape');
 await expect(page.locator('#news-items .news-card-item')).not.toHaveCount(0);await expect(page.locator('#section-nav .quiet-social a').first()).toHaveText('Substack');await expect(page.locator('#section-nav .quiet-social a').first()).toHaveAttribute('href','https://substack.com/@medtechsignal');await expect(page.locator('#news-items details,#news-items summary')).toHaveCount(0);await expect(page.locator('#news-items .news-meta-row').first()).toBeVisible();
});

test('news chart link keeps the pulsing MAI-DxO milestone beside its evidence card',async({page})=>{
  await page.setViewportSize({width:1280,height:900});
  await page.clock.setFixedTime(new Date('2026-10-31T06:30:00Z'));
  await page.goto('./?cutoff=2026-10-31&lang=en');
  const link=page.locator('#news-ai-diagnosis-doctor-choice .news-chart-link');
  await expect(link).toHaveAttribute('href','./?lang=en#track-milestone-lower-mai-dxo-2026');
  await link.click();
  await expect(page).toHaveURL(/#track-milestone-lower-mai-dxo-2026$/);
  const marker=page.locator('#track-milestone-lower-mai-dxo-2026'),card=page.locator('.linked-milestone-card');
  await expect(marker).toHaveClass(/is-linked-target/);
  await expect(marker).toHaveClass(/is-selected/);
  await expect(marker).toBeInViewport();
  await expect(card).toBeInViewport();
  await expect(card).toContainText('MAI-DxO');
  await expect(page.locator('#detail-dialog')).not.toBeVisible();
  const desktop=await Promise.all([marker.boundingBox(),card.boundingBox()]);
  expect(desktop[1].x).toBeGreaterThan(desktop[0].x+desktop[0].width);
  await page.keyboard.press('Escape');
  await expect(card).toHaveCount(0);
  await expect(marker).toBeInViewport();
  await page.goto('./news/?lang=de');
  await page.locator('#ai-diagnosis-doctor-choice .news-chart-link').click();
  await expect(page.locator('.linked-milestone-card')).toContainText('MAI-DxO');
  await page.setViewportSize({width:375,height:844});
  await expect(marker).toBeInViewport();await expect(card).toBeInViewport();
  const mobile=await Promise.all([marker.boundingBox(),card.boundingBox()]);
  expect(mobile[1].y).toBeGreaterThan(mobile[0].y);
  await card.locator('[data-card-close]').click();
  await expect(card).toHaveCount(0);
  await expect(marker).toBeFocused();
});

 test('responsive introduction and news thumbnails keep closed previews compact',async({page})=>{
   await page.setViewportSize({width:1280,height:900});await page.clock.runFor(200);await expect(page.locator('.about-monitor')).toHaveAttribute('open','');
   const fold=page.locator('.news-fold').filter({has:page.locator('.news-thumbnail')}).first();await expect(fold).not.toHaveAttribute('open','');expect(await fold.locator('summary').evaluate(e=>e.getBoundingClientRect().height)).toBeLessThan(48);
   await expect(fold.locator('summary .news-thumbnail')).toBeVisible();
   await page.setViewportSize({width:375,height:844});await page.clock.runFor(200);await expect(page.locator('.about-monitor')).not.toHaveAttribute('open','');await expect(fold.locator('summary .news-thumbnail')).not.toBeVisible();
   await fold.locator('summary').click();await expect(fold.locator('.fold-content .news-thumbnail')).toBeVisible();
   await page.locator('.about-monitor>summary').click();await page.setViewportSize({width:390,height:844});await page.clock.runFor(200);await expect(page.locator('.about-monitor')).toHaveAttribute('open','');
 });

 test('questions lead straight to answers and closed data tables follow milestone tiles',async({page})=>{
 for(const id of ['knowledge','assistance','autonomy']){
 const track=page.locator('#chart-'+id);await expect(track.locator('.chart-data-table')).not.toHaveAttribute('open','');
 expect(await track.evaluate(e=>{const q=e.querySelector('.track-description'),visual=q.nextElementSibling,stories=e.querySelector('.chart-stories');return visual.classList.contains('track-visual')&&visual.querySelector('figure').firstElementChild.classList.contains('chart-takeaway')&&stories.nextElementSibling.classList.contains('chart-data-table');})).toBe(true);
 await track.locator('.chart-data-table>summary').click();await expect(track.locator('.chart-data-table table')).toBeVisible();
 }
 await expect(page.locator('#overview .chart-data-table')).not.toHaveAttribute('open','');
 });

test('compact menu and close headline metrics reflect owner choices',async({page})=>{
 await expect(page.locator('.masthead-menu #editorial-check')).toHaveText('Last reviewed 26 Oct 2026');
 const title=await page.locator('#track-knowledge').boundingBox(),value=await page.locator('#chart-knowledge .track-headline-result').boundingBox();expect(value.x-title.x-title.width).toBeLessThan(35);
 await page.locator('#menu-button').click();await expect(page.locator('#site-menu').getByRole('link',{name:'About Me',exact:true})).toBeVisible();await expect(page.locator('#site-menu .author-card-links a')).toHaveCount(1);await expect(page.locator('#site-menu .social-icons a')).toHaveCount(4);await expect(page.locator('.menu-bottom #feedback-button')).toBeVisible();await expect(page.locator('.menu-bottom [data-language="de"]')).toBeVisible();await expect(page.locator('#site-menu').getByRole('link',{name:'News',exact:true})).toHaveCount(0);
});

test('time windows and PNG downloads work for every expanded chart',async({page})=>{
 for(const id of ['overview','knowledge','assistance','autonomy']){
  const chart=page.locator(id==='overview'?'#overview':'#chart-'+id);
  await chart.locator('[data-chart-range="6m"]').click();await expect(chart.locator('[data-chart-range="6m"]')).toHaveAttribute('aria-pressed','true');
  await chart.locator('[data-chart-range="all"]').click();await chart.locator('[data-chart-zoom]').click();
  const pending=page.waitForEvent('download');await chart.locator('[data-chart-download]').click();const {download,bytes}=await bytesOf(pending);expect(download.suggestedFilename()).toMatch(/\.png$/);expect(bytes.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');
  await page.keyboard.press('Escape');
 }
 await page.locator('#section-nav').getByRole('link',{name:'News',exact:true}).click();await expect(page.locator('#news-filters')).toHaveCount(0);
});

test('HealthBench Professional side line exposes exact graders and primary locators',async({page})=>{
 await page.goto('./?cutoff=2026-10-26&lang=en');
 await expect(page.locator('html')).toHaveAttribute('data-app-state','ready');
 await expect(page.locator('.detail-charts .monitor-grader-side-line').first()).toBeVisible();
 await openMonitor(page,'hbpro-astra-anthropic');
 await expect(page.locator('#detail-dialog')).toContainText('Claude Opus 4.8');
 await expect(page.locator('#detail-dialog')).toContainText('137-138');
 await expect(page.locator('#detail-dialog')).toContainText('70.3');
 await page.keyboard.press('Escape');
 await openMonitor(page,'hbpro-opus47-anthropic');
 await expect(page.locator('#detail-dialog')).toContainText('Claude Sonnet 4.6');
 await expect(page.locator('#detail-dialog')).toContainText('228-229');
});
