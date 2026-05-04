import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'REwebPortal — Mumbai & Thane Homebuyer Protection',
    template: '%s | REwebPortal',
  },
  description:
    'RERA compliance, delivery track records, and buyer experiences for Mumbai & Thane residential projects — in one place. Protecting homebuyers through transparency.',
  keywords: ['RERA', 'Mumbai real estate', 'Thane flats', 'homebuyer', 'MahaRERA', 'builder complaint', 'delayed possession'],
  authors: [{ name: 'REwebPortal' }],
  metadataBase: new URL('https://rewebportal.in'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://rewebportal.in',
    siteName: 'REwebPortal',
    title: 'REwebPortal — Mumbai & Thane Homebuyer Protection',
    description: 'Know the truth about your Mumbai & Thane builder.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 antialiased">
        {children}
      </body>
    </html>
  )
}
