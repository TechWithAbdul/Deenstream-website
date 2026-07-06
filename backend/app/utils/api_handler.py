"""
app/utils/api_handler.py
------------------------
Shared async HTTP clients.

•  `ummah_client`  – pre-configured HTTPX AsyncClient for Ummah API calls.
                     Base URL, default timeout, and the API-key header are
                     baked in here so every router just calls
                     `ummah_client.get("/endpoint", params={...})`.

•  `get_openai_client()` – factory that returns an openai.AsyncOpenAI instance
                           pointed at the Apizio gateway (Gemini-compatible).

Both are intended to be used inside FastAPI lifespan context managers or
as module-level singletons; see main.py for the lifespan wiring.
"""

from __future__ import annotations

import logging

import httpx
from openai import AsyncOpenAI

from app.config import settings

logger = logging.getLogger(__name__)

# ── HTTPX AsyncClient ─────────────────────────────────────────────────────────

def build_ummah_client() -> httpx.AsyncClient:
    """
    Build a reusable AsyncClient for all Ummah API requests.

    The apikey is injected as a *default query parameter* so individual
    route handlers never have to remember to attach it.
    """
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


# Lazily-initialised singleton – populated in main.py lifespan startup.
ummah_client: httpx.AsyncClient | None = None


def get_ummah_client() -> httpx.AsyncClient:
    """
    Dependency / helper used by routes.
    Raises RuntimeError if called before the lifespan sets the client up.
    """
    if ummah_client is None:
        raise RuntimeError(
            "ummah_client is not initialised. "
            "Make sure the FastAPI lifespan context manager has run."
        )
    return ummah_client


# ── OpenAI / Apizio client ────────────────────────────────────────────────────

def get_openai_client() -> AsyncOpenAI:
    """
<<<<<<< HEAD
    Return an AsyncOpenAI instance wired directly to Google AI Studio's 
    OpenAI-compatible endpoint, bypassing the Apizio gateway completely.
    """
    return AsyncOpenAI(
        api_key=settings.GEMINI_API_KEY,
        # Use Google's official OpenAI compatibility endpoint
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
=======
    Return an AsyncOpenAI instance wired to the Apizio Gemini gateway.
    A new instance is cheap; call this per-request or cache it – either is fine.
    """
    return AsyncOpenAI(
        api_key=settings.GEMINI_API_KEY,
        base_url=settings.APIZIO_BASE_URL,
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
    )