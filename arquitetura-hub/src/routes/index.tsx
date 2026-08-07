import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const GOLD        = '#C5A880'
const BLACK       = '#0A0907'
const WHITE       = '#FFFFFF'
const SURFACE     = '#F8F7F5'
const BORDER      = 'rgba(0,0,0,0.08)'
const DARK_BORDER = 'rgba(255,255,255,0.08)'

const serif: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', 'Cormorant', Georgia, serif",
}

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

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: WHITE, color: BLACK }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&display=swap" rel="stylesheet" />

      {/* NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,9,7,0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${DARK_BORDER}` }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
            Arquitetura de Relevância
          </span>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {[['Método', '#metodo'], ['Para quem', '#para-quem']].map(([label, href]) => (
              <a key={label} href={href}
                style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseOver={e => (e.currentTarget.style.color = GOLD)}
                onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
              >
                {label}
              </a>
            ))}
            <Link to="/auth" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '7px 18px', background: GOLD, color: '#1A1208', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'opacity 0.15s' }}
                onMouseOver={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseOut={e => (e.currentTarget.style.opacity = '1')}
              >
                Acessar
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={{ background: BLACK, minHeight: '92vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(rgba(197,168,128,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(197,168,128,0.04) 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '120px 40px', width: '100%', position: 'relative' }}>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: GOLD, marginBottom: 32 }}>
            Mentoria · Autoridade · Método
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{ ...serif, fontSize: 'clamp(52px, 8vw, 120px)', fontWeight: 700, lineHeight: 1.0, letterSpacing: '-0.03em', color: WHITE, margin: 0, maxWidth: 880 }}>
            Relevância real.<br />
            <span style={{ fontStyle: 'italic', color: GOLD }}>Com método.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 17, lineHeight: 1.75, color: 'rgba(255,255,255,0.48)', marginTop: 36, maxWidth: 520 }}>
            Programa de mentoria para profissionais que querem construir autoridade real, com dados, acompanhamento próximo e plano de ação.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <PrimaryBtn to="/auth">Acessar a plataforma <ArrowUpRight size={13} /></PrimaryBtn>
            <a href="#metodo" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseOver={e => (e.currentTarget.style.color = GOLD)}
              onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
            >
              Ver o método ↓
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.55 }}
            style={{ marginTop: 96, display: 'flex', gap: 60, flexWrap: 'wrap' }}>
            {[{ n: '5', label: 'Camadas de construção' }, { n: '360°', label: 'Visão de autoridade' }, { n: '1:1', label: 'Acompanhamento próximo' }].map(s => (
              <div key={s.n}>
                <p style={{ ...serif, fontSize: 42, fontWeight: 700, color: WHITE, lineHeight: 1, margin: 0, letterSpacing: '-0.02em' }}>{s.n}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 8, letterSpacing: '0.04em' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* METODOLOGIA */}
      <section id="metodo" style={{ background: WHITE, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '120px 40px' }}>
          <FadeUp>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 24 }}>Método</p>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
            <FadeUp delay={0.1}>
              <h2 style={{ ...serif, fontSize: 'clamp(42px, 6vw, 80px)', fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.03em', margin: 0 }}>
                Cinco camadas<br /><span style={{ fontStyle: 'italic', color: GOLD }}>de construção.</span>
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(10,9,7,0.5)', marginTop: 32, maxWidth: 380 }}>
                Cada participante evolui dentro de um hub individual, com visão clara do que construir semana a semana.
              </p>
              <div style={{ marginTop: 40 }}>
                <PrimaryBtn to="/auth">Acessar a plataforma <ArrowUpRight size={13} /></PrimaryBtn>
              </div>
            </FadeUp>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {STEPS.map((s, i) => (
                <FadeUp key={s.n} delay={0.15 + i * 0.07}>
                  <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 20, padding: '28px 0', borderBottom: i < STEPS.length - 1 ? `1px solid ${BORDER}` : 'none', alignItems: 'start' }}>
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

      {/* PARA QUEM */}
      <section id="para-quem" style={{ background: BLACK }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '120px 40px' }}>
          <FadeUp>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 24 }}>Para quem é</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 style={{ ...serif, fontSize: 'clamp(38px, 5.5vw, 72px)', fontWeight: 700, lineHeight: 1.06, letterSpacing: '-0.025em', color: WHITE, marginBottom: 72, maxWidth: 680 }}>
              Para quem quer ser <span style={{ fontStyle: 'italic', color: GOLD }}>referência</span>{'. Não só conhecido.'}
            </h2>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: `1px solid ${DARK_BORDER}` }}>
            {PROFILES.map((p, i) => (
              <FadeUp key={i} delay={0.1 + i * 0.09}>
                <div style={{ padding: '48px 36px', borderRight: i < 2 ? `1px solid ${DARK_BORDER}` : 'none', height: '100%' }}>
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

      {/* CTA */}
      <section style={{ background: SURFACE, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '140px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 60, alignItems: 'end' }}>
            <FadeUp>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 28 }}>Faça parte</p>
              <h2 style={{ ...serif, fontSize: 'clamp(44px, 7vw, 96px)', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.03em', margin: 0 }}>
                Construa autoridade<br /><span style={{ fontStyle: 'italic', color: GOLD }}>com método.</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
                <PrimaryBtn to="/auth">Acessar a plataforma <ArrowUpRight size={13} /></PrimaryBtn>
                <Link to="/auth">
                  <button style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 30px', background: 'transparent', color: BLACK, border: `1px solid ${BORDER}`, cursor: 'pointer', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap', transition: 'border-color 0.15s' }}
                    onMouseOver={e => (e.currentTarget.style.borderColor = BLACK)}
                    onMouseOut={e => (e.currentTarget.style.borderColor = BORDER)}
                  >
                    Solicitar acesso
                  </button>
                </Link>
                <p style={{ fontSize: 11, color: 'rgba(10,9,7,0.38)', lineHeight: 1.6, maxWidth: 200 }}>Acesso restrito aos participantes ativos do programa.</p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: BLACK, borderTop: '1px solid rgba(255,255,255,0.07)', padding: '28px 40px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 16, height: 1, background: GOLD, opacity: 0.5, display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Arquitetura de Relevância</span>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.02em' }}>© {new Date().getFullYear()} Sancho Gestão de Carreiras</p>
        </div>
      </footer>
    </div>
  )
}
