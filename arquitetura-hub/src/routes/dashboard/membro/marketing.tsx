import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Megaphone, Plus, Calendar, Instagram, Youtube, Mic, FileText, Video, Mail, Trash2, ChevronDown, ChevronUp, ChevronRight, Sparkles, BookOpen, Star, Users, Lightbulb, Layers, X, Trophy, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getIdentidade } from '@/lib/identidade'

const MARKETING_KEY = 'marketing_store_v1'

export const Route = createFileRoute('/dashboard/membro/marketing')({
  component: MarketingPage,
})

type Canal = 'LinkedIn' | 'Instagram' | 'YouTube' | 'Podcast' | 'Email' | 'Blog' | 'Live' | 'Evento Próprio' | 'Evento Parceiro'
type Frequencia = 'Diário' | 'Semanal' | 'Quinzenal' | 'Mensal' | 'Trimestral' | 'Anual'

interface AcaoMarketing {
  id: string
  titulo: string
  canal: Canal
  frequencia: Frequencia
  mes: number
  concluida: boolean
}

const canalIcons: Record<Canal, React.ElementType> = {
  LinkedIn: FileText,
  Instagram: Instagram,
  YouTube: Youtube,
  Podcast: Mic,
  Email: Mail,
  Blog: FileText,
  Live: Video,
  'Evento Próprio': Trophy,
  'Evento Parceiro': Globe,
}

const canalColors: Record<Canal, string> = {
  LinkedIn: '#3B82F6',
  Instagram: '#7B2FBE',
  YouTube: '#EF4444',
  Podcast: '#F59E0B',
  Email: '#10B981',
  Blog: '#6B7280',
  Live: '#EC4899',
  'Evento Próprio': '#8B5CF6',
  'Evento Parceiro': '#0EA5E9',
}

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function loadAcoes(): AcaoMarketing[] {
  try { return JSON.parse(localStorage.getItem(MARKETING_KEY) ?? 'null') ?? [] }
  catch { return [] }
}

interface SementeProps {
  publicoAlvo?: string
  proposta?: string
  formatoProduto?: string
  diferenciais: string[]
  storytelling?: string
}

