"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import {
  Settings, Key, Database, Bell, Shield, CheckCircle2, AlertTriangle,
  Lock, Eye, EyeOff, Cpu, Cloud, Activity, BarChart3, Power, PowerOff,
  Loader2, Zap, Globe, ChevronRight
} from "lucide-react";
import Link from "next/link";

interface AIProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  apiKey: string;
  model: string;
  endpoint: string;
  tokensUsed: number;
  tokensLimit: number;
  status: "active" | "inactive" | "error";
}

const defaultProviders: AIProvider[] = [
  {
    id: "typhoon",
    name: "Typhoon AI",
    description: "Thai-optimized LLM by SCB 10X — ภาษาไทยดีมาก ฟรี",
    icon: "🇹🇭",
    enabled: true,
    apiKey: "",
    model: "typhoon-v2.5-30b-a3b-instruct",
    endpoint: "https://api.opentyphoon.ai/v1",
    tokensUsed: 12450,
    tokensLimit: 100000,
    status: "active",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Google's multimodal AI — รองรับ 100+ ภาษา",
    icon: "💎",
    enabled: false,
    apiKey: "",
    model: "gemini-2.0-flash",
    endpoint: "https://generativelanguage.googleapis.com/v1beta",
    tokensUsed: 8200,
    tokensLimit: 15000,
    status: "inactive",
  },
  {
    id: "ollama",
    name: "Ollama (Local)",
    description: "Run AI locally on your machine — ฟรี ไม่ต้องใช้ API key",
    icon: "🦙",
    enabled: false,
    apiKey: "",
    model: "qwen2.5:1.5b",
    endpoint: "http://localhost:11434",
    tokensUsed: 0,
    tokensLimit: 0,
    status: "inactive",
  },
];

