// Curated from the Pharma presentation and checked against primary sources.
// Publication dates describe evidence availability, not patient outcomes.
export const presentationSource = {
  title: 'KI in der Pharmazie und Apotheke.pptx',
  url: 'https://docs.google.com/presentation/d/1ZmKxSpPPC5yRLxbTrwBxpkaXLGfPhZW_/edit',
  checkedAt: '2026-10-17'
};

export const studies = [
  {
    id: 'alphafold2', topic: 'pharma', topicLabel: 'Pharmaforschung',
    title: 'AlphaFold 2: Proteinstrukturen vorhersagen',
    date: '2021-07-15', sourceId: 'alphafold2-nature', type: 'Peer-reviewed · Strukturbenchmark', environment: 'structure_research',
    design: 'Verblindeter CASP14-Strukturvergleich, 87 Proteindomänen.',
    summary: 'Deutlich genauere Proteinstrukturvorhersagen im CASP14-Vergleich.',
    findings: [
      ['Backbone-Abweichung', 'Median 0,96 Å gegenüber 2,8 Å bei der nächstbesten Methode. Niedriger ist besser.'],
      ['Unsicherheit', '95%-Konfidenzintervalle: 0,85–1,16 Å bzw. 2,7–4,0 Å; r.m.s.d. bei 95 % Restabdeckung.']
    ],
    relevance: 'Strukturmodelle unterstützen Hypothesen für die Wirkstoffforschung.',
    limitations: 'Misst Strukturgenauigkeit, keine Arzneimittelwirksamkeit. Experimentelle Prüfung und klinische Entwicklung bleiben erforderlich.',
    sourceDetail: 'Nature 596, 583–589; Abb. 1a und Results.', presentationSlides: [4, 5, 6, 15]
  },
  {
    id: 'alphafold3', topic: 'pharma', topicLabel: 'Pharmaforschung',
    title: 'AlphaFold 3: Molekulare Wechselwirkungen',
    date: '2024-05-08', sourceId: 'alphafold3-nature', type: 'Peer-reviewed · Strukturbenchmark', environment: 'structure_research',
    design: 'Vergleich vorhergesagter biomolekularer Komplexe mit experimentell bestimmten Strukturen.',
    summary: 'Erweitert die Vorhersage auf Komplexe mit Proteinen, DNA, RNA und kleinen Molekülen.',
    findings: [['Befund', 'Ein gemeinsames Modell für mehrere Interaktionstypen; Verbesserungen gegenüber untersuchten spezialisierten Verfahren.']],
    relevance: 'Kann das Untersuchen möglicher Wirkstoffbindungen unterstützen.',
    limitations: 'Stereochemische Fehler, halluzinierte Strukturen und begrenzte Abbildung von Dynamik. Keine klinisch validierte Off-Label-Therapiewahl.',
    sourceDetail: 'Nature 630, 493–500; Abstract und Model limitations.', presentationSlides: [4, 5, 6, 15, 20]
  },
  {
    id: 'nobel-chemistry-2024', topic: 'pharma', topicLabel: 'Pharmaforschung',
    title: 'Nobelpreis für Proteindesign und Strukturvorhersage',
    date: '2024-10-09', sourceId: 'nobel-chemistry-2024', type: 'Auszeichnung · keine Studie', environment: 'award',
    design: 'Offizielle Bekanntgabe der Königlich Schwedischen Akademie der Wissenschaften.',
    summary: 'David Baker erhält die Hälfte für computergestütztes Proteindesign; Hassabis und Jumper teilen die Hälfte für Strukturvorhersage.',
    findings: [['Einordnung', 'Proteindesign und Strukturvorhersage sind unterschiedliche ausgezeichnete Beiträge.']],
    relevance: 'Historischer Pharma-Meilenstein aus dem Vortrag.',
    limitations: 'Eine Auszeichnung belegt weder eine Arzneimittelzulassung noch sichere automatisierte Versorgung.',
    sourceDetail: 'Preisbekanntgabe vom 9. Oktober 2024.', presentationSlides: [15, 17, 19]
  },
  {
    id: 'residencyrl', topic: 'simulation', topicLabel: 'Klinische Simulation',
    title: 'ResidencyRL: Lernen an simulierten Patientengesprächen',
    date: '2026-08-07', sourceId: 'residencyrl-v1', type: 'Preprint · Simulation', environment: 'simulation',
    design: 'Reinforcement Learning mit simulierten Dialogen; adversariale In-domain-Evaluation n=200 je Arm.',
    summary: 'Nach Training mehr Dialoge mit diagnostischem Rubrikscore von mindestens 4/5.',
    findings: [
      ['Adversariale Diagnostik-Rubrik', '88,0 % nach Training gegenüber 81,0 % beim Basismodell: +7,0 Prozentpunkte.'],
      ['95%-Bootstrap-Intervalle', 'Trainiert 83,5–92,0 %, Basis 75,5–86,0 %. Kein klinischer Patientennutzen-Endpunkt.'],
      ['Verblindeter Vergleich', 'Ärztliche Bewerter bevorzugten das trainierte Modell in 85 von 97 gepaarten Fällen (87,6 %).']
    ],
    relevance: 'Untersucht das Einholen von Informationen und Entscheidungen im Gespräch.',
    limitations: 'In-domain-Bewertung nutzt eine mit dem Training verwandte automatische Rubrik. Simulations- und Bewerterbias; reale prospektive Validierung fehlt.',
    sourceDetail: 'arXiv v1; Tabelle 4, Abschnitt 4.5 und Anhang C.7.', presentationSlides: [7]
  },
  {
    id: 'learning-impact', topic: 'learning', topicLabel: 'Lernen & Kompetenz',
    title: 'KI-Zugang und Lernen ohne KI im Folgetest',
    date: '2026-10-04', sourceId: 'learning-impact-v2', type: 'Preprint · randomisiertes Lernexperiment', environment: 'education_experiment',
    design: '211 Studierende, 205 im Follow-up nach einer Woche; GPT-4o-Zugang während der Lernphase.',
    summary: 'Höhere unmittelbare Wissenstestwerte; der kleinere Effekt nach einer Woche bleibt statistisch unsicher.',
    findings: [
      ['Wissenstest sofort ohne Hilfsmittel', '+7,2 Prozentpunkte, p=0,021; ITT-Testauswertung n=210.'],
      ['Wissenstest nach einer Woche', '+3,9 Prozentpunkte, p=0,068; n=205. Am 5%-Niveau nicht statistisch signifikant.'],
      ['Nutzungsweise', 'Tutor-Nutzung und Delegation wurden selbst gewählt. Untergruppen erlauben keinen kausalen Vergleich dieser Nutzungsarten.']
    ],
    relevance: 'Anstoß für die Gestaltung von Schulungen im pharmazeutischen Team.',
    limitations: 'Keine medizinische Population, kein Langzeit-Deskilling-Test. Regelverstöße belasten den unmittelbaren Test; Übertragbarkeit auf Fachpersonal offen.',
    sourceDetail: 'Contractor & Reyes, arXiv v2; Tabellen 4, 7 und A3.', presentationSlides: [22]
  },
{
  "id": "mira",
  "topic": "simulation",
  "topicLabel": "Klinische Simulation",
  "title": "MIRA: Diagnostik und Aktionen in der virtuellen Patientenakte",
  "date": "2026-06-17",
  "sourceId": "mira-2026-source",
  "type": "Peer-reviewed · klinische Simulation",
  "environment": "simulation",
  "design": "Retrospektive MIMIC-IV-Fälle in einer EHR-Sandbox; 574 Fälle, acht Diagnosen.",
  "summary": "Ein Agent verbindet simulierte Anamnese, Diagnostik und strukturierte EHR-Aktionen.",
  "findings": [
    [
      "Diagnostik im direkten Vergleich",
      "87,8 % gegenüber 78,1 % bei vier Fachärzten, n=311 gepaarte Fälle; exakter McNemar-p=0,000287."
    ],
    [
      "Gesamtdatensatz",
      "88,9 % diagnostische Genauigkeit bei n=574."
    ]
  ],
  "relevance": "Untersucht Denken und Handeln innerhalb eines kontrollierten klinischen Workflows.",
  "limitations": "Simulierte Gespräche aus retrospektiven Akten. Keine prospektive Patientenversorgung; Generalisierung und reale Sicherheit bleiben zu prüfen.",
  "sourceDetail": "Ferber et al., Nature 655, 1282–1291; Abb. 3a, Methods und Discussion.",
  "presentationSlides": []
}
];

