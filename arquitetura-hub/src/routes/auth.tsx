import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { BookOpen, LogIn, UserPlus, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { fadeInUp } from '@/lib/motion'

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
  const { login } = useAuth()
  const navigate = useNavigate()

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })
  const requestForm = useForm<RequestForm>({ resolver: zodResolver(requestSchema) })

  async function onLogin(data: LoginForm) {
    try {
      await login(data.email, data.password)
      const stored = localStorage.getItem('mock_user')
      const role = stored ? (JSON.parse(stored) as { role: string }).role : 'membro'
      void navigate({ to: role === 'admin' ? '/dashboard/admin' : '/dashboard/membro' })
      toast.success('Bem-vindo(a) de volta!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao fazer login')
    }
  }

  function onRequest(data: RequestForm) {
    console.log(data)
    toast.success('Solicitação enviada! Entraremos em contato em breve.')
    requestForm.reset()
  }

  return (
    <div className="min-h-screen bg-[#060D1A] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0D2140 0%, #070E1A 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #F59E0B33 0%, transparent 60%)' }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-lg shadow-amber-500/30">
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <p className="font-black text-lg text-white leading-tight">Arquitetura de Relevância</p>
            <p className="text-sm text-[#4A7FA5]">Hub de Autoridade — by Wladson Sancho</p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative">
          <h1 className="text-5xl font-black text-white leading-tight mb-6">
            Construa sua<br />
            <span className="text-[#F59E0B]">Autoridade</span><br />
            de Mercado
          </h1>
          <p className="text-[#4A7FA5] text-lg leading-relaxed max-w-md">
            Acompanhe sua jornada de posicionamento, gerencie OKRs, pilares estratégicos e evolua semana a semana com o programa Arquitetura de Relevância.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            {['OKRs', 'Posicionamento', 'Autoridade', 'KPIs', 'Agenda', 'Marketing'].map(tag => (
              <span key={tag} className="text-xs font-bold bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B] px-3 py-1.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Phases */}
        <div className="relative grid grid-cols-4 gap-2">
          {['OKR & MVP', 'Autoridade', 'PDCA→OKR', 'Escala'].map((phase, i) => (
            <div key={phase} className="rounded-xl bg-[#0A1420] border border-[#1A2E4A] p-3 text-center">
              <div className={`w-6 h-6 rounded-lg mx-auto mb-1 flex items-center justify-center text-xs font-black ${
                i === 0 ? 'bg-[#F59E0B] text-black' : 'bg-[#112240] text-[#3A5A7A]'
              }`}>{i + 1}</div>
              <p className="text-[10px] text-[#4A7FA5] font-medium">{phase}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <div>
              <p className="font-black text-white text-sm">Arquitetura de Relevância</p>
              <p className="text-xs text-[#4A7FA5]">Hub de Autoridade</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-1 mb-6">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === 'login' ? 'bg-[#F59E0B] text-black' : 'text-[#4A7FA5] hover:text-white'
              }`}
            >
              <LogIn size={15} />
              Entrar
            </button>
            <button
              onClick={() => setTab('request')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === 'request' ? 'bg-[#F59E0B] text-black' : 'text-[#4A7FA5] hover:text-white'
              }`}
            >
              <UserPlus size={15} />
              Solicitar Acesso
            </button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#4A7FA5] uppercase tracking-wider block mb-2">Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full bg-[#0D1B2E] border border-[#1A2E4A] rounded-xl px-4 py-3 text-white placeholder:text-[#3A5A7A] focus:outline-none focus:border-[#F59E0B] text-sm transition-colors"
                  {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-red-400 mt-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-[#4A7FA5] uppercase tracking-wider block mb-2">Senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#0D1B2E] border border-[#1A2E4A] rounded-xl px-4 py-3 text-white placeholder:text-[#3A5A7A] focus:outline-none focus:border-[#F59E0B] text-sm transition-colors"
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-red-400 mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loginForm.formState.isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] disabled:opacity-60 text-black font-bold py-3 rounded-xl transition-colors mt-2"
              >
                {loginForm.formState.isSubmitting ? 'Entrando...' : (
                  <>Entrar no Hub <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={requestForm.handleSubmit(onRequest)} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#4A7FA5] uppercase tracking-wider block mb-2">Nome completo</label>
                <input
                  placeholder="Seu nome"
                  className="w-full bg-[#0D1B2E] border border-[#1A2E4A] rounded-xl px-4 py-3 text-white placeholder:text-[#3A5A7A] focus:outline-none focus:border-[#F59E0B] text-sm transition-colors"
                  {...requestForm.register('full_name')}
                />
                {requestForm.formState.errors.full_name && (
                  <p className="text-xs text-red-400 mt-1">{requestForm.formState.errors.full_name.message}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-[#4A7FA5] uppercase tracking-wider block mb-2">Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full bg-[#0D1B2E] border border-[#1A2E4A] rounded-xl px-4 py-3 text-white placeholder:text-[#3A5A7A] focus:outline-none focus:border-[#F59E0B] text-sm transition-colors"
                  {...requestForm.register('email')}
                />
                {requestForm.formState.errors.email && (
                  <p className="text-xs text-red-400 mt-1">{requestForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-[#4A7FA5] uppercase tracking-wider block mb-2">Por que quer participar?</label>
                <textarea
                  placeholder="Conte sobre você e seus objetivos profissionais..."
                  rows={4}
                  className="w-full bg-[#0D1B2E] border border-[#1A2E4A] rounded-xl px-4 py-3 text-white placeholder:text-[#3A5A7A] focus:outline-none focus:border-[#F59E0B] text-sm transition-colors resize-none"
                  {...requestForm.register('mensagem')}
                />
                {requestForm.formState.errors.mensagem && (
                  <p className="text-xs text-red-400 mt-1">{requestForm.formState.errors.mensagem.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold py-3 rounded-xl transition-colors"
              >
                Enviar Solicitação <ArrowRight size={16} />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
