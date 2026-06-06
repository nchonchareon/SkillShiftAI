import { NextRequest, NextResponse } from "next/server";
import { analyzeJobDescription, analyzeStructuredJob, formatRawText, getAIProvider } from "@/lib/ai";

const MAX_INPUT_LENGTH = 10_000;

export async function POST(request: NextRequest) {
  try {
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 1_048_576) {
      return NextResponse.json({ error: "Request body too large" }, { status: 413 });
    }

    const body = await request.json();
    const { jobDescription, formData, action } = body;

    if (action === "format") {
      if (!jobDescription || typeof jobDescription !== "string") {
        return NextResponse.json({ error: "Text to format is required" }, { status: 400 });
      }
      if (jobDescription.length > MAX_INPUT_LENGTH) {
        return NextResponse.json({ error: "Input too long" }, { status: 400 });
      }
      const formatted = await formatRawText(jobDescription);
      return NextResponse.json({ success: true, formatted, provider: getAIProvider() });
    }

    if (formData && typeof formData === "object") {
      const { jobTitle, department, tasks, tools, skills } = formData;
      if (!jobTitle || !tasks) {
        return NextResponse.json({ error: "Job title and tasks are required" }, { status: 400 });
      }
      for (const field of [jobTitle, department, tasks, tools, skills]) {
        if (typeof field === "string" && field.length > MAX_INPUT_LENGTH) {
          return NextResponse.json({ error: "Input too long" }, { status: 400 });
        }
      }
      const analysis = await analyzeStructuredJob({
        jobTitle: String(jobTitle || ""),
        department: String(department || ""),
        tasks: String(tasks || ""),
        tools: String(tools || ""),
        skills: String(skills || ""),
      });
      return NextResponse.json({ success: true, data: analysis, provider: getAIProvider() });
    }

    if (!jobDescription || typeof jobDescription !== "string") {
      return NextResponse.json({ error: "jobDescription or formData is required" }, { status: 400 });
    }

    if (jobDescription.length > MAX_INPUT_LENGTH) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }

    if (jobDescription.trim().length < 20) {
      return NextResponse.json({ error: "Job description seems too short. Please provide more detail." }, { status: 400 });
    }

    const analysis = await analyzeJobDescription(jobDescription);

    return NextResponse.json({ success: true, data: analysis, provider: getAIProvider() });
  } catch (error) {
    console.error("[AI Analyze Error]", error);
    return NextResponse.json({ error: "Failed to analyze job description" }, { status: 500 });
  }
}
