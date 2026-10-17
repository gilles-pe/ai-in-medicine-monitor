# AI in Medicine Monitor: Datenquellen und Messgrößen

Stand: 17. Oktober 2026. Status: geprüfter Planungsvorschlag, noch keine freigegebene Datenserie. Es wurden Originalquellen gelesen, keine Modelle neu evaluiert.

## Empfehlung

Die drei vorgeschlagenen Spuren beibehalten. Jede bekommt ihre eigene Metrik und dieselbe Zeitachse. Im ersten Umfang bilden sie Sprachmodelle und klinische Agenten ab. Bilddiagnostik, Robotik und Arzneimittelforschung sind damit nicht umfassend vermessen; sie erhalten vorerst eigene Meilensteine.

| Spur | Empfohlene Quelle | Sichtbare Messgröße | Aussage |
| --- | --- | --- | --- |
| Medizinisches Wissen und Falllösung | MedXpertQA | Richtige Antworten in %, Text und MM getrennt | Leistung auf anspruchsvollen medizinischen Aufgaben |
| Qualität medizinischer Assistenz | HealthBench Professional | Längenbereinigter Rubrikscore, Punkte auf der veröffentlichten 0–100-Skala | Antwortqualität bei klinischen Chat-Aufgaben |
| Selbstständige Aufgabenerledigung | MedAgentBench | Erfolgsquote beim ersten Versuch in %, zusätzlich Query und Action getrennt | Aufgabenerledigung durch ein Agentensystem in einer virtuellen EHR-Testumgebung |

Die Auswahl bleibt ein Vorschlag. Ein Gesamtwert „KI in der Medizin“ oder eine Umrechnung in IQ wird nicht empfohlen: Die drei Tests messen unterschiedliche Dinge.

## 1. MedXpertQA

Belegt: Die Originalarbeit beschreibt 4.460 Aufgaben und getrennte Text-/MM-Bereiche. Das Autoren-Repository stellt Evaluationscode bereit; die Datenkarte enthält Entwicklungs- und Testdateien sowie Modalitäts- und Aufgabenmerkmale. [M1–M3]

Empfehlung: Accuracy jeweils auf dem vollständigen, festgehaltenen Testsplit. Text und MM weder mitteln noch als dieselbe Serie verbinden. Fachgebiet und Reasoning-/Understanding-Teilwerte nur mit dokumentiertem Nenner zeigen. Entwicklungssplit und Testsplit unterscheiden.

Verfügbarkeit: Veröffentlichung und Autoren-Leaderboard liefern historische Ausgangspunkte. Das aktuelle Repository verlinkt außerdem Herstellerberichte. Deren Testbedingungen können abweichen; jede Übernahme benötigt eine eigene Methodikprüfung. Ein durchgehend gepflegter, vergleichbarer Verlauf bis heute ist damit noch nicht belegt. [M2, M4]

Vor Aufnahme: Datensatzrevision, Split, Aufgabenanzahl, Modellversion, Bildverarbeitung, Prompt, Antwortauswertung, Werkzeuge und Rechenbudget dokumentieren. Ohne vergleichbare Bedingungen erscheinen Werte in getrennten Serien.

## 2. HealthBench Professional

Belegt: 525 Aufgaben betreffen Beratung, Schreiben/Dokumentation und Recherche. Der Primärwert ist längenbereinigt und keine Prozent-Trefferquote. Das Paper beschreibt GPT-5.4 mit niedrigem Reasoning als Standardbewerter; sein Bewertungs- und Längenkorrekturverfahren gehört zur Serienversion. Die offizielle interne Evaluationsimplementierung wird nicht veröffentlicht. [H1]

Die Herausgeber beschreiben eine Anreicherung schwieriger Fälle und einen starken ärztlichen Vergleich mit Fachgebietszuordnung, unbegrenzter Bearbeitungszeit und Webzugang. Das ist eine auf diesen Test begrenzte Referenz, keine allgemeine Messung ärztlicher Leistung. [H2]

Empfehlung: Hauptscore plus die drei Aufgabengruppen. Original-HealthBench, HealthBench Hard, rohe und längenbereinigte Professional-Werte getrennt halten. Bewerterwechsel und eigene externe Nachimplementierungen kennzeichnen und nicht ungeprüft mit den publizierten Ergebnissen verbinden.

Verfügbarkeit: Paper-Ergebnisse mehrerer Anbieter sind vorhanden; veröffentlichte Daten sind verlinkt. Eine lückenlose aktuelle Modellhistorie oder ein dauerhaft gepflegter Ergebnisfeed wurde nicht nachgewiesen. Ein Produkt mit Werkzeugen und ein Basismodell gelten als unterschiedliche Systeme.

