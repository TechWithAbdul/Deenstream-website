DeenStream AI

Modern full-stack Islamic knowledge web app.

This project is built as a React + Vite + Tailwind frontend with a FastAPI backend. It now includes:
- Quran reader with translation, surah navigation, and search.
- Hadith library powered by local JSON data and searchable queries.
- AI chatbot for Islamic questions using the backend OpenAI integration.
- Prayer times and Hijri date lookup via the backend prayer API.
- Responsive UI and smooth animations for a polished user experience.

Run the frontend:
- cd frontend
- npm install
- npm run dev

Run the backend:
- cd backend
- python -m venv .venv
- .\.venv\Scripts\activate
- pip install -r requirements.txt
- uvicorn app.main:app --reload

The frontend uses the backend API at http://localhost:8000 by default.