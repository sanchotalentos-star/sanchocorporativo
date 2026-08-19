import { createFileRoute } from '@tanstack/react-router'
import { GlobalKpiOverview } from '@/components/admin/GlobalKpiOverview'
import { mockAggregateGrowth } from '@/lib/mocks/analytics'
import { mockMembers } from '@/lib/mocks/members'
import { RankingTable } from '@/components/membro/RankingTable'

export const Route = createFileRoute('/dashboard/admin/relatorios')({
  component: AdminRelatorios,
})

const D = {
  text: '#1A1916', textSub: '#6B6560', textMuted: '#8A8680',
  border: 'rgba(26,25,22,0.07)', gold: '#C5A880',
  serif: "'Cormorant Garamond', Georgia, serif",
}

function AdminRelatorios() {
  const totalReach = mockAggregateGrowth[mockAggregateGrowth.length - 1].alcance
  const totalLeads = mockAggregateGrowth[mockAggregateGrowth.length - 1].leads
  const growthPct = Math.round(((totalReach - mockAggregateGrowth[0].alcance) / mockAggregateGrowth[0].alcance) * 100)

  return (
    <div style={{ maxWidth: 960, padding: '48px 0 80px', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: D.gold, marginBottom: 8 }}>
          Mentor · Relatórios
        </p>
        <h1 style={{ fontFamily: D.serif, fontSize: 42, fontWeight: 400, lineHeight: 1.1, color: D.text, margin: 0 }}>
          Relatórios Globais
        </h1>
        <p style={{ fontSize: 14, color: D.textSub, marginTop: 10 }}>
          Visão consolidada de todos os participantes
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: `1px solid ${D.border}`, borderBottom: `1px solid ${D.border}`, marginBottom: 52 }}>
        {[
          { label: 'Alcance Total', value: `${(totalReach / 1000).toFixed(1)}k` },
          { label: 'Leads Gerados', value: String(totalLeads) },
          { label: 'Crescimento', value: `+${growthPct}%` },
          { label: 'Participantes', value: String(mockMembers.length) },
        ].map((item, i) => (
          <div key={item.label} style={{ padding: '28px 24px 28px 0', paddingLeft: i > 0 ? 24 : 0, borderLeft: i > 0 ? `1px solid ${D.border}` : 'none' }}>
            <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: D.textMuted, marginBottom: 10 }}>
              {item.label}
            </p>
            <p style={{ fontFamily: D.serif, fontSize: 38, fontWeight: 400, color: D.text, lineHeight: 1, fontVariantNumeric: 'tabular-nums', margin: 0 }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Growth chart */}
      <div style={{ marginBottom: 52 }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: D.textMuted, marginBottom: 20 }}>
          Crescimento Agregado
        </p>
        <GlobalKpiOverview data={mockAggregateGrowth} />
      </div>

      {/* Ranking */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: D.textMuted, marginBottom: 0 }}>
          Ranking Geral
        </p>
        <hr style={{ border: 'none', borderTop: `1px solid ${D.border}`, margin: '16px 0 0' }} />
        <RankingTable members={mockMembers} />
      </div>

    </div>
  )
}
