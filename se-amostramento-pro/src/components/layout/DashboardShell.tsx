import { Outlet, useRouterState } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { AuthGuard } from './AuthGuard'

interface DashboardShellProps {
  mode: 'admin' | 'member'
}

const pageTitles: Record<string, string> = {
  '/dashboard/admin': 'Overview',
  '/dashboard/admin/clientes': 'Clientes',
  '/dashboard/admin/membros': 'Membros',
  '/dashboard/admin/solicitacoes': 'Solicitações',
  '/dashboard/admin/trilhas': 'Trilhas',
  '/dashboard/admin/upload': 'Upload de Conteúdo',
  '/dashboard/admin/lives': 'Lives',
  '/dashboard/admin/acesso': 'Controle de Acesso',
  '/dashboard/admin/relatorios': 'Relatórios',
  '/dashboard/membro': 'Home',
  '/dashboard/membro/trilhas': 'Trilhas',
  '/dashboard/membro/materiais': 'Materiais',
  '/dashboard/membro/lives': 'Lives',
  '/dashboard/membro/progresso': 'Meu Progresso',
  '/dashboard/membro/ranking': 'Ranking',
}

export function DashboardShell({ mode }: DashboardShellProps) {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const title = pageTitles[pathname] ?? 'SE Amostramento Pro'

  return (
    <AuthGuard requiredRole={mode === 'admin' ? 'admin' : 'member'}>
      <div className="flex h-screen bg-[#080810] overflow-hidden">
        <Sidebar mode={mode} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar title={title} />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
