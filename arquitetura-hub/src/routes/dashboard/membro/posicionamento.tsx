import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Lock, ChevronRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { IDENTIDADE_KEY } from '@/lib/identidade'

export const Route = createFileRoute('/dashboard/membro/posicionamento')({
  component: PosicionamentoPage,
})

// ─── Design tokens ────────────────────────────────────────────────
const D = {
  bg:        '#FAFAF9',
  surface:   '#F5F4F2',
  border:    'rgba(26,25,22,0.07)',
  text:      '#1A1916',
  textMid:   '#3A3530',
  textSub:   '#6B6560',
  textMuted: '#8A8680',
  textFaint: '#C5C0BA',
  gold:      '#C5A880',
  serif:     "'Cormorant Garamond', Georgia, serif",
} as const

// ─── Types ────────────────────────────────────────────────────────
type PilarStatus = 'aguardando' | 'reflexao_feita' | 'construido'
type PilarField  = 'publicoAlvo' | 'proposta' | 'storytelling' | 'formatoProduto'

interface PilarData {
  reflexao:      string
  analise:       string
  analiseLocked: boolean
  status:        PilarStatus
}

type PilarStates = Record<PilarField, PilarData>

// ─── Micro components ─────────────────────────────────────────────
function HR() {
  return (
    <hr style={{
      border: 'none',
      borderTop: `1px solid ${D.border}`,
      margin: 0,
    }} />
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: D.textMuted,
      margin: 0,
    }}>
      {children}
    </p>
  )
}

// ─── Data ─────────────────────────────────────────────────────────
const PILARES: {
  id:          PilarField
  num:         string
  label:       string
  desc:        string
  pergunta:    string
  placeholder: string
  dica:        string
  mentorFoco:  string
  mentorItens: string[]
}[] = [
  {
    id:          'publicoAlvo',
    num:         '01',
    label:       'Para Quem Você Fala',
    desc:        'A pessoa exata que mais se transforma com o seu trabalho',
    pergunta:    'Na sua percepção, quem é a pessoa ideal para o que você faz?',
    placeholder: 'Ex: Profissionais liberais entre 35 e 50 anos que têm expertise consolidada mas ainda trocam horas por dinheiro e querem criar um produto de alto valor...',
    dica:        'Pense em alguém real que você já ajudou. Qual era a situação dela antes? O que mudou depois do seu trabalho com ela?',
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
    mentorFoco:  'Seu mentor vai alinhar o formato do seu produto com o que o seu público está disposto a comprar e com o que faz sentido para o seu modelo de negócio.',
    mentorItens: [
      'Validar se o formato escolhido é o que o seu cliente ideal prefere e pode pagar',
      'Ajustar a precificação com base no valor percebido e no posicionamento definido',
      'Definir o canal de aquisição mais eficiente para esse produto e esse público',
      'Estruturar a oferta de forma que ela seja simples de entender e fácil de vender',
    ],
  },
]

