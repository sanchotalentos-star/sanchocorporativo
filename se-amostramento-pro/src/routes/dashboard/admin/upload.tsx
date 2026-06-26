import { createFileRoute } from '@tanstack/react-router'
import { UploadWizard } from '@/components/admin/UploadWizard'

export const Route = createFileRoute('/dashboard/admin/upload')({
  component: UploadPage,
})

function UploadPage() {
  return <UploadWizard />
}
