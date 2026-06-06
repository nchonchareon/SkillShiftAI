import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_LIMIT = 100;
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_TASKS = 50;

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const status = searchParams.get("status");
    const rawPage = parseInt(searchParams.get("page") || "1");
    const rawLimit = parseInt(searchParams.get("limit") || "20");

    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
    const limit = isNaN(rawLimit) || rawLimit < 1 ? 20 : Math.min(rawLimit, MAX_LIMIT);

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
  } catch (error) {
    console.error("[Jobs GET Error]", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const body = await request.json();
    const { title, description, department, tasks, skillIds } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }
    if (title.length > MAX_TITLE_LENGTH) {
      return NextResponse.json({ error: "Title too long" }, { status: 400 });
    }
    if (description && typeof description === "string" && description.length > MAX_DESCRIPTION_LENGTH) {
      return NextResponse.json({ error: "Description too long" }, { status: 400 });
    }
    if (!Array.isArray(tasks) || tasks.length > MAX_TASKS) {
      return NextResponse.json({ error: "Tasks must be an array with max 50 items" }, { status: 400 });
    }
    if (tasks.some((t: unknown) => typeof t !== "string")) {
      return NextResponse.json({ error: "Each task must be a string" }, { status: 400 });
    }
    if (skillIds && (!Array.isArray(skillIds) || skillIds.some((s: unknown) => typeof s !== "string"))) {
      return NextResponse.json({ error: "skillIds must be an array of strings" }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        title: title.trim(),
        description: typeof description === "string" ? description.trim() : null,
        department: typeof department === "string" ? department.trim() : null,
        tasks: tasks.length
          ? { create: tasks.map((t: string) => ({ taskDescription: t.trim() })) }
          : undefined,
        jobSkills: skillIds?.length
          ? { create: skillIds.map((skillId: string) => ({ skillId, importanceLevel: 3 })) }
          : undefined,
      },
      include: { tasks: true, jobSkills: { include: { skill: true } } },
    });

    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (error) {
    console.error("[Jobs POST Error]", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
