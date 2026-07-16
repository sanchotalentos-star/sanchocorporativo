import { createFileRoute } from '@tanstack/react-router'
import { GlobalKpiOverview } from '@/components/admin/GlobalKpiOverview'
import { mockMembers } from '@/lib/mocks/members'

export const Route = createFileRoute('/dashboard/admin/relatorios')({
  component: AdminRelatorios,
})

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

function buildAggregateGrowth() {
  if (mockMembers.length === 0) return []
  const len = Math.max(...mockMembers.map(m => m.growth?.length ?? 0))
  if (len === 0) return []
  const months = mockMembers[0].growth.map(g => g.month)
  return months.map((month, i) => ({
    month,
    alcance:    mockMembers.reduce((sum, m) => sum + (m.growth?.[i]?.alcance ?? 0), 0),
    leads:      mockMembers.reduce((sum, m) => sum + (m.growth?.[i]?.leads ?? 0), 0),
    conversoes: mockMembers.reduce((sum, m) => sum + (m.growth?.[i]?.conversoes ?? 0), 0),
  }))
}

function AdminRelatorios() {
  const aggregateGrowth = buildAggregateGrowth()
  const lastEntry  = aggregateGrowth[aggregateGrowth.length - 1]
  const firstEntry = aggregateGrowth[0]
  const totalReach = lastEntry?.alcance ?? 0
  const totalLeads = lastEntry?.leads ?? 0
  const firstReach = firstEntry?.alcance ?? 0
  const growthPct  = firstReach > 0 ? Math.round(((totalReach - firstReach) / firstReach) * 100) : null

  return (
    <div className="space-y-6">

      <div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Visão Consolidada</p>
        <h1 className="text-2xl font-black text-gray-900">Relatórios</h1>
        <p className="text-sm text-gray-500 mt-1">Evolução agregada de todos os participantes</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200">
        {[
          { label: 'Alcance Total',  value: totalReach >= 1000 ? `${(totalReach / 1000).toFixed(1)}k` : String(totalReach) },
          { label: 'Leads Gerados',  value: String(totalLeads) },
          { label: 'Crescimento',    value: growthPct !== null ? `+${growthPct}%` : '—' },
          { label: 'Participantes',  value: String(mockMembers.length) },
        ].map(item => (
          <div key={item.label} className="bg-white p-5">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
            <p className="text-2xl font-black text-gray-900 mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {aggregateGrowth.length > 0 ? (
        <div className="bg-white border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Crescimento Agregado</p>
          </div>
          <div className="p-5">
            <GlobalKpiOverview data={aggregateGrowth} />
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 px-5 py-12 text-center">
          <p className="text-sm font-bold text-gray-400">Nenhum dado de evolução disponível ainda</p>
          <p className="text-xs text-gray-300 mt-1">Os dados de alcance e leads aparecerão aqui conforme os mentorados preencherem suas métricas.</p>
        </div>
      )}

    </div>
  )
}
