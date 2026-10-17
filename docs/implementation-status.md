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
