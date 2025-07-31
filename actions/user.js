"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    //in this block either everything completes entirely or rolls back to failure
    const result = await db.$transaction(
      //A transaction is an all-or-nothing wrapper around DB operations. if any step fails, all changes are rolled back.
      async (tx) => {
        //Inside the callback you get a scoped Prisma client (tx) that points to the same session.

        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });

        if (!industryInsight) {
          const insights = await generateAIInsights(data.industry);

          industryInsight = await db.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set next update to one week later
            },
          });
        }
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
        //we try to find if the industry exists
        //if the industry doesn't exist then we create it with default values and replace it later with AI
        //update the user
        //if anything fails ,the transaction fails and gives us error

        return { updatedUser, industryInsight };
        //what result returns
      },
      {
        timeout: 10000,
      },
    );
    return { success: true, ...result };
    //basically { success: true, updatedUser, industryInsight}
  } catch (error) {
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { isOnboarded: false };
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });

    if (!user) {
      // User doesn't exist in database yet, create them
      const clerkUser = await import("@clerk/nextjs/server").then(m => m.currentUser());
      if (clerkUser) {
        const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();
        await db.user.create({
          data: {
            clerkUserId: userId,
            name: name || 'User',
            imageUrl: clerkUser.imageUrl,
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
          },
        });
      }
      return { isOnboarded: false };
    }

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    // Return false instead of throwing error to prevent app crash
    return { isOnboarded: false };
  }
}
