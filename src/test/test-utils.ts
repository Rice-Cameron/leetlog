import { testDb, cleanupTestDb, seedTestData, closeTestDb } from '@/lib/test-db'

// Setup function to run before each test
export async function setupTestDatabase() {
  await cleanupTestDb()
  return await seedTestData()
}

// Cleanup function to run after all tests
export async function teardownTestDatabase() {
  await cleanupTestDb()
  await closeTestDb()
}

// Export test database instance for direct use in tests
export { testDb }