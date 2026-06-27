from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import health, quran, ai, hadith, prayer

app = FastAPI(title='DeenStream AI - Backend')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(health.router)
app.include_router(quran.router)
app.include_router(hadith.router)
app.include_router(prayer.router)
app.include_router(ai.router)

@app.get('/')
async def root():
    return {'status': 'DeenStream AI backend running'}
