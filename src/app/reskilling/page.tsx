"use client";

import { useLanguage } from "@/lib/i18n";
import { Sparkles, ArrowRight, BookOpen, Target, TrendingUp, CheckCircle2 } from "lucide-react";

const pathways = [
  { from: "Data Entry", to: "Data Analysis", skills: ["Python", "SQL", "Excel"], gap: 35, color: "from-red-500 to-orange-500" },
  { from: "Customer Service", to: "CX Design", skills: ["UX Research", "Empathy Mapping", "Analytics"], gap: 28, color: "from-orange-500 to-yellow-500" },
  { from: "Accounting", to: "Financial Analytics", skills: ["Python", "BI Tools", "Statistics"], gap: 40, color: "from-yellow-500 to-emerald-500" },
  { from: "Manual Testing", to: "QA Automation", skills: ["Selenium", "CI/CD", "TypeScript"], gap: 45, color: "from-emerald-500 to-blue-500" },
  { from: "Basic SQL", to: "Data Engineering", skills: ["Spark", "Airflow", "dbt"], gap: 55, color: "from-blue-500 to-purple-500" },
];

export default function ReskillingPage() {
  const { locale } = useLanguage();

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{locale === "th" ? "พัฒนาทักษะ" : "Reskilling Pathways"}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {locale === "th" ? "เส้นทางการเปลี่ยนผ่านทักษะที่แนะนำโดย AI" : "AI-recommended skill transition pathways"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Target, label: locale === "th" ? "เส้นทางทั้งหมด" : "Total Pathways", value: "12", color: "text-primary-500" },
          { icon: BookOpen, label: locale === "th" ? "ทักษะที่ต้องเรียน" : "Skills to Learn", value: "47", color: "text-emerald-500" },
          { icon: TrendingUp, label: locale === "th" ? "อัตราสำเร็จ" : "Success Rate", value: "78%", color: "text-blue-500" },
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

      {/* Pathways */}
      <div className="space-y-4">
        {pathways.map((p, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold">{p.from}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-primary-500">{p.to}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.skills.map((s, j) => (
                    <span key={j} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium">{s}</span>
                  ))}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400">{locale === "th" ? "ช่องว่าง" : "Gap"}</p>
                <p className="text-xl font-bold">{p.gap}%</p>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className={`h-full rounded-full bg-gradient-to-r ${p.color}`} style={{ width: `${100 - p.gap}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
