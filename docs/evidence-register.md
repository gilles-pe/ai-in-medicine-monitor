# AI in Medicine Monitor: Entwurf des Evidenzregisters

Stand: 17. Oktober 2026. Dies ist eine Feld- und Prozessdefinition. Ein gemeinsames Drive-Register mit freigegebenen Messwerten ist noch nicht eingerichtet.

## Ein Eintrag pro Befund oder Messung

| Feld | Inhalt |
| --- | --- |
| ID und Revision | Dauerhafte ID; Änderungen nachvollziehbar versionieren |
| Typ und Spur | Messwert, Meilenstein oder Szenario; Wissen, Assistenz, Autonomie, Forschung oder Anwendung |
| Titel / Kernaussage | Eine überprüfbare Aussage |
| Quelle / Fundstelle | Original-URL, DOI oder Register-ID; Tabelle, Abbildung, Abschnitt |
| Publikationsstatus | Preprint, Fachpublikation, technischer Bericht, Behördenentscheidung |
| Datumsfelder | Modellfreigabe, Evaluation, Ergebnisveröffentlichung, Prüfung, Ereignisdatum getrennt |
| Datumssicherheit | Gemessenes Datum oder ausdrücklich gekennzeichneter Ersatz |
| Modell und System | Genaue Modellversion; Produkt, Orchestrierung und Werkzeuge |
| Benchmark | Name, Version/Revision, Split, Aufgabenmix und Nenner |
| Methode | Prompt, Budget, Reasoning, Verbosity, Wiederholungen, Auswahlregel, Bewertungsmodell und -version |
| Vergleichsgruppe | Kennung aller Bedingungen, innerhalb derer eine gemeinsame Serie vertretbar ist |
| Ergebnis | Wert, Einheit, Richtung und gegebenenfalls Zähler/Nenner; leer bei Ereignissen |
| Unsicherheit | Berichtetes Intervall und Verfahren; sonst „nicht berichtet“ |
| Testumgebung | Virtueller Test, retrospektive Studie, prospektive klinische Studie oder belegter Routineeinsatz |
| Studiendetails | Population, Land, Zentren, Vergleich, Endpunkt und Beobachtungsdauer, soweit relevant |
| Aufsicht und Sicherheit | Menschliche Freigaben, Eingriffe, Fehlerarten und kritische Fehler; sonst „nicht berichtet“ |
| Interessenkonflikte | Anbieterbericht / unabhängige Evaluation; Finanzierung, soweit angegeben |
| Grenzen | Was die Quelle nicht belegt, einschließlich Übertragbarkeit |
| Verwendung | Monitor, Substack, Vortrag oder Social Post; Referenz auf den jeweiligen Entwurf |
| Bearbeitungsstatus | Eingang, geprüft, freigegeben, zurückgezogen oder ersetzt |
| Prüfung / Freigabe | Bearbeiter, Reviewer, Datum und Begründung |
| Korrekturhistorie | Alter Befund, neuer Befund, Grund und betroffene Veröffentlichungen |

Unbekannt ist kein Nullwert. Herstellerangaben bleiben als solche erkennbar. Ein neu veröffentlichtes Ergebnis darf ein älteres nicht stillschweigend überschreiben.

## Ablauf zwischen den Projekten

1. „Für den Monitor übernehmen“: Quelle und Befund mit ID als Kandidaten erfassen.
2. Originalquelle lesen und Kernaussage, Methode sowie Grenzen getrennt festhalten.
3. Vergleichbarkeit prüfen; neue Vergleichsgruppe anlegen, falls nötig.
4. Fachlich freigeben. Bis dahin keine Verwendung als bestätigter Messpunkt.
5. Monitor, Artikel und Vortrag referenzieren dieselbe Eintrags-ID und Revision.
6. Bei Korrekturen alle betroffenen Verwendungen anhand der ID finden.

Vorgeschlagen bleiben ein gemeinsamer Drive-Projektbrief und ein späteres gemeinsames Drive-Evidenzregister. Das Repository enthält vorerst diese Definition und die Quellenprüfung. Es synchronisiert keine Chats oder Drive-Dateien automatisch.

## Erste Übernahme - noch offen

Für jeden der drei Kandidaten mindestens eine Originalergebnis-Tabelle auswählen und deren konkrete Werte samt Konfiguration prüfen. Diese Planungsrunde hat dafür die Quellen und Kriterien festgelegt, aber noch keine Ergebnisserie freigegeben.
