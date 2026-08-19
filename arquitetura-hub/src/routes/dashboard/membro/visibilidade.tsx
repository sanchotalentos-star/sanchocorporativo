import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Mic2, Globe, Key, Eye, Calendar, TrendingUp, Award, ExternalLink, Sparkles } from 'lucide-react'
import { memberKey } from '@/lib/memberStorage'

export const Route = createFileRoute('/dashboard/membro/visibilidade')({
  component: VisibilidadePage,
})

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
export type AcaoTipo = 'palco' | 'relacao_publica' | 'acesso' | 'exposicao'

export interface VisibilityAction {
  id: string
  tipo: AcaoTipo
  titulo: string
  descricao: string
  data: string
  plataforma?: string
  alcance_estimado?: number
  link_evidencia?: string
  created_at: string
}

export const VIS_KEY = 'visibility_actions_v1'

/* ─────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────── */
const tipoConfig: Record<AcaoTipo, { label: string; icon: React.ReactNode; color: string; bg: string; desc: string }> = {
  palco: {
    label: 'Palco',
    icon: <Mic2 size={15} />,
    color: '#7B2FBE',
    bg: 'rgba(123,47,190,0.10)',
    desc: 'Palestras, painéis e aparições públicas',
  },
  relacao_publica: {
    label: 'Relação Pública',
    icon: <Globe size={15} />,
    color: '#0EA5E9',
    bg: 'rgba(14,165,233,0.10)',
    desc: 'Assessoria de imprensa e mídia espontânea',
  },
  acesso: {
    label: 'Acesso',
    icon: <Key size={15} />,
    color: '#C5A880',
    bg: 'rgba(197,168,128,0.12)',
    desc: 'Conexões estratégicas e portas abertas',
  },
  exposicao: {
    label: 'Exposição',
    icon: <Eye size={15} />,
    color: '#10B981',
    bg: 'rgba(16,185,129,0.10)',
    desc: 'Matérias, artigos e features em veículos',
  },
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function safeJson<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback }
  catch { return fallback }
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return iso }
}

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const D = {
  bg:      '#F8F7F5',
  card:    '#FFFFFF',
  border:  'rgba(0,0,0,0.07)',
  text:    '#1C1A17',
  textMid: '#3A3530',
  textSub: '#75716B',
  gold:    '#C5A880',
  goldBg:  'rgba(197,168,128,0.08)',
}

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
  color?: string
}) {
  return (
    <div style={{
      background: D.card,
      border: `1px solid ${D.border}`,
      borderRadius: 8,
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: color ? `${color}18` : D.goldBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: color ?? D.gold,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 22, fontWeight: 700, color: D.text, margin: 0, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </p>
        <p style={{ fontSize: 11, color: D.textSub, margin: '4px 0 0', fontWeight: 500 }}>{label}</p>
        {sub && <p style={{ fontSize: 10, color: D.gold, margin: '3px 0 0' }}>{sub}</p>}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   ACTION CARD (timeline item)
───────────────────────────────────────────── */
function ActionCard({ action }: { action: VisibilityAction }) {
  const cfg = tipoConfig[action.tipo]
  return (
    <div style={{
      background: D.card,
      border: `1px solid ${D.border}`,
      borderRadius: 8,
      padding: '16px 20px',
      display: 'flex',
      gap: 14,
      position: 'relative',
    }}>
      {/* tipo pill + icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: cfg.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: cfg.color,
        marginTop: 2,
      }}>
        {cfg.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: cfg.color, background: cfg.bg,
              padding: '3px 7px', borderRadius: 4, marginBottom: 6,
            }}>
              {cfg.icon}&nbsp;{cfg.label}
            </span>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: D.text, margin: 0, lineHeight: 1.3 }}>
              {action.titulo}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            <Calendar size={11} style={{ color: D.textSub }} />
            <span style={{ fontSize: 11, color: D.textSub, fontVariantNumeric: 'tabular-nums' }}>
              {formatDate(action.data)}
            </span>
          </div>
        </div>

        {action.descricao && (
          <p style={{ fontSize: 13, color: D.textMid, margin: '8px 0 0', lineHeight: 1.6 }}>
            {action.descricao}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
          {action.plataforma && (
            <span style={{ fontSize: 11, color: D.textSub }}>
              <strong style={{ color: D.textMid }}>Plataforma:</strong> {action.plataforma}
            </span>
          )}
          {action.alcance_estimado ? (
            <span style={{ fontSize: 11, color: D.textSub }}>
              <strong style={{ color: D.textMid }}>Alcance:</strong>{' '}
              <span style={{ color: '#10B981', fontWeight: 600 }}>~{formatNum(action.alcance_estimado)}</span> pessoas
            </span>
          ) : null}
          {action.link_evidencia && (
            <a
              href={action.link_evidencia}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 11, color: D.gold, textDecoration: 'none', fontWeight: 500,
              }}
            >
              <ExternalLink size={11} />
              Ver evidência
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
function VisibilidadePage() {
  const [actions, setActions] = useState<VisibilityAction[]>([])
  const [filterTipo, setFilterTipo] = useState<AcaoTipo | 'all'>('all')

  useEffect(() => {
    const stored = safeJson<VisibilityAction[]>(memberKey(VIS_KEY), [])
    setActions(stored.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()))
  }, [])

  /* stats */
  const totalAlcance = actions.reduce((s, a) => s + (a.alcance_estimado ?? 0), 0)
  const byTipo = (Object.keys(tipoConfig) as AcaoTipo[]).map(t => ({
    tipo: t,
    count: actions.filter(a => a.tipo === t).length,
  }))

  const filtered = filterTipo === 'all' ? actions : actions.filter(a => a.tipo === filterTipo)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 0 64px' }}>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Sparkles size={14} style={{ color: D.gold }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: D.gold }}>
            Módulo
          </span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: D.text, margin: 0 }}>
          Minha Visibilidade Estratégica
        </h1>
        <p style={{ fontSize: 13, color: D.textSub, marginTop: 6 }}>
          Tudo que está sendo feito por você nos bastidores — palcos, relações públicas, acessos e exposição.
        </p>
      </div>

      {actions.length === 0 ? (
        /* ── EMPTY STATE ── */
        <div style={{
          background: D.card,
          border: `1px solid ${D.border}`,
          borderRadius: 10,
          padding: '56px 32px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: D.goldBg, border: `1px solid rgba(197,168,128,0.2)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Sparkles size={24} style={{ color: D.gold }} />
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: D.text, margin: '0 0 8px' }}>
            Sua vitrine ainda está sendo montada
          </h2>
          <p style={{ fontSize: 13, color: D.textSub, maxWidth: 380, margin: '0 auto' }}>
            Em breve seu mentor irá registrar aqui as ações estratégicas realizadas em seu nome — palcos, mídia e conexões de alto impacto.
          </p>
        </div>
      ) : (
        <>
          {/* ── STATS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
            <StatCard
              icon={<TrendingUp size={16} />}
              label="Ações registradas"
              value={actions.length}
              color={D.gold}
            />
            <StatCard
              icon={<Eye size={16} />}
              label="Alcance estimado"
              value={totalAlcance > 0 ? `~${formatNum(totalAlcance)}` : '—'}
              sub={totalAlcance > 0 ? 'pessoas impactadas' : undefined}
              color="#10B981"
            />
            {byTipo.filter(b => b.count > 0).map(b => (
              <StatCard
                key={b.tipo}
                icon={tipoConfig[b.tipo].icon}
                label={tipoConfig[b.tipo].label}
                value={b.count}
                color={tipoConfig[b.tipo].color}
              />
            ))}
          </div>

          {/* ── FILTER TABS ── */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
            {(['all', ...Object.keys(tipoConfig)] as Array<AcaoTipo | 'all'>).map(t => {
              const active = filterTipo === t
              const label = t === 'all' ? 'Tudo' : tipoConfig[t as AcaoTipo].label
              const color = t === 'all' ? D.gold : tipoConfig[t as AcaoTipo].color
              return (
                <button
                  key={t}
                  onClick={() => setFilterTipo(t)}
                  style={{
                    padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.15s',
                    background: active ? color : 'transparent',
                    color: active ? '#fff' : D.textSub,
                    border: `1px solid ${active ? color : D.border}`,
                  }}
                >
                  {label}
                  <span style={{ marginLeft: 5, opacity: 0.7 }}>
                    {t === 'all' ? actions.length : actions.filter(a => a.tipo === t).length}
                  </span>
                </button>
              )
            })}
          </div>

          {/* ── TIMELINE ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: D.textSub, fontSize: 13 }}>
                Nenhuma ação deste tipo registrada ainda.
              </div>
            ) : (
              filtered.map(action => (
                <ActionCard key={action.id} action={action} />
              ))
            )}
          </div>

          {/* ── TYPE LEGEND ── */}
          <div style={{
            background: D.card,
            border: `1px solid ${D.border}`,
            borderRadius: 8,
            padding: '16px 20px',
            marginTop: 28,
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: D.textSub, margin: '0 0 12px' }}>
              Tipos de ação
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              {(Object.entries(tipoConfig) as [AcaoTipo, typeof tipoConfig[AcaoTipo]][]).map(([tipo, cfg]) => (
                <div key={tipo} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 6,
                    background: cfg.bg, color: cfg.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 1,
                  }}>
                    {cfg.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: D.textMid, margin: 0 }}>{cfg.label}</p>
                    <p style={{ fontSize: 11, color: D.textSub, margin: '2px 0 0', lineHeight: 1.4 }}>{cfg.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── AWARD BADGE ── */}
          {actions.length >= 5 && (
            <div style={{
              marginTop: 20,
              background: 'linear-gradient(135deg, rgba(197,168,128,0.08) 0%, rgba(197,168,128,0.04) 100%)',
              border: '1px solid rgba(197,168,128,0.2)',
              borderRadius: 8,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <Award size={20} style={{ color: D.gold, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: D.text, margin: 0 }}>
                  Presença ativa no mercado
                </p>
                <p style={{ fontSize: 12, color: D.textSub, margin: '2px 0 0' }}>
                  {actions.length} ações estratégicas já foram realizadas em seu nome. Sua autoridade está sendo construída.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
