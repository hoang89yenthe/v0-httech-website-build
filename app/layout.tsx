import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { cookies } from 'next/headers'
import Script from 'next/script'
import { ThemeProvider } from '@/components/theme-provider'
import { AutoThemeProvider } from '@/components/auto-theme'
import { LanguageProvider } from '@/components/language-provider'
import { ScrollToTop } from '@/components/scroll-to-top'
import { FloatingCTA } from '@/components/floating-cta'
import { AIChatbot } from '@/components/ai-chatbot'
import { LOCALE_COOKIE, type Locale } from '@/lib/i18n'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({ 
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://httechvietnam.vn';

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": `${SITE_URL}/#organization`,
      name: "HT TECH - Kỹ Thuật Công Nghiệp",
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      telephone: "+840972916382",
      email: "httechbn@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "CL13-16 KĐT Him Lam Green Park",
        addressLocality: "Phường Võ Cường, TP. Bắc Ninh",
        addressRegion: "Bắc Ninh",
        addressCountry: "VN",
      },
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "17:30" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "08:00", closes: "12:00" },
      ],
      sameAs: [`https://zalo.me/0972916382`],
    },
  ],
};

export const metadata: Metadata = {
  title: 'HT TECH - Thiết Bị Điện Công Nghiệp & Tự Động Hóa',
  description: 'HT TECH chuyên cung cấp thiết bị điện công nghiệp, biến tần, PLC, HMI, thiết bị đóng cắt từ Siemens, ABB, Mitsubishi, Schneider. Dịch vụ thiết kế tủ điện chuyên nghiệp tại Bắc Ninh.',
  keywords: ['biến tần', 'PLC', 'HMI', 'thiết bị điện công nghiệp', 'tự động hóa', 'Siemens', 'ABB', 'Mitsubishi', 'Bắc Ninh'],
  generator: 'Next.js',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get(LOCALE_COOKIE)?.value ?? "vi") as Locale;

  return (
    <html lang={locale} className="bg-background" suppressHydrationWarning>
      <body className={`${beVietnamPro.variable} font-sans antialiased`}>
        <Script
          id="org-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="light">
          <LanguageProvider defaultLocale={locale}>
          <AutoThemeProvider>
            <ScrollToTop />
            {children}
            <FloatingCTA />
            <AIChatbot />
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </AutoThemeProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
