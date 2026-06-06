"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { Sparkles, ArrowRight, BookOpen, Target, TrendingUp, AlertTriangle, Loader2, GraduationCap } from "lucide-react";

interface WeakSkill {
  skillId: string;
  skillName: string;
  category: string;
  currentLevel: number;
}

interface ReskillingUser {
  userId: string;
  name: string;
  currentJobTitle: string | null;
  totalSkills: number;
  averageProficiency: number;
  weakSkills: WeakSkill[];
  needsReskilling: boolean;
}

interface ReskillingData {
  summary: {
    totalUsers: number;
    usersNeedingReskilling: number;
    totalWeakSkills: number;
  };
  users: ReskillingUser[];
  needsReskilling: ReskillingUser[];
}

interface CourseSkill {
  id: string;
  skillName: string;
  category: string;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  skill: CourseSkill | null;
  _count: { modules: number; enrollments: number };
}

const categoryColors: Record<string, string> = {
  technical: "from-blue-500 to-cyan-500",
  soft: "from-orange-500 to-yellow-500",
  domain: "from-emerald-500 to-teal-500",
  management: "from-purple-500 to-pink-500",
};

const difficultyColor: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function ReskillingPage() {
  const { locale } = useLanguage();
  const [data, setData] = useState<ReskillingData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/reskilling").then((r) => r.json()),
      fetch("/api/training/courses").then((r) => r.json()),
    ])
      .then(([reskillingJson, coursesJson]) => {
        if (reskillingJson.success) setData(reskillingJson.data);
        else setError(reskillingJson.error || "Failed to load");
        if (coursesJson.success) setCourses(coursesJson.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const recommendedCourses = courses.filter((c) => {
    if (!data?.needsReskilling) return false;
    const weakSkillIds = data.needsReskilling.flatMap((u) => u.weakSkills.map((s) => s.skillId));
    return c.skill && weakSkillIds.includes(c.skill.id);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
          <p className="text-slate-500">{error || "No data"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{locale === "th" ? "พัฒนาทักษะ" : "Reskilling Pathways"}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {locale === "th" ? "เส้นทางการเปลี่ยนผ่านทักษะที่แนะนำโดย AI" : "AI-recommended skill transition pathways"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Target, label: locale === "th" ? "พนักงานทั้งหมด" : "Total Employees", value: String(data.summary.totalUsers), color: "text-primary-500" },
          { icon: BookOpen, label: locale === "th" ? "ต้องพัฒนาทักษะ" : "Need Reskilling", value: String(data.summary.usersNeedingReskilling), color: "text-emerald-500" },
          { icon: TrendingUp, label: locale === "th" ? "ทักษะที่ต้องเรียน" : "Skills to Learn", value: String(data.summary.totalWeakSkills), color: "text-blue-500" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <Icon className={`w-5 h-5 ${s.color} mb-2`} />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          );
        })}
      </div>

      {recommendedCourses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-semibold">{locale === "th" ? "คอร์สเรียนที่แนะนำ" : "Recommended Courses"}</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 -mt-2">
            {locale === "th" ? "คอร์สเรียนที่ตรงกับทักษะที่ต้องพัฒนา" : "Courses matched to your skill gaps"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedCourses.map((course) => (
              <Link key={course.id} href={`/training/${course.id}`}>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold group-hover:text-primary-500 transition-colors">{course.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${difficultyColor[course.difficulty] || difficultyColor.beginner}`}>
                      {course.difficulty}
                    </span>
                  </div>
                  {course.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{course.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course._count.modules} modules</span>
                      <span>{course._count.enrollments} students</span>
                    </div>
                    <span className="text-sm font-medium text-primary-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                      {locale === "th" ? "เริ่มเรียน" : "Start"} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {data.needsReskilling.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
            <Sparkles className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <p className="text-slate-500">{locale === "th" ? "ทุกคนมีทักษะเพียงพอ!" : "Everyone has sufficient skills!"}</p>
          </div>
        ) : (
          data.needsReskilling.map((user) => (
            <div key={user.userId} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{user.currentJobTitle || "-"}</p>
                </div>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">{locale === "th" ? "ทักษะ:" : "Skills:"} </span>
                    <span className="font-semibold">{user.totalSkills}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">{locale === "th" ? "เฉลี่ย:" : "Avg:"} </span>
                    <span className="font-semibold">{user.averageProficiency.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {user.weakSkills.map((skill) => (
                  <div key={skill.skillId} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{skill.skillName}</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-500">{skill.category}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${categoryColors[skill.category] || "from-slate-400 to-slate-500"}`}
                          style={{ width: `${(skill.currentLevel / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 w-8 text-right">{skill.currentLevel}/5</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
