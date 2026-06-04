# Website Auditor

A SaaS web app that helps small business owners understand and improve their websites. Enter a URL and get an instant audit covering performance, SEO, and design — plus an AI-generated plain-English report with actionable recommendations.

## Features

- **Performance audit** — load speed, Core Web Vitals via Google PageSpeed Insights
- **SEO audit** — meta tags, headings, alt text, HTTPS, mobile viewport
- **Design/UX audit** — CTA visibility, phone number, trust signals
- **AI report** — plain-English summary and prioritised recommendations powered by Claude
- **PDF export** — downloadable report to share with a developer *(coming soon)*

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python + FastAPI |
| Frontend | React + Tailwind CSS |
| Scraping | BeautifulSoup4 + httpx |
| Performance data | Google PageSpeed Insights API |
| AI | Anthropic Claude API |
| Database | SQLite (dev) / PostgreSQL (prod) |

---

## Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org) v18 or higher — check with `node --version`
- [Python](https://python.org) v3.10 or higher — check with `python --version`
- [Git](https://git-scm.com)

### 1. Clone the repo

```bash
git clone https://github.com/Mikealsky/website-auditor.git
cd website-auditor
```

### 2. Set up your environment variables

Create a `.env` file inside the `backend/` folder (not the root folder):

```bash
# On Windows, right-click the backend folder in VSCode and click New File
# Name it .env
```

Add the following to `backend/.env`:

```
ANTHROPIC_API_KEY=your_anthropic_key_here
PAGESPEED_API_KEY=your_google_pagespeed_key_here
DATABASE_URL=sqlite:///./auditor.db
```

**Getting your API keys:**
- Anthropic key: [console.anthropic.com](https://console.anthropic.com) → API Keys → Create Key
- PageSpeed key: [console.cloud.google.com](https://console.cloud.google.com) → Enable PageSpeed Insights API → Credentials → Create API Key

> ⚠️ Never commit your `.env` file to Git. It is already blocked by `.gitignore`.

---

## Running the Project

You need **two terminals open at the same time** — one for the backend and one for the frontend.

### Terminal 1 — Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Backend will be running at `http://localhost:8000`  
Interactive API docs available at `http://localhost:8000/docs`

> **Note for Windows users:** Use `python -m uvicorn` instead of just `uvicorn` if you get a command not found error.

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be running at `http://localhost:5173`

> You only need to run `pip install` and `npm install` once per machine. After that just run the server commands.

---

## Every Time You Open the Project

1. Open VSCode with the `website-auditor` folder
2. Open two terminals using the **+** button in the terminal panel
3. Run the backend in Terminal 1
4. Run the frontend in Terminal 2
5. Go to `http://localhost:5173` in your browser

Both servers stop when you close VSCode. This is normal for local development.

---

## Working Across Multiple Computers

This project uses Git to sync between machines. Before starting work on any computer always run:

```bash
git pull
```

After finishing work:

```bash
git add .
git commit -m "describe what you changed"
git push
```

> ⚠️ Your `.env` file will NOT sync through Git (this is intentional). You need to manually create a `backend/.env` file on each computer and add your API keys.

---

## API

### `POST /api/audit`

**Request:**
```json
{
  "url": "https://example.com",
  "business_name": "Example Business"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "performance": { "performance_score": 42, "load_time_seconds": "7.2 s" },
    "seo": { "has_title": true, "images_missing_alt": 3 },
    "ai_report": { "summary": "Your website is losing customers before..." }
  }
}
```

---

## Milestones

- [x] M1: FastAPI setup + /audit endpoint
- [x] M2: PageSpeed API integration
- [x] M3: BeautifulSoup SEO scraper
- [x] M4: Claude AI report generation
- [x] M5: React frontend dashboard
- [ ] M6: PDF export
- [ ] M7: User auth + saved audits
- [ ] M8: Deploy live

---

## Troubleshooting

**`uvicorn` command not found**  
Use `python -m uvicorn main:app --reload` instead.

**PowerShell script execution error**  
Run: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

**AI report shows "credit balance too low"**  
Add credits at [console.anthropic.com](https://console.anthropic.com) → Plans & Billing. $5 is enough for a portfolio project.

**PageSpeed returns mock data**  
Make sure your `PAGESPEED_API_KEY` is in `backend/.env` (not the root `.env.example`) and restart the backend server.

**Both servers need to be running**  
If the frontend loads but audits don't work, make sure your backend is also running in a separate terminal.

---

## License

MIT