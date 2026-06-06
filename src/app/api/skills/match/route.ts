import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skillEmbedding, topK: rawTopK = 10, threshold: rawThreshold = 0.5 } = body;

    if (!skillEmbedding || !Array.isArray(skillEmbedding)) {
      return NextResponse.json({ error: "skillEmbedding must be an array of floats" }, { status: 400 });
    }

    if (skillEmbedding.length !== 1536) {
      return NextResponse.json({ error: "Embedding must have 1536 dimensions" }, { status: 400 });
    }

    if (skillEmbedding.some((v: unknown) => typeof v !== "number" || isNaN(v))) {
      return NextResponse.json({ error: "Embedding values must be valid numbers" }, { status: 400 });
    }

    const topK = typeof rawTopK === "number" && rawTopK > 0 ? Math.min(Math.floor(rawTopK), 100) : 10;
    const threshold = typeof rawThreshold === "number" ? Math.max(0, Math.min(rawThreshold, 1)) : 0.5;

    const mockResults = [
      { id: "1", skill_name: "Python", category: "technical", similarity: 0.95 },
      { id: "2", skill_name: "Data Analysis", category: "technical", similarity: 0.89 },
      { id: "3", skill_name: "Machine Learning", category: "technical", similarity: 0.87 },
    ];

    return NextResponse.json({
      success: true,
      data: mockResults.filter((r) => r.similarity >= threshold).slice(0, topK),
      note: "Mock data returned. Connect to PostgreSQL with pgvector for real results.",
    });
  } catch (error) {
    console.error("[Skill Match Error]", error);
    return NextResponse.json({ error: "Failed to match skills" }, { status: 500 });
  }
}
