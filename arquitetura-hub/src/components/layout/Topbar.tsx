import { Menu } from 'lucide-react'
import { useRouterState } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'

const pageNames: Record<string, string> = {
  '/dashboard/membro':                'Início',
  '/dashboard/membro/okr':            'Metas de Impacto',
  '/dashboard/membro/posicionamento': 'Minha Identidade',
  '/dashboard/membro/pilares':        'Pilares da Marca',
  '/dashboard/membro/marketing':      'Marketing Anual',
  '/dashboard/membro/agenda':         'Agenda',
  '/dashboard/membro/kpis':           'Indicadores',
  '/dashboard/membro/relatorios':     'Relatórios',
  '/dashboard/membro/ranking':        'Ranking',
  '/dashboard/admin':                 'Visão Geral',
  '/dashboard/admin/membros':         'Membros',
  '/dashboard/admin/relatorios':      'Relatórios',
}

interface TopbarProps {
  onMenuClick?: () => void
  title?: string
}

export function Topbar({ onMenuClick, title }: TopbarProps) {
  const { user } = useAuth()
  const routerState = useRouterState()
  const pathname  = routerState.location.pathname
  const pageName  = pageNames[pathname] ?? title ?? ''
  const firstName = user?.full_name?.split(' ')[0] ?? ''

  return (
    <header className="h-12 border-b border-gray-200 bg-white flex items-center justify-between px-6 flex-shrink-0">

      {/* Left */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-400 hover:text-gray-700 mr-1"
          >
            <Menu size={18} />
          </button>
        )}
        <p className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">{pageName}</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-semibold text-gray-700 leading-tight">{firstName}</p>
            <p className="text-[9px] text-gray-400 uppercase tracking-wider">
              {user?.role === 'admin' ? 'Mentor' : 'Mentorado'}
            </p>
          </div>
          <div className="w-7 h-7 bg-[#7B2FBE] flex items-center justify-center text-white text-[11px] font-black flex-shrink-0">
            {user?.full_name?.charAt(0) ?? 'U'}
          </div>
        </div>
      </div>
    </header>
  )
}
