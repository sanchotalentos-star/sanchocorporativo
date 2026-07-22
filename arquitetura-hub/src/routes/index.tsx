import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const serif: React.CSSProperties = { fontFamily: "Georgia, 'Times New Roman', serif" }

function LandingPage() {
  return (
    <div style={{ backgroundColor: '#0D0D0D', color: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        backgroundColor: 'rgba(13,13,13,0.96)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.01em', color: 'rgba(255,255,255,0.9)' }}>
            Arquitetura de Relevância
          </span>
          <Link to="/auth">
            <button
              style={{
                padding: '7px 18px',
                background: 'transparent',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.14)',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.03em',
                transition: 'all 0.15s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = '#fff' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
            >
              Entrar
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 156, paddingBottom: 112, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7B2FBE', marginBottom: 40 }}>
            Programa de Mentoria
          </p>
          <h1 style={{
            ...serif,
            fontSize: 'clamp(46px, 7vw, 84px)',
            fontWeight: 700,
            lineHeight: 1.06,
            letterSpacing: '-0.025em',
            marginBottom: 32,
            maxWidth: 720,
          }}>
            Arquitetura de{' '}
            <span style={{ color: '#7B2FBE' }}>Relevância</span>
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.42)', maxWidth: 460, marginBottom: 44 }}>
            Um programa de mentoria para profissionais que querem construir autoridade real, com método, dados e acompanhamento próximo.
          </p>
          <Link to="/auth">
            <button
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '13px 28px',
                background: '#7B2FBE',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.03em',
                transition: 'background 0.15s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#6823a8'}
              onMouseOut={e => e.currentTarget.style.background = '#7B2FBE'}
            >
              Acessar a plataforma <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </section>

      {/* O Programa */}
      <section style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '88px 32px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start',
        }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7B2FBE', marginBottom: 20 }}>O Programa</p>
            <h2 style={{
              ...serif,
              fontSize: 'clamp(24px, 3vw, 38px)',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: 24,
            }}>
              Uma metodologia para construir autoridade com consistência.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.42)', marginBottom: 24 }}>
              Cada participante evolui dentro de um hub individual, com visão clara do que construir semana a semana: identidade, pilares, metas, execução e dados reais.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.42)', marginBottom: 36 }}>
              O acompanhamento é próximo. Cada sessão tem entregáveis claros, e o hub mantém tudo organizado em um único lugar.
            </p>
            <Link to="/auth">
              <span style={{ fontSize: 12, fontWeight: 600, color: '#7B2FBE', cursor: 'pointer', letterSpacing: '0.03em', borderBottom: '1px solid #7B2FBE', paddingBottom: 2 }}>
                Solicitar acesso
              </span>
            </Link>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { label: 'Identidade de Marca', desc: 'Quem você é, para quem fala, o que entrega de diferente. O ponto de partida de toda a jornada.' },
              { label: 'Pilares Estratégicos', desc: 'As frentes de construção de presença: conteúdo, relacionamento, produto e visibilidade.' },
              { label: 'Metas de Impacto', desc: 'OKRs e Key Results por trimestre, com plano de ação e ciclo de revisão contínua.' },
              { label: 'Execução e Indicadores', desc: 'Agenda editorial, KPIs de autoridade e relatórios de evolução ao longo do programa.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '26px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 8 }}>{item.label}</p>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.35)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para quem */}
      <section style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '88px 32px' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7B2FBE', marginBottom: 20 }}>Para quem é</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { perfil: 'Especialistas e consultores', desc: 'Que querem ser reconhecidos pelo que sabem e atrair clientes de forma orgânica.' },
              { perfil: 'Profissionais em transição', desc: 'Que estão reposicionando a carreira e precisam construir autoridade no novo nicho.' },
              { perfil: 'Líderes e executivos', desc: 'Que querem consolidar sua presença no mercado e ampliar seu círculo de influência.' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '40px 28px',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.82)', marginBottom: 12 }}>{item.perfil}</p>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.35)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '88px 32px',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 48, flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7B2FBE', marginBottom: 20 }}>Faça parte</p>
            <h2 style={{
              ...serif,
              fontSize: 'clamp(26px, 4vw, 48px)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              maxWidth: 500,
            }}>
              Construa autoridade real com método e dados.
            </h2>
          </div>
          <Link to="/auth">
            <button
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '13px 28px',
                background: '#7B2FBE',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.03em',
                flexShrink: 0,
                transition: 'background 0.15s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#6823a8'}
              onMouseOut={e => e.currentTarget.style.background = '#7B2FBE'}
            >
              Solicitar acesso <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.22)' }}>Arquitetura de Relevância</span>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.16)' }}>© {new Date().getFullYear()} Sancho Gestão de Carreiras</p>
        </div>
      </footer>
    </div>
  )
}
