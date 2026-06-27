import { Link, useRouterState } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard, Users, BarChart3, Target, Calendar,
  TrendingUp, Trophy, FileText, LogOut, Star
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

const adminNav: NavItem[] = [
  { label: 'Visão Geral', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'Membros', href: '/dashboard/admin/membros', icon: Users },
  { label: 'Relatórios', href: '/dashboard/admin/relatorios', icon: FileText },
]

const membroNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/membro', icon: LayoutDashboard },
  { label: 'Pilares', href: '/dashboard/membro/pilares', icon: Target },
  { label: 'Agenda', href: '/dashboard/membro/agenda', icon: Calendar },
  { label: 'KPIs', href: '/dashboard/membro/kpis', icon: BarChart3 },
  { label: 'Relatórios', href: '/dashboard/membro/relatorios', icon: TrendingUp },
  { label: 'Ranking', href: '/dashboard/membro/ranking', icon: Trophy },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  const nav = user?.role === 'admin' ? adminNav : membroNav

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-[#1B3A5C] text-white">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-[#D97706] flex items-center justify-center">
          <Star size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight">Arquitetura de</p>
          <p className="text-xs text-white/60">Relevância Hub</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#D97706] flex items-center justify-center text-sm font-bold">
            {user?.full_name?.charAt(0) ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.full_name}</p>
            <p className="text-xs text-white/50 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard/admin' && item.href !== '/dashboard/membro' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} to={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                )}
              >
                <item.icon size={18} />
                {item.label}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          onClick={() => void logout()}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  )
}
