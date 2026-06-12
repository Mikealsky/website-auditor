import { useState } from 'react'
import WADonut from '../components/WADonut'
import { deriveChecks, deriveFixes, scoreBand } from '../utils/audit'

// ─── constants ────────────────────────────────────────────────────────────────
// Set your Calendly / Cal.com link here and every "Book a call" button updates.
const BOOKING_URL = 'https://calendly.com/your-handle/15min'

// ─── helpers ─────────────────────────────────────────────────────────────────

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

function LockOverlay({ title, sub, onUnlock }) {
  return (
    <div style={{ position: 'absolute', inset: 0, borderRadius: 'var(--r-lg)', background: 'linear-gradient(180deg, rgba(244,242,238,.55) 0%, rgba(244,242,238,.96) 62%)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center', padding: 28, gap: 12 }}>
      <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 22 }}>🔒</div>
      <h3 style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.02em', maxWidth: 360, textWrap: 'balance' }}>{title}</h3>
      <p style={{ fontSize: 14.5, color: 'var(--muted)', maxWidth: 380, lineHeight: 1.5 }}>{sub}</p>
      <button onClick={onUnlock} className="wa-btn wa-btn-coral" style={{ marginTop: 6, padding: '14px 26px', fontSize: 15, whiteSpace: 'nowrap' }}>
        Create free account to unlock →
      </button>
      <span style={{ fontSize: 12.5, color: 'var(--muted-2)' }}>Free forever · No credit card</span>
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function ResultsPage({ data, businessName, onReset, onViewPlan, onHome, onUnlock, unlocked }) {
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
    if (!unlocked) { onUnlock(); return }
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
      if (err?.name === 'TypeError' || /failed to fetch/i.test(err?.message || '')) {
        window.print()
      } else {
        setDownloadErr(err.message || 'Download failed.')
      }
    } finally {
      setDownloading(false)
    }
  }

  const handleBook = () => window.open(BOOKING_URL, '_blank', 'noopener')

  return (
    <main className="wa" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* black header band */}
        <div style={{ background: 'var(--ink)', color: '#fff', borderRadius: 'var(--r-xl)', padding: 'clamp(22px,2.6vw,30px) clamp(22px,3vw,34px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={onHome}
              title="Back to home"
              style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
            >
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', color: 'var(--ink)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 16 }}>W</div>
              <span style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>Website Auditor</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span className="wa-mono" style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginRight: 4 }}>Audit · {today}</span>
              <button onClick={onHome} className="wa-btn wa-btn-sm" style={{ background: 'rgba(255,255,255,.1)', color: '#fff' }}>← Home</button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="wa-btn wa-btn-sm"
                style={{ background: 'rgba(255,255,255,.1)', color: '#fff', opacity: downloading ? 0.65 : 1 }}
              >
                {unlocked ? (downloading ? 'Generating…' : '⬇ Download') : '🔒 Download'}
              </button>
              <button onClick={onReset} className="wa-btn wa-btn-sm" style={{ background: '#fff', color: 'var(--ink)' }}>New audit</button>
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

        {/* free teaser banner when locked */}
        {!unlocked && (
          <div className="wa-card" style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>This is your free preview</div>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 2 }}>
                We found <b style={{ color: 'var(--ink)' }}>{fixes.length} {fixes.length === 1 ? 'thing' : 'things'}</b> to improve. Create a free account to see exactly how to fix them.
              </p>
            </div>
            <button onClick={onUnlock} className="wa-btn wa-btn-coral" style={{ flex: 'none', whiteSpace: 'nowrap' }}>Unlock my full plan →</button>
          </div>
        )}

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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 4px' }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>Fix these first</h2>
              {!unlocked && <span className="wa-chip wa-chip-dark">Locked</span>}
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {high.length === 0 && unlocked && (
                  <div className="wa-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span className="wa-ico wa-ico-pass" style={{ width: 34, height: 34, fontSize: 17 }}>✓</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 17 }}>No urgent issues — nice work!</div>
                      <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 3 }}>Your site clears the big checks. The smaller tweaks below will sharpen it further.</p>
                    </div>
                  </div>
                )}

                {/* first high-priority fix always visible as a teaser */}
                {(unlocked ? high : (high.length ? high.slice(0, 1) : fixes.slice(0, 1))).map((f) => (
                  <div key={f.n} className="wa-card" style={{ padding: 22, display: 'flex', gap: 18, alignItems: 'center', background: unlocked ? 'var(--coral-tint-1)' : undefined, border: unlocked ? '1.5px solid var(--coral-tint-3)' : undefined }}>
                    <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '50%', background: 'var(--coral-tint-1)', color: 'var(--coral-700)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 19 }}>{f.n}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>{f.title}</div>
                      <p style={{ fontSize: 14.5, color: 'var(--muted)', marginTop: 4, lineHeight: 1.45 }}>{f.body}</p>
                    </div>
                    <span className="wa-chip wa-chip-red" style={{ flexShrink: 0 }}>High impact</span>
                  </div>
                ))}

                {unlocked && rest.length > 0 && (
                  <div className="wa-card" style={{ padding: '10px 24px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', padding: '12px 0 4px', letterSpacing: '.04em' }}>THEN, WHEN YOU CAN</div>
                    {rest.map((f) => (
                      <div key={f.n} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '13px 0', borderTop: '1px solid var(--line-2)' }}>
                        <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 13 }}>{f.n}</div>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 700, fontSize: 15 }}>{f.title}</span>
                          <p style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 2 }}>{f.body}</p>
                        </div>
                        <span className={'wa-chip ' + (f.priority === 'Medium' ? 'wa-chip-amber' : 'wa-chip-green')} style={{ flexShrink: 0 }}>{f.priority}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* ghost rows for blur effect when locked */}
                {!unlocked && fixes.slice(1, 4).map((f) => (
                  <div key={f.n} className="wa-card" style={{ padding: 22, display: 'flex', gap: 18, alignItems: 'center' }}>
                    <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '50%', background: 'var(--line)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>{f.title}</div>
                      <p style={{ fontSize: 14.5, color: 'var(--muted)', marginTop: 4 }}>{f.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {!unlocked && (
                <LockOverlay
                  title={`See how to fix all ${fixes.length} issues`}
                  sub="Create a free account to unlock your full step-by-step fix list — in plain English, with the technical detail for your developer."
                  onUnlock={onUnlock}
                />
              )}
            </div>

            {unlocked && onViewPlan && (
              <button onClick={onViewPlan} className="wa-btn" style={{ alignSelf: 'flex-start', padding: '14px 22px', background: 'var(--ink)', color: '#fff' }}>
                Open my step-by-step plan →
              </button>
            )}
          </div>

          {/* right — always-visible metrics + gated health check */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* load time */}
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

            {/* AI summary — always visible */}
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

            {/* health check — gated */}
            <div style={{ position: 'relative' }}>
              <div className="wa-card" style={{ padding: '16px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800 }}>Health check</h3>
                  <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                    <b style={{ color: 'var(--green-dark)' }}>{counts.pass}</b> · <b style={{ color: 'var(--amber-dark)' }}>{counts.warn}</b> · <b style={{ color: 'var(--red-dark)' }}>{counts.fail}</b>
                  </span>
                </div>
                <CheckList items={unlocked ? checks : checks.slice(0, 5)} />
              </div>
              {!unlocked && (
                <LockOverlay
                  title="Your full health check"
                  sub="See every check we ran and exactly what each one means for your business."
                  onUnlock={onUnlock}
                />
              )}
            </div>
          </div>
        </div>

        {/* CTA footer */}
        <div style={{ background: 'linear-gradient(110deg, var(--coral) 0%, var(--coral-600) 100%)', color: '#fff', borderRadius: 'var(--r-xl)', padding: 'clamp(22px,2.6vw,26px) clamp(24px,3vw,34px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: 'clamp(20px,2.4vw,26px)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {unlocked ? 'Rather have us do it for you?' : 'Unlock your full plan — it\'s free'}
            </h3>
            <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,.85)', marginTop: 6 }}>
              {unlocked
                ? "We'll handle every fix above and send you the before/after. Book a free 15-minute call."
                : 'Create a free account to see exactly how to fix every issue we found.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flexShrink: 0 }}>
            {unlocked ? (
              <>
                {onViewPlan && (
                  <button onClick={onViewPlan} className="wa-btn" style={{ background: 'rgba(255,255,255,.18)', color: '#fff', padding: '16px 24px', fontSize: 16, whiteSpace: 'nowrap' }}>
                    View improvement plan →
                  </button>
                )}
                <button onClick={handleBook} className="wa-btn" style={{ background: '#fff', color: 'var(--coral-700)', padding: '16px 28px', fontSize: 16, whiteSpace: 'nowrap' }}>
                  Book a free call →
                </button>
              </>
            ) : (
              <button onClick={onUnlock} className="wa-btn" style={{ background: '#fff', color: 'var(--coral-700)', padding: '16px 28px', fontSize: 16, whiteSpace: 'nowrap' }}>
                Create free account →
              </button>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}
