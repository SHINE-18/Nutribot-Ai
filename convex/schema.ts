import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  userProfiles: defineTable({
    userId: v.id("users"),
    age: v.optional(v.number()),
    weight: v.optional(v.number()),
    height: v.optional(v.number()),
    activityLevel: v.optional(v.string()), // sedentary, light, moderate, active, very_active
    healthConditions: v.array(v.string()), // diabetes, hypertension, heart_disease, etc.
    allergies: v.array(v.string()),
    dietaryPreferences: v.array(v.string()), // vegetarian, vegan, keto, etc.
    goals: v.array(v.string()), // weight_loss, muscle_gain, maintain_health, etc.
  }).index("by_user", ["userId"]),

  foodQueries: defineTable({
    userId: v.id("users"),
    foodName: v.string(),
    query: v.string(),
    response: v.string(),
    recommendation: v.string(),
    alternatives: v.array(v.string()),
    healthScore: v.number(), // 1-10 scale
  }).index("by_user", ["userId"]),

  conversations: defineTable({
    userId: v.id("users"),
    messages: v.array(v.object({
      role: v.string(), // user, assistant
      content: v.string(),
      timestamp: v.number(),
    })),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
