import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Plus, Calendar, Instagram, Youtube, Mic, FileText, Video, Mail, Trash2, ChevronRight } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/motion'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/membro/marketing')({
  component: MarketingPage,
})

type Canal = 'LinkedIn' | 'Instagram' | 'YouTube' | 'Podcast' | 'Email' | 'Blog' | 'Live'
type Frequencia = 'Semanal' | 'Quinzenal' | 'Mensal' | 'Diário'

interface AcaoMarketing {
  id: string
  titulo: string
  canal: Canal
  frequencia: Frequencia
  mes: number
  concluida: boolean
}

const canalIcons: Record<Canal, React.ElementType> = {
  LinkedIn: FileText,
  Instagram: Instagram,
  YouTube: Youtube,
  Podcast: Mic,
  Email: Mail,
  Blog: FileText,
  Live: Video,
}

const canalColors: Record<Canal, string> = {
  LinkedIn: '#3B82F6',
  Instagram: '#7B2FBE',
  YouTube: '#EF4444',
  Podcast: '#F59E0B',
  Email: '#10B981',
  Blog: '#6B7280',
  Live: '#EC4899',
}

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const initialAcoes: AcaoMarketing[] = [
  { id: 'm1', titulo: 'Artigos de autoridade no LinkedIn', canal: 'LinkedIn', frequencia: 'Semanal', mes: 1, concluida: false },
  { id: 'm2', titulo: 'Reels educativos sobre posicionamento', canal: 'Instagram', frequencia: 'Semanal', mes: 1, concluida: false },
  { id: 'm3', titulo: 'Newsletter semanal para leads', canal: 'Email', frequencia: 'Semanal', mes: 1, concluida: true },
  { id: 'm4', titulo: 'Podcast — episódio mensal', canal: 'Podcast', frequencia: 'Mensal', mes: 2, concluida: false },
  { id: 'm5', titulo: 'Lives de conteúdo gratuito', canal: 'Live', frequencia: 'Quinzenal', mes: 2, concluida: false },
  { id: 'm6', titulo: 'Vídeos de bastidores e case studies', canal: 'YouTube', frequencia: 'Quinzenal', mes: 3, concluida: false },
]

