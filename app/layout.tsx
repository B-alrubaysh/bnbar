import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

// Load Inter font with Latin subset for better performance
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Ensure text is visible while font is loading
  variable: '--font-inter',
})

// Define viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#3B82F6',
}

// Define metadata for SEO and social sharing
export const metadata: Metadata = {
  title: {
    default: 'Instant Background Remover | Free Online Tool',
    template: '%s | Instant Background Remover'
  },
  description: 'Remove backgrounds from images instantly using AI. Free, fast and no signup required. Get transparent PNG images in seconds.',
  keywords: ['background remover', 'image editing', 'remove image background', 'AI background remover', 'transparent images'],
  authors: [{ name: 'Background Remover Team' }],
  creator: 'Background Remover Team',
  publisher: 'Background Remover',
  robots: {
    index: true,
    follow: true,
  },
  applicationName: 'Instant Background Remover',
  referrer: 'origin-when-cross-origin',
  alternates: {
    canonical: '/',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Open Graph / Facebook
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Instant Background Remover | Free Online Tool',
    description: 'Remove backgrounds from images instantly using AI. Free, fast and no signup required.',
    siteName: 'Instant Background Remover',
    images: [
      {
        url: '/images/og-image.svg', 
        width: 1200,
        height: 630,
        alt: 'Instant Background Remover - AI Powered',
      },
    ],
  },
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Instant Background Remover | Free Online Tool',
    description: 'Remove backgrounds from images instantly using AI. Free, fast and no signup required.',
    images: ['/images/og-image.svg'],
  },
  // Verification for search consoles (replace with actual values when available)
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        {children}
      </body>
    </html>
  )
} 