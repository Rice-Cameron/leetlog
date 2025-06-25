"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Problem } from "@/types/problem";
import { useUser, UserButton } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchProblems();
    }
  }, [isLoaded, isSignedIn]);

  const fetchProblems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/problems");
      if (!response.ok) throw new Error("Failed to fetch problems");
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error("Error fetching problems:", error);
      setError("Failed to fetch problems");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while Clerk is loading
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your problems.</p>
          <SignInButton mode="redirect">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!problems) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">LeetLog</h2>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Problems</h1>
          <button
            onClick={() => router.push("/new")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add New Problem
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Language
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {problems.map((problem) => (
                <tr key={problem.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      <a
                        href={`/problems/${problem.id}`}
                        className="hover:text-indigo-600"
                      >
                        {problem.title}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      key={`difficulty-${problem.id}`}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        problem.difficulty === "EASY"
                          ? "bg-green-100 text-green-800"
                          : problem.difficulty === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span key={`language-${problem.id}`} className="text-sm text-gray-500">{problem.languageUsed}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(problem.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      problem.wasHard ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}>
                      {problem.wasHard ? "Hard" : "Solved"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
