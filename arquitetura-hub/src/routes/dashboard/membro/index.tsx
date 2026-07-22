import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, CheckSquare2, Square, ChevronRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/membro/')({
  component: MembroDashboard,
})

const phases = [
  { num: 1, label: 'OKR e MVP',           active: true  },
  { num: 2, label: 'Primeiras Vitórias',  active: false },
  { num: 3, label: 'Plano em Ação',       active: false },
  { num: 4, label: 'Escala',              active: false },
]

const acoesPorFase: Record<number, { texto: string; href?: string }[]> = {
  1: [
    { texto: 'Preencher suas percepções iniciais em Minha Identidade', href: '/dashboard/membro/posicionamento' },
    { texto: 'Revisar os objetivos definidos na última sessão com o mentor', href: '/dashboard/membro/okr' },
    { texto: 'Listar 3 diferenciais que você percebe em si mesmo antes da próxima sessão', href: '/dashboard/membro/posicionamento' },
    { texto: 'Confirmar presença na próxima sessão da mentoria', href: '/dashboard/membro/agenda' },
  ],
  2: [
    { texto: 'Concluir o preenchimento dos 4 pilares da sua marca', href: '/dashboard/membro/posicionamento' },
    { texto: 'Revisar o plano de marketing do mês', href: '/dashboard/membro/marketing' },
    { texto: 'Registrar os aprendizados da última sessão', href: '/dashboard/membro/okr' },
  ],
  3: [
    { texto: 'Atualizar os Key Results do OKR com os dados da semana', href: '/dashboard/membro/okr' },
    { texto: 'Registrar o ciclo PDCA da última ação executada', href: '/dashboard/membro/kpis' },
    { texto: 'Preparar sua história para a sessão de storytelling', href: '/dashboard/membro/posicionamento' },
  ],
  4: [
    { texto: 'Revisar os indicadores do mês e identificar o que escalar', href: '/dashboard/membro/kpis' },
    { texto: 'Atualizar o PDCA ciclo 2 com as aprendizagens acumuladas', href: '/dashboard/membro/kpis' },
    { texto: 'Planejar a próxima ação de autoridade com o mentor', href: '/dashboard/membro/agenda' },
  ],
}

const ferramentas = [
  { label: 'Minha Identidade',  desc: 'Posicionamento e proposta de valor',  href: '/dashboard/membro/posicionamento' },
  { label: 'Pilares da Marca',  desc: 'Ações estratégicas de cada pilar',    href: '/dashboard/membro/pilares'        },
  { label: 'Metas de Impacto',  desc: 'OKRs e resultados-chave',             href: '/dashboard/membro/okr'            },
  { label: 'Tarefas',           desc: 'Ações concretas para avançar',        href: '/dashboard/membro/tarefas'        },
  { label: 'Marketing Anual',   desc: 'Agenda de conteúdo e presença',       href: '/dashboard/membro/marketing'      },
  { label: 'Indicadores',       desc: 'KPIs e dados de crescimento',         href: '/dashboard/membro/kpis'           },
  { label: 'Agenda',            desc: 'Ações de OKR e marketing integradas', href: '/dashboard/membro/agenda'         },
  { label: 'Relatórios',        desc: 'Evolução e histórico de ciclos',      href: '/dashboard/membro/relatorios'     },
]

function MembroDashboard() {
  const { user } = useAuth()
  const firstName = user?.full_name?.split(' ')[0] ?? 'Bem-vindo'
  const faseAtual = phases.find(p => p.active) ?? phases[0]
  const acoes = acoesPorFase[faseAtual.num] ?? acoesPorFase[1]
  const [concluidas, setConcluidas] = useState<Set<number>>(new Set())

  function toggleAcao(i: number) {
    const wasDone = concluidas.has(i)
    setConcluidas(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
    if (!wasDone) toast.success('Ação concluída.')
  }

  const pct = Math.round(((faseAtual.num - 1) / 4) * 100)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', paddingBottom: 48, display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Header */}
      <div style={{ paddingTop: 4 }}>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>Olá, {firstName}</p>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111827', letterSpacing: '-0.01em', margin: 0 }}>
          {user?.full_name}
        </h1>

        {/* Phase progress */}
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: '#6B7280' }}>
              Fase {faseAtual.num} de 4 — {faseAtual.label}
            </span>
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>{pct}% concluído</span>
          </div>
          {/* Progress bar */}
          <div style={{ height: 4, background: '#E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.max(pct, 4)}%`,
              background: '#7B2FBE',
              borderRadius: 2,
              transition: 'width 0.4s ease',
            }} />
          </div>
          {/* Phase labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
            {phases.map(p => (
              <div key={p.num} style={{
                fontSize: 10,
                color: p.active ? '#7B2FBE' : p.num < faseAtual.num ? '#9CA3AF' : '#D1D5DB',
                fontWeight: p.active ? 600 : 400,
                letterSpacing: '0.01em',
              }}>
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Esta semana */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px',
          borderBottom: '1px solid #F3F4F6',
          background: '#FAFAFA',
        }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>Esta semana</p>
            <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0' }}>Fase {faseAtual.num}: {faseAtual.label}</p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 500, color: concluidas.size === acoes.length ? '#16A34A' : '#7B2FBE' }}>
            {concluidas.size}/{acoes.length} concluídas
          </span>
        </div>
        {acoes.map((acao, i) => {
          const feita = concluidas.has(i)
          return (
            <div
              key={i}
              onClick={() => toggleAcao(i)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '11px 20px',
                borderBottom: i < acoes.length - 1 ? '1px solid #F9FAFB' : 'none',
                cursor: 'pointer',
                background: feita ? '#FAFAFA' : '#fff',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (!feita) (e.currentTarget as HTMLDivElement).style.background = '#FAFAFA' }}
              onMouseLeave={e => { if (!feita) (e.currentTarget as HTMLDivElement).style.background = '#fff' }}
            >
              {feita
                ? <CheckSquare2 size={15} style={{ color: '#7B2FBE', flexShrink: 0, marginTop: 2 }} />
                : <Square size={15} style={{ color: '#D1D5DB', flexShrink: 0, marginTop: 2 }} />
              }
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <p style={{
                  fontSize: 13, lineHeight: 1.5, margin: 0,
                  color: feita ? '#9CA3AF' : '#374151',
                  textDecoration: feita ? 'line-through' : 'none',
                }}>
                  {acao.texto}
                </p>
                {!feita && acao.href && (
                  <Link to={acao.href} onClick={e => e.stopPropagation()}>
                    <ChevronRight size={14} style={{ color: '#D1D5DB', flexShrink: 0, marginTop: 2 }} />
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Ferramentas — table-style list */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid #F3F4F6',
          background: '#FAFAFA',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>Ferramentas do programa</p>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>{ferramentas.length} módulos</span>
        </div>

        {/* Column headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 28px',
          padding: '6px 20px',
          borderBottom: '1px solid #F3F4F6',
        }}>
          <span style={{ fontSize: 10, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Módulo</span>
          <span style={{ fontSize: 10, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Descrição</span>
        </div>

        {ferramentas.map((item, i) => (
          <Link key={item.href} to={item.href} style={{ textDecoration: 'none' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 28px',
                alignItems: 'center',
                padding: '10px 20px',
                borderBottom: i < ferramentas.length - 1 ? '1px solid #F9FAFB' : 'none',
                transition: 'background 0.1s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#FAFAFA'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = '#fff'}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{item.label}</span>
              <span style={{ fontSize: 12, color: '#6B7280' }}>{item.desc}</span>
              <ArrowRight size={13} style={{ color: '#D1D5DB' }} />
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}
