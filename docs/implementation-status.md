# AI in Medicine Monitor: Umsetzung

Stand: 17. Oktober 2026.

## Auftrag und Ergebnis

Gilles hat die Programmierung und bei Bedarf Subagenten ausdrücklich beauftragt. Dies ersetzt die vorherige Begrenzung auf reine Planung.

Die erste statische Anwendung ist implementiert: drei Messspuren, Datum/Monatsregler, Abspielfunktion, Modellfilter, Quellen- und Detailansicht, Forschungsereignisse, Anwendungsübersicht, Vortragsmodus und gefilterter JSON-Export.

Technische Grundlage sind Browser-ES-Module und CSS ohne Laufzeitpakete, Datenbank oder externe Dienste. Der Build kopiert die Anwendung nach dist/.

## Daten

13 aggregierte historische Ergebnisse aus drei versionierten Originalarbeiten. Die Wissensspur nutzt den vollständigen MedXpertQA-Text-Test; kleinere Stichproben sind ausgeschlossen. Alle Seed-Daten verwenden Publikationsdaten. Pro Spur liegt zunächst eine Ausgabe vor; ein Zeittrend wird daraus nicht abgeleitet.

Quellenprüfung und betrachteter Datenstand sind getrennt. Die Daten aktualisieren sich nicht automatisch und sind noch nicht unabhängig fachlich freigegeben.

## Bestandene Prüfungen

Implementierungs-Commit: 38f3c403a79893a3ba75580db88f9dea3b297afe.

