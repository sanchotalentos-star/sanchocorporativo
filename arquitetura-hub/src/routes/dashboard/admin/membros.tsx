import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  ChevronDown, ChevronUp, Check, PenLine, MessageSquare,
  Target, Calendar, BarChart2, Sparkles, CheckCircle2,
  Plus, BookOpen, ClipboardList, TrendingUp, Circle,
  ChevronRight, Award, Zap,
} from 'lucide-react'
import { fadeInUp } from '@/lib/motion'
import { mockMembers } from '@/lib/mocks/members'
import { IDENTIDADE_KEY } from '@/lib/identidade'
import { cn } from '@/lib/utils'
import type { Member } from '@/types'

export const Route = createFileRoute('/dashboard/admin/membros')({
  component: MembrosPage,
})

const OKR_KEY       = 'okr_store_v1'
const MARKETING_KEY = 'marketing_store_v1'

type Fase     = 1 | 2 | 3 | 4
type TabId    = 'overview' | 'identidade' | 'sessao'
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

interface OkrKr { descricao: string; meta: number; atual: number; unidade: string }
interface OkrObj { id: string; titulo: string; categoria: string; krs?: OkrKr[] }
interface MktAcao { id: string; titulo: string; canal: string; frequencia: string; mes: number; concluida: boolean }

function loadIdentidade(): IdentidadeStored | null {
  try { return JSON.parse(localStorage.getItem(IDENTIDADE_KEY) ?? 'null') }
  catch { return null }
}
function loadOkrs(): OkrObj[] {
  try { return JSON.parse(localStorage.getItem(OKR_KEY) ?? 'null') ?? [] }
  catch { return [] }
}
function loadMarketing(): MktAcao[] {
  try { return JSON.parse(localStorage.getItem(MARKETING_KEY) ?? 'null') ?? [] }
  catch { return [] }
}

const FASES: { num: Fase; label: string; desc: string }[] = [
  { num: 1, label: 'Identidade e MVP',   desc: 'Construindo identidade, posicionamento e produto mínimo'    },
  { num: 2, label: 'Primeiras Vitórias', desc: 'Primeiras vendas, provas sociais e validação do modelo'     },
  { num: 3, label: 'Plano em Ação',      desc: 'Executando com consistência e ajustando o que não funciona' },
  { num: 4, label: 'Escala',             desc: 'Amplificando o que funciona com sistemas e delegação'       },
]

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

