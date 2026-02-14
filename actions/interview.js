"use server";

// Import necessary libraries and tools
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";


// Initialize the AI model (lazy to allow missing key to be caught in generateQuiz)
function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it in .env to enable quiz generation."
    );
  }
  return new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: "gemini-2.5-flash",
  });
}

/**
 * Extracts a JSON object from AI response (handles markdown wrappers and extra text).
 */
function extractJsonFromResponse(text) {
  if (!text?.trim()) return null;
  let cleaned = text.replace(/```(?:json)?\n?/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.slice(start, end + 1);
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

/**
 * Generates a quiz based on the user's industry and skills.
 */
export async function generateQuiz() {
  // Authenticate the user
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get user info from the database
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const industry = user.industry?.trim() || "general technology";
  const skillsSuffix = user.skills?.length
    ? ` with expertise in ${user.skills.join(", ")}`
    : "";

  const prompt = `
Generate exactly 10 technical interview questions for a ${industry} professional${skillsSuffix}.

Each question must be multiple choice with exactly 4 options.
For "correctAnswer", use the exact option text (one of the four option strings).

Return ONLY valid JSON in this shape, no other text or markdown:
{
  "questions": [
    {
      "question": "Your question here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Brief explanation."
    }
  ]
}
`;

  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    if (!response) {
      throw new Error("No response from the AI model.");
    }
    const responseText = response.text();
    const quiz = extractJsonFromResponse(responseText);
    if (!quiz?.questions || !Array.isArray(quiz.questions)) {
      console.error("Unexpected quiz response shape:", responseText?.slice(0, 500));
      throw new Error(
        "Quiz response was invalid. Please try again."
      );
    }
    // Normalize: ensure each item has question, options, correctAnswer, explanation
    const normalized = quiz.questions
      .filter(
        (q) =>
          q &&
          typeof q.question === "string" &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          (typeof q.correctAnswer === "string" || typeof q.correctAnswer === "number")
      )
      .slice(0, 10)
      .map((q) => ({
        question: String(q.question).trim(),
        options: q.options.map((o) => String(o).trim()),
        correctAnswer:
          typeof q.correctAnswer === "number"
            ? q.options[q.correctAnswer]
            : String(q.correctAnswer).trim(),
        explanation: typeof q.explanation === "string" ? q.explanation.trim() : "",
      }));
    if (normalized.length < 5) {
      throw new Error(
        "Not enough valid questions were generated. Please try again."
      );
    }
    return normalized;
  } catch (error) {
    console.error("Error generating quiz:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Quiz response was invalid. Please try again.");
    }
    if (error.message?.includes("GEMINI_API_KEY") || error.message?.includes("No response")) {
      throw error;
    }
    throw new Error(
      error.message || "Failed to generate quiz questions. Please try again."
    );
  }
}

/**
 * Saves the result of a quiz, and optionally generates improvement tips.
 */
export async function saveQuizResult(questions, answers, score) {
  // Authenticate the user
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get user info
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  // Build results for each question
  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Filter out incorrect answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  let improvementTip = null;

  // Only generate tips if there are mistakes
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      // Generate improvement tip using AI
      const tipModel = getModel();
      const tipResult = await tipModel.generateContent(improvementPrompt);
      improvementTip = tipResult.response.text().trim();
      console.log(improvementTip);
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // Continue without a tip if generation fails
    }
  }

  try {
    // Save the quiz result to the database
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

/**
 * Retrieves all past assessments for the logged-in user.
 */
export async function getAssessments() {
  // Authenticate the user
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get user info
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    // Fetch assessments from the database
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}