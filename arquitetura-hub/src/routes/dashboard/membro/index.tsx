import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Plus, X, Trash2, ChevronDown, ChevronUp,
  ChevronRight, ChevronLeft, Zap,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, CartesianGrid,
} from 'recharts'
import { useAuth } from '@/context/AuthContext'
import { memberKey } from '@/lib/memberStorage'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/membro/')({ component: HomePage })

/* ─── PALETTE ─── */
const D = {
  bg:        '#FAFAF9',
  card:      '#FFFFFF',
  surface:   '#F5F4F2',
  surface2:  '#EEECEA',
  border:    'rgba(26,25,22,0.07)',
  border2:   'rgba(26,25,22,0.12)',
  text:      '#1A1916',
  textMid:   '#3A3530',
  textSub:   '#6B6560',
  textMuted: '#8A8680',
  textFaint: '#C5C0BA',
  gold:      '#C5A880',
  serif:     "'Cormorant Garamond', Georgia, serif",
}

/* ─── TYPES ─── */
interface KeyResult { id: string; descricao: string; meta: number; atual: number; unit: string }
interface Objective  { id: string; titulo: string; categoria: string; trimestre: string; keyResults: KeyResult[] }
type TarefaStatus = 'pendente' | 'em_andamento' | 'feita' | 'bloqueada'
type Prioridade   = 'alta' | 'media' | 'baixa'
type ViewMode     = 'lista' | 'kanban' | 'fluxos'
interface Tarefa  { id: string; descricao: string; krId: string; okrId: string; status: TarefaStatus; prioridade: Prioridade; auto: boolean }
interface WorkflowTask { descricao: string; prioridade: Prioridade; fase: string }
interface Workflow { id: string; nome: string; descricao: string; cor: string; emoji: string; tarefas: WorkflowTask[] }

/* ─── CONSTANTS ─── */
const OKR_KEY     = 'okr_store_v1'
const TAREFAS_KEY = 'tarefas_store_v1'

const catColor: Record<string, string> = {
  Autoridade: '#C5A880', Receita: '#10B981', Alcance: '#3B82F6', Produto: '#F59E0B',
}
const catBg: Record<string, string> = {
  Autoridade: 'rgba(197,168,128,0.12)', Receita: 'rgba(16,185,129,0.12)',
  Alcance: 'rgba(59,130,246,0.12)',     Produto: 'rgba(245,158,11,0.12)',
}

const statusCycle: TarefaStatus[]   = ['pendente', 'em_andamento', 'feita', 'bloqueada']
const prioridadeCycle: Prioridade[] = ['alta', 'media', 'baixa']

const statusConfig: Record<TarefaStatus, { label: string; bg: string; text: string; dot: string }> = {
  pendente:     { label: 'Pendente',     bg: 'rgba(0,0,0,0.05)',       text: '#6B6560', dot: '#9E9A94' },
  em_andamento: { label: 'Em andamento', bg: 'rgba(59,130,246,0.10)',  text: '#2563EB', dot: '#3B82F6' },
  feita:        { label: 'Feita',        bg: 'rgba(16,185,129,0.10)',  text: '#059669', dot: '#10B981' },
  bloqueada:    { label: 'Bloqueada',    bg: 'rgba(239,68,68,0.10)',   text: '#DC2626', dot: '#EF4444' },
}
const prioridadeConfig: Record<Prioridade, { label: string; bg: string; text: string }> = {
  alta:  { label: 'Alta',  bg: 'rgba(239,68,68,0.10)',  text: '#DC2626' },
  media: { label: 'Média', bg: 'rgba(245,158,11,0.10)', text: '#D97706' },
  baixa: { label: 'Baixa', bg: 'rgba(16,185,129,0.10)', text: '#059669' },
}

const WORKFLOWS: Workflow[] = [
  {
    id: 'calendario-conteudo', nome: 'Calendário de Conteúdo', emoji: '📅',
    descricao: 'Planejamento, produção e publicação de conteúdo semanal com consistência',
    cor: '#C5A880',
    tarefas: [
      { fase: 'Planejamento', descricao: 'Definir os temas e formatos dos conteúdos da semana', prioridade: 'alta' },
      { fase: 'Planejamento', descricao: 'Criar calendário editorial com datas, canais e chamadas para ação', prioridade: 'alta' },
      { fase: 'Produção',     descricao: 'Escrever textos ou roteiros de todos os conteúdos planejados', prioridade: 'alta' },
      { fase: 'Produção',     descricao: 'Criar artes, imagens ou gravar e editar vídeos', prioridade: 'media' },
      { fase: 'Publicação',   descricao: 'Publicar conteúdos nos canais e horários definidos no calendário', prioridade: 'alta' },
      { fase: 'Análise',      descricao: 'Registrar métricas de engajamento e listar aprendizados para a próxima semana', prioridade: 'baixa' },
    ],
  },
  {
    id: 'pipeline-vendas', nome: 'Pipeline de Vendas', emoji: '💼',
    descricao: 'Da prospecção ao fechamento com etapas claras de qualificação',
    cor: '#10B981',
    tarefas: [
      { fase: 'Prospecção',   descricao: 'Mapear e listar 10 leads qualificados dentro do perfil de cliente ideal', prioridade: 'alta' },
      { fase: 'Prospecção',   descricao: 'Enviar mensagem de conexão personalizada para 5 leads da lista', prioridade: 'alta' },
      { fase: 'Qualificação', descricao: 'Agendar conversa de descoberta com os leads que responderam', prioridade: 'alta' },
      { fase: 'Qualificação', descricao: 'Identificar dor, orçamento e urgência em cada conversa', prioridade: 'alta' },
      { fase: 'Proposta',     descricao: 'Elaborar proposta personalizada para o lead mais qualificado', prioridade: 'alta' },
      { fase: 'Proposta',     descricao: 'Apresentar a proposta, tirar dúvidas e responder objeções', prioridade: 'alta' },
      { fase: 'Fechamento',   descricao: 'Fazer follow-up com quem recebeu proposta e ainda não respondeu', prioridade: 'media' },
      { fase: 'Fechamento',   descricao: 'Enviar contrato e confirmar início do projeto com o cliente', prioridade: 'alta' },
    ],
  },
  {
    id: 'lancamento-produto', nome: 'Lançamento de Produto', emoji: '🚀',
    descricao: 'Prepare, lance e promova sua oferta com fases bem definidas',
    cor: '#F59E0B',
    tarefas: [
      { fase: 'Preparação', descricao: 'Definir proposta de valor, nome e posicionamento do produto ou serviço', prioridade: 'alta' },
      { fase: 'Preparação', descricao: 'Criar página de vendas ou material de apresentação completo', prioridade: 'alta' },
      { fase: 'Preparação', descricao: 'Listar 20 contatos do público-alvo para comunicar no lançamento', prioridade: 'media' },
      { fase: 'Lançamento', descricao: 'Publicar anúncio oficial com oferta, benefícios e prazo claro', prioridade: 'alta' },
      { fase: 'Lançamento', descricao: 'Enviar mensagem para lista aquecida com oferta especial de lançamento', prioridade: 'alta' },
      { fase: 'Promoção',   descricao: 'Criar 3 conteúdos de prova social: depoimento, resultado e bastidor', prioridade: 'alta' },
      { fase: 'Promoção',   descricao: 'Fazer follow-up com quem demonstrou interesse mas ainda não comprou', prioridade: 'media' },
      { fase: 'Iteração',   descricao: 'Coletar feedback dos primeiros clientes e listar melhorias prioritárias', prioridade: 'baixa' },
    ],
  },
  {
    id: 'eventos-aparicoes', nome: 'Eventos e Aparições', emoji: '🎤',
    descricao: 'Conquiste palcos, podcasts e eventos para ampliar sua autoridade',
    cor: '#3B82F6',
    tarefas: [
      { fase: 'Pesquisa',    descricao: 'Listar 15 eventos, podcasts e programas do setor com contato do responsável', prioridade: 'alta' },
      { fase: 'Pitch',       descricao: 'Criar pitch de apresentação em 5 linhas com o tema proposto e credenciais', prioridade: 'alta' },
      { fase: 'Pitch',       descricao: 'Enviar pitch personalizado para os 5 primeiros organizadores da lista', prioridade: 'alta' },
      { fase: 'Confirmação', descricao: 'Fazer follow-up com quem não respondeu após 5 dias úteis', prioridade: 'media' },
      { fase: 'Confirmação', descricao: 'Confirmar logística, formato e data com os organizadores que aceitaram', prioridade: 'alta' },
      { fase: 'Execução',    descricao: 'Preparar apresentação, roteiro ou pontos-chave da participação', prioridade: 'alta' },
      { fase: 'Pós-evento',  descricao: 'Publicar conteúdo sobre a participação e agradecer publicamente o organizador', prioridade: 'baixa' },
    ],
  },
  {
    id: 'posicionamento-marca', nome: 'Posicionamento de Marca', emoji: '🎯',
    descricao: 'Defina e comunique quem você é e para quem resolve problemas',
    cor: '#EC4899',
    tarefas: [
      { fase: 'Diagnóstico',  descricao: 'Listar seus 5 maiores diferenciais, casos de sucesso e público ideal', prioridade: 'alta' },
      { fase: 'Diagnóstico',  descricao: 'Analisar 3 referências do setor e identificar lacunas de mercado', prioridade: 'media' },
      { fase: 'Definição',    descricao: 'Escrever seu posicionamento: quem você ajuda, com o quê e com qual resultado', prioridade: 'alta' },
      { fase: 'Definição',    descricao: 'Atualizar bio e "sobre" de todos os canais com o novo posicionamento', prioridade: 'alta' },
      { fase: 'Criação',      descricao: 'Criar 3 conteúdos que demonstrem seu posicionamento na prática', prioridade: 'alta' },
      { fase: 'Amplificação', descricao: 'Compartilhar conteúdos e engajar ativamente nos comentários por 5 dias', prioridade: 'media' },
      { fase: 'Amplificação', descricao: 'Pedir para 3 pessoas da sua rede validarem seu posicionamento', prioridade: 'baixa' },
    ],
  },
]

