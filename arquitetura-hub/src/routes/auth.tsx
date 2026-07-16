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
  { num: '01', label: 'OKRs & Metas',       desc: 'Objetivos e resultados-chave por trimestre' },
  { num: '02', label: 'Posicionamento',      desc: 'Zona de Genialidade e proposta de valor'    },
  { num: '03', label: 'Marketing Anual',     desc: 'Agenda de conteúdo e distribuição'          },
  { num: '04', label: 'Score de Autoridade', desc: 'Acompanhe sua evolução semana a semana'     },
]

function AuthPage() {
  const [tab, setTab] = useState<'login' | 'request'>('login')
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

      {/* LEFT — brand panel */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between bg-[#1B1F2E] p-12">

        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#7B2FBE] flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-black text-white tracking-widest">AR</span>
            </div>
            <div>
              <p className="text-[12px] font-bold text-white leading-tight tracking-wide">Arquitetura</p>
              <p className="text-[10px] text-[#7B2FBE] font-semibold tracking-wider uppercase">de Relevância</p>
            </div>
          </div>
          <span className="text-white/25 text-[10px] font-bold uppercase tracking-widest">Wladson Sidney</span>
        </div>

        {/* Main headline */}
        <div>
          <p className="text-[10px] font-bold text-[#7B2FBE] uppercase tracking-widest mb-5">Programa de Autoridade</p>
          <h1 className="text-white font-black leading-[1.02] mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 'clamp(2.5rem, 4.5vw, 4.5rem)' }}>
            Arquitete sua<br />
            <span className="text-[#7B2FBE]">Relevância</span><br />
            no Mercado.
          </h1>
          <p className="text-white/40 text-base leading-relaxed max-w-sm">
            Acompanhe sua jornada de posicionamento e evolua com métricas reais de autoridade.
          </p>
        </div>

        {/* Feature list */}
        <div>
          <div className="border-t border-white/10 mb-6" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            {features.map((f) => (
              <div key={f.num}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#7B2FBE] text-[10px] font-medium">{f.num}</span>
                  <span className="text-white text-sm font-medium">{f.label}</span>
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
            <div className="w-7 h-7 bg-[#7B2FBE] flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-black text-white tracking-widest">AR</span>
            </div>
            <div>
              <p className="text-[12px] font-bold text-gray-900 leading-tight tracking-wide">Arquitetura</p>
              <p className="text-[10px] text-[#7B2FBE] font-semibold tracking-wider uppercase">de Relevância</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-xl font-semibold text-gray-900 leading-tight mb-1">
              {tab === 'login' ? 'Entre na plataforma' : 'Solicite seu acesso'}
            </h2>
            <p className="text-sm text-gray-400">
              {tab === 'login'
                ? 'Use suas credenciais para acessar o hub.'
                : 'Preencha o formulário e entraremos em contato.'}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex gap-6 mb-7 border-b border-gray-100 pb-0">
            <button
              onClick={() => setTab('login')}
              className={`pb-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                tab === 'login'
                  ? 'border-[#7B2FBE] text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setTab('request')}
              className={`pb-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                tab === 'request'
                  ? 'border-[#7B2FBE] text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Solicitar Acesso
            </button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:bg-white transition-colors"
                  {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:bg-white transition-colors"
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loginForm.formState.isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#7B2FBE] hover:bg-[#6a27a5] disabled:opacity-50 text-white font-medium py-3 transition-colors text-sm mt-2"
              >
                {loginForm.formState.isSubmitting ? 'Entrando...' : (
                  <>Entrar no Hub <ArrowRight size={15} /></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={requestForm.handleSubmit(onRequest)} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Nome completo</label>
                <input
                  placeholder="Seu nome"
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:bg-white transition-colors"
                  {...requestForm.register('full_name')}
                />
                {requestForm.formState.errors.full_name && (
                  <p className="text-xs text-red-500 mt-1">{requestForm.formState.errors.full_name.message}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:bg-white transition-colors"
                  {...requestForm.register('email')}
                />
                {requestForm.formState.errors.email && (
                  <p className="text-xs text-red-500 mt-1">{requestForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Por que quer participar?</label>
                <textarea
                  placeholder="Conte sobre você e seus objetivos..."
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:bg-white transition-colors resize-none"
                  {...requestForm.register('mensagem')}
                />
                {requestForm.formState.errors.mensagem && (
                  <p className="text-xs text-red-500 mt-1">{requestForm.formState.errors.mensagem.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#7B2FBE] hover:bg-[#6a27a5] text-white font-medium py-3 transition-colors text-sm"
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
