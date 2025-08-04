import { GET, POST } from "./route";
import { describe, it, expect, vi } from 'vitest';
import { mockAuthenticatedUser, mockUnauthenticatedUser } from '@/test/auth-utils';

// Mock the auth function
const mockAuth = vi.hoisted(() => vi.fn())
vi.mock('@clerk/nextjs/server', () => ({
  auth: mockAuth
}))

describe("/api/problems API", () => {
  it("should return problems for authenticated user", async () => {
    mockAuth.mockResolvedValue({ userId: 'test-user-id' })
    
    const res = await GET();
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it("should return 401 for unauthenticated GET request", async () => {
    mockAuth.mockResolvedValue({ userId: null })
    
    const res = await GET();
    
    expect(res.status).toBe(401);
  });

  it("should create a problem for authenticated user", async () => {
    mockAuth.mockResolvedValue({ userId: 'test-user-id' })
    
    const req = new Request("http://localhost/api/problems", {
      method: "POST",
      body: JSON.stringify({
        title: "Test Problem",
        url: "https://leetcode.com/problems/test/",
        difficulty: "EASY",
        languageUsed: "TypeScript",
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
        categories: ["Test"],
        triggerKeywords: ["test"],
        solutionNotes: "Test solution",
        whatWentWrong: "None",
        wasHard: false,
      }),
      headers: { "Content-Type": "application/json" },
    });
    
    const res = await POST(req);
    
    expect(res.status).toBe(200);
  });

  it("should return 401 for unauthenticated POST request", async () => {
    mockAuth.mockResolvedValue({ userId: null })
    
    const req = new Request("http://localhost/api/problems", {
      method: "POST",
      body: JSON.stringify({
        title: "Test Problem",
        url: "https://leetcode.com/problems/test/",
        difficulty: "EASY",
        languageUsed: "TypeScript",
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
        categories: ["Test"],
        triggerKeywords: ["test"],
        solutionNotes: "Test solution",
        whatWentWrong: "None",
        wasHard: false,
      }),
      headers: { "Content-Type": "application/json" },
    });
    
    const res = await POST(req);
    
    expect(res.status).toBe(401);
  });
});
