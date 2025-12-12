import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseAnonKey) {
    // En producción, si no hay variables, crear un cliente dummy
    // para que la página al menos cargue
    if (typeof window !== "undefined") {
      console.error(
        "Variables de entorno de Supabase no configuradas. Si estás en Vercel, configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en el dashboard de Vercel (Settings > Environment Variables)."
      )
    }
    client = createBrowserClient(
      supabaseUrl || "https://placeholder.supabase.co", 
      supabaseAnonKey || "placeholder-key"
    )
    return client
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey)

  return client
}
