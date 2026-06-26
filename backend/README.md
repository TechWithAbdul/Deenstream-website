Backend (FastAPI) folder.

Structure:
- app/main.py
- app/routers
- app/services
- requirements.txt

Routes currently include:
- /health
- /ai/chat
- /quran/surah
- /quran/surah/{number}
- /quran/search
- /hadith
- /prayer
- /prayer/hijri

Run:
- python -m venv .venv
- .\.venv\Scripts\activate
- pip install -r requirements.txt
- uvicorn app.main:app --reload
