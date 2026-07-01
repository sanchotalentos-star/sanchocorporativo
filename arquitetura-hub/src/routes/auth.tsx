import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
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

const features = [
  { num: '01', label: 'OKRs & Metas', desc: 'Objetivos e resultados-chave por trimestre' },
  { num: '02', label: 'Posicionamento', desc: 'Zona de Genialidade e proposta de valor' },
  { num: '03', label: 'Marketing Anual', desc: 'Agenda de conteúdo e distribuição' },
  { num: '04', label: 'Score de Autoridade', desc: 'Acompanhe sua evolução semana a semana' },
]

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
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* LEFT — editorial brand panel */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between bg-[#0E0E0E] p-12 relative overflow-hidden">

        {/* Subtle texture lines */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px)',
          }}
        />

        {/* Top bar */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white font-black text-sm tracking-[0.18em] uppercase">AR</span>
            <span className="text-white/20 font-thin text-lg leading-none select-none">|</span>
            <span className="text-white/45 text-[11px] font-medium tracking-[0.14em] uppercase">Arquitetura de Relevância</span>
          </div>
          <span className="text-white/20 text-[10px] font-medium tracking-[0.2em] uppercase">Wladson Sidney</span>
        </div>

        {/* Main headline */}
        <div className="relative">
          <p className="text-[#7B2FBE] text-xs font-black uppercase tracking-[0.3em] mb-5">
            Programa de Autoridade
          </p>
          <h1 className="text-white font-black leading-[0.92] mb-8" style={{ fontSize: 'clamp(3rem, 5vw, 5rem)' }}>
            Construa sua<br />
            <span className="text-[#7B2FBE]">Autoridade</span><br />
            de Mercado.
          </h1>
          <p className="text-white/40 text-base leading-relaxed max-w-sm font-light">
            Acompanhe sua jornada de posicionamento e evolua com métricas reais de autoridade.
          </p>
        </div>

        {/* Feature list */}
        <div className="relative">
          <div className="border-t border-white/10 mb-6" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            {features.map((f) => (
              <div key={f.num}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#7B2FBE] text-[10px] font-black tracking-widest">{f.num}</span>
                  <span className="text-white text-sm font-bold">{f.label}</span>
                </div>
                <p className="text-white/30 text-xs leading-relaxed pl-5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — form panel */}
      <div className="flex-1 flex items-center justify-center px-8 py-16 bg-white">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[380px]"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <span className="text-gray-900 font-black text-sm tracking-[0.18em] uppercase">AR</span>
            <span className="text-gray-200 font-thin text-lg leading-none select-none">|</span>
            <span className="text-gray-500 text-[11px] font-medium tracking-[0.12em] uppercase">Arquitetura de Relevância</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 leading-tight mb-1">
              {tab === 'login' ? 'Entre na plataforma' : 'Solicite seu acesso'}
            </h2>
            <p className="text-sm text-gray-400">
              {tab === 'login'
                ? 'Use suas credenciais para acessar o hub.'
                : 'Preencha o formulário e entraremos em contato.'}
            </p>
          </div>

          {/* Tab toggle — minimal text style */}
          <div className="flex gap-6 mb-8 border-b border-gray-100 pb-0">
            <button
              onClick={() => setTab('login')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 -mb-px ${
                tab === 'login'
                  ? 'border-[#7B2FBE] text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setTab('request')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 -mb-px ${
                tab === 'request'
                  ? 'border-[#7B2FBE] text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Solicitar Acesso
            </button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:bg-white transition-colors"
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:bg-white transition-colors"
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loginForm.formState.isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#7B2FBE] hover:bg-[#6a27a5] disabled:opacity-50 text-white font-black py-3.5 rounded-lg transition-colors text-sm uppercase tracking-wide mt-2"
              >
                {loginForm.formState.isSubmitting ? 'Entrando...' : (
                  <>Entrar no Hub <ArrowRight size={15} /></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={requestForm.handleSubmit(onRequest)} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Nome completo</label>
                <input
                  placeholder="Seu nome"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:bg-white transition-colors"
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:bg-white transition-colors"
                  {...requestForm.register('email')}
                />
                {requestForm.formState.errors.email && (
                  <p className="text-xs text-red-500 mt-1">{requestForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Por que quer participar?</label>
                <textarea
                  placeholder="Conte sobre você e seus objetivos..."
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:bg-white transition-colors resize-none"
                  {...requestForm.register('mensagem')}
                />
                {requestForm.formState.errors.mensagem && (
                  <p className="text-xs text-red-500 mt-1">{requestForm.formState.errors.mensagem.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#7B2FBE] hover:bg-[#6a27a5] text-white font-black py-3.5 rounded-lg transition-colors text-sm uppercase tracking-wide"
              >
                Enviar Solicitação <ArrowUpRight size={15} />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