const BLOCOS: {
  id:          BlocoKey
  num:         string
  label:       string
  placeholder: string
  reflexaoKey?: keyof IdentidadeStored['pilares']
  cor:         string
  perguntas:   string[]
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
  Autoridade: '#7B2FBE',
  Receita:    '#10B981',
  Alcance:    '#3B82F6',
  Produto:    '#F59E0B',
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
  const w = 300, h = 60, pad = 8

  const pts = values.map((v, i) => ({
    x: pad + (i / Math.max(values.length - 1, 1)) * (w - pad * 2),
    y: h - pad - ((v - min) / range) * (h - pad * 2),
  }))

  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L ${pts[pts.length - 1].x.toFixed(1)} ${(h - pad).toFixed(1)} L ${pts[0].x.toFixed(1)} ${(h - pad).toFixed(1)} Z`

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7B2FBE" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#7B2FBE" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#cg)" />
        <path d={line} fill="none" stroke="#7B2FBE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#7B2FBE" />)}
      </svg>
      <div className="flex justify-between mt-1">
        {data.map(d => <span key={d.month} className="text-[10px] text-gray-400">{d.month}</span>)}
      </div>
    </div>
  )
}

function KrBar({ kr }: { kr: OkrKr }) {
  const pct = kr.meta > 0 ? Math.min(Math.round((kr.atual / kr.meta) * 100), 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-gray-600 leading-snug flex-1 pr-2">{kr.descricao}</p>
        <span className="text-[10px] font-semibold text-gray-500 flex-shrink-0">{kr.atual}/{kr.meta} {kr.unidade}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
          <div className="h-full rounded-full bg-[#7B2FBE] transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[10px] font-medium text-[#7B2FBE] w-8 text-right">{pct}%</span>
      </div>
    </div>
  )
}

function MembrosPage() {
  const [controls, setControls] = useState<Record<string, MenteeControls>>(
    () => Object.fromEntries(mockMembers.map(m => [m.id, makeDefault()]))
  )
  const [expanded, setExpanded] = useState<string | null>(null)

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
    if (bloco.id === 'diferencial') {
      const d = getDiferenciais(member.id)
      return d.length > 0 ? d : null
    }
    const r = getReflexao(member.id, bloco.reflexaoKey)
    return r.length > 0 ? r : null
  }

  function countFilled(memberId: string) {
    return BLOCOS.filter(b =>
      b.id === 'diferencial'
        ? getDiferenciais(memberId).length > 0
        : getReflexao(memberId, b.reflexaoKey).length > 0
    ).length
  }

  function upd(memberId: string, patch: Partial<MenteeControls>) {
    setControls(prev => ({ ...prev, [memberId]: { ...prev[memberId], ...patch } }))
  }

  function updBloco(memberId: string, blocoId: BlocoKey, patch: Partial<BlocoState>) {
    setControls(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        identidade: {
          ...prev[memberId].identidade,
          [blocoId]: { ...prev[memberId].identidade[blocoId], ...patch },
        },
      },
    }))
  }

  function toggleConstruido(memberId: string, blocoId: BlocoKey) {
    const current = controls[memberId].identidade[blocoId].construido
    updBloco(memberId, blocoId, { construido: !current })
    if (!current) {
      const b = BLOCOS.find(x => x.id === blocoId)
      toast.success(`Bloco construído: ${b?.label}`)
    }
  }

  function addNextStep(memberId: string) {
    const texto = controls[memberId].newStepInput.trim()
    if (!texto) return
    upd(memberId, {
      newStepInput: '',
      nextSteps: [...controls[memberId].nextSteps, { id: Date.now().toString(), texto, done: false }],
    })
  }

  function toggleStep(memberId: string, stepId: string) {
    upd(memberId, {
      nextSteps: controls[memberId].nextSteps.map(s => s.id === stepId ? { ...s, done: !s.done } : s),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Mentorados</h1>
        <p className="text-gray-400 mt-1 text-sm">{mockMembers.length} participantes ativos</p>
      </div>

      <div className="space-y-3">
        {mockMembers.map((member: Member) => {
          const ctrl        = controls[member.id]
          const isOpen      = expanded === member.id
          const filled      = countFilled(member.id)
          const constructed = Object.values(ctrl.identidade).filter(b => b.construido).length
          const faseInfo    = FASES.find(f => f.num === ctrl.fase)!
          const okrs        = member.id === 'member-2' ? loadOkrs()      : []
          const marketing   = member.id === 'member-2' ? loadMarketing() : []
          const mktConcluidas = marketing.filter(a => a.concluida).length

          return (
            <motion.div key={member.id} variants={fadeInUp} initial="hidden" animate="visible"
              className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
            >
              {/* ── Row ── */}
              <button
                onClick={() => setExpanded(isOpen ? null : member.id)}
                className="w-full flex items-center gap-4 px-5 pt-4 pb-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B2FBE] to-[#a855f7] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                  {member.full_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{member.full_name}</p>
                  <p className="text-xs text-gray-400">{member.email}</p>
                </div>
                <div className="hidden sm:flex items-center gap-5 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Score</p>
                    <p className="text-sm font-bold" style={{ color: member.score >= 70 ? '#10B981' : member.score >= 40 ? '#F59E0B' : '#EF4444' }}>
                      {member.score}/100
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Fase</p>
                    <p className="text-xs font-semibold text-gray-700">{ctrl.fase}. {faseInfo.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Identidade</p>
                    <p className="text-xs font-semibold" style={{ color: filled > 0 ? '#7B2FBE' : '#9CA3AF' }}>
                      {filled}/5 · {constructed} construídos
                    </p>
                  </div>
                </div>
                {isOpen ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
              </button>

              {/* Score bar */}
              <div className="px-5 pb-3">
                <div className="w-full h-1 rounded-full bg-gray-100">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${member.score}%`, background: member.score >= 70 ? '#10B981' : member.score >= 40 ? '#F59E0B' : '#EF4444' }} />
                </div>
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
                      <div className="flex border-b border-gray-100 bg-gray-50/60">
                        {([
                          { id: 'overview'   as TabId, label: 'Visão Geral', Icon: BarChart2     },
                          { id: 'identidade' as TabId, label: 'Identidade',  Icon: BookOpen      },
                          { id: 'sessao'     as TabId, label: 'Sessão',      Icon: ClipboardList },
                        ]).map(tab => (
                          <button key={tab.id}
                            onClick={() => upd(member.id, { activeTab: tab.id })}
                            className={cn(
                              'flex items-center gap-2 px-5 py-3 text-xs font-medium border-b-2 transition-all',
                              ctrl.activeTab === tab.id
                                ? 'border-[#7B2FBE] text-[#7B2FBE] bg-white'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                            )}
                          >
                            <tab.Icon size={13} />
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      <div className="p-5 space-y-5 bg-gray-50/30">

                        {/* ════ VISÃO GERAL ════ */}
                        {ctrl.activeTab === 'overview' && (
                          <div className="space-y-5">

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { label: 'Score',   value: `${member.score}`, suffix: '/100', color: member.score >= 70 ? '#10B981' : member.score >= 40 ? '#F59E0B' : '#EF4444' },
                                { label: 'Leads',   value: `${member.leads}`,  color: '#10B981' },
                                { label: 'Alcance', value: member.alcance >= 1000 ? `${(member.alcance / 1000).toFixed(1)}k` : `${member.alcance}`, color: '#3B82F6' },
                              ].map(s => (
                                <div key={s.label} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center shadow-sm">
                                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">{s.label}</p>
                                  <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}<span className="text-xs font-normal text-gray-400">{s.suffix ?? ''}</span></p>
                                </div>
                              ))}
                            </div>

                            {/* Fase stepper */}
                            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-4">Fase da Jornada</p>
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
                                          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 bg-white transition-all',
                                          isActive ? 'bg-[#7B2FBE] border-[#7B2FBE] text-white shadow-md' :
                                          isPast   ? 'bg-[#7B2FBE]/15 border-[#7B2FBE]/40 text-[#7B2FBE]' :
                                                     'border-gray-200 text-gray-400'
                                        )}>
                                          {isPast ? <Check size={12} /> : fase.num}
                                        </div>
                                        <p className={cn('text-[10px] font-semibold text-center leading-tight', isActive ? 'text-[#7B2FBE]' : 'text-gray-400')}>
                                          {fase.label}
                                        </p>
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                              <p className="text-xs text-gray-400 text-center mt-3">{faseInfo.desc}</p>
                            </div>

                            {/* Identidade em Construção — visão compacta completa */}
                            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <Award size={14} className="text-[#7B2FBE]" />
                                  <p className="text-sm font-semibold text-gray-900">Identidade de Marca</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-medium text-[#7B2FBE] bg-[#7B2FBE]/10 px-2 py-0.5 rounded-full">{filled}/5 preenchidos</span>
                                  <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{constructed} construídos</span>
                                </div>
                              </div>

                              <div className="space-y-3">
                                {BLOCOS.map(bloco => {
                                  const bs      = ctrl.identidade[bloco.id]
                                  const content = getBlocoContent(member, bloco)
                                  const hasCont = content !== null && (Array.isArray(content) ? content.length > 0 : content.length > 0)
                                  const status  = bs.construido ? 'construido' : hasCont ? 'pronto' : 'aguardando'

                                  const statusCfg = {
                                    aguardando: { label: 'Aguardando', dot: '#9CA3AF' },
                                    pronto:     { label: 'Pronto p/ sessão', dot: '#D97706' },
                                    construido: { label: 'Construído', dot: '#7B2FBE' },
                                  }[status]

                                  return (
                                    <div key={bloco.id} className={cn(
                                      'rounded-xl border p-3 transition-all',
                                      bs.construido ? 'border-[#7B2FBE]/20 bg-[#7B2FBE]/[0.02]' :
                                      hasCont       ? 'border-amber-100 bg-amber-50/50' :
                                                      'border-gray-100 bg-gray-50/50'
                                    )}>
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: `${bloco.cor}18` }}>
                                          <span className="text-[9px] font-bold" style={{ color: bloco.cor }}>{bloco.num}</span>
                                        </div>
                                        <p className="text-xs font-semibold text-gray-800 flex-1">{bloco.label}</p>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusCfg.dot }} />
                                          <span className="text-[10px] text-gray-500">{statusCfg.label}</span>
                                        </div>
                                      </div>

                                      {hasCont ? (
                                        <div className="space-y-1.5">
                                          {/* Resposta do mentorado */}
                                          <div>
                                            <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wide mb-1">Resposta do mentorado</p>
                                            {Array.isArray(content) ? (
                                              <div className="space-y-1">
                                                {content.map((d, i) => (
                                                  <div key={i} className="flex items-start gap-1.5">
                                                    <span className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{ background: bloco.cor }} />
                                                    <p className="text-xs text-gray-700 leading-relaxed">{d}</p>
                                                  </div>
                                                ))}
                                              </div>
                                            ) : (
                                              <p className="text-xs text-gray-700 leading-relaxed">{content as string}</p>
                                            )}
                                          </div>
                                          {/* Síntese do mentor (se houver) */}
                                          {bs.analise.trim() && (
                                            <div className="mt-2 pt-2 border-t border-gray-200">
                                              <p className="text-[9px] font-medium text-[#7B2FBE] uppercase tracking-wide mb-1">Síntese do mentor</p>
                                              <p className="text-xs text-[#7B2FBE]/80 leading-relaxed italic">{bs.analise}</p>
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <p className="text-xs text-gray-400 italic">Mentorado ainda não preencheu este bloco.</p>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>

                              <button
                                onClick={() => upd(member.id, { activeTab: 'identidade' })}
                                className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#7B2FBE] hover:underline"
                              >
                                Abrir para análise e construção <ChevronRight size={12} />
                              </button>
                            </div>

                            {/* OKRs detalhados */}
                            {okrs.length > 0 && (
                              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                  <Target size={14} className="text-[#7B2FBE]" />
                                  <p className="text-sm font-semibold text-gray-900">OKRs Definidos</p>
                                  <span className="text-[10px] font-medium text-[#7B2FBE] bg-[#7B2FBE]/10 px-2 py-0.5 rounded-full">{okrs.length} objetivo{okrs.length > 1 ? 's' : ''}</span>
                                </div>
                                <div className="space-y-4">
                                  {okrs.map(okr => (
                                    <div key={okr.id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                                      <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CATEGORIA_COLORS[okr.categoria] ?? '#7B2FBE' }} />
                                        <p className="text-xs font-semibold text-gray-800 flex-1">{okr.titulo}</p>
                                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0"
                                          style={{ background: `${CATEGORIA_COLORS[okr.categoria] ?? '#7B2FBE'}15`, color: CATEGORIA_COLORS[okr.categoria] ?? '#7B2FBE' }}>
                                          {okr.categoria}
                                        </span>
                                      </div>
                                      {okr.krs && okr.krs.length > 0 && (
                                        <div className="space-y-2.5 pl-3 border-l-2 border-gray-200">
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
                              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                  <Calendar size={14} className="text-[#7B2FBE]" />
                                  <p className="text-sm font-semibold text-gray-900">Plano de Marketing Anual</p>
                                </div>
                                <div className="flex items-center gap-5 mb-4">
                                  <div><p className="text-xl font-bold text-gray-900">{marketing.length}</p><p className="text-[10px] text-gray-400">ações planejadas</p></div>
                                  <div><p className="text-xl font-bold text-[#10B981]">{mktConcluidas}</p><p className="text-[10px] text-gray-400">concluídas</p></div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-[10px] text-gray-400">Execução</span>
                                      <span className="text-[10px] font-medium text-[#7B2FBE]">{Math.round((mktConcluidas / marketing.length) * 100)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full">
                                      <div className="h-full rounded-full bg-[#10B981] transition-all"
                                        style={{ width: `${Math.round((mktConcluidas / marketing.length) * 100)}%` }} />
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  {marketing.slice(0, 5).map(a => (
                                    <div key={a.id} className="flex items-center gap-2 text-xs">
                                      <div className={cn('w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                                        a.concluida ? 'bg-[#10B981] border-[#10B981]' : 'border-gray-300'
                                      )}>
                                        {a.concluida && <Check size={7} className="text-white" />}
                                      </div>
                                      <p className={cn('flex-1 truncate', a.concluida ? 'line-through text-gray-400' : 'text-gray-700')}>{a.titulo}</p>
                                      <span className="text-[10px] text-gray-400 flex-shrink-0">{a.canal} · {MESES[(a.mes ?? 1) - 1]}</span>
                                    </div>
                                  ))}
                                  {marketing.length > 5 && <p className="text-[10px] text-gray-400 pl-5">+ {marketing.length - 5} outras ações</p>}
                                </div>
                              </div>
                            )}

                            {/* Growth chart */}
                            {member.growth?.length > 0 && (
                              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                  <TrendingUp size={14} className="text-[#7B2FBE]" />
                                  <p className="text-sm font-semibold text-gray-900">Evolução de Alcance</p>
                                </div>
                                <MiniChart data={member.growth} />
                                <div className="flex justify-between mt-2">
                                  {member.growth.map(g => (
                                    <span key={g.month} className="text-[10px] font-medium text-gray-500">
                                      {g.alcance >= 1000 ? `${(g.alcance / 1000).toFixed(1)}k` : g.alcance}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* ════ IDENTIDADE ════ */}
                        {ctrl.activeTab === 'identidade' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500">{filled} de 5 blocos preenchidos · {constructed} construídos com mentor</p>
                            </div>

                            {BLOCOS.map(bloco => {
                              const bs      = ctrl.identidade[bloco.id]
                              const content = getBlocoContent(member, bloco)
                              const hasCont = content !== null && (Array.isArray(content) ? content.length > 0 : content.length > 0)
                              const status  = bs.construido ? 'construido' : hasCont ? 'pronto' : 'aguardando'

                              const statusCfg = {
                                aguardando: { label: 'Aguardando reflexão', bg: '#F3F4F6', color: '#9CA3AF' },
                                pronto:     { label: 'Pronto para sessão',  bg: '#FEF3C7', color: '#D97706' },
                                construido: { label: 'Construído',          bg: '#F3E8FF', color: '#7B2FBE' },
                              }[status]

                              return (
                                <div key={bloco.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                                    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${bloco.cor}18` }}>
                                      <span className="text-[10px] font-bold" style={{ color: bloco.cor }}>{bloco.num}</span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 flex-1 min-w-0">{bloco.label}</p>
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                                      style={{ background: statusCfg.bg, color: statusCfg.color }}>
                                      {statusCfg.label}
                                    </span>
                                    <button
                                      onClick={() => toggleConstruido(member.id, bloco.id)}
                                      className={cn(
                                        'flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all flex-shrink-0',
                                        bs.construido
                                          ? 'bg-[#7B2FBE] text-white'
                                          : 'bg-gray-100 text-gray-500 hover:bg-[#7B2FBE]/10 hover:text-[#7B2FBE]'
                                      )}
                                    >
                                      {bs.construido ? <><Check size={11} /> Construído</> : 'Marcar construído'}
                                    </button>
                                  </div>

                                  <div className="px-4 py-3 border-b border-gray-100">
                                    {hasCont ? (
                                      <>
                                        <div className="flex items-center gap-1.5 mb-2">
                                          <PenLine size={11} className="text-[#7B2FBE]" />
                                          <p className="text-[10px] font-medium text-[#7B2FBE] uppercase tracking-wide">Resposta do mentorado</p>
                                        </div>
                                        {Array.isArray(content) ? (
                                          <div className="rounded-xl bg-[#7B2FBE]/[0.04] border border-[#7B2FBE]/10 px-4 py-3 space-y-1.5">
                                            {content.map((d, i) => (
                                              <div key={i} className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: bloco.cor }} />
                                                <p className="text-sm text-gray-700">{d}</p>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="rounded-xl bg-[#7B2FBE]/[0.04] border border-[#7B2FBE]/10 px-4 py-3">
                                            <p className="text-sm text-gray-700 leading-relaxed">{content as string}</p>
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <p className="text-xs text-gray-400 italic">Mentorado ainda não preencheu este bloco.</p>
                                    )}
                                  </div>

                                  <div className="px-4 py-3">
                                    <div className="flex items-center gap-1.5 mb-2">
                                      <MessageSquare size={11} className="text-gray-400" />
                                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Síntese do mentor</p>
                                    </div>
                                    <textarea
                                      value={bs.analise}
                                      onChange={e => updBloco(member.id, bloco.id, { analise: e.target.value })}
                                      placeholder={bloco.placeholder}
                                      rows={3}
                                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-1 focus:ring-[#7B2FBE]/20 resize-none"
                                    />
                                    {bs.analise.trim() && (
                                      <button
                                        onClick={() => toast.success('Síntese salva', { description: `Visível para ${member.full_name} quando marcado como construído` })}
                                        className="text-xs font-medium text-[#7B2FBE] hover:underline mt-1"
                                      >
                                        Salvar síntese →
                                      </button>
                                    )}
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
                            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <Sparkles size={13} className="text-[#7B2FBE]" />
                                <p className="text-sm font-semibold text-gray-900">Pauta Sugerida para Próxima Sessão</p>
                              </div>
                              <div className="space-y-2">
                                {BLOCOS.filter(b => {
                                  const c   = getBlocoContent(member, b)
                                  const has = c !== null && (Array.isArray(c) ? c.length > 0 : c.length > 0)
                                  return has && !ctrl.identidade[b.id].construido
                                }).map(bloco => (
                                  <div key={bloco.id} className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: `${bloco.cor}20` }}>
                                        <span className="text-[9px] font-bold" style={{ color: bloco.cor }}>{bloco.num}</span>
                                      </div>
                                      <p className="text-xs font-semibold text-gray-800">{bloco.label}</p>
                                    </div>
                                    <div className="space-y-1 pl-1">
                                      {bloco.perguntas.map((q, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                          <span className="text-amber-500 text-[10px] mt-0.5 flex-shrink-0">→</span>
                                          <p className="text-[11px] text-gray-600 leading-relaxed">{q}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}

                                {okrs.length > 0 && (
                                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#7B2FBE]/[0.04] border border-[#7B2FBE]/10">
                                    <Target size={13} className="text-[#7B2FBE] flex-shrink-0" />
                                    <p className="text-xs text-gray-700">Revisar progresso dos <strong>{okrs.length} OKRs</strong> definidos</p>
                                  </div>
                                )}
                                {marketing.length > 0 && (
                                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#7B2FBE]/[0.04] border border-[#7B2FBE]/10">
                                    <Calendar size={13} className="text-[#7B2FBE] flex-shrink-0" />
                                    <p className="text-xs text-gray-700">Revisar <strong>{marketing.length} ações</strong> do plano de marketing</p>
                                  </div>
                                )}
                                {BLOCOS.every(b => ctrl.identidade[b.id].construido) && (
                                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                                    <CheckCircle2 size={13} className="text-emerald-500" />
                                    <p className="text-xs text-emerald-700 font-medium">Todos os blocos de identidade foram construídos.</p>
                                  </div>
                                )}
                                {BLOCOS.filter(b => {
                                  const c = getBlocoContent(member, b)
                                  return c !== null && (Array.isArray(c) ? c.length > 0 : c.length > 0) && !ctrl.identidade[b.id].construido
                                }).length === 0 && okrs.length === 0 && marketing.length === 0 && (
                                  <p className="text-xs text-gray-400 text-center py-2 italic">Nenhum ponto pendente para esta sessão.</p>
                                )}
                              </div>
                            </div>

                            {/* Notas da sessão */}
                            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                              <p className="text-xs font-semibold text-gray-700 mb-3">Notas da Sessão</p>
                              <textarea
                                value={ctrl.sessionNotes}
                                onChange={e => upd(member.id, { sessionNotes: e.target.value })}
                                placeholder="Anote os principais pontos da sessão de hoje..."
                                rows={5}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-1 focus:ring-[#7B2FBE]/20 resize-none"
                              />
                              {ctrl.sessionNotes.trim() && (
                                <button onClick={() => toast.success('Notas salvas')}
                                  className="text-xs font-medium text-[#7B2FBE] hover:underline mt-1">
                                  Salvar notas →
                                </button>
                              )}
                            </div>

                            {/* Próximos passos */}
                            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                              <p className="text-xs font-semibold text-gray-700 mb-3">Próximos Passos</p>
                              <div className="space-y-2 mb-3">
                                {ctrl.nextSteps.length === 0 && (
                                  <p className="text-xs text-gray-400 italic">Nenhum próximo passo definido ainda.</p>
                                )}
                                {ctrl.nextSteps.map(step => (
                                  <div key={step.id} className="flex items-center gap-3">
                                    <button onClick={() => toggleStep(member.id, step.id)}
                                      className={cn('w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
                                        step.done ? 'bg-[#7B2FBE] border-[#7B2FBE]' : 'border-gray-300'
                                      )}>
                                      {step.done && <Check size={9} className="text-white" />}
                                    </button>
                                    <p className={cn('text-sm flex-1', step.done ? 'line-through text-gray-400' : 'text-gray-700')}>{step.texto}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={ctrl.newStepInput}
                                  onChange={e => upd(member.id, { newStepInput: e.target.value })}
                                  onKeyDown={e => e.key === 'Enter' && addNextStep(member.id)}
                                  placeholder="Adicionar próximo passo..."
                                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] transition-colors"
                                />
                                <button onClick={() => addNextStep(member.id)}
                                  className="w-9 h-9 bg-[#7B2FBE] rounded-xl flex items-center justify-center text-white hover:bg-[#6a27a5] transition-colors flex-shrink-0">
                                  <Plus size={15} />
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
