export type TrailLevel = 'iniciante' | 'intermediario' | 'avancado'
export type TrailCategory = 'comunicacao' | 'lideranca' | 'negociacao' | 'apresentacao' | 'escrita'

export interface TrailModule {
  id: string
  title: string
  description: string
  duration: number
  contentItems: number
}

export interface Trail {
  id: string
  title: string
  description: string
  category: TrailCategory
  level: TrailLevel
  duration: number
  modules: TrailModule[]
  thumbnail: string
  instructor: string
  instructorBio: string
  enrollments: number
  rating: number
  published: boolean
  createdAt: string
}

export const mockTrails: Trail[] = [
  {
    id: 'trail-001',
    title: 'Fundamentos da Comunicação Corporativa',
    description: 'Domine os princípios essenciais da comunicação no ambiente profissional moderno.',
    category: 'comunicacao',
    level: 'iniciante',
    duration: 480,
    modules: [
      { id: 'm1', title: 'Comunicação Verbal Eficaz', description: 'Fundamentos da fala assertiva', duration: 90, contentItems: 6 },
      { id: 'm2', title: 'Linguagem Não-Verbal', description: 'Postura, gestos e presença', duration: 75, contentItems: 5 },
      { id: 'm3', title: 'Escuta Ativa', description: 'Técnicas de escuta profunda', duration: 60, contentItems: 4 },
      { id: 'm4', title: 'Feedback Construtivo', description: 'Como dar e receber feedback', duration: 90, contentItems: 6 },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    instructor: 'Prof. Ricardo Almeida',
    instructorBio: 'Especialista em comunicação corporativa com 15 anos de experiência em treinamentos empresariais.',
    enrollments: 1243,
    rating: 4.8,
    published: true,
    createdAt: '2024-01-10',
  },
  {
    id: 'trail-002',
    title: 'Liderança e Influência',
    description: 'Desenvolva sua capacidade de liderar equipes e influenciar resultados.',
    category: 'lideranca',
    level: 'intermediario',
    duration: 600,
    modules: [
      { id: 'm1', title: 'Estilos de Liderança', description: 'Conheça seu perfil de liderança', duration: 120, contentItems: 8 },
      { id: 'm2', title: 'Motivação de Equipes', description: 'Técnicas de engajamento', duration: 90, contentItems: 6 },
      { id: 'm3', title: 'Gestão de Conflitos', description: 'Resolução assertiva de conflitos', duration: 90, contentItems: 6 },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    instructor: 'Dra. Fernanda Costa',
    instructorBio: 'PhD em Psicologia Organizacional, consultora de liderança para Fortune 500.',
    enrollments: 876,
    rating: 4.9,
    published: true,
    createdAt: '2024-02-15',
  },
  {
    id: 'trail-003',
    title: 'Negociação de Alto Impacto',
    description: 'Estratégias avançadas de negociação para fechar acordos e criar valor.',
    category: 'negociacao',
    level: 'avancado',
    duration: 540,
    modules: [
      { id: 'm1', title: 'BATNA e Zona de Possível Acordo', description: 'Framework Harvard', duration: 100, contentItems: 7 },
      { id: 'm2', title: 'Psicologia da Persuasão', description: 'Princípios de influência', duration: 90, contentItems: 6 },
      { id: 'm3', title: 'Negociação Intercultural', description: 'Culturas e estilos de negociação', duration: 80, contentItems: 5 },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    instructor: 'Marcus Vinicius Torres',
    instructorBio: 'Negociador internacional certificado pelo MIT, ex-diretor comercial do Grupo Globaltech.',
    enrollments: 654,
    rating: 4.7,
    published: true,
    createdAt: '2024-03-01',
  },
  {
    id: 'trail-004',
    title: 'Apresentações que Convencem',
    description: 'Estruture e entregue apresentações memoráveis para qualquer audiência.',
    category: 'apresentacao',
    level: 'intermediario',
    duration: 420,
    modules: [
      { id: 'm1', title: 'Storytelling Corporativo', description: 'A arte de contar histórias', duration: 90, contentItems: 6 },
      { id: 'm2', title: 'Design de Slides', description: 'Visual impactante e claro', duration: 75, contentItems: 5 },
      { id: 'm3', title: 'Controle do Nervosismo', description: 'Técnicas de presença em palco', duration: 75, contentItems: 5 },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
    instructor: 'Juliana Freitas',
    instructorBio: 'Speaker TEDx e coach de comunicação com mais de 500 apresentações treinadas.',
    enrollments: 989,
    rating: 4.8,
    published: true,
    createdAt: '2024-03-20',
  },
  {
    id: 'trail-005',
    title: 'Escrita Profissional e Relatórios',
    description: 'Redija e-mails, relatórios e documentos corporativos com clareza e impacto.',
    category: 'escrita',
    level: 'iniciante',
    duration: 360,
    modules: [
      { id: 'm1', title: 'E-mail Corporativo Eficaz', description: 'Clareza e objetividade', duration: 60, contentItems: 4 },
      { id: 'm2', title: 'Relatórios Executivos', description: 'Estrutura e visualização', duration: 80, contentItems: 5 },
      { id: 'm3', title: 'Comunicação Persuasiva Escrita', description: 'Calls to action e argumentação', duration: 80, contentItems: 5 },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
    instructor: 'Prof. André Lopes',
    instructorBio: 'Jornalista e redator corporativo com 12 anos de experiência em comunicação empresarial.',
    enrollments: 1102,
    rating: 4.6,
    published: true,
    createdAt: '2024-04-05',
  },
  {
    id: 'trail-006',
    title: 'Comunicação em Reuniões Remotas',
    description: 'Domine a arte de comunicar-se com impacto em ambientes digitais e híbridos.',
    category: 'comunicacao',
    level: 'iniciante',
    duration: 300,
    modules: [
      { id: 'm1', title: 'Presença Virtual', description: 'Câmera, iluminação e postura', duration: 60, contentItems: 4 },
      { id: 'm2', title: 'Facilitação de Reuniões Online', description: 'Engajar times remotos', duration: 70, contentItems: 5 },
      { id: 'm3', title: 'Ferramentas de Colaboração', description: 'Miro, Notion, Slack', duration: 70, contentItems: 5 },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80',
    instructor: 'Carla Mendes',
    instructorBio: 'Especialista em trabalho remoto e facilitadora de times distribuídos globalmente.',
    enrollments: 723,
    rating: 4.5,
    published: false,
    createdAt: '2024-05-01',
  },
]
