import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Building2,
  Users,
  ClipboardList,
  BookOpen,
  Upload,
  Radio,
  KeyRound,
  BarChart3,
  Home,
  PlayCircle,
  Package,
  TrendingUp,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const adminNav: NavItem[] = [
  { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'Clientes', href: '/dashboard/admin/clientes', icon: Building2 },
  { label: 'Membros', href: '/dashboard/admin/membros', icon: Users },
  { label: 'Solicitações', href: '/dashboard/admin/solicitacoes', icon: ClipboardList },
  { label: 'Trilhas', href: '/dashboard/admin/trilhas', icon: BookOpen },
  { label: 'Upload', href: '/dashboard/admin/upload', icon: Upload },
  { label: 'Lives', href: '/dashboard/admin/lives', icon: Radio },
  { label: 'Acesso', href: '/dashboard/admin/acesso', icon: KeyRound },
  { label: 'Relatórios', href: '/dashboard/admin/relatorios', icon: BarChart3 },
]

const memberNav: NavItem[] = [
  { label: 'Home', href: '/dashboard/membro', icon: Home },
  { label: 'Trilhas', href: '/dashboard/membro/trilhas', icon: BookOpen },
  { label: 'Materiais', href: '/dashboard/membro/materiais', icon: Package },
  { label: 'Lives', href: '/dashboard/membro/lives', icon: PlayCircle },
  { label: 'Progresso', href: '/dashboard/membro/progresso', icon: TrendingUp },
  { label: 'Ranking', href: '/dashboard/membro/ranking', icon: Trophy },
]

interface SidebarProps {
  mode: 'admin' | 'member'
}

import type React from 'react'

export function Sidebar({ mode }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const nav = mode === 'admin' ? adminNav : memberNav

  return (
    <aside
      className={cn(
        'flex flex-col bg-[#0F0F1A] border-r border-[#2A2A40] transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center h-16 px-4 border-b border-[#2A2A40]', collapsed && 'justify-center')}>
        {!collapsed && (
          <span
            className="font-display font-bold text-sm tracking-wider leading-tight"
            style={{ background: 'linear-gradient(135deg, #2979FF, #7B2FBE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            SE AMOSTRAMENTO<br />PRO
          </span>
        )}
        {collapsed && (
          <span className="font-display font-bold text-[#7B2FBE] text-lg">S</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== '/dashboard/admin' && item.href !== '/dashboard/membro' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-150 relative',
                'hover:bg-[#2A2A40] hover:text-white',
                active
                  ? 'bg-[#7B2FBE]/20 text-white border-r-2 border-[#7B2FBE]'
                  : 'text-[#7C7C9C]',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', active && 'text-[#9D4FE3]')} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-[#2A2A40] text-[#7C7C9C] hover:text-white hover:bg-[#2A2A40] transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  )
}
