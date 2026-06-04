export default function WADonut({ pct, color, size = 80, label, sub }) {
  return (
    <div
      className="wa-donut"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${color} ${pct * 3.6}deg, var(--line) 0)`,
      }}
    >
      <div style={{ textAlign: 'center', lineHeight: 1 }}>
        <div style={{ fontWeight: 800, fontSize: size * 0.3, color: 'var(--ink)' }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  )
}
