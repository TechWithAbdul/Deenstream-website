import httpx
from fastapi import APIRouter, Query, HTTPException
from ..services.cache import cache

router = APIRouter(prefix='/prayer', tags=['prayer'])
ALADHAN_BASE = 'https://api.aladhan.com/v1'


@router.get('/')
async def prayer_by_city(city: str = Query(..., min_length=1), country: str = ''):
    key = f'prayer_{city}_{country}'
    cached = cache.get(key)
    if cached:
        return cached
    try:
        async with httpx.AsyncClient(timeout=12.0, follow_redirects=True) as client:
            headers = {'User-Agent':'DeenStreamAI/1.0 (+https://example.com)'}
            r = await client.get(f'{ALADHAN_BASE}/timingsByCity', params={'city': city, 'country': country or '', 'method': 2}, headers=headers)
            r.raise_for_status()
            data = r.json()
            cache.set(key, data, ttl=600)
            return data
    except Exception as e:
        # log and return a normalized error
        print('Prayer API error:', repr(e))
        raise HTTPException(status_code=502, detail='Prayer times API error')


@router.get('/calendar')
async def islamic_calendar(month: int = Query(None), year: int = Query(None), city: str = Query(None), country: str = Query(None)):
    # If month/year passed, use calendar endpoint; otherwise return today hijri via timings
    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            if month and year and city:
                r = await client.get(f'{ALADHAN_BASE}/calendarByCity', params={'city': city, 'country': country or '', 'method': 2, 'month': month, 'year': year})
                r.raise_for_status()
                return r.json()
            else:
                # fallback: return today's timings with hijri data if city provided
                if city:
                    r = await client.get(f'{ALADHAN_BASE}/timingsByCity', params={'city': city, 'country': country or '', 'method': 2})
                    r.raise_for_status()
                    return r.json()
                return {'message': 'Provide month, year and city to fetch calendar, or city to fetch today timings.'}
    except Exception:
        raise HTTPException(status_code=502, detail='Islamic calendar API error')


@router.get('/qibla')
async def qibla(lat: float = Query(...), lon: float = Query(...)):
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            r = await client.get(f'{ALADHAN_BASE}/qibla/{lat}/{lon}')
            r.raise_for_status()
            return r.json()
    except Exception:
        raise HTTPException(status_code=502, detail='Qibla API error')
