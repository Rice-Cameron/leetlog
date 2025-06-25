import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { CreateProblem } from "@/types/problem";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const problem = await prisma.problem.findFirst({
      where: { 
        id: parseInt(resolvedParams.id),
        userId: userId 
      },
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
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // First check if the problem exists and belongs to the user
    const existingProblem = await prisma.problem.findFirst({
      where: {
        id: parseInt(resolvedParams.id),
        userId: userId
      }
    });
    
    if (!existingProblem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }
    
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
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // First check if the problem exists and belongs to the user
    const existingProblem = await prisma.problem.findFirst({
      where: {
        id: parseInt(resolvedParams.id),
        userId: userId
      }
    });
    
    if (!existingProblem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }
    
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
