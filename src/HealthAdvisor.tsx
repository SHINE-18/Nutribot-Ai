import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { ProfileSetup } from "./ProfileSetup";
import { ChatInterface } from "./ChatInterface";
import { FoodAnalyzer } from "./FoodAnalyzer";
import { HistoryView } from "./HistoryView";

export function HealthAdvisor() {
  const [activeTab, setActiveTab] = useState<"chat" | "analyze" | "profile" | "history">("chat");
  const userProfile = useQuery(api.userProfiles.getUserProfile);

  const tabs = [
    { id: "chat", label: "💬 Chat", icon: "💬" },
    { id: "analyze", label: "🔍 Analyze Food", icon: "🔍" },
    { id: "profile", label: "👤 Profile", icon: "👤" },
    { id: "history", label: "📋 History", icon: "📋" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Your Health Food Advisor! 🍎
        </h1>
        <p className="text-gray-600">
          Get personalized food recommendations, analyze nutritional content, and make healthier choices based on your unique health profile.
        </p>
        {!userProfile && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              💡 <strong>Tip:</strong> Set up your health profile to get more personalized recommendations!
            </p>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "chat" && <ChatInterface />}
          {activeTab === "analyze" && <FoodAnalyzer />}
          {activeTab === "profile" && <ProfileSetup />}
          {activeTab === "history" && <HistoryView />}
        </div>
      </div>
    </div>
  );
}
