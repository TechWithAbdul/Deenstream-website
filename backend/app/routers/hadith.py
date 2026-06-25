import json
import os
from fastapi import APIRouter, Query

router = APIRouter(prefix='/hadith', tags=['hadith'])
DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'Data', 'hadiths.json'))


def load_hadiths():
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)


@router.get('/')
async def list_hadiths(q: str = Query(None, min_length=1)):
    hadiths = load_hadiths()
    if q:
        q_lower = q.lower()
        filtered = [
            item for item in hadiths
            if q_lower in item.get('english', '').lower() or q_lower in item.get('arabic', '').lower()
        ]
        return filtered
    return hadiths
