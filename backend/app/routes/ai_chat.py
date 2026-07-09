"""
app/routes/ai_chat.py
----------------------
Islamic AI Chatbot endpoint:
  POST /ai/chat  – send a user message and receive a Groq-powered response
"""

from __future__ import annotations

import logging
from typing import Annotated

from fastapi import APIRouter, HTTPException
from openai import APIConnectionError, APIStatusError, AsyncOpenAI
from pydantic import BaseModel, Field, field_validator

from app.config import settings
from app.utils.api_handler import get_openai_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai", tags=["AI Chat"])

# ── Request / Response models ─────────────────────────────────────────────────

class ChatMessage(BaseModel):
    """A single message in the conversation thread."""
    role: str = Field(..., pattern=r"^(user|assistant)$")
    content: str = Field(..., min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    """Full request body sent by the frontend."""
    message: str = Field(..., min_length=1, max_length=4000, description="Latest user message")
    history: list[ChatMessage] = Field(
        default_factory=list,
        max_length=40,
        description="Previous turns in the conversation",
    )

    @field_validator("message")
    @classmethod
    def message_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Message must not be blank.")
        return v.strip()


class ChatResponse(BaseModel):
    """Shape returned to the frontend."""
    reply: str
    model: str
    finish_reason: str | None = None


# ── System prompt ─────────────────────────────────────────────────────────────

_SYSTEM_PROMPT = (
    "You are Deestream Assistant, a knowledgeable and respectful Islamic AI companion. "
    "Your purpose is to help users learn about Islam through the Quran, authentic Hadith, "
    "Islamic history, fiqh, and spirituality. "
    "Always respond with compassion, accuracy, and humility. "
    "Cite Quranic verses (surah:ayah) and hadith sources when relevant. "
    "If a question falls outside Islamic topics or is inappropriate, politely redirect "
    "the conversation back to Islamic knowledge. "
    "Never fabricate religious rulings or attribute statements to scholars without certainty."
)


# ── Route ─────────────────────────────────────────────────────────────────────

@router.post(
    "/chat",
    summary="Send a message to the Islamic AI assistant",
    response_model=ChatResponse,
)
async def chat(body: ChatRequest) -> ChatResponse:
    """
    Accepts a user message plus optional prior conversation history,
    forwards everything to Groq, and returns the reply.
    """
    try:
        client: AsyncOpenAI = get_openai_client()
    except RuntimeError as exc:
        logger.error("AI client configuration error: %s", exc)
        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc

    # Build the messages list: system → history → latest user message.
    messages: list[dict[str, str]] = [{"role": "system", "content": _SYSTEM_PROMPT}]

    for turn in body.history:
        messages.append({"role": turn.role, "content": turn.content})

    messages.append({"role": "user", "content": body.message})

    logger.info(
        "AI chat request: %d history turns + new message (%d chars).",
        len(body.history),
        len(body.message),
    )

    # Use Groq's high-speed production model identifier
    target_model = "llama-3.3-70b-versatile"

    try:
        completion = await client.chat.completions.create(
            model=target_model,
            messages=messages,  # type: ignore[arg-type]
            max_tokens=4048,
            temperature=0.7,
        )
    except APIStatusError as exc:
        status = exc.status_code
        logger.error(
            "Groq API error %d: %s", status, exc.message
        )
        if status == 401:
            raise HTTPException(
                status_code=502,
                detail="AI service rejected the API key (401). Check GROQ_API_KEY.",
            )
        if status == 429:
            logger.warning("AI provider rate-limit reached for chat request.")
            return ChatResponse(
                reply=(
                    "The AI service is currently receiving too many requests. "
                    "Please wait a moment and try again."
                ),
                model=target_model,
                finish_reason="rate_limited",
            )
        if status == 400:
            raise HTTPException(
                status_code=400,
                detail=f"AI service rejected the request: {exc.message}",
            )
        raise HTTPException(
            status_code=502,
            detail=f"AI service returned an error ({status}): {exc.message}",
        )
    except APIConnectionError as exc:
        logger.error("Could not connect to Groq gateway: %s", exc)
        raise HTTPException(
            status_code=503,
            detail="Could not connect to the AI service. Network error.",
        )
    except Exception as exc:
        logger.exception("Unexpected error in AI chat route: %s", exc)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while processing your request.",
        )

    try:
        choice = completion.choices[0]
        reply_text: str = choice.message.content or ""
        finish_reason: str | None = choice.finish_reason
    except (IndexError, AttributeError) as exc:
        logger.error(
            "Unexpected completion structure from Groq: %s | raw: %s", exc, completion
        )
        raise HTTPException(
            status_code=502,
            detail="AI service returned an unrecognisable response structure.",
        )

    return ChatResponse(
        reply=reply_text,
        model=completion.model or target_model,
        finish_reason=finish_reason,
    )