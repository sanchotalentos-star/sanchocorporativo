import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Users, TrendingUp, Target, Award, ArrowRight, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { KpiCard } from '@/components/shared/KpiCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { staggerContainer, fadeInUp } from '@/lib/motion'
import { useAuth } from '@/context/AuthContext'
import { mockMembers } from '@/lib/mocks/members'
import { mockEventos } from '@/lib/mocks/eventos'

export const Route = createFileRoute('/dashboard/membro/')({
  component: MembroDashboard,
})

const tipoColors: Record<string, string> = {
  'Conteúdo': 'blue',
  'Evento': 'purple',
  'Mídia': 'accent',
  'Relacionamento': 'green',
  'Meta': 'yellow',
}

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
      {/* Welcome banner */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-[#1B3A5C] to-[#2D5A8E] rounded-xl p-6 text-white"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm">Bem-vindo(a) de volta,</p>
            <h1 className="text-2xl font-bold mt-0.5">{member.full_name}</h1>
            <p className="text-white/60 text-sm mt-2">Continue construindo sua autoridade de mercado</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-white/60 text-xs mb-1">Score de Autoridade</p>
            <p className="text-4xl font-bold text-[#F59E0B]">{member.score}</p>
            <p className="text-white/50 text-xs">/ 100 pts</p>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <KpiCard label="Alcance Orgânico" value={member.alcance >= 1000 ? `${(member.alcance / 1000).toFixed(1)}k` : member.alcance} unit="pessoas" icon={Users} trend={12} />
        <KpiCard label="Leads Qualificados" value={member.leads} icon={Target} trend={8} />
        <KpiCard label="Score de Autoridade" value={member.score} unit="pts" icon={Award} accent trend={5} />
        <KpiCard label="Menções & Citações" value={14} icon={TrendingUp} trend={-2} />
      </motion.div>

      {/* Growth chart + upcoming events */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Crescimento — 6 Meses</CardTitle>
            <Link to="/dashboard/membro/relatorios" className="text-xs text-[#1B3A5C] hover:underline flex items-center gap-1">
              Ver mais <ArrowRight size={12} />
            </Link>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={member.growth} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
                <Line type="monotone" dataKey="alcance" stroke="#1B3A5C" strokeWidth={2} dot={false} name="Alcance" />
                <Line type="monotone" dataKey="leads" stroke="#D97706" strokeWidth={2} dot={false} name="Leads" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Próximos Eventos</CardTitle>
            <Link to="/dashboard/membro/agenda" className="text-xs text-[#1B3A5C] hover:underline flex items-center gap-1">
              Ver agenda <ArrowRight size={12} />
            </Link>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-[#94A3B8] py-4 text-center">Nenhum evento próximo</p>
            ) : upcomingEvents.map(ev => (
              <div key={ev.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#F1F5F9]">
                <div className="w-8 h-8 rounded-lg bg-[#1B3A5C]/10 flex items-center justify-center flex-shrink-0">
                  <Calendar size={14} className="text-[#1B3A5C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0F172A] truncate">{ev.titulo}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-[#94A3B8]">{ev.data.split('-').reverse().join('/')}</p>
                    <Badge variant={tipoColors[ev.tipo] as 'blue' | 'purple' | 'accent' | 'green' | 'yellow'} className="text-xs py-0">
                      {ev.tipo}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
