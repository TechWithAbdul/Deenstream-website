from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.ai_service import ask_ai

router = APIRouter(prefix='/ai', tags=['ai'])

class Query(BaseModel):
    question: str

@router.post('/chat')
async def chat(q: Query):
    resp = await ask_ai(q.question)
    if not resp:
        raise HTTPException(status_code=500, detail='AI service error')
    if not resp.strip():
        raise HTTPException(status_code=500, detail='AI service error')
    return {'answer': resp}
