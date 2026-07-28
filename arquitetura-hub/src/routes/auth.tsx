import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, forwardRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})

const GOLD = '#C5A880'
const BG = '#0F0D0C'
const CARD_BG = '#161412'
const BORDER = 'rgba(255,255,255,0.08)'
const BORDER_GOLD = 'rgba(197,168,128,0.25)'
const TEXT = '#EFECE6'
const TEXT_DIM = 'rgba(239,236,230,0.35)'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

const requestSchema = z.object({
  full_name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  mensagem: z.string().min(10, 'Mensagem muito curta'),
})

type LoginForm = z.infer<typeof loginSchema>
type RequestForm = z.infer<typeof requestSchema>

const baseInput: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  fontSize: 13,
  color: TEXT,
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${BORDER}`,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, background 0.15s',
  fontFamily: 'inherit',
}

const AuthInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function AuthInput(props, ref) {
    const [focused, setFocused] = useState(false)
    return (
      <input
        {...props}
        ref={ref}
        style={{
          ...baseInput,
          ...props.style,
          borderColor: focused ? GOLD : BORDER,
          background: focused ? 'rgba(197,168,128,0.05)' : 'rgba(255,255,255,0.04)',
        }}
        onFocus={e => { setFocused(true); props.onFocus?.(e) }}
        onBlur={e => { setFocused(false); props.onBlur?.(e) }}
      />
    )
  }
)

const AuthTextarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function AuthTextarea(props, ref) {
    const [focused, setFocused] = useState(false)
    return (
      <textarea
        {...props}
        ref={ref}
        style={{
          ...baseInput,
          resize: 'none',
          borderColor: focused ? GOLD : BORDER,
          background: focused ? 'rgba(197,168,128,0.05)' : 'rgba(255,255,255,0.04)',
          fontFamily: 'inherit',
        }}
        onFocus={e => { setFocused(true); props.onFocus?.(e) }}
        onBlur={e => { setFocused(false); props.onBlur?.(e) }}
      />
    )
  }
)

function AuthPage() {
  const [tab, setTab] = useState<'login' | 'request'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const loginForm   = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })
  const requestForm = useForm<RequestForm>({ resolver: zodResolver(requestSchema) })

  async function onLogin(data: LoginForm) {
    try {
      await login(data.email, data.password)
      const stored = localStorage.getItem('mock_user')
      const role = stored ? (JSON.parse(stored) as { role: string }).role : 'membro'
      void navigate({ to: role === 'admin' ? '/dashboard/admin' : '/dashboard/membro' })
      toast.success('Bem-vindo(a) de volta!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Credenciais inválidas')
    }
  }

  function onRequest(data: RequestForm) {
    console.log(data)
    toast.success('Solicitação enviada! Entraremos em contato em breve.')
    requestForm.reset()
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      background: BG,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* Brand mark */}
      <div style={{ marginBottom: 44, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: GOLD }} />
        </div>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(239,236,230,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Arquitetura de Relevância
        </p>
      </div>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: CARD_BG,
        border: `1px solid ${BORDER_GOLD}`,
        padding: '36px 32px',
      }}>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, marginBottom: 28 }}>
          {(['login', 'request'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                paddingBottom: 12,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: tab === t ? TEXT : 'rgba(239,236,230,0.28)',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${tab === t ? GOLD : 'transparent'}`,
                marginBottom: -1,
                cursor: 'pointer',
                transition: 'all 0.15s',
                textTransform: 'uppercase' as const,
              }}
            >
              {t === 'login' ? 'Entrar' : 'Solicitar acesso'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <form onSubmit={loginForm.handleSubmit(onLogin)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: TEXT_DIM, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
                Email
              </label>
              <AuthInput
                type="email"
                placeholder="seu@email.com"
                {...loginForm.register('email')}
              />
              {loginForm.formState.errors.email && (
                <p style={{ fontSize: 11, color: '#f87171', marginTop: 6 }}>{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: TEXT_DIM, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <AuthInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{ paddingRight: 44 }}
                  {...loginForm.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,236,230,0.3)', padding: 2 }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p style={{ fontSize: 11, color: '#f87171', marginTop: 6 }}>{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginForm.formState.isSubmitting}
              style={{
                width: '100%',
                padding: '13px',
                background: GOLD,
                color: '#1A1208',
                border: 'none',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: loginForm.formState.isSubmitting ? 'not-allowed' : 'pointer',
                opacity: loginForm.formState.isSubmitting ? 0.6 : 1,
                marginTop: 6,
                transition: 'opacity 0.15s',
              }}
              onMouseOver={e => { if (!loginForm.formState.isSubmitting) e.currentTarget.style.opacity = '0.85' }}
              onMouseOut={e => e.currentTarget.style.opacity = loginForm.formState.isSubmitting ? '0.6' : '1'}
            >
              {loginForm.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <form onSubmit={requestForm.handleSubmit(onRequest)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: TEXT_DIM, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
                Nome completo
              </label>
              <AuthInput placeholder="Seu nome" {...requestForm.register('full_name')} />
              {requestForm.formState.errors.full_name && (
                <p style={{ fontSize: 11, color: '#f87171', marginTop: 6 }}>{requestForm.formState.errors.full_name.message}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: TEXT_DIM, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
                Email
              </label>
              <AuthInput type="email" placeholder="seu@email.com" {...requestForm.register('email')} />
              {requestForm.formState.errors.email && (
                <p style={{ fontSize: 11, color: '#f87171', marginTop: 6 }}>{requestForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: TEXT_DIM, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
                Por que quer participar?
              </label>
              <AuthTextarea rows={4} placeholder="Conte sobre você e seus objetivos..." {...requestForm.register('mensagem')} />
              {requestForm.formState.errors.mensagem && (
                <p style={{ fontSize: 11, color: '#f87171', marginTop: 6 }}>{requestForm.formState.errors.mensagem.message}</p>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '13px',
                background: GOLD,
                color: '#1A1208',
                border: 'none',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                marginTop: 6,
                transition: 'opacity 0.15s',
              }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              Enviar solicitação
            </button>
          </form>
        )}
      </div>

      <p style={{ marginTop: 28, fontSize: 10, color: 'rgba(239,236,230,0.16)', textAlign: 'center', letterSpacing: '0.04em' }}>
        Arquitetura de Relevância · Wladson Sidney
      </p>
    </div>
  )
}
