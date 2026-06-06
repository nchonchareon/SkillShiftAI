import { NextResponse } from "next/server";
import { generateText } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = body.prompt as string | undefined;
    const courseTitle = body.courseTitle as string | undefined;
    const moduleContent = body.moduleContent as string | undefined;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Invalid question" }, { status: 400 });
    }

    if (prompt.length > 2000) {
      return NextResponse.json({ error: "Question too long (max 2000 chars)" }, { status: 400 });
    }

    const systemPrompt = `You are an AI Tutor for a corporate training course called "${courseTitle || "AI Tools Training"}".

Course context:
${moduleContent ? moduleContent.slice(0, 3000) : "No specific module content available."}

Instructions:
- Answer questions about the course content clearly and concisely
- Use examples when helpful
- If you don't know something, say so honestly
- Keep responses focused and educational
- Support both Thai and English responses based on the user's language`;

    const response = await generateText(`${systemPrompt}\n\nStudent question: ${prompt}`);

    return NextResponse.json({ success: true, data: { response } });
  } catch (error) {
    console.error("[POST /api/training/tutor]", error);
    return NextResponse.json({ error: "AI tutor is temporarily unavailable" }, { status: 502 });
  }
}
