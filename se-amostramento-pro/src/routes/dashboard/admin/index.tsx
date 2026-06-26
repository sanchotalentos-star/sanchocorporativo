import { createFileRoute } from '@tanstack/react-router'
import { Users, Building2, BookOpen, Award, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { KpiCard } from '@/components/admin/KpiCard'
import { RequestCard } from '@/components/admin/RequestCard'
import { staggerContainer, fadeIn } from '@/lib/motion'
import { mockKpiSummary, mockDailyMetrics, mockRequests, mockOrgDistribution } from '@/lib/mocks'

export const Route = createFileRoute('/dashboard/admin/')({
  component: AdminOverview,
})

function AdminOverview() {
  const recentDays = mockDailyMetrics.slice(-14)
  const pendingRequests = mockRequests.filter((r) => r.status === 'pending').slice(0, 2)

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* KPIs */}
      <motion.div variants={fadeIn} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total de Membros" value={mockKpiSummary.totalMembers} trend={12} icon={Users} iconColor="#7B2FBE" />
        <KpiCard label="Ativos esta semana" value={mockKpiSummary.activeThisWeek} trend={8} icon={Users} iconColor="#2979FF" />
        <KpiCard label="Conclusões no mês" value={mockKpiSummary.completionsThisMonth} trend={-3} icon={BookOpen} iconColor="#22C55E" />
        <KpiCard label="Certificados emitidos" value={mockKpiSummary.totalCertificates} trend={15} icon={Award} iconColor="#F59E0B" />
      </motion.div>

      {/* Alert */}
      <motion.div variants={fadeIn} className="flex items-center gap-3 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl px-5 py-3">
        <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0" />
        <p className="text-sm text-[#F59E0B]">
          <strong>{mockRequests.filter((r) => r.status === 'pending').length} solicitações</strong> de acesso pendentes aguardam sua aprovação.
        </p>
      </motion.div>

      {/* Charts row */}
      <motion.div variants={fadeIn} className="grid lg:grid-cols-3 gap-6">
        {/* Active users chart */}
        <div className="lg:col-span-2 bg-[#18182A] border border-[#2A2A40] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Usuários Ativos — Últimos 14 dias</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={recentDays}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7B2FBE" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7B2FBE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A40" />
              <XAxis dataKey="date" tick={{ fill: '#7C7C9C', fontSize: 10 }} tickFormatter={(v: string) => v.slice(5)} />
              <YAxis tick={{ fill: '#7C7C9C', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#18182A', border: '1px solid #2A2A40', borderRadius: 8, color: '#fff' }} />
              <Area type="monotone" dataKey="activeUsers" stroke="#7B2FBE" fill="url(#colorUsers)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Org distribution */}
        <div className="bg-[#18182A] border border-[#2A2A40] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Distribuição por Plano</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={mockOrgDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                {mockOrgDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#18182A', border: '1px solid #2A2A40', borderRadius: 8, color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {mockOrgDistribution.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-[#C4B5FD]">{d.name}</span>
                </div>
                <span className="text-white font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Pending requests */}
      <motion.div variants={fadeIn}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-display font-semibold text-white">Solicitações Pendentes</h3>
          <Building2 className="w-5 h-5 text-[#7C7C9C]" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {pendingRequests.map((req) => (
            <RequestCard key={req.id} request={req} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
