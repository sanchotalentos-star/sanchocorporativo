import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const GOLD = '#C5A880'
const GOLD_DIM = 'rgba(197,168,128,0.55)'
const BG = '#0F0D0C'
const SURFACE = '#161412'
const BORDER = 'rgba(255,255,255,0.07)'
const TEXT = '#EFECE6'
const TEXT_DIM = 'rgba(239,236,230,0.38)'
const TEXT_MID = 'rgba(239,236,230,0.62)'

const serif: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', 'Cormorant', Georgia, 'Times New Roman', serif",
}

const STEPS = [
  { n: '01', label: 'Identidade', desc: 'Quem você é, para quem fala, o que entrega de diferente.' },
  { n: '02', label: 'Pilares', desc: 'As frentes estratégicas de presença e autoridade no mercado.' },
  { n: '03', label: 'Metas', desc: 'OKRs trimestrais com plano de ação e ciclo de revisão.' },
  { n: '04', label: 'Marketing', desc: 'Agenda editorial e distribuição ao longo do ano.' },
  { n: '05', label: 'Indicadores', desc: 'KPIs de autoridade e relatórios de evolução contínua.' },
]

const PROFILES = [
  { perfil: 'Especialistas e consultores', desc: 'Que querem ser reconhecidos pelo que sabem e atrair os clientes certos de forma consistente.' },
  { perfil: 'Profissionais em transição', desc: 'Reposicionando a carreira e construindo autoridade no novo nicho com método.' },
  { perfil: 'Líderes e executivos', desc: 'Que querem ampliar presença, influência e impacto além da empresa onde atuam.' },
]

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: BG, color: TEXT, minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Webfont */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet" />

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: `1px solid ${BORDER}`,
        backgroundColor: 'rgba(15,13,12,0.95)',
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 40px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: GOLD, display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(239,236,230,0.7)' }}>
              Arquitetura de Relevância
            </span>
          </div>
          <Link to="/auth">
            <button
              style={{
                padding: '7px 20px',
                background: 'transparent',
                color: GOLD,
                border: `1px solid rgba(197,168,128,0.3)`,
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'all 0.15s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(197,168,128,0.08)'; e.currentTarget.style.borderColor = GOLD }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(197,168,128,0.3)' }}
            >
              Entrar
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop: 140, paddingBottom: 120, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 40px' }}>

          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 48 }}>
            Programa de Mentoria
          </p>

          <h1 style={{
            ...serif,
            fontSize: 'clamp(52px, 8vw, 104px)',
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
            marginBottom: 0,
            maxWidth: 860,
          }}>
            Arquitetura
            <br />
            <span style={{ fontStyle: 'italic', color: GOLD }}>de Relevância</span>
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 80, marginTop: 72, alignItems: 'end' }}>
            <div>
              <div style={{ width: 40, height: 1, background: 'rgba(197,168,128,0.4)', marginBottom: 28 }} />
              <p style={{ fontSize: 16, lineHeight: 1.85, color: TEXT_MID, maxWidth: 520 }}>
                Um programa de mentoria para profissionais que querem construir
                autoridade real — com método, dados e acompanhamento próximo.
              </p>
            </div>
            <div>
              <Link to="/auth">
                <button
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%',
                    padding: '16px 24px',
                    background: GOLD,
                    color: '#1A1208',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
                  onMouseOut={e => e.currentTarget.style.opacity = '1'}
                >
                  Acessar a plataforma
                  <ArrowRight size={14} />
                </button>
              </Link>
              <p style={{ fontSize: 11, color: TEXT_DIM, marginTop: 14, lineHeight: 1.6 }}>
                Acesso restrito aos participantes ativos do programa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Metodologia ── */}
      <section style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '88px 40px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 80, alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD_DIM, marginBottom: 20 }}>Método</p>
              <h2 style={{ ...serif, fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 24 }}>
                Cinco camadas de construção.
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: TEXT_DIM }}>
                Cada participante evolui dentro de um hub individual, com visão clara
                do que construir semana a semana.
              </p>
            </div>

            <div>
              {STEPS.map((s, i) => (
                <div key={s.n} style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr',
                  gap: 24,
                  padding: '24px 0',
                  borderBottom: i < STEPS.length - 1 ? `1px solid ${BORDER}` : 'none',
                  alignItems: 'start',
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: '0.1em', paddingTop: 2 }}>{s.n}</span>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: TEXT, marginBottom: 6 }}>{s.label}</p>
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Para quem ── */}
      <section style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '88px 40px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD_DIM, marginBottom: 20 }}>Para quem é</p>
          <h2 style={{ ...serif, fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 56, maxWidth: 560 }}>
            Para quem quer ser referência — não só conhecido.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: `1px solid ${BORDER}` }}>
            {PROFILES.map((item, i) => (
              <div key={i} style={{
                padding: '40px 32px',
                borderRight: i < 2 ? `1px solid ${BORDER}` : 'none',
              }}>
                <div style={{ width: 20, height: 1, background: GOLD, marginBottom: 24, opacity: 0.5 }} />
                <p style={{ fontSize: 15, fontWeight: 600, color: TEXT, marginBottom: 12, lineHeight: 1.4 }}>{item.perfil}</p>
                <p style={{ fontSize: 13, lineHeight: 1.75, color: TEXT_DIM }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '100px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 60, alignItems: 'end' }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD_DIM, marginBottom: 24 }}>Faça parte</p>
              <h2 style={{
                ...serif,
                fontSize: 'clamp(32px, 5vw, 68px)',
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-0.025em',
                maxWidth: 620,
              }}>
                Construa autoridade com{' '}
                <span style={{ fontStyle: 'italic', color: GOLD }}>método e dados.</span>
              </h2>
            </div>
            <Link to="/auth">
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 28px',
                  background: 'transparent',
                  color: GOLD,
                  border: `1px solid rgba(197,168,128,0.35)`,
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(197,168,128,0.08)'; e.currentTarget.style.borderColor = GOLD }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(197,168,128,0.35)' }}
              >
                Solicitar acesso <ArrowRight size={13} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '24px 40px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: GOLD, display: 'inline-block', opacity: 0.5 }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(239,236,230,0.2)', letterSpacing: '0.06em' }}>Arquitetura de Relevância</span>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(239,236,230,0.14)', letterSpacing: '0.02em' }}>
            © {new Date().getFullYear()} Sancho Gestão de Carreiras
          </p>
        </div>
      </footer>
    </div>
  )
}