function MarketingPage() {
  const [acoes, setAcoes] = useState<AcaoMarketing[]>(initialAcoes)
  const [mesFiltro, setMesFiltro] = useState<number | null>(null)
  const [canalFiltro, setCanalFiltro] = useState<Canal | null>(null)

  function toggleConcluida(id: string) {
    setAcoes(prev => prev.map(a => a.id === id ? { ...a, concluida: !a.concluida } : a))
  }

  function deleteAcao(id: string) {
    setAcoes(prev => prev.filter(a => a.id !== id))
  }

  const filtered = acoes.filter(a => {
    if (mesFiltro !== null && a.mes !== mesFiltro) return false
    if (canalFiltro !== null && a.canal !== canalFiltro) return false
    return true
  })

  const canais = [...new Set(acoes.map(a => a.canal))] as Canal[]
  const concluidas = acoes.filter(a => a.concluida).length
  const progresso = acoes.length > 0 ? Math.round((concluidas / acoes.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Cabeçalho + cadeia */}
      <div className="flex items-start justify-between gap-4">
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
              03 Marketing Anual
            </span>
            <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
            <Link to="/dashboard/membro/kpis">
              <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">04 Resultados</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Marketing Anual</h1>
          <p className="text-gray-400 text-sm">
            Construído sobre os pilares da sua marca — cada ação de conteúdo tem origem na sua identidade e nos canais definidos com o mentor
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#7B2FBE] hover:bg-[#6a27a5] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors flex-shrink-0">
          <Plus size={16} />
          Nova Ação
        </button>
      </div>

      {/* Progress bar */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Megaphone size={16} className="text-[#7B2FBE]" />
            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Execução do Plano Anual</p>
          </div>
          <span className="text-sm font-black text-[#7B2FBE]">{concluidas}/{acoes.length} ações</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-gray-100">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progresso}%`, background: 'linear-gradient(90deg, #7B2FBE, #a855f7)' }} />
        </div>
      </motion.div>

      {/* Canal stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2"
      >
        {canais.map(canal => {
          const Icon = canalIcons[canal]
          const color = canalColors[canal]
          const count = acoes.filter(a => a.canal === canal).length
          const active = canalFiltro === canal
          return (
            <motion.button
              key={canal}
              variants={fadeInUp}
              onClick={() => setCanalFiltro(active ? null : canal)}
              className={cn(
                'rounded-xl p-3 flex flex-col items-center gap-1.5 border transition-all bg-white',
                active ? '' : 'border-gray-200 hover:border-gray-300 shadow-sm'
              )}
              style={active ? { background: `${color}10`, borderColor: `${color}40` } : {}}
            >
              <Icon size={15} style={{ color: active ? color : '#9CA3AF' }} />
              <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: active ? color : '#9CA3AF' }}>{canal}</p>
              <span className="text-[10px] font-bold text-gray-900">{count}</span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Mes filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setMesFiltro(null)}
          className={cn(
            'flex-shrink-0 text-xs font-black px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wide',
            mesFiltro === null ? 'bg-[#7B2FBE] text-white shadow-sm' : 'bg-gray-100 text-gray-400 hover:text-gray-700'
          )}
        >
          Todos
        </button>
        {meses.map((mes, i) => (
          <button
            key={mes}
            onClick={() => setMesFiltro(mesFiltro === i + 1 ? null : i + 1)}
            className={cn(
              'flex-shrink-0 text-xs font-black px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wide',
              mesFiltro === i + 1 ? 'bg-[#7B2FBE] text-white shadow-sm' : 'bg-gray-100 text-gray-400 hover:text-gray-700'
            )}
          >
            {mes}
          </button>
        ))}
      </div>

      {/* Actions list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-8 text-center">
            <Calendar size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500 mb-1">Nenhuma ação para este filtro</p>
            <p className="text-xs text-gray-400">As ações do calendário são definidas com seu mentor com base nos pilares da sua marca</p>
          </div>
        ) : filtered.map((acao) => {
          const Icon = canalIcons[acao.canal]
          const color = canalColors[acao.canal]
          return (
            <motion.div
              key={acao.id}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className={cn(
                'rounded-xl bg-white border px-4 py-3.5 flex items-center gap-3 group transition-all shadow-sm',
                acao.concluida ? 'border-gray-100 opacity-60' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              )}
            >
              <button
                onClick={() => toggleConcluida(acao.id)}
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  borderColor: acao.concluida ? '#10B981' : color,
                  background: acao.concluida ? '#10B981' : 'transparent',
                }}
              >
                {acao.concluida && <span className="text-white text-xs">✓</span>}
              </button>

              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}12` }}>
                <Icon size={13} style={{ color }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold', acao.concluida ? 'line-through text-gray-400' : 'text-gray-900')}>
                  {acao.titulo}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wide"
                    style={{ background: `${color}12`, color }}>
                    {acao.canal}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">{acao.frequencia}</span>
                  <span className="text-[10px] text-gray-400">• {meses[acao.mes - 1]}</span>
                </div>
              </div>

              <button
                onClick={() => deleteAcao(acao.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          )
        })}
      </div>
      {/* Esta construção alimenta */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5"
      >
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Esta construção alimenta</p>
        <div className="grid sm:grid-cols-2 gap-3">

          <Link to="/dashboard/membro/kpis">
            <div className="group rounded-xl border border-gray-100 bg-gray-50 hover:border-[#7B2FBE]/20 hover:bg-[#7B2FBE]/[0.03] p-4 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-[#7B2FBE] tracking-widest">04</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#7B2FBE] transition-colors" />
              </div>
              <p className="text-sm font-bold text-gray-800 leading-tight mb-1.5">Resultados</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Cada ação executada no calendário gera os indicadores de alcance, engajamento e leads que você acompanha nos resultados.
              </p>
            </div>
          </Link>

          <Link to="/dashboard/membro/okr">
            <div className="group rounded-xl border border-gray-100 bg-gray-50 hover:border-[#7B2FBE]/20 hover:bg-[#7B2FBE]/[0.03] p-4 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-[#7B2FBE] tracking-widest">OKR</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#7B2FBE] transition-colors" />
              </div>
              <p className="text-sm font-bold text-gray-800 leading-tight mb-1.5">Metas de Impacto</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Os resultados do marketing alimentam os ciclos de revisão das metas definidas com o mentor na sessão de OKR.
              </p>
            </div>
          </Link>

        </div>
      </motion.div>

    </div>
  )
}
