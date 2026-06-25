from fastapi import APIRouter, Query
import httpx

router = APIRouter(prefix='/quran', tags=['quran'])
QURAN_API = 'https://api.alquran.cloud/v1'
QURAN_SEARCH = 'https://api.quran.com/api/v4/search'

@router.get('/surah')
async def surah_list():
    async with httpx.AsyncClient() as client:
        r = await client.get(f'{QURAN_API}/surah')
        return r.json()

@router.get('/surah/{number}')
async def surah(number: int):
    async with httpx.AsyncClient() as client:
        r = await client.get(f'{QURAN_API}/surah/{number}/editions/quran-uthmani,en.asad')
        return r.json()

@router.get('/search')
async def search(query: str = Query(..., min_length=1)):
    async with httpx.AsyncClient() as client:
        r = await client.get(QURAN_SEARCH, params={'q': query})
        return r.json()
