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
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="flex items-start justify-between gap-4"
      >
        <div>
          <p className="text-xs text-gray-400 font-medium mb-0.5">Olá, {firstName}</p>
          <h1 className="text-xl font-semibold text-gray-900">{fullName}</h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-md leading-relaxed">
            {faseAtual.heroDesc}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1.5 border border-[#7B2FBE]/25 bg-[#7B2FBE]/5 text-[#7B2FBE] text-xs font-medium px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7B2FBE] animate-pulse" />
              Fase {faseAtual.num} de 4 — {faseAtual.label}
            </span>
          </div>
        </div>
        <div className="text-right bg-white border border-gray-200 rounded-xl px-5 py-3 flex-shrink-0 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Pontos de Evolução</p>
          <p className="text-3xl font-semibold text-gray-900 leading-none">0</p>
          <p className="text-xs text-gray-400 mt-1">de 100 pts</p>
        </div>
      </motion.div>

      {/* Mapa de Construção */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Mapa de Construção da sua Marca</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Cada etapa se apoia na anterior. Comece pela Identidade e avance com seu mentor.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-1 lg:gap-0 lg:items-stretch">

          <Link to="/dashboard/membro/posicionamento" className="flex-1">
            <div className="group h-full rounded-2xl lg:rounded-r-none lg:rounded-l-2xl border border-[#7B2FBE]/25 bg-[#7B2FBE]/[0.04] p-4 hover:bg-[#7B2FBE]/[0.07] transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-[#7B2FBE]">01</span>
                <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Em construção</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-tight">Identidade de Marca</p>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Quem você é, para quem fala, o que entrega de diferente e como chega ao mercado
              </p>
              <div className="mt-3 pt-3 border-t border-[#7B2FBE]/15 flex items-center gap-1 text-xs text-[#7B2FBE]">
                Preencher <ChevronRight size={11} />
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center justify-center w-7 flex-shrink-0 bg-gray-50 border-y border-gray-200 z-10">
            <ArrowRight size={14} className="text-gray-300" />
          </div>
          <div className="flex lg:hidden items-center justify-center py-0.5">
            <div className="w-px h-4 bg-gray-200" />
          </div>

          <Link to="/dashboard/membro/pilares" className="flex-1">
            <div className="group h-full border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-400">02</span>
                <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Aguarda Identidade</span>
              </div>
              <p className="text-sm font-semibold text-gray-400 leading-tight">Pilares da Marca</p>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                As frentes estratégicas de construção de presença definidas a partir da sua identidade
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-1 text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                Ver pilares <ChevronRight size={11} />
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center justify-center w-7 flex-shrink-0 bg-gray-50 border-y border-gray-200 z-10">
            <ArrowRight size={14} className="text-gray-300" />
          </div>
          <div className="flex lg:hidden items-center justify-center py-0.5">
            <div className="w-px h-4 bg-gray-200" />
          </div>

          <Link to="/dashboard/membro/marketing" className="flex-1">
            <div className="group h-full border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-400">03</span>
                <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Aguarda Pilares</span>
              </div>
              <p className="text-sm font-semibold text-gray-400 leading-tight">Marketing Anual</p>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Calendário de conteúdo e ações baseado nos pilares e no público definidos
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-1 text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                Ver calendário <ChevronRight size={11} />
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center justify-center w-7 flex-shrink-0 bg-gray-50 border-y border-gray-200 z-10">
            <ArrowRight size={14} className="text-gray-300" />
          </div>
          <div className="flex lg:hidden items-center justify-center py-0.5">
            <div className="w-px h-4 bg-gray-200" />
          </div>

          <Link to="/dashboard/membro/kpis" className="flex-1">
            <div className="group h-full rounded-2xl lg:rounded-l-none lg:rounded-r-2xl border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-400">04</span>
                <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Aguarda Execução</span>
              </div>
              <p className="text-sm font-semibold text-gray-400 leading-tight">Resultados</p>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Indicadores de alcance, autoridade e crescimento ao longo da jornada
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-1 text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                Ver indicadores <ChevronRight size={11} />
              </div>
            </div>
          </Link>

        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <KpiCard label="Alcance Orgânico"   value={0} unit="pessoas" icon={Users}      />
        <KpiCard label="Leads Qualificados" value={0}              icon={Target}     />
        <KpiCard label="Pontos de Evolução" value={0} unit="pts"   icon={Award} accent />
        <KpiCard label="Menções e Citações" value={0}              icon={TrendingUp} />
      </motion.div>

      {/* O Que Fazer Esta Semana */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">O Que Fazer Esta Semana</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Ações recomendadas para a fase {faseAtual.num}: {faseAtual.label}
            </p>
          </div>
          <span className="text-xs font-semibold text-[#7B2FBE]">
            {concluidas.size}/{acoes.length} feitas
          </span>
        </div>
        <div className="space-y-2.5">
          {acoes.map((acao, i) => {
            const feita = concluidas.has(i)
            return (
              <div
                key={i}
                className="flex items-start gap-3 cursor-pointer group"
                onClick={() => toggleAcao(i)}
              >
                {feita
                  ? <CheckCircle2 size={18} className="text-[#7B2FBE] flex-shrink-0 mt-0.5" />
                  : <Circle size={18} className="text-gray-300 group-hover:text-[#7B2FBE]/50 flex-shrink-0 mt-0.5 transition-colors" />
                }
                <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
                  <p className={`text-sm leading-relaxed ${feita ? 'line-through text-gray-300' : 'text-gray-700'}`}>
                    {acao.texto}
                  </p>
                  {!feita && acao.href && (
                    <Link to={acao.href} onClick={e => e.stopPropagation()}>
                      <ArrowRight size={14} className="text-gray-300 hover:text-[#7B2FBE] flex-shrink-0 mt-0.5 transition-colors" />
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
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Ferramentas do Programa</h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {quickLinks.map((item) => (
            <motion.div key={item.href} variants={fadeInUp}>
              <Link to={item.href}>
                <div className="group rounded-xl bg-white border border-gray-200 p-4 hover:border-[#7B2FBE]/25 hover:shadow-sm transition-all cursor-pointer h-full flex flex-col">
                  <span className="text-[11px] font-medium text-[#7B2FBE] mb-2 block">{item.num}</span>
                  <p className="text-sm font-semibold text-gray-800 leading-tight flex-1">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{item.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-gray-300 group-hover:text-[#7B2FBE] transition-colors">
                    Acessar <ArrowRight size={11} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Chart + Events */}
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Evolução ao Longo do Programa</h3>
            <Link to="/dashboard/membro/relatorios" className="text-xs text-gray-400 hover:text-[#7B2FBE] flex items-center gap-1 transition-colors">
              Ver mais <ArrowRight size={11} />
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center h-[200px] gap-3 text-center">
            <BarChart2 size={32} className="text-gray-200" />
            <p className="text-sm text-gray-400">O gráfico de crescimento aparecerá aqui após o registro dos primeiros indicadores</p>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Próximos Eventos</h3>
            <Link to="/dashboard/membro/agenda" className="text-xs text-gray-400 hover:text-[#7B2FBE] flex items-center gap-1 transition-colors">
              Ver agenda <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-2">
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <CalendarDays size={22} className="text-gray-200" />
              <p className="text-sm text-gray-400">Nenhum evento próximo</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Marcos da Jornada */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Star size={15} className="text-[#7B2FBE]" />
          <h3 className="text-sm font-bold text-gray-900">Marcos da Jornada</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Entrou no programa Arquitetura de Relevância',  done: true  },
            { label: 'Preencheu a primeira reflexão em Minha Identidade', done: false },
            { label: 'Identidade construída e validada com o mentor',  done: false },
            { label: 'Pilares da Marca definidos na sessão',            done: false },
            { label: 'Primeiro ciclo de Marketing Anual em execução',   done: false },
            { label: 'Primeiro ciclo de resultados revisado com mentor', done: false },
          ].map((marco, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                marco.done ? 'bg-[#7B2FBE]' : 'border-2 border-gray-200'
              }`}>
                {marco.done && <span className="text-[10px] text-white font-black">✓</span>}
              </div>
              <p className={`text-sm leading-tight ${marco.done ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {marco.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Jornada do Programa */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5"
      >
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Jornada do Programa</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {phases.map((phase) => (
            <div
              key={phase.num}
              className={`rounded-xl p-4 border transition-all ${
                phase.active
                  ? 'bg-[#7B2FBE]/5 border-[#7B2FBE]/30'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                  phase.active ? 'bg-[#7B2FBE] text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {phase.num}
                </div>
                {phase.active && (
                  <span className="text-[10px] font-black bg-[#7B2FBE] text-white px-1.5 py-0.5 rounded-md uppercase tracking-wide">Atual</span>
                )}
              </div>
              <p className={`text-xs font-semibold mb-2 ${phase.active ? 'text-gray-900' : 'text-gray-400'}`}>
                {phase.label}
              </p>
              <div className="space-y-1">
                {phase.deliverables.map((d) => (
                  <div key={d} className="flex items-center gap-1.5">
                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${phase.active ? 'bg-[#7B2FBE]' : 'bg-gray-300'}`} />
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
