import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, string> = {};
    if (department) where.department = department;
    if (status) where.status = status;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          tasks: true,
          jobSkills: { include: { skill: true } },
          analysisResults: { orderBy: { createdAt: "desc" }, take: 1 },
          _count: { select: { tasks: true, jobSkills: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.job.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: jobs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("[Jobs GET Error]", error);
    return NextResponse.json({ error: error.message || "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const body = await request.json();
    const { title, description, department, tasks, skillIds } = body;

    if (!title) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description: description || null,
        department: department || null,
        tasks: tasks?.length
          ? { create: tasks.map((t: string) => ({ taskDescription: t })) }
          : undefined,
        jobSkills: skillIds?.length
          ? { create: skillIds.map((skillId: string) => ({ skillId, importanceLevel: 3 })) }
          : undefined,
      },
      include: { tasks: true, jobSkills: { include: { skill: true } } },
    });

    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (error: any) {
    console.error("[Jobs POST Error]", error);
    return NextResponse.json({ error: error.message || "Failed to create job" }, { status: 500 });
  }
}
