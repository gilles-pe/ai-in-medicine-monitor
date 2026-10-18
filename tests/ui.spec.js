import { test,expect } from '@playwright/test';
const results=page=>page.locator('.result-row');
async function openBenchmark(page,trackId='knowledge'){
  const details=page.locator('#chart-'+trackId+' details.benchmark-details');
  if(await details.count()&&!await details.evaluate(element=>element.open))await details.locator('summary').click();
  return details;
}

test.beforeEach(async({page})=>{
  await page.clock.install({time:new Date('2026-10-18T06:30:00Z')});
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toHaveText(/AI in Medicine Monitor/);
});

test('compact English single page has no tabs, methodology control or slide references',async({page})=>{
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.getByRole('tab')).toHaveCount(0);
  await expect(page.locator('#methods-button')).toHaveCount(0);
  await expect(page.locator('#editorial-check')).toHaveText('Updated 18 Oct 2026');
  await expect(page.locator('.point-index summary')).toHaveText('Milestones');
  await expect(page.locator('#content')).not.toContainText(/PPT|PowerPoint|Präsentation|Wie wir|Meilensteine|Fortschritt/);
  await expect(page.locator('.chart-thumbnail')).toHaveCount(3);
  await expect(results(page)).toHaveCount(13);
  await expect(page.locator('.changes')).toContainText('Changes');
  await expect(page.locator('.masthead')).not.toContainText('Gilles Penning');
  await expect(page.locator('.site-footer')).not.toContainText('Gilles Penning');
  await expect(page.locator('.about-monitor')).not.toHaveAttribute('open','');
  await page.locator('.about-monitor summary').click();
  await expect(page.locator('.contact-links')).toBeVisible();
  const order=await page.locator('#content').evaluate(element=>Array.from(element.children).map(child=>child.id||child.className));
  expect(order.indexOf('timeline-slot')).toBeGreaterThan(order.indexOf('overview'));
});

test('overview preserves four curves, differentiated lines, scenarios and AlphaFold sources',async({page})=>{
  await expect(page.locator('#cutoff-date')).toHaveAttribute('min','1950-01-01');
  await expect(page.locator('#cutoff-date')).toHaveAttribute('max','2030-12-31');
  await expect(page.locator('.overview-line:not(.scenario-line)')).toHaveCount(4);
  await expect(page.locator('.scenario-line')).toHaveCount(3);
  await expect(page.locator('.overview-point')).toHaveCount(22);
  const histories=await page.locator('.overview-line:not(.scenario-line)').evaluateAll(elements=>elements.map(element=>getComputedStyle(element).strokeDasharray));
  expect(histories[0]).toBe('none');
  expect(histories.slice(1).every(value=>value!=='none')).toBe(true);
  await page.locator('[data-history-id="alphafold2-2020"]').click();
  await expect(page.getByRole('dialog')).toContainText('CASP14');
  await expect(page.getByRole('dialog').getByRole('link',{name:/Source/})).toHaveAttribute('href',/deepmind.google/);
  await page.keyboard.press('Escape');
  await page.locator('#cutoff-date').fill('2020-12-31');await page.locator('#cutoff-date').press('Tab');
  await expect(page.locator('[data-history-id="alphafold3-2024"]')).toHaveCount(0);
  await expect(page.locator('.scenario-line')).toHaveCount(0);
});

