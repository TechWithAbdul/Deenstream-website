import os
import httpx

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

async def ask_ai(question: str):
    if not OPENAI_API_KEY:
        return 'AI not configured. Set OPENAI_API_KEY in environment.'
    headers = {'Authorization': f'Bearer {OPENAI_API_KEY}', 'Content-Type': 'application/json'}
    payload = {
        'model': 'gpt-4o-mini',
        'messages': [
            {'role': 'system', 'content': 'You are an Islamic assistant who references Quran and Hadith when relevant.'},
            {'role': 'user', 'content': question}
        ],
        'max_tokens': 800
    }
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(OPENAI_URL, headers=headers, json=payload)
        r.raise_for_status()
        data = r.json()
        return data['choices'][0]['message']['content']
