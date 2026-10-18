// Source-native cross-sectional curves, not calendar-time progress measurements.
// Values are transcribed from exact table entries or printed figure labels.
// Existing sourceCatalog entries supply the three original publications.
export const trendSources = [];

export const trendSeries = [
  {
    id: 'medxpert-qwen-size', trackId: 'knowledge', date: '2025-06-06',
    title: 'Knowledge vs model size',
    subtitle: 'Qwen2.5 · MedXpertQA Text',
    xLabel: 'Model size (billion parameters)', xType: 'quantitative',
    yLabel: 'Accuracy (%)', unit: '%', sourceId: 'medxpertqa-v3',
    sourceUrl: 'https://arxiv.org/html/2501.18362v3',
    sourceDetail: 'Table 5, Text Avg; Sections 4.1/4.2',
    comparisonGroup: 'medxpertqa-v3-qwen25-instruct-text-full-zero-shot-cot',
    benchmark: 'MedXpertQA Text', subset: 'Full text test · n=2,450',
    environment: 'benchmark',
    system: 'Qwen2.5 Instruct models under the authors’ evaluation protocol',
    setting: 'Zero-shot CoT; greedy decoding where available.',
    note: 'Fixed study comparison. Two model sizes, one published protocol. Connecting segments guide the eye; intermediate sizes were not measured.',
    limitations: 'Cross-sectional comparison, not a time trend or an isolated causal effect of parameter count. No patient-benefit endpoint. Uncertainty intervals are not reported here.',
    points: [
      { id:'trend-qwen32', x:32, xLabel:'32B', model:'Qwen2.5-32B-Instruct', score:15.06 },
      { id:'trend-qwen72', x:72, xLabel:'72B', model:'Qwen2.5-72B-Instruct', score:18.90 }
    ]
  },
  {
    id: 'healthbench-gpt5-sequence', trackId: 'assistance', date: '2026-04-30',
    humanReference: { id:'trend-hbp-physicians', label:'Physician responses', score:43.7 },
    title: 'Clinical answers across model versions',
    subtitle: 'GPT-5 family · HealthBench Professional',
    xLabel: 'Model version (not time)', xType: 'ordinal',
    yLabel: 'Length-adjusted rubric score', unit: 'points', sourceId: 'healthbench-pro-v1',
    sourceUrl: 'https://arxiv.org/html/2604.27470v1',
    sourceDetail: 'Figure 4, Overall panel; Sections 4.1–4.3 and 5.1',
    comparisonGroup: 'healthbench-pro-v1-gpt5-family-base-api-highest-available-reasoning',
    benchmark: 'HealthBench Professional', subset: 'Overall · n=525',
    environment: 'benchmark',
    system: 'Base API models, without the ChatGPT for Clinicians or browsing harness',
    setting: 'Highest available reasoning effort for each model; default verbosity and API system message; eight samples per task. GPT-5.4 low-reasoning grader; authors’ length adjustment.',
    note: 'Fixed study comparison. Same benchmark; each model uses its highest available reasoning setting. These are model categories, not a historical evaluation series.',
    limitations: 'Provider-led benchmark enriched for difficult tasks. Configurations follow the published comparison but reasoning budgets differ by model. Rubric points are not percentage accuracy or patient benefit. Original 95% intervals are not reproduced; do not infer significant differences from small score gaps.',
    points: [
      { id:'trend-hbp-gpt5', x:0, xLabel:'GPT-5', model:'GPT-5', score:46.2 },
      { id:'trend-hbp-gpt52', x:1, xLabel:'GPT-5.2', model:'GPT-5.2', score:45.9 },
      { id:'trend-hbp-gpt54', x:2, xLabel:'GPT-5.4', model:'GPT-5.4', score:48.1 }
    ]
  },
  {
    id: 'medagent-gpt4o-difficulty', trackId: 'autonomy', date: '2025-02-12',
    title: 'Workflow success vs task difficulty',
    subtitle: 'GPT-4o · MedAgentBench virtual EHR',
    xLabel: 'Required task steps', xType: 'ordinal',
    yLabel: 'First-attempt success (%)', unit: '%', sourceId: 'medagentbench-v2',
    sourceUrl: 'https://arxiv.org/html/2501.14654v2',
    sourceDetail: 'Appendix A.3, Table 4, GPT-4o row; Sections 2.4/2.5',
    comparisonGroup: 'medagentbench-v2-gpt4o-pass1-8rounds-difficulty-profile',
    benchmark: 'MedAgentBench', subset: 'Easy / medium / hard task groups; 300 tasks overall',
    environment: 'simulation',
    system: 'Authors’ GPT-4o agent with FHIR tools',
    setting: 'pass@1; maximum eight interaction rounds; temperature 0. GET executed; POST writes simulated and checked.',
    note: 'Fixed study comparison. One agent, three task groups: 1, 2 and at least 3 required steps. The declining curve shows task difficulty, not deterioration over time.',
    limitations: 'Groups contain different tasks; step count is not a controlled intervention on identical cases. Last category is ≥3 steps, not exactly 3. Virtual EHR simulation, not real autonomous patient care. No uncertainty intervals are reported.',
    points: [
      { id:'trend-mab-easy', x:0, xLabel:'1 step', model:'GPT-4o', score:86.67 },
      { id:'trend-mab-medium', x:1, xLabel:'2 steps', model:'GPT-4o', score:70.00 },
      { id:'trend-mab-hard', x:2, xLabel:'≥3 steps', model:'GPT-4o', score:33.33 }
    ]
  }
];

export const trendPoints = trendSeries.flatMap(series => series.points.map(point => ({
  ...point,
  seriesId: series.id, trackId: series.trackId, date: series.date,
  dateBasis: 'publication', sourceId: series.sourceId, sourceUrl: series.sourceUrl,
  sourceDetail: series.sourceDetail, comparisonGroup: series.comparisonGroup,
  title: `${series.subtitle} · ${point.xLabel}`,
  kind: 'Published benchmark comparison', benchmark: series.benchmark,
  subset: series.subset, unit: series.unit, environment: series.environment,
  system: series.system, setting: series.setting,
  design: series.note,
  finding: `${point.model}: ${point.score} ${series.unit} at ${point.xLabel}.`,
  limitations: series.limitations,
  locator: series.sourceDetail
})));

const humanSeries=trendSeries.find(series=>series.humanReference);
trendPoints.push({
  ...trendPoints.find(point=>point.seriesId===humanSeries.id),
  id:humanSeries.humanReference.id, title:'Physician-written responses',
  model:'Specialty-matched physicians', score:43.7, isHuman:true,
  finding:'43.7 length-adjusted rubric points on HealthBench Professional.',
  design:'Same 525 tasks and grading procedure as the model comparison. Physicians had specialty familiarity, web access and no time limit, without AI assistance.',
  limitations:'A benchmark-specific response baseline, not a universal physician ability threshold. Provider-led, difficulty-enriched benchmark; automated rubric grading. Original confidence intervals are not reproduced here; small score gaps do not establish significant differences.',
  locator:'Figure 4 Overall; Sections 3.6, 4.2 and 4.3'
});
