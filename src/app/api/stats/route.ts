import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get total problems count
    const totalProblems = await prisma.problem.count({
      where: { userId }
    });

    // Get difficulty breakdown
    const difficultyStats = await prisma.problem.groupBy({
      by: ['difficulty'],
      where: { userId },
      _count: true
    });

    // Get success rate (problems not marked as hard)
    const successStats = await prisma.problem.groupBy({
      by: ['wasHard'],
      where: { userId },
      _count: true
    });

    // Get language usage - use aggregation instead
    const allProblems = await prisma.problem.findMany({
      where: { userId },
      select: { languageUsed: true }
    });
    
    const languageCount = allProblems.reduce((acc, problem) => {
      acc[problem.languageUsed] = (acc[problem.languageUsed] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const languageStats = Object.entries(languageCount)
      .map(([language, count]) => ({ languageUsed: language, _count: count }))
      .sort((a, b) => b._count - a._count)
      .slice(0, 5);

    // Get category breakdown
    const allCategories = await prisma.problemCategory.findMany({
      where: {
        problem: { userId }
      },
      select: { categoryId: true }
    });
    
    const categoryCount = allCategories.reduce((acc, problemCategory) => {
      acc[problemCategory.categoryId] = (acc[problemCategory.categoryId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const categoryStats = Object.entries(categoryCount)
      .map(([categoryId, count]) => ({ categoryId: parseInt(categoryId), _count: count }))
      .sort((a, b) => b._count - a._count)
      .slice(0, 8);

    // Get category names for the top categories
    const categoryIds = categoryStats.map(stat => stat.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true }
    });

    // Get recent activity (problems solved per month for last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentActivity = await prisma.$queryRaw<Array<{month: string, count: bigint}>>`
      SELECT 
        TO_CHAR("dateSolved", 'YYYY-MM') as month,
        COUNT(*) as count
      FROM "Problem" 
      WHERE "userId" = ${userId} 
        AND "dateSolved" >= ${sixMonthsAgo}
      GROUP BY TO_CHAR("dateSolved", 'YYYY-MM')
      ORDER BY month DESC
    `;

    // Format the statistics
    const stats = {
      totalProblems,
      
      difficulty: {
        EASY: difficultyStats.find(s => s.difficulty === 'EASY')?._count || 0,
        MEDIUM: difficultyStats.find(s => s.difficulty === 'MEDIUM')?._count || 0,
        HARD: difficultyStats.find(s => s.difficulty === 'HARD')?._count || 0
      },
      
      successRate: totalProblems > 0 
        ? Math.round(((successStats.find(s => !s.wasHard)?._count || 0) / totalProblems) * 100)
        : 0,
      
      languages: languageStats.map(stat => ({
        language: stat.languageUsed,
        count: stat._count
      })),
      
      categories: categoryStats.map(stat => {
        const category = categories.find(c => c.id === stat.categoryId);
        return {
          name: category?.name || 'Unknown',
          count: stat._count
        };
      }),
      
      recentActivity: recentActivity.map(activity => ({
        month: activity.month,
        count: Number(activity.count)
      }))
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}