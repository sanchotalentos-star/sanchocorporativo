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
  'Autoridade': '#8B5CF6',
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
          <h1 className="text-2xl font-bold text-white">Meus OKRs</h1>
          <p className="text-[#4A7FA5] mt-1">Objetivos e Resultados-Chave para este trimestre</p>
        </div>
        <button className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-black text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
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
        <motion.div variants={fadeInUp} className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-4">
          <div className="flex items-center gap-2 mb-1">
            <Target size={15} className="text-[#4A7FA5]" />
            <p className="text-xs text-[#4A7FA5] uppercase tracking-wider">Objetivos</p>
          </div>
          <p className="text-2xl font-black text-white">{okrs.length}</p>
        </motion.div>
        <motion.div variants={fadeInUp} className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-4">
          <div className="flex items-center gap-2 mb-1">
            <Crosshair size={15} className="text-[#4A7FA5]" />
            <p className="text-xs text-[#4A7FA5] uppercase tracking-wider">Key Results</p>
          </div>
          <p className="text-2xl font-black text-white">{doneKrs}<span className="text-[#4A7FA5] text-base font-normal">/{totalKrs}</span></p>
        </motion.div>
        <motion.div variants={fadeInUp} className="rounded-2xl bg-[#0D1B2E] border border-[#F59E0B]/30 p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={15} className="text-[#F59E0B]" />
            <p className="text-xs text-[#4A7FA5] uppercase tracking-wider">Progresso Geral</p>
          </div>
          <p className="text-2xl font-black text-[#F59E0B]">{overallProgress}%</p>
        </motion.div>
      </motion.div>

      {/* OKR cards */}
      <div className="space-y-3">
        {okrs.map((obj) => {
          const objProgress = obj.keyResults.length > 0
            ? Math.round(obj.keyResults.reduce((s, kr) => s + getProgress(kr.atual, kr.meta), 0) / obj.keyResults.length)
            : 0
          const color = categoriaColors[obj.categoria] ?? '#4A7FA5'

          return (
            <motion.div
              key={obj.id}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] overflow-hidden"
            >
              {/* Objective header */}
              <button
                onClick={() => toggleExpanded(obj.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-[#112240] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <Crosshair size={18} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: `${color}20`, color }}>
                      {obj.categoria}
                    </span>
                    <span className="text-[10px] text-[#4A7FA5]">{obj.trimestre}</span>
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{obj.titulo}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 rounded-full bg-[#112240]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${objProgress}%`, background: color }}
                      />
                    </div>
                    <span className="text-xs font-bold flex-shrink-0" style={{ color }}>{objProgress}%</span>
                  </div>
                </div>
                {obj.expanded ? <ChevronUp size={16} className="text-[#4A7FA5] flex-shrink-0" /> : <ChevronDown size={16} className="text-[#4A7FA5] flex-shrink-0" />}
              </button>

              {/* Key Results */}
              {obj.expanded && (
                <div className="border-t border-[#1A2E4A] divide-y divide-[#1A2E4A]/50">
                  {obj.keyResults.map((kr) => {
                    const pct = getProgress(kr.atual, kr.meta)
                    const done = pct >= 100
                    return (
                      <div key={kr.id} className="px-5 py-4 flex items-start gap-3">
                        {done
                          ? <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                          : <Circle size={16} className="text-[#4A7FA5] flex-shrink-0 mt-0.5" />
                        }
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-sm', done ? 'text-[#4A7FA5] line-through' : 'text-white')}>{kr.descricao}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-1 rounded-full bg-[#112240]">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${pct}%`, background: done ? '#10B981' : color }}
                              />
                            </div>
                            <span className="text-xs text-[#4A7FA5] flex-shrink-0 whitespace-nowrap">
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
                          className="w-20 text-sm text-right bg-[#112240] border border-[#1A2E4A] rounded-lg px-2 py-1 text-white focus:outline-none focus:border-[#F59E0B] flex-shrink-0"
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
