"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Clock, TrendingUp, DollarSign, Moon, Sun } from "lucide-react"

const incomeTypes = [
  { value: "hourly", label: "Stundenlohn", icon: "⏰" },
  { value: "weekly", label: "Wocheneinkommen", icon: "📅" },
  { value: "monthly", label: "Monatseinkommen", icon: "🗓️" },
]

const currencies = [
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
  { value: "CHF", label: "CHF (₣)", symbol: "₣" },
]

interface Settings {
  incomeType: "hourly" | "weekly" | "monthly"
  incomeValue: number
  currency: string
  darkMode: boolean
  enabled: boolean
  weeklyHours: number
}

declare const chrome: any

export const Popup: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    incomeType: "monthly",
    incomeValue: 0,
    currency: "EUR",
    darkMode: false,
    enabled: true,
    weeklyHours: 40,
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    chrome.storage.sync.get(
      ["incomeType", "incomeValue", "currency", "darkMode", "enabled", "weeklyHours"],
      (result: Settings) => {
        setSettings({
          incomeType: result.incomeType || "monthly",
          incomeValue: result.incomeValue || 0,
          currency: result.currency || "EUR",
          darkMode: result.darkMode || false,
          enabled: typeof result.enabled === "boolean" ? result.enabled : true,
          weeklyHours: result.weeklyHours || 40,
        })
        setIsLoading(false)
      },
    )
  }, [])

  // Apply dark mode to document
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [settings.darkMode])

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    chrome.storage.sync.set({ [key]: value })
  }

  const handleIncomeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSetting("incomeType", e.target.value as Settings["incomeType"])
  }

  const handleIncomeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0
    updateSetting("incomeValue", value)
  }

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSetting("currency", e.target.value)
  }

  const handleDarkModeChange = () => {
    updateSetting("darkMode", !settings.darkMode)
  }

  const handleEnabledChange = () => {
    updateSetting("enabled", !settings.enabled)
  }

  const handleWeeklyHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0
    updateSetting("weeklyHours", value)
  }

  const selectedCurrency = currencies.find((c) => c.value === settings.currency)
  const selectedIncomeType = incomeTypes.find((t) => t.value === settings.incomeType)

  if (isLoading) {
    return (
      <div className="w-[380px] h-[520px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="w-[380px] min-h-[520px] bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden transition-all duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,122,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(0,122,255,0.03)_49%,rgba(0,122,255,0.03)_51%,transparent_52%)] bg-[length:20px_20px]" />
      </div>

      <div className="relative p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">Time Money</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Zeitwert-Tracker</p>
            </div>
          </div>
          <button
            onClick={handleDarkModeChange}
            className="p-2 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200 group"
          >
            {settings.darkMode ? (
              <Sun className="w-4 h-4 text-yellow-500 group-hover:rotate-12 transition-transform duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600 group-hover:-rotate-12 transition-transform duration-200" />
            )}
          </button>
        </div>

        {/* Main Toggle */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                  settings.enabled ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <TrendingUp
                  className={`w-4 h-4 transition-colors duration-200 ${
                    settings.enabled ? "text-green-600 dark:text-green-400" : "text-gray-400"
                  }`}
                />
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Extension aktiv</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {settings.enabled ? "Preise werden verfolgt" : "Tracking pausiert"}
                </p>
              </div>
            </div>
            <button
              onClick={handleEnabledChange}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                settings.enabled ? "bg-blue-500 shadow-lg shadow-blue-500/25" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                  settings.enabled ? "left-6" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Income Type */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4" />
              Einkommensart
            </label>
            <div className="relative">
              <select
                value={settings.incomeType}
                onChange={handleIncomeTypeChange}
                className="w-full h-12 pl-4 pr-10 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 text-gray-900 dark:text-white shadow-sm hover:shadow-md focus:shadow-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
              >
                {incomeTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Income Value */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedIncomeType?.label || "Einkommen"}
            </label>
            <div className="relative">
              <input
                type="number"
                value={settings.incomeValue || ""}
                onChange={handleIncomeValueChange}
                className="w-full h-12 pl-4 pr-12 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 text-gray-900 dark:text-white shadow-sm hover:shadow-md focus:shadow-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg font-medium"
                min={0}
                step={1}
                placeholder="z.B. 1620"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                {selectedCurrency?.symbol}
              </div>
            </div>
          </div>

          {/* Weekly Hours */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Wochenarbeitszeit</label>
            <div className="relative">
              <input
                type="number"
                value={settings.weeklyHours || ""}
                onChange={handleWeeklyHoursChange}
                className="w-full h-12 pl-4 pr-12 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 text-gray-900 dark:text-white shadow-sm hover:shadow-md focus:shadow-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg font-medium"
                min={1}
                step={1}
                placeholder="z.B. 40"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                h
              </div>
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Währung</label>
            <div className="relative">
              <select
                value={settings.currency}
                onChange={handleCurrencyChange}
                className="w-full h-12 pl-4 pr-10 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 text-gray-900 dark:text-white shadow-sm hover:shadow-md focus:shadow-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
              >
                {currencies.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Status Footer */}
        <div className="mt-6 p-4 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${settings.enabled ? "bg-green-500" : "bg-gray-400"} animate-pulse`}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {settings.enabled ? "Aktiv" : "Pausiert"}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-500">{chrome.runtime.getManifest().version}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
