import { createFileRoute } from '@tanstack/react-router'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { useAuth } from '@/context/AuthContext'
import { mockMembers } from '@/lib/mocks/members'

export const Route = createFileRoute('/dashboard/membro/relatorios')({
  component: RelatoriosPage,
})

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444']

const leadSources = [
  { name: 'LinkedIn', value: 42 },
  { name: 'Indicação', value: 28 },
  { name: 'Eventos', value: 18 },
  { name: 'Mídia', value: 8 },
  { name: 'Outros', value: 4 },
]

function RelatoriosPage() {
  const { user } = useAuth()
  const member = mockMembers.find(m => m.id === user?.id) ?? mockMembers[0]

  const totalAlcance = member.growth.reduce((s, g) => s + g.alcance, 0)
  const totalLeads = member.growth.reduce((s, g) => s + g.leads, 0)
  const totalConversoes = member.growth.reduce((s, g) => s + g.conversoes, 0)
  const convRate = totalLeads > 0 ? ((totalConversoes / totalLeads) * 100).toFixed(1) : '0'

  const summaryCards = [
    { label: 'Alcance Total', value: `${(totalAlcance / 1000).toFixed(1)}k` },
    { label: 'Leads Gerados', value: totalLeads },
    { label: 'Conversões', value: totalConversoes },
    { label: 'Taxa de Conversão', value: `${convRate}%` },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Relatórios Pessoais</h1>
        <p className="text-[#4A7FA5] mt-1">Análise do seu desempenho nos últimos 6 meses</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryCards.map(item => (
          <div key={item.label} className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-5">
            <p className="text-xs text-[#4A7FA5] uppercase tracking-wider">{item.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-5">
        <h3 className="text-sm font-bold text-white mb-4">Evolução de Crescimento</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={member.growth} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="alcanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#4A7FA5' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#4A7FA5' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#0D1B2E', border: '1px solid #1A2E4A', borderRadius: 10, fontSize: 12 }}
              labelStyle={{ color: '#E2EBF0' }}
              itemStyle={{ color: '#4A7FA5' }}
            />
            <Area type="monotone" dataKey="alcance" stroke="#3B82F6" fill="url(#alcanceGrad)" strokeWidth={2} name="Alcance" />
            <Area type="monotone" dataKey="leads" stroke="#F59E0B" fill="url(#leadsGrad)" strokeWidth={2} name="Leads" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-5">
          <h3 className="text-sm font-bold text-white mb-4">Origem dos Leads</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={leadSources} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value">
                {leadSources.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11, color: '#4A7FA5' }} />
              <Tooltip contentStyle={{ background: '#0D1B2E', border: '1px solid #1A2E4A', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1A2E4A]">
            <h3 className="text-sm font-bold text-white">Performance Mensal</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1A2E4A] bg-[#0A1420]">
                <th className="text-left px-4 py-2.5 font-semibold text-[#4A7FA5] text-xs uppercase">Mês</th>
                <th className="text-right px-4 py-2.5 font-semibold text-[#4A7FA5] text-xs uppercase">Alcance</th>
                <th className="text-right px-4 py-2.5 font-semibold text-[#4A7FA5] text-xs uppercase">Leads</th>
                <th className="text-right px-4 py-2.5 font-semibold text-[#4A7FA5] text-xs uppercase">Conv.</th>
              </tr>
            </thead>
            <tbody>
              {member.growth.map((g) => (
                <tr key={g.month} className="border-b border-[#1A2E4A]/50 last:border-0 hover:bg-[#112240] transition-colors">
                  <td className="px-4 py-2.5 font-medium text-white">{g.month}</td>
                  <td className="px-4 py-2.5 text-right text-[#4A7FA5]">{g.alcance >= 1000 ? `${(g.alcance/1000).toFixed(1)}k` : g.alcance}</td>
                  <td className="px-4 py-2.5 text-right text-[#4A7FA5]">{g.leads}</td>
                  <td className="px-4 py-2.5 text-right text-[#4A7FA5]">{g.conversoes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
