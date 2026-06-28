# DocMind AI — React Frontend

Black & gold RAG chatbot UI for your FastAPI backend.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Requirements

Your FastAPI server must be running at http://localhost:8000 with:
- POST /file_upload  — accepts multipart PDF upload
- POST /chat?query=  — returns { answer, matched_chunks }

## Project structure

src/
├── App.jsx              # Root layout + chat state
├── App.css              # Full black/gold theme
├── main.jsx             # React entry point
└── components/
    ├── Sidebar.jsx      # PDF upload + doc list
    ├── ChatArea.jsx     # Message bubbles + thinking indicator
    └── InputBar.jsx     # Textarea + send button

## CORS

Add this to your FastAPI app so the React dev server can call it:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```
