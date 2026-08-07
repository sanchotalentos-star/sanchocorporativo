import { useState, useEffect } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { LogOut, ChevronRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { memberKey } from '@/lib/memberStorage'

/* ── TYPES ─────────────────────────────────────────────── */
interface OkrKr { id: string; descricao: string; meta: number; atual: number; unit: string }
interface Okr    { id: string; titulo: string; categoria: string; keyResults: OkrKr[] }
interface Tarefa { id: string; descricao: string; status: string; prioridade: string }
interface Kpi    { id: string; kpi_name: string; atual: number; meta: number }

/* ── NAV GROUPS ─────────────────────────────────────────── */
interface NavItem  { label: string; href: string }
interface NavGroup { section: string; items: NavItem[] }

const adminGroups: NavGroup[] = [
  { section: 'Visão Geral', items: [
    { label: 'Dashboard',  href: '/dashboard/admin'            },
    { label: 'Membros',    href: '/dashboard/admin/membros'    },
    { label: 'Relatórios', href: '/dashboard/admin/relatorios' },
  ]},
  { section: 'Mentoria', items: [
    { label: 'Meu Hub', href: '/dashboard/membro' },
  ]},
]

const membroNav: NavItem[] = [
  { label: 'Central de Controle', href: '/dashboard/membro'                },
  { label: 'Minha Identidade',    href: '/dashboard/membro/posicionamento' },
  { label: 'Pilares da Marca',    href: '/dashboard/membro/pilares'        },
  { label: 'Metas de Impacto',    href: '/dashboard/membro/okr'            },
  { label: 'Tarefas',             href: '/dashboard/membro/tarefas'        },
  { label: 'Marketing Anual',     href: '/dashboard/membro/marketing'      },
  { label: 'Indicadores',         href: '/dashboard/membro/kpis'           },
  { label: 'Agenda',              href: '/dashboard/membro/agenda'         },
]

/* ── HELPERS ────────────────────────────────────────────── */
function pct(atual: number, meta: number) {
  return !meta ? 0 : Math.min(100, Math.round((atual / meta) * 100))
}
function safeJson<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback }
  catch { return fallback }
}

