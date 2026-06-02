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

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/website-auditor.git
cd website-auditor
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Open .env and add your API keys
```

You'll need:
- `ANTHROPIC_API_KEY` — from [console.anthropic.com](https://console.anthropic.com)
- `PAGESPEED_API_KEY` — free from [Google Cloud Console](https://console.cloud.google.com)

### 3. Run the backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API will be running at `http://localhost:8000`
Docs available at `http://localhost:8000/docs`

### 4. Run the frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend will be running at `http://localhost:5173`

### 5. Run tests
```bash
cd backend
pytest tests/
```

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
    "performance": { "performance_score": 42, "load_time_seconds": "7.2 s", ... },
    "seo": { "has_title": true, "images_missing_alt": 3, ... },
    "ai_report": { "summary": "Your website is losing customers before...", ... }
  }
}
```

## Milestones

- [x] M1: FastAPI setup + /audit endpoint
- [x] M2: PageSpeed API integration
- [x] M3: BeautifulSoup SEO scraper
- [x] M4: Claude AI report generation
- [ ] M5: React frontend dashboard
- [ ] M6: PDF export
- [ ] M7: User auth + saved audits
- [ ] M8: Deploy live

## Contributing

This is a portfolio project — feel free to fork and build on it.

## License

MIT
