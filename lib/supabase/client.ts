import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Variables de entorno de Supabase no configuradas. Si estás en Vercel, configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en el dashboard de Vercel (Settings > Environment Variables). Si estás en local, crea un archivo .env.local con estas variables."
    )
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey)

  return client
}
