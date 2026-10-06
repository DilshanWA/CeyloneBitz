# food-server
Express 5 + TypeScript + Prisma + PostgreSQL. JWT auth with CUSTOMER / ADMIN roles.

## Setup
1. `npm install`
2. `cp .env.example .env` then set DATABASE_URL, a long JWT_SECRET, and the seed admin email/password
3. `npx prisma migrate dev --name init`
4. `npm run db:seed`
5. `npm run dev` (http://localhost:4000)

Production: `npm run db:deploy && npm run build && npm start`. Set the same env vars on your host.
