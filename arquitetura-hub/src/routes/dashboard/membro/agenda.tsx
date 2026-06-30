import { createFileRoute } from '@tanstack/react-router'
import { CalendarioEditorial } from '@/components/membro/CalendarioEditorial'
import { mockEventos } from '@/lib/mocks/eventos'

export const Route = createFileRoute('/dashboard/membro/agenda')({
  component: AgendaPage,
})

function AgendaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Agenda Editorial</h1>
        <p className="text-[#4A7FA5] mt-1">Planeje e acompanhe seus conteúdos, eventos e ações de mídia</p>
      </div>
      <CalendarioEditorial eventos={mockEventos} />
    </div>
  )
}
