import { Stack } from 'expo-router'
import { ThemeProvider } from '@/theme/ThemeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc'
import { httpBatchLink } from '@trpc/client'
import { useState } from 'react'

const API_URL = process.env['EXPO_PUBLIC_API_URL'] ?? 'http://localhost:3000'

function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { retry: 1, staleTime: 30_000 },
    },
  }))
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${API_URL}/trpc`,
          // Auth header will be added here once Clerk is configured
          headers: async () => ({}),
        }),
      ],
    }),
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TRPCProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </TRPCProvider>
    </ThemeProvider>
  )
}