/* ─── EXTRA TYPES ─── */
interface KpiItem { id: string; kpi_name: string; atual: number; meta: number; unidade?: string }
interface AcaoMarketing { id: string; titulo: string; mes: number; concluida: boolean }

type BriefingPriority = 'urgente' | 'foco' | 'atencao'
interface BriefingItem { prioridade: BriefingPriority; mensagem: string; submensagem?: string; href: string }

/* ─── HELPERS ─── */
function pct(atual: number, meta: number) { return !meta ? 0 : Math.min(100, Math.round((atual / meta) * 100)) }
function objPct(obj: Objective) {
  if (!obj.keyResults.length) return 0
  return Math.round(obj.keyResults.reduce((s, kr) => s + pct(kr.atual, kr.meta), 0) / obj.keyResults.length)
}
function hexToRgb(hex: string) {
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`
}

function gerarBriefingCoach(
  okrs: Objective[],
  tarefas: Tarefa[],
  kpisData: KpiItem[],
): BriefingItem[] {
  const itens: BriefingItem[] = []

  const okrsCriticos = [...okrs]
    .map(o => ({ ...o, p: objPct(o) }))
    .filter(o => o.p < 100 && o.keyResults.length > 0)
    .sort((a, b) => a.p - b.p)

  for (const okr of okrsCriticos.slice(0, 2)) {
    const criticalKr = [...okr.keyResults]
      .map(kr => ({ ...kr, p: pct(kr.atual, kr.meta), gap: kr.meta - kr.atual }))
      .filter(kr => kr.p < 100 && kr.meta > 0)
      .sort((a, b) => a.p - b.p)[0]

    if (!criticalKr) continue

    const gap  = criticalKr.gap
    const unit = criticalKr.unit || 'unidades'
    const desc = criticalKr.descricao.toLowerCase()

    let acao = ''
    if (desc.includes('palestra') || desc.includes('evento') || desc.includes('aparição'))
      acao = `abrir ${Math.min(5, Math.ceil(gap * 2))} contatos com organizadores de eventos`
    else if (desc.includes('conteúdo') || desc.includes('publicar') || desc.includes('post') || desc.includes('editorial'))
      acao = `produzir e agendar ${Math.min(3, gap)} conteúdo${gap !== 1 ? 's' : ''}`
    else if (desc.includes('lead') || desc.includes('prospect') || desc.includes('conversa') || desc.includes('reunião'))
      acao = `fazer ${Math.min(5, gap)} prospecções ativas hoje`
    else if (desc.includes('receita') || desc.includes('venda') || desc.includes('fechar') || desc.includes('proposta'))
      acao = `avançar ${Math.min(3, gap)} proposta${gap !== 1 ? 's' : ''} em aberto`
    else if (desc.includes('podcast') || desc.includes('entrevista'))
      acao = `enviar ${Math.min(3, gap)} pitch${gap !== 1 ? 's' : ''} para podcasts do setor`
    else
      acao = `avançar ${Math.min(gap, 3)} ${unit} neste resultado`

    itens.push({
      prioridade: okr.p < 30 ? 'urgente' : 'foco',
      mensagem: `Para atingir "${okr.titulo}", você precisa ${acao}`,
      submensagem: `${okr.p}% concluído · Faltam ${gap} ${unit}`,
      href: '/dashboard/membro/okr',
    })
  }

  const urgentes = tarefas.filter(t => t.prioridade === 'alta' && t.status === 'pendente').slice(0, 2)
  for (const t of urgentes) {
    itens.push({
      prioridade: 'foco',
      mensagem: t.descricao.length > 90 ? t.descricao.slice(0, 90) + '…' : t.descricao,
      submensagem: 'Missão de alta prioridade aguardando ação',
      href: '/dashboard/membro/tarefas',
    })
  }

  for (const kpi of kpisData) {
    const p = pct(kpi.atual, kpi.meta)
    if (p < 40 && itens.length < 4) {
      itens.push({
        prioridade: 'atencao',
        mensagem: `"${kpi.kpi_name}" precisa de atenção — está em ${p}%`,
        submensagem: `Atual: ${kpi.atual} · Meta: ${kpi.meta}${kpi.unidade ? ' ' + kpi.unidade : ''}`,
        href: '/dashboard/membro/kpis',
      })
    }
  }

  if (itens.length === 0 && okrs.length === 0) {
    itens.push({
      prioridade: 'foco',
      mensagem: 'Comece definindo seus OKRs para receber orientações personalizadas',
      submensagem: 'Vá até Metas de Impacto e crie seus primeiros objetivos',
      href: '/dashboard/membro/okr',
    })
  }

  return itens.slice(0, 4)
}

function gerarTarefas(kr: KeyResult, okrId: string): Tarefa[] {
  const desc = kr.descricao.toLowerCase()
  let s: { descricao: string; prioridade: Prioridade }[]

  if (desc.includes('publicar') || desc.includes('conteúdo') || desc.includes('posicionamento') || desc.includes('editorial'))
    s = [
      { descricao: 'Definir os 4 temas de conteúdo do mês e o formato de cada um', prioridade: 'alta' },
      { descricao: 'Produzir e publicar o conteúdo desta semana conforme o calendário', prioridade: 'alta' },
      { descricao: 'Registrar o engajamento e anotar o que performou melhor para repetir', prioridade: 'media' },
    ]
  else if (desc.includes('aparição') || desc.includes('evento') || desc.includes('podcast'))
    s = [
      { descricao: 'Pesquisar e listar 10 eventos, podcasts ou programas do seu setor', prioridade: 'alta' },
      { descricao: 'Escrever um pitch de apresentação de 5 linhas destacando sua expertise', prioridade: 'alta' },
      { descricao: 'Entrar em contato com 3 organizadores da lista esta semana', prioridade: 'alta' },
      { descricao: 'Fazer follow-up com quem não respondeu após 5 dias úteis', prioridade: 'media' },
    ]
  else if (desc.includes('conversa') || desc.includes('descoberta') || desc.includes('reunião'))
    s = [
      { descricao: 'Listar 10 contatos qualificados que poderiam se beneficiar do seu trabalho', prioridade: 'alta' },
      { descricao: 'Enviar mensagem de conexão personalizada para 5 contatos da lista esta semana', prioridade: 'alta' },
      { descricao: 'Agendar 2 conversas de descoberta para os próximos 7 dias', prioridade: 'alta' },
      { descricao: 'Fazer follow-up com quem demonstrou interesse mas não confirmou', prioridade: 'media' },
    ]
  else if (desc.includes('proposta') || desc.includes('comercial'))
    s = [
      { descricao: 'Identificar os 3 leads mais qualificados e prontos para receber uma proposta', prioridade: 'alta' },
      { descricao: 'Escrever uma proposta comercial personalizada para o lead principal', prioridade: 'alta' },
      { descricao: 'Enviar a proposta e agendar uma conversa de apresentação em até 48h', prioridade: 'alta' },
    ]
  else if (desc.includes('fechar') || desc.includes('cliente') || desc.includes('contrato'))
    s = [
      { descricao: 'Revisar todos os leads em negociação e definir o próximo passo de cada um', prioridade: 'alta' },
      { descricao: 'Preparar e enviar proposta para o lead mais avançado no processo', prioridade: 'alta' },
      { descricao: 'Fazer follow-up com quem recebeu proposta há mais de 3 dias sem retorno', prioridade: 'media' },
    ]
  else if (desc.includes('depoimento') || desc.includes('indicação'))
    s = [
      { descricao: 'Selecionar os 5 clientes mais satisfeitos e pedir um depoimento', prioridade: 'alta' },
      { descricao: 'Publicar o depoimento recebido com a autorização do cliente', prioridade: 'alta' },
      { descricao: 'Pedir indicações ativas para os 3 melhores clientes atendidos', prioridade: 'media' },
    ]
  else
    s = [
      { descricao: `Definir os próximos passos concretos para: ${kr.descricao}`, prioridade: 'alta' },
      { descricao: 'Estabelecer uma rotina semanal de 30 minutos para avançar neste resultado', prioridade: 'media' },
      { descricao: 'Revisar o progresso deste KR com o mentor na próxima sessão', prioridade: 'baixa' },
    ]

  return s.map((t, i) => ({
    id: `auto-${kr.id}-${i}`, descricao: t.descricao,
    krId: kr.id, okrId, status: 'pendente' as TarefaStatus, prioridade: t.prioridade, auto: true,
  }))
}

/* ─── CHIPS ─── */
function StatusChip({ status, onClick }: { status: TarefaStatus; onClick: () => void }) {
  const c = statusConfig[status]
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap hover:opacity-80 flex-shrink-0"
      style={{ background: c.bg, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {c.label}
    </button>
  )
}
function PrioridadeChip({ prioridade, onClick }: { prioridade: Prioridade; onClick?: () => void }) {
  const c = prioridadeConfig[prioridade]
  return (
    <button onClick={onClick}
      className="px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap hover:opacity-80 flex-shrink-0"
      style={{ background: c.bg, color: c.text }}>
      {c.label}
    </button>
  )
}

/* ─── MINI COMPONENTS ─── */
function HR() {
  return <hr style={{ border: 'none', borderTop: `1px solid ${D.border}`, margin: 0 }} />
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: D.textMuted, margin: 0 }}>
      {children}
    </p>
  )
}

function ChecklistRow({ done, label, href }: { done: boolean; label: string; href: string }) {
  return (
    <Link to={href} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '8px 0', transition: 'opacity 0.12s' }}
        onMouseEnter={e => { if (!done) e.currentTarget.style.opacity = '0.65' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
      >
        {done ? (
          <div style={{ width: 15, height: 15, borderRadius: '50%', background: D.gold, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 8, color: '#fff', fontWeight: 700, lineHeight: 1 }}>✓</span>
          </div>
        ) : (
          <div style={{ width: 15, height: 15, borderRadius: '50%', border: `1.5px solid ${D.textFaint}`, flexShrink: 0 }} />
        )}
        <span style={{ fontSize: 14, flex: 1, color: done ? D.textMuted : D.textMid, textDecoration: done ? 'line-through' : 'none', lineHeight: 1.4 }}>
          {label}
        </span>
        {!done && <ChevronRight size={13} style={{ color: D.textFaint, flexShrink: 0 }} />}
      </div>
    </Link>
  )
}

function OkrRow({ okr }: { okr: Objective }) {
  const p   = objPct(okr)
  const col = catColor[okr.categoria] ?? D.gold
  return (
    <Link to="/dashboard/membro/okr" style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{ display: 'grid', gridTemplateColumns: '96px 1fr 140px 44px', alignItems: 'center', gap: 16, padding: '9px 0', transition: 'opacity 0.1s' }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.68'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <span style={{ fontSize: 10, fontWeight: 600, color: col, textTransform: 'uppercase', letterSpacing: '0.07em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {okr.categoria}
        </span>
        <span style={{ fontSize: 13, color: D.textMid, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {okr.titulo}
        </span>
        <div style={{ height: 2, background: D.surface2, borderRadius: 1, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${p}%`, background: col, borderRadius: 1, transition: 'width 0.5s ease' }} />
        </div>
        <span style={{
          fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums', textAlign: 'right',
          color: p >= 75 ? '#22C55E' : (p >= 40 ? D.gold : D.textMuted),
        }}>
          {p}%
        </span>
      </div>
    </Link>
  )
}

