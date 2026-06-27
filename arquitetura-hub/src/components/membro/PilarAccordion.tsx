import { useState } from 'react'
import { ChevronDown, Check, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { getPercent } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
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
    <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
      <button
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-[#F1F5F9] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: pilar.cor }} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#0F172A]">{pilar.nome}</p>
          <p className="text-xs text-[#94A3B8] mt-0.5">{done}/{pilar.acoes.length} ações concluídas</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 hidden sm:block">
            <Progress value={pct} indicatorClassName="" style={{ '--tw-bg': pilar.cor } as React.CSSProperties} />
          </div>
          <span className="text-sm font-medium text-[#475569]">{pct}%</span>
          <ChevronDown size={16} className={cn('text-[#94A3B8] transition-transform', open && 'rotate-180')} />
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
            <div className="px-4 pb-4 space-y-2">
              <p className="text-sm text-[#475569] mb-3">{pilar.descricao}</p>
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
                    className="flex-1 text-sm border border-[#E2E8F0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]"
                  />
                  <button onClick={handleAdd} className="px-3 py-2 bg-[#1B3A5C] text-white rounded-lg text-sm font-medium hover:bg-[#152E4A]">
                    Adicionar
                  </button>
                  <button onClick={() => setAdding(false)} className="px-3 py-2 text-sm text-[#475569] hover:bg-[#F1F5F9] rounded-lg">
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAdding(true)}
                  className="flex items-center gap-2 text-sm text-[#1B3A5C] hover:text-[#152E4A] font-medium mt-2"
                >
                  <Plus size={16} />
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
        'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors',
        acao.concluida ? 'bg-green-50' : 'bg-[#F1F5F9] hover:bg-[#E2E8F0]'
      )}
    >
      <div className={cn(
        'w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-colors',
        acao.concluida ? 'border-green-500 bg-green-500' : 'border-[#94A3B8] bg-white'
      )}>
        {acao.concluida && <Check size={12} className="text-white" />}
      </div>
      <span className={cn('text-sm', acao.concluida ? 'line-through text-[#94A3B8]' : 'text-[#0F172A]')}>
        {acao.texto}
      </span>
    </button>
  )
}
