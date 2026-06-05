"use client";

import { MetricCard } from "@/components/MetricCard";
import { useLanguage } from "@/lib/i18n";
import {
  Users, AlertTriangle, TrendingDown, Sparkles, Activity, ShieldAlert,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";

export default function DashboardPage() {
  const { t } = useLanguage();

  const topSkillsData = [
    { name: t("skill.python"), demand: 92, fill: "#6366f1" },
    { name: t("skill.dataAnalysis"), demand: 87, fill: "#818cf8" },
    { name: t("skill.cloudComputing"), demand: 82, fill: "#a5b4fc" },
    { name: t("skill.aiMl"), demand: 78, fill: "#c7d2fe" },
    { name: t("skill.projectMgmt"), demand: 71, fill: "#e0e7ff" },
  ];

  const riskByDepartmentData = [
    { name: t("dept.dataEntry"), risk: 85, fill: "#ef4444" },
    { name: t("dept.customerSvc"), risk: 62, fill: "#f97316" },
    { name: t("dept.accounting"), risk: 55, fill: "#eab308" },
    { name: t("dept.manufacturing"), risk: 48, fill: "#22c55e" },
    { name: t("dept.rd"), risk: 18, fill: "#3b82f6" },
  ];

  const radarData = [
    { skill: t("radar.technical"), current: 65, required: 85 },
    { skill: t("radar.leadership"), current: 72, required: 80 },
    { skill: t("radar.communication"), current: 80, required: 90 },
    { skill: t("radar.dataLiteracy"), current: 45, required: 78 },
    { skill: t("radar.adaptability"), current: 70, required: 88 },
    { skill: t("radar.creativity"), current: 60, required: 75 },
  ];

  const skillsGapData = [
    { name: t("gap.aiMl"), gap: 42, fill: "#ef4444" },
    { name: t("gap.cloudArch"), gap: 38, fill: "#f97316" },
    { name: t("gap.cybersecurity"), gap: 35, fill: "#eab308" },
    { name: t("gap.dataEng"), gap: 30, fill: "#22c55e" },
    { name: t("gap.devops"), gap: 25, fill: "#3b82f6" },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
          <p className="font-medium text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-slate-500 dark:text-slate-400">
              {entry.name || "-"}: {entry.value}
              {entry.name === "demand" || entry.name === "risk" || entry.name === "gap" ? "%" : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("dash.title")}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t("dash.subtitle")}</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <MetricCard title={t("dash.totalEmployees")} value="2,847" change="+12%" changeType="positive" icon={Users} description={t("dash.totalEmployees.desc")} />
        <MetricCard title={t("dash.avgRisk")} value="43.2%" change="+5.3%" changeType="negative" icon={AlertTriangle} iconColor="text-orange-500" description={t("dash.avgRisk.desc")} />
        <MetricCard title={t("dash.skillGaps")} value="17" change="-3" changeType="positive" icon={TrendingDown} iconColor="text-red-500" description={t("dash.skillGaps.desc")} />
        <MetricCard title={t("dash.reskilling")} value="324" change="+28%" changeType="positive" icon={Sparkles} iconColor="text-emerald-500" description={t("dash.reskilling.desc")} />
        <MetricCard title={t("dash.redesigned")} value="48" change="+8" changeType="positive" icon={Activity} iconColor="text-blue-500" description={t("dash.redesigned.desc")} />
        <MetricCard title={t("dash.highRisk")} value="156" change="+12" changeType="negative" icon={ShieldAlert} iconColor="text-rose-500" description={t("dash.highRisk.desc")} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
          <h2 className="font-semibold text-lg mb-1">{t("dash.topSkills")}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{t("dash.topSkills.desc")}</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSkillsData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 13 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="demand" radius={[0, 6, 6, 0]} barSize={28}>
                  {topSkillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
          <h2 className="font-semibold text-lg mb-1">{t("dash.riskByDept")}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{t("dash.riskByDept.desc")}</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskByDepartmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="risk" nameKey="name" label={({ name, risk }) => `${name} (${risk}%)`}>
                  {riskByDepartmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
          <h2 className="font-semibold text-lg mb-1">{t("dash.skillProfile")}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{t("dash.skillProfile.desc")}</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name={t("dash.radar.current")} dataKey="current" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                <Radar name={t("dash.radar.required")} dataKey="required" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} />
                <Legend />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
          <h2 className="font-semibold text-lg mb-1">{t("dash.criticalGaps")}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{t("dash.criticalGaps.desc")}</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsGapData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                <YAxis tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="gap" radius={[6, 6, 0, 0]} barSize={36}>
                  {skillsGapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
