import { describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from './route'
import { GET as GET_BY_ID, PUT, DELETE } from './[id]/route'
import { testDb } from '@/test/test-utils'
import { CreateProblem } from '@/types/problem'

const mockAuth = vi.hoisted(() => vi.fn())
vi.mock('@clerk/nextjs/server', () => ({
  auth: mockAuth
}))

describe('Problems API Integration Tests - Full CRUD Workflows', () => {
  const testUserId = 'integration-test-user'
  const alternateUserId = 'other-user'

  beforeEach(async () => {
    mockAuth.mockResolvedValue({ userId: testUserId })
    
    // Ensure test users exist in database
    await testDb.user.upsert({
      where: { id: testUserId },
      update: {},
      create: {
        id: testUserId,
        email: 'integration-test@example.com',
        firstName: 'Integration',
        lastName: 'Test',
      }
    })
    
    await testDb.user.upsert({
      where: { id: alternateUserId },
      update: {},
      create: {
        id: alternateUserId,
        email: 'other-user@example.com',
        firstName: 'Other',
        lastName: 'User',
      }
    })
  })

  describe('CREATE Problem Workflow', () => {
    it('should create a new problem with categories and return full problem data', async () => {
      const createData: CreateProblem = {
        title: 'Valid Parentheses',
        url: 'https://leetcode.com/problems/valid-parentheses/',
        difficulty: 'EASY',
        languageUsed: 'TypeScript',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        categories: ['Stack', 'String'],
        triggerKeywords: 'stack, parentheses',
        solutionNotes: 'Use stack to track opening brackets',
        whatWentWrong: 'Forgot edge case with empty string',
        wasHard: false,
      }

      const req = new NextRequest('http://localhost/api/problems', {
        method: 'POST',
        body: JSON.stringify(createData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(req)
      const problem = await response.json()

      expect(response.status).toBe(200)
      expect(problem).toMatchObject({
        title: createData.title,
        url: createData.url,
        difficulty: createData.difficulty,
        languageUsed: createData.languageUsed,
        timeComplexity: createData.timeComplexity,
        spaceComplexity: createData.spaceComplexity,
        triggerKeywords: createData.triggerKeywords,
        solutionNotes: createData.solutionNotes,
        whatWentWrong: createData.whatWentWrong,
        wasHard: createData.wasHard,
        userId: testUserId,
      })
      expect(problem.id).toBeDefined()
      expect(problem.createdAt).toBeDefined()
      expect(problem.updatedAt).toBeDefined()

      // Verify categories were created and linked
      const dbProblem = await testDb.problem.findUnique({
        where: { id: problem.id },
        include: {
          categories: {
            include: { category: true }
          }
        }
      })
      
      expect(dbProblem?.categories).toHaveLength(2)
      const categoryNames = dbProblem?.categories.map(pc => pc.category.name).sort()
      expect(categoryNames).toEqual(['Stack', 'String'])
    })

    it('should fail to create problem when unauthenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })

      const createData: CreateProblem = {
        title: 'Test Problem',
        url: 'https://leetcode.com/problems/test/',
        difficulty: 'EASY',
        languageUsed: 'JavaScript',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        categories: ['Test'],
        triggerKeywords: 'test',
        solutionNotes: 'Test',
        whatWentWrong: 'None',
        wasHard: false,
      }

      const req = new NextRequest('http://localhost/api/problems', {
        method: 'POST',
        body: JSON.stringify(createData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(req)
      expect(response.status).toBe(401)
      
      const error = await response.json()
      expect(error.error).toBe('Unauthorized')
    })

    it('should deduplicate category names automatically', async () => {
      const createData: CreateProblem = {
        title: 'Array Problem',
        url: 'https://leetcode.com/problems/array-problem/',
        difficulty: 'MEDIUM',
        languageUsed: 'Python',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        categories: ['Array', 'Stack', 'Array'], // Duplicate category should be handled
        triggerKeywords: 'array',
        solutionNotes: 'Two pointers approach',
        whatWentWrong: 'None',
        wasHard: false,
      }

      const req = new NextRequest('http://localhost/api/problems', {
        method: 'POST',
        body: JSON.stringify(createData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(req)
      const problem = await response.json()

      expect(response.status).toBe(200)

      // Verify categories were deduplicated
      const dbProblem = await testDb.problem.findUnique({
        where: { id: problem.id },
        include: {
          categories: {
            include: { category: true }
          }
        }
      })
      
      expect(dbProblem?.categories).toHaveLength(2) // Should only have 2 unique categories
      const categoryNames = dbProblem?.categories.map(pc => pc.category.name).sort()
      expect(categoryNames).toEqual(['Array', 'Stack'])
    })
  })

  describe('READ Problem Workflows', () => {
    let createdProblemId: number

    beforeEach(async () => {
      // Create a test problem for reading tests
      const createData: CreateProblem = {
        title: 'Test Read Problem',
        url: 'https://leetcode.com/problems/test-read/',
        difficulty: 'MEDIUM',
        languageUsed: 'Java',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        categories: ['Binary Search', 'Array'],
        triggerKeywords: 'binary search',
        solutionNotes: 'Standard binary search implementation',
        whatWentWrong: 'Off-by-one error initially',
        wasHard: true,
      }

      const req = new NextRequest('http://localhost/api/problems', {
        method: 'POST',
        body: JSON.stringify(createData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(req)
      const problem = await response.json()
      createdProblemId = problem.id
    })

    it('should fetch all problems for authenticated user', async () => {
      const response = await GET()
      const problems = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(problems)).toBe(true)
      expect(problems.length).toBeGreaterThan(0)

      // Find our test problem
      const testProblem = problems.find((p: { id: number }) => p.id === createdProblemId)
      expect(testProblem).toBeDefined()
      expect(testProblem.title).toBe('Test Read Problem')
      expect(testProblem.categories).toEqual(['Binary Search', 'Array'])
    })

    it('should fetch specific problem by ID', async () => {
      const mockParams = Promise.resolve({ id: createdProblemId.toString() })
      const mockRequest = new NextRequest('http://localhost/api/problems/' + createdProblemId)

      const response = await GET_BY_ID(mockRequest, { params: mockParams })
      const problem = await response.json()

      expect(response.status).toBe(200)
      expect(problem.id).toBe(createdProblemId)
      expect(problem.title).toBe('Test Read Problem')
      expect(problem.difficulty).toBe('MEDIUM')
      expect(problem.languageUsed).toBe('Java')
      expect(problem.timeComplexity).toBe('O(log n)')
      expect(problem.spaceComplexity).toBe('O(1)')
      expect(problem.wasHard).toBe(true)
      expect(problem.categories).toHaveLength(2)
    })

    it('should return 404 for non-existent problem', async () => {
      const mockParams = Promise.resolve({ id: '99999' })
      const mockRequest = new NextRequest('http://localhost/api/problems/99999')

      const response = await GET_BY_ID(mockRequest, { params: mockParams })
      
      expect(response.status).toBe(404)
      const error = await response.json()
      expect(error.error).toBe('Problem not found')
    })

    it('should not allow access to other users problems', async () => {
      // Create problem as different user
      mockAuth.mockResolvedValue({ userId: alternateUserId })
      
      const mockParams = Promise.resolve({ id: createdProblemId.toString() })
      const mockRequest = new NextRequest('http://localhost/api/problems/' + createdProblemId)

      const response = await GET_BY_ID(mockRequest, { params: mockParams })
      
      expect(response.status).toBe(404)
      const error = await response.json()
      expect(error.error).toBe('Problem not found')
    })

    it('should return 401 for unauthenticated GET requests', async () => {
      mockAuth.mockResolvedValue({ userId: null })

      const response = await GET()
      expect(response.status).toBe(401)

      const mockParams = Promise.resolve({ id: createdProblemId.toString() })
      const mockRequest = new NextRequest('http://localhost/api/problems/' + createdProblemId)
      const singleResponse = await GET_BY_ID(mockRequest, { params: mockParams })
      expect(singleResponse.status).toBe(401)
    })
  })

  describe('UPDATE Problem Workflow', () => {
    let createdProblemId: number

    beforeEach(async () => {
      // Create a test problem for updating tests
      const createData: CreateProblem = {
        title: 'Original Title',
        url: 'https://leetcode.com/problems/original/',
        difficulty: 'EASY',
        languageUsed: 'JavaScript',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        categories: ['Array'],
        triggerKeywords: 'original',
        solutionNotes: 'Original solution',
        whatWentWrong: 'Original issue',
        wasHard: false,
      }

      const req = new NextRequest('http://localhost/api/problems', {
        method: 'POST',
        body: JSON.stringify(createData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(req)
      const problem = await response.json()
      createdProblemId = problem.id
    })

    it('should update existing problem completely', async () => {
      const updateData: CreateProblem = {
        title: 'Updated Title',
        url: 'https://leetcode.com/problems/updated/',
        difficulty: 'HARD',
        languageUsed: 'Python',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        categories: ['Dynamic Programming', 'Hash Table'],
        triggerKeywords: 'updated, dp',
        solutionNotes: 'Updated solution with DP',
        whatWentWrong: 'Updated issue description',
        wasHard: true,
      }

      const mockParams = Promise.resolve({ id: createdProblemId.toString() })
      const mockRequest = new NextRequest('http://localhost/api/problems/' + createdProblemId, {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await PUT(mockRequest, { params: mockParams })
      const updatedProblem = await response.json()

      expect(response.status).toBe(200)
      expect(updatedProblem.id).toBe(createdProblemId)
      expect(updatedProblem.title).toBe('Updated Title')
      expect(updatedProblem.difficulty).toBe('HARD')
      expect(updatedProblem.languageUsed).toBe('Python')
      expect(updatedProblem.timeComplexity).toBe('O(n log n)')
      expect(updatedProblem.spaceComplexity).toBe('O(n)')
      expect(updatedProblem.wasHard).toBe(true)

      // Verify categories were updated
      const dbProblem = await testDb.problem.findUnique({
        where: { id: createdProblemId },
        include: {
          categories: {
            include: { category: true }
          }
        }
      })
      
      expect(dbProblem?.categories).toHaveLength(2)
      const categoryNames = dbProblem?.categories.map(pc => pc.category.name).sort()
      expect(categoryNames).toEqual(['Dynamic Programming', 'Hash Table'])
    })

    it('should return 404 when updating non-existent problem', async () => {
      const updateData: CreateProblem = {
        title: 'Non-existent',
        url: 'https://leetcode.com/problems/none/',
        difficulty: 'EASY',
        languageUsed: 'JavaScript',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        categories: ['Test'],
        triggerKeywords: 'test',
        solutionNotes: 'Test',
        whatWentWrong: 'None',
        wasHard: false,
      }

      const mockParams = Promise.resolve({ id: '99999' })
      const mockRequest = new NextRequest('http://localhost/api/problems/99999', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await PUT(mockRequest, { params: mockParams })
      
      expect(response.status).toBe(404)
      const error = await response.json()
      expect(error.error).toBe('Problem not found')
    })

    it('should not allow updating other users problems', async () => {
      const updateData: CreateProblem = {
        title: 'Malicious Update',
        url: 'https://leetcode.com/problems/malicious/',
        difficulty: 'EASY',
        languageUsed: 'JavaScript',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        categories: ['Test'],
        triggerKeywords: 'test',
        solutionNotes: 'Test',
        whatWentWrong: 'None',
        wasHard: false,
      }

      // Switch to different user
      mockAuth.mockResolvedValue({ userId: alternateUserId })

      const mockParams = Promise.resolve({ id: createdProblemId.toString() })
      const mockRequest = new NextRequest('http://localhost/api/problems/' + createdProblemId, {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await PUT(mockRequest, { params: mockParams })
      
      expect(response.status).toBe(404)
      const error = await response.json()
      expect(error.error).toBe('Problem not found')

      // Verify original problem wasn't modified
      mockAuth.mockResolvedValue({ userId: testUserId })
      const verifyParams = Promise.resolve({ id: createdProblemId.toString() })
      const verifyRequest = new NextRequest('http://localhost/api/problems/' + createdProblemId)
      const verifyResponse = await GET_BY_ID(verifyRequest, { params: verifyParams })
      const originalProblem = await verifyResponse.json()
      
      expect(originalProblem.title).toBe('Original Title')
    })

    it('should return 401 for unauthenticated update request', async () => {
      mockAuth.mockResolvedValue({ userId: null })

      const updateData: CreateProblem = {
        title: 'Unauthorized Update',
        url: 'https://leetcode.com/problems/unauthorized/',
        difficulty: 'EASY',
        languageUsed: 'JavaScript',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        categories: ['Test'],
        triggerKeywords: 'test',
        solutionNotes: 'Test',
        whatWentWrong: 'None',
        wasHard: false,
      }

      const mockParams = Promise.resolve({ id: createdProblemId.toString() })
      const mockRequest = new NextRequest('http://localhost/api/problems/' + createdProblemId, {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await PUT(mockRequest, { params: mockParams })
      expect(response.status).toBe(401)
    })
  })

  describe('DELETE Problem Workflow', () => {
    let createdProblemId: number

    beforeEach(async () => {
      // Create a test problem for deletion tests
      const createData: CreateProblem = {
        title: 'Problem to Delete',
        url: 'https://leetcode.com/problems/to-delete/',
        difficulty: 'MEDIUM',
        languageUsed: 'C++',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        categories: ['Array', 'Two Pointers'],
        triggerKeywords: 'delete test',
        solutionNotes: 'This will be deleted',
        whatWentWrong: 'Nothing',
        wasHard: false,
      }

      const req = new NextRequest('http://localhost/api/problems', {
        method: 'POST',
        body: JSON.stringify(createData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(req)
      const problem = await response.json()
      createdProblemId = problem.id
    })

    it('should delete existing problem and cascade delete categories', async () => {
      // Verify problem exists before deletion
      const beforeParams = Promise.resolve({ id: createdProblemId.toString() })
      const beforeRequest = new NextRequest('http://localhost/api/problems/' + createdProblemId)
      const beforeResponse = await GET_BY_ID(beforeRequest, { params: beforeParams })
      expect(beforeResponse.status).toBe(200)

      // Delete the problem
      const mockParams = Promise.resolve({ id: createdProblemId.toString() })
      const mockRequest = new NextRequest('http://localhost/api/problems/' + createdProblemId, {
        method: 'DELETE',
      })

      const response = await DELETE(mockRequest, { params: mockParams })
      const result = await response.json()

      expect(response.status).toBe(200)
      expect(result.message).toBe('Problem deleted successfully')

      // Verify problem is actually deleted
      const afterParams = Promise.resolve({ id: createdProblemId.toString() })
      const afterRequest = new NextRequest('http://localhost/api/problems/' + createdProblemId)
      const afterResponse = await GET_BY_ID(afterRequest, { params: afterParams })
      expect(afterResponse.status).toBe(404)

      // Verify problem is not in database
      const dbProblem = await testDb.problem.findUnique({
        where: { id: createdProblemId }
      })
      expect(dbProblem).toBeNull()

      // Verify problem categories were also deleted (cascade)
      const problemCategories = await testDb.problemCategory.findMany({
        where: { problemId: createdProblemId }
      })
      expect(problemCategories).toHaveLength(0)
    })

    it('should return 404 when deleting non-existent problem', async () => {
      const mockParams = Promise.resolve({ id: '99999' })
      const mockRequest = new NextRequest('http://localhost/api/problems/99999', {
        method: 'DELETE',
      })

      const response = await DELETE(mockRequest, { params: mockParams })
      
      expect(response.status).toBe(404)
      const error = await response.json()
      expect(error.error).toBe('Problem not found')
    })

    it('should not allow deleting other users problems', async () => {
      // Switch to different user
      mockAuth.mockResolvedValue({ userId: alternateUserId })

      const mockParams = Promise.resolve({ id: createdProblemId.toString() })
      const mockRequest = new NextRequest('http://localhost/api/problems/' + createdProblemId, {
        method: 'DELETE',
      })

      const response = await DELETE(mockRequest, { params: mockParams })
      
      expect(response.status).toBe(404)
      const error = await response.json()
      expect(error.error).toBe('Problem not found')

      // Verify problem still exists for original user
      mockAuth.mockResolvedValue({ userId: testUserId })
      const verifyParams = Promise.resolve({ id: createdProblemId.toString() })
      const verifyRequest = new NextRequest('http://localhost/api/problems/' + createdProblemId)
      const verifyResponse = await GET_BY_ID(verifyRequest, { params: verifyParams })
      expect(verifyResponse.status).toBe(200)
    })

    it('should return 401 for unauthenticated delete request', async () => {
      mockAuth.mockResolvedValue({ userId: null })

      const mockParams = Promise.resolve({ id: createdProblemId.toString() })
      const mockRequest = new NextRequest('http://localhost/api/problems/' + createdProblemId, {
        method: 'DELETE',
      })

      const response = await DELETE(mockRequest, { params: mockParams })
      expect(response.status).toBe(401)
    })
  })

  describe('Complete CRUD Workflow Integration', () => {
    it('should handle full lifecycle: CREATE → READ → UPDATE → DELETE', async () => {
      // Step 1: CREATE
      const initialData: CreateProblem = {
        title: 'Lifecycle Test Problem',
        url: 'https://leetcode.com/problems/lifecycle-test/',
        difficulty: 'EASY',
        languageUsed: 'JavaScript',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        categories: ['Array'],
        triggerKeywords: 'lifecycle',
        solutionNotes: 'Initial solution',
        whatWentWrong: 'Nothing initially',
        wasHard: false,
      }

      const createReq = new NextRequest('http://localhost/api/problems', {
        method: 'POST',
        body: JSON.stringify(initialData),
        headers: { 'Content-Type': 'application/json' },
      })

      const createResponse = await POST(createReq)
      const createdProblem = await createResponse.json()
      expect(createResponse.status).toBe(200)
      expect(createdProblem.title).toBe('Lifecycle Test Problem')
      
      const problemId = createdProblem.id

      // Step 2: READ (verify creation)
      const readParams = Promise.resolve({ id: problemId.toString() })
      const readRequest = new NextRequest('http://localhost/api/problems/' + problemId)
      const readResponse = await GET_BY_ID(readRequest, { params: readParams })
      const readProblem = await readResponse.json()
      
      expect(readResponse.status).toBe(200)
      expect(readProblem.title).toBe('Lifecycle Test Problem')
      expect(readProblem.difficulty).toBe('EASY')

      // Step 3: UPDATE
      const updateData: CreateProblem = {
        title: 'Updated Lifecycle Problem',
        url: 'https://leetcode.com/problems/lifecycle-updated/',
        difficulty: 'MEDIUM',
        languageUsed: 'Python',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(n)',
        categories: ['Binary Search', 'Dynamic Programming'],
        triggerKeywords: 'updated lifecycle',
        solutionNotes: 'Updated with better approach',
        whatWentWrong: 'Had to revise complexity analysis',
        wasHard: true,
      }

      const updateParams = Promise.resolve({ id: problemId.toString() })
      const updateRequest = new NextRequest('http://localhost/api/problems/' + problemId, {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      })

      const updateResponse = await PUT(updateRequest, { params: updateParams })
      const updatedProblem = await updateResponse.json()
      
      expect(updateResponse.status).toBe(200)
      expect(updatedProblem.title).toBe('Updated Lifecycle Problem')
      expect(updatedProblem.difficulty).toBe('MEDIUM')
      expect(updatedProblem.wasHard).toBe(true)

      // Step 4: READ (verify update)
      const verifyParams = Promise.resolve({ id: problemId.toString() })
      const verifyRequest = new NextRequest('http://localhost/api/problems/' + problemId)
      const verifyResponse = await GET_BY_ID(verifyRequest, { params: verifyParams })
      const verifiedProblem = await verifyResponse.json()
      
      expect(verifyResponse.status).toBe(200)
      expect(verifiedProblem.title).toBe('Updated Lifecycle Problem')
      expect(verifiedProblem.languageUsed).toBe('Python')
      expect(verifiedProblem.categories).toHaveLength(2)

      // Step 5: DELETE
      const deleteParams = Promise.resolve({ id: problemId.toString() })
      const deleteRequest = new NextRequest('http://localhost/api/problems/' + problemId, {
        method: 'DELETE',
      })

      const deleteResponse = await DELETE(deleteRequest, { params: deleteParams })
      const deleteResult = await deleteResponse.json()
      
      expect(deleteResponse.status).toBe(200)
      expect(deleteResult.message).toBe('Problem deleted successfully')

      // Step 6: READ (verify deletion)
      const finalParams = Promise.resolve({ id: problemId.toString() })
      const finalRequest = new NextRequest('http://localhost/api/problems/' + problemId)
      const finalResponse = await GET_BY_ID(finalRequest, { params: finalParams })
      
      expect(finalResponse.status).toBe(404)
    })
  })
})