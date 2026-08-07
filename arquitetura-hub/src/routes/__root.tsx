import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'

const queryClient = new QueryClient()

function RootInner() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  )
}

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootInner />
      </AuthProvider>
    </QueryClientProvider>
  ),
})
