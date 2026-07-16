import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const stats = [
  { value: '4', label: 'Pilares estratégicos' },
  { value: '12', label: 'Semanas de programa' },
  { value: '360°', label: 'Visão de autoridade' },
  { value: 'Real', label: 'Dados de crescimento' },
]

const modules = [
  { id: '01', title: 'Dashboard de KPIs', desc: 'Indicadores de autoridade em tempo real — alcance, leads e conversões acompanhados semana a semana.' },
  { id: '02', title: 'Pilares Estratégicos', desc: 'As dimensões da sua arquitetura de relevância com ações práticas e mensuráveis para cada fase.' },
  { id: '03', title: 'Agenda Editorial', desc: 'Planejamento de conteúdo, eventos e atividades de mídia em um calendário visual integrado.' },
  { id: '04', title: 'Relatórios de Evolução', desc: 'Análise da sua trajetória com comparativos mensais e visão do seu posicionamento no programa.' },
]

const testimonials = [
  { text: 'Em 3 meses aumentei meu alcance orgânico de 1.200 para 4.800 pessoas. O método funciona.', name: 'Ana Lima', role: 'Consultora de Marketing' },
  { text: 'O dashboard me ajudou a ver onde estava perdendo oportunidades. Meus leads triplicaram.', name: 'João Santos', role: 'Advogado Empresarial' },
  { text: 'Sou referência no meu nicho agora. O programa estruturou o que eu já sabia fazer, mas não divulgava.', name: 'Maria Oliveira', role: 'Médica Especialista' },
]

const serif: React.CSSProperties = { fontFamily: "Georgia, 'Times New Roman', serif" }
const sans: React.CSSProperties  = { fontFamily: "system-ui, -apple-system, sans-serif" }

function LandingPage() {
  return (
    <div style={{ ...sans, backgroundColor: '#0F1117', color: '#ffffff', minHeight: '100vh' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: 'rgba(15,17,23,0.96)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, backgroundColor: '#7B2FBE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: 11, fontWeight: 900, letterSpacing: '0.05em' }}>AR</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.01em', color: 'white' }}>Arquitetura de Relevância</span>
          </div>
          <Link to="/auth">
            <button style={{
              padding: '9px 22px', backgroundColor: '#7B2FBE', color: 'white',
              border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#6a1fa8')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = '#7B2FBE')}
            >
              Entrar
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop: 160, paddingBottom: 100, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p style={{ ...sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7B2FBE', marginBottom: 32 }}>
              Arquitetura de Relevância
            </p>

            <h1 style={{
              ...serif,
              fontSize: 'clamp(52px, 8vw, 96px)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: 40,
              maxWidth: 820,
              textWrap: 'balance',
            } as React.CSSProperties}>
              Arquitetura de{' '}
              <span style={{ color: '#7B2FBE' }}>Relevância</span>
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 640 }}>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', maxWidth: 520 }}>
                Acompanhe seus KPIs de autoridade, gerencie seus pilares estratégicos e execute sua agenda de visibilidade, tudo em um único hub.
              </p>
              <div>
                <Link to="/auth">
                  <button style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '14px 32px', backgroundColor: '#7B2FBE', color: 'white',
                    border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = '#6a1fa8')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = '#7B2FBE')}
                  >
                    Acessar a Plataforma <ArrowRight size={15} />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats strip */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            marginTop: 80,
          }}>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                style={{
                  padding: '28px 0',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  paddingRight: 32,
                  paddingLeft: i === 0 ? 0 : 32,
                }}
              >
                <p style={{ ...serif, fontSize: 36, fontWeight: 700, color: '#ffffff', lineHeight: 1, marginBottom: 6 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── O Programa ── */}
      <section style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, padding: '80px 0' }}>

            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7B2FBE', marginBottom: 20 }}>O Programa</p>
              <h2 style={{ ...serif, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 24, textWrap: 'balance' } as React.CSSProperties}>
                Uma metodologia para construir autoridade com consistência.
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>
                O programa de Arquitetura de Relevância combina diagnóstico de posicionamento, execução estruturada e acompanhamento com dados reais. Cada participante evolui dentro de um hub individual, com visão clara da sua construção semana a semana.
              </p>
              <Link to="/auth">
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7B2FBE', cursor: 'pointer', borderBottom: '1px solid #7B2FBE', paddingBottom: 2 }}>
                  Solicitar acesso
                </span>
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {modules.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  style={{
                    display: 'flex', gap: 24,
                    padding: '24px 0',
                    borderTop: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#7B2FBE', letterSpacing: '0.05em', flexShrink: 0, paddingTop: 2 }}>{m.id}</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, letterSpacing: '0.01em' }}>{m.title}</p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Depoimentos ── */}
      <section style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 40px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 56 }}>Resultados dos participantes</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
              >
                <p style={{ ...serif, fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
                  <p style={{ fontWeight: 700, fontSize: 13 }}>{t.name}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 48, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7B2FBE', marginBottom: 20 }}>Faça parte</p>
              <h2 style={{ ...serif, fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', maxWidth: 560, textWrap: 'balance' } as React.CSSProperties}>
                Construa autoridade real com método e dados.
              </h2>
            </div>
            <Link to="/auth">
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '16px 36px', backgroundColor: '#7B2FBE', color: 'white',
                border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0,
                transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#6a1fa8')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '#7B2FBE')}
              >
                Solicitar Acesso <ArrowRight size={15} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '28px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 20, height: 20, backgroundColor: '#7B2FBE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: 8, fontWeight: 900 }}>AR</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Arquitetura de Relevância Hub</span>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>© {new Date().getFullYear()} Sancho Gestão de Carreiras</p>
        </div>
      </footer>

    </div>
  )
}
