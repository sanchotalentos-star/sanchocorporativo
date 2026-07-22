import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { CheckSquare2, Square, Plus, X, Trash2, ChevronDown, ChevronUp, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/membro/tarefas')({
  component: TarefasPage,
})

interface KeyResult {
  id: string
  descricao: string
  meta: number
  atual: number
  unit: string
}

interface Objective {
  id: string
  titulo: string
  categoria: string
  trimestre: string
  keyResults: KeyResult[]
}

interface Tarefa {
  id: string
  descricao: string
  krId: string
  okrId: string
  done: boolean
  auto: boolean
}

const OKR_KEY = 'okr_store_v1'
const TAREFAS_KEY = 'tarefas_store_v1'

const catColor: Record<string, string> = {
  'Autoridade': '#7B2FBE',
  'Receita':    '#10B981',
  'Alcance':    '#3B82F6',
  'Produto':    '#F59E0B',
}

function gerarTarefas(kr: KeyResult, okrId: string): Tarefa[] {
  const desc = kr.descricao.toLowerCase()
  let sugestoes: string[]

  if (desc.includes('publicar') || desc.includes('conteúdo') || desc.includes('peças')) {
    sugestoes = [
      'Definir o tema e formato do próximo conteúdo',
      'Produzir o conteúdo (texto, vídeo ou áudio)',
      'Publicar e registrar o resultado',
    ]
  } else if (desc.includes('conversa') || desc.includes('cliente') || desc.includes('venda')) {
    sugestoes = [
      'Mapear contatos qualificados para abordar esta semana',
      'Agendar reunião ou conversa de descoberta',
      'Fazer follow-up com os leads em andamento',
    ]
  } else if (desc.includes('evento') || desc.includes('palest') || desc.includes('podcast')) {
    sugestoes = [
      'Levantar lista de eventos ou podcasts relevantes do setor',
      'Entrar em contato com organizadores e enviar proposta',
    ]
  } else if (desc.includes('menção') || desc.includes('depoimento') || desc.includes('indicação') || desc.includes('compartilh')) {
    sugestoes = [
      'Solicitar depoimento para os últimos 3 clientes atendidos',
      'Publicar o depoimento com a autorização do cliente',
    ]
  } else if (desc.includes('fechar') || desc.includes('projeto') || desc.includes('contrato')) {
    sugestoes = [
      'Preparar proposta comercial personalizada',
      'Enviar proposta e agendar apresentação',
      'Fazer follow-up após 3 dias sem retorno',
    ]
  } else {
    sugestoes = [
      `Definir os próximos passos para: ${kr.descricao.slice(0, 60)}${kr.descricao.length > 60 ? '...' : ''}`,
      'Revisar o progresso com o mentor na próxima sessão',
    ]
  }

  return sugestoes.map((d, i) => ({
    id: `auto-${kr.id}-${i}`,
    descricao: d,
    krId: kr.id,
    okrId,
    done: false,
    auto: true,
  }))
}

