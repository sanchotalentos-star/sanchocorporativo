import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  ChevronDown, ChevronUp, Check, PenLine, MessageSquare,
  Target, Calendar, BarChart2, Sparkles, CheckCircle2,
  Plus, BookOpen, ClipboardList, TrendingUp,
  ChevronRight, Award, Zap, Layers,
} from 'lucide-react'
import { fadeInUp } from '@/lib/motion'
import { mockMembers } from '@/lib/mocks/members'
import { IDENTIDADE_KEY } from '@/lib/identidade'
import { cn } from '@/lib/utils'
import type { Member } from '@/types'

export const Route = createFileRoute('/dashboard/admin/membros')({
  component: MembrosPage,
})

const OKR_KEY            = 'okr_store_v1'
const MARKETING_KEY      = 'marketing_store_v1'
const MENTOR_CONTROLS_KEY = 'mentor_controls_v1'

type Fase     = 1 | 2 | 3 | 4
type TabId    = 'overview' | 'pilares' | 'identidade' | 'sessao'
type BlocoKey = 'publicoAlvo' | 'proposta' | 'storytelling' | 'formatoProduto' | 'diferencial'

interface BlocoState { construido: boolean; analise: string }

interface MenteeControls {
  fase:         Fase
  activeTab:    TabId
  sessionNotes: string
  newStepInput: string
  nextSteps:    { id: string; texto: string; done: boolean }[]
  identidade:   Record<BlocoKey, BlocoState>
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

interface OkrKr  { descricao: string; meta: number; atual: number; unidade: string }
interface OkrObj { id: string; titulo: string; categoria: string; krs?: OkrKr[] }
interface MktAcao { id: string; titulo: string; canal: string; frequencia: string; mes: number; concluida: boolean }

interface SugestaoPilar {
  id: string; cor: string; nome: string; descricao: string; acoes: string[]
}

function loadIdentidade(): IdentidadeStored | null {
  try { return JSON.parse(localStorage.getItem(IDENTIDADE_KEY) ?? 'null') } catch { return null }
}
function loadOkrs(): OkrObj[] {
  try { return JSON.parse(localStorage.getItem(OKR_KEY) ?? 'null') ?? [] } catch { return [] }
}
function loadMarketing(): MktAcao[] {
  try { return JSON.parse(localStorage.getItem(MARKETING_KEY) ?? 'null') ?? [] } catch { return [] }
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
  if (!id) return []
  const publicoAlvo    = id.pilares.publicoAlvo?.reflexao?.trim() ?? ''
  const proposta       = id.pilares.proposta?.reflexao?.trim() ?? ''
  const storytelling   = id.pilares.storytelling?.reflexao?.trim() ?? ''
  const formatoProduto = id.pilares.formatoProduto?.reflexao?.trim() ?? ''
  const diferenciais   = (id.diferenciais ?? []).filter(d => d.trim())
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

function makeDefault(): MenteeControls {
  return {
    fase: 1, activeTab: 'overview', sessionNotes: '', newStepInput: '',
    nextSteps: [],
    identidade: {
      publicoAlvo:    { construido: false, analise: '' },
      proposta:       { construido: false, analise: '' },
      storytelling:   { construido: false, analise: '' },
      formatoProduto: { construido: false, analise: '' },
      diferencial:    { construido: false, analise: '' },
    },
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
        <span className="text-[10px] font-bold text-gray-400 flex-shrink-0 tabular-nums">{kr.atual}/{kr.meta} {kr.unidade}</span>
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

  useEffect(() => {
    try { localStorage.setItem(MENTOR_CONTROLS_KEY, JSON.stringify(controls)) } catch {}
  }, [controls])

  const identidadeData = loadIdentidade()

  function getReflexao(memberId: string, key?: keyof IdentidadeStored['pilares']): string {
    if (memberId !== 'member-2' || !key || !identidadeData) return ''
    return identidadeData.pilares?.[key]?.reflexao?.trim() ?? ''
  }
  function getDiferenciais(memberId: string): string[] {
    if (memberId !== 'member-2' || !identidadeData) return []
    return (identidadeData.diferenciais ?? []).filter(d => d.trim())
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
    if (memberId !== 'member-2' || blocoId === 'diferencial') return
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
      if (memberId === 'member-2' && blocoId !== 'diferencial') {
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
          const okrs        = member.id === 'member-2' ? loadOkrs()      : []
          const marketing   = member.id === 'member-2' ? loadMarketing() : []
          const mktConcluidas = marketing.filter(a => a.concluida).length
          const sugestoes   = member.id === 'member-2' ? buildSugestoes(identidadeData) : []

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
                      <div className="flex border-b border-gray-200 bg-gray-50">
                        {([
                          { id: 'overview'   as TabId, label: 'Visão Geral',      Icon: BarChart2     },
                          { id: 'pilares'    as TabId, label: 'Pilares Sugeridos', Icon: Layers        },
                          { id: 'identidade' as TabId, label: 'Identidade',        Icon: BookOpen      },
                          { id: 'sessao'     as TabId, label: 'Sessão',            Icon: ClipboardList },
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
                                  {okrs.map(okr => (
                                    <div key={okr.id} className="px-4 py-3">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 flex-shrink-0" style={{ background: CATEGORIA_COLORS[okr.categoria] ?? '#7B2FBE' }} />
                                        <p className="text-xs font-bold text-gray-800 flex-1">{okr.titulo}</p>
                                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 flex-shrink-0"
                                          style={{ background: `${CATEGORIA_COLORS[okr.categoria] ?? '#7B2FBE'}18`, color: CATEGORIA_COLORS[okr.categoria] ?? '#7B2FBE' }}>
                                          {okr.categoria}
                                        </span>
                                      </div>
                                      {okr.krs && okr.krs.length > 0 && (
                                        <div className="space-y-2 pl-4 border-l-2 border-gray-100 ml-1">
                                          {okr.krs.map((kr, i) => <KrBar key={i} kr={kr} />)}
                                        </div>
                                      )}
                                    </div>
                                  ))}
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
                            ) : (
                              <>
                                <div className="bg-white border border-gray-200 px-4 py-3">
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                    {sugestoes.length} pilares gerados a partir das respostas do mentorado
                                  </p>
                                </div>
                                {sugestoes.map((s, idx) => (
                                  <div key={s.id} className="bg-white border border-gray-200 overflow-hidden">
                                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100" style={{ borderLeftWidth: 3, borderLeftColor: s.cor }}>
                                      <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: s.cor }}>
                                        {String(idx + 1).padStart(2, '0')}
                                      </span>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-gray-900">{s.nome}</p>
                                        <p className="text-[11px] text-gray-500 leading-snug mt-0.5">{s.descricao}</p>
                                      </div>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                      {s.acoes.map((acao, i) => (
                                        <div key={i} className="flex items-start gap-3 px-4 py-2.5">
                                          <span className="text-[9px] font-black text-gray-300 mt-0.5 flex-shrink-0 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                                          <p className="text-xs text-gray-700 leading-relaxed">{acao}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}
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
