# AI in Medicine Monitor – Studien und Hintergrunddaten

Stand: 18.10.2026. Zeitfenster der Anwendung: 1950–2030. Redaktionell recherchierte Originalquellen; keine neu durchgeführten Evaluationen oder unabhängige fachliche Freigabe.

## Was die große Grafik zeigt

Die Beschriftung lautet „IQ zur Verdeutlichung“. Die vertikale Position, die Linien und die rechte Autonomieskala stammen aus einer schematischen PowerPoint. Es gibt keine validierte Umrechnung der folgenden Arbeiten in diese IQ-Höhen oder medizinische Autonomiezeiten. Die Quellen belegen Ereignisse und eng definierte Aufgabenbefunde. Ein verbundenes, steigendes Liniensegment ist keine gemeinsame Messreihe und kein Nachweis stetigen Fortschritts.

Tagesgenaue Publikationen werden innerhalb ihres Jahres positioniert. Der letzte historische Linien-Stützpunkt für 2026 liegt am heutigen Zeitpunkt; die Zukunft beginnt danach. Auch diese Anpassung ist rein schematisch.

Sichtbare Punkte werden ausschließlich aus `data/point-evidence.js` erzeugt: 24 Quellenanker. Die zwei gleichjährigen Paare AMIE/MedAgentBench (2025) und MIRA/ResidencyRL (2026) erscheinen als nummerierte Sammelpunkte mit Auswahl; 22 Marker erschließen alle 24 Einträge. Unsichtbare Stützpunkte in `data/presentation-chart.js` dienen nur der Liniengeometrie. Nicht belegte Zwischenpunkte, interpolierte Endpunkte und zukünftige Szenarien bekommen keine Punktmarker. Daten bis zum gewählten Veröffentlichungsdatum werden berücksichtigt; bei historischen Jahresangaben wird kein Tag erfunden. Der Modellfilter betrifft nur die 13 Benchmark-Messwerte.

Zukunft: ausschließlich als Annahmen bezeichnete, gestrichelte Szenarien bis 2030. Keine zukünftigen Studienergebnisse oder bestätigten Prognosen. METR betrifft Software-/Reasoning-Aufgaben und ist kein Beleg klinischer Autonomie.

## Herkunft der Grafik und ursprüngliches Gespräch

