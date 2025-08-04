# Database Mode System Guide

Complete reference for LeetLog's `DATABASE_MODE` environment management system.

I have selected to take this approach as I am the sole contributor to the project and want to easily manage all stages. In a real work environment, a dev may rarely need to access the production database in the app, therefore not needing a solution to this problem. I found myself wanting to navigate all branches easily as I am just tinkering around with this project.

## Quick Reference

| Mode | Environment | Branch              | Auto-Selected By        |
| ---- | ----------- | ------------------- | ----------------------- |
| `1`  | Development | `ep-sparkling-frog` | Default `.env` setting  |
| `2`  | Production  | `ep-dark-surf`      | Vercel deployments      |
| `3`  | Testing     | `ep-restless-cloud` | `npm run test` commands |

## Configuration

### Environment Variables

```bash
# Required in .env
DATABASE_MODE=1                           # Default: development

# Database URLs (one for each environment)
DATABASE_URL_DEV="postgresql://..."       # Development database
DATABASE_URL_PROD="postgresql://..."      # Production database
DATABASE_URL_TEST="postgresql://..."      # Test database (isolated)
```

### Mode Selection Priority

1. **NODE_ENV=test** → Always forces test database (highest priority)
2. **Command-line override** → `DATABASE_MODE=X npm run command`
3. **Environment file** → `.env` DATABASE_MODE value
4. **Default fallback** → Development mode (1)

## Usage Examples

### Development Work

```bash
# Default development mode
npm run dev
npm run seed

# Explicit development mode
DATABASE_MODE=1 npm run dev
```

### Production Operations

```bash
# Production seeding (requires confirmation)
DATABASE_MODE=2 npm run seed

# Production operations are protected with prompts
⚠️  WARNING: You're about to perform a DESTRUCTIVE operation!
Type "CONFIRM DELETE" to proceed:
```

### Testing

```bash
# Tests automatically use test database
npm run test              # Sets DATABASE_MODE=3 NODE_ENV=test
npm run test:db           # Test database schema push
npm run test:db:reset     # Reset test database

# Manual test mode validation
DATABASE_MODE=3 npm run test-db-mode
```

## Safety Features

### Automatic Protection

- **Test isolation**: Tests never access production data
- **Production confirmation**: Destructive operations require explicit approval
- **Environment validation**: Runtime checks prevent cross-environment access
- **URL pattern matching**: Validates database branch selection

### Error Prevention

```bash
# This configuration will FAIL with safety error:
DATABASE_MODE=3           # Test mode
DATABASE_URL_TEST="postgresql://...ep-dark-surf..."  # Production URL

# Error: "Test mode attempted to use production database!"
```

## Command Reference

### Validation Commands

```bash
npm run test-db-mode      # Check current configuration
DATABASE_MODE=X npm run test-db-mode  # Test specific mode
```

### Safe Operations

```bash
npm run seed              # Add sample data (production-protected)
npm run quick-data        # Add minimal problems
npx prisma studio         # Database browser
```

### Protected Operations

```bash
npm run safe-reset        # Reset database (BLOCKED for production)
```

## Troubleshooting

### Configuration Issues

**Tests failing with database errors:**

```bash
# Check test database configuration
DATABASE_MODE=3 NODE_ENV=test npm run test-db-mode

# Ensure DATABASE_URL_TEST is set in .env
```

**"Database URL not configured" error:**

```bash
# Missing environment variables - check .env for:
DATABASE_URL_DEV    # Development mode
DATABASE_URL_PROD   # Production mode
DATABASE_URL_TEST   # Test mode
```

**Wrong database being used:**

```bash
# Validate current configuration
npm run test-db-mode

# Check for environment variable overrides
echo $DATABASE_MODE
echo $NODE_ENV
```

### Safety Violations

**Production database blocked:**

- This is intentional - production operations require explicit confirmation
- Use the confirmation prompts to proceed safely

**Test mode safety error:**

- Indicates test mode is trying to use production database URL
- Check `DATABASE_URL_TEST` configuration in `.env`

## Migration from Old System

If upgrading from manual environment switching:

1. **Update environment file:**

   ```bash
   cp .env.copy .env
   # Configure DATABASE_URL_DEV, DATABASE_URL_PROD, DATABASE_URL_TEST
   # Set DATABASE_MODE=1 for development
   ```

2. **Remove old files:**

   ```bash
   rm .env.test.local     # No longer needed
   ```

3. **Validate setup:**
   ```bash
   npm run test-db-mode   # Should show development mode
   npm run test           # Should show test mode with isolated database
   ```

## Best Practices

### Daily Development

- Keep `DATABASE_MODE=1` in your `.env` file
- Use development database for all local work
- Run `npm run test-db-mode` after environment changes

### Testing

- Always use `npm run test` (never manual DATABASE_MODE=3)
- Tests automatically use isolated test database
- Test database is completely separate from development/production

### Production

- Never manually set `DATABASE_MODE=2` for local development
- Production deployments handle this automatically
- Read confirmation prompts carefully before proceeding

### Environment Management

- Use one `.env` file with all database URLs configured
- Validate configuration with `npm run test-db-mode` after changes
- Keep test database completely isolated from other environments

## Architecture Benefits

**Safety**: Multiple validation layers prevent accidental data loss
**Isolation**: Each environment uses separate database branches  
**Automation**: Test commands automatically use correct database
**Flexibility**: Command-line overrides for specific use cases
**Validation**: Runtime checks ensure correct environment selection

This system ensures complete isolation between environments while providing the flexibility needed for development, testing, and production operations.
