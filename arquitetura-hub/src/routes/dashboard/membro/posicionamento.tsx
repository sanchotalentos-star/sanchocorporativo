import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Star, Flame, Target, Edit3, Save, ArrowRight } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/motion'

export const Route = createFileRoute('/dashboard/membro/posicionamento')({
  component: PosicionamentoPage,
})

interface PosicionamentoData {
  zonaGenialidade: string
  publicoAlvo: string
  proposta: string
  diferenciais: string[]
  storytelling: string
  formatoProduto: string
}

const initialData: PosicionamentoData = {
  zonaGenialidade: '',
  publicoAlvo: '',
  proposta: '',
  diferenciais: ['', '', ''],
  storytelling: '',
  formatoProduto: '',
}

const pillars = [
  {
    id: 'zona',
    icon: Star,
    label: 'Zona de Genialidade',
    desc: 'O que você faz de melhor no mundo — seu talento único',
    color: '#F59E0B',
    placeholder: 'Ex: Ajudo empreendedores a transformar conhecimento em produtos digitais de alto valor...',
    field: 'zonaGenialidade' as keyof PosicionamentoData,
  },
  {
    id: 'publico',
    icon: Target,
    label: 'Público-Alvo',
    desc: 'Para quem você resolve o problema com excelência',
    color: '#3B82F6',
    placeholder: 'Ex: Profissionais liberais entre 35-55 anos que querem digitalizar seu conhecimento...',
    field: 'publicoAlvo' as keyof PosicionamentoData,
  },
  {
    id: 'proposta',
    icon: Zap,
    label: 'Proposta de Valor',
    desc: 'O resultado transformador que você entrega',
    color: '#10B981',
    placeholder: 'Ex: Em 90 dias, você terá um produto digital estruturado e sua primeira venda realizada...',
    field: 'proposta' as keyof PosicionamentoData,
  },
  {
    id: 'storytelling',
    icon: Flame,
    label: 'Story Telling',
    desc: 'Sua história de transformação pessoal e profissional',
    color: '#8B5CF6',
    placeholder: 'Ex: Comecei como consultor trocando horas por dinheiro, até perceber que meu conhecimento valia muito mais...',
    field: 'storytelling' as keyof PosicionamentoData,
  },
]

function PosicionamentoPage() {
  const [data, setData] = useState<PosicionamentoData>(initialData)
  const [editing, setEditing] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

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

  const filledCount = [
    data.zonaGenialidade,
    data.publicoAlvo,
    data.proposta,
    data.storytelling,
    data.formatoProduto,
    ...data.diferenciais,
  ].filter(v => v.trim().length > 0).length

  const totalFields = 5 + data.diferenciais.length
  const completionPct = Math.round((filledCount / totalFields) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Posicionamento & Autoridade</h1>
          <p className="text-[#4A7FA5] mt-1">Defina sua Zona de Genialidade e posicionamento de mercado</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-black text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Save size={16} />
          {saved ? 'Salvo!' : 'Salvar'}
        </button>
      </div>

      {/* Progress */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Perfil de Autoridade</p>
          <span className="text-sm font-bold text-[#F59E0B]">{completionPct}% completo</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#112240]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <p className="text-xs text-[#4A7FA5] mt-2">
          Quanto mais completo, maior sua clareza de posicionamento e autoridade percebida
        </p>
      </motion.div>

      {/* Main pillars */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 gap-4"
      >
        {pillars.map((pillar) => {
          const isEditing = editing === pillar.id
          const value = data[pillar.field] as string
          return (
            <motion.div
              key={pillar.id}
              variants={fadeInUp}
              className={`rounded-2xl border p-5 transition-all ${
                isEditing ? 'border-[#F59E0B]/40 bg-[#0F2A47]' : 'border-[#1A2E4A] bg-[#0D1B2E] hover:border-[#2A4A6E]'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${pillar.color}18`, border: `1px solid ${pillar.color}30` }}>
                    <pillar.icon size={17} style={{ color: pillar.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{pillar.label}</p>
                    <p className="text-xs text-[#4A7FA5]">{pillar.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(isEditing ? null : pillar.id)}
                  className="text-[#4A7FA5] hover:text-white transition-colors flex-shrink-0"
                >
                  <Edit3 size={15} />
                </button>
              </div>

              {isEditing ? (
                <textarea
                  autoFocus
                  value={value}
                  onChange={e => updateField(pillar.field, e.target.value)}
                  placeholder={pillar.placeholder}
                  rows={4}
                  className="w-full bg-[#112240] border border-[#1A4A6E] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-[#3A5A7A] focus:outline-none focus:border-[#F59E0B] resize-none"
                />
              ) : (
                <div
                  onClick={() => setEditing(pillar.id)}
                  className="min-h-[80px] cursor-text rounded-xl border border-[#1A2E4A] bg-[#0A1420] px-3 py-2.5"
                >
                  {value ? (
                    <p className="text-sm text-[#A0C0D8] leading-relaxed">{value}</p>
                  ) : (
                    <p className="text-sm text-[#3A5A7A] italic flex items-center gap-1">
                      <Edit3 size={12} /> Clique para preencher...
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Diferenciais + Formato */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Diferenciais */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center">
              <Star size={17} className="text-[#EF4444]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Diferenciais Competitivos</p>
              <p className="text-xs text-[#4A7FA5]">O que te distingue da concorrência</p>
            </div>
          </div>
          <div className="space-y-2">
            {data.diferenciais.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#EF4444] w-5 flex-shrink-0">{i + 1}.</span>
                <input
                  type="text"
                  value={d}
                  onChange={e => updateDiferencial(i, e.target.value)}
                  placeholder={`Diferencial ${i + 1}...`}
                  className="flex-1 bg-[#0A1420] border border-[#1A2E4A] rounded-xl px-3 py-2 text-sm text-white placeholder:text-[#3A5A7A] focus:outline-none focus:border-[#EF4444]/50"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Formato do Produto */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="rounded-2xl bg-[#0D1B2E] border border-[#1A2E4A] p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
              <ArrowRight size={17} className="text-[#10B981]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Formatação do Produto</p>
              <p className="text-xs text-[#4A7FA5]">Como seu produto/serviço é estruturado</p>
            </div>
          </div>
          <textarea
            value={data.formatoProduto}
            onChange={e => updateField('formatoProduto', e.target.value)}
            placeholder="Descreva o formato, duração, entregáveis e preço do seu produto ou serviço principal..."
            rows={6}
            className="w-full bg-[#0A1420] border border-[#1A2E4A] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-[#3A5A7A] focus:outline-none focus:border-[#10B981]/50 resize-none"
          />
        </motion.div>
      </div>
    </div>
  )
}