function TarefasPage() {
  const [okrs, setOkrs] = useState<Objective[]>([])
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [addingTo, setAddingTo] = useState<string | null>(null)
  const [novaDesc, setNovaDesc] = useState('')

  useEffect(() => {
    try {
      const stored = localStorage.getItem(OKR_KEY)
      if (stored) setOkrs(JSON.parse(stored) ?? [])
    } catch {}
  }, [])

  useEffect(() => {
    if (okrs.length === 0) return

    let stored: Tarefa[] = []
    try { stored = JSON.parse(localStorage.getItem(TAREFAS_KEY) ?? '[]') ?? [] } catch {}

    const existingKrIds = new Set(stored.map(t => t.krId))
    const geradas: Tarefa[] = []

    for (const okr of okrs) {
      for (const kr of okr.keyResults) {
        if (!existingKrIds.has(kr.id)) {
          geradas.push(...gerarTarefas(kr, okr.id))
        }
      }
    }

    setTarefas([...stored, ...geradas])

    const exp: Record<string, boolean> = {}
    for (const okr of okrs) exp[okr.id] = true
    setExpanded(exp)
  }, [okrs])

  useEffect(() => {
    if (tarefas.length > 0 || localStorage.getItem(TAREFAS_KEY)) {
      localStorage.setItem(TAREFAS_KEY, JSON.stringify(tarefas))
    }
  }, [tarefas])

  function toggleDone(id: string) {
    setTarefas(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function deleteTarefa(id: string) {
    setTarefas(prev => prev.filter(t => t.id !== id))
  }

  function addTarefa(krId: string, okrId: string) {
    const desc = novaDesc.trim()
    if (!desc) return
    setTarefas(prev => [...prev, {
      id: `manual-${Date.now()}`,
      descricao: desc,
      krId,
      okrId,
      done: false,
      auto: false,
    }])
    setNovaDesc('')
    setAddingTo(null)
  }

  const totalTarefas = tarefas.length
  const doneCount = tarefas.filter(t => t.done).length
  const pctGeral = totalTarefas > 0 ? Math.round((doneCount / totalTarefas) * 100) : 0

  if (okrs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-3">
        <ClipboardList size={32} className="text-gray-200" />
        <div>
          <p className="text-sm font-medium text-gray-500">Nenhum objetivo definido ainda.</p>
          <p className="text-xs text-gray-400 mt-1">
            Crie seus OKRs em <strong className="text-gray-500">Metas de Impacto</strong> para gerar tarefas automaticamente.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Tarefas</h1>
        <p className="text-sm text-gray-400 mt-0.5">Ações concretas para avançar nos seus objetivos.</p>
      </div>

      {/* Resumo */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-6">
        <div className="flex-shrink-0">
          <p className="text-2xl font-bold text-gray-900 tabular-nums">
            {doneCount}
            <span className="text-gray-300 font-normal text-lg">/{totalTarefas}</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest">Concluídas</p>
        </div>
        <div className="flex-1">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#7B2FBE] rounded-full transition-all duration-500"
              style={{ width: `${pctGeral}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">{pctGeral}% do plano concluído</p>
        </div>
      </div>

      {/* OKRs */}
      {okrs.map(okr => {
        const okrTarefas = tarefas.filter(t => t.okrId === okr.id)
        const okrDone = okrTarefas.filter(t => t.done).length
        const cor = catColor[okr.categoria] ?? '#7B2FBE'
        const isExpanded = expanded[okr.id] ?? true

        if (okr.keyResults.length === 0) return null

        return (
          <div key={okr.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <button
              onClick={() => setExpanded(p => ({ ...p, [okr.id]: !isExpanded }))}
              className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50/50 transition-colors"
            >
              <div className="w-1 h-7 rounded-full flex-shrink-0" style={{ background: cor }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-snug">{okr.titulo}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {okr.categoria} · {okr.trimestre}
                  {okrTarefas.length > 0 && (
                    <span className="ml-2 font-medium" style={{ color: cor }}>{okrDone}/{okrTarefas.length} tarefas</span>
                  )}
                </p>
              </div>
              {isExpanded
                ? <ChevronUp size={14} className="text-gray-300 flex-shrink-0" />
                : <ChevronDown size={14} className="text-gray-300 flex-shrink-0" />
              }
            </button>

            {isExpanded && (
              <div className="border-t border-gray-100">
                {okr.keyResults.map((kr, krIdx) => {
                  const krTarefas = tarefas.filter(t => t.krId === kr.id)
                  const krDone = krTarefas.filter(t => t.done).length
                  const pct = kr.meta > 0 ? Math.min(100, Math.round((kr.atual / kr.meta) * 100)) : 0

                  return (
                    <div key={kr.id} className={cn(krIdx > 0 ? 'border-t border-gray-50' : '')}>
                      <div className="px-5 py-3 bg-gray-50/60">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-gray-500 leading-snug">{kr.descricao}</p>
                            {kr.meta > 0 && (
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: cor }} />
                                </div>
                                <span className="text-[10px] text-gray-400 tabular-nums">{kr.atual}/{kr.meta} {kr.unit}</span>
                              </div>
                            )}
                          </div>
                          {krTarefas.length > 0 && (
                            <span className="text-[10px] text-gray-400 flex-shrink-0 tabular-nums">{krDone}/{krTarefas.length}</span>
                          )}
                        </div>
                      </div>

                      <div>
                        {krTarefas.map(tarefa => (
                          <div
                            key={tarefa.id}
                            className="group flex items-start gap-3 px-5 py-3 border-t border-gray-50 hover:bg-gray-50/30 transition-colors"
                          >
                            <button onClick={() => toggleDone(tarefa.id)} className="mt-0.5 flex-shrink-0 transition-transform active:scale-90">
                              {tarefa.done
                                ? <CheckSquare2 size={15} className="text-[#7B2FBE]" />
                                : <Square size={15} className="text-gray-300 group-hover:text-gray-400" />
                              }
                            </button>
                            <p className={cn(
                              'flex-1 text-sm leading-relaxed transition-colors',
                              tarefa.done ? 'text-gray-300 line-through' : 'text-gray-700'
                            )}>
                              {tarefa.descricao}
                            </p>
                            <button
                              onClick={() => deleteTarefa(tarefa.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-400 transition-all flex-shrink-0"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        ))}

                        {addingTo === kr.id ? (
                          <div className="flex items-center gap-3 px-5 py-3 border-t border-gray-50 bg-gray-50/20">
                            <Square size={15} className="text-gray-200 flex-shrink-0" />
                            <input
                              autoFocus
                              value={novaDesc}
                              onChange={e => setNovaDesc(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') addTarefa(kr.id, okr.id)
                                if (e.key === 'Escape') { setAddingTo(null); setNovaDesc('') }
                              }}
                              placeholder="Descreva a tarefa..."
                              className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none placeholder:text-gray-300"
                            />
                            <button
                              onClick={() => addTarefa(kr.id, okr.id)}
                              className="text-xs font-semibold text-[#7B2FBE] hover:text-[#6a1fa8] transition-colors"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={() => { setAddingTo(null); setNovaDesc('') }}
                              className="text-gray-300 hover:text-gray-500 transition-colors"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setAddingTo(kr.id); setNovaDesc('') }}
                            className="flex items-center gap-2 px-5 py-2.5 border-t border-gray-50 w-full text-left text-xs text-gray-400 hover:text-[#7B2FBE] hover:bg-gray-50/30 transition-all"
                          >
                            <Plus size={12} />
                            Adicionar tarefa
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
