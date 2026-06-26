import { createFileRoute } from '@tanstack/react-router'
import { RankingTable } from '@/components/membro/RankingTable'
import { mockMembers } from '@/lib/mocks/members'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/dashboard/membro/ranking')({
  component: RankingPage,
})

function RankingPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Ranking do Programa</h1>
        <p className="text-[#475569] mt-1">Veja sua posição em relação aos outros participantes</p>
      </div>
      <RankingTable members={mockMembers} currentUserId={user?.id} />
    </div>
  )
}
