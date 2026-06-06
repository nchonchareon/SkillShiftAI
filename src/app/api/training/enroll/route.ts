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

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }
    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json({ error: "Invalid courseId" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const existing = await prisma.userEnrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        data: existing,
        message: "Already enrolled",
      });
    }

    const enrollment = await prisma.userEnrollment.create({
      data: { userId, courseId, status: "ENROLLED", progress: 0 },
      include: { course: { select: { id: true, title: true } } },
    });

    return NextResponse.json({ success: true, data: enrollment }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/training/enroll]", error);
    return NextResponse.json({ error: "Failed to enroll" }, { status: 500 });
  }
}
