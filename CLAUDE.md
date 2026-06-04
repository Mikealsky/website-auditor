# Website Auditor — Claude Code Context

## What This Project Is
A SaaS web app where business owners enter their website URL and receive:
- A performance audit (load speed, Core Web Vitals)
- An SEO audit (meta tags, headings, alt text)
- A design/UX audit (CTA visibility, trust signals, mobile responsiveness)
- An AI-generated plain-English report with prioritised recommendations
- A downloadable PDF summary

Target user: non-technical small business owners who need actionable advice, not raw scores.

## Tech Stack
- **Backend**: Python + FastAPI
- **Frontend**: React + Tailwind CSS
- **Data/Scraping**: BeautifulSoup4 (HTML parsing), httpx (async HTTP)
- **External APIs**: Google PageSpeed Insights API (free), Anthropic Claude API
- **AI Model**: claude-sonnet-4-20250514
- **PDF Export**: WeasyPrint
- **Database**: SQLite (dev) → PostgreSQL (prod)
- **Auth**: Firebase Auth (future milestone)
- **Deployment**: Render or Railway (free tier)

## Project Structure
```
website-auditor/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── routers/
│   │   └── audit.py         # /audit POST endpoint
│   ├── services/
│   │   ├── pagespeed.py     # Google PageSpeed Insights API calls
│   │   ├── scraper.py       # BeautifulSoup HTML auditing
│   │   ├── ai_report.py     # Claude API integration
│   │   └── pdf_export.py    # PDF generation
│   ├── models/
│   │   └── audit.py         # Pydantic models / DB schema
│   └── tests/
│       └── test_audit.py
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level page components
│   │   └── App.jsx
│   └── package.json
├── .env.example             # Required env vars (never commit .env)
├── requirements.txt
├── CLAUDE.md                # This file
└── README.md
```

## Key Conventions
- **Python**: snake_case, type hints on all functions, async/await throughout
- **React**: functional components only, no class components
- **API responses**: always return `{ success: bool, data: {}, error: str | null }`
- **Never commit**: .env files, API keys, or secrets of any kind
- **Error handling**: every external API call must have try/except with meaningful error messages

## Environment Variables Needed
```
ANTHROPIC_API_KEY=
PAGESPEED_API_KEY=
DATABASE_URL=
```

## Current Milestones
- [ ] M1: FastAPI setup + /audit endpoint returns mock JSON
- [ ] M2: PageSpeed API integration — real performance scores
- [ ] M3: BeautifulSoup SEO + design scraper
- [ ] M4: Claude API generates plain-English report from audit data
- [ ] M5: React frontend — URL input + results dashboard
- [x] M6: PDF export
- [ ] M7: User auth + save past audits
- [ ] M8: Deploy live

## How to Run (once set up)
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Note for Windows users
Use: python -m uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Claude Code Tips for This Project
- Work one milestone at a time — don't try to build everything at once
- Always ask Claude Code to write tests alongside new features
- Use `Plan Mode` before starting any new milestone to map out the approach
- Commit to Git after each milestone completes
