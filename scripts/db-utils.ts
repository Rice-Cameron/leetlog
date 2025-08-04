import { PrismaClient } from '@prisma/client'
import * as readline from 'readline'

// Database environment detection
export function getDatabaseEnvironment(): 'production' | 'test' | 'development' {
  const dbUrl = process.env.DATABASE_URL || ''
  const nodeEnv = process.env.NODE_ENV || ''
  
  console.log(`🔍 Environment Detection:`)
  console.log(`   NODE_ENV: ${nodeEnv}`)
  console.log(`   DATABASE_URL: ${dbUrl ? dbUrl.substring(0, 60) + '...' : 'NOT SET'}`)
  console.log(`   DATABASE_URL_TEST: ${process.env.DATABASE_URL_TEST ? 'SET' : 'NOT SET'}`)
  
  // Strong test environment indicators (highest priority)
  if (nodeEnv === 'test' || 
      process.env.DATABASE_URL_TEST || 
      dbUrl.includes('-test') ||
      dbUrl.includes('test-') ||
      dbUrl.includes('test.') ||
      dbUrl.includes('/test')) {
    console.log(`   ✅ Detected: TEST environment`)
    return 'test'
  }
  
  // Production environment indicators
  const productionIndicators = [
    dbUrl.includes('neon.tech'),
    dbUrl.includes('amazonaws.com'),
    dbUrl.includes('planetscale.com'),
    dbUrl.includes('railway.app'),
    nodeEnv === 'production',
    // Add more cloud providers as needed
  ]
  
  const isProduction = productionIndicators.some(indicator => indicator)
  
  if (isProduction) {
    console.log(`   ⚠️  Detected: PRODUCTION environment`)
    console.log(`   🔍 Production indicators found:`)
    if (dbUrl.includes('neon.tech')) console.log(`      - Neon database detected`)
    if (nodeEnv === 'production') console.log(`      - NODE_ENV=production`)
    return 'production'
  }
  
  console.log(`   ℹ️  Detected: DEVELOPMENT environment (default)`)
  return 'development'
}

// Safety confirmation for destructive operations
export async function confirmDestructiveOperation(
  operation: string,
  environment: string
): Promise<boolean> {
  if (environment === 'test') {
    return true // Skip confirmation for tests
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const question = `
⚠️  WARNING: You're about to perform a DESTRUCTIVE operation!
   Operation: ${operation}
   Environment: ${environment.toUpperCase()}
   Database: ${process.env.DATABASE_URL?.substring(0, 50)}...

Type "CONFIRM DELETE" to proceed (anything else cancels): `

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer === 'CONFIRM DELETE')
    })
  })
}

// Safe database client with environment awareness
export function createSafeDbClient(): PrismaClient {
  const environment = getDatabaseEnvironment()
  
  console.log(`🔍 Database Environment: ${environment.toUpperCase()}`)
  console.log(`📊 Database URL: ${process.env.DATABASE_URL?.substring(0, 50)}...`)
  
  return new PrismaClient()
}

// Backup operations before destructive changes
export async function createBackup(prisma: PrismaClient, operation: string) {
  const environment = getDatabaseEnvironment()
  
  if (environment === 'production') {
    console.log(`📋 Creating backup before ${operation}...`)
    
    try {
      const userCount = await prisma.user.count()
      const problemCount = await prisma.problem.count()
      const categoryCount = await prisma.category.count()
      
      console.log(`📊 Backup Summary:`)
      console.log(`   Users: ${userCount}`)
      console.log(`   Problems: ${problemCount}`) 
      console.log(`   Categories: ${categoryCount}`)
      console.log(`   Timestamp: ${new Date().toISOString()}`)
      
      // In a real app, you'd export this data to files
      console.log(`⚠️  Note: Consider running 'pg_dump' for full backup`)
      
    } catch (error) {
      console.error('❌ Backup failed:', error)
      throw new Error('Cannot proceed without backup verification')
    }
  }
}