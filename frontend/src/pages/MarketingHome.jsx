import AuthButton from '../components/AuthButton'

const SERVICES = [
  { t: 'Speed & performance', d: "We measure exactly how fast your site loads and pinpoint what's slowing it down — the #1 reason visitors leave before they ever see you." },
  { t: 'Getting found on Google', d: 'We check the search signals Google looks for, so the right local customers can actually find you when they search.' },
  { t: 'Works for everyone', d: 'We test that your site is easy to use on every phone and for every visitor — which also helps you rank higher.' },
  { t: 'Plain-English fixes', d: 'No jargon. You get a prioritised, step-by-step to-do list anyone can follow — plus the technical detail for your developer.' },
]
const STEPS = [
  { n: '1', t: 'Enter your website', d: 'Pop in your address — no sign-up, nothing to install.' },
  { n: '2', t: 'We scan it in seconds', d: 'We check speed, search ranking and design automatically.' },
  { n: '3', t: 'Get your fix list', d: 'See your scores free, then unlock the full step-by-step plan.' },
]
const EXAMPLES = [
  { host: 'copperkettlecafe.com', name: 'Copper Kettle Café', tag: 'Restaurant', scores: [42, 61, 78] },
  { host: 'bellahairstudio.com', name: 'Bella Hair Studio', tag: 'Salon', scores: [55, 48, 83] },
  { host: 'profixplumbing.com', name: 'Pro-Fix Plumbing', tag: 'Trades', scores: [34, 72, 66] },
]
const band = (s) => (s < 50 ? 'var(--coral)' : s < 70 ? 'var(--amber)' : 'var(--green)')

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function MarketingHome({ onStart, onViewExample, user, onSignIn, onSignOut }) {
  return (
    <div className="wa" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '22px 22px 0' }}>

        {/* nav */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 6px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 19 }}>W</div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Website Auditor</div>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => scrollTo('wa-services')} className="wa-pill" style={{ border: 'none', background: 'transparent' }}>Services</button>
            <button onClick={() => scrollTo('wa-examples')} className="wa-pill" style={{ border: 'none', background: 'transparent' }}>Examples</button>
            <AuthButton user={user} onSignIn={onSignIn} onSignOut={onSignOut} />
            <button onClick={onStart} className="wa-btn wa-btn-coral" style={{ padding: '12px 20px', fontSize: 14, whiteSpace: 'nowrap' }}>Run free audit</button>
          </nav>
        </header>

        {/* hero */}
        <section className="wa-hero" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40, alignItems: 'center', padding: 'clamp(40px,7vw,90px) 6px clamp(36px,5vw,70px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 22 }}>
            <span className="wa-chip wa-chip-coral">For local business owners</span>
            <h1 style={{ fontSize: 'clamp(38px,5.2vw,62px)', lineHeight: 1.02, fontWeight: 800, letterSpacing: '-0.035em', textWrap: 'balance' }}>
              Your website could be quietly turning customers away.
            </h1>
            <p style={{ fontSize: 'clamp(17px,1.4vw,20px)', color: 'var(--ink-2)', lineHeight: 1.5, maxWidth: 520 }}>
              Website Auditor checks your site's speed, Google ranking and design in seconds — then shows you, in plain English, exactly how to win back more local business. No tech knowledge needed.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginTop: 2 }}>
              <button onClick={onStart} className="wa-btn wa-btn-coral" style={{ padding: '16px 28px', fontSize: 16, whiteSpace: 'nowrap' }}>Run my free audit →</button>
              <span style={{ fontSize: 14, color: 'var(--muted)' }}>Free · 30 seconds · No sign-up to start</span>
            </div>
          </div>

          {/* hero visual */}
          <div style={{ position: 'relative', paddingBottom: 24 }}>
            <div className="wa-card" style={{ padding: 24, background: 'var(--ink)', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <span className="wa-mono" style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>copperkettlecafe.com</span>
                <span className="wa-chip" style={{ marginLeft: 'auto', background: 'rgba(226,96,63,.18)', color: 'var(--coral-tint-3)', fontSize: 11 }}>● Needs work</span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {[['Performance', 42], ['SEO', 61], ['Access.', 78]].map(([l, v], i) => (
                  <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 'var(--r-md)', padding: '14px 14px' }}>
                    <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{v}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginTop: 8 }}>{l}</div>
                    <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,.14)', marginTop: 7 }}>
                      <div style={{ width: v + '%', height: '100%', borderRadius: 99, background: band(v) }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="wa-card" style={{ position: 'absolute', right: -10, bottom: 0, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'var(--shadow-lg)' }}>
              <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--coral-tint-1)', color: 'var(--coral-700)', display: 'grid', placeItems: 'center', fontWeight: 800 }}>6</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>fixes found</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>ranked by impact</div>
              </div>
            </div>
          </div>
        </section>

        {/* trust strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(14px,3vw,36px)', flexWrap: 'wrap', padding: '10px 0 0', color: 'var(--muted)', fontSize: 14 }}>
          <span>Trusted by local</span>
          {['Cafés', 'Salons', 'Trades', 'Restaurants', 'Mom-and-pop shops'].map((x, i) => (
            <span key={i} style={{ fontWeight: 700, color: 'var(--ink-2)' }}>{x}</span>
          ))}
        </div>
      </div>

      {/* services */}
      <section id="wa-services" style={{ background: 'var(--panel)', marginTop: 56, padding: 'clamp(48px,6vw,80px) 22px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14, marginBottom: 44 }}>
            <span className="wa-eyebrow">What we do</span>
            <h2 style={{ fontSize: 'clamp(30px,3.4vw,42px)', fontWeight: 800, letterSpacing: '-0.03em', maxWidth: 720, textWrap: 'balance' }}>
              Everything you need to turn your website into your best salesperson
            </h2>
            <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 560, lineHeight: 1.5 }}>
              We handle the technical stuff so you don't have to. Here's what your free audit looks at — and how we help you fix it.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 18 }}>
            {SERVICES.map((s, i) => (
              <div key={i} className="wa-card" style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: 'var(--coral-tint-1)', color: 'var(--coral-700)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 19 }}>{i + 1}</div>
                <h3 style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em' }}>{s.t}</h3>
                <p style={{ fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.5 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(48px,6vw,80px) 22px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14, marginBottom: 40 }}>
          <span className="wa-eyebrow">How it works</span>
          <h2 style={{ fontSize: 'clamp(30px,3.4vw,42px)', fontWeight: 800, letterSpacing: '-0.03em' }}>Three steps to a better website</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ padding: '8px 6px' }}>
              <div style={{ fontSize: 54, fontWeight: 800, color: 'var(--coral-tint-3)', letterSpacing: '-0.04em', lineHeight: 1 }}>{s.n}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginTop: 12 }}>{s.t}</h3>
              <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5, maxWidth: 300 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* examples */}
      <section id="wa-examples" style={{ background: 'var(--panel)', padding: 'clamp(48px,6vw,80px) 22px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14, marginBottom: 44 }}>
            <span className="wa-eyebrow">See it in action</span>
            <h2 style={{ fontSize: 'clamp(30px,3.4vw,42px)', fontWeight: 800, letterSpacing: '-0.03em' }}>Example audits</h2>
            <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 560, lineHeight: 1.5 }}>Real-world examples of the report you'll get. Click any one to explore a full sample audit.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => onViewExample(ex.host, ex.name)} style={{ textAlign: 'left', cursor: 'pointer', border: 'none', padding: 0, background: 'transparent', fontFamily: 'inherit' }}>
                <div className="wa-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18, height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>{ex.name}</div>
                      <div className="wa-mono" style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{ex.host}</div>
                    </div>
                    <span className="wa-chip" style={{ background: 'var(--card-2)', border: '1px solid var(--line)', color: 'var(--ink-2)' }}>{ex.tag}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {ex.scores.map((v, j) => (
                      <div key={j} style={{ flex: 1, textAlign: 'center', background: 'var(--card-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)', padding: '12px 6px' }}>
                        <div style={{ fontSize: 26, fontWeight: 800, color: band(v), letterSpacing: '-0.03em', lineHeight: 1 }}>{v}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 5 }}>{['Perf', 'SEO', 'Access'][j]}</div>
                      </div>
                    ))}
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: 'var(--coral-700)' }}>View sample audit →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* final CTA */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(48px,6vw,80px) 22px' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--coral) 0%, var(--coral-600) 100%)', color: '#fff', borderRadius: 'var(--r-xl)', padding: 'clamp(40px,5vw,64px) clamp(28px,4vw,56px)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <h2 style={{ fontSize: 'clamp(30px,3.6vw,46px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, maxWidth: 680, textWrap: 'balance' }}>
            Ready to see how your website is really doing?
          </h2>
          <p style={{ fontSize: 'clamp(16px,1.5vw,19px)', color: 'rgba(255,255,255,.88)', maxWidth: 480, lineHeight: 1.5 }}>
            Run your free audit now. It takes about 30 seconds and there's nothing to install.
          </p>
          <button onClick={onStart} className="wa-btn" style={{ background: '#fff', color: 'var(--coral-700)', padding: '17px 34px', fontSize: 17, marginTop: 6, whiteSpace: 'nowrap' }}>
            Run my free audit →
          </button>
        </div>
      </section>

      {/* footer */}
      <footer style={{ maxWidth: 1180, margin: '0 auto', padding: '0 28px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', color: 'var(--muted)', fontSize: 13.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 13 }}>W</div>
          <span style={{ fontWeight: 700, color: 'var(--ink-2)' }}>Website Auditor</span>
        </div>
        <span>© 2026 Website Auditor</span>
      </footer>
    </div>
  )
}
