import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Cell,
  ResponsiveContainer, Tooltip, CartesianGrid,
} from 'recharts'

export const Route = createFileRoute('/dashboard/membro/relatorios')({
  component: RelatoriosPage,
})

/* ─────────────────────────────────────────────
   TIPOS
───────────────────────────────────────────── */
interface KeyResult {
  id: string
  descricao: string
  meta: number
  atual: number
  unit: string
}

interface Objective {
  id: string
  titulo: string
  categoria: string
  trimestre: string
  keyResults: KeyResult[]
}

interface Tarefa {
  id: string
  descricao: string
  krId: string
  okrId: string
  status: 'pendente' | 'em_andamento' | 'feita' | 'bloqueada'
  prioridade: string
}

/* ─────────────────────────────────────────────
   PALETA POR CATEGORIA (fixa por identidade)
───────────────────────────────────────────── */
const catColor: Record<string, string> = {
  Autoridade: '#7B2FBE',
  Receita:    '#10B981',
  Alcance:    '#3B82F6',
  Produto:    '#F59E0B',
}

const catBg: Record<string, string> = {
  Autoridade: 'rgba(123,47,190,0.09)',
  Receita:    'rgba(16,185,129,0.09)',
  Alcance:    'rgba(59,130,246,0.09)',
  Produto:    'rgba(245,158,11,0.09)',
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function pct(atual: number, meta: number) {
  if (!meta) return 0
  return Math.min(100, Math.round((atual / meta) * 100))
}

function objPct(obj: Objective) {
  if (!obj.keyResults.length) return 0
  const sum = obj.keyResults.reduce((s, kr) => s + pct(kr.atual, kr.meta), 0)
  return Math.round(sum / obj.keyResults.length)
}

/* ─────────────────────────────────────────────
   TOOLTIP DO GRÁFICO
───────────────────────────────────────────── */
function KrTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: 6,
      padding: '8px 12px',
      fontSize: 12,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      maxWidth: 240,
    }}>
      <p style={{ fontWeight: 600, color: '#111827', marginBottom: 4, lineHeight: 1.4 }}>{d.fullLabel}</p>
      <p style={{ color: '#6B7280', margin: 0 }}>
        {d.atual} / {d.meta} {d.unit}
        {' '}—{' '}
        <span style={{ color: d.color, fontWeight: 600 }}>{d.value}%</span>
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────────
   PÁGINA
