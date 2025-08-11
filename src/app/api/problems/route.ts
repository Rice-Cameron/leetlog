import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateProblem } from "@/types/problem";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const problems = await prisma.problem.findMany({
      where: {
        userId: userId,
      },
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
      updatedAt: problem.updatedAt.toISOString(),
      dateSolved: problem.dateSolved?.toISOString(),
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
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = (await request.json()) as CreateProblem;
    
    // Deduplicate categories to prevent unique constraint violations
    const uniqueCategories = [...new Set(data.categories)];
    
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
        userId: userId,
        categories: {
          create: uniqueCategories.map((category) => ({
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
