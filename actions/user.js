"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generativeAIInsights } from "./dashboard"; // ✅ correct import

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

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const result = await db.$transaction(async (tx) => {
      // Check if industry insight already exists
      let industryInsight = await tx.industryInsight.findUnique({
        where: {
          industry: data.industry,
        },
      });

      // If not, generate it with AI
      if (!industryInsight) {
        let insights = await generativeAIInsights(data.industry);
        insights = normalizeEnumValues(insights); // ✅ normalize enums

        industryInsight = await tx.industryInsight.create({
          data: {
            industry: data.industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
          },
        });
      }

      // Update the user
      const updatedUser = await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          industry: data.industry,
          experience: data.experience,
          bio: data.bio,
          skills: data.skills,
        },
      });

      return { updatedUser, industryInsight };
    }, {
      timeout: 10000,
    });

    return { success: true, ...result };
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile: " + error.message);
  }
}


export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });

    if (!user) throw new Error("User not found");

    return {
      isOnboarded: !!user.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}
