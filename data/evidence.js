// AI in Medicine Monitor - curated historical starter data.
// Verified against the exact paper versions below on 2026-10-17.
// Dates are publication dates, never inferred model-release/evaluation dates.
// This file contains aggregate results only; no benchmark questions or patient records.

import { pharmaSources, pharmaMilestones } from './pharma.js';
import { trackSources } from './track-milestones.js';
import { pointSources } from './point-evidence.js';
import { historySources } from './history.js';
export { studies, presentationSource, pharmaApplications } from './pharma.js';

export const tracks = [
  {
    id: 'knowledge',
    label: 'Medizinisches Wissen',
    subtitle: 'Wissen und Falllösung',
    unit: '%',
    color: '#209b8e',
    metricDescription: 'MedXpertQA Text: richtige Antworten auf dem vollständigen Text-Test. Keine Aussage über Patientennutzen.'
  },
  {
    id: 'assistance',
    label: 'Medizinische Assistenz',
    subtitle: 'Qualität klinischer Antworten',
    unit: 'Punkte',
    color: '#d49b32',
    metricDescription: 'HealthBench Professional: längenbereinigter Rubrikscore. Punkte auf einer 0-100-Skala, keine Trefferquote.'
  },
  {
    id: 'autonomy',
    label: 'Selbstständige Abläufe',
    subtitle: 'Virtueller EHR-Test',
    unit: '%',
    color: '#4d7dbe',
    metricDescription: 'MedAgentBench: Erfolgsquote beim ersten Versuch in einer simulierten elektronischen Patientenakte.'
  }
];

export const sourceCatalog = [
  {
    id: 'medxpertqa-v3',
    title: 'MedXpertQA: Benchmarking Expert-Level Medical Reasoning and Understanding',
    url: 'https://arxiv.org/html/2501.18362v3',
    publisher: 'Zuo et al., Tsinghua University / Shanghai AI Laboratory',
    version: 'arXiv 2501.18362v3 · 06.06.2025',
    checkedAt: '2026-10-17',
    kind: 'Forschungspublikation',
    summary: 'Tabellen 4 und 5, Text-Gesamtscore; 2.450 Testaufgaben. Null-Beispiel-CoT nach Autorenprotokoll. Die kleineren o1/o3-mini-Stichproben sind hier ausgeschlossen.'
  },
  {
    id: 'healthbench-pro-v1',
    title: 'HealthBench Professional: Evaluating Large Language Models on Real Clinician Chats',
    url: 'https://arxiv.org/html/2604.27470v1',
    publisher: 'OpenAI et al.',
    version: 'arXiv 2604.27470v1 · 30.04.2026',
    checkedAt: '2026-10-17',
    kind: 'Preprint · Anbieterbeteiligung',
    summary: 'Abschnitte 4.1-4.3, 5.1 und 5.3; 525 Aufgaben, acht Antworten je Aufgabe. GPT-5.4 bei niedrigem Reasoning als Bewerter. Hersteller- und Systemvergleich mit Längenkorrektur.'
  },
  {
    id: 'medagentbench-v2',
    title: 'MedAgentBench: A Realistic Virtual EHR Environment to Benchmark Medical LLM Agents',
    url: 'https://arxiv.org/html/2501.14654v2',
    publisher: 'Jiang et al., Stanford',
    version: 'arXiv 2501.14654v2 · 12.02.2025',
    checkedAt: '2026-10-17',
    kind: 'Preprint',
    summary: 'Tabelle 3, Gesamt-Erfolgsquote; 300 Aufgaben, pass@1, höchstens acht Runden. Identische Autoren-Orchestrierung; GET ausgeführt, POST-Schreibaktionen nur simuliert und geprüft.'
  }
];

const knowledgeBase = {
  trackId: 'knowledge',
  date: '2025-06-06',
  dateBasis: 'publication',
  benchmark: 'MedXpertQA',
  benchmarkVersion: 'Paper v3 (2501.18362v3)',
  subset: 'Text · vollständiger Test · n=2.450',
  comparisonGroup: 'medxpertqa-v3-text-full-authors-zero-shot-cot',
  sourceId: 'medxpertqa-v3',
  sourceDetail: 'Tabellen 4/5 · Text Avg · Abschnitte 4.1/4.2',
  system: 'Autoren-Evaluationsprotokoll',
  setting: 'Null-Beispiel-CoT; greedy decoding, sofern verfügbar.',
  limitations: 'Historischer Prüfungsbenchmark. Kein klinischer Einsatznachweis; Unsicherheitsintervalle hier nicht übernommen. Publikationsdatum ersetzt unbekanntes Evaluationsdatum.',
  environment: 'benchmark',
  isHuman: false
};

const assistanceBase = {
  trackId: 'assistance',
  date: '2026-04-30',
  dateBasis: 'publication',
  benchmark: 'HealthBench Professional',
  benchmarkVersion: 'Paper v1 (2604.27470v1)',
  subset: 'Gesamt · n=525',
  sourceId: 'healthbench-pro-v1',
  sourceDetail: 'Abschnitte 5.1/5.3 · längenbereinigter Gesamtwert',
  limitations: 'Anbieterbeteiligung; Systemkonfiguration beeinflusst den Score. Keine Prozent-Trefferquote und kein Patientennutzen-Endpunkt. 95%-Intervalle im Original, hier nicht numerisch übernommen; keine Rang-Signifikanz ableiten. Evaluationsdatum unbekannt.',
  environment: 'benchmark',
  isHuman: false
};

