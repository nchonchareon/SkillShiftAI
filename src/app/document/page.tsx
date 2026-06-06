"use client";

import { useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { Download, Loader2 } from "lucide-react";

export default function DocumentPage() {
  const { t } = useLanguage();
  const contentRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    if (!contentRef.current) return;
    setGenerating(true);

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: 0,
        filename: "SkillShiftAI-Blueprint.pdf",
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: { unit: "px", format: [1200, 800] as [number, number], orientation: "landscape" as const },
      };
      await html2pdf().set(opt).from(contentRef.current).save();
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">
      {/* Header - No print */}
      <div className="no-print flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t("nav.document")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t("doc.subtitle")}
          </p>
        </div>
        <button
          onClick={handleDownload}
          disabled={generating}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 text-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("doc.generating") || "กำลังสร้าง PDF..."}
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              {t("doc.downloadPdf")}
            </>
          )}
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SLIDE 1: Title */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div ref={contentRef}>
      <div className="slide bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 rounded-2xl p-8 sm:p-12 text-white min-h-[500px] flex flex-col justify-center items-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMi0yYTEgMSAwIDEwMC0yIDAgMSAwIDAwMCAyek0zNCAyNGgtMnYyaDJ2LTJ6bS00IDB2Mmgydi0yaDN2LTJoLTN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
        <div className="relative z-10">
          <span className="inline-block bg-white/10 backdrop-blur-sm text-white/90 px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-6 border border-white/20">
            Strategic Implementation Document
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            AI-Powered Job Redesign<br />& Reskilling Blueprint
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            พิมพ์เขียวและแนวทางเชิงลึกในการพัฒนาฟังก์ชันป้อนข้อมูล (Input Optimization) เพื่อเพิ่มความแม่นยำในการวิเคราะห์ทักษะและยกระดับโครงสร้างบุคลากรด้วย AI
          </p>
          <div className="flex items-center justify-center gap-8 mt-10">
            <div className="text-center">
              <p className="text-3xl font-bold">SkillShiftAI</p>
              <p className="text-sm text-white/50">v1.0 — June 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SLIDE 2: ความเข้าใจระบบ */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="slide bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 min-h-[500px]">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center text-lg font-bold">1</span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">ความเข้าใจระบบ Job Redesign & Reskilling Platform</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-300 mb-6 text-base leading-relaxed">
          แพลตฟอร์มนี้ถูกออกแบบมาเพื่อช่วยองค์กรและพนักงานในการรับมือกับคลื่นความเปลี่ยนแปลงของปัญญาประดิษฐ์ (AI Automation) ผ่านการทำกิจกรรมหลัก 2 ประการ:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-950/30 dark:to-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center text-sm font-bold">R</div>
              <h3 className="font-bold text-primary-700 dark:text-primary-300 text-lg">Job Redesign</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-1">เป้าหมายหลัก</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">แยกแยะกิจกรรมงานเดิมที่ซ้ำซ้อนและมีความเสี่ยงโดนแทนที่ แล้วปรับเปลี่ยนหน้าที่ให้มุ่งเน้นงานที่สร้างมูลค่าสูง</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-1">บทบาทของ AI</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">ประเมิน Automation Risk Score ของแต่ละกิจกรรมย่อย และเสนอแนะโครงสร้าง Workflow ใหม่</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">S</div>
              <h3 className="font-bold text-emerald-700 dark:text-emerald-300 text-lg">Reskilling</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">เป้าหมายหลัก</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">ค้นหาช่องว่างของทักษะ (Skill Gap) ระหว่างทักษะที่มีอยู่ กับทักษะที่จำเป็นในตำแหน่งงานใหม่</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">บทบาทของ AI</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">คำนวณเวกเตอร์ความคล้ายคลึง (Vector Similarity) เพื่อจับคู่และแนะนำคอร์สเรียน</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SLIDE 3: Input Optimization */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="slide bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 min-h-[500px]">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center text-lg font-bold">2</span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">ความสำคัญของการปรับวิธีป้อนข้อมูล</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Garbage In */}
          <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">❌</span>
              <h3 className="font-bold text-red-700 dark:text-red-400">แบบเดิม (Unstructured)</h3>
            </div>
            <div className="bg-white dark:bg-red-950/30 rounded-lg p-4 mb-4 border border-red-100 dark:border-red-900">
              <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                &quot;ทำตำแหน่งธุรการบัญชี คีย์เอกสาร ใช้คอมพิวเตอร์เป็นหลัก&quot;
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">→</span>
              <p className="text-sm text-red-600 dark:text-red-400">วิเคราะห์ได้กว้างเกินไป ไม่สามารถจัดทำแผนพัฒนาได้</p>
            </div>
          </div>

          {/* Guided Input */}
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✅</span>
              <h3 className="font-bold text-emerald-700 dark:text-emerald-400">แบบใหม่ (Guided Input)</h3>
            </div>
            <div className="bg-white dark:bg-emerald-950/30 rounded-lg p-4 mb-4 border border-emerald-100 dark:border-emerald-900">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <strong>ตำแหน่ง:</strong> ธุรการบัญชี<br />
                <strong>ภารกิจ:</strong> คีย์ข้อมูล Invoice ลง ERP<br />
                <strong>เครื่องมือ:</strong> Excel, SAP
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">→</span>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">แตกภารกิจ ประเมินความเสี่ยง แนะนำคอร์สเรียนได้ทันที</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-xl">
          <p className="text-sm text-primary-700 dark:text-primary-300 text-center font-medium">
            การเปลี่ยนไปเป็น &quot;Guided Structured Input&quot; จะทำให้ AI วิเคราะห์ได้อย่างแม่นยำขึ้นกว่า <span className="text-lg font-bold">85%</span>
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SLIDE 4: 4 Categories */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="slide bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 min-h-[500px]">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center text-lg font-bold">3</span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">โครงสร้างข้อมูล 4 หมวดสำคัญสำหรับการวิเคราะห์</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { num: "1", title: "Core Tasks & Daily Activities", desc: "ระบุกิจกรรมที่ทำเป็นประจำอย่างเจาะจง ยิ่งละเอียด AI ประเมิน Automation Risk Score ได้ดียิ่งขึ้น", color: "from-primary-500 to-primary-600", icon: "📋" },
            { num: "2", title: "Current Tools & Technology", desc: "ระบุชื่อซอฟต์แวร์หรือเครื่องมือที่ใช้ (Excel, SAP, Salesforce) นำไปค้นหาทักษะเทคโนโลยีที่เกี่ยวข้อง", color: "from-violet-500 to-violet-600", icon: "🛠️" },
            { num: "3", title: "Existing Skills & Proficiency", desc: "ทักษะ Hard Skills และ Soft Skills ที่มีอยู่เดิม เพื่อตั้งค่าเป็น Baseline Skills", color: "from-emerald-500 to-emerald-600", icon: "📊" },
            { num: "4", title: "Future Goals & Desired Pathway", desc: "เป้าหมายการเติบโต เช่น ต้องการลดงานแมนนวล 50% หรือพัฒนาไปเป็นนักวิเคราะห์เชิงกลยุทธ์", color: "from-amber-500 to-amber-600", icon: "🎯" },
          ].map((item) => (
            <div key={item.num} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl shrink-0 shadow-lg`}>
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-400">#{item.num}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SLIDE 5: AI Output + JSON Schema */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="slide bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 min-h-[500px]">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center text-lg font-bold">4</span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">ตัวอย่างผลการวิเคราะห์งาน</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Risk Assessment */}
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">ตำแหน่ง &quot;ธุรการบัญชีและเอกสาร&quot;</p>
            <div className="space-y-3">
              {[
                { task: "คีย์ข้อมูล Invoice ลงระบบ ERP", risk: "0.92", level: "High", color: "red", pct: 92 },
                { task: "จัดทำรายงานสรุปยอดรายจ่ายด้วย Excel", risk: "0.75", level: "Medium", color: "amber", pct: 75 },
                { task: "ประสานงาน/ตอบคำถามเรื่องจ่ายเงิน", risk: "0.35", level: "Low", color: "emerald", pct: 35 },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.task}</span>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className={`text-lg font-bold ${
                        item.color === "red" ? "text-red-500" : item.color === "amber" ? "text-amber-500" : "text-emerald-500"
                      }`}>{item.risk}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        item.color === "red" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        item.color === "amber" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      }`}>{item.level}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.color === "red" ? "bg-red-500" : item.color === "amber" ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* JSON Schema */}
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">JSON Schema ที่คืนกลับ</p>
            <pre className="bg-slate-900 dark:bg-black text-emerald-400 p-5 rounded-xl text-xs overflow-x-auto border border-slate-700 dark:border-slate-600 leading-relaxed h-[340px]">
{`{
  "job_redesign": {
    "new_job_title": "Strategic Account Analyst",
    "redesign_strategy": "ลดงานบันทึกข้อมูล ย้ายไปวิเคราะห์",
    "added_value_tasks": [
      "ตรวจสอบความผิดปกติของต้นทุน",
      "พัฒนาระบบลงบัญชีอัตโนมัติ (RPA)"
    ]
  },
  "reskilling_plan": {
    "required_new_skills": [
      "Data Analytics for Finance",
      "RPA Tools Introduction"
    ],
    "recommended_courses": [
      { "course": "RPA 101", "priority": "High" }
    ]
  }
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SLIDE 6: Tech Stack + Footer */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="slide bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 rounded-2xl p-8 sm:p-10 text-white min-h-[500px]">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center text-lg font-bold">5</span>
          <h2 className="text-2xl font-bold">Technology Stack</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Frontend", items: "Next.js 14, TypeScript, Tailwind CSS, Recharts, Lucide React", color: "from-blue-500 to-cyan-500" },
            { label: "Backend", items: "Next.js API Routes, Prisma ORM", color: "from-emerald-500 to-teal-500" },
            { label: "Database", items: "PostgreSQL + pgvector", color: "from-violet-500 to-purple-500" },
            { label: "AI Engine", items: "Typhoon Thai AI + Ollama", color: "from-amber-500 to-orange-500" },
          ].map((item) => (
            <div key={item.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                <span className="text-white text-xs font-bold">{item.label.substring(0, 2)}</span>
              </div>
              <h4 className="font-bold text-white text-sm mb-1">{item.label}</h4>
              <p className="text-xs text-white/60 leading-relaxed">{item.items}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-white/10">
          <p className="text-sm text-white/40">
            © 2026 SkillShiftAI — AI-Powered Job Redesign & Reskilling Platform. All rights reserved.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
