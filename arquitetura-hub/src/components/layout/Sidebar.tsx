import { Link, useRouterState } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

/* ── NAV STRUCTURE ────────────────────────────────────── */
interface NavItem  { label: string; href: string }
interface NavGroup { section: string; items: NavItem[] }

const adminGroups: NavGroup[] = [
  {
    section: 'Visão Geral',
    items: [
      { label: 'Dashboard',  href: '/dashboard/admin'            },
      { label: 'Membros',    href: '/dashboard/admin/membros'    },
      { label: 'Relatórios', href: '/dashboard/admin/relatorios' },
    ],
  },
  {
    section: 'Mentoria',
    items: [
      { label: 'Meu Hub', href: '/dashboard/membro' },
    ],
  },
]

const membroGroups: NavGroup[] = [
  {
    section: 'Jornada',
    items: [
      { label: 'Home',             href: '/dashboard/membro'                },
      { label: 'Minha Identidade', href: '/dashboard/membro/posicionamento' },
      { label: 'Pilares da Marca', href: '/dashboard/membro/pilares'        },
      { label: 'Metas de Impacto', href: '/dashboard/membro/okr'            },
    ],
  },
  {
    section: 'Execução',
    items: [
      { label: 'Tarefas',         href: '/dashboard/membro/tarefas'   },
      { label: 'Marketing Anual', href: '/dashboard/membro/marketing' },
    ],
  },
  {
    section: 'Medição',
    items: [
      { label: 'Indicadores', href: '/dashboard/membro/kpis'   },
      { label: 'Agenda',      href: '/dashboard/membro/agenda' },
    ],
  },
]

/* ── COMPONENT ───────────────────────────────────────── */
export function Sidebar() {
  const { user, logout } = useAuth()
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const groups = user?.role === 'admin' ? adminGroups : membroGroups

  function isActive(href: string) {
    return pathname === href || (
      href !== '/dashboard/admin' &&
      href !== '/dashboard/membro' &&
      pathname.startsWith(href)
    )
  }

  return (
    <aside style={{
      display: 'flex', flexDirection: 'column',
      width: 212, minHeight: '100vh',
      background: '#0F0E0D',
      borderRight: '1px solid rgba(255,255,255,0.05)',
    }}>

      {/* Logo */}
      <div style={{ padding: '22px 20px 18px' }}>
        <p style={{
          fontSize: 11, fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.88)', margin: 0,
        }}>
          AR.
        </p>
        <p style={{
          fontSize: 9, fontWeight: 400,
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.04em', marginTop: 3,
        }}>
          Arquitetura de Relevância
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '4px 10px 8px', overflowY: 'auto' }}>
        {groups.map((group, gi) => (
          <div key={group.section} style={{ marginTop: gi === 0 ? 4 : 20 }}>
            <p style={{
              fontSize: 9, fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.18)',
              padding: '0 10px', margin: '0 0 3px',
            }}>
              {group.section}
            </p>

            {group.items.map(item => {
              const active = isActive(item.href)
              return (
                <Link key={item.href} to={item.href} style={{ textDecoration: 'none', display: 'block' }}>
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: '6px 10px', borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => {
                      if (!active) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'
                    }}
                    onMouseLeave={e => {
                      if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent'
                    }}
                  >
                    <div style={{
                      width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                      background: active ? '#C5A880' : 'rgba(255,255,255,0.1)',
                      boxShadow: active ? '0 0 0 3px rgba(197,168,128,0.16)' : 'none',
                      transition: 'all 0.15s',
                    }} />
                    <span style={{
                      fontSize: 12.5, flex: 1,
                      color: active ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.35)',
                      fontWeight: active ? 500 : 400,
                      letterSpacing: '0.01em',
                      transition: 'color 0.1s',
                    }}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '10px 10px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 10px', marginBottom: 1 }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(197,168,128,0.12)',
            border: '1px solid rgba(197,168,128,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 600, color: '#C5A880',
          }}>
            {user?.full_name?.charAt(0) ?? 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: 12, fontWeight: 500,
              color: 'rgba(255,255,255,0.7)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              lineHeight: 1.3, margin: 0,
            }}>
              {user?.full_name}
            </p>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>
              {user?.role === 'admin' ? 'Mentor' : 'Mentorado'}
            </p>
          </div>
        </div>

        <button
          onClick={() => void logout()}
          style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '6px 10px', width: '100%',
            background: 'none', border: 'none', borderRadius: 4,
            fontSize: 12, color: 'rgba(255,255,255,0.2)',
            cursor: 'pointer', transition: 'color 0.1s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
        >
          <LogOut size={13} />
          Sair
        </button>
      </div>
    </aside>
  )
}
