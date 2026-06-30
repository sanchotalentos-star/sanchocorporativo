import { useState } from 'react'
import { ChevronDown, Check, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { getPercent } from '@/lib/utils'
import type { Pilar, PilarAcao } from '@/types'

interface PilarAccordionProps {
  pilar: Pilar
  onToggleAcao: (pilarId: string, acaoId: string, concluida: boolean) => void
  onAddAcao: (pilarId: string, texto: string) => void
}

export function PilarAccordion({ pilar, onToggleAcao, onAddAcao }: PilarAccordionProps) {
  const [open, setOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  const [newText, setNewText] = useState('')

  const done = pilar.acoes.filter(a => a.concluida).length
  const pct = getPercent(done, pilar.acoes.length)

  function handleAdd() {
    if (!newText.trim()) return
    onAddAcao(pilar.id, newText.trim())
    setNewText('')
    setAdding(false)
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: pilar.cor }} />
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 uppercase tracking-tight text-sm">{pilar.nome}</p>
          <p className="text-xs text-gray-400 mt-0.5">{done}/{pilar.acoes.length} ações concluídas</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-20 hidden sm:flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: pilar.cor }}
              />
            </div>
          </div>
          <span className="text-sm font-black" style={{ color: pilar.cor }}>{pct}%</span>
          <ChevronDown size={15} className={cn('text-gray-300 transition-transform', open && 'rotate-180')} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
              {pilar.descricao && (
                <p className="text-sm text-gray-400 mb-3">{pilar.descricao}</p>
              )}
              {pilar.acoes.map((acao) => (
                <AcaoItem
                  key={acao.id}
                  acao={acao}
                  cor={pilar.cor}
                  onToggle={() => onToggleAcao(pilar.id, acao.id, !acao.concluida)}
                />
              ))}
              {adding ? (
                <div className="flex gap-2 mt-2">
                  <input
                    autoFocus
                    value={newText}
                    onChange={e => setNewText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false) }}
                    placeholder="Descreva a ação..."
                    className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-1 focus:ring-[#7B2FBE]/20"
                  />
                  <button onClick={handleAdd} className="px-3 py-2 bg-[#7B2FBE] text-white rounded-xl text-sm font-black hover:bg-[#6a27a5] uppercase tracking-wide">
                    Adicionar
                  </button>
                  <button onClick={() => setAdding(false)} className="px-3 py-2 text-sm text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100">
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAdding(true)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 font-medium mt-2 transition-colors"
                >
                  <Plus size={15} />
                  Adicionar ação
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AcaoItem({ acao, cor, onToggle }: { acao: PilarAcao; cor: string; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors',
        acao.concluida ? 'bg-emerald-50' : 'bg-gray-50 hover:bg-gray-100'
      )}
    >
      <div className={cn(
        'w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-colors',
        acao.concluida ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300 bg-transparent'
      )}>
        {acao.concluida && <Check size={11} className="text-white" />}
      </div>
      <span className={cn('text-sm', acao.concluida ? 'line-through text-gray-400' : 'text-gray-700')}>
        {acao.texto}
      </span>
    </button>
  )
}
