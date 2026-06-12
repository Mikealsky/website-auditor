import { useState } from 'react'
import WADonut from '../components/WADonut'
import { deriveChecks, deriveFixes, scoreBand } from '../utils/audit'

function CheckList({ items }) {
  return (
    <>
      {items.map((c, i) => {
        const ico = c.state === 'pass' ? 'wa-ico-pass' : c.state === 'warn' ? 'wa-ico-warn' : 'wa-ico-fail'
        const g = c.state === 'pass' ? '✓' : c.state === 'warn' ? '!' : '✗'
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '11px 0', borderBottom: i < items.length - 1 ? '1px solid var(--line-2)' : 'none' }}>
            <span className={'wa-ico ' + ico}>{g}</span>
            <span style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.4, paddingTop: 2 }}>
              <b>{c.label}</b> <span style={{ color: 'var(--muted)' }}>— {c.detail}</span>
            </span>
          </div>
        )
      })}
    </>
  )
}

export default function ResultsPage({ data, businessName, onReset }) {
  const [downloading, setDownloading] = useState(false)
  const [downloadErr, setDownloadErr] = useState(null)

  const { performance: perf, seo, ai_report } = data
  const checks = deriveChecks(seo)
  const fixes = (ai_report.recommendations?.length > 0)
    ? ai_report.recommendations.map((r, i) => ({ ...r, n: i + 1 }))
    : deriveFixes(data)
  const high = fixes.filter((f) => f.priority === 'High')
  const rest = fixes.filter((f) => f.priority !== 'High')
  const host = data.url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const today = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })

  const scores = [
    { pct: perf.performance_score, l: 'Performance' },
    { pct: perf.seo_score, l: 'SEO' },
    { pct: perf.accessibility_score, l: 'Accessibility' },
  ].map((s) => ({ ...s, ...scoreBand(s.pct) }))

  const worst = Math.min(...scores.map((s) => s.pct))
  const overall = worst < 50 ? 'Needs work' : worst < 70 ? 'Almost there' : 'Looking good'
  const counts = checks.reduce((a, c) => (a[c.state]++, a), { pass: 0, warn: 0, fail: 0 })

  const handleDownload = async () => {
    setDownloading(true)
    setDownloadErr(null)
    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: data.url, business_name: businessName, performance: perf, seo, ai_report }),
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.detail || 'PDF generation failed.')
      }
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = `audit-report.pdf`
      a.click()
      URL.revokeObjectURL(objectUrl)
    } catch (err) {
      setDownloadErr(err.message || 'Download failed.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <main className="wa" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* black header band */}
        <div style={{ background: 'var(--ink)', color: '#fff', borderRadius: 'var(--r-xl)', padding: 'clamp(22px,2.6vw,30px) clamp(22px,3vw,34px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, gap: 14, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', color: 'var(--ink)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 16 }}>W</div>
              <span style={{ fontWeight: 800, fontSize: 15 }}>Website Auditor</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="wa-mono" style={{ fontSize: 13, color: 'rgba(255,255,255,.58)', marginRight: 4 }}>Audit · {today}</span>
              <button onClick={handleDownload} disabled={downloading} className="wa-btn wa-btn-sm" style={{ background: 'rgba(255,255,255,.1)', color: '#fff' }}>
                {downloading ? 'Generating…' : <><span aria-hidden="true">⬇ </span>Download</>}
              </button>
              <button onClick={onReset} className="wa-btn wa-btn-sm" style={{ background: '#fff', color: 'var(--ink)' }}>
                ← Home
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 30, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, flex: '1 1 280px', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span className="wa-chip" style={{ background: 'rgba(226,96,63,.18)', color: 'var(--coral-tint-3)' }}>● {overall}</span>
                <span className="wa-mono" style={{ fontSize: 14, color: 'rgba(255,255,255,.5)' }}>{host}</span>
              </div>
              <h1 style={{ fontSize: 'clamp(32px,3.6vw,46px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.04, overflowWrap: 'break-word', maxWidth: '100%' }}>
                {businessName}
              </h1>
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', flex: '0 0 auto', maxWidth: '100%' }}>
              {scores.map((s, i) => (
                <div key={i} style={{ flex: '1 1 100px', minWidth: 100, maxWidth: 165, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 'var(--r-md)', padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.pct}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,.48)' }}>/100</span>
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 10 }}>{s.l}</div>
                  <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,.14)', marginTop: 8 }}>
                    <div style={{ width: s.pct + '%', height: '100%', borderRadius: 99, background: s.c }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {downloadErr && (
          <div className="wa-card" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--red-soft)', border: '1px solid var(--coral-tint-3)' }}>
            <span className="wa-ico wa-ico-fail" style={{ width: 22, height: 22, fontSize: 12 }}>!</span>
            <span style={{ fontSize: 13.5, color: 'var(--red)' }}>Couldn't generate the PDF: {downloadErr}</span>
          </div>
        )}

        {/* body grid */}
        <div className="wa-resc-grid" style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: 18, alignItems: 'start' }}>

          {/* left — fix list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', padding: '2px 4px' }}>Fix these first</h2>

            {high.length === 0 && (
              <div className="wa-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
                <span className="wa-ico wa-ico-pass" style={{ width: 34, height: 34, fontSize: 17 }}>✓</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17 }}>No urgent issues — nice work!</div>
                  <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 3 }}>Your site clears the big checks. The smaller tweaks below will sharpen it further.</p>
                </div>
              </div>
            )}

            {high.map((f) => (
              <div key={f.n} className="wa-card" style={{ padding: 22, display: 'flex', gap: 18, alignItems: 'center', background: 'var(--coral-tint-1)', border: '1.5px solid var(--coral-tint-3)' }}>
                <div style={{ flex: 'none', width: 44, height: 44, borderRadius: '50%', background: 'var(--coral-tint-1)', color: 'var(--coral-700)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 19 }}>{f.n}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>{f.title}</div>
                  <p style={{ fontSize: 14.5, color: 'var(--muted)', marginTop: 4, lineHeight: 1.45 }}>{f.body}</p>
                </div>
                <span className="wa-chip wa-chip-red" style={{ flex: 'none' }}>High impact</span>
              </div>
            ))}

            {rest.length > 0 && (
              <div className="wa-card" style={{ padding: '10px 24px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', padding: '12px 0 4px', letterSpacing: '.04em' }}>THEN, WHEN YOU CAN</div>
                {rest.map((f) => (
                  <div key={f.n} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '13px 0', borderTop: '1px solid var(--line-2)' }}>
                    <div style={{ flex: 'none', width: 28, height: 28, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 13 }}>{f.n}</div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{f.title}</span>
                      <p style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 2 }}>{f.body}</p>
                    </div>
                    <span className={'wa-chip ' + (f.priority === 'Medium' ? 'wa-chip-amber' : 'wa-chip-green')} style={{ flex: 'none' }}>{f.priority}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* right — vitals + AI + health */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="wa-card" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 20 }}>
              <div>
                <div className={'wa-chip ' + (parseFloat(perf.load_time_seconds) > 4 ? 'wa-chip-red' : 'wa-chip-green')} style={{ marginBottom: 8 }}>
                  {parseFloat(perf.load_time_seconds) > 4 ? 'Too slow' : 'Good'}
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>Loads in</div>
                <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{perf.load_time_seconds}</div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['First paint', perf.first_contentful_paint], ['Largest', perf.largest_contentful_paint], ['Layout shift', perf.cumulative_layout_shift]].map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: i < 2 ? '1px solid var(--line-2)' : 'none' }}>
                    <span style={{ color: 'var(--muted)' }}>{m[0]}</span>
                    <span className="wa-mono" style={{ fontWeight: 700 }}>{m[1]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="wa-card" style={{ padding: 22, background: 'var(--ink)', color: '#fff' }}>
              <div className="wa-eyebrow" style={{ color: 'var(--coral-tint-3)', marginBottom: 10 }}>In plain English</div>
              {ai_report.error ? (
                <p style={{ fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,.45)', fontStyle: 'italic' }}>
                  AI summary unavailable — check your API key and credits.
                </p>
              ) : (
                <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'rgba(255,255,255,.85)' }}>{ai_report.summary}</p>
              )}
            </div>

            <div className="wa-card" style={{ padding: '16px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800 }}>Health check</h3>
                <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                  <b style={{ color: 'var(--green-dark)' }}>{counts.pass}</b> · <b style={{ color: 'var(--amber-dark)' }}>{counts.warn}</b> · <b style={{ color: 'var(--red-dark)' }}>{counts.fail}</b>
                </span>
              </div>
              <CheckList items={checks} />
            </div>
          </div>
        </div>

        {/* CTA footer */}
        <div style={{ background: 'linear-gradient(110deg, var(--coral) 0%, var(--coral-600) 100%)', color: '#fff', borderRadius: 'var(--r-xl)', padding: 'clamp(22px,2.6vw,26px) clamp(24px,3vw,34px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: 'clamp(20px,2.4vw,26px)', fontWeight: 800, letterSpacing: '-0.02em' }}>Want help fixing this?</h3>
            <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,.85)', marginTop: 6 }}>Run another audit or download your full PDF report to share with a developer.</p>
          </div>
          <button onClick={onReset} className="wa-btn" style={{ flex: 'none', background: '#fff', color: 'var(--coral-700)', padding: '16px 28px', fontSize: 16 }}>
            Audit another site →
          </button>
        </div>

      </div>
    </main>
  )
}
