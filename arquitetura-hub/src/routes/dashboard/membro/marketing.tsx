import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Plus, Calendar, Instagram, Youtube, Mic, FileText, Video, Mail, Trash2 } from 'lucide-react'
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
  Instagram: '#8B5CF6',
  YouTube: '#EF4444',
  Podcast: '#F59E0B',
  Email: '#10B981',
  Blog: '#4A7FA5',
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
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Agenda de Marketing Anual</h1>
          <p className="text-[#4A7FA5] mt-1">Planeje suas ações de conteúdo e distribuição ao longo do ano</p>
        </div>
        <button className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-black text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={16} />
          Nova Ação
        </button>
      </div>

      {/* Progress bar */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Megaphone size={16} className="text-[#F59E0B]" />
            <p className="text-sm font-semibold text-white">Execução do Plano Anual</p>
          </div>
          <span className="text-sm font-bold text-[#F59E0B]">{concluidas}/{acoes.length} ações</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[#112240]">
          <div className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] transition-all duration-500"
            style={{ width: `${progresso}%` }} />
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
                'rounded-xl p-3 flex flex-col items-center gap-1.5 border transition-all',
                active ? 'border-opacity-60 bg-opacity-10' : 'border-[#1A2E4A] bg-[#0D1B2E] hover:border-[#2A4A6E]'
              )}
              style={active ? { background: `${color}12`, borderColor: `${color}50` } : {}}
            >
              <Icon size={15} style={{ color: active ? color : '#4A7FA5' }} />
              <p className="text-[10px] font-semibold" style={{ color: active ? color : '#4A7FA5' }}>{canal}</p>
              <span className="text-[10px] font-bold text-white">{count}</span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Mes filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setMesFiltro(null)}
          className={cn(
            'flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors',
            mesFiltro === null ? 'bg-[#F59E0B] text-black' : 'bg-[#112240] text-[#4A7FA5] hover:text-white'
          )}
        >
          Todos
        </button>
        {meses.map((mes, i) => (
          <button
            key={mes}
            onClick={() => setMesFiltro(mesFiltro === i + 1 ? null : i + 1)}
            className={cn(
              'flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors',
              mesFiltro === i + 1 ? 'bg-[#F59E0B] text-black' : 'bg-[#112240] text-[#4A7FA5] hover:text-white'
            )}
          >
            {mes}
          </button>
        ))}
      </div>

      {/* Actions list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-8 text-center">
            <Calendar size={32} className="text-[#1A2E4A] mx-auto mb-2" />
            <p className="text-[#4A7FA5] text-sm">Nenhuma ação para este filtro</p>
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
                'rounded-xl bg-[#0D1B2E] border px-4 py-3.5 flex items-center gap-3 group transition-all',
                acao.concluida ? 'border-[#112240] opacity-60' : 'border-[#1A2E4A] hover:border-[#2A4A6E]'
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
                style={{ background: `${color}15` }}>
                <Icon size={13} style={{ color }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium', acao.concluida ? 'line-through text-[#4A7FA5]' : 'text-white')}>
                  {acao.titulo}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: `${color}15`, color }}>
                    {acao.canal}
                  </span>
                  <span className="text-[10px] text-[#4A7FA5]">{acao.frequencia}</span>
                  <span className="text-[10px] text-[#4A7FA5]">• {meses[acao.mes - 1]}</span>
                </div>
              </div>

              <button
                onClick={() => deleteAcao(acao.id)}
                className="opacity-0 group-hover:opacity-100 text-[#4A7FA5] hover:text-red-400 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
