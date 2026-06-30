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
        <h1 className="text-2xl font-bold text-white">Gestão de Membros</h1>
        <p className="text-[#4A7FA5] mt-1">{mockMembers.length} participantes ativos no programa</p>
      </div>
      <MemberTable members={mockMembers} />
    </div>
  )
}
