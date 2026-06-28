import os
import json
import httpx
from typing import List, Dict, Any, AsyncGenerator
from app.config import settings

SYSTEM_PROMPT = (
    "You are a highly respectful, knowledgeable, and context-aware Islamic AI assistant. "
    "Answer user queries concisely, accurately referencing the Holy Quran and authentic Hadith text where applicable. "
    "Maintain neutrality, and provide citations professionally."
)

async def stream_completion_openai(messages: List[Dict[str,str]]) -> AsyncGenerator[str, None]:
    """Stream completion from OpenAI v1 chat completions endpoint (stream=True).
    Yields decoded text chunks as they arrive.
    """
    api_key = settings.OPENAI_API_KEY
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY not configured")
    url = "https://api.apizio.com/v1"
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {"model":"gpt-4o-mini","messages": [{"role":"system","content": SYSTEM_PROMPT}] + messages, "stream": True}
    async with httpx.AsyncClient(timeout=None) as client:
        async with client.stream("POST", url, headers=headers, json=payload) as resp:
            resp.raise_for_status()
            async for line in resp.aiter_lines():
                if not line:
                    continue
                # OpenAI stream sends lines like: data: {json}\n
                if line.startswith("data:"):
                    data = line[len("data:"):].strip()
                    if data == "[DONE]":
                        break
                    try:
                        obj = json.loads(data)
                        delta = obj.get("choices", [])[0].get("delta", {})
                        content = delta.get("content")
                        if content:
                            yield content
                    except json.JSONDecodeError:
                        continue
    raise RuntimeError("No AI provider API key configured.")
