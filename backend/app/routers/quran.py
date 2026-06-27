import os
import httpx
from fastapi import APIRouter, Query, HTTPException
from ..services.cache import cache

router = APIRouter(prefix='/quran', tags=['quran'])
QURAN_API = 'https://api.alquran.cloud/v1'
QURAN_SEARCH = 'https://api.quran.com/api/v4/search'


@router.get('/surah')
async def surah_list():
    # cache surah list for 1 hour
    cached = cache.get('surah_list')
    if cached:
        return cached
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(f'{QURAN_API}/surah')
            r.raise_for_status()
            data = r.json()
            cache.set('surah_list', data, ttl=3600)
            return data
    except Exception:
        raise HTTPException(status_code=502, detail='Failed to fetch surah list')


@router.get('/surah/{number}')
async def surah(number: int):
    key = f'surah_{number}'
    cached = cache.get(key)
    if cached:
        return cached
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            # request Arabic (uthmani) + English simple translation
            r = await client.get(f'{QURAN_API}/surah/{number}/editions/quran-uthmani,en.asad')
            r.raise_for_status()
            data = r.json()
            cache.set(key, data, ttl=1800)
            return data
    except Exception:
        raise HTTPException(status_code=502, detail=f'Failed to fetch surah {number}')


@router.get('/search')
async def search(query: str = Query(..., min_length=1)):
    # proxy to Quran.com search (no key required for simple queries)
    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            r = await client.get(QURAN_SEARCH, params={'q': query})
            r.raise_for_status()
            return r.json()
    except Exception:
        return {'results': []}
