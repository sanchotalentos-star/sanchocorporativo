import { createFileRoute } from '@tanstack/react-router'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { mockMembers } from '@/lib/mocks/members'

export const Route = createFileRoute('/dashboard/membro/relatorios')({
  component: RelatoriosPage,
})

const COLORS = ['#1B3A5C', '#D97706', '#059669', '#7C3AED', '#DC2626']

const leadSources = [
  { name: 'LinkedIn', value: 42 },
  { name: 'Indicação', value: 28 },
  { name: 'Eventos', value: 18 },
  { name: 'Mídia', value: 8 },
  { name: 'Outros', value: 4 },
]

const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']

function RelatoriosPage() {
  const { user } = useAuth()
  const member = mockMembers.find(m => m.id === user?.id) ?? mockMembers[0]

  const totalAlcance = member.growth.reduce((s, g) => s + g.alcance, 0)
  const totalLeads = member.growth.reduce((s, g) => s + g.leads, 0)
  const totalConversoes = member.growth.reduce((s, g) => s + g.conversoes, 0)
  const convRate = totalLeads > 0 ? ((totalConversoes / totalLeads) * 100).toFixed(1) : '0'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Relatórios Pessoais</h1>
        <p className="text-[#475569] mt-1">Análise do seu desempenho nos últimos 6 meses</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Alcance Total', value: `${(totalAlcance / 1000).toFixed(1)}k` },
          { label: 'Leads Gerados', value: totalLeads },
          { label: 'Conversões', value: totalConversoes },
          { label: 'Taxa de Conversão', value: `${convRate}%` },
        ].map(item => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <p className="text-sm text-[#475569]">{item.label}</p>
              <p className="text-2xl font-bold text-[#0F172A] mt-1">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Area chart */}
      <Card>
        <CardHeader><CardTitle>Evolução de Crescimento</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={member.growth} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="alcanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B3A5C" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1B3A5C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D97706" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#475569' }} />
              <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Area type="monotone" dataKey="alcance" stroke="#1B3A5C" fill="url(#alcanceGrad)" strokeWidth={2} name="Alcance" />
              <Area type="monotone" dataKey="leads" stroke="#D97706" fill="url(#leadsGrad)" strokeWidth={2} name="Leads" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie chart */}
        <Card>
          <CardHeader><CardTitle>Origem dos Leads</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={leadSources} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value">
                  {leadSources.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly table */}
        <Card>
          <CardHeader><CardTitle>Performance Mensal</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
                  <th className="text-left px-4 py-2 font-semibold text-[#475569]">Mês</th>
                  <th className="text-right px-4 py-2 font-semibold text-[#475569]">Alcance</th>
                  <th className="text-right px-4 py-2 font-semibold text-[#475569]">Leads</th>
                  <th className="text-right px-4 py-2 font-semibold text-[#475569]">Conv.</th>
                </tr>
              </thead>
              <tbody>
                {member.growth.map((g, i) => (
                  <tr key={g.month} className="border-b border-[#E2E8F0] last:border-0">
                    <td className="px-4 py-2 font-medium text-[#0F172A]">{g.month}</td>
                    <td className="px-4 py-2 text-right text-[#475569]">{g.alcance >= 1000 ? `${(g.alcance/1000).toFixed(1)}k` : g.alcance}</td>
                    <td className="px-4 py-2 text-right text-[#475569]">{g.leads}</td>
                    <td className="px-4 py-2 text-right text-[#475569]">{g.conversoes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
