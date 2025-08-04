# Technical Architecture

Implementation details and patterns for the LeetLog application.

## Stack Overview

**Full-Stack Architecture:**
- **Frontend**: Next.js 15 App Router, React 19, TypeScript 5, Tailwind CSS 4
- **Backend**: Next.js API routes, Prisma ORM, PostgreSQL (Neon)
- **Auth**: Clerk with webhook-based user management
- **Testing**: Vitest, React Testing Library, isolated database testing
- **Deployment**: Vercel with automatic deployments

## Database Architecture

### Schema Design
```prisma
User {
  id        String   @id      # Clerk user ID
  problems  Problem[]
}

Problem {
  title           String
  difficulty      Difficulty
  categories      ProblemCategory[]
  userId          String
  // ... complexity, notes, etc.
}

Category {
  name     String   @unique
  problems ProblemCategory[]
}
```

### DATABASE_MODE System
Centralized environment management in `src/lib/db-config.ts`:

```typescript
export function getDatabaseConfig(): DatabaseConfig {
  // 1=dev, 2=prod, 3=test
  // NODE_ENV=test override always forces test database
}
```

**Environment Isolation:**
- Development: `ep-sparkling-frog` (Neon branch)
- Production: `ep-dark-surf` (Neon main branch)  
- Testing: `ep-restless-cloud` (isolated branch)

## API Design

### Authentication Flow
```typescript
// Clerk middleware protection
export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})

// Webhook user creation
POST /api/webhooks/clerk -> creates User record
```

### Core Endpoints
- `GET /api/problems` - Fetch user's problems with eager-loaded categories
- `POST /api/problems` - Create problem with automatic category creation
- `GET /api/problems/[id]` - Individual problem details

## Testing Infrastructure

### Test Database Isolation
```typescript
// test-db.ts - enforces test mode
if (!isTestMode()) {
  throw new Error('test-db.ts can only be used in test mode!')
}

// Automatic cleanup between tests
beforeEach(async () => {
  await cleanupTestDb()
  await seedTestData()
})
```

### Test Configuration
- **Sequential execution**: `fileParallelism: false` prevents database race conditions
- **Automatic mode**: Test commands set `DATABASE_MODE=3 NODE_ENV=test`
- **Mock authentication**: Clerk auth mocked with configurable user states

## Key Implementation Patterns

### Safe Database Operations
```typescript
// Production protection
if (environment === 'production') {
  const confirmed = await confirmDestructiveOperation(
    'SEED PRODUCTION DATABASE',
    environment
  )
  if (!confirmed) process.exit(0)
}
```

### Dynamic Category Creation
```typescript
// Automatic category creation during problem submission
categories: {
  create: categories.map(name => ({
    category: {
      connectOrCreate: {
        where: { name },
        create: { name }
      }
    }
  }))
}
```

### Type Safety
- **Strict TypeScript** with comprehensive type definitions
- **Prisma-generated types** for database entities
- **Path aliases**: `@/*` maps to `./src/*`

## Development Workflow

### Local Setup with Webhooks
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Expose with ngrok
ngrok http 3000

# Configure Clerk webhook
# URL: https://your-ngrok-url.ngrok.io/api/webhooks/clerk
# Events: user.created, user.updated, user.deleted
```

### Database Management
```bash
# Safe operations
npm run seed              # Production-protected seeding
npm run test-db-mode     # Validate configuration

# Development utilities  
npx prisma studio        # Database browser
npx prisma generate      # Regenerate client
```

## File Organization

```
src/
├── app/
│   ├── api/             # API routes
│   ├── problems/        # Problem management pages
│   └── new/            # Problem creation
├── components/         # Reusable UI components
├── lib/
│   ├── db-config.ts    # Database configuration
│   ├── prisma.ts       # Prisma client
│   └── test-db.ts      # Test database utilities
├── types/              # TypeScript definitions
└── test/               # Test setup and utilities
```

## Performance Considerations

### Database Optimization
- **Indexed queries**: `@@index([userId])` on Problem model
- **Eager loading**: Categories loaded with problems in API responses
- **Connection pooling**: Neon's built-in pooling for production

### Frontend Optimization
- **Turbopack**: Faster development builds (`npm run dev --turbopack`)
- **Next.js optimizations**: Automatic code splitting and optimization
- **Font optimization**: Geist font via `next/font`

## Deployment Architecture

### Vercel Configuration
- **Environment variables**: Production uses `DATABASE_MODE=2`
- **Build optimization**: Automatic Prisma client generation via `postinstall`
- **Edge deployment**: Global CDN with edge functions

### Database Migrations
- **Development**: `npx prisma db push` for schema changes
- **Production**: Prisma migrations with version control
- **Safety**: DATABASE_MODE system prevents accidental production operations

## Security Measures

### Database Safety
- **Multi-layer validation**: DATABASE_MODE + NODE_ENV + URL pattern matching
- **Production locks**: Destructive operations require explicit confirmation
- **Environment isolation**: Each mode uses separate database branches
- **Runtime validation**: Prevents test mode from accessing production URLs

### Authentication Security
- **Clerk integration**: Industry-standard auth with webhook verification
- **Route protection**: Middleware-based protection for sensitive routes
- **User isolation**: All data scoped to authenticated user ID

This architecture provides a robust, scalable foundation with comprehensive safety measures for database operations and testing.