import { Link, useRouterState } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard, Users, BarChart3, Target, Calendar,
  TrendingUp, Trophy, FileText, LogOut, Zap,
  Crosshair, Megaphone
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
  { label: 'Visão Geral', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'Membros', href: '/dashboard/admin/membros', icon: Users },
  { label: 'Relatórios', href: '/dashboard/admin/relatorios', icon: FileText },
]

const membroNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/membro', icon: LayoutDashboard },
  { label: 'OKRs', href: '/dashboard/membro/okr', icon: Crosshair, badge: 'Novo' },
  { label: 'Pilares', href: '/dashboard/membro/pilares', icon: Target },
  { label: 'Posicionamento', href: '/dashboard/membro/posicionamento', icon: Zap, badge: 'Novo' },
  { label: 'Marketing Anual', href: '/dashboard/membro/marketing', icon: Megaphone, badge: 'Novo' },
  { label: 'Agenda', href: '/dashboard/membro/agenda', icon: Calendar },
  { label: 'KPIs', href: '/dashboard/membro/kpis', icon: BarChart3 },
  { label: 'Relatórios', href: '/dashboard/membro/relatorios', icon: TrendingUp },
  { label: 'Ranking', href: '/dashboard/membro/ranking', icon: Trophy },
]

const phases = [
  { num: 1, label: 'OKR & MVP', active: true },
  { num: 2, label: 'Autoridade', active: false },
  { num: 3, label: 'PDCA→OKR', active: false },
  { num: 4, label: 'PDCA→OKR', active: false },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  const nav = user?.role === 'admin' ? adminNav : membroNav

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded flex items-center justify-center bg-[#7B2FBE]">
          <span className="text-white font-black text-[10px] tracking-wider">AR</span>
        </div>
        <div>
          <p className="text-[11px] font-black text-gray-900 leading-tight uppercase tracking-tight">Arquitetura de Relevância</p>
          <p className="text-[10px] text-[#7B2FBE] font-bold uppercase tracking-widest">Hub</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
            {user?.full_name?.charAt(0) ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 truncate leading-tight">{user?.full_name}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Phase tracker (only for membros) */}
      {user?.role !== 'admin' && (
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Fase Atual</p>
          <div className="flex items-center gap-1">
            {phases.map((phase, i) => (
              <div key={phase.num} className="flex items-center gap-1">
                <div className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-all',
                  phase.active
                    ? 'bg-[#7B2FBE] text-white shadow-sm shadow-[#7B2FBE]/30'
                    : 'bg-gray-200 text-gray-400'
                )}>
                  {phase.num}
                </div>
                {i < phases.length - 1 && (
                  <div className="w-3 h-px bg-gray-200" />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-[#7B2FBE] font-bold mt-1.5 uppercase tracking-wide">Fase 1 — {phases[0].label}</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {nav.map((item) => {
          const active = pathname === item.href || (
            item.href !== '/dashboard/admin' &&
            item.href !== '/dashboard/membro' &&
            pathname.startsWith(item.href)
          )
          return (
            <Link key={item.href} to={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150',
                  active
                    ? 'bg-[#7B2FBE] text-white'
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                <item.icon size={15} strokeWidth={active ? 2.5 : 1.75} />
                <span className={cn('flex-1 text-[13px]', active ? 'font-bold' : 'font-medium')}>{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    'text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest',
                    active ? 'bg-white/20 text-white' : 'bg-[#7B2FBE]/10 text-[#7B2FBE]'
                  )}>
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
          Sair
        </button>
      </div>
    </aside>
  )
}