export default function SettingsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [providers, setProviders] = useState<AIProvider[]>(defaultProviders);
  const [dbUrl, setDbUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [showDbUrl, setShowDbUrl] = useState(false);
  const [dbEnabled, setDbEnabled] = useState(true);
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    tables: Record<string, number>;
    totalRecords: number;
    message: string;
  } | null>(null);
  const [dbChecking, setDbChecking] = useState(false);
  const [activeProvider, setActiveProvider] = useState("typhoon");

  // Check auth on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem("skillshiftai_auth");
    if (isAuth === "true") {
      setAuthenticated(true);
    }
    const dbPref = sessionStorage.getItem("skillshiftai_db_enabled");
    if (dbPref !== null) {
      setDbEnabled(dbPref !== "false");
    }
    const savedProvider = localStorage.getItem("skillshiftai_active_provider");
    if (savedProvider) {
      setActiveProvider(savedProvider);
    }
  }, []);

  // Check DB status when authenticated
  useEffect(() => {
    if (authenticated && dbEnabled) {
      checkDbStatus();
    }
  }, [authenticated, dbEnabled]);

  const checkDbStatus = async () => {
    setDbChecking(true);
    try {
      const res = await fetch("/api/db-status");
      const data = await res.json();
      setDbStatus(data);
    } catch {
      setDbStatus({ connected: false, tables: {}, totalRecords: 0, message: "Failed to check" });
    } finally {
      setDbChecking(false);
    }
  };

  const toggleDb = () => {
    const next = !dbEnabled;
    setDbEnabled(next);
    sessionStorage.setItem("skillshiftai_db_enabled", String(next));
    if (next) checkDbStatus();
    else setDbStatus(null);
  };

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

  const handleLogout = () => {
    sessionStorage.removeItem("skillshiftai_auth");
    sessionStorage.removeItem("skillshiftai_user");
    sessionStorage.removeItem("skillshiftai_db_enabled");
    setAuthenticated(false);
  };

  const toggleProvider = (id: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, enabled: !p.enabled, status: !p.enabled ? "active" : "inactive" }
          : p
      )
    );
  };

  const selectProvider = (id: string) => {
    const provider = providers.find((p) => p.id === id);
    if (provider && provider.enabled) {
      setActiveProvider(id);
      localStorage.setItem("skillshiftai_active_provider", id);
    }
  };

  const updateProviderKey = (id: string, key: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, apiKey: key } : p))
    );
  };

  const updateProviderModel = (id: string, model: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, model } : p))
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // ═══════════════════════════════════════════════════════════
  // LOGIN FORM
  // ═══════════════════════════════════════════════════════════
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
              {loggingIn ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  {t("settings.login.btn")}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // SETTINGS FORM
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="space-y-6 sm:space-y-8 max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("settings.title")}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t("settings.subtitle")}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <PowerOff className="w-4 h-4" />
          {t("settings.logout")}
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          {t("settings.saved")}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* AI Providers */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <Cpu className="w-5 h-5 text-primary-500" />
          <h2 className="font-semibold">{t("settings.aiProviders.title")}</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{t("settings.aiProviders.desc")}</p>

        <div className="space-y-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className={`border rounded-xl transition-all ${
                provider.enabled
                  ? "border-primary-200 dark:border-primary-800 bg-primary-50/30 dark:bg-primary-950/10"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              {/* Provider Header */}
              <div className="flex items-center gap-4 p-4">
                <span className="text-2xl">{provider.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{provider.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        provider.enabled
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {provider.enabled ? t("settings.status.active") : t("settings.status.inactive")}
                    </span>
                    {provider.enabled && activeProvider === provider.id && (
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                        {t("settings.aiProviders.inUse")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{provider.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {provider.enabled && activeProvider !== provider.id && (
                    <button
                      onClick={() => selectProvider(provider.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors font-medium"
                    >
                      {t("settings.aiProviders.use")}
                    </button>
                  )}
                  <button
                    onClick={() => toggleProvider(provider.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      provider.enabled ? "bg-primary-500" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        provider.enabled ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Token Usage Bar */}
              {provider.enabled && provider.tokensLimit > 0 && (
                <div className="px-4 pb-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {t("settings.tokens.used")}: {provider.tokensUsed.toLocaleString()} / {provider.tokensLimit.toLocaleString()}
                    </span>
                    <span>{Math.round((provider.tokensUsed / provider.tokensLimit) * 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        provider.tokensUsed / provider.tokensLimit > 0.8
                          ? "bg-red-500"
                          : provider.tokensUsed / provider.tokensLimit > 0.5
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min((provider.tokensUsed / provider.tokensLimit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Expanded Config */}
              {provider.enabled && expandedProvider === provider.id && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-200 dark:border-slate-700 pt-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">{t("settings.aiProviders.apiKey")}</label>
                    <div className="relative">
                      <input
                        type={showApiKeys[provider.id] ? "text" : "password"}
                        value={provider.apiKey}
                        onChange={(e) => updateProviderKey(provider.id, e.target.value)}
                        placeholder={provider.id === "ollama" ? "No key needed" : "sk-..."}
                        disabled={provider.id === "ollama"}
                        className="w-full px-3 py-2 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                      />
                      {provider.id !== "ollama" && (
                        <button
                          type="button"
                          onClick={() => setShowApiKeys(prev => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {showApiKeys[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">{t("settings.aiProviders.model")}</label>
                      <input
                        type="text"
                        value={provider.model}
                        onChange={(e) => updateProviderModel(provider.id, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">{t("settings.aiProviders.endpoint")}</label>
                      <input
                        type="text"
                        value={provider.endpoint}
                        disabled
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm opacity-60"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Expand Button */}
              {provider.enabled && (
                <button
                  onClick={() => setExpandedProvider(expandedProvider === provider.id ? null : provider.id)}
                  className="w-full px-4 py-2 text-xs text-slate-500 hover:text-primary-500 border-t border-slate-200 dark:border-slate-700 transition-colors"
                >
                  {expandedProvider === provider.id ? t("settings.aiProviders.hideConfig") : t("settings.aiProviders.showConfig")}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* Token Usage Summary */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          <h2 className="font-semibold">{t("settings.usage.title")}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {providers.filter(p => p.enabled).map((provider) => (
            <div key={provider.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{provider.icon}</span>
                <span className="text-sm font-medium">{provider.name}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{provider.tokensUsed.toLocaleString()}</p>
              <p className="text-xs text-slate-500">{t("settings.tokens.thisMonth")}</p>
              {provider.tokensLimit > 0 && (
                <div className="mt-2">
                  <div className="h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-500"
                      style={{ width: `${Math.min((provider.tokensUsed / provider.tokensLimit) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {t("settings.tokens.remaining")}: {(provider.tokensLimit - provider.tokensUsed).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
          {providers.filter(p => p.enabled).length === 0 && (
            <p className="text-sm text-slate-400 col-span-3 text-center py-4">
              {t("settings.usage.noProviders")}
            </p>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* Database — Toggle + Monitor */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-emerald-500" />
            <h2 className="font-semibold">{t("settings.database.title")}</h2>
          </div>
          <button
            onClick={toggleDb}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              dbEnabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                dbEnabled ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          {t("settings.database.desc")}
        </p>

        {dbEnabled && (
          <div className="space-y-4">
            {/* Connection Status */}
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${
              dbStatus?.connected
                ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
                : dbChecking
                ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
            }`}>
              <div className={`w-2.5 h-2.5 rounded-full ${
                dbStatus?.connected ? "bg-emerald-500 animate-pulse" : dbChecking ? "bg-amber-500 animate-pulse" : "bg-red-500"
              }`} />
              <span className={`text-sm font-medium ${
                dbStatus?.connected ? "text-emerald-700 dark:text-emerald-400" : dbChecking ? "text-amber-700 dark:text-amber-400" : "text-red-700 dark:text-red-400"
              }`}>
                {dbChecking
                  ? "Checking connection..."
                  : dbStatus?.connected
                  ? t("settings.database.connected")
                  : t("settings.database.disconnected")}
              </span>
              <button
                onClick={checkDbStatus}
                disabled={dbChecking}
                className="ml-auto text-xs px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {dbChecking ? <Loader2 className="w-3 h-3 animate-spin inline" /> : t("settings.database.test")}
              </button>
            </div>

            {/* DATABASE_URL */}
            <div>
              <label className="block text-xs font-medium mb-1">DATABASE_URL (Neon PostgreSQL)</label>
              <div className="relative">
                <input
                  type={showDbUrl ? "text" : "password"}
                  value={dbUrl}
                  onChange={(e) => setDbUrl(e.target.value)}
                  placeholder="postgresql://user:pass@host/db?sslmode=require"
                  className="w-full px-3 py-2 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowDbUrl(!showDbUrl)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showDbUrl ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Table Monitor */}
            {dbStatus?.connected && dbStatus.tables && (
              <div>
                <p className="text-xs font-medium mb-2 text-slate-500 dark:text-slate-400">{t("settings.database.tables")}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(dbStatus.tables).map(([table, count]) => (
                    <div key={table} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{(count as number).toLocaleString()}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{table}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Activity className="w-3 h-3" />
                  {t("settings.database.total")}: {dbStatus.totalRecords.toLocaleString()} {t("settings.database.records")}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* Notifications */}
      {/* ═══════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════ */}
      {/* Data Sources */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Link href="/settings/sources">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-500" />
              <div>
                <h2 className="font-semibold">{t("sources.title")}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t("sources.subtitle")}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
          </div>
        </div>
      </Link>

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
