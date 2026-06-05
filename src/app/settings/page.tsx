"use client";

import { useLanguage } from "@/lib/i18n";
import { Settings, Key, Database, Bell, Palette } from "lucide-react";

export default function SettingsPage() {
  const { locale } = useLanguage();

  return (
    <div className="space-y-6 sm:space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{locale === "th" ? "ตั้งค่า" : "Settings"}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {locale === "th" ? "จัดการการตั้งค่าระบบและการเชื่อมต่อ" : "Manage system settings and connections"}
        </p>
      </div>

      {/* API Keys */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-5 h-5 text-primary-500" />
          <h2 className="font-semibold">{locale === "th" ? "คีย์ API" : "API Keys"}</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Gemini API Key</label>
            <input
              type="password"
              placeholder="AIza..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Database */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-5 h-5 text-emerald-500" />
          <h2 className="font-semibold">{locale === "th" ? "ฐานข้อมูล" : "Database"}</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">PostgreSQL URL</label>
            <input
              type="password"
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
          <h2 className="font-semibold">{locale === "th" ? "การแจ้งเตือน" : "Notifications"}</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: locale === "th" ? "แจ้งเตือนเมื่อมีทักษะวิกฤตใหม่" : "Alert on new critical skill gaps" },
            { label: locale === "th" ? "รายงานรายเดือนอัตโนมัติ" : "Monthly automated reports" },
            { label: locale === "th" ? "แจ้งเตือนความเสี่ยงสูง" : "High risk job alerts" },
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500" />
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
