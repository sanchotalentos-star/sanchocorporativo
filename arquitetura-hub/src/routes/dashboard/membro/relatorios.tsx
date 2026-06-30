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

const COLORS = ['#7B2FBE', '#3B82F6', '#10B981', '#F59E0B', '#EF4444']

const leadSources = [
  { name: 'LinkedIn', value: 42 },
  { name: 'Indicação', value: 28 },
  { name: 'Eventos', value: 18 },
  { name: 'Mídia', value: 8 },
  { name: 'Outros', value: 4 },
]

function RelatoriosPage() {
  const { user } = useAuth()
  const foundMember = mockMembers.find(m => m.id === user?.id)
  const member = foundMember ?? {
    ...mockMembers[0],
    id: user?.id ?? 'me',
    full_name: user?.full_name ?? mockMembers[0].full_name,
    email: user?.email ?? mockMembers[0].email,
  }

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
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Relatórios Pessoais</h1>
        <p className="text-gray-400 mt-1 text-sm">Análise do seu desempenho nos últimos 6 meses</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryCards.map(item => (
          <div key={item.label} className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.label}</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-4">Evolução de Crescimento</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={member.growth} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="alcanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7B2FBE" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#7B2FBE" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 12 }}
              labelStyle={{ color: '#111827' }}
              itemStyle={{ color: '#6B7280' }}
            />
            <Area type="monotone" dataKey="alcance" stroke="#7B2FBE" fill="url(#alcanceGrad)" strokeWidth={2.5} name="Alcance" />
            <Area type="monotone" dataKey="leads" stroke="#3B82F6" fill="url(#leadsGrad)" strokeWidth={2.5} name="Leads" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-4">Origem dos Leads</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={leadSources} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value">
                {leadSources.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11, color: '#6B7280' }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Performance Mensal</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-2.5 font-black text-gray-400 text-[10px] uppercase tracking-widest">Mês</th>
                <th className="text-right px-4 py-2.5 font-black text-gray-400 text-[10px] uppercase tracking-widest">Alcance</th>
                <th className="text-right px-4 py-2.5 font-black text-gray-400 text-[10px] uppercase tracking-widest">Leads</th>
                <th className="text-right px-4 py-2.5 font-black text-gray-400 text-[10px] uppercase tracking-widest">Conv.</th>
              </tr>
            </thead>
            <tbody>
              {member.growth.map((g) => (
                <tr key={g.month} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 font-semibold text-gray-900">{g.month}</td>
                  <td className="px-4 py-2.5 text-right text-gray-500">{g.alcance >= 1000 ? `${(g.alcance/1000).toFixed(1)}k` : g.alcance}</td>
                  <td className="px-4 py-2.5 text-right text-gray-500">{g.leads}</td>
                  <td className="px-4 py-2.5 text-right text-gray-500">{g.conversoes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
