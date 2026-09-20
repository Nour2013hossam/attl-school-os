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


## Production deployment

ATTL School OS is a dynamic Next.js application. Deploy it to a Node-compatible host such as Vercel, not GitHub Pages.

Set these production environment variables:

- `DATABASE_URL` — PostgreSQL connection string with SSL enabled.
- `AUTH_SECRET` — long random production secret.
- `NEXT_PUBLIC_APP_URL` — the public HTTPS URL of the deployed app.
- `SEED_PASSWORD` — only for controlled development/staging seed runs; do not use a shared default in production.

Before the first production launch:

1. Run `npm install`.
2. Run `npm run db:generate`.
3. Run `npm run typecheck` to verify TypeScript locally.
4. Apply the Prisma schema with your production migration process.
5. Set the environment variables on the hosting platform.
6. Deploy with `npm run build` and run with `npm start`.

The repository CI runs Prisma generation and a full Next.js production build on every push to `main`.

## Security baseline

- Credentials use bcrypt password hashing.
- Authenticated dashboard routes are protected by Auth.js.
- API mutations use server-side authorization and permission checks.
- The Super Admin role has full effective permissions.
- Sensitive management pages hide controls when the current permission is missing.
- Login, registration and password-change attempts have basic rate limiting.
- Security headers are configured in `next.config.ts`.
- Audit records cover key administrative, permission and project actions.
