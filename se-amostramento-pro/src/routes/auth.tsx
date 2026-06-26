import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { LogIn, UserPlus, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { RadixTabs } from '@/components/ui/Tabs'
import { toast } from 'sonner'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  orgName: z.string().min(2, 'Nome da organização obrigatório'),
  phone: z.string().min(10, 'Telefone inválido'),
  plan: z.string().min(1, 'Selecione um plano'),
  message: z.string().optional(),
})

const resetSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

type LoginData = z.infer<typeof loginSchema>
type RegisterData = z.infer<typeof registerSchema>
type ResetData = z.infer<typeof resetSchema>

function LoginForm() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (_data: LoginData) => {
    await new Promise((r) => setTimeout(r, 800))
    toast.success('Login realizado com sucesso!')
    await navigate({ to: '/dashboard/admin' })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="E-mail"
        type="email"
        placeholder="seu@email.com.br"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Senha"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
        <LogIn className="w-4 h-4" />
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}

function RegisterForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (_data: RegisterData) => {
    await new Promise((r) => setTimeout(r, 800))
    toast.success('Solicitação enviada! Entraremos em contato em até 24h.')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Nome completo" placeholder="Seu nome" error={errors.name?.message} {...register('name')} />
      <Input label="E-mail corporativo" type="email" placeholder="seu@empresa.com.br" error={errors.email?.message} {...register('email')} />
      <Input label="Nome da organização" placeholder="Sua empresa" error={errors.orgName?.message} {...register('orgName')} />
      <Input label="Telefone" placeholder="(11) 99999-9999" error={errors.phone?.message} {...register('phone')} />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#C4B5FD]">Plano de interesse</label>
        <select
          {...register('plan')}
          className="w-full rounded-lg bg-[#0F0F1A] border border-[#2A2A40] px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7B2FBE] focus:ring-1 focus:ring-[#7B2FBE]"
        >
          <option value="">Selecione...</option>
          {['Solo', 'Team', 'Empresa', 'Corporativo'].map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        {errors.plan && <p className="text-xs text-[#EF4444]">{errors.plan.message}</p>}
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#C4B5FD]">Mensagem (opcional)</label>
        <textarea
          {...register('message')}
          rows={3}
          placeholder="Conte-nos sobre suas necessidades..."
          className="w-full rounded-lg bg-[#0F0F1A] border border-[#2A2A40] px-4 py-2.5 text-sm text-white placeholder:text-[#7C7C9C] focus:outline-none focus:border-[#7B2FBE] focus:ring-1 focus:ring-[#7B2FBE] resize-none"
        />
      </div>
      <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
        <UserPlus className="w-4 h-4" />
        {isSubmitting ? 'Enviando...' : 'Solicitar Acesso'}
      </Button>
    </form>
  )
}

function ResetForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetData>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (_data: ResetData) => {
    await new Promise((r) => setTimeout(r, 800))
    toast.success('Instruções enviadas para seu e-mail!')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="E-mail"
        type="email"
        placeholder="seu@email.com.br"
        error={errors.email?.message}
        {...register('email')}
      />
      <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
        <KeyRound className="w-4 h-4" />
        {isSubmitting ? 'Enviando...' : 'Recuperar Senha'}
      </Button>
    </form>
  )
}

function AuthPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #080810 0%, #1A0A2E 50%, #0D1533 100%)' }}
    >
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-[#7B2FBE]/15 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-[#2979FF]/15 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/">
            <span
              className="font-display font-bold text-xl tracking-wider cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #2979FF, #7B2FBE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              SE AMOSTRAMENTO PRO
            </span>
          </Link>
        </div>

        <div className="bg-[#18182A] border border-[#2A2A40] rounded-2xl p-8 shadow-2xl">
          <RadixTabs.Root defaultValue="login">
            <RadixTabs.List className="flex gap-1 bg-[#0F0F1A] rounded-lg p-1 mb-6">
              {[{ v: 'login', label: 'Entrar' }, { v: 'register', label: 'Solicitar Acesso' }, { v: 'reset', label: 'Recuperar Senha' }].map((tab) => (
                <RadixTabs.Trigger
                  key={tab.v}
                  value={tab.v}
                  className="flex-1 rounded-md px-3 py-2 text-xs font-medium text-[#7C7C9C] transition-all data-[state=active]:bg-[#7B2FBE] data-[state=active]:text-white hover:text-white focus-visible:outline-none"
                >
                  {tab.label}
                </RadixTabs.Trigger>
              ))}
            </RadixTabs.List>
            <RadixTabs.Content value="login"><LoginForm /></RadixTabs.Content>
            <RadixTabs.Content value="register"><RegisterForm /></RadixTabs.Content>
            <RadixTabs.Content value="reset"><ResetForm /></RadixTabs.Content>
          </RadixTabs.Root>
        </div>
      </motion.div>
    </div>
  )
}
