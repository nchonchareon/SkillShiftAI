"use client";

import { useLanguage } from "@/lib/i18n";
import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";

const trends = [
  { period: "Q1 2024", risk: 38, reskilled: 120, redesigned: 15 },
  { period: "Q2 2024", risk: 41, reskilled: 185, redesigned: 22 },
  { period: "Q3 2024", risk: 43, reskilled: 260, redesigned: 35 },
  { period: "Q4 2024", risk: 43.2, reskilled: 324, redesigned: 48 },
];

export default function AnalyticsPage() {
  const { locale } = useLanguage();

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{locale === "th" ? "รายงานและสถิติ" : "Analytics & Reports"}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {locale === "th" ? "แนวโน้มการเปลี่ยนแปลงขององค์กรตามไตรมาส" : "Quarterly organizational transformation trends"}
        </p>
      </div>

      {/* Quarterly Trends */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
        <h2 className="font-semibold text-lg mb-5">{locale === "th" ? "แนวโน้มรายไตรมาส" : "Quarterly Trends"}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="text-left px-4 py-3 font-medium text-slate-500">{locale === "th" ? "ไตรมาส" : "Quarter"}</th>
                <th className="text-center px-4 py-3 font-medium text-slate-500">{locale === "th" ? "ความเสี่ยงเฉลี่ย" : "Avg Risk"}</th>
                <th className="text-center px-4 py-3 font-medium text-slate-500">{locale === "th" ? "พัฒนาทักษะ" : "Reskilled"}</th>
                <th className="text-center px-4 py-3 font-medium text-slate-500">{locale === "th" ? "ออกแบบงานใหม่" : "Redesigned"}</th>
                <th className="text-center px-4 py-3 font-medium text-slate-500">{locale === "th" ? "แนวโน้ม" : "Trend"}</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50">
                  <td className="px-4 py-3.5 font-medium">{row.period}</td>
                  <td className="px-4 py-3.5 text-center">{row.risk}%</td>
                  <td className="px-4 py-3.5 text-center text-emerald-600 dark:text-emerald-400">{row.reskilled}</td>
                  <td className="px-4 py-3.5 text-center text-primary-600 dark:text-primary-400">{row.redesigned}</td>
                  <td className="px-4 py-3.5 text-center">
                    {i > 0 && (
                      row.risk > trends[i - 1].risk ? <TrendingUp className="w-4 h-4 text-red-500 mx-auto" /> :
                      row.risk < trends[i - 1].risk ? <TrendingDown className="w-4 h-4 text-emerald-500 mx-auto" /> :
                      <Minus className="w-4 h-4 text-slate-400 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="font-semibold mb-3">{locale === "th" ? "สรุปปี 2024" : "2024 Summary"}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">{locale === "th" ? "งานออกแบบใหม่ทั้งหมด" : "Total Redesigned"}</span><span className="font-semibold">48</span></div>
            <div className="flex justify-between"><span className="text-slate-500">{locale === "th" ? "พนักงานพัฒนาทักษะ" : "Employees Reskilled"}</span><span className="font-semibold">324</span></div>
            <div className="flex justify-between"><span className="text-slate-500">{locale === "th" ? "ลดความเสี่ยงเฉลี่ย" : "Avg Risk Reduction"}</span><span className="font-semibold text-emerald-500">-5.2%</span></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="font-semibold mb-3">{locale === "th" ? "เป้าหมาย 2025" : "2025 Targets"}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">{locale === "th" ? "ออกแบบงานใหม่" : "Redesign Target"}</span><span className="font-semibold">80</span></div>
            <div className="flex justify-between"><span className="text-slate-500">{locale === "th" ? "พัฒนาทักษะ" : "Reskill Target"}</span><span className="font-semibold">600</span></div>
            <div className="flex justify-between"><span className="text-slate-500">{locale === "th" ? "เป้าความเสี่ยงเฉลี่ย" : "Target Avg Risk"}</span><span className="font-semibold text-primary-500">{"<"}35%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
