import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { CheckCircle, AlertCircle, XCircle, ChevronRight, Plus, X } from 'lucide-react'
import { KpiTable } from '@/components/membro/KpiTable'
import { getPercent, getStatusColor } from '@/lib/utils'
import { fadeInUp } from '@/lib/motion'
import type { KpiEntry, KpiCategory } from '@/types'

export const Route = createFileRoute('/dashboard/membro/kpis')({
  component: KpisPage,
})

const KPI_KEY = 'kpis_store_v1'
const CATEGORIAS: KpiCategory[] = ['Conteúdo', 'Conversão', 'Autoridade', 'Mídia', 'Rede', 'Receita']

function KpisPage() {
  const [kpis, setKpis] = useState<KpiEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(KPI_KEY) ?? 'null') ?? [] }
    catch { return [] }
  })
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ kpi_name: '', category: 'Conteúdo' as KpiCategory, meta: '', unit: '' })

  useEffect(() => {
    try { localStorage.setItem(KPI_KEY, JSON.stringify(kpis)) } catch {}
  }, [kpis])

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

  function handleDelete(id: string) {
    setKpis(prev => prev.filter(k => k.id !== id))
    toast.success('Indicador removido')
  }

  function addKpi() {
    const nome = form.kpi_name.trim()
    const meta = parseFloat(form.meta)
    if (!nome || isNaN(meta) || meta <= 0) return
    const entry: KpiEntry = {
      id: Date.now().toString(),
      user_id: 'local',
      kpi_name: nome,
      category: form.category,
      meta,
      atual: 0,
      unit: form.unit.trim() || '',
      history: [0],
      updated_at: new Date().toISOString(),
    }
    setKpis(prev => [...prev, entry])
    setForm({ kpi_name: '', category: 'Conteúdo', meta: '', unit: '' })
    setShowModal(false)
    toast.success('Indicador adicionado')
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
          <Link to="/dashboard/membro/okr">
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">03 OKRs</span>
          </Link>
          <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
          <Link to="/dashboard/membro/marketing">
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">04 Marketing</span>
          </Link>
          <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
          <span className="text-xs font-bold text-[#7B2FBE] bg-[#7B2FBE]/10 px-2 py-0.5 rounded-md">
            05 Resultados
          </span>
        </div>

        <div className="flex items-start justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-900">Indicadores de Resultado</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#7B2FBE] hover:bg-[#6a27a5] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm flex-shrink-0"
        >
          <Plus size={14} /> Novo Indicador
        </button>
        </div>
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
            <p className="text-2xl font-semibold text-emerald-500 leading-none">{green}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">No alvo</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <AlertCircle size={18} className="text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-2xl font-semibold text-amber-500 leading-none">{yellow}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Atenção</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <XCircle size={18} className="text-red-400 flex-shrink-0" />
          <div>
            <p className="text-2xl font-semibold text-red-400 leading-none">{red}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Abaixo</p>
          </div>
        </div>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Novo Indicador</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1">Nome do Indicador</label>
                <input autoFocus type="text" value={form.kpi_name}
                  onChange={e => setForm(f => ({ ...f, kpi_name: e.target.value }))}
                  placeholder="Ex: Posts publicados no mês"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#7B2FBE]"
                  onKeyDown={e => e.key === 'Enter' && addKpi()}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-gray-500 block mb-1">Categoria</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as KpiCategory }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#7B2FBE] bg-white">
                    {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-500 block mb-1">Meta</label>
                  <input type="number" value={form.meta}
                    onChange={e => setForm(f => ({ ...f, meta: e.target.value }))}
                    placeholder="Ex: 12"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#7B2FBE]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1">Unidade</label>
                <input type="text" value={form.unit}
                  onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                  placeholder="Ex: posts, leads, %"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#7B2FBE]"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={addKpi} disabled={!form.kpi_name.trim() || !form.meta}
                className="flex-1 bg-[#7B2FBE] hover:bg-[#6a27a5] disabled:opacity-40 text-white text-sm font-medium py-2.5 rounded-xl">
                Adicionar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {kpis.length === 0 ? (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible"
          className="rounded-2xl bg-white border border-gray-200 shadow-sm p-8 text-center"
        >
          <CheckCircle size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500 mb-1">Nenhum indicador cadastrado ainda</p>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Os indicadores de resultado são definidos com seu mentor na sessão de OKR. Eles aparecerão aqui após a primeira sessão.
          </p>
        </motion.div>
      ) : (
        <KpiTable kpis={kpis} onUpdateAtual={handleUpdateAtual} onDelete={handleDelete} />
      )}

      {/* Alimenta */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5"
      >
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-4">Os resultados alimentam</p>
        <div className="grid sm:grid-cols-2 gap-3">

          <Link to="/dashboard/membro/okr">
            <div className="group rounded-xl border border-gray-100 bg-gray-50 hover:border-[#7B2FBE]/20 hover:bg-[#7B2FBE]/[0.03] p-4 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-[#7B2FBE] tracking-widest">OKR</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#7B2FBE] transition-colors" />
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-tight mb-1.5">Revisão de Metas</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Os indicadores mostram se as metas definidas com o mentor estão sendo atingidas e o que precisa ser ajustado no próximo ciclo.
              </p>
            </div>
          </Link>

          <Link to="/dashboard/membro/relatorios">
            <div className="group rounded-xl border border-gray-100 bg-gray-50 hover:border-[#7B2FBE]/20 hover:bg-[#7B2FBE]/[0.03] p-4 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-[#7B2FBE] tracking-widest">REL</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#7B2FBE] transition-colors" />
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-tight mb-1.5">Relatórios de Evolução</p>
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
