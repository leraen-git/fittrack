import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@fittrack/api'

export const trpc = createTRPCReact<AppRouter>()
