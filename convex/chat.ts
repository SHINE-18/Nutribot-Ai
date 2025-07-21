import { v } from "convex/values";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const sendMessage = action({
  args: {
    message: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Get user profile and conversation history
    const userProfile: any = await ctx.runQuery(api.userProfiles.getUserProfile);
    const conversation: any = await ctx.runQuery(api.chat.getConversation);

    const profileContext: string = userProfile ? `
User Health Profile:
- Age: ${userProfile.age || "Not specified"}
- Weight: ${userProfile.weight || "Not specified"} kg
- Height: ${userProfile.height || "Not specified"} cm
- Activity Level: ${userProfile.activityLevel || "Not specified"}
- Health Conditions: ${userProfile.healthConditions.join(", ") || "None"}
- Allergies: ${userProfile.allergies.join(", ") || "None"}
- Dietary Preferences: ${userProfile.dietaryPreferences.join(", ") || "None"}
- Goals: ${userProfile.goals.join(", ") || "None"}
    ` : "";

    const systemPrompt: string = `You are a professional nutritionist and health advisor chatbot. Your role is to:

1. Analyze foods and provide health recommendations
2. Suggest healthier alternatives based on user's health conditions
3. Give personalized advice considering allergies, dietary preferences, and health goals
4. Provide portion size recommendations
5. Explain nutritional benefits and concerns

${profileContext}

Always be supportive, informative, and focus on practical advice. If the user asks about a specific food, provide a health score (1-10) and explain your reasoning.`;

    const messages: Array<{role: "system" | "user" | "assistant", content: string}> = [
      { role: "system", content: systemPrompt },
      ...(conversation?.messages || []).map((msg: any) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      { role: "user" as const, content: args.message }
    ];

    try {
      const response: any = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const assistantMessage: string | null = response.choices[0].message.content;
      if (!assistantMessage) {
        throw new Error("No response from AI");
      }

      // Save the conversation
      await ctx.runMutation(internal.chat.saveMessage, {
        userId,
        userMessage: args.message,
        assistantMessage,
      });

      return assistantMessage;
    } catch (error) {
      console.error("Error in chat:", error);
      throw new Error("Failed to get response. Please try again.");
    }
  },
});

export const saveMessage = internalMutation({
  args: {
    userId: v.id("users"),
    userMessage: v.string(),
    assistantMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const existingConversation = await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    const timestamp = Date.now();
    const newMessages = [
      { role: "user", content: args.userMessage, timestamp },
      { role: "assistant", content: args.assistantMessage, timestamp: timestamp + 1 }
    ];

    if (existingConversation) {
      const updatedMessages = [...existingConversation.messages, ...newMessages];
      // Keep only last 50 messages to prevent too much data
      const trimmedMessages = updatedMessages.slice(-50);
      
      await ctx.db.patch(existingConversation._id, {
        messages: trimmedMessages,
      });
    } else {
      await ctx.db.insert("conversations", {
        userId: args.userId,
        messages: newMessages,
      });
    }
  },
});

export const getConversation = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const clearConversation = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (conversation) {
      await ctx.db.delete(conversation._id);
    }
  },
});
