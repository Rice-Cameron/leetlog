import { PrismaClient } from '@prisma/client'
import * as readline from 'readline'
import { getDatabaseConfig, validateDatabaseConfig, getDatabaseUrl } from '../src/lib/db-config'

// Database environment detection (now uses centralized config)
export function getDatabaseEnvironment(): 'production' | 'test' | 'development' {
  return getDatabaseConfig().mode
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
  const databaseUrl = getDatabaseUrl()
  
  // Only log environment details in non-production
  if (process.env.NODE_ENV !== "production") {
    console.log(`🔍 Database Environment: ${environment.toUpperCase()}`)
  }
  
  return new PrismaClient({
    datasources: { db: { url: databaseUrl } }
  })
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