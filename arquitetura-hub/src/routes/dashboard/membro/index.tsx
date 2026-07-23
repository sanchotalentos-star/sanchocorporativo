import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Plus, X, Trash2, ChevronDown, ChevronUp, ClipboardList } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/membro/')({
  component: HomePage,
})

/* ─────────────────────────────────────────────
   TIPOS
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   CONSTANTES
───────────────────────────────────────────── */
const OKR_KEY     = 'okr_store_v1'
const TAREFAS_KEY = 'tarefas_store_v1'

const catColor: Record<string, string> = {
  Autoridade: '#7B2FBE',
  Receita:    '#10B981',
  Alcance:    '#3B82F6',
  Produto:    '#F59E0B',
}

const catBg: Record<string, string> = {
  Autoridade: 'rgba(123,47,190,0.09)',
  Receita:    'rgba(16,185,129,0.09)',
  Alcance:    'rgba(59,130,246,0.09)',
  Produto:    'rgba(245,158,11,0.09)',
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

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function pct(atual: number, meta: number) {
  if (!meta) return 0
  return Math.min(100, Math.round((atual / meta) * 100))
}

function objPct(obj: Objective) {
  if (!obj.keyResults.length) return 0
  return Math.round(obj.keyResults.reduce((s, kr) => s + pct(kr.atual, kr.meta), 0) / obj.keyResults.length)
}

interface TarefaSugestao { descricao: string; prioridade: Prioridade }

function gerarTarefas(kr: KeyResult, okrId: string): Tarefa[] {
  const desc = kr.descricao.toLowerCase()
  let sugestoes: TarefaSugestao[]

  if (desc.includes('publicar') || desc.includes('conteúdo') || desc.includes('posicionamento') || desc.includes('peças') || desc.includes('editorial')) {
    sugestoes = [
      { descricao: 'Definir os 4 temas de conteúdo do mês e o formato de cada um (post, vídeo, artigo)', prioridade: 'alta' },
      { descricao: 'Produzir e publicar o conteúdo desta semana conforme o calendário', prioridade: 'alta' },
      { descricao: 'Registrar o engajamento e anotar o que performou melhor para repetir', prioridade: 'media' },
    ]
  } else if (desc.includes('aparição') || desc.includes('evento') || desc.includes('palest') || desc.includes('podcast') || desc.includes('convidado') || desc.includes('entrevista')) {
    sugestoes = [
      { descricao: 'Pesquisar e listar 10 eventos, podcasts ou programas do seu setor com contato do responsável', prioridade: 'alta' },
      { descricao: 'Escrever um pitch de apresentação de 5 linhas destacando sua expertise e o tema que pode trazer', prioridade: 'alta' },
      { descricao: 'Entrar em contato com 3 organizadores da lista esta semana com o pitch personalizado', prioridade: 'alta' },
      { descricao: 'Fazer follow-up com quem não respondeu após 5 dias úteis', prioridade: 'media' },
    ]
  } else if (desc.includes('conversa') || desc.includes('descoberta') || desc.includes('reunião')) {
    sugestoes = [
      { descricao: 'Listar 10 contatos qualificados que poderiam se beneficiar do seu trabalho', prioridade: 'alta' },
      { descricao: 'Enviar mensagem de conexão personalizada para 5 contatos da lista esta semana', prioridade: 'alta' },
      { descricao: 'Agendar 2 conversas de descoberta para os próximos 7 dias', prioridade: 'alta' },
      { descricao: 'Fazer follow-up com quem demonstrou interesse mas não confirmou', prioridade: 'media' },
    ]
  } else if (desc.includes('proposta') || desc.includes('comercial')) {
    sugestoes = [
      { descricao: 'Identificar os 3 leads mais qualificados e prontos para receber uma proposta', prioridade: 'alta' },
      { descricao: 'Escrever uma proposta comercial personalizada para o lead principal', prioridade: 'alta' },
      { descricao: 'Enviar a proposta e agendar uma conversa de apresentação em até 48h', prioridade: 'alta' },
      { descricao: 'Fazer follow-up com quem recebeu proposta e ainda não respondeu após 3 dias', prioridade: 'media' },
    ]
  } else if (desc.includes('fechar') || desc.includes('cliente') || desc.includes('contrato')) {
    sugestoes = [
      { descricao: 'Revisar todos os leads em negociação e definir o próximo passo de cada um', prioridade: 'alta' },
      { descricao: 'Preparar e enviar proposta para o lead mais avançado no processo', prioridade: 'alta' },
      { descricao: 'Fazer follow-up com quem recebeu proposta há mais de 3 dias sem retorno', prioridade: 'media' },
    ]
  } else if (desc.includes('depoimento') || desc.includes('indicação') || desc.includes('menção') || desc.includes('referência')) {
    sugestoes = [
      { descricao: 'Selecionar os 5 clientes mais satisfeitos e pedir um depoimento curto por escrito ou vídeo', prioridade: 'alta' },
      { descricao: 'Publicar o depoimento recebido com a autorização do cliente', prioridade: 'alta' },
      { descricao: 'Pedir indicações ativas para os 3 melhores clientes atendidos no trimestre', prioridade: 'media' },
    ]
  } else if (desc.includes('sessão') || desc.includes('demo') || desc.includes('produto')) {
    sugestoes = [
      { descricao: 'Criar um roteiro de 30 minutos para a sessão de descoberta ou demo do produto', prioridade: 'alta' },
      { descricao: 'Agendar 3 sessões de descoberta ou demos esta semana com leads ou clientes', prioridade: 'alta' },
      { descricao: 'Enviar um formulário de feedback estruturado após cada sessão realizada', prioridade: 'media' },
    ]
  } else if (desc.includes('feedback') || desc.includes('melhoria') || desc.includes('iteração') || desc.includes('coletar')) {
    sugestoes = [
      { descricao: 'Criar um formulário de feedback com 5 perguntas objetivas sobre o produto ou serviço', prioridade: 'alta' },
      { descricao: 'Enviar o formulário para os últimos 10 clientes atendidos', prioridade: 'alta' },
      { descricao: 'Analisar os feedbacks recebidos e listar as 3 principais melhorias a implementar', prioridade: 'alta' },
      { descricao: 'Implementar a melhoria de maior impacto identificada no feedback', prioridade: 'media' },
    ]
  } else if (desc.includes('contato') || desc.includes('conexão') || desc.includes('alcance')) {
    sugestoes = [
      { descricao: 'Interagir com comentários e publicações de 10 perfis do público-alvo esta semana', prioridade: 'alta' },
      { descricao: 'Publicar um conteúdo focado em atrair conexões qualificadas', prioridade: 'alta' },
      { descricao: 'Enviar convite de conexão personalizado para 5 potenciais parceiros ou clientes', prioridade: 'media' },
    ]
  } else {
    sugestoes = [
      { descricao: `Definir os próximos passos concretos e mensuráveis para: ${kr.descricao}`, prioridade: 'alta' },
      { descricao: 'Estabelecer uma rotina semanal de 30 minutos para avançar neste resultado', prioridade: 'media' },
      { descricao: 'Revisar o progresso deste KR com o mentor na próxima sessão', prioridade: 'baixa' },
    ]
  }

  return sugestoes.map((s, i) => ({
    id:         `auto-${kr.id}-${i}`,
    descricao:  s.descricao,
    krId:       kr.id,
    okrId,
    status:     'pendente' as TarefaStatus,
    prioridade: s.prioridade,
    auto:       true,
  }))
}

/* ─────────────────────────────────────────────
   CHIPS INTERATIVOS
───────────────────────────────────────────── */
function StatusChip({ status, onClick }: { status: TarefaStatus; onClick: () => void }) {
  const cfg = statusConfig[status]
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap hover:opacity-80 flex-shrink-0"
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
      className="px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap hover:opacity-80 flex-shrink-0"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      {cfg.label}
    </button>
  )
}

