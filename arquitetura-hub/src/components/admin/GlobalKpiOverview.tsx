import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { GrowthData } from '@/types'

interface GlobalKpiOverviewProps {
  data: GrowthData[]
}

export function GlobalKpiOverview({ data }: GlobalKpiOverviewProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#475569' }} />
        <YAxis tick={{ fontSize: 12, fill: '#475569' }} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
          labelStyle={{ fontWeight: 600, color: '#0F172A' }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="alcance" stroke="#1B3A5C" strokeWidth={2} dot={false} name="Alcance" />
        <Line type="monotone" dataKey="leads" stroke="#D97706" strokeWidth={2} dot={false} name="Leads" />
        <Line type="monotone" dataKey="conversoes" stroke="#059669" strokeWidth={2} dot={false} name="Conversões" />
      </LineChart>
    </ResponsiveContainer>
  )
}
