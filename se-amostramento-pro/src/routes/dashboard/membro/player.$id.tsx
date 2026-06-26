import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Play } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { NotePanel } from '@/components/membro/NotePanel'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/membro/player/$id')({
  component: PlayerPage,
})

function PlayerPage() {
  const { id } = Route.useParams()
  const [completed, setCompleted] = useState(false)
  const [showNotes, setShowNotes] = useState(true)

  const contentTitle = `Aula: Módulo ${id} — Comunicação Corporativa`

  const handleComplete = () => {
    setCompleted(true)
    toast.success('Aula concluída! +50 pontos 🎉')
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-0 rounded-xl overflow-hidden border border-[#2A2A40]">
      {/* Player area */}
      <div className="flex-1 flex flex-col bg-[#0F0F1A] min-w-0">
        {/* Video */}
        <div className="relative bg-black aspect-video flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#7B2FBE]/80 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-[#7B2FBE] transition-colors">
                <Play className="w-10 h-10 text-white ml-1" />
              </div>
              <p className="text-[#7C7C9C] text-sm">Clique para reproduzir</p>
            </div>
          </div>
          {/* Video embed placeholder */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A0A2E]/40 to-[#080810]/60 pointer-events-none" />
        </div>

        {/* Controls bar */}
        <div className="px-5 py-3 border-b border-[#2A2A40]">
          <ProgressBar value={35} size="sm" />
        </div>

        {/* Content info */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-display font-semibold text-white mb-1">{contentTitle}</h2>
              <p className="text-sm text-[#7C7C9C]">Módulo 1 · Aula 3 de 6 · 18 min</p>
            </div>
            <Button
              variant={showNotes ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setShowNotes(!showNotes)}
            >
              {showNotes ? 'Ocultar Notas' : 'Mostrar Notas'}
            </Button>
          </div>

          <p className="text-[#C4B5FD] text-sm leading-relaxed mb-6">
            Nesta aula, exploramos os fundamentos da comunicação não-verbal e como ela influencia nossa credibilidade profissional. Aprenda a usar postura, gestos e expressão facial a seu favor em apresentações e reuniões de alto impacto.
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-[#2A2A40]">
            <Link to="/dashboard/membro/trilhas">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>
            </Link>

            {!completed ? (
              <Button variant="primary" onClick={handleComplete}>
                <CheckCircle2 className="w-4 h-4" />
                Marcar como concluída
              </Button>
            ) : (
              <Button variant="secondary" disabled>
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                Concluída
              </Button>
            )}

            <Button variant="ghost">
              Próxima
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Notes panel */}
      {showNotes && (
        <div className="w-80 flex-shrink-0">
          <NotePanel contentTitle={contentTitle} />
        </div>
      )}
    </div>
  )
}