[CI-Prüfung](https://github.com/gilles-pe/ai-in-medicine-monitor/actions/runs/39047376173):

- 12 Node-Tests bestanden.
- Statische Paketierung bestanden.
- 16 Playwright-Prüfungen bestanden, acht jeweils auf Desktop und 390px Mobilbreite.
- Geprüft wurden Startansicht, Quellendialog und Fokus, Datum-/Modellfilter, Ansichtswechsel, Vortragsmodus/Escape, gefilterter JSON-Export und horizontale Überläufe.

Zusätzlich ausgeführt: Syntaxprüfung, 49 Daten-/Logik-Assertions und 13 Integrationsprüfungen im V8-DOM-Shim. Diese ersetzen keine Browserprüfung; die echten Browserprüfungen wurden gesondert in CI ausgeführt.

Der erste CI-Lauf hatte trotz bestandener Tests einen roten Gesamtstatus, weil GitHubs Artefaktspeicherkontingent voll war. Der optionale Berichtupload wurde deshalb auf fehlgeschlagene Prüfungen begrenzt und darf deren Auswertung nicht zusätzlich blockieren. Es wurden keine vorhandenen Artefakte gelöscht und keine Abrechnungs-/Kontoeinstellungen geändert.

Der [korrigierte CI-Lauf](https://github.com/gilles-pe/ai-in-medicine-monitor/actions/runs/39047543934) für Commit fcfdaab246cb305e6eb9deb18e1545455e73e447 ist anschließend vollständig grün abgeschlossen. Der Anwendungscode ist gegenüber dem ersten bestandenen Testlauf unverändert.

## Private Live-Bereitstellung

Am 17. Oktober 2026 ausdrücklich beauftragt und erfolgreich abgeschlossen.

- URL: https://ai-in-medicine-monitor.gillesp.chatgpt.site
- Zugriff: zunächst nur Eigentümer nach Anmeldung.
- Site: appgprj_6ad39d7f6b508191ae06d99968c42699
- Bereitstellung: appgdep_6ad39de047e08191b808ae8f2c6fe7ca
- Gespeicherte Version: appgprj_6ad39d7f6b508191ae06d99968c42699~appgver_802e8700b818819183275f4f0cee30c8
- Veröffentlichter Sites-Quellcommit: 3a35abe347a9917715d393219615e75a222c2875
- Herkunft des Anwendungscodes: GitHub-Commit b4716fa339b9effae017f7b37c8dd86cc91e8a79; alle 26 Textdateien wurden beim Übernehmen anhand ihrer Git-Blob-Hashes geprüft. Die Hosting-Konfiguration kam hinzu.

Das statische Paket wurde lokal erfolgreich gebaut, die Quelle über den Sites-Prozess übertragen und die Bereitstellung mit Status `succeeded` und der oben genannten URL bestätigt. Zugangsdaten sind nicht im Repository gespeichert.

## Verbleibende Grenzen

Die zusätzliche manuelle Vorschau konnte nicht starten: `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`. Dies ist eine Einschränkung der Vorschauumgebung. Es wurde kein Ersatzserver gestartet und keine erfolgreiche visuelle Abnahme behauptet. Die zuvor bestandenen echten Desktop-/Mobil-Interaktionstests bleiben für den unveränderten Anwendungscode gültig. Eine pixelgenaue Abnahme gegen Variante A steht aus.

## Nächste Arbeit

1. Gestaltung manuell gegen Variante A abnehmen, sobald die Vorschau wieder verfügbar ist.
2. Weitere vergleichbare Messstände und klinische Evidenz fachlich kuratieren.
3. Erst nach definiertem Prüf- und Freigabeprozess eine wöchentliche Datenaktualisierung einrichten.

## Pharma-Erweiterung vom 17. Oktober 2026

Die beauftragte Drive-PowerPoint wurde einschließlich relevanter Bildfolien geprüft. Fünf Forschungs-/Kontexteinträge, vier Pharma-Anwendungsansätze und fünf Meilensteine ergänzen den Monitor. Die 13 Benchmark-Messpunkte bleiben unverändert.

[CI für den Anwendungscode](https://github.com/gilles-pe/ai-in-medicine-monitor/actions/runs/39054021747), Commit 4297d7ca170e3a9f83cdbaef399451c414d8dbab: vollständig erfolgreich. 14 Node-Tests, statischer Build und 20 Browserprüfungen auf Desktop und 390px Mobilbreite bestanden. Zusätzliche Abläufe prüfen Themen-/Datumsfilter, Studiendetails, Pharma-Navigation, Studienexport und alle vier Ansichten auf horizontalen Überlauf.

Die manuelle visuelle Abnahme bleibt durch die bereits dokumentierte Vorschau-Berechtigung eingeschränkt. Die Original-PowerPoint wurde nicht verändert. Siehe [Übernahmeprotokoll](pharma-source-review-2026-10-17.md).

## PPT-Hauptgrafik und Header vom 17. Oktober 2026

Nutzerkorrektur umgesetzt: gemeinsame Grafik 1950–2035, vier aus der PPT extrahierte schematische Kurven, sichtbare AlphaFold-Meilensteine, eigene Zukunftsszenarien. Benchmark-Messwerte bleiben getrennt. M-Marke und „Fortschritt mit Quellen“ sind entfernt; die Kopfzeile zeigt „Letztes Update: 17.10.2026“ aus einem gespeicherten Datum.

[CI](https://github.com/gilles-pe/ai-in-medicine-monitor/actions/runs/39056720823) für Commit b03e493aee2c24fe8c680a568cdd13900a423126: erfolgreich, 16 Node-Tests und 22 Desktop-/Mobil-Browserprüfungen sowie statischer Build bestanden.

Die Live-Ansicht wurde zusätzlich über den verbundenen Chrome-Browser tatsächlich angesehen: Desktop und 390×844px, sichtbare AlphaFold-Schaltflächen und Datumszeile, kein horizontaler Seitenüberlauf. Die mobile Grafik öffnet beim ausgewählten Jahr und bleibt bis 1950 verschiebbar. Dies ergänzt die frühere, durch den lokalen Preview-Supervisor begrenzte visuelle Prüfung.

Erfolgreiche private Veröffentlichung: https://ai-in-medicine-monitor.gillesp.chatgpt.site

- Sites-Quellcommit: 170a3884fbe146363db4826cbc73d79f61f2b12d
- Deployment: appgdep_6ad3b9b6e174819183d12a5f92a814db
- Version: appgprj_6ad39d7f6b508191ae06d99968c42699~appgver_f291775800f8819199b1050a318e4096
- [Aktuelle Desktop-Ansicht](design/current-dashboard.png)

Die genaue Abgrenzung von Illustration und Messwerten steht in [Grafikprotokoll](presentation-chart-2026-10-17.md).


## Quellenanker und Begrenzung bis 2030 – 17. Oktober 2026

Die Beschriftung lautet „IQ zur Verdeutlichung“. Die große Grafik enthält 24 belegte Meilensteine an 22 Markern; zwei gleichjährige Paare öffnen eine Auswahl. Alle Marker führen zu Originalquellen. Die Quellen belegen den Meilenstein und dessen Befund, nicht die schematische IQ-Höhe. Unbelegte Zwischenmarker und zukünftige Punktmarker wurden entfernt. Zeithorizont und Bedienelemente enden 2030. Drei anklickbare Vorschaukarten erschließen die unveränderten 13 Benchmark-Messwerte. MIRA wurde als sechster Studien-/Kontexteintrag ergänzt.

[Studien und Hintergrunddaten](studies-and-background.md) dokumentiert Quellen, Befunde, alle Messwerte, schematische Hintergrundpositionen und den wiedergefundenen Ursprung im Gespräch vom 04.08.2026. [TODO](TODO.md) enthält insbesondere gestaltete Hover-Karten je Punkt, Tastatur-/Mobilzugang und weitere Evidenzpflege.

[CI](https://github.com/gilles-pe/ai-in-medicine-monitor/actions/runs/39058316733), Commit c9e5c30db8cb1c664ccc4ef622b19e7821c26330: 18 Node-Tests, Build und 24 Browserprüfungen erfolgreich. Anschließend wurde die Szenariobeschriftung zur Vermeidung einer Überlappung gekürzt und auf Nutzerwunsch „Vorschau wählen und Grafik öffnen“ entfernt (Commits 66d87a86726ebf1a6012e53f3b008f90a7ac8ba7 und 4714a863f9307b4a9e0755e451be2bc7df2bd6b3); 18 Node-Tests und Build erneut erfolgreich. Keine funktionale Änderung nach der Browser-Testserie.

Private Bereitstellung erfolgreich: https://ai-in-medicine-monitor.gillesp.chatgpt.site, Deployment appgdep_6ad3c04f43908191b472e565e36ba970, Quellcommit d9def5c9cd39b06354f2727f0c96536f0899a2b4. Live geprüft: Quellen-Auswahl → MIRA → korrekte Nature-Originalquelle, Vorschau → Messspur, 2030-Grenze und kein horizontaler Seitenüberlauf. Mobil bei 390 × 844: drei bedienbare Vorschauen, aktueller Grafikausschnitt und kein Seitenüberlauf. Desktop-Sichtprüfung einschließlich korrigierter Achsenbeschriftung abgeschlossen; Bildschirmgröße danach zurückgesetzt.

![Live-Stand mit Quellenankern und Vorschauen](design/current-dashboard-2030.png)

## Redaktionelle Gestaltung und frühere Meilensteine - 18. Oktober 2026

Die obere Grafik, ihre Liniengeometrie und die 24 Quellenanker bleiben unverändert. Die übrige Gestaltung wurde näher an Konzept A ausgerichtet: offene Diagrammspuren, größere Typografie, weniger Kartenflächen, flache Quellen- und Modellverweise. Die untere Datumsachse beginnt 2022. Je Spur sind drei eigenständige Publikationsmeilensteine mit Quelle und Grenzen ergänzt; ihre Ereignismarker haben keine Leistungsordinate und werden nicht zu einer vergleichbaren Wachstumskurve verbunden. Die 13 Benchmark-Messwerte sind unverändert.

Wissen: Flan-PaLM/Med-PaLM (2022), ChatGPT/USMLE-Beispielfragen (2023), MedXpertQA (2025). Denken/Assistenz: Ayers' Antwortvergleich (2023), Gohs Vignetten-RCT (2024), AMIE (2025). Selbstständige Abläufe: STAR im präklinischen Tiermodell (2022), MedAgentBench (2025), MIRA (2026). Die frühe Vertrauensbefragung von Nov et al. (2023) ist separat verlinkt. Präferenz, Vertrauen, Diagnostik, Robotik und EHR-Aufgabenerledigung bleiben getrennte Endpunkte.

[CI](https://github.com/gilles-pe/ai-in-medicine-monitor/actions/runs/39093824923), Commit 37ab63ef089d1b34dcc67c902226729d43a487df: erfolgreich. 21 Node-Tests, Build und 26 Browserprüfungen für Desktop und Mobilansicht. Die neue Prüfung deckt die historischen Quellen, Datumsgrenzen, getrennte Evidenztypen, Tastaturbedienung und den Export ab. Keine zusätzliche manuelle Sichtprüfung: der Browser-Connector ist in dieser Sitzung nicht verfügbar; kein alternativer Vorschau-Server wurde gestartet.

Quellen und Hintergrund: [Studienregister](studies-and-background.md). Offene visuelle Abnahme: [TODO](TODO.md). Die Screenshots weiter oben dokumentieren den vorherigen Stand vom 17.10.2026.

Private Bereitstellung am 18.10.2026 erfolgreich bestätigt: https://ai-in-medicine-monitor.gillesp.chatgpt.site. Deployment: `appgdep_6ad43db87b4c8191b9a4199ee409913d`; Sites-Quellcommit: `277e21e9c330eba2d98bbb6fe286d344c3f487e2`. Bestehender Eigentümerzugang bleibt erhalten. Der native Erfolgsstatus bestätigt die Bereitstellung, ersetzt die noch offene manuelle Sichtprüfung jedoch nicht.

## Compact English release - 18 October 2026

The interface is now a single English page. Tabs, application screens and the methodology control have been removed. Three visible chart previews link to the detailed sections below, with return and next-chart links. Copy is shorter; the overview list is labelled Milestones. Evidence dialogs and source context are in English. Presentation provenance is not displayed or included in exported study metadata; historical source provenance remains in the repository documentation.

The upper overview retains its curves, scale and evidence anchors. Lower benchmark comparisons use scaled horizontal score lines and markers. The connected dated milestone timelines remain separate from quantitative performance. Repeated comparable evaluations are still needed for a genuine benchmark time trend. All 13 scores, 24 overview anchors, nine lower milestones and six studies are preserved.

[CI](https://github.com/gilles-pe/ai-in-medicine-monitor/actions/runs/39104045758), commit f0909f8e3dff5e244085d1ca25a607d5ba38a502: successful. 21 data/logic tests, build and 20 browser checks across desktop/mobile. Checks cover the single-page layout, no tabs or presentation references, source dialogs, preview/back/next jumps, line scaling, filters, keyboard access, playback, export and overflow. Two bounded agents translated scientific text and reviewed layout/navigation. No extra manual browser inspection was available in this session.

Private publication succeeded: https://ai-in-medicine-monitor.gillesp.chatgpt.site. Deployment `appgdep_6ad4672d28088191bda581ca9dedf8d5`, source commit `f4d4fee897a0758f84730000735e75b0b31109ad`. Existing owner-only access was preserved.

## Compact monitor redesign - 18 October 2026

Implementation in progress: Changes beside the introduction, personal text in About, removal of the visible author name, verified contact links, compact full-width overview, controls below it, consistent solid/dotted/scenario styles, chart-specific links and image exports. Bluesky handle remains unverified. Lower curves retain explicit scientific axes rather than inventing longitudinal performance from publication snapshots. Existing benchmark comparisons remain available in compact disclosures; milestone rails are preserved. Validation and publication results will be recorded after completion.

Validation completed for code commit 2e627b81df1dd2068abc3b854962b9c9fcef3c7e: [CI run](https://github.com/gilles-pe/ai-in-medicine-monitor/actions/runs/39106232075) succeeded. 27 Node data/logic tests, build and 28 desktop/mobile browser checks passed. The checks cover source-native curves and publication boundaries, the benchmark-specific physician reference, PNG signature, copied-link cutoff restoration, name removal, timeline placement, keyboard source access and overflow. Eight model-curve values plus one human reference are documented in studies-and-background.md. These are not longitudinal progress estimates. No additional manual visual inspection was available in this session.

Private publication succeeded on 18 October 2026: https://ai-in-medicine-monitor.gillesp.chatgpt.site. Deployment `appgdep_6ad46f98c5648191a98f139639fd6e3c`, Sites source commit `123e1bf709612e19ae07c57b216bd80e92fd2516`, saved version `appgprj_6ad39d7f6b508191ae06d99968c42699~appgver_acf2102f63688191b75a56fe0aec818a`. Existing owner-only access was preserved. The native deployment status is succeeded; the lack of an additional manual visual inspection remains as noted above.
