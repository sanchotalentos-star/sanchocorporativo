import { createFileRoute } from '@tanstack/react-router'
import { LiveManager } from '@/components/admin/LiveManager'

export const Route = createFileRoute('/dashboard/admin/lives')({
  component: LivesAdminPage,
})

function LivesAdminPage() {
  return <LiveManager />
}
