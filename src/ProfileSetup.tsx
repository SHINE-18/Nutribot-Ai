import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

export function ProfileSetup() {
  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const createOrUpdateProfile = useMutation(api.userProfiles.createOrUpdateProfile);

  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    activityLevel: "",
    healthConditions: [] as string[],
    allergies: [] as string[],
    dietaryPreferences: [] as string[],
    goals: [] as string[],
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        age: userProfile.age?.toString() || "",
        weight: userProfile.weight?.toString() || "",
        height: userProfile.height?.toString() || "",
        activityLevel: userProfile.activityLevel || "",
        healthConditions: userProfile.healthConditions || [],
        allergies: userProfile.allergies || [],
        dietaryPreferences: userProfile.dietaryPreferences || [],
        goals: userProfile.goals || [],
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrUpdateProfile({
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        activityLevel: formData.activityLevel || undefined,
        healthConditions: formData.healthConditions,
        allergies: formData.allergies,
        dietaryPreferences: formData.dietaryPreferences,
        goals: formData.goals,
      });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    }
  };


  const healthConditionOptions = [
    "diabetes", "hypertension", "heart_disease", "high_cholesterol", 
    "obesity", "kidney_disease", "liver_disease", "thyroid_disorder",
    "celiac_disease", "ibs", "gerd", "osteoporosis"
  ];

  const allergyOptions = [
    "nuts", "dairy", "gluten", "eggs", "soy", "shellfish", 
    "fish", "sesame", "sulfites", "nightshades"
  ];

  const dietaryOptions = [
    "vegetarian", "vegan", "keto", "paleo", "mediterranean", 
    "low_carb", "low_fat", "dash", "intermittent_fasting"
  ];

  const goalOptions = [
    "weight_loss", "weight_gain", "muscle_gain", "maintain_health",
    "improve_energy", "better_digestion", "lower_cholesterol", "manage_diabetes"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Health Profile Setup</h2>
        <p className="text-gray-600">
          Provide your health information to get personalized food recommendations.
        </p>
      </div>

      <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="25"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="70"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="175"
            />
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Activity Level
          </label>
          <select
            value={formData.activityLevel}
            onChange={(e) => setFormData(prev => ({ ...prev, activityLevel: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select activity level</option>
            <option value="sedentary">Sedentary (little/no exercise)</option>
            <option value="light">Light (light exercise 1-3 days/week)</option>
            <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
            <option value="active">Active (hard exercise 6-7 days/week)</option>
            <option value="very_active">Very Active (very hard exercise, physical job)</option>
          </select>
        </div>

        {/* Health Conditions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Health Conditions
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {healthConditionOptions.map(condition => (
              <label key={condition} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.healthConditions.includes(condition)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        healthConditions: [...prev.healthConditions, condition]
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        healthConditions: prev.healthConditions.filter(c => c !== condition)
                      }));
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm capitalize">{condition.replace("_", " ")}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allergies
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {allergyOptions.map(allergy => (
              <label key={allergy} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.allergies.includes(allergy)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        allergies: [...prev.allergies, allergy]
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        allergies: prev.allergies.filter(a => a !== allergy)
                      }));
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm capitalize">{allergy}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Dietary Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary Preferences
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {dietaryOptions.map(diet => (
              <label key={diet} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.dietaryPreferences.includes(diet)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        dietaryPreferences: [...prev.dietaryPreferences, diet]
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        dietaryPreferences: prev.dietaryPreferences.filter(d => d !== diet)
                      }));
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm capitalize">{diet.replace("_", " ")}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Health Goals
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {goalOptions.map(goal => (
              <label key={goal} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.goals.includes(goal)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        goals: [...prev.goals, goal]
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        goals: prev.goals.filter(g => g !== goal)
                      }));
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm capitalize">{goal.replace("_", " ")}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