test('three visible mini charts jump down to detailed charts and back or onward',async({page})=>{
  for(const id of ['knowledge','assistance','autonomy']){
    const preview=page.locator('.chart-thumbnail[href="#chart-'+id+'"]');
    await expect(preview.locator('svg')).toBeVisible();
    await expect(preview.locator('svg path,svg line')).not.toHaveCount(0);
    await preview.click();await expect(page).toHaveURL(new RegExp('#chart-'+id+'$'));
    await expect(page.locator('#chart-'+id)).toBeInViewport();
    await page.locator('#chart-'+id+' .back-link').click();await expect(page).toHaveURL(/#charts$/);
    await expect(page.locator('#charts')).toBeInViewport();
  }
  await page.locator('.chart-thumbnail').first().click();
  await page.locator('#chart-knowledge .track-navigation a').click();await expect(page).toHaveURL(/#chart-assistance$/);
});

test('benchmark disclosure preserves scores, original sources and focus',async({page})=>{
  await expect(results(page).first()).not.toBeVisible();
  await openBenchmark(page);
  const trigger=results(page).first();
  const id=await trigger.getAttribute('data-point-id');
  await expect(trigger.locator('.result-score')).toContainText('30.37%');
  await trigger.click();await expect(page.getByRole('dialog')).toContainText('30.37%');
  await expect(page.getByRole('dialog').getByRole('link',{name:/Source/})).toHaveAttribute('href',/^https:/);
  await page.getByRole('button',{name:'Close',exact:true}).click();
  await expect(page.locator('[data-point-id="'+id+'"]').first()).toBeFocused();
});

test('date cutoff and model filter affect benchmark results, not unrelated milestones',async({page})=>{
  await page.locator('#model-filter').selectOption('GPT-5.4');await expect(results(page)).toHaveCount(3);
  await expect(page.locator('.milestone-reading')).toHaveCount(9);
  await page.locator('#model-filter').selectOption('');await expect(results(page)).toHaveCount(13);
  await page.locator('#cutoff-date').fill('2025-01-01');await page.locator('#cutoff-date').press('Tab');
  await expect(results(page)).toHaveCount(0);
  await expect(page.locator('[data-track-milestone="lower-mira-2026"]')).toHaveCount(0);
  await page.getByRole('button',{name:'Today',exact:true}).click();await expect(results(page)).toHaveCount(13);
});

test('grouped overview sources and milestone keyboard access stay source-backed in English',async({page})=>{
  await page.locator('.overview-point[data-overview-cluster="mira-2026,residency-2026"]').press('Enter');
  await page.getByRole('dialog').getByRole('button',{name:'MIRA',exact:true}).click();
  await expect(page.getByRole('dialog').getByRole('link',{name:/Source/})).toHaveAttribute('href','https://www.nature.com/articles/s41586-026-10675-5');
  await expect(page.getByRole('dialog')).not.toContainText(/PPT|PowerPoint|Präsentation|Veröffentlicht/);
  await page.keyboard.press('Escape');
  await page.locator('.milestone-anchor[data-track-milestone="lower-star-2022"]').press('Enter');
  await expect(page.getByRole('dialog')).toContainText(/preclinical|supervis/i);
  await page.keyboard.press('Escape');
  await page.locator('.trust-link').click();await expect(page.getByRole('dialog')).toContainText('3.4/5');
});

test('study disclosure opens research details without presentation provenance',async({page})=>{
  await page.locator('.study-library summary').click();
  await expect(page.locator('[data-study-id]')).toHaveCount(6);
  await page.locator('[data-study-id="alphafold2"]').click();
  await expect(page.getByRole('dialog')).toContainText(/0.96/);
  await expect(page.getByRole('dialog')).not.toContainText(/slide|PPT|PowerPoint|presentation/i);
});

test('presentation mode and annual playback retain working controls',async({page})=>{
  await page.getByRole('button',{name:'Present',exact:false}).click();await expect(page.locator('body')).toHaveClass(/presentation-mode/);
  await page.keyboard.press('Escape');await expect(page.locator('body')).not.toHaveClass(/presentation-mode/);
  await page.locator('#cutoff-date').fill('2020-12-31');await page.locator('#cutoff-date').press('Tab');
  await page.getByRole('button',{name:'Play timeline',exact:true}).click();await page.clock.runFor(1101);
  await expect(page.locator('#cutoff-date')).toHaveValue('2021-12-31');
  await page.getByRole('button',{name:'Pause timeline',exact:true}).click();
});

test('export preserves selected results, historical evidence and no slide metadata',async({page})=>{
  await page.locator('#model-filter').selectOption('GPT-5.4');
  const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Export data',exact:false}).click();
  const download=await pending,stream=await download.createReadStream();let text='';for await(const chunk of stream)text+=chunk.toString();
  const data=JSON.parse(text);
  expect(data.measurements).toHaveLength(3);expect(data.historicalTrackMilestones).toHaveLength(10);
  expect(data.measurements.every(item=>item.model==='GPT-5.4')).toBe(true);
  expect(data.studies.every(item=>!Object.hasOwn(item,'presentationSlides'))).toBe(true);
  expect(data.sourceCatalog.some(item=>item.id==='mira-2026-source')).toBe(true);
});

test('page remains compact and fits mobile and desktop without horizontal page overflow',async({page})=>{
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  const height=await page.locator('#chart-knowledge').evaluate(element=>element.getBoundingClientRect().height);
  expect(height).toBeLessThan(800);
  await expect(page.locator('.chart-thumbnail svg').first()).toBeVisible();
  const chart=await page.locator('.overview-scroll').evaluate(element=>({width:element.clientWidth,scroll:element.scrollWidth,left:element.scrollLeft,svg:element.querySelector('svg').getBoundingClientRect().width}));
  expect(chart.scroll-chart.width).toBeLessThanOrEqual(1);
  expect(chart.svg-chart.width).toBeLessThanOrEqual(1);
  expect(chart.left).toBe(0);
});


test('chart image export downloads a real PNG',async({page})=>{
  const pending=page.waitForEvent('download');
  await page.locator('[data-chart-export="overview"]').click();
  const download=await pending,stream=await download.createReadStream();
  const chunks=[];for await(const chunk of stream)chunks.push(chunk);
  const data=Buffer.concat(chunks);
  expect(download.suggestedFilename()).toMatch(/\.png$/);
  expect([...data.subarray(0,8)]).toEqual([137,80,78,71,13,10,26,10]);
  expect(data.length).toBeGreaterThan(1000);
});

test('copied chart link restores date and destination',async({page})=>{
  await page.evaluate(()=>{window.__copiedText='';Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copiedText=text;}}});});
  await page.locator('#cutoff-date').fill('2025-06-30');await page.locator('#cutoff-date').press('Tab');
  await page.locator('[data-chart-copy="chart-knowledge"]').click();
  await expect(page.locator('[data-chart-copy="chart-knowledge"]')).toHaveText('Copied');
  const link=await page.evaluate(()=>window.__copiedText);
  expect(new URL(link).searchParams.get('cutoff')).toBe('2025-06-30');
  expect(new URL(link).hash).toBe('#chart-knowledge');
  await page.goto(link);
  await expect(page.locator('#cutoff-date')).toHaveValue('2025-06-30');
  await expect(page).toHaveURL(/#chart-knowledge$/);
});

