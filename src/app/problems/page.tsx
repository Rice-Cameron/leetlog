"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Problem } from "@/types/problem";
import { useUser, UserButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";

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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sign In Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your problems.
          </p>
          <SignInButton mode="redirect">
            <button className="btn-primary w-full justify-center">
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
    <div className="min-h-screen relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
        <div
          className="absolute bottom-40 left-20 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
      <header className="relative z-10 animate-fade-in">
        <div className="glass-card rounded-none border-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center animate-glow">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <h2 className="text-3xl font-bold text-gradient tracking-tight">
                  LeetLog
                </h2>
              </div>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-10 h-10 rounded-xl shadow-lg hover:shadow-xl transition-shadow",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 animate-slide-up">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
              Your Problems
            </h1>
            <p className="text-xl text-gray-600">
              Track your coding journey and analyze your progress
            </p>
          </div>
          <button
            onClick={() => router.push("/new")}
            className="btn-primary mt-4 sm:mt-0 group"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add New Problem
            </span>
          </button>
        </div>

        {/* Problems grid/table */}
        {problems.length === 0 ? (
          <div className="animate-fade-in">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-2xl font-semibold text-gradient mb-2">
                You have not logged any problems yet.
              </h3>
              <p className="text-gray-600 mb-6">
                Start by adding your first LeetCode problem.
              </p>
              <button
                onClick={() => router.push("/new")}
                className="btn-primary"
              >
                Add Your First Problem
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {problems.map((problem, index) => (
              <div
                key={problem.id}
                className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => router.push(`/problems/${problem.id}`)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gradient group-hover:text-gradient-secondary transition-all">
                        {problem.title}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
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

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                        <span className="font-mono font-medium">
                          {problem.languageUsed}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          {new Date(problem.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {problem.categories && problem.categories.length > 0 && (
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          <span>
                            {problem.categories.slice(0, 2).join(", ")}
                          </span>
                          {problem.categories.length > 2 && (
                            <span className="text-gray-400">
                              +{problem.categories.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        problem.wasHard
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-green-100 text-green-700 border border-green-200"
                      }`}
                    >
                      {problem.wasHard ? "Challenging" : "Solved"}
                    </span>

                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-gradient group-hover:translate-x-1 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
