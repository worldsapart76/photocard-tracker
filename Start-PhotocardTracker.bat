@echo off
echo Starting Photocard Tracker...

start "Backend" cmd /k "cd /d F:\Dropbox\Apps\PhotocardTracker\backend && .venv\Scripts\activate && uvicorn main:app --reload --port 8000"

start "Frontend" cmd /k "cd /d F:\Dropbox\Apps\PhotocardTracker\frontend && npm run dev"