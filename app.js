import { tracks, measurements, milestones, sourceCatalog, editorialStatus, studies, presentationSource, pharmaApplications } from './data/evidence.js';
import { filterStudies } from './lib/studies.js';
import { renderOverview, visibleHistory } from './lib/overview.js';
import { filterMeasurements, latestByModel, groupComparable, frontierPoints, formatDate, escapeHtml } from './lib/selectors.js';

const $ = selector => document.querySelector(selector);
const e = escapeHtml;
const today = new Date().toISOString().slice(0, 10);
const startDate = '1950-01-01';
const endDate = '2035-12-31';
const startTime = Date.parse('2025-01-01T00:00:00Z');
const endTime = Date.parse(today + 'T00:00:00Z');
const yearCount = 85;
const state = { cutoff: today, model: '', view: 'verlauf', studyTopic: '', playing: false, presentation: false };
let playTimer = null;
const content = $('#content');
const dialog = $('#detail-dialog');
const scoreFormat = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 });
const monthFormat = new Intl.DateTimeFormat('de-DE', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const environmentNames = { benchmark: 'Benchmark', simulation: 'Simulation', clinical_study: 'Klinische Studie', routine: 'Routineeinsatz', structure_research:'Strukturbiologie', education_experiment:'Lernexperiment ohne Patienten', award:'Auszeichnung' };

function safeUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
}
function sourceLink(source) {
  const url = safeUrl(source && source.url);
  return url ? '<a class="detail-link" href="' + e(url) + '" target="_blank" rel="noopener noreferrer">Originalquelle öffnen <span aria-hidden="true">↗</span></a>' : '<span>Quellenlink nicht verfügbar</span>';
}
function score(row) {
  const track = tracks.find(item => item.id === row.trackId);
  return scoreFormat.format(row.score) + (track.unit === '%' ? ' %' : ' Punkte');
}
function visibleRows() {
  return filterMeasurements(measurements, { cutoff: state.cutoff }).filter(row => !state.model || row.model === state.model);
}
function visibleMilestones() { return milestones.filter(item => item.date <= state.cutoff).sort((a, b) => a.date.localeCompare(b.date)); }
function visibleStudies() { return filterStudies(studies, { cutoff:state.cutoff, topic:state.studyTopic }); }
function systemLabel(row) { return row.trackId === 'assistance' ? row.system : row.model; }
function announce(message) { $('#live-status').textContent = message; }
function xPosition(date) { return 40 + 930 * Math.max(0, Math.min(1, (Date.parse(date + 'T00:00:00Z') - startTime) / Math.max(1, endTime - startTime))); }
function yPosition(value) { return 143 - Math.max(0, Math.min(100, value)) * 1.1; }

function renderChart(track, rows) {
  const cutoffX = xPosition(state.cutoff);
  let shapes = [0, 50, 100].map(value => '<line class="gridline" x1="40" x2="978" y1="' + yPosition(value) + '" y2="' + yPosition(value) + '"/>').join('');
  shapes += '<rect x="' + cutoffX + '" y="22" width="' + Math.max(0, 978 - cutoffX) + '" height="123" fill="#10364106"/><line x1="' + cutoffX + '" x2="' + cutoffX + '" y1="16" y2="148" stroke="#61747c" stroke-dasharray="3 4" stroke-width="1"/>';
  for (const group of groupComparable(rows)) {
    const frontier = frontierPoints(group.measurements);
    if (frontier.length > 1) {
      let path = '';
      for (let i = 0; i < frontier.length; i++) {
        const point = frontier[i];
        path += i ? 'H' + xPosition(point.date) + 'V' + yPosition(point.score) : 'M' + xPosition(point.date) + ',' + yPosition(point.score);
      }
      shapes += '<path class="frontier-path" d="' + path + '"/>';
    }
  }
  const byDate = new Map();
  for (const row of rows) {
    const day = row.publishedAt && row.publishedAt > row.date ? row.publishedAt : row.date;
    if (!byDate.has(day)) byDate.set(day, []);
    byDate.get(day).push(row);
  }
  for (const [day, batch] of byDate) {
    const x = xPosition(day), values = batch.map(item => item.score);
    shapes += '<line class="batch-line" x1="' + x + '" x2="' + x + '" y1="' + yPosition(Math.max(...values)) + '" y2="' + yPosition(Math.min(...values)) + '"/>';
    batch.forEach(row => {
      shapes += '<circle class="plot-point" cx="' + x + '" cy="' + yPosition(row.score) + '" r="4.5"><title>' + e(systemLabel(row) + ': ' + score(row) + ', veröffentlicht ' + formatDate(day)) + '</title></circle>';
    });
    
  }
  return '<div class="chart"><div class="chart-y-labels" aria-hidden="true"><span>100</span><span>50</span><span>0</span></div><span class="chart-stand" aria-hidden="true" style="left:' + (cutoffX / 10) + '%">Stand</span><svg viewBox="0 0 1000 180" preserveAspectRatio="none" role="img" aria-label="' + e(track.label + ': ' + rows.length + ' veröffentlichte Messpunkte auf einer eigenen Skala von 0 bis 100. Detailwerte folgen als Schaltflächen.') + '">' + shapes + '</svg></div>';
}

function renderTrack(track, index, allRows) {
  const rows = allRows.filter(row => row.trackId === track.id);
  const latest = latestByModel(rows);
  const dateCount = new Set(rows.map(row => row.date)).size;
  let body;
  if (!rows.length) {
    body = '<div class="empty-state"><p>Für diesen Zeitpunkt keine Messwerte.</p><small>Im gewählten Zeitraum und Modellfilter ist für diese Spur kein belegtes Ergebnis hinterlegt.</small></div>';
  } else {
    body = renderChart(track, rows);
    body += '<div class="measurement-list">' + latest.map(row => '<button type="button" class="measurement-chip" data-point-id="' + e(row.id) + '" aria-label="' + e(systemLabel(row) + ', ' + score(row) + ', Details öffnen') + '"><span class="chip-label">' + e(systemLabel(row)) + '</span><span class="chip-score">' + e(score(row)) + '</span></button>').join('') + '</div>';
  }
  const foot = track.id === 'assistance' ? 'Verschiedene Systemaufbauten · eigene Vergleichsgruppen · Punkte, keine Trefferquote' : track.id === 'autonomy' ? 'pass@1 · virtuelle Patientenakte · Schreibaktionen im Test simuliert' : 'Text-Test · vollständiger Testsplit · keine Bildaufgaben in dieser ersten Auswahl';
  return '<section class="track" data-track="' + e(track.id) + '" aria-labelledby="track-' + e(track.id) + '" style="--track:' + e(track.color) + '"><div class="track-top"><div><div class="track-heading"><span class="track-index">0' + (index + 1) + '</span><h3 id="track-' + e(track.id) + '">' + e(track.label) + '</h3></div><p class="track-subtitle">' + e(track.subtitle) + ' <span aria-hidden="true">·</span> ' + e(track.unit === '%' ? 'Treffer-/Erfolgsquote in %' : 'Rubrikscore in Punkten') + '</p></div><div class="track-counter"><strong>' + rows.length + '</strong><small>MESSPUNKTE</small></div></div>' + body + '<p class="track-footnote">' + e(foot) + (rows.length ? ' · veröffentlicht ' + e(formatDate(rows[0].date)) : '') + (dateCount === 1 ? ' · ein Publikationsstand, noch kein Zeittrend' : '') + '</p></section>';
}

function renderEvents() {
  const events = visibleMilestones();
  return '<section class="milestones-section"><div class="section-title"><h2>Meilensteine mit Kontext</h2><p>Forschung, Lernexperiment und Auszeichnung · jeweils gekennzeichnet</p></div><p class="view-intro">Die Benchmark-Achse beginnt 2025. Frühere Pharma-Meilensteine stehen hier mit ihrem tatsächlichen Datum.</p><div class="events">' + (events.length ? events.map(item => '<article class="event"><time datetime="' + e(item.date) + '">' + e(formatDate(item.date)) + '</time><span class="event-kind">' + e(item.type || environmentNames[item.environment]) + '</span><h3>' + e(item.title) + '</h3><p>' + e(item.summary) + '</p><button type="button" data-event-id="' + e(item.id) + '">Einordnen & Quelle ↗</button></article>').join('') : '<p class="view-intro">Bis zu diesem Zeitpunkt sind noch keine Ereignisse hinterlegt.</p>') + '</div></section>';
}
function renderStudies() {
  const items = visibleStudies();
  const topics = [['','Alle'],['pharma','Pharmaforschung'],['simulation','Klinische Simulation'],['learning','Lernen & Kompetenz']];
  content.innerHTML = '<div class="section-title"><h2>Pharma & Studien</h2><p>' + items.length + ' Einträge bis ' + e(formatDate(state.cutoff)) + '</p></div><p class="view-intro">Aus dem Pharma-Vortrag: Originalarbeiten mit Befunden und Grenzen. Strukturbiologie, Simulation und Bildungsforschung beantworten unterschiedliche Fragen.</p><div class="study-filters" role="group" aria-label="Studienthema">' + topics.map(([id,label]) => '<button type="button" data-study-topic="' + id + '" aria-pressed="' + (state.studyTopic === id) + '">' + e(label) + '</button>').join('') + '</div><div class="study-grid">' + (items.length ? items.map(item => '<article class="study-card" data-study-card="' + e(item.id) + '"><div class="source-meta"><span>' + e(item.type) + '</span><time datetime="' + e(item.date) + '">' + e(formatDate(item.date)) + '</time></div><h3>' + e(item.title) + '</h3><p>' + e(item.summary) + '</p><p class="study-boundary">' + e(item.limitations) + '</p><button type="button" class="text-button" data-study-id="' + e(item.id) + '">Befunde & Studiendesign ↗</button></article>').join('') : '<p class="view-intro">Für Thema und Zeitpunkt sind keine Einträge hinterlegt.</p>') + '</div><p class="study-origin">Ausgangspunkt: <a href="' + e(safeUrl(presentationSource.url)) + '" target="_blank" rel="noopener noreferrer">Pharma-Präsentation auf Google Drive ↗</a>. Die verlinkten Originalarbeiten tragen die Evidenz.</p>';
}
function renderTimeline() {
  const rows = visibleRows();
  content.innerHTML = renderOverview(state.cutoff, today) + '<details class="benchmark-details" open><summary>Messwerte & Benchmarks <span>' + rows.length + ' veröffentlichte Punkte</span></summary><div class="section-title"><h2>Die gemessenen Fähigkeiten</h2><p>Getrennte Skalen und Testbedingungen</p></div><p class="view-intro">Diese Ergebnisse sind Originalmesswerte. Die schematische Hauptgrafik verwendet einen eigenen illustrativen Index. Der Modellfilter gilt für die Messwerte.</p>' + tracks.map((track, index) => renderTrack(track, index, rows)).join('') + '<div class="chart-axis"><span>Jan 2025</span><span>2026</span><span>' + e(monthFormat.format(new Date(today + 'T00:00:00Z'))) + '</span></div></details><details class="milestone-details"><summary>Studien und Meilensteine im Detail</summary>' + renderEvents() + '</details>';
}

