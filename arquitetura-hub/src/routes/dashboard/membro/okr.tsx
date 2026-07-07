import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, ChevronDown, ChevronUp, CheckCircle2, Circle, XCircle, AlertCircle, Target, TrendingUp, Crosshair } from 'lucide-react'
import { staggerContainer, fadeInUp } from '@/lib/motion'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/membro/okr')({
  component: OkrPage,
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

type AcaoStatus = 'pendente' | 'feito' | 'nao_feito' | 'bloqueado'

interface PdcaAcao {
  id: string
  descricao: string
  semana: number   // 1–4
  status: AcaoStatus
  obs: string
}

interface PdcaAjuste {
  id: string
  texto: string
  status: 'pendente' | 'aprovado' | 'rejeitado'
}

interface PdcaCiclo {
  diagnostico: string
  metaEspecifica: string
  riscos: string
  semanaAtual: number  // 1–4
  acoes: PdcaAcao[]
  ajustes: PdcaAjuste[]
}

interface Objective {
  id: string
  titulo: string
  categoria: string
  trimestre: string
  keyResults: KeyResult[]
  expanded: boolean
  pdcaTab: 'okr' | 'p' | 'd' | 'c' | 'a'
  pdca: PdcaCiclo
}

/* ─────────────────────────────────────────────
   CORES POR CATEGORIA
───────────────────────────────────────────── */
const catColor: Record<string, string> = {
  'Autoridade': '#7B2FBE',
  'Receita':    '#10B981',
  'Alcance':    '#3B82F6',
  'Produto':    '#F59E0B',
}

/* ─────────────────────────────────────────────
   DADOS INICIAIS
───────────────────────────────────────────── */
function defaultPdca(semana = 1): PdcaCiclo {
  return {
    diagnostico:    '',
    metaEspecifica: '',
    riscos:         '',
    semanaAtual:    semana,
    acoes: [],
    ajustes: [],
  }
}

const initialOkrs: Objective[] = [
  {
    id: 'o1',
    titulo: 'Tornar-me referência no meu nicho de mercado',
    categoria: 'Autoridade',
    trimestre: 'Q1 2026',
    expanded: true,
    pdcaTab: 'okr',
    keyResults: [
      { id: 'kr1', descricao: 'Publicar 3 artigos no LinkedIn com +500 impressões', meta: 3,    atual: 1,   unit: 'artigos'    },
      { id: 'kr2', descricao: 'Conquistar 1.000 seguidores engajados',              meta: 1000, atual: 320, unit: 'seguidores' },
      { id: 'kr3', descricao: 'Participar de 2 podcasts como convidado(a)',          meta: 2,    atual: 0,   unit: 'podcasts'   },
    ],
    pdca: {
      diagnostico:    'Hoje publico esporadicamente e sem consistência. Seguidores crescem lento.',
      metaEspecifica: 'Publicar 1x por semana e alcançar 500 seguidores até o final do ciclo.',
      riscos:         'Falta de tempo para produção de conteúdo; bloqueio criativo.',
      semanaAtual: 2,
      acoes: [
        { id: 'a1', descricao: 'Escrever rascunho do artigo sobre autoridade de nicho', semana: 1, status: 'feito',     obs: ''           },
        { id: 'a2', descricao: 'Publicar artigo revisado no LinkedIn',                   semana: 1, status: 'feito',     obs: ''           },
        { id: 'a3', descricao: 'Responder 10 comentários de outros criadores',           semana: 1, status: 'nao_feito', obs: 'Esqueci.'   },
        { id: 'a4', descricao: 'Gravar pitch de apresentação para podcast',              semana: 2, status: 'pendente',  obs: ''           },
        { id: 'a5', descricao: 'Enviar proposta para 3 podcasts do nicho',               semana: 2, status: 'pendente',  obs: ''           },
        { id: 'a6', descricao: 'Publicar 2º artigo',                                     semana: 2, status: 'pendente',  obs: ''           },
        { id: 'a7', descricao: 'Analisar métricas e ajustar pauta',                      semana: 3, status: 'pendente',  obs: ''           },
        { id: 'a8', descricao: 'Publicar 3º artigo',                                     semana: 3, status: 'pendente',  obs: ''           },
        { id: 'a9', descricao: 'Gravar depoimento para portfólio de autoridade',         semana: 4, status: 'pendente',  obs: ''           },
      ],
      ajustes: [
        { id: 'aj1', texto: 'Reduzir frequência de respostas de 10 para 5 — mais qualidade, menos volume',      status: 'pendente' },
        { id: 'aj2', texto: 'Bloquear 30 min toda segunda para rascunho de artigo — elimina bloqueio criativo', status: 'pendente' },
        { id: 'aj3', texto: 'Priorizar 1 podcast grande em vez de 3 menores — impacto mais direto no KR2',       status: 'pendente' },
      ],
    },
  },
  {
    id: 'o2',
    titulo: 'Lançar meu primeiro produto digital',
    categoria: 'Produto',
    trimestre: 'Q1 2026',
    expanded: false,
    pdcaTab: 'okr',
    keyResults: [
      { id: 'kr4', descricao: 'Definir e documentar o MVP do produto', meta: 1,  atual: 0, unit: 'documento'  },
      { id: 'kr5', descricao: 'Validar com 10 potenciais clientes',    meta: 10, atual: 3, unit: 'validações' },
      { id: 'kr6', descricao: 'Pré-venda com 5 compradores',           meta: 5,  atual: 0, unit: 'pré-vendas' },
    ],
    pdca: defaultPdca(),
  },
  {
    id: 'o3',
    titulo: 'Aumentar receita recorrente em 30%',
    categoria: 'Receita',
    trimestre: 'Q2 2026',
    expanded: false,
    pdcaTab: 'okr',
    keyResults: [
      { id: 'kr7', descricao: 'Gerar R$ 10k em novas receitas',       meta: 10000, atual: 0, unit: 'R$'      },
      { id: 'kr8', descricao: 'Converter 5 leads em clientes pagantes', meta: 5,    atual: 0, unit: 'clientes' },
    ],
    pdca: defaultPdca(),
  },
]

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function getProgress(atual: number, meta: number) {
  if (meta === 0) return 0
  return Math.min(100, Math.round((atual / meta) * 100))
}

