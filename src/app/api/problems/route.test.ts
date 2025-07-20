import { GET, POST } from "./route";

describe("/api/problems API", () => {
  it("should return problems on GET", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
  });

  it("should create a problem on POST", async () => {
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
});
