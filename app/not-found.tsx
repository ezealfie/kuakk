import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-pink-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-rose-600 mb-4">404</h1>
        <p className="text-rose-400 mb-6">Página no encontrada</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

