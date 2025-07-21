import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

interface AnalysisResult {
  healthScore: number;
  analysis: string;
  recommendation: string;
  alternatives: string[];
  portionAdvice: string;
}

/**
 * FoodAnalyzer component allows users to input a food item and receive
 * a detailed nutritional analysis along with personalized health recommendations.
 */
export function FoodAnalyzer() {
  // State to hold the food item input by the user
  const [foodName, setFoodName] = useState("");
  // Optional specific question about the food item
  const [query, setQuery] = useState("");
  // Loading state to indicate analysis in progress
  const [isLoading, setIsLoading] = useState(false);
  // Holds the analysis result returned from the backend
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  // Convex action to call the food analysis API
  const analyzeFood = useAction(api.foodAnalysis.analyzeFood);

  /**
   * Handles form submission to analyze the food item.
   * Prevents submission if food name is empty.
   * Shows loading state and handles errors gracefully.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    setIsLoading(true);
    try {
      const analysis = await analyzeFood({
        foodName: foodName.trim(),
        query: query.trim() || "Is this food healthy for me?",
      });
      setResult(analysis);
    } catch (_) {
      // Show a friendly error message to the user
      toast.error("Oops! Something went wrong while analyzing your food. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Returns a Tailwind CSS text color class based on the health score.
   */
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  /**
   * Returns a Tailwind CSS background color class based on the health score.
   */
  const getScoreBackground = (score: number) => {
    if (score >= 8) return "bg-green-100";
    if (score >= 6) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Food Analyzer</h2>
        <p className="text-gray-600">
          Enter a food item below to get a detailed nutritional analysis and personalized health tips.
        </p>
      </div>

      <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4" aria-label="Food analysis form">
        <div>
          <label htmlFor="foodName" className="block text-sm font-medium text-gray-700 mb-2">
            Food Item <span aria-hidden="true">*</span>
          </label>
          <input
            id="foodName"
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="e.g., Apple, Pizza, Salmon, Greek Yogurt"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
            Specific Question (Optional)
          </label>
          <input
            id="query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Is this good for weight loss? Can I eat this with diabetes?"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-describedby="queryHelp"
          />
          <p id="queryHelp" className="text-xs text-gray-500 mt-1">
            Ask a specific question about the food for personalized advice.
          </p>
        </div>

        <button
          type="submit"
          disabled={!foodName.trim() || isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-busy={isLoading}
        >
          {isLoading ? "Analyzing your food..." : "Analyze Food"}
        </button>
      </form>

      {result && (
        <div className="bg-white border rounded-lg p-6 space-y-6" role="region" aria-live="polite" aria-label="Analysis results">
          {/* Health Score */}
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getScoreBackground(result.healthScore)} mb-4`}>
              <span className={`text-2xl font-bold ${getScoreColor(result.healthScore)}`}>
                {result.healthScore}/10
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Health Score</h3>
          </div>

          {/* Analysis */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Nutritional Analysis</h4>
            <p className="text-gray-700 leading-relaxed">{result.analysis}</p>
          </div>

          {/* Recommendation */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Recommendation</h4>
            <p className="text-gray-700 leading-relaxed">{result.recommendation}</p>
          </div>

          {/* Portion Advice */}
          {result.portionAdvice && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Portion Guidance</h4>
              <p className="text-gray-700 leading-relaxed">{result.portionAdvice}</p>
            </div>
          )}

          {/* Alternatives */}
          {result.alternatives && result.alternatives.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Healthier Alternatives</h4>
              <ul className="space-y-2">
                {result.alternatives.map((alternative, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2" aria-hidden="true">•</span>
                    <span className="text-gray-700">{alternative}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