PowerPoint: [KI in der Pharmazie und Apotheke.pptx](https://docs.google.com/presentation/d/1ZmKxSpPPC5yRLxbTrwBxpkaXLGfPhZW_/edit), Folien 4–6, insbesondere Folie 6. Originaldatei im Drive, zuletzt geändert 12.10.2026. Die Original-PPT wurde nicht verändert.

Die Gesprächssuche fand die ursprüngliche Erstellung am 04.08.2026, ab ca. 20:26 UTC (22:26 Uhr Berlin); die Datei `AI_Capability_Autonomy_Medicine.pptx` wurde ca. 21:45 UTC erstellt. Arbeitstitel im Gespräch: „AI capability, autonomy and medicine - 1950 to 2035“. Der tatsächliche Chat-Titel, die Conversation-ID und ein direkter Chat-Link waren in den Treffern nicht zugänglich. Der damalige lokale Downloadpfad ist kein heute gesichert verfügbarer Link.

Die damalige Herleitung bezeichnete den Fähigkeits-/IQ-Index und die klinische Reifekurve bereits als illustrativ. METR war als logarithmischer 50%-Aufgabenhorizont gedacht. Die frühere gemeinsame Skala bietet keine wissenschaftliche IQ-Kalibrierung. Aus dem alten Gespräch wiedergefundene Quellenhinweise sind nicht automatisch neue Belege; nur die unten geprüften Quellen sind übernommen.

Vom Nutzer wurde am 17.10.2026 ein Nature-Link übermittelt: DOI 10.1038/s41586-026-10675-5 (MIRA). „Diese 2x“ enthielt keinen zweiten unterschiedlichen URL. MIRA erscheint als Grafikpunkt und Studienkarte, zählt aber als eine Studie.

## Jeder sichtbare Punkt der Hauptgrafik

| ID | Spur / Jahr | Meilenstein | Originalquelle |
| --- | --- | --- | --- |
| `turing-1950` | Allgemeine KI / 1950 | Turing: Imitation Game | [Computing Machinery and Intelligence](https://academic.oup.com/mind/article/LIX/236/433/986238) |
| `dartmouth-1956` | Allgemeine KI / 1956 | Dartmouth | [The Founding and Future of AI](https://ai.dartmouth.edu/founding-and-future-ai) |
| `eliza-1966` | Allgemeine KI / 1966 | ELIZA | [ELIZA—a computer program for the study of natural language communication between man and machine](https://doi.org/10.1145/365153.365168) |
| `mycin-1975` | Medizinisches Wissen / Forschung / 1975 | MYCIN | [Computer-based consultations in clinical therapeutics: Explanation and rule acquisition capabilities of the MYCIN system](https://www.sciencedirect.com/science/article/pii/0010480975900099) |
| `backprop-1986` | Allgemeine KI / 1986 | Backpropagation | [Learning representations by back-propagating errors](https://www.nature.com/articles/323533a0) |
| `deep-blue-1997` | Allgemeine KI / 1997 | Deep Blue | [Deep Blue](https://www.ibm.com/history/deep-blue) |
| `alexnet-2012` | Allgemeine KI / 2012 | AlexNet | [ImageNet Classification with Deep Convolutional Neural Networks](https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html) |
| `alphago-2016` | Allgemeine KI / 2016 | AlphaGo | [Mastering the game of Go with deep neural networks and tree search](https://www.nature.com/articles/nature16961) |
| `skin-cancer-2017` | Medizinisches Wissen / Forschung / 2017 | Dermatologie-CNN | [Dermatologist-level classification of skin cancer with deep neural networks](https://www.nature.com/articles/nature21056) |
| `gpt3-2020` | Allgemeine KI / 2020 | GPT-3 | [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165v1) |
| `instructgpt-2022` | Allgemeine KI / 2022 | InstructGPT / RLHF | [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155v1) |
| `medpalm-preprint-2022` | Medizinisches Wissen / Forschung / 2022 | MultiMedQA / Med-PaLM (Preprint) | [Large Language Models Encode Clinical Knowledge](https://arxiv.org/abs/2212.13138v1) |
| `gpt4-2023` | Allgemeine KI / 2023 | GPT-4-Bericht | [GPT-4 Technical Report](https://arxiv.org/abs/2303.08774v1) |
| `medpalm-2023` | Medizinisches Wissen / Forschung / 2023 | Med-PaLM (Nature) | [Large language models encode clinical knowledge](https://www.nature.com/articles/s41586-023-06291-2) |
| `diagnostic-rct-2024` | Klinisches Denken / 2024 | GPT-4: Diagnostik-RCT | [Large Language Model Influence on Diagnostic Reasoning: A Randomized Clinical Trial](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2825395) |
| `metr-2025` | Autonomie im Software-Kontext / 2025 | METR: Software-Zeithorizont | [Measuring AI Ability to Complete Long Tasks](https://arxiv.org/abs/2503.14499v1) |
| `amie-2025` | Klinisches Denken / 2025 | AMIE: Diagnostische Dialoge | [Towards conversational diagnostic artificial intelligence](https://www.nature.com/articles/s41586-025-08866-7) |
| `mira-2026` | Klinisches Denken / 2026 | MIRA | [Towards autonomous medical artificial intelligence agents](https://www.nature.com/articles/s41586-026-10675-5) |
| `af2-paper-2021` | Medizinisches Wissen / Forschung / 2021 | AlphaFold 2 · Originalarbeit | [Highly accurate protein structure prediction with AlphaFold](https://www.nature.com/articles/s41586-021-03819-2) |
| `af3-paper-2024` | Medizinisches Wissen / Forschung / 2024 | AlphaFold 3 | [Accurate structure prediction of biomolecular interactions with AlphaFold 3](https://www.nature.com/articles/s41586-024-07487-w) |
| `medxpert-2025` | Medizinisches Wissen / Forschung / 2025 | MedXpertQA v3 | [MedXpertQA: Benchmarking Expert-Level Medical Reasoning and Understanding](https://arxiv.org/html/2501.18362v3) |
| `healthbench-2026` | Medizinisches Wissen / Forschung / 2026 | HealthBench Professional | [HealthBench Professional: Evaluating Large Language Models on Real Clinician Chats](https://arxiv.org/html/2604.27470v1) |
| `medagent-2025` | Klinisches Denken / 2025 | MedAgentBench | [MedAgentBench: A Realistic Virtual EHR Environment to Benchmark Medical LLM Agents](https://arxiv.org/html/2501.14654v2) |
| `residency-2026` | Klinisches Denken / 2026 | ResidencyRL | [ResidencyRL: Reinforcement Learning in Simulated Clinical Environments](https://arxiv.org/html/2608.07418v1) |

### Befunde, Fundstellen und Grenzen

#### Turing: Imitation Game (1950-10-01)

- ID: `turing-1950`; Quelle: `turing-1950-source`.
- Befund: Formuliert das Imitation Game als Ansatz zur Diskussion maschineller Intelligenz.
- Fundstelle: 10.1093/mind/LIX.236.433.
- Grenze: Kein empirischer Leistungsbenchmark, kein IQ-Wert und kein medizinischer Nachweis.

#### Dartmouth (1956)

- ID: `dartmouth-1956`; Quelle: `dartmouth-history`.
- Befund: Dartmouth Summer Research Project on Artificial Intelligence im Sommer 1956.
- Fundstelle: Institutioneller Autorenbericht.
- Grenze: Forschungsereignis, keine Messung einer KI-Fähigkeit.

#### ELIZA (1966)

- ID: `eliza-1966`; Quelle: `eliza-1966-source`.
- Befund: Beschreibt regelbasierten Dialog zwischen Menschen und Computer.
- Fundstelle: 10.1145/365153.365168.
- Grenze: Sprachmusterverarbeitung; kein Nachweis von Verständnis, Psychotherapie oder IQ. DOI 10.1145/357980.357991 ist eine spätere Neuveröffentlichung, nicht die 1966er Originalreferenz.

#### MYCIN (1975)

- ID: `mycin-1975`; Quelle: `mycin-1975-source`.
- Befund: Beschreibt regelbasierte Antibiotika-Beratung sowie Erklärungs- und Wissenserwerbsfunktionen.
- Fundstelle: 10.1016/0010-4809(75)90009-9.
- Grenze: Belegt Systemkonzept und spezifischen Anwendungsbereich, keine allgemeine klinische Autonomie und kein IQ-Niveau.

#### Backpropagation (1986-10-09)

- ID: `backprop-1986`; Quelle: `backprop-1986-source`.
- Befund: Beschreibt das Lernen verborgener Repräsentationen durch rückwärts propagierte Fehler und Gewichtsänderungen.
- Fundstelle: 10.1038/323533a0.
- Grenze: Methodenmeilenstein ohne vergleichbaren medizinischen Leistungswert oder IQ-Skala.

#### Deep Blue (1997)

- ID: `deep-blue-1997`; Quelle: `deep-blue-history`.
- Befund: Deep Blue gewinnt im Mai 1997 das Sechs-Partien-Match gegen Kasparow mit 3,5:2,5.
- Fundstelle: Institutioneller Autorenbericht.
- Grenze: Spezialisierte Schachleistung, keine allgemeine Intelligenz- oder medizinische Kompetenzmessung.

#### AlexNet (2012)

- ID: `alexnet-2012`; Quelle: `alexnet-2012-source`.
- Befund: Tiefes CNN zur Klassifikation von 1,3 Millionen ImageNet-Trainingsbildern; Abstract berichtet Top-1/Top-5-Fehler 39,7 %/18,9 % auf dem LSVRC-2010-Test.
- Fundstelle: Advances in Neural Information Processing Systems 25.
- Grenze: Bildklassifikation eines bestimmten Datensatzes, kein klinischer oder allgemeiner IQ-Test. Die oft zitierten 15,3 % beziehen sich auf einen anderen Wettbewerbsaufbau; nicht vermischen.

#### AlphaGo (2016-01-27)

- ID: `alphago-2016`; Quelle: `alphago-2016-source`.
- Befund: AlphaGo schlägt den europäischen Go-Meister Fan Hui mit 5:0 und erreicht 99,8 % Siege gegen andere Go-Programme im beschriebenen Vergleich.
- Fundstelle: 10.1038/nature16961.
- Grenze: Spezialisierter Go-Benchmark. Diese Januar-Arbeit berichtet nicht das spätere Lee-Sedol-Match.

#### Dermatologie-CNN (2017-01-25)

- ID: `skin-cancer-2017`; Quelle: `skin-cancer-2017-source`.
- Befund: Training mit 129.450 klinischen Bildern; Vergleich mit 21 Fachärzten bei zwei binären Hautläsions-Aufgaben.
- Fundstelle: 10.1038/nature21056.
- Grenze: Spezialisierte Bildklassifikation, keine umfassende Wissensprüfung, prospektive Versorgung oder Patientennutzenstudie. Als Themen-Meilenstein markieren, nicht als IQ-Messung.

#### GPT-3 (2020-05-28)

- ID: `gpt3-2020`; Quelle: `gpt3-2020-source`.
- Befund: GPT-3 mit 175 Milliarden Parametern zeigt auf verschiedenen NLP-Aufgaben Few-shot-Leistung ohne aufgabenspezifische Gewichtsänderung.
- Fundstelle: arXiv 2005.14165v1; NeurIPS 2020.
- Grenze: Autorenbenchmark mit Aufgaben- und Kontaminationsgrenzen; keine allgemeine IQ-Kalibrierung und keine klinische Validierung.

#### InstructGPT / RLHF (2022-03-04)

- ID: `instructgpt-2022`; Quelle: `instructgpt-2022-source`.
- Befund: Auf der untersuchten Promptverteilung bevorzugen menschliche Bewerter Antworten des 1,3B-InstructGPT gegenüber dem 175B-GPT-3.
- Fundstelle: arXiv 2203.02155v1.
- Grenze: Bewerterpräferenz unter diesem Protokoll; Fehler bleiben möglich. Nicht gleichbedeutend mit medizinischer Korrektheit oder IQ.

#### MultiMedQA / Med-PaLM (Preprint) (2022-12-26)

- ID: `medpalm-preprint-2022`; Quelle: `medpalm-preprint-2022-source`.
- Befund: Führt MultiMedQA und medizinisch angepasstes Med-PaLM ein; Flan-PaLM erzielt 67,6 % auf MedQA-Fragen.
- Fundstelle: arXiv 2212.13138v1.
- Grenze: Gleiche Studienfamilie wie Nature 2023, keine zweite unabhängige Bestätigung. Fragenbenchmark ersetzt keine klinische Validierung.

#### GPT-4-Bericht (2023-03-15)

- ID: `gpt4-2023`; Quelle: `gpt4-2023-source`.
- Befund: Beschreibt einen multimodalen GPT-4-Modellstand und dessen Evaluation.
- Fundstelle: arXiv 2303.08774v1.
- Grenze: Anbieterbericht; nicht vollständig offengelegte Trainingsdaten. Bericht erstmals 2023, Revision 2024 ist kein neuer Modellmeilenstein. Kein hier belegtes IQ-Niveau.

#### Med-PaLM (Nature) (2023-07-12)

- ID: `medpalm-2023`; Quelle: `medpalm-2023-source`.
- Befund: Flan-PaLM erreicht 67,6 % MedQA-Genauigkeit; Med-PaLM verbessert mehrere menschlich bewertete Antwortmerkmale.
- Fundstelle: 10.1038/s41586-023-06291-2.
- Grenze: Med-PaLM bleibt in der Studie insgesamt hinter ärztlichen Antworten; keine Patientennutzen-Endpunkte. Preprint 2022 und Nature 2023 nicht unabhängig zählen.

#### GPT-4: Diagnostik-RCT (2024-10-28)

- ID: `diagnostic-rct-2024`; Quelle: `diagnostic-rct-2024-source`.
- Befund: Diagnostischer Rubrikscore median 76 % mit LLM versus 74 % ohne; adjustiert +2 Prozentpunkte (95%-KI −4 bis 8; p=0,60). Kein signifikanter Assistenznutzen im Hauptvergleich.
- Fundstelle: 10.1001/jamanetworkopen.2024.40969.
- Grenze: 50 Ärzte, bis zu sechs Vignetten; kein realer Patienten-Endpunkt. Explorative KI-allein-Analyse darf den negativen Hauptvergleich nicht verdrängen. Ein Meilenstein für Evaluation, kein Beleg einer monoton steigenden IQ-Kurve.

#### METR: Software-Zeithorizont (2025-03-18)

- ID: `metr-2025`; Quelle: `metr-2025-source`.
- Befund: Definiert den 50%-Zeithorizont anhand menschlicher Aufgabenbearbeitungsdauer; berichtet etwa sieben Monate Verdopplungszeit seit 2019 und etwa 50 Minuten für Claude 3.7 Sonnet.
- Fundstelle: arXiv 2503.14499v1.
- Grenze: Kein medizinischer Aufgabenhorizont. 50 % Erfolgswahrscheinlichkeit ist keine verlässliche klinische Autonomie. PPT-Jahresindizes nicht als extrahierte METR-Werte ausgeben; Modelle und Rohdaten müssten separat übernommen werden.

#### AMIE: Diagnostische Dialoge (2025-04-09)

- ID: `amie-2025`; Quelle: `amie-2025-source`.
- Befund: Randomisierte, doppelt verblindete Crossover-Studie: 159 Fall-Szenarien, 20 Hausärzte und Patientendarsteller. AMIE erzielt höhere diagnostische Genauigkeit und bessere Bewertungen auf 30/32 ärztlichen und 25/26 Patientendarsteller-Achsen.
- Fundstelle: 10.1038/s41586-025-08866-7.
- Grenze: Simulierte textbasierte Konsultationen mit Patientendarstellern. Ungewohnter synchroner Textchat für Ärzte; keine reale autonome Patientenversorgung.

#### MIRA (2026-06-17)

- ID: `mira-2026`; Quelle: `mira-2026-source`.
- Befund: Untersucht einen medizinischen Agenten in patientendatenbasierten simulierten Notaufnahme-Begegnungen.
- Fundstelle: 10.1038/s41586-026-10675-5.
- Grenze: Keine prospektive klinische Versorgung, keine validierte IQ-Skala. Gleicher Artikel kann zwei thematische Karten speisen, bleibt eine Studie.

#### AlphaFold 2 · Originalarbeit (2021-07-15)

- ID: `af2-paper-2021`; Quelle: `alphafold2-nature`.
- Befund: Proteinstrukturvorhersage im verblindeten CASP14-Vergleich.
- Fundstelle: Nature 596, Abb. 1a.
- Grenze: Grundlagenforschung, kein klinischer Wissens- oder Patientennutzen-Endpunkt.

#### AlphaFold 3 (2024-05-08)

- ID: `af3-paper-2024`; Quelle: `alphafold3-nature`.
- Befund: Vorhersage biomolekularer Komplexe einschließlich kleiner Moleküle.
- Fundstelle: Nature 630, Abstract und Model limitations.
- Grenze: Kein Beleg einer Arzneimittelzulassung oder automatischen Therapiewahl.

#### MedXpertQA v3 (2025-06-06)

- ID: `medxpert-2025`; Quelle: `medxpertqa-v3`.
- Befund: Anspruchsvolle Wissens- und Fallaufgaben; Originalwerte stehen in der Messspur.
- Fundstelle: arXiv v3, Tabellen 4/5, Text Avg.
- Grenze: Kein echter Patientenverlauf. Text und multimodale Aufgaben getrennt halten.

#### HealthBench Professional (2026-04-30)

- ID: `healthbench-2026`; Quelle: `healthbench-pro-v1`.
- Befund: Rubrikbewertete Qualität klinischer Assistenzantworten.
- Fundstelle: arXiv v1, Abschnitte 5.1/5.3.
- Grenze: Rubrikpunkte, keine Prozent-Trefferquote oder IQ-Kalibrierung.

#### MedAgentBench (2025-02-12)

- ID: `medagent-2025`; Quelle: `medagentbench-v2`.
- Befund: 300 Aufgaben, pass@1 mit höchstens acht Interaktionsrunden.
- Fundstelle: arXiv v2, Tabelle 3 und Abschnitte 2.4/2.5.
- Grenze: GET ausgeführt, POST-Schreibaktionen simuliert. Keine autonome reale Versorgung.

#### ResidencyRL (2026-08-07)

- ID: `residency-2026`; Quelle: `residencyrl-v1`.
- Befund: Training an simulierten Patientendialogen; diagnostische Rubrik und ärztliche Präferenzbewertung.
- Fundstelle: arXiv v1, Tabelle 4, Abschnitt 4.5, Anhang C.7.
- Grenze: Trainingsnahe automatische Rubrik. Prospektive Versorgungsevidenz fehlt.

## Die 13 tatsächlichen Benchmark-Messwerte

Diese Werte haben eigene Skalen. Sie sind nicht auf den IQ-Index umgerechnet. Es handelt sich pro Benchmark um einen Publikationsstand, nicht um einen gemessenen Zeittrend.

| ID | System | Datum | Wert | Vergleichsgruppe | Quelle |
| --- | --- | --- | --- | --- | --- |
| `mq-gpt4o-20241120` | Autoren-Evaluationsprotokoll | 2025-06-06 | 30.37 % | `medxpertqa-v3-text-full-authors-zero-shot-cot` | `medxpertqa-v3` |
| `mq-claude35-20241022` | Autoren-Evaluationsprotokoll | 2025-06-06 | 21.31 % | `medxpertqa-v3-text-full-authors-zero-shot-cot` | `medxpertqa-v3` |
| `mq-gemini15pro002` | Autoren-Evaluationsprotokoll | 2025-06-06 | 19.67 % | `medxpertqa-v3-text-full-authors-zero-shot-cot` | `medxpertqa-v3` |
| `mq-deepseekv3` | Autoren-Evaluationsprotokoll | 2025-06-06 | 24.16 % | `medxpertqa-v3-text-full-authors-zero-shot-cot` | `medxpertqa-v3` |
| `mq-llama33-70b` | Autoren-Evaluationsprotokoll | 2025-06-06 | 24.49 % | `medxpertqa-v3-text-full-authors-zero-shot-cot` | `medxpertqa-v3` |
| `hbp-gpt54-base` | GPT-5.4 · Basis-API | 2026-04-30 | 48.1 Punkte | `hbp-v1-base-api-xhigh-default-verbosity` | `healthbench-pro-v1` |
| `hbp-gpt54-browsing` | GPT-5.4 · Browsing-Harness | 2026-04-30 | 45.8 Punkte | `hbp-v1-gpt54-browsing-harness` | `healthbench-pro-v1` |
| `hbp-chatgpt-clinicians` | ChatGPT for Clinicians | 2026-04-30 | 59 Punkte | `hbp-v1-chatgpt-for-clinicians-harness` | `healthbench-pro-v1` |
| `mab-claude35v2` | Autoren-Agent mit FHIR-Werkzeugen | 2025-02-12 | 69.67 % | `medagentbench-v2-overall-authors-pass1-8rounds` | `medagentbench-v2` |
| `mab-gpt4o` | Autoren-Agent mit FHIR-Werkzeugen | 2025-02-12 | 64 % | `medagentbench-v2-overall-authors-pass1-8rounds` | `medagentbench-v2` |
| `mab-deepseekv3` | Autoren-Agent mit FHIR-Werkzeugen | 2025-02-12 | 62.67 % | `medagentbench-v2-overall-authors-pass1-8rounds` | `medagentbench-v2` |
| `mab-gemini15pro` | Autoren-Agent mit FHIR-Werkzeugen | 2025-02-12 | 62 % | `medagentbench-v2-overall-authors-pass1-8rounds` | `medagentbench-v2` |
| `mab-gpt4omini` | Autoren-Agent mit FHIR-Werkzeugen | 2025-02-12 | 56.33 % | `medagentbench-v2-overall-authors-pass1-8rounds` | `medagentbench-v2` |

### MedXpertQA: Benchmarking Expert-Level Medical Reasoning and Understanding

[Originalquelle](https://arxiv.org/html/2501.18362v3) · arXiv 2501.18362v3 · 06.06.2025

Datumsbasis: Publikation; Evaluationsdatum unbekannt. Bereich: Text · vollständiger Test · n=2.450. Konfiguration: Null-Beispiel-CoT; greedy decoding, sofern verfügbar.

Fundstelle: Tabellen 4/5 · Text Avg · Abschnitte 4.1/4.2. Grenze: Historischer Prüfungsbenchmark. Kein klinischer Einsatznachweis; Unsicherheitsintervalle hier nicht übernommen. Publikationsdatum ersetzt unbekanntes Evaluationsdatum.


### HealthBench Professional: Evaluating Large Language Models on Real Clinician Chats

[Originalquelle](https://arxiv.org/html/2604.27470v1) · arXiv 2604.27470v1 · 30.04.2026

Datumsbasis: Publikation; Evaluationsdatum unbekannt. Bereich: Gesamt · n=525. Konfiguration: API-Standardprompt; xhigh Reasoning; Standard-Verbosity.

Fundstelle: Abschnitte 5.1/5.3 · längenbereinigter Gesamtwert. Grenze: Anbieterbeteiligung; Systemkonfiguration beeinflusst den Score. Keine Prozent-Trefferquote und kein Patientennutzen-Endpunkt. 95%-Intervalle im Original, hier nicht numerisch übernommen; keine Rang-Signifikanz ableiten. Evaluationsdatum unbekannt.


### MedAgentBench: A Realistic Virtual EHR Environment to Benchmark Medical LLM Agents

[Originalquelle](https://arxiv.org/html/2501.14654v2) · arXiv 2501.14654v2 · 12.02.2025

Datumsbasis: Publikation; Evaluationsdatum unbekannt. Bereich: Overall SR · n=300. Konfiguration: pass@1; maximal acht Runden; Temperatur 0.

Fundstelle: Tabelle 3 · Overall SR · Abschnitte 2.4/2.5. Grenze: Virtueller EHR-Test, keine reale autonome Versorgung. POST nur simuliert. Modell-Snapshot im Paper nicht für alle Anbieter präzisiert; Unsicherheit nicht berichtet. Publikationsdatum ersetzt unbekanntes Evaluationsdatum.

## Studienkarten und ergänzende Hintergründe

Die folgende Sammlung enthält unterschiedliche Evidenztypen. Ein Preis ist keine Studie; ein simuliertes Patientengespräch keine prospektive Versorgung.

### AlphaFold 2: Proteinstrukturen vorhersagen

2021-07-15 · Peer-reviewed · Strukturbenchmark · [Originalquelle](https://www.nature.com/articles/s41586-021-03819-2)

Design: Verblindeter CASP14-Strukturvergleich, 87 Proteindomänen.

- Backbone-Abweichung: Median 0,96 Å gegenüber 2,8 Å bei der nächstbesten Methode. Niedriger ist besser.
- Unsicherheit: 95%-Konfidenzintervalle: 0,85–1,16 Å bzw. 2,7–4,0 Å; r.m.s.d. bei 95 % Restabdeckung.

Einordnung: Strukturmodelle unterstützen Hypothesen für die Wirkstoffforschung.

Grenzen: Misst Strukturgenauigkeit, keine Arzneimittelwirksamkeit. Experimentelle Prüfung und klinische Entwicklung bleiben erforderlich.

Fundstelle: Nature 596, 583–589; Abb. 1a und Results.

### AlphaFold 3: Molekulare Wechselwirkungen

2024-05-08 · Peer-reviewed · Strukturbenchmark · [Originalquelle](https://www.nature.com/articles/s41586-024-07487-w)

Design: Vergleich vorhergesagter biomolekularer Komplexe mit experimentell bestimmten Strukturen.

- Befund: Ein gemeinsames Modell für mehrere Interaktionstypen; Verbesserungen gegenüber untersuchten spezialisierten Verfahren.

Einordnung: Kann das Untersuchen möglicher Wirkstoffbindungen unterstützen.

Grenzen: Stereochemische Fehler, halluzinierte Strukturen und begrenzte Abbildung von Dynamik. Keine klinisch validierte Off-Label-Therapiewahl.

Fundstelle: Nature 630, 493–500; Abstract und Model limitations.

### Nobelpreis für Proteindesign und Strukturvorhersage

2024-10-09 · Auszeichnung · keine Studie · [Originalquelle](https://www.kva.se/en/news/the-nobel-prize-in-chemistry-2024/)

Design: Offizielle Bekanntgabe der Königlich Schwedischen Akademie der Wissenschaften.

- Einordnung: Proteindesign und Strukturvorhersage sind unterschiedliche ausgezeichnete Beiträge.

Einordnung: Historischer Pharma-Meilenstein aus dem Vortrag.

Grenzen: Eine Auszeichnung belegt weder eine Arzneimittelzulassung noch sichere automatisierte Versorgung.

Fundstelle: Preisbekanntgabe vom 9. Oktober 2024.

### ResidencyRL: Lernen an simulierten Patientengesprächen

2026-08-07 · Preprint · Simulation · [Originalquelle](https://arxiv.org/html/2608.07418v1)

Design: Reinforcement Learning mit simulierten Dialogen; adversariale In-domain-Evaluation n=200 je Arm.

- Adversariale Diagnostik-Rubrik: 88,0 % nach Training gegenüber 81,0 % beim Basismodell: +7,0 Prozentpunkte.
- 95%-Bootstrap-Intervalle: Trainiert 83,5–92,0 %, Basis 75,5–86,0 %. Kein klinischer Patientennutzen-Endpunkt.
- Verblindeter Vergleich: Ärztliche Bewerter bevorzugten das trainierte Modell in 85 von 97 gepaarten Fällen (87,6 %).

Einordnung: Untersucht das Einholen von Informationen und Entscheidungen im Gespräch.

Grenzen: In-domain-Bewertung nutzt eine mit dem Training verwandte automatische Rubrik. Simulations- und Bewerterbias; reale prospektive Validierung fehlt.

Fundstelle: arXiv v1; Tabelle 4, Abschnitt 4.5 und Anhang C.7.

### KI-Zugang und Lernen ohne KI im Folgetest

2026-10-04 · Preprint · randomisiertes Lernexperiment · [Originalquelle](https://arxiv.org/html/2607.08849v2)

Design: 211 Studierende, 205 im Follow-up nach einer Woche; GPT-4o-Zugang während der Lernphase.

- Wissenstest sofort ohne Hilfsmittel: +7,2 Prozentpunkte, p=0,021; ITT-Testauswertung n=210.
- Wissenstest nach einer Woche: +3,9 Prozentpunkte, p=0,068; n=205. Am 5%-Niveau nicht statistisch signifikant.
- Nutzungsweise: Tutor-Nutzung und Delegation wurden selbst gewählt. Untergruppen erlauben keinen kausalen Vergleich dieser Nutzungsarten.

Einordnung: Anstoß für die Gestaltung von Schulungen im pharmazeutischen Team.

Grenzen: Keine medizinische Population, kein Langzeit-Deskilling-Test. Regelverstöße belasten den unmittelbaren Test; Übertragbarkeit auf Fachpersonal offen.

Fundstelle: Contractor & Reyes, arXiv v2; Tabellen 4, 7 und A3.

### MIRA: Diagnostik und Aktionen in der virtuellen Patientenakte

2026-06-17 · Peer-reviewed · klinische Simulation · [Originalquelle](https://www.nature.com/articles/s41586-026-10675-5)

Design: Retrospektive MIMIC-IV-Fälle in einer EHR-Sandbox; 574 Fälle, acht Diagnosen.

- Diagnostik im direkten Vergleich: 87,8 % gegenüber 78,1 % bei vier Fachärzten, n=311 gepaarte Fälle; exakter McNemar-p=0,000287.
- Gesamtdatensatz: 88,9 % diagnostische Genauigkeit bei n=574.

Einordnung: Untersucht Denken und Handeln innerhalb eines kontrollierten klinischen Workflows.

Grenzen: Simulierte Gespräche aus retrospektiven Akten. Keine prospektive Patientenversorgung; Generalisierung und reale Sicherheit bleiben zu prüfen.

Fundstelle: Ferber et al., Nature 655, 1282–1291; Abb. 3a, Methods und Discussion.

## Vollständiges Quellenregister

- `medxpertqa-v3`: Zuo et al., Tsinghua University / Shanghai AI Laboratory. [MedXpertQA: Benchmarking Expert-Level Medical Reasoning and Understanding](https://arxiv.org/html/2501.18362v3). arXiv 2501.18362v3 · 06.06.2025. Forschungspublikation. Geprüft: 2026-10-17.
- `healthbench-pro-v1`: OpenAI et al.. [HealthBench Professional: Evaluating Large Language Models on Real Clinician Chats](https://arxiv.org/html/2604.27470v1). arXiv 2604.27470v1 · 30.04.2026. Preprint · Anbieterbeteiligung. Geprüft: 2026-10-17.
- `medagentbench-v2`: Jiang et al., Stanford. [MedAgentBench: A Realistic Virtual EHR Environment to Benchmark Medical LLM Agents](https://arxiv.org/html/2501.14654v2). arXiv 2501.14654v2 · 12.02.2025. Preprint. Geprüft: 2026-10-17.
- `alphafold2-nature`: Jumper et al. · Nature. [Highly accurate protein structure prediction with AlphaFold](https://www.nature.com/articles/s41586-021-03819-2). 15.07.2021 · DOI 10.1038/s41586-021-03819-2. Peer-reviewed · Strukturbiologie. Geprüft: 2026-10-17.
- `alphafold3-nature`: Abramson et al. · Nature. [Accurate structure prediction of biomolecular interactions with AlphaFold 3](https://www.nature.com/articles/s41586-024-07487-w). 08.05.2024 · DOI 10.1038/s41586-024-07487-w. Peer-reviewed · Strukturbiologie. Geprüft: 2026-10-17.
- `nobel-chemistry-2024`: Königlich Schwedische Akademie der Wissenschaften. [The Nobel Prize in Chemistry 2024](https://www.kva.se/en/news/the-nobel-prize-in-chemistry-2024/). Bekanntgabe 09.10.2024. Offizielle Preisbekanntgabe. Geprüft: 2026-10-17.
- `residencyrl-v1`: Liévin et al.. [ResidencyRL: Reinforcement Learning in Simulated Clinical Environments](https://arxiv.org/html/2608.07418v1). arXiv 2608.07418v1 · 07.08.2026. Preprint · klinische Simulation. Geprüft: 2026-10-17.
- `learning-impact-v2`: Zara Contractor & Germán Reyes. [Experimental Evidence on the Learning Impact of Generative AI](https://arxiv.org/html/2607.08849v2). arXiv 2607.08849v2 · 04.10.2026. Preprint · Bildungsforschung. Geprüft: 2026-10-17.
- `dartmouth-history`: Dartmouth. [The Founding and Future of AI](https://ai.dartmouth.edu/founding-and-future-ai). Historischer Überblick. Institutionelle Primärquelle. Geprüft: 2026-10-17.
- `deep-blue-history`: IBM. [Deep Blue](https://www.ibm.com/history/deep-blue). Historischer Überblick. Institutionelle Primärquelle. Geprüft: 2026-10-17.
- `alphafold-casp-history`: Google DeepMind. [AlphaFold: a solution to a 50-year-old grand challenge in biology](https://deepmind.google/blog/alphafold-a-solution-to-a-50-year-old-grand-challenge-in-biology/). CASP13 2018 und CASP14 2020. Autorenbericht. Geprüft: 2026-10-17.
- `turing-1950-source`: Alan M. Turing. [Computing Machinery and Intelligence](https://academic.oup.com/mind/article/LIX/236/433/986238). 1950-10-01 · DOI 10.1093/mind/LIX.236.433. Konzeptionelle Originalarbeit. Geprüft: 2026-10-17.
- `eliza-1966-source`: Joseph Weizenbaum. [ELIZA—a computer program for the study of natural language communication between man and machine](https://doi.org/10.1145/365153.365168). 1966 · DOI 10.1145/365153.365168. Originalarbeit. Geprüft: 2026-10-17.
- `mycin-1975-source`: Edward H. Shortliffe et al.. [Computer-based consultations in clinical therapeutics: Explanation and rule acquisition capabilities of the MYCIN system](https://www.sciencedirect.com/science/article/pii/0010480975900099). 1975 · DOI 10.1016/0010-4809(75)90009-9. Originalarbeit zu regelbasierter Entscheidungsunterstützung. Geprüft: 2026-10-17.
- `backprop-1986-source`: David E. Rumelhart, Geoffrey E. Hinton, Ronald J. Williams. [Learning representations by back-propagating errors](https://www.nature.com/articles/323533a0). 1986-10-09 · DOI 10.1038/323533a0. Methodische Originalarbeit. Geprüft: 2026-10-17.
- `alexnet-2012-source`: Alex Krizhevsky, Ilya Sutskever, Geoffrey E. Hinton. [ImageNet Classification with Deep Convolutional Neural Networks](https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html). 2012. Konferenz-Originalarbeit. Geprüft: 2026-10-17.
- `alphago-2016-source`: David Silver et al.. [Mastering the game of Go with deep neural networks and tree search](https://www.nature.com/articles/nature16961). 2016-01-27 · DOI 10.1038/nature16961. Originalarbeit. Geprüft: 2026-10-17.
- `skin-cancer-2017-source`: Andre Esteva et al.. [Dermatologist-level classification of skin cancer with deep neural networks](https://www.nature.com/articles/nature21056). 2017-01-25 · DOI 10.1038/nature21056. Retrospektiver Bildklassifikationsbenchmark. Geprüft: 2026-10-17.
- `gpt3-2020-source`: Tom B. Brown et al.. [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165v1). 2020-05-28. Originalarbeit / erste Preprint-Version. Geprüft: 2026-10-17.
- `instructgpt-2022-source`: Long Ouyang et al.. [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155v1). 2022-03-04. Originalarbeit / Preprint. Geprüft: 2026-10-17.
- `medpalm-preprint-2022-source`: Karan Singhal et al.. [Large Language Models Encode Clinical Knowledge](https://arxiv.org/abs/2212.13138v1). 2022-12-26. Erste Preprint-Verfügbarkeit. Geprüft: 2026-10-17.
- `gpt4-2023-source`: OpenAI et al.. [GPT-4 Technical Report](https://arxiv.org/abs/2303.08774v1). 2023-03-15. Technischer Autorenbericht. Geprüft: 2026-10-17.
- `medpalm-2023-source`: Karan Singhal et al.. [Large language models encode clinical knowledge](https://www.nature.com/articles/s41586-023-06291-2). 2023-07-12 · DOI 10.1038/s41586-023-06291-2. Peer-reviewed Benchmark und menschliche Antwortbewertung. Geprüft: 2026-10-17.
- `diagnostic-rct-2024-source`: Ethan Goh et al.. [Large Language Model Influence on Diagnostic Reasoning: A Randomized Clinical Trial](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2825395). 2024-10-28 · DOI 10.1001/jamanetworkopen.2024.40969. Randomisiertes Vignettenexperiment mit 50 Ärzten. Geprüft: 2026-10-17.
- `metr-2025-source`: Thomas Kwa et al.. [Measuring AI Ability to Complete Long Tasks](https://arxiv.org/abs/2503.14499v1). 2025-03-18. Originalarbeit zu Software-/Reasoning-Aufgaben. Geprüft: 2026-10-17.
- `amie-2025-source`: Tao Tu et al.. [Towards conversational diagnostic artificial intelligence](https://www.nature.com/articles/s41586-025-08866-7). 2025-04-09 · DOI 10.1038/s41586-025-08866-7. Verblindeter, randomisierter Simulationsvergleich. Geprüft: 2026-10-17.
- `mira-2026-source`: Dyke Ferber et al.. [Towards autonomous medical artificial intelligence agents](https://www.nature.com/articles/s41586-026-10675-5). 2026-06-17 · DOI 10.1038/s41586-026-10675-5. Retrospektive, fallbasierte klinische Simulation. Geprüft: 2026-10-17.

## Schematische Hintergrundpositionen aus der PPT

Ausschließlich Liniengeometrie; keine empirischen Leistungswerte. Der Nutzer hat den sichtbaren Horizont am 17.10.2026 auf 2030 begrenzt. Die ursprünglich bis 2035 reichende PPT ist unverändert archiviert.

| Spur | Jahr: illustrative Position |
| --- | --- |
| Allgemeine KI-Fähigkeit | 1950: 48, 1956: 50, 1965: 54, 1975: 60, 1985: 68, 1997: 75, 2012: 90, 2016: 100, 2020: 108, 2022: 118, 2024: 128, 2025: 136, 2026: 140, 2030: 150 |
| Medizinisches Wissen | 1970: 50, 2000: 54, 2012: 60, 2017: 70, 2022: 100, 2023: 110, 2024: 120, 2025: 128, 2026: 133, 2030: 143 |
| Klinisches Denken | 2000: 48, 2012: 54, 2017: 60, 2022: 72, 2023: 78, 2024: 84, 2025: 91, 2026: 96, 2030: 106 |
| Autonomie · METR-Kontext | 2019: 60.81, 2022: 81.16, 2023: 93.26, 2024: 103.68, 2025: 111.94, 2026: 120.2 |

## Korrekturen gegenüber den früheren Punktmarkern

- ELIZA-Publikation 1966 statt PPT-Kontrollpunkt 1965.
- Backpropagation Nature-Publikation 1986 statt PPT-Kontrollpunkt 1985.
- MYCIN kann mit der ursprünglichen Arbeit 1975 belegt werden; das Buch folgte 1976.
- Med-PaLM: erste Preprint-Verfügbarkeit 2022-12-26, Nature-Publikation 2023-07-12; nicht als zwei unabhängige Studien zählen.
- METR: arXiv v1 2025-03-18, Autorenbericht 2025-03-19. Modelljahr 2019 und Publikationsjahr 2025 unterscheiden; die sechs jährlichen PPT-Indizes sind keine extrahierten METR-Werte.
- GPT-4 technical report erschien zuerst 2023, nicht 2024 trotz Revision 2024.
- Nicht belegte PPT-Stützpunkte entfernen bzw. nur als unsichtbare schematische Liniengeometrie behalten. Keine automatischen Dot-Marker auf clipIllustration-Interpolationen.

Unbelegte ursprüngliche Marker wurden nicht durch thematisch passende Quellen scheinvalidiert. Sichtbar sind neue, datierte Publikations-/Ereignisanker an der schematischen Linie. Das gilt auch für negative Ergebnisse wie den Goh-RCT 2024; er belegt keinen stetigen Leistungsanstieg. Die Med-PaLM-Versionen 2022 und 2023 gehören zur selben Studienfamilie.

## Datenpflege

Strukturierte Ausgangsdaten: `data/evidence.js`, `data/pharma.js`, `data/history.js`, `data/point-evidence.js`. Diese Datei dokumentiert den Stand vom 17.10.2026. Bei Änderungen an Befunden, Zeitpunkten oder Quellen muss sie mit aktualisiert werden. Automatische Quellenüberwachung ist noch nicht eingerichtet.

## Ergänzung vom 18.10.2026: frühere Meilensteine der drei unteren Spuren

Neun Publikationsereignisse und eine separate Vertrauensbefragung ergänzen die 13 unveränderten Benchmark-Messwerte. Die gemeinsame horizontale Achse beginnt 2022. Die kleinen Ereignismarker liegen auf einer eigenen Datumslinie ohne Leistungsordinate; aus heterogenen Endpunkten entsteht keine gemeinsame Wachstumskurve. Der obere Graph und seine 24 Quellenanker wurden nicht verändert.

| Spur | Datum | Studie | Sichtbarer Befund |
| --- | --- | --- | --- |
| knowledge | 2022-12-26 | [Flan-PaLM / Med-PaLM](https://arxiv.org/abs/2212.13138v1) | 67,6 % im MedQA-Test |
| knowledge | 2023-02-09 | [ChatGPT & USMLE](https://journals.plos.org/digitalhealth/article?id=10.1371/journal.pdig.0000198) | 61,5 % in Step-3-Fragen |
| knowledge | 2025-06-06 | [MedXpertQA](https://arxiv.org/html/2501.18362v3) | 30,37 % für GPT-4o |
| assistance | 2023-04-28 | [Qualität & Empathie](https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2804309) | KI-Antwort in 78,6 % der Bewertungen bevorzugt |
| assistance | 2024-10-28 | [Ärzte mit GPT-4](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2825395) | Kein signifikanter Zusatznutzen |
| assistance | 2025-04-09 | [AMIE im Dialog](https://www.nature.com/articles/s41586-025-08866-7) | 159 simulierte Fälle |
| autonomy | 2022-01-26 | [STAR im Tiermodell](https://www.science.org/doi/10.1126/scirobotics.abj2908) | Vier robotische Eingriffe |
| autonomy | 2025-02-12 | [MedAgentBench](https://arxiv.org/html/2501.14654v2) | 64,0 % für GPT-4o |
| autonomy | 2026-06-17 | [MIRA im EHR](https://www.nature.com/articles/s41586-026-10675-5) | 87,8 % diagnostische Genauigkeit |

### Med-PaLM / MultiMedQA

`lower-medpalm-2022` · 2022-12-26 · Fragenbenchmark / Preprint · [Originalquelle](https://arxiv.org/abs/2212.13138v1)

Design: MultiMedQA bündelt sechs bestehende medizinische Fragensätze und HealthSearchQA; Flan-PaLM wird durch Prompting evaluiert, Med-PaLM medizinisch angepasst.

Befund: Flan-PaLM erreicht 67,6 % auf MedQA mit vier Antwortoptionen.

Grenzen: Nicht mit MedXpertQA, USMLE-Beispielfragen oder Patientennutzen vergleichen. Med-PaLM und Flan-PaLM sind unterschiedliche Varianten. Nature-Veröffentlichung vom 12.07.2023 ist dieselbe Studienfamilie, keine unabhängige Bestätigung.

Fundstelle: Originalarbeit: Ergebnisse und Methodik.

### ChatGPT: USMLE-Beispielfragen

`lower-usmle-2023` · 2023-02-09 · Peer-reviewed Fragenbenchmark · [Originalquelle](https://journals.plos.org/digitalhealth/article?id=10.1371/journal.pdig.0000198)

Design: Öffentliche USMLE-Beispielfragen, bildhaltige Aufgaben ausgeschlossen; drei Promptformate und explizite Behandlung unbestimmter Antworten.

Befund: Bei offenen Fragen und eingeschlossenen unbestimmten Antworten: Step1 45,4 %, Step2CK 54,1 %, Step3 61,5 %. Die oft verwendete Aussage 'USMLE bestanden' hängt stark vom Prompt- und Auswertungsaufbau ab.

Grenzen: Keine tatsächlich absolvierte Zulassungsprüfung, keine klinische Validierung. Haupttext nennt350 Aufgaben, aber seine Teilzahlen119+102+122 ergeben343; daher keine selbst berechneten Gesamtquoten/n. Frühere Preprint-Werte unterscheiden sich von der finalen Fassung.

Fundstelle: Methods Input source; Results; Fig2A/B.

### MedXpertQA v3

`lower-medxpert-2025` · 2025-06-06 · Medizinischer Fragenbenchmark · [Originalquelle](https://arxiv.org/html/2501.18362v3)

Design: Vollständiger Texttest, n = 2450; im Dashboard vorhandene Autorenprotokoll-Werte.

Befund: GPT-4o-2024-11-20 erreicht 30,37 % im Text-Gesamttest.

Grenzen: Schwererer anderer Benchmark. Niedrigere Prozentzahl bedeutet keinen Rückschritt gegenüber 2022/2023; keine Patientennutzenstudie.

Fundstelle: Originalarbeit: Ergebnisse und Methodik.

### ChatGPT-Antworten: Qualität & Empathie

`lower-ayers-2023` · 2023-04-28 · Verblindeter Querschnittsvergleich · [Originalquelle](https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2804309)

Design: 195 Reddit-Fragen; anonymisierte ärztliche und ChatGPT-Antworten jeweils von drei zugelassenen Gesundheitsfachkräften bewertet, insgesamt 585 Bewertungen.

Befund: Fachliche Bewerter bevorzugen die ChatGPT-Antwort in 78,6 % der Bewertungen (95 %-KI 75,0–81,8). Als empathisch/sehr empathisch gelten 45,1 % der Chatbot- gegenüber 4,6 % der ärztlichen Antworten.

Grenzen: Keine Messung von Patientenvertrauen oder Diagnosegenauigkeit. Chatbot-Antworten wesentlich länger; Bewerter waren Mitautoren, Skalen nicht vorab validiert, keine klinischen Endpunkte.

Fundstelle: Abstract; Results; Limitations.

### GPT-4-Zugang verbessert Ärzte hier nicht signifikant

`lower-goh-2024` · 2024-10-28 · Randomisiertes Vignettenexperiment · [Originalquelle](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2825395)

Design: 50 Ärzte, bis zu sechs Fallvignetten; GPT-4 plus konventionelle Hilfsmittel gegenüber konventionellen Hilfsmitteln.

Befund: Medianer diagnostischer Rubrikscore 76 % gegenüber 74 %; adjustierter Unterschied +2 Prozentpunkte, 95 %-KI −4 bis 8, p=0,60.

Grenzen: Kein signifikanter Zusatznutzen im Hauptvergleich, kein Patienten-Endpunkt. Explorative KI-allein-Ergebnisse nicht als primäres Studienergebnis ausgeben.

Fundstelle: Originalarbeit: Ergebnisse und Methodik.

### AMIE: Diagnostische Gespräche

`lower-amie-2025` · 2025-04-09 · Verblindeter Simulationsvergleich · [Originalquelle](https://www.nature.com/articles/s41586-025-08866-7)

Design: 159 simulierte Fall-Szenarien, 20 Hausärzte; randomisierter Crossover-Vergleich mit Patientendarstellern.

Befund: AMIE erzielt höhere diagnostische Genauigkeit und bessere Bewertungen auf vielen ärztlichen und Patientendarsteller-Achsen.

Grenzen: Simulierter Textchat. Keine reale Versorgung oder autonome Patientenbehandlung.

Fundstelle: Nature 642, 442–450; Abstract und Methods.

### STAR: Robotische Naht im Tiermodell

`lower-star-2022` · 2022-01-26 · Präklinische Robotik · bedingte Autonomie · [Originalquelle](https://www.science.org/doi/10.1126/scirobotics.abj2908)

Design: Phantomversuche sowie vier STAR-Operationen an lebenden Schweinen mit einer Woche Nachbeobachtung; Mensch wählt/bestätigt Nahtplan und korrigiert Fehlpositionen.

Befund: Ermöglicht robotische laparoskopische Dünndarmanastomosen unter Aufsicht. Im Phantomvergleich wurden 83,05 % von 118 Stichen beim ersten Versuch im autonomen Modus platziert.

Grenzen: Kleine präklinische Studie, keine Operation ohne menschliche Aufsicht und kein Menschenversuch. Robotik ist ein anderer Bereich als virtuelle EHR-Agenten; nicht als deren Zeitreihenbeginn oder klinische LLM-Autonomie ausgeben.

Fundstelle: Abstract; Fig3; Phantom model enhanced autonomous anastomosis.

### MedAgentBench: Virtuelle Patientenakte

`lower-medagent-2025` · 2025-02-12 · Preprint · EHR-Simulation · [Originalquelle](https://arxiv.org/html/2501.14654v2)

Design: 300 Aufgaben, erster Versuch, höchstens acht Runden, Autoren-Agent mit FHIR-Werkzeugen.

Befund: GPT-4o 64,0 % Erfolgsquote; Claude3.5 Sonnet v2 69,67 % im identischen Autorenprotokoll.

Grenzen: Virtuelle Umgebung, GET ausgeführt und POST nur simuliert. Keine reale autonome Patientenversorgung. Prozentwerte nicht mit chirurgischen Nähten vergleichen.

Fundstelle: Originalarbeit: Ergebnisse und Methodik.

### MIRA: Diagnostik und EHR-Aktionen

`lower-mira-2026` · 2026-06-17 · Peer-reviewed · retrospektive klinische Simulation · [Originalquelle](https://www.nature.com/articles/s41586-026-10675-5)

Design: 574 MIMIC-IV-Fälle, acht Diagnosen; direkter Vergleich auf 311 gepaarten Fällen mit vier Fachärzten.

Befund: Diagnostische Genauigkeit im direkten Vergleich 87,8 % gegenüber 78,1 %; exakter McNemar-p=0,000287. Gesamtdatensatz 88,9 % bei n = 574.

Grenzen: Dieser Wert misst Diagnostik, nicht den Anteil vollständig autonom erledigter klinischer Abläufe. Simulierte Gespräche aus retrospektiven Akten, kein prospektiver Versorgungsnachweis.

Fundstelle: Originalarbeit: Ergebnisse und Methodik.

### Frühe Befragung: Vertrauen hängt von der Aufgabe ab

`nov-trust-2023` · 2023-07-10 · Peer-reviewed Befragung · [Originalquelle](https://mededu.jmir.org/2023/1/e46939/)

Design: Januar 2023, n = 392 ausgewertete US-Teilnehmer, zehn reale Patientenportal-Fragen; gleichlange ärztliche/ChatGPT-Antworten, Herkunftserkennung plus Vertrauensfragen.

Befund: Mittleres Vertrauen 3,4/5 insgesamt; Diagnostik 2,90 und Therapie 2,89. ChatGPT-Antworten wurden in 65,5 % korrekt erkannt.

Grenzen: Nur schwach positives Gesamtvertrauen, kein Beleg starkem Vertrauen in Diagnosen/Therapie. Zehn Fragen; keine Genauigkeitsbewertung oder reale Behandlung, Empfehlung zur Arztkonsultation wurde aus Chatbot-Text entfernt.

Fundstelle: JMIR Medical Education 2023, e46939; Results und Tabelle 1.

### Welcher New-York-Times-Artikel könnte gemeint sein?

Die Erinnerung lässt sich nicht eindeutig zuordnen. Zwei zeitlich passende Kandidaten sind identifiziert; die wissenschaftlichen Aussagen stammen aus den jeweiligen Originalarbeiten, nicht aus der Presse. Der direkte NYT-Abruf war nicht möglich.

- 2023-06-12: [Doctors Are Using ChatGPT to Improve How They Talk to Patients](https://www.nytimes.com/2023/06/12/health/doctors-chatgpt-artificial-intelligence.html). Zeitlich früher und inhaltlich Empathie/Kommunikation passend; Ayers misst Bewerterpräferenz, nicht Patientenvertrauen.
- 2024-11-17: [A.I. Chatbots Defeated Doctors at Diagnosing Illness](https://www.nytimes.com/2024/11/17/health/chatgpt-ai-doctors-diagnosis.html). Diagnostikvergleich, in Berichterstattung auch Vertrauen/Umgang der Ärzte mit KI. Kein Beleg für starkes Patientenvertrauen.

Ayers 2023 misst fachliche Bewerterpräferenz/Empathie und nicht Patientenvertrauen. Nov 2023 misst tatsächlich Vertrauen, findet jedoch nur schwach positives Gesamtvertrauen. Die Formulierung „Menschen vertrauen der KI stark“ ist durch diese beiden Studien nicht pauschal gedeckt.

Neue Originalquellen:

- `lower-usmle-2023-source`: Tiffany H. Kung et al.. [Performance of ChatGPT on USMLE: Potential for AI-assisted medical education using large language models](https://journals.plos.org/digitalhealth/article?id=10.1371/journal.pdig.0000198). 2023-02-09 · DOI 10.1371/journal.pdig.0000198. Geprüft am 2026-10-18.
- `lower-ayers-2023-source`: John W. Ayers et al.. [Comparing Physician and Artificial Intelligence Chatbot Responses to Patient Questions Posted to a Public Social Media Forum](https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2804309). 2023-04-28 · DOI 10.1001/jamainternmed.2023.1838. Geprüft am 2026-10-18.
- `lower-star-2022-source`: Hamed Saeidi et al.. [Autonomous robotic laparoscopic surgery for intestinal anastomosis](https://www.science.org/doi/10.1126/scirobotics.abj2908). 2022-01-26 · DOI 10.1126/scirobotics.abj2908. Geprüft am 2026-10-18.
- `nov-trust-2023-source`: Oded Nov, Nina Singh, Devin Mann · JMIR Medical Education. [Putting ChatGPT’s Medical Advice to the (Turing) Test: Survey Study](https://mededu.jmir.org/2023/1/e46939/). 10.07.2023 · DOI 10.2196/46939. Geprüft am 2026-10-18.


## Interface update - 18 October 2026

The website and its source dialogs now use English. Presentation references are no longer displayed; the historical provenance recorded earlier in this document is retained for auditability. No scientific scores, dates or source URLs changed in this interface update.

Missing benchmark trend lines were caused by having only one publication date per comparison protocol. The compact interface now shows actual scaled model-comparison lines, with the original date, score and protocol behind each result. These are not time trends. Publication timelines connect the dated study milestones without assigning them a shared performance score. New comparable dated evaluations remain a curation task, not an interpolation task.
