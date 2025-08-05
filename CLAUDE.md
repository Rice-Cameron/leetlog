# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm install` - Install dependencies (automatically runs `prisma generate` via postinstall)

## Database Commands

- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma migrate dev` - Create and apply new migration

## Database Mode System

LeetLog uses a sophisticated `DATABASE_MODE` system for safe database environment management:

### Environment Configuration

```bash
# In .env file:
DATABASE_MODE=1  # 1=development, 2=production, 3=test

# Each mode uses different environment variables:
DATABASE_URL_DEV   # Development database (Neon development branch)
DATABASE_URL_PROD  # Production database (Neon main branch)
DATABASE_URL_TEST  # Test database (Neon isolated test branch)
```

### Mode Selection Logic

1. **NODE_ENV=test override**: Always forces test database regardless of DATABASE_MODE
2. **Command-line override**: `DATABASE_MODE=X npm run command`
3. **Default fallback**: Uses .env DATABASE_MODE value (defaults to 1)

### Database Scripts

⚠️  **IMPORTANT**: All database scripts include environment detection and safety prompts

```bash
# Safe seeding
npm run seed          # Populate database (requires confirmation for production)
npm run safe-seed     # Alternative seeding script  
npm run quick-data    # Add sample problems (requires existing user)

# Database operations
npm run safe-reset    # Reset tables (BLOCKED for production)
npm run test-db-mode  # Test DATABASE_MODE configuration

# Test commands (automatically use DATABASE_MODE=3)
npm run test          # Run tests with isolated test database
npm run test:db       # Push schema to test database
npm run test:db:reset # Reset test database schema
```

### Safety Architecture

**Triple-Layer Protection:**
1. **DATABASE_MODE validation**: Explicit mode selection with URL validation
2. **NODE_ENV override**: `NODE_ENV=test` always forces test database
3. **Runtime safety checks**: Prevents test mode from using production URLs

**Database Branch Mapping:**
- **Development**: `ep-sparkling-frog` (DATABASE_MODE=1)
- **Production**: `ep-dark-surf` (DATABASE_MODE=2)  
- **Testing**: `ep-restless-cloud` (DATABASE_MODE=3)

**Critical Safety Features:**
- Tests automatically set `DATABASE_MODE=3 NODE_ENV=test`
- Production operations require explicit confirmation
- Test database completely isolated from production
- Runtime validation prevents cross-environment contamination

## Architecture Overview

LeetLog is a Next.js 15 application for tracking LeetCode problem-solving progress. Key architectural patterns:

### Database Layer
- **Prisma ORM** with PostgreSQL (Neon) for data persistence
- **Schema**: Users, Problems, Categories with many-to-many relationships
- **Authentication**: Clerk handles user management with cascade deletes on user removal

### API Layer
- **Next.js App Router** API routes in `/src/app/api/`
- **Authentication**: Clerk middleware protects routes matching `/problems(.*)`, `/new(.*)`, `/api/problems(.*)`
- **Main endpoints**: 
  - `GET /api/problems` - Fetch user's problems with categories
  - `POST /api/problems` - Create new problem with category associations
  - `GET /api/problems/[id]` - Get specific problem details

### Frontend Architecture
- **App Router** structure with TypeScript
- **Components**: Reusable UI components in `/src/components/`
- **Types**: Centralized TypeScript definitions in `/src/types/problem.ts`
- **Styling**: Tailwind CSS 4 with Geist font

### Key Data Models
- **Problem**: Core entity tracking LeetCode solutions with metadata (difficulty, complexity, notes, categories)
- **Category**: Flexible tagging system with automatic creation via `connectOrCreate`
- **User**: Clerk-managed authentication with cascading problem deletion

### Authentication Flow
- Clerk handles sign-up/sign-in with middleware protection
- User creation via webhook at `/api/webhooks/clerk/route.ts`
- Maintenance mode support via `MAINTENANCE_MODE` environment variable

## Development Notes

- Uses **Turbopack** for faster development builds
- **TypeScript strict mode** enabled
- **Path alias**: `@/*` maps to `./src/*`
- **Database**: Neon PostgreSQL for both development and production
- **Deployment**: Vercel-optimized with automatic Prisma client generation

## Environment Setup

Copy `.env.copy` to `.env` and configure:
- `DATABASE_URL` - Neon PostgreSQL connection string
- Clerk authentication variables
- Optional `MAINTENANCE_MODE=1` for maintenance pages