/* ─────────────────────────────────────────────
   PÁGINA
───────────────────────────────────────────── */
function HomePage() {
  const { user } = useAuth()
  const firstName = user?.full_name?.split(' ')[0] ?? ''

  const [okrs, setOkrs]         = useState<Objective[]>([])
  const [tarefas, setTarefas]   = useState<Tarefa[]>([])
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
      stored = raw.map((t: Tarefa & { done?: boolean }) => ({
        ...t,
        status:     t.status     ?? (t.done ? 'feita' : 'pendente'),
        prioridade: t.prioridade ?? 'media',
      }))
    } catch {}

    const existingKrIds = new Set(stored.map(t => t.krId))
    const geradas: Tarefa[] = []
    for (const okr of okrs) {
      for (const kr of okr.keyResults) {
        if (!existingKrIds.has(kr.id)) geradas.push(...gerarTarefas(kr, okr.id))
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
      id: `manual-${Date.now()}`, descricao: desc,
      krId, okrId, status: 'pendente', prioridade: 'media', auto: false,
    }])
    setNovaDesc('')
    setAddingTo(null)
  }

  /* métricas */
  const totalTarefas = tarefas.length
  const feitasCount  = tarefas.filter(t => t.status === 'feita').length
  const emAndamento  = tarefas.filter(t => t.status === 'em_andamento').length
  const bloqueadas   = tarefas.filter(t => t.status === 'bloqueada').length
  const pctGeral     = totalTarefas > 0 ? Math.round((feitasCount / totalTarefas) * 100) : 0
  const totalKrs     = okrs.reduce((s, o) => s + o.keyResults.length, 0)
  const progOkrs     = okrs.length
    ? Math.round(okrs.reduce((s, o) => s + objPct(o), 0) / okrs.length)
    : 0

  const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  if (okrs.length === 0) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 48 }}>
        <div style={{ paddingTop: 4, marginBottom: 32 }}>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 2 }}>
            {hoje.charAt(0).toUpperCase() + hoje.slice(1)}
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111827', margin: 0, letterSpacing: '-0.01em' }}>
            Olá, {firstName}
          </h1>
        </div>
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '48px 32px', textAlign: 'center' }}>
          <ClipboardList size={28} style={{ color: '#E5E7EB', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 6 }}>Nenhum objetivo criado ainda.</p>
          <p style={{ fontSize: 12, color: '#9CA3AF' }}>
            Vá até <strong>Metas de Impacto</strong> para criar seus primeiros OKRs e gerar o plano de tarefas.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 48, display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Cabeçalho ── */}
      <div style={{ paddingTop: 4 }}>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 2 }}>
          {hoje.charAt(0).toUpperCase() + hoje.slice(1)}
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111827', margin: 0, letterSpacing: '-0.01em' }}>
          Olá, {firstName}
        </h1>
      </div>

      {/* ════════════════════════════════════════
          BLOCO 1 — METAS DE IMPACTO
      ════════════════════════════════════════ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            Metas de Impacto
          </p>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>
            {okrs.length} {okrs.length === 1 ? 'objetivo' : 'objetivos'} · {totalKrs} KRs
          </span>
        </div>

        {/* Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {([
            { label: 'OKRs ativos',        value: okrs.length,    color: '#111827' },
            { label: 'Resultados-chave',   value: totalKrs,       color: '#111827' },
            { label: 'Progresso geral',    value: `${progOkrs}%`, color: '#7B2FBE' },
            { label: 'Tarefas concluídas', value: feitasCount,    color: '#16A34A' },
          ] as const).map(tile => (
            <div key={tile.label} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '12px 16px' }}>
              <p style={{ fontSize: 10, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                {tile.label}
              </p>
              <p style={{ fontSize: 22, fontWeight: 600, color: tile.color, margin: '5px 0 0', fontVariantNumeric: 'tabular-nums' }}>
                {tile.value}
              </p>
            </div>
          ))}
        </div>

        {/* Linhas compactas por OKR */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 52px', padding: '5px 20px', borderBottom: '1px solid #F3F4F6', background: '#FAFAFA' }}>
            {['Objetivo', 'Progresso', ''].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 500, color: '#B0B7C3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
            ))}
          </div>
          {okrs.map((obj, i) => {
            const op    = objPct(obj)
            const color = catColor[obj.categoria] ?? '#7B2FBE'
            return (
              <div key={obj.id} style={{
                display: 'grid', gridTemplateColumns: '1fr 160px 52px',
                alignItems: 'center', padding: '9px 20px',
                borderBottom: i < okrs.length - 1 ? '1px solid #F9FAFB' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 600, color,
                    background: catBg[obj.categoria], padding: '2px 6px', borderRadius: 3, flexShrink: 0,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {obj.categoria}
                  </span>
                  <span style={{ fontSize: 12, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {obj.titulo}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 4, background: '#F3F4F6', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${op}%`, background: color, borderRadius: 2, transition: 'width 0.4s' }} />
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {op}%
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════
          BLOCO 2 — DASHBOARD DE TAREFAS
      ════════════════════════════════════════ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            Acompanhamento de Tarefas
          </p>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>{pctGeral}% concluídas</span>
        </div>

        {/* Tiles de status */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {([
            { label: 'Total',        value: totalTarefas, color: '#111827' },
            { label: 'Feitas',       value: feitasCount,  color: '#16A34A' },
            { label: 'Em andamento', value: emAndamento,  color: '#2563EB' },
            { label: 'Bloqueadas',   value: bloqueadas,   color: bloqueadas > 0 ? '#DC2626' : '#9CA3AF' },
          ] as const).map(tile => (
            <div key={tile.label} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '12px 16px' }}>
              <p style={{ fontSize: 10, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                {tile.label}
              </p>
              <p style={{ fontSize: 22, fontWeight: 600, color: tile.color, margin: '5px 0 0', fontVariantNumeric: 'tabular-nums' }}>
                {tile.value}
              </p>
            </div>
          ))}
        </div>

        {/* Barras por OKR + Prioridade */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 10 }}>

          {/* Barras empilhadas por OKR */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #F3F4F6', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#111827', margin: 0 }}>Progresso por OKR</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {([
                  { label: 'Feita',        dot: '#22C55E' },
                  { label: 'Em andamento', dot: '#3B82F6' },
                  { label: 'Pendente',     dot: '#D1D5DB' },
                  { label: 'Bloqueada',    dot: '#EF4444' },
                ] as const).map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: '#9CA3AF' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {okrs.map(okr => {
                const ots   = tarefas.filter(t => t.okrId === okr.id)
                const total = ots.length
                if (total === 0) return null
                const feita = ots.filter(t => t.status === 'feita').length
                const emAnd = ots.filter(t => t.status === 'em_andamento').length
                const pend  = ots.filter(t => t.status === 'pendente').length
                const bloq  = ots.filter(t => t.status === 'bloqueada').length
                const cor   = catColor[okr.categoria] ?? '#7B2FBE'
                return (
                  <div key={okr.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      <div style={{ width: 3, height: 14, background: cor, borderRadius: 2, flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: 11, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {okr.titulo.length > 52 ? okr.titulo.slice(0, 52) + '…' : okr.titulo}
                      </span>
                      <span style={{ fontSize: 10, color: '#9CA3AF', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                        {feita}/{total}
                      </span>
                    </div>
                    <div style={{ height: 6, display: 'flex', borderRadius: 3, overflow: 'hidden', background: '#F3F4F6' }}>
                      {feita > 0 && <div style={{ width: `${(feita/total)*100}%`, background: '#22C55E' }} />}
                      {emAnd > 0 && <div style={{ width: `${(emAnd/total)*100}%`, background: '#3B82F6' }} />}
                      {pend  > 0 && <div style={{ width: `${(pend/total)*100}%`,  background: '#E5E7EB' }} />}
                      {bloq  > 0 && <div style={{ width: `${(bloq/total)*100}%`,  background: '#EF4444' }} />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Prioridade */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #F3F4F6', background: '#FAFAFA' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#111827', margin: 0 }}>Prioridade</p>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {([
                { key: 'alta',  label: 'Alta',  color: '#DC2626' },
                { key: 'media', label: 'Média', color: '#D97706' },
                { key: 'baixa', label: 'Baixa', color: '#16A34A' },
              ] as const).map(p => {
                const count = tarefas.filter(t => t.prioridade === p.key).length
                const maxC  = Math.max(
                  tarefas.filter(t => t.prioridade === 'alta').length,
                  tarefas.filter(t => t.prioridade === 'media').length,
                  tarefas.filter(t => t.prioridade === 'baixa').length,
                  1,
                )
                return (
                  <div key={p.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: '#374151' }}>{p.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: p.color, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                    </div>
                    <div style={{ height: 4, background: '#F3F4F6', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 2, width: `${(count / maxC) * 100}%`, background: p.color, transition: 'width 0.4s' }} />
                    </div>
                  </div>
                )
              })}
              <div style={{ marginTop: 4, paddingTop: 10, borderTop: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: '#374151' }}>Geral</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#7B2FBE', fontVariantNumeric: 'tabular-nums' }}>{pctGeral}%</span>
                </div>
                <div style={{ height: 4, background: '#F3F4F6', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 2, width: `${pctGeral}%`, background: '#7B2FBE', transition: 'width 0.4s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          BLOCO 3 — PLANO DE AÇÃO (lista)
      ════════════════════════════════════════ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            Plano de Ação
          </p>
        </div>

        {okrs.map(okr => {
          const okrTarefas = tarefas.filter(t => t.okrId === okr.id)
          const okrFeitas  = okrTarefas.filter(t => t.status === 'feita').length
          const cor        = catColor[okr.categoria] ?? '#7B2FBE'
          const isExpanded = expanded[okr.id] ?? true
          if (okr.keyResults.length === 0) return null

          return (
            <div key={okr.id} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>

              {/* Header do OKR */}
              <button
                onClick={() => setExpanded(p => ({ ...p, [okr.id]: !isExpanded }))}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 20px', background: '#FAFAFA', border: 'none',
                  borderBottom: isExpanded ? '1px solid #F3F4F6' : 'none',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{ width: 3, height: 18, borderRadius: 2, background: cor, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {okr.titulo}
                  </p>
                  <p style={{ fontSize: 10, color: '#9CA3AF', margin: '2px 0 0' }}>
                    {okr.categoria} · {okr.trimestre}
                    {okrTarefas.length > 0 && (
                      <span style={{ marginLeft: 8, fontWeight: 500, color: cor }}>
                        {okrFeitas}/{okrTarefas.length} tarefas
                      </span>
                    )}
                  </p>
                </div>
                {isExpanded
                  ? <ChevronUp size={13} style={{ color: '#D1D5DB', flexShrink: 0 }} />
                  : <ChevronDown size={13} style={{ color: '#D1D5DB', flexShrink: 0 }} />
                }
              </button>

              {isExpanded && (
                <div>
                  {/* Cabeçalhos de coluna */}
                  <div
                    className="grid items-center px-5 py-2 bg-gray-50 border-b border-gray-100"
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
                    const krPct     = kr.meta > 0 ? Math.min(100, Math.round((kr.atual / kr.meta) * 100)) : 0

                    return (
                      <div key={kr.id} className={cn(krIdx > 0 ? 'border-t border-gray-50' : '')}>
                        {/* Sub-header do KR */}
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                          padding: '8px 20px', background: 'rgba(249,250,251,0.6)',
                          borderBottom: '1px solid #F9FAFB',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: cor, opacity: 0.45, flexShrink: 0 }} />
                            <p style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', margin: 0, lineHeight: 1.4 }}>
                              {kr.descricao}
                            </p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                            {kr.meta > 0 && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 48, height: 3, background: '#F3F4F6', borderRadius: 2, overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${krPct}%`, background: cor, borderRadius: 2 }} />
                                </div>
                                <span style={{ fontSize: 10, color: '#9CA3AF', fontVariantNumeric: 'tabular-nums' }}>
                                  {kr.atual}/{kr.meta} {kr.unit}
                                </span>
                              </div>
                            )}
                            {krTarefas.length > 0 && (
                              <span style={{ fontSize: 10, color: '#9CA3AF', fontVariantNumeric: 'tabular-nums' }}>
                                {krFeitas}/{krTarefas.length}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Linhas de tarefa */}
                        {krTarefas.map(tarefa => (
                          <div
                            key={tarefa.id}
                            className={cn(
                              'group grid items-center px-5 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors',
                              tarefa.status === 'feita' && 'opacity-60',
                            )}
                            style={{ gridTemplateColumns: '1fr 120px 80px 28px' }}
                          >
                            <p className={cn(
                              'text-sm leading-snug pr-4',
                              tarefa.status === 'feita' ? 'text-gray-400 line-through' : 'text-gray-700',
                            )}>
                              {tarefa.descricao}
                            </p>
                            <div><StatusChip status={tarefa.status} onClick={() => cycleStatus(tarefa.id)} /></div>
                            <div><PrioridadeChip prioridade={tarefa.prioridade} onClick={() => cyclePrioridade(tarefa.id)} /></div>
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
                              <button onClick={() => addTarefa(kr.id, okr.id)} className="text-xs font-semibold text-[#7B2FBE] hover:text-[#6a1fa8]">
                                Salvar
                              </button>
                              <button onClick={() => { setAddingTo(null); setNovaDesc('') }} className="text-gray-300 hover:text-gray-500">
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
    </div>
  )
}
