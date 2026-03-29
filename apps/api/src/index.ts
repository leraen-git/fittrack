import Fastify from 'fastify'
import cors from '@fastify/cors'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { appRouter } from './router.js'
import { db } from './db/index.js'

// Explicit boolean guard — never truthy unless explicitly set to 'true'
const isDev = process.env['NODE_ENV'] === 'development'

const server = Fastify({ logger: { level: isDev ? 'warn' : 'info' } })

// CORS: restrict to known origins in production
const allowedOrigins = isDev
  ? true
  : (process.env['ALLOWED_ORIGINS'] ?? '').split(',').filter(Boolean)

await server.register(cors, { origin: allowedOrigins })

await server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext: async ({ req }: { req: any }) => {
      const authHeader = req.headers.authorization as string | undefined
      let userId: string | null = null

      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7)

        if (isDev) {
          // Dev only: decode without verification for local testing
          // WARNING: never reaches this branch in production (isDev = false)
          try {
            const parts = token.split('.')
            if (parts.length === 3) {
              const payload = JSON.parse(
                Buffer.from(parts[1] ?? '', 'base64url').toString('utf8'),
              )
              userId = typeof payload.sub === 'string' ? payload.sub : null
            }
          } catch {
            userId = null
          }
        } else {
          // Production: verify via Clerk SDK
          // TODO: replace with clerkClient.verifyToken(token)
          // For now, reject unverified tokens in production
          userId = null
        }
      }

      // Dev fallback: unauthenticated requests → seeded dev user (dev only)
      if (!userId && isDev) {
        const devUserId = process.env['DEV_CLERK_ID']
        if (devUserId) userId = devUserId
      }

      return { req, db, userId }
    },
  },
})

server.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

const port = Number(process.env['PORT'] ?? 3000)
await server.listen({ port, host: '0.0.0.0' })
server.log.info(`FitTrack API running on http://localhost:${port}`)
