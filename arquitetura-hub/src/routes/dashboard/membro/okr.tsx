import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Crosshair, Plus, ChevronDown, ChevronUp, CheckCircle2, Circle, Target, TrendingUp } from 'lucide-react'
import { staggerContainer, fadeInUp } from '@/lib/motion'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/membro/okr')({
  component: OkrPage,
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
  expanded: boolean
}

const categoriaColors: Record<string, string> = {
  'Autoridade': '#7B2FBE',
  'Receita': '#10B981',
  'Alcance': '#3B82F6',
  'Produto': '#F59E0B',
}

const initialOkrs: Objective[] = [
  {
    id: 'o1',
    titulo: 'Tornar-me referência no meu nicho de mercado',
    categoria: 'Autoridade',
    trimestre: 'Q1 2026',
    expanded: true,
    keyResults: [
      { id: 'kr1', descricao: 'Publicar 3 artigos no LinkedIn com +500 impressões cada', meta: 3, atual: 1, unit: 'artigos' },
      { id: 'kr2', descricao: 'Conquistar 1.000 seguidores engajados no LinkedIn', meta: 1000, atual: 320, unit: 'seguidores' },
      { id: 'kr3', descricao: 'Participar de 2 podcasts como convidado(a)', meta: 2, atual: 0, unit: 'podcasts' },
    ],
  },
  {
    id: 'o2',
    titulo: 'Lançar meu primeiro produto digital',
    categoria: 'Produto',
    trimestre: 'Q1 2026',
    expanded: false,
    keyResults: [
      { id: 'kr4', descricao: 'Definir e documentar o MVP do produto', meta: 1, atual: 0, unit: 'documento' },
      { id: 'kr5', descricao: 'Validar com 10 potenciais clientes', meta: 10, atual: 3, unit: 'validações' },
      { id: 'kr6', descricao: 'Realizar pré-venda com 5 compradores', meta: 5, atual: 0, unit: 'pré-vendas' },
    ],
  },
  {
    id: 'o3',
    titulo: 'Aumentar receita recorrente em 30%',
    categoria: 'Receita',
    trimestre: 'Q2 2026',
    expanded: false,
    keyResults: [
      { id: 'kr7', descricao: 'Gerar R$ 10k em novas receitas', meta: 10000, atual: 0, unit: 'R$' },
      { id: 'kr8', descricao: 'Converter 5 leads em clientes pagantes', meta: 5, atual: 0, unit: 'clientes' },
    ],
  },
]

function getProgress(atual: number, meta: number) {
  if (meta === 0) return 0
  return Math.min(100, Math.round((atual / meta) * 100))
}

function OkrPage() {
  const [okrs, setOkrs] = useState<Objective[]>(initialOkrs)

  function toggleExpanded(id: string) {
    setOkrs(prev => prev.map(o => o.id === id ? { ...o, expanded: !o.expanded } : o))
  }

  function updateKr(objId: string, krId: string, atual: number) {
    setOkrs(prev => prev.map(o => {
      if (o.id !== objId) return o
      return { ...o, keyResults: o.keyResults.map(kr => kr.id === krId ? { ...kr, atual } : kr) }
    }))
  }

  const totalKrs = okrs.flatMap(o => o.keyResults).length
  const doneKrs = okrs.flatMap(o => o.keyResults).filter(kr => getProgress(kr.atual, kr.meta) >= 100).length
  const overallProgress = totalKrs > 0 ? Math.round((doneKrs / totalKrs) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Meus OKRs</h1>
          <p className="text-gray-400 mt-1 text-sm">Objetivos e Resultados-Chave para este trimestre</p>
        </div>
        <button className="flex items-center gap-2 bg-[#7B2FBE] hover:bg-[#6a27a5] text-white text-sm font-black px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-[#7B2FBE]/20 uppercase tracking-wide">
          <Plus size={16} />
          Novo Objetivo
        </button>
      </div>

      {/* Summary row */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 gap-3"
      >
        <motion.div variants={fadeInUp} className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <Target size={15} className="text-gray-400" />
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Objetivos</p>
          </div>
          <p className="text-2xl font-black text-gray-900">{okrs.length}</p>
        </motion.div>
        <motion.div variants={fadeInUp} className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <Crosshair size={15} className="text-gray-400" />
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Key Results</p>
          </div>
          <p className="text-2xl font-black text-gray-900">{doneKrs}<span className="text-gray-400 text-base font-normal">/{totalKrs}</span></p>
        </motion.div>
        <motion.div variants={fadeInUp} className="rounded-2xl bg-white border border-[#7B2FBE]/30 shadow-sm shadow-[#7B2FBE]/5 p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={15} className="text-[#7B2FBE]" />
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Progresso Geral</p>
          </div>
          <p className="text-2xl font-black text-[#7B2FBE]">{overallProgress}%</p>
        </motion.div>
      </motion.div>

      {/* OKR cards */}
      <div className="space-y-3">
        {okrs.map((obj) => {
          const objProgress = obj.keyResults.length > 0
            ? Math.round(obj.keyResults.reduce((s, kr) => s + getProgress(kr.atual, kr.meta), 0) / obj.keyResults.length)
            : 0
          const color = categoriaColors[obj.categoria] ?? '#6B7280'

          return (
            <motion.div
              key={obj.id}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Objective header */}
              <button
                onClick={() => toggleExpanded(obj.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                  <Crosshair size={18} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide" style={{ background: `${color}15`, color }}>
                      {obj.categoria}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">{obj.trimestre}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 truncate">{obj.titulo}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${objProgress}%`, background: color }}
                      />
                    </div>
                    <span className="text-xs font-black flex-shrink-0" style={{ color }}>{objProgress}%</span>
                  </div>
                </div>
                {obj.expanded ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
              </button>

              {/* Key Results */}
              {obj.expanded && (
                <div className="border-t border-gray-100 divide-y divide-gray-100">
                  {obj.keyResults.map((kr) => {
                    const pct = getProgress(kr.atual, kr.meta)
                    const done = pct >= 100
                    return (
                      <div key={kr.id} className="px-5 py-4 flex items-start gap-3">
                        {done
                          ? <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                          : <Circle size={16} className="text-gray-300 flex-shrink-0 mt-0.5" />
                        }
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-sm', done ? 'text-gray-400 line-through' : 'text-gray-700')}>{kr.descricao}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-1 rounded-full bg-gray-100">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${pct}%`, background: done ? '#10B981' : color }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
                              {kr.atual}/{kr.meta} {kr.unit}
                            </span>
                          </div>
                        </div>
                        <input
                          type="number"
                          value={kr.atual}
                          min={0}
                          max={kr.meta * 2}
                          onChange={e => updateKr(obj.id, kr.id, Number(e.target.value))}
                          className="w-20 text-sm text-right bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-900 focus:outline-none focus:border-[#7B2FBE] focus:ring-1 focus:ring-[#7B2FBE]/20 flex-shrink-0"
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
