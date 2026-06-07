"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { GraduationCap, Users, BookOpen, ArrowRight, Loader2, AlertTriangle, Layers, Clock, Download, Trash2, X } from "lucide-react";

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
  duration: number | null;
  skill: CourseSkill | null;
  _count: { modules: number; enrollments: number };
}

const difficultyColor: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function TrainingPage() {
  const { locale, t } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/training/courses")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setCourses(json.data);
        else setError(json.error || "Failed to load");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/training/courses/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setCourses((prev) => prev.filter((c) => c.id !== id));
      } else {
        setError(json.error || "Failed to delete");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
          <p className="text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-primary-500" />
            {t("training.title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t("training.subtitle")}</p>
        </div>
        <Link
          href="/training/import"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          {t("training.import")}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: BookOpen, label: t("training.courses"), value: String(courses.length), color: "text-primary-500" },
          { icon: Layers, label: t("training.modules"), value: String(courses.reduce((s, c) => s + c._count.modules, 0)), color: "text-emerald-500" },
          { icon: Users, label: t("training.students"), value: String(courses.reduce((s, c) => s + c._count.enrollments, 0)), color: "text-blue-500" },
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

      {courses.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
          <GraduationCap className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500">{t("training.noCourses")}</p>
          <p className="text-sm text-slate-400 mt-1">{t("training.noCourses.desc")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="relative">
              <Link href={`/training/${course.id}`}>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg group-hover:text-primary-500 transition-colors">{course.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${difficultyColor[course.difficulty] || difficultyColor.beginner}`}>
                      {t(`training.difficulty.${course.difficulty}`)}
                    </span>
                  </div>
                  {course.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{course.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course._count.modules} {t("training.modules")}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course._count.enrollments} {t("training.students")}</span>
                    {course.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration} min</span>}
                  </div>
                  {course.skill && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-400">{locale === "th" ? "เชื่อมโยงทักษะ:" : "Linked skill:"} </span>
                      <span className="text-xs font-medium text-primary-500">{course.skill.skillName}</span>
                    </div>
                  )}
                  <div className="mt-4 flex justify-end">
                    <span className="text-sm font-medium text-primary-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t("training.startLearning")} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
              <button
                onClick={(e) => { e.preventDefault(); setConfirmDelete(course.id); }}
                disabled={deletingId === course.id}
                className="absolute top-3 right-3 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-40"
              >
                {deletingId === course.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (() => {
        const target = courses.find((c) => c.id === confirmDelete);
        const enrollCount = target?._count.enrollments ?? 0;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm w-full mx-4 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold">{locale === "th" ? "ยืนยันการลบ" : "Confirm Delete"}</h3>
                  <p className="text-xs text-slate-500">{locale === "th" ? "การกระทำนี้ไม่สามารถย้อนกลับได้" : "This action cannot be undone"}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {locale === "th" ? "คุณต้องการลบคอร์สนี้ใช่หรือไม่?" : "Are you sure you want to delete this course?"}
              </p>
              {enrollCount > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 mb-5">
                  <Users className="w-4 h-4 text-amber-500 shrink-0" />
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    {locale === "th"
                      ? `คอร์สนี้มี ${enrollCount} คนกำลังเรียนอยู่ จะลบ enrollment ทั้งหมดด้วย`
                      : `This course has ${enrollCount} active enrollments, which will also be deleted`}
                  </p>
                </div>
              )}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {locale === "th" ? "ยกเลิก" : "Cancel"}
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  {locale === "th" ? "ลบ" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
