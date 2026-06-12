export function buildFixGuide(data) {
  const perf = data?.performance || {}
  const seo = data?.seo || {}

  const perfScore = perf.performance_score ?? 50
  const seoScore = perf.seo_score ?? 60
  const a11yScore = perf.accessibility_score ?? 70
  const loadTime = perf.load_time_seconds ?? '?'
  const missingAlt = seo.images_missing_alt ?? 0
  const hasDesc = seo.has_meta_description?.present ?? false

  const GUIDE = {
    speed: {
      key: 'speed',
      category: 'Performance',
      catColor: 'var(--coral)',
      title: 'Speed up your homepage',
      difficulty: perfScore < 50 ? 'Medium' : 'Easy',
      time: '1–2 hours',
      impactPct: perfScore,
      targetPct: Math.min(95, perfScore + 42),
      metricLabel: 'Load time',
      metricFrom: `${loadTime}`,
      metricTo: '~1.8 s',
      problem: `Your homepage takes ${loadTime} to load on mobile. Most visitors won't wait — they leave before they see what you offer.`,
      why: 'More than half of visitors leave a page that takes over 3 seconds to load. A faster site means more people reach your content and take action.',
      steps: [
        { h: 'Shrink your photos before uploading', b: "Run each image through a free tool like Squoosh or TinyPNG and save it as WebP — the modern format that's 60–80% smaller with no visible quality loss." },
        { h: 'Turn on lazy loading', b: 'Let images further down the page load only as visitors scroll to them, so the first screen appears almost instantly.' },
        { h: 'Switch on caching and a CDN', b: 'A content delivery network (like Cloudflare) stores your site close to your customers and remembers files between visits, so repeat loads are near-instant.' },
      ],
      code: {
        lang: 'html',
        caption: 'Modern image — WebP, lazy-loaded, sized to prevent layout shift',
        body: `<img\n  src="hero.webp"\n  width="1200" height="800"\n  loading="lazy" decoding="async"\n  alt="Describe the image here" />`,
      },
      dev: 'Serve WebP/AVIF with a <picture> fallback, set Cache-Control: max-age headers, and preload the LCP image. Aim for an LCP under 2.5 s.',
    },

    seo: {
      key: 'seo',
      category: 'SEO',
      catColor: 'var(--amber)',
      title: 'Help Google find your business',
      difficulty: 'Easy',
      time: '15 minutes',
      impactPct: seoScore,
      targetPct: Math.min(95, seoScore + 25),
      metricLabel: 'Search snippet',
      metricFrom: hasDesc ? 'Partial' : 'Blank',
      metricTo: 'Rich result',
      problem: !hasDesc
        ? 'Your page has no meta description, so the summary line under your name in Google search results shows up empty or random.'
        : `${missingAlt > 0 ? `${missingAlt} images have no alt text, which Google can't read. ` : ''}Adding structured data will help Google show your business details directly in search results.`,
      why: 'A clear description is your free ad on Google. Pages with good SEO get more clicks and appear higher in local search results — without paying for ads.',
      steps: [
        { h: 'Write a 150-character summary', b: 'Include what you do, where you are, and a reason to click — e.g. your hours or "book online".' },
        { h: 'Add it to your page', b: 'Drop a meta description tag into your homepage. Most site builders have an "SEO description" box for exactly this.' },
        { h: 'Tell Google you\'re a local business', b: 'Add LocalBusiness structured data so Google can show your hours, rating and address right in the search result.' },
      ],
      code: {
        lang: 'html',
        caption: 'Meta description + LocalBusiness structured data (JSON-LD)',
        body: `<meta name="description"\n  content="Your business in Your City.\n  Open Mon–Fri — book online." />\n\n<script type="application/ld+json">\n{ "@type": "LocalBusiness",\n  "name": "Your Business Name",\n  "telephone": "+61 3 0000 0000",\n  "openingHours": "Mo-Fr 09:00-17:00" }\n</scr` + `ipt>`,
      },
      dev: "Keep descriptions unique per page (≤160 chars). Validate JSON-LD in Google's Rich Results Test and submit an updated sitemap.xml.",
    },

    a11y: {
      key: 'a11y',
      category: 'Accessibility',
      catColor: 'var(--green)',
      title: 'Make your site work for everyone',
      difficulty: 'Easy',
      time: '20 minutes',
      impactPct: a11yScore,
      targetPct: Math.min(97, a11yScore + 18),
      metricLabel: 'Accessibility score',
      metricFrom: `${a11yScore}/100`,
      metricTo: `${Math.min(97, a11yScore + 18)}/100`,
      problem: missingAlt > 0
        ? `${missingAlt} of your photos have no alt text — the short description screen readers read aloud and Google uses to understand your images.`
        : 'Some elements on your page are hard to read or navigate for visitors with low vision or who use keyboard navigation.',
      why: 'Accessible sites reach more customers and rank better in Google. Visitors with low vision, older customers, and mobile users all benefit.',
      steps: [
        { h: "Describe what's in each photo", b: 'Write a short, specific description — "Flat white next to carrot cake on a wooden table", not "image1".' },
        { h: 'Check your text contrast', b: 'Make sure text is dark enough to read against its background. WebAIM Contrast Checker confirms this in seconds for free.' },
        { h: 'Make buttons keyboard-navigable', b: "Visitors who can't use a mouse rely on the Tab key. Check that every button and link is reachable and clearly labelled." },
      ],
      code: {
        lang: 'html',
        caption: 'Meaningful alt text vs. a decorative image',
        body: `<!-- Meaningful image -->\n<img src="product.webp"\n  alt="Flat white with leaf art on a wooden table" />\n\n<!-- Decorative (screen readers skip it) -->\n<img src="divider.svg" alt="" role="presentation" />`,
      },
      dev: 'Run axe DevTools or Lighthouse to surface remaining a11y issues. Target WCAG AA. Check colour contrast, focus indicators, and ARIA labels.',
    },
  }

  return { GUIDE, ORDER: ['speed', 'seo', 'a11y'] }
}
