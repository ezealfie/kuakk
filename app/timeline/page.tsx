"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Heart, Upload, X, Lock, LogOut } from "lucide-react"
import Image from "next/image"

interface Photo {
  id: string
  month_number: number
  photo_url: string
  uploaded_at: string
}

interface TimeElapsed {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

const RELATIONSHIP_START = new Date(2024, 7, 12)

export default function TimelinePage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [currentDateTime, setCurrentDateTime] = useState("")

  const supabase = createClient()

  const loadPhotos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("timeline_photos")
        .select("*")
        .order("month_number", { ascending: true })
      if (error) throw error
      setPhotos(data || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const updateCounter = () => {
      const now = new Date()
      setCurrentDateTime(
        now.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }) +
          " · " +
          now.toLocaleTimeString("es-ES"),
      )

      const diff = now.getTime() - RELATIONSHIP_START.getTime()
      const totalSeconds = Math.floor(diff / 1000)
      const totalMinutes = Math.floor(totalSeconds / 60)
      const totalHours = Math.floor(totalMinutes / 60)
      const totalDays = Math.floor(totalHours / 24)

      let years = now.getFullYear() - RELATIONSHIP_START.getFullYear()
      let months = now.getMonth() - RELATIONSHIP_START.getMonth()
      if (months < 0) {
        years--
        months += 12
      }

      const dayOfMonth = now.getDate()
      const startDay = RELATIONSHIP_START.getDate()
      let days = dayOfMonth - startDay
      if (days < 0) {
        months--
        if (months < 0) {
          years--
          months = 11
        }
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
        days = prevMonth.getDate() + days
      }

