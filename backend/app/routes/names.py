"""
app/routes/names.py
--------------------
Asma-ul-Husna (99 Names of Allah) endpoints:
  GET /names         – full list of all 99 names
  GET /names/{name_id} – single name by number (1–99)
"""

from __future__ import annotations

import logging
from typing import Annotated, Any

import httpx
from fastapi import APIRouter, HTTPException, Path

from app.utils.api_handler import get_ummah_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/names", tags=["99 Names"])


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


def _extract_names_list(payload: Any, context: str) -> list[dict]:
    """
    Handles both bare-list and dict-wrapped responses from Ummah API.
    """
    if isinstance(payload, list):
        return payload  # type: ignore[return-value]

    if isinstance(payload, dict):
        for key in ("names", "data", "results"):
            value = payload.get(key)
            if isinstance(value, list):
                return value  # type: ignore[return-value]
        logger.warning(
            "[%s] Could not find list under standard keys. Keys present: %s",
            context,
            list(payload.keys()),
        )
        return []

    logger.error("[%s] Unexpected payload type: %s", context, type(payload).__name__)
    raise HTTPException(status_code=502, detail="Unexpected upstream response format.")


@router.get(
    "",
    summary="Fetch all 99 Names of Allah (Asma-ul-Husna)",
    response_model=list[dict],
)
async def get_names() -> list[dict]:
    """
    Returns all 99 names with Arabic text, transliteration, meaning,
    and any translational notes provided by Ummah API.
    """
    client = get_ummah_client()
    try:
        response = await client.get("/names")
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        _raise_from_httpx(exc, "names")
    except httpx.RequestError as exc:
        logger.error("Network error fetching names: %s", exc)
        raise HTTPException(status_code=503, detail="Could not reach Ummah API. Network error.")

    try:
        payload = response.json()
    except Exception as exc:
        logger.error("Failed to parse names JSON: %s", exc)
        raise HTTPException(status_code=502, detail="Upstream returned non-JSON response.")

    names = _extract_names_list(payload, "names")

    # Sanity check: there should be exactly 99 names.
    if names and len(names) != 99:
        logger.warning(
            "Upstream returned %d names instead of 99. API may have changed.", len(names)
        )

    logger.info("Fetched %d names from Ummah API.", len(names))
    return names


@router.get(
    "/{name_id}",
    summary="Fetch a single name by its number (1–99)",
    response_model=dict,
)
async def get_name(
    name_id: Annotated[int, Path(ge=1, le=99, description="Name number 1 to 99")]
) -> dict:
    """
    Returns a single name object.
    Useful for animated 'Name of the Day' widgets on the homepage.
    """
    client = get_ummah_client()
    try:
        response = await client.get(f"/names/{name_id}")
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        _raise_from_httpx(exc, f"names/{name_id}")
    except httpx.RequestError as exc:
        logger.error("Network error fetching name %d: %s", name_id, exc)
        raise HTTPException(status_code=503, detail="Could not reach Ummah API. Network error.")

    try:
        payload = response.json()
    except Exception as exc:
        logger.error("Failed to parse name %d JSON: %s", name_id, exc)
        raise HTTPException(status_code=502, detail="Upstream returned non-JSON response.")

    if not isinstance(payload, dict):
        # Some APIs return a single-item list for individual lookups.
        if isinstance(payload, list) and len(payload) == 1:
            logger.debug("Name %d returned as single-item list; unwrapping.", name_id)
            return payload[0]  # type: ignore[index]

        logger.error("Unexpected type for name %d: %s", name_id, type(payload).__name__)
        raise HTTPException(status_code=502, detail="Unexpected upstream response format.")

    logger.info("Fetched name id=%d.", name_id)
    return payload