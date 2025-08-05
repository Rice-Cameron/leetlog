import { vi } from 'vitest'

// Mock auth function that can be imported
const mockAuth = vi.fn()

// Mock the entire Clerk module
vi.mock('@clerk/nextjs/server', () => ({
  auth: mockAuth
}))

// Utility functions for controlling authentication in tests
export const mockAuthenticatedUser = (userId: string = 'test-user-id') => {
  mockAuth.mockResolvedValue({ userId })
}

export const mockUnauthenticatedUser = () => {
  mockAuth.mockResolvedValue({ userId: null })
}