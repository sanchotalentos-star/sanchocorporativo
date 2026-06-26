export interface DailyMetric {
  date: string
  activeUsers: number
  completions: number
  newMembers: number
  liveAttendees: number
}

export interface WeeklyMetric {
  week: string
  points: number
  completions: number
}

function generateLast30Days(): DailyMetric[] {
  const data: DailyMetric[] = []
  const now = new Date('2024-06-25')
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    data.push({
      date: dateStr,
      activeUsers: Math.floor(80 + Math.random() * 120),
      completions: Math.floor(10 + Math.random() * 40),
      newMembers: Math.floor(0 + Math.random() * 8),
      liveAttendees: i % 7 === 0 ? Math.floor(30 + Math.random() * 70) : 0,
    })
  }
  return data
}

export const mockDailyMetrics: DailyMetric[] = generateLast30Days()

export const mockWeeklyMetrics: WeeklyMetric[] = [
  { week: 'Sem 1', points: 8400, completions: 42 },
  { week: 'Sem 2', points: 10200, completions: 56 },
  { week: 'Sem 3', points: 9800, completions: 48 },
  { week: 'Sem 4', points: 13600, completions: 72 },
]

export const mockKpiSummary = {
  totalMembers: 512,
  activeThisWeek: 248,
  completionsThisMonth: 186,
  totalCertificates: 89,
  avgProgress: 54,
  retentionRate: 78,
}

export const mockOrgDistribution = [
  { name: 'Corporativo', value: 2, color: '#7B2FBE' },
  { name: 'Empresa', value: 2, color: '#2979FF' },
  { name: 'Team', value: 1, color: '#BF5AF2' },
]
