import { NextRequest, NextResponse } from "next/server";

// Skill matching using pgvector cosine similarity
// This route queries the database for skills semantically similar to a given embedding

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skillEmbedding, topK = 10, threshold = 0.5 } = body;

    if (!skillEmbedding || !Array.isArray(skillEmbedding)) {
      return NextResponse.json(
        { error: "skillEmbedding must be an array of floats" },
        { status: 400 }
      );
    }

    if (skillEmbedding.length !== 1536) {
      return NextResponse.json(
        { error: "Embedding must have 1536 dimensions" },
        { status: 400 }
      );
    }

    // Convert embedding array to PostgreSQL vector string format
    const vectorString = `[${skillEmbedding.join(",")}]`;

    // Raw SQL query using pgvector for cosine similarity search
    // This requires the pgvector extension to be enabled in PostgreSQL
    const query = `
      SELECT 
        ms.id,
        ms.skill_name,
        ms.category,
        1 - (ms.embedding <=> $1::vector) AS similarity
      FROM master_skills ms
      WHERE ms.embedding IS NOT NULL
        AND 1 - (ms.embedding <=> $1::vector) >= $2
      ORDER BY ms.embedding <=> $1::vector
      LIMIT $3
    `;

    // NOTE: In production, execute this query with your Prisma/PG client:
    // const results = await prisma.$queryRawUnsafe(query, vectorString, threshold, topK);

    // For demo purposes, return a mock response structure
    const mockResults = [
      { id: "1", skill_name: "Python", category: "technical", similarity: 0.95 },
      { id: "2", skill_name: "Data Analysis", category: "technical", similarity: 0.89 },
      { id: "3", skill_name: "Machine Learning", category: "technical", similarity: 0.87 },
    ];

    return NextResponse.json({
      success: true,
      data: mockResults.filter((r) => r.similarity >= threshold).slice(0, topK),
      note: "Mock data returned. Connect to PostgreSQL with pgvector for real results.",
      query_used: query.trim(),
    });
  } catch (error: any) {
    console.error("[Skill Match Error]", error);
    return NextResponse.json(
      { error: error.message || "Failed to match skills" },
      { status: 500 }
    );
  }
}
