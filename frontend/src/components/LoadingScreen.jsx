import { useState, useEffect } from 'react'

const STEPS = [
  'Loading your homepage',
  'Measuring load speed',
  'Checking Google search tags',
  'Reviewing mobile & design',
  'Writing your plain-English report',
]

export default function LoadingScreen({ url }) {
  const [step, setStep] = useState(0)
  const [pct, setPct] = useState(6)

  const host = (() => {
    try { return new URL(url || '').hostname.replace(/^www\./, '') } catch { return url || '…' }
  })()

  useEffect(() => {
    const stepMs = 620
    const stepTimer = setInterval(() => {
      setStep((s) => (s >= STEPS.length - 1 ? s : s + 1))
    }, stepMs)
    const pctTimer = setInterval(() => {
      setPct((p) => Math.min(99, p + Math.random() * 7 + 2))
    }, 130)
    return () => { clearInterval(stepTimer); clearInterval(pctTimer) }
  }, [])

  return (
    <div className="wa" style={{ minHeight: '100vh', background: 'var(--bg)', padding: 22, display: 'flex' }}>
      <div className="wa-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30, position: 'relative', overflow: 'hidden' }}>

        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 720, height: 720, borderRadius: '50%', background: 'var(--coral-tint-1)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 480, height: 480, borderRadius: '50%', background: 'var(--coral-tint-2)', opacity: .45 }} />

        <div style={{ position: 'relative', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div
            className="wa-donut"
            style={{ width: 150, height: 150, background: `conic-gradient(var(--coral) ${pct * 3.6}deg, var(--card) 0)`, boxShadow: 'var(--shadow-md)', transition: 'background .2s linear' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: 34 }}>{Math.round(pct)}<span style={{ fontSize: 18, color: 'var(--muted)' }}>%</span></div>
              <div className="wa-eyebrow" style={{ fontSize: 9 }}>Scanning</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em' }}>Checking your website&#8230; ☕</h1>
            <p style={{ fontSize: 17, color: 'var(--ink-2)' }}>
              Auditing <span className="wa-mono" style={{ color: 'var(--coral-700)' }}>{host}</span> &mdash; hang tight, this is the slow part for visitors too.
            </p>
          </div>
        </div>

        <div className="wa-card" style={{ position: 'relative', width: 'min(540px, 92%)', padding: 14 }}>
          {STEPS.map((label, i) => {
            const done = i < step, active = i === step
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 14px', borderBottom: i < STEPS.length - 1 ? '1px solid var(--line-2)' : 'none', opacity: done || active ? 1 : 0.4, transition: 'opacity .3s' }}>
                <span className={'wa-ico ' + (done ? 'wa-ico-pass' : active ? 'wa-ico-warn' : '')} style={!done && !active ? { background: 'var(--line)', color: 'var(--muted-2)' } : {}}>
                  {done ? '✓' : active ? '●' : '•'}
                </span>
                <span style={{ fontSize: 15, fontWeight: active ? 700 : 600, color: done || active ? 'var(--ink)' : 'var(--muted)' }}>{label}</span>
                {active && <span className="wa-chip wa-chip-amber" style={{ marginLeft: 'auto' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />Working…</span>}
                {done && <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--muted)' }} className="wa-mono">done</span>}
              </div>
            )
          })}
        </div>

        <p style={{ position: 'relative', fontSize: 13, color: 'var(--muted)' }}>
          Usually finishes in under a minute &middot; You can keep this tab open
        </p>
      </div>
    </div>
  )
}
