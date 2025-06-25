import { format } from "date-fns";
import { notFound } from "next/navigation";
import { getProblemById } from "../../../lib/problems";

export default async function ProblemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const problem = await getProblemById(parseInt(id));

  if (!problem) {
    notFound();
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-32 left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="glass-card rounded-3xl shadow-2xl p-8 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-gradient">
              {problem.title}
            </h1>
            <span
              key={problem.id}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                problem.difficulty === "EASY"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : problem.difficulty === "MEDIUM"
                  ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {problem.difficulty}
            </span>
          </div>
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-lg font-semibold text-gradient-secondary mb-2">
                  Problem Details
                </h2>
                <div className="space-y-4">
                  <div key="url">
                    <dt className="text-base font-medium text-gray-500">URL</dt>
                    <dd className="mt-1 text-base text-blue-600 hover:text-blue-800 transition-colors">
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {problem.url}
                      </a>
                    </dd>
                  </div>
                  <div key="language-used">
                    <dt className="text-base font-medium text-gray-500">
                      Language Used
                    </dt>
                    <dd className="mt-1 text-base text-gray-900">
                      {problem.languageUsed}
                    </dd>
                  </div>
                  <div key="date-solved">
                    <dt className="text-base font-medium text-gray-500">
                      Date Solved
                    </dt>
                    <dd className="mt-1 text-base text-gray-900">
                      {format(new Date(problem.dateSolved), "MMMM d, yyyy")}
                    </dd>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gradient-secondary mb-2">
                  Complexity Analysis
                </h2>
                <div className="space-y-4">
                  <div key="time-complexity">
                    <dt className="text-base font-medium text-gray-500">
                      Time Complexity
                    </dt>
                    <dd className="mt-1 text-base text-gray-900">
                      {problem.timeComplexity}
                    </dd>
                  </div>
                  <div key="space-complexity">
                    <dt className="text-base font-medium text-gray-500">
                      Space Complexity
                    </dt>
                    <dd className="mt-1 text-base text-gray-900">
                      {problem.spaceComplexity}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gradient-secondary mb-4">
                Solution Notes
              </h2>
              <div className="prose max-w-none text-gray-700">
                {problem.solutionNotes}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gradient-secondary mb-4">
                Challenges
              </h2>
              <div className="prose max-w-none text-gray-700">
                {problem.whatWentWrong}
              </div>
            </div>
            {problem.categories && problem.categories.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gradient-secondary mb-4">
                  Categories
                </h2>
                <div className="flex flex-wrap gap-2">
                  {problem.categories.map(
                    (category: {
                      categoryId: number;
                      category: { name: string };
                    }) => (
                      <span
                        key={`${category.categoryId}-${category.category.name}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200"
                      >
                        {category.category.name}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
