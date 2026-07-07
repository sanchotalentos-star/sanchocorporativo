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
  { label: 'Visão Geral',  href: '/dashboard/admin',           icon: LayoutDashboard },
  { label: 'Membros',      href: '/dashboard/admin/membros',   icon: Users           },
  { label: 'Relatórios',   href: '/dashboard/admin/relatorios', icon: FileText       },
]

const membroNav: NavItem[] = [
  { label: 'Início',            href: '/dashboard/membro',               icon: Home        },
  { label: 'Metas de Impacto',  href: '/dashboard/membro/okr',           icon: Rocket      },
  { label: 'Minha Identidade',  href: '/dashboard/membro/posicionamento', icon: Compass     },
  { label: 'Pilares da Marca',  href: '/dashboard/membro/pilares',        icon: Layers      },
  { label: 'Marketing Anual',   href: '/dashboard/membro/marketing',      icon: Megaphone   },
  { label: 'Agenda',            href: '/dashboard/membro/agenda',         icon: CalendarDays },
  { label: 'Indicadores',       href: '/dashboard/membro/kpis',           icon: BarChart2   },
  { label: 'Relatórios',        href: '/dashboard/membro/relatorios',     icon: FileBarChart },
  { label: 'Ranking',           href: '/dashboard/membro/ranking',        icon: Trophy      },
]

const journeyStages = [
  { num: 1, label: 'Descoberta'  },
  { num: 2, label: 'Diferencial' },
  { num: 3, label: 'Mensagem'    },
  { num: 4, label: 'Estratégia'  },
  { num: 5, label: 'Expansão'    },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const nav = user?.role === 'admin' ? adminNav : membroNav
  const currentStage = 1

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-white border-r border-gray-100">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
        <span className="text-[13px] font-black text-gray-900 tracking-[0.18em] uppercase">AR</span>
        <span className="text-gray-200 font-thin text-lg leading-none select-none">|</span>
        <div>
          <p className="text-[11px] font-bold text-gray-700 leading-tight">Arquitetura</p>
          <p className="text-[9px] text-[#7B2FBE] font-black uppercase tracking-[0.2em]">de Relevância</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#7B2FBE] flex items-center justify-center text-xs font-black text-white flex-shrink-0">
            {user?.full_name?.charAt(0) ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 truncate leading-tight">{user?.full_name}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              {user?.role === 'admin' ? 'Mentor' : 'Mentorado(a)'}
            </p>
          </div>
        </div>
      </div>

      {/* Journey tracker — only for membros */}
      {user?.role !== 'admin' && (
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Sua Jornada</p>
          <div className="space-y-2">
            {journeyStages.map((stage) => {
              const isDone    = stage.num < currentStage
              const isCurrent = stage.num === currentStage
              return (
                <div key={stage.num} className="flex items-center gap-2.5">
                  <div className={cn(
                    'w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                    isDone    ? 'bg-[#7B2FBE]'                        : '',
                    isCurrent ? 'border-2 border-[#7B2FBE] bg-white'  : '',
                    !isDone && !isCurrent ? 'border-2 border-gray-200 bg-white' : '',
                  )}>
                    {isDone    && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-[#7B2FBE]" />}
                  </div>
                  <span className={cn(
                    'text-[11px] leading-none',
                    isCurrent ? 'text-[#7B2FBE] font-semibold' :
                    isDone    ? 'text-gray-400 line-through'    :
                                'text-gray-300'
                  )}>
                    {stage.label}
                  </span>
                  {isCurrent && (
                    <span className="ml-auto text-[9px] font-black bg-[#7B2FBE]/10 text-[#7B2FBE] px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                      Atual
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
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
                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
                active
                  ? 'bg-[#7B2FBE]/[0.08] text-[#7B2FBE]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}>
                {active && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[#7B2FBE]" />
                )}
                <item.icon size={16} strokeWidth={active ? 2.5 : 1.75} className="flex-shrink-0" />
                <span className={cn('flex-1 text-[13px]', active ? 'font-semibold' : 'font-medium')}>
                  {item.label}
                </span>
                {item.badge && (
                  <span className="text-[9px] font-black bg-[#7B2FBE]/10 text-[#7B2FBE] px-1.5 py-0.5 rounded-md uppercase tracking-widest">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t border-gray-100 pt-3">
        <button
          onClick={() => void logout()}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={16} />
          Sair da plataforma
        </button>
      </div>
    </aside>
  )
}
