import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

// ── Design tokens ────────────────────────────────────────────────
const GOLD        = '#C5A880'
const BLACK       = '#0A0907'
const WHITE       = '#FFFFFF'
const SURFACE     = '#F8F7F5'
const BORDER      = 'rgba(0,0,0,0.08)'
const DARK_BORDER = 'rgba(255,255,255,0.08)'

const serif: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', 'Cormorant', Georgia, serif",
}

// ── AR Logo: 5 ascending bars = 5 camadas de relevância ─────────
function ARLogo() {
  return (
    <svg viewBox="0 0 28 18" width="22" height="14" fill="none" aria-hidden="true">
      <rect x="0"  y="14" width="4" height="4"  fill="white" rx="0.5" />
      <rect x="6"  y="10" width="4" height="8"  fill="white" rx="0.5" />
      <rect x="12" y="6"  width="4" height="12" fill="white" rx="0.5" />
      <rect x="18" y="2"  width="4" height="16" fill="white" rx="0.5" />
      <rect x="24" y="0"  width="4" height="18" fill="white" rx="0.5" />
    </svg>
  )
}

// ── FadeUp for below-fold sections ──────────────────────────────
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
          padding: '15px 30px',
          background: GOLD, color: '#1A1208',
          border: 'none', cursor: 'pointer',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          transition: 'opacity 0.15s',
        }}
        onMouseOver={e => (e.currentTarget.style.opacity = '0.84')}
        onMouseOut={e => (e.currentTarget.style.opacity = '1')}
      >
        {children}
      </button>
    </Link>
  )
}

