import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId) {
      const userWithSkills = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          userSkills: {
            include: { skill: true },
            orderBy: { proficiencyLevel: "desc" },
          },
        },
      });

      if (!userWithSkills) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const weakSkills = userWithSkills.userSkills
        .filter((us) => us.proficiencyLevel <= 2)
        .map((us) => ({
          skillName: us.skill.skillName,
          category: us.skill.category,
          currentLevel: us.proficiencyLevel,
          recommendedLevel: 4,
        }));

      const strongSkills = userWithSkills.userSkills
        .filter((us) => us.proficiencyLevel >= 4)
        .map((us) => ({
          skillName: us.skill.skillName,
          category: us.skill.category,
          currentLevel: us.proficiencyLevel,
        }));

      return NextResponse.json({
        success: true,
        data: {
          user: { id: userWithSkills.id, name: userWithSkills.name, currentJobTitle: userWithSkills.currentJobTitle },
          allSkills: userWithSkills.userSkills,
          weakSkills,
          strongSkills,
          recommendedCourses: weakSkills.map((ws) => ({
            skill: ws.skillName,
            courseType: ws.category === "technical" ? "online" : "workshop",
            priority: ws.currentLevel <= 1 ? "high" : "medium",
            estimatedHours: ws.category === "technical" ? 40 : 16,
          })),
        },
      });
    }

    // Return all users with aggregated skill data
    const users = await prisma.user.findMany({
      include: {
        userSkills: {
          include: { skill: true },
          orderBy: { proficiencyLevel: "desc" },
        },
        _count: { select: { userSkills: true } },
      },
      orderBy: { name: "asc" },
    });

    const reskillingData = users.map((user) => {
      const weakSkills = user.userSkills
        .filter((us) => us.proficiencyLevel <= 2)
        .map((us) => ({
          skillId: us.skillId,
          skillName: us.skill.skillName,
          category: us.skill.category,
          currentLevel: us.proficiencyLevel,
        }));

      const avgProficiency =
        user.userSkills.length > 0
          ? user.userSkills.reduce((sum, us) => sum + us.proficiencyLevel, 0) / user.userSkills.length
          : 0;

      return {
        userId: user.id,
        name: user.name,
        currentJobTitle: user.currentJobTitle,
        totalSkills: user._count.userSkills,
        averageProficiency: Math.round(avgProficiency * 100) / 100,
        weakSkills,
        needsReskilling: weakSkills.length > 0,
      };
    });

    const needsReskilling = reskillingData.filter((r) => r.needsReskilling);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalUsers: users.length,
          usersNeedingReskilling: needsReskilling.length,
          totalWeakSkills: needsReskilling.reduce((sum, r) => sum + r.weakSkills.length, 0),
        },
        users: reskillingData,
        needsReskilling,
      },
    });
  } catch (error: any) {
    console.error("[Reskilling GET Error]", error);
    return NextResponse.json({ error: error.message || "Failed to fetch reskilling data" }, { status: 500 });
  }
}
