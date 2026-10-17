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
