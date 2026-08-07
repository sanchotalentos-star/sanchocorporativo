import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ChevronRight, Layers, ChevronDown, ChevronUp } from 'lucide-react'
import { PilarAccordion } from '@/components/membro/PilarAccordion'
import { mockPilares } from '@/lib/mocks/pilares'
import { getIdentidade, PILAR_LABELS } from '@/lib/identidade'
import { JornadaPanorama } from '@/components/membro/JornadaPanorama'
import type { Pilar } from '@/types'

export const Route = createFileRoute('/dashboard/membro/pilares')({
  component: PilaresPage,
})

// ─── Design tokens ────────────────────────────────────────────────
const D = {
  bg:        '#FAFAF9',
  surface:   '#F5F4F2',
  border:    'rgba(26,25,22,0.07)',
  text:      '#1A1916',
  textMid:   '#3A3530',
  textSub:   '#6B6560',
  textMuted: '#8A8680',
  textFaint: '#C5C0BA',
  gold:      '#C5A880',
  serif:     "'Cormorant Garamond', Georgia, serif",
} as const

function HR() {
  return <hr style={{ border: 'none', borderTop: `1px solid ${D.border}`, margin: 0 }} />
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: D.textMuted, margin: 0 }}>
      {children}
    </p>
  )
}

// ─── Breadcrumb ───────────────────────────────────────────────────
const CADEIA = [
  { num: '01', label: 'Identidade', to: '/dashboard/membro/posicionamento' },
  { num: '02', label: 'Pilares',    to: '/dashboard/membro/pilares'        },
  { num: '03', label: 'OKRs',       to: '/dashboard/membro/okr'            },
  { num: '04', label: 'Marketing',  to: '/dashboard/membro/marketing'      },
  { num: '05', label: 'Resultados', to: '/dashboard/membro/kpis'           },
] as const

function Breadcrumb({ active }: { active: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      {CADEIA.map((c, i) => (
        <span key={c.num} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {i > 0 && <ChevronRight size={11} style={{ color: D.textFaint }} />}
          {c.label === active ? (
            <span style={{ fontSize: 11, fontWeight: 600, color: D.gold, letterSpacing: '0.02em' }}>
              {c.num} {c.label}
            </span>
          ) : (
            <Link to={c.to} style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: 11, color: D.textFaint, transition: 'color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = D.textSub }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = D.textFaint }}>
                {c.num} {c.label}
              </span>
            </Link>
          )}
        </span>
      ))}
    </div>
  )
}

// ─── Sugestões geradas da identidade ─────────────────────────────
interface SugestaoPilar {
  id: string; cor: string; nome: string; descricao: string; acoes: string[]
}

