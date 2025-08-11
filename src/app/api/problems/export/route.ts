import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        dateSolved: "desc",
      },
    });

    // Convert to CSV format
    const csvHeaders = [
      "Title",
      "URL", 
      "Difficulty",
      "Language Used",
      "Date Solved",
      "Solution Notes",
      "What Went Wrong",
      "Trigger Keywords",
      "Time Complexity",
      "Space Complexity",
      "Was Hard",
      "Categories"
    ];

    const csvRows = problems.map(problem => [
      problem.title,
      problem.url,
      problem.difficulty,
      problem.languageUsed,
      problem.dateSolved.toISOString().split('T')[0], // Format as YYYY-MM-DD
      problem.solutionNotes,
      problem.whatWentWrong,
      problem.triggerKeywords,
      problem.timeComplexity,
      problem.spaceComplexity,
      problem.wasHard.toString(),
      problem.categories.map(cat => cat.category.name).join('; ')
    ]);

    // Escape CSV values and handle quotes
    const escapeCsvValue = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(escapeCsvValue).join(','))
    ].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leetlog-problems-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error("Error exporting problems:", error);
    return NextResponse.json(
      { error: "Failed to export problems" },
      { status: 500 }
    );
  }
}