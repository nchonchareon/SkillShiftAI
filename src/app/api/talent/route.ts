import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const skillFilter = searchParams.get("skill");
    const rawMinProf = parseInt(searchParams.get("minProficiency") || "1");
    const minProficiency = isNaN(rawMinProf) || rawMinProf < 1 || rawMinProf > 5 ? 1 : rawMinProf;

    const users = await prisma.user.findMany({
      include: {
        userSkills: {
          include: { skill: true },
          where: skillFilter
            ? { skill: { skillName: { contains: skillFilter, mode: "insensitive" } } }
            : undefined,
          orderBy: { proficiencyLevel: "desc" },
        },
        _count: { select: { userSkills: true } },
      },
      orderBy: { name: "asc" },
    });

    const talentPool = users
      .filter((u) => u.userSkills.some((us) => us.proficiencyLevel >= minProficiency))
      .map((user) => {
        const topSkills = user.userSkills
          .filter((us) => us.proficiencyLevel >= 4)
          .map((us) => ({
            skillName: us.skill.skillName,
            category: us.skill.category,
            proficiencyLevel: us.proficiencyLevel,
          }));

        const allSkills = user.userSkills.map((us) => ({
          skillName: us.skill.skillName,
          category: us.skill.category,
          proficiencyLevel: us.proficiencyLevel,
        }));

        const avgProficiency =
          user.userSkills.length > 0
            ? user.userSkills.reduce((sum, us) => sum + us.proficiencyLevel, 0) / user.userSkills.length
            : 0;

        return {
          userId: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          currentJobTitle: user.currentJobTitle,
          department: user.department,
          totalSkills: user._count.userSkills,
          topSkills,
          allSkills,
          averageProficiency: Math.round(avgProficiency * 100) / 100,
        };
      });

    const categoryBreakdown: Record<string, number> = {};
    for (const person of talentPool) {
      for (const skill of person.allSkills) {
        categoryBreakdown[skill.category] = (categoryBreakdown[skill.category] || 0) + 1;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalTalent: talentPool.length,
          totalUsers: users.length,
          categoryBreakdown,
        },
        talent: talentPool,
      },
    });
  } catch (error) {
    console.error("[Talent GET Error]", error);
    return NextResponse.json({ error: "Failed to fetch talent pool" }, { status: 500 });
  }
}
