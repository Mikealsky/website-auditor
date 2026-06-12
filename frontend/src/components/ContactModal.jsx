import { useState } from 'react'

export default function ContactModal({ fixTitle, businessName, onClose, open }) {
  if (!open && open !== undefined) return null
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    // Fall back to mailto since we don't have a contact endpoint yet
    const topic = fixTitle || `improving the website for ${businessName || 'my business'}`
    const subject = encodeURIComponent(`Website fix request: ${topic}`)
    const body = encodeURIComponent(`Hi,\n\nI'd like help with: ${topic}\nBusiness: ${businessName || 'N/A'}\n\nNote: ${note}\n\nName: ${name}\nEmail: ${email}`)
    window.location.href = `mailto:hello@websiteauditor.app?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Request fix help"
      style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)', padding: 20 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="wa-card" style={{ width: '100%', maxWidth: 480, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>Have us fix it</h2>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>Tell us what you need and we'll be in touch within one business day.</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 20, lineHeight: 1, padding: 4, marginTop: -4 }} aria-label="Close">✕</button>
        </div>

        <div style={{ background: 'var(--coral-tint-1)', border: '1px solid var(--coral-tint-3)', borderRadius: 'var(--r-md)', padding: '10px 14px', fontSize: 13.5, fontWeight: 600, color: 'var(--coral-700)' }}>
          {fixTitle ? `Fix: ${fixTitle}` : `Improve website${businessName ? ` for ${businessName}` : ''}`}
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>✓</div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Email client opened</div>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>Send the pre-filled email to get in touch.</p>
            <button onClick={onClose} className="wa-btn wa-btn-coral" style={{ marginTop: 18 }}>Done</button>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>
                Your name
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" className="wa-input" />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>
                Email
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" className="wa-input" />
              </label>
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>
              Anything else we should know? <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(optional)</span>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="e.g. we're on WordPress, or I've already tried..." className="wa-input" style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: 14 }} />
            </label>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
              <button type="button" onClick={onClose} className="wa-btn wa-btn-sm">Cancel</button>
              <button type="submit" className="wa-btn wa-btn-coral">Send request →</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
