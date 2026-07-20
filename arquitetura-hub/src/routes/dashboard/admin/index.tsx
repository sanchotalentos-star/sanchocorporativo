import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Users, TrendingUp, Target, Award } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { KpiCard } from '@/components/shared/KpiCard'
import { GlobalKpiOverview } from '@/components/admin/GlobalKpiOverview'
import { Progress } from '@/components/ui/progress'
import { staggerContainer, fadeInUp } from '@/lib/motion'
import { mockMembers } from '@/lib/mocks/members'
import { mockAggregateGrowth } from '@/lib/mocks/analytics'

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
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Mentor</p>
        <h1 className="text-2xl font-black text-gray-900">Painel de Acompanhamento</h1>
        <p className="text-sm text-gray-500 mt-1">Visão geral de todos os mentorados e evolução do programa</p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200"
      >
        <KpiCard label="Total de Membros" value={totalMembers} icon={Users} />
        <KpiCard label="Score Médio" value={avgScore} unit="pts" icon={Award} accent />
        <KpiCard label="Alcance Total" value={`${(totalReach / 1000).toFixed(1)}k`} unit="pessoas" icon={TrendingUp} />
        <KpiCard label="Leads Totais" value={totalLeads} icon={Target} />
      </motion.div>

      <div className="bg-white border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Crescimento Agregado — Últimos 6 Meses</p>
        </div>
        <div className="p-5">
          <GlobalKpiOverview data={mockAggregateGrowth} />
        </div>
      </div>

      <div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Mentorados</p>
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
                <div className="bg-white border border-gray-200 hover:border-gray-300 p-5 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 bg-[#7B2FBE] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                      {member.full_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate text-sm">{member.full_name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{member.email}</p>
                    </div>
                    <span className="text-xl font-black" style={{ color: scoreColor }}>{member.score}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                      <span>Score de Autoridade</span>
                      <span style={{ color: scoreColor }}>{member.score}%</span>
                    </div>
                    <Progress value={member.score} indicatorClassName={barColor} className="bg-gray-100 h-1" />
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Leads</p>
                        <p className="font-black text-gray-900 text-sm mt-0.5">{member.leads}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Alcance</p>
                        <p className="font-black text-gray-900 text-sm mt-0.5">
                          {member.alcance >= 1000 ? `${(member.alcance / 1000).toFixed(1)}k` : member.alcance}
                        </p>
                      </div>
                    </div>
                    <Link to="/dashboard/admin/membros"
                      className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[#7B2FBE] uppercase tracking-wider hover:underline"
                    >
                      Ver jornada completa
                    </Link>
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
