import datetime
import httpx
from fastapi import APIRouter, Query

router = APIRouter(prefix='/prayer', tags=['prayer'])
ALADHAN_TIMINGS = 'https://api.aladhan.com/v1/timingsByCity'
ALADHAN_CONVERT = 'https://api.aladhan.com/v1/gToH'

@router.get('/')
async def timings(city: str = Query('Mecca', min_length=1), country: str = Query('Saudi Arabia', min_length=1), method: int = Query(2, ge=0)):
    params = {'city': city, 'country': country, 'method': method}
    async with httpx.AsyncClient(follow_redirects=True) as client:
        r = await client.get(ALADHAN_TIMINGS, params=params)
        return r.json()

@router.get('/hijri')
async def hijri_date(day: int = None, month: int = None, year: int = None):
    today = datetime.date.today()
    if day is None or month is None or year is None:
        day, month, year = today.day, today.month, today.year
    params = {'date': f'{day:02d}-{month:02d}-{year}'}
    async with httpx.AsyncClient(follow_redirects=True) as client:
        r = await client.get(ALADHAN_CONVERT, params=params)
        return r.json()
