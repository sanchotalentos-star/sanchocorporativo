import { useState } from 'react'
import { TrendingUp, TrendingDown, Pencil, Check, X, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getPercent, getStatusColor } from '@/lib/utils'
import { SparkLine } from '@/components/shared/SparkLine'
import type { KpiEntry } from '@/types'

interface KpiTableProps {
  kpis: KpiEntry[]
  onUpdateAtual?: (id: string, value: number) => void
  onDelete?: (id: string) => void
}

const categoryColors: Record<string, string> = {
  'Conteúdo': '#3B82F6',
  'Conversão': '#10B981',
  'Autoridade': '#7B2FBE',
  'Mídia': '#8B5CF6',
  'Rede': '#6B7280',
  'Receita': '#EF4444',
}

export function KpiTable({ kpis, onUpdateAtual, onDelete }: KpiTableProps) {
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
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-4 py-3 font-black text-gray-400 text-[10px] uppercase tracking-widest">Indicador</th>
            <th className="text-left px-4 py-3 font-black text-gray-400 text-[10px] uppercase tracking-widest">Categoria</th>
            <th className="text-right px-4 py-3 font-black text-gray-400 text-[10px] uppercase tracking-widest">Atual</th>
            <th className="text-right px-4 py-3 font-black text-gray-400 text-[10px] uppercase tracking-widest">Meta</th>
            <th className="text-left px-4 py-3 font-black text-gray-400 text-[10px] uppercase tracking-widest hidden md:table-cell">Progresso</th>
            <th className="text-center px-4 py-3 font-black text-gray-400 text-[10px] uppercase tracking-widest hidden lg:table-cell">Tendência</th>
            <th className="text-center px-4 py-3 font-black text-gray-400 text-[10px] uppercase tracking-widest">Status</th>
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
            const catColor = categoryColors[kpi.category] ?? '#6B7280'

            return (
              <tr key={kpi.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-gray-900">{kpi.kpi_name}</td>
                <td className="px-4 py-3">
                  <span
                    className="text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wide"
                    style={{ background: `${catColor}12`, color: catColor }}
                  >
                    {kpi.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-black text-gray-900">
                  {isEditing ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') commitEdit(kpi); if (e.key === 'Escape') cancelEdit() }}
                      className="w-20 text-right border border-[#7B2FBE] rounded-lg px-2 py-1 text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#7B2FBE]/20"
                    />
                  ) : (
                    <span>{kpi.atual} <span className="text-xs text-gray-400 font-normal">{kpi.unit}</span></span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-gray-400">
                  {kpi.meta} <span className="text-xs">{kpi.unit}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${Math.min(pct, 100)}%`, background: statusColor }}
                      />
                    </div>
                    <span className="text-xs font-black w-8" style={{ color: statusColor }}>{pct}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex items-center justify-center gap-2">
                    <SparkLine data={kpi.history} color={statusColor} />
                    <span className={cn('text-xs font-black flex items-center gap-0.5',
                      trend > 0 ? 'text-emerald-500' : trend < 0 ? 'text-red-500' : 'text-gray-400'
                    )}>
                      {trend > 0 ? <TrendingUp size={11} /> : trend < 0 ? <TrendingDown size={11} /> : null}
                      {Math.abs(trend).toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className="text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wide"
                    style={{ background: `${statusColor}12`, color: statusColor }}
                  >
                    {status === 'green' ? 'No alvo' : status === 'yellow' ? 'Atenção' : 'Abaixo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => commitEdit(kpi)} className="p-1 text-emerald-500 hover:bg-emerald-50 rounded-lg">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="p-1 text-red-500 hover:bg-red-50 rounded-lg">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => startEdit(kpi)}
                        className="p-1.5 text-gray-300 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      {onDelete && (
                        <button
                          onClick={() => { if (confirm(`Excluir "${kpi.kpi_name}"?`)) onDelete(kpi.id) }}
                          className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
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
