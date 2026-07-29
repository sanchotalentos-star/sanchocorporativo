import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Linkedin, Instagram, ArrowUpRight } from 'lucide-react'
import { MinimalistHero } from '@/components/ui/minimalist-hero'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const GOLD = '#C5A880'
const BLACK = '#0A0907'
const WHITE = '#FFFFFF'
const SURFACE = '#F8F7F5'
const BORDER = 'rgba(0,0,0,0.08)'

const serif: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', 'Cormorant', Georgia, serif",
}

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
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

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: WHITE, color: BLACK }}>

      {/* Webfonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&display=swap" rel="stylesheet" />

      {/* ── HERO ── */}
      <MinimalistHero
        logoText="AR."
        navLinks={[
          { label: 'PROGRAMA',  href: '#metodo' },
          { label: 'MÉTODO',    href: '#metodo' },
          { label: 'PARA QUEM', href: '#para-quem' },
        ]}
        mainText="Programa de mentoria para profissionais que querem construir autoridade real — com método, dados e acompanhamento próximo."
        readMoreLink="#metodo"
        imageSrc="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=80"
        imageAlt="Profissional de autoridade"
        overlayText={{ part1: 'relevância', part2: 'real.' }}
        socialLinks={[
          { icon: Linkedin,  href: '#' },
          { icon: Instagram, href: '#' },
        ]}
        locationText="Brasil · 2025"
        circleColor="bg-[#C5A880]/70"
      />

      {/* ── METODOLOGIA ── */}
      <section id="metodo" style={{ background: WHITE, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '120px 40px' }}>

          <FadeUp>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 24 }}>
              Método
            </p>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
            <FadeUp delay={0.1}>
              <h2 style={{
                ...serif,
                fontSize: 'clamp(42px, 6vw, 80px)',
                fontWeight: 700,
                lineHeight: 1.04,
                letterSpacing: '-0.03em',
                margin: 0,
              }}>
                Cinco camadas<br />
                <span style={{ fontStyle: 'italic', color: GOLD }}>de construção.</span>
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(10,9,7,0.5)', marginTop: 32, maxWidth: 380 }}>
                Cada participante evolui dentro de um hub individual, com visão clara do que construir semana a semana.
              </p>
              <Link to="/auth">
                <button
                  style={{
                    marginTop: 40,
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '14px 28px',
                    background: BLACK, color: WHITE,
                    border: 'none', cursor: 'pointer',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.opacity = '0.82')}
                  onMouseOut={e => (e.currentTarget.style.opacity = '1')}
                >
                  Acessar a plataforma <ArrowUpRight size={13} />
                </button>
              </Link>
            </FadeUp>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {STEPS.map((s, i) => (
                <FadeUp key={s.n} delay={0.15 + i * 0.07}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr',
                    gap: 20,
                    padding: '28px 0',
                    borderBottom: i < STEPS.length - 1 ? `1px solid ${BORDER}` : 'none',
                    alignItems: 'start',
                  }}>
                    <span style={{ ...serif, fontSize: 32, fontWeight: 700, color: GOLD, lineHeight: 1, letterSpacing: '-0.02em' }}>{s.n}</span>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: BLACK, marginBottom: 5 }}>{s.label}</p>
                      <p style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(10,9,7,0.5)' }}>{s.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PARA QUEM (inverted strip) ── */}
      <section id="para-quem" style={{ background: BLACK }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '120px 40px' }}>

          <FadeUp>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 24 }}>
              Para quem é
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 style={{
              ...serif,
              fontSize: 'clamp(38px, 5.5vw, 72px)',
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: '-0.025em',
              color: WHITE,
              marginBottom: 72,
              maxWidth: 680,
            }}>
              Para quem quer ser{' '}
              <span style={{ fontStyle: 'italic', color: GOLD }}>referência</span>
              {' '}— não só conhecido.
            </h2>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
            {PROFILES.map((p, i) => (
              <FadeUp key={i} delay={0.1 + i * 0.09}>
                <div style={{
                  padding: '48px 36px',
                  borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  height: '100%',
                }}>
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: GOLD, marginBottom: 24 }}>{p.tag}</p>
                  <div style={{ width: 24, height: 1, background: GOLD, marginBottom: 24, opacity: 0.5 }} />
                  <p style={{ fontSize: 16, fontWeight: 600, color: WHITE, marginBottom: 14, lineHeight: 1.35 }}>{p.title}</p>
                  <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,0.45)' }}>{p.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: SURFACE, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '140px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 60, alignItems: 'end' }}>

            <FadeUp>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 28 }}>
                Faça parte
              </p>
              <h2 style={{
                ...serif,
                fontSize: 'clamp(44px, 7vw, 96px)',
                fontWeight: 700,
                lineHeight: 1.02,
                letterSpacing: '-0.03em',
                margin: 0,
              }}>
                Construa autoridade<br />
                <span style={{ fontStyle: 'italic', color: GOLD }}>com método.</span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
                <Link to="/auth">
                  <button
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 12,
                      padding: '16px 32px',
                      background: GOLD, color: '#1A1208',
                      border: 'none', cursor: 'pointer',
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      transition: 'opacity 0.15s',
                    }}
                    onMouseOver={e => (e.currentTarget.style.opacity = '0.86')}
                    onMouseOut={e => (e.currentTarget.style.opacity = '1')}
                  >
                    Acessar a plataforma <ArrowUpRight size={13} />
                  </button>
                </Link>
                <Link to="/auth">
                  <button
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 10,
                      padding: '14px 32px',
                      background: 'transparent', color: BLACK,
                      border: `1px solid ${BORDER}`, cursor: 'pointer',
                      fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      transition: 'border-color 0.15s',
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

      {/* ── FOOTER ── */}
      <footer style={{ background: BLACK, borderTop: '1px solid rgba(255,255,255,0.07)', padding: '28px 40px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 16, height: 1, background: GOLD, opacity: 0.5, display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Arquitetura de Relevância
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
