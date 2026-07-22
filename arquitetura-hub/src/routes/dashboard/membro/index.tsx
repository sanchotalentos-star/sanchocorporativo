import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, CheckSquare2, Square, ChevronRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/membro/')({
  component: MembroDashboard,
})

const phases = [
  {
    num: 1,
    label: 'OKR e MVP',
    desc: 'Você está definindo as bases da sua jornada. O foco é clareza: o que você quer conquistar e como vai medir isso.',
    active: true,
  },
  { num: 2, label: 'Primeiras Vitórias', desc: '', active: false },
  { num: 3, label: 'Plano em Ação', desc: '', active: false },
  { num: 4, label: 'Escala', desc: '', active: false },
]

const acoesPorFase: Record<number, { texto: string; href?: string }[]> = {
  1: [
    { texto: 'Preencher suas percepções iniciais em Minha Identidade', href: '/dashboard/membro/posicionamento' },
    { texto: 'Revisar os objetivos definidos na última sessão com o mentor', href: '/dashboard/membro/okr' },
    { texto: 'Listar 3 diferenciais que você percebe em si mesmo antes da próxima sessão', href: '/dashboard/membro/posicionamento' },
    { texto: 'Confirmar presença na próxima sessão da mentoria', href: '/dashboard/membro/agenda' },
  ],
  2: [
    { texto: 'Concluir o preenchimento dos 4 pilares da sua marca', href: '/dashboard/membro/posicionamento' },
    { texto: 'Revisar o plano de marketing do mês', href: '/dashboard/membro/marketing' },
    { texto: 'Registrar os aprendizados da última sessão', href: '/dashboard/membro/okr' },
  ],
  3: [
    { texto: 'Atualizar os Key Results do OKR com os dados da semana', href: '/dashboard/membro/okr' },
    { texto: 'Registrar o ciclo PDCA da última ação executada', href: '/dashboard/membro/kpis' },
    { texto: 'Preparar sua história para a sessão de storytelling', href: '/dashboard/membro/posicionamento' },
  ],
  4: [
    { texto: 'Revisar os indicadores do mês e identificar o que escalar', href: '/dashboard/membro/kpis' },
    { texto: 'Atualizar o PDCA ciclo 2 com as aprendizagens acumuladas', href: '/dashboard/membro/kpis' },
    { texto: 'Planejar a próxima ação de autoridade com o mentor', href: '/dashboard/membro/agenda' },
  ],
}

const marcos = [
  { label: 'Entrou no programa Arquitetura de Relevância', done: true },
  { label: 'Preencheu a primeira reflexão em Minha Identidade', done: false },
  { label: 'Identidade construída e validada com o mentor', done: false },
  { label: 'Pilares da Marca definidos na sessão', done: false },
  { label: 'Primeiro ciclo de Marketing Anual em execução', done: false },
  { label: 'Primeiro ciclo de resultados revisado com mentor', done: false },
]

const menuItens = [
  { label: 'Minha Identidade', desc: 'Quem você é e o que você entrega', href: '/dashboard/membro/posicionamento' },
  { label: 'Pilares da Marca', desc: 'Ações estratégicas de cada pilar', href: '/dashboard/membro/pilares' },
  { label: 'Metas de Impacto', desc: 'OKRs e resultados-chave', href: '/dashboard/membro/okr' },
  { label: 'Tarefas', desc: 'Ações concretas para avançar', href: '/dashboard/membro/tarefas' },
  { label: 'Marketing Anual', desc: 'Agenda de conteúdo e presença', href: '/dashboard/membro/marketing' },
  { label: 'Indicadores', desc: 'KPIs e dados de crescimento', href: '/dashboard/membro/kpis' },
]

function MembroDashboard() {
  const { user } = useAuth()
  const firstName = user?.full_name?.split(' ')[0] ?? 'Bem-vindo'
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
    if (!wasDone) toast.success('Ação concluída.')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">

      {/* Cabeçalho */}
      <div className="pt-1">
        <p className="text-xs text-gray-400 mb-0.5">Olá, {firstName}</p>
        <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight">{user?.full_name}</h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-xl">
          {faseAtual.desc}
        </p>
        <div className="mt-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#7B2FBE] border border-[#7B2FBE]/20 bg-[#7B2FBE]/5 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7B2FBE] animate-pulse" />
            Fase {faseAtual.num} de 4 — {faseAtual.label}
          </span>
        </div>
      </div>

      {/* Jornada do programa */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="grid grid-cols-4 divide-x divide-gray-100">
          {phases.map(p => (
            <div key={p.num} className={`p-4 ${p.active ? 'bg-[#7B2FBE]/[0.03]' : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold tracking-wider ${p.active ? 'text-[#7B2FBE]' : 'text-gray-300'}`}>
                  {p.num < 10 ? `0${p.num}` : p.num}
                </span>
                {p.active && <span className="text-[9px] font-semibold text-[#7B2FBE] bg-[#7B2FBE]/10 px-1.5 py-0.5 rounded uppercase tracking-wide">Atual</span>}
              </div>
              <p className={`text-xs font-medium leading-snug ${p.active ? 'text-gray-800' : 'text-gray-300'}`}>{p.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* O que fazer esta semana */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Esta semana</h2>
            <p className="text-xs text-gray-400 mt-0.5">Fase {faseAtual.num}: {faseAtual.label}</p>
          </div>
          <span className="text-xs font-medium text-[#7B2FBE]">{concluidas.size}/{acoes.length}</span>
        </div>
        <div>
          {acoes.map((acao, i) => {
            const feita = concluidas.has(i)
            return (
              <div
                key={i}
                onClick={() => toggleAcao(i)}
                className="flex items-start gap-3 px-5 py-3.5 border-b border-gray-50 last:border-0 cursor-pointer group hover:bg-gray-50/50 transition-colors"
              >
                {feita
                  ? <CheckSquare2 size={15} className="text-[#7B2FBE] flex-shrink-0 mt-0.5" />
                  : <Square size={15} className="text-gray-300 group-hover:text-gray-400 flex-shrink-0 mt-0.5 transition-colors" />
                }
                <div className="flex-1 flex items-start justify-between gap-3">
                  <p className={`text-sm leading-relaxed ${feita ? 'line-through text-gray-300' : 'text-gray-700'}`}>
                    {acao.texto}
                  </p>
                  {!feita && acao.href && (
                    <Link to={acao.href} onClick={e => e.stopPropagation()}>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-[#7B2FBE] flex-shrink-0 mt-0.5 transition-colors" />
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Ferramentas */}
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Ferramentas do programa</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px border border-gray-100 rounded-xl overflow-hidden bg-gray-100">
          {menuItens.map((item) => (
            <Link key={item.href} to={item.href}>
              <div className="bg-white px-4 py-4 hover:bg-gray-50 transition-colors group h-full flex items-start justify-between gap-2">
                <div>
                  <p className="text-[13px] font-medium text-gray-800 group-hover:text-[#7B2FBE] transition-colors leading-snug">{item.label}</p>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
                <ArrowRight size={13} className="text-gray-300 group-hover:text-[#7B2FBE] transition-colors flex-shrink-0 mt-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Marcos */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Marcos da jornada</h2>
        </div>
        <div>
          {marcos.map((marco, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 last:border-0">
              <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${marco.done ? 'bg-[#7B2FBE]' : 'border border-gray-200'}`}>
                {marco.done && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <p className={`text-sm leading-snug ${marco.done ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                {marco.label}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
