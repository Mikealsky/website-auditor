import { useState, useEffect } from 'react'

export default function HistoryPage({ getToken, onViewAudit, onClose }) {
  const [records, setRecords] = useState(null) // null = loading
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const token = await getToken()
        const res = await fetch('/api/audits', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Could not load history.')
        const json = await res.json()
        if (!cancelled) setRecords(json.data)
      } catch (e) {
        if (!cancelled) setError(e.message)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const handleOpen = async (id) => {
    try {
      const token = await getToken()
      const res = await fetch(`/api/audits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Could not load audit.')
      const json = await res.json()
      onViewAudit(json.data)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="wa-card" style={{ padding: 24, marginTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>Past audits</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--muted)', lineHeight: 1 }}>×</button>
      </div>

      {error && <p style={{ fontSize: 13, color: 'var(--red)' }}>{error}</p>}

      {records === null && !error && (
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>Loading…</p>
      )}

      {records?.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>No audits saved yet. Run your first audit above.</p>
      )}

      {records?.map((r) => (
        <button
          key={r.id}
          onClick={() => handleOpen(r.id)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', padding: '10px 0', borderBottom: '1px solid var(--line-2)', cursor: 'pointer', textAlign: 'left', gap: 12 }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r.business_name}
            </div>
            <div className="wa-mono" style={{ fontSize: 12, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r.url.replace(/^https?:\/\//, '')}
            </div>
          </div>
          <span style={{ fontSize: 12, color: 'var(--muted-2)', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {r.created_at ? new Date(r.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }) : '—'}
          </span>
        </button>
      ))}
    </div>
  )
}
