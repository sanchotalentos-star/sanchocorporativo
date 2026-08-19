import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import type { UserRole } from '@/types'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (!user) {
      void navigate({ to: '/auth' })
      return
    }
    if (requiredRole && user.role !== requiredRole) {
      const dest = user.role === 'admin' ? '/dashboard/admin' : '/dashboard/membro'
      void navigate({ to: dest })
    }
  }, [user, loading, requiredRole, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9]">
        <div className="w-8 h-8 border-2 border-[#1B3A5C] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null
  if (requiredRole && user.role !== requiredRole) return null

  return <>{children}</>
}
