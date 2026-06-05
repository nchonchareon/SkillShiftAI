"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import {
  Upload,
  Brain,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Sparkles,
  ClipboardList,
  ListChecks,
  Wrench,
  GraduationCap,
  Loader2,
  WandSparkles,
} from "lucide-react";

interface Task {
  task_description: string;
  automation_risk_score: number;
  impact_level: string;
  frequency: string;
  estimated_hours_per_week: number;
}

interface AnalysisResult {
  job_title: string;
  department: string;
  summary: string;
  tasks: Task[];
  automation_risk_average: number;
}

interface FormData {
  jobTitle: string;
  department: string;
  tasks: string;
  tools: string;
  skills: string;
}

type TabType = "guided" | "raw";

function getExampleData(locale: string): FormData {
  if (locale === "th") {
    return {
      jobTitle: "เจ้าหน้าที่บัญชี",
      department: "ฝ่ายบัญชีและการเงิน",
      tasks: "1. บันทึกรายการบัญชีรายวัน (Journal Entry) ตามมาตรฐานบัญชี\n2. ตรวจสอบความถูกต้องของใบเสร็จรับเงินและใบแจ้งหนี้\n3. จัดทำรายงานงบการเงินประจำเดือนและประจำปี\n4. กระทบยอดบัญชีธนาคาร (Bank Reconciliation)\n5. จัดทำรายงานภาษีมูลค่าเพิ่ม (VAT) และภาษีหัก ณ ที่จ่าย",
      tools: "Microsoft Excel, SAP Business One, QuickBooks, โปรแกรมใบกำกับภาษีอิเล็กทรอนิกส์",
      skills: "การบัญชีการเงิน, การวิเคราะห์ข้อมูล, ความละเอียดรอบคอบ, ความรู้ภาษีอากร, การจัดการเอกสาร",
    };
  }
  return {
    jobTitle: "Accountant",
    department: "Finance & Accounting",
    tasks: "1. Record daily journal entries per accounting standards\n2. Verify receipts and invoices for accuracy\n3. Prepare monthly and annual financial reports\n4. Perform bank reconciliations\n5. File VAT and withholding tax reports",
    tools: "Microsoft Excel, SAP Business One, QuickBooks, E-Tax Software",
    skills: "Accounting & Finance, Data Analysis, Attention to Detail, Tax Knowledge, Document Management",
  };
}