const PILAR_CAMINHOS: Record<PilarField, { titulo: string; texto: string }[]> = {
  publicoAlvo: [
    { titulo: 'Especificidade gera atração', texto: 'Quanto mais preciso o perfil, mais magnético o posicionamento. O mentor vai aprofundar até o nível de consciência e dor que esse público carrega hoje.' },
    { titulo: 'Nomeie a dor melhor que eles', texto: 'O maior diferencial de um posicionamento forte é descrever a dor do cliente melhor do que ele mesmo consegue. Quando ele lê sua comunicação e pensa "é exatamente sobre mim", o posicionamento está funcionando.' },
    { titulo: 'Base de tudo que vem depois', texto: 'Produto, preço, canal, história: tudo será calibrado para esse público. Quanto mais claro ele for agora, mais coerente e poderoso será tudo que você construir.' },
  ],
  proposta: [
    { titulo: 'O cliente compra o destino', texto: 'Seu cliente compra a transformação, não o processo. Traduzir o que você faz em resultado concreto e mensurável é o núcleo da sua proposta.' },
    { titulo: 'Prazo define a promessa', texto: '"Em 90 dias" converte mais do que "ao longo da jornada". O mentor vai ajudar a encontrar o prazo real que você consegue garantir e que o cliente considera crível.' },
    { titulo: 'O núcleo da sua Zona de Genialidade', texto: 'O que existe de genuinamente único no seu jeito de trabalhar? Esse é o diferenciador que vai sustentar sua autoridade no longo prazo.' },
  ],
  storytelling: [
    { titulo: 'Antes, virada e depois', texto: 'A estrutura que mais conecta: onde você estava (dor ou limitação), o que mudou (momento de virada) e onde chegou (estado atual que prova que a transformação é real).' },
    { titulo: 'Reconhecimento cria conexão', texto: 'Quando seu público lê sua história e pensa "eu já me senti assim", a conexão acontece instantaneamente. A especificidade do seu "antes" é o que gera identificação.' },
    { titulo: 'Sua maior prova de autoridade', texto: 'Sua história mostra que você viveu o que ensina. É a prova social mais autêntica que existe.' },
  ],
  formatoProduto: [
    { titulo: 'Formato comunica posicionamento', texto: 'Mentoria individual comunica exclusividade e alto valor. Grupo comunica comunidade. Curso comunica escala. A escolha precisa estar alinhada com quem você quer atrair.' },
    { titulo: 'Preço é uma declaração', texto: 'O valor que você pratica comunica onde você está no mercado. Um preço alinhado com a transformação entregue é diferente de um preço competitivo.' },
    { titulo: 'Canal onde seu público já confia', texto: 'O melhor canal de aquisição é onde seu público ideal já está e já tem o hábito de buscar referências.' },
  ],
}

const statusConfig: Record<PilarStatus, { label: string; color: string }> = {
  aguardando:     { label: 'Aguardando',    color: D.textFaint },
  reflexao_feita: { label: 'Reflexão feita', color: D.gold     },
  construido:     { label: 'Construído',    color: '#6BA36B'   },
}

const initialPilarStates: PilarStates = {
  publicoAlvo:    { reflexao: '', analise: '', analiseLocked: true, status: 'aguardando' },
  proposta:       { reflexao: '', analise: '', analiseLocked: true, status: 'aguardando' },
  storytelling:   { reflexao: '', analise: '', analiseLocked: true, status: 'aguardando' },
  formatoProduto: { reflexao: '', analise: '', analiseLocked: true, status: 'aguardando' },
}

// ─── Storage ──────────────────────────────────────────────────────
function identidadeStorageKey(): string {
  try {
    const u = JSON.parse(localStorage.getItem('mock_user') ?? 'null')
    if (u?.id && u.id !== 'member-3') return `${IDENTIDADE_KEY}_${u.id}`
  } catch {}
  return IDENTIDADE_KEY
}

