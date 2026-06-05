import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, analysisType, input, output, model, confidence } = body;

    if (!jobId || !analysisType || !input || !output) {
      return NextResponse.json(
        { error: "jobId, analysisType, input, and output are required" },
        { status: 400 }
      );
    }

    const validTypes = ["job_analysis", "reskilling_recommendation", "skill_gap", "automation_impact"];
    if (!validTypes.includes(analysisType)) {
      return NextResponse.json(
        { error: `analysisType must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const result = await prisma.analysisResult.create({
      data: {
        jobId,
        analysisType,
        input,
        output,
        model: model || null,
        confidence: confidence || null,
      },
      include: { job: true },
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: any) {
    console.error("[Analyze POST Error]", error);
    return NextResponse.json({ error: error.message || "Failed to save analysis result" }, { status: 500 });
  }
}
