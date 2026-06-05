import { NextRequest, NextResponse } from "next/server";
import { analyzeJobDescription, analyzeStructuredJob, formatRawText } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription, formData, action } = body;

    // Handle format action for raw text
    if (action === "format") {
      if (!jobDescription || typeof jobDescription !== "string") {
        return NextResponse.json(
          { error: "Text to format is required" },
          { status: 400 }
        );
      }
      const formatted = await formatRawText(jobDescription);
      return NextResponse.json({ success: true, formatted });
    }

    // Handle structured form data
    if (formData && typeof formData === "object") {
      const { jobTitle, department, tasks, tools, skills } = formData;
      if (!jobTitle || !tasks) {
        return NextResponse.json(
          { error: "Job title and tasks are required" },
          { status: 400 }
        );
      }
      const analysis = await analyzeStructuredJob({
        jobTitle: jobTitle || "",
        department: department || "",
        tasks: tasks || "",
        tools: tools || "",
        skills: skills || "",
      });
      return NextResponse.json({ success: true, data: analysis });
    }

    // Handle raw job description text
    if (!jobDescription || typeof jobDescription !== "string") {
      return NextResponse.json(
        { error: "jobDescription or formData is required" },
        { status: 400 }
      );
    }

    if (jobDescription.trim().length < 20) {
      return NextResponse.json(
        { error: "Job description seems too short. Please provide more detail." },
        { status: 400 }
      );
    }

    const analysis = await analyzeJobDescription(jobDescription);

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error: any) {
    console.error("[AI Analyze Error]", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze job description" },
      { status: 500 }
    );
  }
}