/* ═══════════════════════════════════════════
   KANBAN VIEW
═══════════════════════════════════════════ */
interface KanbanProps {
  okrs: Objective[]; tarefas: Tarefa[]
  onCycleStatus: (id: string) => void
  onCycleBack: (id: string) => void
  onCyclePrioridade: (id: string) => void
  onDelete: (id: string) => void
  onUpdateDesc: (id: string, desc: string) => void
  onAddTask: (desc: string, krId: string, okrId: string, status: TarefaStatus) => void
}
function KanbanView({ okrs, tarefas, onCycleStatus, onCycleBack, onCyclePrioridade, onDelete, onUpdateDesc, onAddTask }: KanbanProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDesc,  setEditDesc]  = useState('')
  const [addingCol, setAddingCol] = useState<TarefaStatus | null>(null)
  const [addDesc,   setAddDesc]   = useState('')
  const [addKr,     setAddKr]     = useState('')

  const allKrOptions = okrs.flatMap(o => o.keyResults.map(kr => ({
    value: `${o.id}::${kr.id}`,
    label: `${o.titulo.length > 22 ? o.titulo.slice(0, 22) + '…' : o.titulo} › ${kr.descricao.length > 30 ? kr.descricao.slice(0, 30) + '…' : kr.descricao}`,
  })))

  function startEdit(id: string, desc: string) { setEditingId(id); setEditDesc(desc) }
  function saveEdit() {
    if (editingId && editDesc.trim()) onUpdateDesc(editingId, editDesc.trim())
    setEditingId(null); setEditDesc('')
  }
  function cancelEdit() { setEditingId(null); setEditDesc('') }
  function handleAdd() {
    if (!addDesc.trim() || !addKr) return
    const [okrId, krId] = addKr.split('::')
    onAddTask(addDesc.trim(), krId, okrId, addingCol!)
    setAddingCol(null); setAddDesc(''); setAddKr('')
  }

  const cols: { key: TarefaStatus; label: string; dot: string; topColor: string }[] = [
    { key: 'pendente',     label: 'Pendente',     dot: D.textMuted,  topColor: D.textMuted  },
    { key: 'em_andamento', label: 'Em andamento', dot: '#3B82F6',    topColor: '#3B82F6'    },
    { key: 'feita',        label: 'Feita',        dot: '#22C55E',    topColor: '#22C55E'    },
    { key: 'bloqueada',    label: 'Bloqueada',    dot: '#EF4444',    topColor: '#EF4444'    },
  ]
  const okrMap: Record<string, Objective> = {}
  okrs.forEach(o => { okrMap[o.id] = o })

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))', gap: 10, minWidth: 880 }}>
        {cols.map(col => {
          const cards = tarefas.filter(t => t.status === col.key)
          return (
            <div key={col.key} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                background: D.surface, border: `1px solid ${D.border}`,
                borderRadius: '8px 8px 0 0', borderBottom: `2px solid ${col.topColor}`,
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: col.dot, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: D.textMid, flex: 1 }}>{col.label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: D.textMuted, background: D.surface2, padding: '1px 6px', borderRadius: 10, fontVariantNumeric: 'tabular-nums' }}>
                  {cards.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                {cards.length === 0 && addingCol !== col.key ? (
                  <div style={{ background: D.surface, border: `1px dashed ${D.border}`, borderTop: 'none', padding: '16px 12px', textAlign: 'center' }}>
                    <p style={{ fontSize: 11, color: D.textFaint, margin: 0 }}>Sem missões</p>
                  </div>
                ) : cards.map((tarefa, ci) => {
                  const okr = okrMap[tarefa.okrId]
                  const cor = catColor[okr?.categoria ?? ''] ?? D.gold
                  const isEditing = editingId === tarefa.id
                  return (
                    <div key={tarefa.id} style={{
                      background: D.card, border: `1px solid ${D.border}`, borderTop: 'none',
                      borderLeft: `3px solid ${cor}`, padding: '10px 12px',
                      borderRadius: ci === cards.length - 1 && addingCol !== col.key ? '0 0 0 0' : 0,
                    }}>
                      {isEditing ? (
                        <div style={{ marginBottom: 8 }}>
                          <textarea
                            autoFocus value={editDesc}
                            onChange={e => setEditDesc(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit() } if (e.key === 'Escape') cancelEdit() }}
                            rows={3}
                            style={{ width: '100%', fontSize: 12, color: D.text, background: D.surface2, resize: 'none', border: `1px solid ${D.gold}`, borderRadius: 4, padding: '4px 6px', outline: 'none', lineHeight: 1.5, boxSizing: 'border-box' }}
                          />
                          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                            <button onClick={saveEdit} style={{ flex: 1, fontSize: 10, padding: '3px 0', background: D.gold, color: '#1A1208', border: 'none', borderRadius: 3, cursor: 'pointer', fontWeight: 600 }}>Salvar</button>
                            <button onClick={cancelEdit} style={{ fontSize: 10, padding: '3px 8px', background: D.surface2, color: D.textSub, border: 'none', borderRadius: 3, cursor: 'pointer' }}>Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <p
                          onDoubleClick={() => startEdit(tarefa.id, tarefa.descricao)}
                          title="Duplo clique para editar"
                          style={{ fontSize: 12, color: D.textMid, lineHeight: 1.5, margin: '0 0 8px', cursor: 'text', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                        >
                          {tarefa.descricao}
                        </p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
                          {okr && (
                            <span style={{ fontSize: 9, fontWeight: 600, color: cor, background: catBg[okr.categoria] ?? 'rgba(197,168,128,0.12)', padding: '1px 5px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>
                              {okr.categoria}
                            </span>
                          )}
                          <PrioridadeChip prioridade={tarefa.prioridade} onClick={() => onCyclePrioridade(tarefa.id)} />
                        </div>
                        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                          <button onClick={() => onCycleBack(tarefa.id)} title="Voltar status"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 4, border: `1px solid ${D.border}`, background: D.surface2, color: D.textMuted, cursor: 'pointer' }}>
                            <ChevronLeft size={12} />
                          </button>
                          <button onClick={() => onCycleStatus(tarefa.id)} title="Avançar status"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 4, border: `1px solid ${D.border}`, background: D.surface2, color: D.textMuted, cursor: 'pointer' }}>
                            <ChevronRight size={12} />
                          </button>
                          <button onClick={() => onDelete(tarefa.id)} title="Remover"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 4, border: `1px solid ${D.border}`, background: D.surface2, color: D.textMuted, cursor: 'pointer' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                            onMouseLeave={e => (e.currentTarget.style.color = D.textMuted)}>
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {addingCol === col.key ? (
                <div style={{ border: `1px dashed ${D.gold}`, borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '8px 10px', background: 'rgba(197,168,128,0.04)' }}>
                  <input
                    autoFocus value={addDesc}
                    onChange={e => setAddDesc(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') { setAddingCol(null); setAddDesc(''); setAddKr('') } }}
                    placeholder="Descreva a missão..."
                    style={{ width: '100%', fontSize: 11, border: `1px solid ${D.border2}`, borderRadius: 4, padding: '4px 8px', outline: 'none', marginBottom: 4, boxSizing: 'border-box', background: D.surface2, color: D.text }}
                  />
                  <select value={addKr} onChange={e => setAddKr(e.target.value)}
                    style={{ width: '100%', fontSize: 10, border: `1px solid ${D.border2}`, borderRadius: 4, padding: '3px 6px', marginBottom: 6, boxSizing: 'border-box', background: D.surface2, color: D.textMid }}>
                    <option value="">Resultado-Chave...</option>
                    {allKrOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={handleAdd} style={{ flex: 1, fontSize: 11, padding: '4px', background: D.gold, color: '#1A1208', border: 'none', borderRadius: 3, cursor: 'pointer', fontWeight: 600 }}>Adicionar</button>
                    <button onClick={() => { setAddingCol(null); setAddDesc(''); setAddKr('') }} style={{ fontSize: 11, padding: '4px 8px', background: D.surface2, color: D.textSub, border: 'none', borderRadius: 3, cursor: 'pointer' }}>✕</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setAddingCol(col.key); setAddDesc(''); setAddKr('') }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'transparent', border: `1px dashed ${D.border}`, borderTop: 'none', borderRadius: '0 0 8px 8px', cursor: 'pointer', fontSize: 11, color: D.textFaint, width: '100%' }}
                  onMouseEnter={e => { e.currentTarget.style.color = D.textSub; e.currentTarget.style.borderColor = D.border2 }}
                  onMouseLeave={e => { e.currentTarget.style.color = D.textFaint; e.currentTarget.style.borderColor = D.border }}
                >
                  <Plus size={11} /> Adicionar missão
                </button>
              )}
            </div>
          )
        })}
      </div>
      <p style={{ fontSize: 10, color: D.textFaint, marginTop: 10, textAlign: 'center' }}>
        ← → para mover status · duplo clique na missão para editar · clique na prioridade para alterar
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════
   LISTA VIEW
═══════════════════════════════════════════ */
interface ListaProps {
  okrs: Objective[]; tarefas: Tarefa[]
  expanded: Record<string, boolean>
  onToggle: (id: string) => void
  onCycleStatus: (id: string) => void
  onCyclePrioridade: (id: string) => void
  onDelete: (id: string) => void
  onUpdateDesc: (id: string, desc: string) => void
  addingTo: string | null; novaDesc: string
  setNovaDesc: (v: string) => void; setAddingTo: (v: string | null) => void
  addTarefa: (krId: string, okrId: string) => void
}
function ListaView({ okrs, tarefas, expanded, onToggle, onCycleStatus, onCyclePrioridade, onDelete, onUpdateDesc, addingTo, novaDesc, setNovaDesc, setAddingTo, addTarefa }: ListaProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDesc,  setEditDesc]  = useState('')

  function startEdit(id: string, desc: string) { setEditingId(id); setEditDesc(desc) }
  function saveEdit() {
    if (editingId && editDesc.trim()) onUpdateDesc(editingId, editDesc.trim())
    setEditingId(null); setEditDesc('')
  }
  function cancelEdit() { setEditingId(null); setEditDesc('') }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {okrs.map(okr => {
        const okrTarefas = tarefas.filter(t => t.okrId === okr.id)
        const okrFeitas  = okrTarefas.filter(t => t.status === 'feita').length
        const cor        = catColor[okr.categoria] ?? D.gold
        const isExpanded = expanded[okr.id] ?? true
        if (okr.keyResults.length === 0) return null

        return (
          <div key={okr.id} style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <button
              onClick={() => onToggle(okr.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', background: D.surface, border: 'none', borderBottom: isExpanded ? `1px solid ${D.border}` : 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ width: 3, height: 18, borderRadius: 2, background: cor, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: D.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{okr.titulo}</p>
                <p style={{ fontSize: 10, color: D.textMuted, margin: '2px 0 0' }}>
                  {okr.categoria} · {okr.trimestre}
                  {okrTarefas.length > 0 && <span style={{ marginLeft: 8, fontWeight: 500, color: cor }}>{okrFeitas}/{okrTarefas.length} missões</span>}
                </p>
              </div>
              {isExpanded ? <ChevronUp size={13} style={{ color: D.textFaint, flexShrink: 0 }} /> : <ChevronDown size={13} style={{ color: D.textFaint, flexShrink: 0 }} />}
            </button>

            {isExpanded && (
              <div>
                <div className="grid items-center px-5 py-2 border-b" style={{ gridTemplateColumns: '1fr 120px 80px 52px', borderColor: D.border, backgroundColor: D.surface }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: D.textMuted }}>Missão</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: D.textMuted }}>Status</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: D.textMuted }}>Prioridade</p>
                  <span />
                </div>
                {okr.keyResults.map((kr, krIdx) => {
                  const krTarefas = tarefas.filter(t => t.krId === kr.id)
                  const krFeitas  = krTarefas.filter(t => t.status === 'feita').length
                  const krPct     = kr.meta > 0 ? Math.min(100, Math.round((kr.atual / kr.meta) * 100)) : 0
                  return (
                    <div key={kr.id} className={cn(krIdx > 0 ? 'border-t' : '')} style={{ borderColor: D.border }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 20px', background: 'rgba(22,20,18,0.6)', borderBottom: `1px solid ${D.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: cor, opacity: 0.5, flexShrink: 0 }} />
                          <p style={{ fontSize: 11, fontWeight: 500, color: D.textSub, margin: 0, lineHeight: 1.4 }}>{kr.descricao}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                          {kr.meta > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ width: 48, height: 3, background: D.surface2, borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${krPct}%`, background: cor, borderRadius: 2 }} />
                              </div>
                              <span style={{ fontSize: 10, color: D.textMuted, fontVariantNumeric: 'tabular-nums' }}>{kr.atual}/{kr.meta} {kr.unit}</span>
                            </div>
                          )}
                          {krTarefas.length > 0 && <span style={{ fontSize: 10, color: D.textMuted, fontVariantNumeric: 'tabular-nums' }}>{krFeitas}/{krTarefas.length}</span>}
                        </div>
                      </div>
                      {krTarefas.map(tarefa => (
                        editingId === tarefa.id ? (
                          <div key={tarefa.id} className="grid items-center px-5 py-2 border-b" style={{ gridTemplateColumns: '1fr 180px 52px', borderColor: D.border, backgroundColor: 'rgba(197,168,128,0.04)' }}>
                            <input
                              autoFocus value={editDesc}
                              onChange={e => setEditDesc(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
                              style={{ fontSize: 13, color: D.text, background: 'transparent', outline: 'none', borderBottom: `1px solid ${D.gold}`, paddingRight: 16 }}
                            />
                            <div className="flex items-center gap-2">
                              <button onClick={saveEdit} style={{ fontSize: 12, fontWeight: 600, color: D.gold, background: 'none', border: 'none', cursor: 'pointer' }}>Salvar</button>
                              <button onClick={cancelEdit} style={{ color: D.textMuted, background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><X size={12} /></button>
                            </div>
                            <span />
                          </div>
                        ) : (
                          <div key={tarefa.id}
                            className={cn('group grid items-center px-5 py-2.5 border-b last:border-0 transition-colors', tarefa.status === 'feita' && 'opacity-50')}
                            style={{ gridTemplateColumns: '1fr 120px 80px 52px', borderColor: D.border }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <p
                              onDoubleClick={() => startEdit(tarefa.id, tarefa.descricao)}
                              title="Duplo clique para editar"
                              style={{ fontSize: 13, lineHeight: 1.45, paddingRight: 16, cursor: 'text', color: tarefa.status === 'feita' ? D.textMuted : D.textMid, textDecoration: tarefa.status === 'feita' ? 'line-through' : 'none', margin: 0 }}
                            >
                              {tarefa.descricao}
                            </p>
                            <div><StatusChip status={tarefa.status} onClick={() => onCycleStatus(tarefa.id)} /></div>
                            <div><PrioridadeChip prioridade={tarefa.prioridade} onClick={() => onCyclePrioridade(tarefa.id)} /></div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                              <button onClick={() => onDelete(tarefa.id)} style={{ padding: 4, color: D.textFaint, background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                                onMouseLeave={e => (e.currentTarget.style.color = D.textFaint)}>
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        )
                      ))}
                      {addingTo === kr.id ? (
                        <div className="grid items-center px-5 py-2.5 border-t" style={{ gridTemplateColumns: '1fr 120px 80px 52px', borderColor: D.border, backgroundColor: 'rgba(197,168,128,0.04)' }}>
                          <input autoFocus value={novaDesc} onChange={e => setNovaDesc(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') addTarefa(kr.id, okr.id); if (e.key === 'Escape') { setAddingTo(null); setNovaDesc('') } }}
                            placeholder="Descreva a missão e pressione Enter..."
                            style={{ fontSize: 13, color: D.text, background: 'transparent', outline: 'none', border: 'none', paddingRight: 16 }}
                          />
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => addTarefa(kr.id, okr.id)} style={{ fontSize: 12, fontWeight: 600, color: D.gold, background: 'none', border: 'none', cursor: 'pointer' }}>Salvar</button>
                            <button onClick={() => { setAddingTo(null); setNovaDesc('') }} style={{ color: D.textMuted, background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><X size={12} /></button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => { setAddingTo(kr.id); setNovaDesc('') }}
                          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px', width: '100%', textAlign: 'left', fontSize: 12, color: D.textFaint, background: 'transparent', border: 'none', borderTop: `1px solid ${D.border}`, cursor: 'pointer' }}
                          onMouseEnter={e => { e.currentTarget.style.color = D.gold }}
                          onMouseLeave={e => { e.currentTarget.style.color = D.textFaint }}
                        >
                          <Plus size={12} /> Adicionar tarefa
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

/* ═══════════════════════════════════════════
   FLUXOS VIEW
═══════════════════════════════════════════ */
interface FluxosProps {
  okrs: Objective[]; appliedWorkflows: string[]
  onApply: (workflowId: string, krId: string, okrId: string) => void
}
function FluxosView({ okrs, appliedWorkflows, onApply }: FluxosProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [krTarget, setKrTarget] = useState('')

  const allKrOptions = okrs.flatMap(o => o.keyResults.map(kr => ({
    value: `${o.id}::${kr.id}`,
    label: `${o.titulo.length > 28 ? o.titulo.slice(0, 28) + '…' : o.titulo} › ${kr.descricao.length > 36 ? kr.descricao.slice(0, 36) + '…' : kr.descricao}`,
  })))

  const selectedWf = WORKFLOWS.find(w => w.id === selected)

  function handleApply() {
    if (!selected || !krTarget) return
    const [okrId, krId] = krTarget.split('::')
    onApply(selected, krId, okrId)
    setSelected(null); setKrTarget('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Zap size={16} style={{ color: D.gold, flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: D.text, margin: 0 }}>Fluxos de Trabalho</p>
          <p style={{ fontSize: 11, color: D.textSub, margin: '2px 0 0', lineHeight: 1.5 }}>
            Escolha um fluxo pré-construído, selecione o Resultado-Chave e aplique missões organizadas por fases diretamente no seu plano.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {WORKFLOWS.map(wf => {
          const isSelected = selected === wf.id
          const wasApplied = appliedWorkflows.includes(wf.id)
          const phases = Array.from(new Set(wf.tarefas.map(t => t.fase)))
          return (
            <button
              key={wf.id}
              onClick={() => setSelected(isSelected ? null : wf.id)}
              style={{
                display: 'flex', flexDirection: 'column', gap: 10,
                padding: '14px 16px', borderRadius: 8, textAlign: 'left', cursor: 'pointer',
                border: isSelected ? `2px solid ${wf.cor}` : `1px solid ${D.border}`,
                background: isSelected ? `rgba(${hexToRgb(wf.cor)},0.07)` : D.card,
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              {wasApplied && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: '#4ADE80', background: 'rgba(34,197,94,0.15)', padding: '2px 6px', borderRadius: 10 }}>✓ Aplicado</span>
                </div>
              )}
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: D.text, margin: 0 }}>{wf.nome}</p>
                <p style={{ fontSize: 11, color: D.textSub, margin: '3px 0 0', lineHeight: 1.5 }}>{wf.descricao}</p>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {phases.map(fase => (
                  <span key={fase} style={{ fontSize: 9, fontWeight: 500, color: wf.cor, background: `rgba(${hexToRgb(wf.cor)},0.12)`, padding: '2px 6px', borderRadius: 3 }}>{fase}</span>
                ))}
              </div>
              <p style={{ fontSize: 10, color: D.textMuted, margin: 0 }}>{wf.tarefas.length} missões</p>
            </button>
          )
        })}
      </div>

      {selectedWf && (
        <div style={{ background: D.card, border: `1.5px solid ${selectedWf.cor}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${D.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: D.text, margin: 0 }}>{selectedWf.nome}</p>
              <p style={{ fontSize: 11, color: D.textSub, margin: '2px 0 0' }}>{selectedWf.descricao}</p>
            </div>
            <button onClick={() => setSelected(null)} style={{ color: D.textMuted, background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
              <X size={14} />
            </button>
          </div>
          <div style={{ padding: '12px 20px 0' }}>
            {Array.from(new Set(selectedWf.tarefas.map(t => t.fase))).map(fase => {
              const faseTarefas = selectedWf.tarefas.filter(t => t.fase === fase)
              return (
                <div key={fase} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: selectedWf.cor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{fase}</span>
                    <div style={{ flex: 1, height: 1, background: D.border }} />
                  </div>
                  {faseTarefas.map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '4px 0 4px 8px' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: selectedWf.cor, flexShrink: 0, marginTop: 6 }} />
                      <p style={{ fontSize: 12, color: D.textMid, margin: 0, lineHeight: 1.5, flex: 1 }}>{t.descricao}</p>
                      <span style={{ fontSize: 9, fontWeight: 600, flexShrink: 0, padding: '2px 5px', borderRadius: 3, background: prioridadeConfig[t.prioridade].bg, color: prioridadeConfig[t.prioridade].text }}>
                        {prioridadeConfig[t.prioridade].label}
                      </span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
          <div style={{ padding: '12px 20px', borderTop: `1px solid ${D.border}`, background: D.surface, display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: D.textMid, flexShrink: 0 }}>Aplicar ao KR:</label>
            {allKrOptions.length === 0 ? (
              <span style={{ fontSize: 11, color: D.textSub }}>Crie OKRs em Metas de Impacto para poder aplicar fluxos</span>
            ) : (
              <>
                <select value={krTarget} onChange={e => setKrTarget(e.target.value)}
                  style={{ flex: 1, fontSize: 11, color: D.textMid, border: `1px solid ${D.border2}`, borderRadius: 5, padding: '5px 8px', background: D.surface2, outline: 'none' }}>
                  <option value="">Selecione um Resultado-Chave...</option>
                  {allKrOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <button
                  onClick={handleApply} disabled={!krTarget}
                  style={{ padding: '6px 16px', borderRadius: 5, border: 'none', cursor: krTarget ? 'pointer' : 'default', background: krTarget ? selectedWf.cor : D.surface2, color: krTarget ? '#fff' : D.textMuted, fontSize: 12, fontWeight: 600, flexShrink: 0, transition: 'background 0.1s' }}
                >
                  Aplicar fluxo
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   PÁGINA PRINCIPAL
═══════════════════════════════════════════ */
function HomePage() {
  const { user } = useAuth()
  const firstName = user?.full_name?.split(' ')[0] ?? ''

  const [okrs,                setOkrs]               = useState<Objective[]>([])
  const [tarefas,             setTarefas]            = useState<Tarefa[]>([])
  const [expanded,            setExpanded]           = useState<Record<string, boolean>>({})
  const [addingTo,            setAddingTo]           = useState<string | null>(null)
  const [novaDesc,            setNovaDesc]           = useState('')
  const [view,                setView]               = useState<ViewMode>('lista')
  const [appliedWorkflows,    setAppliedWorkflows]   = useState<string[]>([])
  const [hasIdentidade,       setHasIdentidade]      = useState(false)
  const [hasMarketing,        setHasMarketing]       = useState(false)
  const [hasKpis,             setHasKpis]            = useState(false)
  const [kpisData,            setKpisData]           = useState<KpiItem[]>([])
  const [marketingTotal,      setMarketingTotal]     = useState(0)
  const [marketingConcluidas, setMarketingConcluidas] = useState(0)

  useEffect(() => {
    try { const s = localStorage.getItem(memberKey(OKR_KEY)); if (s) setOkrs(JSON.parse(s) ?? []) } catch {}
    try { setHasIdentidade(!!localStorage.getItem(memberKey('identidade_marca_v1'))) } catch {}
    try {
      const mRaw = localStorage.getItem(memberKey('marketing_store_v1'))
      const mArr = mRaw ? JSON.parse(mRaw) : []
      if (Array.isArray(mArr)) {
        setHasMarketing(mArr.length > 0)
        setMarketingTotal(mArr.length)
        setMarketingConcluidas((mArr as AcaoMarketing[]).filter(a => a.concluida).length)
      }
    } catch {}
    try {
      const kRaw = localStorage.getItem(memberKey('kpis_store_v1'))
      const kArr = kRaw ? JSON.parse(kRaw) : []
      if (Array.isArray(kArr)) {
        setHasKpis(kArr.length > 0)
        setKpisData(kArr as KpiItem[])
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (!okrs.length) return
    let stored: Tarefa[] = []
    try {
      const raw = JSON.parse(localStorage.getItem(memberKey(TAREFAS_KEY)) ?? '[]') ?? []
      stored = raw.map((t: Tarefa & { done?: boolean }) => ({ ...t, status: t.status ?? (t.done ? 'feita' : 'pendente'), prioridade: t.prioridade ?? 'media' }))
    } catch {}
    const existingKrIds = new Set(stored.map(t => t.krId))
    const geradas: Tarefa[] = []
    for (const okr of okrs) for (const kr of okr.keyResults) if (!existingKrIds.has(kr.id)) geradas.push(...gerarTarefas(kr, okr.id))
    setTarefas([...stored, ...geradas])
    const exp: Record<string, boolean> = {}
    for (const okr of okrs) exp[okr.id] = true
    setExpanded(exp)
  }, [okrs])

  useEffect(() => {
    if (tarefas.length > 0 || localStorage.getItem(memberKey(TAREFAS_KEY)))
      localStorage.setItem(memberKey(TAREFAS_KEY), JSON.stringify(tarefas))
  }, [tarefas])

  function cycleStatus(id: string) {
    setTarefas(prev => prev.map(t => { if (t.id !== id) return t; const i = statusCycle.indexOf(t.status); return { ...t, status: statusCycle[(i + 1) % statusCycle.length] } }))
  }
  function cycleStatusBack(id: string) {
    setTarefas(prev => prev.map(t => { if (t.id !== id) return t; const i = statusCycle.indexOf(t.status); return { ...t, status: statusCycle[(i - 1 + statusCycle.length) % statusCycle.length] } }))
  }
  function cyclePrioridade(id: string) {
    setTarefas(prev => prev.map(t => { if (t.id !== id) return t; const i = prioridadeCycle.indexOf(t.prioridade); return { ...t, prioridade: prioridadeCycle[(i + 1) % prioridadeCycle.length] } }))
  }
  function deleteTarefa(id: string) { setTarefas(prev => prev.filter(t => t.id !== id)) }
  function updateDesc(id: string, desc: string) { setTarefas(prev => prev.map(t => t.id === id ? { ...t, descricao: desc } : t)) }
  function addTarefa(krId: string, okrId: string) {
    const desc = novaDesc.trim(); if (!desc) return
    setTarefas(prev => [...prev, { id: `manual-${Date.now()}`, descricao: desc, krId, okrId, status: 'pendente', prioridade: 'media', auto: false }])
    setNovaDesc(''); setAddingTo(null)
  }
  function addTarefaWithStatus(desc: string, krId: string, okrId: string, status: TarefaStatus) {
    setTarefas(prev => [...prev, { id: `manual-${Date.now()}`, descricao: desc, krId, okrId, status, prioridade: 'media', auto: false }])
  }
  function applyWorkflow(workflowId: string, krId: string, okrId: string) {
    const wf = WORKFLOWS.find(w => w.id === workflowId)
    if (!wf) return
    const newTarefas: Tarefa[] = wf.tarefas.map((t, i) => ({
      id: `wf-${workflowId}-${Date.now()}-${i}`, descricao: t.descricao,
      krId, okrId, status: 'pendente' as TarefaStatus, prioridade: t.prioridade, auto: false,
    }))
    setTarefas(prev => [...prev, ...newTarefas])
    setAppliedWorkflows(prev => [...prev, workflowId])
  }

  const progOkrs    = okrs.length ? Math.round(okrs.reduce((s, o) => s + objPct(o), 0) / okrs.length) : 0
  const feitasCount = tarefas.filter(t => t.status === 'feita').length
  const emAndamento = tarefas.filter(t => t.status === 'em_andamento').length
  const bloqueadas  = tarefas.filter(t => t.status === 'bloqueada').length
  const hoje        = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  const ativas      = tarefas.filter(t => t.status !== 'feita')
  const topMissions = [
    ...tarefas.filter(t => t.status === 'em_andamento'),
    ...tarefas.filter(t => t.status === 'pendente' && t.prioridade === 'alta'),
    ...tarefas.filter(t => t.status === 'pendente' && t.prioridade === 'media'),
    ...tarefas.filter(t => t.status === 'pendente' && t.prioridade === 'baixa'),
  ].filter((t, i, arr) => arr.findIndex(x => x.id === t.id) === i).slice(0, 5)

  const journeyPhases = [
    { label: 'Identidade',  done: hasIdentidade   },
    { label: 'Pilares',     done: false           },
    { label: 'Metas',       done: okrs.length > 0 },
    { label: 'Marketing',   done: hasMarketing    },
    { label: 'Indicadores', done: hasKpis         },
  ]
  const completedCount  = journeyPhases.filter(p => p.done).length
  const journeyPct      = Math.round((completedCount / journeyPhases.length) * 100)
  const currentPhaseIdx = journeyPhases.reduce((last, p, i) => p.done ? i : last, -1)

  const viewTabs = [
    { key: 'lista'  as ViewMode, label: 'Lista'  },
    { key: 'kanban' as ViewMode, label: 'Kanban' },
    { key: 'fluxos' as ViewMode, label: 'Fluxos' },
  ]

  /* ── Coach briefing ── */
  const briefing = gerarBriefingCoach(okrs, tarefas, kpisData)
  const briefingConfig: Record<BriefingPriority, { label: string; dot: string; border: string }> = {
    urgente: { label: 'Urgente', dot: '#EF4444', border: 'rgba(239,68,68,0.18)'   },
    foco:    { label: 'Foco',    dot: D.gold,    border: 'rgba(197,168,128,0.22)' },
    atencao: { label: 'Atenção', dot: '#F59E0B', border: 'rgba(245,158,11,0.18)'  },
  }

  /* ── Dashboard metrics ── */
  const avgKpiPct      = kpisData.length ? Math.round(kpisData.reduce((s, k) => s + pct(k.atual, k.meta), 0) / kpisData.length) : 0
  const marketingPct   = marketingTotal > 0 ? Math.round((marketingConcluidas / marketingTotal) * 100) : 0
  const tarefasPct     = tarefas.length > 0 ? Math.round((feitasCount / tarefas.length) * 100) : 0

  const metrics = [
    { label: 'OKRs',        value: okrs.length > 0 ? `${progOkrs}%` : '—',          sub: okrs.length > 0 ? `${okrs.length} objetivo${okrs.length !== 1 ? 's' : ''}` : 'Sem metas',                                                       color: progOkrs >= 75 ? '#22C55E' : progOkrs >= 40 ? D.gold : '#F87171',     pct: progOkrs,      href: '/dashboard/membro/okr'       },
    { label: 'Missões',     value: tarefas.length > 0 ? `${feitasCount}/${tarefas.length}` : '—', sub: emAndamento > 0 ? `${emAndamento} em andamento` : (bloqueadas > 0 ? `${bloqueadas} bloqueada${bloqueadas !== 1 ? 's' : ''}` : 'Nenhuma ativa'), color: tarefasPct >= 70 ? '#22C55E' : tarefasPct >= 40 ? D.gold : D.textMuted, pct: tarefasPct,    href: '/dashboard/membro/tarefas'   },
    { label: 'Marketing',   value: marketingTotal > 0 ? `${marketingPct}%` : '—',    sub: marketingTotal > 0 ? `${marketingConcluidas} de ${marketingTotal} ações` : 'Sem plano',                                                        color: marketingPct >= 70 ? '#22C55E' : marketingPct >= 40 ? D.gold : D.textMuted, pct: marketingPct, href: '/dashboard/membro/marketing' },
    { label: 'Indicadores', value: kpisData.length > 0 ? `${avgKpiPct}%` : '—',     sub: kpisData.length > 0 ? `${kpisData.length} KPI${kpisData.length !== 1 ? 's' : ''}` : 'Sem KPIs',                                               color: avgKpiPct >= 75 ? '#22C55E' : avgKpiPct >= 40 ? D.gold : '#F87171',   pct: avgKpiPct,     href: '/dashboard/membro/kpis'      },
  ]

  return (
    <div style={{ maxWidth: 900, padding: '48px 0 80px', display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ── */}
      <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: D.textMuted, margin: '0 0 14px' }}>
        {hoje.charAt(0).toUpperCase() + hoje.slice(1)}
      </p>
      <h1 style={{ fontFamily: D.serif, fontSize: 'clamp(36px,4.5vw,54px)', fontWeight: 600, color: D.text, margin: 0, letterSpacing: '-0.025em', lineHeight: 1.05 }}>
        Central de Controle
      </h1>
      <p style={{ fontSize: 15, color: D.textSub, margin: '10px 0 0', lineHeight: 1.7, maxWidth: 480 }}>
        {firstName ? `Olá, ${firstName}. ` : ''}
        {ativas.length > 0
          ? `Você tem ${ativas.length} missão${ativas.length !== 1 ? 'ões' : ''} ativa${ativas.length !== 1 ? 's' : ''} — veja o que priorizar hoje.`
          : 'Seu hub de autoridade e estratégia de marca.'
        }
      </p>

      {/* ── MAIN SECTIONS ── */}
      <div style={{ marginTop: 44, display: 'flex', flexDirection: 'column' }}>

        {/* ══ HOJE: O QUE FAZER AGORA ══ */}
        <div style={{ marginBottom: 40, border: `1.5px solid ${D.border2}`, background: D.card }}>

          {/* Cabeçalho do card */}
          <div style={{
            padding: '13px 24px', borderBottom: `1px solid ${D.border}`, background: D.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: ativas.length > 0 ? '#22C55E' : D.textFaint, flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: D.textMid }}>
                Missões prioritárias de hoje
              </span>
            </div>
            <Link to="/dashboard/membro/tarefas" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: 10, color: D.gold, fontWeight: 600, transition: 'opacity 0.1s' }}>
                {ativas.length} ativas no total →
              </span>
            </Link>
          </div>

          {/* Lista de missões */}
          {topMissions.length === 0 ? (
            <div style={{ padding: '28px 24px', textAlign: 'center' }}>
              {okrs.length === 0 ? (
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: D.textMid, margin: '0 0 6px' }}>Nenhuma missão criada ainda</p>
                  <p style={{ fontSize: 13, color: D.textSub, lineHeight: 1.6, margin: '0 0 18px' }}>
                    Crie seus OKRs em <Link to="/dashboard/membro/okr" style={{ color: D.gold, textDecoration: 'none', fontWeight: 600 }}>Metas de Impacto</Link> para gerar missões automaticamente.
                  </p>
                </div>
              ) : (
                <p style={{ fontSize: 13, color: D.textSub, margin: 0 }}>
                  Todas as missões concluídas — excelente trabalho!
                </p>
              )}
            </div>
          ) : (
            <div>
              {topMissions.map((m, i) => {
                const scfg = statusConfig[m.status]
                const pcfg = prioridadeConfig[m.prioridade]
                return (
                  <div key={m.id}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 24px',
                      borderBottom: i < topMissions.length - 1 ? `1px solid ${D.border}` : 'none',
                      transition: 'background 0.1s', cursor: 'default',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = D.surface }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  >
                    {/* Círculo de status (clicável) */}
                    <button
                      onClick={() => cycleStatus(m.id)}
                      title="Clique para avançar o status"
                      style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                        border: `2px solid ${scfg.dot}`,
                        background: m.status === 'feita' ? scfg.dot : 'transparent',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                    >
                      {m.status === 'feita' && <span style={{ fontSize: 9, color: '#fff', fontWeight: 700 }}>✓</span>}
                      {m.status === 'em_andamento' && <span style={{ width: 7, height: 7, borderRadius: '50%', background: scfg.dot, display: 'block' }} />}
                    </button>

                    {/* Descrição */}
                    <p style={{
                      fontSize: 14, color: m.status === 'feita' ? D.textMuted : D.textMid,
                      margin: 0, lineHeight: 1.55, flex: 1,
                      textDecoration: m.status === 'feita' ? 'line-through' : 'none',
                    }}>
                      {m.descricao}
                    </p>

                    {/* Badges */}
                    <div style={{ display: 'flex', gap: 5, flexShrink: 0, alignItems: 'center', marginTop: 2 }}>
                      {m.status === 'em_andamento' && (
                        <span style={{ fontSize: 9, fontWeight: 600, padding: '3px 8px', background: scfg.bg, color: scfg.text, whiteSpace: 'nowrap' }}>
                          Em andamento
                        </span>
                      )}
                      <span style={{ fontSize: 9, fontWeight: 600, padding: '3px 8px', background: pcfg.bg, color: pcfg.text }}>
                        {pcfg.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── Faixa de métricas rápidas ── */}
          <div style={{ borderTop: `1px solid ${D.border}`, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>

            <Link to="/dashboard/membro/tarefas" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '16px 24px', transition: 'background 0.1s' }}
                onMouseEnter={e => { e.currentTarget.style.background = D.surface }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: D.textMuted, margin: '0 0 6px' }}>
                  Missões ativas
                </p>
                <p style={{ fontFamily: D.serif, fontSize: 32, fontWeight: 400, color: D.text, margin: '0 0 4px', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                  {ativas.length}
                </p>
                <p style={{ fontSize: 10, color: D.textMuted, margin: 0 }}>
                  {feitasCount > 0 ? `${feitasCount} concluída${feitasCount !== 1 ? 's' : ''}` : 'Nenhuma concluída ainda'}
                </p>
              </div>
            </Link>

            <Link to="/dashboard/membro/okr" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '16px 24px', borderLeft: `1px solid ${D.border}`, transition: 'background 0.1s' }}
                onMouseEnter={e => { e.currentTarget.style.background = D.surface }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: D.textMuted, margin: '0 0 6px' }}>
                  Progresso OKRs
                </p>
                <p style={{ fontFamily: D.serif, fontSize: 32, fontWeight: 400, margin: '0 0 4px', lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: progOkrs >= 70 ? '#22C55E' : progOkrs >= 40 ? D.gold : (okrs.length > 0 ? '#F87171' : D.textMuted) }}>
                  {okrs.length > 0 ? `${progOkrs}%` : '—'}
                </p>
                <p style={{ fontSize: 10, color: D.textMuted, margin: 0 }}>
                  {okrs.length > 0 ? `${okrs.length} objetivo${okrs.length !== 1 ? 's' : ''}` : 'Sem metas criadas'}
                </p>
              </div>
            </Link>

            <Link to="/dashboard/membro/agenda" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '16px 24px', borderLeft: `1px solid ${D.border}`, transition: 'background 0.1s' }}
                onMouseEnter={e => { e.currentTarget.style.background = D.surface }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: D.textMuted, margin: '0 0 6px' }}>
                  Próxima sessão
                </p>
                <p style={{ fontFamily: D.serif, fontSize: 32, fontWeight: 400, color: D.gold, margin: '0 0 4px', lineHeight: 1 }}>
                  Agenda
                </p>
                <p style={{ fontSize: 10, color: D.textMuted, margin: 0 }}>
                  Ver cronograma de ações →
                </p>
              </div>
            </Link>

          </div>
        </div>

        {/* ── ORIENTAÇÕES ESTRATÉGICAS ── */}
        {briefing.length > 0 && (
          <div style={{ paddingBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
              <SectionLabel>Orientações estratégicas</SectionLabel>
              <span style={{ fontSize: 9, color: D.textFaint, letterSpacing: '0.05em' }}>baseadas nos seus dados de hoje</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {briefing.map((item, i) => {
                const cfg = briefingConfig[item.prioridade]
                return (
                  <Link key={i} to={item.href} style={{ textDecoration: 'none', display: 'block' }}>
                    <div
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        padding: '11px 16px',
                        border: `1px solid ${cfg.border}`,
                        borderLeft: `3px solid ${cfg.dot}`,
                        background: D.card,
                        transition: 'opacity 0.12s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = '0.75' }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: D.textMid, margin: 0, lineHeight: 1.5 }}>
                          {item.mensagem}
                        </p>
                        {item.submensagem && (
                          <p style={{ fontSize: 10, color: D.textMuted, margin: '3px 0 0' }}>{item.submensagem}</p>
                        )}
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: cfg.dot, flexShrink: 0, paddingTop: 2 }}>
                        {cfg.label}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        <HR />

        {/* ── DASHBOARD ── */}
        <div style={{ padding: '36px 0' }}>
          <SectionLabel>Dashboard · Acompanhamento</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', marginTop: 20, borderTop: `1px solid ${D.border}`, borderBottom: `1px solid ${D.border}` }}>
            {metrics.map((m, i) => (
              <Link key={m.label} to={m.href} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  style={{ padding: '22px 20px 22px 0', paddingLeft: i > 0 ? 20 : 0, borderLeft: i > 0 ? `1px solid ${D.border}` : 'none', transition: 'opacity 0.12s' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.72' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                  <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: D.textMuted, marginBottom: 8 }}>{m.label}</p>
                  <p style={{ fontFamily: D.serif, fontSize: 36, fontWeight: 400, color: m.color, lineHeight: 1, fontVariantNumeric: 'tabular-nums', margin: '0 0 8px' }}>{m.value}</p>
                  {m.pct > 0 && (
                    <div style={{ height: 2, background: D.surface2, borderRadius: 1, overflow: 'hidden', marginBottom: 8 }}>
                      <div style={{ height: '100%', width: `${m.pct}%`, background: m.color, borderRadius: 1, transition: 'width 0.5s ease' }} />
                    </div>
                  )}
                  <p style={{ fontSize: 10, color: D.textMuted, margin: 0 }}>{m.sub}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* ── CHARTS ── */}
          {(tarefas.length > 0 || okrs.length > 0) && (
            <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: okrs.length > 0 && tarefas.length > 0 ? '1fr 1fr' : '1fr', gap: 20 }}>

              {/* Missões por status */}
              {tarefas.length > 0 && (() => {
                const data = [
                  { name: 'Pendente',     value: tarefas.filter(t => t.status === 'pendente').length,     fill: '#9E9A94' },
                  { name: 'Andamento',    value: tarefas.filter(t => t.status === 'em_andamento').length, fill: '#3B82F6' },
                  { name: 'Concluída',    value: tarefas.filter(t => t.status === 'feita').length,        fill: '#22C55E' },
                  { name: 'Bloqueada',    value: tarefas.filter(t => t.status === 'bloqueada').length,    fill: '#EF4444' },
                ]
                return (
                  <div style={{ background: D.card, border: `1px solid ${D.border}`, padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: D.textMuted }}>Missões por Status</span>
                      <Link to="/dashboard/membro/tarefas" style={{ textDecoration: 'none', fontSize: 10, color: D.gold, fontWeight: 600 }}>Ver todas →</Link>
                    </div>
                    <ResponsiveContainer width="100%" height={140}>
                      <BarChart data={data} barSize={28} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                        <CartesianGrid vertical={false} stroke={D.border} strokeDasharray="0" />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: D.textMuted }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: D.textMuted }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip
                          cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                          contentStyle={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 4, fontSize: 12 }}
                          labelStyle={{ color: D.textMid, fontWeight: 600 }}
                        />
                        <Bar dataKey="value" name="Missões" radius={[3, 3, 0, 0]}>
                          {data.map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.85} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )
              })()}

              {/* OKRs por categoria */}
              {okrs.length > 0 && (() => {
                const catData = Object.entries(
                  okrs.reduce<Record<string, { total: number; count: number }>>((acc, o) => {
                    const p = objPct(o)
                    if (!acc[o.categoria]) acc[o.categoria] = { total: 0, count: 0 }
                    acc[o.categoria].total += p
                    acc[o.categoria].count += 1
                    return acc
                  }, {})
                ).map(([cat, { total, count }]) => ({
                  name: cat,
                  value: Math.round(total / count),
                  fill: catColor[cat] ?? D.gold,
                }))
                return (
                  <div style={{ background: D.card, border: `1px solid ${D.border}`, padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: D.textMuted }}>OKRs por Categoria (%)</span>
                      <Link to="/dashboard/membro/okr" style={{ textDecoration: 'none', fontSize: 10, color: D.gold, fontWeight: 600 }}>Ver todos →</Link>
                    </div>
                    <ResponsiveContainer width="100%" height={140}>
                      <BarChart data={catData} barSize={36} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                        <CartesianGrid vertical={false} stroke={D.border} strokeDasharray="0" />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: D.textMuted }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: D.textMuted }} axisLine={false} tickLine={false} />
                        <Tooltip
                          cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                          contentStyle={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 4, fontSize: 12 }}
                          formatter={(v: number) => [`${v}%`, 'Progresso']}
                          labelStyle={{ color: D.textMid, fontWeight: 600 }}
                        />
                        <Bar dataKey="value" name="Progresso" radius={[3, 3, 0, 0]}>
                          {catData.map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.85} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )
              })()}

            </div>
          )}

          {kpisData.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: D.textMuted }}>Indicadores-Chave</span>
                <Link to="/dashboard/membro/kpis" style={{ textDecoration: 'none', fontSize: 10, color: D.gold, fontWeight: 600 }}>Ver todos →</Link>
              </div>
              {/* KPI bar chart */}
              <div style={{ marginBottom: 16 }}>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart
                    data={kpisData.slice(0, 6).map(k => ({ name: k.kpi_name.length > 14 ? k.kpi_name.slice(0, 14) + '…' : k.kpi_name, value: pct(k.atual, k.meta), fill: pct(k.atual, k.meta) >= 80 ? '#22C55E' : pct(k.atual, k.meta) >= 50 ? D.gold : '#F87171' }))}
                    barSize={20} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} stroke={D.border} strokeDasharray="0" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: D.textMuted }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: D.textMuted }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                      contentStyle={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 4, fontSize: 12 }}
                      formatter={(v: number) => [`${v}%`, 'Resultado']}
                      labelStyle={{ color: D.textMid, fontWeight: 600 }}
                    />
                    <Bar dataKey="value" name="KPI" radius={[3, 3, 0, 0]}>
                      {kpisData.slice(0, 6).map((k, i) => {
                        const p = pct(k.atual, k.meta)
                        return <Cell key={i} fill={p >= 80 ? '#22C55E' : p >= 50 ? D.gold : '#F87171'} fillOpacity={0.85} />
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {kpisData.slice(0, 5).map((kpi, i) => {
                const p   = pct(kpi.atual, kpi.meta)
                const col = p >= 80 ? '#22C55E' : p >= 50 ? D.gold : '#F87171'
                return (
                  <div key={kpi.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 44px', alignItems: 'center', gap: 14, padding: '8px 0', borderTop: i === 0 ? `1px solid ${D.border}` : 'none', borderBottom: `1px solid ${D.border}` }}>
                    <span style={{ fontSize: 13, color: D.textMid, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{kpi.kpi_name}</span>
                    <div style={{ height: 3, background: D.surface2, borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${p}%`, background: col, borderRadius: 2, transition: 'width 0.5s ease' }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: col, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{p}%</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <HR />

        {/* ── JORNADA ── */}
        <div style={{ padding: '36px 0' }}>
          <SectionLabel>Sua Jornada</SectionLabel>
          <div style={{ marginTop: 18 }}>
            <div style={{ height: 3, background: D.surface2, borderRadius: 2, overflow: 'hidden', maxWidth: 340 }}>
              <div style={{ height: '100%', width: `${Math.max(2, journeyPct)}%`, background: D.gold, borderRadius: 2, transition: 'width 0.6s ease' }} />
            </div>
            <p style={{ fontSize: 12, color: D.textSub, margin: '8px 0 0' }}>
              {journeyPct}% concluído · Fase {journeyPhases[Math.min(currentPhaseIdx + 1, journeyPhases.length - 1)]?.label ?? 'Completa'}
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 28, overflowX: 'auto', paddingBottom: 4 }}>
              {journeyPhases.map((phase, i) => {
                const isDone   = phase.done
                const isActive = i === currentPhaseIdx + 1
                const isFuture = !isDone && !isActive
                const isLast   = i === journeyPhases.length - 1
                return (
                  <div key={phase.label} style={{ display: 'flex', alignItems: 'flex-start', flexShrink: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: isDone || isActive ? 10 : 8, height: isDone || isActive ? 10 : 8, borderRadius: '50%', background: isDone ? D.gold : (isActive ? D.gold : 'transparent'), border: isFuture ? `1.5px solid ${D.textFaint}` : 'none', boxShadow: isActive ? `0 0 0 4px rgba(197,168,128,0.22)` : 'none', flexShrink: 0, marginTop: isFuture ? 1 : 0 }} />
                      <span style={{ fontSize: 11, color: isFuture ? D.textFaint : (isActive ? D.text : D.textSub), fontWeight: isActive ? 500 : 400, whiteSpace: 'nowrap' }}>{phase.label}</span>
                      <span style={{ fontSize: 9, color: D.textFaint, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{isDone ? 'concluído' : (isActive ? 'em andamento' : 'a seguir')}</span>
                    </div>
                    {!isLast && <div style={{ width: 40, height: 1, background: isDone ? 'rgba(197,168,128,0.4)' : D.border, margin: '5px 6px 0', flexShrink: 0 }} />}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {okrs.length > 0 && (
          <>
            <HR />
            {/* ── OBJETIVOS ATIVOS ── */}
            <div style={{ padding: '36px 0' }}>
              <SectionLabel>Objetivos Ativos</SectionLabel>
              <div style={{ marginTop: 14 }}>
                {okrs.map(okr => <OkrRow key={okr.id} okr={okr} />)}
              </div>
            </div>
          </>
        )}

        <HR />

        {/* ── PLANO DE AÇÃO ── */}
        <div style={{ paddingTop: 36 }}>
          <h2 style={{ fontFamily: D.serif, fontSize: 32, fontWeight: 600, color: D.text, margin: 0, letterSpacing: '-0.02em' }}>
            Plano de Ação
          </h2>
          <p style={{ fontSize: 13, color: D.textSub, margin: '6px 0 0', lineHeight: 1.6 }}>
            {tarefas.length > 0
              ? `${feitasCount} de ${tarefas.length} missões concluídas · ${emAndamento} em andamento${bloqueadas > 0 ? ` · ${bloqueadas} bloqueadas` : ''}`
              : 'Crie OKRs para gerar missões automaticamente.'
            }
          </p>

          {/* Tab bar */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${D.border}`, marginTop: 20, marginBottom: 24 }}>
            {viewTabs.map(({ key, label }) => (
              <button key={key} onClick={() => setView(key)}
                style={{
                  padding: '8px 18px', border: 'none', background: 'none', cursor: 'pointer',
                  borderBottom: view === key ? `2px solid ${D.gold}` : '2px solid transparent',
                  marginBottom: '-1px',
                  fontSize: 13, fontWeight: view === key ? 500 : 400,
                  color: view === key ? D.text : D.textMuted,
                  transition: 'color 0.1s', letterSpacing: '0.01em',
                }}
                onMouseEnter={e => { if (view !== key) (e.currentTarget as HTMLButtonElement).style.color = D.textMid }}
                onMouseLeave={e => { if (view !== key) (e.currentTarget as HTMLButtonElement).style.color = D.textMuted }}
              >
                {label}
              </button>
            ))}
          </div>

          {okrs.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: D.textMid, margin: '0 0 6px' }}>Nenhum objetivo criado ainda</p>
              <p style={{ fontSize: 13, color: D.textSub, lineHeight: 1.6, margin: '0 0 24px' }}>
                Vá até <strong style={{ color: D.textMid }}>Metas de Impacto</strong> para criar seus primeiros OKRs e gerar missões automaticamente.
              </p>
              <Link to="/dashboard/membro/okr" style={{ textDecoration: 'none' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 22px', background: D.gold, color: '#1A1208',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                }}>
                  Criar OKRs →
                </span>
              </Link>
            </div>
          ) : (
            <div style={{ minHeight: 240 }}>
              {view === 'lista' && (
                <ListaView
                  okrs={okrs} tarefas={tarefas} expanded={expanded}
                  onToggle={id => setExpanded(p => ({ ...p, [id]: !p[id] }))}
                  onCycleStatus={cycleStatus} onCyclePrioridade={cyclePrioridade}
                  onDelete={deleteTarefa} onUpdateDesc={updateDesc}
                  addingTo={addingTo} novaDesc={novaDesc}
                  setNovaDesc={setNovaDesc} setAddingTo={setAddingTo} addTarefa={addTarefa}
                />
              )}
              {view === 'kanban' && (
                <KanbanView
                  okrs={okrs} tarefas={tarefas}
                  onCycleStatus={cycleStatus} onCycleBack={cycleStatusBack}
                  onCyclePrioridade={cyclePrioridade} onDelete={deleteTarefa}
                  onUpdateDesc={updateDesc} onAddTask={addTarefaWithStatus}
                />
              )}
              {view === 'fluxos' && (
                <FluxosView okrs={okrs} appliedWorkflows={appliedWorkflows} onApply={applyWorkflow} />
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
