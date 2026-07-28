import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'
import { memberKey } from '@/lib/memberStorage'

export const Route = createFileRoute('/dashboard/membro/')({ component: HomePage })

/* ─── tipos mínimos ─── */
interface KeyResult { id: string; meta: number; atual: number }
interface Objective  { id: string; titulo: string; keyResults: KeyResult[] }

const OKR_KEY = 'okr_store_v1'

function pct(atual: number, meta: number) {
  return !meta ? 0 : Math.min(100, Math.round((atual / meta) * 100))
}
function objPct(obj: Objective) {
  if (!obj.keyResults.length) return 0
  return Math.round(obj.keyResults.reduce((s, kr) => s + pct(kr.atual, kr.meta), 0) / obj.keyResults.length)
}

/* ─── módulo card ─── */
interface ModuloCardProps { numero: string; titulo: string; descricao: string; icone: ReactNode; href: string }
function ModuloCard({ numero, titulo, descricao, icone, href }: ModuloCardProps) {
  return (
    <Link to={href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div
        style={{
          backgroundColor: '#191715',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '4px',
          padding: '36px 28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          height: '100%',
          boxSizing: 'border-box',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#1D1A18'
          e.currentTarget.style.borderColor = 'rgba(197,168,128,0.3)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#191715'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '11px', color: '#C5A880', fontWeight: 600, letterSpacing: '0.15em', fontFamily: 'system-ui, sans-serif' }}>{numero}</span>
            {icone}
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 400, color: '#EFECE6', margin: '0 0 12px 0', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
            {titulo}
          </h3>
          <p style={{ fontSize: '13px', color: '#9E9A94', lineHeight: 1.6, margin: 0, fontFamily: 'system-ui, sans-serif' }}>
            {descricao}
          </p>
        </div>
        <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#C5A880', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500, fontFamily: 'system-ui, sans-serif' }}>
          <span>Acessar Módulo</span>
          <span style={{ fontSize: '14px' }}>→</span>
        </div>
      </div>
    </Link>
  )
}

/* ─── nav link helper ─── */
function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      to={href}
      style={{ textDecoration: 'none', color: '#9E9A94', transition: 'color 0.2s', fontSize: '13px', letterSpacing: '0.05em' }}
      onMouseEnter={e => (e.currentTarget.style.color = '#EFECE6')}
      onMouseLeave={e => (e.currentTarget.style.color = '#9E9A94')}
    >
      {children}
    </Link>
  )
}

