import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { CreateProblem } from "@/types/problem";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const problem = await prisma.problem.findUnique({
      where: { id: parseInt(resolvedParams.id) },
      include: {
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
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json(problem);
  } catch (error) {
    console.error("Error fetching problem:", error);
    return NextResponse.json(
      { error: "Failed to fetch problem" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const data = (await request.json()) as CreateProblem;
    const problem = await prisma.problem.update({
      where: { id: parseInt(resolvedParams.id) },
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
          set: [],
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
    console.error("Error updating problem:", error);
    return NextResponse.json(
      { error: "Failed to update problem" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    await prisma.problem.delete({
      where: { id: parseInt(resolvedParams.id) },
    });
    return NextResponse.json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Error deleting problem:", error);
    return NextResponse.json(
      { error: "Failed to delete problem" },
      { status: 500 }
    );
  }
}
