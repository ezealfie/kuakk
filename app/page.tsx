"use client"

import { useState, type FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    if (typeof window !== "undefined") {
      const isAuthenticated = localStorage.getItem("timeline_authenticated")
      if (isAuthenticated === "true") {
        router.push("/timeline")
      }
    }
  }, [router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al verificar")
        return
      }

      if (data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("timeline_authenticated", "true")
        }
        router.push("/timeline")
      }
    } catch (err) {
      console.error("[v0] Fetch error:", err)
      setError("La base de datos está iniciando. Por favor, espera 1-2 minutos e intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 w-full max-w-[200px]">
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-2 text-sm text-center rounded-full border border-gray-200 focus:outline-none focus:border-rose-300 transition-colors"
        />

        {error && <p className="text-red-400 text-xs text-center max-w-[250px]">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-colors disabled:opacity-50"
        >
          {isLoading ? "..." : "Entrar"}
        </button>
      </form>
    </div>
  )
}
