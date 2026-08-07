import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { memberKey } from '@/lib/memberStorage'

const D = {
  border:    'rgba(26,25,22,0.07)',
  text:      '#1A1916',
  textMid:   '#3A3530',
  textSub:   '#6B6560',
  textMuted: '#8A8680',
  textFaint: '#C5C0BA',
  gold:      '#C5A880',
  green:     '#22C55E',
  surface:   '#F5F4F2',
  serif:     "'Cormorant Garamond', Georgia, serif",
} as const

interface Fase {
  label:  string
  href:   string
  check:  () => boolean
}

const FASES: Fase[] = [
  {
    label: 'Identidade',
    href:  '/dashboard/membro/posicionamento',
    check: () => {
      try {
        const raw = localStorage.getItem('identidade_marca_v1')
          || localStorage.getItem(memberKey('identidade_marca_v1'))
        if (!raw) return false
        const data = JSON.parse(raw)
        return Object.values(data?.pilares ?? {}).some(
          (p: any) => p?.reflexao?.trim().length > 0
        )
      } catch { return false }
    },
  },
  {
    label: 'Pilares',
    href:  '/dashboard/membro/pilares',
    check: () => {
      try {
        const raw = localStorage.getItem(memberKey('pilares_store_v1'))
          || localStorage.getItem('pilares_store_v1')
        if (!raw) return false
        const arr = JSON.parse(raw)
        return Array.isArray(arr) && arr.length > 0
      } catch { return false }
    },
  },
  {
    label: 'Metas',
    href:  '/dashboard/membro/okr',
    check: () => {
      try {
        const raw = localStorage.getItem(memberKey('okr_store_v1'))
        if (!raw) return false
        const arr = JSON.parse(raw)
        return Array.isArray(arr) && arr.length > 0
      } catch { return false }
    },
  },
  {
    label: 'Marketing',
    href:  '/dashboard/membro/marketing',
    check: () => {
      try {
        const raw = localStorage.getItem(memberKey('marketing_store_v1'))
        if (!raw) return false
        const arr = JSON.parse(raw)
        return Array.isArray(arr) && arr.length > 0
      } catch { return false }
    },
  },
  {
    label: 'Indicadores',
    href:  '/dashboard/membro/kpis',
    check: () => {
      try {
        const raw = localStorage.getItem(memberKey('kpis_store_v1'))
        if (!raw) return false
        const arr = JSON.parse(raw)
        return Array.isArray(arr) && arr.length > 0
      } catch { return false }
    },
  },
]

interface Props {
  /** Slug da fase atual — a que não deve ser link (ex: 'Identidade') */
  atual: string
}

export function JornadaPanorama({ atual }: Props) {
  const [done, setDone] = useState<boolean[]>(new Array(FASES.length).fill(false))

  useEffect(() => {
    setDone(FASES.map(f => f.check()))
  }, [])

  const completedCount = done.filter(Boolean).length
  const pct = Math.round((completedCount / FASES.length) * 100)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      padding: '12px 16px',
      background: D.surface,
      border: `1px solid ${D.border}`,
      marginBottom: 32,
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: D.textMuted }}>
          Jornada de Relevância
        </span>
        <span style={{ fontSize: 11, fontFamily: D.serif, color: pct === 100 ? D.green : D.gold }}>
          {completedCount}/{FASES.length} fases concluídas
        </span>
      </div>

      {/* Fases */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {FASES.map((fase, i) => {
          const isDone    = done[i]
          const isAtual   = fase.label === atual
          const isNext    = !isDone && !isAtual && FASES.slice(0, i).every((_, j) => done[j])
          const isLast    = i === FASES.length - 1

          const dotColor  = isDone ? D.green : isAtual ? D.gold : D.textFaint
          const textColor = isDone ? D.textSub : isAtual ? D.text : D.textFaint
          const fontW     = isAtual ? 600 : 400

          const inner = (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '2px 6px', cursor: isAtual ? 'default' : 'pointer' }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: isDone ? dotColor : 'transparent',
                border: `2px solid ${dotColor}`,
                boxShadow: isAtual ? `0 0 0 3px rgba(197,168,128,0.2)` : isNext ? `0 0 0 3px rgba(34,197,94,0.12)` : 'none',
                transition: 'all 0.2s',
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 10, color: textColor, fontWeight: fontW, whiteSpace: 'nowrap', letterSpacing: '0.01em' }}>
                {fase.label}
              </span>
            </div>
          )

          return (
            <div key={fase.label} style={{ display: 'flex', alignItems: 'center', flex: isLast ? '0 0 auto' : 1 }}>
              {isAtual ? inner : (
                <Link to={fase.href} style={{ textDecoration: 'none' }}>
                  {inner}
                </Link>
              )}
              {!isLast && (
                <div style={{
                  flex: 1, height: 1,
                  background: isDone ? 'rgba(34,197,94,0.35)' : D.border,
                  margin: '0 0 16px',
                  transition: 'background 0.3s',
                }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: `rgba(26,25,22,0.06)`, borderRadius: 1, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${Math.max(2, pct)}%`,
          background: pct === 100 ? D.green : D.gold,
          borderRadius: 1,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  )
}
