import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { PwaRegister } from '@/features/pwa/ui/PwaRegister';
import { Header } from '@/widgets/header/ui/Header';
import { AuthSyncProvider, AuthModal } from '@/features/auth';

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'cyrillic-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://my-dataset.vercel.app'),
  title: {
    default: 'My dataset | Практические курсы для Senior, PPC, Affiliates & Lead Gen',
    template: '%s | My dataset',
  },
  description:
    'My dataset — платформа системного маркетинга и Growth: 4 направления (Senior Growth, Media Buying / PPC, Affiliate Management, SDR / Lead Gen), юнит-экономика, симуляторы и Google XYZ резюме.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', sizes: 'any' },
      { url: '/favicon-16x16.png?v=2', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png?v=2', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png?v=2', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192.png?v=2', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png?v=2', sizes: '512x512', type: 'image/png' },
      { url: '/icon.svg?v=2', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=2', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon-180x180.png?v=2', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon-152x152.png?v=2', sizes: '152x152', type: 'image/png' },
      { url: '/apple-touch-icon-120x120.png?v=2', sizes: '120x120', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icon-maskable.svg?v=2',
        color: '#6366f1',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'My dataset',
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
    title: 'My dataset | Практические курсы для Senior, PPC, Affiliates & Lead Gen',
    description:
      'Zero-fluff программы, интерактивные тренажеры, разборы кейсов собеседований и подготовка к работе в Tier-1 компаниях.',
    url: 'https://my-dataset.vercel.app',
    siteName: 'My dataset',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My dataset',
    description:
      '4 полноценных курса: Senior Growth, Media Buying / PPC, Affiliate Manager, SDR / Lead Gen Specialist.',
  },
};

export const viewport: Viewport = {
  themeColor: '#09090b',
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
    <html
      lang="ru"
      className={`dark ${jakartaSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased selection:bg-brand-500/30 selection:text-brand-200"
        suppressHydrationWarning
      >
        <AuthSyncProvider>
          <PwaRegister />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <AuthModal />
        </AuthSyncProvider>
      </body>
    </html>
  );
}
