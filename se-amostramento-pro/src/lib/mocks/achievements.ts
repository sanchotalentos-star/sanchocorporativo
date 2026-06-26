export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  points: number
  category: 'progress' | 'engagement' | 'mastery' | 'social'
  unlocked: boolean
  unlockedAt?: string
  progress?: number
  maxProgress?: number
}

export const mockAchievements: Achievement[] = [
  {
    id: 'ach-001',
    title: 'Primeiro Passo',
    description: 'Complete sua primeira aula na plataforma.',
    icon: 'star',
    points: 50,
    category: 'progress',
    unlocked: true,
    unlockedAt: '2024-01-22',
  },
  {
    id: 'ach-002',
    title: 'Trilheiro',
    description: 'Conclua sua primeira trilha completa.',
    icon: 'map',
    points: 200,
    category: 'mastery',
    unlocked: true,
    unlockedAt: '2024-02-15',
  },
  {
    id: 'ach-003',
    title: 'Comunicador',
    description: 'Complete a trilha de Comunicação Corporativa com nota acima de 90%.',
    icon: 'message-circle',
    points: 350,
    category: 'mastery',
    unlocked: true,
    unlockedAt: '2024-03-10',
  },
  {
    id: 'ach-004',
    title: 'Constância',
    description: 'Acesse a plataforma por 7 dias consecutivos.',
    icon: 'flame',
    points: 150,
    category: 'engagement',
    unlocked: true,
    unlockedAt: '2024-04-02',
  },
  {
    id: 'ach-005',
    title: 'Top 10',
    description: 'Entre no top 10 do ranking geral.',
    icon: 'trophy',
    points: 300,
    category: 'social',
    unlocked: false,
    progress: 7,
    maxProgress: 10,
  },
  {
    id: 'ach-006',
    title: 'Mestre da Negociação',
    description: 'Complete a trilha de Negociação de Alto Impacto.',
    icon: 'handshake',
    points: 400,
    category: 'mastery',
    unlocked: false,
    progress: 2,
    maxProgress: 3,
  },
  {
    id: 'ach-007',
    title: 'Live Participante',
    description: 'Participe de 3 sessões ao vivo.',
    icon: 'video',
    points: 100,
    category: 'engagement',
    unlocked: false,
    progress: 1,
    maxProgress: 3,
  },
  {
    id: 'ach-008',
    title: 'Maratonista',
    description: 'Complete 5 trilhas na plataforma.',
    icon: 'zap',
    points: 500,
    category: 'progress',
    unlocked: false,
    progress: 3,
    maxProgress: 5,
  },
]
