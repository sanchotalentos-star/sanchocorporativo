import { createFileRoute } from '@tanstack/react-router'
import { MemberTable } from '@/components/admin/MemberTable'
import { mockMembers } from '@/lib/mocks/members'

export const Route = createFileRoute('/dashboard/admin/membros')({
  component: MembrosPage,
})

function MembrosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Gestão de Membros</h1>
        <p className="text-gray-400 mt-1 text-sm">{mockMembers.length} participantes ativos no programa</p>
      </div>
      <MemberTable members={mockMembers} />
    </div>
  )
}
