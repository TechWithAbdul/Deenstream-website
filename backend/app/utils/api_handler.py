"""
app/utils/api_handler.py
------------------------
Shared async HTTP clients config for Groq infra.
"""

from __future__ import annotations

import logging
import os
import httpx
from fastapi import HTTPException
from openai import AsyncOpenAI
from app.config import settings
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

def build_ummah_client() -> httpx.AsyncClient:
    timeout = httpx.Timeout(
        connect=settings.HTTP_CONNECT_TIMEOUT,
        read=settings.HTTP_READ_TIMEOUT,
        write=10.0,
        pool=5.0,
    )
    return httpx.AsyncClient(
        base_url=settings.UMMAH_BASE_URL,
        timeout=timeout,
        params={"apikey": settings.UMMAH_API_KEY},
        headers={
            "Accept": "application/json",
            "User-Agent": "Deestream/1.0 (https://deestream.com)",
        },
        follow_redirects=True,
    )

ummah_client: httpx.AsyncClient | None = None

def get_ummah_client() -> httpx.AsyncClient:
    if ummah_client is None:
        raise RuntimeError(
            "ummah_client is not initialised. Make sure the lifespan manager has run."
        )
    return ummah_client

load_dotenv()

def get_openai_client() -> AsyncOpenAI:
    """Return an AsyncOpenAI client configured to connect to Groq Cloud."""
    groq_key = os.getenv("GROQ_API_KEY")
    
    if not groq_key:
        raise HTTPException(
            status_code=500,
            detail="Runtime Error: GROQ_API_KEY is empty in os.environ. Check your .env tracking configuration."
        )

    return AsyncOpenAI(
        api_key=groq_key,
        base_url="https://api.groq.com/openai/v1"
    )