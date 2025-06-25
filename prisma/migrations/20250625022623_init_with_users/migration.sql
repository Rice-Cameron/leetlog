-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "languageUsed" TEXT NOT NULL,
    "dateSolved" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "solutionNotes" TEXT NOT NULL,
    "whatWentWrong" TEXT NOT NULL,
    "triggerKeywords" TEXT NOT NULL,
    "timeComplexity" TEXT NOT NULL,
    "spaceComplexity" TEXT NOT NULL,
    "wasHard" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Problem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ProblemCategory" (
    "problemId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    PRIMARY KEY ("problemId", "categoryId"),
    CONSTRAINT "ProblemCategory_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProblemCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
