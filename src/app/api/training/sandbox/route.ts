import { NextResponse } from "next/server";
import { generateText } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = body.prompt as string | undefined;
    const toolType = (body.toolType as string) || "typhoon";

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    if (prompt.length > 2000) {
      return NextResponse.json({ error: "Prompt too long (max 2000 chars)" }, { status: 400 });
    }

    const systemPrompt = `You are an AI training assistant for a corporate reskilling platform. Help the user practice using AI tools. Be helpful, concise, and educational. The user is practicing with tool type: ${toolType}.`;

    const response = await generateText(`${systemPrompt}\n\nUser: ${prompt}`, toolType);

    return NextResponse.json({ success: true, data: { response } });
  } catch (error) {
    console.error("[POST /api/training/sandbox]", error);
    return NextResponse.json({ error: "AI service is temporarily unavailable" }, { status: 502 });
  }
}
