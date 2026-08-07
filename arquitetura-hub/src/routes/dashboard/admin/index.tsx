import { createFileRoute } from '@tanstack/react-router'
import { Users, TrendingUp, Target, Award } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { GlobalKpiOverview } from '@/components/admin/GlobalKpiOverview'
import { mockMembers } from '@/lib/mocks/members'
import { mockAggregateGrowth } from '@/lib/mocks/analytics'

export const Route = createFileRoute('/dashboard/admin/')({
  component: AdminOverview,
})

const D = {
  bg: '#FAFAF9', text: '#1A1916', textMid: '#3A3530', textSub: '#6B6560',
  textMuted: '#8A8680', border: 'rgba(26,25,22,0.07)', gold: '#C5A880',
  serif: "'Cormorant Garamond', Georgia, serif",
}

function HR() {
  return <hr style={{ border: 'none', borderTop: `1px solid ${D.border}`, margin: '40px 0' }} />
}

function AdminOverview() {
  const totalMembers = mockMembers.length
  const avgScore = Math.round(mockMembers.reduce((s, m) => s + m.score, 0) / totalMembers)
  const totalReach = mockMembers.reduce((s, m) => s + m.alcance, 0)
  const totalLeads = mockMembers.reduce((s, m) => s + m.leads, 0)

  return (
    <div style={{ maxWidth: 960, padding: '48px 0 80px', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: D.gold, marginBottom: 8 }}>
          Mentor · Visão Geral
        </p>
        <h1 style={{ fontFamily: D.serif, fontSize: 42, fontWeight: 400, lineHeight: 1.1, color: D.text, margin: 0 }}>
          Painel do Mentor
        </h1>
        <p style={{ fontSize: 14, color: D.textSub, marginTop: 10 }}>
          Visão geral de todos os mentorados e evolução do programa
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: `1px solid ${D.border}`, borderBottom: `1px solid ${D.border}`, marginBottom: 52 }}>
        {[
          { label: 'Total de Membros', value: String(totalMembers), Icon: Users },
          { label: 'Score Médio', value: `${avgScore}`, suffix: 'pts', Icon: Award },
          { label: 'Alcance Total', value: `${(totalReach / 1000).toFixed(1)}k`, suffix: 'pessoas', Icon: TrendingUp },
          { label: 'Leads Totais', value: String(totalLeads), Icon: Target },
        ].map((s, i) => (
          <div key={s.label} style={{ padding: '28px 24px 28px 0', paddingLeft: i > 0 ? 24 : 0, borderLeft: i > 0 ? `1px solid ${D.border}` : 'none' }}>
            <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: D.textMuted, marginBottom: 10 }}>
              {s.label}
            </p>
            <p style={{ fontFamily: D.serif, fontSize: 38, fontWeight: 400, color: D.text, lineHeight: 1, fontVariantNumeric: 'tabular-nums', margin: 0 }}>
              {s.value}
            </p>
            {s.suffix && <p style={{ fontSize: 11, color: D.textMuted, marginTop: 4 }}>{s.suffix}</p>}
          </div>
        ))}
      </div>

      {/* Growth chart */}
      <div style={{ marginBottom: 52 }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: D.textMuted, marginBottom: 20 }}>
          Crescimento Agregado · Últimos 6 Meses
        </p>
        <GlobalKpiOverview data={mockAggregateGrowth} />
      </div>

      <HR />

      {/* Member list */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: D.textMuted, marginBottom: 24 }}>
          Mentorados · {mockMembers.length} participantes
        </p>
        <div>
          {[...mockMembers].sort((a, b) => b.score - a.score).map((member, idx) => {
            const scoreColor = member.score >= 80 ? '#10B981' : member.score >= 60 ? '#F59E0B' : '#EF4444'
            return (
              <div key={member.id} style={{
                display: 'flex', alignItems: 'center', gap: 20,
                padding: '20px 0',
                borderTop: idx === 0 ? `1px solid ${D.border}` : 'none',
                borderBottom: `1px solid ${D.border}`,
              }}>
                <div style={{ width: 36, height: 36, background: '#2A2420', border: '1px solid rgba(197,168,128,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: D.gold, flexShrink: 0 }}>
                  {member.full_name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: D.text, margin: 0 }}>{member.full_name}</p>
                  <p style={{ fontSize: 12, color: D.textMuted, marginTop: 2 }}>{member.email}</p>
                </div>

                {/* Stats inline */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 36, flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: D.textMuted, marginBottom: 4 }}>Score</p>
                    <p style={{ fontFamily: D.serif, fontSize: 22, fontWeight: 400, color: scoreColor, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{member.score}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: D.textMuted, marginBottom: 4 }}>Leads</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: D.text }}>{member.leads}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: D.textMuted, marginBottom: 4 }}>Alcance</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: D.text }}>
                      {member.alcance >= 1000 ? `${(member.alcance / 1000).toFixed(1)}k` : member.alcance}
                    </p>
                  </div>
                  <Link to="/dashboard/admin/membros"
                    style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: D.gold, textDecoration: 'none' }}
                  >
                    Gerenciar →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
