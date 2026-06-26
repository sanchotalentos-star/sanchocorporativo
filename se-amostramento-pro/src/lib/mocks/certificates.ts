export interface Certificate {
  id: string
  memberId: string
  memberName: string
  trailId: string
  trailTitle: string
  issuedAt: string
  expiresAt?: string
  verificationCode: string
  downloadUrl: string
}

export const mockCertificates: Certificate[] = [
  {
    id: 'cert-001',
    memberId: 'mem-001',
    memberName: 'Carlos Eduardo Mendes',
    trailId: 'trail-001',
    trailTitle: 'Fundamentos da Comunicação Corporativa',
    issuedAt: '2024-03-10',
    verificationCode: 'SE-2024-001-A7F3',
    downloadUrl: '/certificates/SE-2024-001-A7F3.pdf',
  },
  {
    id: 'cert-002',
    memberId: 'mem-001',
    memberName: 'Carlos Eduardo Mendes',
    trailId: 'trail-002',
    trailTitle: 'Liderança e Influência',
    issuedAt: '2024-04-22',
    verificationCode: 'SE-2024-002-B9K1',
    downloadUrl: '/certificates/SE-2024-002-B9K1.pdf',
  },
  {
    id: 'cert-003',
    memberId: 'mem-001',
    memberName: 'Carlos Eduardo Mendes',
    trailId: 'trail-004',
    trailTitle: 'Apresentações que Convencem',
    issuedAt: '2024-05-30',
    verificationCode: 'SE-2024-004-C2M8',
    downloadUrl: '/certificates/SE-2024-004-C2M8.pdf',
  },
]
