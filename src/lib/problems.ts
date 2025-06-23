import { Problem } from "@/types/problem";
import { prisma } from "@/lib/prisma";

export async function getProblemById(id: number): Promise<Problem | null> {
  try {
    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        categories: {
          select: {
            problemId: true,
            categoryId: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!problem) return null;

    const transformedCategories = problem.categories.map((category) => ({
      problemId: category.problemId,
      categoryId: category.categoryId,
      category: {
        id: category.categoryId,
        name: category.category.name,
      },
    }));

    // Convert Date objects to strings and return transformed data
    return {
      ...problem,
      categories: transformedCategories,
      dateSolved: problem.dateSolved.toISOString(),
      createdAt: problem.createdAt.toISOString(),
      updatedAt: problem.updatedAt.toISOString(),
    } as Problem;
  } catch (error) {
    console.error("Error fetching problem:", error);
    return null;
  }
}
