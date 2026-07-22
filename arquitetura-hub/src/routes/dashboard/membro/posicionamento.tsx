import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Lock, Sparkles, PenLine, MessageSquare, Search, Lightbulb, Target, Layers, ChevronRight, CheckCircle2, Circle, Download, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { IDENTIDADE_KEY } from '@/lib/identidade'

export const Route = createFileRoute('/dashboard/membro/posicionamento')({
  component: PosicionamentoPage,
})

type PilarStatus = 'aguardando' | 'reflexao_feita' | 'construido'
type PilarField  = 'publicoAlvo' | 'proposta' | 'storytelling' | 'formatoProduto'

interface PilarData {
  reflexao:      string
  analise:       string
  analiseLocked: boolean
  status:        PilarStatus
}

const statusConfig: Record<PilarStatus, { label: string; color: string; bg: string }> = {
  aguardando:     { label: 'Aguardando reflexão',   color: '#9CA3AF', bg: '#F3F4F6' },
  reflexao_feita: { label: 'Reflexão feita',        color: '#D97706', bg: '#FEF3C7' },
  construido:     { label: 'Construído com mentor', color: '#7B2FBE', bg: '#F3E8FF' },
}

const PILARES: {
  id:            PilarField
  num:           string
  label:         string
  desc:          string
  pergunta:      string
  placeholder:   string
  dica:          string
  mentorFoco:    string
  mentorItens:   string[]
  MentorIcon:    React.ElementType
}[] = [
  {
    id:          'publicoAlvo',
    num:         '01',
    label:       'Para Quem Você Fala',
    desc:        'A pessoa exata que mais se transforma com o seu trabalho',
    pergunta:    'Na sua percepção, quem é a pessoa ideal para o que você faz?',
    placeholder: 'Ex: Profissionais liberais entre 35 e 50 anos que têm expertise consolidada mas ainda trocam horas por dinheiro e querem criar um produto de alto valor...',
    dica:        'Pense em alguém real que você já ajudou. Qual era a situação dela antes? O que mudou depois do seu trabalho com ela?',
    MentorIcon:  Search,
    mentorFoco:  'Na sessão, seu mentor vai aprofundar o que você escreveu e construir com você um perfil preciso do seu cliente ideal.',
    mentorItens: [
      'Validar se a percepção que você tem do seu cliente bate com o mercado real',
      'Identificar as dores mais profundas e os desejos que essa pessoa carrega',
      'Refinar a especificidade: quanto mais preciso o perfil, mais eficiente o posicionamento',
      'Mapear onde essa pessoa está hoje e o que ela precisa para dar o próximo passo',
    ],
  },
  {
    id:          'proposta',
    num:         '02',
    label:       'O Que Você Entrega de Diferente',
    desc:        'O resultado transformador que só você entrega do seu jeito',
    pergunta:    'Qual transformação concreta você gera nas pessoas que trabalham com você?',
    placeholder: 'Ex: Em 90 dias, profissionais de saúde saem de uma agenda lotada para um produto digital estruturado e a primeira venda realizada...',
    dica:        'Foque no resultado, não no processo. O que a pessoa TEM depois de trabalhar com você que não tinha antes?',
    MentorIcon:  Target,
    mentorFoco:  'Seu mentor vai ajudar a transformar o que você entrega em uma proposta que o cliente sente, não apenas entende.',
    mentorItens: [
      'Separar o que é processo do que é resultado real e tangível',
      'Identificar o que existe de genuinamente único no seu jeito de trabalhar',
      'Construir uma promessa clara, mensurável e alinhada com o que seu cliente realmente quer',
      'Eliminar afirmações genéricas que qualquer concorrente poderia usar',
    ],
  },
  {
    id:          'storytelling',
    num:         '03',
    label:       'Sua História que Conecta',
    desc:        'O momento de virada que explica por que você faz o que faz',
    pergunta:    'Qual experiência pessoal te capacita a ajudar quem você ajuda hoje?',
    placeholder: 'Ex: Por 8 anos fui consultor trocando horas por dinheiro. Quando criei meu primeiro produto, percebi que meu conhecimento valia muito mais do que meu tempo disponível...',
    dica:        'Boa história tem o antes (dor ou limitação), o momento de virada e o depois: o que você conquistou e como isso te capacita a ajudar outros.',
    MentorIcon:  Lightbulb,
    mentorFoco:  'Toda autoridade tem uma história de transformação. Seu mentor vai extrair o que há de mais poderoso na sua trajetória.',
    mentorItens: [
      'Identificar os elementos da sua história que mais geram conexão e credibilidade',
      'Estruturar a narrativa no formato certo para o seu posicionamento',
      'Encontrar o ponto exato de virada que explica por que você faz o que faz hoje',
      'Garantir que a história conecta diretamente com o problema do seu cliente ideal',
    ],
  },
  {
    id:          'formatoProduto',
    num:         '04',
    label:       'Como Você Chega ao Mercado',
    desc:        'O formato, a estrutura e o preço do que você oferece',
    pergunta:    'Como você imagina que seu produto ou serviço deve ser estruturado?',
    placeholder: 'Ex: Mentoria individual de 3 meses, com 6 sessões de 1h via Google Meet e canal de suporte no WhatsApp. Investimento: R$ 4.800 à vista ou 3 parcelas de R$ 1.700...',
    dica:        'Descreva: formato (mentoria, grupo, curso), duração, frequência, canais e a faixa de preço que você considera justo pelo que entrega.',
    MentorIcon:  Layers,
    mentorFoco:  'Seu mentor vai alinhar o formato do seu produto com o que o seu público está disposto a comprar e com o que faz sentido para o seu modelo de negócio.',
    mentorItens: [
      'Validar se o formato escolhido é o que o seu cliente ideal prefere e pode pagar',
      'Ajustar a precificação com base no valor percebido e no posicionamento definido',
      'Definir o canal de aquisição mais eficiente para esse produto e esse público',
      'Estruturar a oferta de forma que ela seja simples de entender e fácil de vender',
    ],
  },
]

