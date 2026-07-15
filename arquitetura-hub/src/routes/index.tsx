import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { BarChart3, Target, Calendar, FileText, Star, ArrowRight, CheckCircle } from 'lucide-react'
import { staggerContainer, fadeInUp } from '@/lib/motion'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const features = [
  { icon: BarChart3, title: 'Dashboard de KPIs', desc: 'Acompanhe seus indicadores de autoridade em tempo real com gráficos e tendências.' },
  { icon: Target, title: 'Pilares Estratégicos', desc: 'Gerencie as 4 dimensões da sua arquitetura de relevância com ações práticas.' },
  { icon: Calendar, title: 'Agenda Editorial', desc: 'Planeje seu conteúdo, eventos e atividades de mídia em um calendário visual.' },
  { icon: FileText, title: 'Relatórios', desc: 'Analise sua evolução mensal com relatórios detalhados e comparativos de ranking.' },
]

const testimonials = [
  { name: 'Ana Lima', role: 'Consultora de Marketing', text: 'Em 3 meses aumentei meu alcance orgânico de 1.200 para 4.800 pessoas. O método funciona!' },
  { name: 'João Santos', role: 'Advogado Empresarial', text: 'O dashboard me ajudou a ver onde eu estava perdendo oportunidades. Meus leads triplicaram.' },
  { name: 'Maria Oliveira', role: 'Médica Especialista', text: 'Sou referência no meu nicho agora. O programa estruturou o que eu já sabia fazer, mas não divulgava.' },
]

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1B1F2E]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#7B2FBE] flex items-center justify-center">
              <Star size={16} className="text-white" />
            </div>
            <span className="font-bold text-white">Arquitetura de Relevância</span>
          </div>
          <Link to="/auth">
            <button className="px-4 py-2 bg-[#7B2FBE] text-white rounded-lg text-sm font-medium hover:bg-[#6a1fa8] transition-colors">
              Entrar
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#1B1F2E] to-[#0F1117] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#7B2FBE]/20 border border-[#7B2FBE]/40 text-[#A855F7] text-sm font-medium mb-6">
              Programa de Autoridade com Wladson Sidney
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Arquitete sua{' '}
              <span className="text-[#7B2FBE]">Relevância</span>
              {' '}no Mercado.
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
              Acompanhe seus KPIs de autoridade, gerencie seus pilares estratégicos e execute sua agenda de visibilidade, tudo em um único hub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <button className="px-8 py-4 bg-[#7B2FBE] text-white rounded-xl font-semibold hover:bg-[#6a1fa8] transition-colors flex items-center gap-2">
                  Acessar Plataforma
                  <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-[#F8F7FF]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Tudo que você precisa para crescer</h2>
            <p className="text-[#475569] max-w-2xl mx-auto">Uma plataforma completa para estruturar, executar e medir sua estratégia de autoridade.</p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeInUp} className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#7B2FBE]/10 flex items-center justify-center mb-4">
                  <f.icon size={24} className="text-[#7B2FBE]" />
                </div>
                <h3 className="font-semibold text-[#0F172A] mb-2">{f.title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Resultados reais de participantes</h2>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeInUp} className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-[#7B2FBE] text-[#7B2FBE]" />
                  ))}
                </div>
                <p className="text-[#475569] text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-[#0F172A]">{t.name}</p>
                  <p className="text-xs text-[#94A3B8]">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#1B1F2E] to-[#0F1117] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Faça parte do programa</h2>
          <p className="text-white/60 mb-8">Junte-se a profissionais que estão construindo autoridade real e conquistando o mercado com método.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <div className="flex items-center gap-2 text-white/70 text-sm"><CheckCircle size={16} className="text-[#7B2FBE]" /> Dashboard de KPIs em tempo real</div>
            <div className="flex items-center gap-2 text-white/70 text-sm"><CheckCircle size={16} className="text-[#7B2FBE]" /> Acompanhamento de pilares</div>
            <div className="flex items-center gap-2 text-white/70 text-sm"><CheckCircle size={16} className="text-[#7B2FBE]" /> Ranking entre participantes</div>
          </div>
          <Link to="/auth">
            <button className="px-8 py-4 bg-[#7B2FBE] text-white rounded-xl font-semibold hover:bg-[#6a1fa8] transition-colors">
              Solicitar Acesso
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#7B2FBE] flex items-center justify-center">
              <Star size={11} className="text-white" />
            </div>
            <span className="font-medium text-[#475569]">Arquitetura de Relevância Hub</span>
          </div>
          <p>© {new Date().getFullYear()} Sancho Gestão de Carreiras. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
