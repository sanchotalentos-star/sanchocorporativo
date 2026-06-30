import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Users, TrendingUp, Target, Award, ArrowRight, Calendar, Crosshair, Zap, Megaphone, CheckCircle2 } from 'lucide-react'
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
  'Evento': '#8B5CF6',
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
  { label: 'Meus OKRs', desc: 'Objetivos e resultados-chave', href: '/dashboard/membro/okr', icon: Crosshair, color: '#3B82F6' },
  { label: 'Posicionamento', desc: 'Zona de Genialidade', href: '/dashboard/membro/posicionamento', icon: Zap, color: '#8B5CF6' },
  { label: 'Marketing Anual', desc: 'Agenda de conteúdo', href: '/dashboard/membro/marketing', icon: Megaphone, color: '#10B981' },
  { label: 'Pilares', desc: 'Ações estratégicas', href: '/dashboard/membro/pilares', icon: Target, color: '#F59E0B' },
]

function MembroDashboard() {
  const { user } = useAuth()
  const member = mockMembers.find(m => m.id === user?.id) ?? mockMembers[0]

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
        style={{ background: 'linear-gradient(135deg, #0D2140 0%, #0A1A30 50%, #070E1A 100%)' }}
      >
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 80% 50%, #F59E0B22 0%, transparent 60%)'
        }} />
        <div className="relative px-6 py-7 flex items-center justify-between gap-4">
          <div>
            <p className="text-[#4A7FA5] text-sm font-medium">Bem-vindo(a) de volta,</p>
            <h1 className="text-2xl font-bold text-white mt-0.5">{member.full_name}</h1>
            <p className="text-[#4A7FA5] text-sm mt-2 max-w-sm">
              Continue construindo sua arquitetura de relevância e autoridade de mercado.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                Fase 1 — OKR & MVP
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-[#4A7FA5] text-xs mb-1">Score de Autoridade</p>
            <p className="text-5xl font-black text-[#F59E0B] leading-none">{member.score}</p>
            <p className="text-[#4A7FA5] text-xs mt-1">/ 100 pts</p>
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
        <h2 className="text-xs font-bold text-[#4A7FA5] uppercase tracking-widest mb-3">Ferramentas do Programa</h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {quickLinks.map((item) => (
            <motion.div key={item.href} variants={fadeInUp}>
              <Link to={item.href}>
                <div className="group rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-4 hover:border-[#2A4A6E] hover:bg-[#112240] transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                    <item.icon size={18} style={{ color: item.color }} />
                  </div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-[#4A7FA5] mt-0.5">{item.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs font-medium" style={{ color: item.color }}>
                    Acessar <ArrowRight size={11} />
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
          className="lg:col-span-2 rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Crescimento — 6 Meses</h3>
            <Link to="/dashboard/membro/relatorios" className="text-xs text-[#4A7FA5] hover:text-[#F59E0B] flex items-center gap-1 transition-colors">
              Ver mais <ArrowRight size={11} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={member.growth} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#4A7FA5' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#4A7FA5' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0D1B2E', border: '1px solid #1A2E4A', borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: '#E2EBF0' }}
                itemStyle={{ color: '#4A7FA5' }}
              />
              <Line type="monotone" dataKey="alcance" stroke="#3B82F6" strokeWidth={2} dot={false} name="Alcance" />
              <Line type="monotone" dataKey="leads" stroke="#F59E0B" strokeWidth={2} dot={false} name="Leads" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Upcoming events */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Próximos Eventos</h3>
            <Link to="/dashboard/membro/agenda" className="text-xs text-[#4A7FA5] hover:text-[#F59E0B] flex items-center gap-1 transition-colors">
              Ver agenda <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-[#4A7FA5] py-4 text-center">Nenhum evento próximo</p>
            ) : upcomingEvents.map(ev => (
              <div key={ev.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#112240] transition-colors">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${tipoColors[ev.tipo] ?? '#4A7FA5'}18` }}
                >
                  <Calendar size={13} style={{ color: tipoColors[ev.tipo] ?? '#4A7FA5' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{ev.titulo}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-[#4A7FA5]">{ev.data.split('-').reverse().join('/')}</p>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{ background: `${tipoColors[ev.tipo] ?? '#4A7FA5'}20`, color: tipoColors[ev.tipo] ?? '#4A7FA5' }}
                    >
                      {ev.tipo}
                    </span>
                  </div>
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
        className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-5"
      >
        <h3 className="text-sm font-bold text-white mb-4">Jornada do Programa — 4 Fases</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {phases.map((phase) => (
            <div
              key={phase.num}
              className={`rounded-xl p-4 border transition-all ${
                phase.active
                  ? 'bg-[#0F2A47] border-[#F59E0B]/40'
                  : 'bg-[#0A1420] border-[#1A2E4A]'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                  phase.active ? 'bg-[#F59E0B] text-black' : 'bg-[#112240] text-[#3A5A7A]'
                }`}>
                  {phase.num}
                </div>
                {phase.active && (
                  <span className="text-[10px] font-bold bg-[#F59E0B] text-black px-1.5 py-0.5 rounded-md">ATUAL</span>
                )}
              </div>
              <p className={`text-xs font-semibold mb-2 ${phase.active ? 'text-white' : 'text-[#3A5A7A]'}`}>
                {phase.label}
              </p>
              <div className="space-y-1">
                {phase.deliverables.map((d) => (
                  <div key={d} className="flex items-center gap-1.5">
                    <CheckCircle2 size={10} className={phase.active ? 'text-[#F59E0B]' : 'text-[#1A2E4A]'} />
                    <span className={`text-[10px] ${phase.active ? 'text-[#4A7FA5]' : 'text-[#1E3A5A]'}`}>{d}</span>
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
