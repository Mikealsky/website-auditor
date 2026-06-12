import { useState } from 'react'

const EXAMPLES = [
  { host: 'copperkettlecafe.com', label: 'Copper Kettle Café' },
  { host: 'bellahairstudio.com', label: 'Bella Hair Studio' },
  { host: 'profixplumbing.com', label: 'Pro-Fix Plumbing' },
]

export default function AuditPage({ onSubmit, onHome, error, initialUrl = '' }) {
  const [url, setUrl] = useState(initialUrl)

  const submit = (e) => {
    e && e.preventDefault()
    const v = url.trim()
    if (!v) return
    const full = v.startsWith('http') ? v : 'https://' + v
    const name = (() => { try { return new URL(full).hostname.replace(/^www\./, '') } catch { return full } })()
    onSubmit({ url: full, businessName: name })
  }

  const tryExample = (host, label) => {
    setUrl(host)
    onSubmit({ url: 'https://' + host, businessName: label })
  }

  return (
    <div className="wa" style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* slim nav */}
      <header style={{ maxWidth: 1180, width: '100%', margin: '0 auto', padding: '26px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onHome} style={{ display: 'flex', alignItems: 'center', gap: 11, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 17 }}>W</div>
          <span style={{ fontWeight: 800, fontSize: 17 }}>Website Auditor</span>
        </button>
        <button onClick={onHome} className="wa-pill" style={{ cursor: 'pointer' }}>← Back to home</button>
      </header>

      {/* centered form */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 22px 60px', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, maxWidth: 640, width: '100%' }}>
          <span className="wa-chip wa-chip-coral">Free website check-up</span>
          <h1 style={{ fontSize: 'clamp(34px,4.6vw,52px)', lineHeight: 1.05, fontWeight: 800, letterSpacing: '-0.03em', textWrap: 'balance' }}>
            Let's check your website
          </h1>
          <p style={{ fontSize: 18, color: 'var(--ink-2)', lineHeight: 1.5, maxWidth: 480 }}>
            Enter your website address below. We'll scan it in about 30 seconds and show you your scores — free, no sign-up needed.
          </p>

          {error && (
            <div style={{ background: 'var(--red-soft)', border: '1px solid var(--coral-tint-3)', borderRadius: 'var(--r-md)', padding: '12px 16px', fontSize: 14, color: 'var(--red)', width: '100%', maxWidth: 560, textAlign: 'left' }}>
              {error}
            </div>
          )}

          <form onSubmit={submit} className="wa-card" style={{ padding: 18, width: '100%', maxWidth: 560, marginTop: 6 }}>
            <label className="wa-eyebrow" style={{ display: 'block', marginBottom: 10, paddingLeft: 4, textAlign: 'left' }}>Your website address</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card-2)', border: '1px solid var(--line)', borderRadius: 999, padding: '14px 18px' }}>
                <span style={{ color: 'var(--muted-2)', fontSize: 17 }}>🔗</span>
                <input
                  type="url"
                  autoComplete="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="yourbusiness.com"
                  className="wa-mono"
                  style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: 'var(--ink)', fontFamily: 'inherit' }}
                />
              </div>
              <button type="submit" className="wa-btn wa-btn-coral" style={{ flex: 'none', whiteSpace: 'nowrap' }}>
                Run my free audit →
              </button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 12, paddingLeft: 4, textAlign: 'left' }}>
              Takes about 30 seconds · No sign-up · Nothing to install
            </p>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>Or try an example:</span>
            {EXAMPLES.map((ex) => (
              <button key={ex.host} onClick={() => tryExample(ex.host, ex.label)} className="wa-pill" style={{ cursor: 'pointer' }}>
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
