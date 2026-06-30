import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { GrowthData } from '@/types'

interface GlobalKpiOverviewProps {
  data: GrowthData[]
}

export function GlobalKpiOverview({ data }: GlobalKpiOverviewProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#4A7FA5' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#4A7FA5' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#0D1B2E', border: '1px solid #1A2E4A', borderRadius: 10, fontSize: 12 }}
          labelStyle={{ fontWeight: 600, color: '#E2EBF0' }}
          itemStyle={{ color: '#4A7FA5' }}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: '#4A7FA5' }} />
        <Line type="monotone" dataKey="alcance" stroke="#3B82F6" strokeWidth={2} dot={false} name="Alcance" />
        <Line type="monotone" dataKey="leads" stroke="#F59E0B" strokeWidth={2} dot={false} name="Leads" />
        <Line type="monotone" dataKey="conversoes" stroke="#10B981" strokeWidth={2} dot={false} name="Conversões" />
      </LineChart>
    </ResponsiveContainer>
  )
}
