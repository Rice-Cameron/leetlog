"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Header from "@/components/Header";

interface Problem {
  id: number;
  title: string;
  url: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  languageUsed: string;
  solutionNotes: string;
  whatWentWrong: string;
  triggerKeywords: string;
  timeComplexity: string;
  spaceComplexity: string;
  wasHard: boolean;
  categories: { category: { name: string } }[];
}

export default function EditProblemPage() {
  const router = useRouter();
  const params = useParams();
  const { isSignedIn, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    difficulty: "EASY" as "EASY" | "MEDIUM" | "HARD",
    languageUsed: "",
    solutionNotes: "",
    whatWentWrong: "",
    triggerKeywords: "",
    timeComplexity: "",
    spaceComplexity: "",
    wasHard: false,
    categories: ""
  });

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchProblem();
    }
  }, [isLoaded, isSignedIn, params.id]);

  const fetchProblem = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/problems/${params.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Problem not found");
        }
        throw new Error("Failed to fetch problem");
      }
      const data = await response.json();
      setProblem(data);
      
      // Populate form with existing data
      setFormData({
        title: data.title,
        url: data.url,
        difficulty: data.difficulty,
        languageUsed: data.languageUsed,
        solutionNotes: data.solutionNotes,
        whatWentWrong: data.whatWentWrong,
        triggerKeywords: data.triggerKeywords,
        timeComplexity: data.timeComplexity,
        spaceComplexity: data.spaceComplexity,
        wasHard: data.wasHard,
        categories: data.categories.map((cat: any) => cat.category.name).join(", ")
      });
    } catch (error) {
      console.error("Error fetching problem:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch problem");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const categories = formData.categories
        .split(",")
        .map(cat => cat.trim())
        .filter(cat => cat);

      const response = await fetch(`/api/problems/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          categories
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update problem");
      }

      router.push(`/problems/${params.id}`);
    } catch (error) {
      console.error("Error updating problem:", error);
      setError(error instanceof Error ? error.message : "Failed to update problem");
    } finally {
      setIsSubmitting(false);
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
    router.push("/sign-in");
    return null;
  }

  if (error && !problem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/problems")}
            className="btn-primary"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Header />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="btn-secondary mb-6"
          >
            ← Back
          </button>
          
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Edit Problem
          </h1>
          <p className="text-xl text-gray-600">
            Update your problem details
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Title and URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LeetCode URL *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Difficulty and Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty *
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value as "EASY" | "MEDIUM" | "HARD"})}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language Used *
                </label>
                <input
                  type="text"
                  value={formData.languageUsed}
                  onChange={(e) => setFormData({...formData, languageUsed: e.target.value})}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="JavaScript, Python, Java, etc."
                  required
                />
              </div>
            </div>

            {/* Solution Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Solution Notes
              </label>
              <textarea
                value={formData.solutionNotes}
                onChange={(e) => setFormData({...formData, solutionNotes: e.target.value})}
                rows={4}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe your solution approach..."
              />
            </div>

            {/* What Went Wrong */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What Went Wrong / Lessons Learned
              </label>
              <textarea
                value={formData.whatWentWrong}
                onChange={(e) => setFormData({...formData, whatWentWrong: e.target.value})}
                rows={3}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="What mistakes did you make? What did you learn?"
              />
            </div>

            {/* Keywords and Complexity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger Keywords
                </label>
                <input
                  type="text"
                  value={formData.triggerKeywords}
                  onChange={(e) => setFormData({...formData, triggerKeywords: e.target.value})}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="hash map, sliding window, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Complexity
                </label>
                <input
                  type="text"
                  value={formData.timeComplexity}
                  onChange={(e) => setFormData({...formData, timeComplexity: e.target.value})}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="O(n), O(log n), etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Space Complexity
                </label>
                <input
                  type="text"
                  value={formData.spaceComplexity}
                  onChange={(e) => setFormData({...formData, spaceComplexity: e.target.value})}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="O(1), O(n), etc."
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <input
                type="text"
                value={formData.categories}
                onChange={(e) => setFormData({...formData, categories: e.target.value})}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Array, Hash Table, Dynamic Programming (comma separated)"
              />
            </div>

            {/* Was Hard Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="wasHard"
                checked={formData.wasHard}
                onChange={(e) => setFormData({...formData, wasHard: e.target.checked})}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="wasHard" className="ml-2 block text-sm text-gray-700">
                This problem was challenging for me
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1"
              >
                {isSubmitting ? "Updating..." : "Update Problem"}
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}