      setTimeElapsed({
        years,
        months,
        days,
        hours: totalHours % 24,
        minutes: totalMinutes % 60,
        seconds: totalSeconds % 60,
      })
    }

    updateCounter()
    const interval = setInterval(updateCounter, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    if (typeof window !== "undefined") {
      const isAuthenticated = localStorage.getItem("timeline_authenticated")
      if (isAuthenticated !== "true") {
        router.push("/")
        return
      }
    }
    loadPhotos()
  }, [router, isMounted, loadPhotos])

  const isMonthUnlocked = (monthNumber: number): boolean => {
    if (monthNumber <= 4) return true
    const now = new Date()
    const targetDate = new Date(RELATIONSHIP_START)
    targetDate.setMonth(targetDate.getMonth() + monthNumber - 1)
    return now >= targetDate
  }

  const getUnlockDate = (monthNumber: number): string => {
    const targetDate = new Date(RELATIONSHIP_START)
    targetDate.setMonth(targetDate.getMonth() + monthNumber - 1)
    return targetDate.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const handlePhotoUpload = async (monthNumber: number, file: File) => {
    if (!isMonthUnlocked(monthNumber)) return
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = reader.result as string
        const existingPhoto = photos.find((p) => p.month_number === monthNumber)
        if (existingPhoto) {
          await supabase.from("timeline_photos").update({ photo_url: base64String }).eq("month_number", monthNumber)
        } else {
          await supabase.from("timeline_photos").insert({ month_number: monthNumber, photo_url: base64String })
        }
        await loadPhotos()
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleDeletePhoto = async (monthNumber: number) => {
    try {
      await supabase.from("timeline_photos").delete().eq("month_number", monthNumber)
      await loadPhotos()
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("timeline_authenticated")
    }
    router.push("/")
  }

  const monthsElapsed = Math.floor((new Date().getTime() - RELATIONSHIP_START.getTime()) / (1000 * 60 * 60 * 24 * 30))
  const totalMonths = Math.max(12, monthsElapsed + 2)

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-pink-50">
        <Heart className="w-8 h-8 text-rose-400 animate-heartbeat" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-pink-50 relative overflow-x-hidden">
      {/* Floating hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-rose-200 animate-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
              opacity: 0.15,
            }}
            size={20 + Math.random() * 15}
          />
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 animate-heartbeat" fill="currentColor" />
              <span className="font-serif text-lg text-rose-600">Eze & Sabri</span>
            </div>
            <button onClick={handleLogout} className="p-2 text-rose-400 hover:text-rose-600 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 relative z-10">
        {/* Date & Time */}
        <p className="text-center text-rose-400/80 text-sm mb-6 capitalize">{currentDateTime}</p>

        {/* Counter */}
        <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-6 mb-12">
          <p className="text-center text-rose-400 text-sm mb-4 font-medium">Juntos hace</p>
          <div className="grid grid-cols-6 gap-2">
            {[
              { value: timeElapsed.years, label: "años", color: "text-rose-600" },
              { value: timeElapsed.months, label: "meses", color: "text-rose-500" },
              { value: timeElapsed.days, label: "días", color: "text-pink-500" },
              { value: timeElapsed.hours, label: "hrs", color: "text-pink-400" },
              { value: timeElapsed.minutes, label: "min", color: "text-rose-400" },
              { value: timeElapsed.seconds, label: "seg", color: "text-rose-300" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className={`text-2xl md:text-3xl font-bold ${item.color}`}>{item.value}</div>
                <div className="text-xs text-gray-400 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-rose-200 via-pink-200 to-rose-100" />

          <div className="space-y-6">
            {[...Array(totalMonths)].map((_, index) => {
              const monthNumber = index + 1
              const photo = photos.find((p) => p.month_number === monthNumber)
              const isUnlocked = isMonthUnlocked(monthNumber)
              const isExpanded = expandedMonth === monthNumber

              return (
                <div key={monthNumber} className="relative pl-14">
                  {/* Dot */}
                  <div className="absolute left-5 top-5 -translate-x-1/2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        isUnlocked ? "bg-rose-400 ring-4 ring-rose-100" : "bg-gray-300 ring-4 ring-gray-100"
                      }`}
                    />
                  </div>

                  {/* Card */}
                  <div
                    onClick={() => isUnlocked && setExpandedMonth(isExpanded ? null : monthNumber)}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isUnlocked
                        ? "bg-white border-rose-100 hover:border-rose-200 hover:shadow-md cursor-pointer"
                        : "bg-gray-50 border-gray-100 opacity-50"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`font-serif text-lg ${isUnlocked ? "text-rose-600" : "text-gray-400"}`}>
                          Mes {monthNumber}
                        </h3>
                        {!isUnlocked && (
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Lock size={14} />
                            <span className="text-xs">{getUnlockDate(monthNumber)}</span>
                          </div>
                        )}
                        {isUnlocked && photo && <span className="text-xs text-rose-400">Ver foto</span>}
                      </div>

                      {/* Preview */}
                      {!isExpanded && photo && (
                        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-rose-50">
                          <Image
                            src={photo.photo_url || "/placeholder.svg"}
                            alt={`Mes ${monthNumber}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {!isExpanded && !photo && isUnlocked && (
                        <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
                          <p className="text-rose-300 text-sm">Agregar recuerdo</p>
                        </div>
                      )}

                      {/* Expanded */}
                      {isExpanded && (
                        <div className="space-y-3">
                          {photo ? (
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                              <Image
                                src={photo.photo_url || "/placeholder.svg"}
                                alt={`Mes ${monthNumber}`}
                                fill
                                className="object-cover"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeletePhoto(monthNumber)
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <label className="block cursor-pointer" onClick={(e) => e.stopPropagation()}>
                              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-dashed border-rose-200 flex flex-col items-center justify-center gap-2 hover:border-rose-300 transition-colors">
                                <Upload className="w-8 h-8 text-rose-300" />
                                <p className="text-rose-400 text-sm font-medium">Subir foto</p>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handlePhotoUpload(monthNumber, file)
                                }}
                              />
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center pb-8">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-sm border border-rose-100">
            <Heart className="w-4 h-4 text-rose-500" fill="currentColor" />
            <p className="text-rose-500 font-serif text-sm italic">Gracias por estos 5 meses, Sabri. Te amo. – Eze</p>
          </div>
        </div>
      </main>
    </div>
  )
}
