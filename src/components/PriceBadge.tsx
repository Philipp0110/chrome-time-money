"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Clock, Calendar, Timer } from "lucide-react"

interface PriceBadgeProps {
  price: number
  settings: {
    incomeType: "hourly" | "weekly" | "monthly"
    incomeValue: number
    currency: string
    darkMode: boolean
    enabled: boolean
    weeklyHours: number
  }
}

function calculateTime(price: number, incomeType: string, incomeValue: number, weeklyHours: number) {
  if (!incomeValue || incomeValue <= 0 || weeklyHours <= 0) return null

  const dailyHours = weeklyHours / 5
  if (dailyHours === 0) return null

  let hourlyRate = 0
  switch (incomeType) {
    case "hourly":
      hourlyRate = incomeValue
      break
    case "weekly":
      hourlyRate = incomeValue / weeklyHours
      break
    case "monthly":
      hourlyRate = incomeValue / (weeklyHours * 4)
      break
  }

  if (hourlyRate === 0) return null

  const totalHours = price / hourlyRate
  const totalDays = totalHours / dailyHours

  if (totalHours < 1) {
    const minutes = Math.round(totalHours * 60)
    return { value: minutes, unit: "Min", icon: Timer, color: "text-green-600", bgColor: "bg-green-50" }
  } else if (totalHours < 8) {
    return { value: totalHours, unit: "Std", icon: Clock, color: "text-blue-600", bgColor: "bg-blue-50" }
  } else {
    return { value: totalDays, unit: "Tage", icon: Calendar, color: "text-orange-600", bgColor: "bg-orange-50" }
  }
}

export const PriceBadge: React.FC<PriceBadgeProps> = ({ price, settings }) => {
  const [time, setTime] = useState<{ value: number; unit: string; icon: any; color: string; bgColor: string } | null>(
    null,
  )
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isNaN(price) && settings.enabled) {
      const result = calculateTime(price, settings.incomeType, settings.incomeValue, settings.weeklyHours)
      setTime(result)
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [price, settings])

  if (!time || !isVisible) return null

  const IconComponent = time.icon
  const displayValue =
    time.value < 1 && time.unit !== "Min"
      ? time.value.toFixed(2)
      : time.value < 10
        ? time.value.toFixed(1)
        : Math.round(time.value)

  return (
    <div className="inline-flex items-center gap-2 ml-3 px-3 py-2 rounded-xl bg-white border-2 border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
      
      {/* Separator */}
      <div className="w-px h-4 bg-gray-300" />

      {/* Time display */}
      <div className="flex items-center gap-1.5">
        <div className={`w-5 h-5 rounded-lg ${time.bgColor} flex items-center justify-center`}>
          <IconComponent className={`w-3 h-3 ${time.color}`} />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-bold text-gray-900"> {displayValue} </span>
          <span className="text-xs font-medium text-gray-600"> {time.unit} </span>
          <span className="text-xs text-gray-500">Arbeit</span>
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
    </div>
  )
}
