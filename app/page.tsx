"use client"

import { useState, type FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

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
      let supabase
      try {
        supabase = createClient()
      } catch (clientError) {
        throw new Error("Error al inicializar Supabase. Verifica las variables de entorno.")
      }
      
      // Intentar obtener la contraseña de la base de datos
      const { data, error: fetchError } = await supabase
        .from("app_config")
        .select("password_hash")
        .limit(1)
        .maybeSingle()

      if (fetchError) {
        console.error("Error de Supabase:", fetchError)
        // Mensajes más específicos según el tipo de error
        if (fetchError.code === "PGRST116") {
          throw new Error("No se encontró configuración. Ejecuta el script SQL en Supabase.")
        }
        if (fetchError.message?.includes("permission denied") || fetchError.message?.includes("RLS")) {
          throw new Error("Error de permisos. Verifica las políticas RLS en Supabase.")
        }
        throw new Error(fetchError.message || "Error al conectar con la base de datos")
      }

      if (!data || !data.password_hash) {
        throw new Error("No se encontró la configuración de contraseña. Ejecuta el script SQL en Supabase.")
      }

      if (data.password_hash === password) {
        if (typeof window !== "undefined") {
          localStorage.setItem("timeline_authenticated", "true")
        }
        router.push("/timeline")
      } else {
        setError("Contraseña incorrecta")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al verificar"
      console.error("Error en login:", err)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-rose-400">Cargando...</div>
      </div>
    )
  }

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

        {error && <p className="text-red-400 text-xs">{error}</p>}

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
