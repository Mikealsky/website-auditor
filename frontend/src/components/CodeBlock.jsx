export default function CodeBlock({ body, caption, lang = 'html' }) {
  return (
    <div style={{ borderRadius: 'var(--r-md)', overflow: 'hidden', border: '1px solid rgba(255,255,255,.1)' }}>
      {caption && (
        <div style={{ background: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,.08)', padding: '9px 16px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.55)', letterSpacing: '.02em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{caption}</span>
          <span style={{ background: 'rgba(255,255,255,.07)', borderRadius: 4, padding: '2px 7px', fontSize: 11, fontFamily: 'var(--mono)', letterSpacing: '.04em', color: 'rgba(255,255,255,.4)' }}>{lang}</span>
        </div>
      )}
      <pre style={{ background: '#0f0f1a', margin: 0, padding: '16px 18px', overflowX: 'auto', fontSize: 13, lineHeight: 1.65, color: '#c9d1d9', fontFamily: 'var(--mono)' }}>
        <code>{body}</code>
      </pre>
    </div>
  )
}
