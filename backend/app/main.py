"""
app/main.py
------------
FastAPI application factory for Deestream Website backend.

Responsibilities:
  • Lifespan context manager – opens / closes the shared HTTPX client.
  • CORS middleware – allows the Vite dev server and production origins.
  • Router registration with URL prefixes and OpenAPI tags.
  • Global exception handlers for unhandled errors.
  • /health endpoint for container/load-balancer liveness probes.
"""

from __future__ import annotations

import logging
import sys
from contextlib import asynccontextmanager
from typing import AsyncGenerator

import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import app.utils.api_handler as _handler
from app.config import settings
from app.routes import ai_chat, calculations, duas, hadith, names, quran

# ── Logging setup ─────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger("deestream")


# ── Lifespan ──────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Startup: build the shared HTTPX client and store it on the module.
    Shutdown: cleanly close all pooled connections.
    """
    logger.info("Deestream backend starting up…")
    _handler.ummah_client = _handler.build_ummah_client()
    logger.info("HTTPX AsyncClient initialised (base_url=%s).", settings.UMMAH_BASE_URL)

    yield  # ← application runs here

    logger.info("Deestream backend shutting down – closing HTTPX client…")
    await _handler.ummah_client.aclose()
    logger.info("HTTPX AsyncClient closed.")


# ── Application factory ───────────────────────────────────────────────────────

app = FastAPI(
    title="Deestream Website API",
    description=(
        "Secure reverse-proxy backend for the Deestream Islamic content platform. "
        "Exposes Quran, Hadith, Prayer Times, Duas, 99 Names, and an AI chat assistant."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)


# ── CORS ──────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ── Global exception handlers ─────────────────────────────────────────────────

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception(
        "Unhandled exception on %s %s: %s", request.method, request.url.path, exc
    )
    return JSONResponse(
        status_code=500,
        content={
            "detail": (
                "An unexpected internal error occurred. "
                "Please try again or contact support."
            )
        },
    )


@app.exception_handler(httpx.RequestError)
async def httpx_network_handler(request: Request, exc: httpx.RequestError) -> JSONResponse:
    logger.error("Upstream network error on %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=503,
        content={"detail": "Could not reach an upstream service. Please try again shortly."},
    )


# ── Routers ───────────────────────────────────────────────────────────────────

app.include_router(quran.router,        prefix="/api/v1")
app.include_router(hadith.router,       prefix="/api/v1")
app.include_router(calculations.router, prefix="/api/v1")
app.include_router(duas.router,         prefix="/api/v1")
app.include_router(names.router,        prefix="/api/v1")
app.include_router(ai_chat.router,      prefix="/api/v1")


# ── Utility endpoints ─────────────────────────────────────────────────────────

@app.get("/health", tags=["System"], summary="Liveness probe")
async def health_check() -> dict:
    """
    Returns 200 OK when the server is running.
    Does NOT test upstream connectivity – use /api/v1/quran/chapters for that.
    """
    return {"status": "ok", "service": "deestream-backend"}


@app.get("/", tags=["System"], summary="Root info")
async def root() -> dict:
    return {
        "service": "Deestream Website API",
        "version": "1.0.0",
        "docs": "/docs",
    }