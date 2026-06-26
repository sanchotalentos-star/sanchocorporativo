export type RequestStatus = 'pending' | 'approved' | 'rejected'
export type RequestPlan = 'Solo' | 'Team' | 'Empresa' | 'Corporativo'

export interface AccessRequest {
  id: string
  orgName: string
  contactName: string
  email: string
  phone: string
  plan: RequestPlan
  message: string
  status: RequestStatus
  submittedAt: string
  employees: number
  industry: string
}

export const mockRequests: AccessRequest[] = [
  {
    id: 'req-001',
    orgName: 'Distribuidora Omega',
    contactName: 'Rodrigo Faria',
    email: 'rodrigo.faria@omega.com.br',
    phone: '(11) 99123-4567',
    plan: 'Empresa',
    message: 'Precisamos capacitar nossa equipe de vendas em comunicação e negociação. Gostaríamos de entender melhor os recursos do plano Empresa.',
    status: 'pending',
    submittedAt: '2024-06-24T14:35:00Z',
    employees: 45,
    industry: 'Distribuição',
  },
  {
    id: 'req-002',
    orgName: 'Agência Criativa Nova',
    contactName: 'Patrícia Moura',
    email: 'patricia@agenciacriativa.com.br',
    phone: '(21) 98765-4321',
    plan: 'Team',
    message: 'Somos uma agência com 12 pessoas e queremos melhorar nossa comunicação com clientes e apresentações de proposta.',
    status: 'pending',
    submittedAt: '2024-06-23T09:18:00Z',
    employees: 12,
    industry: 'Marketing & Publicidade',
  },
  {
    id: 'req-003',
    orgName: 'Holding Investimentos BR',
    contactName: 'Eduardo Castelo',
    email: 'e.castelo@holdingbr.com.br',
    phone: '(11) 3456-7890',
    plan: 'Corporativo',
    message: 'Temos interesse no plano Corporativo para treinar mais de 200 executivos em comunicação de alto impacto e liderança.',
    status: 'pending',
    submittedAt: '2024-06-22T16:45:00Z',
    employees: 230,
    industry: 'Finanças',
  },
  {
    id: 'req-004',
    orgName: 'Clínica Saúde Plena',
    contactName: 'Dra. Helena Santos',
    email: 'helena@saudeplena.med.br',
    phone: '(31) 97654-3210',
    plan: 'Solo',
    message: 'Sou médica e quero melhorar minha comunicação com pacientes e em apresentações científicas.',
    status: 'pending',
    submittedAt: '2024-06-22T11:20:00Z',
    employees: 1,
    industry: 'Saúde',
  },
]
