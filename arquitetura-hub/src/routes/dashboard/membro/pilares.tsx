import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Layers } from 'lucide-react'
import { PilarAccordion } from '@/components/membro/PilarAccordion'
import { staggerContainer, fadeInUp } from '@/lib/motion'
import { mockPilares } from '@/lib/mocks/pilares'
import type { Pilar } from '@/types'

export const Route = createFileRoute('/dashboard/membro/pilares')({
  component: PilaresPage,
})

function PilaresPage() {
  const [pilares, setPilares] = useState<Pilar[]>(mockPilares)

  function handleToggleAcao(pilarId: string, acaoId: string, concluida: boolean) {
    setPilares(prev => prev.map(p => {
      if (p.id !== pilarId) return p
      return { ...p, acoes: p.acoes.map(a => a.id === acaoId ? { ...a, concluida } : a) }
    }))
  }

  function handleAddAcao(pilarId: string, texto: string) {
    setPilares(prev => prev.map(p => {
      if (p.id !== pilarId) return p
      const newAcao = {
        id: `a-${Date.now()}`,
        pilar_id: pilarId,
        texto,
        concluida: false,
        ordem: p.acoes.length + 1,
      }
      return { ...p, acoes: [...p.acoes, newAcao] }
    }))
  }

  const totalAcoes = pilares.reduce((s, p) => s + p.acoes.length, 0)
  const doneAcoes  = pilares.reduce((s, p) => s + p.acoes.filter(a => a.concluida).length, 0)
  const overallPct = totalAcoes > 0 ? Math.round((doneAcoes / totalAcoes) * 100) : 0

  return (
    <div className="space-y-6">

      {/* Cabeçalho + cadeia */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">

          {/* Mini cadeia de construção */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link to="/dashboard/membro/posicionamento">
              <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">01 Identidade</span>
            </Link>
            <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
            <span className="text-xs font-bold text-[#7B2FBE] bg-[#7B2FBE]/10 px-2 py-0.5 rounded-md">
              02 Pilares da Marca
            </span>
            <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
            <Link to="/dashboard/membro/marketing">
              <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">03 Marketing</span>
            </Link>
            <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
            <Link to="/dashboard/membro/kpis">
              <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">04 Resultados</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Pilares da Marca</h1>
          <p className="text-gray-400 text-sm">
            Definidos com seu mentor a partir da sua identidade — cada pilar traduz quem você é em ações concretas de presença
          </p>
        </div>

        <div className="text-right bg-white border border-[#7B2FBE]/20 rounded-2xl px-5 py-3 shadow-sm flex-shrink-0">
          <p className="text-3xl font-black text-[#7B2FBE]">{overallPct}%</p>
          <p className="text-xs text-gray-400">{doneAcoes}/{totalAcoes} ações</p>
        </div>
      </div>

      {/* Pilares */}
      {pilares.length === 0 ? (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible"
          className="rounded-2xl bg-white border border-gray-200 shadow-sm p-8 text-center"
        >
          <Layers size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500 mb-1">Pilares ainda não definidos</p>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Os pilares da sua marca são construídos com seu mentor a partir da identidade definida na sessão de posicionamento.
            Complete primeiro a etapa de Identidade.
          </p>
          <Link to="/dashboard/membro/posicionamento"
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-[#7B2FBE] hover:underline"
          >
            Ir para Minha Identidade <ChevronRight size={12} />
          </Link>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {pilares.map(pilar => (
            <PilarAccordion
              key={pilar.id}
              pilar={pilar}
              onToggleAcao={handleToggleAcao}
              onAddAcao={handleAddAcao}
            />
          ))}
        </motion.div>
      )}

      {/* Esta construção alimenta */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5"
      >
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Esta construção alimenta</p>
        <div className="grid sm:grid-cols-2 gap-3">

          <Link to="/dashboard/membro/marketing">
            <div className="group rounded-xl border border-gray-100 bg-gray-50 hover:border-[#7B2FBE]/20 hover:bg-[#7B2FBE]/[0.03] p-4 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-[#7B2FBE] tracking-widest">03</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#7B2FBE] transition-colors" />
              </div>
              <p className="text-sm font-bold text-gray-800 leading-tight mb-1.5">Marketing Anual</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Cada pilar define um eixo de conteúdo e presença. O calendário de marketing é construído sobre essas frentes.
              </p>
            </div>
          </Link>

          <Link to="/dashboard/membro/kpis">
            <div className="group rounded-xl border border-gray-100 bg-gray-50 hover:border-[#7B2FBE]/20 hover:bg-[#7B2FBE]/[0.03] p-4 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-[#7B2FBE] tracking-widest">04</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#7B2FBE] transition-colors" />
              </div>
              <p className="text-sm font-bold text-gray-800 leading-tight mb-1.5">Resultados</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                As ações de cada pilar geram os indicadores de alcance, autoridade e crescimento que você acompanha nos resultados.
              </p>
            </div>
          </Link>

        </div>
      </motion.div>

    </div>
  )
}
