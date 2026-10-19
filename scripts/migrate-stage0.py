import json
from pathlib import Path
from pykakasi import kakasi

DATA = Path('C:/Users/USER/Desktop/LearningN2/data/bunpou/n2.json')
converter = kakasi()


def romaji(text: str) -> str:
    return ''.join(part['hepburn'] for part in converter.convert(text)).strip()


def practice_questions(item):
    example = item['examples'][0]
    return [
        {
            'id': f"{item['id']}-arti",
            'tipe': 'arti',
            'pertanyaan': f"Apa arti pola {item['title']}?",
            'jawaban': item['meaning'],
        },
        {
            'id': f"{item['id']}-contoh",
            'tipe': 'contoh',
            'pertanyaan': example['jp'],
            'jawaban': example['translation'],
        },
        {
            'id': f"{item['id']}-pola",
            'tipe': 'pola',
            'pertanyaan': f"Pola apa yang digunakan pada contoh: {example['translation']}?",
            'jawaban': item['title'],
        },
    ]


items = json.loads(DATA.read_text(encoding='utf-8'))
by_title = {item['title']: item['id'] for item in items}
for item in items:
    item['romaji'] = romaji(item['jp'])
    timestamp = item.get('videoTimestamp') or {}
    item['sumber'] = {
        'video_id': 'VcaLbwTMS9M',
        'mulai': timestamp.get('seconds'),
        'selesai': None,
    }
    item['catatan'] = item.get('catatan', '')
    item['mirip'] = item.get('mirip', [])
    item['kunci_pencarian'] = ' '.join(
        str(value) for value in [item['title'], item['jp'], item['kana'], item['romaji'], item['meaning'], item['keywords']]
        if value
    )
    item['soal_latihan'] = item.get('soal_latihan') or practice_questions(item)
    item['terverifikasi'] = item.get('terverifikasi', False)

# Ambiguous duplicate: preserve both records, make review state explicit.
duplicate_ids = [by_title['だけに']]
for item in items:
    if item['title'] == 'だけに':
        item['mirip'] = sorted(set(item['mirip'] + [other['id'] for other in items if other['title'] == 'だけに' and other['id'] != item['id']]))
        item['reviewNeeded'] = True
        item['reviewNote'] = 'Duplikat judul だけに; bandingkan nuansa dengan rekaman sumber.'

DATA.write_text(json.dumps(items, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'migrated {len(items)} records; romaji={sum(bool(item["romaji"]) for item in items)}; duplicate_review={len(duplicate_ids)}')
