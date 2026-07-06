"""
app/routes/duas.py
-------------------
Supplications (Duas) endpoints:
  GET /duas         – full curated list of Islamic supplications
  GET /duas/{id}   – single dua by its upstream ID
"""

from __future__ import annotations

import logging
from typing import Annotated, Any

import httpx
from fastapi import APIRouter, HTTPException, Path

from app.utils.api_handler import get_ummah_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/duas", tags=["Duas"])


def _raise_from_httpx(exc: httpx.HTTPStatusError, context: str) -> None:
    status = exc.response.status_code
    if status == 401:
        detail = f"[{context}] Upstream rejected our API key (401)."
    elif status == 404:
        detail = f"[{context}] Resource not found (404)."
    elif status == 429:
        detail = f"[{context}] Rate-limit hit on Ummah API (429). Retry later."
    elif 500 <= status < 600:
        detail = f"[{context}] Ummah API server error ({status})."
    else:
        detail = f"[{context}] Upstream HTTP {status}."

    logger.error("httpx status error – %s | body: %s", detail, exc.response.text[:500])
    raise HTTPException(status_code=502, detail=detail)


def _safe_extract_list(payload: Any, context: str) -> list[dict]:
    """
    Handles bare list responses, standard dict-wrapped lists, and nested envelope structures.
    Returns a guaranteed list[dict] or returns an empty list gracefully.
    """
    if isinstance(payload, list):
        return payload  # type: ignore[return-value]

    if isinstance(payload, dict):
        # 1. Step inside the "data" dictionary if it contains nested objects
        inner_data = payload.get("data")
        if isinstance(inner_data, dict):
            for inner_key in ("duas", "items", "results"):
                value = inner_data.get(inner_key)
                if isinstance(value, list):
                    return value  # type: ignore[return-value]
            # Fallback if "data" is a list directly instead of an object
            if isinstance(inner_data, list):
                return inner_data  # type: ignore[return-value]

        # 2. Check top level keys as fallback alternative maps
        for candidate_key in ("duas", "data", "results", "items"):
            value = payload.get(candidate_key)
            if isinstance(value, list):
                return value  # type: ignore[return-value]

        logger.warning(
            "[%s] Could not locate list under standard keys. Present keys: %s",
            context,
            list(payload.keys()),
        )
        return []

    logger.error("[%s] Unexpected payload type: %s", context, type(payload).__name__)
    raise HTTPException(status_code=502, detail="Unexpected upstream response format.")


@router.get(
    "",
    summary="Fetch all Islamic supplications",
    response_model=list[dict],
)
async def get_duas() -> list[dict]:
    """
    Returns the complete curated list of duas from Ummah API.
    Each dua object typically contains `id`, `arabic`, `transliteration`,
    `translation`, `reference`, and `category`.
    """
    client = get_ummah_client()
    try:
        response = await client.get("/duas")
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        _raise_from_httpx(exc, "duas")
    except httpx.RequestError as exc:
        logger.error("Network error fetching duas: %s", exc)
        raise HTTPException(status_code=503, detail="Could not reach Ummah API. Network error.")

    try:
        payload = response.json()
    except Exception as exc:
        logger.error("Failed to parse duas JSON: %s", exc)
        raise HTTPException(status_code=502, detail="Upstream returned non-JSON response.")

    duas = _safe_extract_list(payload, "duas")
    logger.info("Fetched %d duas from Ummah API.", len(duas))
    return duas


@router.get(
    "/{dua_id}",
    summary="Fetch a single dua by ID",
    response_model=dict,
)
async def get_dua(
    dua_id: Annotated[int, Path(ge=1, description="Upstream dua identifier")]
) -> dict:
    """
    Returns a single supplication object by its ID.
    Useful for 'Dua of the Day' or detail views.
    """
    client = get_ummah_client()
    try:
        response = await client.get(f"/duas/{dua_id}")
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        _raise_from_httpx(exc, f"duas/{dua_id}")
    except httpx.RequestError as exc:
        logger.error("Network error fetching dua %d: %s", dua_id, exc)
        raise HTTPException(status_code=503, detail="Could not reach Ummah API. Network error.")

    try:
        payload = response.json()
    except Exception as exc:
        logger.error("Failed to parse dua %d JSON: %s", dua_id, exc)
        raise HTTPException(status_code=502, detail="Upstream returned non-JSON response.")

    if not isinstance(payload, dict):
        logger.error("Unexpected type for dua %d: %s", dua_id, type(payload).__name__)
        raise HTTPException(status_code=502, detail="Unexpected upstream response format.")

    logger.info("Fetched dua id=%d.", dua_id)
    return payload