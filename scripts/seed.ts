import { PrismaClient } from "@prisma/client";
import {
  createSafeDbClient,
  getDatabaseEnvironment,
  confirmDestructiveOperation,
  createBackup,
} from "./db-utils";

const prisma = createSafeDbClient();

const categories = [
  "Array",
  "Hash Table",
  "Linked List",
  "Math",
  "Two Pointers",
  "String",
  "Binary Search",
  "Divide and Conquer",
  "Dynamic Programming",
  "Backtracking",
  "Stack",
  "Heap",
  "Greedy",
  "Sort",
  "Bit Manipulation",
  "Tree",
  "Depth-First Search",
  "Binary Tree",
  "Breadth-First Search",
  "Union Find",
  "Graph",
  "Design",
  "Topological Sort",
  "Trie",
  "Binary Indexed Tree",
  "Segment Tree",
  "Binary Search Tree",
  "Recursion",
  "Brainteaser",
  "Memoization",
  "Queue",
  "Minimax",
  "Reservoir Sampling",
  "Ordered Map",
  "Geometry",
  "Random",
  "Rejection Sampling",
  "Sliding Window",
];

const sampleProblems = [
  {
    title: "Two Sum",
    url: "https://leetcode.com/problems/two-sum/",
    difficulty: "EASY" as const,
    languageUsed: "JavaScript",
    solutionNotes: "Use hash map to store complements and their indices",
    whatWentWrong: "Initially tried brute force O(n²) solution",
    triggerKeywords: "complement, hash map, indices",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    wasHard: false,
    categories: ["Array", "Hash Table"],
    dateSolved: new Date('2025-01-15T10:30:00Z'),
  },
  {
    title: "Add Two Numbers",
    url: "https://leetcode.com/problems/add-two-numbers/",
    difficulty: "MEDIUM" as const,
    languageUsed: "Python",
    solutionNotes: "Simulate addition with carry, create new linked list",
    whatWentWrong: "Forgot to handle final carry case",
    triggerKeywords: "linked list, carry, simulation",
    timeComplexity: "O(max(m,n))",
    spaceComplexity: "O(max(m,n))",
    wasHard: true,
    categories: ["Linked List", "Math"],
    dateSolved: new Date('2025-01-28T14:15:00Z'),
  },
  {
    title: "Longest Substring Without Repeating Characters",
    url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    difficulty: "MEDIUM" as const,
    languageUsed: "Java",
    solutionNotes: "Sliding window with hash set to track characters",
    whatWentWrong: "Had off-by-one errors with window boundaries",
    triggerKeywords: "sliding window, hash set, substring",
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(m,n))",
    wasHard: false,
    categories: ["Hash Table", "String", "Sliding Window"],
    dateSolved: new Date('2025-02-28T14:15:00Z'),
  },
  {
    title: "Median of Two Sorted Arrays",
    url: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    difficulty: "HARD" as const,
    languageUsed: "C++",
    solutionNotes: "Binary search on smaller array to find partition",
    whatWentWrong: "Complex edge cases with array boundaries",
    triggerKeywords: "binary search, partition, median",
    timeComplexity: "O(log(min(m,n)))",
    spaceComplexity: "O(1)",
    wasHard: true,
    categories: ["Array", "Binary Search", "Divide and Conquer"],
    dateSolved: new Date('2025-02-28T14:15:00Z'),
  },
  {
    title: "Longest Palindromic Substring",
    url: "https://leetcode.com/problems/longest-palindromic-substring/",
    difficulty: "MEDIUM" as const,
    languageUsed: "Python",
    solutionNotes: "Expand around centers approach",
    whatWentWrong: "Initially missed even-length palindromes",
    triggerKeywords: "palindrome, expand around center, substring",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    wasHard: false,
    categories: ["String", "Dynamic Programming"],
    dateSolved: new Date('2025-02-28T14:15:00Z'),
  },
  {
    title: "ZigZag Conversion",
    url: "https://leetcode.com/problems/zigzag-conversion/",
    difficulty: "MEDIUM" as const,
    languageUsed: "JavaScript",
    solutionNotes: "Mathematical pattern to directly place characters",
    whatWentWrong: "Struggled with the mathematical formula",
    triggerKeywords: "pattern, mathematical, string manipulation",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    wasHard: true,
    categories: ["String"],
    dateSolved: new Date('2025-03-28T14:15:00Z'),
  },
  {
    title: "Reverse Integer",
    url: "https://leetcode.com/problems/reverse-integer/",
    difficulty: "MEDIUM" as const,
    languageUsed: "Java",
    solutionNotes: "Handle overflow by checking before multiplication",
    whatWentWrong: "Overflow handling was tricky",
    triggerKeywords: "overflow, integer manipulation, bounds checking",
    timeComplexity: "O(log(x))",
    spaceComplexity: "O(1)",
    wasHard: false,
    categories: ["Math"],
    dateSolved: new Date('2025-04-28T14:15:00Z'),
  },
  {
    title: "String to Integer (atoi)",
    url: "https://leetcode.com/problems/string-to-integer-atoi/",
    difficulty: "MEDIUM" as const,
    languageUsed: "C++",
    solutionNotes: "Careful state machine for parsing",
    whatWentWrong: "Many edge cases with whitespace and signs",
    triggerKeywords: "parsing, state machine, edge cases",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    wasHard: true,
    categories: ["String"],
    dateSolved: new Date('2025-04-28T14:15:00Z'),
  },
  {
    title: "Palindrome Number",
    url: "https://leetcode.com/problems/palindrome-number/",
    difficulty: "EASY" as const,
    languageUsed: "Python",
    solutionNotes: "Reverse half the number to avoid overflow",
    whatWentWrong: "Initially converted to string which was not optimal",
    triggerKeywords: "palindrome, number reversal, optimization",
    timeComplexity: "O(log(n))",
    spaceComplexity: "O(1)",
    wasHard: false,
    categories: ["Math"],
    dateSolved: new Date('2025-05-28T14:15:00Z'),
  },
  {
    title: "Regular Expression Matching",
    url: "https://leetcode.com/problems/regular-expression-matching/",
    difficulty: "HARD" as const,
    languageUsed: "Java",
    solutionNotes: "Dynamic programming with 2D table",
    whatWentWrong: "Complex state transitions with * and .",
    triggerKeywords: "dynamic programming, regex, state transitions",
    timeComplexity: "O(mn)",
    spaceComplexity: "O(mn)",
    wasHard: true,
    categories: ["String", "Dynamic Programming", "Recursion"],
    dateSolved: new Date('2025-05-27T14:15:00Z'),
  },
];

