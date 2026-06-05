"use client";

import { useLanguage } from "@/lib/i18n";
import { Users, Search, Filter, Award, AlertTriangle } from "lucide-react";

const employees = [
  { name: "สมชาย ใจดี", dept: "IT", skills: 12, risk: "low", score: 25 },
  { name: "สมหญิง รักงาน", dept: "Finance", skills: 8, risk: "medium", score: 52 },
  { name: "วิชัย เก่งมาก", dept: "Operations", skills: 15, risk: "low", score: 18 },
  { name: "พิมพ์ใจ สดใส", dept: "HR", skills: 6, risk: "high", score: 71 },
  { name: "ธนพล ทองดี", dept: "Marketing", skills: 10, risk: "medium", score: 45 },
  { name: "กมล สุขใจ", dept: "Sales", skills: 9, risk: "high", score: 78 },
];

export default function TalentPage() {
  const { locale } = useLanguage();

  const riskBadge = (risk: string) => {
    if (risk === "high") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    if (risk === "medium") return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{locale === "th" ? "ฐานบุคลากร" : "Talent Pool"}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {locale === "th" ? "ภาพรวมทักษะและความเสี่ยงของพนักงาน" : "Overview of employee skills and risk levels"}
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder={locale === "th" ? "ค้นหาพนักงาน..." : "Search employees..."}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <Filter className="w-4 h-4" /> {locale === "th" ? "กรอง" : "Filter"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400">{locale === "th" ? "ชื่อ" : "Name"}</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400">{locale === "th" ? "แผนก" : "Dept"}</th>
                <th className="text-center px-5 py-3 font-medium text-slate-500 dark:text-slate-400">{locale === "th" ? "ทักษะ" : "Skills"}</th>
                <th className="text-center px-5 py-3 font-medium text-slate-500 dark:text-slate-400">{locale === "th" ? "ความเสี่ยง" : "Risk"}</th>
                <th className="text-right px-5 py-3 font-medium text-slate-500 dark:text-slate-400">{locale === "th" ? "คะแนน" : "Score"}</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium">{emp.name}</td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{emp.dept}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1"><Award className="w-3.5 h-3.5 text-primary-500" /> {emp.skills}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${riskBadge(emp.risk)}`}>{emp.risk}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold">{emp.score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
