import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!prisma) {
    return NextResponse.json({
      configured: false,
      connected: false,
      message: "DATABASE_URL not configured",
    });
  }

  try {
    const [userCount, skillCount, jobCount, jobSkillCount, userSkillCount, analysisCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.masterSkill.count(),
        prisma.job.count(),
        prisma.jobSkill.count(),
        prisma.userSkill.count(),
        prisma.analysisResult.count(),
      ]);

    return NextResponse.json({
      configured: true,
      connected: true,
      message: "Connected to Neon PostgreSQL",
      tables: {
        users: userCount,
        master_skills: skillCount,
        jobs: jobCount,
        job_skills: jobSkillCount,
        user_skills: userSkillCount,
        analysis_results: analysisCount,
      },
      totalRecords: userCount + skillCount + jobCount + jobSkillCount + userSkillCount + analysisCount,
    });
  } catch (error) {
    return NextResponse.json({
      configured: true,
      connected: false,
      message: "Connection failed",
    });
  }
}