function SugestoesDePilares({ onAddPilar }: { onAddPilar: (p: Pilar) => void }) {
  const identidade     = getIdentidade()
  const [open, setOpen] = useState(true)
  const [adicionados, setAdicionados] = useState<Set<string>>(new Set())

  const publicoAlvo    = identidade?.pilares.publicoAlvo?.reflexao?.trim()
  const proposta       = identidade?.pilares.proposta?.reflexao?.trim()
  const storytelling   = identidade?.pilares.storytelling?.reflexao?.trim()
  const formatoProduto = identidade?.pilares.formatoProduto?.reflexao?.trim()
  const diferencial    = identidade?.diferenciais?.[0] ?? ''

  const sugestoes: SugestaoPilar[] = [
    publicoAlvo ? {
      id: 'presenca', cor: '#3B82F6',
      nome: 'Presença Direcionada',
      descricao: `Visibilidade focada em "${publicoAlvo.slice(0, 65)}${publicoAlvo.length > 65 ? '…' : ''}"`,
      acoes: [
        'Publicar 2 conteúdos por semana falando diretamente para seu público',
        'Participar de 1 comunidade ou evento onde seu público-alvo está presente',
        'Produzir 1 conteúdo/mês respondendo as principais dúvidas do mercado',
      ],
    } : null,
    proposta ? {
      id: 'autoridade', cor: D.gold,
      nome: 'Autoridade pela Entrega',
      descricao: `Demonstrar como você entrega "${proposta.slice(0, 65)}${proposta.length > 65 ? '…' : ''}"`,
      acoes: [
        'Publicar 1 case de resultado real por mês com dados e aprendizados',
        'Criar série de conteúdo explicando seu método e processo de trabalho',
        'Documentar os bastidores e compartilhar o "como funciona"',
      ],
    } : null,
    (storytelling || diferencial) ? {
      id: 'diferenciacao', cor: '#F59E0B',
      nome: 'Diferenciação e História',
      descricao: diferencial
        ? `Posicionar "${diferencial.slice(0, 65)}${diferencial.length > 65 ? '…' : ''}" como vantagem única`
        : 'Usar sua história como âncora de credibilidade e identificação',
      acoes: [
        'Publicar sua história de origem e por que você faz o que faz',
        'Criar conteúdo mostrando sua abordagem única em comparação ao mercado',
        'Coletar e compartilhar depoimentos que reforçam seu diferencial',
      ],
    } : null,
    formatoProduto ? {
      id: 'pipeline', cor: '#10B981',
      nome: 'Pipeline de Clientes',
      descricao: `Criar caminho de atração para "${formatoProduto.slice(0, 65)}${formatoProduto.length > 65 ? '…' : ''}"`,
      acoes: [
        'Criar conteúdo gratuito que leva naturalmente à sua oferta principal',
        'Construir lista de potenciais clientes para abordagem direta',
        'Produzir 1 conteúdo/mês demonstrando como funciona seu formato de trabalho',
      ],
    } : null,
  ].filter(Boolean) as SugestaoPilar[]

  if (sugestoes.length === 0) return null

  function usar(s: SugestaoPilar) {
    const novo: Pilar = {
      id: `sug-${s.id}-${Date.now()}`,
      user_id: 'local',
      nome: s.nome,
      descricao: s.descricao,
      cor: s.cor,
      ordem: 0,
      acoes: s.acoes.map((texto, i) => ({
        id: `a-${Date.now()}-${i}`,
        pilar_id: `sug-${s.id}`,
        texto,
        concluida: false,
        ordem: i + 1,
      })),
    }
    onAddPilar(novo)
    setAdicionados(prev => new Set([...prev, s.id]))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <HR />
      <div style={{ padding: '20px 0' }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SectionLabel>Sugestões geradas da sua identidade</SectionLabel>
            <p style={{ fontSize: 12, color: D.textMuted, margin: 0 }}>
              Frentes estratégicas a partir dos blocos que você preencheu
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: D.gold }}>{sugestoes.length} frentes</span>
            {open
              ? <ChevronUp size={13} style={{ color: D.textFaint }} />
              : <ChevronDown size={13} style={{ color: D.textFaint }} />
            }
          </div>
        </button>

        {open && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {sugestoes.map((s, i) => {
              const adicionado = adicionados.has(s.id)
              return (
                <div key={s.id}>
                  {i > 0 && <HR />}
                  <div style={{ padding: '14px 0', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%', background: s.cor,
                      flexShrink: 0, marginTop: 6,
                    }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                        <p style={{ fontSize: 14, fontWeight: 500, color: D.text, margin: 0 }}>{s.nome}</p>
                        <button
                          onClick={() => !adicionado && usar(s)}
                          disabled={adicionado}
                          style={{
                            fontSize: 11, fontWeight: 500,
                            color: adicionado ? D.textFaint : D.gold,
                            background: 'none', border: 'none', cursor: adicionado ? 'default' : 'pointer',
                            flexShrink: 0, padding: 0,
                          }}
                        >
                          {adicionado ? '✓ Adicionado' : 'Usar como pilar →'}
                        </button>
                      </div>
                      <p style={{ fontSize: 12, color: D.textSub, margin: 0, lineHeight: 1.5 }}>{s.descricao}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {s.acoes.map((acao, j) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <span style={{ width: 3, height: 3, borderRadius: '50%', background: D.textFaint, flexShrink: 0, marginTop: 7 }} />
                            <p style={{ fontSize: 11, color: D.textMuted, margin: 0, lineHeight: 1.5 }}>{acao}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            <p style={{ fontSize: 11, color: D.textFaint, marginTop: 8 }}>
              Estes pilares são pontos de partida. Na sessão com seu mentor, vocês refinam e personalizam cada frente.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────
function PilaresPage() {
  const [pilares, setPilares] = useState<Pilar[]>(mockPilares)
  const [identidadeOpen, setIdentidadeOpen] = useState(true)
  const identidade = getIdentidade()
  const pilarFields = ['publicoAlvo', 'proposta', 'storytelling', 'formatoProduto'] as const
  const identidadePreenchida = identidade
    ? pilarFields.filter(f => identidade.pilares[f]?.reflexao?.trim()).length
    : 0

  function handleToggleAcao(pilarId: string, acaoId: string, concluida: boolean) {
    setPilares(prev => prev.map(p => {
      if (p.id !== pilarId) return p
      return { ...p, acoes: p.acoes.map(a => a.id === acaoId ? { ...a, concluida } : a) }
    }))
  }
  function handleAddAcao(pilarId: string, texto: string) {
    setPilares(prev => prev.map(p => {
      if (p.id !== pilarId) return p
      const newAcao = { id: `a-${Date.now()}`, pilar_id: pilarId, texto, concluida: false, ordem: p.acoes.length + 1 }
      return { ...p, acoes: [...p.acoes, newAcao] }
    }))
  }
  function handleAddPilar(pilar: Pilar) {
    setPilares(prev => [...prev, { ...pilar, ordem: prev.length + 1 }])
  }
  function handleDeleteAcao(pilarId: string, acaoId: string) {
    setPilares(prev => prev.map(p => {
      if (p.id !== pilarId) return p
      return { ...p, acoes: p.acoes.filter(a => a.id !== acaoId) }
    }))
  }
  function handleEditAcao(pilarId: string, acaoId: string, texto: string) {
    setPilares(prev => prev.map(p => {
      if (p.id !== pilarId) return p
      return { ...p, acoes: p.acoes.map(a => a.id === acaoId ? { ...a, texto } : a) }
    }))
  }
  function handleEditPilar(pilarId: string, patch: Partial<Pick<Pilar, 'nome' | 'descricao'>>) {
    setPilares(prev => prev.map(p => p.id === pilarId ? { ...p, ...patch } : p))
  }
  function handleDeletePilar(pilarId: string) {
    setPilares(prev => prev.filter(p => p.id !== pilarId))
  }

  const totalAcoes  = pilares.reduce((s, p) => s + p.acoes.length, 0)
  const doneAcoes   = pilares.reduce((s, p) => s + p.acoes.filter(a => a.concluida).length, 0)
  const overallPct  = totalAcoes > 0 ? Math.round((doneAcoes / totalAcoes) * 100) : 0

  return (
    <div style={{ maxWidth: 860, padding: '48px 0 80px', display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Panorama da Jornada ── */}
      <JornadaPanorama atual="Pilares" />

      {/* ── Breadcrumb ── */}
      <Breadcrumb active="Pilares" />

      {/* ── Heading ── */}
      <div style={{ padding: '24px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h1 style={{
            fontFamily: D.serif,
            fontSize: 'clamp(36px, 4.5vw, 52px)',
            fontWeight: 400,
            color: D.text,
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}>
            Pilares da Marca
          </h1>
          <p style={{ fontSize: 14, color: D.textSub, margin: 0, lineHeight: 1.6 }}>
            Definidos com seu mentor a partir da sua identidade. Cada pilar traduz quem você é em ações concretas de presença
          </p>
        </div>
        {/* Progresso inline */}
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <p style={{
            fontFamily: D.serif,
            fontSize: 36,
            color: overallPct === 100 ? '#6BA36B' : D.gold,
            margin: 0,
            lineHeight: 1,
          }}>
            {overallPct}%
          </p>
          <p style={{ fontSize: 11, color: D.textFaint, margin: '2px 0 0' }}>
            {doneAcoes}/{totalAcoes} ações
          </p>
        </div>
      </div>

      {/* ── Identidade de Base — sem card, só accordion leve ── */}
      <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 0 }}>
        <HR />
        <div style={{ padding: '0' }}>
          <button
            onClick={() => setIdentidadeOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              padding: '16px 0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: D.serif, fontSize: 13, color: D.gold, fontStyle: 'italic' }}>01</span>
              <p style={{ fontSize: 14, fontWeight: 500, color: D.text, margin: 0 }}>Identidade de Marca</p>
              {identidadePreenchida > 0 && (
                <span style={{ fontSize: 11, color: D.textMuted }}>{identidadePreenchida}/4 blocos</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: D.textFaint }}>Base de construção dos pilares</span>
              {identidadeOpen
                ? <ChevronUp size={13} style={{ color: D.textFaint }} />
                : <ChevronDown size={13} style={{ color: D.textFaint }} />
              }
            </div>
          </button>

          {identidadeOpen && (
            <div style={{ paddingBottom: 16 }}>
              {identidadePreenchida === 0 ? (
                <div style={{ padding: '16px 0' }}>
                  <p style={{ fontSize: 13, color: D.textFaint, margin: '0 0 8px' }}>
                    Nenhuma reflexão preenchida ainda.
                  </p>
                  <Link to="/dashboard/membro/posicionamento" style={{ textDecoration: 'none' }}>
                    <span style={{ fontSize: 13, color: D.gold }}>
                      Preencher Minha Identidade →
                    </span>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {pilarFields.map((field, i) => {
                    const texto = identidade?.pilares[field]?.reflexao?.trim()
                    return (
                      <div key={field} style={{
                        display: 'grid',
                        gridTemplateColumns: '120px 1fr',
                        gap: 16,
                        padding: '12px 0',
                        borderTop: i > 0 ? `1px solid ${D.border}` : 'none',
                      }}>
                        <p style={{ fontSize: 11, color: D.textMuted, margin: 0, paddingTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
                          {PILAR_LABELS[field]}
                        </p>
                        {texto
                          ? <p style={{ fontSize: 13, color: D.textMid, margin: 0, lineHeight: 1.6 }}>{texto}</p>
                          : <p style={{ fontSize: 13, color: D.textFaint, margin: 0, fontStyle: 'italic' }}>Não preenchido</p>
                        }
                      </div>
                    )
                  })}
                  {identidade && identidade.diferenciais.some(d => d.trim()) && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '120px 1fr',
                      gap: 16,
                      padding: '12px 0',
                      borderTop: `1px solid ${D.border}`,
                    }}>
                      <p style={{ fontSize: 11, color: D.textMuted, margin: 0, paddingTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
                        Diferenciais
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {identidade.diferenciais.filter(d => d.trim()).map((d, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: D.gold, flexShrink: 0, marginTop: 6 }} />
                            <p style={{ fontSize: 13, color: D.textMid, margin: 0 }}>{d}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ paddingTop: 8, textAlign: 'right' }}>
                    <Link to="/dashboard/membro/posicionamento" style={{ textDecoration: 'none' }}>
                      <span style={{ fontSize: 12, color: D.gold, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        Editar identidade <ChevronRight size={11} />
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Sugestões baseadas na identidade ── */}
      <SugestoesDePilares onAddPilar={handleAddPilar} />

      {/* ── Pilares ── */}
      <div style={{ marginTop: 12 }}>
        {pilares.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <Layers size={28} style={{ color: D.textFaint, margin: '0 auto 12px' }} />
            <p style={{ fontSize: 14, fontWeight: 500, color: D.textSub, margin: '0 0 4px' }}>
              Pilares ainda não definidos
            </p>
            <p style={{ fontSize: 12, color: D.textFaint, margin: '0 0 16px', maxWidth: 320, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
              Os pilares da sua marca são construídos com seu mentor a partir da identidade definida na sessão de posicionamento.
            </p>
            <Link to="/dashboard/membro/posicionamento" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: 13, color: D.gold }}>Ir para Minha Identidade →</span>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pilares.map(pilar => (
              <PilarAccordion
                key={pilar.id}
                pilar={pilar}
                onToggleAcao={handleToggleAcao}
                onAddAcao={handleAddAcao}
                onDeleteAcao={handleDeleteAcao}
                onEditAcao={handleEditAcao}
                onEditPilar={handleEditPilar}
                onDeletePilar={handleDeletePilar}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Esta construção alimenta — plain links ── */}
      <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 0 }}>
        <HR />
        <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <SectionLabel>Esta construção alimenta</SectionLabel>
          {[
            { to: '/dashboard/membro/okr',       num: '03', label: 'OKRs & Metas',   desc: 'Os pilares definem onde você quer ter presença e autoridade. As metas OKR traduzem isso em objetivos mensuráveis.' },
            { to: '/dashboard/membro/marketing',  num: '04', label: 'Marketing Anual', desc: 'Cada pilar define um eixo de conteúdo e presença. O calendário é construído sobre essas frentes.' },
          ].map((link, i) => (
            <div key={link.to}>
              {i > 0 && <HR />}
              <Link to={link.to} style={{ textDecoration: 'none' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', cursor: 'pointer', transition: 'opacity 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0.6' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1' }}
                >
                  <span style={{ fontFamily: D.serif, fontSize: 13, color: D.gold, fontStyle: 'italic', width: 20, flexShrink: 0 }}>{link.num}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: D.text, margin: 0 }}>{link.label}</p>
                    <p style={{ fontSize: 12, color: D.textMuted, margin: '2px 0 0', lineHeight: 1.5 }}>{link.desc}</p>
                  </div>
                  <ChevronRight size={14} style={{ color: D.textFaint, flexShrink: 0 }} />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