function ritmo(acoes: PdcaAcao[], semanaAtual: number) {
  const passadas = acoes.filter(a => a.semana < semanaAtual)
  if (passadas.length === 0) return null
  const feitas = passadas.filter(a => a.status === 'feito').length
  return Math.round((feitas / passadas.length) * 100)
}

const statusIcon = {
  feito:     <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />,
  nao_feito: <XCircle      size={15} className="text-red-400 flex-shrink-0"     />,
  bloqueado: <AlertCircle  size={15} className="text-amber-400 flex-shrink-0"   />,
  pendente:  <Circle       size={15} className="text-gray-300 flex-shrink-0"    />,
}

const statusLabel: Record<AcaoStatus, string> = {
  feito: 'Feito', nao_feito: 'Não feito', bloqueado: 'Bloqueado', pendente: 'Pendente',
}

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────── */
function OkrPage() {
  const [okrs, setOkrs] = useState<Objective[]>(initialOkrs)

  /* ── atualizadores genéricos ── */
  function setObj(id: string, patch: Partial<Objective>) {
    setOkrs(prev => prev.map(o => o.id === id ? { ...o, ...patch } : o))
  }
  function setPdca(id: string, patch: Partial<PdcaCiclo>) {
    setOkrs(prev => prev.map(o => o.id === id ? { ...o, pdca: { ...o.pdca, ...patch } } : o))
  }
  function updateKr(objId: string, krId: string, atual: number) {
    setOkrs(prev => prev.map(o => {
      if (o.id !== objId) return o
      return { ...o, keyResults: o.keyResults.map(kr => kr.id === krId ? { ...kr, atual } : kr) }
    }))
  }
  function updateAcao(objId: string, acaoId: string, patch: Partial<PdcaAcao>) {
    setOkrs(prev => prev.map(o => {
      if (o.id !== objId) return o
      return { ...o, pdca: { ...o.pdca, acoes: o.pdca.acoes.map(a => a.id === acaoId ? { ...a, ...patch } : a) } }
    }))
  }
  function addAcao(objId: string, semana: number) {
    const nova: PdcaAcao = { id: Date.now().toString(), descricao: '', semana, status: 'pendente', obs: '' }
    setOkrs(prev => prev.map(o => o.id !== objId ? o : { ...o, pdca: { ...o.pdca, acoes: [...o.pdca.acoes, nova] } }))
  }
  function updateAjuste(objId: string, ajId: string, status: PdcaAjuste['status']) {
    setOkrs(prev => prev.map(o => {
      if (o.id !== objId) return o
      return { ...o, pdca: { ...o.pdca, ajustes: o.pdca.ajustes.map(aj => aj.id === ajId ? { ...aj, status } : aj) } }
    }))
  }

  /* ── sumário global ── */
  const totalKrs = okrs.flatMap(o => o.keyResults).length
  const doneKrs  = okrs.flatMap(o => o.keyResults).filter(kr => getProgress(kr.atual, kr.meta) >= 100).length
  const overallProgress = totalKrs > 0 ? Math.round((doneKrs / totalKrs) * 100) : 0

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Meus OKRs + PDCA</h1>
          <p className="text-gray-400 mt-1 text-sm">Objetivos, resultados-chave e ciclo de execução</p>
        </div>
        <button className="flex items-center gap-2 bg-[#7B2FBE] hover:bg-[#6a27a5] text-white text-sm font-black px-4 py-2.5 rounded-xl transition-colors uppercase tracking-wide">
          <Plus size={15} /> Novo Objetivo
        </button>
      </div>

      {/* Sumário */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-3 gap-3">
        <motion.div variants={fadeInUp} className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} className="text-gray-300" />
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Objetivos</p>
          </div>
          <p className="text-2xl font-black text-gray-900">{okrs.length}</p>
        </motion.div>
        <motion.div variants={fadeInUp} className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <Crosshair size={14} className="text-gray-300" />
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Key Results</p>
          </div>
          <p className="text-2xl font-black text-gray-900">{doneKrs}<span className="text-gray-400 text-sm font-normal">/{totalKrs}</span></p>
        </motion.div>
        <motion.div variants={fadeInUp} className="rounded-2xl bg-white border border-[#7B2FBE]/25 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-[#7B2FBE]" />
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Progresso</p>
          </div>
          <p className="text-2xl font-black text-[#7B2FBE]">{overallProgress}%</p>
        </motion.div>
      </motion.div>

      {/* Cards de OKR */}
      <div className="space-y-3">
        {okrs.map((obj) => {
          const color      = catColor[obj.categoria] ?? '#6B7280'
          const objPct     = obj.keyResults.length > 0
            ? Math.round(obj.keyResults.reduce((s, kr) => s + getProgress(kr.atual, kr.meta), 0) / obj.keyResults.length)
            : 0
          const r          = ritmo(obj.pdca.acoes, obj.pdca.semanaAtual)
          const cicloFim   = obj.pdca.semanaAtual > 4

          return (
            <motion.div key={obj.id} variants={fadeInUp} initial="hidden" animate="visible"
              className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* ── cabeçalho ── */}
              <button onClick={() => setObj(obj.id, { expanded: !obj.expanded })}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest"
                      style={{ background: `${color}15`, color }}>
                      {obj.categoria}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">{obj.trimestre}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{obj.titulo}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                      <div className="h-full rounded-full transition-all" style={{ width: `${objPct}%`, background: color }} />
                    </div>
                    <span className="text-xs font-black flex-shrink-0" style={{ color }}>{objPct}%</span>
                  </div>
                </div>
                {obj.expanded ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
              </button>

              {obj.expanded && (
                <>
                  {/* ── tabs OKR | P | D | C | A ── */}
                  <div className="border-t border-gray-100 flex">
                    {(['okr', 'p', 'd', 'c', 'a'] as const).map((tab) => {
                      const labels = { okr: 'Key Results', p: 'Plan', d: 'Do', c: 'Check', a: 'Act' }
                      const active = obj.pdcaTab === tab
                      return (
                        <button key={tab} onClick={() => setObj(obj.id, { pdcaTab: tab })}
                          className={cn(
                            'flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors border-b-2',
                            active
                              ? 'border-[#7B2FBE] text-[#7B2FBE]'
                              : 'border-transparent text-gray-400 hover:text-gray-700'
                          )}
                        >
                          {labels[tab]}
                        </button>
                      )
                    })}
                  </div>

                  {/* ── KEY RESULTS ── */}
                  {obj.pdcaTab === 'okr' && (
                    <div className="divide-y divide-gray-100">
                      {obj.keyResults.map((kr) => {
                        const pct  = getProgress(kr.atual, kr.meta)
                        const done = pct >= 100
                        return (
                          <div key={kr.id} className="px-5 py-4 flex items-start gap-3">
                            {done
                              ? <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                              : <Circle size={15} className="text-gray-300 flex-shrink-0 mt-0.5" />
                            }
                            <div className="flex-1 min-w-0">
                              <p className={cn('text-sm leading-relaxed', done ? 'text-gray-400 line-through' : 'text-gray-700')}>{kr.descricao}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex-1 h-1 rounded-full bg-gray-100">
                                  <div className="h-full rounded-full transition-all"
                                    style={{ width: `${pct}%`, background: done ? '#10B981' : color }} />
                                </div>
                                <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
                                  {kr.atual}/{kr.meta} {kr.unit}
                                </span>
                              </div>
                            </div>
                            <input
                              type="number" value={kr.atual} min={0} max={kr.meta * 2}
                              onChange={e => updateKr(obj.id, kr.id, Number(e.target.value))}
                              className="w-20 text-sm text-right bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-900 focus:outline-none focus:border-[#7B2FBE] focus:ring-1 focus:ring-[#7B2FBE]/20 flex-shrink-0"
                            />
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* ── PLAN ── */}
                  {obj.pdcaTab === 'p' && (
                    <div className="p-5 space-y-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Diagnóstico atual — onde estou</p>
                      <textarea
                        value={obj.pdca.diagnostico}
                        onChange={e => setPdca(obj.id, { diagnostico: e.target.value })}
                        placeholder="Descreva honestamente onde você está hoje em relação a este objetivo..."
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 resize-none"
                      />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Meta específica — onde quero chegar e quando</p>
                      <textarea
                        value={obj.pdca.metaEspecifica}
                        onChange={e => setPdca(obj.id, { metaEspecifica: e.target.value })}
                        placeholder="Ex: Atingir 500 seguidores até o dia 31/03, com pelo menos 3 posts publicados..."
                        rows={2}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 resize-none"
                      />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Riscos mapeados + plano de contingência</p>
                      <textarea
                        value={obj.pdca.riscos}
                        onChange={e => setPdca(obj.id, { riscos: e.target.value })}
                        placeholder="Ex: Falta de tempo na semana de pico → preparar conteúdo com antecedência na semana anterior..."
                        rows={2}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 resize-none"
                      />
                      <div className="flex items-center justify-between pt-1">
                        <p className="text-xs text-gray-400">Semana atual do ciclo</p>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4].map(s => (
                            <button key={s} onClick={() => setPdca(obj.id, { semanaAtual: s })}
                              className={cn(
                                'w-8 h-8 rounded-lg text-xs font-black transition-colors',
                                obj.pdca.semanaAtual === s
                                  ? 'bg-[#7B2FBE] text-white'
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              )}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── DO ── */}
                  {obj.pdcaTab === 'd' && (
                    <div className="p-5 space-y-5">
                      {[1,2,3,4].map(semana => {
                        const acoesSem = obj.pdca.acoes.filter(a => a.semana === semana)
                        const isCurrent = semana === obj.pdca.semanaAtual
                        const isPast = semana < obj.pdca.semanaAtual
                        return (
                          <div key={semana}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  'text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded',
                                  isCurrent ? 'bg-[#7B2FBE]/10 text-[#7B2FBE]' : 'text-gray-400'
                                )}>
                                  Semana {semana} {isCurrent ? '— atual' : isPast ? '— concluída' : ''}
                                </span>
                              </div>
                              <button onClick={() => addAcao(obj.id, semana)}
                                className="text-[10px] font-black text-[#7B2FBE] hover:text-[#6a27a5] uppercase tracking-widest flex items-center gap-1"
                              >
                                <Plus size={10} /> Ação
                              </button>
                            </div>
                            {acoesSem.length === 0 ? (
                              <p className="text-xs text-gray-300 italic py-2 pl-1">Nenhuma ação adicionada</p>
                            ) : (
                              <div className="space-y-2">
                                {acoesSem.map(acao => (
                                  <div key={acao.id} className={cn(
                                    'rounded-xl border p-3 space-y-2 transition-colors',
                                    acao.status === 'feito'     ? 'border-emerald-100 bg-emerald-50/50' :
                                    acao.status === 'bloqueado' ? 'border-amber-100 bg-amber-50/50' :
                                    acao.status === 'nao_feito' ? 'border-red-100 bg-red-50/50' :
                                    'border-gray-100 bg-gray-50'
                                  )}>
                                    <div className="flex items-start gap-2">
                                      {statusIcon[acao.status]}
                                      <input
                                        type="text" value={acao.descricao}
                                        onChange={e => updateAcao(obj.id, acao.id, { descricao: e.target.value })}
                                        placeholder="Descreva a ação..."
                                        className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2 pl-6">
                                      {(['feito','nao_feito','bloqueado','pendente'] as AcaoStatus[]).map(s => (
                                        <button key={s} onClick={() => updateAcao(obj.id, acao.id, { status: s })}
                                          className={cn(
                                            'text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded transition-colors',
                                            acao.status === s
                                              ? s === 'feito'     ? 'bg-emerald-100 text-emerald-700'
                                              : s === 'bloqueado' ? 'bg-amber-100 text-amber-700'
                                              : s === 'nao_feito' ? 'bg-red-100 text-red-600'
                                              :                     'bg-gray-200 text-gray-600'
                                              : 'text-gray-300 hover:text-gray-500'
                                          )}>
                                          {statusLabel[s]}
                                        </button>
                                      ))}
                                    </div>
                                    {(acao.status === 'nao_feito' || acao.status === 'bloqueado') && (
                                      <input
                                        type="text" value={acao.obs}
                                        onChange={e => updateAcao(obj.id, acao.id, { obs: e.target.value })}
                                        placeholder="O que aconteceu? (opcional)"
                                        className="w-full pl-6 bg-transparent text-xs text-gray-500 placeholder:text-gray-300 focus:outline-none border-t border-gray-200 pt-2"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* ── CHECK ── */}
                  {obj.pdcaTab === 'c' && (
                    <div className="p-5 space-y-4">
                      {/* Ritmo de execução */}
                      {r !== null ? (
                        <>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ritmo de execução</p>
                              <span className={cn('text-sm font-black', r >= 80 ? 'text-emerald-500' : r >= 50 ? 'text-amber-500' : 'text-red-500')}>
                                {r}%
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-gray-100">
                              <div className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${r}%`, background: r >= 80 ? '#10B981' : r >= 50 ? '#F59E0B' : '#EF4444' }} />
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              {r >= 80 ? '✓ No ritmo certo para atingir o objetivo no prazo.'
                               : r >= 50 ? '⚠ Ritmo abaixo do ideal — atenção às próximas semanas.'
                               : '✗ Risco real de não atingir o KR. Acione o plano de contingência.'}
                            </p>
                          </div>

                          {/* Breakdown por semana */}
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Semana a semana</p>
                            {[1,2,3,4].map(s => {
                              const acs   = obj.pdca.acoes.filter(a => a.semana === s)
                              const feitas = acs.filter(a => a.status === 'feito').length
                              const total  = acs.length
                              const pPast  = s < obj.pdca.semanaAtual
                              const pct    = total > 0 ? Math.round((feitas / total) * 100) : 0
                              return (
                                <div key={s} className="flex items-center gap-3">
                                  <span className="text-xs text-gray-400 w-18 flex-shrink-0">Semana {s}</span>
                                  <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                                    {pPast && total > 0 && (
                                      <div className="h-full rounded-full"
                                        style={{ width: `${pct}%`, background: pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444' }} />
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-400 w-16 text-right flex-shrink-0">
                                    {pPast && total > 0 ? `${feitas}/${total} feitas` : total > 0 ? `${total} ações` : '—'}
                                  </span>
                                </div>
                              )
                            })}
                          </div>

                          {/* KR progress */}
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Progresso dos Key Results</p>
                            {obj.keyResults.map(kr => {
                              const pct = getProgress(kr.atual, kr.meta)
                              return (
                                <div key={kr.id} className="mb-3">
                                  <div className="flex justify-between mb-1">
                                    <p className="text-xs text-gray-600 leading-relaxed">{kr.descricao}</p>
                                    <span className="text-xs font-black text-gray-900 ml-2 flex-shrink-0">{pct}%</span>
                                  </div>
                                  <div className="w-full h-1.5 rounded-full bg-gray-100">
                                    <div className="h-full rounded-full transition-all"
                                      style={{ width: `${pct}%`, background: color }} />
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </>
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-sm text-gray-400">Nenhuma semana concluída ainda.</p>
                          <p className="text-xs text-gray-300 mt-1">Registre ações na aba <strong>Do</strong> e avance a semana no <strong>Plan</strong>.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── ACT ── */}
                  {obj.pdcaTab === 'a' && (
                    <div className="p-5 space-y-4">
                      {obj.pdca.ajustes.length === 0 ? (
                        <div className="py-8 text-center">
                          <p className="text-sm text-gray-400">Os ajustes aparecem aqui ao final do ciclo de 4 semanas.</p>
                          <p className="text-xs text-gray-300 mt-1">Complete as ações nas abas <strong>Do</strong> e <strong>Check</strong> primeiro.</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            Com base nos dados de execução do ciclo, estes são os 3 ajustes recomendados para o próximo ciclo. Aprove, rejeite ou modifique cada um.
                          </p>
                          <div className="space-y-3">
                            {obj.pdca.ajustes.map((aj, i) => (
                              <div key={aj.id} className={cn(
                                'rounded-xl border p-4 transition-colors',
                                aj.status === 'aprovado'  ? 'border-emerald-200 bg-emerald-50/60' :
                                aj.status === 'rejeitado' ? 'border-red-100 bg-red-50/40 opacity-60' :
                                'border-gray-200 bg-white'
                              )}>
                                <div className="flex items-start gap-3">
                                  <span className="text-[11px] font-black text-[#7B2FBE] tracking-widest mt-0.5 flex-shrink-0">
                                    0{i + 1}
                                  </span>
                                  <p className="text-sm text-gray-800 leading-relaxed flex-1">{aj.texto}</p>
                                </div>
                                {aj.status === 'pendente' && (
                                  <div className="flex gap-2 mt-3 pl-6">
                                    <button onClick={() => updateAjuste(obj.id, aj.id, 'aprovado')}
                                      className="flex-1 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black uppercase tracking-wide hover:bg-emerald-200 transition-colors">
                                      Aprovar
                                    </button>
                                    <button onClick={() => updateAjuste(obj.id, aj.id, 'rejeitado')}
                                      className="flex-1 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-black uppercase tracking-wide hover:bg-red-100 transition-colors">
                                      Rejeitar
                                    </button>
                                  </div>
                                )}
                                {aj.status !== 'pendente' && (
                                  <div className="pl-6 mt-2">
                                    <span className={cn(
                                      'text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded',
                                      aj.status === 'aprovado' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                                    )}>
                                      {aj.status === 'aprovado' ? 'Incorporado ao próximo ciclo' : 'Rejeitado'}
                                    </span>
                                    <button onClick={() => updateAjuste(obj.id, aj.id, 'pendente')}
                                      className="ml-2 text-[9px] text-gray-400 underline hover:text-gray-700 uppercase tracking-widest">
                                      Desfazer
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="pt-2">
                            <button className="w-full py-3 bg-[#7B2FBE] hover:bg-[#6a27a5] text-white text-sm font-black uppercase tracking-wide rounded-xl transition-colors">
                              Iniciar Próximo Ciclo →
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
