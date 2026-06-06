"use client";

import { useLanguage } from "@/lib/i18n";
import {
  Brain,
  Layers,
  Database,
  Cpu,
  BarChart3,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Globe,
  BookOpen,
} from "lucide-react";

export default function AboutPage() {
  const { t } = useLanguage();

  const techStack = [
    { icon: Layers, label: t("about.tech.frontend"), desc: t("about.tech.frontend.desc"), color: "text-blue-500" },
    { icon: Database, label: t("about.tech.backend"), desc: t("about.tech.backend.desc"), color: "text-emerald-500" },
    { icon: Database, label: t("about.tech.db"), desc: t("about.tech.db.desc"), color: "text-purple-500" },
    { icon: Cpu, label: t("about.tech.ai"), desc: t("about.tech.ai.desc"), color: "text-orange-500" },
    { icon: BarChart3, label: t("about.tech.charts"), desc: t("about.tech.charts.desc"), color: "text-cyan-500" },
  ];

  const references = [
    { label: t("about.references.typhoon"), desc: t("about.references.typhoonDesc"), url: "https://docs.opentyphoon.ai/en/" },
    { label: t("about.references.pgvector"), desc: t("about.references.pgvectorDesc"), url: "https://github.com/pgvector/pgvector" },
    { label: t("about.references.nextjs"), desc: t("about.references.nextjsDesc"), url: "https://nextjs.org/docs" },
    { label: t("about.references.prisma"), desc: t("about.references.prismaDesc"), url: "https://www.prisma.io/docs" },
    { label: t("about.references.recharts"), desc: t("about.references.rechartsDesc"), url: "https://recharts.org/en-US" },
    { label: t("about.references.lucide"), desc: t("about.references.lucideDesc"), url: "https://lucide.dev" },
    { label: t("about.references.wef"), desc: t("about.references.wefDesc"), url: "https://www.weforum.org/publications/the-future-of-jobs-report-2023/" },
    { label: t("about.references.mckinsey"), desc: t("about.references.mckinseyDesc"), url: "https://www.mckinsey.com/mgi/our-research" },
    { label: t("about.references.ilo"), desc: t("about.references.iloDesc"), url: "https://www.ilo.org/global/research/global-reports/global-employment-trends" },
  ];

  const steps = [
    { title: t("about.howItWorks.step1.title"), desc: t("about.howItWorks.step1.desc"), icon: Brain },
    { title: t("about.howItWorks.step2.title"), desc: t("about.howItWorks.step2.desc"), icon: Layers },
    { title: t("about.howItWorks.step3.title"), desc: t("about.howItWorks.step3.desc"), icon: Database },
    { title: t("about.howItWorks.step4.title"), desc: t("about.howItWorks.step4.desc"), icon: BarChart3 },
  ];

  return (
    <div className="space-y-8 sm:space-y-10 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("about.title")}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t("about.subtitle")}</p>
      </div>

      {/* Overview */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-500" />
          </div>
          <h2 className="text-xl font-bold">{t("about.overview.title")}</h2>
        </div>
        <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>{t("about.overview.p1")}</p>
          <p>{t("about.overview.p2")}</p>
          <p>{t("about.overview.p3")}</p>
        </div>
      </section>

      {/* Problems */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <h2 className="text-xl font-bold mb-4">{t("about.problem.title")}</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">{t("about.problem.p1")}</p>
        <ul className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <span className="text-slate-600 dark:text-slate-300">{t(`about.problem.list${i}`)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* How It Works */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <h2 className="text-xl font-bold mb-6">{t("about.howItWorks.title")}</h2>
        <div className="space-y-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block ml-auto">
                    <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <h2 className="text-xl font-bold mb-6">{t("about.tech.title")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {techStack.map((tech, i) => {
            const Icon = tech.icon;
            return (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <Icon className={`w-5 h-5 ${tech.color} mt-0.5 shrink-0`} />
                <div>
                  <p className="font-semibold text-sm">{tech.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tech.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* References */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-primary-500" />
          <h2 className="text-xl font-bold">{t("about.references.title")}</h2>
        </div>
        <div className="space-y-3">
          {references.map((ref, i) => (
            <a
              key={i}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
            >
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-primary-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400">{ref.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ref.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
