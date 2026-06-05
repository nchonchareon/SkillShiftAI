"use client";

import Link from "next/link";
import { ArrowRight, Zap, Brain, BarChart3, Users, Shield, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useLanguage();

  const features = [
    { icon: Brain, title: t("landing.f1.title"), desc: t("landing.f1.desc") },
    { icon: BarChart3, title: t("landing.f2.title"), desc: t("landing.f2.desc") },
    { icon: Users, title: t("landing.f3.title"), desc: t("landing.f3.desc") },
    { icon: Shield, title: t("landing.f4.title"), desc: t("landing.f4.desc") },
    { icon: Sparkles, title: t("landing.f5.title"), desc: t("landing.f5.desc") },
    { icon: Zap, title: t("landing.f6.title"), desc: t("landing.f6.desc") },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-emerald-500/10" />
        <div className="relative max-w-5xl mx-auto text-center pt-16 sm:pt-24 pb-16">
          <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 text-sm font-medium px-4 py-2 rounded-full mb-6 border border-primary-200 dark:border-primary-800">
            <Sparkles className="w-4 h-4" />
            {t("landing.badge")}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {t("landing.hero.title1")}
            <br />
            <span className="bg-gradient-to-r from-primary-500 to-emerald-500 bg-clip-text text-transparent">
              {t("landing.hero.title2")}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            {t("landing.hero.desc")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              {t("landing.cta.dashboard")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
            >
              {t("landing.cta.analyze")}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t("landing.features.title")}</h2>
          <p className="text-slate-500 dark:text-slate-400">{t("landing.features.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="group p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-primary-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
