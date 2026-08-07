import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

/* ── DESIGN TOKENS ── */
const GOLD    = '#C5A880'
const INK     = '#110F0C'
const CREAM   = '#F5F2ED'
const WARM    = '#EDE9E2'
const MID     = '#7A7267'
const LIGHT   = '#FAF9F6'

const serif: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', 'Cormorant', Georgia, serif",
}
const sans: React.CSSProperties = {
  fontFamily: "'Inter', system-ui, sans-serif",
}

function fadeUp(delay = 0): React.ComponentProps<typeof motion.div> {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] },
  }
}

function PrimaryBtn({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <button
        style={{
          ...sans,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '14px 28px',
          background: INK, color: CREAM,
          border: 'none', cursor: 'pointer',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          transition: 'background 0.18s',
        }}
        onMouseOver={e => (e.currentTarget.style.background = '#2A2520')}
        onMouseOut={e => (e.currentTarget.style.background = INK)}
      >
        {children}
      </button>
    </Link>
  )
}

function GhostBtn({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <button
        style={{
          ...sans,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '13px 28px',
          background: 'transparent', color: MID,
          border: `1px solid rgba(17,15,12,0.18)`, cursor: 'pointer',
          fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseOver={e => { e.currentTarget.style.borderColor = INK; e.currentTarget.style.color = INK }}
        onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(17,15,12,0.18)'; e.currentTarget.style.color = MID }}
      >
        {children}
      </button>
    </Link>
  )
}

const PILLARS = [
  {
    label: 'Identidade',
    text: 'Quem você é, o que o diferencia, para quem resolve problemas reais — articulado com precisão.',
  },
  {
    label: 'Pilares',
    text: 'As frentes estratégicas de presença que sustentam sua autoridade ao longo do tempo.',
  },
  {
    label: 'Metas',
    text: 'OKRs trimestrais com ciclo de revisão e plano de ação que avança semana a semana.',
  },
  {
    label: 'Marketing',
    text: 'Agenda editorial e distribuição planejadas para o ano inteiro, não para o próximo post.',
  },
  {
    label: 'Indicadores',
    text: 'KPIs de autoridade e relatórios que mostram evolução real, não apenas números de vaidade.',
  },
]

const PROFILES = [
  { title: 'Especialistas e consultores', desc: 'Que sabem o que fazem mas ainda dependem do boca a boca para crescer.' },
  { title: 'Profissionais em transição',  desc: 'Reposicionando a carreira e construindo autoridade no novo nicho com método.' },
  { title: 'Líderes e executivos',        desc: 'Que querem ampliar presença, influência e impacto além da empresa onde atuam.' },
]

export default function LandingPage() {
  return (
    <div style={{ ...sans, background: LIGHT, color: INK, overflowX: 'hidden' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&display=swap" rel="stylesheet" />

      {/* ── NAV ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(245,242,237,0.92)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(17,15,12,0.08)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '0 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 56,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 20, height: 1, background: GOLD }} />
            <span style={{ ...serif, fontSize: 14, fontWeight: 600, letterSpacing: '0.04em', color: INK }}>
              Arquitetura de Relevância
            </span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {[['Método', '#metodo'], ['Para quem', '#para-quem']].map(([label, href]) => (
              <a key={label} href={href}
                style={{ ...sans, fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: MID, textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseOver={e => (e.currentTarget.style.color = INK)}
                onMouseOut={e => (e.currentTarget.style.color = MID)}
              >
                {label}
              </a>
            ))}
            <Link to="/auth" style={{ textDecoration: 'none' }}>
              <button style={{
                ...sans, padding: '8px 20px',
                background: GOLD, color: '#1A1208',
                border: 'none', cursor: 'pointer',
                fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                transition: 'opacity 0.15s',
              }}
                onMouseOver={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseOut={e => (e.currentTarget.style.opacity = '1')}
              >
                Acessar
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ background: CREAM, minHeight: '86vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 40px 80px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 80, alignItems: 'center' }}>

            {/* Left */}
            <div>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
                style={{ ...sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 28 }}
              >
                Mentoria · Autoridade · Método
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                style={{ ...serif, fontSize: 'clamp(52px, 7vw, 96px)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.02em', color: INK, margin: 0 }}
              >
                O mercado reconhece<br />
                <span style={{ fontStyle: 'italic', color: GOLD }}>quem se posiciona</span><br />
                com clareza.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontSize: 16, lineHeight: 1.8, color: MID, marginTop: 32, maxWidth: 440 }}
              >
                Programa de mentoria individual para profissionais que querem construir autoridade de verdade — com dados, acompanhamento próximo e plano de ação.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginTop: 44, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}
              >
                <PrimaryBtn to="/auth">Acessar a plataforma <ArrowRight size={13} /></PrimaryBtn>
                <a href="#metodo"
                  style={{ ...sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: MID, textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseOver={e => (e.currentTarget.style.color = INK)}
                  onMouseOut={e => (e.currentTarget.style.color = MID)}
                >
                  Ver o método ↓
                </a>
              </motion.div>
            </div>

            {/* Right — stats card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: INK, padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: 40 }}
            >
              {[
                { n: '5',    label: 'Camadas de construção de autoridade' },
                { n: '360°', label: 'Visão estratégica de marca pessoal'  },
                { n: '1:1',  label: 'Acompanhamento individual e próximo' },
              ].map(s => (
                <div key={s.n}>
                  <p style={{ ...serif, fontSize: 52, fontWeight: 300, color: CREAM, lineHeight: 1, margin: 0, letterSpacing: '-0.02em' }}>{s.n}</p>
                  <div style={{ width: 24, height: 1, background: GOLD, margin: '10px 0 8px' }} />
                  <p style={{ ...sans, fontSize: 12, color: 'rgba(245,242,237,0.5)', lineHeight: 1.6, letterSpacing: '0.02em' }}>{s.label}</p>
                </div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── TENSÃO ── */}
      <section style={{ background: INK, padding: '100px 40px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <motion.div {...fadeUp()}>
            <p style={{ ...serif, fontSize: 'clamp(32px, 4.5vw, 58px)', fontWeight: 300, fontStyle: 'italic', color: CREAM, lineHeight: 1.3, letterSpacing: '-0.01em', margin: 0 }}>
              "Você é bom no que faz.
            </p>
            <p style={{ ...serif, fontSize: 'clamp(32px, 4.5vw, 58px)', fontWeight: 300, fontStyle: 'italic', color: GOLD, lineHeight: 1.3, letterSpacing: '-0.01em', margin: 0 }}>
              Quantas pessoas certas sabem disso?"
            </p>
            <div style={{ width: 40, height: 1, background: 'rgba(197,168,128,0.4)', margin: '40px auto 0' }} />
            <p style={{ ...sans, fontSize: 15, color: 'rgba(245,242,237,0.45)', marginTop: 28, lineHeight: 1.8, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
              A maioria dos profissionais competentes fica invisível não por falta de habilidade, mas por falta de método para se posicionar.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MÉTODO ── */}
      <section id="metodo" style={{ background: LIGHT, borderTop: '1px solid rgba(17,15,12,0.07)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '112px 40px' }}>

          <motion.div {...fadeUp()}>
            <p style={{ ...sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>
              Como funciona
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 96, alignItems: 'start' }}>

            <motion.div {...fadeUp(0.1)}>
              <h2 style={{ ...serif, fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em', margin: 0, color: INK }}>
                Cinco camadas.<br />
                <span style={{ fontStyle: 'italic', color: GOLD }}>Uma jornada.</span>
              </h2>
              <p style={{ ...sans, fontSize: 14, lineHeight: 1.85, color: MID, marginTop: 28 }}>
                Cada mentorado evolui dentro de um hub individual, com visão clara do que construir semana a semana.
              </p>
              <div style={{ marginTop: 40 }}>
                <PrimaryBtn to="/auth">Começar agora <ArrowRight size={13} /></PrimaryBtn>
              </div>
            </motion.div>

            <div>
              {PILLARS.map((p, i) => (
                <motion.div key={p.label} {...fadeUp(0.12 + i * 0.06)}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '48px 1fr',
                    gap: 24, padding: '28px 0',
                    borderBottom: i < PILLARS.length - 1 ? '1px solid rgba(17,15,12,0.08)' : 'none',
                    alignItems: 'start',
                  }}>
                    <span style={{ ...sans, fontSize: 11, fontWeight: 700, color: GOLD, paddingTop: 2 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p style={{ ...sans, fontSize: 14, fontWeight: 600, color: INK, marginBottom: 6, letterSpacing: '-0.01em' }}>{p.label}</p>
                      <p style={{ ...sans, fontSize: 13, lineHeight: 1.75, color: MID }}>{p.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── PARA QUEM ── */}
      <section id="para-quem" style={{ background: WARM, borderTop: '1px solid rgba(17,15,12,0.07)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '112px 40px' }}>

          <motion.div {...fadeUp()}>
            <p style={{ ...sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>
              Para quem é
            </p>
            <h2 style={{ ...serif, fontSize: 'clamp(38px, 5vw, 64px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: INK, marginBottom: 64, maxWidth: 580 }}>
              Para quem quer ser <span style={{ fontStyle: 'italic' }}>referência</span>.<br />
              Não só conhecido.
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {PROFILES.map((p, i) => (
              <motion.div key={i} {...fadeUp(0.08 + i * 0.07)}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: 60, padding: '32px 0',
                  borderTop: '1px solid rgba(17,15,12,0.1)',
                  alignItems: 'center',
                }}>
                  <p style={{ ...serif, fontSize: 'clamp(22px, 2.5vw, 30px)', fontWeight: 400, color: INK, margin: 0, lineHeight: 1.25 }}>{p.title}</p>
                  <p style={{ ...sans, fontSize: 14, lineHeight: 1.8, color: MID, margin: 0 }}>{p.desc}</p>
                </div>
              </motion.div>
            ))}
            <div style={{ borderTop: '1px solid rgba(17,15,12,0.1)' }} />
          </div>

        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: INK }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 60, alignItems: 'end' }}>
            <motion.div {...fadeUp()}>
              <p style={{ ...sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 24 }}>
                Faça parte
              </p>
              <h2 style={{ ...serif, fontSize: 'clamp(44px, 6.5vw, 88px)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.025em', color: CREAM, margin: 0 }}>
                Construa autoridade<br />
                <span style={{ fontStyle: 'italic', color: GOLD }}>com método.</span>
              </h2>
            </motion.div>
            <motion.div {...fadeUp(0.14)} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
              <Link to="/auth" style={{ textDecoration: 'none' }}>
                <button style={{
                  ...sans, display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '15px 30px', background: GOLD, color: '#1A1208',
                  border: 'none', cursor: 'pointer',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  transition: 'opacity 0.15s',
                }}
                  onMouseOver={e => (e.currentTarget.style.opacity = '0.84')}
                  onMouseOut={e => (e.currentTarget.style.opacity = '1')}
                >
                  Acessar a plataforma <ArrowRight size={13} />
                </button>
              </Link>
              <Link to="/auth" style={{ textDecoration: 'none' }}>
                <button style={{
                  ...sans, display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '14px 30px', background: 'transparent', color: 'rgba(245,242,237,0.45)',
                  border: '1px solid rgba(245,242,237,0.15)', cursor: 'pointer',
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(245,242,237,0.4)'; e.currentTarget.style.color = CREAM }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(245,242,237,0.15)'; e.currentTarget.style.color = 'rgba(245,242,237,0.45)' }}
                >
                  Solicitar acesso
                </button>
              </Link>
              <p style={{ ...sans, fontSize: 11, color: 'rgba(245,242,237,0.25)', lineHeight: 1.6, maxWidth: 210 }}>
                Acesso restrito aos participantes ativos do programa.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0A0907', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 20, height: 1, background: GOLD, opacity: 0.5 }} />
            <span style={{ ...sans, fontSize: 11, fontWeight: 500, color: 'rgba(245,242,237,0.28)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Arquitetura de Relevância
            </span>
          </div>
          <p style={{ ...sans, fontSize: 11, color: 'rgba(245,242,237,0.18)' }}>
            © {new Date().getFullYear()} Sancho Gestão de Carreiras
          </p>
        </div>
      </footer>
    </div>
  )
}
