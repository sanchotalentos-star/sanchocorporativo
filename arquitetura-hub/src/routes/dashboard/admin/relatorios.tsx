import { createFileRoute } from '@tanstack/react-router'
import { GlobalKpiOverview } from '@/components/admin/GlobalKpiOverview'
import { mockAggregateGrowth } from '@/lib/mocks/analytics'
import { mockMembers } from '@/lib/mocks/members'

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
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Visão Consolidada</p>
        <h1 className="text-2xl font-black text-gray-900">Relatórios</h1>
        <p className="text-sm text-gray-500 mt-1">Evolução agregada de todos os participantes</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200">
        {[
          { label: 'Alcance Total', value: `${(totalReach / 1000).toFixed(1)}k` },
          { label: 'Leads Gerados', value: totalLeads },
          { label: 'Crescimento', value: `+${growthPct}%` },
          { label: 'Participantes', value: mockMembers.length },
        ].map(item => (
          <div key={item.label} className="bg-white p-5">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
            <p className="text-2xl font-black text-gray-900 mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Crescimento Agregado</p>
        </div>
        <div className="p-5">
          <GlobalKpiOverview data={mockAggregateGrowth} />
        </div>
      </div>

    </div>
  )
}
