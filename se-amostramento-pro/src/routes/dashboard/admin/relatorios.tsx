import { createFileRoute } from '@tanstack/react-router'
import { Download, Users, BookOpen, Award, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts'
import { KpiCard } from '@/components/admin/KpiCard'
import { RankingTable } from '@/components/membro/RankingTable'
import { Button } from '@/components/ui/Button'
import { mockKpiSummary, mockDailyMetrics, mockWeeklyMetrics, mockMembers } from '@/lib/mocks'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/admin/relatorios')({
  component: RelatoriosPage,
})

function RelatoriosPage() {
  const handleExport = () => {
    toast.success('Relatório CSV exportado!')
  }

  const recentDays = mockDailyMetrics.slice(-30)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-[#7C7C9C] text-sm">Dados dos últimos 30 dias</p>
        <Button variant="secondary" onClick={handleExport}>
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total de Membros" value={mockKpiSummary.totalMembers} trend={12} icon={Users} iconColor="#7B2FBE" />
        <KpiCard label="Taxa de Retenção" value={mockKpiSummary.retentionRate} trend={4} icon={TrendingUp} suffix="%" iconColor="#2979FF" />
        <KpiCard label="Conclusões" value={mockKpiSummary.completionsThisMonth} trend={-3} icon={BookOpen} iconColor="#22C55E" />
        <KpiCard label="Certificados" value={mockKpiSummary.totalCertificates} trend={15} icon={Award} iconColor="#F59E0B" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#18182A] border border-[#2A2A40] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Conclusões por dia</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={recentDays}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A40" />
              <XAxis dataKey="date" tick={{ fill: '#7C7C9C', fontSize: 10 }} tickFormatter={(v: string) => v.slice(5)} />
              <YAxis tick={{ fill: '#7C7C9C', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#18182A', border: '1px solid #2A2A40', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="completions" fill="#7B2FBE" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#18182A] border border-[#2A2A40] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Pontos por semana</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockWeeklyMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A40" />
              <XAxis dataKey="week" tick={{ fill: '#7C7C9C', fontSize: 12 }} />
              <YAxis tick={{ fill: '#7C7C9C', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#18182A', border: '1px solid #2A2A40', borderRadius: 8, color: '#fff' }} />
              <Line type="monotone" dataKey="points" stroke="#2979FF" strokeWidth={2} dot={{ fill: '#2979FF', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-[#18182A] border border-[#2A2A40] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Usuários ativos — 30 dias</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={recentDays}>
              <defs>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#BF5AF2" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#BF5AF2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A40" />
              <XAxis dataKey="date" tick={{ fill: '#7C7C9C', fontSize: 10 }} tickFormatter={(v: string) => v.slice(5)} />
              <YAxis tick={{ fill: '#7C7C9C', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#18182A', border: '1px solid #2A2A40', borderRadius: 8, color: '#fff' }} />
              <Area type="monotone" dataKey="activeUsers" stroke="#BF5AF2" fill="url(#colorActive)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ranking */}
      <div className="bg-[#18182A] border border-[#2A2A40] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2A2A40]">
          <h3 className="font-semibold text-white">Top Membros</h3>
        </div>
        <RankingTable members={mockMembers} />
      </div>
    </div>
  )
}
