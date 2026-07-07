import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Edit3, Save, X } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/motion'

export const Route = createFileRoute('/dashboard/membro/posicionamento')({
  component: PosicionamentoPage,
})

/* ─────────────────────────────────────────────
   TIPOS
───────────────────────────────────────────── */
interface PosicionamentoData {
  zonaGenialidade: string
  publicoAlvo: string
  proposta: string
  diferenciais: string[]
  storytelling: string
  formatoProduto: string
}

/* ─────────────────────────────────────────────
   ZONA DE GENIALIDADE — dados do diagnóstico
   (Gay Hendricks, The Big Leap)
───────────────────────────────────────────── */
const ZONAS = [
  {
    id: 'incompetencia',
    num: '01',
    label: 'Zona de Incompetência',
    desc: 'O que outros fazem melhor que você. Atividades que drenam energia e geram resultados mediocres.',
    placeholder: 'Ex: Gestão financeira detalhada, design gráfico, programação...',
    cor: '#EF4444',
  },
  {
    id: 'competencia',
    num: '02',
    label: 'Zona de Competência',
    desc: 'O que você faz bem — mas outros também fazem. Não te diferencia no mercado.',
    placeholder: 'Ex: Criar apresentações, organizar processos, escrever relatórios...',
    cor: '#F59E0B',
  },
  {
    id: 'excelencia',
    num: '03',
    label: 'Zona de Excelência',
    desc: 'O que você faz excepcionalmente — mas não necessariamente ama. Pode ser uma armadilha.',
    placeholder: 'Ex: Gerenciar equipes, vender consultoria, estruturar treinamentos...',
    cor: '#3B82F6',
  },
  {
    id: 'genialidade',
    num: '04',
    label: 'Zona de Genialidade',
    desc: 'Onde talento + paixão + impacto convergem. O que só você faz do jeito que faz.',
    placeholder: 'Ex: Transformar conceitos complexos em narrativas simples que geram ação...',
    cor: '#7B2FBE',
  },
]

const CALIBRACAO = [
  {
    id: 'q1',
    pergunta: 'Quando você está na sua Zona de Genialidade, o tempo passa sem você perceber. Descreva a última vez que isso aconteceu.',
    placeholder: 'Ex: Quando estava mentorando um cliente e vi o momento exato em que algo clicou pra ele...',
  },
  {
    id: 'q2',
    pergunta: 'Qual problema você resolve que as pessoas ao seu redor simplesmente não conseguem resolver da mesma forma?',
    placeholder: 'Ex: Consigo ver o padrão que está travando uma pessoa mesmo quando ela não consegue articular o problema...',
  },
  {
    id: 'q3',
    pergunta: 'O que pessoas próximas costumam pedir que você ajude — mesmo sem você se apresentar como especialista nisso?',
    placeholder: 'Ex: Sempre me pedem para revisitar estratégias que parecem certas mas não estão funcionando...',
  },
]

const PILARES = [
  { id: 'publico',    num: '01', label: 'Público-Alvo',          desc: 'Para quem você resolve o problema com excelência',            field: 'publicoAlvo'    as keyof PosicionamentoData, placeholder: 'Ex: Profissionais liberais entre 35-55 anos que querem digitalizar seu conhecimento...' },
  { id: 'proposta',   num: '02', label: 'Proposta de Valor',      desc: 'O resultado transformador que você entrega',                   field: 'proposta'       as keyof PosicionamentoData, placeholder: 'Ex: Em 90 dias, produto digital estruturado e primeira venda realizada...' },
  { id: 'story',      num: '03', label: 'Story Telling',          desc: 'Sua história de transformação pessoal e profissional',         field: 'storytelling'   as keyof PosicionamentoData, placeholder: 'Ex: Comecei trocando horas por dinheiro até perceber que meu conhecimento valia muito mais...' },
  { id: 'produto',    num: '04', label: 'Formatação do Produto',  desc: 'Como seu produto/serviço é estruturado e precificado',         field: 'formatoProduto' as keyof PosicionamentoData, placeholder: 'Ex: Mentoria individual de 3 meses — 6 sessões de 1h + canal de WhatsApp + R$ 4.800...' },
]

/* ─────────────────────────────────────────────
   ESTADO INICIAL
───────────────────────────────────────────── */
const initialData: PosicionamentoData = {
  zonaGenialidade: '',
  publicoAlvo: '',
  proposta: '',
  diferenciais: ['', '', ''],
  storytelling: '',
  formatoProduto: '',
}

type DiagStep = 'idle' | 'zonas' | 'calibracao' | 'declaracao'

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────── */
function PosicionamentoPage() {
  const [data, setData]         = useState<PosicionamentoData>(initialData)
  const [editing, setEditing]   = useState<string | null>(null)
  const [saved, setSaved]       = useState(false)

  // Diagnóstico de Zona de Genialidade
  const [diagStep, setDiagStep] = useState<DiagStep>('idle')
  const [zonas, setZonas]       = useState<Record<string, string>>({ incompetencia:'', competencia:'', excelencia:'', genialidade:'' })
  const [calib, setCalib]       = useState<Record<string, string>>({ q1:'', q2:'', q3:'' })

  function handleSave() {
    setSaved(true)
    setEditing(null)
    setTimeout(() => setSaved(false), 2000)
  }

  function updateField(field: keyof PosicionamentoData, value: string) {
    setData(prev => ({ ...prev, [field]: value }))
  }

  function updateDiferencial(index: number, value: string) {
    setData(prev => {
      const d = [...prev.diferenciais]
      d[index] = value
      return { ...prev, diferenciais: d }
    })
  }

  function finalizarDiagnostico() {
    const decl = zonas.genialidade.trim()
      ? `${zonas.genialidade.trim()}${calib.q1.trim() ? ` — especialmente quando ${calib.q1.split(' ').slice(0,8).join(' ')}...` : ''}`
      : ''
    if (decl) updateField('zonaGenialidade', decl)
    setDiagStep('idle')
  }

  const filledCount = [data.zonaGenialidade, data.publicoAlvo, data.proposta, data.storytelling, data.formatoProduto, ...data.diferenciais].filter(v => v.trim().length > 0).length
  const completionPct = Math.round((filledCount / (5 + data.diferenciais.length)) * 100)

  /* ── DIAGNÓSTICO MODAL ─────────────────── */
  if (diagStep !== 'idle') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header do diagnóstico */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-[#7B2FBE] uppercase tracking-widest mb-0.5">
              {diagStep === 'zonas' ? 'Passo 1 de 3' : diagStep === 'calibracao' ? 'Passo 2 de 3' : 'Passo 3 de 3'}
            </p>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">
              {diagStep === 'zonas' ? 'Mapeando suas Zonas' : diagStep === 'calibracao' ? 'Calibração' : 'Sua Declaração'}
            </h2>
          </div>
          <button onClick={() => setDiagStep('idle')} className="text-gray-300 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 space-y-5">

          {/* ── PASSO 1: 4 zonas ─────────── */}
          {diagStep === 'zonas' && (
            <AnimatePresence>
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed">
                  Mapeie suas atividades em cada zona. Seja honesto — o objetivo é identificar onde você opera no modo genialidade.
                </p>
                {ZONAS.map((z) => (
                  <motion.div key={z.id} variants={fadeInUp} className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="text-[11px] font-black tracking-widest" style={{ color: z.cor }}>{z.num}</span>
                      <div>
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{z.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{z.desc}</p>
                      </div>
                    </div>
                    <textarea
                      value={zonas[z.id]}
                      onChange={e => setZonas(prev => ({ ...prev, [z.id]: e.target.value }))}
                      placeholder={z.placeholder}
                      rows={3}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 resize-none transition-all"
                      style={{ '--tw-ring-color': `${z.cor}30` } as React.CSSProperties}
                      onFocus={e => (e.target.style.borderColor = z.cor)}
                      onBlur={e => (e.target.style.borderColor = '')}
                    />
                  </motion.div>
                ))}
                <button
                  onClick={() => setDiagStep('calibracao')}
                  disabled={!zonas.genialidade.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-[#7B2FBE] hover:bg-[#6a27a5] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-xl transition-colors text-sm uppercase tracking-wide"
                >
                  Próximo — Calibração <ArrowRight size={15} />
                </button>
              </motion.div>
            </AnimatePresence>
          )}

          {/* ── PASSO 2: calibração ───────── */}
          {diagStep === 'calibracao' && (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
              <p className="text-sm text-gray-500 leading-relaxed">
                3 perguntas para refinar seu diagnóstico. Responda com exemplos reais — não com o que você acha que deveria responder.
              </p>
              {CALIBRACAO.map((q, i) => (
                <motion.div key={q.id} variants={fadeInUp} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <p className="text-xs font-black text-[#7B2FBE] uppercase tracking-widest mb-2">Pergunta {i + 1}</p>
                  <p className="text-sm font-semibold text-gray-900 leading-relaxed mb-3">{q.pergunta}</p>
                  <textarea
                    value={calib[q.id]}
                    onChange={e => setCalib(prev => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder={q.placeholder}
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 resize-none"
                  />
                </motion.div>
              ))}
              <div className="flex gap-3">
                <button
                  onClick={() => setDiagStep('zonas')}
                  className="flex items-center gap-1.5 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors"
                >
                  <ArrowLeft size={14} /> Voltar
                </button>
                <button
                  onClick={() => setDiagStep('declaracao')}
                  disabled={!calib.q1.trim() || !calib.q2.trim() || !calib.q3.trim()}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#7B2FBE] hover:bg-[#6a27a5] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-3 rounded-xl transition-colors text-sm uppercase tracking-wide"
                >
                  Gerar Declaração <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── PASSO 3: declaração ──────── */}
          {diagStep === 'declaracao' && (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-5">
              <motion.div variants={fadeInUp} className="bg-[#7B2FBE]/5 border border-[#7B2FBE]/20 rounded-2xl p-6">
                <p className="text-[10px] font-black text-[#7B2FBE] uppercase tracking-widest mb-3">Zona de Genialidade identificada</p>
                <p className="text-sm font-semibold text-gray-700 leading-relaxed mb-4">
                  Com base no seu mapeamento e nas suas respostas de calibração, sua Zona de Genialidade aponta para:
                </p>
                <div className="bg-white rounded-xl border border-[#7B2FBE]/20 p-4">
                  <p className="text-sm text-gray-900 leading-relaxed italic">"{zonas.genialidade}"</p>
                </div>
                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  Esta é sua declaração preliminar. Edite abaixo para refinar a linguagem antes de salvar.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Refinar declaração</p>
                <textarea
                  value={zonas.genialidade}
                  onChange={e => setZonas(prev => ({ ...prev, genialidade: e.target.value }))}
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 resize-none"
                />
              </motion.div>

              {/* síntese das zonas */}
              <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Seu mapa completo</p>
                <div className="space-y-3">
                  {ZONAS.map(z => zonas[z.id] ? (
                    <div key={z.id} className="flex items-start gap-3">
                      <span className="text-[10px] font-black tracking-widest mt-0.5 w-5 flex-shrink-0" style={{ color: z.cor }}>{z.num}</span>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{z.label}</p>
                        <p className="text-xs text-gray-700 leading-relaxed mt-0.5">{zonas[z.id]}</p>
                      </div>
                    </div>
                  ) : null)}
                </div>
              </motion.div>

              <div className="flex gap-3">
                <button
                  onClick={() => setDiagStep('calibracao')}
                  className="flex items-center gap-1.5 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors"
                >
                  <ArrowLeft size={14} /> Voltar
                </button>
                <button
                  onClick={finalizarDiagnostico}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#7B2FBE] hover:bg-[#6a27a5] text-white font-black py-3 rounded-xl transition-colors text-sm uppercase tracking-wide"
                >
                  <Check size={15} /> Salvar Declaração
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    )
  }

  /* ── VISTA PRINCIPAL ───────────────────── */
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Posicionamento & Autoridade</h1>
          <p className="text-gray-400 mt-1 text-sm">Defina sua Zona de Genialidade e posicionamento de mercado</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#7B2FBE] hover:bg-[#6a27a5] text-white text-sm font-black px-4 py-2.5 rounded-xl transition-colors uppercase tracking-wide"
        >
          <Save size={15} />
          {saved ? 'Salvo!' : 'Salvar'}
        </button>
      </div>

      {/* Progresso */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Perfil de Autoridade</p>
          <span className="text-sm font-black text-[#7B2FBE]">{completionPct}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%`, background: 'linear-gradient(90deg, #7B2FBE, #a855f7)' }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">Quanto mais completo, maior sua clareza de posicionamento</p>
      </motion.div>

      {/* ── ZONA DE GENIALIDADE (destaque) ── */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className={`rounded-2xl border p-5 transition-all ${
          data.zonaGenialidade
            ? 'bg-[#7B2FBE]/5 border-[#7B2FBE]/25'
            : 'bg-white border-gray-200 shadow-sm'
        }`}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[11px] font-black text-[#7B2FBE] tracking-widest">00</span>
              <p className="text-base font-black text-gray-900 uppercase tracking-tight">Zona de Genialidade</p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Onde talento + paixão + impacto convergem. Seu diferencial absoluto de mercado.
            </p>
          </div>
          {data.zonaGenialidade && (
            <button onClick={() => setEditing(editing === 'zona' ? null : 'zona')} className="text-gray-300 hover:text-gray-600 transition-colors flex-shrink-0">
              <Edit3 size={15} />
            </button>
          )}
        </div>

        {data.zonaGenialidade && editing !== 'zona' ? (
          <div className="bg-white rounded-xl border border-[#7B2FBE]/15 p-4 mb-4">
            <p className="text-sm text-gray-800 leading-relaxed italic">"{data.zonaGenialidade}"</p>
          </div>
        ) : editing === 'zona' ? (
          <textarea
            autoFocus
            value={data.zonaGenialidade}
            onChange={e => updateField('zonaGenialidade', e.target.value)}
            rows={3}
            className="w-full bg-white border border-[#7B2FBE]/30 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 resize-none mb-4"
          />
        ) : null}

        <button
          onClick={() => setDiagStep('zonas')}
          className={`flex items-center gap-2 text-sm font-black uppercase tracking-wide transition-colors ${
            data.zonaGenialidade
              ? 'text-[#7B2FBE] hover:text-[#6a27a5]'
              : 'w-full justify-center bg-[#7B2FBE] hover:bg-[#6a27a5] text-white py-3 rounded-xl'
          }`}
        >
          {data.zonaGenialidade ? (
            <><ArrowRight size={14} /> Refazer diagnóstico</>
          ) : (
            <><ArrowRight size={15} /> Iniciar diagnóstico guiado</>
          )}
        </button>
      </motion.div>

      {/* ── PILARES ──────────────────────── */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-4">
        {PILARES.map((p) => {
          const isEditing = editing === p.id
          const value = data[p.field] as string
          return (
            <motion.div
              key={p.id}
              variants={fadeInUp}
              className={`rounded-2xl border p-5 bg-white transition-all ${
                isEditing ? 'border-[#7B2FBE]/40 shadow-md shadow-[#7B2FBE]/5' : 'border-gray-200 shadow-sm hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-[11px] font-black text-[#7B2FBE] tracking-widest">{p.num}</span>
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{p.label}</p>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
                </div>
                <button onClick={() => setEditing(isEditing ? null : p.id)} className="text-gray-300 hover:text-gray-600 transition-colors flex-shrink-0">
                  <Edit3 size={14} />
                </button>
              </div>

              {isEditing ? (
                <textarea
                  autoFocus
                  value={value}
                  onChange={e => updateField(p.field, e.target.value)}
                  placeholder={p.placeholder}
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 resize-none"
                />
              ) : (
                <div
                  onClick={() => setEditing(p.id)}
                  className="min-h-[72px] cursor-text rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5"
                >
                  {value ? (
                    <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
                  ) : (
                    <p className="text-sm text-gray-300 italic flex items-center gap-1">
                      <Edit3 size={11} /> Clique para preencher...
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* ── DIFERENCIAIS ─────────────────── */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5"
      >
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-[11px] font-black text-[#7B2FBE] tracking-widest">05</span>
            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Diferenciais Competitivos</p>
          </div>
          <p className="text-xs text-gray-400">O que te distingue da concorrência — seja específico</p>
        </div>
        <div className="space-y-2">
          {data.diferenciais.map((d, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="text-[11px] font-black text-gray-300 w-4 flex-shrink-0 text-right">{i + 1}</span>
              <input
                type="text"
                value={d}
                onChange={e => updateDiferencial(i, e.target.value)}
                placeholder={`Diferencial ${i + 1}...`}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-1 focus:ring-[#7B2FBE]/20"
              />
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  )
}
