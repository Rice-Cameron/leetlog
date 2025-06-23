"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Problem, Difficulty, ProblemCategory } from "../../types/problem";

export default function EditProblem({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("EASY");
  const [languageUsed, setLanguageUsed] = useState("");
  const [solutionNotes, setSolutionNotes] = useState("");
  const [whatWentWrong, setWhatWentWrong] = useState("");
  const [triggerKeywords, setTriggerKeywords] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("");
  const [spaceComplexity, setSpaceComplexity] = useState("");
  const [wasHard, setWasHard] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProblem();
  }, [params.id]);

  const fetchProblem = async () => {
    try {
      const response = await fetch(`/api/problems/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch problem");
      const data = await response.json();
      setProblem(data);
      setTitle(data.title);
      setUrl(data.url);
      setDifficulty(data.difficulty as Difficulty);
      setLanguageUsed(data.languageUsed);
      setSolutionNotes(data.solutionNotes);
      setWhatWentWrong(data.whatWentWrong);
      setTriggerKeywords(data.triggerKeywords);
      setTimeComplexity(data.timeComplexity);
      setSpaceComplexity(data.spaceComplexity);
      setWasHard(data.wasHard);
      setCategories(
        data.categories.map((c: ProblemCategory) => c.category.name)
      );
    } catch (error) {
      console.error("Error fetching problem:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem) return;

    try {
      const response = await fetch(`/api/problems/${problem.id}`, {
        method: "PUT",
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

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Failed to update problem");
      }
    } catch (error) {
      console.error("Error updating problem:", error);
    }
  };

  if (!problem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Problem</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select difficulty</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Language Used
          </label>
          <input
            type="text"
            value={languageUsed}
            onChange={(e) => setLanguageUsed(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Solution Notes (Markdown supported)
          </label>
          <textarea
            value={solutionNotes}
            onChange={(e) => setSolutionNotes(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            What Went Wrong
          </label>
          <textarea
            value={whatWentWrong}
            onChange={(e) => setWhatWentWrong(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Trigger Keywords
          </label>
          <input
            type="text"
            value={triggerKeywords}
            onChange={(e) => setTriggerKeywords(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Time Complexity
          </label>
          <input
            type="text"
            value={timeComplexity}
            onChange={(e) => setTimeComplexity(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Space Complexity
          </label>
          <input
            type="text"
            value={spaceComplexity}
            onChange={(e) => setSpaceComplexity(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Was Hard?
          </label>
          <input
            type="checkbox"
            checked={wasHard}
            onChange={(e) => setWasHard(e.target.checked)}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Categories (comma-separated)
          </label>
          <input
            type="text"
            value={categories.join(",")}
            onChange={(e) =>
              setCategories(e.target.value.split(",").map((tag) => tag.trim()))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Update Problem
          </button>
        </div>
      </form>
    </div>
  );
}
