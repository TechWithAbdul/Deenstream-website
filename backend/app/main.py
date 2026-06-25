from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import quran, ai, redirects

app = FastAPI(title="DeenStream AI - API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(quran.router)
app.include_router(ai.router)
app.include_router(redirects.router)

@app.get("/health")
async def health():
    return {"status": "ok"}
