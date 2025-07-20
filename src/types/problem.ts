export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface Category {
  id: number;
  name: string;
}

export interface ProblemCategory {
  problemId: number;
  categoryId: number;
  category: Category;
}

export interface Problem {
  id: number;
  title: string;
  url: string;
  difficulty: Difficulty;
  languageUsed: string;
  dateSolved: string;
  solutionNotes: string;
  whatWentWrong: string;
  triggerKeywords: string[];
  timeComplexity: string;
  spaceComplexity: string;
  wasHard: boolean;
  categories: ProblemCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProblem {
  title: string;
  url: string;
  difficulty: Difficulty;
  languageUsed: string;
  solutionNotes: string;
  whatWentWrong: string;
  triggerKeywords: string[];
  timeComplexity: string;
  spaceComplexity: string;
  wasHard: boolean;
  categories: string[];
}
