import { Link, useRouterState } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
  Home, Rocket, Layers, Compass, Megaphone, CalendarDays,
  BarChart2, FileBarChart, Trophy, LogOut,
  LayoutDashboard, Users, FileText,
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
  { label: 'Metas de Impacto',  href: '/dashboard/membro/okr',            icon: Rocket      },
  { label: 'Minha Identidade',  href: '/dashboard/membro/posicionamento', icon: Compass     },
  { label: 'Pilares da Marca',  href: '/dashboard/membro/pilares',        icon: Layers      },
  { label: 'Marketing Anual',   href: '/dashboard/membro/marketing',      icon: Megaphone   },
  { label: 'Agenda',            href: '/dashboard/membro/agenda',         icon: CalendarDays },
  { label: 'Indicadores',       href: '/dashboard/membro/kpis',           icon: BarChart2   },
  { label: 'Relatórios',        href: '/dashboard/membro/relatorios',     icon: FileBarChart },
  { label: 'Ranking',           href: '/dashboard/membro/ranking',        icon: Trophy      },
]

const journeyStages = [
  { num: 1, label: 'OKR & MVP',          desc: 'Metas + produto' },
  { num: 2, label: 'Primeiras Vitórias', desc: 'Posicionamento'  },
  { num: 3, label: 'Plano em Ação',      desc: 'PDCA ciclo 1'    },
  { num: 4, label: 'Escala',             desc: 'Autoridade'      },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const nav = user?.role === 'admin' ? adminNav : membroNav
  const currentStage = 1

  return (
    <aside className="flex flex-col w-60 min-h-screen bg-[#1B1F2E] border-r border-white/5">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5">
        <div className="w-7 h-7 rounded-md bg-[#7B2FBE] flex items-center justify-center flex-shrink-0">
          <span className="text-[11px] font-bold text-white tracking-wide">AR</span>
        </div>
        <div>
          <p className="text-[12px] font-semibold text-white leading-tight">Arquitetura</p>
          <p className="text-[10px] text-[#7B2FBE] font-medium">de Relevância</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3.5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#7B2FBE] flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
            {user?.full_name?.charAt(0) ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-white truncate leading-tight">{user?.full_name}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {user?.role === 'admin' ? 'Mentor' : 'Mentorado(a)'}
            </p>
          </div>
        </div>
      </div>

      {/* Journey tracker — only for membros */}
      {user?.role !== 'admin' && (
        <div className="px-4 py-4 border-b border-white/5">
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-3">Sua Jornada</p>
          <div className="space-y-2">
            {journeyStages.map((stage) => {
              const isDone    = stage.num < currentStage
              const isCurrent = stage.num === currentStage
              return (
                <div key={stage.num} className="flex items-center gap-2.5">
                  <div className={cn(
                    'w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0',
                    isDone    ? 'bg-[#7B2FBE]'                          : '',
                    isCurrent ? 'border-2 border-[#7B2FBE] bg-[#1B1F2E]' : '',
                    !isDone && !isCurrent ? 'border border-white/10 bg-[#1B1F2E]' : '',
                  )}>
                    {isDone    && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-[#7B2FBE]" />}
                  </div>
                  <div className="flex-1 min-w-0 flex items-center justify-between gap-1">
                    <span className={cn(
                      'text-[11px] leading-none',
                      isCurrent ? 'text-white font-medium' :
                      isDone    ? 'text-gray-600 line-through'    :
                                  'text-gray-600'
                    )}>
                      {stage.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] font-medium bg-[#7B2FBE]/20 text-[#a855f7] px-1.5 py-0.5 rounded">
                        Atual
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const active =
            pathname === item.href || (
              item.href !== '/dashboard/admin' &&
              item.href !== '/dashboard/membro' &&
              pathname.startsWith(item.href)
            )

          return (
            <Link key={item.href} to={item.href}>
              <div className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 cursor-pointer',
                active
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              )}>
                <item.icon size={15} strokeWidth={active ? 2 : 1.75} className="flex-shrink-0" />
                <span className={cn('flex-1 text-[13px]', active ? 'font-medium text-white' : 'font-normal')}>
                  {item.label}
                </span>
                {item.badge && (
                  <span className="text-[9px] font-medium bg-[#7B2FBE]/20 text-[#a855f7] px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-4 border-t border-white/5 pt-3">
        <button
          onClick={() => void logout()}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-normal text-gray-500 hover:text-red-400 hover:bg-white/5 transition-all"
        >
          <LogOut size={15} />
          Sair da plataforma
        </button>
      </div>
    </aside>
  )
}
