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
    <div className="min-h-screen flex">

      {/* ── LEFT — brand ── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #5B1F9E 0%, #7B2FBE 50%, #9B4FDE 100%)' }}>

        {/* Decorative circle */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'white' }} />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5"
          style={{ background: 'white', transform: 'translate(40%, -40%)' }} />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-black text-white tracking-widest">AR</span>
            </div>
            <div>
              <p className="text-[13px] font-bold text-white leading-tight">Arquitetura de Relevância</p>
              <p className="text-[10px] text-white/50 font-medium tracking-wider">Wladson Sidney</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 px-10 pb-16">
          <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-5">
            Programa de Autoridade
          </p>
          <h1 className="text-white font-black leading-[1.05] mb-6"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 'clamp(2rem, 3.5vw, 3.5rem)' }}>
            Construa sua<br />
            autoridade com<br />
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>método e clareza.</span>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Identidade, pilares, metas e marketing — tudo num só lugar, acompanhado de perto pelo seu mentor.
          </p>
        </div>
      </div>

      {/* ── RIGHT — form ── */}
      <div className="flex-1 flex flex-col bg-white">

        {/* Top bar mobile logo */}
        <div className="flex items-center justify-between px-8 py-5 lg:px-12 lg:py-7 border-b border-gray-100 lg:border-0">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 bg-[#7B2FBE] flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-black text-white tracking-widest">AR</span>
            </div>
            <p className="text-sm font-bold text-gray-900">Arquitetura de Relevância</p>
          </div>
          <div className="hidden lg:block" />
          {tab === 'login' && (
            <button
              onClick={() => setTab('request')}
              className="text-sm text-gray-400 hover:text-[#7B2FBE] transition-colors"
            >
              Solicitar acesso
            </button>
          )}
          {tab === 'request' && (
            <button
              onClick={() => setTab('login')}
              className="text-sm text-gray-400 hover:text-[#7B2FBE] transition-colors"
            >
              Já tenho acesso
            </button>
          )}
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-8 py-12 lg:px-16">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-[400px]"
          >
            {tab === 'login' ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-1"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                  Olá!
                </h2>
                <p className="text-sm text-gray-400 mb-8">
                  Entre com suas credenciais para acessar o hub.
                </p>

                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 transition-all"
                      {...loginForm.register('email')}
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-11 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 transition-all"
                        {...loginForm.register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loginForm.formState.isSubmitting}
                    className="w-full bg-[#7B2FBE] hover:bg-[#6a27a5] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-sm mt-2"
                  >
                    {loginForm.formState.isSubmitting ? 'Entrando...' : 'Avançar'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-1"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                  Solicitar acesso
                </h2>
                <p className="text-sm text-gray-400 mb-8">
                  Preencha o formulário e entraremos em contato em breve.
                </p>

                <form onSubmit={requestForm.handleSubmit(onRequest)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo</label>
                    <input
                      placeholder="Seu nome"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 transition-all"
                      {...requestForm.register('full_name')}
                    />
                    {requestForm.formState.errors.full_name && (
                      <p className="text-xs text-red-500 mt-1">{requestForm.formState.errors.full_name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 transition-all"
                      {...requestForm.register('email')}
                    />
                    {requestForm.formState.errors.email && (
                      <p className="text-xs text-red-500 mt-1">{requestForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Por que quer participar?</label>
                    <textarea
                      placeholder="Conte sobre você e seus objetivos..."
                      rows={4}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 transition-all resize-none"
                      {...requestForm.register('mensagem')}
                    />
                    {requestForm.formState.errors.mensagem && (
                      <p className="text-xs text-red-500 mt-1">{requestForm.formState.errors.mensagem.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#7B2FBE] hover:bg-[#6a27a5] text-white font-semibold py-3 rounded-lg transition-colors text-sm"
                  >
                    Enviar solicitação
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>

    </div>
  )
}
