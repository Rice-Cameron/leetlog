import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Get user ID from environment variable or use fallback
  const userId = process.env.CLERK_USER_ID || 'test-user-id'
  
  console.log('Adding a few sample problems...')
  
  // Clear categories first since they should be created dynamically
  await prisma.problemCategory.deleteMany()
  await prisma.category.deleteMany()
  console.log('Cleared pre-seeded categories')
  
  // Add 3 simple problems
  const problems = [
    {
      title: 'Two Sum',
      url: 'https://leetcode.com/problems/two-sum/',
      difficulty: 'EASY' as const,
      languageUsed: 'JavaScript',
      solutionNotes: 'Used hash map approach',
      whatWentWrong: 'Initially tried brute force',
      triggerKeywords: 'array, hash-table',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      wasHard: false,
      categories: ['Array', 'Hash Table']
    },
    {
      title: 'Valid Parentheses',
      url: 'https://leetcode.com/problems/valid-parentheses/',
      difficulty: 'EASY' as const,
      languageUsed: 'Python',
      solutionNotes: 'Stack-based solution',
      whatWentWrong: 'Forgot edge case of empty string',
      triggerKeywords: 'stack, string',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      wasHard: false,
      categories: ['Stack', 'String']
    },
    {
      title: 'Best Time to Buy and Sell Stock',
      url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
      difficulty: 'EASY' as const,
      languageUsed: 'Java',
      solutionNotes: 'Single pass, track minimum price',
      whatWentWrong: 'Overcomplicated with nested loops initially',
      triggerKeywords: 'array, dynamic-programming',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      wasHard: false,
      categories: ['Array', 'Dynamic Programming']
    }
  ]
  
  for (const problemData of problems) {
    const { categories, ...problemFields } = problemData
    
    const problem = await prisma.problem.create({
      data: {
        ...problemFields,
        userId,
        categories: {
          create: categories.map(categoryName => ({
            category: {
              connectOrCreate: {
                where: { name: categoryName },
                create: { name: categoryName }
              }
            }
          }))
        }
      }
    })
    
    console.log(`Added: ${problem.title}`)
  }
  
  console.log('Quick data setup complete!')
}

main()
  .catch((e) => {
    console.error('ERROR:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })