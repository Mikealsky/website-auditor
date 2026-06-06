import { useState } from 'react'
import WADonut from '../components/WADonut'

const EXAMPLES = [
  { host: 'copperkettlecafe.com', label: 'Copper Kettle Café', tag: 'Restaurant' },
  { host: 'bellahairstudio.com', label: 'Bella Hair Studio', tag: 'Salon' },
  { host: 'profixplumbing.com', label: 'Pro-Fix Plumbing', tag: 'Trades' },
]

export default function HomePage({ onSubmit, error }) {
  const [url, setUrl] = useState('')

  const submit = (e) => {
    e && e.preventDefault()
    const v = url.trim()
    if (!v) return
    const full = v.startsWith('http') ? v : 'https://' + v
    onSubmit({ url: full, businessName: 'this business' })
  }

  const tryExample = (host) => {
    setUrl(host)
    onSubmit({ url: 'https://' + host, businessName: 'this business' })
  }

  return (
    <main className="wa" style={{ minHeight: '100vh', background: 'var(--bg)', padding: 22, display: 'flex' }}>
      <div className="wa-panel" style={{ flex: 1, padding: 'clamp(20px, 3vw, 34px)', display: 'flex', flexDirection: 'column', gap: 30 }}>

        {/* header */}
        <header style={{ background: 'var(--ink)', color: '#fff', borderRadius: 'var(--r-lg)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', color: 'var(--ink)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 16 }}>W</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.1 }}>Website Auditor</div>
              <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 12 }}>Free local-business check-up</div>
            </div>
          </div>
          <span className="wa-chip" style={{ background: 'rgba(226,96,63,.2)', color: 'var(--coral-tint-3)', fontSize: 11 }}>Free</span>
        </header>

        {/* hero grid */}
        <div className="wa-landing-grid" style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.12fr 1fr', gap: 30, alignItems: 'center', minHeight: 0 }}>

          {/* left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingLeft: 6, maxWidth: 600 }}>
            <span className="wa-eyebrow">Free website check-up</span>
            <h1 style={{ fontSize: 'clamp(34px, 4.4vw, 54px)', lineHeight: 1.04, fontWeight: 800, letterSpacing: '-0.03em' }}>
              See what&rsquo;s quietly costing you customers.
            </h1>
            <p style={{ fontSize: 18, color: 'var(--ink-2)', lineHeight: 1.5, maxWidth: 480 }}>
              Pop in your website address and we&rsquo;ll check its speed, search ranking and design&mdash;then hand you a plain-English to-do list to win more local business.
            </p>

            {/* Mobile score preview — hidden on desktop via CSS */}
            <div className="wa-score-strip" aria-hidden="true">
              <div className="wa-score-strip-item">
                <span className="wa-mono" style={{ fontWeight: 800, fontSize: 22, color: 'var(--coral)', lineHeight: 1 }}>42</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>Performance</span>
              </div>
              <div className="wa-score-strip-item">
                <span className="wa-mono" style={{ fontWeight: 800, fontSize: 22, color: 'var(--amber)', lineHeight: 1 }}>61</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>SEO</span>
              </div>
              <div className="wa-score-strip-item">
                <span className="wa-mono" style={{ fontWeight: 800, fontSize: 22, color: 'var(--green)', lineHeight: 1 }}>78</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>Accessibility</span>
              </div>
            </div>

            {error && (
              <div style={{ background: 'var(--red-soft)', border: '1px solid var(--coral-tint-3)', borderRadius: 'var(--r-md)', padding: '12px 16px', fontSize: 14, color: 'var(--red)' }}>
                {error}
              </div>
            )}

            <form onSubmit={submit} className="wa-card" style={{ padding: 18, marginTop: 2 }}>
              <label htmlFor="url-input" style={{ display: 'block', marginBottom: 10, paddingLeft: 4, fontSize: 14, fontWeight: 600, color: 'var(--ink-2)', letterSpacing: 0 }}>Your website address</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card-2)', border: '1px solid var(--line)', borderRadius: 999, padding: '13px 18px' }}>
                  <span aria-hidden="true" style={{ color: 'var(--muted-2)', fontSize: 17 }}>🔗</span>
                  <input
                    id="url-input"
                    type="url"
                    autoComplete="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="yourbusiness.com"
                    className="wa-mono"
                    style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: 'var(--ink)', fontFamily: 'inherit' }}
                  />
                </div>
                <button type="submit" className="wa-btn wa-btn-coral" style={{ flex: 'none' }}>
                  Run my free audit →
                </button>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 12, paddingLeft: 4 }}>
                Takes about 30 seconds &middot; No sign-up &middot; Nothing to install
              </p>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Or try an example:</span>
              {EXAMPLES.map((ex) => (
                <button key={ex.host} onClick={() => tryExample(ex.host)} className="wa-pill" style={{ gap: 7 }}>
                  {ex.label} <span className="wa-mono" style={{ fontSize: 11, color: 'var(--muted-2)' }}>{ex.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* right preview */}
          <div className="wa-landing-preview" style={{ display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
            <div className="wa-card" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 20 }}>
              <WADonut pct={42} color="var(--coral)" size={96} label="42" />
              <div>
                <div className="wa-chip wa-chip-red" style={{ marginBottom: 8 }}>Needs work</div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>Performance</div>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4, maxWidth: 230 }}>
                  Slow pages quietly send customers to your competitors.
                </p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="wa-card" style={{ padding: 20 }}>
                <WADonut pct={61} color="var(--amber)" size={64} label="61" />
                <div style={{ fontWeight: 800, fontSize: 16, marginTop: 14 }}>SEO</div>
                <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 3 }}>How easily Google finds you.</p>
              </div>
              <div className="wa-card" style={{ padding: 20 }}>
                <WADonut pct={78} color="var(--green)" size={64} label="78" />
                <div style={{ fontWeight: 800, fontSize: 16, marginTop: 14 }}>Accessibility</div>
                <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 3 }}>Works for every visitor.</p>
              </div>
            </div>
            <div className="wa-card" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 14, background: 'var(--ink)', color: '#fff' }}>
              <span aria-hidden="true" style={{ fontSize: 22 }}>📋</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>Your step-by-step fix list</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>Prioritised, plain-English, no jargon</div>
              </div>
              <span style={{ marginLeft: 'auto', color: 'var(--coral-tint-3)', fontSize: 22 }}>→</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
