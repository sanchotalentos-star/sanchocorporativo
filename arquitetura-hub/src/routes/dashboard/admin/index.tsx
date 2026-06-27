import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Users, TrendingUp, Target, Award } from 'lucide-react'
import { KpiCard } from '@/components/shared/KpiCard'
import { GlobalKpiOverview } from '@/components/admin/GlobalKpiOverview'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
        <h1 className="text-2xl font-bold text-[#0F172A]">Painel Administrativo</h1>
        <p className="text-[#475569] mt-1">Visão geral de todos os participantes do programa</p>
      </div>

      {/* KPI cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <KpiCard label="Total de Membros" value={totalMembers} icon={Users} />
        <KpiCard label="Score Médio" value={avgScore} unit="pts" icon={Award} accent />
        <KpiCard label="Alcance Total" value={`${(totalReach / 1000).toFixed(1)}k`} unit="pessoas" icon={TrendingUp} />
        <KpiCard label="Leads Totais" value={totalLeads} icon={Target} />
      </motion.div>

      {/* Growth chart */}
      <Card>
        <CardHeader>
          <CardTitle>Crescimento Agregado — Últimos 6 Meses</CardTitle>
        </CardHeader>
        <CardContent>
          <GlobalKpiOverview data={mockAggregateGrowth} />
        </CardContent>
      </Card>

      {/* Member cards grid */}
      <div>
        <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Participantes</h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[...mockMembers].sort((a, b) => b.score - a.score).map((member) => {
            const color = member.score >= 80 ? 'bg-green-500' : member.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            const textColor = member.score >= 80 ? 'text-green-600' : member.score >= 60 ? 'text-yellow-600' : 'text-red-600'
            return (
              <motion.div key={member.id} variants={fadeInUp}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#1B3A5C] flex items-center justify-center text-white font-bold">
                        {member.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#0F172A]">{member.full_name}</p>
                        <p className="text-xs text-[#94A3B8]">{member.email}</p>
                      </div>
                      <span className={cn('ml-auto text-xl font-bold', textColor)}>{member.score}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-[#475569]">
                        <span>Score de Autoridade</span>
                        <span>{member.score}%</span>
                      </div>
                      <Progress value={member.score} indicatorClassName={color} />
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E2E8F0]">
                        <div className="text-center">
                          <p className="text-xs text-[#94A3B8]">Leads</p>
                          <p className="font-semibold text-[#0F172A]">{member.leads}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-[#94A3B8]">Alcance</p>
                          <p className="font-semibold text-[#0F172A]">
                            {member.alcance >= 1000 ? `${(member.alcance / 1000).toFixed(1)}k` : member.alcance}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
