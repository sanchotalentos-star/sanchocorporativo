export type LiveStatus = 'upcoming' | 'live' | 'ended'

export interface LiveSession {
  id: string
  title: string
  description: string
  instructor: string
  instructorAvatar: string
  scheduledAt: string
  duration: number
  status: LiveStatus
  attendees: number
  maxAttendees: number
  thumbnail: string
  meetingUrl: string
  recordingUrl?: string
  tags: string[]
}

export const mockLives: LiveSession[] = [
  {
    id: 'live-001',
    title: 'Como Liderar Reuniões que Geram Resultados',
    description: 'Aprenda as técnicas definitivas para conduzir reuniões produtivas, engajar participantes e sempre sair com próximos passos claros.',
    instructor: 'Prof. Ricardo Almeida',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ricardo',
    scheduledAt: '2024-06-28T19:00:00Z',
    duration: 90,
    status: 'upcoming',
    attendees: 187,
    maxAttendees: 300,
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    meetingUrl: 'https://meet.example.com/live-001',
    tags: ['liderança', 'reuniões', 'produtividade'],
  },
  {
    id: 'live-002',
    title: 'Masterclass: Negociação Salarial',
    description: 'Estratégias práticas para negociar salários e benefícios com confiança e resultados. Q&A ao vivo com casos reais.',
    instructor: 'Marcus Vinicius Torres',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    scheduledAt: '2024-07-05T18:30:00Z',
    duration: 120,
    status: 'upcoming',
    attendees: 213,
    maxAttendees: 400,
    thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    meetingUrl: 'https://meet.example.com/live-002',
    tags: ['negociação', 'carreira', 'salário'],
  },
  {
    id: 'live-003',
    title: 'Pitch Perfeito: Apresente sua Ideia em 5 Minutos',
    description: 'Workshop prático de pitch: estrutura, energia e impacto. Traga sua ideia e receba feedback ao vivo.',
    instructor: 'Juliana Freitas',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juliana',
    scheduledAt: '2024-06-20T19:00:00Z',
    duration: 90,
    status: 'ended',
    attendees: 156,
    maxAttendees: 200,
    thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
    meetingUrl: 'https://meet.example.com/live-003',
    recordingUrl: 'https://recordings.example.com/live-003',
    tags: ['pitch', 'apresentação', 'empreendedorismo'],
  },
  {
    id: 'live-004',
    title: 'Comunicação Não-Violenta no Ambiente Corporativo',
    description: 'Como aplicar a CNV para resolver conflitos, dar feedbacks difíceis e construir relações mais saudáveis no trabalho.',
    instructor: 'Dra. Fernanda Costa',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fernanda',
    scheduledAt: '2024-06-15T18:00:00Z',
    duration: 60,
    status: 'ended',
    attendees: 298,
    maxAttendees: 300,
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    meetingUrl: 'https://meet.example.com/live-004',
    recordingUrl: 'https://recordings.example.com/live-004',
    tags: ['CNV', 'conflitos', 'feedback'],
  },
]
