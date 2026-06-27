import os
import httpx
from typing import Dict

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
OPENAI_URL = os.getenv('OPENAI_URL', 'https://api.openai.com/v1/chat/completions')

# System prompt tuned for Islamic assistant behaviour and safety
SYSTEM_PROMPT = (
    "You are DeenStream AI, an Islamic assistant. Provide concise, accurate, and respectful answers. "
    "When relevant, reference Quranic verses or Hadiths with short citations (e.g., Surah 2:255, Sahih Bukhari 1:1). "
    "Do NOT invent hadith or verses; if you cannot verify a claim, say so and suggest where to check (Quran, Sahih collections). "
    "Keep tone educational and non-prescriptive."
)

async def ask_ai(question: str, context: Dict = None):
    if not OPENAI_API_KEY:
        return 'AI not configured. Set OPENAI_API_KEY in environment.'

    messages = [
        {'role': 'system', 'content': SYSTEM_PROMPT},
    ]

    # If context includes a surah/ayah, add it to the system message for grounding
    if context:
        ctx_parts = []
        if 'surah' in context and 'ayah' in context:
            ctx_parts.append(f"Reference: Surah {context['surah']} Ayah {context['ayah']}")
        if 'hadith' in context:
            ctx_parts.append(f"Reference hadith id: {context['hadith']}")
        if ctx_parts:
            messages.append({'role': 'system', 'content': ' | '.join(ctx_parts)})

    messages.append({'role': 'user', 'content': question})

    payload = {
        'model': os.getenv('OPENAI_MODEL', 'gpt-4o-mini'),
        'messages': messages,
        'max_tokens': 800,
        'temperature': 0.1,
    }

    headers = {'Authorization': f'Bearer {OPENAI_API_KEY}', 'Content-Type': 'application/json'}

    async with httpx.AsyncClient(timeout=60.0) as client:
        r = await client.post(OPENAI_URL, headers=headers, json=payload)
        r.raise_for_status()
        data = r.json()
        # Try to pick assistant content safely
        try:
            return data['choices'][0]['message']['content']
        except Exception:
            return 'AI returned unexpected response format.'
