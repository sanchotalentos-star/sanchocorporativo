import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { KpiTable } from '@/components/membro/KpiTable'
import { Card, CardContent } from '@/components/ui/card'
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
        <h1 className="text-2xl font-bold text-[#0F172A]">Meus KPIs</h1>
        <p className="text-[#475569] mt-1">Acompanhe e atualize seus indicadores de performance</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
            <div>
              <p className="text-2xl font-bold text-green-600">{green}</p>
              <p className="text-xs text-[#94A3B8]">No alvo</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="text-yellow-500 flex-shrink-0" size={24} />
            <div>
              <p className="text-2xl font-bold text-yellow-600">{yellow}</p>
              <p className="text-xs text-[#94A3B8]">Atenção</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="text-red-500 flex-shrink-0" size={24} />
            <div>
              <p className="text-2xl font-bold text-red-600">{red}</p>
              <p className="text-xs text-[#94A3B8]">Crítico</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <KpiTable kpis={kpis} onUpdateAtual={handleUpdateAtual} />
    </div>
  )
}
