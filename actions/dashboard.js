"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Valid enum values (matching your Prisma schema)
const DEMAND_ENUMS = ["HIGH", "MEDIUM", "LOW"];
const OUTLOOK_ENUMS = ["POSITIVE", "NEUTRAL", "NEGATIVE"];

// Normalize enums from AI
const normalizeEnumValues = (insights) => {
  const demandLevel = insights.demandLevel?.toUpperCase();
  const marketOutlook = insights.marketOutlook?.toUpperCase();

  if (!DEMAND_ENUMS.includes(demandLevel)) {
    throw new Error(`Invalid demand level: ${demandLevel}`);
  }

  if (!OUTLOOK_ENUMS.includes(marketOutlook)) {
    throw new Error(`Invalid market outlook: ${marketOutlook}`);
  }

  return {
    ...insights,
    demandLevel,
    marketOutlook,
  };
};

export const generativeAIInsights = async (industry) => {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating AI insights:", error);
    throw new Error("Failed to generate industry insights. Please try again.");
  }
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // Check if user has completed onboarding (has industry set)
  if (!user.industry) {
    throw new Error("User has not completed onboarding. Please set your industry first.");
  }

  if (!user.industryInsight) {
    let insights = await generativeAIInsights(user.industry);
    insights = normalizeEnumValues(insights); // Normalize enums

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}
