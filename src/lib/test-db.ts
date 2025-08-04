import { PrismaClient } from '@prisma/client'

// Test database instance
export const testDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL,
    },
  },
})

// Clean up all tables for a fresh test state
export async function cleanupTestDb() {
  const tablenames = await testDb.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ')

  try {
    if (tables.length > 0) {
      await testDb.$executeRawUnsafe(`TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE`)
    }
  } catch (error) {
    console.log({ error })
  }
}

// Seed test data
export async function seedTestData() {
  // Create test user
  const testUser = await testDb.user.create({
    data: {
      id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    },
  })

  // Create test categories
  const arrayCategory = await testDb.category.create({
    data: { name: 'Array' },
  })

  const hashCategory = await testDb.category.create({
    data: { name: 'Hash Table' },
  })

  // Create test problem
  const testProblem = await testDb.problem.create({
    data: {
      title: 'Two Sum',
      url: 'https://leetcode.com/problems/two-sum/',
      difficulty: 'EASY',
      languageUsed: 'JavaScript',
      solutionNotes: 'Use hash map for O(n) solution',
      whatWentWrong: 'Initially tried brute force',
      triggerKeywords: 'sum, hashmap',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      wasHard: false,
      userId: testUser.id,
      categories: {
        create: [
          { categoryId: arrayCategory.id },
          { categoryId: hashCategory.id },
        ],
      },
    },
  })

  return {
    testUser,
    arrayCategory,
    hashCategory,
    testProblem,
  }
}

// Close test database connection
export async function closeTestDb() {
  await testDb.$disconnect()
}