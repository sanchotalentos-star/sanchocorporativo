import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Plus, X, Trash2, ChevronDown, ChevronUp, ClipboardList } from 'lucide-react'
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

type TarefaStatus = 'pendente' | 'em_andamento' | 'feita' | 'bloqueada'
type Prioridade   = 'alta' | 'media' | 'baixa'

interface Tarefa {
  id: string
  descricao: string
  krId: string
  okrId: string
  status: TarefaStatus
  prioridade: Prioridade
  auto: boolean
}

const OKR_KEY    = 'okr_store_v1'
const TAREFAS_KEY = 'tarefas_store_v1'

const catColor: Record<string, string> = {
  'Autoridade': '#7B2FBE',
  'Receita':    '#10B981',
  'Alcance':    '#3B82F6',
  'Produto':    '#F59E0B',
}

const statusCycle: TarefaStatus[] = ['pendente', 'em_andamento', 'feita', 'bloqueada']

const statusConfig: Record<TarefaStatus, { label: string; bg: string; text: string; dot: string }> = {
  pendente:     { label: 'Pendente',     bg: '#F3F4F6', text: '#6B7280', dot: '#D1D5DB' },
  em_andamento: { label: 'Em andamento', bg: '#EFF6FF', text: '#2563EB', dot: '#3B82F6' },
  feita:        { label: 'Feita',        bg: '#F0FDF4', text: '#16A34A', dot: '#22C55E' },
  bloqueada:    { label: 'Bloqueada',    bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444' },
}

const prioridadeConfig: Record<Prioridade, { label: string; bg: string; text: string }> = {
  alta:  { label: 'Alta',  bg: '#FEF2F2', text: '#DC2626' },
  media: { label: 'Média', bg: '#FFFBEB', text: '#D97706' },
  baixa: { label: 'Baixa', bg: '#F0FDF4', text: '#16A34A' },
}

const prioridadeCycle: Prioridade[] = ['alta', 'media', 'baixa']

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
    status: 'pendente',
    prioridade: 'media',
    auto: true,
  }))
}

function StatusChip({ status, onClick }: { status: TarefaStatus; onClick: () => void }) {
  const cfg = statusConfig[status]
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-opacity hover:opacity-80 flex-shrink-0"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </button>
  )
}

function PrioridadeChip({ prioridade, onClick }: { prioridade: Prioridade; onClick: () => void }) {
  const cfg = prioridadeConfig[prioridade]
  return (
    <button
      onClick={onClick}
      className="px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-opacity hover:opacity-80 flex-shrink-0"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      {cfg.label}
    </button>
  )
}

function TarefasPage() {
  const [okrs, setOkrs]       = useState<Objective[]>([])
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
    try {
      const raw = JSON.parse(localStorage.getItem(TAREFAS_KEY) ?? '[]') ?? []
      // Migrate old format (done boolean) to new (status field)
      stored = raw.map((t: Tarefa & { done?: boolean }) => ({
        ...t,
        status: t.status ?? (t.done ? 'feita' : 'pendente'),
        prioridade: t.prioridade ?? 'media',
      }))
    } catch {}

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

  function cycleStatus(id: string) {
    setTarefas(prev => prev.map(t => {
      if (t.id !== id) return t
      const idx = statusCycle.indexOf(t.status)
      return { ...t, status: statusCycle[(idx + 1) % statusCycle.length] }
    }))
  }

  function cyclePrioridade(id: string) {
    setTarefas(prev => prev.map(t => {
      if (t.id !== id) return t
      const idx = prioridadeCycle.indexOf(t.prioridade)
      return { ...t, prioridade: prioridadeCycle[(idx + 1) % prioridadeCycle.length] }
    }))
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
      status: 'pendente',
      prioridade: 'media',
      auto: false,
    }])
    setNovaDesc('')
    setAddingTo(null)
  }

  const totalTarefas = tarefas.length
  const feitasCount  = tarefas.filter(t => t.status === 'feita').length
  const emAndamento  = tarefas.filter(t => t.status === 'em_andamento').length
  const bloqueadas   = tarefas.filter(t => t.status === 'bloqueada').length
  const pctGeral = totalTarefas > 0 ? Math.round((feitasCount / totalTarefas) * 100) : 0

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight">Tarefas</h1>
        <p className="text-sm text-gray-400 mt-0.5">Ações concretas para avançar nos seus objetivos.</p>
      </div>

      {/* Resumo estilo Monday */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="flex items-center gap-6 mb-4">
          <div>
            <p className="text-2xl font-semibold text-gray-900 tabular-nums leading-none">
              {feitasCount}<span className="text-gray-300 font-normal text-base">/{totalTarefas}</span>
            </p>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Concluídas</p>
          </div>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${pctGeral}%` }}
            />
          </div>
          <p className="text-sm font-semibold text-gray-900 tabular-nums flex-shrink-0">{pctGeral}%</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {emAndamento > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-blue-600">
              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
              {emAndamento} em andamento
            </div>
          )}
          {bloqueadas > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-red-500">
              <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
              {bloqueadas} bloqueadas
            </div>
          )}
          {feitasCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              {feitasCount} feitas
            </div>
          )}
        </div>
      </div>

      {/* OKRs */}
      {okrs.map(okr => {
        const okrTarefas = tarefas.filter(t => t.okrId === okr.id)
        const okrFeitas  = okrTarefas.filter(t => t.status === 'feita').length
        const cor        = catColor[okr.categoria] ?? '#7B2FBE'
        const isExpanded = expanded[okr.id] ?? true

        if (okr.keyResults.length === 0) return null

        return (
          <div key={okr.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden">

            {/* Header do OKR */}
            <button
              onClick={() => setExpanded(p => ({ ...p, [okr.id]: !isExpanded }))}
              className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50/50 transition-colors"
            >
              <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: cor }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-snug">{okr.titulo}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {okr.categoria} · {okr.trimestre}
                  {okrTarefas.length > 0 && (
                    <span className="ml-2 font-medium" style={{ color: cor }}>
                      {okrFeitas}/{okrTarefas.length} tarefas
                    </span>
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

                {/* Cabeçalho de colunas estilo Monday */}
                <div className="grid items-center px-5 py-2 bg-gray-50 border-b border-gray-100"
                  style={{ gridTemplateColumns: '1fr 120px 80px 28px' }}
                >
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Tarefa</p>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</p>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Prioridade</p>
                  <span />
                </div>

                {okr.keyResults.map((kr, krIdx) => {
                  const krTarefas = tarefas.filter(t => t.krId === kr.id)
                  const krFeitas  = krTarefas.filter(t => t.status === 'feita').length
                  const pct = kr.meta > 0 ? Math.min(100, Math.round((kr.atual / kr.meta) * 100)) : 0

                  return (
                    <div key={kr.id} className={cn(krIdx > 0 ? 'border-t border-gray-50' : '')}>

                      {/* Sub-header do KR */}
                      <div className="px-5 py-2.5 bg-gray-50/40 border-b border-gray-50 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cor, opacity: 0.5 }} />
                          <p className="text-[11px] font-medium text-gray-500 truncate">{kr.descricao}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {kr.meta > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: cor }} />
                              </div>
                              <span className="text-[10px] text-gray-400 tabular-nums">{kr.atual}/{kr.meta} {kr.unit}</span>
                            </div>
                          )}
                          {krTarefas.length > 0 && (
                            <span className="text-[10px] text-gray-400 tabular-nums">{krFeitas}/{krTarefas.length}</span>
                          )}
                        </div>
                      </div>

                      {/* Linhas de tarefas */}
                      {krTarefas.map(tarefa => (
                        <div
                          key={tarefa.id}
                          className={cn(
                            'group grid items-center px-5 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors',
                            tarefa.status === 'feita' && 'opacity-60'
                          )}
                          style={{ gridTemplateColumns: '1fr 120px 80px 28px' }}
                        >
                          <p className={cn(
                            'text-sm leading-snug pr-4 transition-colors',
                            tarefa.status === 'feita' ? 'text-gray-400 line-through' : 'text-gray-700'
                          )}>
                            {tarefa.descricao}
                          </p>
                          <div>
                            <StatusChip status={tarefa.status} onClick={() => cycleStatus(tarefa.id)} />
                          </div>
                          <div>
                            <PrioridadeChip prioridade={tarefa.prioridade} onClick={() => cyclePrioridade(tarefa.id)} />
                          </div>
                          <button
                            onClick={() => deleteTarefa(tarefa.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-400 transition-all"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}

                      {/* Adicionar tarefa */}
                      {addingTo === kr.id ? (
                        <div
                          className="grid items-center px-5 py-2.5 border-t border-gray-50 bg-blue-50/30"
                          style={{ gridTemplateColumns: '1fr 120px 80px 28px' }}
                        >
                          <input
                            autoFocus
                            value={novaDesc}
                            onChange={e => setNovaDesc(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') addTarefa(kr.id, okr.id)
                              if (e.key === 'Escape') { setAddingTo(null); setNovaDesc('') }
                            }}
                            placeholder="Descreva a tarefa e pressione Enter..."
                            className="text-sm text-gray-700 bg-transparent focus:outline-none placeholder:text-gray-300 pr-4"
                          />
                          <div className="flex items-center gap-1.5">
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
                              <X size={12} />
                            </button>
                          </div>
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
