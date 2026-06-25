Backend (FastAPI) folder.

Structure:
- app/main.py
- app/routers
- app/services
- requirements.txt

Run:
- python -m venv .venv
- .venv\Scripts\activate
- pip install -r requirements.txt
- uvicorn app.main:app --reload
