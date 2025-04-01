import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Council',
  description: 'Get advice from different AI perspectives',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900">{children}</body>
    </html>
  )
} 