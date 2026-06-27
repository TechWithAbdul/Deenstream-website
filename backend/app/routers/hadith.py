import httpx
from fastapi import APIRouter, Query, HTTPException
from ..services.cache import cache

router = APIRouter(prefix='/hadith', tags=['hadith'])

# Try hadithapi.com (public) then fallback to sutanlab
HADITH_API_PRIMARY = 'https://hadithapi.com/api/books'  # placeholder - many public hadith APIs exist
HADITH_API_SUTANLAB = 'https://api.hadith.sutanlab.id'


@router.get('/')
async def list_hadiths(q: str = Query(None, min_length=0)):
    # simple proxy — if query provided, attempt search via sutanlab
    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            if q:
                # use sutanlab search
                r = await client.get(f'{HADITH_API_SUTANLAB}/hadiths', params={'q': q})
                r.raise_for_status()
                return r.json()
            else:
                r = await client.get(f'{HADITH_API_SUTANLAB}/books')
                r.raise_for_status()
                return r.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail='Hadith API unavailable')


@router.get('/book/{book_id}')
async def get_book(book_id: str):
    key = f'hadith_book_{book_id}'
    cached = cache.get(key)
    if cached:
        return cached
    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            r = await client.get(f'{HADITH_API_SUTANLAB}/books/{book_id}/hadiths')
            r.raise_for_status()
            data = r.json()
            cache.set(key, data, ttl=600)
            return data
    except Exception:
        raise HTTPException(status_code=502, detail='Failed to fetch hadith book')
