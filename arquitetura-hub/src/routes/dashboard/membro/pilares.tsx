import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ChevronRight, Layers, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { PilarAccordion } from '@/components/membro/PilarAccordion'
import { mockPilares } from '@/lib/mocks/pilares'
import { getIdentidade, PILAR_LABELS } from '@/lib/identidade'
import type { Pilar } from '@/types'

export const Route = createFileRoute('/dashboard/membro/pilares')({
  component: PilaresPage,
})

interface SugestaoPilar {
  id: string
  cor: string
  nome: string
  descricao: string
  acoes: string[]
}

function SugestoesDePilares({ onAddPilar }: { onAddPilar: (p: Pilar) => void }) {
  const identidade = getIdentidade()
  const [open, setOpen] = useState(true)
  const [adicionados, setAdicionados] = useState<Set<string>>(new Set())

  const publicoAlvo    = identidade?.pilares.publicoAlvo?.reflexao?.trim()
  const proposta       = identidade?.pilares.proposta?.reflexao?.trim()
  const storytelling   = identidade?.pilares.storytelling?.reflexao?.trim()
  const formatoProduto = identidade?.pilares.formatoProduto?.reflexao?.trim()
  const diferencial    = identidade?.diferenciais?.[0] ?? ''

  const sugestoes: SugestaoPilar[] = [
    publicoAlvo ? {
      id: 'presenca',
      cor: '#3B82F6',
      nome: 'Presença Direcionada',
      descricao: `Visibilidade focada em "${publicoAlvo.slice(0, 65)}${publicoAlvo.length > 65 ? '...' : ''}"`,
      acoes: [
        'Publicar 2 conteúdos por semana falando diretamente para seu público',
        'Participar de 1 comunidade ou evento onde seu público-alvo está presente',
        'Produzir 1 conteúdo/mês respondendo as principais dúvidas do mercado',
      ],
    } : null,
    proposta ? {
      id: 'autoridade',
      cor: '#7B2FBE',
      nome: 'Autoridade pela Entrega',
      descricao: `Demonstrar como você entrega "${proposta.slice(0, 65)}${proposta.length > 65 ? '...' : ''}"`,
      acoes: [
        'Publicar 1 case de resultado real por mês com dados e aprendizados',
        'Criar série de conteúdo explicando seu método e processo de trabalho',
        'Documentar os bastidores e compartilhar o "como funciona"',
      ],
    } : null,
    (storytelling || diferencial) ? {
      id: 'diferenciacao',
      cor: '#F59E0B',
      nome: 'Diferenciação e História',
      descricao: diferencial
        ? `Posicionar "${diferencial.slice(0, 65)}${diferencial.length > 65 ? '...' : ''}" como vantagem única`
        : 'Usar sua história como âncora de credibilidade e identificação',
      acoes: [
        'Publicar sua história de origem e por que você faz o que faz',
        'Criar conteúdo mostrando sua abordagem única em comparação ao mercado',
        'Coletar e compartilhar depoimentos que reforçam seu diferencial',
      ],
    } : null,
    formatoProduto ? {
      id: 'pipeline',
      cor: '#10B981',
      nome: 'Pipeline de Clientes',
      descricao: `Criar caminho de atração para "${formatoProduto.slice(0, 65)}${formatoProduto.length > 65 ? '...' : ''}"`,
      acoes: [
        'Criar conteúdo gratuito que leva naturalmente à sua oferta principal',
        'Construir lista de potenciais clientes para abordagem direta',
        'Produzir 1 conteúdo/mês demonstrando como funciona seu formato de trabalho',
      ],
    } : null,
  ].filter(Boolean) as SugestaoPilar[]

  if (sugestoes.length === 0) return null

  function usar(s: SugestaoPilar) {
    const novo: Pilar = {
      id: `sug-${s.id}-${Date.now()}`,
      user_id: 'local',
      nome: s.nome,
      descricao: s.descricao,
      cor: s.cor,
      ordem: 0,
      acoes: s.acoes.map((texto, i) => ({
        id: `a-${Date.now()}-${i}`,
        pilar_id: `sug-${s.id}`,
        texto,
        concluida: false,
        ordem: i + 1,
      })),
    }
    onAddPilar(novo)
    setAdicionados(prev => new Set([...prev, s.id]))
  }

  return (
    <div
      className="rounded-xl border border-[#7B2FBE]/15 bg-white shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#7B2FBE]/10 flex items-center justify-center flex-shrink-0">
            <Sparkles size={12} className="text-[#7B2FBE]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Sugestões de Pilares</p>
            <p className="text-xs text-gray-400">Frentes estratégicas geradas a partir da sua identidade</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-[#7B2FBE] bg-[#7B2FBE]/10 px-2 py-0.5 rounded-full">
            {sugestoes.length} frentes
          </span>
          {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 p-5 space-y-3">
          {sugestoes.map(s => {
            const adicionado = adicionados.has(s.id)
            return (
              <div key={s.id} className="rounded-xl border border-gray-100 p-4 bg-gray-50/30 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.cor }} />
                      <p className="text-sm font-semibold text-gray-800">{s.nome}</p>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{s.descricao}</p>
                  </div>
                  <button
                    onClick={() => !adicionado && usar(s)}
                    disabled={adicionado}
                    className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
                    style={adicionado
                      ? { background: '#f3f4f6', color: '#9ca3af' }
                      : { background: `${s.cor}15`, color: s.cor }
                    }
                  >
                    {adicionado ? 'Adicionado ✓' : 'Usar como pilar'}
                  </button>
                </div>
                <div className="space-y-1.5 pl-1">
                  {s.acoes.map((acao, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: s.cor }} />
                      <p className="text-xs text-gray-500 leading-relaxed">{acao}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          <p className="text-xs text-gray-400 pt-1 border-t border-gray-100">
            Estes pilares são pontos de partida. Na sessão com seu mentor, vocês refinam e personalizam cada frente.
          </p>
        </div>
      )}
    </div>
  )
}

function PilaresPage() {
  const [pilares, setPilares] = useState<Pilar[]>(mockPilares)
  const [identidadeOpen, setIdentidadeOpen] = useState(true)
  const identidade = getIdentidade()
  const pilarFields = ['publicoAlvo', 'proposta', 'storytelling', 'formatoProduto'] as const
  const identidadePreenchida = identidade
    ? pilarFields.filter(f => identidade.pilares[f]?.reflexao?.trim()).length
    : 0

  function handleToggleAcao(pilarId: string, acaoId: string, concluida: boolean) {
    setPilares(prev => prev.map(p => {
      if (p.id !== pilarId) return p
      return { ...p, acoes: p.acoes.map(a => a.id === acaoId ? { ...a, concluida } : a) }
    }))
  }

  function handleAddAcao(pilarId: string, texto: string) {
    setPilares(prev => prev.map(p => {
      if (p.id !== pilarId) return p
      const newAcao = {
        id: `a-${Date.now()}`,
        pilar_id: pilarId,
        texto,
        concluida: false,
        ordem: p.acoes.length + 1,
      }
      return { ...p, acoes: [...p.acoes, newAcao] }
    }))
  }

  function handleAddPilar(pilar: Pilar) {
    setPilares(prev => [...prev, { ...pilar, ordem: prev.length + 1 }])
  }

  function handleDeleteAcao(pilarId: string, acaoId: string) {
    setPilares(prev => prev.map(p => {
      if (p.id !== pilarId) return p
      return { ...p, acoes: p.acoes.filter(a => a.id !== acaoId) }
    }))
  }

  function handleEditAcao(pilarId: string, acaoId: string, texto: string) {
    setPilares(prev => prev.map(p => {
      if (p.id !== pilarId) return p
      return { ...p, acoes: p.acoes.map(a => a.id === acaoId ? { ...a, texto } : a) }
    }))
  }

  function handleEditPilar(pilarId: string, patch: Partial<Pick<Pilar, 'nome' | 'descricao'>>) {
    setPilares(prev => prev.map(p => p.id === pilarId ? { ...p, ...patch } : p))
  }

  function handleDeletePilar(pilarId: string) {
    setPilares(prev => prev.filter(p => p.id !== pilarId))
  }

  const totalAcoes = pilares.reduce((s, p) => s + p.acoes.length, 0)
  const doneAcoes  = pilares.reduce((s, p) => s + p.acoes.filter(a => a.concluida).length, 0)
  const overallPct = totalAcoes > 0 ? Math.round((doneAcoes / totalAcoes) * 100) : 0

  return (
    <div className="space-y-6">

      {/* Cabeçalho + cadeia */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">

          {/* Mini cadeia de construção */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link to="/dashboard/membro/posicionamento">
              <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">01 Identidade</span>
            </Link>
            <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
            <span className="text-xs font-bold text-[#7B2FBE] bg-[#7B2FBE]/10 px-2 py-0.5 rounded-md">
              02 Pilares
            </span>
            <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
            <Link to="/dashboard/membro/okr">
              <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">03 OKRs</span>
            </Link>
            <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
            <Link to="/dashboard/membro/marketing">
              <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">04 Marketing</span>
            </Link>
            <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
            <Link to="/dashboard/membro/kpis">
              <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">05 Resultados</span>
            </Link>
          </div>

          <h1 className="text-xl font-semibold text-gray-900">Pilares da Marca</h1>
          <p className="text-gray-400 text-sm">
            Definidos com seu mentor a partir da sua identidade. Cada pilar traduz quem você é em ações concretas de presença
          </p>
        </div>

        <div className="text-right bg-white border border-[#7B2FBE]/20 rounded-xl px-5 py-3 shadow-sm flex-shrink-0">
          <p className="text-3xl font-semibold text-[#7B2FBE]">{overallPct}%</p>
          <p className="text-xs text-gray-400">{doneAcoes}/{totalAcoes} ações</p>
        </div>
      </div>

      {/* Identidade de base — referência para construção dos pilares */}
      <div
        className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
      >
        <button
          onClick={() => setIdentidadeOpen(o => !o)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-[#7B2FBE]">01</span>
              <p className="text-sm font-medium text-gray-900">Identidade de Marca</p>
            </div>
            {identidadePreenchida > 0 && (
              <span className="text-[10px] font-semibold text-[#7B2FBE] bg-[#7B2FBE]/10 px-2 py-0.5 rounded-full">
                {identidadePreenchida}/4 blocos
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Base de construção dos pilares</span>
            {identidadeOpen
              ? <ChevronUp size={14} className="text-gray-400" />
              : <ChevronDown size={14} className="text-gray-400" />
            }
          </div>
        </button>

        {identidadeOpen && (
          <div className="border-t border-gray-100 bg-gray-50/50">
            {identidadePreenchida === 0 ? (
              <div className="px-5 py-5 text-center">
                <p className="text-sm text-gray-400 mb-2">Nenhuma reflexão preenchida ainda.</p>
                <Link to="/dashboard/membro/posicionamento"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7B2FBE] hover:underline"
                >
                  Preencher Minha Identidade <ChevronRight size={12} />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pilarFields.map((field, i) => {
                  const texto = identidade?.pilares[field]?.reflexao?.trim()
                  return (
                    <div key={field} className="px-5 py-3.5 flex items-start gap-3">
                      <span className="text-[10px] font-medium text-[#7B2FBE] w-5 flex-shrink-0 mt-0.5">
                        0{i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">
                          {PILAR_LABELS[field]}
                        </p>
                        {texto
                          ? <p className="text-sm text-gray-700 leading-relaxed">{texto}</p>
                          : <p className="text-sm text-gray-300 italic">Não preenchido</p>
                        }
                      </div>
                    </div>
                  )
                })}
                {identidade && identidade.diferenciais.some(d => d.trim()) && (
                  <div className="px-5 py-3.5 flex items-start gap-3">
                    <span className="text-[10px] font-medium text-[#7B2FBE] w-5 flex-shrink-0 mt-0.5">05</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">Diferenciais</p>
                      <div className="space-y-1">
                        {identidade.diferenciais.filter(d => d.trim()).map((d, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#7B2FBE] flex-shrink-0" />
                            <p className="text-sm text-gray-700">{d}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="px-5 py-3 flex justify-end">
                  <Link to="/dashboard/membro/posicionamento"
                    className="text-xs font-semibold text-[#7B2FBE] hover:underline flex items-center gap-1"
                  >
                    Editar identidade <ChevronRight size={11} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sugestões baseadas na identidade */}
      <SugestoesDePilares onAddPilar={handleAddPilar} />

      {/* Pilares */}
      {pilares.length === 0 ? (
        <div
          className="rounded-xl bg-white border border-gray-200 shadow-sm p-8 text-center"
        >
          <Layers size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500 mb-1">Pilares ainda não definidos</p>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Os pilares da sua marca são construídos com seu mentor a partir da identidade definida na sessão de posicionamento.
            Complete primeiro a etapa de Identidade.
          </p>
          <Link to="/dashboard/membro/posicionamento"
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-[#7B2FBE] hover:underline"
          >
            Ir para Minha Identidade <ChevronRight size={12} />
          </Link>
        </div>
      ) : (
        <div
          className="space-y-3"
        >
          {pilares.map(pilar => (
            <PilarAccordion
              key={pilar.id}
              pilar={pilar}
              onToggleAcao={handleToggleAcao}
              onAddAcao={handleAddAcao}
              onDeleteAcao={handleDeleteAcao}
              onEditAcao={handleEditAcao}
              onEditPilar={handleEditPilar}
              onDeletePilar={handleDeletePilar}
            />
          ))}
        </div>
      )}

      {/* Esta construção alimenta */}
      <div
        className="rounded-xl border border-gray-100 bg-white shadow-sm p-5"
      >
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-4">Esta construção alimenta</p>
        <div className="grid sm:grid-cols-2 gap-3">

          <Link to="/dashboard/membro/okr">
            <div className="group rounded-xl border border-gray-100 bg-gray-50 hover:border-[#7B2FBE]/20 hover:bg-[#7B2FBE]/[0.03] p-4 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-[#7B2FBE]">03</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#7B2FBE] transition-colors" />
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-tight mb-1.5">OKRs & Metas</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Os pilares definem onde você quer ter presença e autoridade. As metas OKR traduzem isso em objetivos mensuráveis por trimestre.
              </p>
            </div>
          </Link>

          <Link to="/dashboard/membro/marketing">
            <div className="group rounded-xl border border-gray-100 bg-gray-50 hover:border-[#7B2FBE]/20 hover:bg-[#7B2FBE]/[0.03] p-4 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-[#7B2FBE]">04</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#7B2FBE] transition-colors" />
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-tight mb-1.5">Marketing Anual</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Cada pilar define um eixo de conteúdo e presença. O calendário de marketing é construído sobre essas frentes.
              </p>
            </div>
          </Link>

        </div>
      </div>

    </div>
  )
}
