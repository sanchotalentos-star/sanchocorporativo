import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { DashboardShell } from '@/components/layout/DashboardShell'

export const Route = createFileRoute('/dashboard/membro')({
  component: MembroLayout,
})

function MembroLayout() {
  return (
    <AuthGuard requiredRole="membro">
      <DashboardShell>
        <Outlet />
      </DashboardShell>
    </AuthGuard>
  )
}
