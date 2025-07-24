# Admin Portal

A full-stack admin portal with FastAPI backend and React (Vite) frontend.

## Backend (FastAPI)

**Setup:**
1. Navigate to backend directory:
   ```sh
   cd Backend/admin-portal/backend
   ```
2. (Optional) Create and activate a virtual environment:
   ```sh
   python -m venv venv
   venv\Scripts\activate  # On Windows
   source venv/bin/activate  # On Mac/Linux
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Run the server:
   ```sh
   uvicorn main:app --reload
   ```

## Frontend (React + Vite)

**Setup:**
1. Navigate to frontend directory:
   ```sh
   cd Backend/admin-portal/frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the dev server:
   ```sh
   npm run dev
   ```

## Project Structure
- `backend/` - FastAPI backend
- `frontend/` - React frontend

## Notes
- Backend runs on http://localhost:8000
- Frontend runs on http://localhost:5173
- CORS is enabled for local development. 