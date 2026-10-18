// Curated from the Pharma presentation and checked against primary sources.
// Publication dates describe evidence availability, not patient outcomes.
export const presentationSource = {
  title: "AI in pharmacy: source material",
  url: 'https://docs.google.com/presentation/d/1ZmKxSpPPC5yRLxbTrwBxpkaXLGfPhZW_/edit',
  checkedAt: '2026-10-17'
};

export const studies = [
  {
    id: 'alphafold2', topic: 'pharma', topicLabel: "Drug research",
    title: "AlphaFold 2: Predicting protein structures",
    date: '2021-07-15', sourceId: 'alphafold2-nature', type: "Peer-reviewed · structure benchmark", environment: 'structure_research',
    design: "Blinded CASP14 structure comparison, 87 protein domains.",
    summary: "Substantially more accurate protein structures in the CASP14 comparison.",
    findings: [
      ["Backbone deviation", "Median 0.96 Å versus 2.8 Å for the next-best method. Lower is better."],
      ["Uncertainty", "95% confidence intervals: 0.85–1.16 Å and 2.7–4.0 Å; r.m.s.d. at 95% residue coverage."]
    ],
    relevance: "Structure models support hypotheses for drug research.",
    limitations: "Measures structure accuracy, not drug efficacy. Experimental validation and clinical development remain necessary.",
    sourceDetail: "Nature 596, 583–589; Fig. 1a and Results.", presentationSlides: [4, 5, 6, 15]
  },
  {
    id: 'alphafold3', topic: 'pharma', topicLabel: "Drug research",
    title: "AlphaFold 3: Molecular interactions",
    date: '2024-05-08', sourceId: 'alphafold3-nature', type: "Peer-reviewed · structure benchmark", environment: 'structure_research',
    design: "Comparison of predicted biomolecular complexes with experimentally determined structures.",
    summary: "Extends prediction to complexes containing proteins, DNA, RNA and small molecules.",
    findings: [["Finding", "One model covers multiple interaction types, improving on the specialized methods tested."]],
    relevance: "May support investigation of potential drug binding.",
    limitations: "Stereochemical errors, hallucinated structures and limited representation of dynamics. No clinically validated off-label treatment selection.",
    sourceDetail: "Nature 630, 493–500; Abstract and Model limitations.", presentationSlides: [4, 5, 6, 15, 20]
  },
  {
    id: 'nobel-chemistry-2024', topic: 'pharma', topicLabel: "Drug research",
    title: "Nobel Prize for protein design and structure prediction",
    date: '2024-10-09', sourceId: 'nobel-chemistry-2024', type: "Award · not a study", environment: 'award',
    design: "Official announcement by the Royal Swedish Academy of Sciences.",
    summary: "David Baker receives half for computational protein design; Hassabis and Jumper share half for structure prediction.",
    findings: [["Context", "Protein design and structure prediction are distinct recognized contributions."]],
    relevance: "Historical milestone in drug research.",
    limitations: "An award establishes neither drug approval nor safe automated care.",
    sourceDetail: "Award announcement of 9 October 2024.", presentationSlides: [15, 17, 19]
  },
  {
    id: 'residencyrl', topic: 'simulation', topicLabel: "Clinical simulation",
    title: "ResidencyRL: Learning from simulated patient conversations",
    date: '2026-08-07', sourceId: 'residencyrl-v1', type: "Preprint · simulation", environment: 'simulation',
    design: "Reinforcement learning with simulated conversations; adversarial in-domain evaluation, n=200 per arm.",
    summary: "After training, more conversations achieve a diagnostic rubric score of at least 4/5.",
    findings: [
      ["Adversarial diagnostic rubric", "88.0% after training versus 81.0% for the base model: +7.0 percentage points."],
      ["95% bootstrap intervals", "Trained: 83.5–92.0%; base: 75.5–86.0%. Not a clinical patient-benefit endpoint."],
      ["Blinded comparison", "Physician evaluators prefer the trained model in 85 of 97 paired cases (87.6%)."]
    ],
    relevance: "Studies information gathering and decisions during a conversation.",
    limitations: "In-domain evaluation uses an automated rubric related to training. Simulation and evaluator bias; prospective real-world validation is missing.",
    sourceDetail: "arXiv v1; Table 4, Section 4.5 and Appendix C.7.", presentationSlides: [7]
  },
  {
    id: 'learning-impact', topic: 'learning', topicLabel: "Learning and skills",
    title: "AI access and unaided learning tests",
    date: '2026-10-04', sourceId: 'learning-impact-v2', type: "Preprint · randomized learning experiment", environment: 'education_experiment',
    design: "211 students, 205 at one-week follow-up; GPT-4o access during learning.",
    summary: "Higher immediate knowledge-test scores; the smaller effect after one week remains statistically uncertain.",
    findings: [
      ["Immediate unaided knowledge test", "+7.2 percentage points, p=0.021; intention-to-treat test analysis, n=210."],
      ["Knowledge test after one week", "+3.9 percentage points, p=0.068; n=205. Not significant at the 5% level."],
      ["How AI was used", "Tutoring and delegation were self-selected. Subgroups cannot establish causal differences between these approaches."]
    ],
    relevance: "Informs the design of training for pharmacy teams.",
    limitations: "Not a medical population or a long-term deskilling study. Protocol violations affect the immediate test; transfer to health professionals is unproven.",
    sourceDetail: "Contractor & Reyes, arXiv v2; Tables 4, 7 and A3.", presentationSlides: [22]
  },
{
  "id": "mira",
  "topic": "simulation",
  "topicLabel": "Clinical simulation",
  "title": "MIRA: Diagnosis and actions in a virtual EHR",
  "date": "2026-06-17",
  "sourceId": "mira-2026-source",
  "type": "Peer-reviewed · clinical simulation",
  "environment": "simulation",
  "design": "Retrospective MIMIC-IV cases in an EHR sandbox; 574 cases, eight diagnoses.",
  "summary": "An agent combines simulated history-taking, diagnosis and structured EHR actions.",
  "findings": [
    [
      "Head-to-head diagnosis comparison",
      "87.8% versus 78.1% for four board-certified physicians, n=311 paired cases; exact McNemar p=0.000287."
    ],
    [
      "Full dataset",
      "88.9% diagnostic accuracy, n=574."
    ]
  ],
  "relevance": "Studies reasoning and actions within a controlled clinical workflow.",
  "limitations": "Simulated conversations based on retrospective records. No prospective patient care; generalizability and real-world safety require testing.",
  "sourceDetail": "Ferber et al., Nature 655, 1282–1291; Fig. 3a, Methods and Discussion.",
  "presentationSlides": []
}
];

