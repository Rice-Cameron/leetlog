import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking existing data...')
  
  // Check if there are any existing problems
  const existingProblems = await prisma.problem.findMany()
  console.log(`Found ${existingProblems.length} existing problems`)
  
  if (existingProblems.length > 0) {
    console.log('⚠️  There are existing problems. Skipping problem creation to avoid conflicts.')
    console.log('If you want to add sample data, please clear existing problems first.')
    return
  }
  
  // Check if user exists
  const existingUsers = await prisma.user.findMany()
  console.log(`Found ${existingUsers.length} users`)
  
  if (existingUsers.length === 0) {
    console.log('❌ No users found. Please ensure your Clerk webhook created a user first.')
    return
  }
  
  const user = existingUsers[0] // Use the first user
  console.log(`✅ Using user: ${user.firstName} ${user.lastName} (${user.id})`)
  
  // Create categories only
  const categories = [
    'Array', 'Hash Table', 'Linked List', 'Math', 'Two Pointers', 'String',
    'Binary Search', 'Divide and Conquer', 'Dynamic Programming', 'Backtracking',
    'Stack', 'Heap', 'Greedy', 'Sort', 'Bit Manipulation', 'Tree', 'Depth-First Search',
    'Binary Tree', 'Breadth-First Search', 'Union Find', 'Graph', 'Design',
    'Topological Sort', 'Trie', 'Binary Indexed Tree', 'Segment Tree', 'Binary Search Tree',
    'Recursion', 'Brainteaser', 'Memoization', 'Queue', 'Minimax', 'Reservoir Sampling',
    'Ordered Map', 'Geometry', 'Random', 'Rejection Sampling', 'Sliding Window'
  ]
  
  console.log('📂 Creating categories...')
  for (const categoryName of categories) {
    await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    })
  }
  console.log(`✅ Created ${categories.length} categories`)
  
  console.log('✨ Safe seeding completed!')
  console.log('You can now manually add problems through your app UI.')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })