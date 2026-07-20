import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  ChevronDown, ChevronUp, Check, PenLine, MessageSquare,
  Target, Calendar, BarChart2, Sparkles, CheckCircle2,
  Plus, BookOpen, ClipboardList, TrendingUp,
  ChevronRight, Award, Zap, Layers, Pencil, X, Trash2,
  Megaphone, AlertCircle, XCircle, Circle, Filter,
} from 'lucide-react'
import { fadeInUp } from '@/lib/motion'
import { mockMembers } from '@/lib/mocks/members'
import { IDENTIDADE_KEY } from '@/lib/identidade'
import { cn } from '@/lib/utils'
import { KpiTable } from '@/components/membro/KpiTable'
import type { Member, KpiEntry, KpiCategory } from '@/types'

export const Route = createFileRoute('/dashboard/admin/membros')({
  component: MembrosPage,
})

const OKR_KEY             = 'okr_store_v1'
const MARKETING_KEY       = 'marketing_store_v1'
const KPI_KEY             = 'kpis_store_v1'
const MENTOR_CONTROLS_KEY = 'mentor_controls_v1'

type Fase     = 1 | 2 | 3 | 4
type TabId    = 'overview' | 'identidade' | 'pilares' | 'okr' | 'marketing' | 'indicadores' | 'agenda' | 'sessao'
type BlocoKey = 'publicoAlvo' | 'proposta' | 'storytelling' | 'formatoProduto' | 'diferencial'

interface BlocoState { construido: boolean; analise: string }

interface MenteeControls {
  fase:          Fase
  activeTab:     TabId
  sessionNotes:  string
  newStepInput:  string
  nextSteps:     { id: string; texto: string; done: boolean }[]
  identidade:    Record<BlocoKey, BlocoState>
  pilaresCustom: SugestaoPilar[] | null
}

interface IdentidadeStored {
  pilares: {
    publicoAlvo?:    { reflexao?: string }
    proposta?:       { reflexao?: string }
    storytelling?:   { reflexao?: string }
    formatoProduto?: { reflexao?: string }
  }
  diferenciais?: string[]
}

interface OkrKr  { id: string; descricao: string; meta: number; atual: number; unit: string }
interface OkrObj { id: string; titulo: string; categoria: string; trimestre?: string; keyResults?: OkrKr[] }
interface MktAcao { id: string; titulo: string; canal: string; frequencia: string; mes: number; concluida: boolean }

interface SugestaoPilar {
  id: string; cor: string; nome: string; descricao: string; acoes: string[]
}

// Storage keys — member-3 (Vitor) keeps legacy generic keys for backward compat
function okrKeyFor(id: string)  { return id === 'member-3' ? OKR_KEY       : `${OKR_KEY}_${id}` }
function mktKeyFor(id: string)  { return id === 'member-3' ? MARKETING_KEY  : `${MARKETING_KEY}_${id}` }
function kpiKeyFor(id: string)  { return id === 'member-3' ? KPI_KEY        : `${KPI_KEY}_${id}` }
function idKeyFor(id: string)   { return id === 'member-3' ? IDENTIDADE_KEY : `${IDENTIDADE_KEY}_${id}` }

function loadIdentidadeFor(id: string): IdentidadeStored | null {
  try { return JSON.parse(localStorage.getItem(idKeyFor(id)) ?? 'null') } catch { return null }
}
function loadOkrsFor(id: string): OkrObj[] {
  try { return JSON.parse(localStorage.getItem(okrKeyFor(id)) ?? 'null') ?? [] } catch { return [] }
}
function loadMktFor(id: string): MktAcao[] {
  try { return JSON.parse(localStorage.getItem(mktKeyFor(id)) ?? 'null') ?? [] } catch { return [] }
}
function loadKpisFor(id: string): KpiEntry[] {
  try { return JSON.parse(localStorage.getItem(kpiKeyFor(id)) ?? 'null') ?? [] } catch { return [] }
}

const FASES: { num: Fase; label: string; desc: string }[] = [
  { num: 1, label: 'Identidade e MVP',   desc: 'Construindo identidade, posicionamento e produto mínimo'    },
  { num: 2, label: 'Primeiras Vitórias', desc: 'Primeiras vendas, provas sociais e validação do modelo'     },
  { num: 3, label: 'Plano em Ação',      desc: 'Executando com consistência e ajustando o que não funciona' },
  { num: 4, label: 'Escala',             desc: 'Amplificando o que funciona com sistemas e delegação'       },
]

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

const BLOCOS: {
  id: BlocoKey; num: string; label: string; placeholder: string
  reflexaoKey?: keyof IdentidadeStored['pilares']; cor: string; perguntas: string[]
}[] = [
  {
    id: 'publicoAlvo', num: '01', label: 'Para Quem Você Fala', cor: '#3B82F6',
    placeholder: 'Síntese sobre o cliente ideal: quem é, o que sente, o que busca...',
    reflexaoKey: 'publicoAlvo',
    perguntas: [
      'Você consegue nomear 3 características da pessoa que mais se transforma com o seu trabalho?',
      'Se fosse resumir esse público em uma frase, como seria?',
      'Quais são as maiores dores que essa pessoa carrega hoje?',
    ],
  },
  {
    id: 'proposta', num: '02', label: 'O Que Você Entrega de Diferente', cor: '#7B2FBE',
    placeholder: 'Síntese sobre a proposta: o resultado, o prazo e o diferenciador...',
    reflexaoKey: 'proposta',
    perguntas: [
      'Qual o resultado concreto e mensurável que você garante?',
      'Em quanto tempo essa transformação acontece na prática?',
      'O que o cliente tem DEPOIS de trabalhar com você que não tinha antes?',
    ],
  },
  {
    id: 'storytelling', num: '03', label: 'Sua História que Conecta', cor: '#F59E0B',
    placeholder: 'Síntese sobre a narrativa: o antes, o momento de virada e o depois...',
    reflexaoKey: 'storytelling',
    perguntas: [
      'Qual foi o momento exato de virada na sua trajetória?',
      'O que você tinha antes desse momento que o seu cliente ideal também tem hoje?',
      'Como essa experiência te capacitou a ajudar quem você ajuda hoje?',
    ],
  },
  {
    id: 'formatoProduto', num: '04', label: 'Como Você Chega ao Mercado', cor: '#10B981',
    placeholder: 'Síntese sobre o formato validado, precificação e canal de aquisição...',
    reflexaoKey: 'formatoProduto',
    perguntas: [
      'Esse formato está alinhado com o que o seu público prefere e pode pagar?',
      'O preço é coerente com a transformação que você entrega?',
      'Qual canal de aquisição faz mais sentido para esse produto e esse público?',
    ],
  },
  {
    id: 'diferencial', num: '05', label: 'O Que Te Destaca da Concorrência', cor: '#EC4899',
    placeholder: 'Síntese sobre os diferenciais mais fortes e mais difíceis de copiar...',
    perguntas: [
      'Qual desses diferenciais é mais difícil de copiar?',
      'Quais deles o mercado já percebe em você hoje?',
      'Como você provaria esse diferencial com evidências concretas?',
    ],
  },
]

const CATEGORIA_COLORS: Record<string, string> = {
  Autoridade: '#7B2FBE', Receita: '#10B981', Alcance: '#3B82F6', Produto: '#F59E0B',
}

function tag(text: string, max = 55) {
  return text.length <= max ? text : text.slice(0, max).trimEnd() + '...'
}

function buildSugestoes(id: IdentidadeStored | null): SugestaoPilar[] {
  const publicoAlvo    = id?.pilares.publicoAlvo?.reflexao?.trim() ?? ''
  const proposta       = id?.pilares.proposta?.reflexao?.trim() ?? ''
  const storytelling   = id?.pilares.storytelling?.reflexao?.trim() ?? ''
  const formatoProduto = id?.pilares.formatoProduto?.reflexao?.trim() ?? ''
  const diferenciais   = (id?.diferenciais ?? []).filter(d => d.trim())
  const diferencial    = diferenciais[0] ?? ''

  const list: (SugestaoPilar | null)[] = [
    publicoAlvo ? {
      id: 'presenca', cor: '#3B82F6', nome: 'Presença Direcionada',
      descricao: `Alcançar "${tag(publicoAlvo)}" nos canais e espaços onde essa pessoa já está`,
      acoes: [
        `Mapear os 3 principais canais, comunidades e eventos onde seu público está presente`,
        `Criar 2 conteúdos/semana que respondam as dúvidas reais de quem você descreveu como público`,
        `Participar ativamente de 1 grupo ou fórum frequentado pelo seu público-alvo`,
        `Fazer 3 conexões por semana com perfis que se encaixam no público que você descreveu`,
      ],
    } : null,

    proposta ? {
      id: 'autoridade', cor: '#7B2FBE', nome: 'Autoridade pela Entrega',
      descricao: `Tornar visível a transformação que você gera: "${tag(proposta)}"`,
      acoes: [
        `Documentar 1 caso real de cliente por mês, mostrando o antes e o depois da transformação`,
        `Criar série de conteúdo explicando o seu método e o processo por trás do que você entrega`,
        `Pedir depoimento em vídeo de 2 clientes que já viveram a transformação que você propõe`,
        `Produzir 1 conteúdo/mês mostrando os bastidores do seu processo de trabalho`,
      ],
    } : null,

    (storytelling || diferencial || proposta) ? {
      id: 'eventos', cor: '#EC4899', nome: 'Palco e Eventos',
      descricao: diferencial
        ? `Construir autoridade ao vivo posicionando: "${tag(diferencial)}" como ponto de vista único`
        : proposta ? `Falar publicamente sobre como você entrega: "${tag(proposta)}"` : 'Construir autoridade fora das redes',
      acoes: [
        publicoAlvo
          ? `Candidatar-se para falar em 1 evento por trimestre onde "${tag(publicoAlvo, 45)}" está presente`
          : `Candidatar-se para falar em 1 evento ou summit por trimestre no seu nicho`,
        `Propor participação em podcasts e lives como especialista convidado`,
        publicoAlvo
          ? `Propor co-criação ao vivo com 2 parceiros que atendem o mesmo público que você`
          : `Propor co-criação ao vivo com 2 parceiros estratégicos complementares`,
        storytelling
          ? `Estruturar sua história de virada como palestra-âncora de 20 minutos`
          : `Desenvolver uma palestra-âncora a partir do ponto de vista único que você tem`,
      ],
    } : null,

    diferencial ? {
      id: 'diferenciacao', cor: '#F59E0B', nome: 'Diferenciação Visível',
      descricao: `Tornar evidente para o mercado: "${tag(diferencial)}"`,
      acoes: [
        `Criar série de conteúdo mostrando sua abordagem versus o que o mercado costuma fazer`,
        `Publicar seu ponto de vista sobre "${tag(diferencial)}" — o que você faz diferente e por quê`,
        `Coletar e publicar provas concretas que validem seu diferencial (dados, resultados, depoimentos)`,
        `Criar 1 conteúdo/mês de comparativo mostrando como sua forma de trabalhar gera mais resultado`,
      ],
    } : null,

    formatoProduto ? {
      id: 'pipeline', cor: '#10B981', nome: 'Pipeline de Clientes',
      descricao: `Criar o caminho de atração e conversão para: "${tag(formatoProduto)}"`,
      acoes: [
        `Desenvolver 1 conteúdo gratuito de alto valor que naturalmente leva à sua oferta principal`,
        publicoAlvo
          ? `Construir lista de contatos do seu público-alvo para abordagem consultiva direta`
          : 'Construir lista de potenciais clientes para abordagem consultiva direta',
        `Identificar 3 parceiros estratégicos que atendem o mesmo público e podem indicar clientes`,
        formatoProduto
          ? `Criar processo de onboarding que valide a entrega prometida: "${tag(formatoProduto)}"`
          : 'Criar processo de onboarding que valide a entrega prometida ao cliente',
      ],
    } : null,
  ]
  return list.filter(Boolean) as SugestaoPilar[]
}

interface SugestaoOkr {
  id: string; titulo: string; categoria: string
  krs: { descricao: string; meta: number; unit: string }[]
}

function buildOkrSugestoes(id: IdentidadeStored | null): SugestaoOkr[] {
  const publicoAlvo    = id?.pilares.publicoAlvo?.reflexao?.trim() ?? ''
  const proposta       = id?.pilares.proposta?.reflexao?.trim() ?? ''
  const formatoProduto = id?.pilares.formatoProduto?.reflexao?.trim() ?? ''
  const diferencial    = (id?.diferenciais ?? [])[0]?.trim() ?? ''

  const t = (s: string, max = 55) => s.length <= max ? s : s.slice(0, max).trimEnd() + '...'

  const list: (SugestaoOkr | null)[] = [
    {
      id: 'autoridade',
      titulo: proposta ? `Ser reconhecido por: ${t(proposta)}` : 'Construir autoridade reconhecida no mercado',
      categoria: 'Autoridade',
      krs: [
        {
          descricao: publicoAlvo ? `Publicar conteúdo de alta qualidade direcionado a ${t(publicoAlvo, 50)}` : 'Publicar peças de conteúdo de alta qualidade no trimestre',
          meta: 12, unit: 'conteúdos',
        },
        { descricao: 'Crescer seguidores ou conexões qualificadas', meta: 20, unit: '%' },
        { descricao: 'Receber indicações ou convites de forma orgânica', meta: 5, unit: 'indicações' },
      ],
    },
    (publicoAlvo || proposta) ? {
      id: 'conversao',
      titulo: proposta ? `Converter: ${t(proposta)}` : 'Gerar conversões e receita com consistência',
      categoria: 'Receita',
      krs: [
        {
          descricao: publicoAlvo ? `Realizar conversas qualificadas com ${t(publicoAlvo, 40)}` : 'Realizar conversas qualificadas com potenciais clientes',
          meta: 10, unit: 'conversas',
        },
        { descricao: 'Fechar clientes ou projetos no trimestre', meta: 3, unit: 'clientes' },
        { descricao: 'Atingir meta de receita faturada', meta: 0, unit: 'R$' },
      ],
    } : null,
    diferencial ? {
      id: 'diferencial',
      titulo: `Ser referência por: ${t(diferencial)}`,
      categoria: 'Autoridade',
      krs: [
        { descricao: 'Menções ou compartilhamentos de conteúdo no trimestre', meta: 20, unit: 'menções' },
        { descricao: 'Depoimentos de clientes coletados e publicados', meta: 3, unit: 'depoimentos' },
        { descricao: 'Aparições em mídias externas (podcast, entrevista, artigo)', meta: 2, unit: 'aparições' },
      ],
    } : null,
    formatoProduto ? {
      id: 'produto',
      titulo: `Escalar: ${t(formatoProduto)}`,
      categoria: 'Produto',
      krs: [
        { descricao: 'Pessoas que conheceram seu formato de produto/serviço', meta: 50, unit: 'pessoas' },
        { descricao: 'Taxa de conversão de interessados em clientes', meta: 20, unit: '%' },
        { descricao: 'Ciclo médio de vendas reduzido para', meta: 14, unit: 'dias' },
      ],
    } : null,
  ]
  return list.filter(Boolean) as SugestaoOkr[]
}

function makeDefault(): MenteeControls {
  return {
    fase: 1, activeTab: 'overview' as TabId, sessionNotes: '', newStepInput: '',
    nextSteps: [],
    identidade: {
      publicoAlvo:    { construido: false, analise: '' },
      proposta:       { construido: false, analise: '' },
      storytelling:   { construido: false, analise: '' },
      formatoProduto: { construido: false, analise: '' },
      diferencial:    { construido: false, analise: '' },
    },
    pilaresCustom: null,
  }
}

function MiniChart({ data }: { data: { month: string; alcance: number }[] }) {
  const values = data.map(d => d.alcance)
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const w = 300, h = 56, pad = 6
  const pts = values.map((v, i) => ({
    x: pad + (i / Math.max(values.length - 1, 1)) * (w - pad * 2),
    y: h - pad - ((v - min) / range) * (h - pad * 2),
  }))
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L ${pts[pts.length-1].x.toFixed(1)} ${(h-pad).toFixed(1)} L ${pts[0].x.toFixed(1)} ${(h-pad).toFixed(1)} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-14" preserveAspectRatio="none">
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7B2FBE" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#7B2FBE" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#cg)" />
      <path d={line} fill="none" stroke="#7B2FBE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function KrBar({ kr }: { kr: OkrKr }) {
  const pct = kr.meta > 0 ? Math.min(Math.round((kr.atual / kr.meta) * 100), 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-gray-600 leading-snug flex-1">{kr.descricao}</p>
        <span className="text-[10px] font-bold text-gray-400 flex-shrink-0 tabular-nums">{kr.atual}/{kr.meta} {kr.unit}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-gray-100">
          <div className="h-full bg-[#7B2FBE] transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[10px] font-bold text-[#7B2FBE] w-8 text-right tabular-nums">{pct}%</span>
      </div>
    </div>
  )
}

