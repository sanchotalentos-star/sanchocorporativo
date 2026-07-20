import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Users, TrendingUp, Target, Award, ArrowRight, CheckCircle2, Circle, CalendarDays, ChevronRight, Star, BarChart2 } from 'lucide-react'
import { toast } from 'sonner'
import { KpiCard } from '@/components/shared/KpiCard'
import { staggerContainer, fadeInUp } from '@/lib/motion'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'

export const Route = createFileRoute('/dashboard/membro/')({
  component: MembroDashboard,
})

const phases = [
  {
    num: 1,
    label: 'OKR e MVP',
    deliverables: ['Metas de impacto', 'Formatação do produto', 'MVP inicial'],
    heroDesc: 'Você está definindo as bases da sua jornada. Nesta fase, o foco é clareza: o que você quer conquistar e como vai medir isso.',
    active: true,
    done: false,
  },
  {
    num: 2,
    label: 'Primeiras Vitórias',
    deliverables: ['Identidade de Marca', 'Agenda de Marketing', 'Agenda de Eventos'],
    heroDesc: 'Com as metas definidas, agora é hora de construir sua identidade e começar a aparecer no mercado de forma estratégica.',
    active: false,
    done: false,
  },
  {
    num: 3,
    label: 'Plano em Ação',
    deliverables: ['Revisão de OKR', 'PDCA ciclo 1', 'Sua História que Conecta'],
    heroDesc: 'Ciclo de execução em andamento. Você está revisando, ajustando e acelerando com base no que está funcionando.',
    active: false,
    done: false,
  },
  {
    num: 4,
    label: 'Escala',
    deliverables: ['PDCA ciclo 2', 'Escala e Autoridade'],
    heroDesc: 'Você chegou à fase de escala. O trabalho agora é amplificar o que funciona e consolidar sua autoridade no mercado.',
    active: false,
    done: false,
  },
]

const quickLinks = [
  { num: '01', label: 'Minha Identidade',  desc: 'Quem você é e o que você entrega',          href: '/dashboard/membro/posicionamento' },
  { num: '02', label: 'Pilares da Marca',  desc: 'Ações estratégicas de cada pilar',           href: '/dashboard/membro/pilares'        },
  { num: '03', label: 'Metas de Impacto',  desc: 'OKRs e resultados-chave por trimestre',      href: '/dashboard/membro/okr'            },
  { num: '04', label: 'Marketing Anual',   desc: 'Agenda de conteúdo e presença',              href: '/dashboard/membro/marketing'      },
]

const acoesPorFase: Record<number, { texto: string; href?: string }[]> = {
  1: [
    { texto: 'Preencher suas percepções iniciais em Minha Identidade', href: '/dashboard/membro/posicionamento' },
    { texto: 'Revisar os objetivos definidos na última sessão com o mentor', href: '/dashboard/membro/okr' },
    { texto: 'Listar 3 diferenciais que você percebe em você antes da próxima sessão', href: '/dashboard/membro/posicionamento' },
    { texto: 'Confirmar presença na próxima sessão da mentoria', href: '/dashboard/membro/agenda' },
  ],
  2: [
    { texto: 'Concluir o preenchimento dos 4 pilares da sua marca', href: '/dashboard/membro/posicionamento' },
    { texto: 'Revisar o plano de marketing do mês', href: '/dashboard/membro/marketing' },
    { texto: 'Registrar os aprendizados da última sessão', href: '/dashboard/membro/okr' },
  ],
  3: [
    { texto: 'Atualizar os resultados-chave do OKR com os dados da semana', href: '/dashboard/membro/okr' },
    { texto: 'Registrar o ciclo PDCA da última ação executada', href: '/dashboard/membro/kpis' },
    { texto: 'Preparar a sua história para a sessão de storytelling', href: '/dashboard/membro/posicionamento' },
  ],
  4: [
    { texto: 'Revisar os indicadores do mês e identificar o que escalar', href: '/dashboard/membro/kpis' },
    { texto: 'Atualizar o PDCA ciclo 2 com as aprendizagens acumuladas', href: '/dashboard/membro/kpis' },
    { texto: 'Planejar a próxima ação de autoridade com o mentor', href: '/dashboard/membro/agenda' },
  ],
}

