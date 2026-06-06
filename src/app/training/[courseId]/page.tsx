"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import {
  GraduationCap,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Send,
  Bot,
  Code,
  BookOpen,
  Play,
  MessageSquare,
} from "lucide-react";

interface CourseSkill {
  id: string;
  skillName: string;
  category: string;
}

interface CourseModule {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  aiToolType: string | null;
  sortOrder: number;
  duration: number | null;
}

interface CourseDetail {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  duration: number | null;
  skill: CourseSkill | null;
  modules: CourseModule[];
  _count: { enrollments: number };
}

interface Enrollment {
  id: string;
  status: string;
  progress: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function CoursePlayerPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { locale, t } = useLanguage();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"sandbox" | "tutor">("sandbox");

  const [sandboxMessages, setSandboxMessages] = useState<ChatMessage[]>([]);
  const [sandboxInput, setSandboxInput] = useState("");
  const [sandboxLoading, setSandboxLoading] = useState(false);

  const [tutorMessages, setTutorMessages] = useState<ChatMessage[]>([]);
  const [tutorInput, setTutorInput] = useState("");
  const [tutorLoading, setTutorLoading] = useState(false);

  const sandboxRef = useRef<HTMLDivElement>(null);
  const tutorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!courseId) return;
    fetch(`/api/training/courses/${courseId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setCourse(json.data);
        else setError(json.error || "Failed to load");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    if (sandboxRef.current) {
      sandboxRef.current.scrollTop = sandboxRef.current.scrollHeight;
    }
  }, [sandboxMessages]);

  useEffect(() => {
    if (tutorRef.current) {
      tutorRef.current.scrollTop = tutorRef.current.scrollHeight;
    }
  }, [tutorMessages]);

  const currentModule = course?.modules[currentModuleIdx];

  const handleEnroll = useCallback(async () => {
    try {
      const res = await fetch("/api/training/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "default-user", courseId }),
      });
      const json = await res.json();
      if (json.success) setEnrollment(json.data);
    } catch {
      // silent
    }
  }, [courseId]);

  const updateProgress = useCallback(
    async (progress: number) => {
      try {
        await fetch("/api/training/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: "default-user", courseId, progress }),
        });
      } catch {
        // silent
      }
    },
    [courseId]
  );

  const goToModule = useCallback(
    (idx: number) => {
      if (!course) return;
      const newIdx = Math.max(0, Math.min(course.modules.length - 1, idx));
      setCurrentModuleIdx(newIdx);
      const progress = ((newIdx + 1) / course.modules.length) * 100;
      updateProgress(progress);
    },
    [course, updateProgress]
  );

  const handleSandboxSend = useCallback(async () => {
    const prompt = sandboxInput.trim();
    if (!prompt || sandboxLoading) return;

    setSandboxMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setSandboxInput("");
    setSandboxLoading(true);

    try {
      const res = await fetch("/api/training/sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, toolType: currentModule?.aiToolType || "typhoon" }),
      });
      const json = await res.json();
      if (json.success) {
        setSandboxMessages((prev) => [...prev, { role: "assistant", content: json.data.response }]);
      } else {
        setSandboxMessages((prev) => [...prev, { role: "assistant", content: json.error || "Error" }]);
      }
    } catch {
      setSandboxMessages((prev) => [...prev, { role: "assistant", content: "Service unavailable" }]);
    } finally {
      setSandboxLoading(false);
    }
  }, [sandboxInput, sandboxLoading, currentModule]);

  const handleTutorSend = useCallback(async () => {
    const question = tutorInput.trim();
    if (!question || tutorLoading) return;

    setTutorMessages((prev) => [...prev, { role: "user", content: question }]);
    setTutorInput("");
    setTutorLoading(true);

    try {
      const res = await fetch("/api/training/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: question,
          courseTitle: course?.title,
          moduleContent: currentModule?.content,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setTutorMessages((prev) => [...prev, { role: "assistant", content: json.data.response }]);
      } else {
        setTutorMessages((prev) => [...prev, { role: "assistant", content: json.error || "Error" }]);
      }
    } catch {
      setTutorMessages((prev) => [...prev, { role: "assistant", content: "Service unavailable" }]);
    } finally {
      setTutorLoading(false);
    }
  }, [tutorInput, tutorLoading, course, currentModule]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
          <p className="text-slate-500">{error || "Course not found"}</p>
          <Link href="/training" className="text-primary-500 text-sm mt-2 inline-block">{t("training.backToCourses")}</Link>
        </div>
      </div>
    );
  }

  const totalModules = course.modules.length;
  const progressPercent = totalModules > 0 ? ((currentModuleIdx + 1) / totalModules) * 100 : 0;

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center gap-3">
        <Link href="/training" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{course.description}</p>
        </div>
      </div>

      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-primary-500" />
              <h2 className="font-semibold text-lg">
                {locale === "th" ? "โมดูล" : "Module"} {currentModuleIdx + 1}/{totalModules}: {currentModule?.title}
              </h2>
            </div>

            {currentModule?.aiToolType && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 text-xs font-medium mb-4">
                <Code className="w-3.5 h-3.5" />
                {currentModule.aiToolType}
              </div>
            )}

            {currentModule?.description && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{currentModule.description}</p>
            )}

            {currentModule?.content ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {currentModule.content}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <BookOpen className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">{locale === "th" ? "เนื้อหาจะปรากฏที่นี่" : "Content will appear here"}</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => goToModule(currentModuleIdx - 1)}
                disabled={currentModuleIdx === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> {t("training.prevModule")}
              </button>
              {currentModuleIdx === totalModules - 1 ? (
                <button
                  onClick={() => updateProgress(100)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                >
                  <CheckCircle className="w-4 h-4" /> {t("training.finishCourse")}
                </button>
              ) : (
                <button
                  onClick={() => goToModule(currentModuleIdx + 1)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                >
                  {t("training.nextModule")} <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
            <h3 className="font-medium text-sm mb-3 text-slate-500 dark:text-slate-400">{locale === "th" ? "โมดูลทั้งหมด" : "All Modules"}</h3>
            <div className="space-y-1">
              {course.modules.map((mod, idx) => (
                <button
                  key={mod.id}
                  onClick={() => goToModule(idx)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-left transition-colors ${
                    idx === currentModuleIdx
                      ? "bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    idx < currentModuleIdx ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    idx === currentModuleIdx ? "bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400" :
                    "bg-slate-100 text-slate-500 dark:bg-slate-800"
                  }`}>
                    {idx < currentModuleIdx ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                  </span>
                  <span className="flex-1 truncate">{mod.title}</span>
                  {mod.duration && <span className="text-xs text-slate-400">{mod.duration}m</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <button
              onClick={() => setActiveTab("sandbox")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "sandbox"
                  ? "bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <Code className="w-4 h-4" /> {t("training.sandbox")}
            </button>
            <button
              onClick={() => setActiveTab("tutor")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "tutor"
                  ? "bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <Bot className="w-4 h-4" /> {t("training.tutor")}
            </button>
          </div>

          {activeTab === "sandbox" ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[600px]">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500">{t("training.sandbox.desc")}</p>
              </div>
              <div ref={sandboxRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {sandboxMessages.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <Code className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">{locale === "th" ? "พิมพ์ Prompt ทดสอบ AI ได้เลย" : "Type a prompt to test AI"}</p>
                  </div>
                )}
                {sandboxMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-primary-500 text-white rounded-br-md"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-md"
                    }`}>
                      <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                    </div>
                  </div>
                ))}
                {sandboxLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-2xl rounded-bl-md">
                      <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex gap-2">
                  <input
                    value={sandboxInput}
                    onChange={(e) => setSandboxInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSandboxSend()}
                    placeholder={t("training.sandbox.placeholder")}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={handleSandboxSend}
                    disabled={!sandboxInput.trim() || sandboxLoading}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white disabled:opacity-40 hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[600px]">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500">{t("training.tutor.desc")}</p>
              </div>
              <div ref={tutorRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {tutorMessages.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">{locale === "th" ? "ถาม AI Tutor เกี่ยวกับเนื้อหาในบทเรียน" : "Ask AI Tutor about this lesson"}</p>
                  </div>
                )}
                {tutorMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-primary-500 text-white rounded-br-md"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-md"
                    }`}>
                      <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                    </div>
                  </div>
                ))}
                {tutorLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-2xl rounded-bl-md">
                      <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex gap-2">
                  <input
                    value={tutorInput}
                    onChange={(e) => setTutorInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleTutorSend()}
                    placeholder={t("training.tutor.placeholder")}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={handleTutorSend}
                    disabled={!tutorInput.trim() || tutorLoading}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white disabled:opacity-40 hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
