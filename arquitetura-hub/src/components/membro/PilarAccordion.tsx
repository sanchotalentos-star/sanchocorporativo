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
    <div className="rounded-2xl border border-[#1A2E4A] bg-[#0D1B2E] overflow-hidden">
      <button
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-[#112240] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: pilar.cor }} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white">{pilar.nome}</p>
          <p className="text-xs text-[#4A7FA5] mt-0.5">{done}/{pilar.acoes.length} ações concluídas</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-20 hidden sm:flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-[#112240]">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: pilar.cor }}
              />
            </div>
          </div>
          <span className="text-sm font-bold" style={{ color: pilar.cor }}>{pct}%</span>
          <ChevronDown size={15} className={cn('text-[#4A7FA5] transition-transform', open && 'rotate-180')} />
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
            <div className="px-4 pb-4 space-y-2 border-t border-[#1A2E4A] pt-3">
              {pilar.descricao && (
                <p className="text-sm text-[#4A7FA5] mb-3">{pilar.descricao}</p>
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
                    className="flex-1 text-sm border border-[#1A2E4A] rounded-xl px-3 py-2 bg-[#0A1420] text-white placeholder:text-[#3A5A7A] focus:outline-none focus:border-[#F59E0B]"
                  />
                  <button onClick={handleAdd} className="px-3 py-2 bg-[#F59E0B] text-black rounded-xl text-sm font-bold hover:bg-[#D97706]">
                    Adicionar
                  </button>
                  <button onClick={() => setAdding(false)} className="px-3 py-2 text-sm text-[#4A7FA5] hover:text-white rounded-xl hover:bg-[#112240]">
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAdding(true)}
                  className="flex items-center gap-2 text-sm text-[#4A7FA5] hover:text-white font-medium mt-2 transition-colors"
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
        acao.concluida ? 'bg-emerald-500/10' : 'bg-[#0A1420] hover:bg-[#112240]'
      )}
    >
      <div className={cn(
        'w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-colors',
        acao.concluida ? 'border-emerald-500 bg-emerald-500' : 'border-[#2A4A6E] bg-transparent'
      )}>
        {acao.concluida && <Check size={11} className="text-white" />}
      </div>
      <span className={cn('text-sm', acao.concluida ? 'line-through text-[#3A5A7A]' : 'text-[#A0C0D8]')}>
        {acao.texto}
      </span>
    </button>
  )
}
