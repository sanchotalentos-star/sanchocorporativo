import { useState } from 'react'
import { TrendingUp, TrendingDown, Pencil, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getPercent, getStatusColor } from '@/lib/utils'
import { SparkLine } from '@/components/shared/SparkLine'
import type { KpiEntry } from '@/types'

interface KpiTableProps {
  kpis: KpiEntry[]
  onUpdateAtual?: (id: string, value: number) => void
}

const categoryColors: Record<string, string> = {
  'Conteúdo': '#3B82F6',
  'Conversão': '#10B981',
  'Autoridade': '#F59E0B',
  'Mídia': '#8B5CF6',
  'Rede': '#4A7FA5',
  'Receita': '#EF4444',
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
    <div className="rounded-2xl border border-[#1A2E4A] bg-[#0D1B2E] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#1A2E4A] bg-[#0A1420]">
            <th className="text-left px-4 py-3 font-semibold text-[#4A7FA5] text-xs uppercase tracking-wider">KPI</th>
            <th className="text-left px-4 py-3 font-semibold text-[#4A7FA5] text-xs uppercase tracking-wider">Categoria</th>
            <th className="text-right px-4 py-3 font-semibold text-[#4A7FA5] text-xs uppercase tracking-wider">Atual</th>
            <th className="text-right px-4 py-3 font-semibold text-[#4A7FA5] text-xs uppercase tracking-wider">Meta</th>
            <th className="text-left px-4 py-3 font-semibold text-[#4A7FA5] text-xs uppercase tracking-wider hidden md:table-cell">Progresso</th>
            <th className="text-center px-4 py-3 font-semibold text-[#4A7FA5] text-xs uppercase tracking-wider hidden lg:table-cell">Tendência</th>
            <th className="text-center px-4 py-3 font-semibold text-[#4A7FA5] text-xs uppercase tracking-wider">Status</th>
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
            const statusColor = status === 'green' ? '#10B981' : status === 'yellow' ? '#F59E0B' : '#EF4444'
            const catColor = categoryColors[kpi.category] ?? '#4A7FA5'

            return (
              <tr key={kpi.id} className="border-b border-[#1A2E4A]/50 last:border-0 hover:bg-[#112240] transition-colors">
                <td className="px-4 py-3 font-semibold text-white">{kpi.kpi_name}</td>
                <td className="px-4 py-3">
                  <span
                    className="text-[10px] font-bold px-2 py-1 rounded-lg"
                    style={{ background: `${catColor}15`, color: catColor }}
                  >
                    {kpi.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-bold text-white">
                  {isEditing ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') commitEdit(kpi); if (e.key === 'Escape') cancelEdit() }}
                      className="w-20 text-right border border-[#F59E0B] rounded-lg px-2 py-1 text-sm bg-[#112240] text-white focus:outline-none"
                    />
                  ) : (
                    <span>{kpi.atual} <span className="text-xs text-[#4A7FA5] font-normal">{kpi.unit}</span></span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-[#4A7FA5]">
                  {kpi.meta} <span className="text-xs">{kpi.unit}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-[#112240]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${Math.min(pct, 100)}%`, background: statusColor }}
                      />
                    </div>
                    <span className="text-xs font-bold w-8" style={{ color: statusColor }}>{pct}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex items-center justify-center gap-2">
                    <SparkLine data={kpi.history} color={statusColor} />
                    <span className={cn('text-xs font-bold flex items-center gap-0.5',
                      trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-[#4A7FA5]'
                    )}>
                      {trend > 0 ? <TrendingUp size={11} /> : trend < 0 ? <TrendingDown size={11} /> : null}
                      {Math.abs(trend).toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className="text-[10px] font-bold px-2 py-1 rounded-lg"
                    style={{ background: `${statusColor}15`, color: statusColor }}
                  >
                    {status === 'green' ? 'No alvo' : status === 'yellow' ? 'Atenção' : 'Crítico'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => commitEdit(kpi)} className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded-lg">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(kpi)}
                      className="p-1.5 text-[#4A7FA5] hover:text-white hover:bg-[#112240] rounded-lg transition-colors"
                    >
                      <Pencil size={13} />
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
