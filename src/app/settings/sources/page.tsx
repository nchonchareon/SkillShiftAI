"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import {
  Settings,
  Download,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  Globe,
  ExternalLink,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Database,
} from "lucide-react";

interface Course {
  externalId: string;
  source: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  difficulty: string;
  durationMinutes: number;
  instructorName: string | null;
  categoryNames: string[];
  learnerCount: number;
  sourceUrl: string;
}

interface ImportResult {
  title: string;
  status: "created" | "skipped" | "error";
  id?: string;
}

interface Source {
  id: string;
  name: string;
  nameEN: string;
  url: string;
  color: string;
  desc: string;
  descEN: string;
}

const sources: Source[] = [
  {
    id: "futureskill",
    name: "FutureSkill",
    nameEN: "FutureSkill",
    url: "futureskill.co",
    color: "from-purple-500 to-indigo-500",
    desc: "พบ 647 คอร์ส ครอบคลุม Data, Tech, Business, Creative",
    descEN: "647 courses covering Data, Tech, Business, Creative",
  },
  {
    id: "borntodev",
    name: "BornToDev",
    nameEN: "BornToDev School",
    url: "school.borntodev.com",
    color: "from-emerald-500 to-teal-500",
    desc: "พบ 126 คอร์ส เน้นการเขียนโปรแกรมและเทคโนโลยี",
    descEN: "126 courses focused on programming and technology",
  },
  {
    id: "custom",
    name: "เว็บอื่นๆ",
    nameEN: "Other Website",
    url: "",
    color: "from-orange-500 to-amber-500",
    desc: "กรอก URL ของเว็บไซต์เพื่อดึงข้อมูลหลักสูตร",
    descEN: "Enter a website URL to fetch course data",
  },
];

