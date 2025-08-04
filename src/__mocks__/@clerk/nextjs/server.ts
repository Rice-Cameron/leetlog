import { vi } from 'vitest'

// Mock auth function that can be controlled in tests
let mockUserId: string | null = 'test-user-id'

export const auth = vi.fn().mockImplementation(async () => ({
  userId: mockUserId,
}))

// Test utilities to control authentication state
export const mockAuthenticatedUser = (userId: string = 'test-user-id') => {
  mockUserId = userId
  auth.mockResolvedValue({ userId })
}

export const mockUnauthenticatedUser = () => {
  mockUserId = null
  auth.mockResolvedValue({ userId: null })
}

// Reset mock to default authenticated state
export const resetAuthMock = () => {
  mockUserId = 'test-user-id'
  auth.mockResolvedValue({ userId: 'test-user-id' })
}