───────────────────────────────────────────── */
function RelatoriosPage() {
  const [okrs, setOkrs] = useState<Objective[]>([])
  const [tarefas, setTarefas] = useState<Tarefa[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('okr_store_v1')
      if (raw) setOkrs(JSON.parse(raw))
    } catch {}
    try {
      const raw = localStorage.getItem('tarefas_store_v1')
      if (raw) setTarefas(JSON.parse(raw))
    } catch {}
  }, [])

  /* ── Métricas gerais ── */
  const totalKrs       = okrs.reduce((s, o) => s + o.keyResults.length, 0)
  const tarefasFeitas  = tarefas.filter(t => t.status === 'feita').length
  const progGeral      = okrs.length
    ? Math.round(okrs.reduce((s, o) => s + objPct(o), 0) / okrs.length)
    : 0

  /* ── Dados para o gráfico de barras ── */
  const barData = okrs.flatMap(o =>
    o.keyResults.map(kr => ({
      label:     kr.descricao.length > 22 ? kr.descricao.slice(0, 22) + '…' : kr.descricao,
      fullLabel: kr.descricao,
      value:     pct(kr.atual, kr.meta),
      atual:     kr.atual,
      meta:      kr.meta,
      unit:      kr.unit,
      color:     catColor[o.categoria] ?? '#7B2FBE',
    }))
  )

  /* ── Tarefas por OKR ── */
  const tasksByOkr = okrs
    .map(o => {
      const ots = tarefas.filter(t => t.okrId === o.id)
      return {
        id:           o.id,
        titulo:       o.titulo,
        categoria:    o.categoria,
        feitas:       ots.filter(t => t.status === 'feita').length,
        em_andamento: ots.filter(t => t.status === 'em_andamento').length,
        pendentes:    ots.filter(t => t.status === 'pendente').length,
        bloqueadas:   ots.filter(t => t.status === 'bloqueada').length,
        total:        ots.length,
      }
    })
    .filter(x => x.total > 0)

  /* ── Estado vazio ── */
  if (okrs.length === 0) {
    return (
      <div style={{ maxWidth: 860, margin: '0 auto', paddingBottom: 48 }}>
        <div style={{ paddingTop: 4, marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111827', margin: 0, letterSpacing: '-0.01em' }}>
            Painel de Metas
          </h1>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
            Progresso dos seus OKRs e resultados-chave
          </p>
        </div>
        <div style={{
          background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8,
          padding: '48px 32px', textAlign: 'center',
        }}>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 6 }}>
            Nenhum OKR criado ainda
          </p>
          <p style={{ fontSize: 12, color: '#9CA3AF' }}>
            Vá até <strong>Metas de Impacto</strong> para criar seus primeiros objetivos e KRs.
          </p>
        </div>
      </div>
    )
  }

  /* ── Categorias presentes (para legenda) ── */
  const categoriasPresentes = Array.from(new Set(okrs.map(o => o.categoria)))

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', paddingBottom: 48, display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Header ── */}
      <div style={{ paddingTop: 4 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111827', margin: 0, letterSpacing: '-0.01em' }}>
          Painel de Metas
        </h1>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
          Progresso dos seus OKRs e resultados-chave
        </p>
      </div>

      {/* ── Tiles de resumo ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {([
          { label: 'OKRs ativos',          value: okrs.length,    sub: 'objetivos' },
          { label: 'Resultados-chave',      value: totalKrs,       sub: 'KRs' },
          { label: 'Tarefas concluídas',    value: tarefasFeitas,  sub: `de ${tarefas.length} tarefas` },
          { label: 'Progresso geral',       value: `${progGeral}%`, sub: 'média dos OKRs', accent: true },
        ] as const).map(item => (
          <div key={item.label} style={{
            background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8,
            padding: '14px 16px',
          }}>
            <p style={{
              fontSize: 10, fontWeight: 500, color: '#9CA3AF',
              textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0,
            }}>
              {item.label}
            </p>
            <p style={{
              fontSize: 24, fontWeight: 600,
              color: ('accent' in item && item.accent) ? '#7B2FBE' : '#111827',
              margin: '6px 0 2px',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {item.value}
            </p>
            <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{item.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Progresso por OKR ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>Progresso por OKR</p>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>
            {okrs.length} {okrs.length === 1 ? 'objetivo' : 'objetivos'}
          </span>
        </div>

        {okrs.map(obj => {
          const op    = objPct(obj)
          const color = catColor[obj.categoria] ?? '#7B2FBE'

          return (
            <div key={obj.id} style={{
              background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8,
              overflow: 'hidden',
            }}>
              {/* Cabeçalho do objetivo */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 20px',
                borderBottom: '1px solid #F3F4F6',
                background: '#FAFAFA',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600, color,
                    background: catBg[obj.categoria],
                    padding: '2px 8px', borderRadius: 4, flexShrink: 0,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {obj.categoria}
                  </span>
                  <p style={{
                    fontSize: 13, fontWeight: 600, color: '#111827', margin: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {obj.titulo}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 20 }}>
                  <div style={{ width: 72, height: 4, background: '#E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${op}%`, background: color, borderRadius: 2 }} />
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 600, color,
                    minWidth: 34, textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {op}%
                  </span>
                </div>
              </div>

              {/* Coluna headers */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 180px 100px',
                padding: '5px 20px',
                borderBottom: '1px solid #F3F4F6',
              }}>
                {['Resultado-chave', 'Progresso', 'Atual / Meta'].map(h => (
                  <span key={h} style={{
                    fontSize: 10, fontWeight: 500, color: '#B0B7C3',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {h}
                  </span>
                ))}
              </div>

              {/* KR rows */}
              {obj.keyResults.length === 0 ? (
                <div style={{ padding: '12px 20px' }}>
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Nenhum KR definido.</p>
                </div>
              ) : (
                obj.keyResults.map((kr, i) => {
                  const p        = pct(kr.atual, kr.meta)
                  const barColor = p === 100 ? '#10B981' : color
                  return (
                    <div key={kr.id} style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 180px 100px',
                      alignItems: 'center',
                      gap: 0,
                      padding: '9px 20px',
                      borderBottom: i < obj.keyResults.length - 1 ? '1px solid #F9FAFB' : 'none',
                    }}>
                      <p style={{ fontSize: 12, color: '#374151', margin: 0, lineHeight: 1.45, paddingRight: 16 }}>
                        {kr.descricao}
                      </p>

                      {/* Progress bar + % */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: '#F3F4F6', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${p}%`,
                            background: barColor,
                            borderRadius: 2,
                            transition: 'width 0.4s ease',
                          }} />
                        </div>
                        <span style={{
                          fontSize: 11, fontWeight: 600,
                          color: p === 100 ? '#10B981' : p > 0 ? color : '#D1D5DB',
                          minWidth: 30, textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                        }}>
                          {p}%
                        </span>
                      </div>

                      {/* Atual / Meta */}
                      <p style={{
                        fontSize: 11, color: '#9CA3AF', margin: 0,
                        textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                      }}>
                        <span style={{ fontWeight: 600, color: '#374151' }}>{kr.atual}</span>
                        {' '}/ {kr.meta}{' '}
                        <span style={{ color: '#B0B7C3' }}>{kr.unit}</span>
                      </p>
                    </div>
                  )
                })
              )}
            </div>
          )
        })}
      </div>

      {/* ── Gráfico: todos os KRs comparados ── */}
      {barData.length > 0 && (
        <div style={{
          background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8,
          padding: '18px 20px 12px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>
              Comparativo de Resultados-Chave
            </p>
            {/* Legenda por categoria */}
            <div style={{ display: 'flex', gap: 14 }}>
              {categoriasPresentes.map(cat => (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{
                    width: 8, height: 8,
                    background: catColor[cat] ?? '#7B2FBE',
                    borderRadius: 2, flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 10, color: '#6B7280' }}>{cat}</span>
                </div>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={barData}
              margin={{ top: 4, right: 4, left: -24, bottom: 52 }}
              barSize={20}
            >
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `${v}%`}
              />
              <Tooltip content={<KrTooltip />} cursor={{ fill: '#F9FAFB' }} />
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Tarefas por OKR ── */}
      {tasksByOkr.length > 0 && (
        <div style={{
          background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '11px 20px', borderBottom: '1px solid #F3F4F6',
            background: '#FAFAFA',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>Tarefas por OKR</p>
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>
              {tarefasFeitas} de {tarefas.length} concluídas
            </span>
          </div>

          {/* Column headers */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 64px 96px 72px 88px',
            padding: '5px 20px', borderBottom: '1px solid #F3F4F6',
          }}>
            {['OKR', 'Feitas', 'Em andamento', 'Pendentes', 'Bloqueadas'].map(h => (
              <span key={h} style={{
                fontSize: 10, fontWeight: 500, color: '#B0B7C3',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {h}
              </span>
            ))}
          </div>

          {tasksByOkr.map((item, i) => (
            <div key={item.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 64px 96px 72px 88px',
              alignItems: 'center',
              padding: '9px 20px',
              borderBottom: i < tasksByOkr.length - 1 ? '1px solid #F9FAFB' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <div style={{
                  width: 3, height: 18, flexShrink: 0,
                  background: catColor[item.categoria] ?? '#7B2FBE',
                  borderRadius: 2,
                }} />
                <span style={{
                  fontSize: 12, color: '#374151',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {item.titulo.length > 48 ? item.titulo.slice(0, 48) + '…' : item.titulo}
                </span>
              </div>
              <span style={{
                fontSize: 12, fontWeight: 600, color: '#10B981',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {item.feitas}
              </span>
              <span style={{ fontSize: 12, color: '#3B82F6', fontVariantNumeric: 'tabular-nums' }}>
                {item.em_andamento}
              </span>
              <span style={{ fontSize: 12, color: '#6B7280', fontVariantNumeric: 'tabular-nums' }}>
                {item.pendentes}
              </span>
              <span style={{
                fontSize: 12, fontVariantNumeric: 'tabular-nums',
                color: item.bloqueadas > 0 ? '#EF4444' : '#6B7280',
              }}>
                {item.bloqueadas}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
