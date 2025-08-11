import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const parseCSVLine = (line: string): string[] => {
  const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
  return line.split(regex).map(field => 
    field.trim().replace(/^"|"$/g, '').replace(/""/g, '"')
  );
};

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: "File must be a CSV" }, { status: 400 });
    }

    const csvText = await file.text();
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return NextResponse.json({ error: "CSV must have headers and at least one data row" }, { status: 400 });
    }

    const headers = parseCSVLine(lines[0]);
    const expectedHeaders = [
      "Title", "URL", "Difficulty", "Language Used", "Date Solved",
      "Solution Notes", "What Went Wrong", "Trigger Keywords", 
      "Time Complexity", "Space Complexity", "Was Hard", "Categories"
    ];

    const headerMismatch = expectedHeaders.some((expected, index) => 
      headers[index] !== expected
    );

    if (headerMismatch || headers.length !== expectedHeaders.length) {
      return NextResponse.json({ 
        error: "CSV headers don't match expected format", 
        expectedHeaders 
      }, { status: 400 });
    }

    const importResults = {
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      try {
        const values = parseCSVLine(line);

        if (values.length !== expectedHeaders.length) {
          importResults.errors.push(`Row ${i + 1}: Wrong number of columns`);
          importResults.failed++;
          continue;
        }

        const [title, url, difficulty, languageUsed, dateSolved, 
               solutionNotes, whatWentWrong, triggerKeywords,
               timeComplexity, spaceComplexity, wasHard, categories] = values;

        if (!title || !url || !difficulty || !languageUsed) {
          importResults.errors.push(`Row ${i + 1}: Missing required fields`);
          importResults.failed++;
          continue;
        }

        if (!['EASY', 'MEDIUM', 'HARD'].includes(difficulty.toUpperCase())) {
          importResults.errors.push(`Row ${i + 1}: Invalid difficulty "${difficulty}"`);
          importResults.failed++;
          continue;
        }

        const categoryNames = categories ? categories.split(';').map(c => c.trim()).filter(c => c) : [];

        await prisma.problem.create({
          data: {
            title,
            url,
            difficulty: difficulty.toUpperCase() as 'EASY' | 'MEDIUM' | 'HARD',
            languageUsed,
            dateSolved: dateSolved ? new Date(dateSolved) : new Date(),
            solutionNotes: solutionNotes || '',
            whatWentWrong: whatWentWrong || '',
            triggerKeywords: triggerKeywords || '',
            timeComplexity: timeComplexity || '',
            spaceComplexity: spaceComplexity || '',
            wasHard: wasHard.toLowerCase() === 'true',
            userId,
            categories: {
              create: categoryNames.map(categoryName => ({
                category: {
                  connectOrCreate: {
                    where: { name: categoryName },
                    create: { name: categoryName }
                  }
                }
              }))
            }
          }
        });

        importResults.successful++;
      } catch (error) {
        importResults.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        importResults.failed++;
      }
    }

    return NextResponse.json({
      message: "Import completed",
      results: importResults
    });

  } catch (error) {
    console.error("Error importing problems:", error);
    return NextResponse.json(
      { error: "Failed to import problems" },
      { status: 500 }
    );
  }
}