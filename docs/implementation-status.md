# AI in Medicine Monitor: Umsetzung

Stand: 17. Oktober 2026.

## Auftrag und Ergebnis

Gilles hat die Programmierung und bei Bedarf Subagenten ausdrücklich beauftragt. Dies ersetzt die vorherige Begrenzung auf reine Planung.

Die erste statische Anwendung ist implementiert: drei Messspuren, Datum/Monatsregler, Abspielfunktion, Modellfilter, Quellen- und Detailansicht, Forschungsereignisse, Anwendungsübersicht, Vortragsmodus und gefilterter JSON-Export.

Als technische Grundlage dienen Browser-ES-Module und CSS. Es gibt keine Laufzeitabhängigkeiten oder Datenbank. Der Build kopiert die Anwendung nach dist/.

## Daten

13 aggregierte historische Ergebnisse aus drei versionierten Originalarbeiten. Die Wissensspur nutzt den vollständigen MedXpertQA-Text-Test; kleinere Stichproben sind ausgeschlossen. Alle Seed-Daten verwenden Publikationsdaten. Jede Spur enthält zunächst nur einen Publikationsstand, daher keine behauptete Zeitentwicklung.

Medizinische Daten werden nicht automatisch nachgeladen. Das Quellenprüfdatum und der betrachtete Datenstand sind getrennt. Der Startdatensatz ist nicht unabhängig fachlich freigegeben.

## Prüfung

Ausgeführt: JavaScript-Syntaxprüfung und 49 Daten-/Logik-Assertions im verfügbaren V8-Runtime. Der Subagent für Filterlogik hat zusätzlich die Assertions seiner neun Tests im V8-Kontext geprüft.

Vorbereitet: native Node-Tests für Filter und Datenintegrität sowie acht Browser-Smoke-Tests jeweils auf Desktop und 390px Mobilbreite. Ein GitHub-Actions-Workflow führt sie aus. Sein Ergebnis muss gesondert geprüft werden.

Die lokale Ausführungsumgebung war bei Implementierung nicht verfügbar. Deshalb wurden kein lokaler Server und keine manuelle Browseransicht ausgeführt. Eine vorbereitete Prüfung ist kein bestandener Test. Eine Live-Website ist noch nicht eingerichtet.

## Nächste Arbeit

1. CI-Ergebnis auswerten und etwaige Fehler korrigieren.
2. Browserdarstellung gegen Variante A prüfen, insbesondere Mobilbreite und Vortragsmodus.
3. Private Online-Bereitstellung über den unterstützten Hosting-Prozess durchführen, sobald eine Ausführungsumgebung verfügbar ist.
4. Weitere vergleichbare historische und aktuelle Messstände sowie klinische Evidenz fachlich kuratieren.
5. Erst nach definiertem Prüf- und Freigabeprozess eine wöchentliche Datenaktualisierung einrichten.
