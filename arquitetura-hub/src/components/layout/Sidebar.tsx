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
  { label: 'Minha Identidade',  href: '/dashboard/membro/posicionamento', icon: Compass     },
  { label: 'Pilares da Marca',  href: '/dashboard/membro/pilares',        icon: Layers      },
  { label: 'Metas de Impacto',  href: '/dashboard/membro/okr',            icon: Rocket      },
  { label: 'Marketing Anual',   href: '/dashboard/membro/marketing',      icon: Megaphone   },
  { label: 'Indicadores',       href: '/dashboard/membro/kpis',           icon: BarChart2   },
  { label: 'Agenda',            href: '/dashboard/membro/agenda',         icon: CalendarDays },
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
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <div className="w-7 h-7 bg-[#7B2FBE] flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-black text-white tracking-widest">AR</span>
        </div>
        <div>
          <p className="text-[12px] font-bold text-white leading-tight tracking-wide">Arquitetura</p>
          <p className="text-[10px] text-[#7B2FBE] font-semibold tracking-wider uppercase">de Relevância</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#7B2FBE] flex items-center justify-center text-xs font-black text-white flex-shrink-0">
            {user?.full_name?.charAt(0) ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white truncate leading-tight">{user?.full_name}</p>
            <p className="text-[10px] text-white/30 mt-0.5 uppercase tracking-wider">
              {user?.role === 'admin' ? 'Mentor' : 'Mentorado'}
            </p>
          </div>
        </div>
      </div>

      {/* Journey tracker — only for membros */}
      {user?.role !== 'admin' && (
        <div className="px-5 py-4 border-b border-white/5">
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-3">Sua Jornada</p>
          <div className="space-y-2.5">
            {journeyStages.map((stage) => {
              const isDone    = stage.num < currentStage
              const isCurrent = stage.num === currentStage
              return (
                <div key={stage.num} className="flex items-center gap-3">
                  <div className={cn(
                    'w-1 h-1 flex-shrink-0',
                    isCurrent ? 'bg-[#7B2FBE] scale-150' : isDone ? 'bg-white/40' : 'bg-white/10',
                  )} />
                  <span className={cn(
                    'text-[11px] leading-none',
                    isCurrent ? 'text-white font-semibold' :
                    isDone    ? 'text-white/30 line-through' :
                                'text-white/20'
                  )}>
                    {stage.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[8px] font-bold text-[#7B2FBE] uppercase tracking-widest ml-auto">Atual</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
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
                'flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-100 cursor-pointer border-l-2',
                active
                  ? 'border-[#7B2FBE] bg-white/5 text-white'
                  : 'border-transparent text-white/35 hover:bg-white/3 hover:text-white/60'
              )}>
                <item.icon size={14} strokeWidth={active ? 2.5 : 1.75} className="flex-shrink-0" />
                <span className={cn('flex-1 text-[12px] tracking-wide', active ? 'font-semibold' : 'font-normal')}>
                  {item.label}
                </span>
                {item.badge && (
                  <span className="text-[9px] font-bold text-[#7B2FBE] uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/5 py-3">
        <button
          onClick={() => void logout()}
          className="flex items-center gap-3 px-5 py-2.5 w-full text-sm font-normal text-white/25 hover:text-red-400 transition-all"
        >
          <LogOut size={14} />
          <span className="text-[12px]">Sair da plataforma</span>
        </button>
      </div>
    </aside>
  )
}
