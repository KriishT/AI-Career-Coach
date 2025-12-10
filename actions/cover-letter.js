"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateCoverLetter(data) {
  try {
    // Validate input data
    if (!data || typeof data !== 'object') {
      throw new Error("Invalid input data");
    }
    
    if (!data.companyName || !data.jobTitle || !data.jobDescription) {
      throw new Error("Missing required fields: companyName, jobTitle, and jobDescription are required");
    }

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Validate GEMINI_API_KEY
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.industry) {
      throw new Error("Please complete your onboarding to set your industry before generating cover letters");
    }

    // Safely handle optional fields
    const skillsText = user.skills && user.skills.length > 0 
      ? user.skills.join(", ") 
      : "Not specified";
    const experienceText = user.experience !== null && user.experience !== undefined 
      ? `${user.experience} years` 
      : "Not specified";
    const bioText = user.bio || "Not provided";

    const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${data.companyName}.
    
    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${experienceText}
    - Skills: ${skillsText}
    - Professional Background: ${bioText}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    if (!content) {
      throw new Error("Failed to generate cover letter content");
    }

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    
    // Re-throw with a user-friendly message
    const errorMessage = error?.message || "Failed to generate cover letter. Please try again.";
    
    // Ensure we throw a proper Error object that can be serialized
    if (error instanceof Error) {
      // Preserve specific error messages
      if (error.message === "Unauthorized" || 
          error.message === "User not found" ||
          error.message === "GEMINI_API_KEY is not configured" ||
          error.message.includes("onboarding")) {
        throw error;
      }
    }
    
    throw new Error(errorMessage);
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}