/* ── SIDEBAR ────────────────────────────────────────────── */
export function Sidebar() {
  const { user, logout } = useAuth()
  const routerState = useRouterState()
  const pathname    = routerState.location.pathname
  const isMembro    = user?.role !== 'admin'

  /* ── contextual data ── */
  const [score,      setScore]      = useState(0)
  const [nextGoal,   setNextGoal]   = useState('')
  const [pending,    setPending]     = useState(0)
  const [kpis,       setKpis]       = useState<Kpi[]>([])
  const [activities, setActivities] = useState<string[]>([])
  const [phases,     setPhases]     = useState({ identidade: false, mvp: false, marketing: false, escala: false })

  useEffect(() => {
    if (!isMembro) return
    try {
      /* OKRs → score + next goal */
      const okrs: Okr[] = safeJson<Okr[]>(memberKey('okr_store_v1'), [])
      if (okrs.length) {
        const avg = Math.round(okrs.reduce((s, o) => {
          const krs = o.keyResults
          if (!krs.length) return s
          return s + Math.round(krs.reduce((ks, kr) => ks + pct(kr.atual, kr.meta), 0) / krs.length)
        }, 0) / okrs.length)
        setScore(avg)

        /* find first OKR under 100% */
        for (const okr of okrs) {
          const progress = Math.round(okr.keyResults.reduce((s, kr) => s + pct(kr.atual, kr.meta), 0) / (okr.keyResults.length || 1))
          if (progress < 100) { setNextGoal(okr.titulo); break }
        }
      }

      /* Tasks → pending count + recent done */
      const tarefas: Tarefa[] = safeJson<Tarefa[]>(memberKey('tarefas_store_v1'), [])
      setPending(tarefas.filter(t => t.status === 'pendente' || t.status === 'em_andamento').length)
      const done = tarefas.filter(t => t.status === 'feita').slice(-3).map(t =>
        t.descricao.length > 42 ? t.descricao.slice(0, 42) + '…' : t.descricao
      )
      setActivities(done)

      /* Journey phases */
      const hasIdentidade = !!localStorage.getItem(memberKey('identidade_marca_v1'))
      const hasOkrs       = okrs.length > 0
      const hasMarketing  = (() => {
        const m = safeJson<unknown[]>(memberKey('marketing_store_v1'), [])
        return Array.isArray(m) && m.length > 0
      })()
      const kpiList: Kpi[] = safeJson<Kpi[]>(memberKey('kpis_store_v1'), [])
      const hasEscala     = kpiList.some(k => pct(k.atual, k.meta) >= 50)
      setPhases({ identidade: hasIdentidade, mvp: hasOkrs, marketing: hasMarketing, escala: hasEscala })
      setKpis(kpiList.slice(0, 3))
    } catch {}
  }, [isMembro, pathname]) /* re-read on navigation */

  function isActive(href: string) {
    return pathname === href || (
      href !== '/dashboard/admin' && href !== '/dashboard/membro' &&
      pathname.startsWith(href)
    )
  }

  /* ── User number derived from id ── */
  const memberNum = (() => {
    const id = user?.id ?? ''
    const n  = parseInt(id.replace(/\D/g, ''), 10)
    return isNaN(n) ? 1 : n + 10
  })()

  /* ── SCORE bar ── */
  const scoreBar = Math.max(4, score)

  /* ── ADMIN sidebar ── */
  if (!isMembro) {
    return (
      <aside style={sidebarBase}>
        <LogoBlock />
        <nav style={{ flex: 1, padding: '4px 10px 8px', overflowY: 'auto' }}>
          {adminGroups.map((group, gi) => (
            <div key={group.section} style={{ marginTop: gi === 0 ? 4 : 20 }}>
              <SectionLabel>{group.section}</SectionLabel>
              {group.items.map(item => (
                <NavRow key={item.href} href={item.href} label={item.label} active={isActive(item.href)} />
              ))}
            </div>
          ))}
        </nav>
        <UserFooter user={user} logout={logout} />
      </aside>
    )
  }

  /* ── MEMBRO sidebar ── */
  const journeyPhases = [
    { key: 'identidade', label: 'Identidade', done: phases.identidade },
    { key: 'mvp',        label: 'MVP',        done: phases.mvp        },
    { key: 'marketing',  label: 'Marketing',  done: phases.marketing  },
    { key: 'escala',     label: 'Escala',     done: phases.escala     },
  ]
  const currentPhaseIdx = journeyPhases.reduce((last, p, i) => p.done ? i : last, -1)

  return (
    <aside style={sidebarBase}>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* ── Logo strip ── */}
        <LogoBlock />

        {/* ── NAV (top, primary navigation) ── */}
        <nav style={{ padding: '2px 10px 8px' }}>
          {membroNav.map(item => (
            <NavRow key={item.href} href={item.href} label={item.label} active={isActive(item.href)} />
          ))}
        </nav>

        <Divider />

        {/* ── USER + SCORE BLOCK ── */}
        <div style={block}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.88)', margin: 0, lineHeight: 1.3 }}>
                {user?.full_name?.split(' ').slice(0, 2).join(' ')}
              </p>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 2, letterSpacing: '0.05em' }}>
                Mentoria #{memberNum}
              </p>
            </div>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(197,168,128,0.12)',
              border: '1px solid rgba(197,168,128,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 600, color: '#C5A880', flexShrink: 0,
            }}>
              {user?.full_name?.charAt(0) ?? 'U'}
            </div>
          </div>

          {/* Score */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>Score</span>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#C5A880', fontVariantNumeric: 'tabular-nums', fontFamily: "'Cormorant Garamond', Georgia, serif", lineHeight: 1 }}>{score}</span>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ height: '100%', width: `${scoreBar}%`, background: 'linear-gradient(90deg, #C5A880, #D4B896)', borderRadius: 2, transition: 'width 0.5s ease' }} />
          </div>

          {/* Next goal */}
          {nextGoal && (
            <div style={{ background: 'rgba(197,168,128,0.06)', borderRadius: 4, padding: '6px 8px', borderLeft: '2px solid rgba(197,168,128,0.3)' }}>
              <p style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(197,168,128,0.6)', margin: '0 0 3px' }}>
                Próximo objetivo
              </p>
              <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.4,
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
              }}>
                {nextGoal}
              </p>
            </div>
          )}
        </div>

        <Divider />

        {/* ── HOJE ── */}
        <div style={block}>
          <SectionLabel>Hoje</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 6 }}>
            {[
              { dot: pending > 0 ? '#F59E0B' : '#22C55E', text: `${pending} tarefa${pending !== 1 ? 's' : ''} pendente${pending !== 1 ? 's' : ''}` },
              { dot: 'rgba(255,255,255,0.15)', text: 'Sessão com mentor' },
              { dot: kpis.length > 0 ? '#22C55E' : 'rgba(255,255,255,0.15)', text: `${kpis.length} indicador${kpis.length !== 1 ? 'es' : ''} monitorado${kpis.length !== 1 ? 's' : ''}` },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: item.dot }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', lineHeight: 1.4 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ── JORNADA ── */}
        <div style={block}>
          <SectionLabel>Jornada</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 8 }}>
            {journeyPhases.map((phase, i) => {
              const isActivePhase = i === currentPhaseIdx + 1
              const isDone        = phase.done
              const isFuture      = !isDone && !isActivePhase
              const isLast        = i === journeyPhases.length - 1
              return (
                <div key={phase.key} style={{ display: 'grid', gridTemplateColumns: '16px 1fr', gap: 10, paddingBottom: isLast ? 0 : 14, position: 'relative' }}>
                  {!isLast && (
                    <div style={{
                      position: 'absolute', left: 5.5, top: 12, bottom: 0, width: 1,
                      background: isDone ? 'rgba(197,168,128,0.3)' : 'rgba(255,255,255,0.07)',
                    }} />
                  )}
                  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 2 }}>
                    <div style={{
                      width: isDone ? 9 : (isActivePhase ? 9 : 7),
                      height: isDone ? 9 : (isActivePhase ? 9 : 7),
                      borderRadius: '50%',
                      background: isDone ? '#C5A880' : (isActivePhase ? '#C5A880' : 'transparent'),
                      border: isFuture ? '1.5px solid rgba(255,255,255,0.15)' : 'none',
                      boxShadow: isActivePhase ? '0 0 0 3px rgba(197,168,128,0.2)' : 'none',
                      zIndex: 1, position: 'relative', flexShrink: 0,
                    }} />
                  </div>
                  <span style={{
                    fontSize: 11.5, lineHeight: 1,
                    color: isDone ? 'rgba(255,255,255,0.65)' : (isActivePhase ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.22)'),
                    fontWeight: isActivePhase ? 500 : 400,
                    paddingTop: 1,
                  }}>
                    {phase.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <Divider />

        {/* ── INDICADORES ── */}
        {kpis.length > 0 && (
          <>
            <div style={block}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <SectionLabel style={{ marginBottom: 0 }}>Indicadores</SectionLabel>
                <Link to="/dashboard/membro/kpis" style={{ textDecoration: 'none' }}>
                  <ChevronRight size={11} style={{ color: 'rgba(255,255,255,0.2)' }} />
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {kpis.map(k => {
                  const p = pct(k.atual, k.meta)
                  const col = p >= 80 ? '#22C55E' : (p >= 50 ? '#F59E0B' : '#F87171')
                  return (
                    <div key={k.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.38)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, paddingRight: 6 }}>
                          {k.kpi_name}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: col, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{p}%</span>
                      </div>
                      <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1 }}>
                        <div style={{ height: '100%', width: `${p}%`, background: col, borderRadius: 1, transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <Divider />
          </>
        )}

        {/* ── ÚLTIMAS ATIVIDADES ── */}
        {activities.length > 0 && (
          <div style={block}>
            <SectionLabel>Últimas atividades</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
              {activities.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#22C55E', flexShrink: 0, marginTop: 4 }} />
                  <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.32)', lineHeight: 1.5 }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <UserFooter user={user} logout={logout} />
    </aside>
  )
}

/* ── SHARED SUB-COMPONENTS ──────────────────────────────── */
const sidebarBase: React.CSSProperties = {
  display: 'flex', flexDirection: 'column',
  width: 228, minHeight: '100vh',
  background: '#0F0E0D',
  borderRight: '1px solid rgba(255,255,255,0.05)',
  flexShrink: 0,
}

const block: React.CSSProperties = {
  padding: '12px 14px',
}

function LogoBlock() {
  return (
    <div style={{ padding: '18px 14px 14px' }}>
      <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.88)', margin: 0 }}>Arquitetura de Relevância</p>
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0 14px' }} />
}

function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{
      fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.18)', margin: '0 0 2px',
      ...style,
    }}>
      {children}
    </p>
  )
}

function NavRow({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link to={href} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 4, transition: 'background 0.1s' }}
        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)' }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
      >
        <div style={{
          width: 4, height: 4, borderRadius: '50%', flexShrink: 0,
          background: active ? '#C5A880' : 'rgba(255,255,255,0.08)',
          boxShadow: active ? '0 0 0 3px rgba(197,168,128,0.14)' : 'none',
          transition: 'all 0.15s',
        }} />
        <span style={{
          fontSize: 12, flex: 1,
          color: active ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.30)',
          fontWeight: active ? 500 : 400,
          transition: 'color 0.1s',
        }}>
          {label}
        </span>
      </div>
    </Link>
  )
}

function UserFooter({ user, logout }: { user: { full_name?: string; role?: string } | null; logout: () => Promise<void> }) {
  return (
    <div style={{ padding: '8px 10px 10px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
      <button
        onClick={() => void logout()}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 8px', width: '100%',
          background: 'none', border: 'none', borderRadius: 4,
          fontSize: 11.5, color: 'rgba(255,255,255,0.18)',
          cursor: 'pointer', transition: 'color 0.1s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.18)')}
      >
        <LogOut size={12} />
        Sair da conta
      </button>
    </div>
  )
}
