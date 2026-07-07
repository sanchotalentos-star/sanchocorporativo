import { Bell, Menu, ChevronRight } from 'lucide-react'
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
  const section   = user?.role === 'admin' ? 'Admin' : 'Jornada de Marca'
  const firstName = user?.full_name?.split(' ')[0] ?? ''

  return (
    <header className="h-14 border-b border-gray-100 bg-white flex items-center justify-between px-6 flex-shrink-0">

      {/* Left */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-400 hover:text-gray-700 mr-1"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-gray-400">{section}</span>
          {pageName && pageName !== 'Início' && (
            <>
              <ChevronRight size={13} className="text-gray-300" />
              <span className="text-sm font-medium text-gray-800">{pageName}</span>
            </>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#7B2FBE] rounded-full" />
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-gray-800 leading-tight">{firstName}</p>
            <p className="text-[10px] text-gray-400">
              {user?.role === 'admin' ? 'Mentor' : 'Mentorado(a)'}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#7B2FBE] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {user?.full_name?.charAt(0) ?? 'U'}
          </div>
        </div>
      </div>
    </header>
  )
}
