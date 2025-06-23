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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {problem.title}
            </h1>
            <span
              key={problem.id}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                problem.difficulty === "EASY"
                  ? "bg-green-100 text-green-800"
                  : problem.difficulty === "MEDIUM"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {problem.difficulty}
            </span>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Problem Details
                </h2>
                <div className="space-y-4">
                  <div key="url">
                    <dt className="text-base font-medium text-gray-500">URL</dt>
                    <dd className="mt-1 text-base text-gray-900">
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
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
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Solution Notes
              </h2>
              <div className="prose max-w-none text-gray-700">
                {problem.solutionNotes}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Challenges
              </h2>
              <div className="prose max-w-none text-gray-700">
                {problem.whatWentWrong}
              </div>
            </div>

            {problem.categories && problem.categories.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Categories
                </h2>
                <div className="flex flex-wrap gap-2">
                  {problem.categories.map((category: { categoryId: number; category: { name: string } }) => (
                    <span
                      key={`${category.categoryId}-${category.category.name}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {category.category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
