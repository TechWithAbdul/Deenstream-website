from fastapi import APIRouter
import httpx

router = APIRouter(prefix='/quran', tags=['quran'])
QURAN_API = 'https://api.alquran.cloud/v1'

@router.get('/surah')
async def surah_list():
    async with httpx.AsyncClient() as client:
        r = await client.get(f'{QURAN_API}/surah')
        return r.json()

@router.get('/surah/{number}')
async def surah(number: int):
    async with httpx.AsyncClient() as client:
        r = await client.get(f'{QURAN_API}/surah/{number}')
        return r.json()
