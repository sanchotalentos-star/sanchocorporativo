import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Layers, ChevronDown, ChevronUp } from 'lucide-react'
import { PilarAccordion } from '@/components/membro/PilarAccordion'
import { staggerContainer, fadeInUp } from '@/lib/motion'
import { mockPilares } from '@/lib/mocks/pilares'
import { getIdentidade, PILAR_LABELS } from '@/lib/identidade'
import type { Pilar } from '@/types'

export const Route = createFileRoute('/dashboard/membro/pilares')({
  component: PilaresPage,
})

function PilaresPage() {
  const [pilares, setPilares] = useState<Pilar[]>(mockPilares)
  const [identidadeOpen, setIdentidadeOpen] = useState(true)
  const identidade = getIdentidade()
  const pilarFields = ['publicoAlvo', 'proposta', 'storytelling', 'formatoProduto'] as const
  const identidadePreenchida = identidade
    ? pilarFields.filter(f => identidade.pilares[f]?.reflexao?.trim()).length
    : 0

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

      {/* Identidade de base — referência para construção dos pilares */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
      >
        <button
          onClick={() => setIdentidadeOpen(o => !o)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-[#7B2FBE] tracking-widest">01</span>
              <p className="text-sm font-bold text-gray-900">Identidade de Marca</p>
            </div>
            {identidadePreenchida > 0 && (
              <span className="text-[10px] font-semibold text-[#7B2FBE] bg-[#7B2FBE]/10 px-2 py-0.5 rounded-full">
                {identidadePreenchida}/4 blocos
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Base de construção dos pilares</span>
            {identidadeOpen
              ? <ChevronUp size={14} className="text-gray-400" />
              : <ChevronDown size={14} className="text-gray-400" />
            }
          </div>
        </button>

        {identidadeOpen && (
          <div className="border-t border-gray-100 bg-gray-50/50">
            {identidadePreenchida === 0 ? (
              <div className="px-5 py-5 text-center">
                <p className="text-sm text-gray-400 mb-2">Nenhuma reflexão preenchida ainda.</p>
                <Link to="/dashboard/membro/posicionamento"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7B2FBE] hover:underline"
                >
                  Preencher Minha Identidade <ChevronRight size={12} />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pilarFields.map((field, i) => {
                  const texto = identidade?.pilares[field]?.reflexao?.trim()
                  return (
                    <div key={field} className="px-5 py-3.5 flex items-start gap-3">
                      <span className="text-[10px] font-black text-[#7B2FBE] tracking-widest w-5 flex-shrink-0 mt-0.5">
                        0{i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                          {PILAR_LABELS[field]}
                        </p>
                        {texto
                          ? <p className="text-sm text-gray-700 leading-relaxed">{texto}</p>
                          : <p className="text-sm text-gray-300 italic">Não preenchido</p>
                        }
                      </div>
                    </div>
                  )
                })}
                {identidade && identidade.diferenciais.some(d => d.trim()) && (
                  <div className="px-5 py-3.5 flex items-start gap-3">
                    <span className="text-[10px] font-black text-[#7B2FBE] tracking-widest w-5 flex-shrink-0 mt-0.5">05</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Diferenciais</p>
                      <div className="space-y-1">
                        {identidade.diferenciais.filter(d => d.trim()).map((d, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#7B2FBE] flex-shrink-0" />
                            <p className="text-sm text-gray-700">{d}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="px-5 py-3 flex justify-end">
                  <Link to="/dashboard/membro/posicionamento"
                    className="text-xs font-semibold text-[#7B2FBE] hover:underline flex items-center gap-1"
                  >
                    Editar identidade <ChevronRight size={11} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

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