const IDENTIDADE_SEEDS: Record<string, { pilares: PilarStates; diferenciais: string[] }> = {
  'member-4': {
    pilares: {
      publicoAlvo: {
        reflexao: 'Sucessores de empresas familiares que estão numa queda de braço invisível com a geração anterior. Gestores que têm competência técnica, mas estão perdidos emocionalmente dentro do próprio negócio. Líderes que tentaram fugir do problema em vez de enfrentá-lo e estão pagando o preço disso.\n\nEm uma frase: sucessores e líderes de empresas familiares que sabem que o problema não é só de gestão, mas ainda não tiveram coragem de sentar e resolver o que está destruindo valor dentro de casa.\n\nMaiores dores: sentir que está brigando sozinho numa empresa que deveria ser aliada. Ter resultado melhorando mas relação com a família piorando.',
        analise: '', analiseLocked: true, status: 'reflexao_feita',
      },
      proposta: {
        reflexao: 'Uma empresa familiar que para de gastar energia com conflito interno e passa a direcionar tudo isso para resultado. EBITDA +45%, lucro líquido +38%, margem que saiu de -3% para +17%.\n\nEle entrega o método completo, não só a parte bonita: finanças, governança, comercial, marca e as áreas que não existiam, incluindo a conversa que ninguém quer ter.',
        analise: '', analiseLocked: true, status: 'reflexao_feita',
      },
      storytelling: {
        reflexao: 'Segunda-feira de manhã, dentro de um carro, depois do retiro católico. Três fracassos como empreendedor solo, perda de todas as reservas, síndrome do impostor instalada. Chegou na empresa, entrou na sala dos pais, pediu desculpa e perdoou. Ali destravou tudo.\n\nComo isso o capacitou: ele não é consultor de fora que estudou empresa familiar. Ele é o sucessor que tentou fugir três vezes, perdeu tudo, pediu desculpa ao pai e à mãe, e depois transformou a empresa no maior resultado da história.',
        analise: '', analiseLocked: true, status: 'reflexao_feita',
      },
      formatoProduto: {
        reflexao: 'Palestra presencial de 40 minutos com estrutura narrativa (história real) + sistema aberto (3 palavras-chave + 5 frentes de gestão) + tarefa para executar na semana.\n\nPosicionamento premium para plateia de executivos e líderes de empresas familiares em eventos corporativos.',
        analise: '', analiseLocked: true, status: 'reflexao_feita',
      },
    },
    diferenciais: [
      'Ele é o protagonista da história, não o narrador. Rodrigo Cunha não estudou empresa familiar, ele é a empresa familiar.',
      'Resultado numérico comprovado (margem de -3% pra +17%, EBITDA +45%) combinado com história de reconciliação familiar.',
      'Evidências concretas: números da empresa, cronologia da virada (2017-2024), sucessão formalizada em 2024.',
    ],
  },
}

function loadSaved(): { pilares: PilarStates; diferenciais: string[] } | null {
  try {
    const key = identidadeStorageKey()
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
    const u    = JSON.parse(localStorage.getItem('mock_user') ?? 'null')
    const seed = u?.id ? IDENTIDADE_SEEDS[u.id] : null
    if (seed) {
      localStorage.setItem(key, JSON.stringify(seed))
      return seed
    }
    return null
  } catch {
    return null
  }
}