async function main() {
  const environment = getDatabaseEnvironment();
  console.log("Starting database seeding...");

  // Warn for production seeding
  if (environment === "production") {
    const confirmed = await confirmDestructiveOperation(
      "SEED PRODUCTION DATABASE (will add sample data)",
      environment
    );

    if (!confirmed) {
      console.log("Seeding cancelled by user");
      process.exit(0);
    }

    await createBackup(prisma, "seeding");
  }

  try {
    // Create my clerk user
    console.log("Creating sample user...");
    const user = await prisma.user.upsert({
      where: { id: "sample-user-id" },
      update: {},
      create: {
        id: process.env.CLERK_USER_ID || "sample-user-id",
        email: "cameron5237@gmail.com",
        firstName: "Cameron",
        lastName: "Rice",
      },
    });
    console.log(`Created user: ${user.firstName} ${user.lastName}`);

    // Create categories
    console.log("Creating categories...");
    for (const categoryName of categories) {
      await prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: { name: categoryName },
      });
    }
    console.log(`Created ${categories.length} categories`);

    // Create problems with their category relationships
    console.log("Creating problems...");
    for (const problemData of sampleProblems) {
      const { categories: problemCategories, ...problemFields } = problemData;

      const problem = await prisma.problem.create({
        data: {
          ...problemFields,
          userId: user.id,
          categories: {
            create: problemCategories.map((categoryName) => ({
              category: {
                connect: { name: categoryName },
              },
            })),
          },
        },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      });

      console.log(
        `Created problem: ${problem.title} with ${problem.categories.length} categories`
      );
    }

    console.log("Database seeding completed successfully!");
    console.log(`Summary:`);
    console.log(`   - 1 user created`);
    console.log(`   - ${categories.length} categories created`);
    console.log(`   - ${sampleProblems.length} problems created`);
    console.log(`   - Problem-category relationships established`);
  } catch (error) {
    console.error("ERROR: Error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
