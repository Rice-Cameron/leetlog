import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateProblem } from "@/types/problem";

export async function GET() {
  try {
    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        title: true,
        difficulty: true,
        languageUsed: true,
        updatedAt: true,
        wasHard: true,
        dateSolved: true,
        categories: {
          select: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        dateSolved: "desc",
      },
    });

    // Transform the data to match our Problem type
    const formattedProblems = problems.map((problem) => ({
      ...problem,
      categories: problem.categories.map((cat) => cat.category.name),
      updatedAt: problem.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedProblems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    return NextResponse.json(
      { error: "Failed to fetch problems" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as CreateProblem;
    const problem = await prisma.problem.create({
      data: {
        title: data.title,
        url: data.url,
        difficulty: data.difficulty,
        languageUsed: data.languageUsed,
        solutionNotes: data.solutionNotes,
        whatWentWrong: data.whatWentWrong,
        triggerKeywords: data.triggerKeywords,
        timeComplexity: data.timeComplexity,
        spaceComplexity: data.spaceComplexity,
        wasHard: data.wasHard,
        categories: {
          create: data.categories.map((category) => ({
            category: {
              connectOrCreate: {
                where: { name: category },
                create: { name: category },
              },
            },
          })),
        },
      },
    });
    return NextResponse.json(problem);
  } catch (error) {
    console.error("Error creating problem:", error);
    return NextResponse.json(
      { error: "Failed to create problem" },
      { status: 500 }
    );
  }
}
