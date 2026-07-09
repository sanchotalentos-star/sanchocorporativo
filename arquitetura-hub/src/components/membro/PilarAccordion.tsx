import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Plus, Trash2, Pencil, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { getPercent } from '@/lib/utils'
import type { Pilar, PilarAcao } from '@/types'

interface PilarAccordionProps {
  pilar: Pilar
  onToggleAcao: (pilarId: string, acaoId: string, concluida: boolean) => void
  onAddAcao: (pilarId: string, texto: string) => void
  onDeleteAcao: (pilarId: string, acaoId: string) => void
  onEditAcao: (pilarId: string, acaoId: string, texto: string) => void
  onEditPilar: (pilarId: string, patch: Partial<Pick<Pilar, 'nome' | 'descricao'>>) => void
  onDeletePilar: (pilarId: string) => void
}

export function PilarAccordion({
  pilar, onToggleAcao, onAddAcao, onDeleteAcao, onEditAcao, onEditPilar, onDeletePilar
}: PilarAccordionProps) {
  const [open, setOpen]       = useState(true)
  const [adding, setAdding]   = useState(false)
  const [newText, setNewText] = useState('')
  const [editNome, setEditNome]   = useState(false)
  const [nomeVal, setNomeVal]     = useState(pilar.nome)
  const nomeRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (editNome) nomeRef.current?.focus() }, [editNome])

  const done = pilar.acoes.filter(a => a.concluida).length
  const pct  = getPercent(done, pilar.acoes.length)

  function handleAdd() {
    if (!newText.trim()) return
    onAddAcao(pilar.id, newText.trim())
    setNewText('')
    setAdding(false)
  }

  function commitNome() {
    const v = nomeVal.trim()
    if (v && v !== pilar.nome) onEditPilar(pilar.id, { nome: v })
    else setNomeVal(pilar.nome)
    setEditNome(false)
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors">
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: pilar.cor }} />

        {/* Nome editável */}
        <div className="flex-1 min-w-0" onClick={() => !editNome && setOpen(o => !o)}>
          {editNome ? (
            <input
              ref={nomeRef}
              value={nomeVal}
              onChange={e => setNomeVal(e.target.value)}
              onBlur={commitNome}
              onKeyDown={e => { if (e.key === 'Enter') commitNome(); if (e.key === 'Escape') { setNomeVal(pilar.nome); setEditNome(false) } }}
              onClick={e => e.stopPropagation()}
              className="w-full text-sm font-semibold text-gray-900 bg-transparent border-b border-[#7B2FBE] focus:outline-none"
            />
          ) : (
            <p className="text-sm font-semibold text-gray-900 leading-tight truncate cursor-pointer">{pilar.nome}</p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">{done}/{pilar.acoes.length} ações concluídas</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-16 hidden sm:flex items-center">
            <div className="flex-1 h-1.5 rounded-full bg-gray-100">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pilar.cor }} />
            </div>
          </div>
          <span className="text-sm font-semibold" style={{ color: pilar.cor }}>{pct}%</span>
        </div>

        {/* Ações do cabeçalho */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={e => { e.stopPropagation(); setEditNome(true); setOpen(true) }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-[#7B2FBE] hover:bg-[#7B2FBE]/5 transition-colors"
            title="Editar nome"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); if (confirm(`Excluir o pilar "${pilar.nome}"?`)) onDeletePilar(pilar.id) }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
            title="Excluir pilar"
          >
            <Trash2 size={12} />
          </button>
          <button onClick={() => setOpen(o => !o)} className="w-7 h-7 flex items-center justify-center">
            <ChevronDown size={15} className={cn('text-gray-300 transition-transform', open && 'rotate-180')} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-2">
              {pilar.descricao && (
                <DescricaoEdit
                  value={pilar.descricao}
                  onSave={v => onEditPilar(pilar.id, { descricao: v })}
                />
              )}
              {pilar.acoes.map(acao => (
                <AcaoItem
                  key={acao.id}
                  acao={acao}
                  cor={pilar.cor}
                  onToggle={() => onToggleAcao(pilar.id, acao.id, !acao.concluida)}
                  onEdit={txt => onEditAcao(pilar.id, acao.id, txt)}
                  onDelete={() => onDeleteAcao(pilar.id, acao.id)}
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
                    className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE]"
                  />
                  <button onClick={handleAdd} className="px-3 py-2 bg-[#7B2FBE] text-white rounded-lg text-sm font-medium hover:bg-[#6a27a5]">
                    Salvar
                  </button>
                  <button onClick={() => setAdding(false)} className="px-3 py-2 text-sm text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAdding(true)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#7B2FBE] font-medium mt-2 transition-colors"
                >
                  <Plus size={14} />
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

function DescricaoEdit({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)
  function commit() { if (val.trim()) onSave(val.trim()); setEditing(false) }
  return editing ? (
    <input
      autoFocus value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
      className="w-full text-xs text-gray-500 bg-transparent border-b border-gray-200 focus:outline-none focus:border-[#7B2FBE] mb-1"
    />
  ) : (
    <p className="text-xs text-gray-400 mb-1 cursor-pointer hover:text-gray-600 transition-colors" onClick={() => setEditing(true)}>
      {value}
    </p>
  )
}

function AcaoItem({
  acao, cor, onToggle, onEdit, onDelete
}: {
  acao: PilarAcao; cor: string
  onToggle: () => void
  onEdit: (txt: string) => void
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(acao.texto)

  function commit() {
    const v = val.trim()
    if (v) onEdit(v)
    else setVal(acao.texto)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#7B2FBE]/20 bg-[#7B2FBE]/[0.02]">
        <input
          autoFocus value={val}
          onChange={e => setVal(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setVal(acao.texto); setEditing(false) } }}
          className="flex-1 text-sm text-gray-800 bg-transparent focus:outline-none"
        />
        <button onClick={commit} className="text-[#7B2FBE] hover:text-[#6a27a5]"><Check size={14} /></button>
        <button onClick={() => { setVal(acao.texto); setEditing(false) }} className="text-gray-300 hover:text-gray-500"><X size={14} /></button>
      </div>
    )
  }

  return (
    <div className={cn(
      'group w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors',
      acao.concluida ? 'bg-emerald-50' : 'bg-gray-50 hover:bg-gray-100'
    )}>
      <button onClick={onToggle} className="flex-shrink-0 mt-0.5">
        <div className={cn(
          'w-5 h-5 rounded-lg flex items-center justify-center border-2 transition-colors',
          acao.concluida ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300 bg-transparent'
        )}>
          {acao.concluida && <Check size={11} className="text-white" />}
        </div>
      </button>
      <span
        className={cn('flex-1 text-sm cursor-pointer', acao.concluida ? 'line-through text-gray-400' : 'text-gray-700')}
        onClick={() => !acao.concluida && setEditing(true)}
      >
        {acao.texto}
      </span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {!acao.concluida && (
          <button onClick={() => setEditing(true)} className="p-1 rounded text-gray-300 hover:text-[#7B2FBE] transition-colors">
            <Pencil size={11} />
          </button>
        )}
        <button onClick={onDelete} className="p-1 rounded text-gray-300 hover:text-red-400 transition-colors">
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  )
}
