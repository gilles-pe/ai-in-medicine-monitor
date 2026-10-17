# AI in Medicine Monitor

Mobiles Dashboard von Gilles Penning für belegten KI-Fortschritt in der Medizin. Die erste Anwendung folgt [Variante A](docs/design/README.md): warmer heller Hintergrund, große Serifentitel und drei farbige Messspuren.

## Implementierter Umfang

- Verlauf mit getrennten Skalen für Wissen, Assistenz und selbstständige Abläufe.
- Zeitregler mit Abspielfunktion und exaktem Datumsfilter.
- Modellfilter und Detaildialog mit Quelle, Testkonfiguration und Grenzen.
- Forschungsereignisse, Anwendungsübersicht und Quellenregister.
- Reduzierter Vortragsmodus; Escape beendet den Modus.
- JSON-Export des gefilterten Stands einschließlich Quellen.
- Responsive Ansicht, Tastaturnavigation, native Dialoge und Unterstützung reduzierter Bewegung.

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

Der Code liegt im privaten [GitHub-Repository](https://github.com/gilles-pe/ai-in-medicine-monitor). Ein Hosting-Projekt und eine Live-URL sind noch nicht eingerichtet. Die aktuelle Sitzung konnte keine lokale Laufzeit starten; Browserausführung und Online-Bereitstellung müssen vom verfügbaren Laufzeit-/CI-Ergebnis getrennt beurteilt werden.
