import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  MessageSquare, Target, TrendingUp, Users, BookOpen, Award, Shield, Video,
  BarChart3, Star, ChevronRight, Calendar, Clock, Trophy
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { mockLives } from '@/lib/mocks'
import { fadeIn, staggerContainer } from '@/lib/motion'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const plans = [
  {
    name: 'Solo',
    price: 'R$ 97',
    period: '/mês',
    description: 'Para profissionais individuais',
    features: ['1 usuário', 'Acesso a 2 trilhas', 'Materiais em PDF', 'Certificados digitais'],
    highlighted: false,
    badge: null,
  },
  {
    name: 'Team',
    price: 'R$ 297',
    period: '/mês',
    description: 'Para equipes de até 20 pessoas',
    features: ['Até 20 usuários', 'Acesso a todas as trilhas', 'Lives mensais', 'Painel de progresso', 'Ranking interno', 'Suporte prioritário'],
    highlighted: true,
    badge: 'Mais Popular',
  },
  {
    name: 'Empresa',
    price: 'R$ 897',
    period: '/mês',
    description: 'Para empresas de até 50 colaboradores',
    features: ['Até 50 usuários', 'Acesso completo', 'Lives exclusivas', 'Relatórios avançados', 'Gestor de conteúdo', 'Onboarding dedicado'],
    highlighted: false,
    badge: null,
  },
  {
    name: 'Corporativo',
    price: 'Sob consulta',
    period: '',
    description: 'Soluções customizadas para grandes empresas',
    features: ['Usuários ilimitados', 'Conteúdo customizado', 'SSO & integrações', 'SLA garantido', 'Gerente de conta dedicado', 'Treinamentos presenciais'],
    highlighted: false,
    badge: null,
  },
]

const testimonials = [
  {
    name: 'Mariana Torres',
    role: 'Diretora Comercial',
    org: 'TechBrasil',
    text: 'Nossa equipe de vendas aumentou a taxa de fechamento em 34% após completar as trilhas de negociação e comunicação.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana',
    rating: 5,
  },
  {
    name: 'Rodrigo Alves',
    role: 'CEO',
    org: 'Startup Ágil',
    text: 'O método SE transformou a forma como minha equipe se comunica internamente e com clientes. ROI em 2 meses.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rodrigo',
    rating: 5,
  },
  {
    name: 'Carla Mendonça',
    role: 'Gestora de RH',
    org: 'Grupo Meridional',
    text: 'Plataforma intuitiva, conteúdo de altíssima qualidade. Os relatórios facilitam muito o acompanhamento do progresso.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carla',
    rating: 5,
  },
]

const features = [
  { icon: BookOpen, title: 'Trilhas Estruturadas', description: 'Conteúdo progressivo do iniciante ao avançado em comunicação corporativa.' },
  { icon: Video, title: 'Lives Interativas', description: 'Sessões ao vivo mensais com especialistas e Q&A em tempo real.' },
  { icon: Award, title: 'Certificados Digitais', description: 'Certificados verificáveis para comprovar competências aos gestores.' },
  { icon: BarChart3, title: 'Analytics Completo', description: 'Relatórios detalhados de progresso individual e por equipe.' },
  { icon: Trophy, title: 'Gamificação', description: 'Rankings, conquistas e pontos que aumentam engajamento e retenção.' },
  { icon: Shield, title: 'Acesso Controlado', description: 'Controle granular por organização, plano e conteúdo individual.' },
]