export const pharmaSources = [
  { id:'alphafold2-nature', title:'Highly accurate protein structure prediction with AlphaFold', url:'https://www.nature.com/articles/s41586-021-03819-2', publisher:'Jumper et al. · Nature', version:'15.07.2021 · DOI 10.1038/s41586-021-03819-2', kind:"Peer-reviewed · structural biology", summary:"Original AlphaFold 2 paper; structure benchmark, not a clinical intervention study." },
  { id:'alphafold3-nature', title:'Accurate structure prediction of biomolecular interactions with AlphaFold 3', url:'https://www.nature.com/articles/s41586-024-07487-w', publisher:'Abramson et al. · Nature', version:'08.05.2024 · DOI 10.1038/s41586-024-07487-w', kind:"Peer-reviewed · structural biology", summary:"Original biomolecular-complex study including documented model limitations." },
  { id:'nobel-chemistry-2024', title:'The Nobel Prize in Chemistry 2024', url:'https://www.kva.se/en/news/the-nobel-prize-in-chemistry-2024/', publisher:"Royal Swedish Academy of Sciences", version:"Announcement 09.10.2024", kind:"Official award announcement", summary:"Primary source for the award allocation and recognized contributions." },
  { id:'residencyrl-v1', title:'ResidencyRL: Reinforcement Learning in Simulated Clinical Environments', url:'https://arxiv.org/html/2608.07418v1', publisher:'Liévin et al.', version:'arXiv 2608.07418v1 · 07.08.2026', kind:"Preprint · clinical simulation", summary:"Simulated clinical conversations and external evaluations; prospective real-world testing is pending." },
  { id:'learning-impact-v2', title:'Experimental Evidence on the Learning Impact of Generative AI', url:'https://arxiv.org/html/2607.08849v2', publisher:'Zara Contractor & Germán Reyes', version:'arXiv 2607.08849v2 · 04.10.2026', kind:"Preprint · education research", summary:"Randomized learning experiment; not a clinical study or a long-term competence trajectory." }
].map(source => ({ ...source, checkedAt:'2026-10-17' }));

export const pharmaMilestones = studies.map(study => ({
  id:'milestone-' + study.id, date:study.date, title:study.title,
  category:study.topic, summary:study.summary, sourceId:study.sourceId,
  environment:study.environment, limitations:study.limitations, studyId:study.id, type:study.type
}));

export const pharmaApplications = [
  { title:"Structured patient records", text:"Combine medication, allergies and laboratory results in a structured format for a defined checking system to assess.", status:"Application concept", limit:"A connected record alone does not demonstrate fewer medication errors.", slides:'13–14' },
  { title:"Medication safety", text:"Flag interactions and duplicate prescriptions for professional review. Measure benefits and false alerts for the specific system.", status:"Application concept", limit:"Fully automated medication safety has not been established here.", slides:'16' },
  { title:"Demand and inventory planning", text:"Use data to assess orders and potential expiry. Compare time, costs and ordering errors before and after adoption.", status:"Economic benefit to be evaluated", limit:"No reliable savings estimates are available for this pharmacy setting.", slides:'14' },
  { title:"Personalized therapies", text:"Molecular models can suggest research questions. Proposed new professional roles remain future scenarios.", status:"Scenario", limit:"Routine local biologic production or automatic off-label selection is not established here.", slides:'20–21' }
];
