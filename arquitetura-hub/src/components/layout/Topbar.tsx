import { Menu } from 'lucide-react'
import { useRouterState } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'

const pageNames: Record<string, string> = {
  '/dashboard/membro':                'Home',
  '/dashboard/membro/okr':            'Metas de Impacto',
  '/dashboard/membro/posicionamento': 'Minha Identidade',
  '/dashboard/membro/pilares':        'Pilares da Marca',
  '/dashboard/membro/marketing':      'Marketing Anual',
  '/dashboard/membro/agenda':         'Agenda',
  '/dashboard/membro/kpis':           'Indicadores',
  '/dashboard/membro/tarefas':        'Tarefas',
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
    <header style={{
      height: 48, flexShrink: 0,
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      background: '#0D0C0B',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px',
    }}>

      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {onMenuClick && (
          <button onClick={onMenuClick} className="lg:hidden"
            style={{ color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 }}>
            <Menu size={18} />
          </button>
        )}
        <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.45)', margin: 0, letterSpacing: '0.02em' }}>{pageName}</p>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="hidden sm:block" style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#EFECE6', lineHeight: 1.3 }}>{firstName}</p>
            <p style={{ fontSize: 9, color: '#75716B', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
              {user?.role === 'admin' ? 'Mentor' : 'Mentorado'}
            </p>
          </div>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: '#2A2420', border: '1px solid rgba(197,168,128,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600, color: '#C5A880', flexShrink: 0,
          }}>
            {user?.full_name?.charAt(0) ?? 'U'}
          </div>
        </div>
      </div>
    </header>
  )
}
