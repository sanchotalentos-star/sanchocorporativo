import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Users, TrendingUp, Target, Award, ArrowRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { KpiCard } from '@/components/shared/KpiCard'
import { staggerContainer, fadeInUp } from '@/lib/motion'
import { useAuth } from '@/context/AuthContext'
import { mockMembers } from '@/lib/mocks/members'
import { mockEventos } from '@/lib/mocks/eventos'

export const Route = createFileRoute('/dashboard/membro/')({
  component: MembroDashboard,
})

const tipoColors: Record<string, string> = {
  'Conteúdo': '#3B82F6',
  'Evento': '#7B2FBE',
  'Mídia': '#F59E0B',
  'Relacionamento': '#10B981',
  'Meta': '#EF4444',
}

const phases = [
  { num: 1, label: 'OKR & MVP de Produtos', deliverables: ['OKR', 'Formatação do produto', 'MVP'], active: true, done: false },
  { num: 2, label: 'Primeiras Vitórias', deliverables: ['Posicionamento & Autoridade', 'Agenda de Marketing', 'Agenda de Eventos'], active: false, done: false },
  { num: 3, label: 'PDCA → OKR', deliverables: ['Revisão de OKR', 'PDCA ciclo 1', 'Story Telling'], active: false, done: false },
  { num: 4, label: 'PDCA → OKR', deliverables: ['PDCA ciclo 2', 'Escala & Autoridade'], active: false, done: false },
]

const quickLinks = [
  { num: '01', label: 'Meus OKRs', desc: 'Objetivos e resultados-chave', href: '/dashboard/membro/okr' },
  { num: '02', label: 'Posicionamento', desc: 'Zona de Genialidade', href: '/dashboard/membro/posicionamento' },
  { num: '03', label: 'Marketing Anual', desc: 'Agenda de conteúdo', href: '/dashboard/membro/marketing' },
  { num: '04', label: 'Pilares', desc: 'Ações estratégicas', href: '/dashboard/membro/pilares' },
]

function MembroDashboard() {
  const { user } = useAuth()
  const foundMember = mockMembers.find(m => m.id === user?.id)
  const member = foundMember ?? {
    ...mockMembers[0],
    id: user?.id ?? 'me',
    full_name: user?.full_name ?? mockMembers[0].full_name,
    email: user?.email ?? mockMembers[0].email,
  }

  const today = new Date()
  const upcomingEvents = mockEventos
    .filter(e => new Date(e.data + 'T00:00:00') >= today)
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 4)

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="relative rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0533 0%, #3d1278 50%, #7B2FBE 100%)' }}
      >
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 80% 50%, #ffffff15 0%, transparent 60%)'
        }} />
        <div className="relative px-6 py-7 flex items-center justify-between gap-4">
          <div>
            <p className="text-white/60 text-sm font-bold uppercase tracking-widest">Bem-vindo(a) de volta,</p>
            <h1 className="text-2xl font-black text-white mt-0.5 uppercase tracking-tight">{member.full_name}</h1>
            <p className="text-white/60 text-sm mt-2 max-w-sm">
              Continue construindo sua arquitetura de relevância e autoridade de mercado.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Fase 1 — OKR & MVP
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1">Score de Autoridade</p>
            <p className="text-5xl font-black text-white leading-none">{member.score}</p>
            <p className="text-white/50 text-xs mt-1 font-medium">/ 100 pts</p>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <KpiCard label="Alcance Orgânico" value={member.alcance >= 1000 ? `${(member.alcance / 1000).toFixed(1)}k` : member.alcance} unit="pessoas" icon={Users} trend={12} />
        <KpiCard label="Leads Qualificados" value={member.leads} icon={Target} trend={8} />
        <KpiCard label="Score de Autoridade" value={member.score} unit="pts" icon={Award} accent trend={5} />
        <KpiCard label="Menções & Citações" value={14} icon={TrendingUp} trend={-2} />
      </motion.div>

      {/* Quick links */}
      <div>
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Ferramentas do Programa</h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {quickLinks.map((item) => (
            <motion.div key={item.href} variants={fadeInUp}>
              <Link to={item.href}>
                <div className="group rounded-2xl bg-white border border-gray-200 p-5 hover:border-[#7B2FBE]/20 hover:shadow-sm transition-all cursor-pointer h-full flex flex-col">
                  <span className="text-[11px] font-black text-[#7B2FBE] tracking-widest mb-3 block">{item.num}</span>
                  <p className="text-sm font-black text-gray-900 uppercase tracking-tight leading-tight flex-1">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{item.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-[#7B2FBE] transition-colors">
                    Acessar <ArrowRight size={10} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Chart + Events */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Growth chart */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Crescimento — 6 Meses</h3>
            <Link to="/dashboard/membro/relatorios" className="text-xs text-gray-400 hover:text-[#7B2FBE] flex items-center gap-1 transition-colors font-bold uppercase tracking-wide">
              Ver mais <ArrowRight size={11} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={member.growth} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: '#111827' }}
                itemStyle={{ color: '#6B7280' }}
              />
              <Line type="monotone" dataKey="alcance" stroke="#7B2FBE" strokeWidth={2.5} dot={false} name="Alcance" />
              <Line type="monotone" dataKey="leads" stroke="#3B82F6" strokeWidth={2.5} dot={false} name="Leads" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Upcoming events */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Próximos Eventos</h3>
            <Link to="/dashboard/membro/agenda" className="text-xs text-gray-400 hover:text-[#7B2FBE] flex items-center gap-1 transition-colors font-bold uppercase tracking-wide">
              Ver agenda <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">Nenhum evento próximo</p>
            ) : upcomingEvents.map(ev => (
              <div key={ev.id} className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
                <div className="flex-shrink-0 text-center w-8 pt-0.5">
                  <p className="text-[10px] font-black text-gray-400 uppercase leading-none">
                    {ev.data.split('-')[1] ? ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][parseInt(ev.data.split('-')[1]) - 1] : ''}
                  </p>
                  <p className="text-lg font-black text-gray-900 leading-none mt-0.5">{ev.data.split('-')[2]}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{ev.titulo}</p>
                  <span
                    className="text-[10px] font-black uppercase tracking-widest mt-0.5"
                    style={{ color: tipoColors[ev.tipo] ?? '#9CA3AF' }}
                  >
                    {ev.tipo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Phase tracker */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5"
      >
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-4">Jornada do Programa — 4 Fases</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {phases.map((phase) => (
            <div
              key={phase.num}
              className={`rounded-xl p-4 border transition-all ${
                phase.active
                  ? 'bg-[#7B2FBE]/5 border-[#7B2FBE]/30'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                  phase.active ? 'bg-[#7B2FBE] text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {phase.num}
                </div>
                {phase.active && (
                  <span className="text-[10px] font-black bg-[#7B2FBE] text-white px-1.5 py-0.5 rounded-md uppercase tracking-wide">ATUAL</span>
                )}
              </div>
              <p className={`text-xs font-black mb-2 uppercase tracking-tight ${phase.active ? 'text-gray-900' : 'text-gray-400'}`}>
                {phase.label}
              </p>
              <div className="space-y-1 mt-1">
                {phase.deliverables.map((d) => (
                  <div key={d} className="flex items-center gap-1.5">
                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${phase.active ? 'bg-[#7B2FBE]' : 'bg-gray-300'}`} />
                    <span className={`text-[10px] leading-relaxed ${phase.active ? 'text-gray-600' : 'text-gray-300'}`}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
