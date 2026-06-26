export type OrgType = 'startup' | 'empresa' | 'corporativo' | 'solo' | 'team'

export interface Organization {
  id: string
  name: string
  type: OrgType
  plan: string
  members: number
  maxMembers: number
  status: 'active' | 'suspended' | 'trial'
  createdAt: string
  contactEmail: string
  industry: string
}

export const mockOrganizations: Organization[] = [
  {
    id: 'org-001',
    name: 'Consultoria Sampaio & Associados',
    type: 'empresa',
    plan: 'Empresa',
    members: 24,
    maxMembers: 50,
    status: 'active',
    createdAt: '2024-01-15',
    contactEmail: 'admin@sampaio.com.br',
    industry: 'Consultoria',
  },
  {
    id: 'org-002',
    name: 'TechBrasil Soluções',
    type: 'corporativo',
    plan: 'Corporativo',
    members: 142,
    maxMembers: 500,
    status: 'active',
    createdAt: '2023-11-03',
    contactEmail: 'rh@techbrasil.com.br',
    industry: 'Tecnologia',
  },
  {
    id: 'org-003',
    name: 'Startup Ágil',
    type: 'startup',
    plan: 'Team',
    members: 8,
    maxMembers: 20,
    status: 'trial',
    createdAt: '2024-05-20',
    contactEmail: 'ceo@startupagil.io',
    industry: 'SaaS',
  },
  {
    id: 'org-004',
    name: 'Grupo Meridional',
    type: 'corporativo',
    plan: 'Corporativo',
    members: 310,
    maxMembers: 500,
    status: 'active',
    createdAt: '2023-06-01',
    contactEmail: 'ti@grupomeridional.com.br',
    industry: 'Varejo',
  },
  {
    id: 'org-005',
    name: 'Instituto Comunicar',
    type: 'empresa',
    plan: 'Empresa',
    members: 35,
    maxMembers: 50,
    status: 'suspended',
    createdAt: '2024-02-28',
    contactEmail: 'contato@comunicar.org.br',
    industry: 'Educação',
  },
]
