import { PrismaClient } from '@prisma/client'

// Mock Prisma client for tests
export const mockPrisma = {
  user: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  problem: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  category: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    connectOrCreate: vi.fn(),
  },
  $queryRaw: vi.fn(),
  $executeRawUnsafe: vi.fn(),
  $disconnect: vi.fn(),
} as unknown as PrismaClient

// Helper to reset all mocks
export function resetPrismaMocks() {
  vi.resetAllMocks()
}