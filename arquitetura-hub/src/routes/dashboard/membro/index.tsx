import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Plus, X, Trash2, ChevronDown, ChevronUp, ClipboardList,
  LayoutDashboard, Kanban, LayoutList, ChevronRight, ChevronLeft, Zap, Rocket,
  Briefcase, Target, TrendingUp, Users, Grid3x3, Sliders,
  CheckCircle2, Circle,
} from 'lucide-react'
import {
  BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer,
  Tooltip, CartesianGrid, PieChart, Pie,
} from 'recharts'
import { useAuth } from '@/context/AuthContext'
import { memberKey } from '@/lib/memberStorage'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/membro/')({ component: HomePage })

/* ─── TYPES ─── */
interface KeyResult { id: string; descricao: string; meta: number; atual: number; unit: string }
interface Objective { id: string; titulo: string; categoria: string; trimestre: string; keyResults: KeyResult[] }
type TarefaStatus = 'pendente' | 'em_andamento' | 'feita' | 'bloqueada'
type Prioridade   = 'alta' | 'media' | 'baixa'
type ViewMode     = 'dashboard' | 'kanban' | 'lista' | 'fluxos'
interface Tarefa  { id: string; descricao: string; krId: string; okrId: string; status: TarefaStatus; prioridade: Prioridade; auto: boolean }
interface WorkflowTask { descricao: string; prioridade: Prioridade; fase: string }
interface Workflow { id: string; nome: string; descricao: string; cor: string; emoji: string; tarefas: WorkflowTask[] }

/* ─── CONSTANTS ─── */
const OKR_KEY     = 'okr_store_v1'
const TAREFAS_KEY = 'tarefas_store_v1'

function userStorageKey(base: string): string {
  try {
    const u = JSON.parse(localStorage.getItem('mock_user') ?? 'null')
    if (u?.id && u.id !== 'member-3') return `${base}_${u.id}`
  } catch {}
  return base
}

const catColor: Record<string, string> = { Autoridade: '#7B2FBE', Receita: '#10B981', Alcance: '#3B82F6', Produto: '#F59E0B' }
const catBg:    Record<string, string> = {
  Autoridade: 'rgba(123,47,190,0.09)', Receita: 'rgba(16,185,129,0.09)',
  Alcance: 'rgba(59,130,246,0.09)',    Produto: 'rgba(245,158,11,0.09)',
}

const statusCycle: TarefaStatus[]   = ['pendente', 'em_andamento', 'feita', 'bloqueada']
const prioridadeCycle: Prioridade[] = ['alta', 'media', 'baixa']

