import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const body = await request.json();
    const userId = body.userId as string | undefined;
    const courseId = body.courseId as string | undefined;
    const progress = body.progress as number | undefined;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }
    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json({ error: "Invalid courseId" }, { status: 400 });
    }
    if (typeof progress !== "number" || Number.isNaN(progress) || progress < 0 || progress > 100) {
      return NextResponse.json({ error: "Invalid progress value" }, { status: 400 });
    }

    const enrollment = await prisma.userEnrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    const newStatus = progress >= 100 ? "COMPLETED" : progress > 0 ? "IN_PROGRESS" : "ENROLLED";
    const completedAt = progress >= 100 && enrollment.status !== "COMPLETED" ? new Date() : enrollment.completedAt;

    const updated = await prisma.userEnrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: Math.min(100, Math.max(0, progress)),
        status: newStatus,
        completedAt,
        lastAccessedAt: new Date(),
      },
      include: { course: { select: { id: true, title: true, skillId: true } } },
    });

    if (progress >= 100 && enrollment.status !== "COMPLETED" && updated.course.skillId) {
      const skillId = updated.course.skillId;
      const existingSkill = await prisma.userSkill.findUnique({
        where: { userId_skillId: { userId, skillId } },
      });

      if (existingSkill) {
        const newLevel = Math.min(5, existingSkill.proficiencyLevel + 1);
        await prisma.userSkill.update({
          where: { id: existingSkill.id },
          data: { proficiencyLevel: newLevel, lastAssessedAt: new Date() },
        });
      } else {
        await prisma.userSkill.create({
          data: {
            userId,
            skillId,
            proficiencyLevel: 2,
            lastAssessedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[POST /api/training/progress]", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
