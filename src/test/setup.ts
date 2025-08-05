import '@testing-library/jest-dom'
import { setupTestDatabase, teardownTestDatabase } from './test-utils'
import { vi } from 'vitest'

// Mock Clerk authentication
vi.mock('@clerk/nextjs/server', async () => {
  const actual = await vi.importActual('@clerk/nextjs/server')
  return {
    ...actual,
    auth: vi.fn().mockResolvedValue({ userId: 'test-user-id' }),
  }
})

// Global test setup - runs before each test
beforeEach(async () => {
  // Reset all mocks to default state
  vi.clearAllMocks()
  // Setup fresh test database state
  await setupTestDatabase()
})

// Global teardown - runs after all tests complete
afterAll(async () => {
  await teardownTestDatabase()
})