function renderApplications() {
  const cards = [
    { number:'01',title:'Wissen & Falllösung',label:'Benchmark',text:'Wie gut löst ein Modell anspruchsvolle medizinische Aufgaben? Die Wissensspur zeigt einen genau definierten Text-Test.',trackId:'knowledge' },
    { number:'02',title:'Klinische Assistenz',label:'Antwortbewertung',text:'Wie hilfreich sind Antworten bei Beratung, Dokumentation und Recherche? Hier zählt das System einschließlich seiner Werkzeuge.',trackId:'assistance' },
    { number:'03',title:'Selbstständige Abläufe',label:'Simulation',text:'Kann ein Agent Informationen aus einer Patientenakte abrufen und Aufgaben korrekt vorbereiten? Diese Spur bleibt ausdrücklich ein virtueller EHR-Test.',trackId:'autonomy' }
  ];
  content.innerHTML = '<div class="section-title"><h2>Vom Test zur Anwendung</h2><p>Fähigkeit, Evidenz und Einsatz getrennt betrachten</p></div><p class="view-intro">Die drei Messspuren zeigen Sprachmodelle und klinische Agenten. Pharmaforschung und Lernen ergänzen sie als getrennte Studien- und Kontexteinträge.</p><div class="application-grid">' + cards.map(card => '<article class="application-card"><span class="application-number">' + card.number + '</span><span class="environment-label">' + card.label + '</span><h3>' + card.title + '</h3><p>' + card.text + '</p><button class="text-button" type="button" data-track-link="' + card.trackId + '">Zur Messspur ↗</button></article>').join('') + '</div><section class="source-section"><h3>Vom Durchbruch zur Versorgung</h3><p class="view-intro">Ein vereinfachter Weg am Beispiel Arzneimittelforschung. Die Stufen sind kein universelles Zulassungsschema für medizinische KI.</p><div class="journey">' + [['01','Entdeckung','Neue Ansätze und Hypothesen.'],['02','Validierung','Nachweise in definierten Modellen und Tests.'],['03','Studien','Wirksamkeit und Sicherheit im vorgesehenen Kontext prüfen.'],['04','Versorgung','Dokumentierter Einsatz und Ergebnisse im Alltag.']].map(item => '<article class="journey-step"><span>' + item[0] + '</span><h3>' + item[1] + '</h3><p>' + item[2] + '</p></article>').join('') + '</div><div class="context-note"><span aria-hidden="true">◇</span><p>Ein gutes Testergebnis allein belegt weder Patientennutzen noch sicheren Routineeinsatz. Die ergänzten Arbeiten untersuchen Strukturen, Simulationen und Lernen. Prospektive Versorgungsstudien werden jeweils gesondert gekennzeichnet.</p></div></section>';
}

function renderPharmaApplications() {
  content.insertAdjacentHTML('beforeend','<section class="source-section"><div class="section-title"><h2>Pharma & Apotheke</h2><p>Anwendungsansätze aus dem Vortrag</p></div><p class="view-intro">Diese Ideen beschreiben mögliche Workflows. Der Nutzen der hier skizzierten Systeme wurde noch nicht nachgewiesen.</p><div class="study-grid">' + pharmaApplications.map(item => '<article class="study-card"><span class="environment-label">' + e(item.status) + '</span><h3>' + e(item.title) + '</h3><p>' + e(item.text) + '</p><p class="study-boundary">' + e(item.limit) + '</p><small>Vortrag, Folien ' + e(item.slides) + '</small></article>').join('') + '</div><button type="button" class="button button-outline studies-link" data-studies-link>Pharma-Studien und Befunde öffnen <span aria-hidden="true">↗</span></button></section>');
}
function renderSources() {
  const methods = [
    ['Drei getrennte Maßstäbe','Wissen, Assistenz und Aufgabenerledigung haben eigene Skalen. Aus Prozenten und Punkten entsteht kein gemeinsamer Medizin-IQ.'],
    ['Datum mit Bedeutung','In dieser Ausgabe liegen Publikationsdaten vor. Modellveröffentlichung und Testdatum werden daraus nicht abgeleitet.'],
    ['Vergleichbare Bedingungen','Datensatz, Testsplit, Werkzeugzugriff, Budget und Bewerter gehören zum Ergebnis. Unterschiedliche Konfigurationen bleiben getrennt.'],
    ['Sichtbare Unsicherheit','Fehlende Intervalle und kleine Rangunterschiede rechtfertigen keine Aussage über eine gesicherte Überlegenheit. Grenzen stehen bei jedem Messpunkt.'],
    ['Quellenprüfung statt Live-Versprechen','Der Quellenstand ist ein Prüfdatum. Es läuft noch keine automatische wöchentliche Aktualisierung.'],
    ['Historischer Ausgangspunkt','13 Benchmark-Messpunkte aus drei Arbeiten plus fünf Studien- und Kontexteinträge. Die Auswahl bildet weder alle Anbieter noch den aktuellen Spitzenstand ab.']
  ];
  content.innerHTML = '<div class="section-title"><h2>Die Quellen hinter den Punkten</h2><p>Originalarbeiten · zuletzt geprüft ' + e(formatDate(editorialStatus.checkedAt)) + '</p></div><p class="view-intro">Jeder Messpunkt führt zur Originalquelle, zur Testkonfiguration und zu den Grenzen seiner Aussage. Der Startdatensatz ist redaktionell vorbereitet und noch nicht unabhängig fachlich freigegeben.</p><div class="source-list">' + sourceCatalog.map(source => '<article class="source-card"><div class="source-meta"><span>' + e(source.kind) + '</span><span>Geprüft ' + e(formatDate(source.checkedAt)) + '</span></div><h3>' + e(source.title) + '</h3><p>' + e(source.publisher) + ' <span aria-hidden="true">·</span> ' + e(source.version) + '</p><p>' + e(source.summary) + '</p>' + sourceLink(source) + '</article>').join('') + '</div><section class="source-section" id="methodology"><h3>Wie wir messen</h3><div class="method-grid">' + methods.map(item => '<section><h4>' + item[0] + '</h4><p>' + item[1] + '</p></section>').join('') + '</div></section>';
}
function render() {
  document.title = 'AI in Medicine Monitor';
  $('#time-controls').hidden = !['verlauf','studien'].includes(state.view);
  $('.model-control').hidden = state.view === 'studien';
  content.setAttribute('aria-labelledby', 'tab-' + state.view);
  document.querySelectorAll('[data-view]').forEach(button => {
    const active = button.dataset.view === state.view;
    button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1;
  });
  if (state.view === 'quellen') renderSources(); else if (state.view === 'anwendungen') { renderApplications(); renderPharmaApplications(); } else if (state.view === 'studien') renderStudies(); else renderTimeline();
  $('#nav-summary').textContent = '13 Messpunkte · ' + studies.length + ' Studien & Kontext';
}

