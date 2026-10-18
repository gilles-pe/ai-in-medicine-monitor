import { test,expect } from '@playwright/test';
const results=page=>page.locator('.result-row');

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
});

test('overview retains four solid curves, three scenarios, early years and AlphaFold sources',async({page})=>{
  await expect(page.locator('#cutoff-date')).toHaveAttribute('min','1950-01-01');
  await expect(page.locator('#cutoff-date')).toHaveAttribute('max','2030-12-31');
  await expect(page.locator('.overview-line:not(.scenario-line)')).toHaveCount(4);
  await expect(page.locator('.scenario-line')).toHaveCount(3);
  await expect(page.locator('.overview-point')).toHaveCount(22);
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
    await expect(preview.locator('line')).not.toHaveCount(0);
    await preview.click();await expect(page).toHaveURL(new RegExp('#chart-'+id+'$'));
    await expect(page.locator('#chart-'+id)).toBeInViewport();
    await page.locator('#chart-'+id+' .back-link').click();await expect(page).toHaveURL(/#charts$/);
    await expect(page.locator('#charts')).toBeInViewport();
  }
  await page.locator('.chart-thumbnail').first().click();
  await page.locator('#chart-knowledge .track-navigation a').click();await expect(page).toHaveURL(/#chart-assistance$/);
});

test('benchmark comparisons show actual scaled lines and source details with focus restored',async({page})=>{
  const trigger=results(page).first();
  const id=await trigger.getAttribute('data-point-id');
  await expect(trigger.locator('.score-line i')).toBeVisible();
  await expect(trigger.locator('.score-line')).toHaveAttribute('style','--value:30.37%');
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
  const scroll=await page.locator('.overview-scroll').evaluate(element=>({width:element.clientWidth,left:element.scrollLeft}));
  if(scroll.width<600)expect(scroll.left).toBeGreaterThan(0);
});
