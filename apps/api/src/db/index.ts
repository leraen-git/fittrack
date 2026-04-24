import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema.js'

const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
})

export const db = drizzle(pool, { schema })
export type DB = typeof db

export async function runPendingMigrations() {
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      `SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_plans' AND column_name = 'generated_by_ai'`
    )
    if (rows.length === 0) {
      await client.query(`ALTER TABLE workout_plans ADD COLUMN generated_by_ai boolean NOT NULL DEFAULT false`)
      console.log('[migration] Added generated_by_ai column to workout_plans')
    }
  } finally {
    client.release()
  }
}
