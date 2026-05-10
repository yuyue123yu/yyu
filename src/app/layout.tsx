import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext'

// Force dynamic rendering for entire app
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Legal Consultation Malaysia | 马来西亚法律咨询',
  description: '专业的在线法律咨询平台，为马来西亚用户提供便捷的法律服务',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ms">
      <body className={inter.className}>
        <SiteSettingsProvider>
          <LanguageProvider>
            <AuthProvider>{children}</AuthProvider>
          </LanguageProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  )
}
