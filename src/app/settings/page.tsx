"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { Settings, Key, Database, Bell, Shield, CheckCircle2, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const { t } = useLanguage();
  const [typhoonKey, setTyphoonKey] = useState("");
  const [dbUrl, setDbUrl] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("settings.title")}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {t("settings.subtitle")}
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          {t("settings.saved")}
        </div>
      )}

      {/* Typhoon API Key */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-5 h-5 text-primary-500" />
          <h2 className="font-semibold">{t("settings.typhoon.title")}</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {t("settings.typhoon.desc")}
        </p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">{t("settings.typhoon.apiKey")}</label>
            <input
              type="password"
              value={typhoonKey}
              onChange={(e) => setTyphoonKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <AlertTriangle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-700 dark:text-blue-400">
              {t("settings.typhoon.hint")}
            </p>
          </div>
        </div>
      </div>

      {/* Database */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-5 h-5 text-emerald-500" />
          <h2 className="font-semibold">{t("settings.database.title")}</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">PostgreSQL URL</label>
            <input
              type="password"
              value={dbUrl}
              onChange={(e) => setDbUrl(e.target.value)}
              placeholder="postgresql://user:pass@localhost:5432/skillshiftai"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-orange-500" />
          <h2 className="font-semibold">{t("settings.notifications.title")}</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: t("settings.notifications.gap") },
            { label: t("settings.notifications.monthly") },
            { label: t("settings.notifications.risk") },
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500" />
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-purple-500" />
          <h2 className="font-semibold">{t("settings.status.title")}</h2>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Typhoon AI</span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              {t("settings.status.active")}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">PostgreSQL + pgvector</span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              {t("settings.status.active")}
            </span>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-all"
        >
          {t("settings.save")}
        </button>
      </div>
    </div>
  );
}
