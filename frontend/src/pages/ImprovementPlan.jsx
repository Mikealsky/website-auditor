import { useState, useEffect, useRef } from 'react'
import { buildFixGuide } from '../utils/fixguide'
import CodeBlock from '../components/CodeBlock'
import ContactModal from '../components/ContactModal'

// ─── mini components ───────────────────────────────────────────────────────

function Donut({ pct, color, size = 80 }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={9} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={9}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray .6s ease' }}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize={size * 0.22} fontWeight={800} fill="var(--ink)">
        {pct}
      </text>
    </svg>
  )
}

function MetaPills({ difficulty, time }) {
  const diffColor = difficulty === 'Easy' ? 'var(--green)' : difficulty === 'Medium' ? 'var(--amber)' : 'var(--coral)'
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 999, border: `1.5px solid ${diffColor}`, padding: '3px 10px', fontSize: 12, fontWeight: 700, color: diffColor }}>
        {difficulty}
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 999, border: '1.5px solid var(--line)', padding: '3px 10px', fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>
        ⏱ {time}
      </span>
    </div>
  )
}

function StepRow({ n, h, b }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--coral)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 13, marginTop: 1 }}>{n}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{h}</div>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>{b}</p>
      </div>
    </div>
  )
}

function ResultBar({ label, from, to, targetPct, impactPct }) {
  return (
    <div style={{ background: 'var(--card-2)', borderRadius: 'var(--r-md)', padding: '14px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)' }}>{label}</span>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>
          <b style={{ color: 'var(--ink)' }}>{from}</b> → <b style={{ color: 'var(--green-dark)' }}>{to}</b>
        </span>
      </div>
      <div style={{ position: 'relative', height: 10, borderRadius: 99, background: 'var(--line)' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: impactPct + '%', borderRadius: 99, background: 'var(--coral)', opacity: 0.4 }} />
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: targetPct + '%', borderRadius: 99, background: 'var(--green)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 11, color: 'var(--muted)' }}>
        <span>Now: {impactPct}</span>
        <span>Target: {targetPct}</span>
      </div>
    </div>
  )
}

// ─── main page ─────────────────────────────────────────────────────────────