Vor Aufnahme: Evaluationsimplementierung, Rubrikversion, Bewerter, Längenanpassung, Reasoning, Verbosity, Werkzeuge, Stichprobe und Unsicherheit festhalten. Patientennutzen und Fehlerwahrscheinlichkeit lassen sich aus dem Score allein nicht ableiten.

## 3. MedAgentBench

Belegt: Der Test umfasst 300 Aufgaben in einer FHIR-Umgebung. Die Arbeit verwendet pass@1 und höchstens acht Interaktionsrunden. Query- und Action-Aufgaben werden getrennt ausgewertet. Im beschriebenen Aufbau werden GET-Anfragen ausgeführt, POST-Schreibaktionen dagegen simuliert und ihre Payloads geprüft. [A1]

Empfehlung: Gesamt-SR und Query-/Action-SR anzeigen, immer mit dem Label „virtueller EHR-Test“. Die Messung gehört zum gesamten System aus Modell, Orchestrierung und Werkzeugen. Mehr Versuche, ein anderer Rundengrenzwert oder ein anderes Bewertungsskript ergeben eine andere Vergleichsserie.

Verfügbarkeit: Autoren-Webseite mit Ergebnistabelle sowie Forschungs-Repository sind zugänglich. Der Code benötigt zusätzliche Umgebung und Referenzlösungen; deren vollständiger Aufbau wurde hier nicht erprobt. Neue, vergleichbar konfigurierte Messungen aktueller Modelle sind noch zu recherchieren. [A2, A3]

Vor Aufnahme: Aufgabenrevision, Server-/Container-Version, Funktionsumfang, Orchestrierung, Rundengrenze, Temperatur, Abbruchregeln und Bewertungsverfahren dokumentieren. Sicherheitsfehler oder menschliche Korrekturen separat erfassen, falls berichtet; fehlende Angaben bleiben unbekannt.

## Meilensteine und ergänzende Quellen

| Bereich | Quelle / Auswahlregel | Darstellung |
| --- | --- | --- |
| Medizinprodukte | FDA-Liste als Einstieg, danach den verlinkten individuellen Entscheidungsdatensatz lesen | Zulassungs-/Freigabeereignis mit Zweck, Region und Datum |
| Klinische Evidenz | Originalpublikation mit Studiendesign, Population, Endpunkt, Vergleich und Unsicherheit | Eigenständiges Studienereignis; keine Ableitung aus Benchmark-Scores |
| Forschung / Arzneimittel | Originalarbeit bzw. konkreter Studienregistereintrag | Entdeckung, Studienstart, Ergebnis und Arzneimittelzulassung als verschiedene Ereignisse |
| Allgemeine KI-Autonomie | METR nur als optionale Kontextspur | Software-Aufgabenhorizont, ausdrücklich außerhalb der medizinischen Messung |
| Zukunft | Explizit bezeichnete Annahmen | Separater Szenariobereich, keine gemessene Verlängerung der Kurven |

Die FDA-Liste betrifft den US-Marktzugang, ist nach eigener Angabe unvollständig und wird periodisch ergänzt. Ein Listeneintrag belegt nicht automatisch einen Vorteil gegenüber der bisherigen Versorgung oder eine Nutzung in Deutschland. [F1]

METR misst Aufgaben nach menschlichem Zeitbedarf bei vorgegebenem Erfolg, überwiegend aus Software, ML und Cybersicherheit. Es misst weder autonome Laufzeit noch medizinische Arbeitsstunden. Die Seite meldet seit 8. September 2026 keine aktive Pflege mehr; als laufende medizinische Hauptquelle ist sie ungeeignet. [T1]

Konkrete klinische Studien und Arzneimittel-Meilensteine werden erst nach eigener Quellenprüfung ausgewählt. Die historischen und zukünftigen Punkte aus der Präsentation sind keine bereits freigegebenen Registereinträge.

## Zeitachse und Vergleichsregeln

