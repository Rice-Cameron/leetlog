import { vi } from 'vitest'

// Utility functions for controlling authentication in tests
export const mockAuthenticatedUser = (userId: string = 'test-user-id') => {
  const { auth } = vi.hoisted(() => vi.importMock('@clerk/nextjs/server'))
  auth.mockResolvedValue({ userId })
}

export const mockUnauthenticatedUser = () => {
  const { auth } = vi.hoisted(() => vi.importMock('@clerk/nextjs/server'))
  auth.mockResolvedValue({ userId: null })
}