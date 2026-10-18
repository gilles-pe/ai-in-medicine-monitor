import { test, expect } from '@playwright/test';

const pointButtons = (page) => page.locator('[data-point-id]:visible');

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-17T12:00:00Z') });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/AI\s+in\s+Medicine\s+Monitor/);
});

test('opens a working overview with three evidence tracks', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.reload();
  await expect(page.getByRole('tab', { name: 'Verlauf', exact: true })).toHaveAttribute('aria-selected', 'true');
  for (const track of ['knowledge', 'assistance', 'autonomy']) {
    await expect(page.locator(`[data-track="${track}"]`)).toBeVisible();
  }
  await expect(pointButtons(page).first()).toBeVisible();
  await expect(page.locator('#time-slider')).toHaveAttribute('min', '0');
  expect(Number(await page.locator('#time-slider').getAttribute('max'))).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('PPT-style overview starts in 1950, exposes AlphaFold and uses the requested header', async ({ page }) => {
  await expect(page.locator('.brand-mark')).toHaveCount(0);
  await expect(page.getByText('FORTSCHRITT MIT QUELLEN', {exact:true})).toHaveCount(0);
  await expect(page.locator('#editorial-check')).toHaveText('Letztes Update: 18.10.2026');
  await expect(page.locator('#cutoff-date')).toHaveAttribute('min','1950-01-01');
  await expect(page.locator('#cutoff-date')).toHaveAttribute('max','2030-12-31');
  await expect(page.locator('.overview-scroll svg')).toBeVisible();
  const chartViewport = await page.locator('.overview-scroll').evaluate(element => ({width:element.clientWidth,left:element.scrollLeft,content:element.scrollWidth}));
  if (chartViewport.width < 600 && chartViewport.content > chartViewport.width) expect(chartViewport.left).toBeGreaterThan(0);
  await expect(page.locator('[data-history-id="alphafold3-2024"]')).toBeVisible();
  await page.locator('#cutoff-date').fill('2020-12-31');
  await page.locator('#cutoff-date').press('Tab');
  await expect(page.locator('[data-history-id="alphafold3-2024"]')).toHaveCount(0);
  await page.locator('[data-history-id="alphafold2-2020"]').click();
  await expect(page.locator('#detail-dialog')).toContainText('CASP14');
  await expect(page.locator('#detail-dialog a')).toHaveAttribute('href',/deepmind.google/);
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Heute',exact:true}).click();
  await expect(page.locator('[data-history-id="alphafold3-2024"]')).toBeVisible();
  await expect(page.locator('.scenario-line')).toHaveCount(3);
});

test('opens a source-backed detail dialog and restores keyboard focus', async ({ page }) => {
  const trigger = pointButtons(page).first();
  const pointId = await trigger.getAttribute('data-point-id');
  await trigger.click();
  const dialog = page.locator('#detail-dialog');
  await expect(dialog).toBeVisible();
  const original = dialog.getByRole('link', { name: 'Originalquelle öffnen', exact: true });
  await expect(original).toHaveAttribute('href', /^https:\/\//);
  await dialog.getByRole('button', { name: 'Schließen', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator(`[data-point-id="${pointId}"]`)).toBeFocused();
  await page.locator(`[data-point-id="${pointId}"]`).click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});

test('date cutoff hides future evidence and Heute restores it', async ({ page }) => {
  const initialCount = await pointButtons(page).count();
  expect(initialCount).toBeGreaterThan(0);
  await page.locator('#cutoff-date').fill('2025-01-01');
  await page.locator('#cutoff-date').press('Tab');
  await expect(pointButtons(page)).toHaveCount(0);
  for (const track of ['knowledge', 'assistance', 'autonomy']) {
    await expect(page.locator(`[data-track="${track}"]`)).toContainText(/keine|noch kein/i);
  }
  await page.getByRole('button', { name: 'Heute', exact: true }).click();
  await expect(pointButtons(page)).toHaveCount(initialCount);
});

test('model filter reduces displayed measurements and can be reset', async ({ page }) => {
  const allCount = await pointButtons(page).count();
  const select = page.locator('#model-filter');
  const allValue = await select.inputValue();
  const modelValue = await select.locator('option').evaluateAll(
    (options, initial) => options.find((option) => !option.disabled && option.value !== initial)?.value,
    allValue,
  );
  expect(modelValue).toBeTruthy();
  await select.selectOption(modelValue);
  await expect.poll(() => pointButtons(page).count()).toBeLessThan(allCount);
  expect(await pointButtons(page).count()).toBeGreaterThan(0);
  await select.selectOption(allValue);
  await expect(pointButtons(page)).toHaveCount(allCount);
});

test('tab navigation exposes applications and source links', async ({ page }) => {
  await page.getByRole('tab', { name: 'Anwendungen', exact: true }).click();
  await expect(page).toHaveURL(/#anwendungen$/);
  await expect(page.getByRole('tab', { name: 'Anwendungen', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#content')).toBeFocused();
  await expect(page.locator('#content')).not.toBeEmpty();

  await page.getByRole('tab', { name: 'Quellen', exact: true }).click();
  await expect(page).toHaveURL(/#quellen$/);
  await expect(page.getByRole('tab', { name: 'Quellen', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#content')).toBeFocused();
  const sourceLinks = page.locator('#content').getByRole('link', { name: 'Originalquelle öffnen', exact: true });
  expect(await sourceLinks.count()).toBeGreaterThan(0);
  for (const link of await sourceLinks.all()) {
    await expect(link).toHaveAttribute('href', /^https:\/\//);
  }

  await page.getByRole('tab', { name: 'Verlauf', exact: true }).click();
  await expect(page).toHaveURL(/#verlauf$/);
  await expect(page.locator('[data-track="knowledge"]')).toBeVisible();
});

test('presentation mode can be entered and exited with Escape', async ({ page }) => {
  await page.getByRole('button', { name: 'Vortragsmodus', exact: true }).click();
  await expect(page.locator('body')).toHaveClass(/presentation-mode/);
  await expect(page.getByRole('button', { name: 'Vortrag beenden', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('body')).not.toHaveClass(/presentation-mode/);
  await expect(page.getByRole('button', { name: 'Vortragsmodus', exact: true })).toBeVisible();
});

test('exports the selected model as a readable JSON snapshot', async ({ page }) => {
  const select = page.locator('#model-filter');
  const allValue = await select.inputValue();
  const modelValue = await select.locator('option').evaluateAll(
    (options, initial) => options.find((option) => !option.disabled && option.value !== initial)?.value,
    allValue,
  );
  expect(modelValue).toBeTruthy();
  await select.selectOption(modelValue);
  await expect(pointButtons(page).first()).toBeVisible();
  const cutoff = await page.locator('#cutoff-date').inputValue();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Daten exportieren', exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^ai-in-medicine-monitor-\d{4}-\d{2}-\d{2}\.json$/);
  expect(await download.failure()).toBeNull();
  const stream = await download.createReadStream();
  expect(stream).not.toBeNull();
  let content = '';
  for await (const chunk of stream) content += chunk.toString();
  const snapshot = JSON.parse(content);
  expect(snapshot.title).toBe('AI in Medicine Monitor');
  expect(snapshot.model).toBe(modelValue);
  expect(snapshot.cutoff).toBe(cutoff);
  expect(Array.isArray(snapshot.measurements)).toBe(true);
  expect(snapshot.measurements.length).toBeGreaterThan(0);
  expect(snapshot.measurements.every((row) => row.model === modelValue && row.date <= cutoff)).toBe(true);
  expect(Array.isArray(snapshot.sourceCatalog)).toBe(true);
});

test('study library filters topics and publication dates and opens original evidence', async ({ page }) => {
  await page.getByRole('tab', { name:'Studien', exact:true }).click();
  await expect(page.locator('[data-study-card]')).toHaveCount(6);
  await expect(page.locator('#model-filter')).not.toBeVisible();
  await page.getByRole('button', { name:'Pharmaforschung', exact:true }).click();
  await expect(page.locator('[data-study-card]')).toHaveCount(3);
  await page.locator('[data-study-card="alphafold2"] button').click();
  await expect(page.locator('#detail-dialog')).toContainText('0,96 Å');
  await expect(page.locator('#detail-dialog a')).toHaveAttribute('href','https://www.nature.com/articles/s41586-021-03819-2');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name:'Lernen & Kompetenz', exact:true }).click();
  await expect(page.locator('[data-study-card]')).toHaveCount(1);
  await page.locator('#cutoff-date').fill('2026-10-03');
  await page.locator('#cutoff-date').press('Tab');
  await expect(page.locator('[data-study-card]')).toHaveCount(0);
  await page.getByRole('button', { name:'Heute', exact:true }).click();
  await expect(page.locator('[data-study-card="learning-impact"]')).toBeVisible();
});

test('Pharma applications link to evidence and JSON retains study context', async ({ page }) => {
  await page.getByRole('tab', { name:'Anwendungen', exact:true }).click();
  await expect(page.getByRole('heading', { name:'Pharma & Apotheke', exact:true })).toBeVisible();
  await page.getByRole('button', { name:'Pharma-Studien und Befunde öffnen', exact:true }).click();
  await expect(page).toHaveURL(/#studien$/);
  await page.getByRole('button', { name:'Klinische Simulation', exact:true }).click();
  await expect(page.locator('[data-study-card]')).toHaveCount(2);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name:'Daten exportieren', exact:true }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  let text = '';
  for await (const chunk of stream) text += chunk.toString();
  const snapshot = JSON.parse(text);
  expect(snapshot.studyTopic).toBe('simulation');
  expect(snapshot.studies.map(x => x.id)).toEqual(['residencyrl','mira']);
  expect(snapshot.studies[0].environment).toBe('simulation');
  expect(snapshot.sourceCatalog.some(x => x.id === snapshot.studies[0].sourceId)).toBe(true);
});

test('every view fits the viewport without horizontal scrolling', async ({ page }) => {
  for (const name of ['Verlauf', 'Anwendungen', 'Studien', 'Quellen']) {
    await page.getByRole('tab', { name, exact: true }).click();
    await expect(page.locator('#content')).toBeVisible();
    const overflow = await page.evaluate(
      () => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
    );
    expect(overflow, `${name} overflows horizontally`).toBeLessThanOrEqual(1);
  }
});


test('overview sources and benchmark thumbnails work with keyboard and date filtering', async ({ page }) => {
  await expect(page.locator('#time-slider')).toHaveAttribute('max','80');
  await expect(page.locator('.overview-axis-title').first()).toHaveText('IQ zur Verdeutlichung');
  await expect(page.locator('.overview-point')).toHaveCount(22);
  await page.locator('.overview-point[data-overview-cluster="mira-2026,residency-2026"]').press('Enter');
  await expect(page.locator('#detail-dialog')).toContainText('2 Studien');
  await page.locator('#detail-dialog [data-overview-point="mira-2026"]').click();
  await expect(page.locator('#detail-dialog a')).toHaveAttribute('href','https://www.nature.com/articles/s41586-026-10675-5');
  await page.keyboard.press('Escape');
  await page.locator('.point-index summary').click();
  const trigger = page.locator('.point-index-list [data-overview-point="mira-2026"]');
  await trigger.focus();
  await trigger.press('Enter');
  await expect(page.locator('#detail-dialog')).toContainText('MIRA');
  await expect(page.locator('#detail-dialog')).toContainText('vertikale Position ist schematisch');
  await expect(page.locator('#detail-dialog a')).toHaveAttribute('href','https://www.nature.com/articles/s41586-026-10675-5');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.locator('.chart-thumbnail')).toHaveCount(3);
  await page.locator('.benchmark-details summary').click();
  await page.locator('.chart-thumbnail[data-track-link="assistance"]').click();
  await expect(page.locator('[data-track="assistance"]')).toBeVisible();
  await expect(page.locator('.benchmark-details')).toHaveAttribute('open','');
  await page.locator('#cutoff-date').fill('2026-06-16');
  await page.locator('#cutoff-date').press('Tab');
  await expect(page.locator('.overview-point[data-overview-point="mira-2026"]')).toHaveCount(0);
});


test('lower tracks show early milestones with correct evidence types, trust context and export', async ({page})=>{
  for(const id of ['knowledge','assistance','autonomy']) {
    await expect(page.locator(`[data-track="${id}"] .milestone-reading`)).toHaveCount(3);
  }
  await expect(page.locator('[data-track="autonomy"]')).toContainText('Präklinische Chirurgie');
  const ayers=page.locator('.milestone-reading [data-track-milestone="lower-ayers-2023"]');
  await ayers.click();
  await expect(page.locator('#detail-dialog')).toContainText('Keine Messung von Patientenvertrauen');
  await expect(page.locator('#detail-dialog a')).toHaveAttribute('href','https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2804309');
  await page.keyboard.press('Escape');
  await expect(ayers).toBeFocused();
  await page.locator('[data-track-milestone="nov-trust-2023"]').click();
  await expect(page.locator('#detail-dialog')).toContainText('3,4/5');
  await expect(page.locator('#detail-dialog a')).toHaveAttribute('href','https://mededu.jmir.org/2023/1/e46939/');
  await page.keyboard.press('Escape');
  await page.locator('.milestone-anchor[data-track-milestone="lower-star-2022"]').press('Enter');
  await expect(page.locator('#detail-dialog')).toContainText('keine Operation ohne menschliche Aufsicht');
  await page.keyboard.press('Escape');
  await page.locator('#cutoff-date').fill('2023-04-27');
  await page.locator('#cutoff-date').press('Tab');
  await expect(page.locator('[data-track-milestone="lower-ayers-2023"]')).toHaveCount(0);
  await expect(page.locator('[data-track="knowledge"] .milestone-reading')).toHaveCount(2);
  await page.locator('#cutoff-date').fill('2022-01-26');
  await page.locator('#cutoff-date').press('Tab');
  await expect(page.locator('.milestone-reading')).toHaveCount(1);
  await page.getByRole('button',{name:'Heute',exact:true}).click();
  await page.locator('#model-filter').selectOption('GPT-5.4');
  await expect(page.locator('.milestone-reading')).toHaveCount(9);
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Daten exportieren',exact:true}).click();
  const stream=await (await downloadPromise).createReadStream();
  let text='';for await(const chunk of stream)text+=chunk.toString();
  const snapshot=JSON.parse(text);
  expect(snapshot.historicalTrackMilestones).toHaveLength(10);
  expect(snapshot.historicalTrackMilestones.every(item=>snapshot.sourceCatalog.some(source=>source.id===item.sourceId))).toBe(true);
});