/* ═══════════════════════════════════════════
   PÁGINA PRINCIPAL
═══════════════════════════════════════════ */
function HomePage() {
  const { user } = useAuth()
  const nomeCompleto = user?.full_name ?? ''
  const iniciais = nomeCompleto.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U'

  const [okrs, setOkrs] = useState<Objective[]>([])

  useEffect(() => {
    try {
      const s = localStorage.getItem(memberKey(OKR_KEY))
      if (s) setOkrs(JSON.parse(s) ?? [])
    } catch {}
  }, [])

  const progOkrs = okrs.length
    ? Math.round(okrs.reduce((s, o) => s + objPct(o), 0) / okrs.length)
    : 0

  return (
    <div style={{
      backgroundColor: '#121110',
      color: '#EFECE6',
      minHeight: '100%',
      fontFamily: 'Cormorant Garamond, Georgia, serif',
    }}>

      {/* ── Cabeçalho ── */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '32px 64px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
          <span style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F9F8F6' }}>
            Hub de Relevância
          </span>
          <nav style={{ display: 'flex', gap: '32px' }}>
            <NavLink href="/dashboard/membro">Panorama Geral</NavLink>
            <NavLink href="/dashboard/membro/posicionamento">Identidade &amp; Posicionamento</NavLink>
            <NavLink href="/dashboard/membro/pilares">Pilares de Atuação</NavLink>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '13px', color: '#9E9A94', fontFamily: 'system-ui, sans-serif' }}>{nomeCompleto}</span>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            backgroundColor: '#262422', border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 600, fontFamily: 'system-ui, sans-serif', color: '#EFECE6', flexShrink: 0,
          }}>
            {iniciais}
          </div>
        </div>
      </header>

      {/* ── Conteúdo principal ── */}
      <main style={{ padding: '80px 64px', maxWidth: '1440px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

        {/* Bloco hero */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '80px', alignItems: 'center', marginBottom: '100px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '24px', height: '1px', backgroundColor: '#C5A880' }} />
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#C5A880', fontFamily: 'system-ui, sans-serif' }}>
                Arquitetura Estratégica de Marca
              </span>
            </div>

            <h1 style={{ fontSize: '64px', fontWeight: 300, lineHeight: 1.08, margin: '0 0 28px 0', letterSpacing: '-0.02em' }}>
              A precisão da forma aplicada à relevância profissional.
            </h1>

            <p style={{ fontSize: '18px', color: '#9E9A94', lineHeight: 1.6, marginBottom: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '600px' }}>
              Um ambiente digital construído sob medida para auditar, estruturar e consolidar a sua autoridade no mercado com rigor estético e analítico.
            </p>

            <Link to="/dashboard/membro/posicionamento" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  backgroundColor: '#EFECE6', color: '#121110', border: 'none',
                  padding: '18px 36px', borderRadius: '2px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'system-ui, sans-serif', letterSpacing: '0.05em',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#EFECE6')}
              >
                Iniciar Imersão Estratégica
              </button>
            </Link>
          </div>

          {/* Cartão de métricas */}
          <div style={{
            backgroundColor: '#191715',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '4px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontFamily: 'system-ui, sans-serif', color: '#9E9A94', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Índice de Maturidade
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C5A880" strokeWidth="1.5">
                <polygon points="12 2 2 22 22 22 12 2" />
              </svg>
            </div>

            <div style={{ fontSize: '56px', fontWeight: 300, color: '#EFECE6', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {okrs.length > 0 ? (
                <>{progOkrs}<span style={{ fontSize: '28px', color: '#C5A880', marginLeft: '4px' }}>%</span></>
              ) : (
                <span style={{ fontSize: '36px', color: '#75716B' }}>—</span>
              )}
            </div>

            <p style={{ fontSize: '14px', color: '#9E9A94', fontFamily: 'system-ui, sans-serif', margin: 0, lineHeight: 1.6 }}>
              {okrs.length > 0
                ? `Progresso médio de ${okrs.length} objetivo${okrs.length > 1 ? 's' : ''} ativo${okrs.length > 1 ? 's' : ''}.`
                : 'Configure seus OKRs para visualizar o índice de progresso.'}
            </p>

            <div style={{ width: '100%', height: '2px', backgroundColor: '#262422', borderRadius: '1px', overflow: 'hidden', marginTop: '8px' }}>
              <div style={{ width: `${okrs.length > 0 ? progOkrs : 0}%`, height: '100%', backgroundColor: '#C5A880', transition: 'width 0.4s ease' }} />
            </div>

            {okrs.length > 0 && (
              <Link to="/dashboard/membro/okr" style={{ textDecoration: 'none' }}>
                <span style={{ fontSize: '11px', color: '#C5A880', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>
                  Ver detalhes →
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Módulos */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 300, margin: 0, letterSpacing: '-0.01em' }}>
            Módulos Fundamentais
          </h2>
          <span style={{ fontSize: '12px', color: '#9E9A94', fontFamily: 'system-ui, sans-serif', letterSpacing: '0.05em' }}>
            Estrutura 01 a 04
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          <ModuloCard
            numero="01"
            titulo="Identidade & Essência"
            descricao="Definição aprofundada da proposta de valor, tom de voz e diferenciais competitivos exclusivos."
            href="/dashboard/membro/posicionamento"
            icone={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C5A880" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
              </svg>
            }
          />
          <ModuloCard
            numero="02"
            titulo="Pilares de Atuação"
            descricao="Mapeamento estrutural das frentes centrais de entrega e alta rentabilidade profissional."
            href="/dashboard/membro/pilares"
            icone={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C5A880" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
              </svg>
            }
          />
          <ModuloCard
            numero="03"
            titulo="OKRs & Trajetória"
            descricao="Direcionadores de crescimento mensuráveis para metas trimestrais e de longo prazo."
            href="/dashboard/membro/okr"
            icone={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C5A880" strokeWidth="1.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
          />
          <ModuloCard
            numero="04"
            titulo="Analytics Executivo"
            descricao="Painéis de dados integrados para auditoria constante de posicionamento e conversão."
            href="/dashboard/membro/kpis"
            icone={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C5A880" strokeWidth="1.5">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            }
          />
        </div>

      </main>

      {/* ── Rodapé ── */}
      <footer style={{
        padding: '32px 64px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#75716B',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <span>{nomeCompleto} — Hub de Arquitetura de Relevância</span>
        <span>Edição 2026</span>
      </footer>

    </div>
  )
}
