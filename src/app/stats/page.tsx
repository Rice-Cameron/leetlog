"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import Header from "@/components/Header";

interface Stats {
  totalProblems: number;
  difficulty: {
    EASY: number;
    MEDIUM: number;
    HARD: number;
  };
  successRate: number;
  languages: Array<{
    language: string;
    count: number;
  }>;
  categories: Array<{
    name: string;
    count: number;
  }>;
  recentActivity: Array<{
    month: string;
    count: number;
  }>;
}

export default function StatsPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchStats();
    }
  }, [isLoaded, isSignedIn]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/stats");
      if (!response.ok) throw new Error("Failed to fetch statistics");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setError("Failed to fetch statistics");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sign In Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your statistics.
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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button onClick={fetchStats} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const formatMonth = (monthStr: string) => {
    const date = new Date(monthStr + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

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
        <div className="mb-12 animate-slide-up">
          <button
            onClick={() => router.push("/problems")}
            className="btn-secondary mb-6"
          >
            ← Back to Problems
          </button>
          
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
              Your Statistics
            </h1>
            <p className="text-xl text-gray-600">
              Track your coding progress and achievements
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in">
          {/* Total Problems */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Problems</p>
                <p className="text-3xl font-bold text-gradient">{stats.totalProblems}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Success Rate */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-gradient">{stats.successRate}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {/* Difficulty Breakdown */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-gradient mb-6">Difficulty Breakdown</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-green-700 w-16">Easy</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.totalProblems > 0 ? (stats.difficulty.EASY / stats.totalProblems) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-700 w-8 text-right">{stats.difficulty.EASY}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-yellow-700 w-16">Medium</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-yellow-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.totalProblems > 0 ? (stats.difficulty.MEDIUM / stats.totalProblems) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-700 w-8 text-right">{stats.difficulty.MEDIUM}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-red-700 w-16">Hard</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-red-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.totalProblems > 0 ? (stats.difficulty.HARD / stats.totalProblems) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-700 w-8 text-right">{stats.difficulty.HARD}</span>
              </div>
            </div>
          </div>

          {/* Top Languages */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-gradient mb-6">Top Languages</h3>
            <div className="space-y-4">
              {stats.languages.map((lang, index) => (
                <div key={lang.language} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{lang.language}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-indigo-500 h-3 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${stats.totalProblems > 0 ? (lang.count / stats.totalProblems) * 100 : 0}%`,
                          animationDelay: `${index * 0.1}s`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 w-8 text-right">{lang.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="glass-card rounded-2xl p-6 lg:col-span-2">
            <h3 className="text-xl font-semibold text-gradient mb-6">Top Categories</h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.categories.map((category, index) => (
                <div key={category.name} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-indigo-600">#{index + 1}</span>
                    <span className="text-xl font-bold text-gradient">{category.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${stats.categories.length > 0 ? (category.count / Math.max(...stats.categories.map(c => c.count))) * 100 : 0}%`,
                        animationDelay: `${index * 0.1}s`
                      }}
                    ></div>
                  </div>
                  <h4 className="text-sm font-medium text-gray-700 truncate">{category.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {stats.recentActivity.length > 0 && (
          <div className="mt-8 glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <h3 className="text-xl font-semibold text-gradient mb-6">Recent Activity</h3>
            <div className="flex items-end justify-center gap-4 h-48">
              {stats.recentActivity.reverse().map((activity, index) => (
                <div key={activity.month} className="flex flex-col items-center">
                  <div 
                    className="bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t w-12 transition-all duration-1000"
                    style={{ 
                      height: `${Math.max((activity.count / Math.max(...stats.recentActivity.map(a => a.count))) * 160, 8)}px`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  ></div>
                  <p className="text-sm font-bold text-gray-700 mt-2">{activity.count}</p>
                  <p className="text-xs text-gray-600">{formatMonth(activity.month)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}