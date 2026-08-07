import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

// ── AR design tokens ─────────────────────────────────────────────
const GOLD       = '#C5A880'
const WARM_WHITE = '#F5F2EC'
const WARM_BLACK = '#0A0907'
const DARK_BORDER = 'rgba(255,255,255,0.08)'
const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" } as React.CSSProperties

// ── Framer Motion variants ────────────────────────────────────────
const fadeDown = {
  initial: { opacity: 0, y: -20 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

// ── AR Logo — anel dourado + ponto interior ──────────────────────
function ARLogo({ size = 32 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      border: `2px solid ${GOLD}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <div style={{ width: size * 0.3, height: size * 0.3, borderRadius: '50%', background: GOLD }} />
    </div>
  )
}

// ── Stats ─────────────────────────────────────────────────────────
const STATS = [
  { prefix: '+', value: '5',    label: 'CAMADAS DE\nCONSTRUÇÃO', custom: 2 },
  { prefix: '',  value: '360°', label: 'VISÃO DE\nAUTORIDADE',   custom: 3 },
  { prefix: '',  value: '1:1',  label: 'MENTORIA\nINDIVIDUAL',   custom: 4 },
]

function StatItem({ prefix, value, label, custom }: typeof STATS[number]) {
  return (
    <motion.div custom={custom} variants={fadeUp} initial="initial" animate="animate"
      style={{ textAlign: 'right' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 1 }}>
        {prefix && (
          <span style={{ color: GOLD, fontWeight: 600, fontSize: '0.5em', lineHeight: 1 }}>{prefix}</span>
        )}
        <span style={{
          fontSize: 'clamp(1.5rem, 5vw, 3.5rem)', fontWeight: 600,
          color: WARM_WHITE, lineHeight: 1,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          {value}
        </span>
      </div>
      <p style={{
        fontSize: 'clamp(9px, 1.2vw, 13px)', fontWeight: 600,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'rgba(245,242,236,0.55)',
        whiteSpace: 'pre-line', lineHeight: 1.3, textAlign: 'right',
        margin: '5px 0 0',
      }}>
        {label}
      </p>
    </motion.div>
  )
}

// ── Nav links ─────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Método',    href: '#metodo',    external: true },
  { label: 'Jornada',   href: '#metodo',    external: true },
  { label: 'Para Quem', href: '#para-quem', external: true },
  { label: 'Acesso',    href: '/auth',      external: false },
]

// ── Below-fold FadeUp ─────────────────────────────────────────────
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

const STEPS = [
  { n: '01', label: 'Identidade',  desc: 'Quem você é, para quem fala e o que entrega de diferente.' },
  { n: '02', label: 'Pilares',     desc: 'As frentes estratégicas de presença e autoridade no mercado.' },
  { n: '03', label: 'Metas',       desc: 'OKRs trimestrais com plano de ação e ciclo de revisão.' },
  { n: '04', label: 'Marketing',   desc: 'Agenda editorial e distribuição ao longo do ano.' },
  { n: '05', label: 'Indicadores', desc: 'KPIs de autoridade e relatórios de evolução contínua.' },
]

const PROFILES = [
  {
    tag: 'ESPECIALISTAS',
    title: 'Especialistas e consultores',
    desc: 'Que querem ser reconhecidos pelo que sabem e atrair os clientes certos com consistência.',
  },
  {
    tag: 'TRANSIÇÃO',
    title: 'Profissionais em transição',
    desc: 'Reposicionando a carreira e construindo autoridade no novo nicho com método.',
  },
  {
    tag: 'LIDERANÇAS',
    title: 'Líderes e executivos',
    desc: 'Que querem ampliar presença, influência e impacto além da empresa onde atuam.',
  },
]

function PrimaryBtn({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to}>
      <button
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '15px 30px', background: GOLD, color: '#1A1208',
          border: 'none', cursor: 'pointer',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.84')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        {children}
      </button>
    </Link>
  )
}

// ══════════════════════════════════════════════════════════════════
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      background: WARM_BLACK, color: WARM_WHITE,
      WebkitFontSmoothing: 'antialiased',
    } as React.CSSProperties}>

      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet" />

      {/* ══════════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: '100svh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Background video */}
        <video
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
          autoPlay loop muted playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260517_222138_3e3205be-3364-417b-a64a-bfe087acbec4.mp4"
        />
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,7,5,0.54)', zIndex: 1 }} />

        {/* ── Navbar ── */}
        <nav style={{
          position: 'relative', zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'clamp(20px,3.5vw,24px) clamp(20px,5vw,48px)',
        }}>
          {/* Logo */}
          <motion.div custom={0} variants={fadeDown} initial="initial" animate="animate">
            <ARLogo size={32} />
          </motion.div>

          {/* Desktop nav — hidden on mobile */}
          <div className="hidden md:flex items-center" style={{ gap: 40 }}>
            {NAV_LINKS.map(({ label, href, external }, i) => (
              <motion.div key={label} custom={i + 1} variants={fadeDown} initial="initial" animate="animate">
                {external ? (
                  <a href={href} style={{ textDecoration: 'none' }}>
                    <span style={{
                      fontSize: 14, fontWeight: 600, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: WARM_WHITE,
                      cursor: 'pointer', transition: 'color 0.15s',
                    }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = GOLD)}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = WARM_WHITE)}
                    >
                      {label}
                    </span>
                  </a>
                ) : (
                  <Link to={href as any} style={{ textDecoration: 'none' }}>
                    <span style={{
                      fontSize: 14, fontWeight: 600, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: WARM_WHITE,
                      cursor: 'pointer', transition: 'color 0.15s',
                    }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = GOLD)}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = WARM_WHITE)}
                    >
                      {label}
                    </span>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          {/* Hamburger */}
          <motion.button
            custom={5} variants={fadeDown} initial="initial" animate="animate"
            onClick={() => setMenuOpen(true)}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: WARM_WHITE, border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}
            aria-label="Abrir menu"
          >
            <span style={{ width: 16, height: 2, background: WARM_BLACK, display: 'block', borderRadius: 1 }} />
            <span style={{ width: 16, height: 2, background: WARM_BLACK, display: 'block', borderRadius: 1 }} />
            <span style={{ width: 16, height: 2, background: WARM_BLACK, display: 'block', borderRadius: 1 }} />
          </motion.button>
        </nav>

        {/* ── Stats row — vertically centered, right-aligned ── */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          position: 'relative', zIndex: 10,
          padding: 'clamp(32px,5vw,0px) clamp(20px,5vw,48px)',
        }}>
          <div style={{ display: 'flex', gap: 'clamp(20px,4vw,40px)' }}>
            {STATS.map(s => <StatItem key={s.value} {...s} />)}
          </div>
        </div>

        {/* ── Bottom content ── */}
        <div style={{
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column',
          gap: 'clamp(24px,4vw,48px)',
          padding: '0 clamp(20px,5vw,48px) clamp(32px,5vw,48px)',
        }}>

          {/* Row A: tagline + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <motion.p custom={5} variants={fadeUp} initial="initial" animate="animate"
              style={{
                fontSize: 'clamp(9px,1.4vw,13px)', fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'rgba(245,242,236,0.7)',
                maxWidth: 'clamp(130px,20vw,280px)', lineHeight: 1.6, margin: 0,
              }}>
              Autoridade Real /<br />Com Método /<br />Para Você
            </motion.p>

            <motion.div custom={6} variants={fadeUp} initial="initial" animate="animate">
              <Link to="/auth" style={{ textDecoration: 'none' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  color: GOLD,
                  fontSize: 'clamp(16px,2.5vw,24px)',
                  fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                  whiteSpace: 'nowrap', transition: 'opacity 0.15s',
                }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                >
                  Acessar Plataforma
                  <ArrowUpRight size={22} />
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Row B: description + main heading */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'clamp(12px,3vw,16px)' }}>

            {/* Description block */}
            <motion.div custom={7} variants={fadeUp} initial="initial" animate="animate"
              style={{ width: 'clamp(120px,20vw,280px)', flexShrink: 0 }}>
              <p style={{
                fontSize: 'clamp(8px,1.1vw,13px)', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(245,242,236,0.45)', lineHeight: 1.65, margin: 0,
                textAlign: 'right',
              }}>
                Metodologia Estruturada Para Construir Sua Autoridade e Presença Real no Mercado
              </p>
            </motion.div>

            {/* Main heading — slide-up clip reveal */}
            <div style={{ textAlign: 'right' }}>
              {(['Construa', 'Sua', 'Relevância'] as const).map((word, i) => (
                <div key={word} style={{ overflow: 'hidden' }}>
                  <motion.div
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      fontSize: 'clamp(2rem,9vw,9rem)',
                      fontWeight: 600,
                      lineHeight: 0.88,
                      textTransform: 'uppercase',
                      color: i === 2 ? GOLD : WARM_WHITE,
                      fontFamily: "'Inter', system-ui, sans-serif",
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {word}
                  </motion.div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          MOBILE MENU OVERLAY
          ════════════════════════════════════════════════════════ */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: WARM_BLACK,
            display: 'flex', flexDirection: 'column',
            padding: 'clamp(20px,4vw,24px) clamp(20px,5vw,48px)',
          }}
        >
          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <ARLogo size={32} />
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: WARM_WHITE, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="Fechar menu"
            >
              <X size={18} color={WARM_BLACK} />
            </button>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginTop: 64 }}>
            {NAV_LINKS.map(({ label, href, external }) =>
              external ? (
                <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none' }}>
                  <span style={{ fontSize: 'clamp(28px,8vw,48px)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: WARM_WHITE }}>
                    {label}
                  </span>
                </a>
              ) : (
                <Link key={label} to={href as any} onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none' }}>
                  <span style={{ fontSize: 'clamp(28px,8vw,48px)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: WARM_WHITE }}>
                    {label}
                  </span>
                </Link>
              )
            )}
          </div>

          {/* Mobile CTA */}
          <div style={{ marginTop: 'auto' }}>
            <Link to="/auth" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                color: GOLD, fontSize: 'clamp(20px,5vw,28px)',
                fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                Acessar Plataforma
              </span>
              <ArrowUpRight size={24} color={GOLD} />
            </Link>
          </div>
        </motion.div>
      )}

      {/* ════════════════════════════════════════════════════════
          METODOLOGIA
          ════════════════════════════════════════════════════════ */}
      <section id="metodo" style={{ background: WARM_BLACK, borderTop: `1px solid ${DARK_BORDER}` }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '120px 40px' }}>
          <FadeUp>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 24 }}>Método</p>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 80, alignItems: 'start' }}>
            <FadeUp delay={0.1}>
              <h2 style={{ ...serif, fontSize: 'clamp(42px,6vw,80px)', fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.03em', margin: 0, color: WARM_WHITE }}>
                Cinco camadas<br /><span style={{ fontStyle: 'italic', color: GOLD }}>de construção.</span>
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(245,242,236,0.42)', marginTop: 32, maxWidth: 380 }}>
                Cada participante evolui dentro de um hub individual, com visão clara do que construir semana a semana.
              </p>
              <div style={{ marginTop: 40 }}>
                <PrimaryBtn to="/auth">Acessar a plataforma <ArrowUpRight size={13} /></PrimaryBtn>
              </div>
            </FadeUp>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {STEPS.map((s, i) => (
                <FadeUp key={s.n} delay={0.15 + i * 0.07}>
                  <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 20, padding: '28px 0', borderBottom: i < STEPS.length - 1 ? `1px solid ${DARK_BORDER}` : 'none', alignItems: 'start' }}>
                    <span style={{ ...serif, fontSize: 32, fontWeight: 700, color: GOLD, lineHeight: 1, letterSpacing: '-0.02em' }}>{s.n}</span>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: WARM_WHITE, marginBottom: 5 }}>{s.label}</p>
                      <p style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(245,242,236,0.38)' }}>{s.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PARA QUEM
          ════════════════════════════════════════════════════════ */}
      <section id="para-quem" style={{ background: '#060504', borderTop: `1px solid ${DARK_BORDER}` }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '120px 40px' }}>
          <FadeUp>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 24 }}>Para quem é</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 style={{ ...serif, fontSize: 'clamp(38px,5.5vw,72px)', fontWeight: 700, lineHeight: 1.06, letterSpacing: '-0.025em', color: WARM_WHITE, marginBottom: 72, maxWidth: 680 }}>
              Para quem quer ser <span style={{ fontStyle: 'italic', color: GOLD }}>referência</span>{'. Não só conhecido.'}
            </h2>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', border: `1px solid ${DARK_BORDER}` }}>
            {PROFILES.map((p, i) => (
              <FadeUp key={i} delay={0.1 + i * 0.09}>
                <div style={{ padding: '48px 36px', borderRight: i < 2 ? `1px solid ${DARK_BORDER}` : 'none', height: '100%' }}>
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: GOLD, marginBottom: 24 }}>{p.tag}</p>
                  <div style={{ width: 24, height: 1, background: GOLD, marginBottom: 24, opacity: 0.5 }} />
                  <p style={{ fontSize: 16, fontWeight: 600, color: WARM_WHITE, marginBottom: 14, lineHeight: 1.35 }}>{p.title}</p>
                  <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(245,242,236,0.38)' }}>{p.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CTA
          ════════════════════════════════════════════════════════ */}
      <section style={{ background: '#0D0B09', borderTop: `1px solid ${DARK_BORDER}` }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '140px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 60, alignItems: 'end' }}>
            <FadeUp>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 28 }}>Faça parte</p>
              <h2 style={{ ...serif, fontSize: 'clamp(44px,7vw,96px)', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.03em', margin: 0, color: WARM_WHITE }}>
                Construa autoridade<br /><span style={{ fontStyle: 'italic', color: GOLD }}>com método.</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
                <PrimaryBtn to="/auth">Acessar a plataforma <ArrowUpRight size={13} /></PrimaryBtn>
                <Link to="/auth">
                  <button
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 10,
                      padding: '14px 30px', background: 'transparent', color: WARM_WHITE,
                      border: `1px solid ${DARK_BORDER}`, cursor: 'pointer',
                      fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                      whiteSpace: 'nowrap', transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = DARK_BORDER)}
                  >
                    Solicitar acesso
                  </button>
                </Link>
                <p style={{ fontSize: 11, color: 'rgba(245,242,236,0.28)', lineHeight: 1.6, maxWidth: 200 }}>
                  Acesso restrito aos participantes ativos do programa.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════════════════ */}
      <footer style={{ background: WARM_BLACK, borderTop: `1px solid ${DARK_BORDER}`, padding: '28px 40px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ARLogo size={24} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.28)' }}>
              Arquitetura de Relevância
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(245,242,236,0.18)', letterSpacing: '0.02em' }}>
            © {new Date().getFullYear()} Sancho Gestão de Carreiras
          </p>
        </div>
      </footer>

    </div>
  )
}
