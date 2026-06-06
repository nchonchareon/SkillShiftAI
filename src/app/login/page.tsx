"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { Zap, Eye, EyeOff, ArrowRight, Globe } from "lucide-react";

export default function LoginPage() {
  const { locale, setLocale, t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(locale === "th" ? "กรุณากรอกอีเมลและรหัสผ่าน" : "Please enter email and password");
      return;
    }

    setLoading(true);
    // Simulate login - in real app, call API
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">SkillShiftAI</span>
          </div>

          {/* Language toggle */}
          <button
            onClick={() => setLocale(locale === "th" ? "en" : "th")}
            className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium text-slate-600 dark:text-slate-400"
          >
            <Globe className="w-4 h-4" />
            {locale === "th" ? "EN" : "TH"}
          </button>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {locale === "th" ? "เข้าสู่ระบบ" : "Welcome back"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            {locale === "th"
              ? "เข้าสู่ระบบเพื่อจัดการทักษะบุคลากร"
              : "Sign in to manage workforce skills"}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {locale === "th" ? "อีเมล" : "Email"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {locale === "th" ? "รหัสผ่าน" : "Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500" />
                <span className="text-slate-600 dark:text-slate-400">
                  {locale === "th" ? "จดจำฉัน" : "Remember me"}
                </span>
              </label>
              <a href="#" className="text-primary-500 hover:text-primary-600 font-medium">
                {locale === "th" ? "ลืมรหัสผ่าน?" : "Forgot password?"}
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {locale === "th" ? "เข้าสู่ระบบ" : "Sign in"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            {locale === "th" ? "ยังไม่มีบัญชี? " : "Don't have an account? "}
            <a href="#" className="text-primary-500 hover:text-primary-600 font-medium">
              {locale === "th" ? "ติดต่อผู้ดูแลระบบ" : "Contact admin"}
            </a>
          </p>
        </div>
      </div>

      {/* Right - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-primary-500 to-emerald-500 items-center justify-center p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMi0yYTEgMSAwIDEwMC0yIDAgMSAwIDAwMCAyek0zNCAyNGgtMnYyaDJ2LTJ6bS00IDB2Mmgydi0yaDN2LTJoLTN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative text-center text-white max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            {locale === "th"
              ? "แพลตฟอร์มออกแบบงานและพัฒนาทักษะ"
              : "Job Redesign & Reskilling Platform"}
          </h2>
          <p className="text-white/80 leading-relaxed">
            {locale === "th"
              ? "วิเคราะห์ความเสี่ยง ระบุช่องว่างทักษะ และสร้างเส้นทางการเรียนรู้เฉพาะบุคลากรด้วย AI"
              : "Analyze risks, identify skill gaps, and create personalized learning pathways with AI"}
          </p>
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { value: "5+", label: locale === "th" ? "พนักงาน" : "Employees" },
              { value: "18", label: locale === "th" ? "ทักษะ" : "Skills" },
              { value: "92%", label: locale === "th" ? "ความแม่นยำ" : "Accuracy" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
