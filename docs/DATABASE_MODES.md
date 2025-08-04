# Database Mode System Guide

## Overview

LeetLog uses a `DATABASE_MODE` system to safely manage multiple database environments and prevent accidental data loss.

## Quick Reference

| Mode | Environment | Database Branch | Use Case |
|------|-------------|-----------------|----------|
| `1` | Development | `ep-sparkling-frog` | Daily development work |
| `2` | Production | `ep-dark-surf` | Live application data |
| `3` | Testing | `ep-restless-cloud` | Automated tests (isolated) |

## Environment Variables

```bash
# Required in .env file
DATABASE_MODE=1                    # Default: development

DATABASE_URL_DEV="postgresql://..."   # Development database
DATABASE_URL_PROD="postgresql://..."  # Production database  
DATABASE_URL_TEST="postgresql://..."  # Test database (isolated)
```

## Command Examples

### Development Work
```bash
# Use development database (default)
npm run dev
npm run seed

# Explicitly set development mode
DATABASE_MODE=1 npm run dev
```

### Production Operations
```bash
# Use production database (requires confirmation for destructive operations)
DATABASE_MODE=2 npm run seed
```

### Testing
```bash
# Tests automatically use test database (DATABASE_MODE=3 + NODE_ENV=test)
npm run test
npm run test:db
npm run test:db:reset

# Manual test mode
DATABASE_MODE=3 npm run test-db-mode
```

## Safety Features

### Automatic Protection
- **Tests**: Always use isolated test database (`ep-restless-cloud`)
- **NODE_ENV=test**: Overrides DATABASE_MODE to force test database
- **Production**: Requires explicit confirmation for destructive operations

### Validation Checks
- ✅ Test mode cannot accidentally use production database
- ✅ Runtime validation prevents cross-environment contamination  
- ✅ URL pattern matching ensures correct database selection
- ✅ Clear logging shows which database is being used

### Error Prevention
```bash
# This will FAIL with safety error:
DATABASE_MODE=3 # but with production URL configured
# Error: "Test mode attempted to use production database!"
```

## Troubleshooting

### Check Current Configuration
```bash
npm run test-db-mode
```

### Verify Test Setup
```bash
DATABASE_MODE=3 NODE_ENV=test npm run test-db-mode
```

### Common Issues

**Issue**: Tests failing with database connection errors
**Solution**: Ensure `DATABASE_URL_TEST` is configured in `.env`

**Issue**: Accidentally hitting wrong database
**Solution**: Check `npm run test-db-mode` output for active configuration

**Issue**: Production operations blocked
**Solution**: This is intentional - use explicit confirmation prompts for safety

## Migration Guide

If upgrading from the old system:

1. **Update .env**:
   ```bash
   cp .env.copy .env
   # Configure DATABASE_URL_DEV, DATABASE_URL_PROD, DATABASE_URL_TEST
   ```

2. **Remove old files**:
   ```bash
   rm .env.test.local  # No longer needed
   ```

3. **Test configuration**:
   ```bash
   npm run test-db-mode
   ```

## Best Practices

1. **Always use test commands for testing**: `npm run test` (not manual DATABASE_MODE=3)
2. **Verify configuration**: Run `npm run test-db-mode` after environment changes
3. **Use development mode for daily work**: Keep `DATABASE_MODE=1` in `.env`
4. **Never manually set DATABASE_MODE=2**: Let production deployments handle this
5. **Keep test database isolated**: Never run non-test operations on test database

## Architecture Notes

The system uses:
- **Centralized configuration** (`src/lib/db-config.ts`)
- **Runtime validation** (URL pattern matching)
- **Environment detection** (NODE_ENV + DATABASE_MODE)
- **Safety overrides** (test mode prioritization)

This ensures complete isolation between environments and prevents accidental data loss.