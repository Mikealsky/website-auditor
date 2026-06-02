from dotenv import load_dotenv
from pathlib import Path
load_dotenv(Path(__file__).parent / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import audit

app = FastAPI(
    title="Website Auditor API",
    description="Audits business websites and returns AI-generated improvement recommendations.",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(audit.router, prefix="/api")


@app.get("/")
async def root():
    return {"status": "ok", "message": "Website Auditor API is running"}
