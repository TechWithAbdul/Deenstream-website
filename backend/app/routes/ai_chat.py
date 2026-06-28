"""
app/routes/ai_chat.py
----------------------
Islamic AI Chatbot endpoint:
  POST /ai/chat  – send a user message and receive a Gemini-powered response

The OpenAI SDK is pointed at the Apizio gateway which exposes Gemini models
through an OpenAI-compatible interface.

Design decisions:
  • System prompt constrains the model to Islamic content only.
  • Multi-turn conversation history is accepted from the client so context
    is preserved across turns without storing server-side state.
  • Streaming is NOT enabled here; for streaming add `stream=True` and
    use StreamingResponse – straightforward to add later.
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
    """
    Full request body sent by the frontend.

    `history` may be empty for the first turn; the backend will prepend
    the system prompt automatically.
    """
    message: str = Field(..., min_length=1, max_length=4000, description="Latest user message")
    history: list[ChatMessage] = Field(
        default_factory=list,
        max_length=40,                          # cap context to ~20 turns
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
    forwards everything to Gemini (via Apizio), and returns the reply.

    The frontend is responsible for maintaining and re-sending `history`
    on each turn – this keeps the backend stateless.
    """
    client: AsyncOpenAI = get_openai_client()

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

    try:
        completion = await client.chat.completions.create(
            model=settings.GEMINI_MODEL,
            messages=messages,  # type: ignore[arg-type]
            max_tokens=1024,
            temperature=0.7,
        )
    except APIStatusError as exc:
        status = exc.status_code
        logger.error(
            "Apizio/Gemini API error %d: %s", status, exc.message
        )
        if status == 401:
            raise HTTPException(
                status_code=502,
                detail="AI service rejected the API key (401). Check GEMINI_API_KEY.",
            )
        if status == 429:
            raise HTTPException(
                status_code=429,
                detail="AI service rate-limit reached. Please wait a moment and retry.",
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
        logger.error("Could not connect to Apizio gateway: %s", exc)
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
            "Unexpected completion structure from Apizio: %s | raw: %s", exc, completion
        )
        raise HTTPException(
            status_code=502,
            detail="AI service returned an unrecognisable response structure.",
        )

    if not reply_text.strip():
        logger.warning(
            "AI returned an empty reply. finish_reason=%s | model=%s",
            finish_reason,
            completion.model,
        )

    logger.info(
        "AI chat response: %d chars, finish_reason=%s.", len(reply_text), finish_reason
    )

    return ChatResponse(
        reply=reply_text,
        model=completion.model or settings.GEMINI_MODEL,
        finish_reason=finish_reason,
    )