export const pharmaSources = [
  { id:'alphafold2-nature', title:'Highly accurate protein structure prediction with AlphaFold', url:'https://www.nature.com/articles/s41586-021-03819-2', publisher:'Jumper et al. · Nature', version:'15.07.2021 · DOI 10.1038/s41586-021-03819-2', kind:'Peer-reviewed · Strukturbiologie', summary:'Originalarbeit zu AlphaFold 2; Strukturbenchmark, keine klinische Interventionsstudie.' },
  { id:'alphafold3-nature', title:'Accurate structure prediction of biomolecular interactions with AlphaFold 3', url:'https://www.nature.com/articles/s41586-024-07487-w', publisher:'Abramson et al. · Nature', version:'08.05.2024 · DOI 10.1038/s41586-024-07487-w', kind:'Peer-reviewed · Strukturbiologie', summary:'Originalarbeit zu biomolekularen Komplexen einschließlich dokumentierter Modellgrenzen.' },
  { id:'nobel-chemistry-2024', title:'The Nobel Prize in Chemistry 2024', url:'https://www.kva.se/en/news/the-nobel-prize-in-chemistry-2024/', publisher:'Königlich Schwedische Akademie der Wissenschaften', version:'Bekanntgabe 09.10.2024', kind:'Offizielle Preisbekanntgabe', summary:'Primärquelle zur Preisaufteilung und den ausgezeichneten Beiträgen.' },
  { id:'residencyrl-v1', title:'ResidencyRL: Reinforcement Learning in Simulated Clinical Environments', url:'https://arxiv.org/html/2608.07418v1', publisher:'Liévin et al.', version:'arXiv 2608.07418v1 · 07.08.2026', kind:'Preprint · klinische Simulation', summary:'Simulierte klinische Dialoge und externe Bewertungen; prospektive Prüfung im Alltag steht aus.' },
  { id:'learning-impact-v2', title:'Experimental Evidence on the Learning Impact of Generative AI', url:'https://arxiv.org/html/2607.08849v2', publisher:'Zara Contractor & Germán Reyes', version:'arXiv 2607.08849v2 · 04.10.2026', kind:'Preprint · Bildungsforschung', summary:'Randomisiertes Lernexperiment; keine klinische Studie und kein langfristiger Kompetenzverlauf.' }
].map(source => ({ ...source, checkedAt:'2026-10-17' }));