/* ─── Label de seção reutilizável ─── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">{children}</p>
}

function MembrosPage() {
  const [controls, setControls] = useState<Record<string, MenteeControls>>(() => {
    try {
      const saved: Record<string, Partial<MenteeControls>> = JSON.parse(localStorage.getItem(MENTOR_CONTROLS_KEY) ?? 'null') ?? {}
      return Object.fromEntries(mockMembers.map(m => [m.id, { ...makeDefault(), ...saved[m.id] }]))
    } catch {
      return Object.fromEntries(mockMembers.map(m => [m.id, makeDefault()]))
    }
  })
  const [expanded, setExpanded] = useState<string | null>(null)

  // Per-member data maps (each member has isolated localStorage)
  const [okrMap, setOkrMap] = useState<Record<string, OkrObj[]>>(() =>
    Object.fromEntries(mockMembers.map(m => [m.id, loadOkrsFor(m.id)]))
  )
  const [mktMap, setMktMap] = useState<Record<string, MktAcao[]>>(() =>
    Object.fromEntries(mockMembers.map(m => [m.id, loadMktFor(m.id)]))
  )
  const [kpiMap, setKpiMap] = useState<Record<string, KpiEntry[]>>(() =>
    Object.fromEntries(mockMembers.map(m => [m.id, loadKpisFor(m.id)]))
  )

  function saveOkrs(mid: string, data: OkrObj[]) {
    setOkrMap(prev => ({ ...prev, [mid]: data }))
    try { localStorage.setItem(okrKeyFor(mid), JSON.stringify(data)) } catch {}
  }
  function saveMkt(mid: string, data: MktAcao[]) {
    setMktMap(prev => ({ ...prev, [mid]: data }))
    try { localStorage.setItem(mktKeyFor(mid), JSON.stringify(data)) } catch {}
  }
  function saveKpis(mid: string, data: KpiEntry[]) {
    setKpiMap(prev => ({ ...prev, [mid]: data }))
    try { localStorage.setItem(kpiKeyFor(mid), JSON.stringify(data)) } catch {}
  }

  // OKR KR editing state (includes memberId for multi-member support)
  const [editingKr, setEditingKr] = useState<{ memberId: string; okrId: string; krIdx: number } | null>(null)
  const [editKrVal, setEditKrVal] = useState('')

  // Marketing state
  const [showAddMkt, setShowAddMkt] = useState(false)
  const [mktNovaForm, setMktNovaForm] = useState({ titulo: '', canal: 'LinkedIn', frequencia: 'Mensal', mes: new Date().getMonth() + 1 })
  const [mktMesFiltro, setMktMesFiltro] = useState<number | null>(null)

  function addMktAcao(mid: string) {
    if (!mktNovaForm.titulo.trim()) return
    const nova: MktAcao = { id: Date.now().toString(), titulo: mktNovaForm.titulo.trim(), canal: mktNovaForm.canal, frequencia: mktNovaForm.frequencia, mes: mktNovaForm.mes, concluida: false }
    saveMkt(mid, [...(mktMap[mid] ?? []), nova])
    setMktNovaForm({ titulo: '', canal: 'LinkedIn', frequencia: 'Mensal', mes: new Date().getMonth() + 1 })
    setShowAddMkt(false)
    toast.success('Ação adicionada')
  }
  function toggleMktConcluida(mid: string, id: string) {
    saveMkt(mid, (mktMap[mid] ?? []).map(a => a.id === id ? { ...a, concluida: !a.concluida } : a))
  }
  function deleteMktAcao(mid: string, id: string) {
    saveMkt(mid, (mktMap[mid] ?? []).filter(a => a.id !== id))
    toast.success('Ação removida')
  }

  // KPI state
  const [showAddKpi, setShowAddKpi] = useState(false)
  const [kpiForm, setKpiForm] = useState({ kpi_name: '', category: 'Conteúdo' as KpiCategory, meta: '', unit: '' })

  function addKpi(mid: string) {
    const nome = kpiForm.kpi_name.trim()
    const meta = parseFloat(kpiForm.meta)
    if (!nome || isNaN(meta) || meta <= 0) return
    const entry: KpiEntry = { id: Date.now().toString(), user_id: mid, kpi_name: nome, category: kpiForm.category, meta, atual: 0, unit: kpiForm.unit.trim(), history: [0], updated_at: new Date().toISOString() }
    saveKpis(mid, [...(kpiMap[mid] ?? []), entry])
    setKpiForm({ kpi_name: '', category: 'Conteúdo', meta: '', unit: '' })
    setShowAddKpi(false)
    toast.success('Indicador adicionado')
  }
  function updateKpiAtual(mid: string, id: string, value: number) {
    saveKpis(mid, (kpiMap[mid] ?? []).map(k => k.id !== id ? k : { ...k, atual: value, history: [...k.history.slice(-5), value] }))
    toast.success('Indicador atualizado')
  }
  function deleteKpi(mid: string, id: string) {
    saveKpis(mid, (kpiMap[mid] ?? []).filter(k => k.id !== id))
    toast.success('Indicador removido')
  }

  // Pilar action editing
  const [editingAcao, setEditingAcao] = useState<{ memberId: string; pilarId: string; acaoIdx: number } | null>(null)
  const [editAcaoVal, setEditAcaoVal] = useState('')
  const [editingPilarField, setEditingPilarField] = useState<{ memberId: string; pilarId: string; field: 'nome' | 'descricao' } | null>(null)
  const [editPilarFieldVal, setEditPilarFieldVal] = useState('')

  function getActivePilares(memberId: string, sugestoes: SugestaoPilar[]): SugestaoPilar[] {
    const custom = controls[memberId]?.pilaresCustom
    return custom !== null && custom !== undefined ? custom : sugestoes
  }

  function initPilaresCustom(memberId: string, sugestoes: SugestaoPilar[]) {
    if (!controls[memberId]) return
    if (controls[memberId].pilaresCustom !== null) return
    setControls(prev => ({ ...prev, [memberId]: { ...prev[memberId], pilaresCustom: sugestoes.map(s => ({ ...s, acoes: [...s.acoes] })) } }))
  }

  function updPilarAcao(memberId: string, pilarId: string, acaoIdx: number, value: string) {
    setControls(prev => {
      const pilares = (prev[memberId].pilaresCustom ?? []).map(p =>
        p.id !== pilarId ? p : { ...p, acoes: p.acoes.map((a, i) => i === acaoIdx ? value : a) }
      )
      return { ...prev, [memberId]: { ...prev[memberId], pilaresCustom: pilares } }
    })
  }

  function addPilarAcao(memberId: string, pilarId: string) {
    setControls(prev => {
      const pilares = (prev[memberId].pilaresCustom ?? []).map(p =>
        p.id !== pilarId ? p : { ...p, acoes: [...p.acoes, ''] }
      )
      return { ...prev, [memberId]: { ...prev[memberId], pilaresCustom: pilares } }
    })
    // auto-focus new item after state update
    setTimeout(() => {
      const custom = controls[memberId]?.pilaresCustom
      const pilar = custom?.find(p => p.id === pilarId)
      if (pilar) {
        setEditingAcao({ memberId, pilarId, acaoIdx: pilar.acoes.length })
        setEditAcaoVal('')
      }
    }, 10)
  }

  function deletePilarAcao(memberId: string, pilarId: string, acaoIdx: number) {
    setControls(prev => {
      const pilares = (prev[memberId].pilaresCustom ?? []).map(p =>
        p.id !== pilarId ? p : { ...p, acoes: p.acoes.filter((_, i) => i !== acaoIdx) }
      )
      return { ...prev, [memberId]: { ...prev[memberId], pilaresCustom: pilares } }
    })
  }

  function updPilarField(memberId: string, pilarId: string, field: 'nome' | 'descricao', value: string) {
    setControls(prev => {
      const pilares = (prev[memberId].pilaresCustom ?? []).map(p =>
        p.id !== pilarId ? p : { ...p, [field]: value }
      )
      return { ...prev, [memberId]: { ...prev[memberId], pilaresCustom: pilares } }
    })
  }

  // OKR suggestions: track which were already added (per member)
  const [addedOkrIds, setAddedOkrIds] = useState<Record<string, Set<string>>>({})

  function addOkrFromSugestao(mid: string, s: SugestaoOkr) {
    const novoOkr: OkrObj = {
      id: `sug-${s.id}-${Date.now()}`,
      titulo: s.titulo,
      categoria: s.categoria,
      trimestre: 'Q3 2026',
      keyResults: s.krs.map((kr, i) => ({ id: `kr-${Date.now()}-${i}`, descricao: kr.descricao, meta: kr.meta, atual: 0, unit: kr.unit })),
    }
    saveOkrs(mid, [...(okrMap[mid] ?? []), novoOkr])
    setAddedOkrIds(prev => ({ ...prev, [mid]: new Set([...(prev[mid] ?? []), s.id]) }))
    toast.success('OKR adicionado à lista do mentorado')
  }

  function addKrToOkr(mid: string, okrId: string) {
    const novoKr: OkrKr = { id: `kr-${Date.now()}`, descricao: '', meta: 0, atual: 0, unit: '' }
    saveOkrs(mid, (okrMap[mid] ?? []).map(o => o.id !== okrId ? o : { ...o, keyResults: [...(o.keyResults ?? []), novoKr] }))
  }

  const [editingKrDesc, setEditingKrDesc] = useState<{ memberId: string; okrId: string; krIdx: number } | null>(null)
  const [editKrDescVal, setEditKrDescVal] = useState('')
  const [editingKrMeta, setEditingKrMeta] = useState<{ memberId: string; okrId: string; krIdx: number } | null>(null)
  const [editKrMetaVal, setEditKrMetaVal] = useState('')
  const [editKrUnitVal, setEditKrUnitVal] = useState('')

  function commitKrEdit() {
    if (!editingKr) return
    const { memberId } = editingKr
    const val = parseFloat(editKrVal)
    if (isNaN(val) || val < 0) { setEditingKr(null); return }
    saveOkrs(memberId, (okrMap[memberId] ?? []).map(o => {
      if (o.id !== editingKr.okrId) return o
      const keyResults = (o.keyResults ?? []).map((kr, i) => i === editingKr.krIdx ? { ...kr, atual: val } : kr)
      return { ...o, keyResults }
    }))
    setEditingKr(null)
    toast.success('KR atualizado')
  }

  function commitKrDescEdit() {
    if (!editingKrDesc) return
    const { memberId } = editingKrDesc
    saveOkrs(memberId, (okrMap[memberId] ?? []).map(o => {
      if (o.id !== editingKrDesc.okrId) return o
      return { ...o, keyResults: (o.keyResults ?? []).map((kr, i) => i === editingKrDesc.krIdx ? { ...kr, descricao: editKrDescVal } : kr) }
    }))
    setEditingKrDesc(null)
  }

  function commitKrMetaEdit() {
    if (!editingKrMeta) return
    const { memberId } = editingKrMeta
    const meta = parseFloat(editKrMetaVal)
    if (isNaN(meta) || meta < 0) { setEditingKrMeta(null); return }
    saveOkrs(memberId, (okrMap[memberId] ?? []).map(o => {
      if (o.id !== editingKrMeta.okrId) return o
      return { ...o, keyResults: (o.keyResults ?? []).map((kr, i) => i === editingKrMeta.krIdx ? { ...kr, meta, unit: editKrUnitVal || kr.unit } : kr) }
    }))
    setEditingKrMeta(null)
  }

  useEffect(() => {
    try { localStorage.setItem(MENTOR_CONTROLS_KEY, JSON.stringify(controls)) } catch {}
  }, [controls])

  function getIdentidade(memberId: string): IdentidadeStored | null {
    return loadIdentidadeFor(memberId)
  }
  function getReflexao(memberId: string, key?: keyof IdentidadeStored['pilares']): string {
    if (!key) return ''
    return getIdentidade(memberId)?.pilares?.[key]?.reflexao?.trim() ?? ''
  }
  function getDiferenciais(memberId: string): string[] {
    return (getIdentidade(memberId)?.diferenciais ?? []).filter(d => d.trim())
  }
  function getBlocoContent(member: Member, bloco: typeof BLOCOS[0]): string | string[] | null {
    if (bloco.id === 'diferencial') { const d = getDiferenciais(member.id); return d.length > 0 ? d : null }
    const r = getReflexao(member.id, bloco.reflexaoKey)
    return r.length > 0 ? r : null
  }
  function countFilled(memberId: string) {
    return BLOCOS.filter(b =>
      b.id === 'diferencial' ? getDiferenciais(memberId).length > 0 : getReflexao(memberId, b.reflexaoKey).length > 0
    ).length
  }
  function upd(memberId: string, patch: Partial<MenteeControls>) {
    setControls(prev => ({ ...prev, [memberId]: { ...prev[memberId], ...patch } }))
  }
  function updBloco(memberId: string, blocoId: BlocoKey, patch: Partial<BlocoState>) {
    setControls(prev => ({
      ...prev,
      [memberId]: { ...prev[memberId], identidade: { ...prev[memberId].identidade, [blocoId]: { ...prev[memberId].identidade[blocoId], ...patch } } },
    }))
  }

  function saveSintese(memberId: string, blocoId: BlocoKey, analise: string) {
    if (memberId !== 'member-3' || blocoId === 'diferencial') return
    try {
      const raw = localStorage.getItem(IDENTIDADE_KEY)
      if (!raw) return
      const stored = JSON.parse(raw)
      const pilarKey = blocoId as 'publicoAlvo' | 'proposta' | 'storytelling' | 'formatoProduto'
      stored.pilares[pilarKey] = {
        ...(stored.pilares[pilarKey] ?? {}),
        analise,
        analiseLocked: !analise.trim(),
        status: analise.trim() ? 'construido' : (stored.pilares[pilarKey]?.status ?? 'aguardando'),
      }
      localStorage.setItem(IDENTIDADE_KEY, JSON.stringify(stored))
    } catch {}
  }

  function toggleConstruido(memberId: string, blocoId: BlocoKey) {
    const current = controls[memberId].identidade[blocoId].construido
    updBloco(memberId, blocoId, { construido: !current })
    if (!current) {
      toast.success(`Bloco construído: ${BLOCOS.find(x => x.id === blocoId)?.label}`)
      if (memberId === 'member-3' && blocoId !== 'diferencial') {
        try {
          const raw = localStorage.getItem(IDENTIDADE_KEY)
          if (raw) {
            const stored = JSON.parse(raw)
            const pilarKey = blocoId as 'publicoAlvo' | 'proposta' | 'storytelling' | 'formatoProduto'
            stored.pilares[pilarKey] = { ...(stored.pilares[pilarKey] ?? {}), status: 'construido' }
            localStorage.setItem(IDENTIDADE_KEY, JSON.stringify(stored))
          }
        } catch {}
      }
    }
  }
  function addNextStep(memberId: string) {
    const texto = controls[memberId].newStepInput.trim()
    if (!texto) return
    upd(memberId, { newStepInput: '', nextSteps: [...controls[memberId].nextSteps, { id: Date.now().toString(), texto, done: false }] })
  }
  function toggleStep(memberId: string, stepId: string) {
    upd(memberId, { nextSteps: controls[memberId].nextSteps.map(s => s.id === stepId ? { ...s, done: !s.done } : s) })
  }

  return (
    <div className="space-y-6">

      <div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Programa</p>
        <h1 className="text-2xl font-black text-gray-900">Mentorados</h1>
        <p className="text-sm text-gray-500 mt-1">{mockMembers.length} participante{mockMembers.length !== 1 ? 's' : ''} ativo{mockMembers.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="space-y-px bg-gray-200">
        {mockMembers.map((member: Member) => {
          const ctrl        = controls[member.id]
          const isOpen      = expanded === member.id
          const filled      = countFilled(member.id)
          const constructed = Object.values(ctrl.identidade).filter(b => b.construido).length
          const faseInfo    = FASES.find(f => f.num === ctrl.fase)!
          const okrs        = okrMap[member.id] ?? []
          const marketing   = mktMap[member.id] ?? []
          const kpis        = kpiMap[member.id] ?? []
          const identidadeData = getIdentidade(member.id)
          const mktConcluidas = marketing.filter(a => a.concluida).length
          const sugestoes    = buildSugestoes(identidadeData)
          const okrSugestoes = buildOkrSugestoes(identidadeData)

          return (
            <motion.div key={member.id} variants={fadeInUp} initial="hidden" animate="visible" className="bg-white">

              {/* ── Row ── */}
              <button
                onClick={() => setExpanded(isOpen ? null : member.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50/70 transition-colors text-left"
              >
                <div className="w-9 h-9 bg-[#7B2FBE] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {member.full_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{member.full_name}</p>
                  <p className="text-[11px] text-gray-400">{member.email}</p>
                </div>
                <div className="hidden sm:flex items-center divide-x divide-gray-100 flex-shrink-0">
                  <div className="text-right pr-5">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Score</p>
                    <p className="text-sm font-black tabular-nums" style={{ color: member.score >= 70 ? '#10B981' : member.score >= 40 ? '#F59E0B' : '#EF4444' }}>
                      {member.score}/100
                    </p>
                  </div>
                  <div className="text-right px-5">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Fase</p>
                    <p className="text-[11px] font-bold text-gray-700">{ctrl.fase}. {faseInfo.label}</p>
                  </div>
                  <div className="text-right pl-5">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Identidade</p>
                    <p className="text-[11px] font-bold" style={{ color: filled > 0 ? '#7B2FBE' : '#9CA3AF' }}>
                      {filled}/5 · {constructed} construídos
                    </p>
                  </div>
                </div>
                {isOpen ? <ChevronUp size={15} className="text-gray-300 flex-shrink-0" /> : <ChevronDown size={15} className="text-gray-300 flex-shrink-0" />}
              </button>

              {/* Score bar */}
              <div className="h-0.5 bg-gray-100">
                <div className="h-full transition-all duration-500"
                  style={{ width: `${member.score}%`, background: member.score >= 70 ? '#10B981' : member.score >= 40 ? '#F59E0B' : '#EF4444' }} />
              </div>

              {/* ── Expanded ── */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100">

                      {/* Tab bar */}
                      <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
                        {([
                          { id: 'overview'    as TabId, label: 'Visão Geral',      Icon: BarChart2     },
                          { id: 'identidade'  as TabId, label: 'Identidade',        Icon: BookOpen      },
                          { id: 'pilares'     as TabId, label: 'Pilares',           Icon: Layers        },
                          { id: 'okr'         as TabId, label: 'OKRs',             Icon: Target        },
                          { id: 'marketing'   as TabId, label: 'Marketing',         Icon: Megaphone     },
                          { id: 'indicadores' as TabId, label: 'Indicadores',       Icon: TrendingUp    },
                          { id: 'agenda'      as TabId, label: 'Agenda',            Icon: Calendar      },
                          { id: 'sessao'      as TabId, label: 'Sessão',            Icon: ClipboardList },
                        ]).map(t => (
                          <button key={t.id}
                            onClick={() => upd(member.id, { activeTab: t.id })}
                            className={cn(
                              'flex items-center gap-1.5 px-4 py-3 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all',
                              ctrl.activeTab === t.id
                                ? 'border-[#7B2FBE] text-[#7B2FBE] bg-white'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                            )}
                          >
                            <t.Icon size={12} />
                            {t.label}
                          </button>
                        ))}
                      </div>

                      <div className="p-5 space-y-5 bg-[#F7F6FA]">

                        {/* ════ VISÃO GERAL ════ */}
                        {ctrl.activeTab === 'overview' && (
                          <div className="space-y-4">

                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-px bg-gray-200">
                              {[
                                { label: 'Score',   value: `${member.score}`, suffix: '/100', color: member.score >= 70 ? '#10B981' : member.score >= 40 ? '#F59E0B' : '#EF4444' },
                                { label: 'Leads',   value: `${member.leads}`,  color: '#10B981' },
                                { label: 'Alcance', value: member.alcance >= 1000 ? `${(member.alcance/1000).toFixed(1)}k` : `${member.alcance}`, color: '#3B82F6' },
                              ].map(s => (
                                <div key={s.label} className="bg-white px-4 py-3 text-center">
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                                  <p className="text-2xl font-black tabular-nums" style={{ color: s.color }}>
                                    {s.value}<span className="text-xs font-normal text-gray-400">{s.suffix ?? ''}</span>
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Fase stepper */}
                            <div className="bg-white border border-gray-200">
                              <div className="px-4 py-3 border-b border-gray-100">
                                <SectionLabel>Fase da Jornada</SectionLabel>
                              </div>
                              <div className="px-4 py-4">
                                <div className="relative">
                                  <div className="absolute top-4 left-6 right-6 h-px bg-gray-100" />
                                  <div className="grid grid-cols-4 gap-2 relative z-10">
                                    {FASES.map(fase => {
                                      const isActive = ctrl.fase === fase.num
                                      const isPast   = ctrl.fase > fase.num
                                      return (
                                        <button key={fase.num}
                                          onClick={() => { upd(member.id, { fase: fase.num }); toast.success(`Fase: ${fase.label}`) }}
                                          className="flex flex-col items-center gap-2"
                                        >
                                          <div className={cn(
                                            'w-8 h-8 flex items-center justify-center text-xs font-black border-2 bg-white transition-all',
                                            isActive ? 'bg-[#7B2FBE] border-[#7B2FBE] text-white' :
                                            isPast   ? 'bg-[#7B2FBE]/10 border-[#7B2FBE]/30 text-[#7B2FBE]' :
                                                       'border-gray-200 text-gray-400'
                                          )}>
                                            {isPast ? <Check size={12} /> : fase.num}
                                          </div>
                                          <p className={cn('text-[10px] font-bold text-center leading-tight uppercase tracking-wide', isActive ? 'text-[#7B2FBE]' : 'text-gray-400')}>
                                            {fase.label}
                                          </p>
                                        </button>
                                      )
                                    })}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-400 text-center mt-4">{faseInfo.desc}</p>
                              </div>
                            </div>

                            {/* Identidade resumo */}
                            <div className="bg-white border border-gray-200">
                              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                <SectionLabel>Identidade de Marca</SectionLabel>
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-[9px] font-bold text-[#7B2FBE] uppercase tracking-wider border border-[#7B2FBE]/30 px-2 py-0.5">{filled}/5 preenchidos</span>
                                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider border border-emerald-200 px-2 py-0.5">{constructed} construídos</span>
                                </div>
                              </div>

                              <div className="divide-y divide-gray-100">
                                {BLOCOS.map(bloco => {
                                  const bs      = ctrl.identidade[bloco.id]
                                  const content = getBlocoContent(member, bloco)
                                  const hasCont = content !== null && (Array.isArray(content) ? content.length > 0 : content.length > 0)
                                  const status  = bs.construido ? 'construido' : hasCont ? 'pronto' : 'aguardando'
                                  const dotColor = { aguardando: '#D1D5DB', pronto: '#D97706', construido: '#7B2FBE' }[status]

                                  return (
                                    <div key={bloco.id} className="px-4 py-3">
                                      <div className="flex items-start gap-3">
                                        <span className="text-[10px] font-black mt-0.5 flex-shrink-0" style={{ color: bloco.cor }}>{bloco.num}</span>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <p className="text-[11px] font-bold text-gray-800">{bloco.label}</p>
                                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
                                          </div>
                                          {hasCont ? (
                                            Array.isArray(content) ? (
                                              <div className="space-y-0.5">
                                                {(content as string[]).map((d, i) => (
                                                  <p key={i} className="text-xs text-gray-600 leading-relaxed">· {d}</p>
                                                ))}
                                              </div>
                                            ) : (
                                              <p className="text-xs text-gray-600 leading-relaxed">{content as string}</p>
                                            )
                                          ) : (
                                            <p className="text-xs text-gray-300 italic">Não preenchido ainda</p>
                                          )}
                                          {bs.analise.trim() && (
                                            <p className="text-[11px] text-[#7B2FBE] italic mt-1 border-t border-[#7B2FBE]/10 pt-1">
                                              Síntese: {bs.analise}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>

                              <div className="px-4 py-3 border-t border-gray-100">
                                <button
                                  onClick={() => upd(member.id, { activeTab: 'identidade' })}
                                  className="text-[10px] font-bold text-[#7B2FBE] uppercase tracking-wider flex items-center gap-1 hover:underline"
                                >
                                  Abrir para análise e construção <ChevronRight size={10} />
                                </button>
                              </div>
                            </div>

                            {/* OKRs */}
                            {okrs.length > 0 && (
                              <div className="bg-white border border-gray-200">
                                <div className="px-4 py-3 border-b border-gray-100">
                                  <SectionLabel>OKRs Definidos · {okrs.length} objetivo{okrs.length > 1 ? 's' : ''}</SectionLabel>
                                </div>
                                <div className="divide-y divide-gray-100">
                                  {okrs.map(okr => {
                                    const krs = okr.keyResults ?? []
                                    return (
                                    <div key={okr.id} className="px-4 py-3">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 flex-shrink-0" style={{ background: CATEGORIA_COLORS[okr.categoria] ?? '#7B2FBE' }} />
                                        <p className="text-xs font-bold text-gray-800 flex-1">{okr.titulo}</p>
                                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 flex-shrink-0"
                                          style={{ background: `${CATEGORIA_COLORS[okr.categoria] ?? '#7B2FBE'}18`, color: CATEGORIA_COLORS[okr.categoria] ?? '#7B2FBE' }}>
                                          {okr.categoria}
                                        </span>
                                      </div>
                                      {krs.length > 0 && (
                                        <div className="space-y-2 pl-4 border-l-2 border-gray-100 ml-1">
                                          {krs.map((kr, i) => <KrBar key={i} kr={kr} />)}
                                        </div>
                                      )}
                                    </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Marketing */}
                            {marketing.length > 0 && (
                              <div className="bg-white border border-gray-200">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                  <SectionLabel>Plano de Marketing Anual</SectionLabel>
                                  <div className="flex items-center gap-3 mb-3">
                                    <span className="text-[9px] font-black text-gray-900 tabular-nums">{mktConcluidas}/{marketing.length}</span>
                                    <div className="w-20 h-1 bg-gray-100">
                                      <div className="h-full bg-[#10B981] transition-all"
                                        style={{ width: `${Math.round((mktConcluidas/marketing.length)*100)}%` }} />
                                    </div>
                                    <span className="text-[9px] font-bold text-[#10B981] tabular-nums">{Math.round((mktConcluidas/marketing.length)*100)}%</span>
                                  </div>
                                </div>
                                <div className="divide-y divide-gray-100">
                                  {marketing.slice(0, 6).map(a => (
                                    <div key={a.id} className="flex items-center gap-3 px-4 py-2.5">
                                      <div className={cn('w-3 h-3 border flex items-center justify-center flex-shrink-0',
                                        a.concluida ? 'bg-[#10B981] border-[#10B981]' : 'border-gray-300'
                                      )}>
                                        {a.concluida && <Check size={7} className="text-white" />}
                                      </div>
                                      <p className={cn('flex-1 text-xs truncate', a.concluida ? 'line-through text-gray-400' : 'text-gray-700')}>{a.titulo}</p>
                                      <span className="text-[10px] text-gray-400 flex-shrink-0 tabular-nums">{a.canal} · {MESES[(a.mes ?? 1) - 1]}</span>
                                    </div>
                                  ))}
                                  {marketing.length > 6 && (
                                    <p className="text-[10px] text-gray-400 px-4 py-2">+ {marketing.length - 6} outras ações</p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Growth chart */}
                            {member.growth?.length > 0 && (
                              <div className="bg-white border border-gray-200">
                                <div className="px-4 py-3 border-b border-gray-100">
                                  <SectionLabel>Evolução de Alcance</SectionLabel>
                                </div>
                                <div className="px-4 py-3">
                                  <MiniChart data={member.growth} />
                                  <div className="flex justify-between mt-1">
                                    {member.growth.map(g => (
                                      <span key={g.month} className="text-[10px] text-gray-400 tabular-nums">
                                        {g.alcance >= 1000 ? `${(g.alcance/1000).toFixed(1)}k` : g.alcance}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                          </div>
                        )}

                        {/* ════ PILARES SUGERIDOS ════ */}
                        {ctrl.activeTab === 'pilares' && (
                          <div className="space-y-4">
                            {sugestoes.length === 0 ? (
                              <div className="bg-white border border-gray-200 px-5 py-10 text-center">
                                <Layers size={24} className="text-gray-200 mx-auto mb-3" />
                                <p className="text-sm font-bold text-gray-400">Nenhuma sugestão disponível</p>
                                <p className="text-xs text-gray-300 mt-1">O mentorado precisa preencher sua identidade para as sugestões aparecerem.</p>
                              </div>
                            ) : (() => {
                              // initialize custom pilares from auto-generated on first edit
                              const activePilares = getActivePilares(member.id, sugestoes)
                              return (
                                <>
                                  <div className="bg-white border border-gray-200 px-4 py-3 flex items-center justify-between">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                      {activePilares.length} pilares · clique em qualquer texto para editar
                                    </p>
                                    {ctrl.pilaresCustom !== null && (
                                      <button
                                        onClick={() => { setControls(prev => ({ ...prev, [member.id]: { ...prev[member.id], pilaresCustom: null } })); toast.success('Pilares restaurados') }}
                                        className="text-[9px] font-bold text-gray-400 uppercase tracking-wider hover:text-red-400 transition-colors"
                                      >
                                        Restaurar original
                                      </button>
                                    )}
                                  </div>
                                  {activePilares.map((s, idx) => {
                                    const isEditingNome = editingPilarField?.memberId === member.id && editingPilarField?.pilarId === s.id && editingPilarField?.field === 'nome'
                                    const isEditingDesc = editingPilarField?.memberId === member.id && editingPilarField?.pilarId === s.id && editingPilarField?.field === 'descricao'
                                    return (
                                      <div key={s.id} className="bg-white border border-gray-200 overflow-hidden">
                                        <div className="flex items-start gap-3 px-4 py-3 border-b border-gray-100" style={{ borderLeftWidth: 3, borderLeftColor: s.cor }}>
                                          <span className="text-[9px] font-black uppercase tracking-widest mt-0.5 flex-shrink-0" style={{ color: s.cor }}>
                                            {String(idx + 1).padStart(2, '0')}
                                          </span>
                                          <div className="flex-1 min-w-0 space-y-1">
                                            {isEditingNome ? (
                                              <input
                                                autoFocus
                                                value={editPilarFieldVal}
                                                onChange={e => setEditPilarFieldVal(e.target.value)}
                                                onBlur={() => { initPilaresCustom(member.id, sugestoes); updPilarField(member.id, s.id, 'nome', editPilarFieldVal); setEditingPilarField(null) }}
                                                onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') { initPilaresCustom(member.id, sugestoes); updPilarField(member.id, s.id, 'nome', editPilarFieldVal); setEditingPilarField(null) } }}
                                                className="w-full text-sm font-black text-gray-900 bg-[#7B2FBE]/5 border border-[#7B2FBE]/30 px-2 py-0.5 focus:outline-none"
                                              />
                                            ) : (
                                              <p
                                                className="text-sm font-black text-gray-900 cursor-text hover:bg-gray-50 px-1 -mx-1 transition-colors"
                                                onClick={() => { setEditingPilarField({ memberId: member.id, pilarId: s.id, field: 'nome' }); setEditPilarFieldVal(s.nome) }}
                                              >
                                                {s.nome}
                                              </p>
                                            )}
                                            {isEditingDesc ? (
                                              <input
                                                autoFocus
                                                value={editPilarFieldVal}
                                                onChange={e => setEditPilarFieldVal(e.target.value)}
                                                onBlur={() => { initPilaresCustom(member.id, sugestoes); updPilarField(member.id, s.id, 'descricao', editPilarFieldVal); setEditingPilarField(null) }}
                                                onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') { initPilaresCustom(member.id, sugestoes); updPilarField(member.id, s.id, 'descricao', editPilarFieldVal); setEditingPilarField(null) } }}
                                                className="w-full text-[11px] text-gray-500 bg-[#7B2FBE]/5 border border-[#7B2FBE]/30 px-2 py-0.5 focus:outline-none"
                                              />
                                            ) : (
                                              <p
                                                className="text-[11px] text-gray-500 leading-snug cursor-text hover:bg-gray-50 px-1 -mx-1 transition-colors"
                                                onClick={() => { setEditingPilarField({ memberId: member.id, pilarId: s.id, field: 'descricao' }); setEditPilarFieldVal(s.descricao) }}
                                              >
                                                {s.descricao}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                        <div className="divide-y divide-gray-100">
                                          {s.acoes.map((acao, i) => {
                                            const isEditingThis = editingAcao?.memberId === member.id && editingAcao?.pilarId === s.id && editingAcao?.acaoIdx === i
                                            return (
                                              <div key={i} className="flex items-start gap-3 px-4 py-2.5 group">
                                                <span className="text-[9px] font-black text-gray-300 mt-0.5 flex-shrink-0 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                                                {isEditingThis ? (
                                                  <div className="flex-1 flex items-start gap-1">
                                                    <textarea
                                                      autoFocus
                                                      value={editAcaoVal}
                                                      rows={2}
                                                      onChange={e => setEditAcaoVal(e.target.value)}
                                                      onBlur={() => { initPilaresCustom(member.id, sugestoes); updPilarAcao(member.id, s.id, i, editAcaoVal); setEditingAcao(null) }}
                                                      onKeyDown={e => { if (e.key === 'Escape') { initPilaresCustom(member.id, sugestoes); updPilarAcao(member.id, s.id, i, editAcaoVal); setEditingAcao(null) } }}
                                                      className="flex-1 text-xs text-gray-700 bg-[#7B2FBE]/5 border border-[#7B2FBE]/30 px-2 py-1 focus:outline-none resize-none"
                                                    />
                                                    <button onClick={() => { initPilaresCustom(member.id, sugestoes); updPilarAcao(member.id, s.id, i, editAcaoVal); setEditingAcao(null) }} className="p-0.5 text-emerald-500 mt-0.5 flex-shrink-0">
                                                      <Check size={12} />
                                                    </button>
                                                    <button onClick={() => { deletePilarAcao(member.id, s.id, i); setEditingAcao(null) }} className="p-0.5 text-red-400 mt-0.5 flex-shrink-0">
                                                      <Trash2 size={12} />
                                                    </button>
                                                  </div>
                                                ) : (
                                                  <>
                                                    <p
                                                      className="text-xs text-gray-700 leading-relaxed flex-1 cursor-text hover:text-gray-900"
                                                      onClick={() => { setEditingAcao({ memberId: member.id, pilarId: s.id, acaoIdx: i }); setEditAcaoVal(acao) }}
                                                    >
                                                      {acao || <span className="text-gray-300 italic">Clique para editar...</span>}
                                                    </p>
                                                    <button
                                                      onClick={() => { setEditingAcao({ memberId: member.id, pilarId: s.id, acaoIdx: i }); setEditAcaoVal(acao) }}
                                                      className="p-1 text-gray-200 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                    >
                                                      <Pencil size={10} />
                                                    </button>
                                                  </>
                                                )}
                                              </div>
                                            )
                                          })}
                                        </div>
                                        <div className="px-4 py-2 border-t border-gray-100">
                                          <button
                                            onClick={() => { initPilaresCustom(member.id, sugestoes); addPilarAcao(member.id, s.id) }}
                                            className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-[#7B2FBE] transition-colors"
                                          >
                                            <Plus size={10} /> Adicionar ação
                                          </button>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </>
                              )
                            })()}
                          </div>
                        )}

                        {/* ════ IDENTIDADE ════ */}
                        {ctrl.activeTab === 'identidade' && (
                          <div className="space-y-3">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                              {filled} de 5 blocos preenchidos · {constructed} construídos com mentor
                            </p>

                            {BLOCOS.map(bloco => {
                              const bs      = ctrl.identidade[bloco.id]
                              const content = getBlocoContent(member, bloco)
                              const hasCont = content !== null && (Array.isArray(content) ? content.length > 0 : content.length > 0)
                              const status  = bs.construido ? 'construido' : hasCont ? 'pronto' : 'aguardando'
                              const statusLabel = { aguardando: 'Aguardando', pronto: 'Pronto para sessão', construido: 'Construído' }[status]
                              const statusColor = { aguardando: '#9CA3AF', pronto: '#D97706', construido: '#7B2FBE' }[status]

                              return (
                                <div key={bloco.id} className="bg-white border border-gray-200 overflow-hidden" style={{ borderTopWidth: 2, borderTopColor: bloco.cor }}>
                                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                                    <span className="text-[10px] font-black" style={{ color: bloco.cor }}>{bloco.num}</span>
                                    <p className="text-sm font-bold text-gray-900 flex-1 min-w-0">{bloco.label}</p>
                                    <span className="text-[9px] font-bold uppercase tracking-wider flex-shrink-0" style={{ color: statusColor }}>
                                      {statusLabel}
                                    </span>
                                    <button
                                      onClick={() => toggleConstruido(member.id, bloco.id)}
                                      className={cn(
                                        'flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 transition-all flex-shrink-0',
                                        bs.construido ? 'bg-[#7B2FBE] text-white' : 'bg-gray-100 text-gray-500 hover:bg-[#7B2FBE]/10 hover:text-[#7B2FBE]'
                                      )}
                                    >
                                      {bs.construido ? <><Check size={10} /> Construído</> : 'Marcar construído'}
                                    </button>
                                  </div>

                                  <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-[9px] font-bold text-[#7B2FBE] uppercase tracking-widest mb-2">Resposta do mentorado</p>
                                    {hasCont ? (
                                      Array.isArray(content) ? (
                                        <div className="space-y-1.5 pl-3 border-l-2 border-gray-100">
                                          {(content as string[]).map((d, i) => (
                                            <p key={i} className="text-sm text-gray-700 leading-relaxed">{d}</p>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="pl-3 border-l-2 border-gray-100">
                                          <p className="text-sm text-gray-700 leading-relaxed">{content as string}</p>
                                        </div>
                                      )
                                    ) : (
                                      <p className="text-xs text-gray-300 italic">Mentorado ainda não preencheu este bloco.</p>
                                    )}
                                  </div>

                                  <div className="px-4 py-3">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Síntese do mentor</p>
                                    <textarea
                                      value={bs.analise}
                                      onChange={e => updBloco(member.id, bloco.id, { analise: e.target.value })}
                                      placeholder={bloco.placeholder}
                                      rows={3}
                                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] resize-none"
                                    />
                                    {bs.analise.trim() && (
                                      <button
                                        onClick={() => { saveSintese(member.id, bloco.id, bs.analise); toast.success('Síntese salva e visível ao mentorado') }}
                                        className="text-[10px] font-bold text-[#7B2FBE] uppercase tracking-wider hover:underline mt-1"
                                      >
                                        Salvar síntese →
                                      </button>
                                    )}
                                  </div>

                                  {/* Perguntas de aprofundamento */}
                                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Perguntas para a sessão</p>
                                    <div className="space-y-1.5">
                                      {bloco.perguntas.map((q, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                          <span className="text-[9px] font-black text-gray-300 mt-0.5 flex-shrink-0">{i + 1}.</span>
                                          <p className="text-[11px] text-gray-500 leading-relaxed">{q}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {/* ════ OKRs ════ */}
                        {ctrl.activeTab === 'okr' && (
                          <div className="space-y-4">

                            {/* Sugestões de OKR */}
                            {okrSugestoes.length > 0 && (
                              <div className="bg-white border border-gray-200 overflow-hidden">
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                                  <Sparkles size={12} className="text-[#7B2FBE]" />
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex-1">
                                    Sugestões de OKR · geradas da identidade do mentorado
                                  </p>
                                  <span className="text-[9px] font-bold text-[#7B2FBE] border border-[#7B2FBE]/30 px-2 py-0.5">
                                    {okrSugestoes.length} objetivos
                                  </span>
                                </div>
                                <div className="divide-y divide-gray-100">
                                  {okrSugestoes.map(s => {
                                    const added = (addedOkrIds[member.id] ?? new Set()).has(s.id) || okrs.some(o => o.id.startsWith(`sug-${s.id}-`))
                                    const cor = CATEGORIA_COLORS[s.categoria] ?? '#7B2FBE'
                                    return (
                                      <div key={s.id} className="px-4 py-3">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 mb-1">
                                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5"
                                                style={{ background: `${cor}15`, color: cor }}>
                                                {s.categoria}
                                              </span>
                                            </div>
                                            <p className="text-xs font-bold text-gray-800 leading-snug">{s.titulo}</p>
                                          </div>
                                          <button
                                            onClick={() => !added && addOkrFromSugestao(member.id, s)}
                                            disabled={added}
                                            className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 transition-all whitespace-nowrap"
                                            style={added
                                              ? { background: '#f3f4f6', color: '#9ca3af' }
                                              : { background: `${cor}15`, color: cor }
                                            }
                                          >
                                            {added ? 'Adicionado ✓' : '+ Usar objetivo'}
                                          </button>
                                        </div>
                                        <div className="space-y-1 pl-2 border-l-2 border-gray-100">
                                          {s.krs.map((kr, i) => (
                                            <div key={i} className="flex items-start gap-1.5">
                                              <Target size={9} className="text-gray-300 mt-0.5 flex-shrink-0" />
                                              <p className="text-[10px] text-gray-500 leading-snug">
                                                {kr.descricao}
                                                {kr.meta > 0 && <span className="font-bold ml-1" style={{ color: cor }}>→ meta: {kr.meta} {kr.unit}</span>}
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            {/* OKRs definidos */}
                            {okrs.length === 0 ? (
                              <div className="bg-white border border-gray-200 px-5 py-8 text-center">
                                <Target size={24} className="text-gray-200 mx-auto mb-3" />
                                <p className="text-sm font-bold text-gray-400">Nenhum OKR definido ainda</p>
                                <p className="text-xs text-gray-300 mt-1">Use as sugestões acima ou peça ao mentorado que preencha os OKRs.</p>
                              </div>
                            ) : (
                              <>
                                <div className="bg-white border border-gray-200 px-4 py-3">
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                    {okrs.length} objetivo{okrs.length > 1 ? 's' : ''} definido{okrs.length > 1 ? 's' : ''} · clique no valor atual para editar
                                  </p>
                                </div>
                                {okrs.map((okr, idx) => {
                                  const krsArr  = okr.keyResults ?? []
                                  const krsCount = krsArr.length
                                  const krsDone  = krsArr.filter(kr => kr.meta > 0 && kr.atual >= kr.meta).length
                                  const avgPct   = krsCount > 0
                                    ? Math.round(krsArr.reduce((sum, kr) => sum + (kr.meta > 0 ? Math.min((kr.atual / kr.meta) * 100, 100) : 0), 0) / krsCount)
                                    : 0
                                  const catColor = CATEGORIA_COLORS[okr.categoria] ?? '#7B2FBE'
                                  return (
                                    <div key={okr.id} className="bg-white border border-gray-200 overflow-hidden">
                                      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100" style={{ borderLeftWidth: 3, borderLeftColor: catColor }}>
                                        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: catColor }}>
                                          {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-black text-gray-900">{okr.titulo}</p>
                                          <p className="text-[10px] font-bold mt-0.5" style={{ color: catColor }}>{okr.categoria}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Progresso</p>
                                          <p className="text-sm font-black tabular-nums" style={{ color: avgPct >= 70 ? '#10B981' : avgPct >= 40 ? '#F59E0B' : '#EF4444' }}>
                                            {avgPct}%
                                          </p>
                                        </div>
                                      </div>
                                      <div className="divide-y divide-gray-100">
                                          {krsArr.map((kr, i) => {
                                            const isEditingAtual = editingKr?.okrId === okr.id && editingKr?.krIdx === i
                                            const isEditingDesc  = editingKrDesc?.okrId === okr.id && editingKrDesc?.krIdx === i
                                            const isEditingMeta  = editingKrMeta?.okrId === okr.id && editingKrMeta?.krIdx === i
                                            const pct = kr.meta > 0 ? Math.min(Math.round((kr.atual / kr.meta) * 100), 100) : 0
                                            const barColor = pct >= 70 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#EF4444'
                                            return (
                                              <div key={i} className="px-4 py-3 space-y-1.5 group">
                                                <div className="flex items-start gap-2">
                                                  {/* Descrição editável */}
                                                  {isEditingDesc ? (
                                                    <input
                                                      autoFocus
                                                      value={editKrDescVal}
                                                      onChange={e => setEditKrDescVal(e.target.value)}
                                                      onBlur={commitKrDescEdit}
                                                      onKeyDown={e => { if (e.key === 'Enter') commitKrDescEdit(); if (e.key === 'Escape') setEditingKrDesc(null) }}
                                                      className="flex-1 text-xs text-gray-700 bg-[#7B2FBE]/5 border border-[#7B2FBE]/30 px-2 py-1 focus:outline-none"
                                                      placeholder="Descrição do Key Result..."
                                                    />
                                                  ) : (
                                                    <p
                                                      className="flex-1 text-xs text-gray-700 leading-snug cursor-text hover:text-gray-900"
                                                      onClick={() => { setEditingKrDesc({ memberId: member.id, okrId: okr.id, krIdx: i }); setEditKrDescVal(kr.descricao) }}
                                                    >
                                                      {kr.descricao || <span className="text-gray-300 italic">Clique para descrever...</span>}
                                                    </p>
                                                  )}
                                                  {/* Valor atual editável */}
                                                  <div className="flex items-center gap-1 flex-shrink-0">
                                                    {isEditingAtual ? (
                                                      <>
                                                        <input
                                                          autoFocus
                                                          type="number"
                                                          value={editKrVal}
                                                          onChange={e => setEditKrVal(e.target.value)}
                                                          onKeyDown={e => { if (e.key === 'Enter') commitKrEdit(); if (e.key === 'Escape') setEditingKr(null) }}
                                                          className="w-14 text-right border border-[#7B2FBE] px-1.5 py-0.5 text-[11px] font-bold bg-white text-gray-900 focus:outline-none"
                                                        />
                                                        <button onClick={commitKrEdit} className="p-0.5 text-emerald-500"><Check size={11} /></button>
                                                        <button onClick={() => setEditingKr(null)} className="p-0.5 text-red-400"><X size={11} /></button>
                                                      </>
                                                    ) : (
                                                      <button
                                                        onClick={() => { setEditingKr({ memberId: member.id, okrId: okr.id, krIdx: i }); setEditKrVal(String(kr.atual)) }}
                                                        className="flex items-center gap-0.5 text-[10px] font-bold text-gray-400 hover:text-[#7B2FBE] tabular-nums"
                                                      >
                                                        <span>{kr.atual}/{kr.meta}{kr.unit ? ` ${kr.unit}` : ''}</span>
                                                        <Pencil size={9} className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                                                      </button>
                                                    )}
                                                  </div>
                                                </div>
                                                {/* Meta editável */}
                                                {isEditingMeta ? (
                                                  <div className="flex items-center gap-1.5 pl-0">
                                                    <span className="text-[10px] text-gray-400">Meta:</span>
                                                    <input
                                                      autoFocus
                                                      type="number"
                                                      value={editKrMetaVal}
                                                      onChange={e => setEditKrMetaVal(e.target.value)}
                                                      className="w-16 text-xs border border-gray-200 px-1.5 py-0.5 text-gray-800 focus:outline-none focus:border-[#7B2FBE]"
                                                    />
                                                    <input
                                                      value={editKrUnitVal}
                                                      onChange={e => setEditKrUnitVal(e.target.value)}
                                                      onKeyDown={e => { if (e.key === 'Enter') commitKrMetaEdit(); if (e.key === 'Escape') setEditingKrMeta(null) }}
                                                      placeholder="unidade"
                                                      className="w-20 text-xs border border-gray-200 px-1.5 py-0.5 text-gray-800 focus:outline-none focus:border-[#7B2FBE]"
                                                    />
                                                    <button onClick={commitKrMetaEdit} className="text-emerald-500"><Check size={12} /></button>
                                                    <button onClick={() => setEditingKrMeta(null)} className="text-gray-300"><X size={12} /></button>
                                                  </div>
                                                ) : (
                                                  <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1 bg-gray-100">
                                                      <div className="h-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
                                                    </div>
                                                    <span className="text-[10px] font-black w-8 text-right tabular-nums" style={{ color: barColor }}>{pct}%</span>
                                                    <button
                                                      onClick={() => { setEditingKrMeta({ memberId: member.id, okrId: okr.id, krIdx: i }); setEditKrMetaVal(String(kr.meta)); setEditKrUnitVal(kr.unit) }}
                                                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-gray-300 hover:text-gray-500"
                                                      title="Editar meta"
                                                    >
                                                      <Pencil size={9} />
                                                    </button>
                                                  </div>
                                                )}
                                              </div>
                                            )
                                          })}
                                        </div>
                                      <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between">
                                          {krsCount > 0 ? (
                                            <p className="text-[10px] text-gray-400">
                                              <span className="font-bold text-emerald-600">{krsDone}</span> de <span className="font-bold">{krsCount}</span> KRs atingidos
                                            </p>
                                          ) : (
                                            <span />
                                          )}
                                          <button
                                            onClick={() => addKrToOkr(member.id, okr.id)}
                                            className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-[#7B2FBE] transition-colors"
                                          >
                                            <Plus size={10} /> Adicionar KR
                                          </button>
                                        </div>
                                    </div>
                                  )
                                })}
                              </>
                            )}
                          </div>
                        )}

                        {/* ════ MARKETING ════ */}
                        {ctrl.activeTab === 'marketing' && (
                          <div className="space-y-4">

                            {/* Header + progresso */}
                            <div className="bg-white border border-gray-200 px-4 py-3 flex items-center gap-3">
                              <Megaphone size={14} className="text-[#7B2FBE] flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Agenda de Marketing Anual</p>
                                {marketing.length > 0 && (
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-gray-100">
                                      <div className="h-full bg-[#7B2FBE] transition-all"
                                        style={{ width: `${Math.round((marketing.filter(a => a.concluida).length / marketing.length) * 100)}%` }} />
                                    </div>
                                    <span className="text-[10px] font-bold text-[#7B2FBE] tabular-nums flex-shrink-0">
                                      {marketing.filter(a => a.concluida).length}/{marketing.length} ações
                                    </span>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => setShowAddMkt(v => !v)}
                                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 text-white flex-shrink-0"
                                style={{ background: '#7B2FBE' }}
                              >
                                <Plus size={10} /> Nova Ação
                              </button>
                            </div>

                            {/* Add form */}
                            {showAddMkt && (
                              <div className="bg-white border border-[#7B2FBE]/30 p-4 space-y-3">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Nova Ação de Marketing</p>
                                <input
                                  autoFocus
                                  type="text"
                                  value={mktNovaForm.titulo}
                                  onChange={e => setMktNovaForm(f => ({ ...f, titulo: e.target.value }))}
                                  onKeyDown={e => e.key === 'Enter' && addMktAcao(member.id)}
                                  placeholder="Título da ação..."
                                  className="w-full border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#7B2FBE]"
                                />
                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Canal</p>
                                    <select
                                      value={mktNovaForm.canal}
                                      onChange={e => setMktNovaForm(f => ({ ...f, canal: e.target.value }))}
                                      className="w-full border border-gray-200 px-2 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:border-[#7B2FBE]"
                                    >
                                      {['LinkedIn','Instagram','YouTube','Podcast','Email','Blog','Live','Evento Próprio','Evento Parceiro'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Frequência</p>
                                    <select
                                      value={mktNovaForm.frequencia}
                                      onChange={e => setMktNovaForm(f => ({ ...f, frequencia: e.target.value }))}
                                      className="w-full border border-gray-200 px-2 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:border-[#7B2FBE]"
                                    >
                                      {['Diário','Semanal','Quinzenal','Mensal','Trimestral','Anual'].map(f => <option key={f}>{f}</option>)}
                                    </select>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Mês</p>
                                    <select
                                      value={mktNovaForm.mes}
                                      onChange={e => setMktNovaForm(f => ({ ...f, mes: Number(e.target.value) }))}
                                      className="w-full border border-gray-200 px-2 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:border-[#7B2FBE]"
                                    >
                                      {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'].map((m, i) => <option key={m} value={i+1}>{m}</option>)}
                                    </select>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => setShowAddMkt(false)}
                                    className="flex-1 border border-gray-200 text-xs font-bold text-gray-500 py-2 uppercase tracking-wider hover:bg-gray-50">
                                    Cancelar
                                  </button>
                                  <button onClick={() => addMktAcao(member.id)} disabled={!mktNovaForm.titulo.trim()}
                                    className="flex-1 text-xs font-bold text-white py-2 uppercase tracking-wider disabled:opacity-40"
                                    style={{ background: '#7B2FBE' }}>
                                    Adicionar
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Filtro meses */}
                            {marketing.length > 0 && (
                              <div className="flex gap-1 overflow-x-auto pb-1">
                                <button onClick={() => setMktMesFiltro(null)}
                                  className={cn('flex-shrink-0 text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider transition-colors',
                                    mktMesFiltro === null ? 'bg-[#7B2FBE] text-white' : 'bg-gray-100 text-gray-400 hover:text-gray-700')}>
                                  Todos
                                </button>
                                {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'].map((m, i) => (
                                  <button key={m} onClick={() => setMktMesFiltro(mktMesFiltro === i+1 ? null : i+1)}
                                    className={cn('flex-shrink-0 text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider transition-colors',
                                      mktMesFiltro === i+1 ? 'bg-[#7B2FBE] text-white' : 'bg-gray-100 text-gray-400 hover:text-gray-700')}>
                                    {m}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Lista de ações */}
                            {marketing.length === 0 ? (
                              <div className="bg-white border border-gray-200 px-5 py-8 text-center">
                                <Megaphone size={24} className="text-gray-200 mx-auto mb-3" />
                                <p className="text-sm font-bold text-gray-400">Nenhuma ação de marketing cadastrada</p>
                                <p className="text-xs text-gray-300 mt-1">Clique em "Nova Ação" para adicionar ações ao plano anual do mentorado.</p>
                              </div>
                            ) : (
                              <div className="bg-white border border-gray-200 overflow-hidden">
                                <div className="divide-y divide-gray-100">
                                  {marketing
                                    .filter(a => mktMesFiltro === null || a.mes === mktMesFiltro)
                                    .map(acao => (
                                    <div key={acao.id} className="flex items-center gap-3 px-4 py-3 group hover:bg-gray-50 transition-colors">
                                      <button
                                        onClick={() => toggleMktConcluida(member.id, acao.id)}
                                        className="w-4 h-4 border-2 flex items-center justify-center flex-shrink-0 transition-all"
                                        style={{ borderColor: acao.concluida ? '#10B981' : '#7B2FBE', background: acao.concluida ? '#10B981' : 'transparent' }}
                                      >
                                        {acao.concluida && <Check size={9} className="text-white" />}
                                      </button>
                                      <div className="flex-1 min-w-0">
                                        <p className={cn('text-sm font-semibold leading-snug', acao.concluida ? 'line-through text-gray-300' : 'text-gray-800')}>
                                          {acao.titulo}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                          <span className="text-[10px] font-bold text-[#7B2FBE] uppercase tracking-wide">{acao.canal}</span>
                                          <span className="text-[10px] text-gray-300">·</span>
                                          <span className="text-[10px] text-gray-400">{acao.frequencia}</span>
                                          <span className="text-[10px] text-gray-300">·</span>
                                          <span className="text-[10px] text-gray-400">
                                            {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][acao.mes - 1]}
                                          </span>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => deleteMktAcao(member.id, acao.id)}
                                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all flex-shrink-0"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        )}

                        {/* ════ INDICADORES ════ */}
                        {ctrl.activeTab === 'indicadores' && (
                          <div className="space-y-4">

                            {/* Resumo status */}
                            {kpis.length > 0 && (() => {
                              const { getPercent, getStatusColor } = { getPercent: (a: number, m: number) => m > 0 ? Math.round((a / m) * 100) : 0, getStatusColor: (p: number) => p >= 70 ? 'green' : p >= 40 ? 'yellow' : 'red' }
                              const green  = kpis.filter(k => getStatusColor(getPercent(k.atual, k.meta)) === 'green').length
                              const yellow = kpis.filter(k => getStatusColor(getPercent(k.atual, k.meta)) === 'yellow').length
                              const red    = kpis.filter(k => getStatusColor(getPercent(k.atual, k.meta)) === 'red').length
                              return (
                                <div className="grid grid-cols-3 gap-px bg-gray-200">
                                  <div className="bg-white px-4 py-3 flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                                    <div>
                                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">No alvo</p>
                                      <p className="text-xl font-black text-emerald-500 tabular-nums">{green}</p>
                                    </div>
                                  </div>
                                  <div className="bg-white px-4 py-3 flex items-center gap-2">
                                    <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
                                    <div>
                                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Atenção</p>
                                      <p className="text-xl font-black text-amber-500 tabular-nums">{yellow}</p>
                                    </div>
                                  </div>
                                  <div className="bg-white px-4 py-3 flex items-center gap-2">
                                    <XCircle size={14} className="text-red-400 flex-shrink-0" />
                                    <div>
                                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Abaixo</p>
                                      <p className="text-xl font-black text-red-400 tabular-nums">{red}</p>
                                    </div>
                                  </div>
                                </div>
                              )
                            })()}

                            {/* Botão + form novo indicador */}
                            <div className="bg-white border border-gray-200 overflow-hidden">
                              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Indicadores de Resultado</p>
                                <button
                                  onClick={() => setShowAddKpi(v => !v)}
                                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 text-white flex-shrink-0"
                                  style={{ background: '#7B2FBE' }}
                                >
                                  <Plus size={10} /> Novo Indicador
                                </button>
                              </div>
                              {showAddKpi && (
                                <div className="p-4 border-b border-gray-100 bg-[#7B2FBE]/[0.02] space-y-3">
                                  <input
                                    autoFocus
                                    type="text"
                                    value={kpiForm.kpi_name}
                                    onChange={e => setKpiForm(f => ({ ...f, kpi_name: e.target.value }))}
                                    onKeyDown={e => e.key === 'Enter' && addKpi(member.id)}
                                    placeholder="Nome do indicador..."
                                    className="w-full border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#7B2FBE]"
                                  />
                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Categoria</p>
                                      <select value={kpiForm.category}
                                        onChange={e => setKpiForm(f => ({ ...f, category: e.target.value as KpiCategory }))}
                                        className="w-full border border-gray-200 px-2 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:border-[#7B2FBE]">
                                        {(['Conteúdo','Conversão','Autoridade','Mídia','Rede','Receita'] as KpiCategory[]).map(c => <option key={c}>{c}</option>)}
                                      </select>
                                    </div>
                                    <div>
                                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Meta</p>
                                      <input type="number" value={kpiForm.meta}
                                        onChange={e => setKpiForm(f => ({ ...f, meta: e.target.value }))}
                                        placeholder="Ex: 12"
                                        className="w-full border border-gray-200 px-2 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#7B2FBE]" />
                                    </div>
                                    <div>
                                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Unidade</p>
                                      <input type="text" value={kpiForm.unit}
                                        onChange={e => setKpiForm(f => ({ ...f, unit: e.target.value }))}
                                        placeholder="posts, leads..."
                                        className="w-full border border-gray-200 px-2 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#7B2FBE]" />
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button onClick={() => setShowAddKpi(false)}
                                      className="flex-1 border border-gray-200 text-xs font-bold text-gray-500 py-2 uppercase tracking-wider hover:bg-gray-50">Cancelar</button>
                                    <button onClick={() => addKpi(member.id)} disabled={!kpiForm.kpi_name.trim() || !kpiForm.meta}
                                      className="flex-1 text-xs font-bold text-white py-2 uppercase tracking-wider disabled:opacity-40"
                                      style={{ background: '#7B2FBE' }}>Adicionar</button>
                                  </div>
                                </div>
                              )}
                              {kpis.length === 0 ? (
                                <div className="px-5 py-8 text-center">
                                  <TrendingUp size={24} className="text-gray-200 mx-auto mb-3" />
                                  <p className="text-sm font-bold text-gray-400">Nenhum indicador cadastrado ainda</p>
                                  <p className="text-xs text-gray-300 mt-1">Adicione os KPIs que o mentorado deve acompanhar.</p>
                                </div>
                              ) : (
                                <KpiTable kpis={kpis} onUpdateAtual={(id, val) => updateKpiAtual(member.id, id, val)} onDelete={(id) => deleteKpi(member.id, id)} />
                              )}
                            </div>

                          </div>
                        )}

                        {/* ════ AGENDA ════ */}
                        {ctrl.activeTab === 'agenda' && (() => {
                          const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
                          type AgStatus = 'feito' | 'pendente' | 'bloqueado' | 'nao_feito'
                          interface AgItem { id: string; titulo: string; tipo: 'okr' | 'marketing'; semana?: number; mes?: number; status: AgStatus; canal?: string; objetivo?: string }
                          const okrItems: AgItem[] = (okrs as Array<OkrObj & { pdca?: { acoes?: Array<{ id: string; descricao: string; semana: number; status: AgStatus; dataLimite?: string }>; plano?: Array<{ id: string; entrega: string; dataLimite: string }> } }>)
                            .flatMap(obj => [
                              ...((obj.pdca?.acoes ?? []).map(a => ({ id: `okr-acao-${a.id}`, titulo: a.descricao || '(sem descrição)', tipo: 'okr' as const, semana: a.semana, status: a.status, objetivo: obj.titulo }))),
                              ...((obj.pdca?.plano ?? []).map(p => ({ id: `okr-plano-${p.id}`, titulo: p.entrega || '(sem descrição)', tipo: 'okr' as const, objetivo: obj.titulo, status: 'pendente' as AgStatus }))),
                            ])
                          const mktItems: AgItem[] = marketing.map(a => ({ id: `mkt-${a.id}`, titulo: a.titulo, tipo: 'marketing' as const, mes: a.mes, status: a.concluida ? 'feito' : 'pendente', canal: a.canal }))
                          const itens = [...okrItems, ...mktItems]
                          const feitos = itens.filter(i => i.status === 'feito').length
                          const pendentes = itens.filter(i => i.status === 'pendente').length

                          return (
                            <div className="space-y-4">

                              {/* Stats */}
                              <div className="grid grid-cols-4 gap-px bg-gray-200">
                                {[
                                  { label: 'OKR', value: okrItems.length, icon: Target, color: '#7B2FBE' },
                                  { label: 'Marketing', value: mktItems.length, icon: Megaphone, color: '#7B2FBE' },
                                  { label: 'Feito', value: feitos, icon: CheckCircle2, color: '#10B981' },
                                  { label: 'Pendente', value: pendentes, icon: Circle, color: '#9CA3AF' },
                                ].map(s => (
                                  <div key={s.label} className="bg-white px-3 py-3 flex items-center gap-2">
                                    <s.icon size={13} style={{ color: s.color }} className="flex-shrink-0" />
                                    <div>
                                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                                      <p className="text-xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {itens.length === 0 ? (
                                <div className="bg-white border border-gray-200 px-5 py-8 text-center">
                                  <Calendar size={24} className="text-gray-200 mx-auto mb-3" />
                                  <p className="text-sm font-bold text-gray-400">Agenda ainda vazia</p>
                                  <p className="text-xs text-gray-300 mt-1">As ações dos OKRs e do Marketing aparecem aqui automaticamente.</p>
                                </div>
                              ) : (
                                <>
                                  {/* OKRs por semana */}
                                  {okrItems.length > 0 && [1,2,3,4].map(sem => {
                                    const semItems = okrItems.filter(i => i.semana === sem)
                                    if (semItems.length === 0) return null
                                    return (
                                      <div key={sem} className="bg-white border border-gray-200 overflow-hidden">
                                        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                                          <Target size={12} className="text-[#7B2FBE]" />
                                          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest flex-1">Semana {sem} — OKRs</p>
                                          <span className="text-[10px] text-gray-400">{semItems.length} ações</span>
                                        </div>
                                        <div className="divide-y divide-gray-100">
                                          {semItems.map(item => (
                                            <div key={item.id} className="flex items-start gap-3 px-4 py-2.5">
                                              {item.status === 'feito'     ? <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" /> :
                                               item.status === 'bloqueado' ? <AlertCircle  size={13} className="text-amber-400 flex-shrink-0 mt-0.5"   /> :
                                               item.status === 'nao_feito' ? <XCircle      size={13} className="text-red-400 flex-shrink-0 mt-0.5"      /> :
                                                                             <Circle       size={13} className="text-gray-300 flex-shrink-0 mt-0.5"     />}
                                              <div className="flex-1 min-w-0">
                                                <p className={cn('text-xs leading-snug', item.status === 'feito' ? 'line-through text-gray-300' : 'text-gray-800')}>{item.titulo}</p>
                                                {item.objetivo && <p className="text-[10px] text-gray-400 mt-0.5 truncate">→ {item.objetivo}</p>}
                                              </div>
                                              <span className={cn('text-[9px] font-bold px-1.5 py-0.5 flex-shrink-0 uppercase tracking-wide',
                                                item.status === 'feito'     ? 'text-emerald-700 bg-emerald-50' :
                                                item.status === 'bloqueado' ? 'text-amber-700 bg-amber-50'     :
                                                item.status === 'nao_feito' ? 'text-red-600 bg-red-50'         :
                                                'text-gray-500 bg-gray-100')}>
                                                {item.status === 'feito' ? 'Feito' : item.status === 'bloqueado' ? 'Bloqueado' : item.status === 'nao_feito' ? 'Não feito' : 'Pendente'}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )
                                  })}

                                  {/* Marketing por mês */}
                                  {mktItems.length > 0 && meses.map((mes, idx) => {
                                    const mesItems = mktItems.filter(i => i.mes === idx + 1)
                                    if (mesItems.length === 0) return null
                                    return (
                                      <div key={mes} className="bg-white border border-gray-200 overflow-hidden">
                                        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                                          <Megaphone size={12} className="text-[#7B2FBE]" />
                                          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest flex-1">{mes} — Marketing</p>
                                          <span className="text-[10px] text-gray-400">{mesItems.length} ações</span>
                                        </div>
                                        <div className="divide-y divide-gray-100">
                                          {mesItems.map(item => (
                                            <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                                              {item.status === 'feito'
                                                ? <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                                                : <Circle       size={13} className="text-gray-300 flex-shrink-0"     />}
                                              <div className="flex-1 min-w-0">
                                                <p className={cn('text-xs leading-snug', item.status === 'feito' ? 'line-through text-gray-300' : 'text-gray-800')}>{item.titulo}</p>
                                                {item.canal && <p className="text-[10px] text-[#7B2FBE] mt-0.5 font-bold">{item.canal}</p>}
                                              </div>
                                              <span className={cn('text-[9px] font-bold px-1.5 py-0.5 flex-shrink-0 uppercase tracking-wide',
                                                item.status === 'feito' ? 'text-emerald-700 bg-emerald-50' : 'text-gray-500 bg-gray-100')}>
                                                {item.status === 'feito' ? 'Feito' : 'Pendente'}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </>
                              )}

                            </div>
                          )
                        })()}

                        {/* ════ SESSÃO ════ */}
                        {ctrl.activeTab === 'sessao' && (
                          <div className="space-y-4">

                            {/* Pauta sugerida */}
                            <div className="bg-white border border-gray-200">
                              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                                <Sparkles size={12} className="text-[#7B2FBE]" />
                                <SectionLabel>Pauta Sugerida para Próxima Sessão</SectionLabel>
                              </div>
                              <div className="p-4 space-y-2">
                                {BLOCOS.filter(b => {
                                  const c = getBlocoContent(member, b)
                                  return c !== null && (Array.isArray(c) ? c.length > 0 : c.length > 0) && !ctrl.identidade[b.id].construido
                                }).map(bloco => (
                                  <div key={bloco.id} className="border-l-2 pl-3 py-2" style={{ borderColor: bloco.cor }}>
                                    <p className="text-xs font-bold text-gray-800 mb-1">{bloco.num} · {bloco.label}</p>
                                    <div className="space-y-1">
                                      {bloco.perguntas.map((q, i) => (
                                        <p key={i} className="text-[11px] text-gray-500 leading-relaxed">→ {q}</p>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                                {okrs.length > 0 && (
                                  <div className="flex items-center gap-3 px-3 py-2 border-l-2 border-[#7B2FBE]">
                                    <Target size={12} className="text-[#7B2FBE] flex-shrink-0" />
                                    <p className="text-xs text-gray-700">Revisar progresso dos <strong>{okrs.length} OKRs</strong> definidos</p>
                                  </div>
                                )}
                                {marketing.length > 0 && (
                                  <div className="flex items-center gap-3 px-3 py-2 border-l-2 border-[#7B2FBE]">
                                    <Calendar size={12} className="text-[#7B2FBE] flex-shrink-0" />
                                    <p className="text-xs text-gray-700">Revisar <strong>{marketing.length} ações</strong> do plano de marketing</p>
                                  </div>
                                )}
                                {BLOCOS.every(b => ctrl.identidade[b.id].construido) && (
                                  <div className="flex items-center gap-2 px-3 py-2 border-l-2 border-emerald-400">
                                    <CheckCircle2 size={12} className="text-emerald-500" />
                                    <p className="text-xs text-emerald-700 font-semibold">Todos os blocos de identidade foram construídos.</p>
                                  </div>
                                )}
                                {BLOCOS.filter(b => {
                                  const c = getBlocoContent(member, b)
                                  return c !== null && (Array.isArray(c) ? c.length > 0 : c.length > 0) && !ctrl.identidade[b.id].construido
                                }).length === 0 && okrs.length === 0 && marketing.length === 0 && !BLOCOS.every(b => ctrl.identidade[b.id].construido) && (
                                  <p className="text-xs text-gray-400 text-center py-3 italic">Nenhum ponto pendente para esta sessão.</p>
                                )}
                              </div>
                            </div>

                            {/* Notas da sessão */}
                            <div className="bg-white border border-gray-200">
                              <div className="px-4 py-3 border-b border-gray-100">
                                <SectionLabel>Notas da Sessão</SectionLabel>
                              </div>
                              <div className="p-4">
                                <textarea
                                  value={ctrl.sessionNotes}
                                  onChange={e => upd(member.id, { sessionNotes: e.target.value })}
                                  placeholder="Anote os principais pontos da sessão de hoje..."
                                  rows={5}
                                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] resize-none"
                                />
                                <p className="text-[9px] text-gray-400 mt-1">Salvo automaticamente</p>
                              </div>
                            </div>

                            {/* Próximos passos */}
                            <div className="bg-white border border-gray-200">
                              <div className="px-4 py-3 border-b border-gray-100">
                                <SectionLabel>Próximos Passos</SectionLabel>
                              </div>
                              <div className="p-4 space-y-2 mb-2">
                                {ctrl.nextSteps.length === 0 && (
                                  <p className="text-xs text-gray-300 italic">Nenhum próximo passo definido ainda.</p>
                                )}
                                {ctrl.nextSteps.map(step => (
                                  <div key={step.id} className="flex items-center gap-3">
                                    <button onClick={() => toggleStep(member.id, step.id)}
                                      className={cn('w-4 h-4 border-2 flex items-center justify-center flex-shrink-0 transition-all',
                                        step.done ? 'bg-[#7B2FBE] border-[#7B2FBE]' : 'border-gray-300'
                                      )}>
                                      {step.done && <Check size={9} className="text-white" />}
                                    </button>
                                    <p className={cn('text-sm flex-1', step.done ? 'line-through text-gray-300' : 'text-gray-700')}>{step.texto}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="px-4 pb-4 flex gap-2">
                                <input
                                  type="text"
                                  value={ctrl.newStepInput}
                                  onChange={e => upd(member.id, { newStepInput: e.target.value })}
                                  onKeyDown={e => e.key === 'Enter' && addNextStep(member.id)}
                                  placeholder="Adicionar próximo passo..."
                                  className="flex-1 bg-gray-50 border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] transition-colors"
                                />
                                <button onClick={() => addNextStep(member.id)}
                                  className="w-9 h-9 bg-[#7B2FBE] flex items-center justify-center text-white hover:bg-[#6a27a5] transition-colors flex-shrink-0">
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>

                          </div>
                        )}

                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
