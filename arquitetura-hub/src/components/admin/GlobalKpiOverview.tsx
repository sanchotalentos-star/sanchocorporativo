import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { GrowthData } from '@/types'

interface GlobalKpiOverviewProps {
  data: GrowthData[]
}

export function GlobalKpiOverview({ data }: GlobalKpiOverviewProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 12 }}
          labelStyle={{ fontWeight: 600, color: '#111827' }}
          itemStyle={{ color: '#6B7280' }}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: '#6B7280' }} />
        <Line type="monotone" dataKey="alcance" stroke="#3B82F6" strokeWidth={2} dot={false} name="Alcance" />
        <Line type="monotone" dataKey="leads" stroke="#F59E0B" strokeWidth={2} dot={false} name="Leads" />
        <Line type="monotone" dataKey="conversoes" stroke="#10B981" strokeWidth={2} dot={false} name="Conversões" />
      </LineChart>
    </ResponsiveContainer>
  )
}
