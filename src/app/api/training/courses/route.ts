import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const skillIdsParam = searchParams.get("skillIds");
    const skillIds = skillIdsParam ? skillIdsParam.split(",").filter(Boolean) : [];

    const where: Record<string, unknown> = { isPublished: true };

    if (skillIds.length > 0) {
      where.skillId = { in: skillIds };
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        skill: { select: { id: true, skillName: true, category: true } },
        _count: { select: { modules: true, enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    console.error("[GET /api/training/courses]", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}
