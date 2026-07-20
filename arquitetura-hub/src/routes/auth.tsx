import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
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

const inputCls = [
  'w-full px-4 py-3 text-sm text-white rounded-lg transition-all',
  'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]',
  'placeholder:text-[rgba(255,255,255,0.25)]',
  'focus:outline-none focus:border-[#7B2FBE] focus:bg-[rgba(123,47,190,0.08)]',
].join(' ')

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
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: '#0F1117' }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 mb-10"
      >
        <div
          className="w-9 h-9 flex items-center justify-center flex-shrink-0"
          style={{ background: '#7B2FBE' }}
        >
          <span className="text-[11px] font-black text-white tracking-widest">AR</span>
        </div>
        <div>
          <p className="text-[14px] font-bold text-white leading-tight">Arquitetura de Relevância</p>
          <p className="text-[10px] font-medium tracking-wider" style={{ color: '#7B2FBE' }}>Wladson Sidney</p>
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[420px] rounded-2xl p-8"
        style={{ background: '#1A1D27', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {tab === 'login' ? (
          <>
            <h1
              className="text-white mb-1"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '2rem', fontWeight: 700 }}
            >
              Olá!
            </h1>
            <p className="text-sm mb-7" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Entre com suas credenciais para acessar o hub.
            </p>

            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Digite seu email"
                  className={inputCls}
                  {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-red-400 mt-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    className={inputCls + ' pr-11'}
                    {...loginForm.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-red-400 mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loginForm.formState.isSubmitting}
                className="w-full py-3 text-sm font-semibold text-white rounded-lg transition-all disabled:opacity-50"
                style={{ background: '#7B2FBE' }}
              >
                {loginForm.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Ainda não tem acesso?{' '}
              <button
                onClick={() => setTab('request')}
                className="underline transition-colors"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Solicitar acesso
              </button>
            </p>
          </>
        ) : (
          <>
            <h1
              className="text-white mb-1"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '1.75rem', fontWeight: 700 }}
            >
              Solicitar acesso
            </h1>
            <p className="text-sm mb-7" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Preencha o formulário e entraremos em contato.
            </p>

            <form onSubmit={requestForm.handleSubmit(onRequest)} className="space-y-4">
              <input
                placeholder="Seu nome completo"
                className={inputCls}
                {...requestForm.register('full_name')}
              />
              {requestForm.formState.errors.full_name && (
                <p className="text-xs text-red-400 -mt-2">{requestForm.formState.errors.full_name.message}</p>
              )}

              <input
                type="email"
                placeholder="Seu email"
                className={inputCls}
                {...requestForm.register('email')}
              />
              {requestForm.formState.errors.email && (
                <p className="text-xs text-red-400 -mt-2">{requestForm.formState.errors.email.message}</p>
              )}

              <textarea
                placeholder="Por que quer participar?"
                rows={4}
                className={inputCls + ' resize-none'}
                {...requestForm.register('mensagem')}
              />
              {requestForm.formState.errors.mensagem && (
                <p className="text-xs text-red-400 -mt-2">{requestForm.formState.errors.mensagem.message}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 text-sm font-semibold text-white rounded-lg transition-all"
                style={{ background: '#7B2FBE' }}
              >
                Enviar solicitação
              </button>
            </form>

            <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.25)' }}>
              <button
                onClick={() => setTab('login')}
                className="underline transition-colors"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Voltar para o login
              </button>
            </p>
          </>
        )}
      </motion.div>
    </div>
  )
}
