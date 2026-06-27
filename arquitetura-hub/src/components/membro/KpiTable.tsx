import { useState } from 'react'
import { TrendingUp, TrendingDown, Pencil, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getPercent, getStatusColor } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { SparkLine } from '@/components/shared/SparkLine'
import { StatusChip } from '@/components/shared/StatusChip'
import type { KpiEntry } from '@/types'

interface KpiTableProps {
  kpis: KpiEntry[]
  onUpdateAtual?: (id: string, value: number) => void
}

const categoryColors: Record<string, string> = {
  'Conteúdo': 'blue',
  'Conversão': 'green',
  'Autoridade': 'accent',
  'Mídia': 'purple',
  'Rede': 'default',
  'Receita': 'yellow',
}

export function KpiTable({ kpis, onUpdateAtual }: KpiTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  function startEdit(kpi: KpiEntry) {
    setEditingId(kpi.id)
    setEditValue(String(kpi.atual))
  }

  function commitEdit(kpi: KpiEntry) {
    const val = parseFloat(editValue)
    if (!isNaN(val) && onUpdateAtual) {
      onUpdateAtual(kpi.id, val)
    }
    setEditingId(null)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
            <th className="text-left px-4 py-3 font-semibold text-[#475569]">KPI</th>
            <th className="text-left px-4 py-3 font-semibold text-[#475569]">Categoria</th>
            <th className="text-right px-4 py-3 font-semibold text-[#475569]">Atual</th>
            <th className="text-right px-4 py-3 font-semibold text-[#475569]">Meta</th>
            <th className="text-left px-4 py-3 font-semibold text-[#475569] hidden md:table-cell">Progresso</th>
            <th className="text-center px-4 py-3 font-semibold text-[#475569] hidden lg:table-cell">Tendência</th>
            <th className="text-center px-4 py-3 font-semibold text-[#475569]">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {kpis.map((kpi) => {
            const pct = getPercent(kpi.atual, kpi.meta)
            const status = getStatusColor(pct)
            const isEditing = editingId === kpi.id
            const history = kpi.history
            const trend = history.length >= 2
              ? ((history[history.length - 1] - history[history.length - 2]) / (history[history.length - 2] || 1)) * 100
              : 0

            return (
              <tr key={kpi.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]">
                <td className="px-4 py-3 font-medium text-[#0F172A]">{kpi.kpi_name}</td>
                <td className="px-4 py-3">
                  <Badge variant={categoryColors[kpi.category] as 'blue' | 'green' | 'accent' | 'purple' | 'default' | 'yellow'}>
                    {kpi.category}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-[#0F172A]">
                  {isEditing ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') commitEdit(kpi); if (e.key === 'Escape') cancelEdit() }}
                      className="w-20 text-right border border-[#1B3A5C] rounded px-2 py-1 text-sm focus:outline-none"
                    />
                  ) : (
                    <span>{kpi.atual} <span className="text-xs text-[#94A3B8]">{kpi.unit}</span></span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-[#475569]">
                  {kpi.meta} <span className="text-xs text-[#94A3B8]">{kpi.unit}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Progress value={pct} className="w-24 h-1.5" indicatorClassName={cn(
                      status === 'green' ? 'bg-green-500' : status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                    )} />
                    <span className="text-xs text-[#475569] w-8">{pct}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex items-center justify-center gap-2">
                    <SparkLine data={kpi.history} color={status === 'green' ? '#22c55e' : status === 'yellow' ? '#eab308' : '#ef4444'} />
                    <span className={cn('text-xs font-medium flex items-center gap-0.5',
                      trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-500' : 'text-[#94A3B8]'
                    )}>
                      {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : null}
                      {Math.abs(trend).toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusChip status={status} />
                </td>
                <td className="px-4 py-3">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => commitEdit(kpi)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(kpi)}
                      className="p-1 text-[#94A3B8] hover:text-[#1B3A5C] hover:bg-[#F1F5F9] rounded"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
