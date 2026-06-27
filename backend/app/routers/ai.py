from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.ai_service import ask_ai

router = APIRouter(prefix='/ai', tags=['ai'])

class Query(BaseModel):
    question: str
    context: dict = None

@router.post('/chat')
async def chat(q: Query):
    # context may include {'surah': 2, 'ayah': 255} etc. for targeted referencing
    resp = await ask_ai(q.question, context=q.context or {})
    if not resp:
        raise HTTPException(status_code=500, detail='AI service error')
    return {'answer': resp}
