import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const migrationsFolder = path.resolve(__dirname, '../../src/db/migrations')

const pool = new Pool({ connectionString: process.env['DATABASE_URL'] })
const db = drizzle(pool)

console.log('Running migrations from', migrationsFolder)
await migrate(db, { migrationsFolder })
console.log('Migrations complete.')

await pool.end()
process.exit(0)
