import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FUTURESKILL_API = "https://futureskill.co/fs-content-api/courses/public";
const BORNTODEV_API = "https://school.borntodev.com/api/catalog/courses";

interface NormalizedCourse {
  externalId: string;
  source: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  difficulty: string;
  durationMinutes: number;
  instructorName: string | null;
  categoryNames: string[];
  learnerCount: number;
  sourceUrl: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500);
}

async function fetchFutureSkill(page: number, limit: number) {
  const res = await fetch(`${FUTURESKILL_API}?page=${page}&limit=${limit}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("FutureSkill API error");
  const json = await res.json();
  const items = json.data?.items || [];
  const totalItems: number = json.data?.totalItems || 0;

  const difficultyMap: Record<string, string> = {
    "พื้นฐาน": "beginner", "ปานกลาง": "intermediate", "ยาก": "advanced",
  };

  const courses: NormalizedCourse[] = items.map((c: Record<string, unknown>) => ({
    externalId: `fs-${c.code}`,
    source: "futureskill",
    title: c.name as string,
    description: (c.shortDescription as string) || stripHtml(c.description as string).slice(0, 300),
    thumbnailUrl: c.thumbnailUrl as string,
    difficulty: difficultyMap[(c.difficult as Record<string, string>)?.name] || "beginner",
    durationMinutes: Math.round((c.duration as number) / 60000),
    instructorName: (c.instructor as Record<string, string> | null)?.name || null,
    categoryNames: ((c.categories as Array<Record<string, string>>) || []).map((cat) => cat.name),
    learnerCount: c.countLearner as number,
    sourceUrl: `https://futureskill.co/course/${c.code}`,
  }));

  return { courses, totalItems };
}

async function fetchBornToDev(page: number, limit: number) {
  const res = await fetch(`${BORNTODEV_API}?page=${page}&take=${limit}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("BornToDev API error");
  const json = await res.json();
  const items = json.data || [];
  const totalItems: number = json.meta?.itemCount || 0;

  const courses: NormalizedCourse[] = items.map((c: Record<string, unknown>) => ({
    externalId: `b2d-${c.id}`,
    source: "borntodev",
    title: c.title as string,
    description: (c.shortDescription as string) || "",
    thumbnailUrl: ((c.images as Record<string, string>)?.cover) || "",
    difficulty: "beginner",
    durationMinutes: 0,
    instructorName: ((c.instructors as Array<Record<string, string>>)?.[0]?.publicName) || null,
    categoryNames: [],
    learnerCount: (c.studentCount as number) || 0,
    sourceUrl: `https://school.borntodev.com/course/${c.slug}`,
  }));

  return { courses, totalItems };
}

async function fetchCustomUrl(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SkillShiftAI/1.0)" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const contentType = res.headers.get("content-type") || "";
  let courses: NormalizedCourse[] = [];

  if (contentType.includes("application/json")) {
    const json = await res.json();
    const items = json.data?.items || json.data || json.items || json.courses || json.results || [];
    const arr = Array.isArray(items) ? items : [];
    courses = arr.map((c: Record<string, unknown>, i: number) => ({
      externalId: `custom-${Date.now()}-${i}`,
      source: "custom",
      title: (c.name || c.title || c.course_name || c.CourseName) as string || `Course ${i + 1}`,
      description: (c.description || c.shortDescription || c.short_description || c.desc || "") as string,
      thumbnailUrl: (c.thumbnail || c.thumbnailUrl || c.image || c.cover || c.thumbnail_url || "") as string,
      difficulty: "beginner",
      durationMinutes: (c.duration || c.durationMinutes || c.duration_minutes || 0) as number,
      instructorName: (c.instructor || c.teacher || c.author || c.instructorName || null) as string | null,
      categoryNames: Array.isArray(c.categories || c.tags) ? (c.categories || c.tags) as string[] : [],
      learnerCount: (c.countLearner || c.learners || c.studentCount || c.enrolled || 0) as number,
      sourceUrl: url,
    }));
  } else {
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].trim() : url;
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const h2Matches = [...html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi)];

    courses = [{
      externalId: `custom-${Date.now()}-0`,
      source: "custom",
      title: h1Match ? h1Match[1].trim() : pageTitle,
      description: descMatch ? descMatch[1].trim() : "",
      thumbnailUrl: ogImage ? ogImage[1] : "",
      difficulty: "beginner",
      durationMinutes: 0,
      instructorName: null,
      categoryNames: h2Matches.slice(0, 5).map((m) => m[1].trim()),
      learnerCount: 0,
      sourceUrl: url,
    }];
  }

  return { courses, totalItems: courses.length };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source") || "futureskill";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const customUrl = searchParams.get("url");

    let result;
    if (source === "borntodev") {
      result = await fetchBornToDev(page, limit);
    } else if (source === "custom") {
      if (!customUrl) {
        return NextResponse.json({ error: "URL is required for custom source" }, { status: 400 });
      }
      result = await fetchCustomUrl(customUrl);
    } else {
      result = await fetchFutureSkill(page, limit);
    }

    return NextResponse.json({
      success: true,
      data: {
        courses: result.courses,
        pagination: {
          page,
          limit,
          totalItems: result.totalItems,
          totalPages: Math.ceil(result.totalItems / limit),
        },
      },
    });
  } catch (error) {
    console.error("[GET /api/training/import]", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const body = await request.json();
    const coursesToImport = body.courses as NormalizedCourse[];

    if (!Array.isArray(coursesToImport) || coursesToImport.length === 0) {
      return NextResponse.json({ error: "No courses to import" }, { status: 400 });
    }

    const results = [];
    for (const course of coursesToImport) {
      try {
        const existing = await prisma.course.findFirst({
          where: { title: course.title },
        });

        if (existing) {
          results.push({ title: course.title, status: "skipped", id: existing.id });
          continue;
        }

        const created = await prisma.course.create({
          data: {
            title: course.title,
            description: course.description,
            thumbnail: course.thumbnailUrl,
            difficulty: course.difficulty,
            duration: course.durationMinutes || undefined,
            isPublished: true,
          },
        });

        results.push({ title: course.title, status: "created", id: created.id });
      } catch {
        results.push({ title: course.title, status: "error" });
      }
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("[POST /api/training/import]", error);
    return NextResponse.json({ error: "Failed to import courses" }, { status: 500 });
  }
}
