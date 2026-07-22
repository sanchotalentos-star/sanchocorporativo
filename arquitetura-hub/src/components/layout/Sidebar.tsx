import { Link, useRouterState } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
  Home, Rocket, Layers, Compass, Megaphone, CalendarDays,
  BarChart2, FileBarChart, Trophy, LogOut,
  LayoutDashboard, Users, FileText, CheckSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: string
}

const adminNav: NavItem[] = [
  { label: 'Visão Geral',  href: '/dashboard/admin',            icon: LayoutDashboard },
  { label: 'Membros',      href: '/dashboard/admin/membros',    icon: Users           },
  { label: 'Relatórios',  href: '/dashboard/admin/relatorios',  icon: FileText        },
]

const membroNav: NavItem[] = [
  { label: 'Início',            href: '/dashboard/membro',                icon: Home        },
  { label: 'Minha Identidade',  href: '/dashboard/membro/posicionamento', icon: Compass     },
  { label: 'Pilares da Marca',  href: '/dashboard/membro/pilares',        icon: Layers      },
  { label: 'Metas de Impacto',  href: '/dashboard/membro/okr',            icon: Rocket      },
  { label: 'Tarefas',           href: '/dashboard/membro/tarefas',        icon: CheckSquare },
  { label: 'Marketing Anual',   href: '/dashboard/membro/marketing',      icon: Megaphone   },
  { label: 'Indicadores',       href: '/dashboard/membro/kpis',           icon: BarChart2   },
  { label: 'Agenda',            href: '/dashboard/membro/agenda',         icon: CalendarDays },
  { label: 'Relatórios',        href: '/dashboard/membro/relatorios',     icon: FileBarChart },
  { label: 'Ranking',           href: '/dashboard/membro/ranking',        icon: Trophy      },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const nav = user?.role === 'admin' ? adminNav : membroNav

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', width: 224, minHeight: '100vh', background: '#111827', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Logo */}
      <div style={{ padding: '18px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', letterSpacing: '0.02em', lineHeight: 1.4 }}>
          Arquitetura
        </p>
        <p style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.02em', lineHeight: 1.4 }}>
          de Relevância
        </p>
      </div>

      {/* User */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: '#7B2FBE',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 600, color: '#fff', flexShrink: 0,
        }}>
          {user?.full_name?.charAt(0) ?? 'U'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#fff', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.full_name}
          </p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>
            {user?.role === 'admin' ? 'Mentor' : 'Mentorado'}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {nav.map((item) => {
          const active =
            pathname === item.href || (
              item.href !== '/dashboard/admin' &&
              item.href !== '/dashboard/membro' &&
              pathname.startsWith(item.href)
            )

          return (
            <Link key={item.href} to={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '7px 12px',
                borderRadius: 5,
                cursor: 'pointer',
                background: active ? 'rgba(123,47,190,0.18)' : 'transparent',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              >
                <item.icon
                  size={14}
                  strokeWidth={active ? 2 : 1.75}
                  style={{ flexShrink: 0, color: active ? '#a78bfa' : 'rgba(255,255,255,0.35)' }}
                />
                <span style={{
                  fontSize: 13, flex: 1,
                  color: active ? '#e5e7eb' : 'rgba(255,255,255,0.45)',
                  fontWeight: active ? 500 : 400,
                }}>
                  {item.label}
                </span>
                {item.badge && (
                  <span style={{ fontSize: 9, fontWeight: 600, background: 'rgba(123,47,190,0.25)', color: '#a78bfa', padding: '2px 5px', borderRadius: 3 }}>
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => void logout()}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '7px 12px', width: '100%',
            background: 'none', border: 'none', borderRadius: 5,
            fontSize: 13, color: 'rgba(255,255,255,0.3)',
            cursor: 'pointer', transition: 'color 0.1s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>
    </aside>
  )
}
