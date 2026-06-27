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
        <h1 className="text-2xl font-bold text-[#0F172A]">Gestão de Membros</h1>
        <p className="text-[#475569] mt-1">{mockMembers.length} participantes ativos no programa</p>
      </div>
      <MemberTable members={mockMembers} />
    </div>
  )
}
