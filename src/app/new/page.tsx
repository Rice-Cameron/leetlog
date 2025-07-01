"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Difficulty } from "@prisma/client";
import Select from "react-select";
import { useUser, SignInButton } from "@clerk/nextjs";

import ComplexityInput from "@/components/ComplexityInput";
import Header from "@/components/Header";

export default function NewProblem() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [languageUsed, setLanguageUsed] = useState("");
  const [solutionNotes, setSolutionNotes] = useState("");
  const [whatWentWrong, setWhatWentWrong] = useState("");
  const [triggerKeywords, setTriggerKeywords] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("");
  const [spaceComplexity, setSpaceComplexity] = useState("");
  const [wasHard, setWasHard] = useState(false);
  const [categoriesInput, setCategoriesInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          url,
          difficulty,
          languageUsed,
          solutionNotes,
          whatWentWrong,
          triggerKeywords,
          timeComplexity,
          spaceComplexity,
          wasHard,
          categories: categoriesInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create problem");
      }

      router.push("/problems");
    } catch (error) {
      console.error("Error creating problem:", error);
    }
  };

  // Show loading while Clerk is loading
  if (!isLoaded) {
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
            Please sign in to add new problems.
          </p>
          <SignInButton mode="redirect">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
        <div
          className="absolute bottom-40 left-20 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header with glass morphism */}
      <Header />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page header */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Add New Problem
          </h1>
          <p className="text-xl text-gray-600">
            Track another step in your coding journey
          </p>
        </div>

        <div className="glass-card rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
          <div className="px-8 py-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Problem Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all text-gray-800 placeholder-gray-400 font-medium"
                  required
                  placeholder="e.g., Two Sum, Valid Parentheses"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  LeetCode URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all text-gray-800 placeholder-gray-400 font-medium"
                  required
                  placeholder="https://leetcode.com/problems/..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Difficulty
                </label>
                <Select
                  value={
                    difficulty
                      ? {
                          value: difficulty,
                          label:
                            difficulty.charAt(0) +
                            difficulty.slice(1).toLowerCase(),
                        }
                      : null
                  }
                  onChange={(option) =>
                    setDifficulty(option?.value as Difficulty)
                  }
                  options={[
                    { value: "EASY", label: "Easy" },
                    { value: "MEDIUM", label: "Medium" },
                    { value: "HARD", label: "Hard" },
                  ]}
                  placeholder="Select difficulty level"
                  className="block w-full"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      border: "2px solid #e5e7eb",
                      borderRadius: "0.75rem",
                      padding: "8px 4px",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#a855f7",
                      },
                      "&:focus-within": {
                        borderColor: "#a855f7",
                        boxShadow: "0 0 0 4px rgba(168, 85, 247, 0.1)",
                      },
                    }),
                    menu: (provided) => ({
                      ...provided,
                      borderRadius: "0.75rem",
                      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected ? "#a855f7" : "white",
                      color: state.isSelected ? "white" : "#1f2937",
                      fontWeight: "500",
                      "&:hover": {
                        backgroundColor: state.isSelected
                          ? "#a855f7"
                          : "#f3f4f6",
                      },
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: "#1f2937",
                      fontWeight: "500",
                    }),
                  }}
                  isSearchable={false}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Programming Language
                </label>
                <input
                  type="text"
                  value={languageUsed}
                  onChange={(e) => setLanguageUsed(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all text-gray-800 placeholder-gray-400 font-medium"
                  required
                  placeholder="e.g., Python, JavaScript, Java, C++"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Solution Notes
                </label>
                <textarea
                  value={solutionNotes}
                  onChange={(e) => setSolutionNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all text-gray-800 placeholder-gray-400 font-medium min-h-[120px]"
                  placeholder="Describe your approach, edge cases, optimizations, etc."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  What Went Wrong / Challenges
                </label>
                <textarea
                  value={whatWentWrong}
                  onChange={(e) => setWhatWentWrong(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all text-gray-800 placeholder-gray-400 font-medium min-h-[80px]"
                  placeholder="What tripped you up? What did you learn?"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Trigger Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={triggerKeywords}
                  onChange={(e) => setTriggerKeywords(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all text-gray-800 placeholder-gray-400 font-medium"
                  placeholder="e.g., sliding window, two pointers, hash map"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Categories (comma separated)
                </label>
                <input
                  type="text"
                  value={categoriesInput}
                  onChange={(e) => setCategoriesInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all text-gray-800 placeholder-gray-400 font-medium"
                  placeholder="e.g., Array, Dynamic Programming, Graph"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={wasHard}
                  onChange={(e) => setWasHard(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400 border-gray-300 transition-all"
                  id="wasHardCheckbox"
                />
                <label
                  htmlFor="wasHardCheckbox"
                  className="text-gray-700 font-medium select-none"
                >
                  This problem was especially hard for me
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Time Complexity
                  </label>
                  <ComplexityInput
                    value={timeComplexity}
                    onChange={setTimeComplexity}
                    placeholder="Select time complexity"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Space Complexity
                  </label>
                  <ComplexityInput
                    value={spaceComplexity}
                    onChange={setSpaceComplexity}
                    placeholder="Select space complexity"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full text-lg py-4 mt-4"
              >
                Add Problem
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
