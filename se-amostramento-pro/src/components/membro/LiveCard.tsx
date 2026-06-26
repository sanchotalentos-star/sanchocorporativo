import { useState, useEffect } from 'react'
import { Calendar, Users, Clock, Radio, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusChip } from '@/components/ui/StatusChip'
import type { LiveSession } from '@/lib/mocks'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface LiveCardProps {
  session: LiveSession
}

function useCountdown(targetDate: string) {
  const [remaining, setRemaining] = useState('')

  useEffect(() => {
    const update = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) { setRemaining('Iniciando...'); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setRemaining(`${d > 0 ? `${d}d ` : ''}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return remaining
}

export function LiveCard({ session }: LiveCardProps) {
  const countdown = useCountdown(session.scheduledAt)
  const [registered, setRegistered] = useState(false)

  const handleRegister = () => {
    setRegistered(true)
    toast.success(`Inscrição confirmada: ${session.title}`)
  }

  const date = new Date(session.scheduledAt).toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className={cn(
      'bg-[#18182A] border rounded-xl overflow-hidden transition-all duration-200',
      session.status === 'live' ? 'border-[#EF4444]/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-[#2A2A40] hover:border-[#7B2FBE]/50'
    )}>
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img src={session.thumbnail} alt={session.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#18182A] to-transparent" />
        <div className="absolute top-3 left-3">
          <StatusChip status={session.status} />
        </div>
        {session.status === 'live' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#EF4444]/90 flex items-center justify-center">
              <Radio className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
        )}
        {session.status === 'ended' && session.recordingUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center hover:bg-[#7B2FBE]/80 transition-colors cursor-pointer">
              <PlayCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-white mb-1">{session.title}</h3>
        <p className="text-xs text-[#7C7C9C] mb-3 line-clamp-2">{session.description}</p>

        <div className="space-y-1.5 mb-4 text-xs text-[#7C7C9C]">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#7B2FBE]" />
            <span className="capitalize">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-[#7B2FBE]" />
            <span>{session.attendees}/{session.maxAttendees} inscritos</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#7B2FBE]" />
            <span>{session.duration} min com {session.instructor}</span>
          </div>
        </div>

        {session.status === 'upcoming' && (
          <div className="bg-[#0F0F1A] rounded-lg px-3 py-2 mb-3 text-center">
            <p className="text-xs text-[#7C7C9C]">Começa em</p>
            <p className="text-lg font-mono font-bold text-[#9D4FE3]">{countdown}</p>
          </div>
        )}

        {session.status === 'upcoming' && (
          <Button
            variant={registered ? 'secondary' : 'primary'}
            size="sm"
            className="w-full"
            onClick={registered ? undefined : handleRegister}
            disabled={registered}
          >
            {registered ? 'Inscrito ✓' : 'Inscrever-se'}
          </Button>
        )}
        {session.status === 'live' && (
          <Button variant="neon" size="sm" className="w-full">
            <Radio className="w-4 h-4" />
            Entrar Agora
          </Button>
        )}
        {session.status === 'ended' && session.recordingUrl && (
          <Button variant="secondary" size="sm" className="w-full">
            <PlayCircle className="w-4 h-4" />
            Ver Gravação
          </Button>
        )}
      </div>
    </div>
  )
}
