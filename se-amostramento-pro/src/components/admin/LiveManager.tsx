import { useState } from 'react'
import { Plus, Edit, Trash2, Radio, Users, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Dialog } from '@/components/ui/Dialog'
import { StatusChip } from '@/components/ui/StatusChip'
import { mockLives } from '@/lib/mocks'
import type { LiveSession } from '@/lib/mocks'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function LiveManager() {
  const [sessions, setSessions] = useState<LiveSession[]>(mockLives)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<LiveSession | null>(null)
  const [form, setForm] = useState({ title: '', instructor: '', scheduledAt: '', duration: '90', maxAttendees: '300' })

  const handleOpen = (session?: LiveSession) => {
    if (session) {
      setEditing(session)
      setForm({
        title: session.title,
        instructor: session.instructor,
        scheduledAt: session.scheduledAt.split('T')[0],
        duration: String(session.duration),
        maxAttendees: String(session.maxAttendees),
      })
    } else {
      setEditing(null)
      setForm({ title: '', instructor: '', scheduledAt: '', duration: '90', maxAttendees: '300' })
    }
    setOpen(true)
  }

  const handleSave = () => {
    if (editing) {
      setSessions((prev) => prev.map((s) => s.id === editing.id ? { ...s, ...form, duration: Number(form.duration), maxAttendees: Number(form.maxAttendees) } : s))
      toast.success('Live atualizada com sucesso!')
    } else {
      const newSession: LiveSession = {
        id: `live-${Date.now()}`,
        title: form.title,
        description: '',
        instructor: form.instructor,
        instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=new',
        scheduledAt: form.scheduledAt,
        duration: Number(form.duration),
        status: 'upcoming',
        attendees: 0,
        maxAttendees: Number(form.maxAttendees),
        thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
        meetingUrl: '#',
        tags: [],
      }
      setSessions((prev) => [newSession, ...prev])
      toast.success('Live criada com sucesso!')
    }
    setOpen(false)
  }

  const handleDelete = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    toast('Live removida.')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-display font-semibold text-white">Sessões ao Vivo</h2>
        <Button variant="primary" onClick={() => handleOpen()}>
          <Plus className="w-4 h-4" />
          Nova Live
        </Button>
      </div>

      <div className="space-y-3">
        {sessions.map((s) => (
          <div key={s.id} className={cn('bg-[#18182A] border border-[#2A2A40] rounded-xl p-5 flex items-center gap-4 hover:border-[#7B2FBE]/40 transition-all')}>
            <div className="w-12 h-12 rounded-xl bg-[#7B2FBE]/20 flex items-center justify-center flex-shrink-0">
              <Radio className={cn('w-6 h-6', s.status === 'live' ? 'text-[#EF4444] animate-pulse' : 'text-[#9D4FE3]')} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white truncate">{s.title}</h3>
                <StatusChip status={s.status} />
              </div>
              <div className="flex items-center gap-4 text-xs text-[#7C7C9C]">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(s.scheduledAt).toLocaleDateString('pt-BR')}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{s.attendees}/{s.maxAttendees}</span>
                <span>{s.duration} min</span>
                <span>{s.instructor}</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="ghost" size="icon" onClick={() => handleOpen(s)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}>
                <Trash2 className="w-4 h-4 text-[#EF4444]" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? 'Editar Live' : 'Nova Live'}
        description="Preencha os dados da sessão ao vivo."
      >
        <div className="space-y-4">
          <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título da live" />
          <Input label="Instrutor" value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} placeholder="Nome do instrutor" />
          <Input label="Data" type="date" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Duração (min)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            <Input label="Máx. participantes" type="number" value={form.maxAttendees} onChange={(e) => setForm({ ...form, maxAttendees: e.target.value })} />
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="ghost" onClick={() => setOpen(false)} className="flex-1">Cancelar</Button>
            <Button variant="primary" onClick={handleSave} className="flex-1">Salvar</Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
