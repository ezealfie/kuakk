import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ 
  subsets: ["latin"], 
  variable: "--font-geist",
  display: "swap",
  fallback: ["system-ui", "arial"]
})
const geistMono = Geist_Mono({ 
  subsets: ["latin"], 
  variable: "--font-geist-mono",
  display: "swap",
  fallback: ["monospace"]
})
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  display: "swap",
  fallback: ["serif"]
})

export const metadata: Metadata = {
  title: "Eze & Sabri",
  description: "Nuestra historia de amor",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fdf2f8",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
