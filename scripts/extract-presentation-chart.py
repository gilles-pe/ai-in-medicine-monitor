"""Extract schematic marker positions from slide 6. No benchmark data is created."""
import json
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from zipfile import ZipFile

ns = {'p':'http://schemas.openxmlformats.org/presentationml/2006/main', 'a':'http://schemas.openxmlformats.org/drawingml/2006/main'}
with ZipFile(sys.argv[1]) as source:
    root = ET.fromstring(source.read('ppt/slides/slide6.xml'))
series = [
    {'id':'general', 'label':'Allgemeine KI-Fähigkeit', 'color':'#2878b5', 'sourceColor':'2878B5', 'shape':'ellipse', 'points':[]},
    {'id':'knowledge', 'label':'Medizinisches Wissen', 'color':'#e88725', 'sourceColor':'F57C00', 'shape':'rect', 'points':[]},
    {'id':'reasoning', 'label':'Klinisches Denken', 'color':'#2e9b42', 'sourceColor':'2E9B42', 'shape':'diamond', 'points':[]},
    {'id':'autonomy', 'label':'Autonomie · METR-Kontext', 'color':'#1565a6', 'sourceColor':'1565A6', 'shape':'custom', 'points':[]}
]
for shape in root.findall('.//p:sp', ns):
    prop = shape.find('p:spPr', ns)
    transform = prop.find('a:xfrm', ns)
    fill = prop.find('a:solidFill/a:srgbClr', ns)
    geometry = prop.find('a:prstGeom', ns)
    if transform is None or fill is None:
        continue
    offset, extent = transform.find('a:off', ns), transform.find('a:ext', ns)
    x, y = int(offset.get('x')), int(offset.get('y'))
    width, height = int(extent.get('cx')), int(extent.get('cy'))
    if y < 1200000:
        continue
    for row in series:
        expected = width == 86868 if row['id'] == 'autonomy' else width == 68700
        is_shape = prop.find('a:custGeom', ns) is not None if row['shape'] == 'custom' else geometry is not None and geometry.get('prst') == row['shape']
        if fill.get('val') == row['sourceColor'] and expected and is_shape:
            year = round(1950 + (x + width / 2 - 713292) / 126079.63)
            index = round(50 + (4288821 - y - height / 2) / 23744.3, 2)
            row['points'].append({'year':year, 'index':index})
for row in series:
    row['points'] = sorted({point['year']:point for point in row['points']}.values(), key=lambda point:point['year'])
    del row['sourceColor']
payload = '// Schematic positions extracted from the supplied PPT, slide 6.\n// NOT measurements, IQ scores or medical task horizons.\nexport const presentationSeries = ' + json.dumps(series, ensure_ascii=False, indent=2) + ';\n'
Path(sys.argv[2]).write_text(payload)
print(json.dumps({row['id']:[point['year'] for point in row['points']] for row in series}))
