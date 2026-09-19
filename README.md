# ATTL School OS

ATTL (Al Thagr Technical Lab) School OS is a full-stack Next.js application for academics, projects, learning, competitions, innovation, community, mentorship and ATTL operations.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM 6
- Auth.js credentials authentication
- Zod validation
- bcrypt password hashing

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```powershell
Copy-Item .env.example .env.local
```

3. Set `DATABASE_URL` and `AUTH_SECRET`.

4. Generate Prisma Client:

```bash
npm run db:generate
```

5. Apply the schema:

```bash
npm run db:push
```

6. Seed development data:

```bash
npm run db:seed
```

7. Start the app:

```bash
npm run dev
```

## Development accounts

The seed creates:

- `student@attl.school`
- `admin@attl.school`

Both use the password supplied through `SEED_PASSWORD`. Change it before sharing a deployed environment.

## Backend architecture

- `prisma/schema.prisma` — relational School OS data model.
- `prisma/seed.ts` — development seed data.
- `lib/prisma.ts` — Prisma singleton.
- `lib/authz.ts` — server-side authorization.
- `auth.ts` — Auth.js credentials provider and session callbacks.
- `proxy.ts` — protected dashboard routing.
- `app/api/**` — server Route Handlers.

## Connected API domains

Authentication, registration, current-user profile, schedule, grades/results, assignments, projects, notifications, events, competitions, ATTL applications, innovation ideas, goals and database health are now backed by server-side APIs.

The frontend contains a larger route inventory by design. Remaining pages can be connected progressively to these domain models without changing their public URLs.