1. Hauptdatum ist das dokumentierte Evaluationsdatum. Ist es unbekannt, das Veröffentlichungsdatum mit Kennzeichnung verwenden. Modellveröffentlichung, Ergebnisveröffentlichung und Prüfdatum getrennt speichern.
2. Ein Messpunkt bezeichnet eine genaue Modell- oder Systemversion. Ein Anbietername allein reicht nicht.
3. Eine Linie verbindet nur Ergebnisse derselben Vergleichsgruppe. Neue Aufgaben, Bewerter, Werkzeuge oder Budgets können einen Serienbruch erfordern.
4. Ein Stufenverlauf darf ausschließlich das beste bis dahin öffentlich belegte Ergebnis einer vergleichbaren, definierten Quellenauswahl zeigen. Er bedeutet nicht, dass sämtliche Modelle weltweit getestet wurden.
5. Keine geglätteten Übergänge, interpolierten Wochenwerte oder künstliche Rückrechnung alter Modelle.
6. Menschliche Referenzen nur dort zeigen, wo sie im selben Protokoll gemessen wurden. Keine gemeinsame „Arzt = 100“-Linie.
7. Konfidenzintervalle und Stichprobengrößen übernehmen, soweit berichtet. Fehlende Unsicherheit als „nicht berichtet“ markieren; aus kleinen Rangunterschieden keine gesicherten Verbesserungen ableiten.
8. Die drei Spuren teilen die Zeitachse, aber keine Bedeutung ihrer Prozent-/Punkteskalen. Ein hoher Score in einer Spur ersetzt keine klinische Validierung.

## Vorgeschlagener Wochencheck

Noch nicht eingerichtet. Zu einem später festzulegenden Termin: Autorenquellen und ausgewählte Herstellerberichte auf neue Ergebnisse prüfen; Kandidaten ins Register aufnehmen; Methodik abgleichen; Änderungen fachlich prüfen; freigegebene Einträge mit Änderungsnotiz veröffentlichen.

„Wöchentlich geprüft“ bedeutet nicht „wöchentlich neu gemessen“. „Letzte Quellenprüfung“, „neuester belegter Messpunkt“ und „Quellenstand“ separat anzeigen. Wenn nichts Neues belegt ist, bleiben die Werte bestehen. Für eingefrorene Quellen neue Ausgaben und Nachfolgearbeiten suchen; bis dahin den letzten belegten Stand sichtbar lassen.

## Aufnahmebedingungen für den ersten Datensatz

- Pro Spur mindestens zwei methodisch vergleichbare, belegte Ergebnisse für eine Verlaufslinie; bei nur einem Ergebnis ein einzelner Punkt.
- Pro gewünschtem Anbieter nach belastbaren Ergebnissen suchen; Lücken sichtbar lassen, keine Werte ergänzen.
- Erste historische Ergebnisse auf Originaltabellen und möglichst eingefrorene Daten-/Codeversionen zurückführen.
- Datenzugang und Nutzungsbedingungen für die geplante Veröffentlichung prüfen; keine Testfragen oder Patientendatensätze in das öffentliche Dashboard kopieren.
- Reviewer und Freigabeverfahren festlegen. Erst danach Datenimport, Oberfläche und Aktualisierung bauen.

## Originalquellen

Alle folgenden Quellen wurden am 17. Oktober 2026 aufgerufen. Der Aufruf allein belegt keine vollständige Reproduzierbarkeit.

- M1: [MedXpertQA, Paper v3, 6. Juni 2025](https://arxiv.org/html/2501.18362v3), insbesondere Ergebnisse und Evaluationsdetails.
- M2: [MedXpertQA, Autoren-Repository](https://github.com/TsinghuaC3I/MedXpertQA), Abschnitte Usage und Benchmark Adoption.
- M3: [MedXpertQA, Datenkarte der Autoren](https://huggingface.co/datasets/TsinghuaC3I/MedXpertQA), insbesondere Datensatzstruktur und Splits.
- M4: [MedXpertQA, Autoren-Leaderboard](https://medxpertqa.github.io/).
- H1: [HealthBench Professional, Paper v1, 30. April 2026](https://arxiv.org/html/2604.27470v1), Abschnitte 4 und 8.
- H2: [OpenAI, Einführung und Benchmarkbeschreibung](https://openai.com/index/making-chatgpt-better-for-clinicians/), Evaluationsabschnitt.
- A1: [MedAgentBench, Paper v2, 12. Februar 2025](https://arxiv.org/html/2501.14654v2), Abschnitte 2.4 und 2.5.
- A2: [MedAgentBench, Autoren-Webseite und Ergebnistabelle](https://stanfordmlgroup.github.io/projects/medagentbench/).
- A3: [MedAgentBench, Forschungs-Repository](https://github.com/stanfordmlgroup/MedAgentBench).
- F1: [FDA, Liste KI-fähiger Medizinprodukte](https://www.fda.gov/medical-devices/artificial-intelligence-enabled-medical-devices/list-artificial-intelligence-enabled-medical-devices), Erläuterungen zur Liste.
- T1: [METR, Task-Completion Time Horizons](https://metr.org/time-horizons/), Methodik, Einschränkungen und Aktualisierungsstatus.
