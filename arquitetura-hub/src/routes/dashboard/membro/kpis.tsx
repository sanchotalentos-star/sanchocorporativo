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
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Meus KPIs</h1>
        <p className="text-gray-400 mt-1 text-sm">Acompanhe e atualize seus indicadores de performance</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="text-emerald-500" size={20} />
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-500">{green}</p>
            <p className="text-xs text-gray-400 font-medium">No alvo</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <AlertCircle className="text-amber-500" size={20} />
          </div>
          <div>
            <p className="text-2xl font-black text-amber-500">{yellow}</p>
            <p className="text-xs text-gray-400 font-medium">Atenção</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <XCircle className="text-red-500" size={20} />
          </div>
          <div>
            <p className="text-2xl font-black text-red-500">{red}</p>
            <p className="text-xs text-gray-400 font-medium">Crítico</p>
          </div>
        </div>
      </div>

      <KpiTable kpis={kpis} onUpdateAtual={handleUpdateAtual} />
    </div>
  )
}
