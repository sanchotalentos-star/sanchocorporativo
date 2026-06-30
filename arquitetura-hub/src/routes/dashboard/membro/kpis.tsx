import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { KpiTable } from '@/components/membro/KpiTable'
import { mockKpis } from '@/lib/mocks/kpis'
import { getPercent, getStatusColor } from '@/lib/utils'
import type { KpiEntry } from '@/types'

export const Route = createFileRoute('/dashboard/membro/kpis')({
  component: KpisPage,
})

function KpisPage() {
  const [kpis, setKpis] = useState<KpiEntry[]>(mockKpis)

  const green = kpis.filter(k => getStatusColor(getPercent(k.atual, k.meta)) === 'green').length
  const yellow = kpis.filter(k => getStatusColor(getPercent(k.atual, k.meta)) === 'yellow').length
  const red = kpis.filter(k => getStatusColor(getPercent(k.atual, k.meta)) === 'red').length

  function handleUpdateAtual(id: string, value: number) {
    setKpis(prev => prev.map(k => {
      if (k.id !== id) return k
      const newHistory = [...k.history.slice(-5), value]
      return { ...k, atual: value, history: newHistory }
    }))
    toast.success('KPI atualizado com sucesso')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Meus KPIs</h1>
        <p className="text-[#4A7FA5] mt-1">Acompanhe e atualize seus indicadores de performance</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle className="text-emerald-400" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-400">{green}</p>
            <p className="text-xs text-[#4A7FA5]">No alvo</p>
          </div>
        </div>
        <div className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <AlertCircle className="text-amber-400" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-400">{yellow}</p>
            <p className="text-xs text-[#4A7FA5]">Atenção</p>
          </div>
        </div>
        <div className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <XCircle className="text-red-400" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-400">{red}</p>
            <p className="text-xs text-[#4A7FA5]">Crítico</p>
          </div>
        </div>
      </div>

      <KpiTable kpis={kpis} onUpdateAtual={handleUpdateAtual} />
    </div>
  )
}
