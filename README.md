# AI in Medicine Monitor

Mobiles Dashboard von Gilles Penning für belegten KI-Fortschritt in der Medizin. Die erste Anwendung folgt [Variante A](docs/design/README.md): warmer heller Hintergrund, große Serifentitel und drei farbige Messspuren.

## Hauptgrafik 1950–2035

Die Startansicht orientiert sich am Zeitdiagramm der PowerPoint: gemeinsame Achse ab 1950, getrennte farbige Kurven, AlphaFold-Meilensteine und gestrichelte Szenarien bis 2035. Die Kurvenpositionen wurden aus Folie 6 extrahiert. Sie sind ausdrücklich schematisch und keine IQ- oder medizinische Leistungszeitreihe. Die METR-Kontextspur bezieht sich auf Software-Aufgaben. Originale Benchmark-Messwerte bleiben darunter in eigenen Skalen.

## Implementierter Umfang

- Verlauf mit getrennten Skalen für Wissen, Assistenz und selbstständige Abläufe.
- Zeitregler mit Abspielfunktion und exaktem Datumsfilter.
- Modellfilter und Detaildialog mit Quelle, Testkonfiguration und Grenzen.
- Forschungsereignisse, Anwendungsübersicht und Quellenregister.
- Reduzierter Vortragsmodus; Escape beendet den Modus.
- JSON-Export des gefilterten Stands einschließlich Quellen.
- Responsive Ansicht, Tastaturnavigation, native Dialoge und Unterstützung reduzierter Bewegung.

## Pharma & Studien

Die zusätzliche Ansicht Studien enthält fünf geprüfte Einträge aus der Pharma-Präsentation: AlphaFold 2, AlphaFold 3, Chemie-Nobelpreis 2024, ResidencyRL und das Lernexperiment von Contractor & Reyes. Themen- und Datumsfilter sowie Detaildialoge zeigen Design, Befunde und Grenzen. Nobelpreis, Strukturbenchmark, Simulation und Lernexperiment sind getrennt gekennzeichnet. Der JSON-Export enthält die ausgewählten Studien samt Quellen.

Unter Anwendungen ergänzen vier Pharma-Ansätze die Messspuren. Ideen ohne konkreten Nutzenbeleg bleiben als Anwendungsansatz oder Szenario markiert. Details und bewusste Ausschlüsse: [Quellenprüfung](docs/pharma-source-review-2026-10-17.md).

## Datenstand

Die erste Ausgabe enthält 13 historische Messpunkte aus drei Originalarbeiten. Die Daten stehen in `data/evidence.js`, getrennt vom Darstellungs- und Filtercode.

Die Datumswerte sind Veröffentlichungsdaten der jeweiligen Paper-Version. Pro Spur liegt bislang nur eine Ausgabe vor. Deshalb werden Punkte gezeigt, keine erfundenen Wachstumskurven. Unterschiedliche Systemkonfigurationen bleiben getrennte Vergleichsgruppen.

Die Quellen wurden am 17. Oktober 2026 geprüft. Diese Auswahl ist kein aktuelles Gesamtranking und noch nicht unabhängig fachlich freigegeben. Es läuft keine automatische wöchentliche Quellenaktualisierung.

## Starten

Die Anwendung benötigt zur Laufzeit keine Pakete, Konten oder externen Dienste. ES-Module müssen über einen Webserver geladen werden:

```bash
git clone https://github.com/gilles-pe/ai-in-medicine-monitor.git
cd ai-in-medicine-monitor
python3 -m http.server 4173 --bind 127.0.0.1
```

Dann http://127.0.0.1:4173 öffnen.

## Prüfen und paketieren

Node.js 22 oder neuer:

```bash
npm install
npm test
npx playwright install chromium
npm run test:ui
npm run build
```

`dist/` enthält danach ausschließlich die statische Anwendung. Die Node-Tests prüfen Datumssicherheit, Vergleichsgruppen, HTML-Escaping und Datenintegrität. Die Browserprüfungen decken die Hauptfunktionen auf Desktop und 390px Mobilbreite ab.

Ein CI-Workflow führt Tests und Paketierung bei Codeänderungen aus. Der Workflow aktualisiert keine medizinischen Daten und veröffentlicht keine Website.

## Struktur

- `index.html`, `styles.css`, `app.js`: Oberfläche und Interaktionen.
- `data/evidence.js`: kuratierte Messpunkte, Quellen und Ereignisse.
- `lib/selectors.js`: pure Filter- und Vergleichslogik.
- `tests/`: Daten-, Logik- und Browserprüfungen.
- `scripts/build.mjs`: statisches Ausgabepaket.
- `docs/`: Planung, Methode, Entscheidungen und visuelle Referenz.

## Projektunterlagen

- [Projektbrief](docs/project-brief.md)
- [Datenquellen und Messgrößen](docs/data-sources.md)
- [Evidenzregister-Entwurf](docs/evidence-register.md)
- [Entscheidungen](docs/decisions.md)
- [Umsetzungs- und Prüfstand](docs/implementation-status.md)
- [Aktive Übergabe](docs/ai-in-medicine-monitor-handover.md)
- [Roadmap](docs/roadmap.md)

Der [gemeinsame Drive-Brief](https://docs.google.com/document/d/16gTQyCiOEIZr9XnZ7nV4oHsHxHlLLYbLWlL4ovtRvu4/edit) verbindet das Vorhaben mit Substack / TED. Eine automatische Projekt- oder Drive-Synchronisierung ist nicht eingerichtet.

## Hosting

Live: [AI in Medicine Monitor](https://ai-in-medicine-monitor.gillesp.chatgpt.site). Die Website wurde am 17. Oktober 2026 über Sites privat bereitgestellt; Zugriff hat zunächst nur der Eigentümer nach Anmeldung. Die erfolgreiche Bereitstellung wurde vom Hosting-Dienst bestätigt.

Die Projektidentität steht in `.openai/hosting.json`. Der Anwendungscode entspricht dem in GitHub CI geprüften Stand: 12 Node- und 16 Desktop-/Mobil-Browserprüfungen sowie die Paketierung bestanden. Die zusätzliche manuelle Vorschau war wegen einer Berechtigung der Ausführungsumgebung nicht möglich; siehe [Prüfstand](docs/implementation-status.md).

GitHub bleibt das Entwicklungsrepository. Die Sites-Quellversion wird über den unterstützten Veröffentlichungsprozess synchronisiert; ein GitHub-Push veröffentlicht nicht automatisch.
