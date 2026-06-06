"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { Users, Search, Filter, Award, AlertTriangle, Loader2, GraduationCap } from "lucide-react";

interface TalentSkill {
  skillName: string;
  category: string;
  proficiencyLevel: number;
}

interface TalentPerson {
  userId: string;
  name: string;
  email: string;
  role: string;
  currentJobTitle: string | null;
  department: string | null;
  totalSkills: number;
  topSkills: TalentSkill[];
  allSkills: TalentSkill[];
  averageProficiency: number;
  training: {
    totalEnrollments: number;
    completedCourses: number;
    averageProgress: number;
  };
}

interface TalentData {
  summary: {
    totalTalent: number;
    totalUsers: number;
    categoryBreakdown: Record<string, number>;
  };
  talent: TalentPerson[];
}

export default function TalentPage() {
  const { locale } = useLanguage();
  const [data, setData] = useState<TalentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/talent")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data);
        else setError(json.error || "Failed to load");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const riskLevel = (avg: number): { label: string; color: string } => {
    if (avg >= 3.5) return { label: locale === "th" ? "ต่ำ" : "Low", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
    if (avg >= 2.5) return { label: locale === "th" ? "ปานกลาง" : "Medium", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" };
    return { label: locale === "th" ? "สูง" : "High", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
  };

  const filteredTalent = data?.talent.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.department?.toLowerCase().includes(search.toLowerCase()) ||
      t.currentJobTitle?.toLowerCase().includes(search.toLowerCase())
  ) || [];

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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{locale === "th" ? "ฐานบุคลากร" : "Talent Pool"}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {locale === "th" ? "ภาพรวมทักษะและความเสี่ยงของพนักงาน" : "Overview of employee skills and risk levels"}
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: locale === "th" ? "พนักงานทั้งหมด" : "Total Employees", value: String(data.summary.totalUsers), color: "text-primary-500" },
          { label: locale === "th" ? "มีทักษะโดดเด่น" : "Skilled Talent", value: String(data.summary.totalTalent), color: "text-emerald-500" },
          { label: locale === "th" ? "หมวดทักษะ" : "Skill Categories", value: String(Object.keys(data.summary.categoryBreakdown).length), color: "text-blue-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={locale === "th" ? "ค้นหาพนักงาน..." : "Search employees..."}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400">{locale === "th" ? "ชื่อ" : "Name"}</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400">{locale === "th" ? "ตำแหน่ง" : "Position"}</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400">{locale === "th" ? "แผนก" : "Dept"}</th>
                <th className="text-center px-5 py-3 font-medium text-slate-500 dark:text-slate-400">{locale === "th" ? "ทักษะ" : "Skills"}</th>
                <th className="text-center px-5 py-3 font-medium text-slate-500 dark:text-slate-400">{locale === "th" ? "ระดับ" : "Avg"}</th>
                <th className="text-center px-5 py-3 font-medium text-slate-500 dark:text-slate-400">
                  <span className="flex items-center justify-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {locale === "th" ? "ฝึกอบรม" : "Training"}</span>
                </th>
                <th className="text-center px-5 py-3 font-medium text-slate-500 dark:text-slate-400">{locale === "th" ? "ความเสี่ยง" : "Risk"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTalent.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    {locale === "th" ? "ไม่พบข้อมูล" : "No data found"}
                  </td>
                </tr>
              ) : (
                filteredTalent.map((person) => {
                  const risk = riskLevel(person.averageProficiency);
                  return (
                    <tr key={person.userId} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium">{person.name}</td>
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{person.currentJobTitle || "-"}</td>
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{person.department || "-"}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1"><Award className="w-3.5 h-3.5 text-primary-500" /> {person.totalSkills}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center font-semibold">{person.averageProficiency.toFixed(1)}</td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-xs text-slate-500">{person.training.completedCourses}/{person.training.totalEnrollments}</span>
                          <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-emerald-500"
                              style={{ width: `${person.training.averageProgress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${risk.color}`}>{risk.label}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
