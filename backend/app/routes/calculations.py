"""
app/routes/calculations.py
---------------------------
Prayer time endpoints:
  GET /calculations/prayer-times  – daily prayer schedule for a lat/lng

Supports the full set of calculation methods exposed by Ummah API:
  MWL | ISNA | Egypt | Makkah | Karachi | Tehran | Jafari |
  NorthAmerica | Singapore | Turkey | Kuwait | Qatar | Dubai |
  MoonsightingCommittee | Russia | Morocco | French15 | French18 |
  Tunisia | Gulf | Custom
"""

from __future__ import annotations

import logging
from typing import Annotated, Literal

import httpx
from fastapi import APIRouter, HTTPException, Query

from app.utils.api_handler import get_ummah_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/calculations", tags=["Prayer Times"])

# All method strings accepted by Ummah API.
PrayerMethod = Literal[
    "MWL", "ISNA", "Egypt", "Makkah", "Karachi", "Tehran", "Jafari",
    "NorthAmerica", "Singapore", "Turkey", "Kuwait", "Qatar", "Dubai",
    "MoonsightingCommittee", "Russia", "Morocco", "French15", "French18",
    "Tunisia", "Gulf", "Custom",
]


def _raise_from_httpx(exc: httpx.HTTPStatusError, context: str) -> None:
    status = exc.response.status_code
    if status == 400:
        detail = (
            f"[{context}] Upstream rejected the request (400). "
            "Check that lat/lng/method are valid."
        )
    elif status == 401:
        detail = f"[{context}] Upstream rejected our API key (401)."
    elif status == 429:
        detail = f"[{context}] Rate-limit hit on Ummah API (429). Retry later."
    elif 500 <= status < 600:
        detail = f"[{context}] Ummah API server error ({status})."
    else:
        detail = f"[{context}] Upstream HTTP {status}."

    logger.error("httpx status error – %s | body: %s", detail, exc.response.text[:500])
    raise HTTPException(status_code=502, detail=detail)


@router.get(
    "/prayer-times",
    summary="Fetch daily prayer times for a location",
    response_model=dict,
)
async def get_prayer_times(
    lat: Annotated[float, Query(ge=-90, le=90, description="Latitude of the location")],
    lng: Annotated[float, Query(ge=-180, le=180, description="Longitude of the location")],
    method: Annotated[
        PrayerMethod,
        Query(description="Calculation method name (e.g. 'ISNA', 'MWL', 'Makkah')"),
    ] = "MWL",
) -> dict:
    """
    Returns today's prayer times (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha)
    plus the current Hijri date and timezone, forwarded from Ummah API.

    Example:
        GET /calculations/prayer-times?lat=21.39&lng=39.86&method=Makkah
    """
    client = get_ummah_client()
    try:
        response = await client.get(
            "/prayer-times",
            params={"lat": lat, "lng": lng, "method": method},
        )
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        _raise_from_httpx(exc, "prayer-times")
    except httpx.RequestError as exc:
        logger.error(
            "Network error fetching prayer times (lat=%s, lng=%s): %s", lat, lng, exc
        )
        raise HTTPException(status_code=503, detail="Could not reach Ummah API. Network error.")

    try:
        payload = response.json()
    except Exception as exc:
        logger.error("Failed to parse prayer-times JSON: %s", exc)
        raise HTTPException(status_code=502, detail="Upstream returned non-JSON response.")

    if not isinstance(payload, dict):
        logger.error("Unexpected payload type for prayer-times: %s", type(payload))
        raise HTTPException(status_code=502, detail="Unexpected upstream response format.")

    # Validate that the core times dict is present.
    times = payload.get("times") or payload.get("data", {}).get("timings")
    if not times:
        logger.warning(
            "Prayer times payload missing 'times' or 'data.timings'. "
            "Present keys: %s",
            list(payload.keys()),
        )

    logger.info(
        "Fetched prayer times for lat=%.4f, lng=%.4f, method=%s.", lat, lng, method
    )
    return payload