"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Zap,
  ChevronRight,
  Sparkles,
  Info,
  Globe,
  FileText,
} from "lucide-react";
import { useLanguage, Locale } from "@/lib/i18n";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();

  const navItems = [
    { label: t("nav.dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { label: t("nav.jobs"), href: "/jobs", icon: Briefcase },
    { label: t("nav.reskilling"), href: "/reskilling", icon: Sparkles },
    { label: t("nav.talent"), href: "/talent", icon: Users },
    { label: t("nav.analytics"), href: "/analytics", icon: BarChart3 },
    { label: t("nav.insights"), href: "/insights", icon: BarChart3 },
    { label: t("nav.about"), href: "/about", icon: Info },
    { label: t("nav.document"), href: "/document", icon: FileText },
    { label: t("nav.settings"), href: "/settings", icon: Settings },
  ];

  const toggleLang = () => {
    setLocale(locale === "th" ? "en" : "th");
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">SkillShiftAI</span>
          </Link>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleLang}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
              aria-label="Toggle language"
            >
              <Globe className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full
          bg-white dark:bg-slate-900
          border-r border-slate-200 dark:border-slate-800
          transition-all duration-300 ease-in-out
          w-64
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="hidden lg:flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
            <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">SkillShiftAI</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t("sidebar.brand")}</p>
              </div>
            </Link>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium text-slate-600 dark:text-slate-400"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              {locale === "th" ? "EN" : "TH"}
            </button>
          </div>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 px-6 py-5 border-b border-slate-200 dark:border-slate-800">
            <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">SkillShiftAI</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t("sidebar.brand")}</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive
                        ? "text-primary-500 dark:text-primary-400"
                        : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                    }`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-primary-400" />}
                </Link>
              );
            })}
          </nav>

          {/* Language Toggle for mobile */}
          <div className="lg:hidden px-3 pb-2">
            <button
              onClick={toggleLang}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Globe className="w-4 h-4" />
              {locale === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
            </button>
          </div>

          {/* Bottom Card */}
          <div className="px-3 pb-4">
            <Link href="/insights" onClick={() => setIsOpen(false)}>
              <div className="rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 p-4 text-white cursor-pointer hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300">
                <h3 className="font-semibold text-sm">{t("sidebar.insights.title")}</h3>
                <p className="text-xs text-white/80 mt-1">{t("sidebar.insights.desc")}</p>
                <span className="mt-3 inline-block text-xs font-medium bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 transition-colors">
                  {t("sidebar.insights.cta")}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