function setView(view, focus = false) {
  if (!['verlauf','anwendungen','studien','quellen'].includes(view)) view = 'verlauf';
  stopPlaying();
  state.view = view;
  if (location.hash !== '#' + view) history.replaceState(null, '', '#' + view);
  render();
  if (focus) content.focus({ preventScroll: true });
}
function syncControls() {
  $('#cutoff-date').value = state.cutoff;
  const years = Number(state.cutoff.slice(0,4)) - 1950;
  $('#time-slider').value = String(Math.max(0, Math.min(yearCount, years)));
  $('#time-slider').setAttribute('aria-valuetext', state.cutoff.slice(0,4));
}
function setCutoff(value, userChange = true) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value + 'T00:00:00Z'))) { syncControls(); return; }
  const canonical = new Date(value + 'T00:00:00Z').toISOString().slice(0,10);
  if (canonical !== value) { syncControls(); return; }
  state.cutoff = value < startDate ? startDate : value > endDate ? endDate : value;
  if (userChange) stopPlaying();
  syncControls(); render();
  if (userChange) announce(visibleRows().length + ' Messpunkte bis ' + formatDate(state.cutoff));
}
function dateForYear(index) {
  return new Date(Date.UTC(1950 + index, 11, 31)).toISOString().slice(0,10);
}
function stopPlaying() {
  if (playTimer) clearInterval(playTimer);
  playTimer = null; state.playing = false;
  $('#play-button').textContent = '▶';
  $('#play-button').setAttribute('aria-label','Zeitreise abspielen');
  $('#play-button').setAttribute('aria-pressed','false');
}
function togglePlaying() {
  if (state.playing) { stopPlaying(); return; }
  if (Number($('#time-slider').value) >= yearCount) setCutoff(startDate, false);
  state.playing = true;
  $('#play-button').textContent = 'Ⅱ';
  $('#play-button').setAttribute('aria-label','Zeitreise pausieren');
  $('#play-button').setAttribute('aria-pressed','true');
  playTimer = setInterval(() => {
    const next = Number($('#time-slider').value) + 1;
    if (next > yearCount) { stopPlaying(); return; }
    setCutoff(dateForYear(next), false);
    if (next === yearCount) stopPlaying();
  }, 1100);
}
function setPresentation(on) {
  state.presentation = on;
  document.body.classList.toggle('presentation-mode', on);
  $('#present-button').innerHTML = on ? '<span aria-hidden="true">×</span> Vortrag beenden' : '<span aria-hidden="true">▷</span> Vortragsmodus';
  $('#present-button').setAttribute('aria-pressed',String(on));
  if (on) setView('verlauf');
  announce(on ? 'Vortragsmodus aktiv. Escape beendet den Modus.' : 'Vortragsmodus beendet.');
}
function detailRows(pairs) {
  return '<dl class="detail-list">' + pairs.map(([name,value]) => '<div><dt>' + e(name) + '</dt><dd>' + e(value) + '</dd></div>').join('') + '</dl>';
}
function showMeasurement(id) {
  const row = visibleRows().find(item => item.id === id);
  if (!row) return;
  stopPlaying();
  const source = sourceCatalog.find(item => item.id === row.sourceId);
  $('#detail-body').innerHTML = '<h2 class="dialog-title" id="detail-title">' + e(systemLabel(row)) + '</h2><p class="detail-score">' + e(scoreFormat.format(row.score)) + '<span>' + e(tracks.find(item => item.id === row.trackId).unit) + '</span></p><span class="environment-label">' + e(environmentNames[row.environment] || row.environment) + '</span>' + detailRows([['Modell',row.model],['System',row.system],['Benchmark',row.benchmarkVersion],['Testbereich',row.subset],['Veröffentlicht',formatDate(row.date)],['Datumsbasis',row.dateBasis === 'publication' ? 'Publikationsdatum; Evaluationsdatum unbekannt' : 'Evaluationsdatum'],['Konfiguration',row.setting],['Fundstelle',row.sourceDetail],['Vergleichsgruppe',row.comparisonGroup]]) + '<p class="detail-limit">' + e(row.limitations) + '</p>' + sourceLink(source);
  dialog.showModal();
}
function showMilestone(id) {
  stopPlaying();
  const item = visibleMilestones().find(event => event.id === id);
  if (!item) return;
  if (item.studyId) { showStudy(item.studyId); return; }
  const source = sourceCatalog.find(row => row.id === item.sourceId);
  $('#detail-body').innerHTML = '<h2 class="dialog-title" id="detail-title">' + e(item.title) + '</h2><p>' + e(item.summary) + '</p>' + detailRows([['Veröffentlicht',formatDate(item.date)],['Typ','Forschungsveröffentlichung'],['Umgebung',environmentNames[item.environment] || item.environment]]) + '<p class="detail-limit">' + e(item.limitations) + '</p>' + sourceLink(source);
  dialog.showModal();
}
function showHistory(id) {
  const item = visibleHistory(state.cutoff).find(event => event.id === id);
  if (!item) return;
  if (item.studyId) { showStudy(item.studyId); return; }
  stopPlaying();
  const source = sourceCatalog.find(row => row.id === item.sourceId);
  $('#detail-body').innerHTML = '<h2 class="dialog-title" id="detail-title">' + item.year + ' · ' + e(item.label) + '</h2><span class="environment-label">Historischer Meilenstein</span><p>' + e(item.summary) + '</p>' + detailRows([['Zeitangabe','Jahr ' + item.year + ' (ohne erfundenes Tagesdatum)']]) + '<p class="detail-limit">' + e(item.limit) + '</p>' + sourceLink(source);
  dialog.showModal();
}
function showStudy(id) {
  const item = visibleStudies().find(study => study.id === id) || studies.find(study => study.id === id && study.date <= state.cutoff);
  if (!item) return;
  stopPlaying();
  const source = sourceCatalog.find(row => row.id === item.sourceId);
  $('#detail-body').innerHTML = '<h2 class="dialog-title" id="detail-title">' + e(item.title) + '</h2><span class="environment-label">' + e(item.type) + '</span>' + detailRows([['Veröffentlicht',formatDate(item.date)],['Design',item.design],...item.findings,['Bedeutung',item.relevance],['Fundstelle',item.sourceDetail],['Im Vortrag','Folie ' + item.presentationSlides.join(', ')]]) + '<p class="detail-limit">' + e(item.limitations) + '</p>' + sourceLink(source);
  dialog.showModal();
}
function exportSnapshot() {
  const rows = visibleRows();
  const events = visibleMilestones();
  const selectedStudies = visibleStudies();
  const historicalEvents = visibleHistory(state.cutoff);
  const sourceIds = new Set([...rows.map(row => row.sourceId), ...events.map(item => item.sourceId), ...selectedStudies.map(item => item.sourceId), ...historicalEvents.map(item => item.sourceId)]);
  const payload = { title:'AI in Medicine Monitor',exportedAt:new Date().toISOString(),cutoff:state.cutoff,model:state.model,studyTopic:state.studyTopic,filterNote:'Modellfilter gilt nur für Benchmark-Messpunkte; Studien nach Thema und Publikationsdatum.',measurements:rows,milestones:events,studies:selectedStudies,historicalEvents,presentationNote:'Hauptgrafik: schematische PPT-Illustration, keine gemessenen IQ-Werte oder medizinischen Autonomiezeiten.',sourceCatalog:sourceCatalog.filter(source => sourceIds.has(source.id)),editorialStatus };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
  const link = document.createElement('a');
  link.href = url; link.download = 'ai-in-medicine-monitor-' + state.cutoff + '.json';
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url),1000);
  announce(rows.length + ' Messpunkte mit Quellen exportiert.');
}

