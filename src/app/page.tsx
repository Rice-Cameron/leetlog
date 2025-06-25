"use client";
import { useRouter } from "next/navigation";
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';

export default function Home() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Header with auth */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">LeetLog</h2>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <span className="text-gray-600">Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!</span>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            LeetLog
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Track your LeetCode problem solving journey and improve your skills
          </p>
          
          {isSignedIn ? (
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
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 mb-6">
                Sign in to start tracking your coding progress!
              </p>
              <div className="flex justify-center gap-4">
                <SignInButton mode="redirect">
                  <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-indigo-700 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <button
                  onClick={() => router.push('/sign-up')}
                  className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg border border-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
