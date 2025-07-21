import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function HistoryView() {
  const foodHistory = useQuery(api.foodAnalysis.getFoodHistory);


  const getScoreBadge = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800";
    if (score >= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (!foodHistory) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Food Analysis History</h2>
        <p className="text-gray-600">
          Review your previous food analyses and recommendations.
        </p>
      </div>

      {foodHistory.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No history yet</h3>
          <p className="text-gray-600">
            Start analyzing foods to see your history here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {foodHistory.map((item) => (
            <div key={item._id} className="bg-white border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.foodName}</h3>
                  <p className="text-sm text-gray-600">{item.query}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(item._creationTime).toLocaleDateString()} at{" "}
                    {new Date(item._creationTime).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBadge(item.healthScore)}`}>
                  {item.healthScore}/10
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Analysis</h4>
                  <p className="text-gray-700 text-sm">{item.response}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Recommendation</h4>
                  <p className="text-gray-700 text-sm">{item.recommendation}</p>
                </div>

                {item.alternatives.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Alternatives</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.alternatives.map((alt, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
