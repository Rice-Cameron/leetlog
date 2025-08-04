import '@testing-library/jest-dom'
import { setupTestDatabase, teardownTestDatabase } from './test-utils'

// Global test setup - runs before each test
beforeEach(async () => {
  // Setup fresh test database state
  await setupTestDatabase()
})

// Global teardown - runs after all tests complete
afterAll(async () => {
  await teardownTestDatabase()
})