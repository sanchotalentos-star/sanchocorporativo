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
    color: '#7B2FBE',
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
    color: '#F59E0B',
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
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Posicionamento & Autoridade</h1>
          <p className="text-gray-400 mt-1 text-sm">Defina sua Zona de Genialidade e posicionamento de mercado</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#7B2FBE] hover:bg-[#6a27a5] text-white text-sm font-black px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-[#7B2FBE]/20 uppercase tracking-wide"
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
        className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Perfil de Autoridade</p>
          <span className="text-sm font-black text-[#7B2FBE]">{completionPct}% completo</span>
        </div>
        <div className="w-full h-2 rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%`, background: 'linear-gradient(90deg, #7B2FBE, #a855f7)' }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
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
              className={`rounded-2xl border p-5 transition-all bg-white ${
                isEditing ? 'border-[#7B2FBE]/40 shadow-md shadow-[#7B2FBE]/5' : 'border-gray-200 shadow-sm hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${pillar.color}12`, border: `1px solid ${pillar.color}25` }}>
                    <pillar.icon size={17} style={{ color: pillar.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{pillar.label}</p>
                    <p className="text-xs text-gray-400">{pillar.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(isEditing ? null : pillar.id)}
                  className="text-gray-300 hover:text-gray-600 transition-colors flex-shrink-0"
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 resize-none"
                />
              ) : (
                <div
                  onClick={() => setEditing(pillar.id)}
                  className="min-h-[80px] cursor-text rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5"
                >
                  {value ? (
                    <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
                  ) : (
                    <p className="text-sm text-gray-300 italic flex items-center gap-1">
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
          className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
              <Star size={17} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Diferenciais Competitivos</p>
              <p className="text-xs text-gray-400">O que te distingue da concorrência</p>
            </div>
          </div>
          <div className="space-y-2">
            {data.diferenciais.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs font-black text-red-500 w-5 flex-shrink-0">{i + 1}.</span>
                <input
                  type="text"
                  value={d}
                  onChange={e => updateDiferencial(i, e.target.value)}
                  placeholder={`Diferencial ${i + 1}...`}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-red-300 focus:ring-1 focus:ring-red-100"
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
          className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <ArrowRight size={17} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Formatação do Produto</p>
              <p className="text-xs text-gray-400">Como seu produto/serviço é estruturado</p>
            </div>
          </div>
          <textarea
            value={data.formatoProduto}
            onChange={e => updateField('formatoProduto', e.target.value)}
            placeholder="Descreva o formato, duração, entregáveis e preço do seu produto ou serviço principal..."
            rows={6}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-emerald-300 focus:ring-1 focus:ring-emerald-100 resize-none"
          />
        </motion.div>
      </div>
    </div>
  )
}
