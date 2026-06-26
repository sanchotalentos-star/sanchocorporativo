import { createRootRoute, Outlet } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AnimatePresence } from 'framer-motion'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000, retry: 1 },
  },
})

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence mode="wait">
        <Outlet />
      </AnimatePresence>
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: '#18182A',
            border: '1px solid #2A2A40',
            color: '#FFFFFF',
          },
        }}
      />
    </QueryClientProvider>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
