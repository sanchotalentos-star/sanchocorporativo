import type { Evento } from '@/types'

const today = new Date()
const y = today.getFullYear()
const m = String(today.getMonth() + 1).padStart(2, '0')

export const mockEventos: Evento[] = [
  { id: 'ev-1', user_id: 'member-1', titulo: 'Post LinkedIn - Case de Sucesso', tipo: 'Conteúdo', data: `${y}-${m}-02`, hora: '09:00' },
  { id: 'ev-2', user_id: 'member-1', titulo: 'Networking - Associação da Indústria', tipo: 'Evento', data: `${y}-${m}-05`, hora: '18:30' },
  { id: 'ev-3', user_id: 'member-1', titulo: 'Entrevista Podcast Empreendedor', tipo: 'Mídia', data: `${y}-${m}-08`, hora: '14:00' },
  { id: 'ev-4', user_id: 'member-1', titulo: 'Reunião com mentor estratégico', tipo: 'Relacionamento', data: `${y}-${m}-10`, hora: '10:00' },
  { id: 'ev-5', user_id: 'member-1', titulo: 'Meta: 50 leads qualificados', tipo: 'Meta', data: `${y}-${m}-15` },
  { id: 'ev-6', user_id: 'member-1', titulo: 'Newsletter semanal - Tendências', tipo: 'Conteúdo', data: `${y}-${m}-16`, hora: '08:00' },
  { id: 'ev-7', user_id: 'member-1', titulo: 'Palestra - Fórum de Negócios', tipo: 'Evento', data: `${y}-${m}-20`, hora: '15:00' },
  { id: 'ev-8', user_id: 'member-1', titulo: 'Artigo para revista especializada', tipo: 'Mídia', data: `${y}-${m}-22`, hora: '09:00' },
  { id: 'ev-9', user_id: 'member-1', titulo: 'Café com CEO do setor', tipo: 'Relacionamento', data: `${y}-${m}-25`, hora: '09:30' },
  { id: 'ev-10', user_id: 'member-1', titulo: 'Review mensal de KPIs', tipo: 'Meta', data: `${y}-${m}-28`, hora: '16:00' },
]