// ─── Zona de Genialidade — editorial ─────────────────────────────
function ZonaDeGenialidade({ pilares, diferenciais }: { pilares: PilarStates; diferenciais: string[] }) {
  const publico  = pilares.publicoAlvo.reflexao.trim()
  const proposta = pilares.proposta.reflexao.trim()
  const historia = pilares.storytelling.reflexao.trim()
  const formato  = pilares.formatoProduto.reflexao.trim()
  const difs     = diferenciais.filter(d => d.trim())
  const filled   = [publico, proposta, historia, formato].filter(Boolean).length

  if (filled < 2) return null

  const short = (text: string, max = 160) =>
    text.length > max ? text.slice(0, max).trimEnd() + '…' : text

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <HR />
      <div style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Label + title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <SectionLabel>Zona de Genialidade em formação · {filled}/4 blocos</SectionLabel>
          <h2 style={{
            fontFamily: D.serif,
            fontSize: 'clamp(26px, 3vw, 36px)',
            fontWeight: 400,
            color: D.text,
            margin: 0,
            lineHeight: 1.15,
            fontStyle: 'italic',
          }}>
            {proposta ? short(proposta, 90) : 'Sua proposta ainda não foi definida.'}
          </h2>
        </div>

        {/* Editorial rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {proposta && (
            <>
              <HR />
              <div style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr',
                gap: 24,
                padding: '16px 0',
              }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: D.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, paddingTop: 2 }}>
                  Você gera
                </p>
                <p style={{ fontSize: 14, color: D.textMid, margin: 0, lineHeight: 1.6 }}>
                  {short(proposta)}
                </p>
              </div>
            </>
          )}

          {publico && (
            <>
              <HR />
              <div style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr',
                gap: 24,
                padding: '16px 0',
              }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: D.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, paddingTop: 2 }}>
                  Para quem
                </p>
                <p style={{ fontSize: 14, color: D.textMid, margin: 0, lineHeight: 1.6 }}>
                  {short(publico)}
                </p>
              </div>
            </>
          )}

          {difs.length > 0 && (
            <>
              <HR />
              <div style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr',
                gap: 24,
                padding: '16px 0',
              }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: D.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, paddingTop: 2 }}>
                  Seu diferencial
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {difs.map((d, i) => (
                    <p key={i} style={{ fontSize: 14, color: D.textMid, margin: 0, lineHeight: 1.6 }}>
                      {d}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}

          {historia && (
            <>
              <HR />
              <div style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr',
                gap: 24,
                padding: '16px 0',
              }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: D.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, paddingTop: 2 }}>
                  O que te capacita
                </p>
                <p style={{ fontSize: 14, color: D.textMid, margin: 0, lineHeight: 1.6 }}>
                  {short(historia)}
                </p>
              </div>
            </>
          )}

          {formato && (
            <>
              <HR />
              <div style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr',
                gap: 24,
                padding: '16px 0',
              }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: D.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, paddingTop: 2 }}>
                  Como você chega
                </p>
                <p style={{ fontSize: 14, color: D.textMid, margin: 0, lineHeight: 1.6 }}>
                  {short(formato)}
                </p>
              </div>
            </>
          )}
        </div>

        {filled < 4 && (
          <p style={{ fontSize: 13, color: D.textFaint, margin: 0 }}>
            Complete os {4 - filled} bloco{4 - filled > 1 ? 's' : ''} restante{4 - filled > 1 ? 's' : ''} para revelar sua Zona de Genialidade completa.
          </p>
        )}
      </div>
      <HR />
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────
function PosicionamentoPage() {
  const { user }                        = useAuth()
  const saved                           = useState(() => loadSaved())[0]
  const [pilares, setPilares]           = useState<PilarStates>(saved?.pilares ?? initialPilarStates)
  const [diferenciais, setDiferenciais] = useState<string[]>(saved?.diferenciais ?? ['', '', ''])
  const toastedFields                   = useState(() => new Set<PilarField>())[0]

  useEffect(() => {
    try {
      localStorage.setItem(identidadeStorageKey(), JSON.stringify({ pilares, diferenciais }))
    } catch {}
  }, [pilares, diferenciais])

  const pilarLabels: Record<PilarField, string> = {
    publicoAlvo:    'Para Quem Você Fala',
    proposta:       'O Que Você Entrega de Diferente',
    storytelling:   'Sua História que Conecta',
    formatoProduto: 'Como Você Chega ao Mercado',
  }

  function updateReflexao(field: PilarField, value: string) {
    const wasEmpty    = !pilares[field].reflexao.trim()
    const isNowFilled = value.trim().length > 0

    if (wasEmpty && isNowFilled && !toastedFields.has(field)) {
      toastedFields.add(field)
      toast.success(`Reflexão iniciada: ${pilarLabels[field]}`, {
        description: 'Ótimo! Leve isso para a sessão com seu mentor.',
      })
    }

    setPilares(prev => {
      const current   = prev[field]
      const newStatus: PilarStatus = current.analise
        ? 'construido'
        : value.trim() ? 'reflexao_feita' : 'aguardando'
      return { ...prev, [field]: { ...current, reflexao: value, status: newStatus } }
    })
  }

  const comReflexao = Object.values(pilares).filter(p => p.reflexao.trim()).length
  const total       = PILARES.length
  const pct         = Math.round((comReflexao / total) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 780, padding: '48px 0 80px' }}>

      {/* ── Heading ── */}
      <div style={{ paddingBottom: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h1 style={{
          fontFamily: D.serif,
          fontSize: 'clamp(36px, 4.5vw, 52px)',
          fontWeight: 400,
          color: D.text,
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
        }}>
          Minha Identidade de Marca
        </h1>
        <p style={{ fontSize: 15, color: D.textSub, margin: 0, lineHeight: 1.6, maxWidth: 520 }}>
          Preencha sua percepção inicial em cada bloco. Na sessão com seu mentor, vocês analisam juntos e constroem seu perfil de autoridade.
        </p>

        {/* Inline progress — no card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 12, color: D.textMuted, margin: 0 }}>
              {comReflexao} de {total} reflexões preenchidas
            </p>
            <p style={{
              fontFamily: D.serif,
              fontSize: 18,
              color: pct === 100 ? '#6BA36B' : D.gold,
              margin: 0,
            }}>
              {pct}%
            </p>
          </div>
          <div style={{ width: '100%', height: 3, background: `rgba(26,25,22,0.06)`, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              width: `${pct}%`,
              height: '100%',
              background: pct === 100 ? '#6BA36B' : D.gold,
              borderRadius: 2,
              transition: 'width 600ms ease',
            }} />
          </div>
          {/* Como funciona — inline, no card */}
          <div style={{ display: 'flex', gap: 24, marginTop: 4 }}>
            {[
              'Preencha sua percepção inicial antes da sessão',
              'Na sessão, o mentor analisa o que você escreveu',
              'O bloco fica construído com a visão profissional',
            ].map((step, i) => (
              <p key={i} style={{ fontSize: 11, color: D.textFaint, margin: 0, lineHeight: 1.5 }}>
                <span style={{ color: D.gold, fontWeight: 600, marginRight: 4 }}>{i + 1}</span>
                {step}
              </p>
            ))}
          </div>
        </div>
      </div>

      <HR />

      {/* ── Zona de Genialidade — aparece com 2+ blocos ── */}
      <ZonaDeGenialidade pilares={pilares} diferenciais={diferenciais} />

      {/* ── Os 4 Pilares — sem card wrappers ── */}
      <div style={{ paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 0 }}>
        <SectionLabel>Os 4 Pilares da Sua Marca</SectionLabel>

        {PILARES.map((pilar, idx) => {
          const state    = pilares[pilar.id]
          const sConfig  = statusConfig[state.status]
          const temTexto = state.reflexao.trim().length > 40
          const caminhos = PILAR_CAMINHOS[pilar.id]

          return (
            <div key={pilar.id}>
              <div style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Pilar heading */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{
                    fontFamily: D.serif,
                    fontSize: 13,
                    color: D.gold,
                    fontStyle: 'italic',
                    flexShrink: 0,
                  }}>
                    {pilar.num}
                  </span>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                    <h2 style={{
                      fontFamily: D.serif,
                      fontSize: 'clamp(20px, 2.5vw, 26px)',
                      fontWeight: 400,
                      color: D.text,
                      margin: 0,
                      lineHeight: 1.2,
                    }}>
                      {pilar.label}
                    </h2>
                    <span style={{ fontSize: 11, color: sConfig.color, flexShrink: 0 }}>
                      {sConfig.label}
                    </span>
                  </div>
                </div>

                {/* Description + question */}
                <p style={{ fontSize: 13, color: D.textSub, margin: 0, lineHeight: 1.6, maxWidth: 560 }}>
                  {pilar.desc}
                </p>
                <p style={{ fontSize: 13, color: D.textMuted, margin: 0, fontStyle: 'italic' }}>
                  {pilar.pergunta}
                </p>

                {/* Textarea — minimal, no card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <textarea
                    value={state.reflexao}
                    onChange={e => updateReflexao(pilar.id, e.target.value)}
                    placeholder={pilar.placeholder}
                    rows={4}
                    style={{
                      width: '100%',
                      background: '#F5F4F2',
                      border: `1px solid ${D.border}`,
                      borderRadius: 6,
                      padding: '12px 14px',
                      fontSize: 14,
                      color: D.text,
                      lineHeight: 1.6,
                      resize: 'vertical',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = D.gold
                      e.currentTarget.style.boxShadow  = `0 0 0 3px rgba(197,168,128,0.12)`
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = D.border
                      e.currentTarget.style.boxShadow   = 'none'
                    }}
                  />
                  {!state.reflexao.trim() && (
                    <p style={{ fontSize: 12, color: D.textMuted, margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
                      💡 {pilar.dica}
                    </p>
                  )}
                </div>

                {/* Caminhos que emergem — sem card, só texto muted */}
                {temTexto && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: D.textFaint, margin: 0 }}>
                      Caminhos que emergem desta reflexão
                    </p>
                    {caminhos.map((c, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: D.textMuted, margin: 0, paddingTop: 1 }}>
                          {c.titulo}
                        </p>
                        <p style={{ fontSize: 13, color: D.textSub, margin: 0, lineHeight: 1.6 }}>
                          {c.texto}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Construção com o mentor — muted text, no card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: D.textFaint, margin: 0 }}>
                    Construção com o mentor
                  </p>
                  {state.analiseLocked ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <p style={{ fontSize: 13, color: D.textSub, margin: 0, lineHeight: 1.6 }}>
                        {pilar.mentorFoco}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                        {pilar.mentorItens.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: D.textFaint, flexShrink: 0, marginTop: 7 }} />
                            <p style={{ fontSize: 12, color: D.textMuted, margin: 0, lineHeight: 1.6 }}>{item}</p>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                        <Lock size={10} style={{ color: D.textFaint, flexShrink: 0 }} />
                        <p style={{ fontSize: 11, color: D.textFaint, margin: 0, fontStyle: 'italic' }}>
                          O resultado da análise ficará registrado aqui após a sessão
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: 14, color: D.textMid, margin: 0, lineHeight: 1.7 }}>
                      {state.analise}
                    </p>
                  )}
                </div>

              </div>
              {idx < PILARES.length - 1 && <HR />}
            </div>
          )
        })}
      </div>

      <HR />

      {/* ── Diferenciais — sem card ── */}
      <div style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: D.serif, fontSize: 13, color: D.gold, fontStyle: 'italic' }}>05</span>
          <h2 style={{
            fontFamily: D.serif,
            fontSize: 'clamp(20px, 2.5vw, 26px)',
            fontWeight: 400,
            color: D.text,
            margin: 0,
          }}>
            O Que Te Destaca da Concorrência
          </h2>
        </div>
        <p style={{ fontSize: 13, color: D.textSub, margin: 0, lineHeight: 1.6 }}>
          Liste os diferenciais que você já percebe em você. O mentor vai refinar e validar cada um na sessão.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {diferenciais.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: d.trim() ? D.gold : D.textFaint,
                flexShrink: 0,
                transition: 'background 300ms',
              }} />
              <input
                type="text"
                value={d}
                onChange={e => {
                  const next = [...diferenciais]
                  next[i]   = e.target.value
                  setDiferenciais(next)
                }}
                placeholder={`Diferencial ${i + 1}. Ex: único a combinar X com Y para Z`}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `1px solid ${D.border}`,
                  padding: '8px 0',
                  fontSize: 14,
                  color: D.text,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
                onFocus={e => { e.currentTarget.style.borderBottomColor = D.gold }}
                onBlur={e => { e.currentTarget.style.borderBottomColor = D.border }}
              />
            </div>
          ))}
        </div>
      </div>

      <HR />

      {/* ── Cartão de Identidade — compact, sem card wrapper decorativo ── */}
      <div style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <SectionLabel>Cartão de Identidade de Marca</SectionLabel>
            <p style={{ fontSize: 12, color: D.textMuted, margin: 0 }}>
              {user?.full_name ?? 'Seu Nome'} · Arquitetura de Relevância
            </p>
          </div>
          {comReflexao === total && (
            <span style={{ fontSize: 11, color: '#6BA36B', fontWeight: 500 }}>
              ✓ Pronto para a sessão
            </span>
          )}
        </div>

        <div style={{
          border: `1px solid ${D.border}`,
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          {PILARES.map((pilar, i) => {
            const texto = pilares[pilar.id].reflexao.trim()
            return (
              <div key={pilar.id} style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr',
                gap: 0,
                borderBottom: i < PILARES.length - 1 ? `1px solid ${D.border}` : 'none',
              }}>
                <div style={{
                  padding: '14px 16px',
                  borderRight: `1px solid ${D.border}`,
                  background: '#F5F4F2',
                }}>
                  <p style={{ fontSize: 11, color: D.textMuted, margin: 0 }}>
                    {pilar.label}
                  </p>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  {texto ? (
                    <p style={{ fontSize: 13, color: D.textMid, margin: 0, lineHeight: 1.6 }}>
                      {texto.length > 100 ? texto.slice(0, 100) + '…' : texto}
                    </p>
                  ) : (
                    <p style={{ fontSize: 13, color: D.textFaint, margin: 0, fontStyle: 'italic' }}>
                      Aguardando reflexão...
                    </p>
                  )}
                </div>
              </div>
            )
          })}

          {/* Diferenciais row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            gap: 0,
            borderTop: `1px solid ${D.border}`,
          }}>
            <div style={{ padding: '14px 16px', borderRight: `1px solid ${D.border}`, background: '#F5F4F2' }}>
              <p style={{ fontSize: 11, color: D.textMuted, margin: 0 }}>Diferenciais</p>
            </div>
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {diferenciais.some(d => d.trim()) ? (
                diferenciais.filter(d => d.trim()).map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: D.gold, flexShrink: 0, marginTop: 6 }} />
                    <p style={{ fontSize: 13, color: D.textMid, margin: 0, lineHeight: 1.5 }}>{d}</p>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 13, color: D.textFaint, margin: 0, fontStyle: 'italic' }}>
                  Aguardando diferenciais...
                </p>
              )}
            </div>
          </div>
        </div>

        {comReflexao === total && (
          <p style={{ fontSize: 12, color: D.textMuted, margin: 0 }}>
            Leve este cartão para a sessão com seu mentor. Ele será o ponto de partida da construção.
          </p>
        )}
      </div>

      <HR />

      {/* ── Esta construção alimenta — links simples ── */}
      <div style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SectionLabel>Esta construção alimenta</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { to: '/dashboard/membro/pilares',   num: '02', label: 'Pilares da Marca',    desc: 'Seu público e sua proposta definem as frentes estratégicas de presença.' },
            { to: '/dashboard/membro/okr',        num: '03', label: 'OKRs & Metas',        desc: 'Sua proposta de valor e seu público-alvo são a base para definir metas mensuráveis.' },
            { to: '/dashboard/membro/marketing', num: '04', label: 'Marketing Anual',     desc: 'Sua história, seu diferencial e formato de produto guiam os temas e canais.' },
          ].map((link, i) => (
            <div key={link.to}>
              {i > 0 && <HR />}
              <Link to={link.to} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 0',
                  cursor: 'pointer',
                  transition: 'opacity 200ms',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0.6' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1'   }}
                >
                  <span style={{ fontFamily: D.serif, fontSize: 13, color: D.gold, fontStyle: 'italic', width: 20, flexShrink: 0 }}>
                    {link.num}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: D.text, margin: 0 }}>{link.label}</p>
                    <p style={{ fontSize: 12, color: D.textMuted, margin: '2px 0 0', lineHeight: 1.5 }}>{link.desc}</p>
                  </div>
                  <ChevronRight size={14} style={{ color: D.textFaint, flexShrink: 0 }} />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
