"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Problem } from "@/types/problem";
import { useUser, SignInButton } from "@clerk/nextjs";
import Header from "@/components/Header";

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn, isLoaded } = useUser();
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Get unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    problems.forEach(problem => {
      problem.categories?.forEach(category => categories.add(category));
    });
    return Array.from(categories).sort();
  }, [problems]);

  // Filter problems based on search criteria
  const filteredProblems = useMemo(() => {
    return problems.filter(problem => {
      // Text search (title and keywords)
      const matchesSearch = searchTerm === "" || 
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.triggerKeywords?.toLowerCase().includes(searchTerm.toLowerCase());

      // Difficulty filter
      const matchesDifficulty = difficultyFilter === "ALL" || 
        problem.difficulty === difficultyFilter;

      // Category filter
      const matchesCategory = categoryFilter === "ALL" || 
        problem.categories?.includes(categoryFilter);

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [problems, searchTerm, difficultyFilter, categoryFilter]);

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
      <Header />

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
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
            {problems.length > 0 && (
              <button
                onClick={() => window.open('/api/problems/export', '_blank')}
                className="btn-secondary group"
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export CSV
                </span>
              </button>
            )}
            <button
              onClick={() => router.push("/new")}
              className="btn-primary group"
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
        </div>

        {/* Search and Filter Section */}
        {problems.length > 0 && (
          <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="glass-card rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search problems or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Difficulty Filter */}
                <div>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="ALL">All Difficulties</option>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="ALL">All Categories</option>
                    {uniqueCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Results count and clear filters */}
              <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                <span>
                  Showing {filteredProblems.length} of {problems.length} problems
                </span>
                {(searchTerm || difficultyFilter !== "ALL" || categoryFilter !== "ALL") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setDifficultyFilter("ALL");
                      setCategoryFilter("ALL");
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

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
        ) : filteredProblems.length === 0 ? (
          <div className="animate-fade-in">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-2xl font-semibold text-gradient mb-2">
                No problems match your filters.
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or clear the filters.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setDifficultyFilter("ALL");
                  setCategoryFilter("ALL");
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {filteredProblems.map((problem, index) => (
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
