import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PwaRegister } from '@/features/pwa/ui/PwaRegister';
import { Header } from '@/widgets/header/ui/Header';

export const metadata: Metadata = {
  metadataBase: new URL('https://marketolog-course.vercel.app'),
  title: {
    default: 'Marketolog Academy | Практические курсы для Senior, PPC, Affiliates & Lead Gen',
    template: '%s | Marketolog Academy',
  },
  description:
    'Академия системного маркетинга и Growth: 4 направления (Senior Growth, Media Buying / PPC, Affiliate Management, SDR / Lead Gen), юнит-экономика, симуляторы и Google XYZ резюме.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  authors: [{ name: 'Senior Growth & Commercial Strategy Academy' }],
  keywords: [
    'маркетинг',
    'senior marketer',
    'head of growth',
    'media buying',
    'ppc lead',
    'affiliate manager',
    'lead generation',
    'sdr',
    'bdr',
    'юнит-экономика',
    'LTV:CAC',
    'ROAS',
    'MEDDPIC',
    'Google XYZ резюме',
  ],
  openGraph: {
    title: 'Marketolog Academy | Практические курсы для Senior, PPC, Affiliates & Lead Gen',
    description:
      'Zero-fluff программы, интерактивные тренажеры, разборы кейсов собеседований и подготовка к работе в Tier-1 компаниях.',
    url: 'https://marketolog-course.vercel.app',
    siteName: 'Marketolog Academy',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marketolog Academy',
    description:
      '4 полноценных курса: Senior Growth, Media Buying / PPC, Affiliate Manager, SDR / Lead Gen Specialist.',
  },
};

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="ru" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-brand-500/30 selection:text-brand-200">
        <PwaRegister />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