// ── Stat block component ─────────────────────────────────────────
function StatBlock({
  value, label, align = 'left', dividerAngle,
}: {
  value: string
  label: string
  align?: 'left' | 'right'
  dividerAngle?: string
}) {
  const isRight = align === 'right'
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: isRight ? 'flex-end' : 'flex-start' }}>
        {isRight && dividerAngle && (
          <div className="hidden md:block" style={{ height: 1, width: 96, background: 'rgba(255,255,255,0.35)', transform: `rotate(${dividerAngle})`, flexShrink: 0 }} />
        )}
        <p style={{ fontSize: 'clamp(34px, 4.5vw, 52px)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
          {value}
        </p>
        {!isRight && dividerAngle && (
          <div className="hidden md:block" style={{ height: 1, width: 96, background: 'rgba(255,255,255,0.35)', transform: `rotate(${dividerAngle})`, flexShrink: 0 }} />
        )}
      </div>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 6, textAlign: isRight ? 'right' : 'left' }}>
        {label}
      </p>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Readex Pro', system-ui, -apple-system, sans-serif", background: '#000', color: WHITE, WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' } as React.CSSProperties}>

      {/* ── Fonts ── */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&display=swap" rel="stylesheet" />

      {/* ════════════════════════════════════════════════════════
          HERO — vídeo fullscreen + nav flutuante + texto escalonado
          ════════════════════════════════════════════════════════ */}
      <section className="relative h-screen w-full overflow-hidden bg-black">

        {/* Background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay loop muted playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_063509_7d167302-4fd4-480b-8260-18ab572333d4.mp4"
        />
        {/* Overlay para legibilidade */}
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.48)' }} />

        {/* ── Navbar flutuante ── */}
        <nav className="absolute z-20 top-0 left-0 right-0 px-6 md:px-10 pt-6 flex items-center justify-between gap-4">

          {/* Pílula da marca */}
          <div className="flex items-center gap-3 backdrop-blur rounded-full pl-4 pr-6 py-3"
               style={{ background: 'rgba(10,9,7,0.85)' }}>
            <ARLogo />
            <span style={{ fontSize: 14, fontWeight: 400, letterSpacing: '-0.01em', color: WHITE }}>
              arquitetura de relevância
            </span>
          </div>

          {/* Pílula de navegação — oculta no mobile */}
          <div className="hidden md:flex items-center gap-1 backdrop-blur rounded-full px-3 py-2"
               style={{ background: 'rgba(10,9,7,0.85)' }}>
            {[['método', '#metodo'], ['jornada', '#metodo'], ['para quem', '#para-quem'], ['resultados', '#cta']].map(([label, href]) => (
              <a
                key={label}
                href={href}
                style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', padding: '8px 18px', borderRadius: 9999, transition: 'color 0.15s' }}
                onMouseOver={e => (e.currentTarget.style.color = WHITE)}
                onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Botão CTA */}
          <Link to="/auth" style={{ textDecoration: 'none' }}>
            <button
              className="rounded-full"
              style={{ background: WHITE, color: BLACK, fontSize: 13, fontWeight: 400, border: 'none', cursor: 'pointer', padding: '12px 24px', transition: 'background 0.15s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#E8E4DC')}
              onMouseOut={e => (e.currentTarget.style.background = WHITE)}
            >
              acessar
            </button>
          </Link>
        </nav>

        {/* ── Conteúdo em primeiro plano ── */}
        <div className="relative h-full w-full">

          {/* Palavra 1 — construa (esquerda, topo) */}
          <h1
            className="absolute left-4 md:left-10"
            style={{
              top: '18%',
              fontSize: 'clamp(52px, 13vw, 172px)',
              fontWeight: 500,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              margin: 0,
              color: WHITE,
              fontFamily: "'Readex Pro', system-ui, sans-serif",
            }}
          >
            construa
          </h1>

          {/* Palavra 2 — sua (direita, meio) */}
          <h1
            className="absolute right-4 md:right-10"
            style={{
              top: '38%',
              fontSize: 'clamp(52px, 13vw, 172px)',
              fontWeight: 500,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              margin: 0,
              color: WHITE,
              fontFamily: "'Readex Pro', system-ui, sans-serif",
            }}
          >
            sua
          </h1>

          {/* Palavra 3 — relevância (esquerda, base) — âncora da composição */}
          <h1
            className="absolute left-4 md:left-10"
            style={{
              top: '58%',
              fontSize: 'clamp(40px, 10vw, 136px)',
              fontWeight: 500,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              margin: 0,
              color: GOLD,
              fontFamily: "'Readex Pro', system-ui, sans-serif",
            }}
          >
            relevância
          </h1>

          {/* Descrição — aparece entre "sua" e "relevância" */}
          <p
            className="absolute left-6 md:left-10"
            style={{
              top: '46%',
              maxWidth: 240,
              fontSize: 15,
              lineHeight: 1.5,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.85)',
              margin: 0,
            }}
          >
            transformamos profissionais em referência real com método, dados e acompanhamento próximo
          </p>

          {/* ── Stat: topo direito — "5 camadas" ── */}
          <div className="absolute right-6 md:right-24" style={{ top: '14%' }}>
            <StatBlock value="5" label="camadas de construção" align="right" dividerAngle="20deg" />
          </div>

          {/* ── Stat: base esquerda — "360°" ── */}
          <div className="absolute left-6 md:left-20" style={{ bottom: 'clamp(80px, 10vw, 96px)' }}>
            <StatBlock value="360°" label="visão de autoridade" align="left" dividerAngle="-20deg" />
          </div>

          {/* ── Stat: base direita — "1:1" ── */}
          <div className="absolute right-6 md:right-20" style={{ bottom: 'clamp(60px, 8vw, 80px)' }}>
            <StatBlock value="1:1" label="mentoria individual" align="right" dividerAngle="-20deg" />
          </div>

        </div>

        {/* Gradiente de transição para a próxima seção */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{ height: 192, background: 'linear-gradient(to bottom, transparent, #000)' }}
        />
      </section>

      {/* ════════════════════════════════════════════════════════
          METODOLOGIA
          ════════════════════════════════════════════════════════ */}
      <section id="metodo" style={{ background: BLACK, borderTop: `1px solid ${DARK_BORDER}` }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '120px 40px' }}>
          <FadeUp>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 24 }}>Método</p>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 80, alignItems: 'start' }}>
            <FadeUp delay={0.1}>
              <h2 style={{ ...serif, fontSize: 'clamp(42px, 6vw, 80px)', fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.03em', margin: 0, color: WHITE }}>
                Cinco camadas<br /><span style={{ fontStyle: 'italic', color: GOLD }}>de construção.</span>
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(255,255,255,0.42)', marginTop: 32, maxWidth: 380 }}>
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
                      <p style={{ fontSize: 15, fontWeight: 600, color: WHITE, marginBottom: 5 }}>{s.label}</p>
                      <p style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(255,255,255,0.38)' }}>{s.desc}</p>
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
            <h2 style={{ ...serif, fontSize: 'clamp(38px, 5.5vw, 72px)', fontWeight: 700, lineHeight: 1.06, letterSpacing: '-0.025em', color: WHITE, marginBottom: 72, maxWidth: 680 }}>
              Para quem quer ser <span style={{ fontStyle: 'italic', color: GOLD }}>referência</span>{'. Não só conhecido.'}
            </h2>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', border: `1px solid ${DARK_BORDER}` }}>
            {PROFILES.map((p, i) => (
              <FadeUp key={i} delay={0.1 + i * 0.09}>
                <div style={{ padding: '48px 36px', borderRight: i < 2 ? `1px solid ${DARK_BORDER}` : 'none', height: '100%' }}>
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: GOLD, marginBottom: 24 }}>{p.tag}</p>
                  <div style={{ width: 24, height: 1, background: GOLD, marginBottom: 24, opacity: 0.5 }} />
                  <p style={{ fontSize: 16, fontWeight: 600, color: WHITE, marginBottom: 14, lineHeight: 1.35 }}>{p.title}</p>
                  <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,0.38)' }}>{p.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CTA
          ════════════════════════════════════════════════════════ */}
      <section id="cta" style={{ background: SURFACE, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '140px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 60, alignItems: 'end' }}>
            <FadeUp>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 28 }}>Faça parte</p>
              <h2 style={{ ...serif, fontSize: 'clamp(44px, 7vw, 96px)', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.03em', margin: 0, color: BLACK }}>
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
                      padding: '14px 30px',
                      background: 'transparent', color: BLACK,
                      border: `1px solid ${BORDER}`, cursor: 'pointer',
                      fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                      whiteSpace: 'nowrap', transition: 'border-color 0.15s',
                    }}
                    onMouseOver={e => (e.currentTarget.style.borderColor = BLACK)}
                    onMouseOut={e => (e.currentTarget.style.borderColor = BORDER)}
                  >
                    Solicitar acesso
                  </button>
                </Link>
                <p style={{ fontSize: 11, color: 'rgba(10,9,7,0.38)', lineHeight: 1.6, maxWidth: 200 }}>
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
      <footer style={{ background: BLACK, borderTop: `1px solid ${DARK_BORDER}`, padding: '28px 40px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ARLogo />
            <span style={{ fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>
              arquitetura de relevância
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.02em' }}>
            © {new Date().getFullYear()} Sancho Gestão de Carreiras
          </p>
        </div>
      </footer>

    </div>
  )
}
