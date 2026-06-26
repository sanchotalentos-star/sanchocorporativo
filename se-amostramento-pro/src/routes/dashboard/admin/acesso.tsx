import { createFileRoute } from '@tanstack/react-router'
import { AccessMatrix } from '@/components/admin/AccessMatrix'

export const Route = createFileRoute('/dashboard/admin/acesso')({
  component: AcessoPage,
})

function AcessoPage() {
  return (
    <div className="space-y-4">
      <div className="bg-[#0F0F1A] border border-[#2A2A40] rounded-xl px-5 py-3">
        <p className="text-sm text-[#C4B5FD]">
          Use a matriz abaixo para controlar quais organizações têm acesso a cada trilha. As alterações são salvas automaticamente.
        </p>
      </div>
      <div className="bg-[#18182A] border border-[#2A2A40] rounded-xl overflow-hidden">
        <AccessMatrix />
      </div>
    </div>
  )
}
