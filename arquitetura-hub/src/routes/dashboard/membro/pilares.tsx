import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Layers, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { PilarAccordion } from '@/components/membro/PilarAccordion'
import { staggerContainer, fadeInUp } from '@/lib/motion'
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
  const diferenciais   = identidade?.diferenciais?.filter(d => d.trim()) ?? []
  const diferencial    = diferenciais[0] ?? ''

  // Trunca para uso inline, preservando legibilidade
  const tag = (text: string, max = 55) =>
    text.length <= max ? text : text.slice(0, max).trimEnd() + '...'

  const sugestoes: SugestaoPilar[] = [

    // Pilar 1: Presença Direcionada — quem você alcança e onde
    publicoAlvo ? {
      id: 'presenca',
      cor: '#3B82F6',
      nome: 'Presença Direcionada',
      descricao: `Alcançar "${tag(publicoAlvo)}" nos canais e espaços onde essa pessoa já está`,
      acoes: [
        `Mapear os 3 principais canais, comunidades e eventos onde seu público está presente`,
        `Criar 2 conteúdos/semana que respondam as dúvidas reais de quem você descreveu como público`,
        `Participar ativamente de 1 grupo ou fórum frequentado pelo seu público-alvo`,
        `Fazer 3 conexões por semana com perfis que se encaixam no público que você descreveu`,
      ],
    } : null,

    // Pilar 2: Autoridade pela Entrega — provar a transformação
    proposta ? {
      id: 'autoridade',
      cor: '#7B2FBE',
      nome: 'Autoridade pela Entrega',
      descricao: `Tornar visível a transformação que você gera: "${tag(proposta)}"`,
      acoes: [
        `Documentar 1 caso real de cliente por mês, mostrando o antes e o depois da transformação`,
        `Criar série de conteúdo explicando o seu método e o processo por trás do que você entrega`,
        `Pedir depoimento em vídeo de 2 clientes que já viveram a transformação que você propõe`,
        `Produzir 1 conteúdo/mês mostrando os bastidores do seu processo de trabalho`,
      ],
    } : null,

    // Pilar 3: Palco e Eventos — autoridade ao vivo, fora das redes
    (storytelling || diferencial || proposta) ? {
      id: 'eventos',
      cor: '#EC4899',
      nome: 'Palco e Eventos',
      descricao: diferencial
        ? `Construir autoridade ao vivo posicionando: "${tag(diferencial)}" como ponto de vista único`
        : proposta
          ? `Falar publicamente sobre como você entrega: "${tag(proposta)}"`
          : 'Construir autoridade fora das redes, onde a confiança se consolida mais rápido',
      acoes: [
        publicoAlvo
          ? `Candidatar-se para falar em 1 evento por trimestre onde "${tag(publicoAlvo, 45)}" está presente`
          : `Candidatar-se para falar em 1 evento ou summit por trimestre no seu nicho`,
        `Propor participação em podcasts e lives como especialista convidado`,
        publicoAlvo
          ? `Propor co-criação ao vivo com 2 parceiros que atendem o mesmo público que você`
          : `Propor co-criação ao vivo com 2 parceiros estratégicos complementares`,
        storytelling
          ? `Estruturar sua história de virada como palestra-âncora de 20 minutos`
          : `Desenvolver uma palestra-âncora a partir do ponto de vista único que você tem`,
      ],
    } : null,

    // Pilar 4: Diferenciação Visível — o que só você tem
    diferencial ? {
      id: 'diferenciacao',
      cor: '#F59E0B',
      nome: 'Diferenciação Visível',
      descricao: `Tornar evidente para o mercado: "${tag(diferencial)}"`,
      acoes: [
        `Criar série de conteúdo mostrando sua abordagem versus o que o mercado costuma fazer`,
        diferencial
          ? `Publicar seu ponto de vista sobre "${tag(diferencial)}" — o que você faz diferente e por quê`
          : 'Publicar sua visão sobre o mercado e onde a maioria erra',
        `Coletar e publicar provas concretas que validem seu diferencial (dados, resultados, depoimentos)`,
        `Criar 1 conteúdo/mês de "comparativo" mostrando como sua forma de trabalhar gera mais resultado`,
      ],
    } : null,

    // Pilar 5: Pipeline de Clientes — caminho da atração à venda
    formatoProduto ? {
      id: 'pipeline',
      cor: '#10B981',
      nome: 'Pipeline de Clientes',
      descricao: `Criar o caminho de atração e conversão para: "${tag(formatoProduto)}"`,
      acoes: [
        `Desenvolver 1 conteúdo gratuito de alto valor que naturalmente leva à sua oferta principal`,
        publicoAlvo
          ? `Construir lista de contatos do seu público-alvo para abordagem consultiva direta`
          : 'Construir lista de potenciais clientes para abordagem consultiva direta',
        `Identificar 3 parceiros estratégicos que atendem o mesmo público e podem indicar clientes`,
        `Criar sequência de acompanhamento para quem demonstra interesse mas ainda não comprou`,
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
    <motion.div variants={fadeInUp} initial="hidden" animate="visible"
      className="rounded-2xl border border-[#7B2FBE]/15 bg-white shadow-sm overflow-hidden"
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
            Estes pilares são pontos de partida — na sessão com seu mentor, vocês refinam e personalizam cada frente.
          </p>
        </div>
      )}
    </motion.div>
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
            Definidos com seu mentor a partir da sua identidade — cada pilar traduz quem você é em ações concretas de presença
          </p>
        </div>

        <div className="text-right bg-white border border-[#7B2FBE]/20 rounded-2xl px-5 py-3 shadow-sm flex-shrink-0">
          <p className="text-3xl font-semibold text-[#7B2FBE]">{overallPct}%</p>
          <p className="text-xs text-gray-400">{doneAcoes}/{totalAcoes} ações</p>
        </div>
      </div>

      {/* Identidade de base — referência para construção dos pilares */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
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
      </motion.div>

      {/* Sugestões baseadas na identidade */}
      <SugestoesDePilares onAddPilar={handleAddPilar} />

      {/* Pilares */}
      {pilares.length === 0 ? (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible"
          className="rounded-2xl bg-white border border-gray-200 shadow-sm p-8 text-center"
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
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
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
        </motion.div>
      )}

      {/* Esta construção alimenta */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5"
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
                Os pilares definem onde você quer ter presença e autoridade — as metas OKR traduzem isso em objetivos mensuráveis por trimestre.
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
      </motion.div>

    </div>
  )
}
