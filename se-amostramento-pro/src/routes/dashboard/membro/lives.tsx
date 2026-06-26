import { createFileRoute } from '@tanstack/react-router'
import { LiveCard } from '@/components/membro/LiveCard'
import { mockLives } from '@/lib/mocks'
import { Radio } from 'lucide-react'

export const Route = createFileRoute('/dashboard/membro/lives')({
  component: LivesMembroPage,
})

function LivesMembroPage() {
  const upcoming = mockLives.filter((l) => l.status === 'upcoming' || l.status === 'live')
  const past = mockLives.filter((l) => l.status === 'ended')

  return (
    <div className="space-y-8">
      {/* Upcoming */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Radio className="w-5 h-5 text-[#EF4444]" />
          <h2 className="text-lg font-display font-semibold text-white">Próximas Sessões</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {upcoming.map((live) => (
            <LiveCard key={live.id} session={live} />
          ))}
        </div>
      </div>

      {/* Past recordings */}
      {past.length > 0 && (
        <div>
          <h2 className="text-lg font-display font-semibold text-white mb-5">Gravações Anteriores</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {past.map((live) => (
              <LiveCard key={live.id} session={live} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
