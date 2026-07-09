import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, ChevronDown, ChevronUp, CheckCircle2, Circle, XCircle, AlertCircle, Target, TrendingUp, Crosshair, Rocket, ChevronRight, Sparkles } from 'lucide-react'
import { staggerContainer, fadeInUp } from '@/lib/motion'
import { getIdentidade } from '@/lib/identidade'
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

const initialOkrs: Objective[] = []

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
   SUGESTÕES DE OKR
───────────────────────────────────────────── */
interface SugestaoOkr {
  id: string
  titulo: string
  categoria: string
  krs: { descricao: string; meta: number; unit: string }[]
}

function SugestoesDeOkr({ onAddOkr }: { onAddOkr: (obj: Objective) => void }) {
  const identidade = getIdentidade()
  const [open, setOpen] = useState(true)
  const [adicionados, setAdicionados] = useState<Set<string>>(new Set())

  const publicoAlvo    = identidade?.pilares.publicoAlvo?.reflexao?.trim()
  const proposta       = identidade?.pilares.proposta?.reflexao?.trim()
  const formatoProduto = identidade?.pilares.formatoProduto?.reflexao?.trim()
  const diferencial    = identidade?.diferenciais?.[0] ?? ''

  const sugestoes: SugestaoOkr[] = [
    {
      id: 'autoridade',
      titulo: 'Construir autoridade reconhecida no mercado',
      categoria: 'Autoridade',
      krs: [
        { descricao: 'Publicar peças de conteúdo de alta qualidade no trimestre', meta: 12, unit: 'conteúdos' },
        { descricao: 'Crescer seguidores ou conexões qualificadas', meta: 20, unit: '%' },
        { descricao: 'Receber indicações ou convites de forma orgânica', meta: 5, unit: 'indicações' },
      ],
    },
    (publicoAlvo || proposta) ? {
      id: 'conversao',
      titulo: proposta
        ? `Validar e converter: ${proposta.slice(0, 50)}${proposta.length > 50 ? '...' : ''}`
        : 'Gerar conversões e receita com consistência',
      categoria: 'Receita',
      krs: [
        {
          descricao: publicoAlvo
            ? `Realizar conversas qualificadas com ${publicoAlvo.slice(0, 45)}${publicoAlvo.length > 45 ? '...' : ''}`
            : 'Realizar conversas qualificadas com potenciais clientes',
          meta: 10,
          unit: 'conversas',
        },
        { descricao: 'Fechar clientes ou projetos no trimestre', meta: 3, unit: 'clientes' },
        { descricao: 'Atingir meta de receita ou horas faturadas', meta: 0, unit: 'R$' },
      ],
    } : null,
    diferencial ? {
      id: 'diferencial',
      titulo: `Ser referência por: ${diferencial.slice(0, 55)}${diferencial.length > 55 ? '...' : ''}`,
      categoria: 'Autoridade',
      krs: [
        { descricao: 'Menções ou compartilhamentos de conteúdo no trimestre', meta: 20, unit: 'menções' },
        { descricao: 'Depoimentos de clientes coletados e publicados', meta: 3, unit: 'depoimentos' },
        { descricao: 'Aparições em mídias externas (podcast, entrevista, artigo)', meta: 2, unit: 'aparições' },
      ],
    } : null,
    formatoProduto ? {
      id: 'produto',
      titulo: `Escalar: ${formatoProduto.slice(0, 55)}${formatoProduto.length > 55 ? '...' : ''}`,
      categoria: 'Produto',
      krs: [
        { descricao: 'Pessoas que conheceram seu formato de produto/serviço', meta: 50, unit: 'pessoas' },
        { descricao: 'Taxa de conversão de interessados em clientes', meta: 20, unit: '%' },
        { descricao: 'Ciclo médio de vendas reduzido para', meta: 14, unit: 'dias' },
      ],
    } : null,
  ].filter(Boolean) as SugestaoOkr[]

  if (sugestoes.length === 0) return null

  function usar(s: SugestaoOkr) {
    const novoObj: Objective = {
      id: `sug-${s.id}-${Date.now()}`,
      titulo: s.titulo,
      categoria: s.categoria,
      trimestre: 'Q3 2026',
      expanded: true,
      pdcaTab: 'okr',
      pdca: defaultPdca(1),
      keyResults: s.krs.map((kr, i) => ({
        id: `kr-${Date.now()}-${i}`,
        descricao: kr.descricao,
        meta: kr.meta,
        atual: 0,
        unit: kr.unit,
      })),
    }
    onAddOkr(novoObj)
    setAdicionados(prev => new Set([...prev, s.id]))
  }

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible"
      className="rounded-2xl border border-[#7B2FBE]/15 bg-white shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#7B2FBE]/10 flex items-center justify-center flex-shrink-0">
            <Sparkles size={12} className="text-[#7B2FBE]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Sugestões de OKRs</p>
            <p className="text-xs text-gray-400">Objetivos gerados a partir da sua identidade de marca</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-[#7B2FBE] bg-[#7B2FBE]/10 px-2 py-0.5 rounded-full">
            {sugestoes.length} objetivos
          </span>
          {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 p-5 space-y-3">
          {sugestoes.map(s => {
            const adicionado = adicionados.has(s.id)
            const cor = catColor[s.categoria] ?? '#7B2FBE'
            return (
              <div key={s.id} className="rounded-xl border border-gray-100 p-4 bg-gray-50/30 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: `${cor}15`, color: cor }}>
                        {s.categoria}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 leading-snug">{s.titulo}</p>
                  </div>
                  <button
                    onClick={() => !adicionado && usar(s)}
                    disabled={adicionado}
                    className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
                    style={adicionado
                      ? { background: '#f3f4f6', color: '#9ca3af' }
                      : { background: `${cor}15`, color: cor }
                    }
                  >
                    {adicionado ? 'Adicionado ✓' : 'Usar objetivo'}
                  </button>
                </div>
                <div className="space-y-2 pl-1">
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">Key Results sugeridos</p>
                  {s.krs.map((kr, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Target size={11} className="text-gray-300 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {kr.descricao}
                        {kr.meta > 0 && (
                          <span className="ml-1 font-medium" style={{ color: cor }}>
                            → meta: {kr.meta} {kr.unit}
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          <p className="text-xs text-gray-400 pt-1 border-t border-gray-100">
            Ajuste os valores das metas com seu mentor — eles conhecem seu contexto e ritmo real.
          </p>
        </div>
      )}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────── */
function OkrPage() {
  const [okrs, setOkrs] = useState<Objective[]>(initialOkrs)
  const [showNovoObj, setShowNovoObj] = useState(false)
  const [novoForm, setNovoForm] = useState({ titulo: '', categoria: 'Autoridade', trimestre: 'Q1 2026' })

  function addObjective() {
    if (!novoForm.titulo.trim()) return
    const novo: Objective = {
      id: Date.now().toString(),
      titulo: novoForm.titulo.trim(),
      categoria: novoForm.categoria,
      trimestre: novoForm.trimestre,
      expanded: true,
      pdcaTab: 'okr',
      keyResults: [],
      pdca: defaultPdca(1),
    }
    setOkrs(prev => [...prev, novo])
    setNovoForm({ titulo: '', categoria: 'Autoridade', trimestre: 'Q1 2026' })
    setShowNovoObj(false)
  }

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
      <div className="space-y-2">
        {/* Mini cadeia */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link to="/dashboard/membro/posicionamento">
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">01 Identidade</span>
          </Link>
          <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
          <Link to="/dashboard/membro/pilares">
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">02 Pilares</span>
          </Link>
          <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
          <span className="text-xs font-bold text-[#7B2FBE] bg-[#7B2FBE]/10 px-2 py-0.5 rounded-md">
            03 OKRs
          </span>
          <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
          <Link to="/dashboard/membro/marketing">
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">04 Marketing</span>
          </Link>
          <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
          <Link to="/dashboard/membro/kpis">
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">05 Resultados</span>
          </Link>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Metas de Impacto</h1>
            <p className="text-gray-500 mt-1 text-sm">O que você quer conquistar nos próximos 3 meses — definido com seu mentor, executado por você</p>
          </div>
          <button
            onClick={() => setShowNovoObj(true)}
            className="flex items-center gap-2 bg-[#7B2FBE] hover:bg-[#6a27a5] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm flex-shrink-0"
          >
            <Plus size={15} /> Novo Objetivo
          </button>
        </div>
      </div>

      {/* Modal novo objetivo */}
      {showNovoObj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Novo Objetivo</h2>
              <button onClick={() => setShowNovoObj(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Título do Objetivo</label>
                <input
                  type="text"
                  value={novoForm.titulo}
                  onChange={e => setNovoForm(f => ({ ...f, titulo: e.target.value }))}
                  placeholder="Ex: Tornar-me referência em..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#7B2FBE] transition-colors"
                  onKeyDown={e => e.key === 'Enter' && addObjective()}
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Categoria</label>
                  <select
                    value={novoForm.categoria}
                    onChange={e => setNovoForm(f => ({ ...f, categoria: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#7B2FBE] transition-colors bg-white"
                  >
                    {Object.keys(catColor).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Trimestre</label>
                  <select
                    value={novoForm.trimestre}
                    onChange={e => setNovoForm(f => ({ ...f, trimestre: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#7B2FBE] transition-colors bg-white"
                  >
                    {['Q1 2026','Q2 2026','Q3 2026','Q4 2026'].map(q => <option key={q}>{q}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowNovoObj(false)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-black py-2.5 rounded-xl hover:bg-gray-50 transition-colors uppercase tracking-wide"
              >
                Cancelar
              </button>
              <button
                onClick={addObjective}
                disabled={!novoForm.titulo.trim()}
                className="flex-1 bg-[#7B2FBE] hover:bg-[#6a27a5] disabled:opacity-40 text-white text-sm font-black py-2.5 rounded-xl transition-colors uppercase tracking-wide"
              >
                Criar Objetivo
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Sumário */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-3 gap-3">
        <motion.div variants={fadeInUp} className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} className="text-gray-300" />
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Objetivos</p>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{okrs.length}</p>
        </motion.div>
        <motion.div variants={fadeInUp} className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <Crosshair size={14} className="text-gray-300" />
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Key Results</p>
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

      {/* Sugestões baseadas na identidade */}
      <SugestoesDeOkr onAddOkr={(obj) => setOkrs(prev => [...prev, obj])} />

      {/* Empty state — nenhuma meta definida ainda */}
      {okrs.length === 0 && (
        <motion.div
          variants={fadeInUp} initial="hidden" animate="visible"
          className="rounded-2xl border border-gray-100 bg-white shadow-sm p-12 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#7B2FBE]/10 flex items-center justify-center mb-5">
            <Rocket size={28} className="text-[#7B2FBE]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Suas metas ainda estão sendo desenhadas</h2>
          <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-1">
            Na próxima sessão com seu mentor, vocês vão definir juntos o que você quer conquistar nos próximos 3 meses.
          </p>
          <p className="text-xs text-gray-400 max-w-xs leading-relaxed mb-8">
            Cada meta nasce de uma conversa real — não de um template. O seu mentor vai guiar esse processo.
          </p>

          {/* Jornada do programa — o que vem em cada fase */}
          <div className="w-full max-w-lg border-t border-gray-100 pt-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">O que acontece em cada fase</p>
            <div className="grid grid-cols-2 gap-3 text-left">
              {[
                { fase: '01', nome: 'OKR & MVP',          desc: 'Suas metas de impacto + formatação do produto' },
                { fase: '02', nome: 'Primeiras Vitórias', desc: 'Posicionamento, marketing e agenda de eventos' },
                { fase: '03', nome: 'Plano em Ação',      desc: 'Execução do plano + revisão de metas + storytelling' },
                { fase: '04', nome: 'Escala',             desc: 'Segundo ciclo de execução + autoridade de mercado' },
              ].map(f => (
                <div key={f.fase} className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                  <span className="text-[10px] font-black text-[#7B2FBE] tracking-widest block mb-1">Fase {f.fase}</span>
                  <p className="text-xs font-semibold text-gray-800 mb-1">{f.nome}</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-300 mt-6 italic">
            Você pode adicionar uma meta manualmente se já tiver clareza — mas o ideal é fazer isso com o mentor.
          </p>
        </motion.div>
      )}

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
                      const labels = { okr: 'Como Vou Medir', p: 'O Que Fazer', d: 'Minha Semana', c: 'Como Estou', a: 'O Que Melhorar' }
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
                            <button className="w-full py-3 bg-[#7B2FBE] hover:bg-[#6a27a5] text-white text-sm font-medium rounded-lg transition-colors">
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

      {/* Esta construção alimenta */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5"
      >
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-4">Esta construção alimenta</p>
        <div className="grid sm:grid-cols-2 gap-3">

          <Link to="/dashboard/membro/marketing">
            <div className="group rounded-xl border border-gray-100 bg-gray-50 hover:border-[#7B2FBE]/20 hover:bg-[#7B2FBE]/[0.03] p-4 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-[#7B2FBE]">04</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#7B2FBE] transition-colors" />
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-tight mb-1.5">Marketing Anual</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                As metas definem as prioridades de conteúdo e presença — o calendário de marketing é construído para executar o que os OKRs exigem.
              </p>
            </div>
          </Link>

          <Link to="/dashboard/membro/kpis">
            <div className="group rounded-xl border border-gray-100 bg-gray-50 hover:border-[#7B2FBE]/20 hover:bg-[#7B2FBE]/[0.03] p-4 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-[#7B2FBE]">05</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#7B2FBE] transition-colors" />
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-tight mb-1.5">Indicadores de Resultado</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Os key results dos OKRs viram os indicadores que você acompanha semana a semana para saber se está no ritmo certo.
              </p>
            </div>
          </Link>

        </div>
      </motion.div>
    </div>
  )
}