$('#cutoff-date').max = endDate;
$('#time-slider').max = String(yearCount);
$('#range-end').textContent = '2035';
$('#editorial-check').textContent = 'Letztes Update: ' + formatDate(editorialStatus.updatedAt);
const modelNames = [...new Set(measurements.map(row => row.model))].sort((a,b) => a.localeCompare(b));
$('#model-filter').innerHTML = '<option value="">Alle Modelle</option>' + modelNames.map(model => '<option value="' + e(model) + '">' + e(model) + '</option>').join('');
$('#model-filter').addEventListener('change',event => { state.model = event.target.value; stopPlaying(); render(); announce(visibleRows().length + ' Messpunkte für ' + (state.model || 'alle Modelle')); });
$('#cutoff-date').addEventListener('change',event => setCutoff(event.target.value));
$('#time-slider').addEventListener('input',event => setCutoff(dateForYear(Number(event.target.value))));
$('#today-button').addEventListener('click',() => setCutoff(today));
$('#play-button').addEventListener('click',togglePlaying);
$('#present-button').addEventListener('click',() => setPresentation(!state.presentation));
$('#close-dialog').addEventListener('click',() => dialog.close());
$('#export-button').addEventListener('click',exportSnapshot);
$('#methods-button').addEventListener('click',() => { setView('quellen',true); $('#methodology').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}); });
document.querySelectorAll('[data-view]').forEach((button,index,buttons) => {
  button.addEventListener('click',() => setView(button.dataset.view,true));
  button.addEventListener('keydown',event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = buttons.length - 1;
    if (next !== undefined) { event.preventDefault(); setView(buttons[next].dataset.view); buttons[next].focus(); }
  });
});
content.addEventListener('click',event => {
  const history = event.target.closest('[data-history-id]');
  if (history) { showHistory(history.dataset.historyId); return; }
  const topic = event.target.closest('[data-study-topic]');
  if (topic) { state.studyTopic = topic.dataset.studyTopic; renderStudies(); content.querySelector('[data-study-topic="' + state.studyTopic + '"]').focus(); announce(visibleStudies().length + ' Studien- und Kontexteinträge'); return; }
  const study = event.target.closest('[data-study-id]');
  if (study) { showStudy(study.dataset.studyId); return; }
  if (event.target.closest('[data-studies-link]')) { setView('studien',true); return; }
  const point = event.target.closest('[data-point-id]');
  if (point) { showMeasurement(point.dataset.pointId); return; }
  const milestone = event.target.closest('[data-event-id]');
  if (milestone) { showMilestone(milestone.dataset.eventId); return; }
  const track = event.target.closest('[data-track-link]');
  if (track) { const id = track.dataset.trackLink; setView('verlauf',true); $('[data-track="' + id + '"]').scrollIntoView({block:'start'}); return; }
  if (event.target.closest('#changes-button')) { setView('quellen',true); announce('Erste Ausgabe: 13 historische Messpunkte aus drei Originalarbeiten.'); }
});
document.addEventListener('keydown',event => { if (event.key === 'Escape') { if (dialog.open) return; stopPlaying(); if (state.presentation) setPresentation(false); } });
document.addEventListener('visibilitychange',() => { if (document.hidden) stopPlaying(); });
window.addEventListener('hashchange',() => setView(location.hash.slice(1),true));
syncControls();
setView(location.hash.slice(1) || 'verlauf');
