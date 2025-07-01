"use client";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function Page() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-32 left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div
            className={`${
              mounted ? "animate-slide-up" : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="text-gradient block">LeetLog</span>
              <span className="text-gray-800 text-4xl md:text-5xl font-medium block mt-4">
                Master Your Code
              </span>
            </h1>
          </div>

          <div
            className={`${mounted ? "animate-fade-in" : "opacity-0"}`}
            style={{ animationDelay: "0.3s" }}
          >
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Track your{" "}
              <span className="text-gradient-secondary font-semibold">
                LeetCode journey
              </span>
              , analyze patterns, and accelerate your growth as a developer
            </p>
          </div>

          <div
            className={`grid md:grid-cols-3 gap-8 mb-16 ${
              mounted ? "animate-scale-in" : "opacity-0"
            }`}
            style={{ animationDelay: "0.6s" }}
          >
            <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Smart Analytics
              </h3>
              <p className="text-gray-600">
                Visualize your progress with intelligent insights
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Pattern Recognition
              </h3>
              <p className="text-gray-600">
                Identify weak spots and improve systematically
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Time Tracking
              </h3>
              <p className="text-gray-600">
                Monitor solving time and complexity analysis
              </p>
            </div>
          </div>

          <div
            className={`${mounted ? "animate-fade-in" : "opacity-0"}`}
            style={{ animationDelay: "0.9s" }}
          >
            {isSignedIn ? (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => router.push("/problems")}
                  className="btn-primary text-lg px-10 py-4 group"
                >
                  <span className="flex items-center gap-2">
                    View Your Problems
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
                  </span>
                </button>
                <button
                  onClick={() => router.push("/new")}
                  className="btn-secondary text-lg px-10 py-4"
                >
                  Add New Problem
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-xl text-gray-600 font-medium">
                  Ready to level up your coding skills?
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <SignInButton
                    mode="redirect"
                    forceRedirectUrl="/problems"
                    signUpForceRedirectUrl="/problems"
                  >
                    <button className="btn-primary text-lg px-10 py-4 group">
                      <span className="flex items-center gap-2">
                        Get Started
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
                      </span>
                    </button>
                  </SignInButton>
                  <button
                    onClick={() => router.push("/sign-up")}
                    className="btn-secondary text-lg px-10 py-4"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
