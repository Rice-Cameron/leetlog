# Database Scripts & Utilities

Production-safe database management scripts with built-in environment detection and safety features.

## Quick Reference

| Script | Purpose | Safety Level |
|--------|---------|--------------|
| `npm run seed` | Add sample data | ✅ Production protected |
| `npm run safe-reset` | Clear all tables | 🚫 Production blocked |
| `npm run test-db-mode` | Validate config | ✅ Safe to run anywhere |
| `npm run quick-data` | Add minimal problems | ⚠️ Requires existing user |

## Key Features

**Safety First:**
- Environment detection prevents production accidents
- Confirmation prompts for destructive operations
- DATABASE_MODE validation with runtime checks
- Automatic backup warnings before operations

## Core Scripts

### Data Management

**`seed.ts`** - Primary seeding script
```bash
npm run seed
```
- Creates sample user, categories, and 10 LeetCode problems
- Production requires "CONFIRM DELETE" prompt
- Uses `connectOrCreate` for safe category relationships

**`quick-data.ts`** - Minimal data addition
```bash
npm run quick-data
```
- Adds 3 sample problems to existing user
- Requires user record (created via Clerk webhook)

### Database Operations

**`safe-reset.ts`** - Protected database reset
```bash
npm run safe-reset
```
- **BLOCKED** for production environments
- Development requires explicit confirmation
- Respects foreign key constraints during deletion

### Configuration Testing

**`test-database-mode.ts`** - Validate DATABASE_MODE setup
```bash
npm run test-db-mode
```
- Shows current environment detection
- Validates database URL mapping
- Confirms safety isolation between environments

## DATABASE_MODE Integration

All scripts use centralized environment management:

```bash
# Automatic mode detection
npm run seed                    # Uses .env DATABASE_MODE

# Manual override
DATABASE_MODE=1 npm run seed    # Force development
DATABASE_MODE=2 npm run seed    # Force production (requires confirmation)
DATABASE_MODE=3 npm run seed    # Force test mode
```

## Safety Architecture

### Environment Detection
```typescript
// Centralized via src/lib/db-config.ts
getDatabaseConfig() // Returns: development | production | test

// Triple validation:
// 1. DATABASE_MODE value
// 2. NODE_ENV override (test always wins)
// 3. URL pattern validation
```

### Protection Levels

**Production (DATABASE_MODE=2):**
- Requires "CONFIRM DELETE" for destructive operations
- Shows data counts before operations
- Blocks `safe-reset` entirely

**Development (DATABASE_MODE=1):**
- Confirmation prompts for destructive operations
- Safe operations proceed automatically

**Test (DATABASE_MODE=3):**
- All operations proceed automatically
- Isolated database branch (`ep-restless-cloud`)

## Error Handling

**Common Issues:**
- `Database URL not configured` → Check `.env` for missing variables
- `Test mode attempted to use production database` → Safety feature working correctly
- `Cleanup failed: X records remaining` → Foreign key constraint issue

**Safety Violations:**
Scripts will **fail immediately** for:
- Test mode configured with production URL
- Missing environment configuration
- Invalid DATABASE_MODE values

## Development Utilities

### Adding New Scripts

1. **Import safety utilities:**
   ```typescript
   import { createSafeDbClient, getDatabaseEnvironment } from './db-utils'
   ```

2. **Add environment checks:**
   ```typescript
   const environment = getDatabaseEnvironment()
   if (environment === 'production') {
     // Add confirmation logic
   }
   ```

3. **Use protected client:**
   ```typescript
   const prisma = createSafeDbClient()
   ```

### Best Practices

- Always test with `npm run test-db-mode` after environment changes
- Use npm scripts instead of direct `tsx` execution
- Read confirmation prompts carefully in production
- Keep `.env` DATABASE_MODE set to development (1) for daily work

## Architecture Notes

The script system provides:
- **Centralized configuration** preventing environment mixups
- **Runtime validation** with clear error messages  
- **Consistent safety patterns** across all database operations
- **Developer-friendly** commands with automatic protections

This ensures database operations are safe, traceable, and consistent across all environments.