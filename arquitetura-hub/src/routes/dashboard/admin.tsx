import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { DashboardShell } from '@/components/layout/DashboardShell'

export const Route = createFileRoute('/dashboard/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <AuthGuard requiredRole="admin">
      <DashboardShell>
        <Outlet />
      </DashboardShell>
    </AuthGuard>
  )
}
