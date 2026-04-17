#!/bin/bash
# Run this once after first deploy to set up the database.
# Usage: railway run --service api bash apps/api/scripts/setup-db.sh

set -e

echo "Running migrations..."
cd /app/apps/api
npx drizzle-kit migrate --config /app/apps/api/drizzle.config.ts

echo "Seeding exercises and programs..."
npx tsx /app/apps/api/src/db/seed.ts

echo "Done. Database is ready."