export default function JobsPage() {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("guided");
  const [formData, setFormData] = useState<FormData>({
    jobTitle: "",
    department: "",
    tasks: "",
    tools: "",
    skills: "",
  });
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [formatting, setFormatting] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const loadExample = () => {
    const example = getExampleData(locale);
    setFormData(example);
  };

  const isFieldFilled = (value: string) => value.trim().length > 0;

  const checklist = [
    {
      key: "position" as const,
      icon: ClipboardList,
      label: t("jobs.guided.checklist.position"),
      filled: isFieldFilled(formData.jobTitle) || isFieldFilled(formData.department),
    },
    {
      key: "tasks" as const,
      icon: ListChecks,
      label: t("jobs.guided.checklist.tasks"),
      filled: isFieldFilled(formData.tasks),
    },
    {
      key: "tools" as const,
      icon: Wrench,
      label: t("jobs.guided.checklist.tools"),
      filled: isFieldFilled(formData.tools),
    },
    {
      key: "skills" as const,
      icon: GraduationCap,
      label: t("jobs.guided.checklist.skills"),
      filled: isFieldFilled(formData.skills),
    },
  ];

  const completedCount = checklist.filter((c) => c.filled).length;

  const analyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      let body: Record<string, unknown>;
      if (activeTab === "guided") {
        if (!formData.jobTitle.trim() && !formData.tasks.trim()) {
          throw new Error(
            locale === "th"
              ? "กรุณากรอกข้อมูลอย่างน้อย 1 ช่อง"
              : "Please fill in at least one field"
          );
        }
        body = { formData };
      } else {
        if (!jdText.trim()) return;
        body = { jobDescription: jdText };
      }
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const formatWithAI = async () => {
    if (!jdText.trim()) return;
    setFormatting(true);
    setError("");
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jdText, action: "format" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Formatting failed");
      setJdText(data.formatted);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setFormatting(false);
    }
  };

  const riskColor = (score: number) => {
    if (score >= 0.7) return "text-red-500 bg-red-50 dark:bg-red-950/30";
    if (score >= 0.4) return "text-orange-500 bg-orange-50 dark:bg-orange-950/30";
    return "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30";
  };

  const impactColor = (level: string) => {
    if (level === "critical")
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    if (level === "high")
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    if (level === "medium")
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  };

  const canAnalyze =
    activeTab === "guided"
      ? formData.jobTitle.trim().length > 0 || formData.tasks.trim().length > 0
      : jdText.trim().length > 0;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {locale === "th" ? "วิเคราะห์งาน" : "Job Analysis"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {locale === "th"
            ? "ป้อนรายละเอียดงานเพื่อให้ AI วิเคราะห์และประเมินความเสี่ยง"
            : "Provide job details for AI analysis and risk assessment"}
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("guided")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-all relative ${
              activeTab === "guided"
                ? "text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-950/30"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>{t("jobs.guided.tab")}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
              {t("jobs.guided.tabHint")}
            </span>
            {activeTab === "guided" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-all relative ${
              activeTab === "raw"
                ? "text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-950/30"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t("jobs.raw.tab")}</span>
            {activeTab === "raw" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6">
          {activeTab === "guided" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Fields */}
              <div className="lg:col-span-2 space-y-4">
                {/* Load Example Button */}
                <div className="flex justify-end">
                  <button
                    onClick={loadExample}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950/30"
                  >
                    <WandSparkles className="w-3.5 h-3.5" />
                    {t("jobs.loadExample")}
                  </button>
                </div>

                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("jobs.guided.title.label")}
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => updateField("jobTitle", e.target.value)}
                    placeholder={t("jobs.guided.title.placeholder")}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("jobs.guided.dept.label")}
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => updateField("department", e.target.value)}
                    placeholder={t("jobs.guided.dept.placeholder")}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Tasks */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("jobs.guided.tasks.label")}
                  </label>
                  <textarea
                    value={formData.tasks}
                    onChange={(e) => updateField("tasks", e.target.value)}
                    placeholder={t("jobs.guided.tasks.placeholder")}
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Tools */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("jobs.guided.tools.label")}
                  </label>
                  <input
                    type="text"
                    value={formData.tools}
                    onChange={(e) => updateField("tools", e.target.value)}
                    placeholder={t("jobs.guided.tools.placeholder")}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {t("jobs.guided.skills.label")}
                  </label>
                  <textarea
                    value={formData.skills}
                    onChange={(e) => updateField("skills", e.target.value)}
                    placeholder={t("jobs.guided.skills.placeholder")}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Sidebar Checklist */}
              <div className="lg:col-span-1">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sticky top-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-primary-500" />
                    {t("jobs.guided.checklist.title")}
                  </h3>
                  <div className="space-y-2.5">
                    {checklist.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.key}
                          className="flex items-center gap-3 transition-all"
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                              item.filled
                                ? "bg-emerald-100 dark:bg-emerald-900/40"
                                : "bg-slate-200 dark:bg-slate-700"
                            }`}
                          >
                            {item.filled ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            )}
                          </div>
                          <span
                            className={`text-sm transition-colors ${
                              item.filled
                                ? "text-slate-700 dark:text-slate-200 font-medium"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Progress */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                      <span>
                        {completedCount}/{checklist.length}{" "}
                        {locale === "th" ? "ส่วน" : "sections"}
                      </span>
                      <span className="font-medium text-primary-600 dark:text-primary-400">
                        {Math.round((completedCount / checklist.length) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                        style={{
                          width: `${(completedCount / checklist.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Raw Text Tab */
            <div className="space-y-3">
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder={t("jobs.raw.placeholder")}
                className="w-full h-56 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={formatWithAI}
                  disabled={formatting || !jdText.trim()}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formatting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      {t("jobs.raw.formatBtnLoading")}
                    </>
                  ) : (
                    <>
                      <WandSparkles className="w-3.5 h-3.5" />
                      {t("jobs.raw.formatBtn")}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Analyze Button */}
        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
          <button
            onClick={analyze}
            disabled={loading || !canAnalyze}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                {t("jobs.form.submitLoading")}
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                {t("jobs.form.submit")}
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-5 sm:mx-6 mb-5 sm:mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-5">
          {/* Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold">{result.job_title}</h2>
                {result.department && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {result.department}
                  </p>
                )}
              </div>
              <div
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${riskColor(result.automation_risk_average)}`}
              >
                {(result.automation_risk_average * 100).toFixed(0)}%{" "}
                {locale === "th" ? "เสี่ยง" : "Risk"}
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Tasks */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
            <h3 className="font-semibold text-lg mb-4">
              {locale === "th"
                ? `งานย่อย ${result.tasks.length} รายการ`
                : `${result.tasks.length} Tasks Identified`}
            </h3>
            <div className="space-y-3">
              {result.tasks.map((task, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium flex-1">
                      {task.task_description}
                    </p>
                    <div
                      className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold ${riskColor(task.automation_risk_score)}`}
                    >
                      {(task.automation_risk_score * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${impactColor(task.impact_level)}`}
                    >
                      {task.impact_level}
                    </span>
                    {task.frequency && (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" /> {task.frequency}
                      </span>
                    )}
                    {task.estimated_hours_per_week && (
                      <span className="text-xs text-slate-400">
                        {task.estimated_hours_per_week}h/wk
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>
            {locale === "th"
              ? "กรอกข้อมูลแล้วกดวิเคราะห์"
              : "Fill in the details and click Analyze"}
          </p>
        </div>
      )}
    </div>
  );
}