test('scientific curves retain source-defined axes, solid lines and original-study access',async({page})=>{
  const charts=page.locator('.scientific-chart-svg');
  await expect(charts).toHaveCount(3);
  for(const chart of await charts.all()){
    await expect(chart).toHaveAttribute('aria-label',/Not a time trend/);
    await expect(chart).toHaveAttribute('data-axis-type',/quantitative|ordinal/);
    const curve=chart.locator('.scientific-curve');
    await expect(curve).toHaveAttribute('data-source-id',/.+/);
    await expect(curve).toHaveAttribute('data-comparison-group',/.+/);
    expect(await curve.evaluate(element=>getComputedStyle(element).strokeDasharray)).toBe('none');
  }
  await page.locator('.scientific-point[data-trend-point="trend-mab-hard"]').press('Enter');
  await expect(page.getByRole('dialog')).toContainText('33.33');
  await expect(page.getByRole('dialog')).toContainText(/simulat/i);
  await expect(page.getByRole('dialog').getByRole('link',{name:/Source/})).toHaveAttribute('href',/arxiv\.org\/html\/2501\.14654v2/);
  await page.keyboard.press('Escape');
  await page.locator('#cutoff-date').fill('2025-03-01');await page.locator('#cutoff-date').press('Tab');
  await expect(charts).toHaveCount(1);
  await expect(page.locator('#chart-autonomy .scientific-chart-svg')).toBeVisible();
  await expect(page.locator('#chart-knowledge .scientific-chart-svg,#chart-assistance .scientific-chart-svg')).toHaveCount(0);
  await page.locator('#cutoff-date').fill('2025-02-11');await page.locator('#cutoff-date').press('Tab');
  await expect(charts).toHaveCount(0);
});


test('human reference is benchmark-specific and opens its protocol',async({page})=>{
  await page.locator('.scientific-chart [data-trend-point="trend-hbp-physicians"]').click();
  await expect(page.getByRole('dialog')).toContainText('43.7');
  await expect(page.getByRole('dialog')).toContainText('not a universal physician');
  await page.getByRole('dialog').locator('summary').click();
  await expect(page.getByRole('dialog')).toContainText('no time limit');
});
