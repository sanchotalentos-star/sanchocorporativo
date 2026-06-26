import { createFileRoute } from '@tanstack/react-router'
import { DashboardShell } from '@/components/layout/DashboardShell'

export const Route = createFileRoute('/dashboard/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return <DashboardShell mode="admin" />
}
