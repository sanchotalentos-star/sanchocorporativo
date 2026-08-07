import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle, AlertCircle, XCircle, ChevronRight } from 'lucide-react'
import { KpiTable } from '@/components/membro/KpiTable'
import { getPercent, getStatusColor } from '@/lib/utils'
import { JornadaPanorama } from '@/components/membro/JornadaPanorama'
import type { KpiEntry } from '@/types'

export const Route = createFileRoute('/dashboard/membro/kpis')({
  component: KpisPage,
})

// ─── Design tokens ────────────────────────────────────────────────
const D = {
  border:    'rgba(26,25,22,0.07)',
  text:      '#1A1916',
  textMid:   '#3A3530',
  textSub:   '#6B6560',
  textMuted: '#8A8680',
  textFaint: '#C5C0BA',
  gold:      '#C5A880',
  serif:     "'Cormorant Garamond', Georgia, serif",
} as const

function HR() {
  return <hr style={{ border: 'none', borderTop: `1px solid ${D.border}`, margin: 0 }} />
}
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: D.textMuted, margin: 0 }}>
      {children}
    </p>
  )
}

const CADEIA = [
  { num: '01', label: 'Identidade', to: '/dashboard/membro/posicionamento' },
  { num: '02', label: 'Pilares',    to: '/dashboard/membro/pilares'        },
  { num: '03', label: 'OKRs',       to: '/dashboard/membro/okr'            },
  { num: '04', label: 'Marketing',  to: '/dashboard/membro/marketing'      },
  { num: '05', label: 'Resultados', to: '/dashboard/membro/kpis'           },
] as const

function Breadcrumb({ active }: { active: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      {CADEIA.map((c, i) => (
        <span key={c.num} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {i > 0 && <ChevronRight size={11} style={{ color: D.textFaint }} />}
          {c.label === active ? (
            <span style={{ fontSize: 11, fontWeight: 600, color: D.gold }}>{c.num} {c.label}</span>
          ) : (
            <Link to={c.to} style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: 11, color: D.textFaint, transition: 'color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = D.textSub }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = D.textFaint }}>
                {c.num} {c.label}
              </span>
            </Link>
          )}
        </span>
      ))}
    </div>
  )
}

function KpisPage() {
  const [kpis, setKpis] = useState<KpiEntry[]>([])

  const green  = kpis.filter(k => getStatusColor(getPercent(k.atual, k.meta)) === 'green').length
  const yellow = kpis.filter(k => getStatusColor(getPercent(k.atual, k.meta)) === 'yellow').length
  const red    = kpis.filter(k => getStatusColor(getPercent(k.atual, k.meta)) === 'red').length

  function handleUpdateAtual(id: string, value: number) {
    setKpis(prev => prev.map(k => {
      if (k.id !== id) return k
      const newHistory = [...k.history.slice(-5), value]
      return { ...k, atual: value, history: newHistory }
    }))
    toast.success('Indicador atualizado')
  }

  return (
    <div style={{ maxWidth: 860, padding: '48px 0 80px', display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Panorama da Jornada ── */}
      <JornadaPanorama atual="Indicadores" />

      {/* ── Breadcrumb ── */}
      <Breadcrumb active="Resultados" />

      {/* ── Heading ── */}
      <div style={{ padding: '24px 0 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h1 style={{
          fontFamily: D.serif,
          fontSize: 'clamp(36px, 4.5vw, 52px)',
          fontWeight: 400,
          color: D.text,
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
        }}>
          Indicadores de Resultado
        </h1>
        <p style={{ fontSize: 14, color: D.textSub, margin: 0, lineHeight: 1.6, maxWidth: 520 }}>
          O que a execução do seu plano está gerando. Cada número aqui é consequência das ações nos pilares e no marketing
        </p>
      </div>

      {/* ── Status inline — sem card grid ── */}
      {kpis.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginTop: 28, padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={15} style={{ color: '#6BA36B' }} />
            <p style={{ fontFamily: D.serif, fontSize: 28, color: '#6BA36B', margin: 0, lineHeight: 1 }}>{green}</p>
            <p style={{ fontSize: 11, color: D.textMuted, margin: 0 }}>No alvo</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={15} style={{ color: '#F59E0B' }} />
            <p style={{ fontFamily: D.serif, fontSize: 28, color: '#F59E0B', margin: 0, lineHeight: 1 }}>{yellow}</p>
            <p style={{ fontSize: 11, color: D.textMuted, margin: 0 }}>Atenção</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <XCircle size={15} style={{ color: '#E05C5C' }} />
            <p style={{ fontFamily: D.serif, fontSize: 28, color: '#E05C5C', margin: 0, lineHeight: 1 }}>{red}</p>
            <p style={{ fontSize: 11, color: D.textMuted, margin: 0 }}>Abaixo</p>
          </div>
        </div>
      )}

      <HR />

      {/* ── Tabela ou estado vazio ── */}
      <div style={{ padding: '24px 0' }}>
        {kpis.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <CheckCircle size={28} style={{ color: D.textFaint, margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontSize: 14, fontWeight: 500, color: D.textSub, margin: '0 0 4px' }}>
              Nenhum indicador cadastrado ainda
            </p>
            <p style={{ fontSize: 12, color: D.textFaint, margin: 0, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
              Os indicadores de resultado são definidos com seu mentor na sessão de OKR. Eles aparecerão aqui após a primeira sessão.
            </p>
          </div>
        ) : (
          <KpiTable kpis={kpis} onUpdateAtual={handleUpdateAtual} />
        )}
      </div>

      {/* ── Os resultados alimentam — plain links ── */}
      <HR />
      <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
        <SectionLabel>Os resultados alimentam</SectionLabel>
        {[
          { to: '/dashboard/membro/okr',       num: 'OKR', label: 'Revisão de Metas',       desc: 'Os indicadores mostram se as metas definidas com o mentor estão sendo atingidas e o que precisa ser ajustado.' },
          { to: '/dashboard/membro/relatorios', num: 'REL', label: 'Relatórios de Evolução', desc: 'Os dados acumulados aqui compõem os relatórios de evolução que você e seu mentor revisam ao final de cada fase.' },
        ].map((link, i) => (
          <div key={link.to}>
            {i > 0 && <HR />}
            <Link to={link.to as any} style={{ textDecoration: 'none' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', cursor: 'pointer', transition: 'opacity 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0.6' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1' }}
              >
                <span style={{ fontFamily: D.serif, fontSize: 13, color: D.gold, fontStyle: 'italic', width: 28, flexShrink: 0 }}>{link.num}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: D.text, margin: 0 }}>{link.label}</p>
                  <p style={{ fontSize: 12, color: D.textMuted, margin: '2px 0 0', lineHeight: 1.5 }}>{link.desc}</p>
                </div>
                <ChevronRight size={14} style={{ color: D.textFaint, flexShrink: 0 }} />
              </div>
            </Link>
          </div>
        ))}
      </div>

    </div>
  )
}
