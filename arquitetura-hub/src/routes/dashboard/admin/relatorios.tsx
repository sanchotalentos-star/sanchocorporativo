import { createFileRoute } from '@tanstack/react-router'
import { GlobalKpiOverview } from '@/components/admin/GlobalKpiOverview'
import { mockAggregateGrowth } from '@/lib/mocks/analytics'
import { mockMembers } from '@/lib/mocks/members'
import { RankingTable } from '@/components/membro/RankingTable'

export const Route = createFileRoute('/dashboard/admin/relatorios')({
  component: AdminRelatorios,
})

function AdminRelatorios() {
  const totalReach = mockAggregateGrowth[mockAggregateGrowth.length - 1].alcance
  const totalLeads = mockAggregateGrowth[mockAggregateGrowth.length - 1].leads
  const growthPct = Math.round(((totalReach - mockAggregateGrowth[0].alcance) / mockAggregateGrowth[0].alcance) * 100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight">Relatórios Globais</h1>
        <p className="text-gray-400 mt-1 text-sm">Visão consolidada de todos os participantes</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Alcance Total', value: `${(totalReach / 1000).toFixed(1)}k` },
          { label: 'Leads Gerados', value: totalLeads },
          { label: 'Crescimento', value: `+${growthPct}%` },
          { label: 'Participantes', value: mockMembers.length },
        ].map(item => (
          <div key={item.label} className="rounded-xl bg-white border border-gray-200 shadow-sm p-5">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{item.label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Crescimento Agregado</h3>
        <GlobalKpiOverview data={mockAggregateGrowth} />
      </div>

      <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Ranking Geral</h3>
        </div>
        <RankingTable members={mockMembers} />
      </div>
    </div>
  )
}