export const pharmaMilestones = studies.map(study => ({
  id:'milestone-' + study.id, date:study.date, title:study.title,
  category:study.topic, summary:study.summary, sourceId:study.sourceId,
  environment:study.environment, limitations:study.limitations, studyId:study.id, type:study.type
}));

export const pharmaApplications = [
  { title:'Strukturierte Patientenakte', text:'Medikation, Allergien und Laborwerte strukturiert zusammenführen, damit ein konkretes Prüfsystem sie auswerten kann.', status:'Anwendungsansatz', limit:'Ein Bild einer vernetzten Akte ist noch kein Nachweis für weniger Medikationsfehler.', slides:'13–14' },
  { title:'Arzneimitteltherapiesicherheit', text:'Wechselwirkungen und Doppelverordnungen zur fachlichen Prüfung markieren. Nutzen und Fehlalarme am konkreten System messen.', status:'Anwendungsansatz', limit:'Die Präsentation belegt keine vollautomatische Patientensicherheit.', slides:'16' },
  { title:'Bedarf und Lager planen', text:'Bestellungen und mögliche Verfälle datenbasiert prüfen. Zeit, Kosten und Fehlbestellungen vor und nach Einführung vergleichen.', status:'Zu prüfender wirtschaftlicher Nutzen', limit:'Für die dargestellte Apotheke liegen keine belastbaren Einsparungszahlen vor.', slides:'14' },
  { title:'Personalisierte Therapien', text:'Molekulare Modelle können Forschungsfragen anregen. Die im Vortrag beschriebenen neuen Berufsrollen sind Zukunftsideen.', status:'Szenario', limit:'Keine hier belegte Routine für lokale Biologika-Produktion oder automatische Off-Label-Auswahl.', slides:'20–21' }
];
