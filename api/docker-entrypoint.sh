#!/bin/sh
set -eu
npx prisma migrate deploy
npx ts-node --transpile-only prisma/seed.ts
exec node dist/main.js
