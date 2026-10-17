export const historySources = [
  { id:'dartmouth-history', title:'The Founding and Future of AI', url:'https://ai.dartmouth.edu/founding-and-future-ai', publisher:'Dartmouth', version:'Historischer Überblick', kind:'Institutionelle Primärquelle', summary:'Dartmouth Summer Research Project on Artificial Intelligence, Sommer 1956.' },
  { id:'deep-blue-history', title:'Deep Blue', url:'https://www.ibm.com/history/deep-blue', publisher:'IBM', version:'Historischer Überblick', kind:'Institutionelle Primärquelle', summary:'Sieg gegen Kasparow im Schach-Match im Mai 1997.' },
  { id:'alphafold-casp-history', title:'AlphaFold: a solution to a 50-year-old grand challenge in biology', url:'https://deepmind.google/blog/alphafold-a-solution-to-a-50-year-old-grand-challenge-in-biology/', publisher:'Google DeepMind', version:'CASP13 2018 und CASP14 2020', kind:'Autorenbericht', summary:'Historische Wettbewerbsereignisse, getrennt von der AlphaFold-2-Paper-Veröffentlichung 2021.' }
].map(source => ({...source, checkedAt:'2026-10-17'}));

// Year-only events deliberately do not invent a day or month.
export const historyEvents = [
  {id:'dartmouth',year:1956,label:'Dartmouth',sourceId:'dartmouth-history',summary:'Der Dartmouth-Workshop prägt das Forschungsfeld künstliche Intelligenz.',limit:'Historisches Ereignis. Kein medizinischer Leistungsnachweis.'},
  {id:'deep-blue',year:1997,label:'Deep Blue',sourceId:'deep-blue-history',summary:'Deep Blue schlägt den amtierenden Schachweltmeister Kasparow im Match.',limit:'Spezialisierte Schachleistung, kein allgemeiner Intelligenz- oder Medizintest.'},
  {id:'alphafold-2018',year:2018,label:'AlphaFold',sourceId:'alphafold-casp-history',summary:'Die erste AlphaFold-Version erzielt die höchste Genauigkeit im CASP13-Strukturwettbewerb.',limit:'Proteinstrukturvorhersage. Keine Arzneimittelzulassung.'},
  {id:'alphafold2-2020',year:2020,label:'AlphaFold 2',sourceId:'alphafold-casp-history',summary:'AlphaFold 2 erzielt den Durchbruch im CASP14-Wettbewerb. Die detaillierte Nature-Arbeit folgt 2021.',limit:'Wettbewerbsjahr 2020 und Publikationsdatum 2021 werden getrennt gehalten.'},
  {id:'alphafold3-2024',year:2024,date:'2024-05-08',label:'AlphaFold 3',sourceId:'alphafold3-nature',studyId:'alphafold3'},
  {id:'nobel-2024',year:2024,date:'2024-10-09',label:'Nobelpreis Proteine',sourceId:'nobel-chemistry-2024',studyId:'nobel-chemistry-2024'},
  {id:'residencyrl-2026',year:2026,date:'2026-08-07',label:'ResidencyRL',sourceId:'residencyrl-v1',studyId:'residencyrl'}
];

export const presentationScenarios = [{year:2030,label:'Überwachte Teilautonomie · Annahme aus der PPT'}];