function MembroDashboard() {
  const { user } = useAuth()
  const fullName = user?.full_name ?? 'Bem-vindo'
  const firstName = fullName.split(' ')[0]

  const faseAtual = phases.find(p => p.active) ?? phases[0]
  const acoes = acoesPorFase[faseAtual.num] ?? acoesPorFase[1]
  const [concluidas, setConcluidas] = useState<Set<number>>(new Set())

  function toggleAcao(i: number) {
    const wasDone = concluidas.has(i)
    setConcluidas(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
    if (!wasDone) {
      toast.success('Ação concluída!', { description: acoes[i].texto })
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Olá, {firstName}</p>
        <h1 className="text-2xl font-black text-gray-900 leading-tight">{fullName}</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-lg leading-relaxed">{faseAtual.heroDesc}</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[10px] font-bold text-[#7B2FBE] uppercase tracking-widest border border-[#7B2FBE]/30 px-2.5 py-1">
            Fase {faseAtual.num} de 4 · {faseAtual.label}
          </span>
        </div>
      </motion.div>

      {/* Mapa de Construção */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Mapa de Construção da Marca</p>
        <div className="flex flex-col lg:flex-row gap-px bg-gray-200">

          <Link to="/dashboard/membro/posicionamento" className="flex-1">
            <div className="group h-full bg-white border-l-2 border-l-[#7B2FBE] p-4 hover:bg-[#7B2FBE]/[0.02] transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#7B2FBE] uppercase tracking-widest">01</span>
                <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider">Em construção</span>
              </div>
              <p className="text-sm font-bold text-gray-900 leading-tight">Identidade de Marca</p>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">Quem você é, para quem fala, o que entrega de diferente</p>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-[10px] font-bold text-[#7B2FBE] uppercase tracking-wider">
                Preencher <ChevronRight size={10} />
              </div>
            </div>
          </Link>

          <Link to="/dashboard/membro/pilares" className="flex-1">
            <div className="group h-full bg-white p-4 hover:bg-gray-50 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">02</span>
                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider">Aguarda Identidade</span>
              </div>
              <p className="text-sm font-bold text-gray-300 leading-tight">Pilares da Marca</p>
              <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">Frentes estratégicas de construção de presença</p>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                Ver pilares <ChevronRight size={10} />
              </div>
            </div>
          </Link>

          <Link to="/dashboard/membro/marketing" className="flex-1">
            <div className="group h-full bg-white p-4 hover:bg-gray-50 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">03</span>
                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider">Aguarda Pilares</span>
              </div>
              <p className="text-sm font-bold text-gray-300 leading-tight">Marketing Anual</p>
              <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">Calendário de conteúdo e ações de distribuição</p>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                Ver calendário <ChevronRight size={10} />
              </div>
            </div>
          </Link>

          <Link to="/dashboard/membro/kpis" className="flex-1">
            <div className="group h-full bg-white p-4 hover:bg-gray-50 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">04</span>
                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider">Aguarda Execução</span>
              </div>
              <p className="text-sm font-bold text-gray-300 leading-tight">Resultados</p>
              <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">Indicadores de alcance, autoridade e crescimento</p>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                Ver indicadores <ChevronRight size={10} />
              </div>
            </div>
          </Link>

        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
        <KpiCard label="Alcance Orgânico"   value={0} unit="pessoas" icon={Users}      />
        <KpiCard label="Leads Qualificados" value={0}              icon={Target}     />
        <KpiCard label="Pontos de Evolução" value={0} unit="pts"   icon={Award} accent />
        <KpiCard label="Menções e Citações" value={0}              icon={TrendingUp} />
      </motion.div>

      {/* O Que Fazer Esta Semana */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="bg-white border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Fase {faseAtual.num} · {faseAtual.label}</p>
            <h3 className="text-sm font-bold text-gray-900">O Que Fazer Esta Semana</h3>
          </div>
          <span className="text-[10px] font-bold text-[#7B2FBE] uppercase tracking-wider">
            {concluidas.size}/{acoes.length} feitas
          </span>
        </div>
        <div className="p-5 space-y-3">
          {acoes.map((acao, i) => {
            const feita = concluidas.has(i)
            return (
              <div key={i} className="flex items-start gap-3 cursor-pointer group" onClick={() => toggleAcao(i)}>
                {feita
                  ? <CheckCircle2 size={16} className="text-[#7B2FBE] flex-shrink-0 mt-0.5" />
                  : <Circle size={16} className="text-gray-200 group-hover:text-[#7B2FBE]/40 flex-shrink-0 mt-0.5 transition-colors" />
                }
                <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
                  <p className={`text-sm leading-relaxed ${feita ? 'line-through text-gray-300' : 'text-gray-700'}`}>
                    {acao.texto}
                  </p>
                  {!feita && acao.href && (
                    <Link to={acao.href} onClick={e => e.stopPropagation()}>
                      <ArrowRight size={13} className="text-gray-200 hover:text-[#7B2FBE] flex-shrink-0 mt-0.5 transition-colors" />
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Quick links */}
      <div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Ferramentas do Programa</p>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
          {quickLinks.map((item) => (
            <motion.div key={item.href} variants={fadeInUp}>
              <Link to={item.href}>
                <div className="group bg-white p-4 hover:bg-[#7B2FBE]/[0.02] transition-all cursor-pointer h-full flex flex-col border-t-2 border-t-transparent hover:border-t-[#7B2FBE]">
                  <span className="text-[10px] font-bold text-[#7B2FBE] uppercase tracking-widest mb-2 block">{item.num}</span>
                  <p className="text-sm font-bold text-gray-800 leading-tight flex-1">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{item.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-[10px] font-bold text-gray-300 group-hover:text-[#7B2FBE] transition-colors uppercase tracking-wider">
                    Acessar <ArrowRight size={10} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Chart + Events */}
      <div className="grid lg:grid-cols-3 gap-px bg-gray-200">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-2 bg-white">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Evolução ao Longo do Programa</p>
            <Link to="/dashboard/membro/relatorios" className="text-[10px] font-bold text-gray-300 hover:text-[#7B2FBE] flex items-center gap-1 transition-colors uppercase tracking-wider">
              Ver mais <ArrowRight size={10} />
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center h-[180px] gap-3 text-center p-5">
            <BarChart2 size={28} className="text-gray-200" />
            <p className="text-xs text-gray-400 max-w-xs">O gráfico de crescimento aparecerá após o registro dos primeiros indicadores</p>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="bg-white">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Próximos Eventos</p>
            <Link to="/dashboard/membro/agenda" className="text-[10px] font-bold text-gray-300 hover:text-[#7B2FBE] flex items-center gap-1 transition-colors uppercase tracking-wider">
              Ver agenda <ArrowRight size={10} />
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2 py-8 text-center px-5">
            <CalendarDays size={22} className="text-gray-200" />
            <p className="text-xs text-gray-400">Nenhum evento próximo</p>
          </div>
        </motion.div>
      </div>

      {/* Marcos da Jornada */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="bg-white border border-gray-200">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <Star size={13} className="text-[#7B2FBE]" />
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Marcos da Jornada</p>
        </div>
        <div className="p-5 space-y-3">
          {[
            { label: 'Entrou no programa Arquitetura de Relevância',  done: true  },
            { label: 'Preencheu a primeira reflexão em Minha Identidade', done: false },
            { label: 'Identidade construída e validada com o mentor',  done: false },
            { label: 'Pilares da Marca definidos na sessão',            done: false },
            { label: 'Primeiro ciclo de Marketing Anual em execução',   done: false },
            { label: 'Primeiro ciclo de resultados revisado com mentor', done: false },
          ].map((marco, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-4 h-4 flex items-center justify-center flex-shrink-0 ${
                marco.done ? 'bg-[#7B2FBE]' : 'border border-gray-200'
              }`}>
                {marco.done && <span className="text-[9px] text-white font-black">✓</span>}
              </div>
              <p className={`text-sm ${marco.done ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>{marco.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Jornada do Programa */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="bg-white border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Jornada do Programa</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 m-px">
          {phases.map((phase) => (
            <div key={phase.num} className={`p-4 ${phase.active ? 'bg-white border-t-2 border-t-[#7B2FBE]' : 'bg-white'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-black ${phase.active ? 'text-[#7B2FBE]' : 'text-gray-300'}`}>
                  {String(phase.num).padStart(2,'0')}
                </span>
                {phase.active && (
                  <span className="text-[8px] font-black text-[#7B2FBE] uppercase tracking-widest">Atual</span>
                )}
              </div>
              <p className={`text-xs font-bold mb-2 ${phase.active ? 'text-gray-900' : 'text-gray-300'}`}>{phase.label}</p>
              <div className="space-y-1">
                {phase.deliverables.map((d) => (
                  <div key={d} className="flex items-center gap-1.5">
                    <span className={`w-1 h-1 flex-shrink-0 ${phase.active ? 'bg-[#7B2FBE]' : 'bg-gray-200'}`} />
                    <span className={`text-[10px] leading-relaxed ${phase.active ? 'text-gray-600' : 'text-gray-300'}`}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  )
}
