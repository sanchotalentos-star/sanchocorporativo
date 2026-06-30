import { Link, useRouterState } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard, Users, BarChart3, Target, Calendar,
  TrendingUp, Trophy, FileText, LogOut, Zap,
  Crosshair, Megaphone, BookOpen
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
    <aside className="flex flex-col w-64 min-h-screen bg-[#070E1A] border-r border-[#1A2E4A]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#1A2E4A]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-lg shadow-amber-500/20">
          <BookOpen size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">Arquitetura de</p>
          <p className="text-xs text-[#4A7FA5]">Relevância Hub</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-[#1A2E4A]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-sm font-bold text-white shadow-md">
            {user?.full_name?.charAt(0) ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.full_name}</p>
            <p className="text-xs text-[#4A7FA5] capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Phase tracker (only for membros) */}
      {user?.role !== 'admin' && (
        <div className="px-5 py-3 border-b border-[#1A2E4A]">
          <p className="text-[10px] font-bold text-[#4A7FA5] uppercase tracking-widest mb-2">Fase Atual</p>
          <div className="flex items-center gap-1">
            {phases.map((phase, i) => (
              <div key={phase.num} className="flex items-center gap-1">
                <div className={cn(
                  'flex flex-col items-center',
                  i > 0 && ''
                )}>
                  <div className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all',
                    phase.active
                      ? 'bg-[#F59E0B] text-white shadow-md shadow-amber-500/30'
                      : 'bg-[#112240] text-[#3A5A7A] border border-[#1A2E4A]'
                  )}>
                    {phase.num}
                  </div>
                </div>
                {i < phases.length - 1 && (
                  <div className="w-3 h-px bg-[#1A2E4A]" />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-[#F59E0B] font-medium mt-1.5">Fase 1 — {phases[0].label}</p>
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
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-[#0F2A47] text-white border border-[#1A4A6E]'
                    : 'text-[#4A7FA5] hover:text-white hover:bg-[#0A1E30]'
                )}
              >
                <item.icon size={16} className={active ? 'text-[#F59E0B]' : ''} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-bold bg-[#F59E0B] text-black px-1.5 py-0.5 rounded-md">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t border-[#1A2E4A] pt-3">
        <button
          onClick={() => void logout()}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-[#4A7FA5] hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  )
}
