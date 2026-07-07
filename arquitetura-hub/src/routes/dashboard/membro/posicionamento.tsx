import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Sparkles, PenLine, MessageSquare, Search, Lightbulb, Target, Layers } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/motion'
import { cn } from '@/lib/utils'

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

type PilarStates = Record<PilarField, PilarData>

const initialPilarStates: PilarStates = {
  publicoAlvo:    { reflexao: '', analise: '', analiseLocked: true, status: 'aguardando' },
  proposta:       { reflexao: '', analise: '', analiseLocked: true, status: 'aguardando' },
  storytelling:   { reflexao: '', analise: '', analiseLocked: true, status: 'aguardando' },
  formatoProduto: { reflexao: '', analise: '', analiseLocked: true, status: 'aguardando' },
}

function PosicionamentoPage() {
  const [pilares, setPilares]           = useState<PilarStates>(initialPilarStates)
  const [genLocked]                     = useState(true)
  const [genText]                       = useState('')
  const [diferenciais, setDiferenciais] = useState(['', '', ''])

  function updateReflexao(field: PilarField, value: string) {
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
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quem Você É no Mercado</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Preencha sua percepção inicial em cada bloco. Na sessão com seu mentor, vocês analisam juntos e constroem seu perfil de autoridade.
        </p>
      </div>

      {/* Como funciona */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl border border-[#7B2FBE]/15 bg-[#7B2FBE]/[0.03] p-5"
      >
        <p className="text-[10px] font-bold text-[#7B2FBE] uppercase tracking-widest mb-3">Como funciona</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { num: '1', text: 'Antes da sessão, preencha sua percepção inicial em cada bloco abaixo' },
            { num: '2', text: 'Na sessão com o mentor, vocês analisam juntos o que você escreveu' },
            { num: '3', text: 'O mentor enriquece com a visão profissional e o bloco fica construído' },
          ].map(step => (
            <div key={step.num} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#7B2FBE] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] font-black text-white">{step.num}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Progresso */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5"
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
      </motion.div>

      {/* Os 4 Pilares */}
      <div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
          Os 4 Pilares da Sua Marca
        </h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {PILARES.map((pilar) => {
            const state   = pilares[pilar.id]
            const sConfig = statusConfig[state.status]

            return (
              <motion.div
                key={pilar.id}
                variants={fadeInUp}
                className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6"
              >
                {/* Cabeçalho */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#7B2FBE]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[11px] font-black text-[#7B2FBE]">{pilar.num}</span>
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900 mb-0.5">{pilar.label}</p>
                      <p className="text-xs text-gray-400 leading-relaxed">{pilar.desc}</p>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 mt-1"
                    style={{ color: sConfig.color, background: sConfig.bg }}
                  >
                    {sConfig.label}
                  </span>
                </div>

                {/* Reflexão do mentorado */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <PenLine size={13} className="text-gray-400" />
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Sua percepção inicial</p>
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
                </div>

                {/* Análise construída com o mentor */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                  {state.analiseLocked ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare size={13} className="text-gray-400" />
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Construção com o mentor</p>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed pl-0.5">{pilar.mentorFoco}</p>
                      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2.5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">O que será trabalhado na sessão</p>
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
                        <p className="text-[11px] font-bold text-[#7B2FBE] uppercase tracking-wide">Construção com o mentor</p>
                      </div>
                      <div className="rounded-xl bg-[#7B2FBE]/[0.04] border border-[#7B2FBE]/20 px-4 py-3.5">
                        <p className="text-sm text-gray-700 leading-relaxed">{state.analise}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Bloco 00: Seu Maior Diferencial */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className={cn(
          'rounded-2xl border p-6 transition-all',
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
              <span className="text-[10px] font-black text-[#7B2FBE] tracking-widest">00</span>
              <p className={cn('text-base font-bold', genLocked ? 'text-gray-400' : 'text-gray-900')}>
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
      </motion.div>

      {/* O Que Te Destaca da Concorrência */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6"
      >
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-[#7B2FBE] tracking-widest">05</span>
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
                {d.trim() && <span className="text-[10px] text-white font-black">✓</span>}
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
      </motion.div>

    </div>
  )
}
