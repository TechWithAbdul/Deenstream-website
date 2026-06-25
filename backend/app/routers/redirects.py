from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from ..services.redirect_service import create_slug, get_target

router = APIRouter(prefix='/r', tags=['redirects'])

class CreateReq(BaseModel):
    target: str
    expires_days: int = None

@router.post('/', status_code=201)
async def create(req: CreateReq):
    if not req.target:
        raise HTTPException(status_code=400, detail='target is required')
    slug = create_slug(req.target, req.expires_days)
    return {'slug': slug, 'url': f'/r/{slug}'}

@router.get('/{slug}')
async def redirect(slug: str, request: Request):
    target = get_target(slug)
    if not target:
        raise HTTPException(status_code=404, detail='not found')
    # if target looks like a relative SPA path, redirect to frontend origin if provided
    if target.startswith('/'):
        # Assume frontend is hosted same origin; redirect preserving host
        base = f"{request.url.scheme}://{request.url.hostname}{(':'+str(request.url.port)) if request.url.port else ''}"
        return RedirectResponse(url=base + target)
    return RedirectResponse(url=target)
