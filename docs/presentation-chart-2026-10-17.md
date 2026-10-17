# Hauptgrafik nach der PowerPoint

Der Nutzer beauftragt am 17.10.2026 die Darstellung nach dem PPT-Chart und ausdrücklich einen Beginn vor 2025. Die Startansicht verwendet deshalb 1950–2035. AlphaFold 2018, AlphaFold 2/CASP14 2020 und AlphaFold 3 2024 werden direkt an der Hauptgrafik sichtbar. Der Chemie-Nobelpreis und ResidencyRL ergänzen die Meilensteine.

## Herkunft und Bedeutung

Die Markerpositionen der vier Kurven wurden aus dem DrawingML von Folie 6 der bereitgestellten PowerPoint gelesen. scripts/extract-presentation-chart.py dokumentiert die Extraktion. data/presentation-chart.js enthält die so normalisierten Koordinaten. Die Kurven wurden nicht aus Benchmark-Scores konstruiert. Zwischenpositionen werden ausschließlich für die Zeitreise innerhalb dieser Illustration linear interpoliert.

Die Hauptgrafik ist eine schematische Darstellung aus dem Vortrag. Ihre Indexwerte sind weder gemessene IQ-Werte noch eine klinisch validierte gemeinsame Leistungsskala. Szenarien ab 2026 erscheinen gestrichelt und als Annahmen. Die METR-Kontextspur übernimmt nur die Positionen aus der PPT und ist als Software-Kontext gekennzeichnet; sie wird nicht als neue verifizierte METR-Messreihe oder medizinische Laufzeit ausgegeben. Zukunftsbänder aus der PPT werden nicht als statistische Konfidenzintervalle nachgebildet.

Die tatsächlichen 13 Benchmark-Messpunkte behalten eigene Skalen und Vergleichsgruppen im Abschnitt Messwerte & Benchmarks. Studien und Originalquellen bleiben zugänglich.

Historische Ereignisse mit nur bekanntem Jahr erhalten kein erfundenes Tagesdatum. CASP14 2020 und die AlphaFold-2-Publikation 2021 sind unterschiedliche Ereignisse. Ergänzende Quellen: Dartmouth, IBM und der DeepMind-Autorenbericht, siehe data/history.js und das Quellenregister.

## Explizite Textänderungen

- M-Marke im Header entfernt.
- „Fortschritt mit Quellen“ entfernt.
- Die Datumszeile lautet „Letztes Update: 17.10.2026“. Das Datum wird aus einem gespeicherten Aktualisierungsdatum gelesen und springt nicht bei jedem Besuch automatisch weiter.

Die PowerPoint selbst bleibt als Referenzdatei unverändert.
