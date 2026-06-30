import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Users, TrendingUp, Target, Award } from 'lucide-react'
import { KpiCard } from '@/components/shared/KpiCard'
import { GlobalKpiOverview } from '@/components/admin/GlobalKpiOverview'
import { Progress } from '@/components/ui/progress'
import { staggerContainer, fadeInUp } from '@/lib/motion'
import { mockMembers } from '@/lib/mocks/members'
import { mockAggregateGrowth } from '@/lib/mocks/analytics'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/admin/')({
  component: AdminOverview,
})

function AdminOverview() {
  const totalMembers = mockMembers.length
  const avgScore = Math.round(mockMembers.reduce((s, m) => s + m.score, 0) / totalMembers)
  const totalReach = mockMembers.reduce((s, m) => s + m.alcance, 0)
  const totalLeads = mockMembers.reduce((s, m) => s + m.leads, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
        <p className="text-[#4A7FA5] mt-1">Visão geral de todos os participantes do programa</p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <KpiCard label="Total de Membros" value={totalMembers} icon={Users} />
        <KpiCard label="Score Médio" value={avgScore} unit="pts" icon={Award} accent />
        <KpiCard label="Alcance Total" value={`${(totalReach / 1000).toFixed(1)}k`} unit="pessoas" icon={TrendingUp} />
        <KpiCard label="Leads Totais" value={totalLeads} icon={Target} />
      </motion.div>

      <div className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-5">
        <h3 className="text-sm font-bold text-white mb-4">Crescimento Agregado — Últimos 6 Meses</h3>
        <GlobalKpiOverview data={mockAggregateGrowth} />
      </div>

      <div>
        <h2 className="text-sm font-bold text-[#4A7FA5] uppercase tracking-widest mb-3">Participantes</h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {[...mockMembers].sort((a, b) => b.score - a.score).map((member) => {
            const scoreColor = member.score >= 80 ? '#10B981' : member.score >= 60 ? '#F59E0B' : '#EF4444'
            const barColor = member.score >= 80 ? 'bg-emerald-500' : member.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
            return (
              <motion.div key={member.id} variants={fadeInUp}>
                <div className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] hover:border-[#2A4A6E] p-5 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-black font-bold text-sm">
                      {member.full_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{member.full_name}</p>
                      <p className="text-xs text-[#4A7FA5] truncate">{member.email}</p>
                    </div>
                    <span className="text-xl font-black" style={{ color: scoreColor }}>{member.score}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-[#4A7FA5]">
                      <span>Score de Autoridade</span>
                      <span style={{ color: scoreColor }}>{member.score}%</span>
                    </div>
                    <Progress value={member.score} indicatorClassName={barColor} className="bg-[#112240]" />
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#1A2E4A]">
                      <div className="text-center">
                        <p className="text-xs text-[#4A7FA5]">Leads</p>
                        <p className="font-semibold text-white">{member.leads}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-[#4A7FA5]">Alcance</p>
                        <p className="font-semibold text-white">
                          {member.alcance >= 1000 ? `${(member.alcance / 1000).toFixed(1)}k` : member.alcance}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
