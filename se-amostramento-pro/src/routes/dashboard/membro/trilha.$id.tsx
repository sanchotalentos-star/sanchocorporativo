import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Clock, Users, Star, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { ContentItem } from '@/components/membro/ContentItem'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { mockTrails } from '@/lib/mocks'
import * as Accordion from '@radix-ui/react-accordion'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/membro/trilha/$id')({
  component: TrailDetailPage,
})

type ContentStatus = 'not-started' | 'in-progress' | 'completed'

const mockContentStatus: Record<string, ContentStatus[]> = {
  'm1': ['completed', 'completed', 'in-progress', 'not-started', 'not-started', 'not-started'],
  'm2': ['not-started', 'not-started', 'not-started', 'not-started', 'not-started'],
  'm3': ['not-started', 'not-started', 'not-started', 'not-started'],
  'm4': ['not-started', 'not-started', 'not-started', 'not-started', 'not-started', 'not-started'],
}

function TrailDetailPage() {
  const { id } = Route.useParams()
  const trail = mockTrails.find((t) => t.id === id) ?? mockTrails[0]
  const [openModule, setOpenModule] = useState<string>(trail.modules[0]?.id ?? '')

  const hours = Math.floor(trail.duration / 60)
  const mins = trail.duration % 60

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link to="/dashboard/membro/trilhas">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4" />
          Voltar às trilhas
        </Button>
      </Link>

      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden">
        <img src={trail.thumbnail} alt={trail.title} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/50 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <div className="flex gap-2 mb-2">
            <Badge variant="primary">{trail.category}</Badge>
            <Badge variant={trail.level === 'iniciante' ? 'success' : trail.level === 'intermediario' ? 'warning' : 'danger'}>
              {trail.level}
            </Badge>
          </div>
          <h1 className="text-2xl font-display font-bold text-white">{trail.title}</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <p className="text-[#C4B5FD]">{trail.description}</p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 text-sm text-[#7C7C9C]">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#7B2FBE]" />{hours}h{mins > 0 ? ` ${mins}min` : ''}</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[#7B2FBE]" />{trail.enrollments.toLocaleString()} alunos</span>
            <span className="flex items-center gap-1.5 text-[#F59E0B]"><Star className="w-4 h-4 fill-[#F59E0B]" />{trail.rating}/5</span>
          </div>

          {/* Progress */}
          <div>
            <ProgressBar value={35} showLabel size="md" />
          </div>

          {/* Modules accordion */}
          <div>
            <h2 className="text-base font-display font-semibold text-white mb-3">Conteúdo da Trilha</h2>
            <Accordion.Root
              type="single"
              collapsible
              value={openModule}
              onValueChange={(v) => setOpenModule(v)}
              className="space-y-2"
            >
              {trail.modules.map((mod, i) => {
                const statuses = mockContentStatus[mod.id] ?? Array(mod.contentItems).fill('not-started' as ContentStatus)
                const types: Array<'video' | 'pdf' | 'audio' | 'slides'> = ['video', 'pdf', 'video', 'slides', 'video', 'pdf']

                return (
                  <Accordion.Item
                    key={mod.id}
                    value={mod.id}
                    className="bg-[#18182A] border border-[#2A2A40] rounded-xl overflow-hidden data-[state=open]:border-[#7B2FBE]/50"
                  >
                    <Accordion.Trigger
                      className={cn(
                        'w-full flex items-center justify-between px-5 py-4 text-left',
                        'hover:bg-[#1E1E34] transition-colors [&[data-state=open]]:bg-[#1E1E34]'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#7B2FBE]/20 flex items-center justify-center text-xs font-bold text-[#9D4FE3]">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{mod.title}</p>
                          <p className="text-xs text-[#7C7C9C]">{mod.contentItems} aulas · {mod.duration} min</p>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-[#7C7C9C] transition-transform [[data-state=open]_&]:rotate-180" />
                    </Accordion.Trigger>
                    <Accordion.Content className="px-3 pb-3">
                      {Array.from({ length: mod.contentItems }).map((_, j) => (
                        <ContentItem
                          key={j}
                          id={`${mod.id}-${j}`}
                          title={`${j + 1}. ${mod.description} — Parte ${j + 1}`}
                          type={types[j % types.length]}
                          duration={Math.floor(8 + Math.random() * 20)}
                          status={statuses[j] ?? 'not-started'}
                          onClick={() => {}}
                        />
                      ))}
                    </Accordion.Content>
                  </Accordion.Item>
                )
              })}
            </Accordion.Root>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-[#18182A] border border-[#2A2A40] rounded-xl p-5">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${trail.instructor}`}
              alt={trail.instructor}
              className="w-16 h-16 rounded-full border border-[#7B2FBE]/50 mb-3 mx-auto"
            />
            <h3 className="font-display font-semibold text-white text-center mb-1">{trail.instructor}</h3>
            <p className="text-xs text-[#7C7C9C] text-center mb-4">{trail.instructorBio}</p>
            <Link to="/dashboard/membro/player/$id" params={{ id: trail.modules[0]?.id ?? 'content-1' }}>
              <Button variant="primary" className="w-full">
                <ChevronRight className="w-4 h-4" />
                Continuar Trilha
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