const difficultyColor: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function SettingsSourcesPage() {
  const { t } = useLanguage();
  const [authenticated, setAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeSource, setActiveSource] = useState("futureskill");
  const [courses, setCourses] = useState<Course[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [imported, setImported] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [customUrl, setCustomUrl] = useState("");

  useEffect(() => {
    const isAuth = sessionStorage.getItem("skillshiftai_auth");
    if (isAuth === "true") setAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail || !loginPassword) {
      setLoginError(t("settings.login.error"));
      return;
    }
    setLoggingIn(true);
    setTimeout(() => {
      sessionStorage.setItem("skillshiftai_auth", "true");
      sessionStorage.setItem("skillshiftai_user", loginEmail);
      setAuthenticated(true);
      setLoggingIn(false);
    }, 800);
  };

  const fetchCourses = useCallback(async (source: string, p: number, url?: string) => {
    setLoading(true);
    setError(null);
    setFetched(false);
    try {
      const urlParam = source === "custom" && url ? `&url=${encodeURIComponent(url)}` : "";
      const res = await fetch(`/api/training/import?source=${source}&page=${p}&limit=20${urlParam}`);
      const json = await res.json();
      if (json.success) {
        setCourses(json.data.courses);
        setTotalPages(json.data.pagination.totalPages);
        setTotalItems(json.data.pagination.totalItems);
        setPage(p);
        setSelected(new Set());
        setFetched(true);
      } else {
        setError(json.error || "Failed to load");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  const switchSource = (sourceId: string) => {
    setActiveSource(sourceId);
    setCourses([]);
    setSelected(new Set());
    setFetched(false);
    setError(null);
    setPage(1);
    setCustomUrl("");
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === courses.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(courses.map((c) => c.externalId)));
    }
  };

  const handleImport = async () => {
    const toImport = courses.filter((c) => selected.has(c.externalId));
    if (toImport.length === 0) return;

    setImporting(true);
    try {
      const res = await fetch("/api/training/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courses: toImport }),
      });
      const json = await res.json();
      if (json.success) {
        setResults(json.data);
        setImported(true);
      } else {
        setError(json.error || "Import failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.categoryNames.some((cat) => cat.toLowerCase().includes(search.toLowerCase())) ||
      (c.instructorName && c.instructorName.toLowerCase().includes(search.toLowerCase()))
  );

  const activeSrc = sources.find((s) => s.id === activeSource);

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{t("settings.login.title")}</h2>
              <p className="text-xs text-slate-500">{t("settings.login.subtitle")}</p>
            </div>
          </div>
          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("settings.login.email")}</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@company.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("settings.login.password")}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50"
            >
              {loggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {!loggingIn && t("settings.login.btn")}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (imported) {
    const created = results.filter((r) => r.status === "created").length;
    const skipped = results.filter((r) => r.status === "skipped").length;
    const errors = results.filter((r) => r.status === "error").length;

    return (
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center gap-3">
          <Link href="/settings" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{t("sources.importComplete")}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("sources.subtitle")}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 text-center">
            <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-emerald-500">{created}</p>
            <p className="text-sm text-slate-500">{t("sources.created")}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 text-center">
            <AlertTriangle className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-500">{skipped}</p>
            <p className="text-sm text-slate-500">{t("sources.skipped")}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 text-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-500">{errors}</p>
            <p className="text-sm text-slate-500">{t("sources.errors")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="font-semibold mb-3">{t("sources.details")}</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 text-sm py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                {r.status === "created" && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                {r.status === "skipped" && <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />}
                {r.status === "error" && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />}
                <span className="flex-1 truncate">{r.title}</span>
                <span className={`text-xs font-medium ${r.status === "created" ? "text-emerald-500" : r.status === "skipped" ? "text-yellow-500" : "text-red-500"}`}>
                  {r.status === "created" ? "OK" : r.status === "skipped" ? t("sources.exists") : "ERR"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { setImported(false); setFetched(false); setCourses([]); }}
            className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {t("sources.importMore")}
          </button>
          <Link
            href="/training"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all"
          >
            {t("sources.backToTraining")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <Link href="/settings" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{t("sources.title")}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("sources.subtitle")}</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {sources.map((src) => (
          <button
            key={src.id}
            onClick={() => switchSource(src.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
              activeSource === src.id
                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <Globe className="w-4 h-4" />
            {src.name}
            <span className="text-xs text-slate-400 font-normal">{src.url}</span>
          </button>
        ))}
      </div>

      {!fetched && !loading && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeSrc?.color} flex items-center justify-center mx-auto mb-4`}>
            <Download className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-500 mb-1 font-medium">
            {t("sources.fetchFrom")} {activeSrc?.name}
          </p>
          <p className="text-sm text-slate-400 mb-5">
            {activeSource === "custom" ? activeSrc?.descEN : activeSrc?.desc}
          </p>

          {activeSource === "custom" ? (
            <div className="max-w-lg mx-auto space-y-4">
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com/courses"
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                />
              </div>
              <p className="text-xs text-slate-400">
                {t("sources.customHint")}
              </p>
              <button
                onClick={() => fetchCourses("custom", 1, customUrl)}
                disabled={!customUrl.trim()}
                className={`px-8 py-3 rounded-xl bg-gradient-to-r ${activeSrc?.color} text-white font-semibold hover:shadow-lg transition-all disabled:opacity-40`}
              >
                {t("sources.fetchNow")}
              </button>
            </div>
          ) : (
            <button
              onClick={() => fetchCourses(activeSource, 1)}
              className={`px-8 py-3 rounded-xl bg-gradient-to-r ${activeSrc?.color} text-white font-semibold hover:shadow-lg transition-all`}
            >
              {t("sources.fetchNow")}
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          <p className="text-sm text-slate-500">{t("sources.fetching")}</p>
        </div>
      )}

      {fetched && !loading && (
        <>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("sources.searchPlaceholder")}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={toggleAll}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              {selected.size === courses.length ? t("sources.deselectAll") : t("sources.selectAll")}
            </button>
            <button
              onClick={handleImport}
              disabled={selected.size === 0 || importing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm disabled:opacity-40 hover:shadow-lg hover:shadow-primary-500/25 transition-all whitespace-nowrap"
            >
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {t("sources.import")} ({selected.size})
            </button>
          </div>

          <p className="text-sm text-slate-500">
            {t("sources.found")} {totalItems} {t("sources.coursesFrom")} {activeSrc?.name}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCourses.map((course) => (
              <div
                key={course.externalId}
                onClick={() => toggleSelect(course.externalId)}
                className={`bg-white dark:bg-slate-900 rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                  selected.has(course.externalId)
                    ? "border-primary-500 shadow-lg shadow-primary-500/10"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex gap-3">
                  {course.thumbnailUrl && (
                    <img
                      src={course.thumbnailUrl}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover shrink-0 bg-slate-100 dark:bg-slate-800"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={selected.has(course.externalId)}
                        onChange={() => toggleSelect(course.externalId)}
                        className="mt-1 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2">{course.title}</h3>
                        {course.instructorName && (
                          <p className="text-xs text-slate-400 mt-0.5">{course.instructorName}</p>
                        )}
                      </div>
                      <a
                        href={course.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    </div>
                    {course.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{course.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span className={`px-2 py-0.5 rounded font-medium ${difficultyColor[course.difficulty] || difficultyColor.beginner}`}>
                        {course.difficulty}
                      </span>
                      {course.durationMinutes > 0 && (
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.durationMinutes}m</span>
                      )}
                      {course.learnerCount > 0 && (
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.learnerCount.toLocaleString()}</span>
                      )}
                    </div>
                    {course.categoryNames.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {course.categoryNames.slice(0, 3).map((cat) => (
                          <span key={cat} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-500">{cat}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">{t("sources.noResults")}</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => fetchCourses(activeSource, page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-slate-500">{page} / {totalPages}</span>
              <button
                onClick={() => fetchCourses(activeSource, page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
