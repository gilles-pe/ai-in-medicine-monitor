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
    label: "Medical knowledge",
    subtitle: "Knowledge and case solving",
    unit: '%',
    color: '#209b8e',
    metricDescription: "MedXpertQA Text: correct answers on the full text test. Does not measure patient benefit."
  },
  {
    id: 'assistance',
    label: "Clinical assistance",
    subtitle: "Quality of clinical answers",
    unit: "points",
    color: '#d49b32',
    metricDescription: "HealthBench Professional: length-adjusted rubric score. Points on a 0–100 scale, not percentage accuracy."
  },
  {
    id: 'autonomy',
    label: "Autonomous workflows",
    subtitle: "Virtual EHR test",
    unit: '%',
    color: '#4d7dbe',
    metricDescription: "MedAgentBench: first-attempt success rate in a simulated electronic health record."
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
    kind: "Research publication",
    summary: "Tables 4 and 5, overall text score; 2,450 test items. Zero-shot CoT under the authors' protocol. Smaller o1/o3-mini samples are excluded here."
  },
  {
    id: 'healthbench-pro-v1',
    title: 'HealthBench Professional: Evaluating Large Language Models on Real Clinician Chats',
    url: 'https://arxiv.org/html/2604.27470v1',
    publisher: 'OpenAI et al.',
    version: 'arXiv 2604.27470v1 · 30.04.2026',
    checkedAt: '2026-10-17',
    kind: "Preprint · provider involvement",
    summary: "Sections 4.1–4.3, 5.1 and 5.3; 525 tasks, eight answers per task. GPT-5.4 with low reasoning is the evaluator. Provider and system comparison with length adjustment."
  },
  {
    id: 'medagentbench-v2',
    title: 'MedAgentBench: A Realistic Virtual EHR Environment to Benchmark Medical LLM Agents',
    url: 'https://arxiv.org/html/2501.14654v2',
    publisher: 'Jiang et al., Stanford',
    version: 'arXiv 2501.14654v2 · 12.02.2025',
    checkedAt: '2026-10-17',
    kind: 'Preprint',
    summary: "Table 3, overall success rate; 300 tasks, pass@1, maximum eight rounds. Same authors' orchestration; GET executed, POST writes simulated and checked."
  }
];

const knowledgeBase = {
  trackId: 'knowledge',
  date: '2025-06-06',
  dateBasis: 'publication',
  benchmark: 'MedXpertQA',
  benchmarkVersion: 'Paper v3 (2501.18362v3)',
  subset: "Text · full test · n=2,450",
  comparisonGroup: 'medxpertqa-v3-text-full-authors-zero-shot-cot',
  sourceId: 'medxpertqa-v3',
  sourceDetail: "Tables 4/5 · Text Avg · Sections 4.1/4.2",
  system: "Authors' evaluation protocol",
  setting: "Zero-shot CoT; greedy decoding where available.",
  limitations: "Historical exam benchmark. No evidence of clinical deployment; uncertainty intervals are not reproduced here. Publication date is used because the evaluation date is unknown.",
  environment: 'benchmark',
  isHuman: false
};

const assistanceBase = {
  trackId: 'assistance',
  date: '2026-04-30',
  dateBasis: 'publication',
  benchmark: 'HealthBench Professional',
  benchmarkVersion: 'Paper v1 (2604.27470v1)',
  subset: "Overall · n=525",
  sourceId: 'healthbench-pro-v1',
  sourceDetail: "Sections 5.1/5.3 · length-adjusted overall score",
  limitations: "Provider involvement; system configuration affects the score. Not percentage accuracy or a patient-benefit endpoint. The original reports 95% intervals, which are not reproduced numerically here; do not infer significant ranking differences. Evaluation date unknown.",
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
  sourceDetail: "Table 3 · Overall SR · Sections 2.4/2.5",
  system: "Authors' agent with FHIR tools",
  setting: "pass@1; maximum eight rounds; temperature 0.",
  limitations: "Virtual EHR test, not real autonomous care. POST actions are simulated. The paper does not specify every provider's model snapshot; uncertainty is not reported. Publication date is used because the evaluation date is unknown.",
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
    system: "GPT-5.4 · base API",
    score: 48.1,
    comparisonGroup: 'hbp-v1-base-api-xhigh-default-verbosity',
    setting: "Default API prompt; xhigh reasoning; default verbosity."
  },
  {
    ...assistanceBase,
    id: 'hbp-gpt54-browsing',
    model: 'GPT-5.4',
    system: "GPT-5.4 · browsing harness",
    score: 45.8,
    comparisonGroup: 'hbp-v1-gpt54-browsing-harness',
    setting: "Simple authors' harness with web search; a separate system configuration."
  },
  {
    ...assistanceBase,
    id: 'hbp-chatgpt-clinicians',
    model: 'GPT-5.4',
    system: 'ChatGPT for Clinicians',
    score: 59.0,
    comparisonGroup: 'hbp-v1-chatgpt-for-clinicians-harness',
    setting: "Product harness with its own tools and prompt configuration."
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
    title: "Measuring autonomy in a virtual EHR",
    category: 'research',
    summary: "MedAgentBench v2 publishes a system comparison in a virtual patient record.",
    sourceId: 'medagentbench-v2',
    environment: 'simulation',
    limitations: "Publication event. No evidence of safe routine deployment."
  },
  {
    id: 'milestone-medxpertqa-v3',
    date: '2025-06-06',
    title: "Challenging medical tasks",
    category: 'research',
    summary: "MedXpertQA v3 is the reference version for this historical text comparison.",
    sourceId: 'medxpertqa-v3',
    environment: 'benchmark',
    limitations: "Publication event. Task performance does not replace clinical validation."
  },
  {
    id: 'milestone-healthbench-pro-v1',
    date: '2026-04-30',
    title: "Assistance as system performance",
    category: 'research',
    summary: "HealthBench Professional compares answer quality across different GPT-5.4 system configurations.",
    sourceId: 'healthbench-pro-v1',
    environment: 'benchmark',
    limitations: "Publication event with provider involvement. Not a prospective clinical study."
  }
];

sourceCatalog.push(...pharmaSources);
sourceCatalog.push(...historySources, ...pointSources, ...trackSources);
milestones.push(...pharmaMilestones);

export const editorialStatus = {
  updatedAt: '2026-10-18',
  checkedAt: '2026-10-18',
  coverageNote: "Historical starter dataset from three original papers: 13 measurements. Not a complete market overview or a claim about current leading performance. Each track currently contains one publication version, so it cannot establish a time trend.",
  updateNote: "Historical milestones added on 18 October 2026; benchmark values unchanged. No automatic updates or independent expert review yet. New values require source and methodology checks; missing data remain empty."
};
