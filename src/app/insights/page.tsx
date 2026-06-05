"use client";

import { useLanguage } from "@/lib/i18n";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Target,
  Clock,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

const mockRecentAnalyses = [
  {
    jobTitle: "เจ้าหน้าที่บัญชี / Accountant",
    risk: 45,
    tasks: 8,
    date: "2026-06-05",
    status: "done",
  },
  {
    jobTitle: "เจ้าหน้าที่บันทึกข้อมูล / Data Entry Clerk",
    risk: 87,
    tasks: 5,
    date: "2026-06-04",
    status: "done",
  },
  {
    jobTitle: "วิศวกรซอฟต์แวร์ / Software Engineer",
    risk: 18,
    tasks: 12,
    date: "2026-06-03",
    status: "done",
  },
  {
    jobTitle: "เจ้าหน้าที่ทรัพยากรบุคคล / HR Officer",
    risk: 35,
    tasks: 10,
    date: "2026-06-02",
    status: "done",
  },
  {
    jobTitle: "พนักงานขาย / Sales Representative",
    risk: 52,
    tasks: 7,
    date: "2026-06-01",
    status: "done",
  },
];

const insightCards = [
  {
    key: "topSkillGap",
    icon: TrendingUp,
    color: "from-red-500 to-rose-600",
    bgLight: "bg-red-50 dark:bg-red-950/30",
    iconColor: "text-red-500",
  },
  {
    key: "topRisk",
    icon: AlertTriangle,
    color: "from-orange-500 to-amber-600",
    bgLight: "bg-orange-50 dark:bg-orange-950/30",
    iconColor: "text-orange-500",
  },
  {
    key: "topCourse",
    icon: BookOpen,
    color: "from-emerald-500 to-green-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
    iconColor: "text-emerald-500",
  },
  {
    key: "readiness",
    icon: Target,
    color: "from-primary-500 to-indigo-600",
    bgLight: "bg-primary-50 dark:bg-primary-950/30",
    iconColor: "text-primary-500",
  },
];

const strategyKeys = ["s1", "s2", "s3", "s4"];

const strategyColors = [
  "from-red-500 to-rose-500",
  "from-orange-500 to-amber-500",
  "from-emerald-500 to-green-500",
  "from-primary-500 to-indigo-500",
];

export default function InsightsPage() {
  const { locale, t } = useLanguage();

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t("insights.title")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {t("insights.subtitle")}
        </p>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insightCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl ${card.bgLight} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors" />
              </div>
              <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                {t(`insights.${card.key}.title`)}
              </h3>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {t(`insights.${card.key}.value`)}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {t(`insights.${card.key}.desc`)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Analyses Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-500" />
            {t("insights.recent.title")}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="text-left px-5 sm:px-6 py-3 font-semibold text-slate-500 dark:text-slate-400">
                  {t("insights.recent.job")}
                </th>
                <th className="text-center px-4 py-3 font-semibold text-slate-500 dark:text-slate-400">
                  {t("insights.recent.risk")}
                </th>
                <th className="text-center px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                  {t("insights.recent.tasks")}
                </th>
                <th className="text-center px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 hidden md:table-cell">
                  {t("insights.recent.date")}
                </th>
                <th className="text-center px-4 py-3 font-semibold text-slate-500 dark:text-slate-400">
                  {t("insights.recent.status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {mockRecentAnalyses.map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-5 sm:px-6 py-3.5 font-medium text-slate-700 dark:text-slate-200">
                    {item.jobTitle}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        item.risk >= 70
                          ? "text-red-500 bg-red-50 dark:bg-red-950/30"
                          : item.risk >= 40
                            ? "text-orange-500 bg-orange-50 dark:bg-orange-950/30"
                            : "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                      }`}
                    >
                      {item.risk}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                    {item.tasks}
                  </td>
                  <td className="px-4 py-3.5 text-center text-slate-400 dark:text-slate-500 hidden md:table-cell">
                    {item.date}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      {t("insights.recent.statusDone")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
        <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-500" />
          {t("insights.strategy.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategyKeys.map((key, i) => (
            <div
              key={key}
              className="relative p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors overflow-hidden"
            >
              <div
                className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${strategyColors[i]}`}
              />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 ml-2">
                {t(`insights.strategy.${key}.title`)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 ml-2 leading-relaxed">
                {t(`insights.strategy.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
