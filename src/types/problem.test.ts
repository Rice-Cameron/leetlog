import { Problem } from "./problem";
import { describe, it, expect } from 'vitest';

describe("Problem type", () => {
  it("should accept a valid Problem object", () => {
    const validProblem: Problem = {
      id: 1,
      title: "Two Sum",
      url: "https://leetcode.com/problems/two-sum/",
      difficulty: "EASY",
      languageUsed: "JavaScript",
      dateSolved: new Date().toISOString(),
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      categories: [
        {
          problemId: 1,
          categoryId: 1,
          category: { id: 1, name: "Array" },
        },
        {
          problemId: 1,
          categoryId: 2,
          category: { id: 2, name: "HashTable" },
        },
      ],
      triggerKeywords: "sum, hashmap",
      solutionNotes: "Use a hash map to store indices.",
      whatWentWrong: "Edge cases with negative numbers.",
      wasHard: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(validProblem.title).toBe("Two Sum");
  });

  it("should require required fields", () => {
    // @ts-expect-error - Testing incomplete Problem object to ensure type safety
    const invalidProblem: Problem = { title: "Missing fields" };
    expect(invalidProblem.title).toBe("Missing fields");
  });
});
