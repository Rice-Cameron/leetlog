"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Difficulty } from "@prisma/client";
import Select from "react-select";

import ComplexityInput from "@/components/ComplexityInput";

export default function NewProblem() {
  const router = useRouter();
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
  const [categories, setCategories] = useState<string[]>([]);

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
          categories,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Add New Problem
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-3"
                  required
                  placeholder="Enter problem title"
                  style={{ color: "rgba(0, 0, 0, 0.7)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-3"
                  required
                  placeholder="Enter LeetCode URL"
                  style={{ color: "rgba(0, 0, 0, 0.7)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Difficulty
                </label>
                <Select
                  value={difficulty ? { value: difficulty, label: difficulty.charAt(0) + difficulty.slice(1).toLowerCase() } : null}
                  onChange={(option) => setDifficulty(option?.value as Difficulty)}
                  options={[
                    { value: "EASY", label: "Easy" },
                    { value: "MEDIUM", label: "Medium" },
                    { value: "HARD", label: "Hard" }
                  ]}
                  placeholder="Select difficulty"
                  className="mt-1 block w-full"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "none",
                      '&:hover': {
                        borderColor: '#9ca3af'
                      }
                    }),
                    menu: (provided) => ({
                      ...provided,
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected ? '#3b82f6' : 'white',
                      color: state.isSelected ? 'white' : 'black',
                      '&:hover': {
                        backgroundColor: state.isSelected ? '#3b82f6' : '#e5e7eb'
                      }
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: difficulty ? 'black' : 'rgba(0, 0, 0, 0.7)'
                    })
                  }}
                  isSearchable={false}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Language Used
                </label>
                <input
                  type="text"
                  value={languageUsed}
                  onChange={(e) => setLanguageUsed(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-3"
                  required
                  placeholder="e.g., Python, JavaScript"
                  style={{ color: "rgba(0, 0, 0, 0.5)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Solution Notes
                </label>
                <textarea
                  value={solutionNotes}
                  onChange={(e) => setSolutionNotes(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-3"
                  rows={4}
                  placeholder="Describe your solution approach..."
                  style={{ color: "rgba(0, 0, 0, 0.5)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  What Went Wrong
                </label>
                <textarea
                  value={whatWentWrong}
                  onChange={(e) => setWhatWentWrong(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-3"
                  rows={4}
                  placeholder="Describe any challenges you faced..."
                  style={{ color: "rgba(0, 0, 0, 0.5)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Trigger Keywords
                </label>
                <textarea
                  value={triggerKeywords}
                  onChange={(e) => setTriggerKeywords(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-3"
                  rows={4}
                  placeholder="Enter keywords that help identify this problem type (e.g., 'Two Sum', 'DP', 'BFS', 'Tree', 'Hash Table', 'Matrix')"
                  style={{ color: "rgba(0, 0, 0, 0.5)" }}
                />
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

              <div className="flex items-center">
                <input
                  id="wasHard"
                  type="checkbox"
                  checked={wasHard}
                  onChange={(e) => setWasHard(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="wasHard"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Was Hard
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categories
                </label>
                <input
                  type="text"
                  value={categories.join(", ")}
                  onChange={(e) =>
                    setCategories(
                      e.target.value.split(", ").map((s) => s.trim())
                    )
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-3"
                  placeholder="Enter categories separated by commas"
                  style={{ color: "rgba(0, 0, 0, 0.5)" }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Add Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
