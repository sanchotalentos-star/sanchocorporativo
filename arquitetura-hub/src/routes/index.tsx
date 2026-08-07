import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronDown, Sparkles, BookOpen, Layers, Target,
  ArrowUpRight, ArrowRight, X,
} from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

// ── AR Design System ──────────────────────────────────────────────
const GOLD       = '#C5A880'
const GOLD_DEEP  = '#A88B62'
const WARM_WHITE = '#F5F2EC'
const WARM_BLACK = '#0A0907'
const TEXT_DIM   = 'rgba(245,242,236,0.55)'
const TEXT_MID   = 'rgba(245,242,236,0.75)'
const BORDER_DIM = 'rgba(245,242,236,0.09)'
const BORDER_MID = 'rgba(245,242,236,0.18)'

// Font family strings
const SERIF = "'Cormorant Garamond', Georgia, serif"
const SANS  = "'Outfit', system-ui, -apple-system, sans-serif"

// ── RAF-based video fade (no CSS transitions) ─────────────────────
function VideoBackground() {
  const videoRef     = useRef<HTMLVideoElement>(null)
  const rafRef       = useRef<number | null>(null)
  const fadingOutRef = useRef(false)

  const cancelRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const fadeIn = useCallback((video: HTMLVideoElement) => {
    cancelRaf()
    const start        = performance.now()
    const startOpacity = parseFloat(video.style.opacity || '0')
    const DURATION     = 250

    const step = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1)
      video.style.opacity = String(startOpacity + (1 - startOpacity) * t)
      if (t < 1) rafRef.current = requestAnimationFrame(step)
      else rafRef.current = null
    }
    rafRef.current = requestAnimationFrame(step)
  }, [cancelRaf])

  const fadeOut = useCallback((video: HTMLVideoElement, onDone: () => void) => {
    cancelRaf()
    const start        = performance.now()
    const startOpacity = parseFloat(video.style.opacity || '1')
    const DURATION     = 250

    const step = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1)
      video.style.opacity = String(startOpacity * (1 - t))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        video.style.opacity = '0'
        rafRef.current = null
        onDone()
      }
    }
    rafRef.current = requestAnimationFrame(step)
  }, [cancelRaf])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.style.opacity = '0'

    const onCanPlay = () => fadeIn(v)

    const onTimeUpdate = () => {
      if (!v.duration) return
      const remaining = v.duration - v.currentTime
      if (remaining <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true
        fadeOut(v, () => { /* ended handles restart */ })
      }
    }

    const onEnded = () => {
      fadingOutRef.current = false
      v.style.opacity = '0'
      cancelRaf()
      setTimeout(() => {
        v.currentTime = 0
        v.play().then(() => fadeIn(v)).catch(() => {})
      }, 100)
    }

    v.addEventListener('canplay', onCanPlay)
    v.addEventListener('timeupdate', onTimeUpdate)
    v.addEventListener('ended', onEnded)

    return () => {
      cancelRaf()
      v.removeEventListener('canplay', onCanPlay)
      v.removeEventListener('timeupdate', onTimeUpdate)
      v.removeEventListener('ended', onEnded)
    }
  }, [fadeIn, fadeOut, cancelRaf])

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      autoPlay
      src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4"
      style={{
        position: 'absolute',
        width: '115%', height: '115%',
        objectFit: 'cover', objectPosition: 'center top',
        left: '50%', top: 0,
        transform: 'translateX(-50%)',
        opacity: 0,
        zIndex: 0,
      }}
    />
  )
}

// ── Compound badge (dark pill + light label) ──────────────────────
function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'inline-flex', alignItems: 'center',
        borderRadius: 9999,
        background: 'rgba(10,9,7,0.72)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${BORDER_MID}`,
        padding: '4px 4px 4px 12px',
        gap: 0,
        boxShadow: '0 2px 16px rgba(0,0,0,0.24)',
      }}
    >
      {/* Dark pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: WARM_BLACK,
        borderRadius: 9999, padding: '5px 12px',
        marginRight: 10,
      }}>
        <Sparkles size={11} color={GOLD} strokeWidth={2} />
        <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, color: GOLD, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Método
        </span>
      </div>
      {/* Label */}
      <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 400, color: TEXT_MID, paddingRight: 8, letterSpacing: '0.01em' }}>
        5 camadas para construir sua relevância
      </span>
    </motion.div>
  )
}

