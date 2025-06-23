import { useState } from "react";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default function Home() {
  const [problems, setProblems] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [wasHardFilter, setWasHardFilter] = useState(false);

  const fetchProblems = async () => {
    try {
      const problems = await prisma.problem.findMany({
        include: {
          categories: {
            include: {
              category: true
            }
          }
        },
        orderBy: {
          dateSolved: "desc"
        }
      });
      setProblems(problems);
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await prisma.problem.delete({
        where: { id }
      });
      await fetchProblems();
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">LeetLog - LeetCode Problem Tracker</h1>

      <div className="mb-8">
        <Link
          href="/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Problem
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex gap-4">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <input
            type="text"
            placeholder="Search categories..."
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded p-2"
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={wasHardFilter}
              onChange={(e) => setWasHardFilter(e.target.checked)}
              className="mr-2"
            />
            <span>Show only hard problems</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {problems.map((problem) => (
          <div key={problem.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">
              <a
                href={problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                {problem.title}
              </a>
            </h2>
            <p className="text-gray-600 mb-2">
              Difficulty: {problem.difficulty}
            </p>
            <div className="mb-2">
              <span className="font-bold">Categories:</span>
              <div className="flex gap-2 mt-1">
                {problem.categories.map((category) => (
                  <span
                    key={category.categoryId}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    {category.category.name}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-2">
              Solved on: {new Date(problem.dateSolved).toLocaleDateString()}
            </p>
            <div className="flex justify-end gap-2">
              <Link
                href={`/edit/${problem.id}`}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(problem.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