// Caminhos sugeridos por pilar — aparecem quando o campo tem texto
const PILAR_CAMINHOS: Record<PilarField, { titulo: string; texto: string }[]> = {
  publicoAlvo: [
    { titulo: 'Especificidade gera atração', texto: 'Quanto mais preciso o perfil, mais magnético o posicionamento. O mentor vai aprofundar até o nível de consciência e dor que esse público carrega hoje — é aí que está o ouro.' },
    { titulo: 'Nomeie a dor melhor que eles', texto: 'O maior diferencial de um posicionamento forte é descrever a dor do cliente melhor do que ele mesmo consegue. Quando ele lê sua comunicação e pensa "é exatamente sobre mim", o posicionamento está funcionando.' },
    { titulo: 'Base de tudo que vem depois', texto: 'Produto, preço, canal, história — tudo será calibrado para esse público. Quanto mais claro ele for agora, mais coerente e poderoso será tudo que você construir em cima.' },
  ],
  proposta: [
    { titulo: 'O cliente compra o destino', texto: 'Seu cliente compra a transformação, não o processo. Traduzir o que você faz em resultado concreto e mensurável é o núcleo da sua proposta — e o que diferencia posicionamentos genéricos de magnéticos.' },
    { titulo: 'Prazo define a promessa', texto: '"Em 90 dias" converte mais do que "ao longo da jornada". O mentor vai ajudar a encontrar o prazo real que você consegue garantir e que o cliente considera crível.' },
    { titulo: 'O núcleo da sua Zona de Genialidade', texto: 'O que existe de genuinamente único no seu jeito de trabalhar — algo que ninguém faz exatamente como você? Esse é o diferenciador que vai sustentar sua autoridade no longo prazo.' },
  ],
  storytelling: [
    { titulo: 'Antes, virada e depois', texto: 'A estrutura que mais conecta: onde você estava (dor ou limitação), o que mudou (momento de virada) e onde chegou (estado atual que prova que a transformação é real e possível).' },
    { titulo: 'Reconhecimento cria conexão', texto: 'Quando seu público lê sua história e pensa "eu já me senti assim", a conexão acontece instantaneamente. A especificidade do seu "antes" é o que gera identificação — não precisa ser dramático, precisa ser verdadeiro.' },
    { titulo: 'Sua maior prova de autoridade', texto: 'Sua história mostra que você viveu o que ensina. É a prova social mais autêntica que existe — e o mentor vai extrair os elementos que geram mais autoridade e conexão para o seu posicionamento.' },
  ],
  formatoProduto: [
    { titulo: 'Formato comunica posicionamento', texto: 'Mentoria individual comunica exclusividade e alto valor. Grupo comunica comunidade. Curso comunica escala. A escolha precisa estar alinhada com quem você quer atrair e como quer ser percebido.' },
    { titulo: 'Preço é uma declaração', texto: 'O valor que você pratica comunica onde você está no mercado. Um preço alinhado com a transformação entregue é diferente de um preço competitivo — e o mentor vai ajudar a encontrar esse equilíbrio.' },
    { titulo: 'Canal onde seu público já confia', texto: 'O melhor canal de aquisição é onde seu público ideal já está e já tem o hábito de buscar referências. Com o perfil definido, fica claro se ele está no LinkedIn, Instagram, em eventos ou em indicações.' },
  ],
}

