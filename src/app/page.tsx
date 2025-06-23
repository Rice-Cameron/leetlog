"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            LeetLog
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Track your LeetCode problem solving journey and improve your skills
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push('/problems')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-indigo-700 transition-colors"
            >
              View Problems
            </button>
            <button
              onClick={() => router.push('/new')}
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg border border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Add New Problem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
