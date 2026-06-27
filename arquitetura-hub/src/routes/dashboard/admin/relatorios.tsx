import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
        <h1 className="text-2xl font-bold text-[#0F172A]">Relatórios Globais</h1>
        <p className="text-[#475569] mt-1">Visão consolidada de todos os participantes</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Alcance Total', value: `${(totalReach / 1000).toFixed(1)}k` },
          { label: 'Leads Gerados', value: totalLeads },
          { label: 'Crescimento', value: `+${growthPct}%` },
          { label: 'Participantes', value: mockMembers.length },
        ].map(item => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <p className="text-sm text-[#475569]">{item.label}</p>
              <p className="text-2xl font-bold text-[#0F172A] mt-1">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Crescimento Agregado</CardTitle></CardHeader>
        <CardContent>
          <GlobalKpiOverview data={mockAggregateGrowth} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Ranking Geral</CardTitle></CardHeader>
        <CardContent className="p-0">
          <RankingTable members={mockMembers} />
        </CardContent>
      </Card>
    </div>
  )
}