export default function ImprovementPlan({ data, businessName, onBack }) {
  const { GUIDE, ORDER } = buildFixGuide(data)

  const storageKey = `wa-plan-done-${data?.url || 'default'}`
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || {} } catch { return {} }
  })
  const [activeKey, setActiveKey] = useState(ORDER[0])
  const [contactScope, setContactScope] = useState(null)
  const mainRef = useRef(null)

  const fix = GUIDE[activeKey]
  const doneCount = ORDER.filter((k) => done[k]).length

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(done)) } catch { /* ignore */ }
  }, [done, storageKey])

  const toggleDone = (key) => setDone((prev) => ({ ...prev, [key]: !prev[key] }))

  const markDoneAndNext = () => {
    const newDone = { ...done, [activeKey]: true }
    setDone(newDone)
    const nextIdx = ORDER.indexOf(activeKey) + 1
    if (nextIdx < ORDER.length) {
      setActiveKey(ORDER[nextIdx])
      mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goTo = (key) => {
    setActiveKey(key)
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const overallPct = Math.round(ORDER.reduce((sum, k) => sum + GUIDE[k].impactPct, 0) / ORDER.length)
  const catColorMap = { speed: 'var(--coral)', seo: 'var(--amber)', a11y: 'var(--green)' }

  return (
    <div className="wa" style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* top bar */}
      <header style={{ background: 'var(--ink)', color: '#fff', padding: '14px clamp(16px,2.5vw,30px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} className="wa-btn wa-btn-sm" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', border: 'none' }} aria-label="Back to report">
            ← Report
          </button>
          <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,.18)' }} />
          <span style={{ fontWeight: 800, fontSize: 15 }}>Improvement Plan</span>
          {businessName && <span style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>· {businessName}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>
            <b style={{ color: '#fff' }}>{doneCount}</b>/{ORDER.length} done
          </span>
        </div>
      </header>

      {/* split layout */}
      <div className="wa-plan-layout" style={{ flex: 1, display: 'grid', gridTemplateColumns: 'clamp(260px,22vw,320px) 1fr', minHeight: 0, overflow: 'hidden' }}>

        {/* LEFT RAIL */}
        <aside className="wa-plan-aside" style={{ borderRight: '1px solid var(--line)', overflowY: 'auto', padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: 20, background: 'var(--bg)' }}>

          {/* progress donut */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '8px 0 4px' }}>
            <Donut pct={overallPct} color="var(--coral)" size={88} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)' }}>Average score</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{doneCount} of {ORDER.length} fixes done</div>
            </div>
          </div>

          {/* progress track */}
          <div style={{ height: 6, borderRadius: 99, background: 'var(--line)' }}>
            <div style={{ height: '100%', borderRadius: 99, background: 'var(--coral)', width: `${(doneCount / ORDER.length) * 100}%`, transition: 'width .4s ease' }} />
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '.06em', paddingLeft: 2 }}>YOUR FIXES</div>

          {/* fix checklist */}
          {ORDER.map((key) => {
            const g = GUIDE[key]
            const isActive = key === activeKey
            const isDone = done[key]
            return (
              <button
                key={key}
                onClick={() => goTo(key)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  borderRadius: 'var(--r-md)',
                  padding: '13px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  background: isActive ? 'var(--card)' : 'transparent',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  border: isActive ? '1.5px solid var(--line)' : '1.5px solid transparent',
                  transition: 'background .15s, border-color .15s',
                }}
              >
                {/* tick circle */}
                <div
                  onClick={(e) => { e.stopPropagation(); toggleDone(key) }}
                  style={{
                    flexShrink: 0,
                    width: 22, height: 22,
                    borderRadius: '50%',
                    border: `2px solid ${isDone ? 'var(--green)' : 'var(--line)'}`,
                    background: isDone ? 'var(--green)' : 'transparent',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 12,
                    fontWeight: 900,
                    transition: 'all .15s',
                    marginTop: 2,
                  }}
                  role="checkbox"
                  aria-checked={!!isDone}
                  aria-label={`Mark "${g.title}" as done`}
                >
                  {isDone ? '✓' : ''}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: g.catColor, letterSpacing: '.04em', marginBottom: 2 }}>{g.category.toUpperCase()}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3, color: isDone ? 'var(--muted)' : 'var(--ink)', textDecoration: isDone ? 'line-through' : 'none' }}>{g.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{g.difficulty} · {g.time}</div>
                </div>
              </button>
            )
          })}
        </aside>

        {/* RIGHT MAIN PANEL */}
        <main ref={mainRef} style={{ overflowY: 'auto', padding: 'clamp(20px,3vw,36px)', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* fix header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: fix.catColor, letterSpacing: '.06em', background: `color-mix(in srgb, ${fix.catColor} 12%, transparent)`, borderRadius: 999, padding: '3px 10px' }}>{fix.category.toUpperCase()}</span>
              <MetaPills difficulty={fix.difficulty} time={fix.time} />
            </div>
            <h1 style={{ fontSize: 'clamp(24px,3vw,34px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 0 }}>{fix.title}</h1>
          </div>

          {/* problem + why */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 14 }}>
            <div className="wa-card" style={{ padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '.06em', marginBottom: 8 }}>THE PROBLEM</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, margin: 0, color: 'var(--ink-2)' }}>{fix.problem}</p>
            </div>
            <div className="wa-card" style={{ padding: 20, background: 'var(--ink)', color: '#fff' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--coral-tint-3)', letterSpacing: '.06em', marginBottom: 8 }}>WHY IT MATTERS</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, margin: 0, color: 'rgba(255,255,255,.82)' }}>{fix.why}</p>
            </div>
          </div>

          {/* steps */}
          <div className="wa-card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--muted)', letterSpacing: '.04em' }}>HOW TO FIX IT</div>
            {fix.steps.map((s, i) => <StepRow key={i} n={i + 1} h={s.h} b={s.b} />)}
          </div>

          {/* code block */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--muted)', letterSpacing: '.04em', marginBottom: 10 }}>FOR YOUR DEVELOPER</div>
            <CodeBlock body={fix.code.body} caption={fix.code.caption} lang={fix.code.lang} />
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 10, lineHeight: 1.5 }}>{fix.dev}</p>
          </div>

          {/* expected result */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--muted)', letterSpacing: '.04em', marginBottom: 10 }}>EXPECTED RESULT</div>
            <ResultBar
              label={fix.metricLabel}
              from={fix.metricFrom}
              to={fix.metricTo}
              impactPct={fix.impactPct}
              targetPct={fix.targetPct}
            />
          </div>

          {/* footer nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingTop: 8, borderTop: '1px solid var(--line)', flexWrap: 'wrap' }}>
            <button
              onClick={() => setContactScope(fix)}
              className="wa-btn"
              style={{ background: 'var(--ink)', color: '#fff' }}
            >
              Have us fix it →
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              {ORDER.indexOf(activeKey) > 0 && (
                <button onClick={() => goTo(ORDER[ORDER.indexOf(activeKey) - 1])} className="wa-btn wa-btn-sm">
                  ← Previous
                </button>
              )}
              {ORDER.indexOf(activeKey) < ORDER.length - 1 ? (
                <button onClick={markDoneAndNext} className="wa-btn wa-btn-coral">
                  Mark done & next →
                </button>
              ) : (
                <button onClick={() => toggleDone(activeKey)} className="wa-btn wa-btn-coral">
                  {done[activeKey] ? 'Unmark done' : 'Mark as done ✓'}
                </button>
              )}
            </div>
          </div>

        </main>
      </div>

      {contactScope && (
        <ContactModal
          fixTitle={contactScope.title}
          businessName={businessName}
          onClose={() => setContactScope(null)}
        />
      )}
    </div>
  )
}
