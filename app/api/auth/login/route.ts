import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Create admin client with service role key to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[v0] Missing Supabase environment variables")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase.from("app_config").select("password_hash").single()

    if (error) {
      console.error("[v0] Database error:", error)
      // Check if it's a connection issue (521, 503, etc.)
      if (error.message?.includes("fetch") || error.code === "PGRST301") {
        return NextResponse.json(
          { error: "La base de datos está iniciando. Por favor, espera 1-2 minutos e intenta de nuevo." },
          { status: 503 },
        )
      }
      return NextResponse.json({ error: "Error al verificar credenciales" }, { status: 500 })
    }

    if (!data) {
      console.error("[v0] No config data found")
      return NextResponse.json({ error: "Configuración no encontrada" }, { status: 500 })
    }

    // Compare passwords (plain text for now - should use bcrypt in production)
    if (password === data.password_hash) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes("fetch") || errorMessage.includes("521") || errorMessage.includes("503")) {
      return NextResponse.json(
        { error: "La base de datos está iniciando. Espera 1-2 minutos e intenta nuevamente." },
        { status: 503 },
      )
    }
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 })
  }
}
