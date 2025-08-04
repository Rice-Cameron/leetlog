import { PrismaClient } from '@prisma/client'

// Test database instance - create fresh client for tests
export const testDb = new PrismaClient()

// Clean up all tables for a fresh test state
export async function cleanupTestDb() {
  try {
    // Delete in order to respect foreign key constraints
    await testDb.problemCategory.deleteMany()
    await testDb.problem.deleteMany()
    await testDb.category.deleteMany()
    await testDb.user.deleteMany()
  } catch (error) {
    console.log('Cleanup error:', error)
  }
}

// Seed test data
export async function seedTestData() {
  // Create test user
  const testUser = await testDb.user.upsert({
    where: { id: 'test-user-id' },
    update: {},
    create: {
      id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    },
  })

  // Create test categories
  const arrayCategory = await testDb.category.upsert({
    where: { name: 'Array' },
    update: {},
    create: { name: 'Array' },
  })

  const hashCategory = await testDb.category.upsert({
    where: { name: 'Hash Table' },
    update: {},
    create: { name: 'Hash Table' },
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
      triggerKeywords: ['sum', 'hashmap'],
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