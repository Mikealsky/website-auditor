import { useState } from 'react'

const BENEFITS = [
  'Your full step-by-step fix list',
  'Exactly how to fix each issue (with code for your developer)',
  'Your complete website health check',
  'A downloadable PDF you can keep',
]

export default function AccountModal({ open, onClose, onSignIn, business, fixCount }) {
  const [working, setWorking] = useState(false)
  const [err, setErr] = useState('')

  if (!open) return null

  const handleSignIn = async () => {
    setWorking(true)
    setErr('')
    try {
      await onSignIn()
      // onClose is called by App.jsx once user state updates
    } catch (e) {
      setErr('Sign-in failed. Please try again.')
      setWorking(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Create account to unlock"
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(28,26,23,.55)', display: 'grid', placeItems: 'center', padding: 22 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="wa-card"
        style={{ width: 'min(860px, 100%)', maxHeight: '94vh', overflow: 'hidden', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr' }}
      >
        {/* left: value */}
        <div style={{ background: 'var(--ink)', color: '#fff', padding: '32px 30px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#fff', color: 'var(--ink)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 15 }}>W</div>
            <span style={{ fontWeight: 800, fontSize: 15 }}>Website Auditor</span>
          </div>
          <h2 style={{ fontSize: 27, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.12 }}>
            Unlock your full plan{business ? <> for <span style={{ color: 'var(--coral-tint-3)' }}>{business}</span></> : ''}
          </h2>
          <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,.7)', lineHeight: 1.5 }}>
            We found <b style={{ color: '#fff' }}>{fixCount} {fixCount === 1 ? 'thing' : 'things'}</b> to improve. Create a free account to see exactly how to fix every one.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 4 }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                <span className="wa-ico wa-ico-pass" style={{ width: 22, height: 22, fontSize: 11, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,.88)', lineHeight: 1.4 }}>{b}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'auto', fontSize: 12.5, color: 'rgba(255,255,255,.45)' }}>Free forever · No credit card</div>
        </div>

        {/* right: sign-in */}
        <div style={{ padding: '30px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflowY: 'auto' }}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ position: 'absolute', top: 18, right: 18, width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--muted)', cursor: 'pointer', fontSize: 14, display: 'grid', placeItems: 'center' }}
          >✕</button>

          <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>Create your free account</h3>
          <p style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.5 }}>
            Takes 10 seconds — then your full report is ready.
          </p>

          {err && (
            <div style={{ display: 'flex', gap: 9, alignItems: 'center', padding: '10px 13px', borderRadius: 'var(--r-sm)', background: 'var(--red-soft)', marginBottom: 16 }}>
              <span className="wa-ico wa-ico-fail" style={{ width: 20, height: 20, fontSize: 11, flexShrink: 0 }}>!</span>
              <span style={{ fontSize: 13, color: 'var(--red)' }}>{err}</span>
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={working}
            className="wa-btn"
            style={{ width: '100%', padding: '15px 20px', fontSize: 15, background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: working ? 0.65 : 1, cursor: working ? 'default' : 'pointer' }}
          >
            {!working && (
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {working ? 'Signing in…' : 'Continue with Google'}
          </button>

          <p style={{ marginTop: 20, fontSize: 11.5, color: 'var(--muted-2)', textAlign: 'center', lineHeight: 1.5 }}>
            By continuing you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
