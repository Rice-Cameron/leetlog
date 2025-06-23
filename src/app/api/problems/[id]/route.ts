import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { CreateProblem, Difficulty } from "@/types/problem";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = (await request.json()) as CreateProblem;
    const problem = await prisma.problem.update({
      where: { id: parseInt(params.id) },
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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.problem.delete({
      where: { id: parseInt(params.id) },
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
