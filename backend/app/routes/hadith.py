from __future__ import annotations

import logging
from typing import Annotated, Any

import httpx
from fastapi import APIRouter, HTTPException, Path, Query

from app.utils.api_handler import get_ummah_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/hadith", tags=["Hadith"])

# Known collection slugs – used for a quick validation hint in error messages.
KNOWN_COLLECTIONS: frozenset[str] = frozenset(
    {"bukhari", "muslim", "tirmidhi", "abudawud", "nasai", "ibnmajah", "malik"}
)


def _raise_from_httpx(exc: httpx.HTTPStatusError, context: str) -> None:
    status = exc.response.status_code
    if status == 401:
        detail = f"[{context}] Upstream rejected our API key (401)."
    elif status == 404:
        detail = (
            f"[{context}] Collection not found (404). "
            f"Valid slugs: {', '.join(sorted(KNOWN_COLLECTIONS))}."
        )
    elif status == 429:
        detail = f"[{context}] Ummah API rate-limit hit (429). Retry later."
    elif 500 <= status < 600:
        detail = f"[{context}] Ummah API server error ({status})."
    else:
        detail = f"[{context}] Upstream HTTP {status}."

    logger.error("httpx status error – %s | body: %s", detail, exc.response.text[:500])
    raise HTTPException(status_code=502, detail=detail)


def _safe_list(payload: Any, key: str, context: str) -> list:
    """Safely extracts lists from direct values or nested dictionary keys."""
    if isinstance(payload, list):
        return payload
        
    if not isinstance(payload, dict):
        logger.warning("[%s] Expected dict or list, got %s.", context, type(payload).__name__)
        return []
        
    value = payload.get(key)
    if value is None:
        # Check alternative common data keys
        for alt_key in ["data", "collections", "hadiths", "results"]:
            if alt_key in payload and isinstance(payload[alt_key], list):
                return payload[alt_key]
        logger.warning("[%s] Key '%s' missing from response.", context, key)
        return []
    if not isinstance(value, list):
        logger.warning("[%s] Key '%s' is %s, expected list.", context, key, type(value).__name__)
        return []
    return value


# ── routes ────────────────────────────────────────────────────────────────────

@router.get(
    "/collections",
    summary="Get all available hadith collections with names and hadith counts",
    response_model=list[dict] | dict,
)
async def get_collections() -> list[dict] | dict:
    """
    Returns metadata summaries for all primary available canonical hadith books.
    Target Endpoint: https://ummahapi.com/api/hadith/collections
    """
    client = get_ummah_client()
    try:
        response = await client.get("/hadith/collections")
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        _raise_from_httpx(exc, "hadith/collections")
    except httpx.RequestError as exc:
        logger.error("Network error fetching hadith collections metadata: %s", exc)
        raise HTTPException(status_code=503, detail="Could not reach Ummah API.")

    try:
        payload = response.json()
    except Exception as exc:
        logger.error("Failed to parse collections metadata JSON: %s", exc)
        raise HTTPException(status_code=502, detail="Upstream returned non-JSON response.")

    return payload


@router.get(
    "/{collection_slug}",
    summary="Fetch paginated hadiths from a named collection",
    response_model=dict,
)
async def get_hadiths(
    collection_slug: Annotated[
        str,
        Path(description="Hadith collection identifier, e.g. 'bukhari'"),
    ],
    page: Annotated[int, Query(ge=1, description="Page number (1-indexed)")] = 1,
    limit: Annotated[int, Query(ge=1, le=100, description="Hadiths per page (max 100)")] = 20,
) -> dict:
    """
    Returns paginated items from an isolated targeted book collection array.
    Target Endpoint: https://ummahapi.com/api/hadith/{collection_slug}?page={page}&limit={limit}
    """
    if collection_slug not in KNOWN_COLLECTIONS:
        logger.warning("Unknown collection slug requested: '%s'", collection_slug)

    client = get_ummah_client()
    try:
        # Fixed endpoint mapping path from "/hadith/collections/{collection_slug}" to "/hadith/{collection_slug}"
        response = await client.get(
            f"/hadith/{collection_slug}",
            params={"page": page, "limit": limit},
        )
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        _raise_from_httpx(exc, f"hadith/{collection_slug}")
    except httpx.RequestError as exc:
        logger.error("Network error fetching hadith collection '%s': %s", collection_slug, exc)
        raise HTTPException(status_code=503, detail="Could not reach Ummah API. Network error.")

    try:
        payload = response.json()
    except Exception as exc:
        logger.error("Failed to parse hadith JSON for '%s': %s", collection_slug, exc)
        raise HTTPException(status_code=502, detail="Upstream returned non-JSON response.")

    if not isinstance(payload, dict):
        logger.error(
            "Unexpected payload type for collection '%s': %s", collection_slug, type(payload)
        )
        raise HTTPException(status_code=502, detail="Unexpected upstream response format.")

    # Safely unpack inside the data dictionary layer if nested under a data envelope object
    data_object = payload.get("data", payload)
    hadiths = _safe_list(data_object, "hadiths", f"hadith/{collection_slug}")
    
    logger.info(
        "Fetched %d hadiths from '%s' (page=%d, limit=%d).",
        len(hadiths),
        collection_slug,
        page,
        limit,
    )

    # Ensure payload returns uniform tracking properties safely to client views
    if isinstance(payload.get("data"), dict):
        payload["data"].setdefault("hadiths", hadiths)
    else:
        payload.setdefault("hadiths", hadiths)
        
    return payload