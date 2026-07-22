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

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  fontSize: 14,
  color: '#fff',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}

const AuthInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function AuthInput(props, ref) {
    const [focused, setFocused] = useState(false)
    return (
      <input
        {...props}
        ref={ref}
        style={{
          ...inputStyle,
          borderColor: focused ? '#7B2FBE' : 'rgba(255,255,255,0.1)',
          background: focused ? 'rgba(123,47,190,0.07)' : 'rgba(255,255,255,0.04)',
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
          ...inputStyle,
          resize: 'none',
          borderColor: focused ? '#7B2FBE' : 'rgba(255,255,255,0.1)',
          background: focused ? 'rgba(123,47,190,0.07)' : 'rgba(255,255,255,0.04)',
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', background: '#0D0D0D' }}>

      {/* Logo */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.02em', textAlign: 'center' }}>
          Arquitetura de Relevância
        </p>
      </div>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: '#161616',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '36px 32px',
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 28 }}>
          {(['login', 'request'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                paddingBottom: 12,
                fontSize: 13,
                fontWeight: 500,
                color: tab === t ? '#fff' : 'rgba(255,255,255,0.3)',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${tab === t ? '#7B2FBE' : 'transparent'}`,
                marginBottom: -1,
                cursor: 'pointer',
                transition: 'all 0.15s',
                letterSpacing: '0.01em',
              }}
            >
              {t === 'login' ? 'Entrar' : 'Solicitar acesso'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <form onSubmit={loginForm.handleSubmit(onLogin)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
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
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
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
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 2 }}
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
                padding: '12px',
                background: '#7B2FBE',
                color: '#fff',
                border: 'none',
                fontSize: 13,
                fontWeight: 600,
                cursor: loginForm.formState.isSubmitting ? 'not-allowed' : 'pointer',
                opacity: loginForm.formState.isSubmitting ? 0.6 : 1,
                letterSpacing: '0.03em',
                marginTop: 4,
                transition: 'background 0.15s',
              }}
              onMouseOver={e => { if (!loginForm.formState.isSubmitting) e.currentTarget.style.background = '#6823a8' }}
              onMouseOut={e => e.currentTarget.style.background = '#7B2FBE'}
            >
              {loginForm.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <form onSubmit={requestForm.handleSubmit(onRequest)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                Nome completo
              </label>
              <AuthInput placeholder="Seu nome" {...requestForm.register('full_name')} />
              {requestForm.formState.errors.full_name && (
                <p style={{ fontSize: 11, color: '#f87171', marginTop: 6 }}>{requestForm.formState.errors.full_name.message}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                Email
              </label>
              <AuthInput type="email" placeholder="seu@email.com" {...requestForm.register('email')} />
              {requestForm.formState.errors.email && (
                <p style={{ fontSize: 11, color: '#f87171', marginTop: 6 }}>{requestForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
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
                padding: '12px',
                background: '#7B2FBE',
                color: '#fff',
                border: 'none',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '0.03em',
                marginTop: 4,
                transition: 'background 0.15s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#6823a8'}
              onMouseOut={e => e.currentTarget.style.background = '#7B2FBE'}
            >
              Enviar solicitação
            </button>
          </form>
        )}
      </div>

      <p style={{ marginTop: 24, fontSize: 11, color: 'rgba(255,255,255,0.18)', textAlign: 'center' }}>
        Arquitetura de Relevância — Wladson Sidney
      </p>
    </div>
  )
}
