import type { ReactNode } from 'react'

type Role = 'admin' | 'member' | 'manager'

// Mock auth state — replace with real Supabase auth later
const mockAuth = {
  isAuthenticated: true,
  role: 'admin' as Role,
  user: {
    id: 'mem-001',
    name: 'Carlos Eduardo Mendes',
    email: 'carlos.mendes@techbrasil.com.br',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
  },
}

export function useAuth() {
  return mockAuth
}

interface AuthGuardProps {
  children: ReactNode
  requiredRole?: Role
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { isAuthenticated, role } = mockAuth

  if (!isAuthenticated) {
    // In real app: redirect to /auth
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <p className="text-[#7C7C9C]">Redirecionando para login...</p>
      </div>
    )
  }

  if (requiredRole && role !== requiredRole && !(requiredRole === 'member' && role === 'admin')) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <p className="text-[#EF4444]">Acesso não autorizado.</p>
      </div>
    )
  }

  return <>{children}</>
}
