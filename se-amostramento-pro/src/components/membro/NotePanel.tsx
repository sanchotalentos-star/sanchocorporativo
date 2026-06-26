import { useState } from 'react'
import { Plus, Download, Edit2, Check, X, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Note {
  id: string
  text: string
  timestamp: string
  createdAt: string
}

const initialNotes: Note[] = [
  { id: 'n1', text: 'Técnica de escuta ativa: olhos, postura, confirmação verbal.', timestamp: '00:04:32', createdAt: new Date().toISOString() },
  { id: 'n2', text: 'Lembrar: o que não é dito também comunica — linguagem corporal.', timestamp: '00:09:15', createdAt: new Date().toISOString() },
]

interface NotePanelProps {
  contentTitle: string
}

export function NotePanel({ contentTitle }: NotePanelProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [draft, setDraft] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const addNote = () => {
    if (!draft.trim()) return
    const note: Note = {
      id: `n-${Date.now()}`,
      text: draft.trim(),
      timestamp: '00:00:00',
      createdAt: new Date().toISOString(),
    }
    setNotes((prev) => [note, ...prev])
    setDraft('')
  }

  const saveEdit = (id: string) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, text: editText } : n))
    setEditingId(null)
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  const exportMarkdown = () => {
    const md = `# Notas: ${contentTitle}\n\n` + notes.map((n) => `- [${n.timestamp}] ${n.text}`).join('\n')
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'notas.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col bg-[#0F0F1A] border-l border-[#2A2A40]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2A40]">
        <h3 className="font-display font-semibold text-white text-sm">Minhas Notas</h3>
        <Button variant="ghost" size="icon" onClick={exportMarkdown} title="Exportar Markdown">
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {/* Add note */}
      <div className="p-4 border-b border-[#2A2A40]">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) addNote() }}
          className="w-full bg-[#18182A] border border-[#2A2A40] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#7C7C9C] focus:outline-none focus:border-[#7B2FBE] resize-none"
          placeholder="Adicionar nota... (Ctrl+Enter para salvar)"
          rows={3}
        />
        <Button variant="primary" size="sm" onClick={addNote} className="mt-2 w-full">
          <Plus className="w-4 h-4" />
          Adicionar
        </Button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="bg-[#18182A] border border-[#2A2A40] rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Clock className="w-3 h-3 text-[#7B2FBE]" />
              <span className="text-xs font-mono text-[#9D4FE3]">{note.timestamp}</span>
            </div>

            {editingId === note.id ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full bg-[#0F0F1A] border border-[#7B2FBE] rounded px-2 py-1 text-sm text-white resize-none focus:outline-none"
                  rows={3}
                />
                <div className="flex gap-1">
                  <Button size="sm" variant="primary" onClick={() => saveEdit(note.id)}>
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <p className="text-sm text-[#C4B5FD] flex-1">{note.text}</p>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => { setEditingId(note.id); setEditText(note.text) }} className="text-[#7C7C9C] hover:text-white transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteNote(note.id)} className="text-[#7C7C9C] hover:text-[#EF4444] transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
