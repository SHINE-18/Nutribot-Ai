import { v } from "convex/values";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const analyzeFood = action({
  args: {
    foodName: v.string(),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Get user profile for personalized advice
    const userProfile = await ctx.runQuery(api.userProfiles.getUserProfile);
    
    const profileContext = userProfile ? `
User Profile:
- Age: ${userProfile.age || "Not specified"}
- Weight: ${userProfile.weight || "Not specified"} kg
- Height: ${userProfile.height || "Not specified"} cm
- Activity Level: ${userProfile.activityLevel || "Not specified"}
- Health Conditions: ${userProfile.healthConditions.join(", ") || "None specified"}
- Allergies: ${userProfile.allergies.join(", ") || "None specified"}
- Dietary Preferences: ${userProfile.dietaryPreferences.join(", ") || "None specified"}
- Goals: ${userProfile.goals.join(", ") || "None specified"}
    ` : "No user profile available.";

    const prompt = `You are a professional nutritionist and health advisor. Analyze the food "${args.foodName}" based on the user's query: "${args.query}"

${profileContext}

Please provide:
1. A health score (1-10, where 10 is excellent for health)
2. Detailed analysis of nutritional benefits and concerns
3. Specific recommendations based on the user's health conditions and goals
4. 3-5 healthier alternatives if the food isn't optimal
5. Portion size recommendations

Format your response as JSON with these fields:
{
  "healthScore": number,
  "analysis": "detailed analysis",
  "recommendation": "specific recommendation",
  "alternatives": ["alternative1", "alternative2", "alternative3"],
  "portionAdvice": "portion guidance"
}

Be specific about how this food relates to their health conditions, allergies, and goals.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No response from AI");
      }

      // Parse the JSON response
      const analysis = JSON.parse(content);

      // Save the query and response
      await ctx.runMutation(internal.foodAnalysis.saveFoodQuery, {
        userId,
        foodName: args.foodName,
        query: args.query,
        response: analysis.analysis,
        recommendation: analysis.recommendation,
        alternatives: analysis.alternatives,
        healthScore: analysis.healthScore,
      });

      return analysis;
    } catch (error) {
      console.error("Error analyzing food:", error);
      throw new Error("Failed to analyze food. Please try again.");
    }
  },
});

export const saveFoodQuery = internalMutation({
  args: {
    userId: v.id("users"),
    foodName: v.string(),
    query: v.string(),
    response: v.string(),
    recommendation: v.string(),
    alternatives: v.array(v.string()),
    healthScore: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("foodQueries", args);
  },
});

export const getFoodHistory = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("foodQueries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});
