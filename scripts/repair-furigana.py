import json
import re
from pathlib import Path
from pykakasi import kakasi

DATA = Path('C:/Users/USER/Desktop/LearningN2/data/bunpou/n2.json')
converter = kakasi()
KANJI = re.compile(r'[㐀-鿿]')

def parts(text: str):
    return converter.convert(text)

def hira(text: str) -> str:
    return ''.join(part['hira'] for part in parts(text))

def ruby_segments(text: str):
    segments = []
    for part in parts(text):
        original = part['orig']
        reading = part['hira'] if KANJI.search(original) else None
        if segments and segments[-1][1] == reading:
            segments[-1][0] += original
        else:
            segments.append([original, reading])
    return segments

data = json.loads(DATA.read_text(encoding='utf-8'))
for item in data:
    item['kana'] = hira(item['jp'])
    for example in item.get('examples', []):
        example['rubySegments'] = ruby_segments(example['jp'])

DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'repaired {len(data)} patterns')
