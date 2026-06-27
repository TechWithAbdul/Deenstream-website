import json
import os
from fastapi import APIRouter, Query
import httpx

router = APIRouter(prefix='/quran', tags=['quran'])
QURAN_API = 'https://api.alquran.cloud/v1'
QURAN_SEARCH = 'https://api.quran.com/api/v4/search'
DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'Data', 'surahs.json'))


def load_surah_fallback(number: int):
    try:
        with open(DATA_PATH, 'r', encoding='utf-8') as fh:
            surahs = json.load(fh)
        match = next((item for item in surahs if item.get('index') == number), None)
        if not match:
            return None

        ayahs = []
        for verse_key, verse_text in match.get('verse', {}).items():
            ayahs.append({
                'number': len(ayahs) + 1,
                'numberInSurah': len(ayahs) + 1,
                'text': verse_text,
                'translation': f'This is a local fallback for {match.get("name", "the selected surah")}.',
            })

        return {
            'data': {
                'number': match['index'],
                'name': match['name'],
                'englishName': match['name'],
                'englishNameTranslation': match['name'],
                'revelationType': 'Meccan',
                'numberOfAyahs': match.get('count', len(ayahs)),
                'ayahs': ayahs,
            }
        }
    except Exception:
        return None


@router.get('/surah')
async def surah_list():
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(f'{QURAN_API}/surah')
            r.raise_for_status()
            return r.json()
    except Exception:
        with open(DATA_PATH, 'r', encoding='utf-8') as fh:
            surahs = json.load(fh)
        return {'data': [
            {
                'number': item['index'],
                'name': item['name'],
                'englishName': item['name'],
                'englishNameTranslation': item['name'],
                'numberOfAyahs': item.get('count', 0),
            }
            for item in surahs
        ]}


@router.get('/surah/{number}')
async def surah(number: int):
    fallback = load_surah_fallback(number)
    if fallback:
        return fallback

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(f'{QURAN_API}/surah/{number}/editions/quran-uthmani,en.asad')
            r.raise_for_status()
            return r.json()
    except Exception:
        return {'data': {
            'number': number,
            'name': f'Surah {number}',
            'englishName': f'Surah {number}',
            'englishNameTranslation': 'Local fallback',
            'revelationType': 'Unknown',
            'numberOfAyahs': 0,
            'ayahs': [],
        }}


@router.get('/search')
async def search(query: str = Query(..., min_length=1)):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(QURAN_SEARCH, params={'q': query})
            r.raise_for_status()
            return r.json()
    except Exception:
        return {'results': []}
