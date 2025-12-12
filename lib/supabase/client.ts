import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Variables de entorno de Supabase no configuradas. Si estás en Vercel, configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en el dashboard de Vercel (Settings > Environment Variables)."
    )
    // Crear un cliente dummy para evitar errores en runtime
    // Esto permitirá que la app cargue pero las queries fallarán
    client = createBrowserClient("https://placeholder.supabase.co", "placeholder-key")
    return client
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey)

  return client
}
