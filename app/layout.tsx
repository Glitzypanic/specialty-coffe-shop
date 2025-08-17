// app/layout.tsx
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';
import HeaderClient from '@/components/common/HeaderClient';
import ThirdPartyScripts from '@/components/common/ThirdPartyScripts';
import Footer from '@/components/common/Footer';
import ClientWrapper from '@/components/layout/ClientWrapper';
import { Suspense } from 'react';

/**
 * Metadata optimizada para SEO
 */
export const metadata: Metadata = {
  title: {
    template: '%s | Coffee Shop',
    default: 'Coffee Shop - Café de Especialidad y Accesorios',
  },
  description:
    'Descubre nuestra selección de cafés de especialidad, equipos y accesorios para los amantes del café. Calidad premium y entrega rápida.',
  keywords: [
    'café',
    'coffee',
    'especialidad',
    'premium',
    'barista',
    'equipos',
    'accesorios',
  ],
  authors: [{ name: 'Coffee Shop Team' }],
  creator: 'Coffee Shop',
  publisher: 'Coffee Shop',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Coffee Shop - Café de Especialidad',
    description:
      'Descubre nuestra selección de cafés de especialidad, equipos y accesorios para los amantes del café.',
    url: '/',
    siteName: 'Coffee Shop',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Coffee Shop - Café de Especialidad',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coffee Shop - Café de Especialidad',
    description:
      'Descubre nuestra selección de cafés de especialidad, equipos y accesorios para los amantes del café.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
};

/**
 * Skeleton para el header mientras carga
 */
const HeaderSkeleton = () => (
  <div className="bg-coffee text-cream p-4 animate-pulse">
    <div className="container mx-auto flex justify-between items-center">
      <div className="h-8 w-32 bg-cream/20 rounded"></div>
      <div className="flex space-x-4">
        <div className="h-6 w-20 bg-cream/20 rounded"></div>
        <div className="h-6 w-24 bg-cream/20 rounded"></div>
        <div className="h-6 w-28 bg-cream/20 rounded"></div>
      </div>
    </div>
  </div>
);

/**
 * Layout principal de la aplicación
 * Incluye optimizaciones de performance y SEO
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <head>
        {/* Preconnect a dominios externos para mejorar performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* DNS prefetch para recursos que se cargarán más tarde */}
        <link rel="dns-prefetch" href="//api.stripe.com" />

        {/* Precarga de recursos críticos */}
        <link
          rel="preload"
          href="/fonts/inter.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />

        {/* Viewport meta tag optimizado */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/* Theme color para PWA */}
        <meta name="theme-color" content="#6F4E37" />

        {/* Apple touch icon */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        {/* Favicons */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        {/* Manifest para PWA */}
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <ClientWrapper>
          <Suspense fallback={<HeaderSkeleton />}>
            <HeaderClient />
          </Suspense>

          <main className="flex-1">{children}</main>

          <Footer />
        </ClientWrapper>

        {/* Scripts de terceros cargados en un componente client-only para evitar
      cualquier referencia a `window` durante SSR que pueda causar
      diferencias de HTML en la hidratación. */}
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
