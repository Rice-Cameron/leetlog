import { createSafeDbClient, getDatabaseEnvironment, confirmDestructiveOperation, createBackup } from './db-utils'

async function main() {
  const environment = getDatabaseEnvironment()
  const prisma = createSafeDbClient()
  
  console.log('Safe Database Reset Script')
  console.log('================================')
  
  // Block production resets entirely
  if (environment === 'production') {
    console.error('ERROR: BLOCKED: Production database resets are not allowed!')
    console.error('   Use specific migration scripts for production changes.')
    process.exit(1)
  }
  
  // Require confirmation for development
  if (environment === 'development') {
    const confirmed = await confirmDestructiveOperation(
      'RESET ALL DATABASE TABLES',
      environment
    )
    
    if (!confirmed) {
      console.log('Operation cancelled by user')
      process.exit(0)
    }
  }
  
  try {
    await createBackup(prisma, 'database reset')
    
    console.log('Clearing database tables...')
    
    // Delete in proper order to respect foreign keys
    await prisma.problemCategory.deleteMany({})
    console.log('   Cleared problem categories')
    
    await prisma.problem.deleteMany({})
    console.log('   Cleared problems')
    
    await prisma.category.deleteMany({})
    console.log('   Cleared categories')
    
    await prisma.user.deleteMany({})
    console.log('   Cleared users')
    
    console.log('Database reset completed safely!')
    
  } catch (error) {
    console.error('ERROR: Reset failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })