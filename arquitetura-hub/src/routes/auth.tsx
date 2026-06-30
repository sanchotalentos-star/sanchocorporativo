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
    <div className="min-h-screen bg-white flex">
      {/* Left panel — SE Amostramento brand gradient */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0533 0%, #3d1278 50%, #7B2FBE 100%)' }}>
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #ffffff18 0%, transparent 60%)' }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <p className="font-black text-lg text-white leading-tight uppercase tracking-tight">Arquitetura de Relevância</p>
            <p className="text-sm text-white/60 font-medium uppercase tracking-widest">Hub de Autoridade — by Wladson Sidney</p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative">
          <p className="text-white/50 text-sm font-bold uppercase tracking-widest mb-3">by Wladson Sidney</p>
          <h1 className="text-5xl font-black text-white leading-[1.05] mb-6 uppercase tracking-tight">
            Construa sua<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #d4a8ff, #ffffff)' }}>
              Autoridade
            </span><br />
            de Mercado
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-md">
            Acompanhe sua jornada de posicionamento, gerencie OKRs, pilares estratégicos e evolua semana a semana.
          </p>

          <div className="flex flex-wrap gap-2 mt-8">
            {['OKRs', 'Posicionamento', 'Autoridade', 'KPIs', 'Agenda', 'Marketing'].map(tag => (
              <span key={tag} className="text-xs font-black bg-white/10 border border-white/20 text-white px-3 py-1.5 rounded-full uppercase tracking-wide">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Phases */}
        <div className="relative grid grid-cols-4 gap-2">
          {['OKR & MVP', 'Autoridade', 'PDCA→OKR', 'Escala'].map((phase, i) => (
            <div key={phase} className="rounded-xl bg-white/10 border border-white/15 p-3 text-center backdrop-blur-sm">
              <div className={`w-6 h-6 rounded-lg mx-auto mb-1 flex items-center justify-center text-xs font-black ${
                i === 0 ? 'bg-white text-[#7B2FBE]' : 'bg-white/15 text-white/40'
              }`}>{i + 1}</div>
              <p className={`text-[10px] font-bold uppercase tracking-wide ${i === 0 ? 'text-white' : 'text-white/40'}`}>{phase}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — clean white form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-[#7B2FBE] flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <div>
              <p className="font-black text-gray-900 text-sm uppercase tracking-tight">Arquitetura de Relevância</p>
              <p className="text-xs text-[#7B2FBE] font-bold uppercase tracking-widest">Hub de Autoridade</p>
            </div>
          </div>

          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-1">Acesse sua conta</h2>
          <p className="text-sm text-gray-400 mb-6">Entre com suas credenciais ou solicite acesso ao programa.</p>

          {/* Tabs */}
          <div className="flex rounded-2xl bg-gray-100 border border-gray-200 p-1 mb-6">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all uppercase tracking-wide ${
                tab === 'login' ? 'bg-[#7B2FBE] text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <LogIn size={15} />
              Entrar
            </button>
            <button
              onClick={() => setTab('request')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all uppercase tracking-wide ${
                tab === 'request' ? 'bg-[#7B2FBE] text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <UserPlus size={15} />
              Solicitar Acesso
            </button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 text-sm transition-colors"
                  {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 text-sm transition-colors"
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loginForm.formState.isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#7B2FBE] hover:bg-[#6a27a5] disabled:opacity-60 text-white font-black py-3 rounded-xl transition-colors mt-2 uppercase tracking-wide shadow-md shadow-[#7B2FBE]/20"
              >
                {loginForm.formState.isSubmitting ? 'Entrando...' : (
                  <>Entrar no Hub <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={requestForm.handleSubmit(onRequest)} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Nome completo</label>
                <input
                  placeholder="Seu nome"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 text-sm transition-colors"
                  {...requestForm.register('full_name')}
                />
                {requestForm.formState.errors.full_name && (
                  <p className="text-xs text-red-500 mt-1">{requestForm.formState.errors.full_name.message}</p>
                )}
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 text-sm transition-colors"
                  {...requestForm.register('email')}
                />
                {requestForm.formState.errors.email && (
                  <p className="text-xs text-red-500 mt-1">{requestForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Por que quer participar?</label>
                <textarea
                  placeholder="Conte sobre você e seus objetivos profissionais..."
                  rows={4}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 text-sm transition-colors resize-none"
                  {...requestForm.register('mensagem')}
                />
                {requestForm.formState.errors.mensagem && (
                  <p className="text-xs text-red-500 mt-1">{requestForm.formState.errors.mensagem.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#7B2FBE] hover:bg-[#6a27a5] text-white font-black py-3 rounded-xl transition-colors uppercase tracking-wide shadow-md shadow-[#7B2FBE]/20"
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