function SementesDeConteudo({ publicoAlvo, proposta, formatoProduto, diferenciais, storytelling }: SementeProps) {
  const [open, setOpen] = useState(true)

  const diferencialPrincipal = diferenciais[0] ?? ''

  const sementes = [
    {
      icon: BookOpen,
      label: 'Educativo',
      titulo: 'O que você ensina',
      descricao: proposta
        ? `Crie conteúdo que mostre como você entrega "${proposta.slice(0, 60)}...". Explique o método, os passos, os bastidores do processo.`
        : 'Crie conteúdo que ensina o seu método principal. Quanto mais você explica como pensa, mais autoridade ganha.',
      cor: '#3B82F6',
    },
    {
      icon: Users,
      label: 'Para quem',
      titulo: 'Fale diretamente com seu público',
      descricao: publicoAlvo
        ? `Você fala para "${publicoAlvo.slice(0, 60)}...". Crie conteúdos que nomeia essa pessoa, seus desafios e o que ela está deixando de ganhar.`
        : 'Nomear quem é seu público-alvo em cada post cria identificação imediata e atrai as pessoas certas.',
      cor: '#7B2FBE',
    },
    {
      icon: Star,
      label: 'Diferencial',
      titulo: 'O que só você faz',
      descricao: diferencialPrincipal
        ? `Seu diferencial "${diferencialPrincipal.slice(0, 60)}" é o que o mercado precisa ver. Crie posts que mostram esse ângulo único com exemplos reais.`
        : 'Explore o que torna sua abordagem única. Não o que você faz — mas como e por quê você faz diferente.',
      cor: '#F59E0B',
    },
    {
      icon: Lightbulb,
      label: 'Transformação',
      titulo: 'Mostre o antes e depois',
      descricao: publicoAlvo
        ? `Para quem vive o cenário descrito em "${publicoAlvo.slice(0, 50)}...", mostre como é a vida depois de trabalhar com você. Cases, depoimentos, resultados concretos.`
        : 'Mostre a transformação que você gera. Cases reais, depoimentos e resultados constroem prova social e confiam.',
      cor: '#10B981',
    },
    {
      icon: Layers,
      label: 'Formato',
      titulo: 'Como você chega ao mercado',
      descricao: formatoProduto
        ? `Você atua via "${formatoProduto.slice(0, 60)}...". Crie conteúdo que explica esse formato — o que ele é, para quem serve e por que funciona.`
        : 'Explique como funciona trabalhar com você — o formato, o processo, a jornada do cliente. Isso educa o mercado.',
      cor: '#EC4899',
    },
    ...(storytelling ? [{
      icon: Sparkles,
      label: 'História',
      titulo: 'Sua origem como autoridade',
      descricao: `Use sua história "${storytelling.slice(0, 60)}..." como âncora. Conte o que te trouxe até aqui e por que isso importa para quem te acompanha.`,
      cor: '#8B5CF6',
    }] : []),
    {
      icon: Trophy,
      label: 'Evento Próprio',
      titulo: 'Crie o seu espaço de autoridade',
      descricao: proposta
        ? `Organize 1 evento no ano posicionado em torno de: "${proposta.slice(0, 55)}...". Pode ser online ou presencial — o que importa é que você seja o anfitrião da conversa.`
        : 'Organize 1 evento no ano onde você é o anfitrião da conversa. Webinar, workshop, masterclass ou encontro presencial — você define o palco.',
      cor: '#8B5CF6',
    },
    {
      icon: Globe,
      label: 'Evento Parceiro',
      titulo: 'Apareça em palcos de terceiros',
      descricao: publicoAlvo
        ? `Mapeie eventos, congressos e encontros onde "${publicoAlvo.slice(0, 50)}..." está presente. Candidate-se como palestrante, painelista ou convidado especial.`
        : 'Mapeie os principais eventos do seu mercado e candidate-se como palestrante ou convidado. Presença em palcos de terceiros acelera credibilidade.',
      cor: '#0EA5E9',
    },
  ]

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
            <p className="text-sm font-semibold text-gray-900">Sementes de Conteúdo</p>
            <p className="text-xs text-gray-400">Temas gerados a partir da sua identidade de marca</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-[#7B2FBE] bg-[#7B2FBE]/10 px-2 py-0.5 rounded-full">
            {sementes.length} temas
          </span>
          {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 p-5">
          <div className="grid sm:grid-cols-2 gap-3">
            {sementes.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.label}
                  className="rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-all bg-gray-50/50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: `${s.cor}12` }}>
                      <Icon size={12} style={{ color: s.cor }} />
                    </div>
                    <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: s.cor }}>
                      {s.label}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-1.5 leading-tight">{s.titulo}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.descricao}</p>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Quanto mais blocos de identidade você preenche, mais específicos ficam os temas
            </p>
            <Link to="/dashboard/membro/posicionamento"
              className="text-xs font-medium text-[#7B2FBE] hover:underline flex-shrink-0 ml-3"
            >
              Completar identidade
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function MarketingPage() {
  const [acoes, setAcoes] = useState<AcaoMarketing[]>(loadAcoes)
  const [mesFiltro, setMesFiltro] = useState<number | null>(null)
  const [canalFiltro, setCanalFiltro] = useState<Canal | null>(null)
  const [identidadeOpen, setIdentidadeOpen] = useState(false)
  const [showNovaAcao, setShowNovaAcao] = useState(false)
  const [novaForm, setNovaForm] = useState({
    titulo: '',
    canal: 'LinkedIn' as Canal,
    frequencia: 'Mensal' as Frequencia,
    mes: new Date().getMonth() + 1,
  })
  const identidade = getIdentidade()
  const publicoAlvo    = identidade?.pilares.publicoAlvo?.reflexao?.trim()
  const proposta       = identidade?.pilares.proposta?.reflexao?.trim()
  const formatoProduto = identidade?.pilares.formatoProduto?.reflexao?.trim()

  useEffect(() => {
    localStorage.setItem(MARKETING_KEY, JSON.stringify(acoes))
  }, [acoes])

  function addAcao() {
    if (!novaForm.titulo.trim()) return
    const nova: AcaoMarketing = {
      id: Date.now().toString(),
      titulo: novaForm.titulo.trim(),
      canal: novaForm.canal,
      frequencia: novaForm.frequencia,
      mes: novaForm.mes,
      concluida: false,
    }
    setAcoes(prev => [...prev, nova])
    setNovaForm({ titulo: '', canal: 'LinkedIn', frequencia: 'Mensal', mes: new Date().getMonth() + 1 })
    setShowNovaAcao(false)
  }

  function toggleConcluida(id: string) {
    setAcoes(prev => prev.map(a => a.id === id ? { ...a, concluida: !a.concluida } : a))
  }

  function deleteAcao(id: string) {
    setAcoes(prev => prev.filter(a => a.id !== id))
  }

  const filtered = acoes.filter(a => {
    if (mesFiltro !== null && a.mes !== mesFiltro) return false
    if (canalFiltro !== null && a.canal !== canalFiltro) return false
    return true
  })

  const canais = [...new Set(acoes.map(a => a.canal))] as Canal[]
  const concluidas = acoes.filter(a => a.concluida).length
  const progresso = acoes.length > 0 ? Math.round((concluidas / acoes.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        {/* Mini cadeia */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link to="/dashboard/membro/posicionamento">
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">01 Identidade</span>
          </Link>
          <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
          <Link to="/dashboard/membro/pilares">
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">02 Pilares</span>
          </Link>
          <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
          <Link to="/dashboard/membro/okr">
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">03 OKRs</span>
          </Link>
          <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
          <span className="text-xs font-bold text-[#7B2FBE] bg-[#7B2FBE]/10 px-2 py-0.5 rounded-md">
            04 Marketing
          </span>
          <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
          <Link to="/dashboard/membro/kpis">
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">05 Resultados</span>
          </Link>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Agenda de Marketing Anual</h1>
            <p className="text-gray-400 mt-1 text-sm">Planeje suas ações de conteúdo e distribuição ao longo do ano</p>
          </div>
          <button
            onClick={() => setShowNovaAcao(true)}
            className="flex items-center gap-2 bg-[#7B2FBE] hover:bg-[#6a27a5] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-[#7B2FBE]/20 flex-shrink-0"
          >
            <Plus size={16} />
            Nova Ação
          </button>
        </div>
      </div>

      {/* Modal Nova Ação */}
      {showNovaAcao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-xl bg-white border border-gray-200 shadow-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Nova Ação de Marketing</h2>
              <button onClick={() => setShowNovaAcao(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1">Título da Ação</label>
                <input
                  autoFocus
                  type="text"
                  value={novaForm.titulo}
                  onChange={e => setNovaForm(f => ({ ...f, titulo: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addAcao()}
                  placeholder={
                    proposta
                      ? `Ex: Post sobre ${proposta.slice(0, 40)}...`
                      : 'Ex: Post de autoridade sobre meu método'
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#7B2FBE] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-gray-500 block mb-1">Canal</label>
                  <select
                    value={novaForm.canal}
                    onChange={e => setNovaForm(f => ({ ...f, canal: e.target.value as Canal }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#7B2FBE] transition-colors bg-white"
                  >
                    {(Object.keys(canalColors) as Canal[]).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-500 block mb-1">Frequência</label>
                  <select
                    value={novaForm.frequencia}
                    onChange={e => setNovaForm(f => ({ ...f, frequencia: e.target.value as Frequencia }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#7B2FBE] transition-colors bg-white"
                  >
                    {(['Diário','Semanal','Quinzenal','Mensal','Trimestral','Anual'] as Frequencia[]).map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1">Mês</label>
                <select
                  value={novaForm.mes}
                  onChange={e => setNovaForm(f => ({ ...f, mes: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#7B2FBE] transition-colors bg-white"
                >
                  {meses.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowNovaAcao(false)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={addAcao}
                disabled={!novaForm.titulo.trim()}
                className="flex-1 bg-[#7B2FBE] hover:bg-[#6a27a5] disabled:opacity-40 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div
        className="rounded-xl bg-white border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Megaphone size={16} className="text-[#7B2FBE]" />
            <p className="text-sm font-semibold text-gray-900">Execução do Plano Anual</p>
          </div>
          <span className="text-sm font-medium text-[#7B2FBE]">{concluidas}/{acoes.length} ações</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-gray-100">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progresso}%`, background: 'linear-gradient(90deg, #7B2FBE, #a855f7)' }} />
        </div>
      </div>

      {/* Referência da identidade */}
      {(publicoAlvo || proposta || formatoProduto) && (
        <div
          className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          <button
            onClick={() => setIdentidadeOpen(o => !o)}
            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-[#7B2FBE]">01</span>
              <p className="text-sm font-medium text-gray-800">Base de Identidade</p>
              <span className="text-xs text-gray-400">· ponto de partida do seu marketing</span>
            </div>
            {identidadeOpen
              ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" />
              : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
            }
          </button>
          {identidadeOpen && (
            <div className="border-t border-gray-100 divide-y divide-gray-100 bg-gray-50/50">
              {publicoAlvo && (
                <div className="px-5 py-3.5">
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">Para quem você fala</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{publicoAlvo}</p>
                </div>
              )}
              {proposta && (
                <div className="px-5 py-3.5">
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">O que você entrega</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{proposta}</p>
                </div>
              )}
              {formatoProduto && (
                <div className="px-5 py-3.5">
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">Como você chega ao mercado</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{formatoProduto}</p>
                </div>
              )}
              <div className="px-5 py-3 flex justify-end">
                <Link to="/dashboard/membro/posicionamento"
                  className="text-xs font-semibold text-[#7B2FBE] hover:underline"
                >
                  Ver identidade completa
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sementes de Conteúdo */}
      {(publicoAlvo || proposta || formatoProduto || (identidade?.diferenciais?.length ?? 0) > 0) && (
        <SementesDeConteudo
          publicoAlvo={publicoAlvo}
          proposta={proposta}
          formatoProduto={formatoProduto}
          diferenciais={identidade?.diferenciais ?? []}
          storytelling={identidade?.pilares.storytelling?.reflexao?.trim()}
        />
      )}

      {/* Estado vazio */}
      {acoes.length === 0 && (
        <div
          className="rounded-xl bg-white border border-gray-200 shadow-sm p-8 text-center"
        >
          <Megaphone size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500 mb-1">Nenhuma ação cadastrada ainda</p>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            As ações do calendário de marketing são definidas com seu mentor a partir dos pilares da sua marca.
            Use o botão "Nova Ação" para adicionar após a sessão.
          </p>
        </div>
      )}

      {/* Canal stats */}
      {acoes.length > 0 && <div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2"
      >
        {canais.map(canal => {
          const Icon = canalIcons[canal]
          const color = canalColors[canal]
          const count = acoes.filter(a => a.canal === canal).length
          const active = canalFiltro === canal
          return (
            <button
              key={canal}
              onClick={() => setCanalFiltro(active ? null : canal)}
              className={cn(
                'rounded-xl p-3 flex flex-col items-center gap-1.5 border transition-all bg-white',
                active ? '' : 'border-gray-200 hover:border-gray-300 shadow-sm'
              )}
              style={active ? { background: `${color}10`, borderColor: `${color}40` } : {}}
            >
              <Icon size={15} style={{ color: active ? color : '#9CA3AF' }} />
              <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: active ? color : '#9CA3AF' }}>{canal}</p>
              <span className="text-[10px] font-bold text-gray-900">{count}</span>
            </button>
          )
        })}
      </div>}

      {/* Mes filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setMesFiltro(null)}
          className={cn(
            'flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wide',
            mesFiltro === null ? 'bg-[#7B2FBE] text-white shadow-sm' : 'bg-gray-100 text-gray-400 hover:text-gray-700'
          )}
        >
          Todos
        </button>
        {meses.map((mes, i) => (
          <button
            key={mes}
            onClick={() => setMesFiltro(mesFiltro === i + 1 ? null : i + 1)}
            className={cn(
              'flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wide',
              mesFiltro === i + 1 ? 'bg-[#7B2FBE] text-white shadow-sm' : 'bg-gray-100 text-gray-400 hover:text-gray-700'
            )}
          >
            {mes}
          </button>
        ))}
      </div>

      {/* Actions list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-8 text-center">
            <Calendar size={32} className="text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Nenhuma ação para este filtro</p>
          </div>
        ) : filtered.map((acao) => {
          const Icon = canalIcons[acao.canal]
          const color = canalColors[acao.canal]
          return (
            <div
              key={acao.id}
              className={cn(
                'rounded-xl bg-white border px-4 py-3.5 flex items-center gap-3 group transition-all shadow-sm',
                acao.concluida ? 'border-gray-100 opacity-60' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              )}
            >
              <button
                onClick={() => toggleConcluida(acao.id)}
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  borderColor: acao.concluida ? '#10B981' : color,
                  background: acao.concluida ? '#10B981' : 'transparent',
                }}
              >
                {acao.concluida && <span className="text-white text-xs">✓</span>}
              </button>

              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}12` }}>
                <Icon size={13} style={{ color }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold', acao.concluida ? 'line-through text-gray-400' : 'text-gray-900')}>
                  {acao.titulo}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md uppercase tracking-wide"
                    style={{ background: `${color}12`, color }}>
                    {acao.canal}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">{acao.frequencia}</span>
                  <span className="text-[10px] text-gray-400">• {meses[acao.mes - 1]}</span>
                </div>
              </div>

              <button
                onClick={() => deleteAcao(acao.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Esta construção alimenta */}
      <div
        className="rounded-xl border border-gray-100 bg-white shadow-sm p-5"
      >
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-4">Esta construção alimenta</p>
        <Link to="/dashboard/membro/kpis">
          <div className="group rounded-xl border border-gray-100 bg-gray-50 hover:border-[#7B2FBE]/20 hover:bg-[#7B2FBE]/[0.03] p-4 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium text-[#7B2FBE]">05</span>
              <ChevronRight size={12} className="text-gray-300 group-hover:text-[#7B2FBE] transition-colors" />
            </div>
            <p className="text-sm font-semibold text-gray-800 leading-tight mb-1.5">Indicadores de Resultado</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Cada ação executada gera dados — alcance, engajamento, leads, vendas. Esses números são os indicadores que você acompanha para ajustar a rota.
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
