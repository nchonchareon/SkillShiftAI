import { LucideIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  description?: string;
  iconColor?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
  iconColor = "text-primary-500",
}: MetricCardProps) {
  const { t } = useLanguage();
  const changeColors = {
    positive: "text-emerald-600 dark:text-emerald-400",
    negative: "text-red-600 dark:text-red-400",
    neutral: "text-slate-500 dark:text-slate-400",
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight">{value}</p>
          {change && (
            <p className={`text-xs font-medium ${changeColors[changeType]}`}>
              {changeType === "positive" && "↑"}
              {changeType === "negative" && "↓"}
              {change} {t("metric.change")}
            </p>
          )}
          {description && (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {description}
            </p>
          )}
        </div>
        <div
          className={`p-3 rounded-xl bg-slate-100 dark:bg-slate-800 ${iconColor} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