type PilarStates = Record<PilarField, PilarData>

const initialPilarStates: PilarStates = {
  publicoAlvo:    { reflexao: '', analise: '', analiseLocked: true, status: 'aguardando' },
  proposta:       { reflexao: '', analise: '', analiseLocked: true, status: 'aguardando' },
  storytelling:   { reflexao: '', analise: '', analiseLocked: true, status: 'aguardando' },
  formatoProduto: { reflexao: '', analise: '', analiseLocked: true, status: 'aguardando' },
}

function loadSaved(): { pilares: PilarStates; diferenciais: string[] } | null {
  try {
    const raw = localStorage.getItem(IDENTIDADE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Componente: Zona de Genialidade em Formação
function ZonaDeGenialidade({ pilares, diferenciais }: { pilares: PilarStates; diferenciais: string[] }) {
  const publico  = pilares.publicoAlvo.reflexao.trim()
  const proposta = pilares.proposta.reflexao.trim()
  const historia = pilares.storytelling.reflexao.trim()
  const formato  = pilares.formatoProduto.reflexao.trim()
  const difs     = diferenciais.filter(d => d.trim())

  const filledCount = [publico, proposta, historia, formato].filter(Boolean).length
  if (filledCount < 2) return null

  const short = (text: string, max = 130) => text.length > max ? text.slice(0, max).trimEnd() + '…' : text

  return (
    <div
      className="rounded-xl border border-[#7B2FBE]/25 bg-[#7B2FBE]/[0.03] p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-[#7B2FBE]" />
          <p className="text-sm font-semibold text-gray-900">Zona de Genialidade em Formação</p>
        </div>
        <span className="text-[10px] font-medium bg-[#7B2FBE]/10 text-[#7B2FBE] px-2.5 py-1 rounded-full">
          {filledCount}/4 blocos
        </span>
      </div>

      <div className="space-y-3">
        {proposta && (
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded bg-[#7B2FBE] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Target size={10} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">Transformação que você gera</p>
              <p className="text-xs text-gray-700 leading-relaxed">{short(proposta)}</p>
            </div>
          </div>
        )}

        {publico && (
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded bg-[#7B2FBE] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Users size={10} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">Para quem essa transformação acontece</p>
              <p className="text-xs text-gray-700 leading-relaxed">{short(publico)}</p>
            </div>
          </div>
        )}

        {difs.length > 0 && (
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded bg-[#7B2FBE] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles size={10} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">O que te diferencia</p>
              <p className="text-xs text-gray-700 leading-relaxed">{difs.join(' · ')}</p>
            </div>
          </div>
        )}

        {historia && (
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded bg-[#7B2FBE] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb size={10} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">O que te capacita</p>
              <p className="text-xs text-gray-700 leading-relaxed">{short(historia)}</p>
            </div>
          </div>
        )}

        {formato && (
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded bg-[#7B2FBE] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Layers size={10} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">Como você chega</p>
              <p className="text-xs text-gray-700 leading-relaxed">{short(formato)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-[#7B2FBE]/10">
        <p className="text-xs text-[#7B2FBE] leading-relaxed">
          {filledCount < 4
            ? `Complete os ${4 - filledCount} bloco${4 - filledCount > 1 ? 's' : ''} restante${4 - filledCount > 1 ? 's' : ''} para revelar sua Zona de Genialidade completa. Seu mentor vai sintetizar tudo isso em uma declaração única de posicionamento.`
            : 'Todos os blocos preenchidos. Leve isso para a sessão — seu mentor vai transformar essas peças na declaração da sua Zona de Genialidade.'}
        </p>
      </div>
    </div>
  )
}

function PosicionamentoPage() {
  const { user }                        = useAuth()
  const saved                           = useState(() => loadSaved())[0]
  const [pilares, setPilares]           = useState<PilarStates>(saved?.pilares ?? initialPilarStates)
  const [genLocked]                     = useState(true)
  const [genText]                       = useState('')
  const [diferenciais, setDiferenciais] = useState<string[]>(saved?.diferenciais ?? ['', '', ''])
  const toastedFields                   = useState(() => new Set<PilarField>())[0]

  useEffect(() => {
    try {
      localStorage.setItem(IDENTIDADE_KEY, JSON.stringify({ pilares, diferenciais }))
    } catch {}
  }, [pilares, diferenciais])

  const pilarLabels: Record<PilarField, string> = {
    publicoAlvo:    'Para Quem Você Fala',
    proposta:       'O Que Você Entrega de Diferente',
    storytelling:   'Sua História que Conecta',
    formatoProduto: 'Como Você Chega ao Mercado',
  }

  function updateReflexao(field: PilarField, value: string) {
    const wasEmpty   = !pilares[field].reflexao.trim()
    const isNowFilled = value.trim().length > 0

    if (wasEmpty && isNowFilled && !toastedFields.has(field)) {
      toastedFields.add(field)
      toast.success(`Reflexão iniciada: ${pilarLabels[field]}`, {
        description: 'Ótimo! Leve isso para a sessão com seu mentor.',
      })
    }

    setPilares(prev => {
      const current = prev[field]
      const newStatus: PilarStatus = current.analise
        ? 'construido'
        : value.trim() ? 'reflexao_feita' : 'aguardando'
      return { ...prev, [field]: { ...current, reflexao: value, status: newStatus } }
    })
  }

  const comReflexao = Object.values(pilares).filter(p => p.reflexao.trim()).length
  const construidos = Object.values(pilares).filter(p => p.status === 'construido').length
  const total       = PILARES.length
  const pct         = Math.round((comReflexao / total) * 100)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Minha Identidade de Marca</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Preencha sua percepção inicial em cada bloco. Na sessão com seu mentor, vocês analisam juntos e constroem seu perfil de autoridade.
        </p>
      </div>

      {/* Como funciona */}
      <div
        className="rounded-xl border border-[#7B2FBE]/15 bg-[#7B2FBE]/[0.03] p-5"
      >
        <p className="text-[10px] font-medium text-[#7B2FBE] uppercase tracking-wide mb-3">Como funciona</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { num: '1', text: 'Antes da sessão, preencha sua percepção inicial em cada bloco abaixo' },
            { num: '2', text: 'Na sessão com o mentor, vocês analisam juntos o que você escreveu' },
            { num: '3', text: 'O mentor enriquece com a visão profissional e o bloco fica construído' },
          ].map(step => (
            <div key={step.num} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#7B2FBE] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] font-semibold text-white">{step.num}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progresso */}
      <div
        className="rounded-xl border border-gray-100 bg-white shadow-sm p-5"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-semibold text-gray-800">Seu Perfil de Autoridade</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {comReflexao} de {total} reflexões preenchidas
              {construidos > 0 && ` · ${construidos} construído${construidos > 1 ? 's' : ''} com mentor`}
            </p>
          </div>
          <span className="text-xl font-bold text-[#7B2FBE]">{pct}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #7B2FBE, #a855f7)' }}
          />
        </div>
        {comReflexao === 0 && (
          <p className="text-xs text-gray-400 mt-3 text-center">
            Comece preenchendo sua percepção inicial em cada bloco. Leva menos de 10 minutos.
          </p>
        )}
      </div>

      {/* Zona de Genialidade — aparece a partir de 2 blocos preenchidos */}
      <ZonaDeGenialidade pilares={pilares} diferenciais={diferenciais} />

      {/* Cartão de Identidade de Marca */}
      <div
        className={cn(
          'rounded-xl border p-5 transition-all',
          comReflexao === total
            ? 'border-[#7B2FBE]/30 bg-[#7B2FBE]/[0.03]'
            : 'border-gray-200 bg-white shadow-sm'
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-medium text-[#7B2FBE] uppercase tracking-wide">
              Cartão de Identidade de Marca
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Monta automaticamente conforme você preenche os blocos abaixo
            </p>
          </div>
          {comReflexao === total && (
            <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
              <CheckCircle2 size={11} />
              Pronto para a sessão
            </span>
          )}
        </div>

        <div className="rounded-xl border border-[#7B2FBE]/20 overflow-hidden">
          <div className="bg-[#7B2FBE] px-5 py-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-white/60 uppercase tracking-wide">Arquitetura de Relevância</p>
              <p className="text-sm font-semibold text-white mt-0.5">{user?.full_name ?? 'Seu Nome'}</p>
            </div>
            <Download size={14} className="text-white/40" />
          </div>

          <div className="divide-y divide-gray-100">
            {PILARES.map((pilar) => {
              const texto = pilares[pilar.id].reflexao.trim()
              return (
                <div key={pilar.id} className="px-5 py-3.5 flex items-start gap-3">
                  <span className="text-[10px] font-medium text-[#7B2FBE] mt-0.5 w-5 flex-shrink-0">{pilar.num}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">{pilar.label}</p>
                    {texto ? (
                      <p className="text-sm text-gray-800 leading-relaxed">{texto}</p>
                    ) : (
                      <p className="text-sm text-gray-300 italic">Aguardando sua percepção...</p>
                    )}
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    {texto
                      ? <CheckCircle2 size={14} className="text-[#7B2FBE]" />
                      : <Circle size={14} className="text-gray-200" />
                    }
                  </div>
                </div>
              )
            })}

            <div className="px-5 py-3.5 flex items-start gap-3">
              <span className="text-[10px] font-medium text-[#7B2FBE] mt-0.5 w-5 flex-shrink-0">05</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">Diferenciais</p>
                {diferenciais.some(d => d.trim()) ? (
                  <div className="space-y-1">
                    {diferenciais.filter(d => d.trim()).map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#7B2FBE] flex-shrink-0" />
                        <p className="text-sm text-gray-800">{d}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-300 italic">Aguardando seus diferenciais...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {comReflexao === total && (
          <p className="text-xs text-center text-[#7B2FBE] font-medium mt-3">
            Leve este cartão para a sessão com seu mentor. Ele será o ponto de partida da construção.
          </p>
        )}
      </div>

      {/* Os 4 Pilares */}
      <div>
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
          Os 4 Pilares da Sua Marca
        </h2>
        <div
          className="space-y-4"
        >
          {PILARES.map((pilar) => {
            const state   = pilares[pilar.id]
            const sConfig = statusConfig[state.status]
            const temTexto = state.reflexao.trim().length > 40
            const caminhos = PILAR_CAMINHOS[pilar.id]

            return (
              <div
                key={pilar.id}
                className="rounded-xl border border-gray-100 bg-white shadow-sm p-6"
              >
                {/* Cabeçalho */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#7B2FBE]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[11px] font-semibold text-[#7B2FBE]">{pilar.num}</span>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900 mb-0.5">{pilar.label}</p>
                      <p className="text-xs text-gray-400 leading-relaxed">{pilar.desc}</p>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 mt-1"
                    style={{ color: sConfig.color, background: sConfig.bg }}
                  >
                    {sConfig.label}
                  </span>
                </div>

                {/* Reflexão */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <PenLine size={13} className="text-gray-400" />
                    <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Sua percepção inicial</p>
                  </div>
                  <p className="text-xs text-gray-500 italic pl-0.5">{pilar.pergunta}</p>
                  <textarea
                    value={state.reflexao}
                    onChange={e => updateReflexao(pilar.id, e.target.value)}
                    placeholder={pilar.placeholder}
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 resize-none"
                  />
                  {!state.reflexao.trim() && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2.5 leading-relaxed">
                      {pilar.dica}
                    </p>
                  )}

                  {/* Caminhos sugeridos — aparecem quando há texto suficiente */}
                  {temTexto && (
                    <div className="rounded-xl border border-[#7B2FBE]/15 bg-[#7B2FBE]/[0.03] p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles size={12} className="text-[#7B2FBE]" />
                        <p className="text-[10px] font-medium text-[#7B2FBE] uppercase tracking-wide">Caminhos que emergem desta reflexão</p>
                      </div>
                      {caminhos.map((c, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#7B2FBE]/50 flex-shrink-0 mt-1.5" />
                          <div>
                            <p className="text-[11px] font-semibold text-gray-700 mb-0.5">{c.titulo}</p>
                            <p className="text-xs text-gray-500 leading-relaxed">{c.texto}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Construção com o mentor */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                  {state.analiseLocked ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare size={13} className="text-gray-400" />
                        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Construção com o mentor</p>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed pl-0.5">{pilar.mentorFoco}</p>
                      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2.5">
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-3">O que será trabalhado na sessão</p>
                        {pilar.mentorItens.map((item, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#7B2FBE]/40 flex-shrink-0 mt-1.5" />
                            <p className="text-xs text-gray-500 leading-relaxed">{item}</p>
                          </div>
                        ))}
                        <div className="flex items-center gap-2 pt-1 mt-1 border-t border-gray-200">
                          <Lock size={11} className="text-gray-300 flex-shrink-0" />
                          <p className="text-[11px] text-gray-400 italic">
                            O resultado da análise ficará registrado aqui após a sessão
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare size={13} className="text-[#7B2FBE]" />
                        <p className="text-[11px] font-medium text-[#7B2FBE] uppercase tracking-wide">Construção com o mentor</p>
                      </div>
                      <div className="rounded-xl bg-[#7B2FBE]/[0.04] border border-[#7B2FBE]/20 px-4 py-3.5">
                        <p className="text-sm text-gray-700 leading-relaxed">{state.analise}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bloco 00: Seu Maior Diferencial */}
      <div
        className={cn(
          'rounded-xl border p-6 transition-all',
          genLocked ? 'bg-gray-50 border-gray-100' : 'bg-[#7B2FBE]/[0.04] border-[#7B2FBE]/20'
        )}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
            genLocked ? 'bg-gray-200' : 'bg-[#7B2FBE]/10'
          )}>
            {genLocked
              ? <Lock size={15} className="text-gray-400" />
              : <Sparkles size={15} className="text-[#7B2FBE]" />
            }
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-medium text-[#7B2FBE]">00</span>
              <p className={cn('text-base font-semibold', genLocked ? 'text-gray-400' : 'text-gray-900')}>
                Seu Maior Diferencial
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Síntese construída pelo mentor após mapear os 4 pilares da sua marca
            </p>
          </div>
        </div>

        <div className="ml-11">
          {genLocked ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">
                Após analisar os 4 pilares da sua identidade, seu mentor vai sintetizar em uma declaração o que te torna único no mercado. Esse é o coração da sua Arquitetura de Relevância: uma afirmação precisa, autêntica e posicionada, que você vai usar em tudo que construir.
              </p>
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-gray-200">
                <Lock size={12} className="text-gray-300 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-400 leading-relaxed">
                  Revelado pelo seu mentor ao final das sessões de posicionamento, quando os 4 pilares estiverem construídos juntos.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#7B2FBE]/20 px-4 py-3.5">
              <p className="text-sm text-gray-800 leading-relaxed italic">"{genText}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Esta construção alimenta */}
      <div
        className="rounded-xl border border-gray-100 bg-white shadow-sm p-5"
      >
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-4">Esta construção alimenta</p>
        <div className="grid sm:grid-cols-3 gap-3">

          <Link to="/dashboard/membro/pilares">
            <div className="group rounded-xl border border-gray-100 bg-gray-50 hover:border-[#7B2FBE]/20 hover:bg-[#7B2FBE]/[0.03] p-4 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-[#7B2FBE]">02</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#7B2FBE] transition-colors" />
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-tight mb-1.5">Pilares da Marca</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Seu público e sua proposta definem as frentes estratégicas de presença que o mentor vai construir com você.
              </p>
            </div>
          </Link>

          <Link to="/dashboard/membro/okr">
            <div className="group rounded-xl border border-gray-100 bg-gray-50 hover:border-[#7B2FBE]/20 hover:bg-[#7B2FBE]/[0.03] p-4 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-[#7B2FBE]">03</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#7B2FBE] transition-colors" />
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-tight mb-1.5">OKRs & Metas</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Sua proposta de valor e seu público-alvo são a base para definir metas mensuráveis com seu mentor.
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
                Sua história, seu diferencial e seu formato de produto guiam os temas, canais e frequência do calendário.
              </p>
            </div>
          </Link>

        </div>
      </div>

      {/* O Que Te Destaca da Concorrência */}
      <div
        className="rounded-xl bg-white border border-gray-100 shadow-sm p-6"
      >
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-medium text-[#7B2FBE]">05</span>
            <p className="text-sm font-semibold text-gray-900">O Que Te Destaca da Concorrência</p>
          </div>
          <p className="text-xs text-gray-500">
            Liste os diferenciais que você já percebe em você. O mentor vai refinar e validar cada um na sessão.
          </p>
        </div>
        <div className="space-y-2.5">
          {diferenciais.map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                d.trim() ? 'bg-[#7B2FBE]' : 'border-2 border-gray-200'
              )}>
                {d.trim() && <span className="text-[10px] text-white font-medium">✓</span>}
              </div>
              <input
                type="text"
                value={d}
                onChange={e => {
                  const next = [...diferenciais]
                  next[i] = e.target.value
                  setDiferenciais(next)
                }}
                placeholder={`Diferencial ${i + 1}. Ex: único a combinar X com Y para Z`}
                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-1 focus:ring-[#7B2FBE]/20"
              />
            </div>
          ))}
        </div>

        {diferenciais.some(d => d.trim()) && (
          <div className="mt-4 rounded-xl border border-[#7B2FBE]/15 bg-[#7B2FBE]/[0.03] p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={11} className="text-[#7B2FBE]" />
              <p className="text-[10px] font-medium text-[#7B2FBE] uppercase tracking-wide">Próximo passo</p>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              O mentor vai validar se esses diferenciais são percebidos pelo mercado, refiná-los com evidências concretas e integrá-los à sua declaração de Zona de Genialidade.
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