// ── Smooth scroll helper ──────────────────────────────────────────
function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ── Action input box — chips descem para a seção correspondente ───
function HeroActionBox() {
  const [inputValue, setInputValue] = useState('')

  const CHIPS: { label: string; id: string; icon: React.ReactNode }[] = [
    { label: 'Identidade', id: 'passo-identidade', icon: <BookOpen size={12} strokeWidth={2} /> },
    { label: 'Pilares',    id: 'passo-pilares',    icon: <Layers    size={12} strokeWidth={2} /> },
    { label: 'Metas',      id: 'passo-metas',      icon: <Target    size={12} strokeWidth={2} /> },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: '100%', maxWidth: 728,
        borderRadius: 18,
        background: 'rgba(10,9,7,0.34)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${BORDER_MID}`,
        padding: '14px 14px 12px',
        display: 'flex', flexDirection: 'column', gap: 12,
        boxShadow: '0 8px 40px rgba(0,0,0,0.32)',
      }}
    >
      {/* ── Top row ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 500, color: TEXT_MID, letterSpacing: '0.04em' }}>
          Sua Jornada
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={12} color={GOLD} strokeWidth={2} />
          <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 500, color: TEXT_MID, letterSpacing: '0.02em' }}>
            Mentoria 1:1
          </span>
        </div>
      </div>

      {/* ── Input area ── */}
      <div style={{
        background: 'rgba(245,242,236,0.96)',
        borderRadius: 12,
        padding: '14px 14px 14px 18px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
      }}>
        <input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Por onde você quer começar?"
          style={{
            flex: 1,
            background: 'transparent', border: 'none', outline: 'none',
            fontFamily: SANS, fontSize: 16, fontWeight: 400,
            color: WARM_BLACK,
          }}
        />
        <Link to="/auth" style={{ textDecoration: 'none' }}>
          <button style={{
            width: 36, height: 36, borderRadius: '50%',
            background: GOLD, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'background 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = GOLD_DEEP)}
            onMouseLeave={e => (e.currentTarget.style.background = GOLD)}
          >
            <ArrowRight size={16} color={WARM_BLACK} strokeWidth={2.5} />
          </button>
        </Link>
      </div>

      {/* ── Bottom row: chips que descem até a camada ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {CHIPS.map(chip => (
            <button
              key={chip.label}
              onClick={() => scrollToId(chip.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'rgba(245,242,236,0.12)',
                border: `1px solid ${BORDER_MID}`,
                borderRadius: 6, padding: '6px 10px',
                cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(197,168,128,0.2)'
                e.currentTarget.style.borderColor = GOLD
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(245,242,236,0.12)'
                e.currentTarget.style.borderColor = BORDER_MID
              }}
            >
              <span style={{ color: GOLD }}>{chip.icon}</span>
              <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 500, color: TEXT_MID, letterSpacing: '0.04em' }}>
                {chip.label}
              </span>
            </button>
          ))}
        </div>
        <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 400, color: TEXT_DIM, letterSpacing: '0.02em' }}>
          5 etapas do método
        </span>
      </div>
    </motion.div>
  )
}

// ── Below-fold scroll reveal ──────────────────────────────────────
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ── Nav links data ────────────────────────────────────────────────
const NAV_CENTER = [
  { label: 'Metodologia',  href: '#metodo',    dropdown: false },
  { label: 'Jornada',      href: '#metodo',    dropdown: true  },
  { label: 'Para Quem',    href: '#para-quem', dropdown: false },
  { label: 'Mentores',     href: '#metodo',    dropdown: false },
]

// ── Below-fold content data ───────────────────────────────────────
// id deve coincidir com os chips do HeroActionBox (passo-<id>)
const STEPS = [
  {
    n: '01', id: 'passo-identidade', label: 'Identidade',
    desc: 'Quem você é, para quem fala e o que entrega de diferente.',
    detail: 'Definimos juntos seu posicionamento único: nicho, proposta de valor e a narrativa que diferencia você no mercado.',
  },
  {
    n: '02', id: 'passo-pilares', label: 'Pilares',
    desc: 'As frentes estratégicas de presença e autoridade no mercado.',
    detail: 'Mapeamos os 3 a 5 eixos temáticos pelos quais você vai construir presença consistente e se tornar referência no seu campo.',
  },
  {
    n: '03', id: 'passo-metas', label: 'Metas',
    desc: 'OKRs trimestrais com plano de ação e ciclo de revisão.',
    detail: 'Estruturamos objetivos mensuráveis com key results claros para que cada semana de execução esteja conectada a um resultado concreto.',
  },
  {
    n: '04', id: 'passo-marketing', label: 'Marketing',
    desc: 'Agenda editorial e distribuição ao longo do ano.',
    detail: 'Criamos um calendário de conteúdo realista e sustentável, alinhado à sua identidade e distribuído nos canais onde seu público está.',
  },
  {
    n: '05', id: 'passo-indicadores', label: 'Indicadores',
    desc: 'KPIs de autoridade e relatórios de evolução contínua.',
    detail: 'Acompanhamos números que realmente importam para a construção de relevância: alcance, percepção e geração de oportunidades.',
  },
]

const PROFILES = [
  { tag: 'ESPECIALISTAS', title: 'Especialistas e consultores',  desc: 'Profissionais de alta performance que dominam o que fazem — mas ainda não são vistos como a referência que já são.' },
  { tag: 'LIDERANÇAS',    title: 'Líderes e executivos',         desc: 'Com trajetória sólida e resultados comprovados, mas sem o posicionamento externo que reflita seu nível de influência real.' },
  { tag: 'EMPREENDEDORES', title: 'Empreendedores e fundadores', desc: 'Que constroem negócios excepcionais, mas ainda dependem de indicação porque o mercado não enxerga sua autoridade.' },
]

function PrimaryBtn({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to}>
      <button
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '14px 28px', background: GOLD, color: WARM_BLACK,
          border: 'none', cursor: 'pointer', fontFamily: SANS,
          fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        {children}
      </button>
    </Link>
  )
}

// ══════════════════════════════════════════════════════════════════
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ fontFamily: SANS, background: WARM_BLACK, color: WARM_WHITE, WebkitFontSmoothing: 'antialiased' } as React.CSSProperties}>

      {/* ── Fonts: Cormorant Garamond (serif display) + Outfit (premium sans) ── */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* ════════════════════════════════════════════════════════════
          HERO SECTION — video full-screen + centered content
          ════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: '100svh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Video background with RAF fade */}
        <VideoBackground />

        {/* Dark overlay — warm-tinted for AR feel */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,9,7,0.58) 0%, rgba(10,9,7,0.44) 50%, rgba(10,9,7,0.68) 100%)', zIndex: 1 }} />

        {/* ── Navigation ── */}
        <nav style={{
          position: 'relative', zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px clamp(24px,8vw,120px)',
        }}>

          {/* Logo — nome completo, sem ícone */}
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: WARM_WHITE, letterSpacing: '-0.02em' }}>
                Arquitetura de Relevância
              </span>
            </Link>
          </motion.div>

          {/* Desktop nav links — hidden on mobile */}
          <div className="hidden md:flex items-center" style={{ gap: 36 }}>
            {NAV_CENTER.map(({ label, href, dropdown }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: (i + 1) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <a href={href} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontFamily: SANS, fontSize: 15, fontWeight: 500, color: TEXT_MID, letterSpacing: '-0.01em', transition: 'color 0.15s' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = WARM_WHITE)}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = TEXT_MID)}
                  >
                    {label}
                  </span>
                  {dropdown && <ChevronDown size={13} color={TEXT_DIM} strokeWidth={2} />}
                </a>
              </motion.div>
            ))}
          </div>

          {/* Right: CTA buttons + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.div
              initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:flex items-center"
              style={{ gap: 8 }}
            >
              <Link to="/auth">
                <button style={{
                  fontFamily: SANS, fontSize: 14, fontWeight: 500,
                  color: TEXT_MID, background: 'transparent',
                  border: `1px solid ${BORDER_MID}`, borderRadius: 9999,
                  padding: '8px 22px', cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s',
                  letterSpacing: '-0.01em',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = WARM_WHITE; e.currentTarget.style.color = WARM_WHITE }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER_MID; e.currentTarget.style.color = TEXT_MID }}
                >
                  Solicitar Acesso
                </button>
              </Link>
              <Link to="/auth">
                <button style={{
                  fontFamily: SANS, fontSize: 14, fontWeight: 600,
                  color: WARM_BLACK, background: GOLD,
                  border: 'none', borderRadius: 9999,
                  padding: '8px 22px', cursor: 'pointer', transition: 'opacity 0.15s',
                  letterSpacing: '-0.01em',
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Acessar
                </button>
              </Link>
            </motion.div>

            {/* Hamburger */}
            <motion.button
              initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setMenuOpen(true)}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: WARM_WHITE, border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                flexShrink: 0,
              }}
              aria-label="Abrir menu"
            >
              <span style={{ width: 15, height: 1.5, background: WARM_BLACK, display: 'block', borderRadius: 1 }} />
              <span style={{ width: 15, height: 1.5, background: WARM_BLACK, display: 'block', borderRadius: 1 }} />
              <span style={{ width: 15, height: 1.5, background: WARM_BLACK, display: 'block', borderRadius: 1 }} />
            </motion.button>
          </div>
        </nav>

        {/* ── Hero content (60px below nav, shifted up 50px) ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative', zIndex: 10,
          paddingTop: 10,         /* 60px gap − 50px shift = 10px */
          paddingBottom: 'clamp(32px,5vw,64px)',
          padding: '10px clamp(24px,5vw,80px) clamp(32px,5vw,64px)',
          textAlign: 'center',
        }}>

          {/* Badge */}
          <HeroBadge />

          {/* Headline — Cormorant Garamond: the AR serif */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(52px,8vw,96px)',
              fontWeight: 700,
              lineHeight: 0.96,
              letterSpacing: '-0.04em',
              color: WARM_WHITE,
              margin: '34px 0 0',
              maxWidth: 820,
            }}
          >
            Você tem a altitude.{' '}
            <br />
            <span style={{ fontStyle: 'italic', color: GOLD }}>Falta a visibilidade.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(15px,2vw,19px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: TEXT_MID,
              lineHeight: 1.65,
              maxWidth: 560,
              margin: '34px auto 0',
            }}
          >
            Arquitetura de Relevância é para quem já chegou longe — profissionais
            excepcionalmente competentes que ainda não ocupam o espaço de autoridade
            e reconhecimento que sua expertise merece.
          </motion.p>

          {/* Eyebrow line below subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(13px,1.6vw,15px)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              color: TEXT_DIM,
              lineHeight: 1.6,
              maxWidth: 480,
              margin: '16px auto 0',
            }}
          >
            O método transforma o que você já construiu em presença real,
            posicionamento claro e oportunidades que chegam até você.
          </motion.p>

          {/* Action box */}
          <div style={{ marginTop: 44, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <HeroActionBox />
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          MOBILE MENU OVERLAY
          ════════════════════════════════════════════════════════════ */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: WARM_BLACK,
            display: 'flex', flexDirection: 'column',
            padding: 'clamp(20px,4vw,24px) clamp(20px,5vw,48px)',
          }}
        >
          {/* Top */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: WARM_WHITE, letterSpacing: '-0.02em' }}>
              Arquitetura de Relevância
            </span>
            <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu"
              style={{ width: 36, height: 36, borderRadius: '50%', background: WARM_WHITE, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} color={WARM_BLACK} strokeWidth={2.5} />
            </button>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginTop: 56 }}>
            {NAV_CENTER.map(({ label, href }) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none' }}>
                <span style={{ fontFamily: SERIF, fontSize: 'clamp(32px,8vw,52px)', fontWeight: 600, letterSpacing: '-0.03em', fontStyle: 'italic', color: WARM_WHITE }}>
                  {label}
                </span>
              </a>
            ))}
          </div>

          {/* Mobile CTA */}
          <div style={{ marginTop: 'auto', paddingBottom: 8 }}>
            <Link to="/auth" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: SANS, fontSize: 'clamp(16px,4vw,22px)', fontWeight: 600, letterSpacing: '-0.01em', color: GOLD }}>
                Acessar Plataforma
              </span>
              <ArrowUpRight size={22} color={GOLD} />
            </Link>
          </div>
        </motion.div>
      )}

      {/* ════════════════════════════════════════════════════════════
          METODOLOGIA
          ════════════════════════════════════════════════════════════ */}
      <section id="metodo" style={{ background: WARM_BLACK, borderTop: `1px solid ${BORDER_DIM}` }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '120px clamp(24px,5vw,40px)' }}>
          <FadeUp>
            <p style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 24 }}>Método</p>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 80, alignItems: 'start' }}>
            <FadeUp delay={0.1}>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(42px,6vw,80px)', fontStyle: 'italic', fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.03em', margin: 0, color: WARM_WHITE }}>
                Cinco camadas<br /><span style={{ color: GOLD }}>de construção.</span>
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.85, color: 'rgba(245,242,236,0.42)', marginTop: 32, maxWidth: 380 }}>
                Cada participante evolui dentro de um hub individual, com visão clara do que construir semana a semana.
              </p>
              <div style={{ marginTop: 40 }}>
                <PrimaryBtn to="/auth">Acessar a plataforma <ArrowUpRight size={13} /></PrimaryBtn>
              </div>
            </FadeUp>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {STEPS.map((s, i) => (
                <FadeUp key={s.n} delay={0.12 + i * 0.07}>
                  <div
                    id={s.id}
                    style={{ scrollMarginTop: '20px', display: 'grid', gridTemplateColumns: '52px 1fr', gap: 20, padding: '26px 0', borderBottom: i < STEPS.length - 1 ? `1px solid ${BORDER_DIM}` : 'none', alignItems: 'start' }}
                  >
                    <span style={{ fontFamily: SERIF, fontSize: 30, fontStyle: 'italic', fontWeight: 700, color: GOLD, lineHeight: 1, letterSpacing: '-0.02em' }}>{s.n}</span>
                    <div>
                      <p style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: WARM_WHITE, marginBottom: 5, letterSpacing: '-0.01em' }}>{s.label}</p>
                      <p style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.75, color: 'rgba(245,242,236,0.38)' }}>{s.desc}</p>
                      <p style={{ fontFamily: SANS, fontSize: 12, lineHeight: 1.8, color: 'rgba(245,242,236,0.28)', marginTop: 8 }}>{s.detail}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          PARA QUEM
          ════════════════════════════════════════════════════════════ */}
      <section id="para-quem" style={{ background: '#060504', borderTop: `1px solid ${BORDER_DIM}` }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '120px clamp(24px,5vw,40px)' }}>
          <FadeUp>
            <p style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 24 }}>Para quem é</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(36px,5.5vw,72px)', fontStyle: 'italic', fontWeight: 700, lineHeight: 1.06, letterSpacing: '-0.025em', color: WARM_WHITE, marginBottom: 32, maxWidth: 640 }}>
              Você já é competente.<br /><span style={{ color: GOLD }}>Ainda não é visto assim.</span>
            </h2>
            <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.85, color: 'rgba(245,242,236,0.42)', maxWidth: 540, marginBottom: 72 }}>
              A Arquitetura de Relevância não é para quem quer parecer o que não é.
              É para quem já chegou longe pela competência — mas ainda não ocupa o
              espaço de autoridade e visibilidade que esse caminho merece.
            </p>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', border: `1px solid ${BORDER_DIM}` }}>
            {PROFILES.map((p, i) => (
              <FadeUp key={i} delay={0.1 + i * 0.09}>
                <div style={{ padding: '44px 32px', borderRight: i < 2 ? `1px solid ${BORDER_DIM}` : 'none', height: '100%' }}>
                  <p style={{ fontFamily: SANS, fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: GOLD, marginBottom: 20 }}>{p.tag}</p>
                  <div style={{ width: 20, height: 1, background: GOLD, marginBottom: 20, opacity: 0.5 }} />
                  <p style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: WARM_WHITE, marginBottom: 12, lineHeight: 1.35, letterSpacing: '-0.01em' }}>{p.title}</p>
                  <p style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.8, color: 'rgba(245,242,236,0.38)' }}>{p.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CTA
          ════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#0D0B09', borderTop: `1px solid ${BORDER_DIM}` }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '140px clamp(24px,5vw,40px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'end' }}>
            <FadeUp>
              <p style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 24 }}>Faça parte</p>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(44px,7vw,96px)', fontStyle: 'italic', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.03em', margin: 0, color: WARM_WHITE }}>
                Sua competência<br /><span style={{ color: GOLD }}>merece ser vista.</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
                <PrimaryBtn to="/auth">Acessar a plataforma <ArrowUpRight size={13} /></PrimaryBtn>
                <Link to="/auth">
                  <button style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '13px 28px', background: 'transparent', color: WARM_WHITE,
                    border: `1px solid ${BORDER_MID}`, cursor: 'pointer', fontFamily: SANS,
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                    whiteSpace: 'nowrap', transition: 'border-color 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = BORDER_MID.replace('0.18', '0.4'))}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER_MID)}
                  >
                    Solicitar acesso
                  </button>
                </Link>
                <p style={{ fontFamily: SANS, fontSize: 11, color: 'rgba(245,242,236,0.28)', lineHeight: 1.6, maxWidth: 200 }}>
                  Acesso restrito aos participantes ativos do programa.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════════════════════ */}
      <footer style={{ background: WARM_BLACK, borderTop: `1px solid ${BORDER_DIM}`, padding: '24px clamp(24px,5vw,40px)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontFamily: SERIF, fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em', color: 'rgba(245,242,236,0.3)' }}>
            Arquitetura de Relevância
          </span>
          <p style={{ fontFamily: SANS, fontSize: 11, color: 'rgba(245,242,236,0.18)', letterSpacing: '0.02em' }}>
            © {new Date().getFullYear()} Sancho Gestão de Carreiras
          </p>
        </div>
      </footer>

    </div>
  )
}
