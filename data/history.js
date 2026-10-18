export const historySources = [
  { id:'dartmouth-history', title:'The Founding and Future of AI', url:'https://ai.dartmouth.edu/founding-and-future-ai', publisher:'Dartmouth', version:"Historical overview", kind:"Institutional primary source", summary:"Dartmouth Summer Research Project on Artificial Intelligence, summer 1956." },
  { id:'deep-blue-history', title:'Deep Blue', url:'https://www.ibm.com/history/deep-blue', publisher:'IBM', version:"Historical overview", kind:"Institutional primary source", summary:"Defeat of Kasparov in the May 1997 chess match." },
  { id:'alphafold-casp-history', title:'AlphaFold: a solution to a 50-year-old grand challenge in biology', url:'https://deepmind.google/blog/alphafold-a-solution-to-a-50-year-old-grand-challenge-in-biology/', publisher:'Google DeepMind', version:"CASP13 2018 and CASP14 2020", kind:"Authors' report", summary:"Historical competition events, separate from the 2021 AlphaFold 2 paper." }
].map(source => ({...source, checkedAt:'2026-10-17'}));

// Year-only events deliberately do not invent a day or month.
export const historyEvents = [
  {id:'dartmouth',year:1956,label:'Dartmouth',sourceId:'dartmouth-history',summary:"The Dartmouth workshop helps establish artificial intelligence as a research field.",limit:"Historical event. Not evidence of medical performance."},
  {id:'deep-blue',year:1997,label:'Deep Blue',sourceId:'deep-blue-history',summary:"Deep Blue defeats reigning world chess champion Kasparov in a match.",limit:"Specialized chess performance, not a general intelligence or medical test."},
  {id:'alphafold-2018',year:2018,label:'AlphaFold',sourceId:'alphafold-casp-history',summary:"The first AlphaFold system achieves the highest accuracy in the CASP13 structure competition.",limit:"Protein structure prediction. Not drug approval."},
  {id:'alphafold2-2020',year:2020,label:'AlphaFold 2',sourceId:'alphafold-casp-history',summary:"AlphaFold 2 achieves a breakthrough at CASP14. The detailed Nature paper follows in 2021.",limit:"The 2020 competition and 2021 publication are kept separate."},
  {id:'alphafold3-2024',year:2024,date:'2024-05-08',label:'AlphaFold 3',sourceId:'alphafold3-nature',studyId:'alphafold3'},
  {id:'nobel-2024',year:2024,date:'2024-10-09',label:"Protein Nobel Prize",sourceId:'nobel-chemistry-2024',studyId:'nobel-chemistry-2024'},
  {id:'residencyrl-2026',year:2026,date:'2026-08-07',label:'ResidencyRL',sourceId:'residencyrl-v1',studyId:'residencyrl'}
];

export const presentationScenarios = [{year:2030,label:"Supervised partial autonomy · illustrative scenario"}];
