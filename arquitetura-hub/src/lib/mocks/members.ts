import type { Member } from '@/types'

export const mockMembers: Member[] = [
  {
    id: 'member-3',
    full_name: 'Vitor Braga',
    email: 'vitorlvbraga@gmail.com',
    role: 'membro',
    score: 0,
    leads: 0,
    alcance: 0,
    kpis: [],
    growth: [
      { month: 'Jan', alcance: 0, leads: 0, conversoes: 0 },
      { month: 'Fev', alcance: 0, leads: 0, conversoes: 0 },
      { month: 'Mar', alcance: 0, leads: 0, conversoes: 0 },
      { month: 'Abr', alcance: 0, leads: 0, conversoes: 0 },
      { month: 'Mai', alcance: 0, leads: 0, conversoes: 0 },
      { month: 'Jun', alcance: 0, leads: 0, conversoes: 0 },
    ],
  },
]