const statusConfig: Record<TarefaStatus, { label: string; bg: string; text: string; dot: string }> = {
  pendente:     { label: 'Pendente',     bg: '#F9FAFB', text: '#6B7280', dot: '#D1D5DB' },
  em_andamento: { label: 'Em andamento', bg: '#EFF6FF', text: '#2563EB', dot: '#3B82F6' },
  feita:        { label: 'Feita',        bg: '#F0FDF4', text: '#16A34A', dot: '#22C55E' },
  bloqueada:    { label: 'Bloqueada',    bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444' },
}
const prioridadeConfig: Record<Prioridade, { label: string; bg: string; text: string }> = {
  alta:  { label: 'Alta',  bg: '#FEF2F2', text: '#DC2626' },
  media: { label: 'Média', bg: '#FFFBEB', text: '#D97706' },
  baixa: { label: 'Baixa', bg: '#F0FDF4', text: '#16A34A' },
}

const WORKFLOWS: Workflow[] = [
  {
    id: 'calendario-conteudo', nome: 'Calendário de Conteúdo', emoji: '📅',
    descricao: 'Planejamento, produção e publicação de conteúdo semanal com consistência',
    cor: '#7B2FBE',
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
      { fase: 'Prospecção',  descricao: 'Mapear e listar 10 leads qualificados dentro do perfil de cliente ideal', prioridade: 'alta' },
      { fase: 'Prospecção',  descricao: 'Enviar mensagem de conexão personalizada para 5 leads da lista', prioridade: 'alta' },
      { fase: 'Qualificação', descricao: 'Agendar conversa de descoberta com os leads que responderam', prioridade: 'alta' },
      { fase: 'Qualificação', descricao: 'Identificar dor, orçamento e urgência em cada conversa', prioridade: 'alta' },
      { fase: 'Proposta',    descricao: 'Elaborar proposta personalizada para o lead mais qualificado', prioridade: 'alta' },
      { fase: 'Proposta',    descricao: 'Apresentar a proposta, tirar dúvidas e responder objeções', prioridade: 'alta' },
      { fase: 'Fechamento',  descricao: 'Fazer follow-up com quem recebeu proposta e ainda não respondeu', prioridade: 'media' },
      { fase: 'Fechamento',  descricao: 'Enviar contrato e confirmar início do projeto com o cliente', prioridade: 'alta' },
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

/* ─── HELPERS ─── */
function pct(atual: number, meta: number) { return !meta ? 0 : Math.min(100, Math.round((atual / meta) * 100)) }
function objPct(obj: Objective) {
  if (!obj.keyResults.length) return 0
  return Math.round(obj.keyResults.reduce((s, kr) => s + pct(kr.atual, kr.meta), 0) / obj.keyResults.length)
}
function hexToRgb(hex: string) {
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`
}

interface TarefaSugestao { descricao: string; prioridade: Prioridade }
function gerarTarefas(kr: KeyResult, okrId: string): Tarefa[] {
  const desc = kr.descricao.toLowerCase()
  let s: TarefaSugestao[]

  if (desc.includes('publicar') || desc.includes('conteúdo') || desc.includes('posicionamento') || desc.includes('editorial'))
    s = [
      { descricao: 'Definir os 4 temas de conteúdo do mês e o formato de cada um (post, vídeo, artigo)', prioridade: 'alta' },
      { descricao: 'Produzir e publicar o conteúdo desta semana conforme o calendário', prioridade: 'alta' },
      { descricao: 'Registrar o engajamento e anotar o que performou melhor para repetir', prioridade: 'media' },
    ]
  else if (desc.includes('aparição') || desc.includes('evento') || desc.includes('podcast') || desc.includes('convidado') || desc.includes('entrevista'))
    s = [
      { descricao: 'Pesquisar e listar 10 eventos, podcasts ou programas do seu setor com contato do responsável', prioridade: 'alta' },
      { descricao: 'Escrever um pitch de apresentação de 5 linhas destacando sua expertise e o tema que pode trazer', prioridade: 'alta' },
      { descricao: 'Entrar em contato com 3 organizadores da lista esta semana com o pitch personalizado', prioridade: 'alta' },
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
      { descricao: 'Fazer follow-up com quem recebeu proposta e ainda não respondeu após 3 dias', prioridade: 'media' },
    ]
  else if (desc.includes('fechar') || desc.includes('cliente') || desc.includes('contrato'))
    s = [
      { descricao: 'Revisar todos os leads em negociação e definir o próximo passo de cada um', prioridade: 'alta' },
      { descricao: 'Preparar e enviar proposta para o lead mais avançado no processo', prioridade: 'alta' },
      { descricao: 'Fazer follow-up com quem recebeu proposta há mais de 3 dias sem retorno', prioridade: 'media' },
    ]
  else if (desc.includes('depoimento') || desc.includes('indicação') || desc.includes('referência'))
    s = [
      { descricao: 'Selecionar os 5 clientes mais satisfeitos e pedir um depoimento por escrito ou vídeo', prioridade: 'alta' },
      { descricao: 'Publicar o depoimento recebido com a autorização do cliente', prioridade: 'alta' },
      { descricao: 'Pedir indicações ativas para os 3 melhores clientes atendidos no trimestre', prioridade: 'media' },
    ]
  else if (desc.includes('sessão') || desc.includes('demo') || desc.includes('produto'))
    s = [
      { descricao: 'Criar um roteiro de 30 minutos para a sessão de descoberta ou demo do produto', prioridade: 'alta' },
      { descricao: 'Agendar 3 sessões de descoberta ou demos esta semana com leads ou clientes', prioridade: 'alta' },
      { descricao: 'Enviar um formulário de feedback estruturado após cada sessão realizada', prioridade: 'media' },
    ]
  else if (desc.includes('feedback') || desc.includes('melhoria') || desc.includes('iteração'))
    s = [
      { descricao: 'Criar um formulário de feedback com 5 perguntas objetivas sobre o produto ou serviço', prioridade: 'alta' },
      { descricao: 'Enviar o formulário para os últimos 10 clientes atendidos', prioridade: 'alta' },
      { descricao: 'Analisar os feedbacks recebidos e listar as 3 principais melhorias a implementar', prioridade: 'alta' },
      { descricao: 'Implementar a melhoria de maior impacto identificada no feedback', prioridade: 'media' },
    ]
  else if (desc.includes('contato') || desc.includes('conexão') || desc.includes('alcance'))
    s = [
      { descricao: 'Interagir com comentários e publicações de 10 perfis do público-alvo esta semana', prioridade: 'alta' },
      { descricao: 'Publicar um conteúdo focado em atrair conexões qualificadas', prioridade: 'alta' },
      { descricao: 'Enviar convite de conexão personalizado para 5 potenciais parceiros ou clientes', prioridade: 'media' },
    ]
  else
    s = [
      { descricao: `Definir os próximos passos concretos e mensuráveis para: ${kr.descricao}`, prioridade: 'alta' },
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

/* ─── RECHARTS TOOLTIPS ─── */
function OkrTip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 6, padding: '8px 12px', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', maxWidth: 260 }}>
      <p style={{ fontWeight: 600, color: '#111827', marginBottom: 2, lineHeight: 1.4 }}>{d.fullName}</p>
      <p style={{ color: d.color, margin: 0, fontWeight: 600 }}>{d.value}% concluído</p>
    </div>
  )
}
function KrTip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 6, padding: '8px 12px', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', maxWidth: 260 }}>
      <p style={{ fontWeight: 600, color: '#111827', marginBottom: 2, lineHeight: 1.4 }}>{d.fullLabel}</p>
      <p style={{ color: '#6B7280', margin: 0 }}>
        {d.atual} / {d.meta} {d.unit} · <span style={{ color: d.color, fontWeight: 600 }}>{d.value}%</span>
      </p>
    </div>
  )
}
function StatusTip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 6, padding: '8px 12px', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <p style={{ fontWeight: 600, color: d.color, margin: 0 }}>{d.name}: {d.value}</p>
    </div>
  )
}

/* ═══════════════════════════════════════════
   VIEW 1 — DASHBOARD
═══════════════════════════════════════════ */
interface DashProps {
  okrs: Objective[]; tarefas: Tarefa[]
  totalKrs: number; progOkrs: number
  feitasCount: number; emAndamento: number; bloqueadas: number; pctGeral: number
}
function DashboardView({ okrs, tarefas, totalKrs, progOkrs, feitasCount, emAndamento, bloqueadas, pctGeral }: DashProps) {
  const totalTarefas = tarefas.length
  const okrBarData   = okrs.map(o => ({
    name: o.titulo.length > 32 ? o.titulo.slice(0, 32) + '…' : o.titulo,
    fullName: o.titulo, value: objPct(o), color: catColor[o.categoria] ?? '#7B2FBE',
  }))
  const allKrs = okrs.flatMap(o => o.keyResults.map(kr => ({
    label: kr.descricao.length > 20 ? kr.descricao.slice(0, 20) + '…' : kr.descricao,
    fullLabel: kr.descricao, value: pct(kr.atual, kr.meta),
    atual: kr.atual, meta: kr.meta, unit: kr.unit,
    color: catColor[o.categoria] ?? '#7B2FBE',
  })))
  const statusData = [
    { name: 'Feita',        value: feitasCount, color: '#22C55E' },
    { name: 'Em andamento', value: emAndamento,  color: '#3B82F6' },
    { name: 'Pendente',     value: tarefas.filter(t => t.status === 'pendente').length, color: '#D1D5DB' },
    { name: 'Bloqueada',    value: bloqueadas,   color: '#EF4444' },
  ].filter(d => d.value > 0)
  const prioData = [
    { name: 'Alta',  value: tarefas.filter(t => t.prioridade === 'alta').length,  color: '#DC2626' },
    { name: 'Média', value: tarefas.filter(t => t.prioridade === 'media').length, color: '#D97706' },
    { name: 'Baixa', value: tarefas.filter(t => t.prioridade === 'baixa').length, color: '#16A34A' },
  ]
  const categoriasPresentes = Array.from(new Set(okrs.map(o => o.categoria)))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'OKRs ativos',        value: okrs.length,    color: '#111827' },
          { label: 'Resultados-chave',   value: totalKrs,       color: '#111827' },
          { label: 'Progresso OKRs',     value: `${progOkrs}%`, color: '#7B2FBE' },
          { label: 'Tarefas concluídas', value: `${feitasCount}/${totalTarefas}`, color: '#16A34A' },
        ].map(t => (
          <div key={t.label} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '14px 18px' }}>
            <p style={{ fontSize: 10, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{t.label}</p>
            <p style={{ fontSize: 26, fontWeight: 600, color: t.color, margin: '6px 0 0', fontVariantNumeric: 'tabular-nums' }}>{t.value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#111827', margin: 0 }}>Progresso dos Objetivos</p>
          <div style={{ display: 'flex', gap: 12 }}>
            {categoriasPresentes.map(cat => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 8, height: 8, background: catColor[cat], borderRadius: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: '#6B7280' }}>{cat}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={okrs.length * 44 + 16}>
          <BarChart data={okrBarData} layout="vertical" margin={{ top: 0, right: 48, left: 0, bottom: 0 }} barSize={16}>
            <CartesianGrid horizontal={false} stroke="#F3F4F6" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="name" width={200} tick={{ fontSize: 11, fill: '#374151' }} axisLine={false} tickLine={false} />
            <Tooltip content={<OkrTip />} cursor={{ fill: '#F9FAFB' }} />
            <Bar dataKey="value" radius={[0, 3, 3, 0]} label={{ position: 'right', fontSize: 11, fontWeight: 600, fill: '#6B7280', formatter: (v: number) => `${v}%` }}>
              {okrBarData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '16px 20px' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#111827', margin: '0 0 12px' }}>Status das Tarefas</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={36} outerRadius={55} dataKey="value" paddingAngle={2}>
                  {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip content={<StatusTip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              {statusData.map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: '#374151', flex: 1 }}>{s.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#111827', fontVariantNumeric: 'tabular-nums' }}>{s.value}</span>
                </div>
              ))}
              <div style={{ marginTop: 4, paddingTop: 8, borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: '#374151' }}>Conclusão</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#7B2FBE', fontVariantNumeric: 'tabular-nums' }}>{pctGeral}%</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '16px 20px' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#111827', margin: '0 0 12px' }}>Distribuição por Prioridade</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={prioData} margin={{ top: 0, right: 4, left: -24, bottom: 0 }} barSize={36}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<StatusTip />} cursor={{ fill: '#F9FAFB' }} />
              <Bar dataKey="value" radius={[3, 3, 0, 0]} label={{ position: 'top', fontSize: 11, fontWeight: 600, fill: '#374151' }}>
                {prioData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {allKrs.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '16px 20px' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#111827', margin: '0 0 12px' }}>Comparativo de Resultados-Chave</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={allKrs} margin={{ top: 4, right: 4, left: -24, bottom: 52 }} barSize={20}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} angle={-35} textAnchor="end" interval={0} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<KrTip />} cursor={{ fill: '#F9FAFB' }} />
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                {allKrs.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   VIEW 2 — KANBAN (back button + edit + add)
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
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [editDesc,  setEditDesc]    = useState('')
  const [addingCol, setAddingCol]   = useState<TarefaStatus | null>(null)
  const [addDesc,   setAddDesc]     = useState('')
  const [addKr,     setAddKr]       = useState('')

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

  const cols: { key: TarefaStatus; label: string; dot: string; border: string }[] = [
    { key: 'pendente',     label: 'Pendente',     dot: '#D1D5DB', border: '#E5E7EB' },
    { key: 'em_andamento', label: 'Em andamento', dot: '#3B82F6', border: '#BFDBFE' },
    { key: 'feita',        label: 'Feita',        dot: '#22C55E', border: '#BBF7D0' },
    { key: 'bloqueada',    label: 'Bloqueada',    dot: '#EF4444', border: '#FECACA' },
  ]
  const okrMap: Record<string, Objective> = {}
  okrs.forEach(o => { okrMap[o.id] = o })

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))', gap: 12, minWidth: 880 }}>
        {cols.map(col => {
          const cards = tarefas.filter(t => t.status === col.key)
          return (
            <div key={col.key} style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Column header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                background: '#fff', border: `1px solid ${col.border}`,
                borderRadius: '8px 8px 0 0', borderBottom: `2px solid ${col.dot}`,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.dot, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', flex: 1 }}>{col.label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', background: '#F3F4F6', padding: '1px 6px', borderRadius: 10, fontVariantNumeric: 'tabular-nums' }}>
                  {cards.length}
                </span>
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                {cards.length === 0 && addingCol !== col.key ? (
                  <div style={{ background: '#FAFAFA', border: '1px dashed #E5E7EB', borderTop: 'none', padding: '16px 12px', textAlign: 'center' }}>
                    <p style={{ fontSize: 11, color: '#D1D5DB', margin: 0 }}>Sem tarefas</p>
                  </div>
                ) : cards.map((tarefa, ci) => {
                  const okr = okrMap[tarefa.okrId]
                  const cor = catColor[okr?.categoria ?? ''] ?? '#7B2FBE'
                  const isEditing = editingId === tarefa.id
                  return (
                    <div key={tarefa.id} style={{
                      background: '#fff', border: '1px solid #E5E7EB', borderTop: 'none',
                      borderLeft: `3px solid ${cor}`, padding: '10px 12px',
                      borderRadius: ci === cards.length - 1 && addingCol !== col.key ? '0 0 0 0' : 0,
                    }}>
                      {isEditing ? (
                        <div style={{ marginBottom: 8 }}>
                          <textarea
                            autoFocus
                            value={editDesc}
                            onChange={e => setEditDesc(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit() } if (e.key === 'Escape') cancelEdit() }}
                            rows={3}
                            style={{ width: '100%', fontSize: 12, color: '#374151', resize: 'none', border: '1px solid #7B2FBE', borderRadius: 4, padding: '4px 6px', outline: 'none', lineHeight: 1.5, boxSizing: 'border-box' }}
                          />
                          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                            <button onClick={saveEdit} style={{ flex: 1, fontSize: 10, padding: '3px 0', background: '#7B2FBE', color: '#fff', border: 'none', borderRadius: 3, cursor: 'pointer', fontWeight: 600 }}>Salvar</button>
                            <button onClick={cancelEdit} style={{ fontSize: 10, padding: '3px 8px', background: '#F3F4F6', color: '#6B7280', border: 'none', borderRadius: 3, cursor: 'pointer' }}>Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <p
                          onDoubleClick={() => startEdit(tarefa.id, tarefa.descricao)}
                          title="Duplo clique para editar"
                          style={{
                            fontSize: 12, color: '#374151', lineHeight: 1.5, margin: '0 0 8px', cursor: 'text',
                            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          }}
                        >
                          {tarefa.descricao}
                        </p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
                          {okr && (
                            <span style={{ fontSize: 9, fontWeight: 600, color: cor, background: catBg[okr.categoria], padding: '1px 5px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>
                              {okr.categoria}
                            </span>
                          )}
                          <PrioridadeChip prioridade={tarefa.prioridade} onClick={() => onCyclePrioridade(tarefa.id)} />
                        </div>
                        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                          {/* Back */}
                          <button onClick={() => onCycleBack(tarefa.id)} title="Voltar status"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 4, border: '1px solid #E5E7EB', background: '#FAFAFA', color: '#9CA3AF', cursor: 'pointer' }}>
                            <ChevronLeft size={12} />
                          </button>
                          {/* Forward */}
                          <button onClick={() => onCycleStatus(tarefa.id)} title="Avançar status"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 4, border: '1px solid #E5E7EB', background: '#FAFAFA', color: '#9CA3AF', cursor: 'pointer' }}>
                            <ChevronRight size={12} />
                          </button>
                          {/* Delete */}
                          <button onClick={() => onDelete(tarefa.id)} title="Remover"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 4, border: '1px solid #E5E7EB', background: '#FAFAFA', color: '#9CA3AF', cursor: 'pointer' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}>
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Add task to column */}
              {addingCol === col.key ? (
                <div style={{ border: '1px dashed #7B2FBE', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '8px 10px', background: 'rgba(123,47,190,0.02)' }}>
                  <input
                    autoFocus
                    value={addDesc}
                    onChange={e => setAddDesc(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') { setAddingCol(null); setAddDesc(''); setAddKr('') } }}
                    placeholder="Descreva a tarefa..."
                    style={{ width: '100%', fontSize: 11, border: '1px solid #D1D5DB', borderRadius: 4, padding: '4px 8px', outline: 'none', marginBottom: 4, boxSizing: 'border-box' }}
                  />
                  <select
                    value={addKr}
                    onChange={e => setAddKr(e.target.value)}
                    style={{ width: '100%', fontSize: 10, border: '1px solid #D1D5DB', borderRadius: 4, padding: '3px 6px', marginBottom: 6, boxSizing: 'border-box' }}
                  >
                    <option value="">Resultado-Chave...</option>
                    {allKrOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={handleAdd} style={{ flex: 1, fontSize: 11, padding: '4px', background: '#7B2FBE', color: '#fff', border: 'none', borderRadius: 3, cursor: 'pointer', fontWeight: 600 }}>Adicionar</button>
                    <button onClick={() => { setAddingCol(null); setAddDesc(''); setAddKr('') }} style={{ fontSize: 11, padding: '4px 8px', background: '#F3F4F6', color: '#6B7280', border: 'none', borderRadius: 3, cursor: 'pointer' }}>✕</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setAddingCol(col.key); setAddDesc(''); setAddKr('') }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'transparent', border: '1px dashed #E5E7EB', borderTop: 'none', borderRadius: '0 0 8px 8px', cursor: 'pointer', fontSize: 11, color: '#D1D5DB', width: '100%' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.borderColor = '#D1D5DB' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#D1D5DB'; e.currentTarget.style.borderColor = '#E5E7EB' }}
                >
                  <Plus size={11} /> Adicionar tarefa
                </button>
              )}
            </div>
          )
        })}
      </div>
      <p style={{ fontSize: 10, color: '#D1D5DB', marginTop: 10, textAlign: 'center' }}>
        ← → para mover status · duplo clique na tarefa para editar · clique na prioridade para alterar
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════
   VIEW 3 — LISTA (com edição inline)
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {okrs.map(okr => {
        const okrTarefas = tarefas.filter(t => t.okrId === okr.id)
        const okrFeitas  = okrTarefas.filter(t => t.status === 'feita').length
        const cor        = catColor[okr.categoria] ?? '#7B2FBE'
        const isExpanded = expanded[okr.id] ?? true
        if (okr.keyResults.length === 0) return null

        return (
          <div key={okr.id} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
            <button
              onClick={() => onToggle(okr.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', background: '#FAFAFA', border: 'none', borderBottom: isExpanded ? '1px solid #F3F4F6' : 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ width: 3, height: 18, borderRadius: 2, background: cor, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{okr.titulo}</p>
                <p style={{ fontSize: 10, color: '#9CA3AF', margin: '2px 0 0' }}>
                  {okr.categoria} · {okr.trimestre}
                  {okrTarefas.length > 0 && <span style={{ marginLeft: 8, fontWeight: 500, color: cor }}>{okrFeitas}/{okrTarefas.length} tarefas</span>}
                </p>
              </div>
              {isExpanded ? <ChevronUp size={13} style={{ color: '#D1D5DB', flexShrink: 0 }} /> : <ChevronDown size={13} style={{ color: '#D1D5DB', flexShrink: 0 }} />}
            </button>

            {isExpanded && (
              <div>
                <div className="grid items-center px-5 py-2 bg-gray-50 border-b border-gray-100" style={{ gridTemplateColumns: '1fr 120px 80px 52px' }}>
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
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 20px', background: 'rgba(249,250,251,0.6)', borderBottom: '1px solid #F9FAFB' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: cor, opacity: 0.45, flexShrink: 0 }} />
                          <p style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', margin: 0, lineHeight: 1.4 }}>{kr.descricao}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                          {kr.meta > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ width: 48, height: 3, background: '#F3F4F6', borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${krPct}%`, background: cor, borderRadius: 2 }} />
                              </div>
                              <span style={{ fontSize: 10, color: '#9CA3AF', fontVariantNumeric: 'tabular-nums' }}>{kr.atual}/{kr.meta} {kr.unit}</span>
                            </div>
                          )}
                          {krTarefas.length > 0 && <span style={{ fontSize: 10, color: '#9CA3AF', fontVariantNumeric: 'tabular-nums' }}>{krFeitas}/{krTarefas.length}</span>}
                        </div>
                      </div>
                      {krTarefas.map(tarefa => (
                        editingId === tarefa.id ? (
                          <div key={tarefa.id} className="grid items-center px-5 py-2 border-b border-gray-50 bg-purple-50/20" style={{ gridTemplateColumns: '1fr 180px 52px' }}>
                            <input
                              autoFocus
                              value={editDesc}
                              onChange={e => setEditDesc(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
                              className="text-sm text-gray-700 bg-transparent focus:outline-none border-b border-purple-400 pr-4"
                            />
                            <div className="flex items-center gap-2">
                              <button onClick={saveEdit} className="text-xs font-semibold text-[#7B2FBE] hover:text-[#6a1fa8]">Salvar</button>
                              <button onClick={cancelEdit} className="text-gray-300 hover:text-gray-500"><X size={12} /></button>
                            </div>
                            <span />
                          </div>
                        ) : (
                          <div key={tarefa.id}
                            className={cn('group grid items-center px-5 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors', tarefa.status === 'feita' && 'opacity-60')}
                            style={{ gridTemplateColumns: '1fr 120px 80px 52px' }}>
                            <p
                              onDoubleClick={() => startEdit(tarefa.id, tarefa.descricao)}
                              title="Duplo clique para editar"
                              className={cn('text-sm leading-snug pr-4 cursor-text', tarefa.status === 'feita' ? 'text-gray-400 line-through' : 'text-gray-700')}
                            >
                              {tarefa.descricao}
                            </p>
                            <div><StatusChip status={tarefa.status} onClick={() => onCycleStatus(tarefa.id)} /></div>
                            <div><PrioridadeChip prioridade={tarefa.prioridade} onClick={() => onCyclePrioridade(tarefa.id)} /></div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                              <button onClick={() => onDelete(tarefa.id)} className="p-1 text-gray-300 hover:text-red-400 transition-all">
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        )
                      ))}
                      {addingTo === kr.id ? (
                        <div className="grid items-center px-5 py-2.5 border-t border-gray-50 bg-blue-50/30" style={{ gridTemplateColumns: '1fr 120px 80px 52px' }}>
                          <input autoFocus value={novaDesc} onChange={e => setNovaDesc(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') addTarefa(kr.id, okr.id); if (e.key === 'Escape') { setAddingTo(null); setNovaDesc('') } }}
                            placeholder="Descreva a tarefa e pressione Enter..."
                            className="text-sm text-gray-700 bg-transparent focus:outline-none placeholder:text-gray-300 pr-4" />
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => addTarefa(kr.id, okr.id)} className="text-xs font-semibold text-[#7B2FBE] hover:text-[#6a1fa8]">Salvar</button>
                            <button onClick={() => { setAddingTo(null); setNovaDesc('') }} className="text-gray-300 hover:text-gray-500"><X size={12} /></button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => { setAddingTo(kr.id); setNovaDesc('') }}
                          className="flex items-center gap-2 px-5 py-2.5 border-t border-gray-50 w-full text-left text-xs text-gray-400 hover:text-[#7B2FBE] hover:bg-gray-50/30 transition-all">
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
   VIEW 4 — FLUXOS DE TRABALHO
═══════════════════════════════════════════ */
interface FluxosProps {
  okrs: Objective[]
  appliedWorkflows: string[]
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Banner */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Zap size={16} style={{ color: '#7B2FBE', flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>Fluxos de Trabalho</p>
          <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0', lineHeight: 1.5 }}>
            Escolha um fluxo pré-construído, selecione o Resultado-Chave e aplique tarefas organizadas por fases diretamente no seu plano.
          </p>
        </div>
      </div>

      {/* Workflow grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
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
                border: isSelected ? `2px solid ${wf.cor}` : '1px solid #E5E7EB',
                background: isSelected ? `rgba(${hexToRgb(wf.cor)},0.03)` : '#fff',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 20 }}>{wf.emoji}</span>
                {wasApplied && (
                  <span style={{ fontSize: 9, fontWeight: 600, color: '#16A34A', background: '#F0FDF4', padding: '2px 6px', borderRadius: 10 }}>✓ Aplicado</span>
                )}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>{wf.nome}</p>
                <p style={{ fontSize: 11, color: '#6B7280', margin: '3px 0 0', lineHeight: 1.5 }}>{wf.descricao}</p>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {phases.map(fase => (
                  <span key={fase} style={{ fontSize: 9, fontWeight: 500, color: wf.cor, background: `rgba(${hexToRgb(wf.cor)},0.08)`, padding: '2px 6px', borderRadius: 3 }}>{fase}</span>
                ))}
              </div>
              <p style={{ fontSize: 10, color: '#9CA3AF', margin: 0 }}>{wf.tarefas.length} tarefas</p>
            </button>
          )
        })}
      </div>

      {/* Selected workflow detail */}
      {selectedWf && (
        <div style={{ background: '#fff', border: `1.5px solid ${selectedWf.cor}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>{selectedWf.emoji}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>{selectedWf.nome}</p>
              <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0' }}>{selectedWf.descricao}</p>
            </div>
            <button onClick={() => setSelected(null)} style={{ color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
              <X size={14} />
            </button>
          </div>

          {/* Tasks preview by phase */}
          <div style={{ padding: '12px 20px 0' }}>
            {Array.from(new Set(selectedWf.tarefas.map(t => t.fase))).map(fase => {
              const faseTarefas = selectedWf.tarefas.filter(t => t.fase === fase)
              return (
                <div key={fase} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: selectedWf.cor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{fase}</span>
                    <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
                  </div>
                  {faseTarefas.map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '4px 0 4px 8px' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: selectedWf.cor, flexShrink: 0, marginTop: 6 }} />
                      <p style={{ fontSize: 12, color: '#374151', margin: 0, lineHeight: 1.5, flex: 1 }}>{t.descricao}</p>
                      <span style={{ fontSize: 9, fontWeight: 600, flexShrink: 0, padding: '2px 5px', borderRadius: 3, background: prioridadeConfig[t.prioridade].bg, color: prioridadeConfig[t.prioridade].text }}>
                        {prioridadeConfig[t.prioridade].label}
                      </span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          {/* Apply section */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6', background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', flexShrink: 0 }}>Aplicar ao KR:</label>
            {allKrOptions.length === 0 ? (
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>Crie OKRs em Metas de Impacto para poder aplicar fluxos</span>
            ) : (
              <>
                <select
                  value={krTarget}
                  onChange={e => setKrTarget(e.target.value)}
                  style={{ flex: 1, fontSize: 11, color: '#374151', border: '1px solid #D1D5DB', borderRadius: 5, padding: '5px 8px', background: '#fff', outline: 'none' }}
                >
                  <option value="">Selecione um Resultado-Chave...</option>
                  {allKrOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <button
                  onClick={handleApply}
                  disabled={!krTarget}
                  style={{
                    padding: '6px 16px', borderRadius: 5, border: 'none', cursor: krTarget ? 'pointer' : 'default',
                    background: krTarget ? selectedWf.cor : '#E5E7EB',
                    color: krTarget ? '#fff' : '#9CA3AF',
                    fontSize: 12, fontWeight: 600, flexShrink: 0, transition: 'background 0.1s',
                  }}
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
   QUICK CARD
═══════════════════════════════════════════ */
interface QuickCardProps { href: string; color: string; Icon: typeof Briefcase; title: string; subtitle: string }
function QuickCard({ href, color, Icon, title, subtitle }: QuickCardProps) {
  return (
    <Link to={href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div
        style={{
          background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10,
          padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12,
          cursor: 'pointer', height: '100%', boxSizing: 'border-box', transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = color
          e.currentTarget.style.boxShadow = `0 4px 12px ${color}22`
          e.currentTarget.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#E5E7EB'
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.transform = 'none'
        }}
      >
        <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: '0 0 3px' }}>{title}</p>
          <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0, lineHeight: 1.5 }}>{subtitle}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color }}>Acessar</span>
          <ChevronRight size={12} style={{ color }} />
        </div>
      </div>
    </Link>
  )
}

/* ═══════════════════════════════════════════
   CHECKLIST GUIA
═══════════════════════════════════════════ */
interface ChecklistStepProps { done: boolean; label: string; href: string }
function ChecklistStep({ done, label, href }: ChecklistStepProps) {
  return (
    <Link to={href} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 7, transition: 'background 0.1s', cursor: done ? 'default' : 'pointer' }}
        onMouseEnter={e => { if (!done) e.currentTarget.style.background = '#F9FAFB' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
      >
        {done
          ? <CheckCircle2 size={16} style={{ color: '#22C55E', flexShrink: 0 }} />
          : <Circle size={16} style={{ color: '#D1D5DB', flexShrink: 0 }} />
        }
        <span style={{
          fontSize: 13, flex: 1, lineHeight: 1.4,
          color: done ? '#9CA3AF' : '#374151',
          textDecoration: done ? 'line-through' : 'none',
        }}>
          {label}
        </span>
        {!done && <ChevronRight size={12} style={{ color: '#D1D5DB', flexShrink: 0 }} />}
      </div>
    </Link>
  )
}

interface ChecklistGuiaProps {
  hasIdentidade: boolean; hasPilares: boolean; hasOkrs: boolean
  hasMarketing: boolean; hasKpis: boolean
}
function ChecklistGuia({ hasIdentidade, hasPilares, hasOkrs, hasMarketing, hasKpis }: ChecklistGuiaProps) {
  const steps = [
    { label: 'Definir identidade profissional',   done: hasIdentidade, href: '/dashboard/membro/posicionamento' },
    { label: 'Estruturar os pilares da marca',     done: hasPilares,    href: '/dashboard/membro/pilares'        },
    { label: 'Criar metas e OKRs',                done: hasOkrs,       href: '/dashboard/membro/okr'            },
    { label: 'Planejar ações de marketing anual', done: hasMarketing,  href: '/dashboard/membro/marketing'      },
    { label: 'Configurar indicadores-chave',      done: hasKpis,       href: '/dashboard/membro/kpis'           },
  ]
  const completedCount = steps.filter(s => s.done).length
  const pct = Math.round((completedCount / steps.length) * 100)

  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '20px 20px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>Sua Jornada de Configuração</p>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#7B2FBE' }}>{completedCount}/{steps.length}</span>
      </div>
      <div style={{ height: 5, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#7B2FBE', borderRadius: 3, transition: 'width 0.4s ease' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {steps.map((s, i) => <ChecklistStep key={i} done={s.done} label={s.label} href={s.href} />)}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   STATUS DA JORNADA (painel direito)
═══════════════════════════════════════════ */
interface StatusJornadaProps {
  okrs: Objective[]; tarefas: Tarefa[]; progOkrs: number
  feitasCount: number; totalTarefas: number; bloqueadas: number; emAndamento: number
}
function StatusJornada({ okrs, tarefas, progOkrs, feitasCount, totalTarefas, bloqueadas, emAndamento }: StatusJornadaProps) {
  const pctTarefas = totalTarefas > 0 ? Math.round((feitasCount / totalTarefas) * 100) : 0
  const pendentes  = tarefas.filter(t => t.status === 'pendente').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* OKR Progress */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '18px 20px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px' }}>Progresso OKRs</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: '#7B2FBE', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{progOkrs}%</span>
          <span style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{okrs.length} objetivo{okrs.length !== 1 ? 's' : ''}</span>
        </div>
        <div style={{ height: 6, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ height: '100%', width: `${progOkrs}%`, background: '#7B2FBE', borderRadius: 3, transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {okrs.slice(0, 3).map(o => (
            <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: catColor[o.categoria] ?? '#7B2FBE' }} />
              <span style={{ fontSize: 11, color: '#374151', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.titulo}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: catColor[o.categoria] ?? '#7B2FBE', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{objPct(o)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tarefas */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '18px 20px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>Tarefas</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Concluídas', value: feitasCount, color: '#22C55E', bg: '#F0FDF4' },
            { label: 'Em andamento', value: emAndamento, color: '#3B82F6', bg: '#EFF6FF' },
            { label: 'Pendentes', value: pendentes, color: '#9CA3AF', bg: '#F9FAFB' },
            { label: 'Bloqueadas', value: bloqueadas, color: '#EF4444', bg: '#FEF2F2' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 7, padding: '10px 12px' }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: s.color, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
              <p style={{ fontSize: 10, color: '#6B7280', margin: '2px 0 0', lineHeight: 1.3 }}>{s.label}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, height: 4, background: '#F3F4F6', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pctTarefas}%`, background: '#22C55E', borderRadius: 2, transition: 'width 0.4s ease' }} />
        </div>
        <p style={{ fontSize: 10, color: '#9CA3AF', margin: '6px 0 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{pctTarefas}% concluído</p>
      </div>

      {/* Acesso rápido */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '14px 16px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Acesso rápido</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {([
            { href: '/dashboard/membro/tarefas', label: 'Ver todas as tarefas', Icon: ClipboardList },
            { href: '/dashboard/membro/agenda',  label: 'Calendário e agenda',  Icon: Sliders        },
            { href: '/dashboard/membro/kpis',    label: 'Indicadores',          Icon: TrendingUp     },
          ] as { href: string; label: string; Icon: typeof ClipboardList }[]).map(item => (
            <Link key={item.href} to={item.href} style={{ textDecoration: 'none' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 6, transition: 'background 0.1s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <item.Icon size={13} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: '#374151', flex: 1 }}>{item.label}</span>
                <ChevronRight size={11} style={{ color: '#D1D5DB', flexShrink: 0 }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   PÁGINA PRINCIPAL
═══════════════════════════════════════════ */
function HomePage() {
  const { user } = useAuth()
  const firstName = user?.full_name?.split(' ')[0] ?? ''

  const [okrs,             setOkrs]             = useState<Objective[]>([])
  const [tarefas,          setTarefas]           = useState<Tarefa[]>([])
  const [expanded,         setExpanded]          = useState<Record<string, boolean>>({})
  const [addingTo,         setAddingTo]          = useState<string | null>(null)
  const [novaDesc,         setNovaDesc]          = useState('')
  const [view,             setView]              = useState<ViewMode>('dashboard')
  const [appliedWorkflows, setAppliedWorkflows]  = useState<string[]>([])

  /* completion flags for checklist */
  const [hasIdentidade, setHasIdentidade] = useState(false)
  const [hasMarketing,  setHasMarketing]  = useState(false)

  useEffect(() => {
    try { const s = localStorage.getItem(memberKey(OKR_KEY)); if (s) setOkrs(JSON.parse(s) ?? []) } catch {}
    try { setHasIdentidade(!!localStorage.getItem(memberKey('identidade_marca_v1'))) } catch {}
    try {
      const mRaw = localStorage.getItem(memberKey('marketing_store_v1'))
      const mArr = mRaw ? JSON.parse(mRaw) : []
      setHasMarketing(Array.isArray(mArr) && mArr.length > 0)
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
    if (tarefas.length > 0 || localStorage.getItem(memberKey(TAREFAS_KEY))) localStorage.setItem(memberKey(TAREFAS_KEY), JSON.stringify(tarefas))
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
  function updateDesc(id: string, desc: string) {
    setTarefas(prev => prev.map(t => t.id === id ? { ...t, descricao: desc } : t))
  }
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

  const totalKrs    = okrs.reduce((s, o) => s + o.keyResults.length, 0)
  const progOkrs    = okrs.length ? Math.round(okrs.reduce((s, o) => s + objPct(o), 0) / okrs.length) : 0
  const feitasCount = tarefas.filter(t => t.status === 'feita').length
  const emAndamento = tarefas.filter(t => t.status === 'em_andamento').length
  const bloqueadas  = tarefas.filter(t => t.status === 'bloqueada').length
  const pctGeral    = tarefas.length > 0 ? Math.round((feitasCount / tarefas.length) * 100) : 0
  const hoje        = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  const viewButtons: { key: ViewMode; label: string; Icon: typeof LayoutDashboard }[] = [
    { key: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { key: 'kanban',    label: 'Kanban',    Icon: Kanban          },
    { key: 'lista',     label: 'Lista',     Icon: LayoutList      },
    { key: 'fluxos',    label: 'Fluxos',    Icon: Zap             },
  ]

  const header = (
    <div style={{ paddingTop: 4, borderBottom: '2px solid #F0F0F0', paddingBottom: 24 }}>
      <p style={{ fontSize: 12, color: '#999999', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{hoje.charAt(0).toUpperCase() + hoje.slice(1)}</p>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>Olá, {firstName}</h1>
      <p style={{ fontSize: 18, color: '#666666', margin: '8px 0 0 0' }}>Bem-vindo ao seu hub de inteligência e estratégia.</p>
    </div>
  )

  if (okrs.length === 0) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 48px', display: 'flex', flexDirection: 'column', gap: 32, background: '#FFFFFF' }}>
        {header}
        {/* 2-col layout even without OKRs */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <QuickCard href="/dashboard/membro/posicionamento" color="#6600CC" Icon={Briefcase} title="Minha Identidade" subtitle="Posicionamento e essência" />
              <QuickCard href="/dashboard/membro/pilares"        color="#00C884" Icon={Target}   title="Pilares da Marca" subtitle="Frentes do seu negócio" />
              <QuickCard href="/dashboard/membro/okr"            color="#FF6600" Icon={Rocket}   title="Metas de Impacto" subtitle="Objetivos e resultados-chave" />
            </div>
            <ChecklistGuia
              hasIdentidade={hasIdentidade} hasPilares={false}
              hasOkrs={false} hasMarketing={hasMarketing} hasKpis={false}
            />
          </div>
          <div style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', borderRadius: 10, padding: '28px 24px', textAlign: 'center' }}>
            <ClipboardList size={28} style={{ color: '#D1D5DB', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Nenhum objetivo criado ainda</p>
            <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.6 }}>Vá até <strong>Metas de Impacto</strong> para criar seus primeiros OKRs.</p>
            <Link to="/dashboard/membro/okr" style={{ textDecoration: 'none' }}>
              <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#7B2FBE', color: '#fff', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                <Rocket size={13} /> Criar OKRs
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 48px', display: 'flex', flexDirection: 'column', gap: 32, background: '#FFFFFF' }}>
      {header}

      {/* ── 2-column hero ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left: quick cards + checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <QuickCard href="/dashboard/membro/posicionamento" color="#6600CC" Icon={Briefcase} title="Minha Identidade" subtitle="Posicionamento e essência" />
            <QuickCard href="/dashboard/membro/pilares"        color="#00C884" Icon={Target}   title="Pilares da Marca" subtitle="Frentes do seu negócio" />
            <QuickCard href="/dashboard/membro/okr"            color="#FF6600" Icon={Rocket}   title="Metas de Impacto" subtitle="Objetivos e resultados-chave" />
          </div>
          <ChecklistGuia
            hasIdentidade={hasIdentidade} hasPilares={false}
            hasOkrs={okrs.length > 0} hasMarketing={hasMarketing} hasKpis={false}
          />
        </div>

        {/* Right: status panel */}
        <StatusJornada
          okrs={okrs} tarefas={tarefas} progOkrs={progOkrs}
          feitasCount={feitasCount} totalTarefas={tarefas.length}
          bloqueadas={bloqueadas} emAndamento={emAndamento}
        />
      </div>

      {/* ── Plano de Ação ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>Meu Plano de Ação</h2>
          <div style={{ display: 'flex', background: '#F5F5F5', padding: 4, borderRadius: 8, border: '1px solid #E5E5E5', flexShrink: 0 }}>
            {viewButtons.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '8px 16px', border: 'none', cursor: 'pointer', borderRadius: 6,
                  background: view === key ? '#FFFFFF' : 'transparent',
                  color: view === key ? '#111827' : '#666666',
                  boxShadow: view === key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  fontSize: 13, fontWeight: view === key ? 600 : 400,
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ minHeight: 300 }}>
          {view === 'dashboard' && (
            <DashboardView
              okrs={okrs} tarefas={tarefas}
              totalKrs={totalKrs} progOkrs={progOkrs}
              feitasCount={feitasCount} emAndamento={emAndamento}
              bloqueadas={bloqueadas} pctGeral={pctGeral}
            />
          )}
          {view === 'kanban' && (
            <KanbanView
              okrs={okrs} tarefas={tarefas}
              onCycleStatus={cycleStatus}
              onCycleBack={cycleStatusBack}
              onCyclePrioridade={cyclePrioridade}
              onDelete={deleteTarefa}
              onUpdateDesc={updateDesc}
              onAddTask={addTarefaWithStatus}
            />
          )}
          {view === 'lista' && (
            <ListaView
              okrs={okrs} tarefas={tarefas}
              expanded={expanded}
              onToggle={id => setExpanded(p => ({ ...p, [id]: !p[id] }))}
              onCycleStatus={cycleStatus}
              onCyclePrioridade={cyclePrioridade}
              onDelete={deleteTarefa}
              onUpdateDesc={updateDesc}
              addingTo={addingTo} novaDesc={novaDesc}
              setNovaDesc={setNovaDesc} setAddingTo={setAddingTo}
              addTarefa={addTarefa}
            />
          )}
          {view === 'fluxos' && (
            <FluxosView
              okrs={okrs}
              appliedWorkflows={appliedWorkflows}
              onApply={applyWorkflow}
            />
          )}
        </div>
      </div>
    </div>
  )
}
