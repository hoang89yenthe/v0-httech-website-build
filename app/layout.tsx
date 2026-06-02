import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({ 
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://httech.vn';

export const metadata: Metadata = {
  title: 'HT TECH - Thiết Bị Điện Công Nghiệp & Tự Động Hóa',
  description: 'HT TECH chuyên cung cấp thiết bị điện công nghiệp, biến tần, PLC, HMI, thiết bị đóng cắt từ Siemens, ABB, Mitsubishi, Schneider. Dịch vụ thiết kế tủ điện chuyên nghiệp tại Bắc Ninh.',
  keywords: ['biến tần', 'PLC', 'HMI', 'thiết bị điện công nghiệp', 'tự động hóa', 'Siemens', 'ABB', 'Mitsubishi', 'Bắc Ninh'],
  generator: 'v0.app',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'HT TECH - Thiết Bị Điện Công Nghiệp & Tự Động Hóa',
    description: 'HT TECH chuyên cung cấp thiết bị điện công nghiệp, biến tần, PLC, HMI, thiết bị đóng cắt từ Siemens, ABB, Mitsubishi, Schneider.',
    siteName: 'HT TECH',
    locale: 'vi_VN',
    type: 'website',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HT TECH - Thiết Bị Điện Công Nghiệp & Tự Động Hóa',
    description: 'HT TECH chuyên cung cấp thiết bị điện công nghiệp, biến tần, PLC, HMI từ Siemens, ABB, Mitsubishi, Schneider.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className="bg-background scroll-smooth">
      <body className={`${beVietnamPro.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
