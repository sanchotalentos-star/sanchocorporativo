import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Star, LogIn, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
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
  const [tab, setTab] = useState('login')
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
    toast.success('Solicitação enviada! Entraremos em contato em breve.')
    requestForm.reset()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B3A5C] to-[#0F172A] flex items-center justify-center px-4 py-12">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#D97706] flex items-center justify-center">
            <Star size={20} className="text-white" />
          </div>
          <div className="text-white">
            <p className="font-bold text-lg leading-tight">Arquitetura de Relevância</p>
            <p className="text-xs text-white/60">Hub de Autoridade</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full mb-6">
              <TabsTrigger value="login" className="flex-1">
                <LogIn size={16} className="mr-1.5" /> Entrar
              </TabsTrigger>
              <TabsTrigger value="request" className="flex-1">
                <UserPlus size={16} className="mr-1.5" /> Solicitar Acesso
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" className="mt-1" {...loginForm.register('email')} />
                  {loginForm.formState.errors.email && (
                    <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" placeholder="••••••••" className="mt-1" {...loginForm.register('password')} />
                  {loginForm.formState.errors.password && (
                    <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
                  {loginForm.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>
                <div className="mt-4 p-3 bg-[#F1F5F9] rounded-lg text-xs text-[#475569]">
                  <p className="font-semibold mb-1">Credenciais de demo:</p>
                  <p>Admin: demo@admin.com / demo</p>
                  <p>Membro: demo@membro.com / demo</p>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="request">
              <form onSubmit={requestForm.handleSubmit(onRequest)} className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Nome completo</Label>
                  <Input id="full_name" placeholder="Seu nome" className="mt-1" {...requestForm.register('full_name')} />
                  {requestForm.formState.errors.full_name && (
                    <p className="text-xs text-red-500 mt-1">{requestForm.formState.errors.full_name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="req_email">Email</Label>
                  <Input id="req_email" type="email" placeholder="seu@email.com" className="mt-1" {...requestForm.register('email')} />
                  {requestForm.formState.errors.email && (
                    <p className="text-xs text-red-500 mt-1">{requestForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="mensagem">Por que quer participar?</Label>
                  <textarea
                    id="mensagem"
                    placeholder="Conte sobre você e seus objetivos..."
                    className="mt-1 flex min-h-[80px] w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]"
                    {...requestForm.register('mensagem')}
                  />
                  {requestForm.formState.errors.mensagem && (
                    <p className="text-xs text-red-500 mt-1">{requestForm.formState.errors.mensagem.message}</p>
                  )}
                </div>
                <Button type="submit" variant="accent" className="w-full">
                  Enviar Solicitação
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  )
}
