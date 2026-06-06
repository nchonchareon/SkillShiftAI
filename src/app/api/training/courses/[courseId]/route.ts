import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { courseId } = await params;

    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json({ error: "Invalid courseId" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        skill: { select: { id: true, skillName: true, category: true } },
        modules: { orderBy: { sortOrder: "asc" } },
        _count: { select: { enrollments: true } },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    console.error("[GET /api/training/courses/[courseId]]", error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { courseId } = await params;

    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json({ error: "Invalid courseId" }, { status: 400 });
    }

    const existing = await prisma.course.findUnique({ where: { id: courseId } });
    if (!existing) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    await prisma.courseModule.deleteMany({ where: { courseId } });
    await prisma.userEnrollment.deleteMany({ where: { courseId } });
    await prisma.course.delete({ where: { id: courseId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/training/courses/[courseId]]", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