function LandingPage() {
  const upcomingLives = mockLives.filter((l) => l.status === 'upcoming').slice(0, 2)

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080810]/80 backdrop-blur-md border-b border-[#2A2A40]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display font-bold text-lg tracking-wider"
            style={{ background: 'linear-gradient(135deg, #2979FF, #7B2FBE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SE AMOSTRAMENTO PRO
          </span>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link to="/auth">
              <Button variant="primary" size="sm">Solicitar Acesso</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #080810 0%, #1A0A2E 50%, #0D1533 100%)' }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#7B2FBE]/20 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#2979FF]/20 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#7B2FBE]/20 border border-[#7B2FBE]/30 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-sm text-[#C4B5FD]">+500 profissionais treinados este mês</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
              Domine a Comunicação Corporativa.{' '}
              <span className="gradient-text">Domine o Ambiente.</span>
            </h1>

            <p className="text-xl text-[#C4B5FD] mb-10 max-w-2xl mx-auto">
              Trilhas de alto impacto em comunicação, liderança e negociação para profissionais e equipes que querem resultados reais.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="primary" size="xl" className="w-full sm:w-auto">
                  Começar Agora
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="secondary" size="xl">
                Ver Trilhas
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Método SE */}
      <section className="py-24 bg-[#0F0F1A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">O Método</Badge>
            <h2 className="text-4xl font-display font-bold text-white mb-4">O Método SE</h2>
            <p className="text-[#C4B5FD] max-w-xl mx-auto">Três pilares que transformam profissionais comuns em comunicadores de alto impacto.</p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              { icon: MessageSquare, title: 'Sentir', desc: 'Desenvolva inteligência emocional e escuta ativa para compreender profundamente seu interlocutor.' },
              { icon: Target, title: 'Estruturar', desc: 'Organize suas ideias com clareza e lógica para mensagens que geram ação imediata.' },
              { icon: TrendingUp, title: 'Entregar', desc: 'Comunique com presença, confiança e impacto em qualquer contexto profissional.' },
            ].map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <motion.div
                  key={pillar.title}
                  variants={fadeIn}
                  className="bg-[#18182A] border border-[#2A2A40] rounded-2xl p-8 text-center hover:border-[#7B2FBE] hover:shadow-[0_0_24px_rgba(123,47,190,0.3)] transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7B2FBE] to-[#2979FF] flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-5xl font-display font-bold text-[#2A2A40] mb-2">0{i + 1}</div>
                  <h3 className="text-xl font-display font-bold text-white mb-3">{pillar.title}</h3>
                  <p className="text-[#7C7C9C]">{pillar.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-24 bg-[#080810]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="accent" className="mb-4">Planos</Badge>
            <h2 className="text-4xl font-display font-bold text-white mb-4">Escolha seu Plano</h2>
            <p className="text-[#C4B5FD]">Soluções para profissionais individuais e grandes corporações.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 transition-all duration-200 ${
                  plan.highlighted
                    ? 'bg-[#18182A] border-2 border-[#7B2FBE] shadow-[0_0_40px_rgba(123,47,190,0.4)]'
                    : 'bg-[#18182A] border border-[#2A2A40] hover:border-[#7B2FBE]/50'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="neon">{plan.badge}</Badge>
                  </div>
                )}
                <h3 className="text-xl font-display font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-[#7C7C9C] mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-3xl font-display font-bold text-white">{plan.price}</span>
                  <span className="text-[#7C7C9C] text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#C4B5FD]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7B2FBE]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/auth">
                  <Button variant={plan.highlighted ? 'primary' : 'outline'} className="w-full">
                    {plan.name === 'Corporativo' ? 'Falar com Vendas' : 'Começar'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#0F0F1A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="success" className="mb-4">Depoimentos</Badge>
            <h2 className="text-4xl font-display font-bold text-white mb-4">O que dizem nossos clientes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-[#18182A] border border-[#2A2A40] rounded-2xl p-6 hover:border-[#7B2FBE]/50 transition-all">
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-[#C4B5FD] text-sm mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border border-[#7B2FBE]/50" />
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-[#7C7C9C]">{t.role} · {t.org}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#080810]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="neon" className="mb-4">Recursos</Badge>
            <h2 className="text-4xl font-display font-bold text-white mb-4">Tudo que você precisa para crescer</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="flex gap-4 p-5 bg-[#18182A] border border-[#2A2A40] rounded-xl hover:border-[#7B2FBE]/50 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-[#7B2FBE]/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#9D4FE3]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                    <p className="text-sm text-[#7C7C9C]">{f.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Next Lives */}
      <section className="py-24 bg-[#0F0F1A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <Badge variant="danger" className="mb-2">Próximas Lives</Badge>
              <h2 className="text-3xl font-display font-bold text-white">Sessões ao Vivo</h2>
            </div>
            <Button variant="secondary">Ver todas</Button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingLives.map((live) => (
              <div key={live.id} className="bg-[#18182A] border border-[#2A2A40] rounded-xl p-5 flex gap-4 hover:border-[#7B2FBE]/50 transition-all">
                <img src={live.thumbnail} alt={live.title} className="w-24 h-16 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm mb-1 truncate">{live.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-[#7C7C9C]">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(live.scheduledAt).toLocaleDateString('pt-BR')}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{live.attendees}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{live.duration}min</span>
                  </div>
                  <p className="text-xs text-[#7C7C9C] mt-1">{live.instructor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080810] border-t border-[#2A2A40] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="font-display font-bold text-lg tracking-wider"
                style={{ background: 'linear-gradient(135deg, #2979FF, #7B2FBE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SE AMOSTRAMENTO PRO
              </span>
              <p className="text-sm text-[#7C7C9C] mt-1">Comunicação que gera resultados.</p>
            </div>
            <div className="flex gap-6 text-sm text-[#7C7C9C]">
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Contato</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#2A2A40] text-center text-xs text-[#7C7C9C]">
            © 2024 SE Amostramento Pro. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