const autonomyBase = {
  trackId: 'autonomy',
  date: '2025-02-12',
  dateBasis: 'publication',
  benchmark: 'MedAgentBench',
  benchmarkVersion: 'Paper v2 (2501.14654v2)',
  subset: 'Overall SR · n=300',
  comparisonGroup: 'medagentbench-v2-overall-authors-pass1-8rounds',
  sourceId: 'medagentbench-v2',
  sourceDetail: 'Tabelle 3 · Overall SR · Abschnitte 2.4/2.5',
  system: 'Autoren-Agent mit FHIR-Werkzeugen',
  setting: 'pass@1; maximal acht Runden; Temperatur 0.',
  limitations: 'Virtueller EHR-Test, keine reale autonome Versorgung. POST nur simuliert. Modell-Snapshot im Paper nicht für alle Anbieter präzisiert; Unsicherheit nicht berichtet. Publikationsdatum ersetzt unbekanntes Evaluationsdatum.',
  environment: 'simulation',
  isHuman: false
};

export const measurements = [
  { ...knowledgeBase, id: 'mq-gpt4o-20241120', model: 'GPT-4o-2024-11-20', score: 30.37 },
  { ...knowledgeBase, id: 'mq-claude35-20241022', model: 'Claude-3.5-Sonnet-20241022', score: 21.31 },
  { ...knowledgeBase, id: 'mq-gemini15pro002', model: 'Gemini-1.5-Pro-002', score: 19.67 },
  { ...knowledgeBase, id: 'mq-deepseekv3', model: 'DeepSeek-V3', score: 24.16 },
  { ...knowledgeBase, id: 'mq-llama33-70b', model: 'LLaMA-3.3-70B', score: 24.49 },
  {
    ...assistanceBase,
    id: 'hbp-gpt54-base',
    model: 'GPT-5.4',
    system: 'GPT-5.4 · Basis-API',
    score: 48.1,
    comparisonGroup: 'hbp-v1-base-api-xhigh-default-verbosity',
    setting: 'API-Standardprompt; xhigh Reasoning; Standard-Verbosity.'
  },
  {
    ...assistanceBase,
    id: 'hbp-gpt54-browsing',
    model: 'GPT-5.4',
    system: 'GPT-5.4 · Browsing-Harness',
    score: 45.8,
    comparisonGroup: 'hbp-v1-gpt54-browsing-harness',
    setting: 'Einfaches Autoren-Harness mit Websuche; eigener Systemaufbau.'
  },
  {
    ...assistanceBase,
    id: 'hbp-chatgpt-clinicians',
    model: 'GPT-5.4',
    system: 'ChatGPT for Clinicians',
    score: 59.0,
    comparisonGroup: 'hbp-v1-chatgpt-for-clinicians-harness',
    setting: 'Produkt-Harness mit eigener Werkzeug- und Promptkonfiguration.'
  },
  { ...autonomyBase, id: 'mab-claude35v2', model: 'Claude 3.5 Sonnet v2', score: 69.67 },
  { ...autonomyBase, id: 'mab-gpt4o', model: 'GPT-4o', score: 64.0 },
  { ...autonomyBase, id: 'mab-deepseekv3', model: 'DeepSeek-V3', score: 62.67 },
  { ...autonomyBase, id: 'mab-gemini15pro', model: 'Gemini 1.5 Pro', score: 62.0 },
  { ...autonomyBase, id: 'mab-gpt4omini', model: 'GPT-4o mini', score: 56.33 }
];

export const milestones = [
  {
    id: 'milestone-medagentbench-v2',
    date: '2025-02-12',
    title: 'Autonomie wird im EHR-Test messbar',
    category: 'research',
    summary: 'MedAgentBench v2 veröffentlicht einen Systemvergleich für eine virtuelle Patientenakte.',
    sourceId: 'medagentbench-v2',
    environment: 'simulation',
    limitations: 'Publikationsereignis. Kein Beleg für sicheren Routineeinsatz.'
  },
  {
    id: 'milestone-medxpertqa-v3',
    date: '2025-06-06',
    title: 'Anspruchsvolle medizinische Aufgaben',
    category: 'research',
    summary: 'MedXpertQA v3 ist die Referenzausgabe dieses historischen Text-Vergleichs.',
    sourceId: 'medxpertqa-v3',
    environment: 'benchmark',
    limitations: 'Publikationsereignis. Aufgabenleistung ersetzt keine klinische Validierung.'
  },
  {
    id: 'milestone-healthbench-pro-v1',
    date: '2026-04-30',
    title: 'Assistenz als Systemleistung',
    category: 'research',
    summary: 'HealthBench Professional vergleicht Antwortqualität und unterschiedliche GPT-5.4-Systemaufbauten.',
    sourceId: 'healthbench-pro-v1',
    environment: 'benchmark',
    limitations: 'Publikationsereignis mit Anbieterbeteiligung. Keine prospektive Versorgungsstudie.'
  }
];

sourceCatalog.push(...pharmaSources);
sourceCatalog.push(...historySources, ...pointSources, ...trackSources);
milestones.push(...pharmaMilestones);

export const editorialStatus = {
  updatedAt: '2026-10-18',
  checkedAt: '2026-10-18',
  coverageNote: 'Historischer Startdatensatz aus drei Originalarbeiten: 13 Messpunkte. Keine vollständige Marktübersicht und keine Behauptung zum aktuellen Spitzenstand. Jede Spur enthält bislang nur eine Publikationsausgabe; daraus entsteht kein Zeittrend.',
  updateNote: 'Historische Meilensteine am 18.10.2026 ergänzt; Benchmark-Stand unverändert. Noch keine automatische Aktualisierung und keine unabhängige fachliche Freigabe. Neue Werte benötigen Quellen- und Methodikprüfung; fehlende Daten bleiben leer.'
};
