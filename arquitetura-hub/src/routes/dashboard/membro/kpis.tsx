import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { CheckCircle, AlertCircle, XCircle, ChevronRight } from 'lucide-react'
import { KpiTable } from '@/components/membro/KpiTable'
import { mockKpis } from '@/lib/mocks/kpis'
import { getPercent, getStatusColor } from '@/lib/utils'
import { fadeInUp } from '@/lib/motion'
import type { KpiEntry } from '@/types'

export const Route = createFileRoute('/dashboard/membro/kpis')({
  component: KpisPage,
})

function KpisPage() {
  const [kpis, setKpis] = useState<KpiEntry[]>(mockKpis)

  const green  = kpis.filter(k => getStatusColor(getPercent(k.atual, k.meta)) === 'green').length
  const yellow = kpis.filter(k => getStatusColor(getPercent(k.atual, k.meta)) === 'yellow').length
  const red    = kpis.filter(k => getStatusColor(getPercent(k.atual, k.meta)) === 'red').length

  function handleUpdateAtual(id: string, value: number) {
    setKpis(prev => prev.map(k => {
      if (k.id !== id) return k
      const newHistory = [...k.history.slice(-5), value]
      return { ...k, atual: value, history: newHistory }
    }))
    toast.success('Indicador atualizado')
  }

  return (
    <div className="space-y-6">

      {/* Cabeçalho + cadeia */}
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
          <Link to="/dashboard/membro/marketing">
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">03 Marketing</span>
          </Link>
          <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
          <span className="text-xs font-bold text-[#7B2FBE] bg-[#7B2FBE]/10 px-2 py-0.5 rounded-md">
            04 Resultados
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Indicadores de Resultado</h1>
        <p className="text-gray-400 text-sm">
          O que a execução do seu plano está gerando — cada número aqui é consequência das ações nos pilares e no marketing
        </p>
      </div>

      {/* Resumo de status */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="grid grid-cols-3 gap-3"
      >
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
          <div>
            <p className="text-2xl font-black text-emerald-500 leading-none">{green}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">No alvo</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <AlertCircle size={18} className="text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-2xl font-black text-amber-500 leading-none">{yellow}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Atenção</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <XCircle size={18} className="text-red-400 flex-shrink-0" />
          <div>
            <p className="text-2xl font-black text-red-400 leading-none">{red}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Abaixo</p>
          </div>
        </div>
      </motion.div>

      <KpiTable kpis={kpis} onUpdateAtual={handleUpdateAtual} />

      {/* Alimenta */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5"
      >
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Os resultados alimentam</p>
        <div className="grid sm:grid-cols-2 gap-3">

          <Link to="/dashboard/membro/okr">
            <div className="group rounded-xl border border-gray-100 bg-gray-50 hover:border-[#7B2FBE]/20 hover:bg-[#7B2FBE]/[0.03] p-4 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-[#7B2FBE] tracking-widest">OKR</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#7B2FBE] transition-colors" />
              </div>
              <p className="text-sm font-bold text-gray-800 leading-tight mb-1.5">Revisão de Metas</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Os indicadores mostram se as metas definidas com o mentor estão sendo atingidas e o que precisa ser ajustado no próximo ciclo.
              </p>
            </div>
          </Link>

          <Link to="/dashboard/membro/relatorios">
            <div className="group rounded-xl border border-gray-100 bg-gray-50 hover:border-[#7B2FBE]/20 hover:bg-[#7B2FBE]/[0.03] p-4 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-[#7B2FBE] tracking-widest">REL</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#7B2FBE] transition-colors" />
              </div>
              <p className="text-sm font-bold text-gray-800 leading-tight mb-1.5">Relatórios de Evolução</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Os dados acumulados aqui compõem os relatórios de evolução que você e seu mentor revisam ao final de cada fase.
              </p>
            </div>
          </Link>

        </div>
      </motion.div>

    </div>
  )
}
