from __future__ import annotations

import logging
from typing import Annotated, Any

import httpx
from fastapi import APIRouter, HTTPException, Path, Query

from app.utils.api_handler import get_ummah_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/quran", tags=["Quran"])

# ── helpers ───────────────────────────────────────────────────────────────────

def _raise_from_httpx(exc: httpx.HTTPStatusError, context: str) -> None:
    """Translate an upstream HTTP error into a meaningful FastAPI HTTPException."""
    status = exc.response.status_code
    detail: str

    if status == 401:
        detail = f"[{context}] Upstream rejected our API key (401). Check UMMAH_API_KEY."
    elif status == 404:
        detail = f"[{context}] Resource not found on Ummah API (404)."
    elif status == 429:
        detail = f"[{context}] Ummah API rate-limit hit (429). Retry later."
    elif 500 <= status < 600:
        detail = f"[{context}] Ummah API returned a server error ({status})."
    else:
        detail = f"[{context}] Upstream error {status}."

    logger.error("httpx status error – %s | response: %s", detail, exc.response.text[:500])
    raise HTTPException(status_code=502, detail=detail)


def _extract_list(payload: Any, key: str, context: str) -> list:
    """
    Safely extract a list from a dict payload or direct list payload.
    Logs a warning and returns [] instead of crashing on unexpected shapes.
    """
    # Fallback if the API returns a direct JSON array list instead of an object envelope
    if isinstance(payload, list):
        return payload

    if not isinstance(payload, dict):
        logger.warning("[%s] Expected dict or list payload, got %s", context, type(payload).__name__)
        return []
    
    value = payload.get(key)
    if value is None:
        # Check alternative common keys if the specified key isn't found
        for alt_key in ["data", "surahs", "results"]:
            if alt_key in payload and isinstance(payload[alt_key], list):
                return payload[alt_key]
        logger.warning("[%s] Key '%s' missing from upstream response. Keys available: %s", context, key, list(payload.keys()))
        return []
        
    if not isinstance(value, list):
        logger.warning(
            "[%s] Key '%s' is %s, expected list.", context, key, type(value).__name__
        )
        return []
    return value


# ── routes ────────────────────────────────────────────────────────────────────

@router.get(
    "/chapters",
    summary="List all Quran chapters (surahs)",
    response_model=list[dict],
)
async def get_chapters() -> list[dict]:
    """
    Returns a list of all 114 surah metadata objects from Ummah API.
    Target Endpoint: https://ummahapi.com/api/quran/surahs
    """
    client = get_ummah_client()
    try:
        response = await client.get("/quran/surahs")
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        _raise_from_httpx(exc, "quran/chapters")
    except httpx.RequestError as exc:
        logger.error("Network error fetching chapters: %s", exc)
        raise HTTPException(status_code=503, detail="Could not reach Ummah API. Network error.")

    try:
        payload = response.json()
    except Exception as exc:
        logger.error("Failed to parse chapters JSON: %s", exc)
        raise HTTPException(status_code=502, detail="Upstream returned non-JSON response.")

    # 1. Safely extract the "data" dictionary block
    data_object = payload.get("data", {})
    
    # 2. Extract the actual list of surahs from inside that "data" dictionary block
    chapters = _extract_list(data_object, "surahs", "quran/chapters")
    
    logger.info("Fetched %d chapters from Ummah API.", len(chapters))
    return chapters


@router.get(
    "/surah/{surah_id}",
    summary="Fetch full surah text with translations",
    response_model=dict,
)
async def get_surah(
    surah_id: Annotated[int, Path(ge=1, le=114, description="Surah number (1–114)")],
    translations: Annotated[
        str,
        Query(description="Translation key, e.g. 'sahih_international' or 'urdu'"),
    ] = "sahih_international",
) -> dict:
    """
    Fetch a complete surah (all ayahs) with the requested translation.
    Target Endpoint: /api/quran/surah/{number}
    """
    client = get_ummah_client()
    try:
        # 🛠️ FIXED: Matched the path parameter and the singular 'translation' key from your docs image
        response = await client.get(
            f"/quran/surah/{surah_id}",
            params={
                "translation": translations  # Ummah API expects 'translation' singular
            },
        )
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        _raise_from_httpx(exc, f"quran/surah/{surah_id}")
    except httpx.RequestError as exc:
        logger.error("Network error fetching surah %d: %s", surah_id, exc)
        raise HTTPException(status_code=503, detail="Could not reach Ummah API. Network error.")

    try:
        payload = response.json()
    except Exception as exc:
        logger.error("Failed to parse surah %d JSON: %s", surah_id, exc)
        raise HTTPException(status_code=502, detail="Upstream returned non-JSON response.")

    if not isinstance(payload, dict):
        logger.error("Unexpected top-level type for surah %d: %s", surah_id, type(payload))
        raise HTTPException(status_code=502, detail="Unexpected upstream response format.")

    logger.info("Fetched surah %d (translation=%s).", surah_id, translations)
    return payload