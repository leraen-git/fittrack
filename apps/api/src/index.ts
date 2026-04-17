import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { jwtVerify } from 'jose'
import { appRouter } from './router.js'
import { db } from './db/index.js'

const isDev = process.env['NODE_ENV'] === 'development'
const isDevAuthEnabled = process.env['ENABLE_DEV_AUTH'] === 'true'

const JWT_SECRET_RAW = process.env['JWT_SECRET']
if (!isDev && !JWT_SECRET_RAW) {
  throw new Error('JWT_SECRET is required in production')
}
// Use a fallback in dev so the server starts without config
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_RAW ?? 'dev-secret-change-in-production')

const server = Fastify({ logger: { level: isDev ? 'warn' : 'info' } })

// CORS
const allowedOrigins = isDev
  ? true
  : (process.env['ALLOWED_ORIGINS'] ?? '').split(',').filter(Boolean)
await server.register(cors, { origin: allowedOrigins })

// Rate limiting: 200 req/min per IP globally
await server.register(rateLimit, {
  global: true,
  max: 200,
  timeWindow: 60_000,
  keyGenerator: (req) =>
    ((req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim()) ?? req.ip,
})

await server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext: async ({ req }: { req: any }) => {
      let userId: string | null = null

      const authHeader = req.headers.authorization as string | undefined
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7)
        try {
          const { payload } = await jwtVerify(token, JWT_SECRET)
          // sub holds the internal user UUID we set when signing
          userId = typeof payload.sub === 'string' ? payload.sub : null
        } catch {
          // Invalid / expired token — userId stays null
          userId = null
        }
      }

      // Dev fallback: no token → seeded dev user
      // Requires ENABLE_DEV_AUTH=true as an extra safeguard
      if (!userId && isDev && isDevAuthEnabled) {
        const devUserId = process.env['DEV_USER_ID']
        if (devUserId) userId = devUserId
      }

      return { req, db, userId }
    },
  },
})

server.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

const port = Number(process.env['PORT'] ?? 3000)
await server.listen({ port, host: '0.0.0.0' })
server.log.info(`Tanren API running on http://localhost:${port}`)
