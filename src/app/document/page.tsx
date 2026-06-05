"use client";

import { useLanguage } from "@/lib/i18n";
import { Download, FileText, Printer } from "lucide-react";

export default function DocumentPage() {
  const { t } = useLanguage();

  const handleDownload = () => {
    window.print();
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
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 text-sm shrink-0"
        >
          <Download className="w-4 h-4" />
          {t("doc.downloadPdf")}
        </button>
      </div>

      {/* Document Content */}
      <div className="doc-content bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10">
        {/* Title */}
        <div className="text-center mb-10 pb-8 border-b border-slate-200 dark:border-slate-700">
          <span className="inline-block bg-primary-100 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            Strategic Implementation Document
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            AI-Powered Job Redesign & Reskilling Blueprint
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl mx-auto">
            พิมพ์เขียวและแนวทางเชิงลึกในการพัฒนาฟังก์ชันป้อนข้อมูล (Input Optimization) เพื่อเพิ่มความแม่นยำในการวิเคราะห์ทักษะและยกระดับโครงสร้างบุคลากรด้วย AI
          </p>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <div className="bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-primary-950/20 dark:to-emerald-950/20 border border-primary-200 dark:border-primary-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center text-sm font-bold">1</span>
              ความเข้าใจระบบ Job Redesign & Reskilling Platform
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              แพลตฟอร์มนี้ถูกออกแบบมาเพื่อช่วยองค์กรและพนักงานในการรับมือกับคลื่นความเปลี่ยนแปลงของปัญญาประดิษฐ์ (AI Automation) ผ่านการทำกิจกรรมหลัก 2 ประการ:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-primary-200 dark:border-primary-800">
                    <th className="text-left py-3 px-4 font-bold text-slate-900 dark:text-white w-1/4">แกนหลัก</th>
                    <th className="text-left py-3 px-4 font-bold text-slate-900 dark:text-white">เป้าหมายหลัก</th>
                    <th className="text-left py-3 px-4 font-bold text-slate-900 dark:text-white">บทบาทของ AI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Job Redesign</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">แยกแยะกิจกรรมงานเดิมที่ซ้ำซ้อนและมีความเสี่ยงโดนแทนที่ แล้วปรับเปลี่ยนหน้าที่ให้มุ่งเน้นงานที่สร้างมูลค่าสูง</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">ประเมิน Automation Risk Score ของแต่ละกิจกรรมย่อย และเสนอแนะโครงสร้าง Workflow ใหม่</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Reskilling</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">ค้นหาช่องว่างของทักษะ (Skill Gap) ระหว่างทักษะที่มีอยู่ กับทักษะที่จำเป็นในตำแหน่งงานใหม่</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">คำนวณเวกเตอร์ความคล้ายคลึง (Vector Similarity) เพื่อจับคู่และแนะนำคอร์สเรียน</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 2 & 3 */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary-500 text-white flex items-center justify-center text-xs font-bold">2</span>
              ความสำคัญของการปรับวิธีป้อนข้อมูล
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
              การใช้กล่องข้อความขนาดใหญ่เพียงช่องเดียวมักสร้างปัญหา <strong>&quot;Garbage In, Garbage Out&quot;</strong> เนื่องจากผู้ใช้งานมักกรอกข้อมูลที่ตื้นเกินไป
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              การเปลี่ยนไปเป็น <strong>&quot;Guided Structured Input&quot;</strong> จะทำให้ AI วิเคราะห์ได้อย่างแม่นยำขึ้นกว่า 85%
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary-500 text-white flex items-center justify-center text-xs font-bold">3</span>
              การเปรียบเทียบรูปแบบข้อมูลนำเข้า
            </h3>
            <div className="space-y-3">
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">❌ แบบเดิม (Unstructured)</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 italic">&quot;ทำตำแหน่งธุรการบัญชี คีย์เอกสาร ใช้คอมพิวเตอร์เป็นหลัก&quot;</p>
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">→ วิเคราะห์ได้กว้างเกินไป ไม่สามารถจัดทำแผนพัฒนาได้</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ แบบใหม่ (Guided Input)</p>
                <p className="text-xs text-slate-600 dark:text-slate-400"><strong>ตำแหน่ง:</strong> ธุรการบัญชี | <strong>ภารกิจ:</strong> คีย์ข้อมูล Invoice ลง ERP | <strong>เครื่องมือ:</strong> Excel, SAP</p>
                <p className="text-xs text-emerald-500 dark:text-emerald-400 mt-1">→ แตกภารกิจ ประเมินความเสี่ยง แนะนำคอร์สเรียนได้ทันที</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 - 4 Categories */}
        <section className="mb-10">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center text-sm font-bold">4</span>
            โครงสร้างข้อมูล 4 หมวดสำคัญสำหรับการวิเคราะห์
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { num: "1", title: "Core Tasks & Daily Activities", desc: "ระบุกิจกรรมที่ทำเป็นประจำอย่างเจาะจง ยิ่งละเอียด AI ประเมิน Automation Risk Score ได้ดียิ่งขึ้น", color: "primary" },
              { num: "2", title: "Current Tools & Technology", desc: "ระบุชื่อซอฟต์แวร์หรือเครื่องมือที่ใช้ (Excel, SAP, Salesforce) นำไปค้นหาทักษะเทคโนโลยีที่เกี่ยวข้อง", color: "violet" },
              { num: "3", title: "Existing Skills & Proficiency", desc: "ทักษะ Hard Skills และ Soft Skills ที่มีอยู่เดิม เพื่อตั้งค่าเป็น Baseline Skills", color: "emerald" },
              { num: "4", title: "Future Goals & Desired Pathway", desc: "เป้าหมายการเติบโต เช่น ต้องการลดงานแมนนวล 50% หรือพัฒนาไปเป็นนักวิเคราะห์เชิงกลยุทธ์", color: "amber" },
            ].map((item) => (
              <div key={item.num} className="flex gap-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-sm shrink-0">
                  {item.num}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 - AI Output Example */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary-500 text-white flex items-center justify-center text-xs font-bold">5</span>
              จำลองผลการวิเคราะห์งาน
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">ตัวอย่างการประเมินตำแหน่ง &quot;ธุรการบัญชีและเอกสาร&quot;</p>
            <div className="space-y-2">
              {[
                { task: "คีย์ข้อมูล Invoice ลงระบบ ERP", risk: "0.92", level: "High", color: "red" },
                { task: "จัดทำรายงานสรุปยอดรายจ่ายด้วย Excel", risk: "0.75", level: "Medium", color: "amber" },
                { task: "ประสานงาน/ตอบคำถามเรื่องจ่ายเงิน", risk: "0.35", level: "Low", color: "emerald" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-sm text-slate-700 dark:text-slate-300">{item.task}</span>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className={`text-sm font-bold ${
                      item.color === "red" ? "text-red-500" : item.color === "amber" ? "text-amber-500" : "text-emerald-500"
                    }`}>{item.risk}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      item.color === "red" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                      item.color === "amber" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    }`}>{item.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary-500 text-white flex items-center justify-center text-xs font-bold">6</span>
              JSON Schema ที่คืนกลับ
            </h3>
            <pre className="bg-slate-900 dark:bg-black text-emerald-400 p-4 rounded-lg text-xs overflow-x-auto border border-slate-700 dark:border-slate-600">
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
        </section>

        {/* Tech Stack */}
        <section className="mb-10">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center text-sm font-bold">7</span>
            Technology Stack
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Frontend", items: "Next.js 14, TypeScript, Tailwind CSS, Recharts, Lucide React" },
              { label: "Backend", items: "Next.js API Routes, Prisma ORM" },
              { label: "Database", items: "PostgreSQL + pgvector (Vector Search)" },
              { label: "AI Engine", items: "Ollama + Qwen3 8B (Free, Local)" },
            ].map((item) => (
              <div key={item.label} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <h4 className="font-bold text-primary-600 dark:text-primary-400 text-sm mb-2">{item.label}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.items}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2026 SkillShiftAI — AI-Powered Job Redesign & Reskilling Platform. All rights reserved.
          </p>
        </div>
      </div>

    </div>
  );
}
